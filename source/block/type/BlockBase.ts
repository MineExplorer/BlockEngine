/// <reference path="../interfaces/BlockType.ts" />
/// <reference path="../interfaces/BlockBehavior.ts" />

class BlockBase
implements BlockBehavior {
	readonly stringID: string;
	readonly id: number;
	category: number;
	variations: Array<Block.BlockVariation> = [];
	blockType: BlockType;
	shapes: {[key: number]: BlockModeler.BoxVertexes} = {};
	/**
	 * Flag that defines whether block for this instance was defined or not.
	 */
	isDefined: boolean = false;
	blockMaterial: string;
	miningLevel: number = 0;

	constructor(stringID: string, blockType: BlockType | string = {}) {
		this.stringID = stringID;
		this.id = IDRegistry.genBlockID(stringID);
		if (typeof blockType == "object") {
			BlockRegistry.extendBlockType(blockType);
		} else {
			blockType = BlockRegistry.getBlockType(blockType);
		}
		this.blockType = blockType;
	}

	addVariation(name: string, texture: [string, number][], inCreative: boolean = false) {
		this.variations.push({name: name, texture: texture, inCreative: inCreative});
	}

	createBlock(): void {
		if (this.variations.length == 0) {
			this.addVariation(this.stringID + ".name", [["__missing", 0]]);
		}
		let blockType = null;
		if (this.blockType) {
			blockType = BlockRegistry.convertBlockTypeToSpecialType(this.blockType);
		}

		// remove duplicated items in creative
		const duplicatedInstance = BlockRegistry.getInstanceOf(this.id);
		if (duplicatedInstance) {
			const variations = duplicatedInstance.variations;
			for (let i = 0; i < Math.min(this.variations.length, variations.length); i++) {
				if (variations[i].inCreative) {
					this.variations[i].inCreative = false;
					Logger.Log(`Skipped duplicated adding to creative for block ${this.stringID}:${i}`, "BlockEngine");
				}
			}
		}

		Block.createBlock(this.stringID, this.variations, blockType);
		this.isDefined = true;
		for (let data in this.shapes) {
			const box = this.shapes[data];
			Block.setShape(this.id, box[0], box[1], box[2], box[3], box[4], box[5], parseInt(data));
		}
		if (this.category) Item.setCategory(this.id, this.category);
	}

	getDrop(coords: Vector, block: Tile, level: number, enchant: ToolAPI.EnchantData, item: ItemStack, region: BlockSource): ItemInstanceArray[] {
		if (level >= this.miningLevel) {
			return [[block.id, 1, block.data]];
		}
		return [];
	}

	onBreak(coords: Vector, block: Tile, region: BlockSource): void {
		if (Math.random() >= 0.25) return;
		const enchant = ToolAPI.getEnchantExtraData();
		const item = new ItemStack();
		const drop = this.getDrop(coords, block, 127, enchant, item, region);
		for (let item of drop) {
			region.spawnDroppedItem(coords.x + .5, coords.y + .5, coords.z + .5, item[0], item[1], item[2], item[3] || null);
		}
	}

	setDestroyTime(destroyTime: number): void {
		this.blockType.destroyTime = destroyTime;
	}

	setBlockMaterial(material: string, level: number = 0): void {
		this.blockMaterial = material;
		this.miningLevel = level;
		BlockRegistry.setBlockMaterial(this.id, material, level);
	}

	/**
	 * Sets block box shape.
	 * @params x1, y1, z1 position of block lower corner (0, 0, 0 for solid block)
	 * @params x2, y2, z2 position of block upper conner (1, 1, 1 for solid block)
	 * @param data sets shape for one block variation if specified and for all variations otherwise
	 */
	setShape(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, data: number = -1): void {
		this.shapes[data] = [x1, y1, z1, x2, y2, z2];
	}

	/**
	 * Sets the block type of another block, which allows to inherit some of its properties.
	 * @param baseBlock id of the block to inherit type
	 */
	setBaseBlock(baseBlock: number): void {
		this.blockType.baseBlock = baseBlock;
	}

	/**
	 * Sets block to be transparent or opaque.
	 * @param isSolid if true, sets block to be opaque.
	 */
	setSolid(isSolid: boolean): void {
		this.blockType.solid = isSolid;
	}

	/**
	 * Sets rendering of the block faces.
	 * @param renderAllFaces If true, all block faces are rendered, otherwise back faces are not
	 * rendered (for optimization purposes). Default is false
	 */
	setRenderAllFaces(renderAllFaces: boolean): void {
		this.blockType.renderAllFaces = renderAllFaces;
	}

	/**
	 * Sets render type of the block.
	 * @param renderType default is 0 (full block), use other values to change block's model
	 */
	setRenderType(renderType: number): void {
		this.blockType.renderType = renderType;
	}

	/**
	 * Specifies the layer that is used to render the block.
	 * @param renderLayer default is 4
	 */
	setRenderLayer(renderLayer: number): void {
		this.blockType.renderLayer = renderLayer;
	}

	/**
	 * Sets level of the light emitted by the block.
	 * @param lightLevel value from 0 (no light) to 15
	 */
	setLightLevel(lightLevel: number): void {
		this.blockType.lightLevel = lightLevel;
	}

	/**
	 * Specifies how opaque block is.
	 * @param lightOpacity Value from 0 to 15 which will be substracted
	 * from the light level when the light passes through the block
	 */
	setLightOpacity(lightOpacity: number): void {
		this.blockType.lightOpacity = lightOpacity;
	}

	/**
	 * Specifies how block resists to the explosions.
	 * @param resistance integer value, default is 3
	 */
	setExplosionResistance(resistance: number): void {
		this.blockType.explosionResistance = resistance;
	}

	/**
	 * Sets block friction. It specifies how player walks on the block.
	 * The higher the friction is, the more difficult it is to change speed
	 * and direction.
	 * @param friction float value, default is 0.6
	 */
	setFriction(friction: number): void {
		this.blockType.friction = friction;
	}

	/**
	 * Specifies rendering of shadows on the block.
	 * @param translucency float value from 0 (no shadows) to 1
	 */
	setTranslucency(translucency: number): void {
		this.blockType.translucency = translucency;
	}

	/**
	 * Sets sound type of the block.
	 * @param sound block sound type
	 */
	setSoundType(sound: Block.Sound): void {
		this.blockType.sound = sound;
	}

	/**
	 * Sets block color when displayed on the vanilla maps.
	 * @param color map color of the block
	 */
	setMapColor(color: number): void {
		this.blockType.mapColor = color;
	}

	/**
	 * Makes block use biome color when displayed on the vanilla maps.
	 * @param color block color source
	 */
	setBlockColorSource(colorSource: Block.ColorSource): void {
		this.blockType.colorSource = colorSource;
	}

	/**
     * Sets item creative category.
	 * @param category item category, should be integer from 1 to 4.
	 */
	setCategory(category: number): void {
		this.category = category;
	}

	setRarity(rarity: number): void {
		ItemRegistry.setRarity(this.id, rarity);
	}

	registerTileEntity(prototype: TileEntity.TileEntityPrototype) {
		TileEntity.registerPrototype(this.id, prototype);
	}
}