import React, { useState, useEffect, useCallback } from 'react';
import { VaccinationDrive } from '../types/drive.types';
import { getDrives, createDrive, updateDrive, deleteDrive, DrivePayload } from '../services/driveService';
import DriveForm from '../components/DriveForm'; // We'll create this next

const DrivesPage: React.FC = () => {
  const [drives, setDrives] = useState<VaccinationDrive[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingDrive, setEditingDrive] = useState<VaccinationDrive | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const fetchDrives = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setMessage(null);
    try {
      const data = await getDrives();
      setDrives(data.filter(drive => !drive.completed)); 
    } catch (err: any) {
      console.error("Failed to fetch drives:", err);
      setError(err.message || 'Failed to load vaccination drives. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDrives();
  }, [fetchDrives]);

  const handleFormSubmit = async (driveData: DrivePayload) => {
    setIsLoading(true);
    setMessage(null);
    setError(null);
    try {
      if (editingDrive && editingDrive.id) {
        await updateDrive(editingDrive.id, driveData);
        setMessage("Drive updated successfully!");
      } else {
        await createDrive(driveData);
        setMessage("Drive created successfully!");
      }
      setShowForm(false);
      setEditingDrive(null);
      fetchDrives();
    } catch (err) {
      console.error("Failed to save drive:", err);
      setError('Failed to save drive. Please check the details and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (drive: VaccinationDrive) => {
    setEditingDrive(drive);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this drive?')) {
      setIsLoading(true);
      setMessage(null);
      setError(null);
      try {
        await deleteDrive(id);
        setMessage("Drive deleted successfully!");
        fetchDrives();
      } catch (err) {
        console.error("Failed to delete drive:", err);
        setError('Failed to delete drive.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const openNewDriveForm = () => {
    setEditingDrive(null);
    setShowForm(true);
  };

  return (
    <div>
      <h1 className="page-title">Vaccination Drives</h1>
      
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      <button onClick={openNewDriveForm} style={{ marginBottom: '1rem' }}>
        {showForm && !editingDrive ? 'Cancel Add Drive' : 'Add New Drive'}
      </button>

      {showForm && (
        <DriveForm
          initialData={editingDrive}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingDrive(null);
          }}
        />
      )}

      {isLoading && <p>Loading drives...</p>}

      {!isLoading && !error && drives.length === 0 && <p>No active drives found.</p>}
      {!isLoading && !error && drives.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Vaccine Name</th>
              <th>Date</th>
              <th>Applicable Classes</th>
              <th>Available Doses</th>
              <th>Completed</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {drives.map((drive) => (
              <tr key={drive.id}>
                <td>{drive.vaccineName}</td>
                <td>{new Date(drive.driveDate).toLocaleDateString()}</td>
                <td>{drive.applicableClasses.join(', ')}</td>
                <td>{drive.availableDoses}</td>
                <td>{drive.completed ? 'Yes' : 'No'}</td>
                <td className="actions">
                  <button onClick={() => handleEdit(drive)}>Edit</button>
                  <button onClick={() => handleDelete(drive.id!)} className="danger">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DrivesPage;