export interface VaccinationDrive {
  id?: number; // Optional for creation
  vaccineName: string; // Changed from vaccineType
  driveDate: string; // Keep as string for simplicity with date inputs
  availableDoses: number; // Changed from slotsAvailable
  applicableClasses: string[]; // New field
  completed: boolean; // New field
}
