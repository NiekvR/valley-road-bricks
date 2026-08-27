import { Injectable, inject } from '@angular/core';
import {
    Auth,
    signInWithEmailAndPassword,
    signOut,
    user
} from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private readonly auth = inject(Auth);

    readonly user$: Observable<any> = user(this.auth);


    async login(
        email: string,
        password: string
    ): Promise<void> {

        await signInWithEmailAndPassword(
            this.auth,
            email,
            password
        );
    }


    async logout(): Promise<void> {
        await signOut(this.auth);
    }


    isLoggedIn(): boolean {
        return this.auth.currentUser !== null;
    }
}
