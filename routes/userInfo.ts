import { Request, Router } from "express";
import validateJwtToken from "../middleware/jwtTokenValidator.middleware.js";
import userModel, { IUser } from "../models/entities/userModel.js";
import { DefaultResponse } from "../communication/responses/defaultResponse.js";

/**Maps all endpoints related to user information. */
const userInfoRouter = Router();
userInfoRouter.use(validateJwtToken);

// TODO: validate token for uuid being updated
userInfoRouter.get(
    "/",
    async (request: Request<{}>, response: DefaultResponse<string[]>) => {
        const uuid=request.header("uuid");
        console.log(uuid);
        const query = userModel.findOne({uuid: uuid});
        const user = await query.exec();
        const uuids:string[]=[]
        try {
            if (!user) {

                const tester = user.uuid;
                console.log(tester);

            }
        }
        catch (error) {
                response.status(637).send();
                return;
        }
        uuids.push(user.uuid);
        response.status(200).send(uuids);

    }
);

userInfoRouter.get(
    "/wes/",
    async (request: Request<{}>, response: DefaultResponse<string[]>) => {
        const uuid=request.header("uuid");
        const query = userModel.findOne({uuid: uuid});
        const user = await query.exec();
        try {
            if (!user) {

                const tester = user.uuid;
                console.log(tester);

            }
        }
        catch (error) {
            response.status(637).send();
            return;
        }
        response.status(200).send(user.worldevents);

    }
);

userInfoRouter.post(
    "/",
    async (
        request: Request<
            {},
            {},
            {
            }
        >,
        response: DefaultResponse<IUser>
    ) => {
        try {
            console.log(request.params);
            console.log(request.body);
            var newUser;
            const uuid = request.header("uuid");

                newUser = new userModel({
                    uuid: uuid,
                });

            await newUser.save();
            response.status(204).send(newUser);
        } catch (error) {
            console.error("post config error:", error);
            response.status(500).send({ error: "Something went wrong processing the request." });
        }
    }
);

userInfoRouter.put(
    "/",
    async (
        request: Request<
            {},
            {},
            {
                uuid:string;
                worldevents:string[];
            }
        >,
        response: DefaultResponse<IUser|string>
    ) => {
        try {
            console.log(request.params);
            console.log(request.body);
            const {uuid, worldevents} = request.body;
            const user = await userModel.findOne()
                .or([{uuid}])
                .exec();
            try {
                const index = user.worldevents.indexOf(worldevents[worldevents.length - 1]);
                console.log(index);
                if (!(index===-1)) {
                    response.status(628).send({error: "Already registered for that World Event."});
                    return;
                }
            }
            catch (error) {}
            await userModel.findOneAndReplace({uuid:uuid},{uuid:uuid, worldevents:worldevents},{upsert:true}).exec();
            const updatedUser = await userModel.findOne()
                .or([{uuid}])
                .exec();
            //newUser = new userModel({
            //    uuid: uuid,
            //    worldevents: worldevents
            //});
            response.status(204).send(updatedUser.toJSON().toString());
        }

         catch (error) {
            console.error("post config error:", error);
            response.status(500).send({ error: "Something went wrong processing the request." });
        }
    }
);

userInfoRouter.put(
    "/ut/",
    async (
        request: Request<
            {},
            {},
            {
                uuid:string;
                worldevents:string[];
            }
        >,
        response: DefaultResponse<IUser|string>
    ) => {
        try {
            console.log(request.params);
            console.log(request.body);
            var {uuid, worldevents} = request.body;
            const user = await userModel.findOne({uuid:uuid}).exec();
            const index = user.worldevents.indexOf(worldevents[worldevents.length-1]);
            console.log(index);

            if (index===-1) {
                response.status(627).send({error: "Not registered for that World Event."});
                return;
            }
            worldevents.splice(index,1);
            worldevents.splice(worldevents.length-1,1)
            await userModel.findOneAndReplace({uuid:uuid},{uuid:uuid, worldevents:worldevents},{upsert:true}).exec();
            const updatedUser = await userModel.findOne()
                .or([{uuid}])
                .exec();
            response.status(204).send(updatedUser.toJSON().toString());
        }

        catch (error) {
            console.error("post config error:", error);
            response.status(500).send({ error: "Something went wrong processing the request." });
        }
    }
);


export default userInfoRouter;