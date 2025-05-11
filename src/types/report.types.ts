// src/types/report.types.ts
export interface VaccinationReport {
  id: number;
  vaccineName: string;
  studentName: string;
  vaccinationDate: string;
}

export interface VaccinationReportFilters {
  vaccineName?: string;
  page?: number;
  size?: number;
}
