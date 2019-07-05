import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  DocumentChangeAction,
} from '@angular/fire/firestore';
import { firestore } from 'firebase/app';
import { switchMap } from 'rxjs/operators';
import { Observable, combineLatest, of } from 'rxjs';
import { AuthService } from './auth.service';

export interface Player {
  name: string;
  tag: string;
  elo: number;
  main: { name: string; icon: string };
}

export interface Match {
  player1: string;
  player2: string;
  scorePlayer1: number;
  scorePlayer2: number;
  time: firestore.FieldValue;
  createdBy: string;
}

@Injectable({
  providedIn: 'root',
})
export class GameService {

  constructor(private afs: AngularFirestore, private auth: AuthService) { }

  getActiveMatch(): Observable<any> {
    return this.afs
      .collection('matches')
      .doc('activeMatch')
      .valueChanges();
  }

  async addMatch(match: Match): Promise<firebase.firestore.DocumentReference> {
    match.time = firestore.FieldValue.serverTimestamp();
    match.createdBy = this.auth.user.uid;
    return this.afs.collection<Match>('matches').add(match);
  }

  updateActiveMatch(values): Promise<void> {
    return this.afs
      .collection('matches')
      .doc('activeMatch')
      .update(values);
  }

  getPlayers(): Observable<DocumentChangeAction<Player>[]> {
    return this.afs
      .collection<Player>('players'
        // , ref => ref.orderBy('elo', 'desc').orderBy('tag')
      )
      .snapshotChanges();
  }

  getCombatants(match) {
    const p1$ = this.afs.collection<Player>('players', ref => ref.where('tag', '==', match.player1)).snapshotChanges();
    const p2$ = this.afs.collection<Player>('players', ref => ref.where('tag', '==', match.player2)).snapshotChanges();
    return combineLatest(p1$, p2$).pipe(switchMap((combatants: any) => {
      const [p1, p2] = combatants;
      const combined = [...p1, ...p2];
      return of(combined);
    }));
  }

  deletePlayer(player: DocumentChangeAction<Player>): Promise<void> {
    return this.afs
      .collection<Player>('players')
      .doc(player.payload.doc.id)
      .delete();
  }

  addPlayer(player: Player): Promise<firebase.firestore.DocumentReference> {
    return this.afs.collection<Player>('players').add(player);
  }

  updatePlayer(player: DocumentChangeAction<Player>, newValues: Player) {
    return this.afs
      .collection<Player[]>('players')
      .doc<Player>(player.payload.doc.id)
      .update(newValues);
  }

  computeElo(combatants, match) {
    const k = 30; // elo constant
    let eloP1 = combatants[0].payload.doc.data().elo;
    let eloP2 = combatants[1].payload.doc.data().elo;
    const prob1 = (1.0 / (1.0 + Math.pow(10, ((eloP2 - eloP1) / 400))));
    const prob2 = (1.0 / (1.0 + Math.pow(10, ((eloP1 - eloP2) / 400))));
    if (match.winner === combatants[0].payload.doc.data().tag) {
      eloP1 = eloP1 + k * (1 - prob1);
      eloP2 = eloP2 + k * (0 - prob2);
    } else {
      eloP1 = eloP1 + k * (0 - prob1);
      eloP2 = eloP2 + k * (1 - prob2);
    }
    this.afs
      .collection<Player[]>('players')
      .doc<Player>(combatants[0].payload.doc.id)
      .update({ elo: eloP1 });
    this.afs
      .collection<Player[]>('players')
      .doc<Player>(combatants[1].payload.doc.id)
      .update({ elo: eloP2 });
  }
}
