import apiClient from "./apiClient";
import { AdminloginUrl } from "./urlConstants";

export const AdminloginApi = async (email, password) => {
  try {
    const response = await apiClient.post(AdminloginUrl, {
      email: email,
      password: password
    });
    return response.data;   
  } catch (error) {
    throw error;    
  }   
}

