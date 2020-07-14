import sirv from 'sirv';
import polka from 'polka';
import compression from 'compression';
import * as sapper from '@sapper/server';

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
	// -- get all tests data from db --
	.get('/api/tests', async (req, res) => {
		const snapshot = await firestore
			.collection("tests")
			.get();

		let tests = snapshot.docs.map(doc => {
			let data = doc.data();
			data.id = doc.id;
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

		const snapshot = await firestore
			.collection("questions").doc(`${id}`).get();

		let question = snapshot.data();
		question.realID = snapshot.id;

		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify(question));
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