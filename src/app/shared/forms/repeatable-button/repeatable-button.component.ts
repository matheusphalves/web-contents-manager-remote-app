import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-repeatable-button',
  templateUrl: './repeatable-button.component.html',
  styleUrls: ['./repeatable-button.component.scss']
})
export class RepeatableButtonComponent {

  @Input() isRepeatable: boolean = false;

  @Input() isImage: boolean = false;

  @Input() isRequired: boolean = false;

  @Input() label: any;

  @Output() addInput = new EventEmitter<void>();

  @Output() removeInput = new EventEmitter<void>();

  @Output() openImage = new EventEmitter<void>();

  @Output() clearImageInput = new EventEmitter<void>();

  onAddInput(){
    this.addInput.emit();
  }

  onRemoveInput(){
    this.removeInput.emit();
  }

  onOpenImage(){
    this.openImage.emit();
  }

  onClearImageInput(){
    this.clearImageInput.emit();
  }
}
