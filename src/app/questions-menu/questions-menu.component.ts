import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { AppStateService } from '../app-state.service';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/index';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';

interface FilterItem {
  text: string;
  iconClass: string;
  filter: () => void;
}

@Component({
  selector: 'app-questions-menu',
  templateUrl: './questions-menu.component.html',
  styleUrls: ['./questions-menu.component.css']
})
export class QuestionsMenuComponent implements OnInit, OnDestroy {
  displayedMenu: any[];
  menu: any[];
  menuItemsToFilter: Map = new Map();
  filterMenuItems: FilterItem[] = [
    {
      text: 'All',
      iconClass: 'fa-filter',
      filter: this.filterByAll.bind(this)
    },
    {
      text: 'Completed',
      iconClass: 'fa-check',
      filter: this.filterByCompleted.bind(this)
    },
    {
      text: 'Incompleted',
      iconClass: 'fa-edit',
      filter: this.filterByIncompleted.bind(this)
    }
  ];
  activeFilterItem: FilterItem;
  expandedMode: boolean = false;
  filterFormControl = new FormControl();
  private filterFormControlSub: Subscription;
  private filtering: boolean = false;
  private filterValue: string;
  private debounceTime: 1000;

  constructor(private appStateService: AppStateService,
              private cdRef: ChangeDetectorRef,
              private router: Router) {
  }

  ngOnInit() {
    this.menu = this.appStateService.getMenuItems();
    this.displayedMenu = this.menu.slice();
    let questionId = this.appStateService.getPreSelectedQuestionId();
    this.appStateService.setActiveMenuItem(questionId);
    this.subscribeFilter();
    this.activeFilterItem = this.filterMenuItems[0];
  }

  setActiveFilterItem(item: FilterItem) {
    this.activeFilterItem = item;
    if (this.filterValue) {
      this.applyFilterSearch(this.filterValue);
    } else {
      item.filter();
    }
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
      this.appStateService.expandQuestionsMenu(this.displayedMenu, true);
    } else {
      this.expandedMode = false;
      this.appStateService.expandQuestionsMenu(this.displayedMenu, false);
      this.appStateService.selectLeftMenuQuestion(this.appStateService.getQuestionById(this.getSelectedQuestion().id));
    }
    this.cdRef.detectChanges();
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
    this.unsubscribeFilter();
    this.filterFormControl.setValue('');
    this.filterValue = '';
    this.subscribeFilter();
    this.applyFilterSearch();
  }

  private filterByAll() {
    this.displayedMenu = this.menu.slice();
  }

  private filterQuestionsFromCondition(checkConditionCb) {
    this.menuItemsToFilter.clear();
    this.displayedMenu = JSON.parse(JSON.stringify(this.menu));
    this.appStateService.forEachMenuQuestion(this.displayedMenu, (question, menuItem, parentItem) => {
      // if (question.is_complete || question.not_applicable) {
      if (checkConditionCb(question)) {
        return;
      }

      if (this.menuItemsToFilter.has(menuItem)) {
        let questionsToRemove = this.menuItemsToFilter.get(menuItem).questionsToRemove;
        questionsToRemove.push(question);
      } else {
        this.menuItemsToFilter.set(menuItem, {questionsToRemove: [question], parentItem: parentItem});
      }
    });
    this.menuItemsToFilter.forEach((value, menuItem) => {
      value.questionsToRemove.forEach(question => {
        menuItem.questions.splice(menuItem.questions.indexOf(question), 1);
      });
      if (menuItem.questions.length === 0 && value.parentItem) {
        value.parentItem.sub_areas.splice(value.parentItem.sub_areas.indexOf(menuItem), 1);
      }
    });

    this.displayedMenu = this.displayedMenu.filter(menuItem => {
      return (menuItem.sub_areas && menuItem.sub_areas.length > 0) || (menuItem.questions && menuItem.questions.length > 0);
    });
  }

  private filterByCompleted() {
    this.filterQuestionsFromCondition(question => question.is_complete || question.not_applicable);
  }

  private filterByIncompleted() {
    this.filterQuestionsFromCondition(question => !question.is_complete && !question.not_applicable);
  }

  private applyFilterSearch(filterValue?: string) {
    if (filterValue) {
      this.appStateService.filterQuestionsMenu(filterValue, this.activeFilterItem.text.toLowerCase()).subscribe((filteredMenu: any[]) => {
        this.filtering = false;
        this.expandedMode = true;
        this.menu = filteredMenu;
        this.displayedMenu = this.menu;
        this.appStateService.setActiveMenuItem(this.getSelectedQuestion().id);
        this.cdRef.detectChanges();
      });
    } else {
      this.expandedMode = false;
      this.menu = this.appStateService.getMenuItems();
      this.displayedMenu = this.menu;
      this.cdRef.detectChanges();
    }
  }

  private subscribeFilter() {
    this.filterFormControlSub = this.filterFormControl.valueChanges
      .map(value => {
        this.filtering = true;
        this.filterValue = value;
        return value
      })
      .debounceTime(this.debounceTime)
      .subscribe(this.applyFilterSearch.bind(this));
  }

  private unsubscribeFilter() {
    this.filterFormControlSub.unsubscribe();
  }

}
