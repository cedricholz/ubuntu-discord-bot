"use strict";

const Discord = require('discord.js');
const client = new Discord.Client();
let sheets = require("./sheets");
const nineHoursPlusTimeDifferenceOffsetInMilliseconds = 57600000;

// Bot Test
// const channelId = '592916978562236426';

// General
const channelId = '550082429004677129';

const timeWaiter = (sheet, index1, index2, nextDate, timeToWait) => {
    let millisecondsUntilNextDate = nextDate.getTime() - new Date().getTime();
    setTimeout(function () {
        const intervalFunc = () => {
            try {
                if (index2) {
                    sheet.getKickchenCleaners(client, index1, index2);
                } else {
                    sheet.getCooks(client, index1)
                }
            } catch (e) {
                console.log("ERROR:", e)
            }
        };
        setInterval(intervalFunc, timeToWait);
        intervalFunc()
    }, millisecondsUntilNextDate);
};


const getDayOfWeek = (day, nextWeek) => {
    // let nineHoursInMilliseconds = 32400000;

    let d = new Date();

    let timeThing = d.getDate() + (7 + day - d.getDay()) % 7;

    if (day - d.getDay() === 0) {
        timeThing += 7
    }

    if (nextWeek) {
        timeThing += 7
    }

    d.setDate(timeThing);
    d.setHours(0, 0, 0, 0);
    return new Date(d.getTime() + nineHoursPlusTimeDifferenceOffsetInMilliseconds)
};

function setTimeout_ (fn, delay) {
    var maxDelay = Math.pow(2,31)-1;

    if (delay > maxDelay) {
        var args = arguments;
        args[1] -= maxDelay;

        return setTimeout(function () {
            setTimeout_.apply(undefined, args);
        }, maxDelay);
    }

    return setTimeout.apply(undefined, arguments);
}

const lastDayOfMonthWaiter = (nextDate) => {
    let millisecondsUntilNextDate = nextDate.getTime() - new Date().getTime();
    setTimeout_(function () {
        client.channels.get(channelId).send("Hello, it's the last day of the month! Don't forget to pay your rent if you haven't done it yet!");
        lastDayOfMonthWaiter(getLastDayOfMonth(true));
    }, millisecondsUntilNextDate);
};

const getLastDayOfMonth = (next) => {
    let today = new Date();
    let offset = 1;
    if (next) {
        offset += 1
    }

    let d = new Date(today.getFullYear(), today.getMonth() + offset, 0);

    d.setHours(0, 0, 0, 0);
    return new Date(d.getTime() + nineHoursPlusTimeDifferenceOffsetInMilliseconds)
};


client.on('ready', () => {

    const sheet = new sheets();

    console.log(`Logged in as ${client.user.tag}!`);

    lastDayOfMonthWaiter(getLastDayOfMonth());

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
    let nextNextTuesdayAT9 = getDayOfWeek(2, true);
    let nextNextThursdayAT9 = getDayOfWeek(4, true);
    let nextNextSundayAT9 = getDayOfWeek(7, true);


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


