import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  DocumentChangeAction,
} from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface Player {
  name: string;
  tag: string;
  elo: number;
  main: { name: string; icon: string };
}

@Injectable({
  providedIn: 'root',
})
export class GameService {
  constructor(private firestore: AngularFirestore) {}

  getCurrentGame(): Observable<any> {
    return this.firestore
      .collection('game-info')
      .doc('values')
      .get()
      .pipe(map(res => res.data()));
  }

  updateGame(values): Promise<void> {
    return this.firestore
      .collection('game-info')
      .doc('values')
      .update({
        player1: values.player1,
        player2: values.player2,
        scorePlayer1: values.scorePlayer1,
        scorePlayer2: values.scorePlayer2,
      });
  }

  getPlayers(): Observable<DocumentChangeAction<Player>[]> {
    return this.firestore
      .collection<Player>('players', ref =>
        ref.orderBy('elo', 'desc').orderBy('tag'),
      )
      .snapshotChanges();
  }

  deletePlayer(player) {
    return this.firestore
      .collection('players')
      .doc(player.payload.doc.id)
      .delete();
  }

  addPlayer(player): Promise<firebase.firestore.DocumentReference> {
    return this.firestore.collection<Player>('players').add(player);
  }
}
