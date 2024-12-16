import {rooms} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';
import * as helpers from '../helpers.js';

//Create room

export const calculateUnavailableTimes = (times) => {
  //times argument: Array of arrays. Each array contains start date object, end date object, isRecurring, and end date for recurring. 
  //Returns list of pairs, each pair being a start date object and an end date object
  //For each element in Array:
  //Look at start date and end date, add as a pair to return array
  //If isRecurring is true, use while loop to keep duplicating start and end time + 1 week until end date, add each one to return array
  //Return pair list
  let unavailableTimes = []
  for(let array of times) {
    let startDate,  endDate, isRecurring, recurringEndDate
    if(array.length === 3) [startDate, endDate, isRecurring] = array
    else if (array.length = 4) [startDate, endDate, isRecurring, recurringEndDate] = array
    unavailableTimes.push([startDate, endDate])
    if (isRecurring) {
      let currentStartDate = new Date(startDate)
      let currentEndDate = new Date(endDate)
      while (currentStartDate < recurringEndDate) {
          currentStartDate.setDate(currentStartDate.getDate() + 7)
          currentEndDate.setDate(currentEndDate.getDate() + 7)
          if (currentStartDate <= recurringEndDate) {
              unavailableTimes.push([new Date(currentStartDate), new Date(currentEndDate)])
          }
      }
    }
  }

  return unavailableTimes
}

export const createRoom = async (
    building,
    roomNumber,
    roomCapacity,
    roomFeatures,
    unavailableTimesList,
    roomPicture
  ) => {
    let unavailableTimes
    try {
      await helpers.checkCreateRoom(building,roomNumber,roomCapacity,roomFeatures,unavailableTimesList,roomPicture);
      unavailableTimes = calculateUnavailableTimes(unavailableTimesList)
    }
    catch (e) {
      throw e;
    }
    let newRoom = {
      building,
      roomNumber,
      roomCapacity,
      roomFeatures,
      unavailableTimes,
      roomPicture
    };
    const roomCollection = await rooms();
    const insertInfo = await roomCollection.insertOne(newRoom);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
      throw 'Could not add room';
  
    const newId = insertInfo.insertedId.toString();
  
    const room = await getRoomByID(newId);
    return room;
  };

//Modify room
export const updateRoom = async (
    id,
    building,
    roomNumber,
    roomCapacity,
    roomFeatures,
    unavailableTimes,
    roomPicture
  ) => {
    
    try {
      await helpers.checkUpdateRoom(id,building,roomNumber,roomCapacity,roomFeatures,unavailableTimes,roomPicture);    } catch (e) {
      throw e;
    }
    let newRoom = {
        building,roomNumber,roomCapacity,roomFeatures,unavailableTimes,roomPicture
    };
    const roomCollection = await rooms();
    const updatedInfo = await roomCollection.findOneAndUpdate(
      {_id: new ObjectId(id)},
      {$set: newRoom},
      {returnDocument: 'after'}
    );
    if (!updatedInfo) {
      throw 'could not update room successfully';
    }
    updatedInfo._id = updatedInfo._id.toString();
    return updatedInfo;
  };

//Get room
export const getRoomByID = async (id) => {
    let x = new ObjectId();
    if (!id) throw 'You must provide an id to search for';
    if (typeof id !== 'string') throw 'Id must be a string';
    if (id.trim().length === 0)
      throw 'Id cannot be an empty string or just spaces';
    id = id.trim();
    if (!ObjectId.isValid(id)) throw 'invalid object ID';
    const roomCollection = await rooms();
    const room = await roomCollection.findOne({_id: new ObjectId(id)});
    if (room === null) throw 'No room with that id';
    room._id = room._id.toString();
    return room;
  };

export const getAllRooms = async () => {
    const roomCollection = await rooms();
    let roomList = await roomCollection
        .find({})
        .project({_id: 1, name: 1})
        .toArray();
    if (!roomList) throw 'Could not get all rooms';
    for(let room of roomList)
    {
        room._id = room._id.toString();
    }
    return roomList;
}

//Delete room
export const removeRoom = async (id) => {
    if (!id) throw 'You must provide an id to search for';
    if (typeof id !== 'string') throw 'Id must be a string';
    if (id.trim().length === 0)
      throw 'id cannot be an empty string or just spaces';
    id = id.trim();
    if (!ObjectId.isValid(id)) throw 'invalid object ID';
    const roomCollection = await rooms();
    const deletionInfo = await roomCollection.findOneAndDelete({
      _id: new ObjectId(id)
    });
  
    if (!deletionInfo) {
      throw `Could not delete room with id of ${id}`;
    }
    return deletionInfo._id;
  };

export const patchRoom = async (
    id,
    updateObject
  ) => {
    let originalRoom = await getRoomByID(id);
    updateObject = helpers.checkPatchRoom(id, originalRoom, updateObject);
    let newRoom = {
      ...originalRoom,
      ...updateObject
    };
    delete newRoom._id;
    const roomCollection = await rooms();
    const updatedInfo = await roomCollection.findOneAndUpdate(
      {_id: new ObjectId(id)},
      {$set: newRoom},
      {returnDocument: 'after'}
    );
    if (!updatedInfo) {
      throw 'could not update room successfully';
    }
    updatedInfo._id = updatedInfo._id.toString();
    return updatedInfo;
  };