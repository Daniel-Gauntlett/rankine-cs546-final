import {Router} from 'express';
import { createEvent, getAllEvents, getEventByID, patchEvent, removeEvent, updateEvent } from '../data/events.js';
import * as helpers from '../helpers.js';
import * as rooms from '../data/rooms.js';
import xss from 'xss';
const router = Router();

router.route('/').get(async (req, res) => {
  try {
    const eventslist = await getAllEvents();
    for(let x = 0; x < eventslist.length; x++){
      eventslist[x].canSee = !(eventslist[x].isPrivate) || eventslist[x].organizerID == req.session.user.username || req.session.user.permissions > 0;
    }
    let r = await rooms.getAllRooms();
    return res.render('./eventlist', {title: "Events List", events: eventslist, r:r})
  } catch (e) {
    return res.status(500).send(e);
  }
}).post(async (req, res) => {
    //https://stackoverflow.com/questions/66139376/how-to-apply-math-or-a-function-to-every-element-in-a-javascript-object
    Object.keys(req.body).forEach((c) => req.body[c] = xss(req.body[c]));
    let eventData = req.body;
    if (!eventData || Object.keys(eventData).length === 0) {
      return res
        .status(400)
        .json({error: 'There are no fields in the request body'});
    }
    try {
      if(eventData.recurUntil == "") eventData.recurUntil = null;
      if(!('isPrivate' in eventData)) eventData.isPrivate = false;
      if(!('isRecurring' in eventData)) eventData.isRecurring = false;
      await helpers.checkCreateEvent(eventData.name,
        eventData.description,
        eventData.startDate,
        eventData.endDate,
        eventData.isRecurring,
        eventData.recurUntil,
        eventData.isPrivate,
        eventData.roomID,
        1,
        req.session.user.username,
        [],
        [],
        eventData.pictureURL)
    } catch (e) {
      console.log(e);
      return res.status(400).json({error: e});
    }
    try {
        const newEvent = await createEvent(
          eventData.name,
          eventData.description,
          eventData.startDate,
          eventData.endDate,
          eventData.isRecurring,
          eventData.recurUntil,
          eventData.isPrivate,
          eventData.roomID,
          1,
          req.session.user.username,
          [],
          [],
          eventData.pictureURL
        );
        let events = await getAllEvents();
        return res.render('./eventlist', {events: events})
      } catch (e) {
        console.log(e);
        return res.status(500).json({error: e});
      }
});
router.route('/create/:roomid').get(async (req,res) => {
  res.render('eventcreate',{room: req.params.roomid});
}).post(async (req, res) =>{
    Object.keys(req.body).forEach((c) => req.body[c] = xss(req.body[c]));
    let eventData = req.body;
    if (!eventData || Object.keys(eventData).length === 0) {
      return res
        .status(400)
        .json({error: 'There are no fields in the request body'});
    }
    try {
      await helpers.checkCreateEvent(eventData.name,
        eventData.description,
        eventData.startDate,
        eventData.endDate,
        eventData.isRecurring,
        eventData.recurUntil,
        eventData.isPrivate,
        eventData.roomID,
        1,
        req.session.user.username,
        [],
        [],
        "")
    } catch (e) {
      console.log(e);
      return res.status(400).json({error: e});
    }
    try {
        const newEvent = await createEvent(
          eventData.name,
          eventData.description,
          eventData.startDate,
          eventData.endDate,
          eventData.isRecurring,
          eventData.recurUntil,
          eventData.isPrivate,
          eventData.roomID,
          1,
          req.user.username,
          [],
          [],
          ""
        );
        return res.redirect('/events/');
      } catch (e) {
        console.log(e);
        return res.status(500).json({error: e});
      }
})
router.route('/event/:id').get(async (req, res) => {
    try {
        req.params.id = xss(req.params.id);
        helpers.checkString(req.params.id, "ID");
        helpers.checkIsValidID(req.params.id, "ID");
    } catch (e) {
      console.log(e);
        return res.status(400).json({error: e});
    }
    try {
        let event = await getEventByID(req.params.id);
        event.canSee = !(event.isPrivate) || event.organizerID == req.session.user.username || req.session.user.permissions > 0;
        event.canApprove = req.session.user.permissions > 0 && event.status == 1;
        event.canEdit = event.organizerID == req.session.user.username;
        event.hasRSVPed = event.rsvpList.includes(req.session.user.username);
        event.canRSVP = event.status > 1;
        event.hasStarted = event.startDate < (new Date());
        if(event.status === 0) event.status = "Rejected";
        else if(event.status === 1) event.status = "Pending";
        else if (event.status ===2) event.status = "Approved";
        event.currentuser = req.session.user.username;
        return res.render('eventmanage',event);
    } catch (e) {
        return res.status(404).json(e);
    }
}).delete(async (req, res) => {
    try {
        req.params.id = xss(req.params.id);
        helpers.checkString(req.params.id, "ID");
        helpers.checkIsValidID(req.params.id, "ID");
      } catch (e) {
        console.log(e);
        return res.status(400).json({error: e});
      }
      const event = await getEventByID(req.params.id);
      if(event.organizerID != req.session.user.username && req.session.user.permissions === 0) {
        return res.status(403).json({error: "Unauthorized deletion"})
      }
      try {
        await removeEvent(req.params.id);
      return res.json({deleted: true,_id: req.params.id});
    } catch (e) {
        return res.status(404).json(e);
    }
}).put(async (req, res) => {
    Object.keys(req.body).forEach((c) => req.body[c] = xss(req.body[c]));
    let eventData = req.body;
    if (!eventData || Object.keys(eventData).length === 0) {
      return res
        .status(400)
        .json({error: 'There are no fields in the request body'});
    }
    try {
      req.params.id = xss(req.params.id);
      await helpers.checkUpdateEvent(req.params.id, 
        eventData.name,
        eventData.description,
        eventData.startDate,
        eventData.endDate,
        eventData.isRecurring,
        eventData.recurUntil,
        eventData.isPrivate,
        eventData.roomID,
        eventData.status,
        eventData.organizerID,
        eventData.rsvpList,
        eventData.attendeesList,
        eventData.picture)
    } catch (e) {
      console.log(e);
      return res.status(400).json({error: e});
    }
    try {
        const event = await getEventByID(req.params.id);
        if(event.organizerID != req.session.user.username && req.session.user.permissions === 0) {
          return res.status(403).json({error: "Unauthorized edit"})
        }
        const updatedEvent = await updateEvent(
            req.params.id,
            eventData.name,
            eventData.description,
            eventData.startDate,
            eventData.endDate,
            eventData.isRecurring,
            eventData.recurUntil,
            eventData.isPrivate,
            eventData.roomID,
            eventData.status,
            eventData.organizerID,
            eventData.rsvpList,
            eventData.attendeesList,
            eventData.picture
        );
        return res.json(updatedEvent);
      } catch (e) {
        console.log(e);
        return res.status(500).json({error: e});
      }
}).patch(async (req, res) => {
    Object.keys(req.body).forEach((c) => req.body[c] = xss(req.body[c]));
    let eventData = req.body;
    if (!eventData || Object.keys(eventData).length === 0) {
      return res
        .status(400)
        .json({error: 'There are no fields in the request body'});
    }
    try {
      req.params.id = xss(req.params.id);
      helpers.checkPatchEvent(req.params.id, (await getEventByID(req.params.id)), req.body)
    } catch (e) {
      console.log(e);
      return res.status(400).json({error: e});
    }
    try {
        const event = await getEventByID(req.params.id);
        if(event.organizerID != req.session.user.username && req.session.user.permissions === 0) {
          return res.status(403).json({error: "Unauthorized edit"})
        }
        const patchedEvent = await patchEvent(
            req.params.id, req.body
        );
        return res.json({redirect: "/events/event/" + req.params.id});
      } catch (e) {
        console.log(e);
        return res.sendStatus(500);
      }
});

router.route('/event/:id/rsvp').patch(async (req, res) => {
  Object.keys(req.body).forEach((c) => req.body[c] = xss(req.body[c]));
  req.params.id = xss(req.params.id);
  const event = await getEventByID(req.params.id)
  if (!event.rsvpList.includes(req.session.user.username)){
    req.body.rsvpList = event.rsvpList.push(req.session.user.username);
  } else {
    req.body.rsvpList = event.rsvpList;
  }
  return res.json({redirect: `/events/event/${req.params.id}`});

})

router.route('/event/:id/unrsvp').patch(async (req, res) => {
  Object.keys(req.body).forEach((c) => req.body[c] = xss(req.body[c]));
  req.params.id = xss(req.params.id);
  const event = await getEventByID(req.params.id)
  if (!event.rsvpList.includes(req.session.user.username)){
    req.body.rsvpList = event.rsvpList;
  } else {
    req.body.rsvpList = event.rsvpList.filter(function(name) {
      name !== req.session.user.username
    });
  }
  return res.json({redirect: `/events/event/${req.params.id}`});

})

export default router;
