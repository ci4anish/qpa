import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AnswerDetailsComponent} from './answer-details/answer-details.component';
import {EmptyAnswerComponent} from './empty-answer/empty-answer.component';

const routes: Routes = [
  {path: 'answer', component: EmptyAnswerComponent},
  {path: 'answer/:answerId', component: AnswerDetailsComponent,  runGuardsAndResolvers: 'always'}
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
})
export class AppRoutingModule {
}
