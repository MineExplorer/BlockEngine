class BlockBase {
	stringID: string
	id: number
	variants: Array<Block.BlockVariation> = [];

	constructor(stringID: string) {
		this.stringID = stringID;
		this.id = IDRegistry.genBlockID(stringID);
	}

	addVariant(name: string, texture: [string, number][], inCreative) {
		this.variants.push();
	}

	create(blockType?: Block.SpecialType | string) {
		Block.createBlock(this.stringID, this.variants, blockType);
	}

	setDestroyTime(destroyTime: number) {
		Block.setDestroyTime(this.stringID, destroyTime);
		return this;
	}

	setBlockMaterial(material: string, level: number) {
		Block.setBlockMaterial(this.stringID, material, level);
		return this;
	}

	setShape(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, data?: number) {
		Block.setShape(this.id, x1, y1, z1, x2, y2, z2, data);
		return this;
	}

	registerTileEntity(prototype: any) {
		TileEntity.registerPrototype(this.id, prototype);
	}
}