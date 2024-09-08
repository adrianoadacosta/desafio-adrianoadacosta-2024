/** @format */

import { RecintosZoo } from './recintos-zoo.js';

describe('Recintos do Zoologico', () => {
	test('Deve rejeitar animal inválido', () => {
		const resultado = new RecintosZoo().analisaRecintos('UNICORNIO', 1);
		expect(resultado.erro).toBe('Animal inválido');
		expect(resultado.recintosViaveis).toBeFalsy();
	});

	test('Deve rejeitar quantidade inválida', () => {
		const resultado = new RecintosZoo().analisaRecintos('MACACO', 0);
		expect(resultado.erro).toBe('Quantidade inválida');
		expect(resultado.recintosViaveis).toBeFalsy();
	});

	test('Não deve encontrar recintos para 10 macacos', () => {
		const resultado = new RecintosZoo().analisaRecintos('MACACO', 10);
		expect(resultado.erro).toBe('Não há recinto viável');
		expect(resultado.recintosViaveis).toBeFalsy();
	});

	test('Deve encontrar recinto para 1 crocodilo', () => {
		const resultado = new RecintosZoo().analisaRecintos('CROCODILO', 1);
		expect(resultado.erro).toBeFalsy();
		expect(resultado.recintosViaveis[0]).toBe(
			'Recinto 4 (espaço livre: 5 total: 8)'
		);
		expect(resultado.recintosViaveis.length).toBe(1);
	});

	test('Deve encontrar recintos para 2 macacos', () => {
		const resultado = new RecintosZoo().analisaRecintos('MACACO', 2);
		expect(resultado.erro).toBeFalsy();
		expect(resultado.recintosViaveis[0]).toBe(
			'Recinto 1 (espaço livre: 5 total: 10)'
		);
		expect(resultado.recintosViaveis[1]).toBe(
			'Recinto 2 (espaço livre: 3 total: 5)'
		);
		expect(resultado.recintosViaveis[2]).toBe(
			'Recinto 3 (espaço livre: 2 total: 7)'
		);
		expect(resultado.recintosViaveis.length).toBe(3);
	});

	test('Deve retornar verdadeiro para recinto com bioma "savana e rio"', () => {
		const zoo = new RecintosZoo();
		const recinto = {
			numero: 6,
			bioma: 'savana e rio',
			tamanhoTotal: 10,
			animaisExistentes: {},
		};
		expect(zoo.recintoHipopotamoViavel(recinto)).toBe(true);
	});

	test('Não deve retornar verdadeiro para recinto com bioma "savana"', () => {
		const zoo = new RecintosZoo();
		const recinto = {
			numero: 7,
			bioma: 'savana',
			tamanhoTotal: 10,
			animaisExistentes: {},
		};
		expect(zoo.recintoHipopotamoViavel(recinto)).toBe(false);
	});

	test('Não deve retornar verdadeiro para recinto com bioma "rio"', () => {
		const zoo = new RecintosZoo();
		const recinto = {
			numero: 8,
			bioma: 'rio',
			tamanhoTotal: 10,
			animaisExistentes: {},
		};
		expect(zoo.recintoHipopotamoViavel(recinto)).toBe(false);
	});

	test('Não deve retornar verdadeiro para recinto com bioma "floresta"', () => {
		const zoo = new RecintosZoo();
		const recinto = {
			numero: 9,
			bioma: 'floresta',
			tamanhoTotal: 10,
			animaisExistentes: {},
		};
		expect(zoo.recintoHipopotamoViavel(recinto)).toBe(false);
	});

	test('Deve calcular corretamente o espaço ocupado com uma espécie', () => {
		const zoo = new RecintosZoo();
		const recinto = {
			numero: 10,
			bioma: 'savana',
			tamanhoTotal: 10,
			animaisExistentes: { LEAO: 1 },
		};
		// Espaço ocupado pelo leão é 3
		expect(zoo.calculaEspacoOcupado(recinto)).toBe(3);
	});

	test('Deve calcular corretamente o espaço ocupado com múltiplas espécies', () => {
		const zoo = new RecintosZoo();
		const recinto = {
			numero: 11,
			bioma: 'savana',
			tamanhoTotal: 10,
			animaisExistentes: { LEAO: 1, MACACO: 2 },
		};
		// Espaço ocupado pelo leão é 3
		// Espaço ocupado pelos macacos é 2
		// Espaço extra devido a múltiplas espécies é 1
		expect(zoo.calculaEspacoOcupado(recinto)).toBe(3 + 2 + 1);
	});
});
