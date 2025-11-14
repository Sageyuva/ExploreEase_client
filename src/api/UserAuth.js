import apiClient from "./apiClient";
import {UserloginUrl , UserregisterUrl, UserProfileUrl, UserBookingsUrl} from "./urlConstants";

export const UserloginApi = async (email , password) => {
 try {
    const response = await apiClient.post(UserloginUrl, {
      email: email,
      password: password
    });
    return response.data;   
 } catch (error) {
    throw error;    
    alert("Login failed. Please check your credentials and try again.");
 }   
}

export const UserregisterApi = async (name, email , password ) => {
   try {
      const response = await apiClient.post(UserregisterUrl, {  
        name: name,
        email: email,
        password: password
      });
      return response.data;   
   } catch (error) {
      throw error;    
      alert("Registration failed. Please check your details and try again.");
   }
}

export const UserProfileApi = async () => {
  try {
    const response = await apiClient.get(UserProfileUrl);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const UserBookingsApi = async () => {
  try {
    const response = await apiClient.get(UserBookingsUrl);
    return response.data;
  } catch (error) {
    throw error;
  }
}