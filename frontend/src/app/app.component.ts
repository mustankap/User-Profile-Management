import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [HttpClient],
})
export class AppComponent {
  title = 'frontend';
  http = inject(HttpClient);

  constructor() {
    this.http.get('127.0.0.1:8000/api/v1/user');
  }
}
