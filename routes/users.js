import {Router} from 'express';
import * as helpers from '../helpers.js';
import { createUser, getUserById, updateUser, removeUser, updateNotifications, patchUser } from '../data/users.js';
const router = Router();

router.route('/').post(async (req, res) => {
    let userData = req.body;
    if (!userData || Object.keys(userData).length === 0) {
      return res
        .status(400)
        .json({error: 'There are no fields in the request body'});
    }
    try {
      await helpers.checkCreateUser(
        userData.userID,
        userData.username,
        userData.userPassword,
        userData.firstName,
        userData.lastName,
        userData.permissions,
        userData.beingGranted,
        userData.usersApproving,
        userData.notifications)
    } catch (e) {
      return res.status(400).json({error: e});
    }
    try {
        const newUser = await createUser(
            userData.userID,
            userData.username,
            userData.userPassword,
            userData.firstName,
            userData.lastName,
            userData.permissions,
            userData.beingGranted,
            userData.usersApproving,
            userData.notifications
        );
        return res.json(newUser);
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
        const user = await getUserById(req.params.id);
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
        await removeUser(req.params.id);
        return res.json({deleted: true,_id: req.params.id});
    } catch (e) {
        return res.status(404).json(e);
    }
});

router.route('/:id').put(async (req, res) => {
    let userData = req.body;
    if (!userData || Object.keys(userData).length === 0) {
      return res
        .status(400)
        .json({error: 'There are no fields in the request body'});
    }
    try {
      await helpers.checkCreateUser(eventData.name,
        userData.userID,
        userData.username,
        userData.userPassword,
        userData.firstName,
        userData.lastName,
        userData.permissions,
        userData.beingGranted,
        userData.usersApproving,
        userData.notifications)
    } catch (e) {
      return res.status(400).json({error: e});
    }
    try {
        const newUser = await updateUser(
            userData.userID,
            userData.username,
            userData.userPassword,
            userData.firstName,
            userData.lastName,
            userData.permissions,
            userData.beingGranted,
            userData.usersApproving,
            userData.notifications
        );
        return res.json(newUser);
      } catch (e) {
        console.log(e);
        return res.sendStatus(500);
      }
});

router.route('/:id').patch(async (req, res) => {
    let userData = req.body;
    if (!userData || Object.keys(userData).length === 0) {
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
        const patchedUser = await patchUser(
            req.params.id, req.body
        );
        return res.json(patchedUser);
      } catch (e) {
        console.log(e);
        return res.sendStatus(500);
      }
});

router.route('/notification/:id').post(async (req, res) => {
    let newNotif = req.body.notiftext;
    try {
        helpers.checkString(req.params.id, "ID");
        helpers.checkIsValidID(req.params.id, "ID");
        helpers.checkString(newNotif, "Notification")
    } catch (e) {
        return res.status(400).json({error: e});
    }
    try {
        const newuser = await updateNotifications(req.params.id, newNotif); //UPDATE ONCE PAUL FINISHES
        return res.json(newuser);
    } catch (e) {
        return res.status(404).json(e);
    }
});

export default router;
