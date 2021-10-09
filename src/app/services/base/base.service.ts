import { HttpClient } from "@angular/common/http";
import { Injectable, Type } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  constructor(
    private http: HttpClient,
  ) {}

  get<T>(url: string, arg: string) {
    return this.http.get<T>(`${url}${arg}`)
    .toPromise();
  }

  post<T>(url: string, obj: Type<T>) {
    return this.http.post(`${url}`,{obj}).toPromise();
  }
}
