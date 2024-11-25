import {ObjectId} from 'mongodb';
export const checkString = (data, name) =>
{
    if(!data) throw  `${name} isn't a valid non-empty string`;
    if(typeof data !== "string" || (data = data.trim()).length === 0) throw  `${name} isn't a valid non-empty string`;
    return data.trim();
};
export const checkIsValidDate = (data, name) =>
{
    let date = checkString(data, name);
    //Source: https://www.freecodecamp.org/news/how-to-validate-a-date-in-javascript/
    if(isNaN(new Date(date))) throw `${name} isn't a valid non-empty date`;
    return date;
}
export const checkIsValidID = (data, name) =>
{
    let id = checkString(data, name);
    if(!ObjectId.isValid(id)) throw `invalid object ID for ${name}`;
    return id;
}
export const checkIsValidIDs = (data, name) =>
{
    for(let id of data)
    {
        id = checkIsValidID(id, name);
    }
    return data;
}