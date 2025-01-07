abstract class TileEntityBase
implements TileEntity {
	constructor() {
		this.client = {
			load: this.clientLoad,
			unload: this.clientUnload,
			tick: this.clientTick,
			events: {},
			containerEvents: {}
		}
		this.events = {};
		this.containerEvents = {};

		for (let propertyName in this.__clientMethods) {
			this.client[propertyName] = this[propertyName];
		}

		for (let eventName in this.__networkEvents) {
			const side = this.__networkEvents[eventName];
			const target = (side == Side.Client) ? this.client.events : this.events;
			target[eventName] = this[eventName];
		}

		for (let eventName in this.__containerEvents) {
			const side = this.__containerEvents[eventName];
			const target = (side == Side.Client) ? this.client.containerEvents : this.containerEvents;
			target[eventName] = this[eventName];
		}

		delete this.__clientMethods;
		delete this.__networkEvents;
		delete this.__containerEvents;
	}

	__clientMethods: {[key: string]: boolean};
	__networkEvents: {[key: string]: Side};
	__containerEvents: {[key: string]: Side};

	readonly x: number;
	readonly y: number;
	readonly z: number;
	readonly dimension: number;
	readonly blockID: number;
	readonly useNetworkItemContainer: boolean = true;
	remove: boolean;
	isLoaded: boolean;
   	noupdate: boolean;
	__initialized: boolean;

	data: {[key: string]: any};
	defaultValues: {};

	client: {
		load: () => void,
		unload: () => void,
		tick: () => void,
		events: {
			[packetName: string]: (packetData: any, packetExtra: any) => void;
		},
		containerEvents: {
			[eventName: string]: (container: ItemContainer, window: UI.IWindow | null, windowContent: UI.WindowContent | null, eventData: any) => void;
		}
	}
	events: {
		[packetName: string]: (packetData: any, packetExtra: any, connectedClient: NetworkClient) => void;
	};
	containerEvents: {
		[eventName: string]: (container: ItemContainer, window: UI.IWindow | null, windowContent: UI.WindowContent | null, eventData: any) => void;
	};

	container: ItemContainer;
	liquidStorage: LiquidRegistry.Storage;
	blockSource: BlockSource;
    readonly networkData: SyncedNetworkData;
	readonly networkEntity: NetworkEntity;
	readonly networkEntityType: NetworkEntityType;
	readonly networkEntityTypeName: string;
	/**
	 * Interface for BlockSource of the TileEntity. Provides more functionality.
	 */
	region: WorldRegion;

	private _runInit: () => boolean;
	update: () => void;

	created(): void {
		this.onCreate();
	}

	/** @deprecated */
	init(): void {
		this.region = new WorldRegion(this.blockSource);
		this.onInit();
	}

	/** @deprecated */
	load(): void {
		this.onLoad();
	}

	/** @deprecated */
	unload(): void {
		this.onUnload();
	}

	/** @deprecated */
	tick(): void {
		this.onTick();
	}
	
	/** @deprecated */
	click(): void {}

	/**
	 * Called when a TileEntity is created
	 */
	onCreate(): void {}

	/**
	 * Called when a TileEntity is initialised in the world
	 */
	onInit(): void {}

	/**
	 * Called when a chunk with TileEntity is loaded
	 */
	onLoad(): void {}

	/**
	 * Called when a chunk with TileEntity is unloaded
	 */
	onUnload(): void {}

	/**
	 * Called every tick and should be used for all the updates of the TileEntity
	 */
	onTick(): void {}

	/**
	 * Called when the client copy is created
	 */
	clientLoad(): void {}

	/**
	 * Called on destroying the client copy
	 */
	clientUnload(): void {}

	/**
	 * Called every tick on client thread
	 */
	clientTick(): void {}

	onCheckerTick(isInitialized: boolean, isLoaded: boolean, wasLoaded: boolean): void {}

	getScreenName(player: number, coords: Callback.ItemUseCoordinates): string {
		return "main";
	}

	getScreenByName(screenName: string, container: ItemContainer): UI.IWindow {
		return null;
	}

	/** @deprecated */
	getGuiScreen(): UI.IWindow {
		return null;
	}

	/**
	 * Called when player uses some item on a TileEntity. Replaces "click" function.
	 * @returns true if should prevent opening UI.
	*/
	onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, player: number): boolean {
		return false;
	}

	private _clickPrevented = false;

	/**
	 * Prevents all actions on click
	 */
    preventClick(): void {
        this._clickPrevented = true;
    }

	onItemClick(id: number, count: number, data: number, coords: Callback.ItemUseCoordinates, player: number, extra: ItemExtraData): boolean {
        if (!this.__initialized) {
            if (!this._runInit()) {
                return false;
            }
        }
		this._clickPrevented = false;
        if (this.onItemUse(coords, new ItemStack(id, count, data, extra), player) || this._clickPrevented) {
            return this._clickPrevented;
        }
        if (Entity.getSneaking(player)) {
            return false;
        }

		const screenName = this.getScreenName(player, coords);
    	if (screenName && this.getScreenByName(screenName, this.container)) {
            const client = Network.getClientForPlayer(player);
            if (client) {
            	this.container.openFor(client, screenName);
                return true;
            }
		}
		return false;
	}

	destroyBlock(coords: Callback.ItemUseCoordinates, player: number): void {}

	/** @deprecated */
	redstone(params: {power: number, signal: number, onLoad: boolean}): void {
		this.onRedstoneUpdate(params.power);
	}

	/**
	 * Occurs when redstone signal on TileEntity block was updated
	 * @param signal signal power (0-15)
	 */
	onRedstoneUpdate(signal: number): void {}

	projectileHit(coords: Callback.ItemUseCoordinates, target: Callback.ProjectileHitTarget): void {}

	destroy(): boolean {
		return false;
	}

	selfDestroy(): void {
		TileEntity.destroyTileEntity(this);
	}

	requireMoreLiquid(liquid: string, amount: number): void {}

	sendPacket: (name: string, data: object) => {};
	sendResponse: (packetName: string, someData: object) => {};

	updateLiquidScale(scale: string, liquid: string) {
		this.container.sendEvent("setLiquidScale", {scale: scale, liquid: liquid, amount: this.liquidStorage.getRelativeAmount(liquid)});
	}

	@BlockEngine.Decorators.ContainerEvent(Side.Client)
	setLiquidScale(container: any, window: any, content: any, data: {scale: string, liquid: string, amount: number}): void {
		const gui = container.getUiAdapter();
		if (gui) {
			const size = gui.getBinding(data.scale, "element_rect");
            if (!size) return;
            const texture = LiquidRegistry.getLiquidUITexture(data.liquid, size.width(), size.height());
            gui.setBinding(data.scale, "texture", texture);
            gui.setBinding(data.scale, "value", data.amount);
		}
	}
}