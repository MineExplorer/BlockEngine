LIBRARY({
	name: "BlockEngine",
	version: 5,
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

	export function sendUnlocalizedMessage(client: NetworkClient, ...texts: string[]): void {
		client.send("blockengine.clientMessage", {texts: texts});
	}
}

Network.addClientPacket("blockengine.clientMessage", function(data: {texts: string[]}) {
	let message = data.texts.map(Translation.translate).join("");
	Game.message(message);
});