import eventroutes from "./events.js";
import roomroutes from "./rooms.js";
import userroutes from "./users.js";
export const constructorMethod = (app) => {
    app.use('/events',eventroutes);
    app.use('/rooms',roomroutes);
    app.use('/users',userroutes);
    app.use("*",(req,res) => {
        let data = {};
        if(req.session.user){
            data.username = req.session.user.username;
            data.isLoggedIn = true;
            data.notifications = req.session.user.notifications;
        }
        res.render("home",);
    });
};

export default constructorMethod;