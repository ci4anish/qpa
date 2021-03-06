import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatExpansionModule,
  MatRadioModule,
  MatInputModule,
  MatListModule,
  MatIconModule,
  MatTooltipModule,
  MatMenuModule,
  MatProgressSpinnerModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { SubmitToolbarComponent } from './submit-toolbar/submit-toolbar.component';
import { QuestionsMenuComponent } from './questions-menu/questions-menu.component';
import { AnswerDetailsComponent } from './answer-details/answer-details.component';
import { AppRoutingModule } from './app-routing.module';
import { AppStateService } from './app-state.service';
import { HttpClientModule } from '@angular/common/http';
import { EmptyAnswerComponent } from './empty-answer/empty-answer.component';

@NgModule({
  declarations: [
    AppComponent,
    SubmitToolbarComponent,
    QuestionsMenuComponent,
    AnswerDetailsComponent,
    EmptyAnswerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatRadioModule,
    MatInputModule,
    MatListModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatIconModule,
    MatTooltipModule,
    MatMenuModule,
    MatProgressSpinnerModule
  ],
  providers: [AppStateService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
