import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { BlogService } from '../../../../services/blog.service';
import { BaseResponse } from '../../../../responses/base/base.response';

@Component({
  selector: 'app-delete-blog',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
  ],
  templateUrl: './delete-blog.component.html',
  styleUrl: './delete-blog.component.scss',
})
export class DeleteBlogComponent {
  blogId: number = 0;

  constructor(
    private dialogRef: MatDialogRef<DeleteBlogComponent>,
    private blogService: BlogService,
    @Inject(MAT_DIALOG_DATA) public data: number
  ) {
    this.blogId = this.data;
  }

  deleteBlog() {
    this.blogService.deleteBlog(this.blogId).subscribe({
      next: (response: BaseResponse) => {
        debugger;
        if (response.status !== 200) {
          this.dialogRef.close(false);
        }
        this.dialogRef.close(true);
      },
      error: (err) => console.log(err),
    });
  }
}
