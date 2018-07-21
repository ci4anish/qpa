import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatExpansionModule,
  MatRadioModule,
  MatInputModule
} from '@angular/material';

import {AppComponent} from './app.component';
import { SubmitToolbarComponent } from './submit-toolbar/submit-toolbar.component';
import { QuestionsMenuComponent } from './questions-menu/questions-menu.component';
import { AnswerDetailsComponent } from './answer-details/answer-details.component';

@NgModule({
  declarations: [
    AppComponent,
    SubmitToolbarComponent,
    QuestionsMenuComponent,
    AnswerDetailsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatRadioModule,
    MatInputModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
