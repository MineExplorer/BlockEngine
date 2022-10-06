/**
 * Object containing tool parameters and functions.
 */
interface ToolParams
extends ToolAPI.ToolParams {
	/** Specifies how the player should hold the item. */
	handEquipped?: boolean;
	/** Enchantment type of the tool. */
	enchantType?: number;
	/** Array of block types which the tool can break. */
	blockTypes?: string[];
	/**
	 * Function that is called when player touches a block with the tool.
	 * @param coords object of touch coordinates with side information and relative coordinates set.
     * @param item item in the player's hand
     * @param block block that was touched
     * @param player player entity id
	 */
	onItemUse?: (coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number) => void;
}

/**
 * Object used to describe tool material type.
 */
interface ToolMaterial
extends ToolAPI.ToolMaterial {
	/**
	 * Value which specifies chances of getting higher level enchant for the item.
	 */
	enchantability?: number;
	/**
	 * Id of the item that is used to repair tool in anvil.
	 */
	repairMaterial?: number;
}

/**
 * Tool parameters for vanilla tool types.
 */
namespace ToolType {
	export const SWORD: ToolParams = {
		__flag: "__sword",
		handEquipped: true,
		isWeapon: true,
		enchantType: Native.EnchantType.weapon,
		damage: 4,
		blockTypes: ["fibre", "plant"],
		calcDestroyTime: function(item, coords, block, params, destroyTime, enchant) {
			if (block.id == 30) return 0.08;
			const material = ToolAPI.getBlockMaterialName(block.id);
			if (material == "plant" || block.id == 86 || block.id == 91 || block.id == 103 || block.id == 127 || block.id == 410) {
				return params.base / 1.5;
			}
			return destroyTime;
		}
	}

	export const SHOVEL: ToolParams = {
		__flag: "__shovel",
		handEquipped: true,
		enchantType: Native.EnchantType.shovel,
		damage: 2,
		blockTypes: ["dirt"],
		onItemUse: function(coords, item, block, player) {
			if (block.id == 2 && coords.side == 1) {
				const region = WorldRegion.getForActor(player);
				region.setBlock(coords, 198, 0);
				region.playSound(coords.x + .5, coords.y + 1, coords.z + .5, "step.grass", 0.5, 0.8);
				item.applyDamage(1);
				Entity.setCarriedItem(player, item.id, item.count, item.data, item.extra);
			}
		}
	}

	export const PICKAXE: ToolParams = {
		__flag: "__pickaxe",
		handEquipped: true,
		enchantType: Native.EnchantType.pickaxe,
		damage: 2,
		blockTypes: ["stone"],
	}

	export const AXE: ToolParams = {
		__flag: "__axe",
		handEquipped: true,
		enchantType: Native.EnchantType.axe,
		damage: 3,
		blockTypes: ["wood"],
		onItemUse: function(coords, item, tile, player) {
			const logID = this.getStrippedLogId(tile);
			if (logID) {
				const region = WorldRegion.getForActor(player);
				if (BlockEngine.getMainGameVersion() >= 16) {
					const block = region.getBlock(coords);
					const states = {"pillar_axis": block.getState(EBlockStates.PILLAR_AXIS)};
					if (logID == VanillaTileID.stripped_warped_stem || logID == VanillaTileID.stripped_crimson_stem) {
						states["deprecated"] = 0;
					}
					const block2 = new BlockState(logID, states);
					region.setBlock(coords, block2);
				} else {
					region.setBlock(coords, logID, 0);
				}
				item.applyDamage(1);
				Entity.setCarriedItem(player, item.id, item.count, item.data, item.extra);
			}
		},
		getStrippedLogId: function(block: Tile) {
			switch (block.id) {
				case 17:
					if (block.data == 0) return VanillaTileID.stripped_oak_log;
					if (block.data == 1) return VanillaTileID.stripped_spruce_log;
					if (block.data == 2) return VanillaTileID.stripped_birch_log;
					return VanillaTileID.stripped_jungle_log;
				case 162:
					if (block.data == 0) return VanillaTileID.stripped_acacia_log;
					return VanillaTileID.stripped_dark_oak_log;
				case VanillaTileID.warped_stem:
					return VanillaTileID.stripped_warped_stem;
				case VanillaTileID.crimson_stem:
					return VanillaTileID.stripped_crimson_stem;
			}
		}
	}

	export const HOE: ToolParams = {
		__flag: "__hoe",
		handEquipped: true,
		enchantType: Native.EnchantType.pickaxe,
		damage: 2,
		blockTypes: ["plant"],
		onItemUse: function(coords, item, block, player) {
			if ((block.id == 2 || block.id == 3) && coords.side != 0) {
				const region = WorldRegion.getForActor(player);
				if (region.getBlockId(coords.x, coords.y + 1, coords.z) != 0) return;
				region.setBlock(coords, 60, 0);
				region.playSound(coords.x + .5, coords.y + 1, coords.z + .5, "step.gravel", 1, 0.8);
				item.applyDamage(1);
				Entity.setCarriedItem(player, item.id, item.count, item.data, item.extra);
			}
		}
	}

	export const SHEARS: ToolParams = {
		__flag: "__shears",
		blockTypes: ["plant", "fibre", "wool"],
		modifyEnchant(enchantData, item, coords, block) {
			if (block) {
				const material = ToolAPI.getBlockMaterialName(block.id);
				if (material == "fibre" || material == "plant") {
					enchantData.silk = true;
				}
			}
		},
		calcDestroyTime: function(item, coords, block, params, destroyTime, enchant) {
			if (block.id == 30) return 0.08;
			return destroyTime;
		},
		onDestroy: function(item, coords, block, player) {
			if (block.id == 31 || block.id == 32 || block.id == 18 || block.id == 161) {
				const region = WorldRegion.getForActor(player);
				region.destroyBlock(coords);
				region.dropItem(coords.x + .5, coords.y + .5, coords.z + .5, block.id, 1, block.data);
			}
			return false;
		}
	}
}

ToolAPI.addBlockMaterial("wool", 1.5);
ToolAPI.registerBlockMaterial(35, "wool");
