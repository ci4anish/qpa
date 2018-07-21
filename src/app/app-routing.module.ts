import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AnswerDetailsComponent} from './answer-details/answer-details.component';
import {StartPageComponent} from './start-page/start-page.component';

const routes: Routes = [
  {path: 'start-page', component: StartPageComponent},
  {path: 'answer/:answerId', component: AnswerDetailsComponent}
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes)],
})
export class AppRoutingModule {
}
