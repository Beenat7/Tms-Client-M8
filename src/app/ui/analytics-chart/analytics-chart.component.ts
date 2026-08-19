import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';
import { Enrollment } from '../../models/enrollment.model';

@Component({
  selector: 'tms-analytics-chart',
  standalone: true,
  templateUrl: './analytics-chart.component.html',
  styleUrl: './analytics-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsChartComponent {
  readonly data = input.required<Enrollment[]>();
}