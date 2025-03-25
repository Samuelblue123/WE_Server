import {Connection, Model, Schema} from "mongoose";
//import userSchema, {IUser} from "../schemas/userSchema.ts";


export class DatabaseModelFactory {
    private constructor(private readonly db: Connection) {
    }

    static create(db: Connection): DatabaseModelFactory {
        return new DatabaseModelFactory(db);
    }

//    createUserModel(): Model<IUser> {
//        return this.createModel("User", userSchema);
//    }

    private createModel<T>(name: string, schema: Schema<T>): Model<T> {
        return this.db.model<T>(name, schema);
    }
}