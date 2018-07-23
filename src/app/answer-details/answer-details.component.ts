import {Component, OnInit, OnDestroy, ViewChild, ElementRef} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AppStateService} from '../app-state.service'
import {FormBuilder, FormGroup} from "@angular/forms"
import {Subscription} from 'rxjs/index';
import 'rxjs/add/operator/debounceTime';

export class Tooltip {
  body: HTMLElement;
  tooltip: any;
  private shown: boolean;

  constructor(private attachToElement: HTMLElement, appendToElement: HTMLElement, private tooltipText: string, private placement: string) {
    this.createBody();
    appendToElement.appendChild(this.body);
    this.tooltip = new (<any>window).Popper(attachToElement, this.body, {
      placement: this.placement,
    });
    this.checkClickOutside = this.checkClickOutside.bind(this);
  }

  createBody() {
    let popoverColor = '#4d76c9';
    this.body = document.createElement('DIV');
    let triangleWrapper = document.createElement('DIV');
    let triangleEl = document.createElement('DIV');

    let contentEl = document.createElement('DIV');
    contentEl.innerText = this.tooltipText;
    triangleWrapper.style.justifyContent = this.placement === 'bottom' ? 'center' : 'flex-end';
    contentEl.classList.add('indicator-popup');
    triangleEl.classList.add('indicator-popup-triangle');
    triangleWrapper.classList.add('indicator-popup-triangle-wrapper');
    triangleWrapper.appendChild(triangleEl);
    this.body.appendChild(triangleWrapper);
    this.body.appendChild(contentEl);
    this.shown = true;
  }

  show() {
    this.body.style.display = 'block';
    this.tooltip.update();
    this.shown = true;
    document.addEventListener('click', this.checkClickOutside);
  }

  hide() {
    this.body.style.display = 'none';
    this.shown = false;
    document.removeEventListener('click', this.checkClickOutside)
  }

  isShown(): boolean {
    return this.shown;
  }

  destroy() {
    document.removeEventListener('click', this.checkClickOutside)
  }

  private checkClickOutside(e: MouseEvent) {

    let element = <HTMLElement>e.target;

    while (element.parentElement && element !== (<any>window).body) {
      if (element === this.attachToElement || element === this.body) {
        return;
      }

      element = element.parentElement;
    }

    this.hide();
  }
}

@Component({
  selector: 'app-answer-details',
  templateUrl: './answer-details.component.html',
  styleUrls: ['./answer-details.component.css']
})

export class AnswerDetailsComponent implements OnInit, OnDestroy {
  @ViewChild('tooltipButton') tooltipButton: ElementRef;
  answer: any;
  checklistItemsForm: FormGroup;
  complianceOptionForm: FormGroup;
  observationFrom: FormGroup;
  indicatorTooltip: Tooltip;
  private checklistItemsFormSub: Subscription;
  private complianceOptionFormSub: Subscription;
  private observationFromSub: Subscription;

  constructor(private route: ActivatedRoute, private router: Router, private elementRef: ElementRef,
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
    this.appStateService.fetchAnswer(+this.route.snapshot.paramMap.get('answerId')).subscribe((answer: any) => {
      this.answer = answer;
      if (answer.all_checklist_items && answer.all_checklist_items.length > 0) {
        this.checklistItemsForm.setControl('checklist_items', this.buildFormArray(answer.all_checklist_items, answer.checklist_items));
      }
      if (answer.compliance_option) {
        this.complianceOptionForm.setValue({
          compliance_option: answer.compliance_option.toString(),
        });
      }
      if (answer.observation) {
        this.observationFrom.setValue({
          observation: answer.observation
        });
      }

      if (answer.indicator_text) {
        this.createIndicatorTooltip();
      }

      this.checklistItemsFormSub = this.checklistItemsForm.valueChanges.subscribe(this.onChecklistChange.bind(this));
      this.complianceOptionFormSub = this.complianceOptionForm.valueChanges.subscribe(this.onComplianceOptionChange.bind(this));
      this.observationFromSub = this.observationFrom.valueChanges.debounceTime(1000).subscribe(this.onObservationChange.bind(this));
    })
  }

  markAsComplete() {
    this.appStateService.markAnswerAsComplete(this.answer.id).subscribe((response: any) => {
      this.appStateService.setActiveMenuItem(response.next_question_id);
      this.appStateService.setCompleteQuestionsCount(response.num_complete);
      this.appStateService.setRemainingQuestionsCount(response.num_remaining);
      let {question} = this.appStateService.getQuestionById(this.answer.question);
      question.is_complete = true;
    });
  }

  ngOnDestroy() {
    this.checklistItemsFormSub.unsubscribe();
    this.complianceOptionFormSub.unsubscribe();
    this.observationFromSub.unsubscribe();
    this.indicatorTooltip.destroy();
  }

  toggleTooltip() {
    this.indicatorTooltip.isShown() ? this.indicatorTooltip.hide() : this.indicatorTooltip.show();
  }

  private buildFormArray(array: any[], selected: any[]) {
    const arr = array.map(item => {
      return this.formBuilder.control(selected.indexOf(item.id) !== -1);
    });
    return this.formBuilder.array(arr);
  }

  private onChecklistChange(newValue: { checklist_items: any[] }) {
    let newSelected = {
      checklist_items: []
    };
    newValue.checklist_items.forEach((isSelectedItem, index) => {
      if (isSelectedItem) {
        newSelected.checklist_items.push(this.answer.all_checklist_items[index].id);
      }
    });
    this.updateAnswer(newSelected);
  }

  private onObservationChange(newValue: { observation: string }) {
    this.updateAnswer(newValue);
  }

  private onComplianceOptionChange(newValue: { compliance_option: any }) {
    newValue.compliance_option = parseInt(newValue.compliance_option, 10);
    this.updateAnswer(newValue);
  }

  private updateAnswer(newValue: any) {
    this.appStateService.updateAnswer(this.answer.id, newValue).subscribe();
  }

  private createIndicatorTooltip() {
    setTimeout(() => {
      this.indicatorTooltip = new Tooltip(this.tooltipButton.nativeElement, this.elementRef.nativeElement,
        this.answer.indicator_text, !this.answer.is_complete ? 'bottom' : 'bottom-end');
      this.indicatorTooltip.hide();
    })
  }
}
