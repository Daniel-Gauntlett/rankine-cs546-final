import {ObjectId} from 'mongodb';
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

export const checkCreateRoom = async (
    building,
    roomNumber,
    roomCapacity,
    roomFeatures,
    unavaliableTimes,
    roomPicture
    ) => {
    if(!building) throw "Building name not given";
    building = checkString(building, "Building");

    if(!roomNumber) throw "Room Number not given";
    roomNumber = checkString(roomNumber, "Room Number")

    if(!roomCapacity) throw "Room capacity not given";
    roomCapacity = checkString(roomCapacity, "Room Capacity")

    if(!roomFeatures) throw "Room features not given";
    roomFeatures = checkArrayOfStrings(roomFeatures, "Room Features")

    if(!unavaliableTimes) throw "Times not given";
    unavaliableTimes = checkDateArrayArray(unavaliableTimes, "Date Array")

    if(!roomPicture) throw "Picture URL not given"
    roomPicture = checkString(roomPicture, "Room Picture")

}