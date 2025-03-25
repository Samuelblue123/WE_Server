import UserModel, {IUser} from "../models/entities/userModel.ts";
import {BaseRepository} from "./base/baseRepository.ts";

export class UserRepository extends BaseRepository<IUser> {
    constructor() {
        super(UserModel);
    }
}
