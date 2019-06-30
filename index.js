"use strict";

const Discord = require('discord.js');
const client = new Discord.Client();
let sheets = require("./sheets");

const timeWaiter = (sheet, morningIndex, dinnerIndex, nextDate) => {

    const oneWeekInMilliseconds = 604800000;

    let millisecondsUntilNextDate = nextDate - new Date();

    setTimeout(function () {
        setInterval(function () {
            try {
                sheet.getKickchenCleaners(client, morningIndex, dinnerIndex);
            } catch (e) {
                console.log("ERROR:", e)
            }
        }, oneWeekInMilliseconds);
    }, millisecondsUntilNextDate);
};


const getDayOfWeek = (day) => {
    let nineHoursInMilliseconds = 32400000;
    let d = new Date();
    d.setDate(d.getDate() + (day + 7 - d.getDay()));
    d.setHours(0, 0, 0, 0);
    return new Date(d.getTime() + nineHoursInMilliseconds)
};

client.on('ready', () => {

    const sheet = new sheets();

    console.log(`Logged in as ${client.user.tag}!`);
    sheet.getKickchenCleaners(client, 1, 3);

    // Monday
    // let nextMondayAT9 = getDayOfWeek(1);
    // timeWaiter(sheet, 1, 3, nextMondayAT9);
    // // Tuesday
    // let nextTuesdayAT9 = getDayOfWeek(2);
    // timeWaiter(sheet, 5, 7, nextTuesdayAT9);
    // // Wednesday
    // let nextWednesdayAT9 = getDayOfWeek(3);
    // timeWaiter(sheet, 9, 11, nextWednesdayAT9);
    // // Thursday
    // let nextThursdayAT9 = getDayOfWeek(4);
    // timeWaiter(sheet, 13, 15, nextThursdayAT9);
    // // Friday
    // let nextFridayAT9 = getDayOfWeek(5);
    // timeWaiter(sheet, 17, 19, nextFridayAT9);

});

// client.on('message', msg => {
//     if (msg.content === 'ping') {
//         msg.reply('Pong!')
//     }
// });


const discord_creds = require('./discord_creds.json');
client.login(discord_creds['key']);


