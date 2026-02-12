namespace BlockEngine {
	export namespace Decorators {
		/** Client side method decorator for TileEntity */
		export function ClientSide(target: TileEntityBase, propertyName: string) {
			target.__clientMethods = {...target.__clientMethods};
			target.__clientMethods[propertyName] = true;
		}

		/** Adds method as network event in TileEntity */
		export function NetworkEvent(side: Side, eventName?: string) {
			return (target: TileEntityBase, propertyName: string) => {
				target.__networkEvents = {...target.__networkEvents};
				target.__networkEvents[propertyName] = { side, eventName: eventName ?? propertyName };
			}
		}

		/** Adds method as container event in TileEntity */
		export function ContainerEvent(side: Side, eventName?: string) {
			return (target: TileEntityBase, propertyName: string) => {
				target.__containerEvents = {...target.__containerEvents};
				target.__containerEvents[propertyName] = { side, eventName: eventName ?? propertyName };
			}
		}
	}
}