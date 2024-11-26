import {events} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';
import * as helpers from '../helpers.js';
export const createEvent = async (
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
    name = helpers.checkString(name, "Name");
    description = helpers.checkString(description, "Description");
    startDate = helpers.checkIsValidDate(startDate, "Start date");
    endDate = helpers.checkIsValidDate(endDate, "End date");
    if(new Date(endDate) < new Date(startDate)) throw "The end date is before the start date";
    if(isRecurring) recurUntil = helpers.checkIsValidDate(recurUntil, "Recur until date");
    if(isRecurring && (new Date(recurUntil) < new Date(startDate) || new Date(recurUntil) < new Date(endDate))) throw "Recurring date is before end date or start date";
    roomID = helpers.checkIsValidID(roomID, "Room ID");
    if(typeof status !== "number" || (status !== 0 && status !== 1 && status !== 2)) throw "Status isn't a number";
    organizerID = helpers.checkIsValidID(organizerID, "Organizer ID");
    rsvpList = helpers.checkIsValidIDs(rsvpList, "RSVP list");
    attendeesList = helpers.checkIsValidIDs(attendeesList, "Attendees list");
    picture = helpers.checkString(picture, "Picture link");
    let newEvent = {
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
    };
    const eventCollection = await events();
    const insertInfo = await eventCollection.insertOne(newEvent);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
      throw 'Could not add event';
  
    const newId = insertInfo.insertedId.toString();
  
    const event = await getEventByID(newId);
    return event;
  };

export const getEventByID = async (id) => {
    let x = new ObjectId();
    if (!id) throw 'You must provide an id to search for';
    if (typeof id !== 'string') throw 'Id must be a string';
    if (id.trim().length === 0)
      throw 'Id cannot be an empty string or just spaces';
    id = id.trim();
    if (!ObjectId.isValid(id)) throw 'invalid object ID';
    const eventCollection = await events();
    const event = await eventCollection.findOne({_id: new ObjectId(id)});
    if (event === null) throw 'No team with that id';
    event._id = event._id.toString();
    return event;
  };
export const getAllEvents = async () => {
    const eventCollection = await events();
    let eventList = await eventCollection
        .find({})
        .project({_id: 1, name: 1})
        .toArray();
    if (!eventList) throw 'Could not get all teams';
    for(let event of eventList)
    {
        event._id = event._id.toString();
    }
    return eventList;
}