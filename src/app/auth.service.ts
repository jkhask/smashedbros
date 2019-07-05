import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, of } from 'rxjs';
import { auth } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: Observable<firebase.User>;

  constructor(
    private afAuth: AngularFireAuth,
  ) {
    this.user$ = this.afAuth.authState;
  }

  async googleSignin() {
    const provider = new auth.GoogleAuthProvider();
    const credential = await this.afAuth.auth.signInWithPopup(provider);
    console.log(credential);
  }

  async signOut() {
    await this.afAuth.auth.signOut();
  }

}
