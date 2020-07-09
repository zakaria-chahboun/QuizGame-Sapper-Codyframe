//const admin = require("firebase-admin");

import firebase from "firebase-admin";
import config from "./private/firebase-config.json";

// You have to put your firebase json configurations and 'firebase url' in 'private/firebase-config.json' file, check readme

firebase.initializeApp(config);

export const admin = firebase;