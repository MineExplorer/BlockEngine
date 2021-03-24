namespace BlockEngine {
	export class LiquidTank {
		tileEntity: TileEntity;
		readonly name: string;
		limit: number;
		liquids: object;
		data: {
			liquid: string,
			amount: number
		}

		constructor(tileEntity: TileEntity, name: string, limit: number, liquids?: string[]) {
			this.name = name;
			this.limit = limit;
			if (liquids) this.setValidLiquids(liquids);
			this.setParent(tileEntity);
		}

		setParent(tileEntity: TileEntity) {
			this.tileEntity = tileEntity;
			let liquidData = tileEntity.data[this.name] || {
				liquid: null,
				amount: 0
			};
			tileEntity.data[this.name] = this.data = liquidData;
		}

		getLiquidStored(): string {
			return this.data.liquid;
		}

		getLimit(): number {
			return this.limit;
		}

		isValidLiquid(liquid: string): boolean {
			if (!this.liquids) {
				return true;
			}
			return this.liquids[liquid] || false;
		}

		setValidLiquids(liquids: string[]): void {
			this.liquids = {};
			for (let name of liquids) {
				this.liquids[name] = true;
			}
		}

		getAmount(liquid?: string): number {
			if (!liquid || this.data.liquid == liquid) {
				return this.data.amount;
			}
			return 0;
		}

		setAmount(liquid: string, amount: number): void {
			this.data.liquid = liquid;
			this.data.amount = amount;
		}

		getRelativeAmount(): number {
			return this.data.amount / this.limit;
		}

		addLiquid(liquid: string, amount: number): number {
			if (!this.data.liquid || this.data.liquid == liquid) {
				this.data.liquid = liquid;
				let add = Math.min(amount, this.limit - this.data.amount);
				this.data.amount += add;
				return amount - add;
			}
			return 0;
		}

		getLiquid(amount: number): number;
		getLiquid(liquid: string, amount: number): number;
		getLiquid(liquid: any, amount?: number): number {
			if (amount == undefined) {
				amount = liquid;
				liquid = null;
			}
			if (!liquid || this.data.liquid == liquid) {
				let got = Math.min(amount, this.data.amount);
				this.data.amount -= got;
				if (this.data.amount == 0) {
					this.data.liquid = null;
				}
				return got;
			}
			return 0;
		}

		isFull(): boolean {
			return this.data.amount >= this.limit;
		}

		isEmpty(): boolean {
			return this.data.amount <= 0;
		}

		addLiquidToItem(inputSlot: ItemContainerSlot, outputSlot: ItemContainerSlot): boolean {
			let liquid = this.getLiquidStored();
			if (!liquid) return false;

			let amount = this.getAmount(liquid);
			if (amount > 0) {
				let full = LiquidItemRegistry.getFullItem(inputSlot.id, inputSlot.data, liquid);
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

		getLiquidFromItem(inputSlot: ItemContainerSlot, outputSlot: ItemContainerSlot): boolean {
			let liquid = this.getLiquidStored();
			let empty = LiquidItemRegistry.getEmptyItem(inputSlot.id, inputSlot.data);
			if (empty && (!liquid && this.isValidLiquid(empty.liquid) || empty.liquid == liquid) && !this.isFull()) {
				if (outputSlot.id == empty.id && outputSlot.data == empty.data && outputSlot.count < Item.getMaxStack(empty.id) || outputSlot.id == 0) {
					let freeAmount = this.getLimit() - this.getAmount();
					if (freeAmount >= empty.amount) {
						this.addLiquid(empty.liquid, empty.amount);
						inputSlot.setSlot(inputSlot.id, inputSlot.count - 1, inputSlot.data);
						inputSlot.validate();
						outputSlot.setSlot(empty.id, outputSlot.count + 1, empty.data);
						return true;
					}
					if (inputSlot.count == 1 && empty.storage) {
						let amount = Math.min(freeAmount, empty.amount);
						this.addLiquid(empty.liquid, amount);
						inputSlot.setSlot(inputSlot.id, 1, inputSlot.data + amount);
						return true;
					}
				}
			}
			return false;
		}

		updateUiScale(scale: string): void {
			let container = this.tileEntity.container;
			if (container.isLegacyContainer()) {
				this.tileEntity.liquidStorage._setContainerScale(container as UI.Container, scale, this.data.liquid, this.getRelativeAmount());
			} else {
				(container as ItemContainer).sendEvent("setLiquidScale", {scale: scale, liquid: this.data.liquid, amount: this.getRelativeAmount()});
			}
		}
	}
}