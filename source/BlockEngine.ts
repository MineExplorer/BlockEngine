LIBRARY({
	name: "BlockEngine",
	version: 10,
	shared: true,
	api: "CoreEngine"
});

const EntityGetYaw = ModAPI.requireGlobal("Entity.getYaw");
const EntityGetPitch = ModAPI.requireGlobal("Entity.getPitch");

namespace BlockEngine {
	const gameVersion = getMCPEVersion().array;

	export function getGameVersion(): number[] {
		return gameVersion;
	}

	export function getMainGameVersion(): number {
		return gameVersion[1];
	}

	export function sendUnlocalizedMessage(client: NetworkClient, ...texts: string[]): void {
		client.send("blockengine.clientMessage", {texts: texts});
	}
}

Network.addClientPacket("blockengine.clientMessage", function(data: {texts: string[]}) {
	const message = data.texts.map(Translation.translate).join("");
	Game.message(message);
});
