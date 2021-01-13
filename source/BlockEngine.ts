enum Side {
	Client,
	Server
}

namespace BlockEngine {
	export namespace Decorators {
		export function ClientSide() {
			return (target: TileEntityBase, propertyName: string) => {
				if (!target.client) target.client = {};
				target.client[propertyName] = target[propertyName];
			}
		}

		export function NetworkEvent(side: Side) {
			return (target: TileEntityBase, propertyName: string) => {
				if (side == Side.Client) {
					if (!target.client) target.client = {};
					if (!target.client.events) target.client.events = {};
					target.client.events[propertyName] = target[propertyName];
					delete target[propertyName];
				} else {
					if (!target.events) target.events = {};
					target.events[propertyName] = target[propertyName];
				}
			}
		}

		export function ContainerEvent(side: Side) {
			return (target: TileEntityBase, propertyName: string) => {
				if (side == Side.Client) {
					if (!target.client) target.client = {};
					if (!target.client.containerEvents) target.client.containerEvents = {};
					target.client.containerEvents[propertyName] = target[propertyName];
					delete target[propertyName];
				} else {
					if (!target.containerEvents) target.containerEvents = {};
					target.containerEvents[propertyName] = target[propertyName];
				}
			}
		}
	}
}