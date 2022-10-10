/// <reference path="./BlockItemBehavior.ts" />

/**
 * Item functions
 */
interface ItemBehavior extends BlockItemBehavior {
	/**
	 * This method is called to override texture for the item icon.
	 * @param item item stack that icon is being overriden.
     * @param isModUi whether icon override is working in mod ui or in vanilla one
	 * @returns texture data which will be used for the item icon.
	 */
	onIconOverride?(item: ItemInstance, isModUi: boolean): Item.TextureData;

	/**
	 * This method is called when player uses item in the air.
     * @param item item that was in the player's hand when the event occurred
     * @param player entity uid of the player that used item
	 */
	onNoTargetUse?(item: ItemStack, player: number): void;

	/**
     * This method is called when player doesn't complete using item that has
	 * maximum use time.
     * @param item item that was in the player's hand when the event occurred
     * @param ticks amount of ticks left to the specified max use duration value
	 * @param player entity uid of the player that used item
     */
	onUsingReleased?(item: ItemStack, ticks: number, player: number): void;

	/**
     * This method is called when player completes using item that has
	 * maximum use time.
     * @param item item that was in the player's hand when the event occurred
	 * @param player entity uid of the player that used item
     */
	onUsingComplete?(item: ItemStack, player: number): void;
}