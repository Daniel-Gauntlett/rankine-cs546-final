import {Router} from 'express';
import * as helpers from '../helpers.js';
import { createRoom, getAllRooms, getRoomByID, removeRoom } from '../data/rooms.js';
const router = Router();
import xss from 'xss';

router.route('/').get(async (req, res) => {
  try {
      const roomList = await getAllRooms();
      return res.render('./roomlist', {title: "Room List", rooms: roomList})
    } catch (e) {
      return res.status(500).send(e);
    }
})
.post(async (req, res) => {
    Object.keys(req.body).forEach((c) => req.body[c] = xss(req.body[c]));
    let roomData = req.body;
    if (!roomData || Object.keys(roomData).length === 0) {
      return res
        .status(400)
        .json({error: 'There are no fields in the request body'});
    }
    try {
      await helpers.checkCreateRoom(roomData.roomID,roomData.building,roomData.roomNumber,roomData.roomCapacity,roomData.roomFeatures,roomData.unavailableTimesList,roomData.roomPicture)
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
        req.params.id = xss(req.params.id);
        helpers.checkString(req.params.id, "ID");
        helpers.checkIsValidID(req.params.id, "ID");
    } catch (e) {
        return res.status(400).json({error: e});
    }
    try {
        const room = await getRoomByID(req.params.id);
        return res.render('roommmanage',room);
    } catch (e) {
        return res.status(404).json(e);
    }
}).delete(async (req, res) => {
    try {
        req.params.id = xss(req.params.id);
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
}).put(async (req, res) => {
  Object.keys(req.body).forEach((c) => req.body[c] = xss(req.body[c]));
  let roomData = req.body;
  if (!roomData || Object.keys(roomData).length === 0) {
    return res
      .status(400)
      .json({error: 'There are no fields in the request body'});
  }
  try {
    await helpers.checkCreateRoom() //i need dray
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
