import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap, Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = 'http://127.0.0.1:8000/api/v1/users';

  constructor(private http: HttpClient) {}

  onLogin(obj: any) {
    return this.http
      .post(`${this.baseUrl}/login`, obj, { withCredentials: true })
      .pipe(
        tap((res: any) => {
          if (res.token) {
            localStorage.setItem('jwt_token', res.token);
            console.log('Logged in successfully');
          }
        })
      );
  }

  getUsers(page: number, limit: number) {
    return this.http.get(
      `${this.baseUrl}?sort=createdAt&limit=${limit}&page=${page}`
    );
  }

  updateUser(obj: string) {
    return this.http.patch(`${this.baseUrl}/updateMe`, obj);
  }

  //admin does it
  createNewUser(obj: string) {
    return this.http.post(`${this.baseUrl}/signup`, obj);
  }

  deleteUserById(userId: string) {
    return this.http.delete(`${this.baseUrl}/${userId}`);
  }

  getUserById(id: string) {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  updateUserById(userId: string, userData: any) {
    return this.http.patch(`${this.baseUrl}/${userId}`, userData);
  }

  searchUsers(query: string): Observable<any> {
    let searchParam: string;

    // Simple email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailRegex.test(query)) {
      searchParam = `email=${query}`;
    } else {
      searchParam = `name=${query}`;
    }

    return this.http.get(`${this.baseUrl}?${searchParam}`);
  }

  forgotPassword(email: string) {
    return this.http.post(`${this.baseUrl}/forgotPassword`, { email });
  }

  resetPassword(token: string, password: string, passwordConfirm: string) {
    return this.http.patch(`${this.baseUrl}/resetPassword/${token}`, {
      password,
      passwordConfirm,
    });
  }

  // getUserById(id: string): Observable<{ status: string; data: { user: User } }> {
  //   return this.http.get<{ status: string; data: { user: User } }>(`${this.baseUrl}/${id}`);
  // }

  // getLoggedInUserId(): string | null {
  //   const token = localStorage.getItem('jwt_token');
  //   if (token) {
  //     try {
  //       const decodedToken: any = jwtDecode(token);
  //       return decodedToken.id;
  //     } catch (error) {
  //       console.error('Error decoding token:', error);
  //       return null;
  //     }
  //   }
  //   return null;
  // }

  // login(obj: any) {
  //   return this.http
  //     .post(`${this.baseUrl}/login`, obj, { withCredentials: true })
  //     .pipe(
  //       tap((res: any) => {
  //         if (res.token) {
  //           localStorage.setItem('jwt_token', res.token);
  //           console.log('Token stored:', res.token);
  //           const decoded = jwtDecode(res.token);
  //           console.log('Decoded token:', decoded);
  //         } else {
  //           console.error('No token received from login');
  //         }
  //       })
  //     );
  // }
}
