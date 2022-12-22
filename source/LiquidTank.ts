namespace BlockEngine {
	/**
	 * Class to store and manipulate liquids in TileEntity.
	 */
	export class LiquidTank {
		/** Parent TileEntity instance */
		tileEntity: TileEntity;

		/** Liquid tank name */
		readonly name: string;

		/** Max liquid amount. */
		limit: number;

		/** Set of valid liquids */
		liquids: object;

		/** Liquid data stored in TileEntity data object. */
		data: {
			liquid: string,
			amount: number
		}

		/**
		 * Creates new instance of `LiquidTank` and binds it to TileEntity.
		 * @param tileEntity TileEntity instance
		 * @param name liquid tank name
		 * @param limit max liquid amount
		 * @param liquids types of valid liquids
		 */
		constructor(tileEntity: TileEntity, name: string, limit: number, liquids?: string[]) {
			this.name = name;
			this.limit = limit;
			if (liquids) this.setValidLiquids(liquids);
			this.setParent(tileEntity);
		}

		/**
		 * Binds liquid tank to TileEntity.
		 * @param tileEntity TileEntity instance
		 */
		setParent(tileEntity: TileEntity) {
			this.tileEntity = tileEntity;
			const liquidData = tileEntity.data[this.name] || {
				liquid: null,
				amount: 0
			};
			tileEntity.data[this.name] = this.data = liquidData;
		}

		/**
		 * Gets type of liquid stored in tank.
		 * @returns liquid type
		 */
		getLiquidStored(): string {
			return this.data.liquid;
		}

		/**
		 * Gets max amount of liquid in tank.
		 * @returns amount of liquid
		 */
		getLimit(): number {
			return this.limit;
		}

		/**
		 * @param liquid liquid type
		 * @returns true if liquid can be stored in tank, false otherwise.
		 */
		isValidLiquid(liquid: string): boolean {
			if (!this.liquids) {
				return true;
			}
			return this.liquids[liquid] || false;
		}

		/**
		 * Sets liquids that can be stored in tank.
		 * @param liquids arrays of liquid types
		 */
		setValidLiquids(liquids: string[]): void {
			this.liquids = {};
			for (let name of liquids) {
				this.liquids[name] = true;
			}
		}

		/**
		 * Gets amount of liquid in tank. If `liquid` parameter is set,
		 * returns amount of the specified liquid.
		 * @param liquid liquid type
		 * @returns amount of liquid
		 */
		getAmount(liquid?: string): number {
			if (!liquid || this.data.liquid == liquid) {
				return this.data.amount;
			}
			return 0;
		}

		/**
		 * Sets liquid to tank.
		 * @param liquid liquid type
		 * @param amount amount of liquid
		 */
		setAmount(liquid: string, amount: number): void {
			this.data.liquid = liquid;
			this.data.amount = amount;
		}

		/**
		 * Gets amount of liquid divided by max amount.
		 * @returns scalar value from 0 to 1
		 */
		getRelativeAmount(): number {
			return this.data.amount / this.limit;
		}

		/**
		 * Adds liquid to tank.
		 * @param liquid liquid type
		 * @param amount amount of liquid to add
		 * @returns amount of liquid that wasn't added
		 */
		addLiquid(liquid: string, amount: number): number {
			if (!this.data.liquid || this.data.liquid == liquid) {
				this.data.liquid = liquid;
				const add = Math.min(amount, this.limit - this.data.amount);
				this.data.amount += add;
				return amount - add;
			}
			return 0;
		}

		/**
		 * Gets liquid from tank.
		 * @param amount max amount of liquid to get
		 * @returns amount of got liquid
		 */
		getLiquid(amount: number): number;

		/**
		 * Gets liquid from tank.
		 * @param liquid liquid type
		 * @param amount max amount of liquid to get
		 * @returns amount of got liquid
		 */
		getLiquid(liquid: string, amount: number): number;
		getLiquid(liquid: any, amount?: number): number {
			if (amount == undefined) {
				amount = liquid;
				liquid = null;
			}
			if (!liquid || this.data.liquid == liquid) {
				const got = Math.min(amount, this.data.amount);
				this.data.amount -= got;
				if (this.data.amount == 0) {
					this.data.liquid = null;
				}
				return got;
			}
			return 0;
		}

		/**
		 * @returns true if tank is full, false otherwise
		 */
		isFull(): boolean {
			return this.data.amount >= this.limit;
		}

		/**
		 * @returns true if tank is empty, false otherwise
		 */
		isEmpty(): boolean {
			return this.data.amount <= 0;
		}

		/**
		 * Tries to fill item with liquid from tank.
		 * @param inputSlot slot for empty item
		 * @param outputSlot slot for full item
		 * @returns true if liquid was added, false otherwise.
		 */
		addLiquidToItem(inputSlot: ItemContainerSlot, outputSlot: ItemContainerSlot): boolean {
			const liquid = this.getLiquidStored();
			if (!liquid) return false;

			let amount = this.getAmount(liquid);
			if (amount > 0) {
				const full = LiquidItemRegistry.getFullItem(inputSlot.id, inputSlot.data, liquid);
				if (full && (outputSlot.id == full.id && outputSlot.data == full.data && outputSlot.count < Item.getMaxStack(full.id) || outputSlot.id == 0)) {
					if (amount >= full.amount) {
						this.getLiquid(full.amount);
						inputSlot.setSlot(inputSlot.id, inputSlot.count - 1, inputSlot.data);
						inputSlot.validate();
						outputSlot.setSlot(full.id, outputSlot.count + 1, full.data);
						return true;
					}
					if (inputSlot.count == 1 && full.storage) {
						if (inputSlot.id == full.id) {
							amount = this.getLiquid(full.amount);
							inputSlot.setSlot(inputSlot.id, 1, inputSlot.data - amount);
						} else {
							amount = this.getLiquid(full.storage);
							inputSlot.setSlot(full.id, 1, full.storage - amount);
						}
						return true;
					}
				}
			}
			return false;
		}

		/**
		 * Tries to fill tank with liquid from item.
		 * @param inputSlot slot for full item
		 * @param outputSlot slot for empty item
		 * @returns true if liquid was extracted, false otherwise.
		 */
		getLiquidFromItem(inputSlot: ItemContainerSlot, outputSlot: ItemContainerSlot): boolean {
			const liquid = this.getLiquidStored();
			const empty = LiquidItemRegistry.getEmptyItem(inputSlot.id, inputSlot.data);
			if (empty && (!liquid && this.isValidLiquid(empty.liquid) || empty.liquid == liquid) && !this.isFull()) {
				if (outputSlot.id == empty.id && outputSlot.data == empty.data && outputSlot.count < Item.getMaxStack(empty.id) || outputSlot.id == 0) {
					const freeAmount = this.getLimit() - this.getAmount();
					if (freeAmount >= empty.amount) {
						this.addLiquid(empty.liquid, empty.amount);
						inputSlot.setSlot(inputSlot.id, inputSlot.count - 1, inputSlot.data);
						inputSlot.validate();
						outputSlot.setSlot(empty.id, outputSlot.count + 1, empty.data);
						return true;
					}
					if (inputSlot.count == 1 && empty.storage) {
						const amount = Math.min(freeAmount, empty.amount);
						this.addLiquid(empty.liquid, amount);
						inputSlot.setSlot(inputSlot.id, 1, inputSlot.data + amount);
						return true;
					}
				}
			}
			return false;
		}

		/**
		 * Updates UI bar of liquid. Uses LiquidStorage method for legacy container
		 * and container event from TileEntityBase for multiplayer container.
		 * @param scale name of liquid bar
		 */
		updateUiScale(scale: string): void {
			const container = this.tileEntity.container;
			if (container.isLegacyContainer()) {
				this.tileEntity.liquidStorage._setContainerScale(container as UI.Container, scale, this.data.liquid, this.getRelativeAmount());
			} else {
				(container as ItemContainer).sendEvent("setLiquidScale", {scale: scale, liquid: this.data.liquid, amount: this.getRelativeAmount()});
			}
		}
	}
}