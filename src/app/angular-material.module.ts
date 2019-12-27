// Max said that breaking up modules doesn't yield a performance improvement, but makes it easier to read.
// This module will only do one thing: import things from Angular Material package and export them again
import { NgModule } from "@angular/core";
import {
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatDialogModule
} from '@angular/material';

@NgModule({
    // To avoid the redundancy of having the same things in the "imports" and "exports" array, Angular
    // lets you shorten it by only having an "exports" array
    //
    // imports: [
    //     MatInputModule,
    //     MatCardModule,
    //     MatButtonModule,
    //     MatToolbarModule,
    //     MatExpansionModule,
    //     MatProgressSpinnerModule,
    //     MatPaginatorModule,
    //     MatDialogModule
    // ],
    // By default, these packages in the "imports" array above are not exposed to any other module. To make
    // them usable in another module, we have to add the "exports" array below so that the packages can
    // first be imported then exported. So THAT'S why Max doesn't need an "exports" array in the main
    // app.module.ts
    exports: [
        MatInputModule,
        MatCardModule,
        MatButtonModule,
        MatToolbarModule,
        MatExpansionModule,
        MatProgressSpinnerModule,
        MatPaginatorModule,
        MatDialogModule
    ]

})
export class AngularMaterialModule { }
