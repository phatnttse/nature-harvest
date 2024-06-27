import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ScriptService } from '../../services/script.service';

@Component({
  selector: 'app-upload-test',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upload-test.component.html',
  styleUrl: './upload-test.component.scss',
})
export class UploadTestComponent {
  uploadedImage = '';
  isDisabled = false;
  uploadedImages: string[] = [];

  constructor(private scriptService: ScriptService) {
    this.scriptService.load('uw');
  }

  processResults = (error: any, result: any): void => {
    if (result.event === 'close') {
      this.isDisabled = false;
    }
    if (result && result.event === 'success') {
      const secureUrl = result.info.secure_url;
      const previewUrl = secureUrl.replace('/upload/', '/upload/w_400/');
      this.uploadedImages.push(previewUrl);
      this.isDisabled = false;
      console.log(secureUrl);
    }
    if (error) {
      this.isDisabled = false;
    }
  };

  cloudName = 'dlpust9lj';
  uploadPreset = 'nature_harvest';

  uploadWidget = (): void => {
    this.isDisabled = true;
    window.cloudinary.openUploadWidget(
      {
        cloudName: this.cloudName,
        uploadPreset: this.uploadPreset,
        sources: ['local', 'url'],
        tags: ['myphotoalbum-angular'],
        clientAllowedFormats: ['image'],
        resourceType: 'image',
      },
      this.processResults
    );
  };
}
