import {Component} from '@angular/core';
import {AppStateService} from './app-state.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private appStateService: AppStateService, private router: Router) {
    let question = appStateService.getPreSelectedQuestion();
    let redirectUrl;

    if (question) {
      redirectUrl = '/answer/' + question.answer_id
    } else {
      redirectUrl = '/start-page'
    }

    this.router.navigateByUrl(redirectUrl);
  }
}
