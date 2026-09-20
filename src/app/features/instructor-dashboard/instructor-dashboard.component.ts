import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { EnrollmentStore } from '../../store/enrollment.store';
import { AnalyticsChartComponent } from '../../ui/analytics-chart/analytics-chart.component';

@Component({
  selector: 'tms-instructor-dashboard',
  standalone: true,
  imports: [AnalyticsChartComponent],
  templateUrl: './instructor-dashboard.component.html',
  styleUrl: './instructor-dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstructorDashboardComponent {
  readonly store = inject(EnrollmentStore);
}