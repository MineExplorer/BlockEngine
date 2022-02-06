/// <reference path="BlockBase.ts" />

class BlockRotative extends BlockBase {
	hasVerticalFacings: boolean;

	constructor(stringID: string, blockType?: string | Block.SpecialType, hasVerticalFacings: boolean = false) {
		super(stringID, blockType);
		this.hasVerticalFacings = hasVerticalFacings;
	}

	addVariation(name: string, texture: [string, number][], inCreative?: boolean): void {
		const textures = [
			[texture[3], texture[2], texture[0], texture[1], texture[4], texture[5]],
			[texture[2], texture[3], texture[1], texture[0], texture[5], texture[4]],
			[texture[0], texture[1], texture[3], texture[2], texture[5], texture[4]],
			[texture[0], texture[1], texture[2], texture[3], texture[4], texture[5]],
			[texture[0], texture[1], texture[4], texture[5], texture[3], texture[2]],
			[texture[0], texture[1], texture[5], texture[4], texture[2], texture[3]]
		];
		if (!this.hasVerticalFacings) {
			textures[0] = textures[1] = textures[3];
		}
		for (let data = 0; data < 6; data++) {
			this.variations.push({name: name, texture: textures[data], inCreative: inCreative && data == 0});
		}
	}

	createBlock() {
		super.createBlock();
		if (this.hasVerticalFacings) {
			for (let i = 0; i < this.variations.length; i += 6) {
				BlockModeler.setInventoryModel(this.id, BlockRenderer.createTexturedBlock(this.variations[i + 3].texture), i);
			}
		}
	}

	onPlace(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number, region: BlockSource): Vector {
		const place = BlockRegistry.getPlacePosition(coords, block, region);
		if (!place) return;

		const rotation = BlockRegistry.getBlockRotation(player, this.hasVerticalFacings);
		const data = (item.data - item.data%6) + rotation;
		region.setBlock(place.x, place.y, place.z, item.id, data);
		return place;
	}
}