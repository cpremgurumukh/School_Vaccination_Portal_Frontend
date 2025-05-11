// Forward declaration to avoid circular dependencies if Student/Drive types also import this
// We'll refine this if the backend sends full nested objects.
// For now, assume IDs are primarily used for linking.
// import { Student } from './student.types';
// import { VaccinationDrive } from './drive.types';

export interface VaccinationRecord {
  id?: number;
  vaccineName: string;
  date: string; // Keep as string for simplicity with date inputs, convert as needed
  studentId: number; // For linking when creating/fetching
  driveId: number;   // For linking when creating/fetching
  // Optional: If backend sends full objects when fetching records:
  // student?: Partial<Student>;
  // drive?: Partial<VaccinationDrive>;
}

// This interface was defined in vaccinationRecordService.ts previously.
// It's better to have it with its related types if it's a distinct payload structure.
// Or, if it's only used by the service, it can stay there.
// For consistency with how we defined StudentPayload and DrivePayload in services,
// let's assume it's defined and exported from vaccinationRecordService.ts for now.
// If you want it here, you'd add:
// export interface CreateVaccinationRecordPayload {
//   vaccineName: string;
//   date: string; // YYYY-MM-DD
//   studentId: number;
//   driveId: number;
// }