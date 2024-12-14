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
    if(isRecurring && recurUntil)
      {
        if(typeof isRecurring !== "boolean") throw "Recurring is not a vaild boolean for event";
        if(!recurUntil && isRecurring) throw "No recur until date given for recurring event";
        if(recurUntil && !isRecurring) throw "Recur until date given for nonrecurring event";
        if(isRecurring) recurUntil = checkIsValidDate(recurUntil, "Recur until date");
        if(isRecurring && (new Date(recurUntil) < new Date(startDate) || new Date(recurUntil) < new Date(endDate))) throw "Recurring date is before end date or start date";
        return recurUntil;
      }
      else if(isRecurring)
      {
        if(typeof isRecurring !== "boolean") throw "Recurring is not a vaild boolean for event";
        if(!originalEvent.recurUntil && isRecurring) throw "No recur until date given for recurring event";
        if(originalEvent.recurUntil && !isRecurring) throw "Recur until date given for nonrecurring event";
        return null;
      }
      else if(recurUntil)
      {
        if(!recurUntil && originalEvent.isRecurring) throw "No recur until date given for recurring event";
        if(recurUntil && !originalEvent.isRecurring) throw "Recur until date given for nonrecurring event";
        if(originalEvent.isRecurring) recurUntil = checkIsValidDate(recurUntil, "Recur until date");
        if(originalEvent.isRecurring && (new Date(recurUntil) < new Date(startDate) || new Date(recurUntil) < new Date(endDate))) throw "Recurring date is before end date or start date";
        return recurUntil;
      }
  }