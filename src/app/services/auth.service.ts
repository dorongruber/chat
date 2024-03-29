import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable, Subject, of, throwError } from "rxjs";
import { switchMap, catchError } from "rxjs/operators";
import { AuthResponseData } from "../auth/models/auth-response";
import { Auth } from "../auth/models/auth.model";
import { BaseUser, RegisterUser } from "../auth/models/newuser";

const DEV_URI = 'http://localhost:3000/api/user/';
const PROD_URI = 'https://pacific-sierra-73043.herokuapp.com/api/user/';
const URI = window.location.hostname === 'localhost'? DEV_URI: PROD_URI;
@Injectable({
  providedIn: 'root'
})
export class AuthService {


  authUser = new BehaviorSubject<Auth | undefined>(undefined);
  private tokenExpirationTimer: any;
  loadingObs = new Subject<boolean>();
  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  onRegister(newUser: RegisterUser) {
    this.loadingObs.next(true);
    return this.http.post<{message: boolean}>(
      `${URI}register`, {
        newUser
      }
    ).pipe(switchMap(message => {
      this.loadingObs.next(false);
      catchError(this.handleError);
      return of(message);
    }) )
  }

  onLogin(isUser: BaseUser): Observable<AuthResponseData> {
    this.loadingObs.next(true);
    return this.http.post<AuthResponseData>(
      `${URI}login`,
      {
        isUser
      }
    ).pipe(switchMap(resData => {
      catchError(this.handleError);
      this.handleAuthentication(resData);
      return of(resData);
    }));


  }

  private handleAuthentication(gurd: AuthResponseData) {
    const expirationDate = new Date(new Date().getTime() + gurd.expiresIn * 1000);
    const user = new Auth(
      gurd.email,
      gurd.id,
      gurd.token,
      expirationDate
    );
    this.authUser.next(user);
    this.AutoLogout(gurd.expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'new error in handleError';
    if (errorRes.message || errorRes.error.message)
      errorMessage = errorRes.error.message;
    return throwError(errorMessage);
  }

  AutoLogin() {
    try {
      const userData: {
        name: string;
        id: string;
        _token: string;
        _tokenExpirationDate: string;
      } = JSON.parse(localStorage.getItem('userData') || '{"name": null,"id":null,"_token": null,"_tokenExpirationDate":null}');
      if (!userData) return;
      const loadedUser = new Auth(
        userData.name,
        userData.id,
        userData._token,
        new Date(userData._tokenExpirationDate)
      );

      if (loadedUser.token) {
        this.authUser.next(loadedUser);
        const expirationDuration =
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();
        this.AutoLogout(expirationDuration);
        this.router.navigate(['/main']);
      }
    } catch(err) {
      throw err
    }
  }

  AutoLogout(exparationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.Logout()
    }, exparationDuration)
  }

  Logout() {
    this.authUser.next(undefined);
    this.router.navigate(['/auth/login']);
    localStorage.removeItem('userData');
    if ( this.tokenExpirationTimer )
      clearTimeout(this.tokenExpirationTimer);
    this.tokenExpirationTimer = null;
  }
}
