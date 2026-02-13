/**
 * Object representing common block properties.
 */
interface BlockType {
	/**
	 * Block type to inherit properties
	 */
	extends?: string,

	/**
	 * Vanilla block ID to inherit some of the properties. Default is 0
	 */
	baseBlock?: number,

	/**
	 * Block material constant. Default is 3
	 */
	material?: number,

	/**
	 * If true, the block is not transparent. Default is false
	 */
	solid?: boolean,

	/**
	 * If true, all block faces are rendered, otherwise back faces are not
	 * rendered (for optimization purposes). Default is false
	 */
	renderAllFaces?: boolean,

	/**
	 * Sets render type of the block. Default is 0 (full block), use other 
	 * values to change block's shape
	 */
	renderType?: number,

	/**
	 * Specifies the layer that is used to render the block. Default is 4
	 */
	renderLayer?: number,

	/**
	 * If non-zero value is used, the block emits light of that value. 
	 * Default is 0, use values from 1 to 15 to set light level
	 */
	lightLevel?: number,

	/**
	 * Specifies how opaque the block is. Default is 0 (transparent), use values 
	 * from 1 to 15 to make the block opaque
	 */
	lightOpacity?: number,

	/**
	 * Specifies how block resists to the explosions. Default value is 3
	 */
	explosionResistance?: number,

	/**
	 * Specifies how player walks on this block. The higher the friction is,
	 * the more difficult it is to change speed and direction. Default value
	 * is 0.6000000238418579
	 */
	friction?: number,

	/**
	 * Specifies the time required to destroy the block, in ticks
	 */
	destroyTime?: number,

	/**
	 * If non-zero value is used, the shadows will be rendered on the block.
	 * Default is 0, allows float values from 0 to 1
	 */
	translucency?: number,

	/**
	 * Block color when displayed on the vanilla maps
	 */
	mapColor?: number,

	/**
	 * Makes block use biome color source when displayed on the vanilla maps
	 */
	colorSource?: Block.ColorSource,

	/**
	 * Specifies sounds of the block
	 */
	sound?: Block.Sound,

	/**
	 * Whether or not block may filled by water bucket or
	 * other custom fillable liquids.
	 * @default false
	 */
	canContainLiquid?: boolean,

	/**
	 * Whether or not block may overlay different block,
	 * like water overlapping fillable blocks.
	 * @default false
	 */
	canBeExtraBlock?: boolean,

	/**
	 * Adds ability to apply states to this block, preferably using
	 * vanilla ones from {@link EBlockStates}, but if they are not enough,
	 * you can always add your own using {@link BlockState.registerBlockState}.
	 * Inexistent states are ignored.
	 * @default ["color"] // this state always has been here
	 */
	states?: (EBlockStates | number | string)[],

	/**
	 * Alternatively catch on fire chance modifier,
	 * values between 0 and 100, with a higher number
	 * meaning more likely to catch on fire.
	 * For a "flame_odds" greater than 0, the fire will
	 * continue to burn until the block is destroyed
	 * (or it will burn forever if the "burn_odds" is 0).
	 * @default 0 // 5 for planks
	 * @since 3.1.0b125
	 */
	flameOdds?: number,
	
	/**
	 * Alternatively destroy by fire chance modifier,
	 * values between 0 and 100, with a higher number
	 * meaning more likely to be destroyed by fire.
	 * @default 0 // 20 for planks
	 */
	burnOdds?: number;
}
