/// <reference path="./BlockBase.ts" />

class BlockStairs extends BlockBase {
	constructor(stringID: string, defineData: Block.BlockVariation, blockType?: string | Block.SpecialType) {
		super(stringID, blockType);
		this.variations.push(defineData);
		BlockModeler.setStairsRenderModel(this.id);
		this.createItemModel();
	}

	createItemModel(): void {
		const model = BlockRenderer.createModel();
		model.addBox(0, 0, 0, 1, 0.5, 1, this.id, 0);
		model.addBox(0, 0.5, 0, 1, 1, 0.5, this.id, 0);
		BlockModeler.setInventoryModel(this.id, model);
	}

	onPlace(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number, region: BlockSource): Vector {
		const place = BlockRegistry.getPlacePosition(coords, block, region);
		if (!place) return;
		let data = BlockRegistry.getBlockRotation(player) - 2;
		if (coords.side == 0 || coords.side >= 2 && coords.vec.y - coords.y >= 0.5) {
			data += 4;
		}
		region.setBlock(place.x, place.y, place.z, item.id, data);
		return place;
	}
}