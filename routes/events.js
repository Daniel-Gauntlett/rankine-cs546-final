import {Router} from 'express';
import { createEvent, getAllEvents, getEventByID, patchEvent, removeEvent, updateEvent } from '../data/events.js';
import * as helpers from '../helpers.js';
const router = Router();

router.route('/').get(async (req, res) => {
  try {
    const eventslist = await getAllEvents();
    for(let x = 0; x < eventslist.length; x++){
      eventslist[x].canSee = !(eventslist[x].isPrivate) || eventslist[x].organizerID == req.session.user.username || req.session.user.permissions > 0;
    }
    return res.render('./eventlist', {title: "Events List", events: eventslist})
  } catch (e) {
    return res.status(500).send(e);
  }
}).post(async (req, res) => {
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
        req.user.username,
        [],
        [],
        "")
    } catch (e) {
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
        res.redirect(`/events/${newEvent._id}`);
      } catch (e) {
        console.log(e);
        return res.status(500).json({error: e});
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
        const event = await getEventByID(req.params.id);
        event.canSee = !(event.isPrivate) || event.organizerID == req.session.user.username || req.session.user.permissions > 0;
        event.canApprove = req.session.user.permissions > 0 && event.status == 1;
        event.canEdit = event.organizerID == req.session.user.username;
        event.hasRSVPed = event.rsvpList.includes(req.session.user.username);
        event.canRSVP = event.status > 1;
        event.hasStarted = event.startDate < (new Date());
        return res.render('eventmanage',event);
    } catch (e) {
        return res.status(404).json(e);
    }
}).delete(async (req, res) => {
    try {
        helpers.checkString(req.params.id, "ID");
        helpers.checkIsValidID(req.params.id, "ID");
      } catch (e) {
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
    let eventData = req.body;
    if (!eventData || Object.keys(eventData).length === 0) {
      return res
        .status(400)
        .json({error: 'There are no fields in the request body'});
    }
    try {
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
    let eventData = req.body;
    if (!eventData || Object.keys(eventData).length === 0) {
      return res
        .status(400)
        .json({error: 'There are no fields in the request body'});
    }
    try {
      helpers.checkPatchEvent(req.params.id, (await getUserById(req.params.id)), req.body)
    } catch (e) {
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
        res.redirect("/events/" + req.params.id)
      } catch (e) {
        console.log(e);
        return res.sendStatus(500);
      }
});

router.route('/:id/rsvp').patch(async (req, res) => {
  const event = await getEventByID(req.params.id)
  if (!event.rsvpList.includes(req.session.user.username)){
    req.body.rsvpList = event.rsvpList.push(req.session.user.username);
  } else {
    req.body.rsvpList = event.rsvpList;
  }
  res.redirect(`/events/${newEvent._id}`)

})

router.route('/:id/unrsvp').patch(async (req, res) => {
  const event = await getEventByID(req.params.id)
  if (!event.rsvpList.includes(req.session.user.username)){
    req.body.rsvpList = event.rsvpList;
  } else {
    req.body.rsvpList = event.rsvpList.filter(function(name) {
      name !== req.session.user.username
    });
  }
  res.redirect(`/events/${newEvent._id}`)

})

export default router;
