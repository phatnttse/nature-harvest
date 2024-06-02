import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { CloudinaryUploadService } from '../../services/cloudinaryupload.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NgxDropzoneModule, CommonModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  files: File[] = [];

  constructor(private cloudinaryUploadService: CloudinaryUploadService) {}

  onSelect(event: any) {
    this.files.push(...event.addedFiles);
  }

  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  uploadFiles() {
    if (!this.files[0]) {
      alert('No files selected');
    }

    for (let i = 0; i < this.files.length; i++) {
      const file_data = this.files[i];
      const data = new FormData();
      data.append('file', file_data);
      data.append('upload_preset', 'ml_default');
      data.append('cloud_name', 'dl3rsgucq');
      this.cloudinaryUploadService.uploadImage(data).subscribe((response) => {
        console.log(response);
      });
    }
  }
}
