import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp(functions.config().firebase);

const region = 'us-east1';

const getValues = async () => {
    const db = admin.firestore();
    const doc = await db.collection('game-info').doc('values').get();
    return doc.data();
};

export const player1 = functions.region(region).https.onRequest(async (request, response) => {
    const data: any = await getValues();
    response.send(data.player1);    
});

export const player2 = functions.region(region).https.onRequest(async (request, response) => {
    const data: any = await getValues();
    response.send(data.player2);    
});

export const scorePlayer1 = functions.region(region).https.onRequest(async (request, response) => {
    const data: any = await getValues();
    response.send(data.scorePlayer1.toString());    
});

export const scorePlayer2 = functions.region(region).https.onRequest(async (request, response) => {
    const data: any = await getValues();
    response.send(data.scorePlayer2.toString());    
});
