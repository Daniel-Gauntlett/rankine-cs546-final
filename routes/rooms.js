import {Router} from 'express';
import * as helpers from '../helpers.js';
import { createRoom, getAllRooms, getRoomByID, removeRoom } from '../data/rooms.js';
import * as events from '../data/events.js';
const router = Router();
import xss from 'xss';

router.route('/').get(async (req, res) => {
  try {
      let roomList = await getAllRooms();
      let eventList = await events.getAllEvents();
      for(let room of roomList)
      {
        let events = [];
        for(let event of eventList)
        {
          if(room._id === event.roomID && !event.isPrivate) events.push(event.name + ": " + event.description);
        }
        room.events = events;
        let isAdmin = false;
        if(req.session.user.permissions >= 1) isAdmin = true;
        room.isAdmin = isAdmin;
      }
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
      return res.status(400).json({error: "root create room error"});
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

router.route('/roomCreate').get(async (req, res) => {
  res.render('roomCreate')
}).post(async (req, res) => {
  Object.keys(req.body).forEach((c) => req.body[c] = xss(req.body[c]));
  let unavailableTimesList = [[req.body.startDate, req.body.endDate, req.body.isRecurring, req.body.endRecurring]]
    try {
      helpers.checkCreateRoom(req.body.building, req.body.roomNumber, parseInt(req.body.roomCapacity), req.body.roomFeatures.split(',').map(item => item.trim()), unavailableTimesList, "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png");
    } catch (e) {
      console.log("room check error")
      console.log(e);
      return res.status(400).render('roomCreate',{error: "room check error"});
    }
    try {
      createRoom(req.body.building, req.body.roomNumber, parseInt(req.body.roomCapacity), req.body.roomFeatures.split(',').map(item => item.trim()), unavailableTimesList, "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png");
      res.redirect("/");
    } catch (e) {
      console.log(e);
      res.status(400).render('roomCreate',{error: "room create error"});
    }
})

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
        return res.render('roommanage',room);
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
    await helpers.checkCreateRoom(roomData.building,
      roomData.roomNumber,
      roomData.roomCapacity,
      roomData.roomFeatures,
      roomData.unavailableTimes,
      roomData.roomPicture)
  } catch (e) {
    return res.status(400).json({error: e});
  }
  try {
      const newUser = await updateRoom(
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
