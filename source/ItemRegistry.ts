/// <reference path="BlockBase.ts" />
/// <reference path="ItemBase.ts" />
/// <reference path="ItemCommon.ts" />
/// <reference path="ItemArmor.ts" />
/// <reference path="ItemTool.ts" />

enum ItemCategory {
	BUILDING = 1,
	NATURE = 2,
	EQUIPMENT = 3,
	ITEMS = 4
}

enum EnumRarity {
	COMMON,
	UNCOMMON,
	RARE,
	EPIC
}

namespace ItemRegistry {
	let items = {};
	let itemsRarity = {};
	let armorMaterials = {};
	let toolMaterials = {};

	export function getInstanceOf(itemID: number): ItemBase {
		return items[itemID] || null;
	}

	export function getRarity(id: number): number {
		return itemsRarity[id] ?? EnumRarity.COMMON;
	}

	export function getRarityColor(rarity: number): string {
		if (rarity == EnumRarity.UNCOMMON) return "§e";
		if (rarity == EnumRarity.RARE) return "§b";
		if (rarity == EnumRarity.EPIC) return "§d";
		return "";
	}

	export function setRarity(id: number, rarity: number): void {
		itemsRarity[id] = rarity;
		let itemInstance = getInstanceOf(id);
		if (!itemInstance || !('onNameOverride' in itemInstance)) {
			Item.registerNameOverrideFunction(id, function(item: ItemInstance, translation: string, name: string) {
				return getRarityColor(rarity) + translation;
			});
		}
	}

	export function addArmorMaterial(name: string, material: ArmorMaterial): void {
		armorMaterials[name] = material;
	}

	export function getArmorMaterial(name: string): ArmorMaterial {
		return armorMaterials[name];
	}

	export function addToolMaterial(name: string, material: ToolMaterial): void {
		toolMaterials[name] = material;
	}

	export function getToolMaterial(name: string): ToolMaterial {
		return toolMaterials[name];
	}

	export function registerItem(itemInstance: ItemBase): ItemBase {
		items[itemInstance.id] = itemInstance;
		registerItemFuncs(itemInstance.id, itemInstance);
		return itemInstance;
	}

	export function registerItemFuncs(itemID: number, itemFuncs: ItemBase | ItemFuncs) {
		if ('onNameOverride' in itemFuncs) {
			Item.registerNameOverrideFunction(itemID, function(item: ItemInstance, translation: string, name: string) {
				let rarity = getRarity(item.id);
				return getRarityColor(rarity) + itemFuncs.onNameOverride(item, translation, name);
			});
		}
		if ('onIconOverride' in itemFuncs) {
			Item.registerIconOverrideFunction(itemID, function(item: ItemInstance, isModUi: boolean)	{
				return itemFuncs.onIconOverride(item, isModUi);
			});
		}
		if ('onItemUse' in itemFuncs) {
			Item.registerUseFunction(itemID, function(coords: Callback.ItemUseCoordinates, item: ItemInstance, block: Tile, player: number) {
				itemFuncs.onItemUse(coords, item, block, player);
			});
		}
		if ('onNoTargetUse' in itemFuncs) {
			Item.registerNoTargetUseFunction(itemID, function(item: ItemInstance, player: number) {
				itemFuncs.onNoTargetUse(item, player);
			});
		}
		if ('onUsingReleased' in itemFuncs) {
			Item.registerUsingReleasedFunction(itemID, function(item: ItemInstance, ticks: number, player: number)	{
				itemFuncs.onUsingReleased(item, ticks, player);
			});
		}
		if ('onUsingComplete' in itemFuncs) {
			Item.registerUsingCompleteFunction(itemID, function(item: ItemInstance, player: number) {
				itemFuncs.onUsingComplete(item, player);
			});
		}
		if ('onDispense' in itemFuncs) {
			Item.registerDispenseFunction(itemID, function(coords: Callback.ItemUseCoordinates, item: ItemInstance, blockSource: BlockSource) {
				let region = new WorldRegion(blockSource);
				itemFuncs.onDispense(coords, item, region);
			});
		}
	}

	type ItemDescription = {
		name: string,
		icon: string|Item.TextureData,
		stack?: number,
		addToCreative?: boolean,
		category?: number,
		maxDamage?: number,
		handEquipped?: boolean,
		allowedInOffhand?: boolean,
		glint?: boolean,
		enchant?: {type: number, value: number},
		rarity?: number
	}

	export function createItem(stringID: string, params: ItemDescription): void {
		let numericID = IDRegistry.genItemID(stringID);
		let icon: Item.TextureData;
		if (typeof params.icon == "string")
			icon = {name: params.icon};
		else
			icon = params.icon;

		Item.createItem(stringID, params.name, icon, {stack: params.stack || 64, isTech: params.addToCreative ?? false});
		Item.setCategory(numericID, params.category || ItemCategory.ITEMS);
		if (params.maxDamage) Item.setMaxDamage(numericID, params.maxDamage);
		if (params.handEquipped) Item.setToolRender(numericID, true);
		if (params.allowedInOffhand) Item.setAllowedInOffhand(numericID, true);
		if (params.glint) Item.setGlint(numericID, true);
		if (params.enchant) Item.setEnchantType(numericID, params.enchant.type, params.enchant.value);
		if (params.rarity) setRarity(numericID, params.rarity);
	}

	interface ArmorDescription extends ArmorParams {
		name: string,
		icon: string|Item.TextureData,
		texture: string,
		category?: number,
		glint?: boolean,
		rarity?: number
	};

	export function createArmor(stringID: string, params: ArmorDescription): ItemArmor {
		let item = new ItemArmor(stringID, params.name, params.icon, params);
		registerItem(item);
		item.setCategory(params.category || ItemCategory.EQUIPMENT);
		if (params.material) item.setMaterial(params.material);
		if (params.glint) item.setGlint(true);
		if (params.rarity) item.setRarity(params.rarity);
		return item;
	}

	type ToolDescription = {
		name: string,
		icon: string|Item.TextureData,
		material: string,
		addToCreative?: boolean,
		category?: number,
		glint?: boolean,
		rarity?: number
	};

	export function createTool(stringID: string, params: ToolDescription, toolData?: ToolParams) {
		let item = new ItemTool(stringID, params.name, params.icon, params.material, toolData, params.addToCreative);
		registerItem(item);
		item.setCategory(params.category || ItemCategory.EQUIPMENT);
		if (params.glint) item.setGlint(true);
		if (params.rarity) item.setRarity(params.rarity);
		return item;
	}
}
