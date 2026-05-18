import { Component } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  templateUrl: './confirm-popup.component.html',
  styleUrls: ['./confirm-popup.component.scss'],
})
export class ConfirmPopupComponent {

  constructor(
    protected dialogRef: NbDialogRef<ConfirmPopupComponent>
  ) {}

  confirm(): void {

    this.dialogRef.close(true);
  }

  cancel(): void {

    this.dialogRef.close(false);
  }
}