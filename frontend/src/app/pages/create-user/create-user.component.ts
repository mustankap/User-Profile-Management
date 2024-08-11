import { Component, inject, OnInit } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { UserService } from '../../service/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.css',
})
export class CreateUserComponent implements OnInit {
  userForm: FormGroup;

  userService = inject(UserService);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  formBuilder = inject(FormBuilder);

  isEditMode: boolean = false;
  loggedUserId: any = 0;
  isNewUserRegistration: boolean = false;

  constructor() {
    this.isNewUserRegistration = this.router.url === '/register';

    this.userForm = this.formBuilder.group(
      {
        id: [''],
        name: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        gender: ['', Validators.required],
        about: ['', [Validators.required, Validators.maxLength(100)]],
        password: [''],
        passwordConfirm: [''],
        role: ['user'],
      },
      { validator: this.passwordMatchValidator }
    );

    if (this.isNewUserRegistration) {
      this.userForm.patchValue({ role: 'user' });
    }
  }

  ngOnInit() {
    const loggedUser = localStorage.getItem('userApp');

    if (loggedUser != null) {
      const parseData = JSON.parse(loggedUser);

      if (parseData.role == 'user') {
        this.isEditMode = true;
        this.loggedUserId = parseData._id;
        this.getUserById(this.loggedUserId);
      }
    }

    this.activatedRoute.params.subscribe((params) => {
      if (params['id']) {
        this.isEditMode = true;
        this.getUserById(params['id']);
      } else {
        this.userForm.controls['password'].addValidators([Validators.required]);
        this.userForm.controls['passwordConfirm'].addValidators([
          Validators.required,
        ]);
      }
    });
  }

  getUserById(id: string) {
    this.userService.getUserById(id).subscribe((res: any) => {
      const userData = { ...res.data.user, id: res.data.user._id };
      // if (this.isEditMode) {
      //   delete this.userForm.password;
      //   delete this.userForm.passwordConfirm;
      // }
      // console.log(this.isEditMode);
      if (this.isEditMode) {
        // Instead of deleting properties, we'll omit them when updating the form
        const { password, passwordConfirm, ...editUserData } = userData;
        this.userForm.controls['password'].removeValidators([
          Validators.required,
        ]);
        this.userForm.controls['passwordConfirm'].removeValidators([
          Validators.required,
        ]);

        // this.userForm.controls['password'].clearValidators();
        // this.userForm.controls['passwordConfirm'].clearValidators();

        // this.userForm.get('password')?.clearValidators();
        // this.userForm.get('passwordConfirm')?.clearValidators();
        console.log(this.userForm.controls['password']);

        this.userForm.patchValue(editUserData);

        // Remove validators for password fields in edit mode
        // this.userForm.get('password')?.clearValidators();
        // this.userForm.get('passwordConfirm')?.clearValidators();
        // this.userForm.get('password')?.updateValueAndValidity();
        // this.userForm.get('passwordConfirm')?.updateValueAndValidity();
      } else {
        this.userForm.patchValue(userData);
      }
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      if (this.isEditMode) {
        this.onUpdate();
      } else if (this.isNewUserRegistration) {
        this.onRegister();
      } else {
        this.onSave();
      }
    } else {
      this.markFormGroupTouched(this.userForm);
    }
  }

  onSave() {
    this.userService.createNewUser(this.userForm.value).subscribe(
      (res: any) => {
        if (res.status === 'success') {
          alert('User Created Successfully');
          this.router.navigateByUrl('/user-list');
        } else {
          alert(res.message);
        }
      },
      (error) => {
        alert(error.error.message || 'An error occurred');
      }
    );
  }

  onUpdate() {
    const userId = this.userForm.get('id')?.value;
    const updateData = { ...this.userForm.value };
    // delete updateData.id;
    // console.log('updateData below:');
    // console.log(updateData);
    this.userService.updateUserById(userId, updateData).subscribe(
      (res: any) => {
        if (res.status === 'success') {
          alert('Your details have been updated Successfully');
          const loggedUser = JSON.parse(
            localStorage.getItem('userApp') || '{}'
          );
          if (loggedUser.role == 'user') {
            this.router
              .navigateByUrl(`/createUser/${userId}`, {
                skipLocationChange: true,
              })
              .then(() => {
                this.router.navigate([`/createUser/${userId}`]);
              });
          } else {
            this.router.navigateByUrl('/user-list');
          }
        } else {
          console.log('inner console error');

          alert(res.message);
        }
      },
      (error) => {
        console.log('outer console error');
        alert(error.error.message || 'An error occurred');
      }
    );
  }

  onRegister() {
    this.userService.createNewUser(this.userForm.value).subscribe(
      (res: any) => {
        if (res.status === 'success') {
          alert('Registration Successful. Please login.');
          this.router.navigateByUrl('/login');
        } else {
          alert(res.message);
        }
      },
      (error) => {
        alert(error.error.message || 'An error occurred during registration');
      }
    );
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('passwordConfirm')?.value
      ? null
      : { mismatch: true };
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
