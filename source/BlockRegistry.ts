namespace BlockRegistry {
    export function registerDrop(nameID: string | number, dropFunc: Block.DropFunction): void {
        Block.registerDropFunction(nameID, dropFunc);
        addBlockDropOnExplosion(nameID);
    }

    export function setDestroyLevel(nameID: string | number, level: number): void {
        Block.registerDropFunction(nameID, function(blockCoords, blockID, blockData, diggingLevel) {
            if (diggingLevel >= level) {
                return [
                    [Block.getNumericId(nameID), 1, 0]
                ];
            }
        }, level);
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