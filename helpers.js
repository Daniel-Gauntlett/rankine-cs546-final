import {ObjectId} from 'mongodb';
import bcrypt from 'bcrypt';
export const checkString = (data, name) =>
{
    if(!data) throw  `${name} isn't a valid non-empty string`;
    if(typeof data !== "string" || (data = data.trim()).length === 0) throw  `${name} isn't a valid non-empty string`;
    return data.trim();
};

export const checkArrayOfStrings = (data, name) =>
{
    for(let string of data){
        string = checkString(string, name)
    }
    return data
};

export const checkCapacity = (data) =>
{
  if (typeof data !== "number") throw "Room capacity must be a number"
  if (data <= 0) throw "Room capacity must be greater than 0"
  return data
}

export const isDate = (obj) => 
{
    return obj instanceof Date;
}

export const checkDateArray = (data, name) =>
{
    if(!data) throw `${name} isn't a valid non-empty string`;
    if(!Array.isArray(data) && data.length < 3) throw  `${name} isn't a valid date array`;
    // first value is a date
    if(!isDate(data[0])) throw `${name} isn't a valid date array`
    // second value is a date
    if(!isDate(data[1])) throw `${name} isn't a valid date array`
    // third value is a boolean
    if(typeof(data[2]) !== "boolean") throw `${name} isn't a valid date array`
    // fourth value is a date, and only exists if the third value is true
    if(data[2]){
        if(!isDate(data[3])) throw `${name} isn't a valid date array`
    }
    return 0
};

export const checkDateArrayArray = (data, name) =>
{
  if(!Array.isArray(data)) throw `${name} isn't a valid date array`
  if(data.length === 0) return data
  for(let array of data){
        checkDateArray(array, name)
    }
    return data
}

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
export const  checkIsValidPassword = async (password, saltRounds) =>
{
  password = checkString(password, "Given password");
  let passtest1 = false;
  let passtest2 = false;
  let passtest3 = false;
  let uppercaseChars = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
  let specialChars = ["~", "`", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "_", "-", "+", "=", "{", "}", "[", "]", "|", ":", ";", "'", "<", ">", ",", ".", "?", "/", "\\"];
  for (let i = 0; i < password.length; i++){
    if (uppercaseChars.includes(password[i])) passtest1 = true;
    if (specialChars.includes(password[i])) passtest2 = true;
    if (password[i] === "0" || Number(password[i]) > 0) passtest3 = true;
  }
  if (passtest1 && passtest2 && passtest3){
    passtest1 = true;
  }
  else{
    throw "Given password is invalid, must include an uppercase character, a special character, and a number.";
  }
  let hash = await bcrypt.hash(password, saltRounds);
  return hash;
}

export const checkCreateEvent = (
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
    if(typeof status !== "number" && !status) throw "No status is given for event";
    if(!organizerID) throw "No organizer ID is given for event";
    if(!rsvpList) throw "No rsvp list is given for event";
    if(!attendeesList) throw "No attendees list is given for event";
    if(!picture) throw "No picture is given for event";
    name = checkString(name, "Name");
    if(name.length>50 || name.length<3) throw "Event name should be between 3 and 50 characters";
    description = checkString(description, "Description");
    if(description.length<25 || description.length > 225) throw "Description name should be between 25 and 225 characters.";
    startDate = checkIsValidDate(startDate, "Start date");
    endDate = checkIsValidDate(endDate, "End date");
    if(new Date(endDate) < new Date(startDate)) throw "The end date is before the start date";
    if(isRecurring) recurUntil = checkIsValidDate(recurUntil, "Recur until date");
    if(isRecurring && (new Date(recurUntil) < new Date(startDate) || new Date(recurUntil) < new Date(endDate))) throw "Recurring date is before end date or start date";
    roomID = checkIsValidID(roomID, "Room ID");
    if(typeof status !== "number" || (status !== 0 && status !== 1 && status !== 2)) throw "Status isn't a number";
    organizerID = checkString(organizerID, "Organizer ID");
    rsvpList = checkArrayOfStrings(rsvpList, "RSVP list");
    attendeesList = checkArrayOfStrings(attendeesList, "Attendees list");
    picture = checkString(picture, "Picture link");
    return {name, description, startDate, endDate, isRecurring, recurUntil, isPrivate, roomID, status, organizerID, rsvpList, attendeesList, picture};
  }

  export const checkUpdateEvent = (
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
    return checkCreateEvent(name,description,startDate,endDate,isRecurring,recurUntil,isPrivate,roomID,status,organizerID,rsvpList,attendeesList,picture);
  }

  export const checkPatchEvent = (
    id,
    originalEvent,
    updateObject
  ) => {
    if(!id) throw "No id given for event";
    if(!originalEvent) originalEvent = undefined;
    id = checkIsValidID(id, "event ID");
    if('name' in updateObject) updateObject.name = checkString(updateObject.name);
    if('description' in updateObject) updateObject.description = checkString(updateObject.description);
    if('startDate' in updateObject && 'endDate' in updateObject)
    {
      updateObject.startDate = checkIsValidDate(updateObject.startDate);
      updateObject.endDate = checkIsValidDate(updateObject.endDate);
      if(new Date(updateObject.endDate) < new Date(updateObject.startDate)) throw "The end date is before the start date";
      let recurUntil2 = checkPatchRecur(updateObject.startDate, updateObject.endDate, updateObject.recurUntil, updateObject.isRecurring, originalEvent);
      if(!recurUntil2) updateObject.recurUntil = recurUntil2;
    }
    else if ('startDate' in updateObject)
    {
      updateObject.startDate = checkIsValidDate(updateObject.startDate);
      if(new Date(originalEvent.endDate) < new Date(updateObject.startDate)) throw "The end date is before the start date";
      let recurUntil2 = checkPatchRecur(updateObject.startDate, originalEvent.endDate, updateObject.recurUntil, updateObject.isRecurring, originalEvent);
      if(!recurUntil2) updateObject.recurUntil = recurUntil2;
    }
    else if ('endDate' in updateObject)
    {
      updateObject.endDate = checkIsValidDate(updateObject.endDate);
      if(new Date(endDate) < new Date(originalEvent.startDate)) throw "The end date is before the start date";
      let recurUntil2 = checkPatchRecur(originalEvent.startDate, updateObject.endDate, updateObject.recurUntil, updateObject.isRecurring, originalEvent);
      if(!recurUntil2) updateObject.recurUntil = recurUntil2;
    }
    else
    {
      let recurUntil2 = checkPatchRecur(originalEvent.startDate, originalEvent.endDate, updateObject.recurUntil, updateObject.isRecurring, originalEvent);
      if(!recurUntil2) updateObject.recurUntil = recurUntil2;
    }
    if('roomID' in updateObject) updateObject.roomID = checkIsValidID(updateObject.roomID);
    if('status' in updateObject && (typeof updateObject.status !== "number" || (updateObject.status !== 0 && updateObject.status !== 1 && updateObject.status !== 2)))throw "Status isn't a number";
    if('organizerID' in updateObject) updateObject.organizerID = checkIsValidID(updateObject.organizerID);
    if('rsvpList' in updateObject) updateObject.rsvpList = checkIsValidIDs(updateObject.rsvpList);
    if('picture' in updateObject) updateObject.picture = checkString(updateObject.picture);
    return updateObject;
  }
  const checkPatchRecur = (startDate, endDate, recurUntil, isRecurring, originalEvent) =>{
    if(typeof isRecurring !== "undefined" && typeof recurUntil !== "undefined")
      {
        if(typeof isRecurring !== "boolean") throw "Recurring is not a vaild boolean for event";
        if(!recurUntil && isRecurring) throw "No recur until date given for recurring event";
        if(recurUntil && !isRecurring) throw "Recur until date given for nonrecurring event";
        if(isRecurring) recurUntil = checkIsValidDate(recurUntil, "Recur until date");
        if(isRecurring && (new Date(recurUntil) < new Date(startDate) || new Date(recurUntil) < new Date(endDate))) throw "Recurring date is before end date or start date";
        return recurUntil;
      }
      else if(typeof isRecurring !== "undefined")
      {
        if(typeof isRecurring !== "boolean") throw "Recurring is not a vaild boolean for event";
        if(!originalEvent.recurUntil && isRecurring) throw "No recur until date given for recurring event";
        if(originalEvent.recurUntil && !isRecurring) throw "Recur until date given for nonrecurring event";
        return null;
      }
      else if(typeof recurUntil !== "undefined")
      {
        if(!recurUntil && originalEvent.isRecurring) throw "No recur until date given for recurring event";
        if(recurUntil && !originalEvent.isRecurring) throw "Recur until date given for nonrecurring event";
        if(originalEvent.isRecurring) recurUntil = checkIsValidDate(recurUntil, "Recur until date");
        if(originalEvent.isRecurring && (new Date(recurUntil) < new Date(startDate) || new Date(recurUntil) < new Date(endDate))) throw "Recurring date is before end date or start date";
        return recurUntil;
      }
      return originalEvent.recurUntil;
  }

export const checkCreateUser = async (
    username,
    userPassword,
    firstName,
    lastName,
    permissions,
    beingGranted,
    usersApproving,
    notifications
    ) => {
        if (!username) throw "No username given for the user";
        if (!userPassword) throw "No password given for the user";
        if (!firstName) throw "No first name given for the user";
        if (!lastName) throw "No last name given for the user";
        if (permissions !== 0){
          if (!permissions) throw "No permissions supplied for the user";
        }
        if (beingGranted !== false){
          if (!beingGranted) throw "No being granted status given for the user";
        }
        if (!usersApproving) throw "No users approving array provided for the user";
        if (!notifications) throw "No notifications array provided for the user";
        username = checkString(username, "Username");
        if (username.length < 5 || username.length > 10) throw "Given username is incorrect length";
        userPassword = await checkIsValidPassword(userPassword, 8);
        firstName = checkString(firstName, "First Name");
        if (firstName.length < 2 || firstName.length > 25) throw "Given first name is incorrect length";
        lastName = checkString(lastName, "Last Name");
        if (lastName.length < 2 || lastName.length > 25) throw "Given first name is incorrect length";
        if (permissions !== 0 && permissions !== 1 && permissions !== 2) throw "Permissions is not a valid integer";
        if (typeof beingGranted !== "boolean") throw "Boolean not provided for being granted status";
        if (!Array.isArray(usersApproving)) throw "Given users approving list is not an array";
        let testval = checkArrayOfStrings(usersApproving);
        if (!Array.isArray(notifications)) throw "Given notifications is not an array";
        for (let i = 0; i < notifications.length; i++){
            let testval = checkString(notifications[i], "Notification");
        }
        let returnobj = {
          username: username,
          userPassword: userPassword,
          firstName: firstName,
          lastName: lastName,
          permissions: permissions,
          beingGranted: beingGranted,
          usersApproving: usersApproving,
          notifications: notifications
        }
        return returnobj;
}
export const checkPatchUser = async (
    id,
    originalUser,
    updateObject
  )  => {
    if(!id) throw "No id given for user";
    if(!originalUser) throw "No original user given";
    if(!updateObject) throw "No update object given for user";
    id = checkIsValidID(id, "User ID");
    if ('username' in updateObject) updateObject.username = checkString(updateObject.username);
    if ('username' in updateObject && (updateObject.username.length < 5 || updateObject.username.length > 10)) throw "Given username is incorrect length, must be between 5-10 characters.";
    if ('userPassword' in updateObject) updateObject.userPassword = await checkIsValidPassword(userPassword, 8);
    if ('userPassword' in updateObject && originalUser.userPassword === updateObject.userPassword) throw "Given updated password needs to be different";
    if ('firstName' in updateObject) updateObject.firstName = checkString(updateObject.firstName);
    if ('firstName' in updateObject && (updateObject.firstName.length < 2 || updateObject.firstName.length > 25)) throw "Given first name is incorrect length";
    if ('lastName' in updateObject) updateObject.lastName = checkString(updateObject.lastName);
    if ('lastName' in updateObject && (updateObject.lastName.length < 2 || updateObject.lastName.length > 25)) throw "Given last name is incorrect length";
    if ('permissions' in updateObject && (permissions !== 0 && permissions !== 1 && permissions !== 2)) throw "Permissions is not a valid integer";
    if ('beingGranted' in updateObject && (typeof updateObject.beingGranted !== "boolean")) throw "Given being granted status is not a boolean";
    if ('usersApproving' in updateObject){
      if (!Array.isArray(updateObject.usersApproving)) throw "Given users approving list is not an array";
        for (let i = 0; i < updateObject.usersApproving.length; i++){
          let testval = checkIsValidID(updateObject.usersApproving[i], "Administrator Account ID");
        }
    }
    if ('notifications' in updateObject){
      if (!Array.isArray(updateObject.notifications)) throw "Given users notifications list is not an array";
        for (let i = 0; i < updateObject.notifications.length; i++){
          let testval = checkIsValidID(updateObject.notifications[i], "Notification");
        }
    }
    return updateObject;
  }

export const checkSignUpUser = async (
  username,
  userPassword,
  firstName,
  lastName
  ) => {
    if (!username) throw "No username given";
    if (!userPassword) throw "No password given";
    if (!firstName) throw "No first name given";
    if (!lastName) throw "No last name given";
    username = checkString(username, "Given first name");
    if (username.length < 5 || firstName.length > 10) throw "Given username is incorrect length, must be between 5-10 characters.";
    userPassword = await checkIsValidPassword(userPassword, 8);
    firstName = checkString(firstName, "Given first name");
    if (firstName.length < 2 || firstName.length > 25) throw "Given first name is incorrect length";
    lastName = checkString(lastName, "Given last name");
    if (lastName.length < 2 || lastName.length > 25) throw "Given last name is incorrect length";
    return true;
}

export const checkSignInUser = async (username, userPassword) => {
    if (!username) throw "No username given";
    if (!userPassword) throw "No password given";
    username = checkString(username, "Given first name");
    if (username.length < 5 || username.length > 10) throw "Given username is incorrect length, must be between 5-10 characters.";
    userPassword = checkIsValidPassword(userPassword, 8);
    return true;
}

export const checkCreateRoom = async (
    building,
    roomNumber,
    roomCapacity,
    roomFeatures,
    unavailableTimes,
    roomPicture
    ) => {
    if(!building) throw "Building name not given";
    building = checkString(building, "Building");

    if(!roomNumber) throw "Room Number not given";
    roomNumber = checkString(roomNumber, "Room Number")

    if(!roomCapacity) throw "Room capacity not given";
    roomCapacity = checkCapacity(roomCapacity)

    if(!roomFeatures) throw "Room features not given";
    roomFeatures = checkArrayOfStrings(roomFeatures, "Room Features")

    if(!unavailableTimes)
    unavailableTimes = checkDateArrayArray(unavailableTimes, "Date Array")

    if(!roomPicture) throw "Picture URL not given"
    roomPicture = checkString(roomPicture, "Room Picture")
    return {building, roomNumber, roomCapacity, roomFeatures, unavailableTimes, roomPicture}
}

export const checkUpdateRoom = async (
    roomID,
    building,
    roomNumber,
    roomCapacity,
    roomFeatures,
    unavailableTimes,
    roomPicture
    ) => {
    if(!roomID) throw "No id given for event";
    id = checkIsValidID(id, "event ID");
    try {
        return await checkCreateRoom(building, roomNumber,
            roomCapacity,
            roomFeatures,
            unavailableTimes,
            roomPicture);
    } catch (e) {
        throw e;
    }

}

export const checkPatchRoom = (
    id,
    originalRoom,
    updateObject
  ) => {
    if(!id) throw "No id given for room";
    if(!originalRoom) originalRoom = undefined;
    id = checkIsValidID(id, "room ID");
    if('building' in updateObject) updateObject.building = checkString(updateObject.building);
    if('roomNumber' in updateObject) updateObject.roomNumber = checkString(updateObject.roomNumber);
    if('roomCapacity' in updateObject) updateObject.roomCapacity = checkCapacity(updateObject.roomCapacity);
    if('roomFeatures' in updateObject) updateObject.roomFeatures = checkArrayOfStrings(updateObject.roomFeatures)
    if('unavaliableTimes' in updateObject) updateObject.unavailableTimes = checkDateArrayArray(updateObject.unavailableTimes)
    if('roomPicture' in updateObject) updateObject.picture = checkString(updateObject.picture);
    return updateObject;
  }