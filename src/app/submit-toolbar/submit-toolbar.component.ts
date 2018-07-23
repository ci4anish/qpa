import {Component, OnInit} from '@angular/core';
import {AppStateService} from '../app-state.service';

@Component({
  selector: 'app-submit-toolbar',
  templateUrl: './submit-toolbar.component.html',
  styleUrls: ['./submit-toolbar.component.css']
})
export class SubmitToolbarComponent implements OnInit {
  submit_url: string;

  constructor(public appStateService: AppStateService) {
  }

  ngOnInit() {
    this.submit_url = this.appStateService.getSubmitUrl();
  }

}
