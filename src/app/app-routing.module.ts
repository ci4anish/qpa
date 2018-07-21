import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnswerDetailsComponent }      from './answer-details/answer-details.component';

const routes: Routes = [
  { path: 'answer/:answerId', component: AnswerDetailsComponent }
];

@NgModule({
  exports: [ RouterModule ],
  imports: [ RouterModule.forRoot(routes) ],
})
export class AppRoutingModule { }
