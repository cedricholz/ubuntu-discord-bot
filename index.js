"use strict";

const Discord = require('discord.js');
const client = new Discord.Client();
let sheets = require("./sheets");

const timeWaiter = (sheet, index1, index2, nextDate, timeToWait) => {


    let millisecondsUntilNextDate = nextDate - new Date();

    setTimeout(function () {
        setInterval(function () {
            try {
                if (index2) {
                    sheet.getKickchenCleaners(client, index1, index2);
                } else {
                    sheet.getCooks(client, index1)
                }

            } catch (e) {
                console.log("ERROR:", e)
            }
        }, timeToWait);
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
    // sheet.getKickchenCleaners(client, 1, 3);
    // sheet.getCooks(client, 1)

    // Cleaners
    let nextMondayAT9 = getDayOfWeek(1);
    let nextTuesdayAT9 = getDayOfWeek(2);
    let nextWednesdayAT9 = getDayOfWeek(3);
    let nextThursdayAT9 = getDayOfWeek(4);
    let nextFridayAT9 = getDayOfWeek(5);
    const oneWeekInMilliseconds = 604800000;


    timeWaiter(sheet, 1, 3, nextMondayAT9, oneWeekInMilliseconds);
    timeWaiter(sheet, 5, 7, nextTuesdayAT9, oneWeekInMilliseconds);
    timeWaiter(sheet, 9, 11, nextWednesdayAT9, oneWeekInMilliseconds);
    timeWaiter(sheet, 13, 15, nextThursdayAT9, oneWeekInMilliseconds);
    timeWaiter(sheet, 17, 19, nextFridayAT9, oneWeekInMilliseconds);

    // Family Dinner
    const twoWeeksInMilliseconds = 1209600000;
    timeWaiter(sheet, 1, null, nextTuesdayAT9, twoWeeksInMilliseconds);
    timeWaiter(sheet, 3, null, nextThursdayAT9, twoWeeksInMilliseconds);


    let nextSundayAT9 = getDayOfWeek(7);
    let nextNextTuesdayAT9 = getDayOfWeek(9);
    let nextNextThursdayAT9 = getDayOfWeek(11);
    let nextNextSundayAT9 = getDayOfWeek(14);
    timeWaiter(sheet, 5, null, nextSundayAT9, twoWeeksInMilliseconds);
    timeWaiter(sheet, 7, null, nextNextTuesdayAT9, twoWeeksInMilliseconds);
    timeWaiter(sheet, 9, null, nextNextThursdayAT9, twoWeeksInMilliseconds);
    timeWaiter(sheet, 11, null, nextNextSundayAT9, twoWeeksInMilliseconds);


});

// client.on('message', msg => {
//     if (msg.content === 'ping') {
//         msg.reply('Pong!')
//     }
// });


const discord_creds = require('./discord_creds.json');
client.login(discord_creds['key']);


