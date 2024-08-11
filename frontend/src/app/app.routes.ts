import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { UserListComponent } from './pages/user-list/user-list.component';
import { CreateUserComponent } from './pages/create-user/create-user.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
  },
  { path: 'register', component: CreateUserComponent },
  {
    path: 'reset-password/:token',
    component: ResetPasswordComponent,
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'user-list', component: UserListComponent },
      {
        path: 'createUser',
        component: CreateUserComponent,
      },

      {
        path: 'createUser/:id',
        component: CreateUserComponent,
      },
    ],
  },
];
