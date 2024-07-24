import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { DeleteUserComponent } from './delete-user/delete-user.component';
import { UserResponse } from '../../../responses/user/user.response';
import { UserService } from '../../../services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { UserListResponse } from '../../../responses/user/user-list.response';
import { HttpErrorResponse } from '@angular/common/http';
import { Phone } from 'angular-feather/icons';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-user-manager',
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
  templateUrl: './user-manager.component.html',
  styleUrl: './user-manager.component.scss',
})
export class UserManagerComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  keyword: string = '';
  currentPage: number = 0;
  itemsPerPage: number = 10;
  localStorage?: Storage;
  totalPages: number = 0;
  visiblePages: number[] = [];

  dataSource = new MatTableDataSource<UserResponse>();
  displayedColumns: string[] = [
    'picture',
    'name',
    'email',
    'accountType',
    'phone',
    'address',
    'dateOfBirth',
    'action',
  ];

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getUsers(this.keyword, this.currentPage, this.itemsPerPage);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  getUsers(keyword: string, currentPage: number, itemsPerPage: number) {
    this.userService.getAllUsers(keyword, currentPage, itemsPerPage).subscribe({
      next: (response: UserListResponse) => {
        this.totalPages = response.totalPages;
        this.visiblePages = this.generateVisiblePageArray(
          this.currentPage,
          this.totalPages
        );
        this.dataSource = new MatTableDataSource(response.users);
        this.dataSource.sort = this.sort;
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      },
    });
  }

  openDialog(userId: string) {
    debugger;
    const dialogRef = this.dialog.open(DeleteUserComponent, {
      width: '400px',
      data: userId,
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      debugger;
      if (result) {
        this.getUsers(this.keyword, this.currentPage, this.itemsPerPage);
        this.toastr.success('Xoá nguời dùng thành công');
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  onPageChange(page: number) {
    this.currentPage = page < 0 ? 0 : page;
    this.localStorage?.setItem(
      'currentUserManagerPage',
      String(this.currentPage)
    );
    this.getUsers(this.keyword, this.currentPage, this.itemsPerPage);
  }

  generateVisiblePageArray(currentPage: number, totalPages: number): number[] {
    const maxVisiblePages = 5;
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(currentPage - halfVisiblePages, 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    return new Array(endPage - startPage + 1)
      .fill(0)
      .map((_, index) => startPage + index);
  }
}
