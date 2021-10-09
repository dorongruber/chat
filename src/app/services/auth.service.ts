import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Subject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { AuthResponseData } from "../auth/models/auth-response";
import { Auth } from "../auth/models/auth.model";
import { BaseUser, RegisterUser } from "../auth/models/newuser";

const URI = 'http://localhost:3000/api/user/';
// const URI = 'https://guarded-sea-67886.herokuapp.com/api/user/';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  authUser = new Subject<Auth>();
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
    )
  }

  onLogin(isUser: BaseUser) {
    this.loadingObs.next(true);
    return this.http.post<AuthResponseData>(
      `${URI}loguser`,
      {
        isUser
      }
    ).pipe(catchError(this.handleError), tap(resData => {
      this.handleAuthentication(
        resData
      )
    }))
  }

  private handleAuthentication(gurd: AuthResponseData) {
    const expirationDate = new Date(new Date().getTime() + gurd.expiresIn * 1000);
    const user = new Auth(
      gurd.email,
      gurd.userId,
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
    const userData: {
      name: string;
      pass: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData') || '');
    if (!userData) return;
    const loadedUser = new Auth(
      userData.name,
      userData.pass,
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
  }

  AutoLogout(exparationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.Logout()
    }, exparationDuration)
  }

  Logout() {
    this.authUser.next(undefined);
    this.router.navigate(['/auth']);
    localStorage.removeItem('serData');
    if ( this.tokenExpirationTimer )
      clearTimeout(this.tokenExpirationTimer);
    this.tokenExpirationTimer = null;
  }
}
