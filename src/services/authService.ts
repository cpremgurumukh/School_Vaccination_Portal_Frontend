import apiClient from './apiClient';

// Matches AuthRequest class in backend
export interface AuthRequest {
  username: string;
  password: string;
}

// Matches AuthResponse class in backend for login
export interface AuthResponse {
  success: boolean;
  // The backend login doesn't return user details, so we'll fetch them separately if needed
  // or rely on the session being established.
}

// For signup, the backend returns a string or a ResponseEntity with a string body
// We'll assume a successful signup returns a simple message.
export interface MessageResponse { // Re-using this from previous JWT setup
  message: string;
}

/**
 * Makes a POST request to the login endpoint.
 * @param credentials The username and password.
 * @returns A promise that resolves with the AuthResponse.
 */
export const login = async (credentials: AuthRequest): Promise<AuthResponse> => {
  try {
    // The backend /api/login now returns AuthResponse { success: true }
    // or a 400 with a string body "Invalid username or password"
    const response = await apiClient.post<AuthResponse>('/login', credentials); // Endpoint changed
    return response.data;
  } catch (error: any) {
    console.error("Error in authService.login:", error);
    // If backend sends a string error message for 400/401
    if (error.response && error.response.data && typeof error.response.data === 'string') {
        throw new Error(error.response.data);
    }
    throw error;
  }
};

/**
 * Makes a POST request to the signup endpoint.
 * @param userData The username, password, and other signup details.
 * @returns A promise that resolves with a success message.
 */
export const signup = async (userData: AuthRequest): Promise<string> => { // Backend returns string
  try {
    // Backend /api/register returns a string "User registered successfully" or a 400 with "Username already exists"
    const response = await apiClient.post<string>('/register', userData); // Endpoint changed
    return response.data; // This will be the success string
  } catch (error: any) {
    console.error("Error in authService.signup:", error);
    // If backend sends a string error message for 400
    if (error.response && error.response.data && typeof error.response.data === 'string') {
        throw new Error(error.response.data);
    }
    throw error;
  }
};
