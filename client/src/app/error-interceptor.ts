import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {catchError, Observable, throwError} from 'rxjs';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(
        private snackBar: MatSnackBar //
    ) {}
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                console.log('Error from interceptor: ', error);
                let errorMessage = 'An unknown error occured!';
                if (error.error.message) {
                    errorMessage = error.error.message;
                }
                this.snackBar.open('Oops', errorMessage, {
                    duration: 5000,
                    // panelClass: ['green-snackbar'],
                    horizontalPosition: 'center',
                    verticalPosition: 'bottom',
                });
                return throwError(() => error);
            })
        );
    }
}
