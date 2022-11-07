// By NikolaySavenko (https://github.com/NikolaySavenko)
/**
 * Module to convert item ids depending on the game version.
 */
namespace IDConverter {
	type IDDataPair = {
		id: number;
		data: number;
	}

	const oldIDPairs: {[key: string]: IDDataPair} = {};

	/**
	 * Registers old id and data for new string id.
	 */
	export function registerOld(stringId: string, oldId: number, oldData: number): void {
		oldIDPairs[stringId] = { id: oldId, data: oldData };
	}

	/**
	 * Creates ItemStack instance by string id.
	 * @param stringId new item string id
	 * @param count item count
	 * @param data item data
	 * @param extra item extra data
	 * @returns ItemStack instance
	 */
	export function getStack(stringId: string, count: number = 1, data: number = 0, extra: ItemExtraData = null): ItemStack {
		if (BlockEngine.getMainGameVersion() == 11) {
			const oldPair = oldIDPairs[stringId];
			if (oldPair) {
				return new ItemStack(oldPair.id, count, oldPair.data, extra);
			}
		}
		return new ItemStack(getNumericId(stringId), count, data, extra);
	}

	/**
	 * @param stringId new item string id
	 * @returns converted id data pair
	 */
	export function getIDData(stringId: string): IDDataPair {
		if (BlockEngine.getMainGameVersion() == 11 && oldIDPairs.hasOwnProperty(stringId)) {
			return oldIDPairs[stringId];
		}
		return { id: getNumericId(stringId), data: 0 }
	}

	/**
	 * @param stringId new item string id
	 * @returns converted numeric id
	 */
	export function getID(stringId: string): number {
		if (BlockEngine.getMainGameVersion() == 11 && oldIDPairs.hasOwnProperty(stringId)) {
			return oldIDPairs[stringId].id;
		}
		return getNumericId(stringId);
	}

	/**
	 * @param stringId new item string id
	 * @returns converted data
	 */
	export function getData(stringId: string): number {
		if (BlockEngine.getMainGameVersion() == 11 && oldIDPairs.hasOwnProperty(stringId)) {
			return oldIDPairs[stringId].data;
		}
		return 0;
	}

	function getNumericId(stringId: string) {
		return VanillaItemID[stringId] || VanillaBlockID[stringId];
	}
}
