import mongoose, { Mongoose, MongooseQueryOptions } from "mongoose";
import { User } from "../models/user.model.js"
import { IUserUpdate, IUserInsert } from "../interfaces/user-interface.js";

export class UsersControllers {
  constructor() { }

  async getAll() {
    return await User.find({});
  }

  async createUser(userData: IUserInsert) {
    const insertedData = new User({
      ...userData,
      _id: new mongoose.Types.ObjectId(),
      role: "user"
    });
    return await insertedData.save();
  }

  async getById(id: string) {
    const objectId = new mongoose.Types.ObjectId(id); // skonwertowanie przekazanego identyfikatora na obiekt ObjectId przed wykonaniem zapytania.
    return await User.findOne({ _id: objectId }); // tutaj przypisujemy _id do skonwertowanego objectId
  }

  async updateById(id: string, userData: IUserUpdate) {
    const objectId = new mongoose.Types.ObjectId(id); // skonwertowanie przekazanego identyfikatora na obiekt ObjectId przed wykonaniem zapytania.
    const dataToUpdate = { ...userData, role: "user" }
    const updatedData = await User.findOneAndUpdate({ _id: objectId }, dataToUpdate, { new: true }); // tutaj przypisujemy _id do skonwertowanego objectId
    return updatedData;
  }
}