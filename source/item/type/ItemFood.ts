type FoodParams = {
	food?: number,
	useDuration?: number,
	saturation?: "poor" | "low" | "normal" | "good" | "max" | "supernatural",
	canAlwaysEat?: boolean,
	isMeat?: boolean,
	usingConvertsTo?: string,
	effects?: {name: string, duration: number, amplifier: number, chance: number}[]
}

class ItemFood extends ItemCommon {
	constructor(stringID: string, name: string, icon: string | Item.TextureData, params: FoodParams, inCreative: boolean = true) {
		super(stringID, name, icon);
		const foodProperties = {
			nutrition: params.food || 0,
			saturation_modifier: params.saturation || "normal",
			is_meat: params.isMeat || false,
			can_always_eat: params.canAlwaysEat || false,
			effects: params.effects || []
		}
		if (params.usingConvertsTo) {
			foodProperties["using_converts_to"] = params.usingConvertsTo
		}
		params.useDuration ??= 32;

		if (BlockEngine.getMainGameVersion() == 11) {
			this.setProperties({
				use_duration: params.useDuration,
				food: foodProperties
			});
		} else {
			this.setProperties({
				components: {
					"minecraft:use_duration": params.useDuration,
					"minecraft:food": foodProperties
				}
			});
		}

    	this.item.setUseAnimation(1);
    	this.item.setMaxUseDuration(params.useDuration);
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
