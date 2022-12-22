/// <reference path="./BlockBase.ts" />

class BlockDoubleSlab extends BlockBase {
	slabID: number;

	setSlab(blockID: number) {
		this.slabID = blockID;
	}

	getDrop(coords: Vector, block: Tile, level: number): ItemInstanceArray[] {
		return [[this.slabID, 1, block.data], [this.slabID, 1, block.data]];
	}
}