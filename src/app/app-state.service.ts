import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {

  private menu;
  private endpointUrl: string = 'https://qpa.codesource.com.au/api/web.protocoldocumentanswerset/';

  constructor(private http: HttpClient) {
    this.menu = (<any>window).sidebar_json.slice();
  }

  getMenuItems(): any[] {
    return this.menu;
  }

  getPreSelectedQuestion() {
    const lastEditedId = (<any>window).pdv_id;

    if(!lastEditedId){
      return undefined;
    }

    let menuItem, subMenuItem, question;

    for (let i = 0; i < this.menu.length; i++) {
      menuItem = this.menu[i];

      if(menuItem.sub_areas){
        for (let j = 0; j < menuItem.sub_areas.length; j++) {
          subMenuItem = menuItem.sub_areas[j];

          for (let k = 0; k < subMenuItem.questions.length; k++) {
            question = subMenuItem.questions[k];

            if(question.id === lastEditedId){
              return question;
            }
          }
        }
      } else {
        for (let k = 0; k < menuItem.questions.length; k++) {
          question = menuItem.questions[k];

          if(question.id === lastEditedId){
            return question;
          }
        }
      }
    }
  }

  filterLeftMenu(filterValue: string): any[] {
    //TODO replace this with actual filter
    return this.getMenuItems();
  }

  fetchAnswer(answerId: number){
    // return this.http.get(this.endpointUrl + answerId);
    var answer = {
      "id": 1,
      "question": 98,
      "is_complete": false,
      "assessment": 1,
      "is_current": false,
      "_order": 0,
      "checklist_items": [
        1
      ],
      "archived": false,
      "all_checklist_items": [
        {
          "id": 1,
          "question": 98,
          "name": "Urgent & non urgent medical needs"
        },
        {
          "id": 2,
          "question": 98,
          "name": "Complex and planned chronic care"
        },
        {
          "id": 3,
          "question": 98,
          "name": "Preventative health needs"
        }
      ],
      "observation": "m",
      "compliance_option": 1,
      "not_applicable": false,
      "all_compliance_options": [
        {
          "id": 1,
          "name": "Met"
        },
        {
          "id": 2,
          "name": "Not Yet Met"
        },
        {
          "id": 3,
          "name": "Not Applicable"
        }
      ],
      "question_code": "GP 1.1 ▶︎ B",
      "question_text": "Our practice has a flexible appointments system to accommodate patients with a range of needs including",
      "indicator_text": "Our practice has a triage system"
    };

    return of(answer);

    // return this.http.get(this.endpointUrl + answerId);
  }
}
