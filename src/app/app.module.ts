import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AuthInterceptor } from './auth/auth-interceptor';
import { ErrorInterceptor } from './error-interceptor';
import { ErrorComponent } from './error/error.component';
import { AngularMaterialModule } from './angular-material.module';
import { PostsModule } from './posts/posts.module';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    // Note: so everything in AngularMaterialModule isn't in PostsModule, so we have to add it there if we
    // want it. Now that I added "AngularMaterialModule" to "PostsModule"'s imports, it's a "shared module"
    AngularMaterialModule,
    PostsModule
  ],
  // "multi: true" tells Angular to not override existing interceptors but to add a new one instead
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  // you rarely need to use this but this lets you inform Angular that this component is going to get
  // used, even though Angular can't see it (because it's not called by its selector nor as a route,
  // which are usually the ways Angular anticipates a component being called)
  entryComponents: [ErrorComponent]
})
export class AppModule { }
