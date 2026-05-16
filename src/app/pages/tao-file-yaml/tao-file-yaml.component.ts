import { Component, OnDestroy } from '@angular/core';
import { NbWindowService } from '@nebular/theme';
import { ModalComponent } from './modal/modal.component';

@Component({
  selector: 'tao-file-yaml',
  styleUrls: ['./tao-file-yaml.component.scss'],
  templateUrl: './tao-file-yaml.component.html',
})
export class TaoFileYamlComponent implements OnDestroy {
  constructor(private windowService: NbWindowService) {}
  
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }

  openForm() {
    this.windowService.open(ModalComponent, {
      title: 'Tạo file YAML',
      windowClass: 'yaml-modal',
      context: {},
    });
  }
}
