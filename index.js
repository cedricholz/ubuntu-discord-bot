"use strict";

const Discord = require('discord.js');
const client = new Discord.Client();
let sheets = require("./sheets");

const timeOffset = 25200000;
const nineHoursInMilliseconds = 32400000;
const seventeenHoursInMilliseconds = 61200000;
const tenHoursInMilliseconds = 36000000;

const KITCHEN_CLEANERS = 'KITCHEN_CLEANERS';
const COOKS = 'COOKS';
const FARMERS_MARKET = 'FARMERS_MARKET';

// Bot Test
// const channelId = '592916978562236426';

// General
const channelId = '550082429004677129';

const timeWaiter = (sheet, index1, index2, nextDate, timeToWait, dayOrNight, type) => {
    let millisecondsUntilNextDate = nextDate.getTime() - new Date().getTime();
    setTimeout(function () {
        const intervalFunc = () => {
            try {
                if (type === KITCHEN_CLEANERS) {
                    sheet.getKitchenCleaners(client, index1, index2, dayOrNight);
                } else if (type === COOKS) {
                    sheet.getCooks(client, index1)
                } else if (type === FARMERS_MARKET) {
                    sheet.getFarmers(client, index1)
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

const getDateCopyAndNextWeekIfNeeded = (daysPastMonday, hoursInMilliseconds) => {

    let returnDate = new Date();
    returnDate.setDate(getMonday(new Date()).getDate() + daysPastMonday);
    returnDate.setHours(0, 0, 0, 0);
    if (isDateBeforeToday(returnDate)) {
        returnDate.setDate(returnDate.getDate() + 14);
    }


    return new Date(returnDate.getTime() + hoursInMilliseconds + timeOffset)
};

const getTwoWeekDates = (hoursInMilliseconds) => {


    let tuesday1 = getDateCopyAndNextWeekIfNeeded(1, hoursInMilliseconds);
    let thursday1 = getDateCopyAndNextWeekIfNeeded(3, hoursInMilliseconds);
    let sunday1 = getDateCopyAndNextWeekIfNeeded(6, hoursInMilliseconds);

    let tuesday2 = getDateCopyAndNextWeekIfNeeded(8, hoursInMilliseconds);
    let thursday2 = getDateCopyAndNextWeekIfNeeded(10, hoursInMilliseconds);
    let sunday2 = getDateCopyAndNextWeekIfNeeded(13, hoursInMilliseconds);

    let weekNo = getWeekNo(getMonday(new Date()));

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
    let nextMondayATDay = getDayOfWeek(1, false, nineHoursInMilliseconds);
    let nextMondayATNight = getDayOfWeek(1, false, seventeenHoursInMilliseconds);
    let nextTuesdayATDay = getDayOfWeek(2, false, nineHoursInMilliseconds);
    let nextTuesdayATNight = getDayOfWeek(2, false, seventeenHoursInMilliseconds);
    let nextWednesdayATDay = getDayOfWeek(3, false, nineHoursInMilliseconds);
    let nextWednesdayATNight = getDayOfWeek(3, false, seventeenHoursInMilliseconds);
    let nextThursdayATDay = getDayOfWeek(4, false, nineHoursInMilliseconds);
    let nextThursdayATNight = getDayOfWeek(4, false, seventeenHoursInMilliseconds);
    let nextFridayATDay = getDayOfWeek(5, false, nineHoursInMilliseconds);
    let nextFridayATNight = getDayOfWeek(5, false, seventeenHoursInMilliseconds);
    const oneWeekInMilliseconds = 604800000;

    timeWaiter(sheet, 1, 3, nextMondayATDay, oneWeekInMilliseconds, 'day', KITCHEN_CLEANERS);
    timeWaiter(sheet, 1, 3, nextMondayATNight, oneWeekInMilliseconds, 'night', KITCHEN_CLEANERS);
    timeWaiter(sheet, 5, 7, nextTuesdayATDay, oneWeekInMilliseconds, 'day', KITCHEN_CLEANERS);
    timeWaiter(sheet, 5, 7, nextTuesdayATNight, oneWeekInMilliseconds, 'night', KITCHEN_CLEANERS);
    timeWaiter(sheet, 9, 11, nextWednesdayATDay, oneWeekInMilliseconds, 'day', KITCHEN_CLEANERS);
    timeWaiter(sheet, 9, 11, nextWednesdayATNight, oneWeekInMilliseconds, 'night', KITCHEN_CLEANERS);
    timeWaiter(sheet, 13, 15, nextThursdayATDay, oneWeekInMilliseconds, 'day', KITCHEN_CLEANERS);
    timeWaiter(sheet, 13, 15, nextThursdayATNight, oneWeekInMilliseconds, 'night', KITCHEN_CLEANERS);
    timeWaiter(sheet, 17, 19, nextFridayATDay, oneWeekInMilliseconds, 'day', KITCHEN_CLEANERS);
    timeWaiter(sheet, 17, 19, nextFridayATNight, oneWeekInMilliseconds, 'night', KITCHEN_CLEANERS);

    // Family Dinner

    const {
        tuesday1,
        thursday1,
        sunday1,
        tuesday2,
        thursday2,
        sunday2,
    } = getTwoWeekDates(tenHoursInMilliseconds);

    const twoWeeksInMilliseconds = 1209600000;

    timeWaiter(sheet, 1, null, tuesday1, twoWeeksInMilliseconds, null, COOKS);
    timeWaiter(sheet, 3, null, thursday1, twoWeeksInMilliseconds, null, COOKS);
    timeWaiter(sheet, 5, null, sunday1, twoWeeksInMilliseconds, null, COOKS);
    timeWaiter(sheet, 7, null, tuesday2, twoWeeksInMilliseconds, null, COOKS);
    timeWaiter(sheet, 9, null, thursday2, twoWeeksInMilliseconds, null, COOKS);
    timeWaiter(sheet, 11, null, sunday2, twoWeeksInMilliseconds, null, COOKS);

    const farmersMarketTwoWeekDates = getTwoWeekDates(nineHoursInMilliseconds);

    // Farmer's Market
    timeWaiter(sheet, 1, null, farmersMarketTwoWeekDates.sunday1, twoWeeksInMilliseconds, null, FARMERS_MARKET);
    timeWaiter(sheet, 3, null, farmersMarketTwoWeekDates.sunday2, twoWeeksInMilliseconds, null, FARMERS_MARKET);

});

client.on('message', msg => {
    if ((msg.author.id === '313838517031534593' || msg.author.id === '536365234290688010') && msg.channel.type === 'dm') {
        client.channels.get(channelId).send(msg.content);
    }
});


const discord_creds = require('./discord_creds.json');
client.login(discord_creds['key']);


