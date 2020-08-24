import sirv from 'sirv';
import polka from 'polka';
import compression from 'compression';
import * as sapper from '@sapper/server';
const {
	json
} = require('body-parser');

import status from "./status";
import {
	firestore
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
	.get('/api/tests', async (req, res) => {
		const testsCollection = await firestore
			.collection("tests")
			.get();

		// User Variables 🤦‍♂
		let userProgress = [];
		const userID = 'cUJjO5EJly1Rf2z0uUlb';
		const userDoc = await firestore
			.collection("users").doc(userID)
			.get();

		// ------------------------- Step 1 -------------------------

		// Check if the User alredy exist and has the 'lastTest 🐶' field in db
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

		// ------------------------- Step 2 -------------------------

		// Return the data of 'tests'
		let tests = testsCollection.docs.map(doc => {
			let data = doc.data();
			data.id = doc.id;
			data.stepValue = 0; // by default: no step 🙄!
			data.isCompleted = false; // by default: no user play 🙄!
			data.lastQuestion = 1; // by default: no user play 🙄!

			// if the user exsit >> update the progress 🦊
			userProgress.forEach((e, i) => {
				if (e.id == data.id) {
					data.stepValue = e.stepValue;
					data.isCompleted = e.isCompleted;
					data.lastQuestion = e.lastQuestion;
				}
			})

			return data;
		});
		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify(tests));
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