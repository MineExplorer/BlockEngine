/**
 * Class to manipulate player based on `PlayerActor`.
 * Due to limitations of underlying PlayerActor class this class
 * can be used only during 1 server tick!
 */
class PlayerEntity {
    readonly actor: PlayerActor;
    private readonly playerUid: number;

    /**
     * Creates new instance of `PlayerEntity`.
     * @param playerUid player's numeric entity id
     */
	constructor(playerUid: number) {
        this.actor = new PlayerActor(playerUid);
        this.playerUid = playerUid;
	}

    /**
     * @returns player's unique numeric entity id.
     */
    getUid(): number {
		return this.playerUid;
	}

    /**
     * @returns the id of dimension where player is.
     */
    getDimension(): number {
        return this.actor.getDimension();
    }

    /**
     * @returns player's gamemode.
     */
    getGameMode(): number {
        return this.actor.getGameMode();
    }

    /**
     * Adds item to player's inventory. Drops surplus items near player. 
     */
    addItemToInventory(item: ItemInstance): void;
    addItemToInventory(id: number, count: number, data: number, extra?: ItemExtraData): void;
    addItemToInventory(id: any, count?: number, data?: number, extra?: ItemExtraData): void {
        const item = id;
        if (typeof item == "object") {
            this.actor.addItemToInventory(item.id, item.count, item.data, item.extra || null, true);
        } else {
            this.actor.addItemToInventory(id, count, data, extra || null, true);
        }
    }

    /**
     * @returns inventory slot's contents.
     */
    getInventorySlot(slot: number): ItemStack {
        const item = this.actor.getInventorySlot(slot);
        return new ItemStack(item);
    }

    /**
     * Sets inventory slot's contents.
     */
    setInventorySlot(slot: number, item: ItemInstance): void;
    setInventorySlot(slot: number, id: number, count: number, data: number, extra?: ItemExtraData): void;
    setInventorySlot(slot: number, item: any, count?: number, data?: number, extra: ItemExtraData = null): void {
        if (typeof item == "object") {
            this.actor.setInventorySlot(slot, item.id, item.count, item.data, item.extra || null);
        } else {
            this.actor.setInventorySlot(slot, item, count, data, extra);
        }
    }

    /**
     * @returns item in player's hand
    */
    getCarriedItem(): ItemStack {
        const item = Entity.getCarriedItem(this.getUid());
        return new ItemStack(item);
    }

    /**
     * Sets item in player's hand.
     */
    setCarriedItem(item: ItemInstance): void;
    setCarriedItem(id: number, count: number, data: number, extra?: ItemExtraData): void;
    setCarriedItem(item: any, count?: number, data?: number, extra: ItemExtraData = null): void {
        if (typeof item == "object") {
            Entity.setCarriedItem(this.getUid(), item.id, item.count, item.data, item.extra);
        } else {
            Entity.setCarriedItem(this.getUid(), item, count, data, extra);
        }
    }

    /**
     * Decreases carried item count by specified number.
     * @param amount amount of items to decrease, default is 1
     */
    decreaseCarriedItem(amount: number = 1) {
        const item = this.getCarriedItem();
        this.setCarriedItem(item.id, item.count - amount, item.data, item.extra);
    }

    /**
     * @returns armor slot's contents.
     */
    getArmor(slot: number): ItemInstance {
        const item = this.actor.getArmor(slot);
        return new ItemStack(item);
    }

    /**
     * Sets armor slot's contents.
     */
    setArmor(slot: number, item: ItemInstance): void;
    setArmor(slot: number, id: number, count: number, data: number, extra?: ItemExtraData): void;
    setArmor(slot: number, item: any, count?: number, data?: number, extra: ItemExtraData = null): void {
        if (typeof item == "object") {
            this.actor.setArmor(slot, item.id, item.count, item.data, item.extra || null);
        } else {
            this.actor.setArmor(slot, item, count, data, extra);
        }
    }

    /**
     * Sets respawn coords for the player.
     */
    setRespawnCoords(x: number, y: number, z: number): void {
        this.actor.setRespawnCoords(x, y, z);
    }

    /**
     * Spawns exp on coords.
     * @param value experience points value
     */
    spawnExpOrbs(x: number, y: number, z: number, value: number): void {
        this.actor.spawnExpOrbs(x, y, z, value);
    }

    /**
     * @returns whether the player is a valid entity.
     */
    isValid(): boolean {
        return this.actor.isValid();
    }

    /**
     * @returns player's selected slot.
     */
    getSelectedSlot(): number {
        return this.actor.getSelectedSlot();
    }

    /**
     * Sets player's selected slot.
     */
    setSelectedSlot(slot: number): void {
        this.actor.setSelectedSlot(slot);
    }

    /**
     * @returns player's experience.
     */
    getExperience(): number {
        return this.actor.getExperience();
    }

    /**
     * Sets player's experience.
     */
    setExperience(value: number): void {
        this.actor.setExperience(value);
    }

    /**
     * Add experience to player.
     */
    addExperience(amount: number): void {
        this.actor.addExperience(amount);
    }

    /**
     * @returns player's xp level.
     */
    getLevel(): number {
        return this.actor.getLevel();
    }

    /**
     * Sets player's xp level.
     */
    setLevel(level: number): void {
        this.actor.setLevel(level);
    }

    /**
     * @returns player's exhaustion.
     */
    getExhaustion(): number {
        return this.actor.getExhaustion();
    }

    /**
     * Sets player's exhaustion.
     */
    setExhaustion(value: number): void {
        this.actor.setExhaustion(value);
    }

    /**
     * @returns player's hunger.
     */
    getHunger(): number {
        return this.actor.getHunger();
    }

    /**
     * Sets player's hunger.
     */
    setHunger(value: number): void {
        this.actor.setHunger(value);
    }

    /**
     * @returns player's saturation.
     */
    getSaturation(): number {
        return this.actor.getSaturation();
    }

    /**
     * Sets player's saturation.
     */
    setSaturation(value: number): void {
        this.actor.setSaturation(value);
    }

    /**
     * @returns player's score.
     */
    getScore(): number {
        return this.actor.getScore();
    }

    /**
     * Sets player's score.
     */
    setScore(value: number): void {
        this.actor.setScore(value);
    }

    getItemUseDuration(): number {
        return this.actor.getItemUseDuration();
    }

    getItemUseIntervalProgress(): number {
        return this.actor.getItemUseIntervalProgress();
    }

    getItemUseStartupProgress(): number {
        return this.actor.getItemUseStartupProgress();
    }
}