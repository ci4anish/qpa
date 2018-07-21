import {Component, OnInit, OnDestroy} from '@angular/core';
import {QuestionsMenuService} from '../questions-menu.service';
import {FormControl} from '@angular/forms';
import {Subscription} from 'rxjs/index';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/observable/fromEvent';

@Component({
  selector: 'app-questions-menu',
  templateUrl: './questions-menu.component.html',
  styleUrls: ['./questions-menu.component.css']
})
export class QuestionsMenuComponent implements OnInit, OnDestroy {
  menu: any[];
  filterFormControl = new FormControl();
  private filterFormControlSub: Subscription;

  constructor(private questionsMenuService: QuestionsMenuService) {
  }

  ngOnInit() {
    this.menu = this.questionsMenuService.getMenuItems();
    this.subscribeFilter();
  }

  ngOnDestroy() {
    this.unsubscribeFilter();
  }

  clearFilter() {
    this.unsubscribeFilter();
    this.filterFormControl.setValue('');
    this.subscribeFilter();
    this.applyFilterSearch();
  }

  private applyFilterSearch(filterValue?: string) {
    if (filterValue) {
      this.menu = this.questionsMenuService.filterLeftMenu(filterValue);
    } else {
      this.menu = this.questionsMenuService.getMenuItems();
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
