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
	let armorMaterials = {};
	let toolMaterials = {};

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

	export function registerItem(itemInstance: ItemBase & ItemFuncs): ItemBase {
		items[itemInstance.id] = itemInstance;
		if ('onNameOverride' in itemInstance) {
			Item.registerNameOverrideFunction(itemInstance.id, function(item: ItemInstance, translation: string, name: string) {
				return getRarityColor(itemInstance.rarity) + itemInstance.onNameOverride(item, translation, name);
			});
		}
		if ('onIconOverride' in itemInstance) {
			Item.registerIconOverrideFunction(itemInstance.id, function(item: ItemInstance, isModUi: boolean)	{
				return itemInstance.onIconOverride(item, isModUi);
			});
		}
		if ('onItemUse' in itemInstance) {
			Item.registerUseFunction(itemInstance.id, function(coords: Callback.ItemUseCoordinates, item: ItemInstance, block: Tile, player: number) {
				itemInstance.onItemUse(coords, item, block, player);
			});
		}
		if ('onNoTargetUse' in itemInstance) {
			Item.registerNoTargetUseFunction(itemInstance.id, function(item: ItemInstance, player: number) {
				itemInstance.onNoTargetUse(item, player);
			});
		}
		if ('onUsingReleased' in itemInstance) {
			Item.registerUsingReleasedFunction(itemInstance.id, function(item: ItemInstance, ticks: number, player: number)	{
				itemInstance.onUsingReleased(item, ticks, player);
			});
		}
		if ('onUsingComplete' in itemInstance) {
			Item.registerUsingCompleteFunction(itemInstance.id, function(item: ItemInstance, player: number) {
				itemInstance.onUsingComplete(item, player);
			});
		}
		if ('onDispense' in itemInstance) {
			Item.registerDispenseFunction(itemInstance.id, function(coords: Callback.ItemUseCoordinates, item: ItemInstance, blockSource: BlockSource) {
				let region = new WorldRegion(blockSource);
				itemInstance.onDispense(coords, item, region);
			});
		}
		return itemInstance;
	}

	export function getInstanceOf(itemID: number): ItemBase {
		return items[itemID] || null;
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

	/**
	 * Registers name override function for item which adds color to item name depends on rarity
	 * @param rarity number from 1 to 3
	 */
	export function setRarity(id: string | number, rarity: number): void {
		Item.registerNameOverrideFunction(id, function(item: ItemInstance, translation: string, name: string) {
			return getRarityColor(rarity) + translation;
		});
	}

	export function getRarityColor(rarity: number): string {
		if (rarity == EnumRarity.UNCOMMON) return "§e";
		if (rarity == EnumRarity.RARE) return "§b";
		if (rarity == EnumRarity.EPIC) return "§d";
		return "";
	}
}
