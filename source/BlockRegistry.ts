namespace BlockRegistry {
	export function createBlock(nameID: string, defineData: Block.BlockVariation[], blockType?: string | Block.SpecialType): number {
		let numericID = IDRegistry.genBlockID(nameID);
		Block.createBlock(nameID, defineData, blockType);
		return numericID;
	}

    export function getBlockRotation(player: number, hasVertical?: boolean): number {
		let pitch = EntityGetPitch(player);
		if (hasVertical) {
			if (pitch < -45) return 0;
			if (pitch > 45) return 1;
		}
		let rotation = Math.floor((EntityGetYaw(player) - 45)%360 / 90);
		if (rotation < 0) rotation += 4;
		rotation = [5, 3, 4, 2][rotation];
		return rotation;
	}

	export function setRotationFunction(id: string | number, hasVertical?: boolean, placeSound?: string): void {
		Block.registerPlaceFunction(id, function(coords, item, block, player, region) {
			let place = World.canTileBeReplaced(block.id, block.data) ? coords : coords.relative;
			let rotation = getBlockRotation(player, hasVertical);
			region.setBlock(place.x, place.y, place.z, item.id, rotation);
			//World.playSound(place.x, place.y, place.z, placeSound || "dig.stone", 1, 0.8);
			return place;
		});
	}

    export function createBlockWithRotation(stringID: string, params: Block.BlockVariation, blockType?: string | Block.SpecialType, hasVertical?: boolean): void {
        let texture = params.texture;
        let textures = [
			[texture[3], texture[2], texture[0], texture[1], texture[4], texture[5]],
			[texture[2], texture[3], texture[1], texture[0], texture[5], texture[4]],
			[texture[0], texture[1], texture[3], texture[2], texture[5], texture[4]],
			[texture[0], texture[1], texture[2], texture[3], texture[4], texture[5]],
			[texture[0], texture[1], texture[4], texture[5], texture[3], texture[2]],
			[texture[0], texture[1], texture[5], texture[4], texture[2], texture[3]]
		]
		let variations = [];
		for (let i = 0; i < textures.length; i++) {
			variations.push({name: params.name, texture: textures[i], inCreative: params.inCreative && i == 0});
		}
		let numericID = createBlock(stringID, variations, blockType);
		let render = new ICRender.Model();
		let model = BlockRenderer.createTexturedBlock(texture);
		render.addEntry(model);
		ItemModel.getFor(numericID, 0).setHandModel(model);
		ItemModel.getFor(numericID, 0).setUiModel(model);
        setRotationFunction(numericID, hasVertical);
    }

    export function registerDrop(nameID: string | number, dropFunc: Block.DropFunction, level?: number): void {
        Block.registerDropFunction(nameID, function(blockCoords, blockID, blockData, diggingLevel, enchant, item, region) {
            if (!level || diggingLevel >= level) {
                return dropFunc(blockCoords, blockID, blockData, diggingLevel, enchant, item, region);
            }
            return [];
        });
        addBlockDropOnExplosion(nameID);
    }

    export function setDestroyLevel(nameID: string | number, level: number): void {
        Block.registerDropFunction(nameID, function(сoords, blockID, blockData, diggingLevel) {
            if (diggingLevel >= level) {
                return [[Block.getNumericId(nameID), 1, 0]];
            }
        });
        addBlockDropOnExplosion(nameID);
    }

    export function addBlockDropOnExplosion(nameID: string | number) {
		Block.registerPopResourcesFunction(nameID, function(coords, block, region) {
			if (Math.random() >= 0.25) return;
            let dropFunc = Block.getDropFunction(block.id);
            let enchant = ToolAPI.getEnchantExtraData();
            let item = new ItemStack();
            //@ts-ignore
            let drop = dropFunc(coords, block.id, block.data, 127, enchant, item, region);
            for (let i in drop) {
                region.spawnDroppedItem(coords.x + .5, coords.y + .5, coords.z + .5, drop[i][0], drop[i][1], drop[i][2], drop[i][3] || null);
            }
		});
	}
}