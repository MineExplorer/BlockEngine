/// <reference path="./interfaces/BlockType.ts" />
/// <reference path="./interfaces/BlockBehavior.ts" />
/// <reference path="./type/BlockBase.ts" />
/// <reference path="./type/BlockRotative.ts" />
/// <reference path="./type/BlockStairs.ts" />
/// <reference path="./type/BlockSlab.ts" />
/// <reference path="./type/BlockDoubleSlab.ts" />

/**
 * Module for advanced block definition.
 */
namespace BlockRegistry {
	// Import native modules
	const EntityGetYaw = ModAPI.requireGlobal("Entity.getYaw");
	const EntityGetPitch = ModAPI.requireGlobal("Entity.getPitch");
	//@ts-ignore
	const NativeBlock = com.zhekasmirnov.innercore.api.NativeBlock;
	
	const blocks = {};
	const blockTypes = {};

	/**
	 * Creates new block using specified params.
	 * @param stringID string id of the block.
	 * @param defineData array containing all variations of the block. Each 
	 * variation corresponds to block data value, data values are assigned 
	 * according to variations order.
	 * @param blockType BlockType object or block type name, if the type was previously registered.
	 */
	export function createBlock(stringID: string, defineData: Block.BlockVariation[], blockType?: string | BlockType): void {
		const block = new BlockBase(stringID, blockType);
		for (let variation of defineData) {
			block.addVariation(variation.name, variation.texture, variation.inCreative);
		}
		registerBlock(block);
	}

	/**
	 * Creates new block with horizontal or all sides rotation.
	 * @param stringID string id of the block
	 * @param defineData array containing all variations of the block. Supports 2 variations,
	 * each occupying 6 data values for rotation.
	 * @param blockType BlockType object or block type name, if the type was previously registered.
	 * @param hasVerticalFacings true if the block has vertical facings, false otherwise.
	 */
    export function createBlockWithRotation(stringID: string, defineData: Block.BlockVariation[], blockType?: string | BlockType, hasVerticalFacings?: boolean): void {
		const block = new BlockRotative(stringID, blockType, hasVerticalFacings);
		for (let variation of defineData) {
			block.addVariation(variation.name, variation.texture, variation.inCreative);
		}
		registerBlock(block);
    }

	/**
	 * Creates stairs using specified params
	 * @param stringID string id of the block
	 * @param defineData array containing one variation of the block (for similarity with other methods).
	 * @param blockType BlockType object or block type name, if the type was previously registered.
	 */
	export function createStairs(stringID: string, defineData: Block.BlockVariation[], blockType?: string | BlockType): void {
		registerBlock(new BlockStairs(stringID, defineData[0], blockType));
	}

	/**
	 * Creates slabs and its double slabs using specified params
	 * @param slabID string id of the
	 * @param doubleSlabID string id of the double slab
	 * @param defineData array containing all variations of the block. Each 
	 * variation corresponds to block data value, data values are assigned 
	 * according to variations order.
	 * @param blockType BlockType object or block type name, if the type was previously registered.
	 */
	export function createSlabs(slabID: string, doubleSlabID: string, defineData: Block.BlockVariation[], blockType?: string | BlockType) {
		const slab = new BlockSlab(slabID, blockType);
		slab.variations = defineData;

		const doubleSlab = new BlockDoubleSlab(doubleSlabID, blockType);
		for (let variation of defineData) {
			doubleSlab.addVariation(variation.name, variation.texture);
		}

		slab.setDoubleSlab(doubleSlab.id);
		doubleSlab.setSlab(slab.id);

		registerBlock(slab);
		registerBlock(doubleSlab);
	}

	/**
	 * @param name block type name
	 * @returns BlockType object by name
	 */
	export function getBlockType(name: string): Nullable<BlockType> {
		return blockTypes[name] || null;
	}

	/**
	 * Inherits default values from type specified in "extends" property.
	 * @param type BlockType object
	 */
	export function extendBlockType(type: BlockType): void {
		if (!type.extends) return;

		const parent = getBlockType(type.extends);
		for (let key in parent) {
			if (!(key in type)) {
				type[key] = parent[key];
			}
		}
	}

	/**
	 * Registers block type in BlockEngine and as Block.SpecialType.
	 * @param name block type name
	 * @param type BlockType object
	 * @param isNative if true doesn't create special type
	 */
	export function createBlockType(name: string, type: BlockType, isNative?: boolean): void {
		extendBlockType(type);
		blockTypes[name] = type;
		if (!isNative) {
			Block.createSpecialType(convertBlockTypeToSpecialType(type), name);
		}
	}

	/**
	 * Converts block type to special type.
	 * @param properites BlockType object
	 * @returns block special type
	 */
	export function convertBlockTypeToSpecialType(properites: BlockType): Block.SpecialType {
		const type: Block.SpecialType = {};
		for (let key in properites) {
			switch(key) {
			case "baseBlock":
				type.base = properites[key];
			break;
			case "renderAllFaces":
				type.renderallfaces = properites[key];
			break;
			case "renderType":
				type.rendertype = properites[key];
			break;
			case "renderLayer":
				type.renderlayer = properites[key];
			break;
			case "lightLevel":
				type.lightlevel = properites[key];
			break;
			case "lightOpacity":
				type.lightopacity = properites[key];
			break;
			case "explosionResistance":
				type.explosionres = properites[key];
			break;
			case "destroyTime":
				type.destroytime = properites[key];
			break;
			case "mapColor":
				type.mapcolor = properites[key];
			break;
			case "colorSource":
				type.color_source = properites[key];
			break;
			case "extends": continue;
			default:
				type[key] = properites[key];
			break;
			}
		}
		return type;
	}

	/**
	 * @param blockID block numeric or string id
	 * @returns instance of block class if it exists
	 */
	export function getInstanceOf(blockID: string | number): Nullable<BlockBase> {
		const numericID = Block.getNumericId(blockID);
		return blocks[numericID] || null;
	}

	/**
	 * Registers instance of BlockBase class and creates block for it.
	 * @param block instance of BlockBase class
	 * @returns the same BlockBase instance with `isDefined` flag set to true
	 */
	export function registerBlock(block: BlockBase): BlockBase {
		block.createBlock();
		registerBlockFuncs(block.id, block);
		blocks[block.id] = block;
		return block;
	}

	/**
	 * Registers all block functions.
	 * @param blockID block numeric or string id
	 * @param blockFuncs object containing block functions
	 */
	export function registerBlockFuncs(blockID: string | number, blockFuncs: BlockBehavior): void {
		const numericID = Block.getNumericId(blockID);
		if ('getDrop' in blockFuncs) {
			Block.registerDropFunction(numericID, function(coords: Callback.ItemUseCoordinates, blockID: number, blockData: number, diggingLevel: number, enchant: ToolAPI.EnchantData, item: ItemInstance, region: BlockSource) {
				return blockFuncs.getDrop(coords, {id: blockID, data: blockData}, diggingLevel, enchant, new ItemStack(item), region);
			});
		}
		if ('onDestroy' in blockFuncs) {
			Callback.addCallback("DestroyBlock", function (coords: Callback.ItemUseCoordinates, block: Tile, player: number) {
				if (block.id == numericID) {
					blockFuncs.onDestroy(coords, block, BlockSource.getDefaultForActor(player), player);
				}
			});
		}
		if ('onBreak' in blockFuncs) {
			Block.registerPopResourcesFunction(numericID, function(coords: Vector, block: Tile, region: BlockSource) {
				blockFuncs.onBreak(coords, block, region);
			});
		}
		if ('onPlace' in blockFuncs) {
			Block.registerPlaceFunction(numericID, function(coords: Callback.ItemUseCoordinates, item: ItemInstance, block: Tile, player: number, region: BlockSource) {
				return blockFuncs.onPlace(coords, new ItemStack(item), block, player, region);
			});
		}
		if ('onNeighbourChange' in blockFuncs) {
			Block.registerNeighbourChangeFunction(numericID, function(coords: Vector, block: Tile, changeCoords: Vector, region: BlockSource) {
				blockFuncs.onNeighbourChange(coords, block, changeCoords, region);
			});
		}
		if ('onEntityInside' in blockFuncs) {
			Block.registerEntityInsideFunction(numericID, function(coords: Vector, block: Tile, entity: number) {
				blockFuncs.onEntityInside(coords, block, entity);
			});
		}
		if ('onEntityStepOn' in blockFuncs) {
			Block.registerEntityStepOnFunction(numericID, function(coords: Vector, block: Tile, entity: number) {
				blockFuncs.onEntityStepOn(coords, block, entity);
			});
		}
		if ('onRandomTick' in blockFuncs) {
			Block.setRandomTickCallback(numericID, function(x: number, y: number, z: number, id: number, data: number, region: BlockSource) {
				blockFuncs.onRandomTick(x, y, z, {id: id, data: data}, region);
			});
		}
		if ('onAnimateTick' in blockFuncs) {
			Block.setAnimateTickCallback(numericID, function(x: number, y: number, z: number, id: number, data: number) {
				blockFuncs.onAnimateTick(x, y, z, id, data);
			});
		}
		if ('onClick' in blockFuncs) {
			if (Block.registerClickFunction) {
				Block.registerClickFunction(numericID, function(coords: Callback.ItemUseCoordinates, item: ItemInstance, block: Tile, player: number) {
					blockFuncs.onClick(coords, new ItemStack(item), block, player);
				});
			}
			else {
				Callback.addCallback("ItemUse", function(coords: Callback.ItemUseCoordinates, item: ItemInstance, block: Tile, isExternal: boolean, player: number) {
					if (block.id == numericID) {
						blockFuncs.onClick(coords, new ItemStack(item), block, player);
					}
				});
			}
		}

		if ('onNameOverride' in blockFuncs || 'onItemUse' in blockFuncs || 'onDispense' in blockFuncs) {
			ItemRegistry.registerItemFuncs(blockID, blockFuncs);
		}
	}

	/**
	 * Sets destroy time for the block with specified id.
	 * @param blockID block numeric or string id
	 * @param time block destroy time
	 */
	export function setDestroyTime(blockID: string | number, time: number): void {
		Block.setDestroyTime(blockID, time);
	}

	/**
	 * Sets the block type of another block, which allows to inherit some of its properties.
	 * @param blockID block numeric or string id
	 * @param baseBlock id of the block to inherit type
	 */
	export function setBaseBlock(blockID: string | number, baseBlock: number): void {
		NativeBlock.setMaterialBase(Block.getNumericId(blockID), baseBlock);
	}

	/**
	 * Sets block to be transparent or opaque.
	 * @param blockID block numeric or string id
	 * @param isSolid if true, sets block to be opaque.
	 */
	export function setSolid(blockID: string | number, isSolid: boolean): void {
		NativeBlock.setSolid(Block.getNumericId(blockID), isSolid);
	}

	/**
	 * Sets rendering of the block faces.
	 * @param blockID block numeric or string id
	 * @param renderAllFaces If true, all block faces are rendered, otherwise back faces are not
	 * rendered (for optimization purposes). Default is false
	 */
	export function setRenderAllFaces(blockID: string | number, renderAllFaces: boolean): void {
		NativeBlock.setRenderAllFaces(Block.getNumericId(blockID), renderAllFaces);
	}

	/**
	 * Sets render type of the block.
	 * @param blockID block numeric or string id
	 * @param renderType default is 0 (full block), use other values to change block's model
	 */
	export function setRenderType(blockID: string | number, renderType: number): void {
		NativeBlock.setRenderType(Block.getNumericId(blockID), renderType);
	}

	/**
	 * Specifies the layer that is used to render the block.
	 * @param blockID block numeric or string id
	 * @param renderLayer default is 4
	 */
	export function setRenderLayer(blockID: string | number, renderLayer: number): void {
		NativeBlock.setRenderLayer(Block.getNumericId(blockID), renderLayer);
	}

	/**
	 * Sets level of the light emitted by the block.
	 * @param blockID block numeric or string id
	 * @param lightLevel value from 0 (no light) to 15
	 */
	export function setLightLevel(blockID: string | number, lightLevel: number): void {
		NativeBlock.setLightLevel(Block.getNumericId(blockID), lightLevel);
	}

	/**
	 * Specifies how opaque block is.
	 * @param blockID block numeric or string id
	 * @param lightOpacity Value from 0 to 15 which will be substracted
	 * from the light level when the light passes through the block
	 */
	export function setLightOpacity(blockID: string | number, lightOpacity: number): void {
		NativeBlock.setLightOpacity(Block.getNumericId(blockID), lightOpacity);
	}

	/**
	 * Specifies how block resists to the explosions.
	 * @param blockID block numeric or string id
	 * @param resistance integer value, default is 3
	 */
	export function setExplosionResistance(blockID: string | number, resistance: number): void {
		NativeBlock.setExplosionResistance(Block.getNumericId(blockID), resistance);
	}

	/**
	 * Sets block friction. It specifies how player walks on the block.
	 * The higher the friction is, the more difficult it is to change speed
	 * and direction.
	 * @param blockID block numeric or string id
	 * @param friction float value, default is 0.6
	 */
	export function setFriction(blockID: string | number, friction: number): void {
		NativeBlock.setFriction(Block.getNumericId(blockID), friction);
	}

	/**
	 * Specifies rendering of shadows on the block.
	 * @param blockID block numeric or string id
	 * @param translucency float value from 0 (no shadows) to 1
	 */
	export function setTranslucency(blockID: string | number, translucency: number): void {
		NativeBlock.setTranslucency(Block.getNumericId(blockID), translucency);
	}

	/**
	 * Sets sound type of the block.
	 * @param blockID block numeric or string id
	 * @param sound block sound type
	 */
	export function setSoundType(blockID: string | number, sound: Block.Sound): void {
		NativeBlock.setSoundType(Block.getNumericId(blockID), sound);
	}

	/**
	 * Sets block color when displayed on the vanilla maps.
	 * @param blockID block numeric or string id
	 * @param color map color of the block
	 */
	export function setMapColor(blockID: string | number, color: number): void {
		NativeBlock.setMapColor(Block.getNumericId(blockID), color);
	}

	/**
	 * Makes block use biome color when displayed on the vanilla maps.
	 * @param blockID block numeric or string id
	 * @param color block color source
	 */
	export function setBlockColorSource(blockID: string | number, color: Block.ColorSource): void {
		NativeBlock.setBlockColorSource(Block.getNumericId(blockID), color);
	}

	/**
	 * Registers block material and digging level. If you are registering
	 * block with 'stone' material ensure that its block type has baseBlock
	 * id 1 to be correctly destroyed by pickaxes.
	 * @param blockID block numeric or string id
	 * @param material material name
	 * @param level block's digging level
	 */
	export function setBlockMaterial(blockID: string | number, material: string, level?: number) {
		ToolAPI.registerBlockMaterial(Block.getNumericId(blockID), material, level, material == "stone");
	}

	/**
	 * @returns block side opposite to player rotation.
	 * @param player player uid
	 * @param hasVertical if true can return vertical sides as well
	 */
	export function getBlockRotation(player: number, hasVertical?: boolean): number {
		const pitch = EntityGetPitch(player);
		if (hasVertical) {
			if (pitch < -45) return 0;
			if (pitch > 45) return 1;
		}
		let rotation = Math.floor((EntityGetYaw(player) - 45)%360 / 90);
		if (rotation < 0) rotation += 4;
		rotation = [5, 3, 4, 2][rotation];
		return rotation;
	}

	/**
	 * @returns block place position for click coords in world.
	 * @param coords click coords
	 * @param block touched block
	 * @param region BlockSource
	 */
	export function getPlacePosition(coords: Callback.ItemUseCoordinates, block: Tile, region: BlockSource): Vector {
		if (World.canTileBeReplaced(block.id, block.data)) return coords;
		const place = coords.relative;
		block = region.getBlock(place.x, place.y, place.z);
		if (World.canTileBeReplaced(block.id, block.data)) return place;
		return null;
	}

	/**
	 * Registers place function for block with rotation.
	 * @param id block numeric or string id
	 * @param hasVertical true if the block has vertical facings, false otherwise.
	 */
	export function setRotationFunction(id: string | number, hasVertical?: boolean, placeSound?: string): void {
		Block.registerPlaceFunction(id, function(coords, item, block, player, region) {
			const place = getPlacePosition(coords, block, region);
			if (!place) return;
			const rotation = getBlockRotation(player, hasVertical);
			region.setBlock(place.x, place.y, place.z, item.id, (item.data - item.data%6) + rotation);
			//World.playSound(place.x, place.y, place.z, placeSound || "dig.stone", 1, 0.8);
			return place;
		});
	}

	/**
	 * Registers drop function for block.
	 * @param blockID block numeric or string id
	 * @param dropFunc drop function
	 * @param level mining level
	 */
    export function registerDrop(blockID: string | number, dropFunc: Block.DropFunction, level?: number): void {
        Block.registerDropFunction(blockID, function(blockCoords, blockID, blockData, diggingLevel, enchant, item, region) {
            if (!level || diggingLevel >= level) {
                return dropFunc(blockCoords, blockID, blockData, diggingLevel, enchant, item, region);
            }
            return [];
        });
        addBlockDropOnExplosion(blockID);
    }

	/**
	 * Sets mining level for block.
	 * @param blockID block numeric or string id
	 * @param level mining level
	 */
    export function setDestroyLevel(blockID: string | number, level: number): void {
        Block.registerDropFunction(blockID, function(coords, blockID, blockData, diggingLevel) {
            if (diggingLevel >= level) {
                return [[Block.getNumericId(blockID), 1, 0]];
            }
        });
        addBlockDropOnExplosion(blockID);
    }

	/**
	 * Registers function called when block is destroyed by explosion.
	 * @param blockID block numeric or string id
	 * @param func function on explosion
	 */
	export function registerOnExplosionFunction(blockID: string | number, func: Block.PopResourcesFunction): void {
		Block.registerPopResourcesFunction(blockID, func);
	}

	/**
	 * Registers block drop on explosion with 25% chance.
	 */
    export function addBlockDropOnExplosion(blockID: string | number): void {
		Block.registerPopResourcesFunction(blockID, function(coords, block, region) {
			if (Math.random() >= 0.25) return;
            const dropFunc = Block.getDropFunction(block.id);
            const enchant = ToolAPI.getEnchantExtraData();
            const item = new ItemStack();
            //@ts-ignore
            const drop = dropFunc(coords, block.id, block.data, 127, enchant, item, region);
            for (let item of drop) {
                region.spawnDroppedItem(coords.x + .5, coords.y + .5, coords.z + .5, item[0], item[1], item[2], item[3] || null);
            }
		});
	}

	const noDropBlocks = [26, 30, 31, 32, 51, 59, 92, 99, 100, 104, 105, 106, 115, 127, 132, 141, 142, 144, 161, 175, 199, 244, 385, 386, 388, 389, 390, 391, 392, 462];

	/** @deprecated */
	export function getBlockDrop(x: number, y: number, z: number, block: Tile, level: number, item: ItemInstance, region?: BlockSource): ItemInstanceArray[] {
		const id = block.id, data = block.data;
		const enchant = ToolAPI.getEnchantExtraData(item.extra);
		//@ts-ignore
		const dropFunc = Block.dropFunctions[id];
		if (dropFunc) {
			region ??= BlockSource.getDefaultForActor(Player.get());
			return dropFunc(new Vector3(x, y, z), id, data, level, enchant, item, region);
		}

		if (id == 3 || id == 5 || id == 6 || id == 12 || id == 19 || id == 35 || id == 85 || id == 158 || id == 171) return [[id, 1, data]];
		if (id == 17 || id == 162) return [[id, 1, data]]; // log
		if (id == 18 || id == 161) { // leaves
			if (enchant.silk) return [[id, 1, data]];
			return [];
		}
		if (id == 47) { // bookshelf
			if (enchant.silk) return [[id, 1, 0]];
			return [[340, 3, 0]];
		}
		if (id == 55) return [[331, 1, 0]]; // redstone wire
		if (id == 60) return [[3, 1, 0]]; // farmland
		if (id == 63 || id == 68) return [[338, 1, 0]]; // sign
		if (id == 64) return [[324, 1, 0]]; // door
		if (id == 75 || id == 76) return [[76, 1, 0]]; // redstone torch
		if (id == 79) { // ice
			if (enchant.silk) return [[id, 1, 0]];
			return [];
		}
		if (id == 83) return [[338, 1, 0]]; // sugar canes
		if (id == 89) return [[348, Math.floor(Math.random() * 3 + 2), 0]]; // glowstone
		if (id == 93 || id == 94) return [[356, 1, 0]]; // repeater
		if (id == 103) return [[360, Math.floor(Math.random() * 4 + 4), 0]]; // melon
		if (id == 123 || id == 124) return [[123, 1, 0]]; // redstone lamp
		if (id == 140) return [[390, 1, 0]]; // pot
		if (id == 149 || id == 150) return [[404, 1, 0]]; // comparator
		if (id == 151 || id == 178) return [[151, 1, 0]]; // daylight detector
		// doors
		if (id == 193) return [[427, 1, 0]];
		if (id == 194) return [[428, 1, 0]];
		if (id == 195) return [[429, 1, 0]];
		if (id == 196) return [[430, 1, 0]];
		if (id == 197) return [[431, 1, 0]];

		if (id == 393) return [[335, 1, 0]]; // kelp
		if (id == VanillaTileID.campfire) {
			if (enchant.silk) return [[id, 1, 0]];
			const item = IDConverter.getIDData("charcoal");
			return [[item.id, 1, item.data]];
		}
		if (id == VanillaTileID.soul_campfire) {
			if (enchant.silk) return [[id, 1, 0]];
			return [[VanillaTileID.soul_soil, 1, 0]];
		}
		// signs
		if (id == 436 || id == 437) return [[472, 1, 0]];
		if (id == 441 || id == 442) return [[473, 1, 0]];
		if (id == 443 || id == 444) return [[474, 1, 0]];
		if (id == 445 || id == 446) return [[475, 1, 0]];
		if (id == 447 || id == 448) return [[476, 1, 0]];
		if (id == 467) return [[-212, 1, data]]; // wood
		if (noDropBlocks.indexOf(id) != -1) return [];

		return [[Block.convertBlockToItemId(id), 1, 0]];
	}

	// default block types
	createBlockType("opaque", {
		baseBlock: 1,
		solid: true,
        lightOpacity: 15,
        explosionResistance: 4,
        renderLayer: 2,
        translucency: 0,
        sound: "stone"
	}, true);

	createBlockType("stone", {
		extends: "opaque",
		destroyTime: 1.5,
		explosionResistance: 30
	});

	createBlockType("ore", {
		extends: "opaque",
		destroyTime: 3,
		explosionResistance: 15
	});

	createBlockType("wood", {
		extends: "opaque",
		baseBlock: 17,
		destroyTime: 2,
		explosionResistance: 10,
		sound: "wood"
	});

	createBlockType("leaves", {
		baseBlock: 18,
		destroyTime: 0.2,
		explosionResistance: 1,
		renderAllFaces: true,
		renderLayer: 1,
		lightOpacity: 1,
		translucency: 0.5,
		sound: "grass"
	});

	createBlockType("dirt", {
		extends: "opaque",
		baseBlock: 2,
		destroyTime: 0.5,
		explosionResistance: 2.5,
		sound: "gravel"
	});
}