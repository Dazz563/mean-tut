import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AuthInterceptor} from './auth/auth.interceptor';
import {ErrorInterceptor} from './error-interceptor';
import {HeaderComponent} from './header/header.component';
import {SharedModule} from './shared/shared.module';

@NgModule({
    declarations: [
        AppComponent, //
        HeaderComponent,
    ],
    imports: [
        BrowserModule, //
        AppRoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        SharedModule,
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true,
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ErrorInterceptor,
            multi: true,
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
