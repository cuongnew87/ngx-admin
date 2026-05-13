import { NgModule } from '@angular/core';

import { MatRippleModule } from '@angular/material/core';
import { NbButtonModule, NbCardModule } from '@nebular/theme';
import { TaoFileYamlComponent } from './tao-file-yaml.component';

@NgModule({
  imports: [
    NbButtonModule,
    MatRippleModule,
    NbCardModule
  ],
  declarations: [
    TaoFileYamlComponent
  ],
})
export class TaoFileYamlModule { }
