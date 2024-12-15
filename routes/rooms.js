import {Router} from 'express';
import * as helpers from '../helpers.js';
import { createRoom, getRoomByID, removeRoom } from '../data/rooms.js';
const router = Router();

router.route('/').post(async (req, res) => {
    let roomData = req.body;
    if (!roomData || Object.keys(roomData).length === 0) {
      return res
        .status(400)
        .json({error: 'There are no fields in the request body'});
    }
    try {
      await helpers.checkCreateRoom(roomData.roomID,roomData.building,roomData.roomNumber,roomData.roomCapacity,roomData.roomFeatures,roomData.unavailableTimesList,roomData.roomPicture) // I need dray
      unavailableTimes = calculateUnavailableTimes(unavailableTimesList)
    } catch (e) {
      return res.status(400).json({error: e});
    }
    try {
        const newRoom = await createRoom(roomData.building,
            roomData.roomNumber,
            roomData.roomCapacity,
            roomData.roomFeatures,
            roomData.events,
            roomData.unavailableTimes,
            roomData.roomPicture);
        return res.json(newRoom);
      } catch (e) {
        console.log(e);
        return res.sendStatus(500);
      }
});

router.route('/:id').get(async (req, res) => {
    try {
        helpers.checkString(req.params.id, "ID");
        helpers.checkIsValidID(req.params.id, "ID");
    } catch (e) {
        return res.status(400).json({error: e});
    }
    try {
        const user = await getRoomByID(req.params.id);
        return res.json(user);
    } catch (e) {
        return res.status(404).json(e);
    }
});

router.route('/:id').delete(async (req, res) => {
    try {
        helpers.checkString(req.params.id, "ID");
        helpers.checkIsValidID(req.params.id, "ID");
    } catch (e) {
        return res.status(400).json({error: e});
    }
    try {
        await removeRoom(req.params.id);
        return res.json({deleted: true,_id: req.params.id});
    } catch (e) {
        return res.status(404).json(e);
    }
});

router.route('/:id/times').get(async (req, res) => {
  try {
      helpers.checkString(req.params.id, "ID");
      helpers.checkIsValidID(req.params.id, "ID");
  } catch (e) {
      return res.status(400).json({error: e});
  }
  try {
      const room = await getRoomByID(req.params.id);
      return room.unavailableTimes;
  } catch (e) {
      return res.status(404).json(e);
  }
});

router.route('/:id').put(async (req, res) => {
    let roomData = req.body;
    if (!roomData || Object.keys(roomData).length === 0) {
      return res
        .status(400)
        .json({error: 'There are no fields in the request body'});
    }
    try {
      await helpers.checkCreateUser() //i need dray
    } catch (e) {
      return res.status(400).json({error: e});
    }
    try {
        const newUser = await updateUser(
            roomData.roomID,
            roomData.building,
            roomData.roomNumber,
            roomData.roomCapacity,
            roomData.roomFeatures,
            roomData.events,
            roomData.unavailableTimes,
            roomData.roomPicture
        );
        return res.json(newUser);
      } catch (e) {
        console.log(e);
        return res.sendStatus(500);
      }
});

export default router;
