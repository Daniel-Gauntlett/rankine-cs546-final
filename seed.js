import {dbConnection, closeConnection} from './config/mongoConnection.js';
import * as events from './data/events.js';
import * as users from './data/users.js';
import * as rooms from './data/rooms.js';
const db = await dbConnection();
await db.dropDatabase();

let event1 = null;
let event2 = null;
let event3 = null;
let event4 = null;
let user1 = null;
let user2 = null;
let user3 = null;
let user4 = null;
let user5 = null;
let room1 = null;
let room2 = null;
let room3 = null;
let room4 = null;
try{
    user1 = await users.createUser("pbodinizzo", "Learner#1", "Paul    ", "Bodinizzo", 0, false, [], []);
    console.dir(user1, {depth: null});
    user2 = await users.createUser("dgauntlett", "Principal#1", "Daniel", "Gauntlett", 2, false, [], []);
    console.dir(user2, {depth: null});
    user3 = await users.createUser("faziz", "Teacher#1", "Faiyaz", "Aziz", 1, false, [], []);
    console.dir(user3, {depth: null});
    user4 = await users.createUser("dbarrand", "Learner#2", "Drayton", "Barrand", 0, true, [user3._id], ["Pending"]);
    console.dir(user4, {depth: null});
    user5 = await users.createUser("jbrown", "Teacher#2", "Jeremy", "Brown", 1, false, [], [`Please look over this request made by ${user4.firstName}`]);
}catch(e)
{
    console.error(e);
}
try{
    room1 = await rooms.createRoom("Gateway South", "221", "10", ["whiteboard"], 
        [[new Date("September 10, 2024 23:00:00 EST"), new Date("September 11, 2024 6:00:00 EST"), true, new Date("December 05, 2024 21:00:00 EST")]],
        "https://images.ctfassets.net/mviowpldu823/fd78c734b7cc1047b71dc18fcca5870c/d4fd90b6688bc528dbe64c7d73eb6179/Sam_20Kim_20-_20Lecture_20Hall_2011.JPG");
    console.dir(room1, {depth: null});
    room2 = await rooms.createRoom("Babbio", "122", "70", ["Projectors", "Desk Chargers"], 
        [[new Date("September 10, 2024 23:00:00 EST"), new Date("September 11, 2024 6:00:00 EST"), false]], 
        "https://env-team.com/wp-content/uploads/2018/05/wide2-415x237.jpg");
    console.dir(room2, {depth: null});
    room3 = await rooms.createRoom("Howe", "402", "120", ["Projector", "Presenter Desk"],
        [[new Date("September 10, 2024 23:00:00 EST"), new Date("September 11, 2024 6:00:00 EST"), true, new Date("December 05, 2024 21:00:00 EST")], [new Date("September 11, 2024 12:00:00 EST"), new Date("September 11, 2024 13:30:00 EST"), true, new Date("December 05, 2024 21:00:00 EST")]], 
        "https://pbs.twimg.com/media/CR3QkF-W0AEByyX?format=jpg&name=4096x4096");
    console.dir(room3, {depth: null});
    room4 = await rooms.createRoom("Kidde", "360", "50", ["Multiple Screens", "Projectors"], 
        [], "https://freight.cargo.site/t/original/i/00f5be24e00f8444f50b7ec9faf3a0b02becf1e6665b0f0756440ec699f1ba71/Stevens-Tech._Auditorium_03.jpg");
    console.dir(room4, {depth:null});
}catch(e)
{
    console.error(e);
}
try
{
    
    event1 = await events.createEvent("General GBM", "Our general GBM, where we discuss a variety a topics each week!",
        new Date("September 10, 2024 20:00:00 EST").toJSON(), new Date("September 10, 2024 21:00:00 EST").toJSON(), true,
        new Date("December 05, 2024 21:00:00 EST").toJSON(), false, room1._id, 1, user1._id, 
        [user5._id], [], "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyOBFRML09gNsjdrpsbp0TxbSaQ95AOy-fIw&s");
    console.dir(event1, {depth:null});
    event2 = await events.createEvent("Party For PHI", "Join the Party at our Frat House! Free Food Provided",
        new Date("November 10, 2024 20:00:00 EST").toJSON(), new Date("November 10, 2024 21:00:00 EST").toJSON(), false,
        null, true, room3._id, 2,
        user4._id, [], [user3._id, user1._id, user2._id], "https://thefrugalchicken.com/wp-content/uploads/2023/04/Ducklings-min.jpg");
    console.dir(event2, {depth:null});
    event3 = await events.createEvent("Boba And Paint!", "Come relax and paint while sipping on boba provided by Kung Fu Tea", 
        new Date("September 10, 2024 20:00:00 EST").toJSON(), new Date("September 10, 2024 21:00:00 EST").toJSON(), false, null,
        false, room4._id, 0, user5._id, [], [], "https://media.self.com/photos/6352ffbeef9375c6ec59085b/3:2/w_3999,h_2666,c_limit/mean-geese.png");
    console.dir(event3, {depth:null});
    event4 = await events.createEvent("C2GS Meeting", "Lets meet up and play tons of games :)", 
        new Date("September 10, 2024 20:00:00 EST").toJSON(), new Date("September 10, 2024 21:00:00 EST").toJSON(), true, new Date("October 16, 2024 23:00:00 EST").toJSON(), true
        , room4._id, 0, user2._id, [user1._id, user3._id], [user4._id, user5._id], "https://static.wixstatic.com/media/ec3251_3c062e1115dd4084b24503682ec4ec73~mv2.jpg/v1/fill/w_480,h_480,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/ec3251_3c062e1115dd4084b24503682ec4ec73~mv2.jpg");
    console.log(await events.getAllEvents());
}
catch(e)
{
    console.error(e);
}

await closeConnection();