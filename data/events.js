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
    try {
      await helpers.checkCreateEvent(name,description,startDate,endDate,isRecurring,recurUntil,isPrivate,roomID,status,organizerID,rsvpList,attendeesList,picture);
    }
    catch (e) {
      throw e;
    }
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
    if (event === null) throw 'No event with that id';
    event._id = event._id.toString();
    return event;
  };
export const getAllEvents = async () => {
    const eventCollection = await events();
    let eventList = await eventCollection
        .find({})
        .project({_id: 1, name: 1})
        .toArray();
    if (!eventList) throw 'Could not get all events';
    for(let event of eventList)
    {
        event._id = event._id.toString();
    }
    return eventList;
}

export const removeEvent = async (id) => {
    if (!id) throw 'You must provide an id to search for';
    if (typeof id !== 'string') throw 'Id must be a string';
    if (id.trim().length === 0)
      throw 'id cannot be an empty string or just spaces';
    id = id.trim();
    if (!ObjectId.isValid(id)) throw 'invalid object ID';
    const eventCollection = await events();
    const deletionInfo = await eventCollection.findOneAndDelete({
      _id: new ObjectId(id)
    });
  
    if (!deletionInfo) {
      throw `Could not delete event with id of ${id}`;
    }
    //{"_id": "507f1f77bcf86cd799439011", "deleted": true}
    return deletionInfo._id;
  };

export const updateEvent = async (
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
    
    try {
      await helpers.checkUpdateEvent(id,name,description,startDate,endDate,isRecurring,recurUntil,isPrivate,roomID,status,organizerID,rsvpList,attendeesList,picture);    } catch (e) {
      throw e;
    }
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
    const updatedInfo = await eventCollection.findOneAndUpdate(
      {_id: new ObjectId(id)},
      {$set: newEvent},
      {returnDocument: 'after'}
    );
    if (!updatedInfo) {
      throw 'could not update event successfully';
    }
    updatedInfo._id = updatedInfo._id.toString();
    return updatedInfo;
  };