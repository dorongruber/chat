import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AbstractErrorHandler } from '../base/errorhandler.service';

export class ChatsErrorHandlerService implements AbstractErrorHandler {

  handleError(errorRes: HttpErrorResponse): Observable<never> {
    let errorMessage = 'new error in chat handleError';
    if (errorRes.message || errorRes.error.message)
      errorMessage = errorRes.error.message;
    return throwError(errorMessage);
  }
}
