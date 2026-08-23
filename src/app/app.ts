import { Component, OnInit, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EnrollmentStore } from './store/enrollment.store';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  private readonly store = inject(EnrollmentStore);

  protected readonly title = signal('tms-client');

  ngOnInit(): void {
    this.store.loadEnrollments();
    this.store.listenForLiveUpdates();
  }
}