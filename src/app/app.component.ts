import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { Player, GameService } from './game.service';
import { AddPlayerComponent } from './add-player/add-player.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { DocumentChangeAction } from '@angular/fire/firestore';
import { ConfirmComponent } from './confirm/confirm.component';
import { CdkDragDrop, copyArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  gameInput: FormGroup;
  gameInfo: any;
  players$: Observable<DocumentChangeAction<Player>[]>;
  match: any = {};
  combatants$: Observable<any>;
  combatants: any = [];
  matchActive = false;

  constructor(
    private fb: FormBuilder,
    private game: GameService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    public auth: AuthService,
  ) { }

  async ngOnInit() {
    this.players$ = this.game.getPlayers();
    this.game.getActiveMatch().subscribe(match => {
      this.match = match;
      this.combatants$ = this.game.getCombatants(match);
      this.combatants$.subscribe(c => this.combatants = c);
    });
  }

  openAddPlayer(player?: Player): void {
    const dialogRef = this.dialog.open(AddPlayerComponent, {
      width: '70%',
      data: { player: player ? player : undefined },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open(`Player ${result}.`, 'Ok', {
          duration: 3000,
        });
      }
    });
  }

  confirmDeletePlayer(player: Player): void {
    const deletePlayer = async (p) => {
      let isError = false;
      await this.game.deletePlayer(p)
        .catch(err => {
          isError = true;
          this.snackBar.open('You lack the permission to do this.', 'Ok', {
            duration: 3000,
          });
        });
      if (!isError) {
        this.snackBar.open('Player deleted', 'Ok', {
          duration: 3000,
        });
      }
    };

    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '250px',
      data: { message: 'Are you sure you want to delete this player?' },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        deletePlayer(player);
      }
    });
  }

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer !== event.container) {
      const player = event.previousContainer.data[event.previousIndex];
      this.addPlayerToArena(player);
    }
  }

  addPlayerToArena(player: DocumentChangeAction<Player>) {
    this.combatants.push(player.payload.doc.data());
    const values: any = {};
    if (this.combatants.length === 1) {
      values.player1 = player.payload.doc.data().tag;
      values.scorePlayer1 = 0;
    } else if (this.combatants.length === 2) {
      values.player2 = player.payload.doc.data().tag;
      values.scorePlayer2 = 0;
    }
    this.game.updateActiveMatch(values)
      .catch(err => {
        this.snackBar.open('Log In to edit active match.', 'Ok', {
          duration: 3000,
        });
      });
  }

  async clearActiveMatch() {
    await this.game.updateActiveMatch({ scorePlayer1: 0, scorePlayer2: 0, player1: '', player2: '' });
  }

  async onScoreUpdate() {
    await this.game.updateActiveMatch({ scorePlayer1: this.match.scorePlayer1, scorePlayer2: this.match.scorePlayer2 });
  }

  async storeMatch() {
    if (this.match.scorePlayer1 > this.match.scorePlayer2) {
      this.match.winner = this.match.player1;
      this.match.loser = this.match.player2;
    } else {
      this.match.winner = this.match.player2;
      this.match.loser = this.match.player1;
    }
    this.game.computeElo(this.combatants, this.match);
    await this.game.addMatch(this.match);
    await this.clearActiveMatch();
    this.snackBar.open('Match saved.', 'Ok', {
      duration: 3000,
    });
  }

}
