import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AppStateService} from '../app-state.service'
import {FormBuilder, FormGroup} from "@angular/forms"
import {Subscription} from 'rxjs/index';
import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'app-answer-details',
  templateUrl: './answer-details.component.html',
  styleUrls: ['./answer-details.component.css']
})
export class AnswerDetailsComponent implements OnInit, OnDestroy {

  answer: any;
  checklistItemsForm: FormGroup;
  complianceOptionForm: FormGroup;
  observationFrom: FormGroup;
  private checklistItemsFormSub: Subscription;
  private complianceOptionFormSub: Subscription;
  private observationFromSub: Subscription;

  constructor(private route: ActivatedRoute, private router: Router,
              private appStateService: AppStateService, private formBuilder: FormBuilder) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    }
    this.checklistItemsForm = this.formBuilder.group({
      checklist_items: this.buildFormArray([], [])
    });
    this.complianceOptionForm = this.formBuilder.group({
      compliance_option: [''],
    });
    this.observationFrom = this.formBuilder.group({
      observation: ['']
    });
  }

  get checklistItems() {
    return this.checklistItemsForm.get('checklist_items');
  };

  ngOnInit() {
    this.appStateService.fetchAnswer(+this.route.snapshot.paramMap.get('answerId')).subscribe(answer => {
      console.log('answer', answer);
      this.answer = answer;
      this.complianceOptionForm.setValue({
        compliance_option: answer.compliance_option.toString(),
      });
      this.observationFrom.setValue({
        observation: answer.observation
      });
      this.checklistItemsForm.setControl('checklist_items', this.buildFormArray(answer.all_checklist_items, answer.checklist_items));
      this.checklistItemsFormSub = this.checklistItemsForm.valueChanges.subscribe(this.onChecklistChange.bind(this));
      this.complianceOptionFormSub = this.complianceOptionForm.valueChanges.subscribe(this.onComplianceOptionChange.bind(this));
      this.observationFromSub = this.observationFrom.valueChanges.debounceTime(1000).subscribe(this.onObservationChange.bind(this));
    })
  }

  ngOnDestroy(){
    this.checklistItemsFormSub.unsubscribe();
    this.complianceOptionFormSub.unsubscribe();
    this.observationFromSub.unsubscribe();
  }

  private buildFormArray(array: any[], selected: any[]) {
    const arr = array.map(item => {
      return this.formBuilder.control(selected.indexOf(item.id) !== -1);
    });
    return this.formBuilder.array(arr);
  }

  private onChecklistChange(newValue: {checklist_items: any[]}){
    let selected = {
      checklist_items: []
    };
    newValue.checklist_items.forEach((isSelectedItem, index) => {
      if(isSelectedItem){
        selected.checklist_items.push(this.answer.all_checklist_items[index].id);
      }
    });
    console.log('onCheckboxChange', selected);
  }

  private onObservationChange(newValue: {observation: string}){
    console.log('onObservationChange', newValue);
  }

  private onComplianceOptionChange(newValue: {compliance_option: any}){
    newValue.compliance_option = parseInt(newValue.compliance_option, 10);
    console.log('onComplianceOptionChange', newValue);
  }
}
