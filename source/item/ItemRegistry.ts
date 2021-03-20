/// <reference path="ItemBase.ts" />
/// <reference path="ItemCommon.ts" />
/// <reference path="ItemFood.ts" />
/// <reference path="ItemThrowable.ts" />
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

	export function getInstanceOf(itemID: string | number): Nullable<ItemBase> {
		let numericID = Item.getNumericId(itemID);
		return items[numericID] || null;
	}

	/**
	 * @returns EnumRarity value for item
	 * @param itemID item's id
	 */
	export function getRarity(itemID: number): number {
		return itemsRarity[itemID] ?? EnumRarity.COMMON;
	}

	/**
	 * @returns chat color for rarity
	 * @param rarity one of EnumRarity values
	 */
	export function getRarityColor(rarity: number): string {
		if (rarity == EnumRarity.UNCOMMON) return "§e";
		if (rarity == EnumRarity.RARE) return "§b";
		if (rarity == EnumRarity.EPIC) return "§d";
		return "";
	}

	/**
	 * @returns chat color for item's rarity
	 * @param itemID item's id
	 */
	export function getItemRarityColor(itemID: number): string {
		return getRarityColor(getRarity(itemID));
	}

	export function setRarity(id: string | number, rarity: number, preventNameOverride?: boolean): void {
		let numericID = Item.getNumericId(id);
		itemsRarity[numericID] = rarity;
		//@ts-ignore
		if (!preventNameOverride && !Item.nameOverrideFunctions[numericID]) {
			Item.registerNameOverrideFunction(numericID, function(item: ItemInstance, translation: string, name: string) {
				return getItemRarityColor(item.id) + translation;
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

	export function registerItemFuncs(itemID: string | number, itemFuncs: ItemBase | ItemBehavior) {
		if ('onNameOverride' in itemFuncs) {
			Item.registerNameOverrideFunction(itemID, function(item: ItemInstance, translation: string, name: string) {
				return getItemRarityColor(item.id) + itemFuncs.onNameOverride(item, translation, name);
			});
		}
		if ('onIconOverride' in itemFuncs) {
			Item.registerIconOverrideFunction(itemID, function(item: ItemInstance, isModUi: boolean)	{
				return itemFuncs.onIconOverride(item, isModUi);
			});
		}
		if ('onItemUse' in itemFuncs) {
			Item.registerUseFunction(itemID, function(coords: Callback.ItemUseCoordinates, item: ItemInstance, block: Tile, player: number) {
				itemFuncs.onItemUse(coords, new ItemStack(item), block, player);
			});
		}
		if ('onNoTargetUse' in itemFuncs) {
			Item.registerNoTargetUseFunction(itemID, function(item: ItemInstance, player: number) {
				itemFuncs.onNoTargetUse(new ItemStack(item), player);
			});
		}
		if ('onUsingReleased' in itemFuncs) {
			Item.registerUsingReleasedFunction(itemID, function(item: ItemInstance, ticks: number, player: number)	{
				itemFuncs.onUsingReleased(new ItemStack(item), ticks, player);
			});
		}
		if ('onUsingComplete' in itemFuncs) {
			Item.registerUsingCompleteFunction(itemID, function(item: ItemInstance, player: number) {
				itemFuncs.onUsingComplete(new ItemStack(item), player);
			});
		}
		if ('onDispense' in itemFuncs) {
			Item.registerDispenseFunction(itemID, function(coords: Callback.ItemUseCoordinates, item: ItemInstance, blockSource: BlockSource) {
				let region = new WorldRegion(blockSource);
				itemFuncs.onDispense(coords, new ItemStack(item), region);
			});
		}
	}

	interface ItemDescription {
		name: string,
		icon: string|Item.TextureData,
		type?: "common" | "food" | "throwable",
		stack?: number,
		inCreative?: boolean,
		category?: number,
		maxDamage?: number,
		handEquipped?: boolean,
		allowedInOffhand?: boolean,
		glint?: boolean,
		enchant?: {type: number, value: number},
		rarity?: number,
		food?: number
	}

	export function createItem(stringID: string, params: ItemDescription): void {
		let numericID = IDRegistry.genItemID(stringID);
		let inCreative = params.inCreative ?? true;
		let icon: Item.TextureData;
		if (typeof params.icon == "string")
			icon = {name: params.icon};
		else
			icon = params.icon;

		if (params.type == "food") {
			Item.createFoodItem(stringID, params.name, icon, {food: params.food, stack: params.stack || 64, isTech: !inCreative});
		}
		else if (params.type == "throwable") {
			Item.createThrowableItem(stringID, params.name, icon, {stack: params.stack || 64, isTech: !inCreative});
		}
		else {
			Item.createItem(stringID, params.name, icon, {stack: params.stack || 64, isTech: !inCreative});
		}

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
		inCreative?: boolean
		category?: number,
		glint?: boolean,
		rarity?: number
	};

	export function createArmor(stringID: string, params: ArmorDescription): ItemArmor {
		let item = new ItemArmor(stringID, params.name, params.icon, params, params.inCreative);
		registerItem(item);
		if (params.category) item.setCategory(params.category);
		if (params.glint) item.setGlint(true);
		if (params.rarity) item.setRarity(params.rarity);
		return item;
	}

	interface ToolDescription {
		name: string,
		icon: string|Item.TextureData,
		material: string|ToolAPI.ToolMaterial,
		inCreative?: boolean,
		category?: number,
		glint?: boolean,
		rarity?: number
	};

	export function createTool(stringID: string, params: ToolDescription, toolData?: ToolParams) {
		let item = new ItemTool(stringID, params.name, params.icon, params.material, toolData, params.inCreative);
		registerItem(item);
		if (params.category) item.setCategory(params.category);
		if (params.glint) item.setGlint(true);
		if (params.rarity) item.setRarity(params.rarity);
		return item;
	}
}
