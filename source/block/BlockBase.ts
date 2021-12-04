class BlockBase
implements BlockBehavior {
	stringID: string;
	id: number;
	variations: Array<Block.BlockVariation> = [];

	constructor(stringID: string, blockType?: Block.SpecialType | string) {
		this.stringID = stringID;
		this.id = IDRegistry.genBlockID(stringID);
		this.createVariations();
		Block.createBlock(this.stringID, this.variations, blockType);
	}

	addVariation(name: string, texture: [string, number][], inCreative: boolean = false) {
		this.variations.push({name: name, texture: texture, inCreative: inCreative});
	}

	createVariations(): void {
		this.addVariation(this.stringID + ".name", [["__missing", 0]]);
	}

	getDrop(coords: Vector, block: Tile, diggingLevel: number, enchant: ToolAPI.EnchantData, item: ItemStack, region: BlockSource): ItemInstanceArray[] {
		return [[block.id, 1, block.data]];
	}

	onDestroy(coords: Vector, block: Tile, region: BlockSource): void {
		if (Math.random() >= 0.25) return;
		const enchant = ToolAPI.getEnchantExtraData();
		const item = new ItemStack();
		const drop = this.getDrop(coords, block, 127, enchant, item, region);
		for (let item of drop) {
			region.spawnDroppedItem(coords.x + .5, coords.y + .5, coords.z + .5, item[0], item[1], item[2], item[3] || null);
		}
	}

	setDestroyTime(destroyTime: number): void {
		Block.setDestroyTime(this.id, destroyTime);
	}

	setBlockMaterial(material: string, level?: number, isNative?: boolean): void {
		ToolAPI.registerBlockMaterial(this.id, material, level, isNative);
	}

	setShape(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, data?: number): void {
		Block.setShape(this.id, x1, y1, z1, x2, y2, z2, data);
	}

	/**
	 * Sets the block type of another block, which allows to inherit some of its properties
	 * @param baseBlock id of the block to inherit type
	 */
	setBaseBlock(baseBlock: number): void {
		NativeBlock.setMaterialBase(this.id, baseBlock);
	}

	/**
	 * Sets sound type of the block.
	 * @param sound block sound type
	 */
	setSoundType(sound: Block.Sound): void {
		NativeBlock.setSoundType(this.id, sound);
	}

	/**
	 * Sets block to be transparent or opaque.
	 * @param isSolid if true, sets block to be opaque.
	 */
	setSolid(isSolid: boolean): void {
		NativeBlock.setSolid(this.id, isSolid);
	}

	/**
	 * @param renderAllFaces If true, all block faces are rendered, otherwise back faces are not
	 * rendered (for optimization purposes). Default is false
	 */
	setRenderAllFaces(renderAllFaces: boolean): void {
		NativeBlock.setRenderAllFaces(this.id, renderAllFaces);
	}

	/**
	 * Sets render type of the block.
	 * @param renderType default is 0 (full block), use other values to change block's model
	 */
	setRenderType(renderType: number): void {
		NativeBlock.setRenderType(this.id, renderType);
	}

	/**
	 * Specifies the layer that is used to render the block.
	 * @param renderLayer default is 4
	 */
	setRenderLayer(renderLayer: number): void {
		NativeBlock.setRenderLayer(this.id, renderLayer);
	}

	/**
	 * Sets level of the light emitted by the block.
	 * @param lightLevel value from 0 (no light) to 15
	 */
	setLightLevel(lightLevel: number): void {
		NativeBlock.setLightLevel(this.id, lightLevel);
	}

	/**
	 * Specifies how opaque block is.
	 * @param lightOpacity Value from 0 to 15 which will be substracted
	 * from the light level when the light passes through the block
	 */
	setLightOpacity(lightOpacity: number): void {
		NativeBlock.setLightOpacity(this.id, lightOpacity);
	}

	/**
	 * Specifies how block resists to the explosions.
	 * @param resistance integer value, default is 3
	 */
	setExplosionResistance(resistance: number): void {
		NativeBlock.setExplosionResistance(this.id, resistance);
	}

	/**
	 * Sets block friction. It specifies how player walks on the block.
	 * The higher the friction is, the more difficult it is to change speed
	 * and direction.
	 * @param friction float value, default is 0.6
	 */
	setFriction(friction: number): void {
		NativeBlock.setFriction(this.id, friction);
	}

	/**
	 * Specifies rendering of shadows on the block.
	 * @param translucency float value from 0 (no shadows) to 1
	 */
	setTranslucency(translucency: number): void {
		NativeBlock.setTranslucency(this.id, translucency);
	}

	/**
	 * Sets block color when displayed on the vanilla maps
	 * @param color map color of the block
	 */
	setMapColor(color: number): void {
		NativeBlock.setMapColor(this.id, color);
	}

	/**
	 * Makes block use biome color when displayed on the vanilla maps.
	 * @param color block color source
	 */
	setBlockColorSource(color: Block.ColorSource): void {
		NativeBlock.setBlockColorSource(this.id, color);
	}

	/**
     * Sets item creative category
	 * @param category item category, should be integer from 1 to 4.
	 */
	setCategory(category: number): void {
		Item.setCategory(this.id, category);
	}

	setRarity(rarity: number): void {
		ItemRegistry.setRarity(this.id, rarity);
	}

	registerTileEntity(prototype: TileEntity.TileEntityPrototype) {
		TileEntity.registerPrototype(this.id, prototype);
	}
}