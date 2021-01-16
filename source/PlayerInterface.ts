class PlayerInterface {
    playerActor: PlayerActor;
    playerUid: number;

	constructor(playerUid: number) {
        this.playerActor = new PlayerActor(playerUid);
        this.playerUid = playerUid;
	}

    /**
     * @returns player's unique numeric entity id
     */
    getUid(): number {
		return this.playerUid;
	}

    /**
     * @returns the id of dimension where player is.
     */
    getDimension(): number {
        return this.playerActor.getDimension();
    }

    /**
     * @returns player's gamemode.
     */
    getGameMode(): number {
        return this.playerActor.getGameMode();
    }

    /**
     * Adds item to player's inventory
     * @param dropRemainings if true, surplus will be dropped near player
     */
    addItemToInventory(id: number, count: number, data: number, extra: ItemExtraData = null): void {
        this.playerActor.addItemToInventory(id, count, data, extra, true);
    }

    /**
     * @returns inventory slot's contents.
     */
    getInventorySlot(slot: number): ItemInstance {
        return this.playerActor.getInventorySlot(slot);
    }

    /**
     * Sets inventory slot's contents.
     */
    setInventorySlot(slot: number, id: number, count: number, data: number, extra: ItemExtraData = null): void {
        this.playerActor.setInventorySlot(slot, id, count, data, extra);
    }

    /**
     * @returns item in player's hand
    */
    getCarriedItem(): ItemInstance {
        return Entity.getCarriedItem(this.getUid());
    }

    /**
     * Sets item in player's hand
     * @param id item id
     * @param count item count
     * @param data item data
     * @param extra item extra
     */
    setCarriedItem(id: number, count: number, data: number, extra: ItemExtraData = null): void {
        Entity.setCarriedItem(this.getUid(), id, count, data, extra);
    }

    /**
     * Decreases carried item count by specified number
     * @param amount amount of items to decrease, default is 1
     */
    decreaseCarriedItem(amount: number = 1) {
        let item = this.getCarriedItem();
        this.setCarriedItem(item.id, item.count - amount, item.data, item.extra);
    }

    /**
     * @returns armor slot's contents.
     */
    getArmor(slot: number): ItemInstance {
        return this.playerActor.getArmor(slot);
    }

    /**
     * Sets armor slot's contents.
     */
    setArmor(slot: number, id: number, count: number, data: number, extra: ItemExtraData = null): void {
        this.playerActor.setArmor(slot, id, count, data, extra);
    }

    /**
     * Sets respawn coords for the player.
     */
    setRespawnCoords(x: number, y: number, z: number): void {
        this.playerActor.setRespawnCoords(x, y, z);
    }

    /**
     * Spawns exp on coords.
     * @param value experience points value
     */
    spawnExpOrbs(x: number, y: number, z: number, value: number): void {
        this.playerActor.spawnExpOrbs(x, y, z, value);
    }

    /**
     * @returns whether the player is a valid entity.
     */
    isValid(): boolean {
        return this.playerActor.isValid();
    }

    /**
     * @returns player's selected slot.
     */
    getSelectedSlot(): number {
        return this.playerActor.getSelectedSlot();
    }

    /**
     * Sets player's selected slot.
     */
    setSelectedSlot(slot: number): void {
        this.playerActor.setSelectedSlot(slot);
    }

    /**
     * @returns player's experience.
     */
    getExperience(): number {
        return this.playerActor.getExperience();
    }

    /**
     * Sets player's experience.
     */
    setExperience(value: number): void {
        this.playerActor.setExperience(value);
    }

    /**
     * Add experience to player.
     */
    addExperience(amount: number): void {
        this.playerActor.addExperience(amount);
    }

    /**
     * @returns player's xp level.
     */
    getLevel(): number {
        return this.playerActor.getLevel();
    }

    /**
     * Sets player's xp level.
     */
    setLevel(level: number): void {
        this.playerActor.setLevel(level);
    }

    /**
     * @returns player's exhaustion.
     */
    getExhaustion(): number {
        return this.playerActor.getExhaustion();
    }

    /**
     * Sets player's exhaustion.
     */
    setExhaustion(value: number): void {
        this.playerActor.setExhaustion(value);
    }

    /**
     * @returns player's hunger.
     */
    getHunger(): number {
        return this.playerActor.getHunger();
    }

    /**
     * Sets player's hunger.
     */
    setHunger(value: number): void {
        this.playerActor.setHunger(value);
    }

    /**
     * @returns player's saturation.
     */
    getSaturation(): number {
        return this.playerActor.getSaturation();
    }

    /**
     * Sets player's saturation.
     */
    setSaturation(value: number): void {
        this.playerActor.setSaturation(value);
    }

    /**
     * @returns player's score.
     */
    getScore(): number {
        return this.playerActor.getScore();
    }

    /**
     * Sets player's score.
     */
    setScore(value: number): void {
        this.playerActor.setScore(value);
    }
}