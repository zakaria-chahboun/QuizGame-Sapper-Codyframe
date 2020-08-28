import sirv from 'sirv';
import polka from 'polka';
import compression from 'compression';
import * as sapper from '@sapper/server';
const {
	json
} = require('body-parser');

// my tools to get easy work 💜
import {
	easyResponse
} from "./tools/response";
import {
	checkAuthenticated
} from "./tools/authentication";

import {
	firestore,
	auth
} from "./firebase.js";

const {
	PORT,
	NODE_ENV,
} = process.env;
const dev = NODE_ENV === 'development';

// You can also use Express
polka()
	// - body parser
	.use(json())
	// -- get all tests data from db --
	.get('/api/v1/tests', checkAuthenticated, async (req, res) => {
		try {
			// get all native tests from 'tests' collection in db
			const testsCollection = await firestore
				.collection("tests")
				.get();

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

			// Return the data of 'tests'
			const tests_ = testsCollection.docs.map(async (doc) => {
				let data = doc.data();
				data.id = doc.id;
				data.stepValue = 0; // by default: no step 🙄!
				data.isCompleted = false; // by default: no user play 🙄!
				data.lastQuestion = 0; // by default: no user play 🙄!

				// if the user logged and exist >> update the progress 🦊
				userProgress.forEach((e, i) => {
					if (e.id == data.id) {
						data.stepValue = e.stepValue;
						data.isCompleted = e.isCompleted;
						data.lastQuestion = e.lastQuestion;
					}
				})

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
			const tests = await Promise.all(tests_);

			// ------------------------- Step 3 -------------------------
			easyResponse(res, tests);

		} catch (error) {
			easyResponse(res, null, true, error.code);
		}
	})
	// -- get questions data by id from db
	.get('api/question/:id', async (req, res) => {
		const {
			id
		} = req.params;
		try {

			const snapshot = await firestore
				.collection("questions").doc(`${id}`).get();
			if (!snapshot.exists)
				throw Error(`no data with this ID: ${id}`);

			let question = snapshot.data();
			question.id = snapshot.id;
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(question));

		} catch (error) {
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify({
				message: error.message
			}));
		}
	})
	// -- get all questions references of test
	.get('api/questions/test/:testID', async (req, res) => {

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
	.get('api/question_of_test/:testID/:questionIndex', async (req, res) => {

		const {
			testID,
			questionIndex
		} = req.params;

		const snapshot = await firestore
			.collection("tests").doc(`${testID}`).collection('questionsID').doc(`${questionIndex}`).get();

		let questionReference = snapshot.data();

		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify(questionReference));
	}).get('/dd', async (req, res) => {

		try {
			const user = await auth.createUser({
				uid: "cUJjO5EJly1Rf2z0uUlb",
				email: "exapmle@user.com",
				displayName: "sarah",
				password: "123456"
			});
			easyResponse(res, user.toJSON());
		} catch (error) {
			console.log(error.code);

			easyResponse(res, "", true, error.code);
		}
	})
	.use(
		compression({
			threshold: 0
		}),
		sirv('static', {
			dev
		}),
		sapper.middleware()
	)
	.listen(PORT, err => {
		if (err) console.log('error', err);
	});