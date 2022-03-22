import { HttpErrorResponse } from "@angular/common/http";

import { Observable } from "rxjs";

export interface AbstractErrorHandler {
  handleError(errorRes: HttpErrorResponse): Observable<never>;
}
