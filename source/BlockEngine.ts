enum Side {
	Client,
	Server
}

namespace BlockEngine {
	export namespace Decorators {
		function createField(target: object, field: string) {
			target[field] = {...target[field]};
		}

		export function ClientSide(target: TileEntityBase, propertyName: string) {
			createField(target, "client");
			target.client[propertyName] = target[propertyName];
		}

		export function NetworkEvent(side: Side) {
			return (target: TileEntityBase, propertyName: string) => {
				if (side == Side.Client) {
					createField(target, "client");
					createField(target.client, "events");
					target.client.events[propertyName] = target[propertyName];
					delete target[propertyName];
				} else {
					createField(target, "events");
					target.events[propertyName] = target[propertyName];
				}
			}
		}

		export function ContainerEvent(side: Side) {
			return (target: TileEntityBase, propertyName: string) => {
				if (side == Side.Client) {
					createField(target, "client");
					createField(target.client, "containerEvents");
					target.client.containerEvents[propertyName] = target[propertyName];
					delete target[propertyName];
				} else {
					createField(target, "containerEvents");
					target.containerEvents[propertyName] = target[propertyName];
				}
			}
		}
	}
}