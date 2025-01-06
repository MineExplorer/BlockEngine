/**
 * Block functions
 */
interface BlockBehavior extends BlockItemBehavior {
	/**
	 * Method used to get drop from the block
	 * @param coords block coords
	 * @param block block id and data
	 * @param diggingLevel tool mining level 
	 * @param enchant tool enchant data
	 * @param item item instance
	 * @param region BlockSource object
	 * @returns drop items array
	 */
	getDrop?(coords: Callback.ItemUseCoordinates, block: Tile, diggingLevel: number, enchant: ToolAPI.EnchantData, item: ItemStack, region: BlockSource): ItemInstanceArray[];

	/**
	 * Method called when block is destroyed by player
	 * @param coords block coords
	 * @param block block id and data
	 * @param region BlockSource object
	 * @param player player uid
	 */
	onDestroy?(coords: Vector, block: Tile, region: BlockSource, player: number): void;

	/**
	 * Method called when the block is destroyed by explosion or environment.
	 * @param coords block coords
	 * @param block block id and data
	 * @param region BlockSource object
	 */
	onBreak?(coords: Vector, block: Tile, region: BlockSource): void;

	/**
	 * Method used to determine where block is placed in the world
	 * @param coords click position in the world
	 * @param item item in the player hand
	 * @param block block that was touched
	 * @param player player uid
	 * @param region BlockSource object
	 * @returns coordinates where to actually place the block, or void for 
	 * default placement
	 */
	onPlace?(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number, region: BlockSource): Vector | void;

	/**
	 * Method called on neighbour blocks updates
	 * @param coords coords of the block
	 * @param block block id and data
	 * @param changedCoords coords of the neighbour block that was changed
	 * @param region BlockSource object
	 */
	onNeighbourChange?(coords: Vector, block: Tile, changeCoords: Vector, region: BlockSource): void;
	
	/**
	 * Method called on entity being inside the block. Can be used to create portals.
	 * @param coords coords of the block
	 * @param block block id and data
	 * @param entity entity uid
	 */
	onEntityInside?(coords: Vector, block: Tile, entity: number): void;

	/**
	 * Method called on entity step on the block.
	 * @param coords coords of the block
	 * @param block block id and data
	 * @param entity entity uid
	 */
	onEntityStepOn?(coords: Vector, block: Tile, entity: number): void;

	/**
	 * Method which enables random tick callback for the block and called on it.
	 * @param x x coord of the block
	 * @param y y coord of the block
	 * @param z z coord of the block
	 * @param block block id and data
	 * @param region BlockSource object
	 */
	onRandomTick?(x: number, y: number, z: number, block: Tile, region: BlockSource): void;

	/**
	 * Method which enables animation update callback for the block and called on it.
	 * Occurs more often then random tick callback and only if the block is not far away from player.
	 * @param x x coord of the block
	 * @param y y coord of the block
	 * @param z z coord of the block
	 * @param id block id
	 * @param data block data
	 */
	onAnimateTick?(x: number, y: number, z: number, id: number, data: number): void;

	/**
	 * Method called when player clicks on the block.
	 * @param coords coords of the block
	 * @param item item in player hand
	 * @param block block id and data
	 * @param player player uid
	 */
	onClick?(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number): void;

	/**
	 * Occurs when redstone signal on block was updated. Requires Block.setupAsRedstoneReceiver to be called on the block id.
	 * @param coords coords of the block
	 * @param region BlockSource object
	 */
	onRedstoneUpdate?(coords: Vector, params: {signal: number, onLoad: boolean}, region: BlockSource): void;
}