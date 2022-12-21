/// <reference path="./BlockItemBehavior.ts" />

/**
 * Item functions
 */
interface ItemBehavior extends BlockItemBehavior {
	/**
	 * Method to override texture for the item icon.
	 * @param item item stack information.
     * @param isModUi whether icon override is working in mod ui or in vanilla one
	 * @returns texture data which will be used for the item icon.
	 */
	onIconOverride?(item: ItemInstance, isModUi: boolean): Item.TextureData;

	/**
	 * Method called when player uses item in the air.
     * @param item item that was in the player's hand when the event occurred
     * @param player entity uid of the player that used item
	 */
	onNoTargetUse?(item: ItemStack, player: number): void;

	/**
     * Method called when player doesn't complete using item that has
	 * maximum use time.
     * @param item item that was in the player's hand when the event occurred
     * @param ticks amount of ticks left to the specified max use duration value
	 * @param player entity uid of the player that used item
     */
	onUsingReleased?(item: ItemStack, ticks: number, player: number): void;

	/**
     * Method called when player completes using item that has
	 * maximum use time.
     * @param item item that was in the player's hand when the event occurred
	 * @param player entity uid of the player that used item
     */
	onUsingComplete?(item: ItemStack, player: number): void;
}