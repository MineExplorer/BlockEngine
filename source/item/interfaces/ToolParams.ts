/**
 * Object containing tool parameters and functions.
 */
interface ToolParams extends ToolAPI.ToolParams {
    /** Specifies how the player should hold the item. */
    handEquipped?: boolean;
    
    /** Enchantment type of the tool. */
    enchantType?: number;

    /** Array of block types which the tool can break. */
    blockTypes?: string[];

    /**
     * Function that is called when player touches a block with the tool.
     * @param coords object of touch coordinates with side information and relative coordinates set.
     * @param item item in the player's hand
     * @param block block that was touched
     * @param player player entity id
     */
    onItemUse?: (coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number) => void;
}

/**
 * Object used to describe tool material type.
 */
 interface ToolMaterial extends ToolAPI.ToolMaterial {
	/**
	 * Value which specifies chances of getting higher level enchant for the item.
	 */
	enchantability?: number;
	/**
	 * Id of the item that is used to repair tool in anvil.
	 */
	repairMaterial?: number;
}
 