import mongoose, { Model, Schema } from "mongoose";
import { BaseModel } from "./baseModel.ts";

export interface IUser extends BaseModel {
    uuid: string;
    worldevents: string[];
    getWorldEvents(value :string) : number | undefined;

}

const userSchema: Schema<IUser> = new Schema(
    {
        uuid: { type: String, required: true },
        worldevents: { type: [String], required: false, default: null },
    },
    {
        collation: { locale: "en", strength: 2 },
    }

);

const UserModel = mongoose.model("User", userSchema);

userSchema.methods.getWorldEvent = function (this: IUser, value: string): number | undefined {
    return this.worldevents.indexOf(value);
};

export default UserModel;
