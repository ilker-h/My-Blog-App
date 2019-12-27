import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

import { Subject } from "rxjs";

import { environment } from '../../environments/environment';
import { AuthData } from "./auth-data.model";

// make sure to add the slash after user
const BACKEND_URL = environment.apiUrl + '/user/';

// The reason we don't declare our services into these feature modules (like auth.module.ts) and instead declare them
// only in the root module (app.module.ts) is that it's recommended to inject services into the root
// level. Thanks to the "@Injectable({ providedIn: 'root' })" thing, Angular will automatically load
// this in a very efficient way. And you can get unwanted side effects, like different service instances
// if you provide services on a module level.
@Injectable({ providedIn: 'root' })
export class AuthService {
    private isAuthenticated = false;
    private token: string;
    private tokenTimer: any;
    private userId: string;

    // so adding <> means it's a "generic type" that's wrapping a boolean.
    // This variable is just going to say whether we're authenticated or not, it doesn't need the actual token
    private authStatusListener = new Subject<boolean>();

    constructor(private http: HttpClient, private router: Router) { }

    getToken() {
        return this.token;
    }

    getIsAuth() {
        return this.isAuthenticated;
    }

    getUserId() {
        return this.userId;
    }

    getAuthStatusListener() {
        // it's "asObservable()" because we only want to return the observable part of that listener, not
        // anything else. So we can't emit other values from other components. We only want to be able to emit
        // from within this service, while being able to listen from other parts of the app. So other parts of the
        // app can call this method to get the listener. See the login() method below too
        return this.authStatusListener.asObservable();
    }

    createUser(email: string, password: string) {
        const authData: AuthData = { email: email, password: password };
        this.http.post(BACKEND_URL + '/signup', authData)
        .subscribe(response => {
            console.log(response);
            this.router.navigate(['/login']);
        }, error => {
            this.authStatusListener.next(false);
        });
    }

    // Note: for createUser(), you could also have done:
    // return this.http.post('http://localhost:3000/api/user/signup', authData);
    //
    // and then called this at the place where you're receiving the observable:
    //  this.authService.createUser(form.value.email, form.value.password).subscribe(null, error => {});



    login(email: string, password: string) {
        const authData: AuthData = { email: email, password: password };
        this.http.post<{ token: string, expiresIn: number, userId: string }>(BACKEND_URL + '/login', authData)
            .subscribe(response => {
                // console.log(response);
                const token = response.token;
                this.token = token;
                if (token) {
                    const expiresInDuration = response.expiresIn;
                    // console.log(expiresInDuration);
                    this.setAuthTimer(expiresInDuration);
                    this.isAuthenticated = true;
                    this.userId = response.userId;
                    this.authStatusListener.next(true);
                    const now = new Date();
                    const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
                    // console.log(expirationDate); 
                    this.saveAuthData(token, expirationDate, this.userId);
                    this.router.navigate(['/']);
                }
            }, error => {
                this.authStatusListener.next(false);
            });
    }

    autoAuthUser() {
        const authInformation = this.getAuthData();
        if (!authInformation) {
            return;
        }
        const now = new Date();
        const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
        console.log(authInformation, expiresIn);
        if (expiresIn > 0) {
            this.token = authInformation.token;
            this.isAuthenticated = true;
            this.userId = authInformation.userId; // set the User ID to the User ID fetched from the local storage
            this.setAuthTimer(expiresIn / 1000);
            this.authStatusListener.next(true);
        }
    }

    private setAuthTimer(duration: number) {
        console.log('Setting timer: ' + duration);
        this.tokenTimer = setTimeout(() => {
            this.logout();
        }, duration * 1000); // this works in milliseconds, not seconds
    }

    logout() {
        this.token = null;
        this.isAuthenticated = false;
        this.authStatusListener.next(false);
        this.userId = null;
        clearTimeout(this.tokenTimer);
        this.clearAuthData();
        this.router.navigate(['/']);
    }

    // Makes it so that the user's session persists even after a refresh
    private saveAuthData(token: string, expirationDate: Date, userId: string) {
        // That data will be serialized and stored in local storage. "localStorage" is the API for it.
        // The values are simply key-value pairs, which is good for simple data like strings, numbers, dates, etc.
        // It's harder for complex objects. "ISO" is a serialized and standardized version of the date, which we
        // can then use to recreate the date when read in the data later.
        localStorage.setItem('token', token);
        localStorage.setItem('expiration', expirationDate.toISOString());
        localStorage.setItem('userId', userId);
    }

    private clearAuthData() {
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');
        localStorage.removeItem('userId');
    }

    private getAuthData() {
        const token = localStorage.getItem('token');
        const expirationDate = localStorage.getItem('expiration');
        const userId = localStorage.getItem('userId');
        if (!token || !expirationDate) {
            return;
        } else {
            // returning a javascript object
            return {
                token: token,
                expirationDate: new Date(expirationDate),
                userId: userId
            };
        }
    }
}
