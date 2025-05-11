// src/services/reportService.ts
import apiClient from './apiClient';

export type ReportFormat = 'csv' | 'excel' | 'pdf';

export interface VaccinationReportFilters {
  vaccineName?: string;
  page?: number;
  size?: number;
}

export const getReportData = async (filters: VaccinationReportFilters = {}) => {
  const params = new URLSearchParams();
  if (filters.vaccineName) params.append('vaccineName', filters.vaccineName);
  if (filters.page !== undefined) params.append('page', filters.page.toString());
  if (filters.size !== undefined) params.append('size', filters.size.toString());

  const response = await apiClient.get('/reports', { params });
  return response.data; // Ensure the response has a 'content' property
};

export const downloadReport = async (format: ReportFormat, vaccineName?: string) => {
  const params = new URLSearchParams({ format });
  if (vaccineName) params.append('vaccineName', vaccineName);

  const response = await apiClient.get(`/reports/download?${params.toString()}`, {
    responseType: 'blob',
  });

  const blob = new Blob([response.data], { type: response.headers['content-type'] });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `vaccination_report.${format === 'excel' ? 'xlsx' : format === 'pdf' ? 'pdf' : 'csv'}`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};
