import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-submit-toolbar',
  templateUrl: './submit-toolbar.component.html',
  styleUrls: ['./submit-toolbar.component.css']
})
export class SubmitToolbarComponent implements OnInit {
  questions_complete: number;
  questions_remaining: number;

  constructor() { }

  ngOnInit() {
    this.questions_complete = (<any>window).num_questions_complete;
    this.questions_remaining = (<any>window).num_questions_remaining;
  }

}
