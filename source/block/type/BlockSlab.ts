/// <reference path="./BlockBase.ts" />

class BlockSlab extends BlockBase {
	doubleSlabID: number;

	setDoubleSlab(blockID: number) {
		this.doubleSlabID = blockID;
	}

	createBlock(): void {
		const defineData = this.variations;
		this.variations = [];
		for (let i = 0; i < 8; i++) {
			if (i < defineData.length) {
				this.variations.push(defineData[i]);
			} else {
				this.addVariation(defineData[0].name, defineData[0].texture);
			}
		}
		for (let i = 0; i < defineData.length; i++) {
			this.addVariation(defineData[i].name, defineData[i].texture, false);
		}

		for (let i = 0; i < 8; i++) {
			this.setShape(0, 0, 0, 1, 0.5, 1, i);
		}
		for (let i = 8; i < 16; i++) {
			this.setShape(0, 0.5, 0, 1, 1, 1, i);
		}

		super.createBlock();
	}

	getDrop(coords: Vector, block: Tile, level: number): ItemInstanceArray[] {
		return [[this.id, 1, block.data%8]];
	}

	onPlace(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number, blockSource: BlockSource): Vector | void {
		const region = new WorldRegion(blockSource);
		// make double slab
		if (block.id == item.id && block.data%8 == item.data && Math.floor(block.data/8) == (coords.side^1)) {
			region.setBlock(coords, this.doubleSlabID, item.data);
			return;
		}
		let place: Vector = coords;
		if (!World.canTileBeReplaced(block.id, block.data)) {
			place = coords.relative;
			const tile = region.getBlock(place);
			if (!World.canTileBeReplaced(tile.id, tile.data)) {
				if (tile.id == item.id && tile.data%8 == item.data) {
					region.setBlock(place, this.doubleSlabID, item.data);
				}
				return;
			};
		}
		if (coords.vec.y - place.y < 0.5) {
			region.setBlock(place, item.id, item.data);
		}
		else {
			region.setBlock(place, item.id, item.data + 8);
		}
	}
}