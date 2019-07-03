import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import { GameService, Player } from './game.service';
import { MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  gameInput: FormGroup;
  gameInfo: any;
  players$: Observable<Player[]>;

  constructor(private fb: FormBuilder, private game: GameService, private snackBar: MatSnackBar) {}

  async ngOnInit() {
    this.players$ = this.game.getPlayers();
    this.gameInput = this.fb.group({
      hideRequired: false,
      floatLabel: 'auto',
      player1: new FormControl('', [Validators.required]),
      scorePlayer1: new FormControl('', [Validators.required]),
      player2: new FormControl('', [Validators.required]),
      scorePlayer2: new FormControl('', [Validators.required]),
    });
    this.gameInfo = await this.game.getCurrentGame().toPromise();
    this.loadCurrentGame();
  }

  async loadCurrentGame() {
    this.gameInfo = await this.game.getCurrentGame().toPromise();
    this.gameInput.get('player1').setValue(this.gameInfo.player1);
    this.gameInput.get('player2').setValue(this.gameInfo.player2);
    this.gameInput.get('scorePlayer1').setValue(this.gameInfo.scorePlayer1);
    this.gameInput.get('scorePlayer2').setValue(this.gameInfo.scorePlayer2);
  }

  async submit() {
    const payload = {
      player1: this.gameInput.get('player1').value,
      player2: this.gameInput.get('player2').value,
      scorePlayer1: this.gameInput.get('scorePlayer1').value,
      scorePlayer2: this.gameInput.get('scorePlayer2').value,
    };
    await this.game.updateGame(payload);
    this.snackBar.open('Updated game!', 'Ok', {
      duration: 2000,
    });
  }
}
