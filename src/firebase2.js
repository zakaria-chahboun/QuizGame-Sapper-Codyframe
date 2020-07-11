import config from "./private/firebase-config.json";
import dUrl from "./private/firebase-databse-url.json";

let firebase;
if (typeof window === 'undefined') {
    firebase = require('firebase-admin');
}

// You have to put your firebase configurations in 'src/private/firebase-config.json' file, check readme
// You have to put your firebase database url in 'src/private/firebase-database-url.json' file, check readme
if (firebase) {
    firebase.initializeApp({
        credential: firebase.credential.cert(config),
        databaseURL: dUrl.databaseURL
    });
}
export {
    firebase
};

/**
 We did the check step because of this isssue:
 https://github.com/sveltejs/sapper/issues/1311
**/