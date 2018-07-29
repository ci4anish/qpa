import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AnswerDetailsComponent} from './answer-details/answer-details.component';

const routes: Routes = [
  {path: 'answer/:answerId', component: AnswerDetailsComponent,  runGuardsAndResolvers: 'always'}
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
})
export class AppRoutingModule {
}
