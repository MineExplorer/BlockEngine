interface ItemFuncs {
	onNameOverride?(item: ItemInstance, translation: string, name: string): string
	onIconOverride?(item: ItemInstance, isModUi: boolean): Item.TextureData
	onItemUse?(coords: Callback.ItemUseCoordinates, item: ItemInstance, block: Tile, player: number): void
	onNoTargetUse?(item: ItemInstance, player: number): void
	onUsingReleased?(item: ItemInstance, ticks: number, player: number): void
	onUsingComplete?(item: ItemInstance, player: number): void
	onDispense?(coords: Callback.ItemUseCoordinates, item: ItemInstance, region: WorldRegion): void
}

class ItemBasic {
	readonly stringID: string;
	readonly id: number;
	name: string;
	icon: {name: string, meta: number};
	maxStack: number;
	maxDamage: number;
	rarity: number = 0;
	item: any;

	constructor(stringID: string, name?: string, icon?: string|Item.TextureData) {
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

	setName(name: string): void {
		this.name = name;
	}

	setIcon(texture: string, index: number = 0): void {
		this.icon = {name: texture, meta: index};
	}

	createItem(inCreative: boolean = true) {
		this.item = Item.createItem(this.stringID, this.name, this.icon, {isTech: !inCreative});
		if (this.maxStack) this.setMaxStack(this.maxStack);
		if (this.maxDamage) this.setMaxDamage(this.maxDamage);
		return this;
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
		if (this.item)
			this.item.setMaxStackSize(maxStack);
	}

	/**
     * Sets item maximum data value
     * @param maxDamage maximum data value for the item
     */
	setMaxDamage(maxDamage: number): void  {
		this.maxDamage = maxDamage;
		if (this.item)
			this.item.setMaxDamage(maxDamage);
	}

	 /**
     * Specifies how the player should hold the item
     * @param enabled if true, player holds the item as a tool, not as a simple
     * item
     */
	setHandEquipped(enabled: boolean): void {
		if (!this.item) return;
		this.item.setHandEquipped(enabled);
	}

	/**
	 * Allows item to be put in off hand
	 */
	allowInOffHand(): void {
		if (!this.item) return;
		this.item.setAllowedInOffhand(true);
	}

	/**
	 * Allows item to click on liquid blocks
	 */
	setLiquidClip(): void {
		if (!this.item) return;
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
		if (!this.item) return;
		this.item.setEnchantType(type, enchantability);
	}

	/**
     * Sets item as glint (like enchanted tools or golden apple)
     * @param enabled if true, the item will be displayed as glint item
     */
	setGlint(enabled: boolean): void {
		if (!this.item) return;
		this.item.setGlint(enabled);
	}

	/**
	 * Adds material that can be used to repair the item in the anvil
	 * @param itemID item id to be used as repair material
	 */
	addRepairItem(itemID: number): void {
		if (!this.item) return;
		this.item.addRepairItem(itemID);
	}

	setRarity(rarity: number): void {
		this.rarity = rarity;
		if (!('onNameOverride' in this)) {
			ItemRegistry.setRarity(this.id, rarity);
		}
	}
 }