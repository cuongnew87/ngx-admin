import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { normalizeName, parseDockerImage } from '../../../shared/utils/yaml-generator.util';

@Component({
  selector: 'app-quick-generate',
  templateUrl: './quick-generate.component.html',
  styleUrls: ['./quick-generate.component.scss'],
})
export class QuickGenerateComponent {

  @Input()
  templateSchema: any[] = [];

  @Output()
  generate =
    new EventEmitter<any>();

  quickGenerate = {

    appName: '',

    count: 1,

    services: [
      {
        name: '',
        image: ''
      }
    ]
  };
  readonly parseDockerImage = parseDockerImage;

  generateMultipleFiles(): void {

    const count =
      Number(this.quickGenerate.count || 0);

    if (count <= 0) {
      return;
    }

    const appName =
      normalizeName(
        this.quickGenerate.appName
      );

    if (!appName) {

      alert('Tên chương trình không hợp lệ');

      return;
    }

    const services =
      this.quickGenerate.services || [];

    if (services.length === 0) {

      alert('Vui lòng nhập service');

      return;
    }

    // validate image trước

    for (const service of services) {

      if (!service.name?.trim()) {
        continue;
      }

      const imageInfo =
        this.parseDockerImage(
          service.image
        );

      if (!imageInfo.valid) {

        alert(
          `Docker image không hợp lệ cho service: ${service.name}`
        );

        return;
      }
    }

    this.generate.emit({

      appName,

      services
    });
  }

  onQuickGenerateCountChange(): void {

    const count =
      Number(this.quickGenerate.count || 0);

    while (
      this.quickGenerate.services.length < count
    ) {

      this.quickGenerate.services.push({

        name: '',

        image: ''
      });
    }

    while (
      this.quickGenerate.services.length > count
    ) {

      this.quickGenerate.services.pop();
    }
  }

  trackByIndex(
    index: number,
    item: any
  ): number {

    return index;
  }
}