import eventroutes from "./events.js";
//import roomroutes from "./rooms.js";
import userroutes from "./users.js";
export const constructorMethod = (app) => {
    app.use('/events',eventroutes);
    app.use('/rooms',roomroutes);
    //app.use('/users',userroutes);
    app.use("*",(req,res) => {
        return res.status(404).json({error:'Not found'});
    });
};

export default constructorMethod;