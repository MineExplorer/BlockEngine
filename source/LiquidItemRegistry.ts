/// <reference path="./item/interfaces/LiquidItem.ts" />

/**
 * Registry for liquid storage items. Compatible with LiquidRegistry and extends it
 * by adding items that can contain partial amounts of liquid.
 */
namespace LiquidItemRegistry {
	/**
	 * Object that represents item id and data
	 * @id item id
	 * @data item data, -1 for any data
	 */
	type ItemIdData = {id: number, data: number};

	/**
	 * Object that contains empty liquid storage item and stored liquid data.
	 * @liquid liquid type
	 * @amount liquid amount able to be extracted
	 */
	interface EmptyItem extends ItemInstance {
		liquid: string, 
		amount: number
	};

	/**
	 * Object that contains full item and free liquid capacity.
	 * @amount free liquid capacity
	 */
	interface FullItem extends ItemInstance {
		amount: number
	};

	type EmptyByFullMapping = {id: number, data: number, liquid: string, amount: number};
	type FullByEmptyMapping = {id: number, data: number, amount: number};

	export const EmptyByFull: {[key: string]: EmptyByFullMapping} = {};
	export const FullByEmpty: {[key: string]: FullByEmptyMapping} = {};

	export const LiquidItems: {[key: number]: LiquidItem} = {};

	function getEmptyByFullMapping(id: number, data: number) {
		return EmptyByFull[`${id}:${data}`] || EmptyByFull[`${id}:-1`];
	}

	function getFullByEmptyMapping(id: number, data: number, liquid: string) {
		return FullByEmpty[`${id}:${data}:${liquid}`] || FullByEmpty[`${id}:-1:${liquid}`];
	}

	/**
	 * Registers empty and full states of liquid storage item. If item liquid amount is 1000 mB,
	 * it will be also registered in Core Engine LiquidRegistry.
	 * @param liquid liquid name
	 * @param empty empty item id and data
	 * @param full id and data of item with luquid
	 * @param amount amount of stored liquid in mB
	 */
	export function registerItem(liquid: string, empty: ItemIdData, full: ItemIdData, amount: number): void;
	/** @deprecated */
	export function registerItem(liquid: string, emptyId: number, full: number, amount: number): void;
	export function registerItem(liquid: string, empty: ItemIdData | number, full: any, amount: number): void {
		if (typeof empty == "number") { // reverse compatibility
			return registerItem(liquid, {id: empty, data: 0}, {id: full, data: 0}, amount);
		}
		EmptyByFull[full.id + ':' + full.data] = {id: empty.id, data: empty.data == -1 ? 0 : empty.data, liquid: liquid, amount: amount};
		FullByEmpty[empty.id + ':' + empty.data + ':' + liquid] = {id: full.id, data: full.data == -1 ? 0 : full.data, amount: amount};
		if (amount == 1000) LiquidRegistry.registerItem(liquid, empty, full);
	}

	/**
	 * Registers item with abstract interface to work with item liquid storage
	 * @param itemId item numeric id
	 * @param interface liquid item interface object
	 */
	export function registerItemInterface(itemId: number, interface: LiquidItem): void {
		LiquidItems[itemId] = interface;
	}

	/**
	 * Returns liquid item interface for the specified item id
	 * @param itemId item numeric id
	 */
	export function getItemInterface(itemId: number): Nullable<LiquidItem> {
		return LiquidItems[itemId] || null;
	}

	/**
	 * Return liquid type stored in item
	 * @param id item id
	 * @param data item data
	 * @param extra item extra data
	 * @returns liquid type
	 */
	export function getItemLiquid(id: number, data: number, extra: ItemExtraData): string;
	/** @deprecated */
	export function getItemLiquid(id: number, data: number): string;
	export function getItemLiquid(id: number, data: number, extra?: ItemExtraData): string {
		const liquidItem = LiquidItems[id];
		if (liquidItem) {
			return liquidItem.getLiquidStored(data, extra);
		}

		const empty = getEmptyByFullMapping(id, data);
		if (empty) {
			return empty.liquid;
		}
		return LiquidRegistry.getItemLiquid(id, data);
	}

	export function canBeFilledWithLiquid(id: number, data: number, extra: ItemExtraData, liquid: string) {
		const liquidItem = LiquidItems[id];
		if (liquidItem) {
			const liquidStored = liquidItem.getLiquidStored(data, extra);
			return !liquidStored && liquidItem.isValidLiquid(liquid) || 
				liquidStored == liquid && liquidItem.getAmount(data, extra) < liquidItem.liquidStorage;
		}

		return !!getFullByEmptyMapping(id, data, liquid) || !!LiquidRegistry.getFullItem(id, data, liquid);
	}
	
	/** @deprecated */
	export function getEmptyItem(id: number, data: number): EmptyItem {
		const emptyData = getEmptyByFullMapping(id, data);
		if (emptyData) {
			return {id: emptyData.id, count: 1, data: emptyData.data, extra: null, liquid: emptyData.liquid, amount: emptyData.amount};
		}

		const externalEmpty = LiquidRegistry.getEmptyItem(id, data);
		if (externalEmpty) {
			return {id: externalEmpty.id, count: 1, data: externalEmpty.data, extra: null, liquid: externalEmpty.liquid, amount: 1000};
		}

		return null;
	}

	/** @deprecated */
	export function getFullItem(id: number, data: number, liquid: string): FullItem {
		const fullData = getFullByEmptyMapping(id, data, liquid);
		if (fullData) {
			return {id: fullData.id, count: 1, data: fullData.data, extra: null, amount: fullData.amount};
		}

		const externalFull = LiquidRegistry.getFullItem(id, data, liquid);
		if (externalFull) {
			return {id: externalFull.id, count: 1, data: externalFull.data, extra: null, amount: 1000};
		}

		return null;
	}

	function getEmptyStackInternal(id: number, data: number, extra: ItemExtraData): EmptyItem {
		const liquidItem = LiquidItems[id];
		if (liquidItem) {
			const amount = liquidItem.getAmount(data, extra);
			if (amount == 0) return null;

			const emptyItem = liquidItem.getEmptyItem();
			return {id: emptyItem.id, count: 1, data: emptyItem.data, extra: emptyItem.extra || null, liquid: liquidItem.getLiquidStored(data, extra), amount: amount};
		}
		
		return getEmptyItem(id, data);
	}

	function getFullStackInternal(id: number, data: number, extra: ItemExtraData, liquid: string): FullItem {
		const liquidItem = LiquidItems[id];
		if (liquidItem && liquidItem.isValidLiquid(liquid)) {
			const liquidStored = liquidItem.getLiquidStored(data, extra);
			if (liquidStored && liquidStored != liquid) return null;
			
			const fullItem = liquidItem.getFullItem(liquid);
			if (!fullItem) return null;

			const freeAmount = liquidItem.liquidStorage - liquidItem.getAmount(data, extra);
			if (freeAmount == 0) return null;
			
			return {id: fullItem.id, count: 1, data: fullItem.data, extra: fullItem.extra || null, amount: freeAmount};
		}

		return getFullItem(id, data, liquid);
	}

	/**
	 * Returns empty item and stored liquid data for item that contains liquid,
	 * null otherwise.
	 * @param id item id
	 * @param data item data
	 * @param extra item extra data
	 * @returns object that contains empty item and stored liquid.
	 */
	export function getEmptyStack(id: number, data: number, extra: ItemExtraData): EmptyItem;
	/**
	 * Returns empty item and stored liquid data for item that contains liquid,
	 * null otherwise.
	 * @param item item stack
	 * @returns object that contains empty item and stored liquid.
	 */
	export function getEmptyStack(item: ItemInstance): EmptyItem;
	export function getEmptyStack(id: ItemInstance | number, data?: number, extra?: ItemExtraData): EmptyItem {
		if (typeof id == "number") {
			return getEmptyStackInternal(id, data, extra);
		}
		const item = id;
		return getEmptyStackInternal(item.id, item.data, item.extra);
	}

	/**
	 * Returns full item and free liquid capacity for item that can be filled with liquid,
	 * null otherwise.
	 * @param id item id
	 * @param data item data
	 * @param extra item extra data
	 * @param liquid liquid type
	 * @returns object that contains full item and free liquid capacity
	 */
	export function getFullStack(id: number, data: number, extra: ItemExtraData, liquid: string): FullItem;
	/**
	 * Returns full item and free liquid capacity for item that can be filled with liquid,
	 * null otherwise.
	 * @param item item stack
	 * @param liquid liquid type
	 * @returns object that contains full item and free liquid capacity
	 */
	export function getFullStack(item: ItemInstance, liquid: string): FullItem;
	export function getFullStack(id: ItemInstance | number, data: string | number, extra?: ItemExtraData, liquid?: string): FullItem {
		if (typeof id == "number") {
			return getFullStackInternal(id, data as number, extra, liquid);
		}
		const item = id;
		return getFullStackInternal(item.id, item.data, item.extra, data as string);
	}

	registerItem("water", {id: VanillaItemID.glass_bottle, data: 1}, {id: VanillaItemID.potion, data: 0}, 250);
}