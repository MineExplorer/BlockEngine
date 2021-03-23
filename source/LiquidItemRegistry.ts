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
		let empty = LiquidRegistry.getEmptyItem(id, data);
		if (empty) {
			let itemData: any = {id: empty.id, data: empty.data, liquid: empty.liquid};
			let emptyData = EmptyByFull[id];
			if (emptyData) {
				itemData.storage = emptyData.storage;
				itemData.amount = (emptyData.storage - data) / 1000;
			} else {
				itemData.amount = 1;
			}
			return itemData;
		}
		return null;
	}

	export function getFullItem(id: number, data: number, liquid: string): FullData {
		let emptyData = EmptyByFull[id];
		if (emptyData) {
			return {id: id, data: 0, amount: data / 1000, storage: emptyData.storage / 1000}
		}
		let fullData = FullByEmpty[id+":"+liquid];
		if (fullData) {
			return {id: fullData.id, data: 0, amount: fullData.storage / 1000, storage: fullData.storage / 1000}
		}
		let full = LiquidRegistry.getFullItem(id, data, liquid);
		if (full) {
			return {id: full.id, data: full.data, amount: 1};
		}
		return null;
	}
}