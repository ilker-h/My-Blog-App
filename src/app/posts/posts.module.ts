// This is a feature module. This doesn't provide any kind of performance improvement, but makes the
// app more maintainable over time (although for this small app, it's premature optimization). However,
// it makes it easier to implement Lazy Loading in the routing, which does yield a performance improvement
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { PostCreateComponent } from "./post-create/post-create.component";
import { PostListComponent } from "./post-list/post-list.component";
import { AngularMaterialModule } from "src/app/angular-material.module";

@NgModule({
    declarations: [
        PostCreateComponent,
        PostListComponent,
    ],
    imports: [
        // we had to add this "CommonModule" because it usually comes from "BrowserModule" in app.module.ts,
        // but app.module.ts's packages don't apply to this module now that they're separate. Nothing
        // between modules is shared unless you specifically tell it to be shared. "CommonModule" brings
        // in basic things like ngIf functionality
        CommonModule,
        ReactiveFormsModule,
        AngularMaterialModule,
        // Sometimes you have to write packages like "RouterModule" into several modules (it's also in app.module.ts)
        RouterModule
    ]
})

export class PostsModule { }
