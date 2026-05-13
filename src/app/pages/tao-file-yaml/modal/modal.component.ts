import { Component } from '@angular/core';
import { NbWindowRef } from '@nebular/theme';

@Component({
  template: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  constructor(public windowRef: NbWindowRef) {}

  close() {
    this.windowRef.close();
  }
}
