import {ObjectId} from 'mongodb';
export const checkString = (data, name) =>
{
    if(!data) throw  `${name} isn't a valid non-empty string`;
    if(typeof data !== "string" || (data = data.trim()).length === 0) throw  `${name} isn't a valid non-empty string`;
    return data.trim();
};
export const checkIsValidDate = (data, name) =>
{
    let date = checkString(data, name);
    //Source: https://www.freecodecamp.org/news/how-to-validate-a-date-in-javascript/
    if(isNaN(new Date(date))) throw `${name} isn't a valid non-empty date`;
    return date;
}
export const checkIsValidID = (data, name) =>
{
    let id = checkString(data, name);
    if(!ObjectId.isValid(id)) throw `invalid object ID for ${name}`;
    return id;
}
export const checkIsValidIDs = (data, name) =>
{
    for(let id of data)
    {
        id = checkIsValidID(id, name);
    }
    return data;
}

export const checkCreateEvent = async (
    name,
    description,
    startDate,
    endDate,
    isRecurring,
    recurUntil,
    isPrivate,
    roomID,
    status,
    organizerID,
    rsvpList,
    attendeesList,
    picture
  ) => {
    if(!name) throw "No name given for event";
    if(!description) throw "No description given for event";
    if(!startDate) throw "No start date given for event";
    if(!endDate) throw "No end data given for event";
    if(typeof isRecurring !== "boolean") throw "Recurring is not a vaild boolean for event";
    if(!recurUntil && isRecurring) throw "No recur until date given for recurring event";
    if(recurUntil && !isRecurring) throw "Recur until date given for nonrecurring event";
    if(typeof isPrivate !== "boolean") throw "Private is not a valid boolean for event";
    if(!roomID) throw "No room ID is given for event";
    if(!status) throw "No status is given for event";
    if(!organizerID) throw "No organizer ID is given for event";
    if(!rsvpList) throw "No rsvp list is given for event";
    if(!attendeesList) throw "No attendees list is given for event";
    if(!picture) throw "No picture is given for event";
    name = checkString(name, "Name");
    description = checkString(description, "Description");
    startDate = checkIsValidDate(startDate, "Start date");
    endDate = checkIsValidDate(endDate, "End date");
    if(new Date(endDate) < new Date(startDate)) throw "The end date is before the start date";
    if(isRecurring) recurUntil = checkIsValidDate(recurUntil, "Recur until date");
    if(isRecurring && (new Date(recurUntil) < new Date(startDate) || new Date(recurUntil) < new Date(endDate))) throw "Recurring date is before end date or start date";
    roomID = checkIsValidID(roomID, "Room ID");
    if(typeof status !== "number" || (status !== 0 && status !== 1 && status !== 2)) throw "Status isn't a number";
    organizerID = checkIsValidID(organizerID, "Organizer ID");
    rsvpList = checkIsValidIDs(rsvpList, "RSVP list");
    attendeesList = checkIsValidIDs(attendeesList, "Attendees list");
    picture = checkString(picture, "Picture link");
    return true;
  }

  export const checkUpdateEvent = async (
    id,
    name,
    description,
    startDate,
    endDate,
    isRecurring,
    recurUntil,
    isPrivate,
    roomID,
    status,
    organizerID,
    rsvpList,
    attendeesList,
    picture
  ) => {
    if(!id) throw "No id given for event";
    id = checkIsValidID(id, "event ID");
    try {
        await checkCreateEvent(name,description,startDate,endDate,isRecurring,recurUntil,isPrivate,roomID,status,organizerID,rsvpList,attendeesList,picture);
    } catch (e) {
        throw e;
    }
  }

  export const checkCreateUser = (
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
        return true;
    }