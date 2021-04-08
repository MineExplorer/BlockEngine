LIBRARY({
	name: "BlockEngine",
	version: 3,
	shared: false,
	api: "CoreEngine"
});

namespace BlockEninge {
	const gameVersion = getMCPEVersion().array;

	export function getGameVersion() {
		return gameVersion;
	}

	export function getMainGameVersion() {
		return gameVersion[1];
	}
}
