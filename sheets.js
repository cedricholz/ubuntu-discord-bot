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

    getKitchenCleaners(client, morning, night) {
        const creds = require('./sheets_creds.json');
        const doc = new GoogleSpreadsheet('1rYbqF13iGhGg0AzyXm6fCMsEtOclvfLJ-fgdOU4ClfU');
        // Authenticate with the Google Spreadsheets API.
        doc.useServiceAccountAuth(creds, function (err) {
            doc.getRows(2, function (err, rows) {
                // Morning
                let morningCrew = getPeopleFromRow(rows[morning]);

                // Night
                let nightCrew = getPeopleFromRow(rows[night]);
                let s = 'Morning cleaning crew: ' + getUbuntiansString(morningCrew);
                s += '\nEvening cleaning crew: ';
                s += getUbuntiansString(nightCrew);

                client.channels.get(channelId).send(s);
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
