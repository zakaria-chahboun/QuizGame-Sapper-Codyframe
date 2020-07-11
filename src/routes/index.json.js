import {
    firestore
} from "../firebase.js"


export async function get(req, res) {

    const snapshot = await firestore
        .collection("tests")
        .get();
    let test = snapshot.docs.map(doc => doc.data());
    
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(test));
}