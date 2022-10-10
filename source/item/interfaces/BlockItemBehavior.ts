/**
 * Common functions for blocks and items
 */
 interface BlockItemBehavior {

	onNameOverride?(item: ItemInstance, translation: string, name: string): string;
    
	onItemUse?(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number): void;
    
	onDispense?(coords: Callback.ItemUseCoordinates, item: ItemStack, region: WorldRegion): void;
}
