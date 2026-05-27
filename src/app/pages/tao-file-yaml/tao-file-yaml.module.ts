import { NgModule } from '@angular/core';

import { MatRippleModule } from '@angular/material/core';
import { NbButtonModule, NbCardModule, NbDialogModule, NbIconModule, NbInputModule, NbOptionModule, NbSelectModule, NbTabsetModule, NbToggleModule, NbTooltipModule } from '@nebular/theme';
import { TaoFileYamlComponent } from './tao-file-yaml.component';
import { ModalComponent } from './modal/modal.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmPopupComponent } from './confirm-popup/confirm-popup.component';
import { QuickGenerateComponent } from './quick-generate/quick-generate.component';
import { TabFilesComponent } from './tab-files/tab-files.component';

@NgModule({
  imports: [
    CommonModule,
    NbButtonModule,
    MatRippleModule,
    NbCardModule,
    NbInputModule,
    NbSelectModule,
    NbOptionModule,
    NbToggleModule,
    NbIconModule,
    NbTabsetModule,
    NbTooltipModule,
    NbDialogModule.forChild(),
    FormsModule
  ],
  declarations: [
    TaoFileYamlComponent,
    ModalComponent,
    ConfirmPopupComponent,
    QuickGenerateComponent,
    TabFilesComponent
  ],
})
export class TaoFileYamlModule { }
