abstract class TileEntityBase
implements TileEntity {
	constructor() {
		this.client ??= {};
		this.client.load = this.clientLoad;
		this.client.unload = this.clientUnload;
		this.client.tick = this.clientTick;
	}

	x: number;
	y: number;
	z: number;
	readonly dimension: number;
	readonly blockID: number;
	readonly useNetworkItemContainer: boolean = true;
	remove: boolean;
	isLoaded: boolean;
	__initialized: boolean;

	data: {[key: string]: any};
	defaultValues: {};

	client: {
		load?: () => void,
		unload?: () => void,
		tick?: () => void,
		events?: {
			[packetName: string]: (packetData: any, packetExtra: any) => void;
		},
		containerEvents?: {
			[eventName: string]: (container: ItemContainer, window: UI.Window | UI.StandartWindow | UI.TabbedWindow | null, windowContent: UI.WindowContent | null, eventData: any) => void;
		}
	}
	events: {};
	containerEvents: {};

	container: ItemContainer;
	liquidStorage: LiquidRegistry.Storage;
	blockSource: BlockSource;
    networkData: SyncedNetworkData;
	networkEntity: NetworkEntity;
	/**
	 * Interface for BlockSource of the TileEntity. Provides more functionality.
	 */
	region: WorldRegion;

	private _runInit: () => boolean;

	created(): void {
		this.onCreate();
	}

	init(): void {
		this.region = new WorldRegion(this.blockSource);
		this.onInit();
	}

	load(): void {
		this.onLoad();
	}

	unload(): void {
		this.onUnload();
	}

	tick(): void {
		this.onTick();
	}

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

	clientLoad(): void {}

	clientUnload(): void {}

	clientTick(): void {}

	onCheckerTick(isInitialized: boolean, isLoaded: boolean, wasLoaded: boolean): void {}

	getScreenName(player: number, coords: Callback.ItemUseCoordinates): string {
		return "main";
	}

	getScreenByName(screenName: string) {
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

       	let screenName = this.getScreenName(player, coords);
    	if (screenName) {
            let client = Network.getClientForPlayer(player);
            if (client) {
            	this.container.openFor(client, screenName);
                return true;
            }
		}
		return false;
	}

	destroyBlock(coords: Callback.ItemUseCoordinates, player: number): void {}

	redstone(params: {power: number, signal: number, onLoad: boolean}): void {
		this.onRedstoneUpdate(params.power);
	}

	/**
	 * Occurs when redstone signal on TileEntity block was updated. Replaces "redstone" function
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
		let gui = container.getUiAdapter();
		if (gui) {
			let size = gui.getBinding(data.scale, "element_rect");
            if (!size) {
                return;
            }
            let texture = LiquidRegistry.getLiquidUITexture(data.liquid, size.width(), size.height());
            gui.setBinding(data.scale, "texture", texture);
            gui.setBinding(data.scale, "value", data.amount);
		}
	}
}