import {rooms} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';
import * as helpers from '../helpers.js';

//Create room

export const createRoom = async (
    building,
    roomNumber,
    roomCapacity,
    roomFeatures,
    unavaliableTimes,
    roomPicture
  ) => {
    try {
      await helpers.checkCreateRoom(roomID,building,roomNumber,roomCapacity,roomFeatures,unavaliableTimes,roomPicture);
    }
    catch (e) {
      throw e;
    }
    let events = {}
    let newroom = {
      building,
      roomNumber,
      roomCapacity,
      roomFeatures,
      events,
      unavaliableTimes,
      roomPicture
    };
    const rooomCollection = await rooms();
    const insertInfo = await roomCollection.insertOne(newRoom);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
      throw 'Could not add room';
  
    const newId = insertInfo.insertedId.toString();
  
    const room = await getRoomByID(newId);
    return room;
  };

//Modify room
export const updateRoom = async (
    roomID,
    building,
    roomNumber,
    roomCapacity,
    roomFeatures,
    events,
    unavaliableTimes,
    roomPicture
  ) => {
    
    try {
      await helpers.checkUpdateRoom(roomID,building,roomNumber,roomCapacity,roomFeatures,events,unavaliableTimes,roomPicture);    } catch (e) {
      throw e;
    }
    let newRoom = {
        building,roomNumber,roomCapacity,roomFeatures,events,unavaliableTimes,roomPicture
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

//Calculate unavaliable times (used by room function)

//