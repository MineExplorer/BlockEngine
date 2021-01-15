/// <reference path="ToolType.ts" />

class ItemTool
extends ItemCommon
implements ToolParams {
	handEquipped: boolean = false;
	brokenId: number = 0;
	damage: number = 0;
	isWeapon: boolean = false;
	blockTypes: string[] = [];
	toolMaterial: ToolMaterial;
	enchantType: number;

	constructor(stringID: string, name: string, icon: string|Item.TextureData, toolMaterial: string | ToolMaterial, toolData?: ToolParams, addToCreative: boolean = true) {
		super(stringID, name, icon, addToCreative);
		this.setMaxStack(1);

		if (typeof toolMaterial == "string") {
			toolMaterial = ItemRegistry.getToolMaterial(toolMaterial);
		}
		this.toolMaterial = toolMaterial as ToolMaterial;
		if (toolData) {
			for (let key in toolData) {
				this[key] = toolData[key];
			}
		}
		ToolAPI.registerTool(this.id, this.toolMaterial, this.blockTypes, this);

		if (this.enchantType && toolMaterial.enchantability) {
			this.setEnchantType(this.enchantType, toolMaterial.enchantability);
		}
		if (toolMaterial.repairMaterial) {
			this.addRepairItem(toolMaterial.repairMaterial);
		}
		if (this.handEquipped) {
			this.setHandEquipped(true);
		}
	}

	static damageCarriedItem(player: number, damage: number = 1) {
		let item = Entity.getCarriedItem(player);
		let enchant = ToolAPI.getEnchantExtraData(item.extra);
		if (Math.random() < 1 / (enchant.unbreaking + 1)) {
			item.data += damage;
		}
		if (item.data >= Item.getMaxDamage(item.id)) {
			let tool = ToolAPI.getToolData(item.id);
			item.id = tool ? tool.brokenId : 0;
			item.count = 1;
			item.data = 0;
		}
		Entity.setCarriedItem(player, item.id, item.count, item.data, item.extra);
	}
}

