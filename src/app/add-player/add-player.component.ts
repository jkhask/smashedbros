import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { fighters, Fighter } from '../../assets/fighters';
import { Player, GameService } from '../game.service';

@Component({
  selector: 'app-add-player',
  templateUrl: './add-player.component.html',
  styleUrls: ['./add-player.component.scss'],
})
export class AddPlayerComponent implements OnInit {
  playerForm: FormGroup;
  fighters: Fighter[];
  filteredFighters: Fighter[];

  constructor(
    private fb: FormBuilder,
    private game: GameService,
    public dialogRef: MatDialogRef<AddPlayerComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
  ) {}

  ngOnInit(): void {
    this.fighters = fighters;
    this.filteredFighters = fighters;
    this.playerForm = this.fb.group({
      hideRequired: false,
      floatLabel: 'auto',
      tag: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      main: new FormControl('', [Validators.required]),
      icon: new FormControl('', [Validators.required]),
    });
  }

  chooseFighter(fighter: Fighter) {
    this.playerForm.get('main').setValue(fighter.name);
    this.playerForm.get('icon').setValue(fighter.icon);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  async submit() {
    const player: Player = {
      name: this.playerForm.get('name').value,
      tag: this.playerForm.get('tag').value,
      main: {
        name: this.playerForm.get('main').value,
        icon: this.playerForm.get('icon').value,
      },
      elo: 1000,
    };
    await this.game.addPlayer(player);
    this.dialogRef.close();
  }

  filterFighters(e) {
    this.filteredFighters = this.fighters.filter(
      fighter => fighter.name.toLowerCase().indexOf(e.target.value) > -1,
    );
  }
}
