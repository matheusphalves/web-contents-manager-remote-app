import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-repeatable-button',
  templateUrl: './repeatable-button.component.html',
  styleUrls: ['./repeatable-button.component.scss']
})
export class RepeatableButtonComponent {

  @Input() isEnabled: boolean = false;

  @Output() addInput = new EventEmitter<void>();

  @Output() removeInput = new EventEmitter<void>();


  onAddInput(){
    this.addInput.emit();
  }

  onRemoveInput(){
    this.removeInput.emit();
  }

}
