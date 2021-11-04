/// <reference path="ToolType.ts" />

class ItemTool extends ItemCommon
implements ToolParams {
	handEquipped: boolean = false;
	brokenId: number = 0;
	damage: number = 0;
	isWeapon: boolean = false;
	blockTypes: string[] = [];
	toolMaterial: ToolMaterial;
	enchantType: number;

	constructor(stringID: string, name: string, icon: string|Item.TextureData, toolMaterial: string | ToolMaterial, toolData?: ToolParams, inCreative?: boolean) {
		super(stringID, name, icon, inCreative);
		this.setMaxStack(1);
		this.setCategory(ItemCategory.EQUIPMENT);

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
}

