/**
 * Class to work with world based on `BlockSource`
 */
class WorldRegion {
	readonly blockSource: BlockSource;
	private readonly isDeprecated: boolean;

	constructor(blockSource: BlockSource) {
		this.blockSource = blockSource;
		this.isDeprecated = BlockEngine.getMainGameVersion() < 16;
	}

	/**
	 * @returns interface to given dimension 
	 * (null if given dimension is not loaded and this interface 
	 * was not created yet).
	 */
	static getForDimension(dimension: number): Nullable<WorldRegion> {
		const blockSource = BlockSource.getDefaultForDimension(dimension);
		if (blockSource) {
			return new WorldRegion(blockSource);
		}
		return null;
	}

	/**
	 * @returns interface to the dimension where the given entity is 
	 * (null if given entity does not exist or the dimension is not loaded 
	 * and interface was not created).
	 */
	static getForActor(entityUid: number): Nullable<WorldRegion> {
		const blockSource = BlockSource.getDefaultForActor(entityUid);
		if (blockSource) {
			return new WorldRegion(blockSource);
		}
		return null;
	}

	/**
	 * @returns `WorldRegion` for world generation callback.
	 */
	static getCurrentWorldGenRegion(): Nullable<WorldRegion> {
		const blockSource = BlockSource.getCurrentWorldGenRegion();
		if (blockSource) {
			return new WorldRegion(blockSource);
		}
		return null;
	}

	/**
	 * @returns the dimension id to which the following object belongs.
	 */
	getDimension(): number {
		return this.blockSource.getDimension();
	}

	/**
	 * @returns BlockState object of the block at coords
	 */
	getBlock(coords: Vector): BlockState;
	getBlock(x: number, y: number, z: number): BlockState;
	getBlock(x: any, y?: number, z?: number): BlockState {
		if (typeof x === "number") {
			return this.blockSource.getBlock(x, y, z);
		}
		const pos = x;
		return this.blockSource.getBlock(pos.x, pos.y, pos.z);
	}

	/**
	 * @returns block's id at coords.
	 */
	getBlockId(coords: Vector): number;
	getBlockId(x: number, y: number, z: number): number;
	getBlockId(x: any, y?: number, z?: number): number {
		return this.getBlock(x, y, z).id;
	}

	/**
	 * @returns block's data at coords.
	 */
	getBlockData(coords: Vector): number;
	getBlockData(x: number, y: number, z: number): number;
	getBlockData(x: any, y?: number, z?: number): number {
		return this.getBlock(x, y, z).data;
	}

	/**
	 * Sets block on coords.
	 */
	setBlock(coords: Vector, state: BlockState | Tile): void;
	setBlock(coords: Vector, id: number, data?: number): void;
	setBlock(x: number, y: number, z: number, state: BlockState | Tile): void;
	setBlock(x: number, y: number, z: number, id: number, data?: number): void;
	setBlock(x: any, y: any, z?: any, id?: any, data?: any): void {
		if (typeof x === "number") {
			if (typeof id == "number") {
				this.blockSource.setBlock(x, y, z, id, data || 0);
			} else {
				this.blockSource.setBlock(x, y, z, id);
			}
		} else {
			const pos = x;
			if (typeof arguments[1] == "number") {
				this.blockSource.setBlock(pos.x, pos.y, pos.z, arguments[1], arguments[2] || 0);
			} else {
				this.blockSource.setBlock(pos.x, pos.y, pos.z, arguments[1]);
			}
		}
	}

	/**
	 * Doesn't support Legacy version.
	 * @returns [[BlockState]] object of the extra block on given coords
	 */
	getExtraBlock(coords: Vector): BlockState;
	getExtraBlock(x: number, y: number, z: number): BlockState;
	getExtraBlock(x: any, y?: number, z?: number): BlockState {
		if (this.isDeprecated) {
			return {id: 0, data: 0} as any;
		}

		if (typeof x === "number") {
			return this.blockSource.getExtraBlock(x, y, z);
		}
		const pos = x;
		return this.blockSource.getExtraBlock(pos.x, pos.y, pos.z);
	}

	/**
	 * Sets extra block (for example, water inside another blocks) on given coords by given id and data.
	 * Doesn't support Legacy version.
	 */
	setExtraBlock(coords: Vector, state: BlockState): void;
	setExtraBlock(coords: Vector, id: number, data?: number): void;
	setExtraBlock(x: number, y: number, z: number, id: number, data?: number): void;
	setExtraBlock(x: number, y: number, z: number, state: BlockState): void;
	setExtraBlock(x: any, y: any, z?: any, id?: any, data?: any): void {
		if (this.isDeprecated) return;

		if (typeof x === "number") {
			if (typeof id == "number") {
				this.blockSource.setExtraBlock(x, y, z, id, data || 0);
			} else {
				this.blockSource.setExtraBlock(x, y, z, id);
			}
		} else {
			const pos = x;
			if (typeof arguments[1] == "number") {
				this.blockSource.setExtraBlock(pos.x, pos.y, pos.z, arguments[1], arguments[2] || 0);
			} else {
				this.blockSource.setExtraBlock(pos.x, pos.y, pos.z, arguments[1]);
			}
		}
	}

	/**
	 * Destroys block on coords producing appropriate drop and particles.
	 * @param coords coords of the block
	 * @param drop whether to provide drop for the block or not
	 * @param player player entity if the block was destroyed by player
	 */
	destroyBlock(coords: Vector, drop?: boolean, player?: number): void;
	destroyBlock(x: number, y: number, z: number, drop?: boolean, player?: number): void;
	destroyBlock(x: any, y: any, z: any, drop?: any, player?: any): void {
		if (typeof x === "object") {
			const pos = x;
			return this.destroyBlock(pos.x, pos.y, pos.z, arguments[1], arguments[2]);
		}

		if (drop) {
			const block = this.getBlock(x, y, z);
			const item = player ? Entity.getCarriedItem(player) : new ItemStack();
			const result = Block.getBlockDropViaItem(block, item, new Vector3(x, y, z), this.blockSource);
			if (result) {
				for (let dropItem of result) {
					this.dropItem(x + .5, y + .5, z + .5, dropItem[0], dropItem[1], dropItem[2], dropItem[3] || null);
				}
			}
			this.blockSource.destroyBlock(x, y, z, !result);
		} else {
			this.blockSource.destroyBlock(x, y, z, false);
		}
	}

	/**
	 * Destroys block on coords by entity using specified item.
	 * Partially reverse compatible with Legacy version (doesn't support `item` argument).
	 * @param coords coords of the block
	 * @param allowDrop whether to provide drop for the block or not
	 * @param entity Entity id or -1 id if entity is not specified
	 * @param item Tool which broke block
	 */
	breakBlock(coords: Vector, allowDrop: boolean, entity: number, item: ItemInstance): void;
	breakBlock(x: number, y: number, z: number, allowDrop: boolean, entity: number, item: ItemInstance): void;
	breakBlock(x: any, y: any, z: any, allowDrop: any, entity?: number, item?: ItemInstance): void {
		if (this.isDeprecated) {
			this.destroyBlock(x, y, z, allowDrop, entity);
		}
		else if (typeof x === "number") {
			this.blockSource.breakBlock(x, y, z, allowDrop, entity, item);
		}
		else {
			const pos = x;
			this.blockSource.breakBlock(pos.x, pos.y, pos.z, arguments[1], arguments[2], arguments[3]);
		}
	}

	/**
	 * Same as breakBlock, but returns object containing drop and experince.
	 * Partially reverse compatible with Legacy version (doesn't return experience).
	 * @param coords coords of the block
	 * @param entity Entity id or -1 id if entity is not specified
	 * @param item Tool which broke block
	 */
	breakBlockForResult(coords: Vector, entity: number, item: ItemInstance): {items: ItemInstance[], experience: number};
	breakBlockForResult(x: number, y: number, z: number, entity: number, item: ItemInstance): {items: ItemInstance[], experience: number};
	breakBlockForResult(x: any, y: any, z: any, entity?: number, item?: ItemInstance): {items: ItemInstance[], experience: number} {
		if (typeof x === "object") {
			const pos = x;
			return this.breakBlockForResult(pos.x, pos.y, pos.z, arguments[1], arguments[2]);
		}

		if (this.isDeprecated) {
			const block = this.blockSource.getBlock(x, y, z);
			this.blockSource.setBlock(x, y, z, 0, 0);
			const level = ToolAPI.getToolLevelViaBlock(item.id, block.id);
			const drop = BlockRegistry.getBlockDrop(x, y, z, block, level, item, this.blockSource);
			const items: ItemInstance[] = [];
			if (drop) {
				for (let item of drop) {
					items.push(new ItemStack(item[0], item[1], item[2], item[3]));
				}
			}
			return {items: items, experience: 0};
		}
		return this.blockSource.breakBlockForJsResult(x, y, z, entity, item);
	}

	/**
	 * @returns interface to the vanilla TileEntity (chest, furnace, etc.) on the coords.
	 */
	getNativeTileEntity(coords: Vector): NativeTileEntity;
	getNativeTileEntity(x: number, y: number, z: number): NativeTileEntity;
	getNativeTileEntity(x: Vector | number, y?: number, z?: number): NativeTileEntity {
		if (typeof x === "number") {
			return this.blockSource.getBlockEntity(x, y, z);
		}
		const pos = x;
		return this.blockSource.getBlockEntity(pos.x, pos.y, pos.z);
	}

	/**
     * @returns TileEntity located on the specified coordinates if it is initialized.
     */
	getTileEntity(coords: Vector): TileEntity;
	getTileEntity(x: number, y: number, z: number): TileEntity;
	getTileEntity(x: Vector | number, y?: number, z?: number): TileEntity {
		if (typeof x === "number") {
			const tileEntity = TileEntity.getTileEntity(x, y, z, this.blockSource);
			return (tileEntity && tileEntity.__initialized) ? tileEntity : null;
		}
		const pos = x;
		return this.getTileEntity(pos.x, pos.y, pos.z);
	}

	/**
     * If the block on the specified coordinates is a TileEntity block and is 
     * not initialized, initializes it and returns created TileEntity object.
     * @returns TileEntity if one was created, null otherwise.
     */
	addTileEntity(coords: Vector): TileEntity;
	addTileEntity(x: number, y: number, z: number): TileEntity;
	addTileEntity(x: Vector | number, y?: number, z?: number): TileEntity {
		if (typeof x === "number") {
			return TileEntity.addTileEntity(x, y, z, this.blockSource);
		}
		const pos = x;
		return this.addTileEntity(pos.x, pos.y, pos.z);
	}

	/**
     * If the block on the specified coordinates is a TileEntity, destroys 
     * it, dropping its container.
     * @returns true if the TileEntity was destroyed successfully, false 
     * otherwise.
     */
	removeTileEntity(coords: Vector): boolean;
	removeTileEntity(x: number, y: number, z: number): boolean;
	removeTileEntity(x: Vector | number, y?: number, z?: number): boolean {
		if (typeof x === "number") {
			return TileEntity.destroyTileEntityAtCoords(x, y, z, this.blockSource);
		}
		const pos = x;
		return this.removeTileEntity(pos.x, pos.y, pos.z);
	}

	/**
     * @returns if the block on the specified coordinates is a `TileEntity`, returns
     * its container, if the block is a `NativeTileEntity`, returns its instance, if 
     * none of above, returns null.
     */
	getContainer(coords: Vector): NativeTileEntity | UI.Container | ItemContainer;
	getContainer(x: number, y: number, z: number): NativeTileEntity | UI.Container | ItemContainer;
	getContainer(x: Vector | number, y?: number, z?: number): NativeTileEntity | UI.Container | ItemContainer {
		if (typeof x === "number") {
			return World.getContainer(x, y, z, this.blockSource);
		}
		const pos = x;
		return this.getContainer(pos.x, pos.y, pos.z);
	}

	/**
	 * Causes an explosion on coords.
	 * @param power defines radius of the explosion and what blocks it can destroy
	 * @param fire if true, puts the crater on fire
	 */
	explode(coords: Vector, power: number, fire?: boolean): void;
	explode(x: number, y: any, z: any, power: number, fire?: boolean): void;
	explode(x: Vector | number, y: any, z: any, power?: number, fire?: boolean): void {
		if (typeof x === "number") {
			this.blockSource.explode(x, y, z, power, fire || false);
		} else {
			const pos = x;
			this.blockSource.explode(pos.x, pos.y, pos.z, arguments[1], arguments[2] || false);
		}
	}

	/**
	 * @returns biome id at X and Z coord.
	 */
	getBiome(x: number, z: number): number {
		return this.blockSource.getBiome(x, z);
	}

	/**
	 * Sets biome id by coords.
	 * @param biomeID - id of the biome to set
	 */
	setBiome(x: number, z: number, biomeID: number): void {
		this.blockSource.setBiome(x, z, biomeID);
	}

	/**
	 * @returns temperature of the biome on coords.
	 */
	getBiomeTemperatureAt(coords: Vector): number;
	getBiomeTemperatureAt(x: number, y: number, z: number): number;
	getBiomeTemperatureAt(x: Vector | number, y?: number, z?: number): number {
		if (typeof x === "number") {
			return this.blockSource.getBiomeTemperatureAt(x, y, z);
		}
		const pos = x;
		return this.blockSource.getBiomeTemperatureAt(pos.x, pos.y, pos.z);
	}

	/**
	 * @param chunkX X coord of the chunk
	 * @param chunkZ Z coord of the chunk
	 * @returns true if chunk is loaded, false otherwise.
	 */
	isChunkLoaded(chunkX: number, chunkZ: number): boolean {
		return this.blockSource.isChunkLoaded(chunkX, chunkZ);
	}

	/**
	 * @param x X coord of the position
	 * @param z Z coord of the position
	 * @returns true if chunk on the position is loaded, false otherwise.
	 */
	isChunkLoadedAt(x: number, z: number): boolean {
		return this.blockSource.isChunkLoadedAt(x, z);
	}

	/**
	 * @param chunkX X coord of the chunk
	 * @param chunkZ Z coord of the chunk
	 * @returns the loading state of the chunk by chunk coords.
	 */
	getChunkState(chunkX: number, chunkZ: number): number {
		return this.blockSource.getChunkState(chunkX, chunkZ);
	}

	/**
	 * @param x X coord of the position
	 * @param z Z coord of the position
	 * @returns the loading state of the chunk by coords.
	 */
	getChunkStateAt(x: number, z: number): number {
		return this.blockSource.getChunkStateAt(x, z);
	}

	/**
     * @returns light level on the specified coordinates, from 0 to 15.
     */
	getLightLevel(coords: Vector): number;
	getLightLevel(x: number, y: number, z: number): number;
	getLightLevel(x: Vector | number, y?: number, z?: number): number {
		if (typeof x === "number") {
			return this.blockSource.getLightLevel(x, y, z);
		}
		const pos = x;
		return this.blockSource.getLightLevel(pos.x, pos.y, pos.z);
	}

	/**
	 * @returns whether the sky can be seen from coords
	 */
	canSeeSky(coords: Vector): boolean;
	canSeeSky(x: number, y: number, z: number): boolean;
	canSeeSky(x: Vector | number, y?: number, z?: number): boolean {
		if (typeof x === "number") {
			return this.blockSource.canSeeSky(x, y, z);
		}
		const pos = x;
		return this.blockSource.canSeeSky(pos.x, pos.y, pos.z);
	}

	/**
	 * @returns grass color on coords
	 */
	getGrassColor(coords: Vector): number;
	getGrassColor(x: number, y: number, z: number): number;
	getGrassColor(x: Vector | number, y?: number, z?: number): number {
		if (typeof x === "number") {
			return this.blockSource.getGrassColor(x, y, z);
		}
		const pos = x;
		return this.blockSource.getGrassColor(pos.x, pos.y, pos.z);
	}

	/**
	 * Creates dropped item and returns entity id
	 * @param coords coords of the place where item will be dropped
	 * @param item item to drop
	 * @returns drop entity id
	 */
	dropItem(coords: Vector, item: ItemInstance): number;
	dropItem(coords: Vector, id: number, count?: number, data?: number, extra?: ItemExtraData): number;
	dropItem(x: number, y: number, z: number, item: ItemInstance): number;
	dropItem(x: number, y: number, z: number, id: number, count?: number, data?: number, extra?: ItemExtraData): number;
	dropItem(x: any, y: any, z?: any, id?: any, count?: any, data?: any, extra?: ItemExtraData): number {
		if (typeof x == "object") {
			const pos = x;
			if (typeof y == "object") {
				const item = y;
				return this.dropItem(pos.x, pos.y, pos.z, item);
			}
			return this.dropItem(pos.x, pos.y, pos.z, arguments[1], arguments[2], arguments[3], arguments[4]);
		}
		if (typeof id == "object") {
			const item = id;
			return this.dropItem(x, y, z, item.id, item.count, item.data, item.extra);
		}
		return this.blockSource.spawnDroppedItem(x, y, z, id, count || 1, data || 0, extra || null);
	}
	/**
	 * Creates dropped item at the block center and returns entity id
	 * @param coords coords of the block where item will be dropped
	 * @param item item to drop
	 * @returns drop entity id
	 */
	dropAtBlock(coords: Vector, item: ItemInstance): number;
	dropAtBlock(coords: Vector, id: number, count: number, data: number, extra?: ItemExtraData): number;
	dropAtBlock(x: number, y: number, z: number, item: ItemInstance): number;
	dropAtBlock(x: number, y: number, z: number, id: number, count: number, data: number, extra?: ItemExtraData): number;
	dropAtBlock(x: any, y: any, z?: any, id?: any, count?: any, data?: any, extra?: any): number {
		if (typeof x == "object") {
			const pos = x;
			return this.dropItem(pos.x + .5, pos.y + .5, pos.z + .5, arguments[1], arguments[2], arguments[3], arguments[4]);
		}
		return this.dropItem(x + .5, y + .5, z + .5, id, count, data, extra);
	}

	/**
	 * Spawns entity of given type on coords.
	 * @param type entity numeric or string type
	 */
	spawnEntity(x: number, y: number, z: number, type: number | string): number;
	/**
	 * Spawns entity of given type on coords with specified spawn event.
	 * @param namespace namespace of the entity type: 'minecraft' or from add-on.
	 * @param type entity type name
	 * @param spawnEvent built-in event for entity spawn. Use 'minecraft:entity_born' to spawn baby mob.
	 */
	spawnEntity(x: number, y: number, z: number, namespace: string, type: string, spawnEvent: string): number;
	spawnEntity(x: number, y: number, z: number, namespace: string, type?: string, spawnEvent?: string): number {
		if (type === undefined) {
			return this.blockSource.spawnEntity(x, y, z, namespace);
		}
		return this.blockSource.spawnEntity(x, y, z, namespace, type, spawnEvent);
	}

	/**
	 * Spawns experience orbs on coords.
	 * @param amount experience amount
	 */
	spawnExpOrbs(coords: Vector, amount: number): void;
	spawnExpOrbs(x: any, y: number, z: number, amount: number): void;
	spawnExpOrbs(x: any, y: number, z?: number, amount?: number): void {
		if (typeof x == "object") {
			const pos = x;
			this.spawnExpOrbs(pos.x, pos.y, pos.z, arguments[1]);
		}
		this.blockSource.spawnExpOrbs(x, y, z, amount);
	}

	/**
	 * @returns the list of entity IDs in given box,
	 * that are equal to the given type, if blacklist value is false,
	 * and all except the entities of the given type, if blacklist value is true.
	 */
	listEntitiesInAABB(pos1: Vector, pos2: Vector, type?: number, blacklist?: boolean): number[];
	listEntitiesInAABB(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, type?: number, blacklist?: boolean): number[];
	listEntitiesInAABB(x1: any, y1: any, z1?: any, x2?: any, y2?: number, z2?: number, type: number = -1, blacklist: boolean = true): number[] {
		if (typeof x1 == "object") {
			const pos1 = x1, pos2 = y1;
			return this.listEntitiesInAABB(pos1.x, pos1.y, pos1.z, pos2.x, pos2.y, pos2.z, z1, x2);
		}
		const entities = this.blockSource.listEntitiesInAABB(x1, y1, z1, x2, y2, z2, type, blacklist);
		if (this.isDeprecated && (type == Native.EntityType.PLAYER) != blacklist) {
			const players = Network.getConnectedPlayers();
			const dimension = this.getDimension();
			for (const ent of players) {
				if (Entity.getDimension(ent) != dimension) continue;
				const c = Entity.getPosition(ent);
				if ((c.x >= x1 && c.x <= x2) && (c.y - 1.62 >= y1 && c.y - 1.62 <= y2) && (c.z >= z1 && c.z <= z2)) {
					entities.push(ent);
				}
			}
		}
		return entities;
	}

	/**
     * Plays standard Minecraft sound on the specified coordinates.
     * @param name sound name
     * @param volume sound volume from 0 to 1. Default is 1.
     * @param pitch sound pitch, from 0 to 1. Default is 1.
     */
	playSound(x: number, y: number, z: number, name: string, volume?: number, pitch?: number): void;
	playSound(coords: Vector, name: string, volume?: number, pitch?: number): void;
	playSound(x: any, y: any, z: any, name: any, volume?: number, pitch?: number): void {
		if (typeof(x) == "number") {
			const soundPos = new Vector3(x, y, z);
			this.playSound(soundPos, name, volume, pitch)
		} else {
			const coords = arguments[0];
			this.sendPacketInRadius(coords, 100, "WorldRegion.play_sound", {
				...coords,
				name: arguments[1],
				volume: arguments[2] ?? 1,
				pitch: arguments[3] ?? 1
			});
		}
	}

	/**
     * Plays standard Minecraft sound from the specified entity.
	 * @param ent entity id
     * @param name sound name
     * @param volume sound volume from 0 to 1. Default is 1.
     * @param pitch sound pitch, from 0 to 1. Default is 1.
     */
	playSoundAtEntity(ent: number, name: string, volume: number = 1, pitch: number = 1): void {
		const soundPos = Entity.getPosition(ent);
		this.sendPacketInRadius(soundPos, 100, "WorldRegion.play_sound_at", {ent: ent, name: name, volume: volume, pitch: pitch})
	}

	/**
	 * Sends network packet for players within a radius from specified coords.
	 * @param coords coordinates from which players will be searched
	 * @param radius radius within which players will receive packet
	 * @param packetName name of the packet to send
	 * @param data packet data object
	 */
	sendPacketInRadius(coords: Vector, radius: number, packetName: string, data: object): void {
		const dimension = this.getDimension();
		const clientsList = Network.getConnectedClients();
		for (const client of clientsList) {
			const player = client.getPlayerUid();
			const entPos = Entity.getPosition(player);
			if (Entity.getDimension(player) == dimension && Entity.getDistanceBetweenCoords(entPos, coords) <= radius) {
				client.send(packetName, data);
			}
		}
	}
}

Network.addClientPacket("WorldRegion.play_sound", function(data: {x: number, y: number, z: number, name: string, volume: number, pitch: number}) {
	World.playSound(data.x, data.y, data.z, data.name, data.volume, data.pitch);
});

Network.addClientPacket("WorldRegion.play_sound_at", function(data: {ent: number, name: string, volume: number, pitch: number}) {
	World.playSoundAtEntity(data.ent, data.name, data.volume, data.pitch);
});
