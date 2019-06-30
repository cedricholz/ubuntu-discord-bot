"use strict";

const GoogleSpreadsheet = require('google-spreadsheet');

const getPeopleFromRow = (row) => {
    return [
        row.name1,
        row.name2,
        row.name3,
        row.name4,
        row.name5,
    ];
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

    getKickchenCleaners(client, morning, night) {
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
                s += '\nEvening cleaning crew:';
                s += getUbuntiansString(nightCrew);

                client.channels.get('550082429004677129').send(s);
            });
        });
    }

    getCooks(client, index) {
        const creds = require('./sheets_creds.json');
        const doc = new GoogleSpreadsheet('1rYbqF13iGhGg0AzyXm6fCMsEtOclvfLJ-fgdOU4ClfU');
        // Authenticate with the Google Spreadsheets API.
        doc.useServiceAccountAuth(creds, function (err) {
            doc.getRows(3, function (err, rows) {
                let cookingCrew = getPeopleFromRow(rows[index]);
                let s = 'Cooking crew: ' + getUbuntiansString(cookingCrew);

                // General
                client.channels.get('550082429004677129').send(s);

                // Bot-Test
                // client.channels.get('592916978562236426').send(s);
            });
        });
    }
};
