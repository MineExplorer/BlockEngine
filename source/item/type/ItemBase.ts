abstract class ItemBase {
	/**
	 * Item string id
	 */
	readonly stringID: string;
	/**
	 * Item numeric id
	 */
	readonly id: number;
	/**
	 * Item name
	 */
	name: string;
	/**
	 * Item texture data
	 */
	icon: {name: string, meta: number};
	/**
	 * Maximum stack size of the item 
	 */
	maxStack: number = 64;
	/**
	 * Maximum data value of the item
	 */
	maxDamage: number = 0;

	inCreative: boolean = false;
	/**
	 * Native class used to set item properties
	 */
	item: Item.NativeItem;

	constructor(stringID: string, name?: string, icon?: string | Item.TextureData) {
		this.stringID = stringID;
		this.id = IDRegistry.genItemID(stringID);
		this.setName(name || stringID);
		if (typeof icon == "string")
			this.setIcon(icon);
		else if (typeof icon == "object")
			this.setIcon(icon.name, icon.meta || icon.data);
		else
			this.setIcon("missing_icon");
	}

	/**
	 * Method that can be overrided to modify item name before item creation.
	 * @param name item name passed to the constructor
	 */
	protected setName(name: string): void {
		this.name = name;
	}

	/**
	 * Method that can be overrided to modify item textures before item creation.
	 * @param texture texture name
	 * @param index texture index
	 */
	protected setIcon(texture: string, index: number = 0): void {
		this.icon = {name: texture, meta: index};
	}

	/**
     * Sets item creative category
	 * @param category item category, should be integer from 1 to 4.
	 */
	setCategory(category: number): void {
		Item.setCategory(this.id, category);
	}

	/**
     * Sets item maximum stack size
     * @param maxStack maximum stack size for the item
     */
	setMaxStack(maxStack: number): void {
		this.maxStack = maxStack;
		this.item.setMaxStackSize(maxStack);
	}

	/**
     * Sets item maximum data value
     * @param maxDamage maximum data value for the item
     */
	setMaxDamage(maxDamage: number): void  {
		this.maxDamage = maxDamage;
		this.item.setMaxDamage(maxDamage);
	}

	 /**
     * Specifies how the player should hold the item
     * @param enabled if true, player holds the item as a tool, not as a simple
     * item
     */
	setHandEquipped(enabled: boolean): void {
		this.item.setHandEquipped(enabled);
	}

	/**
	 * Allows item to be put in off hand
	 */
	allowInOffHand(): void {
		this.item.setAllowedInOffhand(true);
	}

	/**
	 * Allows item to click on liquid blocks
	 */
	setLiquidClip(): void {
		this.item.setLiquidClip(true);
	}

	/**
     * Specifies how the item can be enchanted
     * @param type enchant type defining whan enchants can or cannot be 
     * applied to this item, one of the Native.EnchantType
     * @param enchantability quality of the enchants that are applied, the higher this 
     * value is, the better enchants you get with the same level
     */
	setEnchantType(type: number, enchantability: number): void {
		this.item.setEnchantType(type, enchantability);
	}

	/**
     * Sets item as glint (like enchanted tools or golden apple)
     * @param enabled if true, the item will be displayed as glint item
     */
	setGlint(enabled: boolean): void {
		this.item.setGlint(enabled);
	}

	/**
	 * Adds material that can be used to repair the item in the anvil
	 * @param itemID item id to be used as repair material
	 */
	addRepairItem(itemID: number): void {
		this.item.addRepairItem(itemID);
	}

	 /**
     * Sets properties for the item from JSON-like object. Uses vanilla mechanics.
     * @param props object containing properties
     */
	setProperties(props: object): void {
		this.item.setProperties(JSON.stringify(props));
	}

	/**
	 * Sets item rarity.
	 * @param rarity one of `EnumRarity` values
	 */
	setRarity(rarity: number): void {
		ItemRegistry.setRarity(this.id, rarity);
	}

	addDefaultToCreative(): void {
		const wasInCreative = ItemRegistry.getInstanceOf(this.id)?.inCreative;
		if (wasInCreative) {
			Logger.Log(`Skipped duplicated adding to creative for item ${this.stringID}`, "BlockEngine");
		} else {
			Item.addToCreative(this.id, 1, 0);
			this.inCreative = true;
		}
	}
 }