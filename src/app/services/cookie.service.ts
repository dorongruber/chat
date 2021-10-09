import { Injectable } from "@angular/core";
import { Cookie } from "../shared/models/cookie";
import { Dictionary } from "../shared/models/dictonary/dictonary.model";

@Injectable({
  providedIn: 'root'
})
export class CookieService {
  cookies: Dictionary<Cookie> | undefined;
  constructor() {

  }

  Init() {
    const cookies = document.cookie.split(';');

  }
}
