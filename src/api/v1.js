import express from 'express';
const api_v1_router = express.Router();

// my tools to get easy work 💜
import {
    easyResponse
} from "../tools/response";

import {
    StatusTypes
} from '../tools/status';

import {
    randomNumbers
} from '../tools/cool';

import {
    firestore,
    auth
} from "../firebase-admin";

const {
    PORT,
    NODE_ENV,
} = process.env;
const dev = NODE_ENV === 'development';

api_v1_router
    // -- get all tests data from db --
    .get('/tests/:id?', async (req, res) => {
        try {
            // global variables
            let testsCollection = {};

            // get a specific native test from 'tests' collection in db - by ID
            if (req.params.id) {
                testsCollection = await firestore
                    .collection("tests").doc(req.params.id)
                    .get();
                if (!testsCollection.exists) {
                    return easyResponse(res, null, true, StatusTypes.NO_DATA.code);
                }
            }
            // get all native tests from 'tests' collection in db
            else {
                testsCollection = await firestore
                    .collection("tests")
                    .get();
            }

            // ------------------------- Step 1 -------------------------

            // User Variables 🤦‍♂
            let userProgress = [];

            // Check if user logged in
            if (req.user) {
                let userID = req.user.uid;
                const userDoc = await firestore
                    .collection("users").doc(userID)
                    .get();

                // Check if the User alredy exist and has the 'lastTest' field 🐶 in db
                if (userDoc.exists && userDoc.data().lastTest) {
                    const userData = await firestore
                        .collection("users").doc(userID).collection('userProgress')
                        .get();

                    // array of maps (js objects) 🤠
                    userProgress = userData.docs.map(doc => {
                        let data = doc.data();
                        data.id = doc.id;
                        return data;
                    });

                    // const userLastTest = await userDoc.data().lastTest.get();
                    // console.log(userLastTest.data());
                }
            }

            // ------------------------- Step 2 -------------------------
            // the final clean result (maybe array of objects if tests, maybe one object if one test)
            let tests;

            // Return the data of the 'test'
            if (req.params.id) {
                let data = testsCollection.data();
                data.id = testsCollection.id;
                data.stepValue = 0; // by default: no step 🙄!
                data.isCompleted = false; // by default: no user play 🙄!
                data.lastQuestion = 0; // by default: no user play 🙄!

                // if the user logged and exist >> update the progress 🦊
                for (const e of userProgress) {
                    if (e.id == req.params.id) {
                        data.stepValue = e.stepValue;
                        data.isCompleted = e.isCompleted;
                        data.lastQuestion = e.lastQuestion;
                        break;
                    }
                }

                const max = await firestore
                    .collection("tests")
                    .doc(req.params.id)
                    .collection('questionsID').get();

                data.maxSteps = max.docs.length;
                tests = data;
            }
            // Return the data of 'tests'
            else {
                const tests_ = testsCollection.docs.map(async (doc) => {
                    let data = doc.data();
                    data.id = doc.id;
                    data.stepValue = 0; // by default: no step 🙄!
                    data.isCompleted = false; // by default: no user play 🙄!
                    data.lastQuestion = 0; // by default: no user play 🙄!

                    // if the user logged and exist >> update the progress 🦊
                    for (const e of userProgress) {
                        if (e.id == data.id) {
                            data.stepValue = e.stepValue;
                            data.isCompleted = e.isCompleted;
                            data.lastQuestion = e.lastQuestion;
                            break;
                        }
                    }

                    // finally add 'max steps' for the current test 😉
                    // this is useful to not increase question index more than it have (out of range) 👌
                    const max = await firestore
                        .collection("tests")
                        .doc(doc.id)
                        .collection('questionsID').get();

                    data.maxSteps = max.docs.length;

                    return data;
                });

                // Promise.all is useful if you have a "async/await" inside the "map" function of your array
                tests = await Promise.all(tests_);
            }
            // ------------------------- Step 3 -------------------------
            easyResponse(res, tests);

        } catch (error) {
            easyResponse(res, null, true, error.code);
        }
    })
    // -- get questions data by id from db
    .get('/questions/:id?', async (req, res) => {
        const {
            id
        } = req.params;
        const {
            limit
        } = req.query;

        try {
            // point on questions colelction
            const questionColl = await firestore.collection("questions");

            // if specific question 🤠
            if (id) {
                const snapshot = await questionColl.doc(id).get();
                if (!snapshot.exists)
                    return easyResponse(res, null, true, StatusTypes.NO_DATA.code);

                let question = snapshot.data();
                question.id = snapshot.id;
                easyResponse(res, question);
            }
            // or all questions
            else {
                // limit query: range of random data 🤗
                if (limit) {
                    let numberLimit = parseInt(limit.toString().trim());
                    let length = (await questionColl.get()).docs.length;
                    if (length == 0) {
                        return easyResponse(res, null, true, StatusTypes.NO_DATA.code, "There no questions in database!");
                    } else if (!numberLimit || numberLimit <= 0) {
                        return easyResponse(res, null, true, StatusTypes.Invalid_Argument.code, "Enter a valid limit number.");
                    } else if (length < numberLimit) {
                        return easyResponse(res, null, true, StatusTypes.Invalid_Argument.code, `We don't have this range of data, We just have ${length} questions.`);
                    }
                    let data = [];
                    let random = await randomNumbers(0, length - 1, numberLimit);
                    console.log(random);
                    for (let i = 0; i < numberLimit; i++) {
                        const x = random[i];
                        data[i] = (await questionColl
                            .where("index", ">=", x)
                            .limit(1)
                            .get()).docs[0].data();
                    }
                    return easyResponse(res, data);
                }
                // all the data 🤗
                const snapshot = await questionColl.get();
                let questions = snapshot.docs.map(doc => {
                    let data = doc.data();
                    data.id = doc.id;
                    return data;
                });
                easyResponse(res, questions);
            }
        } catch (error) {
            easyResponse(res, null, true, error.code);
        }
    })
    // -- get all questions references of test
    .get('/questions/test/:testID', async (req, res) => {

        const {
            testID
        } = req.params;

        const snapshot = await firestore
            .collection("tests").doc(`${testID}`).collection('questionsID').get();

        let questionsOfTest = snapshot.docs.map(doc => doc.data());

        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(questionsOfTest));
    })
    // -- get one (question reference (by index)) of test
    .get('/question_of_test/:testID/:questionIndex', async (req, res) => {

        const {
            testID,
            questionIndex
        } = req.params;

        const snapshot = await firestore
            .collection("tests").doc(`${testID}`).collection('questionsID').doc(`${questionIndex}`).get();

        let questionReference = snapshot.data();

        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(questionReference));
    })
    // -- firbase session login
    .post('/session_login', async (req, res) => {
        // Get the token ID passed.
        const tokenID = req.body.tokenID.toString();
        // Set session expiration to 5 days.
        const expiresIn = 60 * 60 * 24 * 5 * 1000;
        // Create the session cookie. This will also verify the ID token in the process.
        // The session cookie will have the same claims as the ID token.
        try {
            const sessionCookie = await auth.createSessionCookie(tokenID, {
                expiresIn
            });
            // Set cookie policy for session cookie.
            const options = {
                maxAge: expiresIn,
                httpOnly: true,
                secure: dev ? false : true,
            };
            res.cookie("session", sessionCookie, options);
            easyResponse(res, null);

        } catch (error) {
            easyResponse(res, null, true, StatusTypes.Authentication_Failed.code);
        }
    })
    // -- firbase session logout
    .get('/logout', async (req, res) => {
        res.clearCookie('session');
        res.redirect('/login');
    })
    .get('/user/test/:test_id', async (req, res) => {

        // First of all: check the existence of user
        if (!req.user) {
            return easyResponse(res, null, true, StatusTypes.Login_Is_Required.code);
        }
        const {
            test_id
        } = req.params;

        try {
            let testDoc = await firestore
                .collection("tests")
                .doc(test_id)
                .get();

            if (!testDoc.exists) {
                return easyResponse(res, null, true, StatusTypes.NO_DATA.code);
            }


        } catch (error) {

        }
    })


// export the router 
export {
    api_v1_router
};