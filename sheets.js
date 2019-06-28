const GoogleSpreadsheet = require('google-spreadsheet');
module.exports = class Sheets {
    constructor() {
    }

    getKickchenCleaners(client, morning, night) {
        const creds = require('./cresds_cedric.json');

        const doc = new GoogleSpreadsheet('1rYbqF13iGhGg0AzyXm6fCMsEtOclvfLJ-fgdOU4ClfU');

        // Authenticate with the Google Spreadsheets API.
        doc.useServiceAccountAuth(creds, function (err) {

            doc.getRows(2, function (err, rows) {
                // Morning
                let morningCrew = [
                    rows[morning].name1,
                    rows[morning].name2,
                    rows[morning].name3,
                    rows[morning].name4,
                    rows[morning].name5,
                ];

                // Night
                let nightCrew = [
                    rows[night].name1,
                    rows[night].name2,
                    rows[night].name3,
                    rows[night].name4,
                    rows[night].name5,
                ];

                let s = 'Morning cleaning crew: ';
                for (let ubuntian of morningCrew) {
                    if (ubuntian) {
                        s += `<@${ubuntian}>, `
                    }
                }
                s = s.slice(0, s.length - 2);

                s += '\nEvening cleaning crew:';

                for (let ubuntian of nightCrew) {
                    if (ubuntian) {
                        s += `<@${ubuntian}>, `
                    }
                }
                s = s.slice(0, s.length - 2);

                client.channels.get('592916978562236426').send(s);
            });
        });
    }
};
