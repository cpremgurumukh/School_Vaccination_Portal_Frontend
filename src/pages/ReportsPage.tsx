import React, { useState, useEffect, useCallback } from 'react';
import { VaccinationReport, VaccinationReportFilters } from '../types/report.types';
import { getReportData, downloadReport } from '../services/reportService';

const ReportsPage: React.FC = () => {
  const [reports, setReports] = useState<VaccinationReport[]>([]);
  const [filters, setFilters] = useState<VaccinationReportFilters>({ page: 1, size: 10 });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
    const data = await getReportData({ ...filters, page: filters.page - 1 });
          console.log('Fetched Data:', data);  // Log the fetched data to check its structure
      if (data && data.content) {
        setReports(data.content);
      } else {
        setReports([]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load reports.');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleDownloadReport = (format: 'csv' | 'excel' | 'pdf') => {
    downloadReport(format, filters.vaccineName);
  };

  const handleChangeFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prevFilters) => ({ ...prevFilters, page }));
  };

  return (
    <div>
      <h1 className="page-title">Vaccination Reports</h1>

      {/* Filters */}
      <div className="filters">
        <input
          type="text"
          name="vaccineName"
          placeholder="Filter by Vaccine"
          value={filters.vaccineName || ''}
          onChange={handleChangeFilter}
        />
        <button onClick={() => fetchReports()}>Apply Filters</button>
      </div>

      {/* Download Options */}
      <div className="download-buttons">
        <button onClick={() => handleDownloadReport('csv')}>Download CSV</button>
        <button onClick={() => handleDownloadReport('excel')}>Download Excel</button>
        <button onClick={() => handleDownloadReport('pdf')}>Download PDF</button>
      </div>

      {/* Displaying Reports */}
      {isLoading && <p>Loading reports...</p>}
      {error && <p className="error-message">{error}</p>}
      {!isLoading && !error && reports.length === 0 && <p>No reports found.</p>}

      {!isLoading && !error && reports.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Vaccine Name</th>
              <th>Student Name</th>
              <th>Vaccination Date</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((student) => {
              // Loop through each vaccination record for the student
              return student.vaccinationRecords.map((record) => (
                <tr key={record.id}>
                  <td>{record.vaccineName}</td>
                  <td>{student.name}</td>
                  <td>{new Date(record.date).toLocaleDateString()}</td>
                </tr>
              ));
            })}
          </tbody>
        </table>
      )}

      {/* Pagination Controls */}
      <div className="pagination-controls">
        <button onClick={() => handlePageChange(filters.page - 1)} disabled={filters.page <= 1}>
          Previous
        </button>
        <span>Page {filters.page}</span>
        <button onClick={() => handlePageChange(filters.page + 1)}>Next</button>
      </div>
    </div>
  );
};

export default ReportsPage;
