class ItemFood extends ItemBase {
	constructor(stringID: string, name?: string, icon?: string | Item.TextureData, food?: number, inCreative: boolean = true) {
		super(stringID, name, icon);
		this.item = Item.createFoodItem(this.stringID, this.name, this.icon, {food: food, isTech: true});
		this.setCategory(ItemCategory.ITEMS);
		if (inCreative) this.addDefaultToCreative();
	}

	onFoodEaten(item: ItemInstance, food: number, saturation: number, player: number): void {}
}

Callback.addCallback("FoodEaten", function(food: number, saturation: number, player: number) {
	const item = Entity.getCarriedItem(player);
	const itemInstance = ItemRegistry.getInstanceOf(item.id) as ItemFood;
	if (itemInstance && itemInstance.onFoodEaten) {
		itemInstance.onFoodEaten(item, food, saturation, player);
	}
});
