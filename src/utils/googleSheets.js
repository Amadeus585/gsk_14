import { gapi } from 'gapi-script';

const CLIENT_ID = '810213196129-bjkqnbipu0uuduuhc59j6r9vjlicrfnf.apps.googleusercontent.com';
const SPREADSHEET_ID = process.env.REACT_APP_GOOGLE_SHEET_ID;
const DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];
const SCOPES = "https://www.googleapis.com/auth/spreadsheets"; //  READ and WRITE access

const loadGoogleSheet = async () => {
    if (!SPREADSHEET_ID) {
        console.error("Error: REACT_APP_GOOGLE_SHEET_ID is not defined.");
        return Promise.reject(new Error("REACT_APP_GOOGLE_SHEET_ID is not defined"));
    }

    return new Promise((resolve, reject) => {
        gapi.load('client:auth2', () => {
            gapi.client.init({
                clientId: CLIENT_ID,
                discoveryDocs: DISCOVERY_DOCS,
                scope: SCOPES,
            }).then(() => {
                console.log("gapi.client.init success!"); // Добавлено
                const authInstance = gapi.auth2.getAuthInstance();

                if (authInstance.isSignedIn.get()) {
                    getData(resolve, reject);
                } else {
                    authInstance.signIn({ scope: SCOPES }).then(() => { // Явный запрос прав записи
                        getData(resolve, reject);
                    }, (error) => {
                        console.error("Error signing in:", error);
                        reject(error);
                    });
                }
            }, (error) => {
                console.error("Error initializing gapi.client:", error);
                reject(error);
            });
        });
    });
};

const getData = (resolve, reject) => {
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Sheet1', //  Replace with your sheet name if different
    }).then((response) => {
        if (!response.result || !response.result.values) {
            console.warn("No data found in Google Sheet.");
            resolve([]);
        } else {
            const data = response.result.values;
            console.log(data);
            resolve(data);
        }
    }, (error) => {
        console.error("Error getting data:", error);
        reject(error);
    });
};

const updateGoogleSheetData = async (range, values) => {
    return new Promise((resolve, reject) => {
        gapi.client.sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET_ID,
            range: range,
            valueInputOption: 'RAW', //  Изменено с 'USER_ENTERED' на 'RAW'
            resource: {
                values: values, // Array of arrays (rows)
            },
        }).then(
            (response) => {
                console.log('Sheet updated:', response);
                resolve(response.result);
            },
            (error) => {
                console.error('Error updating sheet:', error);
                reject(error);
            }
        );
    });
};

export { loadGoogleSheet, updateGoogleSheetData };