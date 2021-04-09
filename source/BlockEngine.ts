LIBRARY({
	name: "BlockEngine",
	version: 4,
	shared: false,
	api: "CoreEngine"
});

namespace BlockEngine {
	const gameVersion = getMCPEVersion().array;

	export function getGameVersion() {
		return gameVersion;
	}

	export function getMainGameVersion() {
		return gameVersion[1];
	}
}
