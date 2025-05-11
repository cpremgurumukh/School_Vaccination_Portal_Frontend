import { VaccinationRecord } from './vaccinationRecord.types'; // We'll create this next

export interface Student {
  id?: number; // Optional for creation, backend will generate
  name: string;
  classGrade: string;
  studentId: string; // The unique student identifier (e.g., roll number)
  vaccinationRecords?: VaccinationRecord[]; // Will be populated when fetching a student's details
}
