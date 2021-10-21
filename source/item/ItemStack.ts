class ItemStack implements ItemInstance {
	id: number;
	count: number;
	data: number;
	extra?: ItemExtraData;

	constructor();
	constructor(item: ItemInstance);
	constructor(id: number, count: number, data?: number, extra?: ItemExtraData);
	constructor(item?: number | ItemInstance, count?: number, data?: number, extra?: ItemExtraData) {
		if (typeof item == "object") {
			this.id = item.id;
			this.data = item.data;
			this.count = item.count;
			this.extra = item.extra || null;
		} else {
			this.id = item || 0;
			this.data = data || 0;
			this.count = count || 0;
			this.extra = extra || null;
		}
	}

	getItemInstance(): Nullable<ItemBase> {
		return ItemRegistry.getInstanceOf(this.id);
	}

	getMaxStack(): number {
		return Item.getMaxStack(this.id);
	}

	getMaxDamage(): number {
		return Item.getMaxDamage(this.id);
	}

	/**
	 * Decreases stack count by specified value.
	 * @param count amount to decrease
	 */
	decrease(count: number): void {
		this.count -= count;
		if (this.count <= 0) this.clear();
	}

	/**
	 * Sets all stack values to 0.
	 */
	clear(): void {
		this.id = this.data = this.count = 0;
		this.extra = null;
	}

	/**
	 * Applies damage to the item and destroys it if its max damage reached
	 * @param damage amount to apply
	 */
	applyDamage(damage: number): void {
		const unbreakingLevel = this.getEnchantLevel(Native.Enchantment.UNBREAKING);
		if (Math.random() < 1 / (unbreakingLevel + 1)) {
			this.data += damage;
		}
		if (this.data >= this.getMaxDamage()) {
			const tool = ToolAPI.getToolData(this.id);
			if (tool && tool.brokenId) {
				this.id = tool.brokenId;
				this.data = 0;
				this.extra = null;
			} else {
				this.clear();
			}
		}
	}

	/**
	 * @returns item's custom name
	 */
	getCustomName(): string {
		return this.extra?.getCustomName() || "";
	}

	 /**
	 * Sets item's custom name. Creates new ItemExtraData instance if
	 * it doesn't exist.
	 */
	setCustomName(name: string): void {
		this.extra ??= new ItemExtraData();
		this.extra.setCustomName(name);
	}

	/**
	 * @returns true if the item is enchanted, false otherwise
	 */
	isEnchanted(): boolean {
		return this.extra?.isEnchanted() || false;
	}

	/**
	 * Adds a new enchantment to the item. Creates new ItemExtraData instance if
	 * it doesn't exist.
	 * @param id enchantment id, one of the Native.Enchantment constants
	 * @param level enchantment level, generally between 1 and 5
	 */
	addEnchant(id: number, level: number): void {
		this.extra ??= new ItemExtraData();
		this.extra.addEnchant(id, level);
	}

	/**
	 * Removes enchantments by its id
	 * @param id enchantment id, one of the Native.Enchantment constants
	 */
	removeEnchant(id: number): void {
		this.extra?.removeEnchant(id);
	}

	/**
	 * Removes all the enchantments of the item
	 */
	removeAllEnchants(): void {
		this.extra?.removeAllEnchants();
	}

	/**
	 * @param id enchantment id, one of the Native.Enchantment constants
	 * @returns level of the specified enchantment
	 */
	getEnchantLevel(id: number): number {
		return this.extra?.getEnchantLevel(id) || 0;
	}

	/**
	 * @returns all the enchantments of the item in the readable format
	 */
	getEnchants(): {[key: number]: number} {
		return this.extra?.getEnchants() || null;
	}
}
