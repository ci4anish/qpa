import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QuestionsMenuService {

  constructor() {
  }

  getMenuItems(): any[] {
    return (<any>window).sidebar_json.slice();
  }

  getPreSelectedQuestion() {
    const lastEditedId = (<any>window).pdv_id;

    if(!lastEditedId){
      return undefined;
    }

    let menu = this.getMenuItems();
    let menuItem, subMenuItem, question;

    for (let i = 0; i < menu.length; i++) {
      menuItem = menu[i];

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
}
