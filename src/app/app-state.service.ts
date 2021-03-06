import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

export enum CompletionState {
  all = 'all',
  completed = 'completed',
  incompleted = 'incompleted',
}

class FilterState {
  constructor(public filterValue: string, public completionState: CompletionState) {
  }

  getQueryParams(): string {
    let queryString = '?';
    if(this.filterValue && this.completionState) {
      queryString += `q=${this.filterValue}&completion=${this.completionState}`;
    }else if(this.filterValue && !this.completionState){
      queryString += `q=${this.filterValue}`;
    }else if(!this.filterValue && this.completionState){
      queryString += `q=&completion=${this.completionState}`;
    }
    return queryString;
  }

  isFilterApplied(): boolean {
    return !!this.filterValue || this.completionState && this.completionState !== CompletionState.all
  }
}

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  leftMenuChangeEmitter: Subject<void> = new Subject();
  public filterState: FilterState = new FilterState('', CompletionState.all);
  private submit_url: string;
  private menu: any[];
  private selectedQuestion;
  private assessmentCode: string;
  private questions_complete: number;
  private questions_remaining: number;
  private endpointUrl: string;
  private answer_set_url: string;
  private questions_search_url: string;
  private applicability_url: string;
  private mark_complete_subroute: string;
  private mark_incomplete_subroute: string;

  constructor(private http: HttpClient, private router: Router) {
    this.endpointUrl = (<any>window).endpointUrl;
    this.answer_set_url = (<any>window).answer_set_url;
    this.menu = (<any>window).sidebar_json.slice();
    this.assessmentCode = (<any>window).assessment_code;
    this.questions_complete = (<any>window).num_questions_complete;
    this.questions_remaining = (<any>window).num_questions_remaining;
    this.submit_url = (<any>window).submit_url;
    this.questions_search_url = (<any>window).questions_search_url;
    this.applicability_url = (<any>window).applicability_url;
    this.mark_complete_subroute = (<any>window).mark_complete_subroute;
    this.mark_incomplete_subroute = (<any>window).mark_incomplete_subroute;
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

  filterQuestionsMenu(filterValue: string, completion: CompletionState) {
    this.filterState = new FilterState(filterValue, completion);

    return this.http.get(`${this.endpointUrl + this.questions_search_url}/${this.filterState.getQueryParams()}`)
      .pipe(map((filteredMenu: any[]) => {
        this.menu = filteredMenu;
        return this.menu;
      }));
  }

  expandQuestionsMenu(expend: boolean) {
    this.getMenuItems().forEach(item => {
      item.expanded = expend;

      if (item.sub_areas.length > 0) {
        item.sub_areas.forEach(subArea => {
          subArea.expanded = expend;
        });
      }
    });
    this.leftMenuChangeEmitter.next();
  }

  selectLeftMenuQuestion(selected) {
    if (selected.subMenuItem) {
      selected.subMenuItem.expanded = true;
    }
    selected.menuItem.expanded = true;
    this.leftMenuChangeEmitter.next();
  }

  fetchAnswer(answerId: number) {
    return this.http.get(this.endpointUrl + this.answer_set_url + answerId + '/');
  }

  updateAnswer(answerId: number, newValue: any) {
    return this.http.patch(this.endpointUrl + this.answer_set_url + answerId + '/', newValue);
  }
  markAnswerAsComplete(answerId: number) {
    const filterValue = this.filterState.isFilterApplied ? this.filterState.getQueryParams() : '';
    return this.http.put(this.endpointUrl + this.answer_set_url + answerId + '/' + this.mark_complete_subroute + '/' + filterValue, undefined);
  }

  markAnswerAsIncomplete(answerId: number) {
    return this.http.put(this.endpointUrl + this.answer_set_url + answerId + '/' + this.mark_incomplete_subroute + '/', undefined);
  }

  setFirstMenuItemActive() {
    const firstItem = this.getMenuItems()[0];
    const hasSubAreas = firstItem.sub_areas && firstItem.sub_areas.length > 0;
    const firstQuestionId = hasSubAreas ? firstItem.sub_areas[0].questions[0].id : firstItem.questions[0].id;
    this.setActiveMenuItem(firstQuestionId);
  }

  setActiveMenuItem(questionId: number) {
    let selected = this.getQuestionInfoById(questionId);
    this.setSelectedQuestion(selected.question);
    this.selectLeftMenuQuestion(selected);
    this.router.navigateByUrl('/answer/' + selected.question.answer_id);
  }

  getQuestionInfoById(id: number) {
    let menuItem, subMenuItem, question, firstFoundQuestion;

    for (let i = 0; i < this.getMenuItems().length; i++) {
      menuItem = this.getMenuItems()[i];

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

  forEachMenuQuestion(menu, cb) {
    let menuItem, subMenuItem, question;

    for (let i = 0; i < menu.length; i++) {
      menuItem = menu[i];

      if (menuItem.sub_areas.length > 0) {
        for (let j = 0; j < menuItem.sub_areas.length; j++) {
          subMenuItem = menuItem.sub_areas[j];

          for (let k = 0; k < subMenuItem.questions.length; k++) {

            question = subMenuItem.questions[k];

            cb(question, subMenuItem, menuItem);
          }
        }
      } else {
        for (let k = 0; k < menuItem.questions.length; k++) {
          question = menuItem.questions[k];

          cb(question, menuItem);
        }
      }
    }
  }

  toggleApplicableMode(notApplicable: boolean, groupId: number) {
    return this.http.put(this.endpointUrl + this.applicability_url,
      {
        'area': groupId,
        'not_applicable': !notApplicable
      }).pipe(
      map((response: any) => {
        this.setCompleteQuestionsCount(response.num_complete);
        this.setRemainingQuestionsCount(response.num_remaining);
        return response;
      })
    );
  }

  updateApplicableState(notApplicable: boolean, group: any) {
    let question, subGrop;

    group.not_applicable = notApplicable;

    if (group.sub_areas.length > 0) {
      for (let j = 0; j < group.sub_areas.length; j++) {
        subGrop = group.sub_areas[j];
        subGrop.not_applicable = notApplicable;
        for (let k = 0; k < subGrop.questions.length; k++) {
          question = subGrop.questions[k];
          question.not_applicable = notApplicable;
        }
      }
    } else {
      for (let k = 0; k < group.questions.length; k++) {
        question = group.questions[k];
        question.not_applicable = notApplicable;
      }
    }
  }
}
