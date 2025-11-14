import apiClient from "./apiClient";
import { VendorloginUrl } from "./urlConstants";

export const VendorloginApi = async (email, password) => {
  try {
    const response = await apiClient.post(VendorloginUrl, {
      email: email,
      password: password
    });
    return response.data;   
  } catch (error) {
    throw error;    
  }   
}

