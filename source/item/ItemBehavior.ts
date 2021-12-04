/**
 * Functions which can be used both for blocks and items
 */
interface BlockItemBehavior {
	onNameOverride?(item: ItemInstance, translation: string, name: string): string;
	onItemUse?(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number): void;
	onDispense?(coords: Callback.ItemUseCoordinates, item: ItemStack, region: WorldRegion): void;
}

/**
 * Item functions
 */
interface ItemBehavior extends BlockItemBehavior {
	onIconOverride?(item: ItemInstance, isModUi: boolean): Item.TextureData;
	onNoTargetUse?(item: ItemStack, player: number): void;
	onUsingReleased?(item: ItemStack, ticks: number, player: number): void;
	onUsingComplete?(item: ItemStack, player: number): void;
}