/// <reference path="ItemBasic.ts" />

interface OnHurtListener {
	onHurt: (params: {attacker: number, type: number, damage: number, bool1: boolean, bool2: boolean}, item: ItemInstance, slot: number, player: number) => ItemInstance | void
}
interface OnTickListener {
	onTick: (item: ItemInstance, slot: number, player: number) => ItemInstance | void
}
interface OnTakeOnListener {
	onTakeOn: (item: ItemInstance, slot: number, player: number) => void
}
interface OnTakeOffListener {
	onTakeOff: (item: ItemInstance, slot: number, player: number) => void
}

type ArmorMaterial = {durabilityFactor: number, enchantability?: number, repairMaterial?: number};

type ArmorType = "helmet" | "chestplate" | "leggings" | "boots";

type ArmorParams = {type: ArmorType, defence: number, texture?: string, material?: string | ArmorMaterial};

class ItemArmor extends ItemBasic {
	private static maxDamageArray: number[] = [11, 16, 15, 13]

	armorMaterial: ArmorMaterial
	armorType: ArmorType
	defence: number
	texture: string

	constructor(stringID: string, name: string, icon: string|Item.TextureData, params: ArmorParams) {
		super(stringID, name, icon);
		this.armorType = params.type;
		this.defence = params.defence;
		if (params.texture) this.setArmorTexture(params.texture);
		if (params.material) this.setMaterial(params.material);
	}

	createItem(inCreative: boolean = true) {
		this.item = Item.createArmorItem(this.stringID, this.name, this.icon, {type: this.armorType, armor: this.defence, durability: 0, texture: this.texture, isTech: !inCreative});
		if (this.armorMaterial) this.setMaterial(this.armorMaterial);
		ItemArmor.registerListeners(this.id, this);
		return this;
	}

	setArmorTexture(texture: string): void {
		this.texture = texture;
	}

	setMaterial(armorMaterial: string | ArmorMaterial): void {
		if (typeof armorMaterial == "string") {
			armorMaterial = ItemRegistry.getArmorMaterial(armorMaterial);
		}
		this.armorMaterial = armorMaterial;
		if (this.item) {
			var index = Native.ArmorType[this.armorType];
			var maxDamage = armorMaterial.durabilityFactor * ItemArmor.maxDamageArray[index];
			this.setMaxDamage(maxDamage);
			if (armorMaterial.enchantability) {
				this.setEnchantType(Native.EnchantType[this.armorType], armorMaterial.enchantability);
			}
			if (armorMaterial.repairMaterial) {
				this.addRepairItem(armorMaterial.repairMaterial);
			}
		}
	}

	preventDamaging(): void {
		Armor.preventDamaging(this.id);
	}

	static registerListeners(id: number, armorFuncs: ItemArmor | OnHurtListener | OnTickListener | OnTakeOnListener | OnTakeOffListener) {
		if ('onHurt' in armorFuncs) {
			Armor.registerOnHurtListener(id, function(item, slot, player, type, value, attacker, bool1, bool2) {
				return armorFuncs.onHurt({attacker: attacker, type: type, damage: value, bool1: bool1, bool2: bool2}, item, slot, player);
			});
		}
		if ('onTick' in armorFuncs) {
			Armor.registerOnTickListener(id, function(item, slot, player) {
				return armorFuncs.onTick(item, slot, player);
			});
		}
		if ('onTakeOn' in armorFuncs) {
			Armor.registerOnTakeOnListener(id, function(item, slot, player) {
				armorFuncs.onTakeOn(item, slot, player);
			});
		}
		if ('onTakeOff' in armorFuncs) {
			Armor.registerOnTakeOffListener(id, function(item, slot, player) {
				armorFuncs.onTakeOff(item, slot, player);
			});
		}
	}
}