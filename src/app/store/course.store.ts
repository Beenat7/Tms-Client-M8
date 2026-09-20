import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import {
  removeEntity,
  setAllEntities,
  withEntities,
} from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import {
  catchError,
  EMPTY,
  concatMap,
  pipe,
  tap,
} from 'rxjs';

import { Course } from '../models/course.model';
import { CourseService } from '../services/course.service';

export const CourseStore = signalStore(
  { providedIn: 'root' },

  withState({
    isLoading: false,
    error: null as string | null,
  }),

  withEntities<Course>(),

  withComputed((store) => ({
    courseCount: computed(() => store.entities().length),
  })),

  withMethods((store, api = inject(CourseService)) => ({

   loadCourses: rxMethod<void>(
  pipe(
    tap(() => {
      patchState(store, {
        isLoading: true,
        error: null,
      });
    }),

    concatMap(() =>
      api.getAll().pipe(
        tap((courses) => {
          patchState(
            store,
            setAllEntities(courses),
            {
              isLoading: false,
            }
          );
        }),

        catchError((err) => {
          patchState(store, {
            isLoading: false,
            error: err.message,
          });

          return EMPTY;
        })
      )
    )
  )
),

    deleteCourse(id: number) {
      // 1. Snapshot BEFORE changing local state
      const previousSnapshot = store.entities();

      // 2. Remove immediately from the UI
      patchState(
        store,
        removeEntity(id)
      );

      // 3. Tell the backend
      api.delete(id).pipe(
        catchError(() => {

          // 4. Backend rejected deletion → restore snapshot
          patchState(
            store,
            setAllEntities(previousSnapshot)
          );

          patchState(store, {
            error:
              'Cannot delete course: active student enrollments exist.',
          });

          return EMPTY;
        })
      ).subscribe();
    },
  }))
);