class ItemStack implements ItemInstance {
	id: number;
	count: number;
	data: number;
	extra?: ItemExtraData;

	constructor();
	constructor(item: ItemInstance);
	constructor(id: number, count: number, data: number, extra?: ItemExtraData);
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

	decrease(count: number): void {
		this.count -= count;
		if (this.count <= 0) this.clear();
	}

	clear(): void {
		this.id = this.data = this.count = 0;
		this.extra = null;
	}

	applyDamage(damage: number): void {
		let enchant = ToolAPI.getEnchantExtraData(this.extra);
		if (Math.random() < 1 / (enchant.unbreaking + 1)) {
			this.data += damage;
		}
		if (this.data >= this.getMaxDamage()) {
			let tool = ToolAPI.getToolData(this.id);
			this.id = tool ? tool.brokenId : 0;
			this.count = 1;
			this.data = 0;
		}
	}
}
