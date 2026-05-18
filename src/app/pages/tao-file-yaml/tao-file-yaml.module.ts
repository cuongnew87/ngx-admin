import { NgModule } from '@angular/core';

import { MatRippleModule } from '@angular/material/core';
import { NbButtonModule, NbCardModule, NbIconModule, NbInputModule, NbOptionModule, NbSelectModule, NbTabsetModule, NbToggleModule } from '@nebular/theme';
import { TaoFileYamlComponent } from './tao-file-yaml.component';
import { ModalComponent } from './modal/modal.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
    FormsModule
  ],
  declarations: [
    TaoFileYamlComponent,
    ModalComponent
  ],
})
export class TaoFileYamlModule { }
