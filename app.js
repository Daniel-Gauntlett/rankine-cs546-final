import express from 'express';
import session from 'express-session';
import exphbs from 'express-handlebars';
const app = express();
import configRoutes from './routes/index.js';

import * as middlewares from './middlewares.js'
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

app.use('/favicon.ico', express.static('public/favicon.ico'));
app.use(middlewares.GlobalMiddleware);
configRoutes(app);
app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});
