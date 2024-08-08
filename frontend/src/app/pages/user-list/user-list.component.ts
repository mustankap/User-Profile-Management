import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../service/user.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent implements OnInit {
  userService = inject(UserService);
  router = inject(Router);
  userList: any[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  limit: number = 3;
  searchQuery: string = '';
  noUsersFound: boolean = false;

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.userService
      .getUsers(this.currentPage, this.limit)
      .subscribe((res: any) => {
        this.userList = res.data.users;
        this.totalPages = Math.ceil(res.totalNoOfUsers / this.limit);
        this.noUsersFound = this.userList.length === 0;
        // console.log('userlist:', this.userList);
        // console.log('current page', this.currentPage);
        // console.log('totalno of doc:', res.totalNoOfUsers);
        // console.log('total no of pages:', this.totalPages);
      });
  }

  onDelete(id: any) {
    const isDelete = confirm('Are you sure you want to delete?');
    if (isDelete) {
      this.userService.deleteUserById(id).subscribe(
        (res: any) => {
          this.loadUsers();
        },
        (error) => {
          alert(error.message);
        }
      );
    }
  }

  onEdit(id: string) {
    this.router.navigate(['/createUser', id]);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadUsers();
  }

  getPageArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  onSearch() {
    if (this.searchQuery.trim() === '') {
      this.loadUsers();
      return;
    }

    this.userService.searchUsers(this.searchQuery).subscribe(
      (res: any) => {
        if (res && res.data && res.data.users) {
          this.userList = res.data.users;
          this.noUsersFound = this.userList.length === 0;
          this.totalPages = 1;
          this.currentPage = 1;
        } else {
          this.userList = [];
          this.noUsersFound = true;
        }
      },
      (error) => {
        console.error('Error searching users:', error);
        this.userList = [];
        this.noUsersFound = true;
      }
    );
  }
}
