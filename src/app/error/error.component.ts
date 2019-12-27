import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material";

@Component({
    templateUrl: './error.component.html'
})
export class ErrorComponent {
    // @Inject lets you specify a special token and that will just be important for the dependency
    // injection system Angular uses to identify this data you're passing around. This special way
    // of injecting is required due to the special way this error component is getting created with.
    // MAT_DIALOG_DATA is the token we're using and that is the identified used internally. It will hold
    // data
    constructor(@Inject(MAT_DIALOG_DATA) public data: {message: string}) {}
}
