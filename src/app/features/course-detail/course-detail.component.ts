import { Component, effect, input } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
  selector: "tms-course-detail",
  standalone: true,
  imports: [RouterLink],
  templateUrl: "./course-detail.component.html",
})
export class CourseDetailComponent {
  id = input.required<string>();

  constructor() {
    effect(() => {
      console.log(`Loading course detail for ID: ${this.id()}`);
    });
  }
}