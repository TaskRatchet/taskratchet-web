import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material';
import { MatButtonModule } from '@angular/material';
import { MatDatepickerModule } from '@angular/material';

import { AppComponent } from './app.component';
import { TodosComponent } from './components/todos/todos.component';
import { TodoItemComponent } from './components/todo-item/todo-item.component';
import { HeaderComponent } from './components/layout/header/header.component';
import { AddTodoComponent } from './components/add-todo/add-todo.component';
import { AboutComponent } from './components/pages/about/about.component';
import { AccountComponent } from './components/pages/account/account.component';
import { SignInComponent } from './components/molecules/sign-in/sign-in.component';

@NgModule({
  declarations: [
    AppComponent,
    TodosComponent,
    TodoItemComponent,
    HeaderComponent,
    AddTodoComponent,
    AboutComponent,
    AccountComponent,
    SignInComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
