import { Component, OnInit } from '@angular/core';
import {QuestionsMenuService} from '../questions-menu.service';

@Component({
  selector: 'app-questions-menu',
  templateUrl: './questions-menu.component.html',
  styleUrls: ['./questions-menu.component.css']
})
export class QuestionsMenuComponent implements OnInit {
  panelOpenState = false;
  menu: any[];

  constructor(private questionsMenuService: QuestionsMenuService) { }

  ngOnInit() {
    this.menu = this.questionsMenuService.getMenuItems();
    console.log(this.menu);
  }

}
