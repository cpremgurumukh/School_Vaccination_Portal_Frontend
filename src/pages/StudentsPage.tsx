import React, { useState, useEffect, useCallback } from 'react';
import { Student, StudentPayload } from '../types/student.types';
import { VaccinationDrive } from '../types/drive.types';

import {
  searchStudents,
  addStudent,
  updateStudent,
  deleteStudent,
  SearchStudentParams,
  markStudentVaccinated,
  bulkImportStudents
} from '../services/studentService';
import { getDrives } from '../services/driveService';

import StudentForm from '../components/StudentForm';
const StudentsPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [availableDrives, setAvailableDrives] = useState<VaccinationDrive[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [showStudentForm, setShowStudentForm] = useState<boolean>(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const [showMarkVaccinatedDialog, setShowMarkVaccinatedDialog] = useState<boolean>(false);
  const [selectedStudentForVaccination, setSelectedStudentForVaccination] = useState<Student | null>(null);
  const [selectedDriveId, setSelectedDriveId] = useState<string>('');

  const [searchParams, setSearchParams] = useState<SearchStudentParams>({});
  const [fileForBulkImport, setFileForBulkImport] = useState<File | null>(null);

  const fetchStudents = useCallback(async (params: SearchStudentParams) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await searchStudents(params);
      if (Array.isArray(data)) {
      setStudents(data);
                    } else {
        console.warn("searchStudents did not return an array, received:", data);
        setStudents([]);
        setError("Received invalid student data format from server.");
                    }
    } catch (err: any) {
      console.error("Failed to fetch students:", err);
      setError(err.message || 'Failed to load students. Please try again.');
      setStudents([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchDrivesForSelection = useCallback(async () => {
      try {
        const drivesData = await getDrives();
        setAvailableDrives(drivesData.filter(drive => !drive.completed && drive.availableDoses > 0));
    } catch (err) {
        console.error("Failed to fetch drives for selection:", err);
      }
  }, []);

  useEffect(() => {
      fetchStudents(searchParams);
    fetchDrivesForSelection();
  }, [fetchStudents, fetchDrivesForSelection, searchParams]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams(prevParams => ({
      ...prevParams,
      [e.target.name]: e.target.value,
    }));
  };
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
        setMessage(null);
        setError(null);
      fetchStudents(searchParams);
  };
  const handleStudentFormSubmit = async (studentData: StudentPayload) => {
      setIsLoading(true);
      setMessage(null);
      setError(null);
      try {
      if (editingStudent && editingStudent.id) {
        await updateStudent(editingStudent.id, studentData);
        setMessage("Student updated successfully!");
                    } else {
        await addStudent(studentData);
        setMessage("Student added successfully!");
                    }
            setShowStudentForm(false);
            setEditingStudent(null);
      fetchStudents(searchParams);
    } catch (err: any) {
      console.error("Failed to save student:", err);
      setError(err.message || 'Failed to save student.');
    } finally {
      setIsLoading(false);
    }
};
  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setShowStudentForm(true);
    setShowMarkVaccinatedDialog(false);
  };
  const handleDeleteStudent = async (studentId: number) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      setIsLoading(true);
      setMessage(null);
      setError(null);
      try {
        await deleteStudent(studentId);
        setMessage("Student deleted successfully!");
        fetchStudents(searchParams);
      } catch (err: any) {
        console.error("Failed to delete student:", err);
        setError(err.message || 'Failed to delete student.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleOpenMarkVaccinatedDialog = (student: Student) => {
    setSelectedStudentForVaccination(student);
    setSelectedDriveId('');
    setShowMarkVaccinatedDialog(true);
    setShowStudentForm(false);
  };

  const handleConfirmMarkVaccinated = async () => {
    if (!selectedStudentForVaccination || !selectedStudentForVaccination.id || !selectedDriveId) {
      setError("Please select a student and a drive.");
      return;
    }
    const driveIdNum = parseInt(selectedDriveId, 10);
    const selectedDrive = availableDrives.find(d => d.id === driveIdNum);

    if (!selectedDrive) {
      setError("Invalid drive selected.");
      return;
    }

    setIsLoading(true);
    setMessage(null);
    setError(null);
    try {
      const updatedStudent = await markStudentVaccinated(
        selectedStudentForVaccination.id,
        driveIdNum,
        selectedDrive.vaccineName
      );
      setMessage(`${updatedStudent.name} marked as vaccinated with ${selectedDrive.vaccineName}.`);
      setShowMarkVaccinatedDialog(false);
      setSelectedStudentForVaccination(null);
      fetchStudents(searchParams);
    } catch (err: any) {
      console.error("Failed to mark student as vaccinated:", err);
      setError(err.message || 'Failed to mark student as vaccinated.');
    } finally {
      setIsLoading(false);
    }
  };

  const openNewStudentForm = () => {
    setEditingStudent(null);
    setShowStudentForm(true);
    setShowMarkVaccinatedDialog(false);
  };

  const handleFileChangeForBulkImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFileForBulkImport(event.target.files[0]);
      setMessage(null);
      setError(null);
    } else {
      setFileForBulkImport(null);
    }
};

  const handleBulkImportSubmit = async () => {
    if (!fileForBulkImport) {
      setError("Please select a file to import.");
      return;
    }
    setIsLoading(true);
    setMessage(null);
    setError(null);
    try {
      const importedStudents = await bulkImportStudents(fileForBulkImport);
      setMessage(`${importedStudents.length} students imported/updated successfully!`);
      setFileForBulkImport(null); 
      if (document.getElementById('bulkImportFile') as HTMLInputElement) {
        (document.getElementById('bulkImportFile') as HTMLInputElement).value = "";
      }
      fetchStudents(searchParams);
    } catch (err: any) {
      console.error("Bulk import failed:", err);
      setError(err.message || 'Bulk import failed. Please check the file format and try again.');
    } finally {
      setIsLoading(false);
    }
  };
  // Helper function to format the date safely
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return 'N/A'; // Handle undefined or empty date
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString();
  };

  return (
    <div>
      <h1 className="page-title">Student Management</h1>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      {/* Search Form - Styles Updated */}
      <form 
        onSubmit={handleSearchSubmit} 
        style={{ 
          display: 'flex',          // Make children (inputs, button) arrange in a row
          gap: '0.5rem',            // Space between items
          alignItems: 'center',     // Vertically align items in the center of the flex line
          flexWrap: 'nowrap',         // Allow items to wrap to next line if not enough space
          overflowX: 'auto' ,
          marginBottom: '1rem' 
        }}
      >
        <input 
          type="text" 
          name="name" 
          placeholder="Search by Name" 
          value={searchParams.name || ''} 
          onChange={handleSearchChange} 
          style={{ 
            padding: '0.5rem', 
            borderRadius: '4px', 
            border: '1px solid #ccc',
            flexGrow: 1,        // Allow input to grow
            minWidth: '150px'   // Prevent it from becoming too small
          }}
        />
        <input 
          type="text" 
          name="classGrade" 
          placeholder="Class/Grade" 
          value={searchParams.classGrade || ''} 
          onChange={handleSearchChange} 
          style={{ 
            padding: '0.5rem', 
            borderRadius: '4px', 
            border: '1px solid #ccc',
            flexGrow: 1,
            minWidth: '120px'
          }}
        />
        <input 
          type="text" 
          name="studentId" 
          placeholder="Student ID" 
          value={searchParams.studentId || ''} 
          onChange={handleSearchChange} 
          style={{ 
            padding: '0.5rem', 
            borderRadius: '4px', 
            border: '1px solid #ccc',
            flexGrow: 1,
            minWidth: '120px'
          }}
        />
        <button 
          type="submit"
          style={{
            padding: '0.5rem 1rem' // Standard button padding
          }}
        >
          Search
        </button>
      </form>

      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
        <button onClick={openNewStudentForm}>
          {showStudentForm && !editingStudent ? 'Cancel Add Student' : 'Add New Student'}
        </button>
        <div className="bulk-import-section" style={{border: '1px solid #eee', padding: '0.5rem 1rem', borderRadius: '4px'}}>
          <label htmlFor="bulkImportFile" style={{marginRight: '0.5rem'}}>Bulk Import Students (CSV):</label>
          <input 
            type="file" 
            id="bulkImportFile"
            onChange={handleFileChangeForBulkImport} 
            accept=".csv" 
            style={{marginRight: '0.5rem'}}
          />
          <button onClick={handleBulkImportSubmit} disabled={!fileForBulkImport || isLoading}>
            {isLoading ? 'Importing...' : 'Upload & Import'}
          </button>
        </div>
      </div>

      {showStudentForm && (
         <StudentForm
          initialData={editingStudent}
          onSubmit={handleStudentFormSubmit}
          onCancel={() => {
            setShowStudentForm(false);
            setEditingStudent(null);
          }}
        />
      )}
      {showMarkVaccinatedDialog && selectedStudentForVaccination && (
        <div className="card" style={{ marginTop: '1rem', border: '1px solid #007bff', padding: '1.5rem' }}>
          <h3>Mark {selectedStudentForVaccination.name} as Vaccinated</h3>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="driveSelect">Select Vaccination Drive:</label>
            <select id="driveSelect" value={selectedDriveId} onChange={(e) => setSelectedDriveId(e.target.value)} style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}>
              <option value="">-- Select Drive --</option>
              {availableDrives.map(drive => (
                <option key={drive.id} value={drive.id}>
                  {drive.vaccineName} on {formatDate(drive.driveDate)} (Doses: {drive.availableDoses})
                </option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => setShowMarkVaccinatedDialog(false)} className="secondary">Cancel</button>
            <button type="button" onClick={handleConfirmMarkVaccinated} disabled={!selectedDriveId || isLoading}>
              {isLoading ? 'Saving...' : 'Confirm Vaccination'}
            </button>
          </div>
        </div>
      )}

      {isLoading && <p>Loading students...</p>}
      {!isLoading && error && <p className="error-message">{error}</p>}
      {!isLoading && !error && (!Array.isArray(students) || students.length === 0) && (<p>No students found.</p>)}
      {!isLoading && !error && Array.isArray(students) && students.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Student ID</th>
              <th>Class/Grade</th>
              <th>Vaccination Records</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => {
              const hasVaccinationRecords = student.vaccinationRecords && student.vaccinationRecords.length > 0;
              return (
                <tr key={student.id}>
                  <td>{student.name}</td>
                  <td>{student.studentId}</td>
                  <td>{student.classGrade}</td>
                  <td>
                    {hasVaccinationRecords ? (
                      <ul style={{ margin: 0, paddingLeft: '15px' }}>
                        {student.vaccinationRecords!.map(record => (
                          <li key={record.id}>
                            {record.vaccineName} on {new Date(record.date).toLocaleDateString()}
                          </li>
                        ))}
                      </ul>
                    ) : ('No records')}
                  </td>
                  <td className="actions">
                    <button onClick={() => handleEditStudent(student)}>Edit Info</button>
                    <button onClick={() => handleDeleteStudent(student.id!)} className="danger">Delete</button>
                    {hasVaccinationRecords ? (
                       <button 
                          onClick={() => handleOpenMarkVaccinatedDialog(student)} 
                          className="secondary"
                          title="Add another vaccination (e.g., different vaccine, booster)"
                        >
                          Add Another Vac.
                        </button>
                    ) : (
                      <button 
                        onClick={() => handleOpenMarkVaccinatedDialog(student)} 
                        className="secondary"
                      >
                        Mark Vaccinated
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StudentsPage;