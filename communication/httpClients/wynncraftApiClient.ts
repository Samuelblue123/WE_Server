import {usernameToUuid} from "./mojangApiClient.ts";
import {insertDashes} from "../../utils/uuidUtils.ts";

async function getPlayersGuildAsync(username: string) {
    const apiUrl = `https://api.wynncraft.com/v3/player/${insertDashes(await usernameToUuid(username))}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    return data.online ?? null;
}

export default async function checkIfPlayerIsInOnlineAsync(username: string, onlinePlayer: boolean): Promise<boolean> {
    const online = await getPlayersGuildAsync(username);

    return online != null && online.uuid == onlinePlayer;
}
