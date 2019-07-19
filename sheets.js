"use strict";

const GoogleSpreadsheet = require('google-spreadsheet');

// Bot Test
// const channelId = '592916978562236426';

// General
const channelId = '550082429004677129';

const getPeopleFromRow = (row) => {
    if (row) {
        return [
            row.name1,
            row.name2,
            row.name3,
            row.name4,
            row.name5,
        ];
    }
    return []
};

const getUbuntiansString = (crew) => {
    let s = '';
    for (let ubuntian of crew) {
        if (ubuntian) {
            s += `<@${ubuntian}>, `
        }
    }
    s = s.slice(0, s.length - 2);
    return s
};

module.exports = class Sheets {
    constructor() {
    }

    getKitchenCleaners(client, morning, night, dayOrNight) {
        const creds = require('./sheets_creds.json');
        const doc = new GoogleSpreadsheet('1rYbqF13iGhGg0AzyXm6fCMsEtOclvfLJ-fgdOU4ClfU');
        // Authenticate with the Google Spreadsheets API.
        doc.useServiceAccountAuth(creds, function (err) {
            doc.getRows(2, function (err, rows) {
                // Morning
                if (dayOrNight === 'day') {
                    let morningCrew = getPeopleFromRow(rows[morning]);
                    let s = 'Morning cleaning crew: ' + getUbuntiansString(morningCrew);
                    s += getUbuntiansString(morningCrew);
                    client.channels.get(channelId).send(s);
                }
                // Night
                if (dayOrNight === 'night') {
                    let nightCrew = getPeopleFromRow(rows[night]);
                    let s = 'Evening cleaning crew: ' + getUbuntiansString(nightCrew);
                    client.channels.get(channelId).send(s);
                }
            });
        });
    }

    getCooks(client, index) {
        const creds = require('./sheets_creds.json');
        const doc = new GoogleSpreadsheet('1rYbqF13iGhGg0AzyXm6fCMsEtOclvfLJ-fgdOU4ClfU');
        // Authenticate with the Google Spreadsheets API.
        doc.useServiceAccountAuth(creds, function (err) {
            doc.getRows(1, function (err, rows) {
                let cookingCrew = getPeopleFromRow(rows[index]);
                let s = 'Cooking crew: ' + getUbuntiansString(cookingCrew);
                client.channels.get(channelId).send(s);
            });
        });
    }
};
