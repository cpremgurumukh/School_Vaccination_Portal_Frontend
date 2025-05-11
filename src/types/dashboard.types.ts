export interface DashboardData {
  totalStudents: number;
  vaccinatedStudents: number;
  vaccinatedPercentage: number; // Expecting a value like 0.0 for 0%, 0.75 for 75%
  upcomingDrives: VaccinationDrive[]; // ← Add this
}
export interface VaccinationDrive {
  id: number;
  vaccineName: string;
  date: string; // ISO string
  availableDoses: number;
  applicableClasses: string[];
  completed: boolean;
}
