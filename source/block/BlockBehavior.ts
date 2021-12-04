/**
 * Block functions
 */
interface BlockBehavior {
	getDrop?(coords: Callback.ItemUseCoordinates, block: Tile, diggingLevel: number, enchant: ToolAPI.EnchantData, item: ItemStack, region: BlockSource): ItemInstanceArray[];
	onDestroy?(coords: Vector, block: Tile, region: BlockSource): void;
	onPlace?(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number, region: BlockSource): Vector | void;
	onNeighbourChange?(coords: Vector, block: Tile, changeCoords: Vector, region: BlockSource): void;
	onEntityInside?(coords: Vector, block: Tile, entity: number): void;
	onEntityStepOn?(coords: Vector, block: Tile, entity: number): void;
	onRandomTick?(x: number, y: number, z: number, block: Tile, region: BlockSource): void;
	onAnimateTick?(x: number, y: number, z: number, id: number, data: number): void;
	onClick?(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number): void;
}