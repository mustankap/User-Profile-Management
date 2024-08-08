import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../service/user.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  token: string = '';
  password: string = '';
  passwordConfirm: string = '';
  message: string = '';

  userService = inject(UserService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.token = params['token'];
    });
  }

  onSubmit() {
    this.userService
      .resetPassword(this.token, this.password, this.passwordConfirm)
      .subscribe(
        (res: any) => {
          this.message = 'Password reset successfully. Redirecting to login...';
          setTimeout(() => this.router.navigate(['/login']), 3000);
        },
        (error) => {
          this.message = 'An error occurred. Please try again.';
        }
      );
  }
}
