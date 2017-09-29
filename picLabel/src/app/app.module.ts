import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes  } from '@angular/router';
import { FormsModule }   from '@angular/forms';
import { ImageUploadModule } from 'angular2-image-upload';
import { MyDatePickerModule } from 'mydatepicker';
import { RatingModule } from "ng2-rating";

import { AuthGuardService } from "./services/auth-guard.service";
import { AuthService } from "./services/auth.service";

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { JpegsComponent } from './jpegs/jpegs.component';
import { UsersComponent } from './users/users.component';

const appRoutes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'jpegs', component: JpegsComponent, canActivate: [ AuthGuardService ] },
  { path: 'users', component: UsersComponent, canActivate: [ AuthGuardService ] }
  ];

@NgModule({
  declarations: [
    AppComponent,
    JpegsComponent,
    LoginComponent,
    UsersComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ImageUploadModule.forRoot(),
    MyDatePickerModule,
    RatingModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [ AuthService, AuthGuardService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
