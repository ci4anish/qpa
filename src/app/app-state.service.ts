import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {

  private menu;
  private selectedQuestion;
  private assessmentCode: string;
  private endpointUrl: string = 'https://qpa.codesource.com.au/api/web.protocoldocumentanswerset/';

  constructor(private http: HttpClient, private router: Router) {
    this.menu = (<any>window).sidebar_json.slice();
    this.assessmentCode = (<any>window).assessment_code;
  }

  getMenuItems(): any[] {
    return this.menu;
  }

  getPreSelectedQuestionId(): number {
    return (<any>window).current_question_id;
  }

  getPreSelectedMenuItem() {
    const lastEditedId = (<any>window).current_question_id;

    if (!lastEditedId) {
      return undefined;
    }

    return this.getQuestionById(lastEditedId);
  }

  getSelectedQuestion() {
    return this.selectedQuestion;
  }

  setSelectedQuestion(selectedQuestion) {
    this.selectedQuestion = selectedQuestion;
  }

  filterLeftMenu(filterValue: string) {
    return this.http.get(`https://qpa.codesource.com.au/practice/assessment/${this.assessmentCode}/questions/?q=${filterValue}`);
  }

  selectLeftMenuQuestion(selected) {
    if (selected.subMenuItem) {
      selected.subMenuItem.expanded = true;
    }
    selected.menuItem.expanded = true;
  }

  fetchAnswer(answerId: number) {
    return this.http.get(this.endpointUrl + answerId);
  }

  updateAnswer(answerId: number, newValue: any) {
    return this.http.patch(this.endpointUrl + answerId, newValue);
  }

  markAnswerAsComplete(answerId: number) {
    return this.http.put(this.endpointUrl + answerId + '/mark_complete/', undefined);
  }

  setActiveMenuItem(questionId: number) {
    let selected = this.getQuestionById(questionId);
    this.setSelectedQuestion(selected.question);
    this.selectLeftMenuQuestion(selected);
    this.router.navigateByUrl('/answer/' + selected.question.answer_id);
  }

  getQuestionById(id: number) {
    let menuItem, subMenuItem, question, firstFoundQuestion;

    for (let i = 0; i < this.menu.length; i++) {
      menuItem = this.menu[i];

      if (menuItem.sub_areas.length > 0) {
        for (let j = 0; j < menuItem.sub_areas.length; j++) {
          subMenuItem = menuItem.sub_areas[j];

          for (let k = 0; k < subMenuItem.questions.length; k++) {

            question = subMenuItem.questions[k];

            if (k === 0) {
              firstFoundQuestion = question;
            }

            if (question.id === id) {
              return {question, subMenuItem, menuItem};
            }
          }
        }
      } else {
        for (let k = 0; k < menuItem.questions.length; k++) {
          question = menuItem.questions[k];

          if (k === 0) {
            firstFoundQuestion = question;
          }

          if (question.id === id) {
            return {question, menuItem};
          }
        }
      }
    }

    return {question: firstFoundQuestion, subMenuItem, menuItem};
  }
}
