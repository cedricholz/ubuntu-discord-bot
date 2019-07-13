"use strict";

const Discord = require('discord.js');
const client = new Discord.Client();
let sheets = require("./sheets");

const timeOffset = 25200000
const nineHoursInMilliseconds = 32400000;
const tenHoursInMilliseconds = 36000000;

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
                    sheet.getKitchenCleaners(client, index1, index2);
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


const getDayOfWeek = (day, evenWeek, hourOfDayInMilliseconds) => {
    // let nineHoursInMilliseconds = 32400000;

    let d = new Date();

    let timeThing = d.getDate() + (7 + day - d.getDay()) % 7;

    if (day - d.getDay() === 0) {
        timeThing += 7
    }

    if (evenWeek) {
        timeThing += 7
    }

    d.setDate(timeThing);
    d.setHours(0, 0, 0, 0);
    return new Date(d.getTime() + hourOfDayInMilliseconds + timeOffset)
};

function setTimeout_(fn, delay) {
    let maxDelay = Math.pow(2, 31) - 1;

    if (delay > maxDelay) {
        let args = arguments;
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
    return new Date(d.getTime() + nineHoursInMilliseconds + timeOffset)
};

const getWeekNo = (dt) => {
    let tdt = new Date(dt.valueOf());
    let dayn = (dt.getDay() + 6) % 7;
    tdt.setDate(tdt.getDate() - dayn + 3);
    let firstThursday = tdt.valueOf();
    tdt.setMonth(0, 1);
    if (tdt.getDay() !== 4) {
        tdt.setMonth(0, 1 + ((4 - tdt.getDay()) + 7) % 7);
    }
    return 1 + Math.ceil((firstThursday - tdt) / 604800000);
};


function getMonday(d) {
    d = new Date(d);
    let day = d.getDay();
    let diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
}

const isDateBeforeToday = (date) => {
    return date < new Date();
};

const getDateCopyAndNextWeekIfNeeded = (daysPastMonday) => {

    let returnDate = new Date();
    returnDate.setDate(getMonday(new Date()).getDate() + daysPastMonday);

    if (isDateBeforeToday(returnDate)) {
        returnDate.setDate(returnDate.getDate() + 14);
    }

    returnDate.setHours(0, 0, 0, 0);
    return new Date(returnDate.getTime() + tenHoursInMilliseconds + timeOffset)
};

const getTwoWeekDates = () => {


    let tuesday1 = getDateCopyAndNextWeekIfNeeded(1);
    let thursday1 = getDateCopyAndNextWeekIfNeeded(3);
    let sunday1 = getDateCopyAndNextWeekIfNeeded(6);

    let tuesday2 = getDateCopyAndNextWeekIfNeeded(8);
    let thursday2 = getDateCopyAndNextWeekIfNeeded(10);
    let sunday2 = getDateCopyAndNextWeekIfNeeded(13);

    let weekNo = getWeekNo(new Date());

    if (weekNo % 2 !== 0) {
        return {
            tuesday1,
            thursday1,
            sunday1,
            tuesday2,
            thursday2,
            sunday2,
        }
    } else {
        return {
            tuesday1: tuesday2,
            thursday1: thursday2,
            sunday1: sunday2,
            tuesday2: tuesday1,
            thursday2: thursday1,
            sunday2: sunday1,
        }
    }

};

client.on('ready', () => {

    const sheet = new sheets();

    console.log(`Logged in as ${client.user.tag}!`);

    lastDayOfMonthWaiter(getLastDayOfMonth());

    // sheet.getKitchenCleaners(client, 1, 3);
    // sheet.getCooks(client, 1)

    // Cleaners
    let nextMondayAT9 = getDayOfWeek(1, false, nineHoursInMilliseconds);
    let nextTuesdayAT9 = getDayOfWeek(2, false, nineHoursInMilliseconds);
    let nextWednesdayAT9 = getDayOfWeek(3, false, nineHoursInMilliseconds);
    let nextThursdayAT9 = getDayOfWeek(4, false, nineHoursInMilliseconds);
    let nextFridayAT9 = getDayOfWeek(5, false, nineHoursInMilliseconds);
    const oneWeekInMilliseconds = 604800000;


    timeWaiter(sheet, 1, 3, nextMondayAT9, oneWeekInMilliseconds);
    timeWaiter(sheet, 5, 7, nextTuesdayAT9, oneWeekInMilliseconds);
    timeWaiter(sheet, 9, 11, nextWednesdayAT9, oneWeekInMilliseconds);
    timeWaiter(sheet, 13, 15, nextThursdayAT9, oneWeekInMilliseconds);
    timeWaiter(sheet, 17, 19, nextFridayAT9, oneWeekInMilliseconds);

    // Family Dinner


    const {
        tuesday1,
        thursday1,
        sunday1,
        tuesday2,
        thursday2,
        sunday2,
    } = getTwoWeekDates();

    const twoWeeksInMilliseconds = 1209600000;

    timeWaiter(sheet, 1, null, tuesday1, twoWeeksInMilliseconds);
    timeWaiter(sheet, 3, null, thursday1, twoWeeksInMilliseconds);
    timeWaiter(sheet, 5, null, sunday1, twoWeeksInMilliseconds);
    timeWaiter(sheet, 7, null, tuesday2, twoWeeksInMilliseconds);
    timeWaiter(sheet, 9, null, thursday2, twoWeeksInMilliseconds);
    timeWaiter(sheet, 11, null, sunday2, twoWeeksInMilliseconds);

});

// client.on('message', msg => {
//     if (msg.content === 'ping') {
//         msg.reply('Pong!')
//     }
// });


const discord_creds = require('./discord_creds.json');
client.login(discord_creds['key']);


