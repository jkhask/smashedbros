import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp(functions.config().firebase);

const region = 'us-east1';

export const activeMatch = functions.region(region).https.onRequest(async (request, response) => {
    const db = admin.firestore();
    const doc = await db.collection('matches').doc('activeMatch').get();
    response.send(doc.data());    
});
