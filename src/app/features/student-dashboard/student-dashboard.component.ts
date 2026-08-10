// These are the Angular functions we need. signal() and computed() come from Angular's core.
import { Component, signal, inject, computed } from "@angular/core";
import { EnrollmentStore } from "../../store/enrollment.store";
import { RouterLink } from "@angular/router";

// The @Component decorator tells Angular: "This class is a visual component."
// It is metadata it describes how this class connects to the HTML template.

import { CourseCardComponent } from "../../ui/course-card/course-card.component";
import { Course } from "../../models/course.model";

import { rxResource } from "@angular/core/rxjs-interop";
import { CourseService } from "../../services/course.service";

import { EnrollmentListComponent } from "../enrollment-list/enrollment-list.component";

@Component({
  selector: "tms-student-dashboard", // The HTML tag name: <app-student-dashboard />
  standalone: true, // This component manages its own imports (no NgModule)
  imports: [CourseCardComponent,
            RouterLink,
            EnrollmentListComponent
           ],
  templateUrl: "./student-dashboard.component.html", // Points to theHTML file
  styleUrl: "./student-dashboard.component.scss", // Points to the styles file
})
export class StudentDashboardComponent {
  private api = inject(CourseService);
  readonly enrollmentStore = inject(EnrollmentStore);

  // signal('Liya Kebede') creates a reactive variable. Angular watchesit.
  // When its value changes, Angular automatically updates the part ofthe screen that displays it.
  studentName = signal("Liya Kebede");
  earnedCredits = signal(45);
  // computed() creates a read-only signal that derives its value fromother signals.
  // It recalculates automatically whenever earnedCredits() changes nomanual refresh.
  graduationStatus = computed(() =>
  this.earnedCredits() >= 120 
    ? "Eligible for Graduation" 
    : "In Progress",
  );

  coursesResource = rxResource({
  stream: () => this.api.getAll(),
  });


  // A regular method. When called, it updates the earnedCredits signal.
  // The .update() method receives the current value (c) and returns the new value (c + 3).
  registerForClass() {
  this.earnedCredits.update((c) => c + 3);
  }

  // signal<Course | null>(null) means: "This signal holds either a Course or nothing."
  // The | null syntax is TypeScript's way of saying a value can be absent.
  selectedCourse = signal<Course | null>(null);

  handleEnroll(course: Course) {
  this.selectedCourse.set(course);
  console.log('Enrollment requested for:', course.title);
  }

}