import { NgModule } from '@angular/core';

import { MatRippleModule } from '@angular/material/core';
import { NbButtonModule, NbCardModule, NbInputModule, NbOptionModule, NbSelectModule } from '@nebular/theme';
import { TaoFileYamlComponent } from './tao-file-yaml.component';
import { ModalComponent } from './modal/modal.component';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    NbButtonModule,
    MatRippleModule,
    NbCardModule,
    NbInputModule,
    NbSelectModule,
    NbOptionModule,
    CommonModule
  ],
  declarations: [
    TaoFileYamlComponent,
    ModalComponent
  ],
})
export class TaoFileYamlModule { }
