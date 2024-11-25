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
    if(!recurUntil) throw "No recur until date given for event";
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
    recurUntil = helpers.checkIsValidDate(recurUntil, "Recur until date");
    roomID = helpers.checkIsValidID(roomID, "Room ID");
    if(typeof status !== "number") throw "Status isn't a number";
    organizerID = helpers.checkIsValidID(organizerID, "Organizer ID");
    rsvpList = helpers.checkIsValidIDs(rsvpList, "RSVP list");
    attendeesList = helpers.checkIsValidIDs(attendeesList, "Attendees list");
    picture = helpers.checkString(picture, "Picutre link");
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
      throw 'Could not add team';
  
    const newId = insertInfo.insertedId.toString();
  
    const team = await getEventByID(newId);
    return team;
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