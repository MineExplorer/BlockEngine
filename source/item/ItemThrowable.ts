class ItemThrowable extends ItemBase {
	constructor(stringID: string, name?: string, icon?: string | Item.TextureData, inCreative: boolean = true) {
		super(stringID, name, icon);
		this.item = Item.createThrowableItem(this.stringID, this.name, this.icon, {isTech: true});
		this.setCategory(ItemCategory.ITEMS);
		if (inCreative) this.addDefaultToCreative();
		Item.registerThrowableFunctionForID(this.id, (projectile: number, item: ItemInstance, target: Callback.ProjectileHitTarget) => {
			this.onProjectileHit(projectile, item, target);
		});
	}

	onProjectileHit(projectile: number, item: ItemInstance, target: Callback.ProjectileHitTarget) {}
}