// The router is managed globally in the app. That's why we don't have to explicitly export the
// declared components in order to be able to use them here

import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { PostListComponent } from "./posts/post-list/post-list.component";
import { PostCreateComponent } from "./posts/post-create/post-create.component";
import { AuthGuard } from "./auth/auth.guard";

const routes: Routes = [
    { path: '', component: PostListComponent },
    // load these eagerly (on startup)
    { path: 'create', component: PostCreateComponent, canActivate: [AuthGuard] },
    { path: 'edit/:postId', component: PostCreateComponent, canActivate: [AuthGuard] },
    { path: 'auth', loadChildren: './auth/auth.module#AuthModule' }
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    // we should rarely provide services in this module, but for Route Guards, it's ok
    providers: [AuthGuard]
})
export class AppRoutingModule { }
