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
	sound?: Block.Sound
}
