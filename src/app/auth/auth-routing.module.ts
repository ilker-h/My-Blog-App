// We want to manage the routes for this module separately from app-routing.module.ts

import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";

const routes: Routes = [
    // load these lazily
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent }
];

@NgModule({
    imports: [
        // instead of forRoot, use forChild in order to register some child routes which will be merged
        // with the root router eventually. This is the main difference between this file and the main
        // app-routing.module.ts file.
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})

export class AuthRoutingModule { }
