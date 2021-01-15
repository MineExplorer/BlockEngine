/// <reference path="ItemBase.ts" />

class ItemCommon
extends ItemBase {
	constructor(stringID: string, name?: string, icon?: string|Item.TextureData, addToCreative: boolean = true) {
		super(stringID, name, icon);
		this.item = Item.createItem(this.stringID, this.name, this.icon, {isTech: !addToCreative});
		this.setCategory(ItemCategory.ITEMS);
	}
}