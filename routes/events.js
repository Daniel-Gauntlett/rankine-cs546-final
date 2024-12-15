import {Router} from 'express';
import { createEvent, getAllEvents, getEventByID, removeEvent, updateEvent } from '../data/events.js';
import * as helpers from '../helpers.js';
const router = Router();

router.route('/').get(async (req, res) => {
  try {
    const eventslist = await getAllEvents();
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
        eventData.status,
        eventData.organizerID,
        eventData.rsvpList,
        eventData.attendeesList,
        eventData.picture)
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
            eventData.status,
            eventData.organizerID,
            eventData.rsvpList,
            eventData.attendeesList,
            eventData.picture
        );
        return res.json(newEvent);
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
      await helpers.checkPatchUser(req.params.id, (await getUserById(req.params.id)), req.body)
    } catch (e) {
      return res.status(400).json({error: e});
    }
    try {
        const patchedEvent = await patchUser(
            req.params.id, req.body
        );
        return res.json(patchedEvent);
      } catch (e) {
        console.log(e);
        return res.sendStatus(500);
      }
});

export default router;
