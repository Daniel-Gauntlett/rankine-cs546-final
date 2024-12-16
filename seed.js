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
let event5 = null;
let event6 = null;
let event7 = null;
let event8 = null;
let event9 = null;
let event10 = null;
let user1 = null;
let user2 = null;
let user3 = null;
let user4 = null;
let user5 = null;
let room1 = null;
let room2 = null;
let room3 = null;
let room4 = null;
let room5 = null;
let room6 = null;
let room7 = null;
let room8 = null;
let room9 = null;
let room10 = null;
try{
    user1 = await users.createUser("pbodinizzo", "Learner#1", "Paul", "Bodinizzo", 0, false, [], []);
    console.dir({user1}, {depth: null});
    user2 = await users.createUser("dgauntlett", "Principal#1", "Daniel", "Gauntlett", 2, false, [], []);
    console.dir({user2}, {depth: null});
    user3 = await users.createUser("faziz", "Teacher#1", "Faiyaz", "Aziz", 1, false, [], []);
    console.dir({user3}, {depth: null});
    user4 = await users.createUser("dbarrand", "Learner#2", "Drayton", "Barrand", 0, true, [user3._id], ["Pending"]);
    console.dir({user4}, {depth: null});
    user5 = await users.createUser("jbrown", "Teacher#2", "Jeremy", "Brown", 1, false, [], [`Please look over this request made by ${user4.firstName}`]);
}catch(e)
{
    console.error(e);
}
try
{
    
    event1 = await events.createEvent("General GBM", "Our general GBM, where we discuss a variety a topics each week!",
        new Date("September 10, 2024 20:00:00 EST").toJSON(), new Date("September 10, 2024 21:00:00 EST").toJSON(), true,
        new Date("December 05, 2024 21:00:00 EST").toJSON(), false, "6744b2de7d63b9e12950d9d3", 1,
        "6744b30707e6c26e2ef42c9a", [], ["6744b325694adc1370a267e0"], "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyOBFRML09gNsjdrpsbp0TxbSaQ95AOy-fIw&s"
    );
    console.log(event1);
    event2 = await events.createEvent("Party For PHI", "Join the Party at our Frat House! Free Food Provided",
        new Date("November 10, 2024 20:00:00 EST").toJSON(), new Date("November 10, 2024 21:00:00 EST").toJSON(), false,
        null, true, "6744b2de7d63b9e12950d9d3", 2,
        "6744b30707e6c26e2ef42c9a", [], ["6744b325694adc1370a267e0"], "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyOBFRML09gNsjdrpsbp0TxbSaQ95AOy-fIw&s"
    );
    console.log(event2);
    event3 = await events.createEvent("Boba And Paint!", "Come relax and paint while sipping on boba provided by Kung Fu Tea", 
        new Date("September 10, 2024 20:00:00 EST").toJSON(), new Date("September 10, 2024 21:00:00 EST").toJSON());
    console.log(event3);
    console.log(await events.getAllEvents());
}
catch(e)
{
    console.error(e);
}

await closeConnection();