import apiClient from "./apiClient";
import {
  VendorAddFlightUrl, VendorGetFlightsUrl,
  VendorAddHotelsUrl, VendorGetHotelsUrl,
  VendorAddHolidaysUrl, VendorGetHolidaysUrl,
  VendorAddShopsUrl, VendorGetShopsUrl,
  VendorAddGuidesUrl, VendorGetGuidesUrl,
  VendorAddCurrencyUrl, VendorGetCurrencyUrl,
  VendorAddEventsUrl, VendorGetEventsUrl
} from "./urlConstants";

// Flights
export const VendorAddFlightApi = async (flightData) => {
  try {
    const response = await apiClient.post(VendorAddFlightUrl, flightData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const VendorGetFlightsApi = async () => {
  try {
    const response = await apiClient.get(VendorGetFlightsUrl);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Hotels
export const VendorAddHotelsApi = async (hotelData) => {
  try {
    const response = await apiClient.post(VendorAddHotelsUrl, hotelData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const VendorGetHotelsApi = async () => {
  try {
    const response = await apiClient.get(VendorGetHotelsUrl);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Holidays
export const VendorAddHolidaysApi = async (holidayData) => {
  try {
    const response = await apiClient.post(VendorAddHolidaysUrl, holidayData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const VendorGetHolidaysApi = async () => {
  try {
    const response = await apiClient.get(VendorGetHolidaysUrl);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Shops
export const VendorAddShopsApi = async (shopData) => {
  try {
    const response = await apiClient.post(VendorAddShopsUrl, shopData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const VendorGetShopsApi = async () => {
  try {
    const response = await apiClient.get(VendorGetShopsUrl);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Guides
export const VendorAddGuidesApi = async (guideData) => {
  try {
    const response = await apiClient.post(VendorAddGuidesUrl, guideData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const VendorGetGuidesApi = async () => {
  try {
    const response = await apiClient.get(VendorGetGuidesUrl);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Currency
export const VendorAddCurrencyApi = async (currencyData) => {
  try {
    const response = await apiClient.post(VendorAddCurrencyUrl, currencyData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const VendorGetCurrencyApi = async () => {
  try {
    const response = await apiClient.get(VendorGetCurrencyUrl);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Events
export const VendorAddEventsApi = async (eventData) => {
  try {
    const response = await apiClient.post(VendorAddEventsUrl, eventData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const VendorGetEventsApi = async () => {
  try {
    const response = await apiClient.get(VendorGetEventsUrl);
    return response.data;
  } catch (error) {
    throw error;
  }
};

