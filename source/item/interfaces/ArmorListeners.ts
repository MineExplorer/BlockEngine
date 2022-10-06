interface ArmorListeners {
    /**
     * This event is called when the damage is dealt to the player that has this armor put on.
     * @param params additional data about damage
     * @param params.attacker attacker entity or -1 if the damage was not caused by an entity
     * @param params.damage damage amount that was applied to the player
     * @param params.type damage type
     * @param item armor item instance
	 * @param slot armor slot index (from 0 to 3).
	 * @param player player entity uid
     * @returns the item instance to change armor item,
     * if nothing is returned, armor will be damaged by default.
     */
	onHurt?(params: {attacker: number, type: number, damage: number, bool1: boolean, bool2: boolean},
        item: ItemInstance, slot: number, player: number): ItemInstance | void;
	
    /**
	 * This event is called when the damage is dealt to the player that has this armor put on.
	 * @param item armor item instance
	 * @param slot armor slot index (from 0 to 3).
	 * @param player player entity uid
     * @returns the item instance to change armor item,
     * if nothing is returned, armor will not be changed.
	 */
	onTick?(item: ItemInstance, slot: number, player: number): ItemInstance | void;
	
    /**
	 * This event is called when player takes on this armor, or spawns with it.
	 * @param item armor item instance
	 * @param slot armor slot index (from 0 to 3).
	 * @param player player entity uid
	 */
	onTakeOn?(item: ItemInstance, slot: number, player: number): void;
	
    /**
	 * This event is called when player takes off or changes this armor item.
	 * @param item armor item instance
	 * @param slot armor slot index (from 0 to 3).
	 * @param player player entity uid
	 */
	onTakeOff?(item: ItemInstance, slot: number, player: number): void;
}