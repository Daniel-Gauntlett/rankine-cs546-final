import express from 'express';
import session from 'express-session';
import exphbs from 'express-handlebars';
const app = express();
import configRoutes from './routes/index.js';
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(
     session({
     name: "AuthenticationState",
     secret: "some secret string!",
     resave: false,
     saveUninitialized: false
     })
     );
const staticDir = express.static('public');
app.use('/public', staticDir);
app.use('/', (req, res, next) => {
    if(req.session.user)
    {
         if(req.session.user.role==="user") console.log(`[${new Date().toUTCString()}]: ${req.method} ${req.originalUrl} (Authenticated Administrator User)`);
         else console.log(`[${new Date().toUTCString()}]: ${req.method} ${req.originalUrl} (Authenticated User)`);
    }
    else console.log(`[${new Date().toUTCString()}]: ${req.method} ${req.originalUrl} (Non-Authenticated)`);
    next();
});
app.get('/events/', (req, res, next) => {
  if(!req.session.user) res.redirect("/users/user/signinuser");
  else next();
});
app.get('rooms/', (req, res, next) => {
  if(!req.session.user) res.redirect("/users/user/signinuser");
  else next();
});
app.get('/users', (req, res, next) => {
  if(req.originalUrl === "/users" || req.originalUrl === "/users/" && !req.session.user) res.redirect('/users/signinuser');
  else if(req.originalUrl === "/users" || req.originalUrl === "/users/" && req.session.user.permissions !== 2) res.status(403).render('./error', {Title: "Error", error: "Don't have permission to view the page"});
  else next();
});
app.get('/users/signinuser', (req,res,next) => {
  if(req.session.user) res.redirect(`/`);
  else next();
});
app.get('/users/signoutuser', (req, res, next) => {
  if(!req.session.user) res.redirect("/users/signinuser");
  else next();
});
app.get('/users/user/:id', (req, res, next) => {
  if(!req.session.user) res.redirect("/users/signinuser");
  else if(req.session.user.username !== req.params.id && req.session.user.permissions !== 2) res.status(403).render('./error', {Title: "Error", error: "Don't have permission to view the page"});
  else next();
}) 
configRoutes(app);
app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});
