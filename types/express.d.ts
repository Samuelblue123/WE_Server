
declare namespace Express {
    export interface Request {
        // wynnGuildId?: string;
        // serverQuery?: import("mongoose").Query<
        //     | (import("mongoose").Document<unknown, {}, import("../models/serverConfigModel.ts").ISeverConfig> &
        //           import("../models/serverConfigModel.ts").ISeverConfig)
        //     | null,
        //     import("mongoose").Document<unknown, {}, import("../models/serverConfigModel.ts").ISeverConfig> &
        //         import("../models/serverConfigModel.ts").ISeverConfig,
        //     {},
        //     import("../models/serverConfigModel.ts").ISeverConfig,
        //     "findOne",
        //     {}
        // >;
        userInfo?: import("mongoose").Document<
            unknown,
            {},
            import("../models/entities/userModel.ts").IUser
        > &
            import("../models/entities/userModel.ts").IUser;
        worldevents?: string[];
        discordGuildId?: string;
        uuid?: string;
        serverConfig?: import("mongoose").Document<
            unknown,
            {},
            import("../models/entities/serverConfigModel.ts").IServerConfig
        > &
            import("../models/entities/serverConfigModel.ts").IServerConfig;
    }
}
