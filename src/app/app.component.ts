import { Component } from '@angular/core';
import {QuestionsMenuService} from './questions-menu.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private questionsMenuService: QuestionsMenuService, private router: Router){
    let question = questionsMenuService.getPreSelectedQuestion();
    let answerId = question ? question.answer_id : '';
    console.log('answerId', answerId);
    this.router.navigateByUrl('/answer/' + answerId);
  }
}
