import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../service/user.service';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  newuser = 0;
  loginObj: any = {
    email: '',
    password: '',
  };

  userService = inject(UserService);
  router = inject(Router);

  login() {
    this.userService.onLogin(this.loginObj).subscribe((res: any) => {
      if (res.status === 'success') {
        localStorage.setItem('userApp', JSON.stringify(res.data.user));
        console.log(res.data.user.role);
        if (res.data.user.role == 'user') {
          this.router.navigateByUrl(`createUser/${res.data.user._id}`);
        } else {
          this.router.navigateByUrl('user-list');
        }
      } else {
        alert(res.message);
      }
    });
  }

  register() {
    this.router.navigateByUrl('/register');
  }
}
