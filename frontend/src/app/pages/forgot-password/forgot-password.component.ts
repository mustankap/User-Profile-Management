// import { Component, inject } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-forgot-password',
//   standalone: true,
//   imports: [],
//   templateUrl: './forgot-password.component.html',
//   styleUrl: './forgot-password.component.css',
// })
// export class ForgotPasswordComponent {}

import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../service/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent {
  email: string = '';
  message: string = '';

  userService = inject(UserService);
  router = inject(Router);

  onSubmit() {
    this.userService.forgotPassword(this.email).subscribe(
      (res: any) => {
        this.message = res.message;
      },
      (error) => {
        this.message = 'An error occurred. Please try again.';
      }
    );
  }
}
