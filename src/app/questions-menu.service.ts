import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QuestionsMenuService {

  constructor() {
  }

  getMenuItems(): any[] {
    return (<any>window).sidebar_json;
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
          subMenuItem = menuItem.sub_areas[i];

          for (let j = 0; j < subMenuItem.questions.length; j++) {
            question = subMenuItem.questions[i];

            if(question.id = lastEditedId){
              return question;
            }
          }
        }
      } else {
        for (let j = 0; j < menuItem.questions.length; j++) {
          question = menuItem.questions[i];

          if(question.id = lastEditedId){
            return question;
          }
        }
      }
    }
  }
}
