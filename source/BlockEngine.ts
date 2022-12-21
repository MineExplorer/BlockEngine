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

	/**
	 * @returns game version as array
	 */
	export function getGameVersion(): number[] {
		return gameVersion;
	}

	/**
	 * @returns main game version number
	 */
	export function getMainGameVersion(): number {
		return gameVersion[1];
	}

	/**
	 * Sends packet with message which will be translated by the client. 
	 * @param client receiver client
	 * @param texts array of strings which will be translated and combined in one message.
	 */
	export function sendUnlocalizedMessage(client: NetworkClient, ...texts: string[]): void {
		client.send("blockengine.clientMessage", {texts: texts});
	}
}

Network.addClientPacket("blockengine.clientMessage", function(data: {texts: string[]}) {
	const message = data.texts.map(Translation.translate).join("");
	Game.message(message);
});
