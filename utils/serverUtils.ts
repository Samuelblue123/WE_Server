import ServerConfigModel from "../models/entities/serverConfigModel.ts";

export async function getChannelFromWynnGuild(wynnGuildId: string) {
    const config = await ServerConfigModel.findOne({ wynnGuildId: wynnGuildId }).exec();
    if (!config) return "none";
    return config.listeningChannel;
}
