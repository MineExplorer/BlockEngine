LIBRARY({
	name: "BlockEngine",
	version: 11,
	shared: true,
	api: "CoreEngine"
});

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
	 * @deprecated Use sendMessage instead.
	 */
	export function sendUnlocalizedMessage(client: NetworkClient, ...texts: string[]): void {
		client.send("blockengine.clientMessageOld", {texts: texts});
	}

	/**
	 * Sends packet with message which will be translated by the client,
	 * the message can be parametrized using '%s' symbols as placeholders.
	 * @param client receiver client
	 * @param message unlocalized string
	 * @param params array of unlocalized substrings that will be substituted into the message after translation
	 */
	export function sendMessage(client: NetworkClient, message: string, ...params: string[]): void;
	/**
	 * Sends packet with message which will be translated by the client,
	 * the message can be parametrized using '%s' symbols as placeholders.
	 * @param client receiver client
	 * @param color chat color code
	 * @param message unlocalized string
	 * @param params array of unlocalized substrings that will be substituted into the message after translation
	 */
	export function sendMessage(client: NetworkClient, color: EColor, message: string, ...params: string[]): void;
	export function sendMessage(client: NetworkClient, text: string, ...params: string[]): void {
		if (text[0] == '§' && params.length > 0) {
			const message = params.shift();
			client.send("blockengine.clientMessage", {msg: message, color: text, params: params});
		} else {
			client.send("blockengine.clientMessage", {msg: text, params: params});
		}
	}
}

Network.addClientPacket("blockengine.clientMessageOld", function(data: {texts: string[]}) {
	const message = data.texts.map(Translation.translate).join("");
	Game.message(message);
});

Network.addClientPacket("blockengine.clientMessage", function(data: {msg: string, color?: string, params: string[]}) {
	let message = (data.color || "") + Translation.translate(data.msg);
	data.params.forEach(substr => {
		message = message.replace("%s", Translation.translate(substr));
	});
	Game.message(message);
});
