import {Component, OnInit, OnDestroy, ChangeDetectorRef} from '@angular/core';
import {AppStateService} from '../app-state.service';
import {FormControl} from '@angular/forms';
import {Subscription} from 'rxjs/index';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-questions-menu',
  templateUrl: './questions-menu.component.html',
  styleUrls: ['./questions-menu.component.css']
})
export class QuestionsMenuComponent implements OnInit, OnDestroy {
  menu: any[];
  expandedMode: boolean = false;
  filterFormControl = new FormControl();
  private filterFormControlSub: Subscription;
  private filtering: boolean = false;
  private debounceTime: 1000;

  constructor(private appStateService: AppStateService, private cdRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.menu = this.appStateService.getMenuItems();
    let questionId = this.appStateService.getPreSelectedQuestionId();
    this.appStateService.setActiveMenuItem(questionId);
    this.subscribeFilter();
  }

  preventCollapse(e: MouseEvent) {
    e.stopPropagation();
  }

  ngOnDestroy() {
    this.unsubscribeFilter();
  }

  setSelectedQuestion(question) {
    this.appStateService.setSelectedQuestion(question);
  }

  getSelectedQuestion() {
    return this.appStateService.getSelectedQuestion();
  }

  toggleCollapse() {
    if (!this.expandedMode) {
      this.expandedMode = true;
      this.appStateService.expandQuestionsMenu(this.menu, true);
    } else {
      this.expandedMode = false;
      this.appStateService.expandQuestionsMenu(this.menu, false);
      this.appStateService.selectLeftMenuQuestion(this.appStateService.getQuestionById(this.getSelectedQuestion().id));
    }
    this.cdRef.detectChanges();
  }

  clearFilter() {
    this.unsubscribeFilter();
    this.filterFormControl.setValue('');
    this.subscribeFilter();
    this.applyFilterSearch();
  }

  private applyFilterSearch(filterValue?: string) {
    if (filterValue) {
      this.appStateService.filterQuestionsMenu(filterValue).subscribe((filteredMenu: any[]) => {
        this.filtering = false;
        this.expandedMode = true;
        this.menu = filteredMenu;
        this.appStateService.setActiveMenuItem(this.getSelectedQuestion().id);
        this.cdRef.detectChanges();
        console.log('filterQuestionsMenu');
      });
    } else {
      this.expandedMode = false;
      this.menu = this.appStateService.getMenuItems();
      this.cdRef.detectChanges();
    }
  }

  private subscribeFilter() {
    this.filterFormControlSub = this.filterFormControl.valueChanges
      .map(value => { this.filtering = true; return value })
      .debounceTime(this.debounceTime)
      .subscribe(this.applyFilterSearch.bind(this));
  }

  private unsubscribeFilter() {
    this.filterFormControlSub.unsubscribe();
  }

}
