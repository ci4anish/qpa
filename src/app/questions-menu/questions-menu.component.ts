import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { AppStateService, CompletionState } from '../app-state.service';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';
import { Router } from '@angular/router';

interface FilterItem {
  text: string;
  state: CompletionState
  colorClass: string;
}

@Component({
  selector: 'app-questions-menu',
  templateUrl: './questions-menu.component.html',
  styleUrls: ['./questions-menu.component.css']
})
export class QuestionsMenuComponent implements OnInit, OnDestroy {
  filterMenuItems: FilterItem[] = [
    {
      text: 'All',
      state: CompletionState.all,
      colorClass: 'grey'
    },
    {
      text: 'Completed',
      state: CompletionState.completed,
      colorClass: 'green'
    },
    {
      text: 'Incompleted',
      state: CompletionState.incompleted,
      colorClass: 'red'
    }
  ];
  activeFilterItem: FilterItem;
  expandedMode: boolean = false;
  filterFormControl = new FormControl();
  filtering: boolean = false;
  private filterFormControlSub: Subscription;
  private leftMenuChangesSubscription: Subscription;
  private filterValue: string = '';
  private debounceTime: number = 1000;

  constructor(public appStateService: AppStateService,
              private cdRef: ChangeDetectorRef,
              private router: Router) {
  }

  ngOnInit() {
    let questionId = this.appStateService.getPreSelectedQuestionId();
    this.appStateService.setActiveMenuItem(questionId);
    this.subscribeFilter();
    this.activeFilterItem = this.filterMenuItems[0];
    this.leftMenuChangesSubscription = this.appStateService.leftMenuChangeEmitter.subscribe(() => {
      this.cdRef.detectChanges();
    })
  }

  setActiveFilterItem(item: FilterItem) {
    this.filtering = true;
    this.activeFilterItem = item;
    this.applyFilterSearch(this.filterValue);
  }

  preventCollapse(e: MouseEvent) {
    e.stopPropagation();
  }

  ngOnDestroy() {
    this.unsubscribeFilter();
    this.leftMenuChangesSubscription.unsubscribe();
  }

  setSelectedQuestion(question) {
    this.appStateService.setSelectedQuestion(question);
  }

  getSelectedQuestion() {
    return this.appStateService.getSelectedQuestion();
  }

  toggleCollapse() {
    if (!this.expandedMode) {
      this.expendMenu();
    } else {
      this.collapseMenu();
    }
    this.cdRef.detectChanges();
  }

  expendMenu() {
    this.expandedMode = true;
    this.appStateService.expandQuestionsMenu(true);
  }

  collapseMenu() {
    this.expandedMode = false;
    this.appStateService.expandQuestionsMenu(false);
    this.appStateService.selectLeftMenuQuestion(this.appStateService.getQuestionInfoById(this.getSelectedQuestion().id));
  }

  toggleApplicable(e: MouseEvent, notApplicable: boolean, group: any) {
    e.stopPropagation();
    this.appStateService.toggleApplicableMode(notApplicable, group.id).subscribe((response) => {
      this.appStateService.updateApplicableState(!notApplicable, group);
      this.cdRef.detectChanges();
      this.router.navigate([`/answer/${this.getSelectedQuestion().answer_id}`])
    });
  }

  clearFilter() {
    this.filtering = true;
    this.unsubscribeFilter();
    this.filterFormControl.setValue('');
    this.filterValue = '';
    this.subscribeFilter();
    this.applyFilterSearch(this.filterValue);
  }

  private applyFilterSearch(filterValue?: string) {
    this.appStateService.filterQuestionsMenu(filterValue, this.activeFilterItem.state).subscribe((filteredMenu: any[]) => {
      this.filtering = false;

      if (filteredMenu.length > 0) {
        if (this.appStateService.filterState.isFilterApplied()) {
          this.appStateService.setFirstMenuItemActive();
          this.expendMenu();
        } else {
          this.router.navigate([`/answer/${this.getSelectedQuestion().answer_id}`]);
          this.appStateService.selectLeftMenuQuestion(this.appStateService.getQuestionInfoById(this.getSelectedQuestion().id));
        }
      } else {
        this.router.navigate([`/answer`]);
      }
    });
  }

  private subscribeFilter() {
    this.filterFormControlSub = this.filterFormControl.valueChanges.pipe(debounceTime(this.debounceTime), map(value => {
      this.filtering = true;
      this.filterValue = value;
      return value
    }))
      .subscribe(this.applyFilterSearch.bind(this));
  }

  private unsubscribeFilter() {
    this.filterFormControlSub.unsubscribe();
  }

}
