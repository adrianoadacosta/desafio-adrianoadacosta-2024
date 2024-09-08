/** @format */

class RecintosZoo {
	constructor() {
		this.recintos = [
			{
				numero: 1,
				bioma: 'savana',
				tamanhoTotal: 10,
				animaisExistentes: { MACACO: 3 },
			},
			{ numero: 2, bioma: 'floresta', tamanhoTotal: 5, animaisExistentes: {} },
			{
				numero: 3,
				bioma: 'savana e rio',
				tamanhoTotal: 7,
				animaisExistentes: { GAZELA: 1 },
			},
			{ numero: 4, bioma: 'rio', tamanhoTotal: 8, animaisExistentes: {} },
			{
				numero: 5,
				bioma: 'savana',
				tamanhoTotal: 9,
				animaisExistentes: { LEAO: 1 },
			},
		];

		this.animais = {
			LEAO: { tamanho: 3, bioma: ['savana'], carnivoro: true },
			LEOPARDO: { tamanho: 2, bioma: ['savana'], carnivoro: true },
			CROCODILO: { tamanho: 3, bioma: ['rio'], carnivoro: true },
			MACACO: { tamanho: 1, bioma: ['savana', 'floresta'], carnivoro: false },
			GAZELA: { tamanho: 2, bioma: ['savana'], carnivoro: false },
			HIPOPOTAMO: { tamanho: 4, bioma: ['savana', 'rio'], carnivoro: false },
		};
	}

	analisaRecintos(especie, quantidade) {
		// Validação inicial
		if (!this.animais[especie]) {
			return { erro: 'Animal inválido' };
		}
		if (quantidade <= 0 || !Number.isInteger(quantidade)) {
			return { erro: 'Quantidade inválida' };
		}

		const recintosViaveis = this.recintos
			.filter((recinto) => this.recintoViavel(recinto, especie, quantidade))
			.map((recinto) => {
				const espacoLivre = this.calculaEspacoLivre(
					recinto,
					especie,
					quantidade
				);
				return `Recinto ${recinto.numero} (espaço livre: ${espacoLivre} total: ${recinto.tamanhoTotal})`;
			})
			.sort((a, b) => parseInt(a.split(' ')[1]) - parseInt(b.split(' ')[1]));

		if (recintosViaveis.length === 0) {
			return { erro: 'Não há recinto viável' };
		}

		return { recintosViaveis };
	}

	recintoViavel(recinto, especie, quantidade) {
		const animal = this.animais[especie];
		const espacoNecessario = animal.tamanho * quantidade;
		const espacoOcupado = this.calculaEspacoOcupado(recinto);
		const espacoLivre = recinto.tamanhoTotal - espacoOcupado;

		// Verifica se há espaço suficiente
		if (espacoLivre < espacoNecessario) return false;

		// Verifica se o bioma é adequado
		if (!animal.bioma.some((b) => recinto.bioma.includes(b))) return false;

		// Regras específicas
		if (animal.carnivoro && Object.keys(recinto.animaisExistentes).length > 0)
			return false;
		// verificação para Hipopótamo
		if (especie === 'HIPOPOTAMO' && !this.recintoHipopotamoViavel(recinto))
			return false;
		// Verificação específica para o Macaco
		if (especie === 'MACACO' && this.isMacacoSolitario(recinto, quantidade))
			return false;

		// Verifica se os animais existentes continuarão confortáveis
		for (const [especieExistente, quantidade] of Object.entries(
			recinto.animaisExistentes
		)) {
			if (
				this.animais[especieExistente].carnivoro &&
				especie !== especieExistente
			)
				return false;
		}

		return true;
	}

	recintoHipopotamoViavel(recinto) {
		// O hipopótamo só tolera outras espécies se o bioma for "savana e rio"
		return recinto.bioma.includes('savana e rio');
	}

	isMacacoSolitario(recinto, quantidade) {
		// Um macaco não pode ficar sozinho em um recinto vazio
		return (
			Object.keys(recinto.animaisExistentes).length === 0 && quantidade === 1
		);
	}

	calculaEspacoOcupado(recinto) {
		let espacoOcupado = 0;
		for (const [especie, quantidade] of Object.entries(
			recinto.animaisExistentes
		)) {
			espacoOcupado += this.animais[especie].tamanho * quantidade;
		}
		if (Object.keys(recinto.animaisExistentes).length > 1) {
			espacoOcupado += 1; // Espaço extra para múltiplas espécies
		}
		return espacoOcupado;
	}

	calculaEspacoExtra(recinto, novaEspecie) {
		// Adiciona espaço extra apenas se estiver adicionando uma nova espécie
		return Object.keys(recinto.animaisExistentes).length > 0 &&
			!recinto.animaisExistentes[novaEspecie]
			? 1
			: 0;
	}

	calculaEspacoLivre(recinto, novaEspecie, novaQuantidade) {
		const espacoOcupado = this.calculaEspacoOcupado(recinto);
		const novoEspacoOcupado =
			this.animais[novaEspecie].tamanho * novaQuantidade;

		// Usa a função calculaEspacoExtra para obter o espaço extra, caso seja necessário
		const espacoExtra = this.calculaEspacoExtra(recinto, novaEspecie);

		return (
			recinto.tamanhoTotal - espacoOcupado - novoEspacoOcupado - espacoExtra
		);
	}
}

export { RecintosZoo as RecintosZoo };
