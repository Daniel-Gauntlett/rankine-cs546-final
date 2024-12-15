import {users} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';
import * as helpers from '../helpers.js';
export const createUser = async (
    username,
    userPassword,
    firstName,
    lastName,
    permissions,
    beingGranted,
    usersApproving,
    notifications
) => {
    let test = helpers.checkCreateUser(username, userPassword, firstName, lastName, permissions, beingGranted, usersApproving, notifications);
    let newUser = {
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
    id = helpers.checkIsValidID(id, "id");
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
    id = helpers.checkIsValidID(id, "id");
    const userCollection = await users();
    const deletionInfo = await userCollection.findOneAndDelete({
        _id: new ObjectId(id)
    });
    if (!deletionInfo) {
        throw `Could not delete user with id of ${id}`;
    }
    return deletionInfo._id;
}

export const updateUser = async (
    id,
    username,
    userPassword,
    firstName,
    lastName,
    permissions,
    beingGranted,
    usersApproving,
    notifications
) => {
    id = helpers.checkIsValidID(id, "id");
    let test = helpers.checkCreateUser(username, userPassword, firstName, lastName, permissions, beingGranted, usersApproving, notifications);
    let newUser = {
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
    const updatedInfo = await userCollection.findOneAndUpdate(
        {_id: new ObjectId(id)},
        {$set: newUser},
        {returnDocument: 'after'}
    );
    if (!updatedInfo) throw "Could not update user successfully";
    updatedInfo._id = updatedInfo._id.toString();
    return updatedInfo;
}

export const patchUser = async (
    id,
    updateObject
) => {
    let originalUser = await getUserById(id);
    updateObject = helpers.checkPatchEvent(id, originalUser, updateObject);
    let newUser = {
        ...originalUser,
        ...updateObject
    };
    delete newUser._id;
    let userCollection = await users();
    const updatedInfo = await userCollection.findOneAndUpdate(
        {_id: new ObjectId(id)},
        {$set: newUser},
        {returnDocument: 'after'}
    );
    if (!updatedInfo) throw "Could not update user successfully";
    updatedInfo._id = updatedInfo._id.toString();
    return updatedInfo;
}

export const updateNotifications = async (
    id,
    newNotification
) => {
    id = helpers.checkIsValidID(id, "id");
    let originalUser = await getUserById(id);
    newNotification = helpers.checkString(newNotification, "Given notification");
    let notifVal = originalUser.notifications.push(newNotification);
    let notifObject = {
        notifications: notifVal
    };
    let value = patchUser(id, notifObject);
    return notifObject;
}