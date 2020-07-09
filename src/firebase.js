import firebase from "firebase-admin";
import config from "./private/firebase-config.json";

// You have to put your firebase configurations in 'src/private/firebase-config.json' file, check readme

firebase.initializeApp({
    credential: firebase.credential.cert(config),
    databaseURL: "https://quiz-e9e49.firebaseio.com"
});

export const admin = firebase;