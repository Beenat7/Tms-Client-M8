import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import {
  setAllEntities,
  updateEntity,
  withEntities,
} from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, concatMap, EMPTY, pipe, tap,switchMap } from 'rxjs';
import { Enrollment } from '../models/enrollment.model';
import { EnrollmentService } from '../services/enrollment.service';

import { LiveSyncService } from '../services/live-sync';

export const EnrollmentStore = signalStore(
  { providedIn: 'root' },

  withState({
    isLoading: false,
    error: null as string | null,
  }),

  withEntities<Enrollment>(),

  withComputed((store) => ({
    pendingCount: computed(
      () =>
        store.entities().filter(
          (enrollment) => enrollment.status === 'Pending'
        ).length
    ),
  })),

  withMethods((store, api = inject(EnrollmentService), sync = inject(LiveSyncService) ) => ({
    loadEnrollments: rxMethod<void>(
      pipe(
        tap(() => {
          patchState(store, {
            isLoading: true,
            error: null,
          });
        }),

        concatMap(() =>
          api.getAll().pipe(
            tap((rows) => {
              patchState(
                store,
                setAllEntities(rows),
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

    approveEnrollment: rxMethod<string>(
      pipe(
        tap((id) => {
          patchState(
            store,
            updateEntity({
              id,
              changes: {
                status: 'Approved',
              },
            })
          );
        }),

        concatMap((id) =>
          api.approve(id).pipe(
            catchError(() => {
              patchState(
                store,
                updateEntity({
                  id,
                  changes: {
                    status: 'Pending',
                  },
                })
              );

              patchState(store, {
                error:
                  'Server rejected the approval. Check enrollment constraints.',
              });

              return EMPTY;
            })
          )
        )
      )
    ),

    listenForLiveUpdates: rxMethod<void>(
  pipe(
    tap(() => sync.connect()),

    switchMap(() => sync.events$),

    tap((event) => {
      patchState(
        store,
        updateEntity({
          id: event.id,
          changes: {
            status: event.status,
          },
        })
      );
    })
  )
),




  }))
);