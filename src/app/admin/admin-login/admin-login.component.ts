import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import {NgOptimizedImage} from "@angular/common";

@Component({
    selector: 'app-admin-login',
    standalone: true,
    imports: [
        FormsModule
    ],
    templateUrl: './admin-login.component.html',
    styleUrl: './admin-login.component.scss'
})
export class AdminLoginComponent {

    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);


    email = '';
    password = '';

    loading = false;
    errorMessage = '';


    async login(): Promise<void> {

        this.errorMessage = '';

        if (!this.email || !this.password) {
            this.errorMessage =
                'Vul je e-mailadres en wachtwoord in.';

            return;
        }


        this.loading = true;


        try {

            await this.authService.login(
                this.email,
                this.password
            );

            await this.router.navigate([
                '/admin/overview'
            ]);

        } catch (error: any) {

            console.error(
                'Login error:',
                error
            );

            switch (error?.code) {

                case 'auth/invalid-credential':
                    this.errorMessage =
                        'Het e-mailadres of wachtwoord is onjuist.';
                    break;

                case 'auth/user-disabled':
                    this.errorMessage =
                        'Dit account is uitgeschakeld.';
                    break;

                case 'auth/too-many-requests':
                    this.errorMessage =
                        'Te veel pogingen. Probeer het later opnieuw.';
                    break;

                default:
                    this.errorMessage =
                        'Er is iets misgegaan tijdens het inloggen.';
            }

        } finally {

            this.loading = false;

        }
    }
}
