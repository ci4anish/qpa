import { Component, OnInit } from '@angular/core';
import {AppStateService} from '../app-state.service';

@Component({
  selector: 'app-submit-toolbar',
  templateUrl: './submit-toolbar.component.html',
  styleUrls: ['./submit-toolbar.component.css']
})
export class SubmitToolbarComponent implements OnInit {
  questions_complete: number;
  questions_remaining: number;

  constructor(public appStateService: AppStateService) { }

  ngOnInit() {
  }

}
