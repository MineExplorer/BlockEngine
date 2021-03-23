/**
 * Registry for liquid storage items. Compatible with LiquidRegistry.
 */
namespace LiquidItemRegistry {
	/**
	 * @amount liquid amount able to extract
	 */
	type EmptyData = {id: number, data: number, liquid: string, amount: number, storage?: number};
	/**
	 * @amount free liquid amount
	 */
	type FullData = {id: number, data: number, amount: number, storage?: number};

	export let EmptyByFull = {};
	export let FullByEmpty = {};

	/**
	 * Registers liquid storage item
	 * @param liquid liquid name
	 * @param emptyId empty item id
	 * @param fullId id of item with luquid
	 * @param storage capacity of liquid in mB
	 */
	export function registerItem(liquid: string, emptyId: number, fullId: number, storage: number) {
		EmptyByFull[fullId] = {id: emptyId, liquid: liquid, storage: storage};
		FullByEmpty[emptyId+":"+liquid] = {id: fullId, storage: storage};
		Item.setMaxDamage(fullId, storage);
		if (storage == 1000) LiquidRegistry.registerItem(liquid, {id: emptyId, data: 0}, {id: fullId, data: 0});
	}

	export function getItemLiquid(id: number, data: number): string {
		let empty = EmptyByFull[id];
		if (empty) {
			return empty.liquid;
		}
		return LiquidRegistry.getItemLiquid(id, data);
	}

	export function getEmptyItem(id: number, data: number): EmptyData {
		let emptyData = EmptyByFull[id];
		if (emptyData) {
			let amount = emptyData.storage - data;
			return {id: emptyData.id, data: 0, liquid: emptyData.liquid, amount: amount, storage: emptyData.storage};
		}

		let empty = LiquidRegistry.getEmptyItem(id, data);
		if (empty) {
			return {id: empty.id, data: empty.data, liquid: empty.liquid, amount: 1000};
		}
		return null;
	}

	export function getFullItem(id: number, data: number, liquid: string): FullData {
		let emptyData = EmptyByFull[id];
		if (emptyData) {
			return {id: id, data: 0, amount: data, storage: emptyData.storage}
		}

		let fullData = FullByEmpty[id+":"+liquid];
		if (fullData) {
			return {id: fullData.id, data: 0, amount: fullData.storage, storage: fullData.storage}
		}

		let full = LiquidRegistry.getFullItem(id, data, liquid);
		if (full) {
			return {id: full.id, data: full.data, amount: 1000};
		}
		return null;
	}
}