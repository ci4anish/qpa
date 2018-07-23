import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  private submit_url: string;
  private menu;
  private selectedQuestion;
  private assessmentCode: string;
  private questions_complete: number;
  private questions_remaining: number;
  private endpointUrl: string = 'https://qpa.codesource.com.au/api/web.protocoldocumentanswerset/';

  constructor(private http: HttpClient, private router: Router) {
    this.menu = (<any>window).sidebar_json.slice();
    this.assessmentCode = (<any>window).assessment_code;
    this.questions_complete = (<any>window).num_questions_complete;
    this.questions_remaining = (<any>window).num_questions_remaining;
    this.submit_url = (<any>window).submit_url;
  }

  getSubmitUrl(): string {
    return this.submit_url;
  }

  getCompleteQuestionsCount(): number {
    return this.questions_complete;
  }

  getRemainingQuestionsCount(): number {
    return this.questions_remaining;
  }

  setCompleteQuestionsCount(questions_complete) {
    this.questions_complete = questions_complete;
  }

  setRemainingQuestionsCount(questions_remaining) {
    this.questions_remaining = questions_remaining;
  }

  canSubmitQuestionnaire(): boolean {
    return this.questions_remaining === 0;
  }

  getMenuItems(): any[] {
    return this.menu;
  }

  getPreSelectedQuestionId(): number {
    return (<any>window).current_question_id;
  }

  getSelectedQuestion() {
    return this.selectedQuestion;
  }

  setSelectedQuestion(selectedQuestion) {
    this.selectedQuestion = selectedQuestion;
  }

  filterLeftMenu(filterValue: string) {
    return this.http.get(`https://qpa.codesource.com.au/practice/assessment/${this.assessmentCode}/questions/?q=${filterValue}`)
      .map((filteredMenu: any[]) => {
        filteredMenu.forEach(item => {
          item.expanded = true;

          if (item.sub_areas.length > 0) {
            item.sub_areas.forEach(subArea => {
              subArea.expanded = true;
            });
          }
        });

        return filteredMenu;
      });
  }

  selectLeftMenuQuestion(selected) {
    if (selected.subMenuItem) {
      selected.subMenuItem.expanded = true;
    }
    selected.menuItem.expanded = true;
  }

  fetchAnswer(answerId: number) {
    return this.http.get(this.endpointUrl + answerId + '/');
  }

  updateAnswer(answerId: number, newValue: any) {
    return this.http.patch(this.endpointUrl + answerId + '/', newValue);
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
