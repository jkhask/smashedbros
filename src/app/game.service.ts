import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/firestore';
import { map, first } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(private firestore: AngularFirestore) { }

  getCurrentGame(): Observable<any> {
    return this.firestore.collection('game-info').doc('values').get()
    .pipe(map((res) => res.data()))
    .pipe(first());
  }

  updateGame(values): Promise<void> {
    return this.firestore
      .collection('game-info')
      .doc('values')
      .set({
        player1: values.player1,
        player2: values.player2,
        scorePlayer1: values.scorePlayer1,
        scorePlayer2: values.scorePlayer2,
      }, { merge: true });
  }
}
