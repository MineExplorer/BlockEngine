/// <reference path="ItemBase.ts" />
/// <reference path="ItemCommon.ts" />
/// <reference path="ItemFood.ts" />
/// <reference path="ItemThrowable.ts" />
/// <reference path="ItemArmor.ts" />
/// <reference path="ItemTool.ts" />

namespace ItemRegistry {
	const items = {};
	const itemsRarity = {};
	const armorMaterials = {};

	/**
	 * @returns item type ("block" or "item")
	 */
	export function getType(id: number): string {
		return IDRegistry.getIdInfo(id).split(":")[0];
	}

	export function isBlock(id: number): boolean {
		return getType(id) == "block";
	}

	export function isItem(id: number): boolean {
		return getType(id) == "item";
	}

	/**
	 * @returns whether item is an item from the original game
	 */
	export function isVanilla(id: number): boolean {
		return !IDRegistry.getNameByID(id);
	}

	/**
	 * @returns item string id in the game, it differs for custom items
	 */
	export function getVanillaStringID(id: number): string {
		return IDRegistry.getIdInfo(id).split(":")[1].split("#")[0];
	}

	/**
	 * @returns instance of item class if it exists
	 */
	export function getInstanceOf(itemID: string | number): Nullable<ItemBase> {
		const numericID = Item.getNumericId(itemID);
		return items[numericID] || null;
	}

	/**
	 * @returns EnumRarity value for item
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
	 */
	export function getItemRarityColor(itemID: number): string {
		return getRarityColor(getRarity(itemID));
	}

	/**
	 * @param id item id
	 * @param rarity one of EnumRarity values
	 * @param preventNameOverride prevent registration of name override function
	 */
	export function setRarity(id: string | number, rarity: number, preventNameOverride?: boolean): void {
		const numericID = Item.getNumericId(id);
		itemsRarity[numericID] = rarity;
		//@ts-ignore
		if (!preventNameOverride && !Item.nameOverrideFunctions[numericID]) {
			Item.registerNameOverrideFunction(numericID, function(item: ItemInstance, translation: string, name: string) {
				return getItemRarityColor(item.id) + translation;
			});
		}
	}

	/**
	 * Creates new armor material with specified parameters
	 * @param name new (or existing) material name
	 * @param material material properties
	 */
	export function addArmorMaterial(name: string, material: ArmorMaterial): void {
		armorMaterials[name] = material;
	}

	/**
	 * @returns armor material by name
	 */
	export function getArmorMaterial(name: string): ArmorMaterial {
		return armorMaterials[name];
	}

	/**
     * Registers new tool material in ToolAPI. Some of the tool
     * materials are already registered:
     * *wood*, *stone*, *iron*, *golden* and *diamond*
     * @param name new (or existing) material name
     * @param material material properties
     */
	export function addToolMaterial(name: string, material: ToolMaterial): void {
		ToolAPI.addToolMaterial(name, material);
	}

	/**
	 * @returns tool material by name registered in ToolAPI
	 */
	export function getToolMaterial(name: string): ToolMaterial {
		//@ts-ignore
		return ToolAPI.toolMaterials[name];
	}

	/**
	 * Registers item instance and it's functions.
	 * @param itemInstance item class instance
	 * @returns item instance back
	 */
	export function registerItem(itemInstance: ItemBase): ItemBase {
		items[itemInstance.id] = itemInstance;
		registerItemFuncs(itemInstance.id, itemInstance);
		return itemInstance;
	}

	/**
	 * Registers all item functions from given object.
	 * @param itemFuncs object which implements ItemBehavior interface
	 */
	export function registerItemFuncs(itemID: string | number, itemFuncs: ItemBase | ItemBehavior): void {
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
				const region = new WorldRegion(blockSource);
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

	/**
	 * Creates item from given description. Automatically generates item id
	 * from given string id.
	 * @param stringID item string id.
	 * @param params item description
	 * @returns item class instance
	 */
	export function createItem(stringID: string, params: ItemDescription): ItemBase {
		let item: ItemBase;
		if (params.type == "food") {
			item = new ItemFood(stringID, params.name, params.icon, params.food, params.inCreative);
		}
		else if (params.type == "throwable") {
			item = new ItemThrowable(stringID, params.name, params.icon, params.inCreative);
		}
		else {
			item = new ItemCommon(stringID, params.name, params.icon, params.inCreative);
		}

		item.setCategory(params.category || ItemCategory.ITEMS);
		if (params.stack) item.setMaxStack(params.stack);
		if (params.maxDamage) item.setMaxDamage(params.maxDamage);
		if (params.handEquipped) item.setHandEquipped(true);
		if (params.allowedInOffhand) item.allowInOffHand();
		if (params.glint) item.setGlint(true);
		if (params.enchant) item.setEnchantType(params.enchant.type, params.enchant.value);
		if (params.rarity) item.setRarity(params.rarity);
		items[item.id] = item;
		return item;
	}

	interface ArmorDescription extends ArmorParams {
		name: string,
		icon: string | Item.TextureData,
		inCreative?: boolean
		category?: number,
		glint?: boolean,
		rarity?: number
	};

	/**
	 * Creates armor item from given description. Automatically generates item id
	 * from given string id.
	 * @param stringID item string id
	 * @param params item and armor parameters
	 * @returns item class instance
	 */
	export function createArmor(stringID: string, params: ArmorDescription): ItemArmor {
		const item = new ItemArmor(stringID, params.name, params.icon, params, params.inCreative);
		registerItem(item);
		if (params.category) item.setCategory(params.category);
		if (params.glint) item.setGlint(true);
		if (params.rarity) item.setRarity(params.rarity);
		return item;
	}

	interface ToolDescription {
		name: string,
		icon: string | Item.TextureData,
		material: string | ToolAPI.ToolMaterial,
		inCreative?: boolean,
		category?: number,
		glint?: boolean,
		rarity?: number
	};

	/**
	 * Creates tool item and registers it in ToolAPI. Automatically generates item id
	 * from given string id.
	 * @param stringID item string id
	 * @param params object with item parameters and tool material
	 * @param toolData tool parameters and functions
	 * @returns item class instance
	 */
	export function createTool(stringID: string, params: ToolDescription, toolData?: ToolParams): ItemTool {
		const item = new ItemTool(stringID, params.name, params.icon, params.material, toolData, params.inCreative);
		registerItem(item);
		if (params.category) item.setCategory(params.category);
		if (params.glint) item.setGlint(true);
		if (params.rarity) item.setRarity(params.rarity);
		return item;
	}
}
