import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs';

export interface AuthData {
    email: string;
    password: string;
}

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private isAuthenticated = false;

    private token: string;
    private tokenTimer;
    private authStatusListener = new BehaviorSubject<boolean>(false);

    constructor(
        private http: HttpClient, //
        private router: Router
    ) {}

    getToken() {
        return this.token;
    }

    getIsAuth() {
        return this.isAuthenticated;
    }

    getAuthStatusListener() {
        return this.authStatusListener.asObservable();
    }

    createUser(email: string, password: string) {
        const authData: AuthData = {
            email,
            password,
        };
        this.http.post('http://localhost:3000/api/user/signup', authData).subscribe((res) => {
            console.log(res);
        });
    }

    login(email: string, password: string) {
        const authData: AuthData = {
            email,
            password,
        };
        this.http.post<{token: string; expiresIn: number}>('http://localhost:3000/api/user/login', authData).subscribe((res) => {
            // Handle JWT token
            const token = res.token;
            this.token = token;
            if (token) {
                const expiresInDuration = res.expiresIn;
                this.setAuthTimer(expiresInDuration);
                // Auth state
                this.authStatusListener.next(true);
                this.isAuthenticated = true;
                // store in localStorage
                const now = new Date();
                const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
                this.saveAuthData(token, expirationDate);
                // Route user
                this.router.navigateByUrl('/');
            }
        });
    }

    autoAuthUser() {
        const authInformation = this.getAuthData();
        if (!authInformation) {
            return;
        }
        const now = new Date();
        const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
        if (expiresIn > 0) {
            this.token = authInformation.token;
            this.isAuthenticated = true;
            this.setAuthTimer(expiresIn / 1000);
            this.authStatusListener.next(true);
        }
    }

    logout() {
        // Handle JWT token
        this.token = null;
        // Auth state
        this.authStatusListener.next(false);
        this.isAuthenticated = false;
        // Token Timer
        clearTimeout(this.tokenTimer);
        // Clear localStorage
        this.clearAuthData();
        // Route user
        this.router.navigateByUrl('/');
    }

    private setAuthTimer(duration: number) {
        // Token expires logic
        this.tokenTimer = setTimeout(() => {
            this.logout();
        }, duration * 1000);
    }

    private saveAuthData(token: string, expirationDate: Date) {
        localStorage.setItem('token', token);
        localStorage.setItem('expiration', expirationDate.toISOString());
    }

    private clearAuthData() {
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');
    }

    private getAuthData() {
        const token = localStorage.getItem('token');
        const expirationDate = localStorage.getItem('expiration');
        if (!token || !expirationDate) {
            return;
        }
        return {
            token: token,
            expirationDate: new Date(expirationDate),
        };
    }
}
