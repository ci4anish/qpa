import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {

  private menu;
  private assessmentCode: string;
  private endpointUrl: string = 'https://qpa.codesource.com.au/api/web.protocoldocumentanswerset/';

  constructor(private http: HttpClient) {
    this.menu = (<any>window).sidebar_json.slice();
    this.assessmentCode = (<any>window).assessment_code;
  }

  getMenuItems(): any[] {
    return this.menu;
  }

  getPreSelectedQuestion() {
    const lastEditedId = (<any>window).current_question_id;

    if (!lastEditedId) {
      return undefined;
    }

    let menuItem, subMenuItem, question, firstFoundQuestion;

    for (let i = 0; i < this.menu.length; i++) {
      menuItem = this.menu[i];

      if (menuItem.sub_areas) {
        for (let j = 0; j < menuItem.sub_areas.length; j++) {
          subMenuItem = menuItem.sub_areas[j];

          for (let k = 0; k < subMenuItem.questions.length; k++) {

            question = subMenuItem.questions[k];

            if (k === 0) {
              firstFoundQuestion = question;
            }

            if (question.id === lastEditedId) {
              return question;
            }
          }
        }
      } else {
        //TODO move to function
        for (let k = 0; k < menuItem.questions.length; k++) {
          question = menuItem.questions[k];

          if (k === 0) {
            firstFoundQuestion = question;
          }

          if (question.id === lastEditedId) {
            return question;
          }
        }
      }
    }

    return firstFoundQuestion;
  }

  filterLeftMenu(filterValue: string) {
    return this.http.get(`https://qpa.codesource.com.au/practice/assessment/${this.assessmentCode}/questions/?q=${filterValue}`);
  }

  fetchAnswer(answerId: number) {
    return this.http.get(this.endpointUrl + 27);
  }

  updateAnswer(answerId: number, newValue: any) {
    return this.http.patch(this.endpointUrl + answerId, newValue);
  }

  markAnswerAsComplete(answerId: number) {
    return this.http.put(this.endpointUrl + answerId + '/mark_complete/', undefined);
  }

  private getQuestionById(questions: any[], id: number) {
    let firstFoundQuestion, question;
    for (let k = 0; k < questions.length; k++) {
      question = questions[k];

      if (k === 0) {
        firstFoundQuestion = question;
      }

      if (question.id === id) {
        return question;
      }
    }

    return firstFoundQuestion;
  }
}
