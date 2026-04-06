## BlockEngine Library
**BlockEngine** is a library for advanced modding with multiplayer support for the Inner Core modloader. 

While the library partially supports JavaScript modding, it is highly recommended to use **TypeScript** to reveal its full potential, such as base classes and decorators.

## Development
### Building from Source
1. Install [Node.js](https://nodejs.org/en/)
2. Install the TypeScript compiler (run `npm install -g typescript`)
3. Build the script and declarations using the command `tsc -p .\source\tsconfig.json`, or just run the `tsc:build` task in the VS Code IDE (`Ctrl+Shift+B`).

## Overview
The library extends the deprecated Core Engine API, introducing object-oriented programming (OOP) to mod development and providing JS wrappers for Java classes. Detailed documentation for each method can be found in the declarations file. Below is an overview of the library's core features.

### ItemRegistry Module
The **ItemRegistry** module allows you to create items using two distinct approaches:

* **Item Descriptors:** Objects that specify all item properties. Use these to quickly create common items, food, throwable items, armor, and tools. The library includes standard vanilla tool types (swords, pickaxes, shovels, axes, hoes, and shears) defined in the `ToolType` namespace.
* **Item Classes:** Define properties and functions within a class derived from base classes such as `ItemCommon`, `ItemFood`, `ItemThrowable`, `ItemArmor`, or `ItemTool`. This is the preferred method for defining advanced item types or tools with complex logic.

### BlockRegistry Module
The **BlockRegistry** module handles block registration. You can add blocks in similar way to Core Engine API, but it replaces the special types system with a more robust **Block Types** system. 

Block types use standard JavaScript naming conventions and can inherit properties from another block type. The module includes several vanilla block types, such as stairs, slabs, and 6-side rotatable blocks. Like items, blocks can be defined via classes using `BlockBase`, `BlockRotative`, and other specialized base classes.

### TileEntityBase Class
This is a must-have thing if you want to create tile entities in multiplayer mods. Original tile entity prototypes have a complicated and inconvenient structure for adding client/server side functions and events, when with decorators from `BlockEngine.Decorators` namespace you can just mark methods as container or network events or client-side functions, and they will be inherited in derived classes.

### Storing liquid in items and containers
Original *LiquidRegistry* creates items which store only 1 bucket of liquid. **LiquidItemRegistry** module added by the library allows to create items which store any amount of liquid in milibuckets (1/1000 of a bucket).

*TileEntity.liquidStorage* class doesn't support liquid scales in multiplayer and doesn't have the best design from the beginning.
To replace it the library adds **LiquidTank** class. It stores only 1 liquid but you can have multiple of them in the tile entity and specify which types of liquid it can store. It works well with *TileEntityBase* class and fixes the issue with liquid scales in multiplayer by calling a specific container event added by *TileEntityBase* class.

### Functional classes
The library adds several classes to work with ingame objects or data.

**WorldRegion** - wrapper for BlockSource java class. It has new features such as overloads for methods with vector coordinates as an argument or playing sounds in multiplayer.

**PlayerEntity** - wrapper for PlayerActor java class. Adds some helpful method overloads.

**ItemStack** - class which implements *ItemInstance* interface and can be used to modify an item stack. Note: any modification will not be applied before you reset the inventory slot of the item.

**Vector3** - class to operate with 3D vectors.

### Support for both Minecraft 1.11 and 1.16
The library is aimed to support both modern and legacy Inner Core versions and provides tools to add reverse compatibility in mods.
*WorldRegion* class has reverse compatibility for new *BlockSource* methods. It reproduces their functionality on a legacy version or adds plugs if it isn't possible.
Some item ids were changed in a new version of Minecraft. You can use **IDConverter** module to get a numeric item id and data from a new string id depending on the game version.

## Mods which use BlockEngine library
You can use these mods as examples for usage of the library

- [IndustrialCraft2](https://github.com/MineExplorer/IndustrialCraft_2)
- [RedPower PE](https://github.com/MineExplorer/RedPowerPE)
- [Nuclear Craft](https://github.com/NikuJagajaga/NuclearCraftPE)