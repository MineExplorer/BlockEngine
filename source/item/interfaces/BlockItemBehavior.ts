/**
 * Common functions for blocks and items
 */
 interface BlockItemBehavior {
	/**
      * Method to get displayed item name.
      * @param item item stack information
      * @param translation translated item name
      * @param name original item name
      * @returns new name that will be displayed
      */
	onNameOverride?(item: ItemInstance, translation: string, name: string): string;

     /**
      * Method called when player clicks on block with the item.
      * @param coords object of touch coordinates with side information and relative coordinates set.
      * @param item item that was in the player's hand when he touched the block
      * @param block block that was touched
      * @param player player entity uID
      */
	onItemUse?(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number): void;
    
	/**
      * Method called when the item was dispensed.
      * @param coords full coords object, where the main coords are the position of the dispenser block,
      * `relative` ones are the position of the block to which the dispenser is pointed,
      * and `vec` are the coords for the item to be dropped at
      * @param item item that was dispensed
      * @param region BlockSource object
      * @param slot numeric id of the slot from which the item was dispensed
      */
	onDispense?(coords: Callback.ItemUseCoordinates, item: ItemStack, region: WorldRegion, slot: number): void;
}
