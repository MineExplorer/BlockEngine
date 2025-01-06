/**
 * API to store temporary data about the block.
 */
namespace VirtualBlockData {
    let cacheMap = {};

    function getKey(dimension: number, x: number, y: number, z: number) {
        return `${dimension}/${x},${y},${z}`;
    }

    export function getBlockEntry(dimension: number, x: number, y: number, z: number): any {
        return cacheMap[getKey(dimension, x, y, z)] || null;
    }

    export function addBlockEntry(entry: object, dimension: number, x: number, y: number, z: number): void {
        cacheMap[getKey(dimension, x, y, z)] = entry;
    }

    export function removeBlockEntry(dimension: number, x: number, y: number, z: number): void {
        delete cacheMap[getKey(dimension, x, y, z)];
    }

    Callback.addCallback("LevelLeft", function() {
        cacheMap = {};
    });

    Callback.addCallback("BreakBlock", function(blockSource: BlockSource, coords: Vector) {
        if (Game.isActionPrevented()) {
            return;
        }
        removeBlockEntry(blockSource.getDimension(), coords.x, coords.y, coords.z);
    }, -1);
}