namespace EntityCustomData {
	let entities = {};

	export function getAll(): {[key: number]: object} {
		return entities;
	}

	export function getData(entity: number): object {
		let data = entities[entity];
		if (!data) {
			data = {};
			putData(entity, data);
		}
		return data;
	}

	export function putData(entity: number, data: object): void {
		entities[entity] = data;
	}

	export function getField(entity: number, key: string): any {
		const playerData = getData(entity);
		if (playerData) {
			return playerData[key];
		}
	}

	export function putField(entity: number, key: string, value: any): void {
		const data = getData(entity);
		data[key] = value;
	}

	Saver.addSavesScope("EntityData",
		function read(scope) {
			entities = scope || {};
		},
		function save() {
			return entities;
		}
	);

	Callback.addCallback("EntityRemoved", function(entity) {
		delete entities[entity];
	});
}