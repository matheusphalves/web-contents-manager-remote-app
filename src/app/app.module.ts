import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './views/home/home.component';
import { RepeatableButtonComponent } from './shared/forms/repeatable-button/repeatable-button.component';
import { WebContentDialogComponent } from './shared/web-content-dialog/web-content-dialog.component';

import { BasicAuthInterceptor } from './auth/basic-auth.interceptor';

import { NgMaterialModule } from './modules/ng-material/ng-material/ng-material.module';
import { FormModuleModule } from './modules/forms/form-module/form-module.module';
import { WebContentSnackbarComponent } from './shared/web-content-snackbar/web-content-snackbar.component';
import { APP_BASE_HREF } from '@angular/common';
import { LiferayProviderService } from './services/liferay-provider.service';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    WebContentDialogComponent,
    RepeatableButtonComponent,
    WebContentSnackbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FlexLayoutModule,
    NgMaterialModule,
    FormModuleModule,

  ],
  providers: [
    { 
      provide: HTTP_INTERCEPTORS, 
      useClass: BasicAuthInterceptor, 
      multi: true, 
      deps: [LiferayProviderService]
    },
    {
      provide: APP_BASE_HREF, 
      useValue: "/web-contents-app"
    },
    { 
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, 
      useValue: { subscriptSizing: 'dynamic' }
    },
    {
      provide: WebContentSnackbarComponent
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
