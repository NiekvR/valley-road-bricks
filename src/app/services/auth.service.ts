import { Injectable, inject } from '@angular/core';
import {
    Auth, onAuthStateChanged,
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


    isLoggedIn(): Observable<boolean> {
        return new Observable<boolean>((subscriber) => {

            const unsubscribe = onAuthStateChanged(
                this.auth,
                (user) => {
                    subscriber.next(!!user);
                },
                (error) => {
                    subscriber.error(error);
                }
            );

            // Wordt aangeroepen wanneer er niet meer geluisterd wordt
            return unsubscribe;
        });
    }
}
