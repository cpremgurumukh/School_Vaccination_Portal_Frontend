import apiClient from './apiClient';
import { DashboardData } from '../types/dashboard.types'; // Ensure this type is defined

/**
 * Fetches data for the dashboard.
 * Assumes backend endpoint GET /api/dashboard
 */
export const getDashboardData = async (): Promise<DashboardData> => {
  try {
    const response = await apiClient.get<DashboardData>('/dashboard'); // Ensure this endpoint matches your backend
  return response.data;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error; // Let the component handle the error display
  }
};