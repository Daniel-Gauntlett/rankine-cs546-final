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
    if (!userID) throw "No User ID given";
    if (!username) throw "No username given for the user";
    if (!userPassword) throw "No password given for the user";
    if (!firstName) throw "No first name given for the user";
    if (!lastName) throw "No last name given for the user";
    if (!permissions) throw "No permissions supplied for the user";
    if (!beingGranted) throw "No being granted status given for the user";
    if (!usersApproving) throw "No users approving array provided for the user";
    if (!notifications) throw "No notifications array provided for the user";
    userID = helpers.checkIsValidID(userID, "User ID");
    username = helpers.checkString(username, "Username");
    userPassword = helpers.checkString(userPassword, "Password");
    firstName = helpers.checkString(firstName, "First Name");
    lastName = helpers.checkString(lastName, "Last Name");
    if (permissions !== 0 && permissions !== 1 && permissions !== 2) throw "Permissions is not a valid integer";
    if (typeof beingGranted !== "boolean") throw "Boolean not provided for being granted status";
    if (!Array.isArray(usersApproving)) throw "Given users approving list is not an array";
    for (let i = 0; i < usersApproving.length; i++){
        let testval = helpers.checkIsValidID(usersApproving[i], "Administrator Account ID");
    }
    if (!Array.isArray(notifications)) throw "Given notifications is not an array";
    for (let i = 0; i < notifications.length; i++){
        let testval = helpers.checkString(notifications[i], "Notification");
    }
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