import {users} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';
import * as helpers from '../helpers.js';
export const createUser = async (
    userID,
    username,
    userPassword,
    firstName,
    lastName,
    permissions,
    beingGranted,
    usersApproving,
    notifications
) => {
    let test = helpers.checkCreateUser(userID, username, userPassword, firstName, lastName, permissions, beingGranted, usersApproving, notifications);
    let newUser = {
        userID,
        username,
        userPassword,
        firstName,
        lastName,
        permissions,
        beingGranted,
        usersApproving,
        notifications 
    }
    const userCollection = await users();
    const insertInfo = await userCollection.insertOne(newUser);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) throw 'Could not add user';
    const newId = insertInfo.insertedId.toString();
    const user = await getUserById(newId);
    return user;
}

export const getUserById = async (id) => {
    let idtest = helpers.checkIsValidID(id, "id");
    const userCollection = await users();
    const user = await userCollection.findOne({_id: new ObjectId(id)});
    if (user === null) throw 'No user with that id';
    user._id = user._id.toString();
    return user;
}

export const getAllUsers = async () => {
    const userCollection = await users();
    let userList = await userCollection
        .find({})
        .project({_id: 1, name: 1})
        .toArray();
    if (!userList) throw 'Could not get all users';
    for (let user of userList){
        user._id = user._id.toString();
    }
    return userList;
}

export const removeUser = async (id) => {
    let idtest = helpers.checkIsValidID(id, "id");
    const userCollection = await users();
    const deletionInfo = await userCollection.findOneAndDelete({
        _id: new ObjectId(id)
    });
    if (!deletionInfo) {
        throw `Could not delete user with id of ${id}`;
    }
    return deletionInfo._id;
}