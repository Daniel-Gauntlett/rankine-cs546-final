import {Router} from 'express';
import * as helpers from '../helpers.js';
import { createUser, getUserById, updateUser, removeUser, updateNotifications, patchUser, getAllUsers, signInUser, signUpUser } from '../data/users.js';
const router = Router();

router.route('/').get(async (req, res) => {
  try {
    const userlist = await getAllUsers();
    return res.render('./userlist', {title: "User List", users: userlist})
  } catch (e) {
    return res.status(500).send(e);
  }
}).post(async (req, res) => {
    let userData = req.body;
    if (!userData || Object.keys(userData).length === 0) {
      return res
        .status(400)
        .json({error: 'There are no fields in the request body'});
    }
    try {
      await helpers.checkCreateUser(
        userData.username,
        userData.userPassword,
        userData.firstName,
        userData.lastName,
        0,
        false,
        [],
        [])
    } catch (e) {
      return res.status(400).json({error: e});
    }
    try {
        const newUser = await createUser(
            userData.username,
            userData.userPassword,
            userData.firstName,
            userData.lastName,
            0,
            false,
            [],
            []
        );
        return res.json(newUser);
      } catch (e) {
        console.log(e);
        return res.sendStatus(500);
      }
});

router
  .route('/signinuser')
  .get(async (req, res) => {
    res.render('login',{});
  })
  .post(async (req, res) => {
    try {
      helpers.checkSignInUser(req.body.username, req.body.password);
    } catch (e) {
      console.log(e);
      return res.status(400).render('login',{error: "Incorrect username or password"});
    }
    try {
      req.session.user = await signInUser(req.body.username, req.body.password);
      res.redirect("/");
    } catch (e) {
      console.log(e);
      res.status(400).render('login',{error: "Incorrect username or password"});
    }
  });

  router
  .route('/signupuser')
  .get(async (req, res) => {
    res.render('signupuser',{});
  })
  .post(async (req, res) => {
    if(req.body.password != req.body.confirmPassword){
      return res.status(400).render('signupuser',{error: "Passwords must match"});
    }
    try {
      helpers.checkSignUpUser(req.body.username, req.body.userPassword, req.body.firstName, req.body.lastName);
    } catch (e) {
      console.log(e);
      return res.status(400).render('signupuser',{error: e});
    }
    try {
      req.session.user = await signUpUser(req.body.username, req.body.userPassword, req.body.firstName, req.body.lastName);
      res.redirect("/");
    } catch (e) {
      console.log(e);
      res.status(400).render('signupuser',{error: e});
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
        const newuser = await updateNotifications(req.params.id, newNotif);
        return res.json(newuser);
    } catch (e) {
        return res.status(404).json(e);
    }
});


router.route('/signoutuser').get(async (req, res) => {
  req.session.destroy();
  res.redirect('/signinuser');
});

router.route('/user/:id').get(async (req, res) => {
    try {
        helpers.checkString(req.params.id, "ID");
        helpers.checkIsValidID(req.params.id, "ID");
    } catch (e) {
        return res.status(400).json({error: e});
    }
    try {
        const user = await getUserById(req.params.id);
        return res.render('usermanage',user);
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
        await removeUser(req.params.id);
        return res.json({deleted: true,_id: req.params.id});
    } catch (e) {
        return res.status(404).json(e);
    }
}).put(async (req, res) => {
    let userData = req.body;
    if (!userData || Object.keys(userData).length === 0) {
      return res
        .status(400)
        .json({error: 'There are no fields in the request body'});
    }
    try {
      await helpers.checkCreateUser(eventData.name,
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
}).patch(async (req, res) => {
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

export default router;
