import {dbConnection, closeConnection} from '../config/mongoConnection.js';
import * as events from '../data/events.js';

const db = await dbConnection();
await db.dropDatabase();

let event1 = null;
try
{
    event1 = await events.createEvent("General GBM", "Our general GBM, where we discuss a variety a topics each week!",
        new Date("September 10, 2024 20:00:00 EST").toJSON(), new Date("September 10, 2024 21:00:00 EST").toJSON(), true,
        new Date("December 05, 2024 21:00:00 EST").toJSON(), false, "6744b2de7d63b9e12950d9d3", 1,
        "6744b30707e6c26e2ef42c9a", [], ["6744b325694adc1370a267e0"], "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyOBFRML09gNsjdrpsbp0TxbSaQ95AOy-fIw&s"
    );
    console.log(event1);
}
catch(e)
{
    console.error(e);
}

await closeConnection();