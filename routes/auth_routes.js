//import express, express router as shown in lecture code
import {Router} from 'express';
import { signInUser, signUpUser } from '../data/users.js';
import * as helpers from '../helpers.js';
const router = Router();

router
  .route('/signup')
  .get(async (req, res) => {
    res.render('signupuser');
  })
  .post(async (req, res) => {
    try {
      helpers.checkSignUpUser(req.body.firstName, req.body.lastName, req.body.username, req.body.userPassword, req.body.confirmPassword)
    } catch (e) {
      //res.status(400).render('signupuser', {error: e});
      console.log(e);
      return res.status(400).render('signupuser',{error: e})
    }
    let output;
    try {
      output = await signUpUser(req.body.firstName, req.body.lastName, req.body.username, req.body.userPassword, req.body.confirmPassword);
    } catch (e) {
      res.status(400).render('signupuser', {error: e});
      return;
    }
    
    if(!(await output).registrationCompleted){
      return res.status(500).render('signupuser',{error: "Internal Server Error"});
      //return res.status(500).json({error: "Internal Server Error"})
    } else {
      res.redirect('/login');
    }
  });

router
  .route('/')
  .get(async (req, res) => {
    res.render('signinuser',{});
  })
  .post(async (req, res) => {
    try {
      helpers.checkSignInUser(req.body.username, req.body.password);
    } catch (e) {
      console.log(e);
      return res.status(400).render('signinuser',{error: "Incorrect username or password"});
    }
    try {
      req.session.user = await signInUser(req.body.username, req.body.password);
      res.redirect("/");
    } catch (e) {
      console.log(e);
      res.status(400).render('signinuser',{error: "Incorrect username or password"});
    }
  });


router.route('/signout').get(async (req, res) => {
  req.session.destroy();
  res.render('login',{});
});
export default router;
