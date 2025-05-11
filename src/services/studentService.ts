import apiClient from './apiClient';
import { Student } from '../types/student.types';

// Payload for creating/updating a student
export interface StudentPayload {
  name: string;
  classGrade: string;
  studentId: string;
}

export interface SearchStudentParams {
  name?: string;
  classGrade?: string;
  studentId?: string;
  vaccineName?: string;
}

export const addStudent = async (studentData: StudentPayload): Promise<Student> => {
  try {
    const response = await apiClient.post<Student>('/students', studentData);
  return response.data;
  } catch (error) {
    console.error("Error in addStudent:", error);
    throw error;
  }
};

export const updateStudent = async (id: number, studentData: StudentPayload): Promise<Student> => {
  try {
    const response = await apiClient.put<Student>(`/students/${id}`, studentData);
  return response.data;
  } catch (error) {
    console.error(`Error updating student ${id}:`, error);
    throw error;
  }
};

export const deleteStudent = async (id: number): Promise<void> => {
  try {
  await apiClient.delete(`/students/${id}`);
  } catch (error) {
    console.error(`Error deleting student ${id}:`, error);
    throw error;
  }
};

export const searchStudents = async (params: SearchStudentParams): Promise<Student[]> => {
  try {
  const response = await apiClient.get<Student[]>('/students', { params });
  return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error searching students:", error);
    return [];
  }
};

export const getStudentById = async (id: number): Promise<Student> => {
  try {
    const response = await apiClient.get<Student>(`/students/${id}`);
  return response.data;
  } catch (error) {
    console.error(`Error fetching student ${id}:`, error);
    throw error;
  }
};

// --- NEW FUNCTION ---
/**
 * Marks a student as vaccinated by calling the backend's /api/students/vaccinate endpoint.
 * Sends data as request parameters.
 * @param studentId The ID of the student.
 * @param driveId The ID of the vaccination drive.
 * @param vaccineName The name of the vaccine administered.
 * @returns A promise that resolves with the updated Student object.
 */
export const markStudentVaccinated = async (
  studentId: number,
  driveId: number,
  vaccineName: string
): Promise<Student> => {
  try {
    // For @RequestParam on backend with POST, we can send data as URLSearchParams (x-www-form-urlencoded)
    // or as query parameters in the URL string. Query params are simpler here.
    const response = await apiClient.post<Student>(
      `/students/vaccinate?studentId=${studentId}&driveId=${driveId}&vaccineName=${encodeURIComponent(vaccineName)}`
    );
    return response.data; // Backend returns the updated student
  } catch (error) {
    console.error("Error marking student as vaccinated:", error);
    throw error;
  }
};

// --- ENSURE THIS FUNCTION IS PRESENT AND EXPORTED ---
export const bulkImportStudents = async (file: File): Promise<Student[]> => {
  const formData = new FormData();
  formData.append('file', file); // 'file' must match @RequestParam("file") on backend

  try {
    // Ensure your backend has this endpoint, e.g., /api/students/bulk-import
    const response = await apiClient.post<Student[]>('/students/bulk-import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error in bulk importing students:", error);
    throw error;
  }
};