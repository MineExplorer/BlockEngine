# BlockEngine library
BlockEngine is the library for advanced modding with multiplayer support for Inner Core modloader. 
The library partially supports JavaScript modding, but it is recommended to use TypeScript to reveal full potential of the library (e.g. base classes and decorators)

## Development
### Building sources
1. Install [Node.js](https://nodejs.org/en/) and then install `typescript` (run `npm install -g typescript`)
2. Clone repository
3. Build script and declarations with command `tsc -p .\source\tsconfig.json` or you can run `tsc:build` task in VS Code IDE
(press `Ctrl+Shift+B` to select task)

## Overview
The library extends deprecated Core Engine API, allows to use object-oriented programming in mod development and adds wrappers for java classes.
Documentation for each method can be found in declarations file. Here is an overview of the library possibilities.

### ItemRegistry module
**ItemRegistry** is an item registration module which allows to create items using two approaches: item descriptors and base classes.
Item descriptor is an object which specifies all item properties. The module allows to create common items, food, throwable items, armor and tools from descriptors.
The library also adds vanilla tool types such as swords, pickaxes, shovels, axes, hoes and shears defined in **ToolType** namespace.

Another way to create items is item classes. You can specify all item properties and functions in a class derived from one of the base classes added by the library.
Base classes includes **ItemCommon**, **ItemFood**, **ItemThrowable**, **ItemArmor** and **ItemTool**. It may seem complicated, but very useful to defining new item types or advanced items such as tools.

### BlockRegistry module
**BlockRegistry** is a block registration module. You can add blocks in similar way to Core Engine API, but special types system replaced with block types.
**Block types** have correct JavaScript naming for properties and can inherit properties from another block type! Also module adds some default block types such as: stairs, slabs and blocks with rotation on 6 sides. You can define block from block class similar to ItemRegistry module as well. Block base classes includes **BlockBase** and **BlockRotative** and some other classes for built-in types.

### TileEntityBase class
This is must have thing if you want to create tile entities in multiplayer mod. Original tile entity prototypes have complicated and inconvenient structure for adding client/server side functions and events, when with decorators from *BlockEngine.Decorators* namespace you can just mark methods as container or network events or client side functions, and they will be inherited in derived classes.

### Storing liquid in item and containers
Original *LiquidRegistry* creates items which stores only 1 bucket of liquid. **LiquidItemRegistry** module added by the library allows to create items which stores any amount liquid in milibuckets (1/1000 of bucket).

*TileEntity.liquidStorage* class doesn't support liquid scales in multiplayer and hadn't the best design from the beggining.
To replace it the library adds **LiquidTank** class. It stores only 1 liquid but you can have multiple of them in the tile entity and specify which types of liquid it can store. It works well with *TileEntityBase* class and fixes issue with liquid scales in multiplayer by calling specific container event added by *TileEntityBase* class.

### Functional classes
The library adds several classes to work with ingame objects or data.

**WorldRegion** - wrapper for BlockSource java class. It adds new features such overloads for methods with vector coordinates as an argument or playing sounds in multiplayer.

**PlayerEntity** - wrapper for PlayerActor java class. Adds some handful method overloads.

**ItemStack** - class which implements *ItemInstance* interface and adds method to modify item stack. Note: any modification will not be applied before you reset inventory slot of the item.

**Vector3** - class to operate with 3-d vectors.

### Support for both Minecraft 1.11 and 1.16
The library is aimed to support both modern and legacy Inner Core versions and provides tools to add reverse compatibility in mods.
*WorldRegion* class has reverse compatibility for new *BlockSource* methods. It reproduces theit functionality on legacy version or adds plugs if its not possible.
Some item ids were changed in new version of Minecraft. You can use **IDConverter** module to get numeric item id and data from new string id depending on the game version.

## Mods which uses BlockEngine library
You can use these mods as examples for usage of the library

- [IndustrialCraft2](https://github.com/MineExplorer/IndustrialCraft_2)
- [RedPower PE](https://github.com/MineExplorer/RedPowerPE)
- [Nuclear Craft](https://icmods.mineprogramming.org/mod?id=832)
