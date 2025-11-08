interface LiquidItem {
    /**
     * Capacity of liquid in mB
     */
    liquidStorage: number;
    /**
     * Returns true if the item supports specified liquid, false otherwise
     * @param liquid liquid type
     */
    isValidLiquid(liquid: string): boolean;
    /**
     * Returns liquid type stored in the item.
     * @param itemData item data
     * @param itemExtra item extra data
     */
    getLiquidStored(itemData: number, itemExtra: ItemExtraData): string;
    /**
     * Returns amount of liquid stored in the item.
     * @param itemData item data
     * @param itemExtra item extra data
     */
    getAmount(itemData: number, itemExtra: ItemExtraData): number;
    /**
     * Extracts liquid from the item.
     * @param item item stack
     * @param amount max amount of liquid to get
     * @returns amount of extracted liquid
     */
    getLiquid(item: ItemInstance, amount: number): number;
    /**
     * Adds liquid to the item.
     * @param item item stack partially filled with liquid or empty item stack
     * @param liquid liquid type
     * @param amount max amount of liquid to add
     * @returns amount of added liquid
     */
    addLiquid(item: ItemInstance, liquid: string, amount: number): number;
    /**
     * Returns empty item stack without liquid.
     */
    getEmptyItem(): ItemInstance;
    /**
     * Returns full item stack for the specified liquid or null if its not supported.
     * @param liquid liquid type
     */
    getFullItem(liquid: string): Nullable<ItemInstance>;
}