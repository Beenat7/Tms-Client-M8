import { Component, input, output } from "@angular/core";
import { Course } from "../../models/course.model";
import { RouterLink } from "@angular/router";

@Component({
  selector: "tms-course-card",
  standalone: true,
  imports: [RouterLink],
  templateUrl: "./course-card.component.html",
  styleUrl: "./course-card.component.scss",
})
export class CourseCardComponent {
  course = input.required<Course>();

  enrollClicked = output<Course>();
  deleteClicked = output<Course>();

  percentage(course: Course): number {
    const ratio = course.enrollmentCount / course.maxCapacity;
    return Math.min(ratio * 100, 100);
  }
}