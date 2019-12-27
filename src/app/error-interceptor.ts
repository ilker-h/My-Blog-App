import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from "@angular/common/http";
import { MatDialog } from "@angular/material";

import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";

import { ErrorComponent } from "./error/error.component";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(private dialog: MatDialog) {}

    // every single outgoing HTTP request will be watched by this interceptor and if we get back an
    // error response, this interceptor will kick in
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        // handle() gives us back the response observable stream and then we can hook onto that
        // stream and listen to events using the pipe() method provided by rxjs. The pipe() adds
        // an operator to that stream. We want to add a special operator, the catchError operator,
        // which allows us to handle errors emitted in this stream. And since this is for an HTTP
        // request, we'll be talking about HTTP errors.
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                console.log(error);
                // we have 3 levels of "error" instead of the usual 2, because one more error object
                // is added in by the Mongoose Unique Validator
                // alert(error.error.error.message);
                let errorMessage = 'An unknown error occurred!';
                if (error.error.message) { // this just checks if the error message even exists
                    errorMessage = error.error.message;
                }
                this.dialog.open(ErrorComponent, {data: {message: errorMessage}});
                return throwError(error);
            })
        );
    }
}
