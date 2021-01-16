class ItemCommon
extends ItemBase {
	constructor(stringID: string, name?: string, icon?: string|Item.TextureData, inCreative: boolean = true) {
		super(stringID, name, icon);
		this.item = Item.createItem(this.stringID, this.name, this.icon, {isTech: !inCreative});
		this.setCategory(ItemCategory.ITEMS);
	}
}