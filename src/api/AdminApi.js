import apiClient from "./apiClient";
import { AdminaddVendorUrl } from "./urlConstants";

export const AdminaddVendorApi = async (name, email, password, phone, orgName, location, type) => {
  try {
    const response = await apiClient.post(AdminaddVendorUrl, { name, email, password, phone, orgName, location, type });
    return response.data;
  } catch (error) {
    throw error;
  }
}