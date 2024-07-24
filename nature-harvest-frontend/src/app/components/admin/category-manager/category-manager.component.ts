import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { CategoryWithSubcategoriesResponse } from '../../../responses/category/category-subcategory-response';
import { CategoryService } from '../../../services/category.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { DeleteCategoryComponent } from './delete-category/delete-category.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-category-manager',
  standalone: true,
  imports: [
    MatCardModule,
    MatTableModule,
    FormsModule,
    CommonModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    MatFormFieldModule,
    MatSortModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './category-manager.component.html',
  styleUrl: './category-manager.component.scss',
})
export class CategoryManagerComponent implements AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<CategoryWithSubcategoriesResponse>();
  displayedColumns: string[] = ['thumbnail', 'name', 'action'];

  constructor(
    private categoryService: CategoryService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {
    this.categoryService.categoriesWithSubcategories$.forEach((data) => {
      this.dataSource.data = data;
      debugger;
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  openDialog(categoryId: number) {
    debugger;
    const dialogRef = this.dialog.open(DeleteCategoryComponent, {
      width: '400px',
      data: { categoryId },
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      debugger;
      if (result) {
        this.categoryService.getCategoriesWithSubcategories().subscribe();
        this.toastr.success('Xoá danh mục thành công');
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
