class ItemStack implements ItemInstance {
	id: number;
	count: number;
	data: number;
	extra?: ItemExtraData;

	constructor();
	constructor(item: ItemInstance);
	constructor(id: number, count: number, data: number, extra?: ItemExtraData);
	constructor(item: number | ItemInstance = 0, count: number = 0, data: number = 0, extra: ItemExtraData = null) {
		if (typeof item == "object") {
			return new ItemStack(item.id, item.count, item.data, item.extra);
		} else {
			this.id = item;
			this.data = data;
			this.count = count;
			this.extra = extra;
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
