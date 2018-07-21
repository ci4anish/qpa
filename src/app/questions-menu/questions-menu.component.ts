import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-questions-menu',
  templateUrl: './questions-menu.component.html',
  styleUrls: ['./questions-menu.component.css']
})
export class QuestionsMenuComponent implements OnInit {
  panelOpenState = false;
  menu: any[];

  constructor() { }

  ngOnInit() {
    this.menu = (<any>window).sidebar_json;
    console.log(this.menu);
  }

}
