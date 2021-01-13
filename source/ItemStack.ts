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

	getMaxStack() {
		return Item.getMaxStack(this.id);
	}

	getMaxDamage() {
		Item.getMaxDamage(this.id);
	}

	isEmpty(): boolean {
		return this.id == 0 && this.count == 0 && this.data == 0 && this.extra == null;
	}

	decrease(count: number) {
		this.count -= count;
		if (this.count <= 0) this.clear();
	}

	clear() {
		this.id = this.data = this.count = 0;
		this.extra = null;
	}
}
