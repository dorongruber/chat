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

  post<Type>(url: string, obj: FormData) {
    return this.http.post<Type>(`${url}`,obj).toPromise();
  }

  put<Type>(url: string, obj: any) {
    return this.http.put<Type>(`${url}`,obj).toPromise();
  }

  delete<Type>(url: string, args: string) {
    return this.http.delete<Type>(`${url}${args}`).toPromise();
  }
}
