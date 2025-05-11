import apiClient from './apiClient';
import { VaccinationDrive } from '../types/drive.types';

// Payload for creating/updating a drive
export interface DrivePayload {
  vaccineName: string;
  date: string; // YYYY-MM-DD
  availableDoses: number;
  applicableClasses: string[];
  completed: boolean;
}

/**
 * Creates a new vaccination drive.
 * Assumes backend endpoint POST /api/drives
 */
export const createDrive = async (driveData: DrivePayload): Promise<VaccinationDrive> => {
  try {
    // Assuming your backend endpoint for drives is /api/drives
    const response = await apiClient.post<VaccinationDrive>('/drives', driveData);
  return response.data;
  } catch (error) {
    console.error("Error creating drive:", error);
    throw error;
  }
};

/**
 * Updates an existing vaccination drive.
 * Assumes backend endpoint PUT /api/drives/{id}
 */
export const updateDrive = async (id: number, driveData: DrivePayload): Promise<VaccinationDrive> => {
  try {
    const response = await apiClient.put<VaccinationDrive>(`/drives/${id}`, driveData);
  return response.data;
  } catch (error) {
    console.error(`Error updating drive ${id}:`, error);
    throw error;
  }
};

/**
 * Deletes a vaccination drive.
 * Assumes backend endpoint DELETE /api/drives/{id}
 */
export const deleteDrive = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/drives/${id}`);
  } catch (error) {
    console.error(`Error deleting drive ${id}:`, error);
    throw error;
  }
};

/**
 * Fetches all vaccination drives (or upcoming ones, adjust endpoint as needed).
 * Assumes backend endpoint GET /api/drives
 * Or GET /api/drives/upcoming if you have a specific one
 */
export const getDrives = async (): Promise<VaccinationDrive[]> => { // Renamed from getUpcomingDrives for generality
  try {
    // Adjust endpoint if you have a specific one for "upcoming" or all
    const response = await apiClient.get<VaccinationDrive[]>('/drives/upcoming');
    return response.data;
  } catch (error) {
    console.error("Error fetching drives:", error);
    throw error;
  }
};

/**
 * Fetches a single drive by ID.
 * Assumes backend endpoint GET /api/drives/{id}
 */
export const getDriveById = async (id: number): Promise<VaccinationDrive> => {
    try {
        const response = await apiClient.get<VaccinationDrive>(`/drives/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching drive ${id}:`, error);
        throw error;
    }
};