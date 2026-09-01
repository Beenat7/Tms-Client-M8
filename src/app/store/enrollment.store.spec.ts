import { TestBed } from '@angular/core/testing';
import { EnrollmentStore } from './enrollment.store';
import { EnrollmentService } from '../services/enrollment.service';
import { LiveSyncService } from '../services/live-sync';
import { of, Subject } from 'rxjs';

describe('EnrollmentStore', () => {
  let store: InstanceType<typeof EnrollmentStore>;

  const enrollmentServiceMock = {
    getAll: vi.fn(),
    approve: vi.fn(),
  };

  const liveSyncServiceMock = {
    connect: vi.fn(),
    events$: new Subject<any>(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EnrollmentStore,
        {
          provide: EnrollmentService,
          useValue: enrollmentServiceMock,
        },
        {
          provide: LiveSyncService,
          useValue: liveSyncServiceMock,
        },
      ],
    });

    enrollmentServiceMock.getAll.mockReturnValue(of([]));
    enrollmentServiceMock.approve.mockReturnValue(of(undefined));

    store = TestBed.inject(EnrollmentStore);
  });

  it('should seed enrollments and expose them through entities()', async () => {
    const enrollments = [
      {
        id: '1',
        studentId: 11,
        studentName: 'Abeba',
        courseId: 101,
        courseName: 'Intro to CS',
        status: 'Pending',
        enrolledAt: '2026-08-12T10:00:00Z',
      },
      {
        id: '2',
        studentId: 12,
        studentName: 'Kebede',
        courseId: 102,
        courseName: 'Data Structures',
        status: 'Approved',
        enrolledAt: '2026-08-12T10:05:00Z',
      },
    ];

    enrollmentServiceMock.getAll.mockReturnValue(of(enrollments));

    store.loadEnrollments();

    await new Promise((resolve) => setTimeout(resolve));

    expect(store.entities()).toHaveLength(2);
    expect(store.entities()[0].courseName).toBe('Intro to CS');
  });

  it('should calculate pendingCount() correctly', async () => {
    const enrollments = [
      {
        id: '1',
        studentId: 11,
        studentName: 'Abeba',
        courseId: 101,
        courseName: 'Intro to CS',
        status: 'Pending',
        enrolledAt: '2026-08-12T10:00:00Z',
      },
      {
        id: '2',
        studentId: 12,
        studentName: 'Kebede',
        courseId: 102,
        courseName: 'Data Structures',
        status: 'Approved',
        enrolledAt: '2026-08-12T10:05:00Z',
      },
      {
        id: '3',
        studentId: 13,
        studentName: 'Hana',
        courseId: 103,
        courseName: 'Web Development',
        status: 'Pending',
        enrolledAt: '2026-08-12T10:10:00Z',
      },
    ];

    enrollmentServiceMock.getAll.mockReturnValue(of(enrollments));

    store.loadEnrollments();

    await new Promise((resolve) => setTimeout(resolve));

    expect(store.pendingCount()).toBe(2);
  });
});