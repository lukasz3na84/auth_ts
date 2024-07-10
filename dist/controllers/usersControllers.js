import mongoose from "mongoose";
import { User } from "../models/user.model.js";
export class UsersControllers {
    constructor() { }
    async getAll() {
        return await User.find({});
    }
    async createUser(userData) {
        const insertedData = new User({
            ...userData,
            _id: new mongoose.Types.ObjectId(),
            role: "user"
        });
        return await insertedData.save();
    }
    async getById(id) {
        return await User.findOne({ _id: id });
    }
    async updateById(id, userData) {
        const dataToUpdate = { ...userData, role: "user" };
        const updatedData = await User.findOneAndUpdate({ _id: id }, dataToUpdate, { new: true });
        return updatedData;
    }
}
