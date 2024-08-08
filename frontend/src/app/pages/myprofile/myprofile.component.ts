import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-myprofile',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './myprofile.component.html',
  styleUrl: './myprofile.component.css',
})
export class MyprofileComponent {
  userForm: any = {
    name: '',
    email: '',
    gender: '',
    about: '',
    password: '',
    passwordConfirm: '',
    role: 'user',
  };

  userService = inject(UserService);
  loggedUserId: any = 0;
  constructor() {
    const loggedUser = localStorage.getItem('userApp');
    if (loggedUser != null) {
      const parseData = JSON.parse(loggedUser);
      this.loggedUserId = parseData._id;
      this.getUserById();
    }
  }

  router = inject(Router);

  getUserById() {
    this.userService.getUserById(this.loggedUserId).subscribe((res: any) => {
      this.userForm = res.data.user;
    });
  }
}
// =========================================================================================================================
// --------------------------------------------------------------------------------------------------------------
// ===================================================================================================================
