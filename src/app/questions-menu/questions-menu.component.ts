import {Component, OnInit, OnDestroy} from '@angular/core';
import {AppStateService} from '../app-state.service';
import {FormControl} from '@angular/forms';
import {Subscription} from 'rxjs/index';
import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'app-questions-menu',
  templateUrl: './questions-menu.component.html',
  styleUrls: ['./questions-menu.component.css']
})
export class QuestionsMenuComponent implements OnInit, OnDestroy {
  menu: any[];
  filterFormControl = new FormControl();
  private filterFormControlSub: Subscription;

  constructor(private appStateService: AppStateService) {
  }

  ngOnInit() {
    this.menu = this.appStateService.getMenuItems();
    let questionId = this.appStateService.getPreSelectedQuestionId();
    this.appStateService.setActiveMenuItem(questionId);
    this.subscribeFilter();
  }

  ngOnDestroy() {
    this.unsubscribeFilter();
  }

  setSelectedQuestion(question){
    this.appStateService.setSelectedQuestion(question);
  }

  getSelectedQuestion(){
    return this.appStateService.getSelectedQuestion();
  }

  clearFilter() {
    this.unsubscribeFilter();
    this.filterFormControl.setValue('');
    this.subscribeFilter();
    this.applyFilterSearch();
  }

  private applyFilterSearch(filterValue?: string) {
    if (filterValue) {
      this.appStateService.filterLeftMenu(filterValue).subscribe((filteredMenu: any[]) => {
        this.menu = filteredMenu;
      });
    } else {
      this.menu = this.appStateService.getMenuItems();
    }
  }

  private subscribeFilter() {
    this.filterFormControlSub = this.filterFormControl.valueChanges
      .debounceTime(1000)
      .subscribe(this.applyFilterSearch.bind(this));
  }

  private unsubscribeFilter() {
    this.filterFormControlSub.unsubscribe();
  }

}
