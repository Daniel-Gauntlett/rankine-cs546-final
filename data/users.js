import {users} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';
import * as helpers from '../helpers.js';
import bcrypt from 'bcrypt';

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

export const signUpUser = async (
    username,
    userPassword,
    firstName,
    lastName,
  ) => {
    let testval = helpers.checkSignUpUser(username, userPassword, firstName, lastName);
    let userCollection = await users();
    let dupeuser = await userCollection.findOne({username: username});
    if (dupeuser !== null) throw "Duplicate username was found, please use a different one.";
    let newUser = {
        username: username,
        userPassword: userPassword,
        firstName: firstName,
        lastName: lastName,
        permissions: 0,
        beingGranted: false,
        usersApproving: [],
        notifications: []
    }
    let insertInfo = await userCollection.insertOne(newUser);
    if (!insertInfo.acknowledged || !insertInfo.insertedId){
      throw "Could not add user";
    }
    let newId = insertInfo.insertedId.toString();
    return {registrationCompleted: true}; 
  };

export const signInUser = async (username, userPassword) => {
    let testval = helpers.checkSignInUser(username, userPassword);
    let userCollection = await users();
    let user = await userCollection.findOne({username: username});
    if (!user) throw "Either the username or password is invalid";
    let userPass = user.password;
    let truthval = await bcrypt.compare(password, userPass);
    if (truthval){
      let userFields = {
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        permissions: user.permissions,
        notifications: user.notifications
      }
      return userFields;
    }
    throw "Either the username or password is invalid";  
}

export const permissionsCheck = async (adminId, userId, usersApproving, permissions) => {
    if (!adminId) throw "No admin id given";
    if (!userId) throw "No user id given";
    if (!usersApproving) throw "No approving users given";
    if (!permissions) throw "No permissions given";
    if (!Array.isArray(usersApproving)) throw "Given users approving list is not an array";
    for (let i = 0; i < usersApproving.length; i++){
        let testval = helpers.checkIsValidID(usersApproving[i], "Administrator Account ID");
    }
    if (permissions !== 0 && permissions !== 1 && permissions !== 2) throw "Permissions is not a valid integer";
    if (permissions === 2) throw "Permissions is already at the highest level";
    adminId = helpers.checkIsValidID(adminId, "Admin ID");
    userId = helpers.checkIsValidID(userId, "User ID");
    usersApproving.push(adminId);
    if (usersApproving.length >= 2){
        permissions++;
        let obj = {
            permissions: permissions,
            usersApproving: []
        };
        let test = patchUser(userId, obj);
    }
    return test;
}