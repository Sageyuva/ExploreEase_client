import apiClient from "./apiClient";
import {
  UserGetFlightsUrl, UserBookFlightUrl,
  UserGetHotelsUrl, UserBookHotelUrl, UserGetHolidaysUrl,
  UserGetShopsUrl, UserGetGuidesUrl,
  UserGetCurrencyUrl, UserGetEventsUrl,
  UserChatbotUrl
} from "./urlConstants";

// Flights
export const UserGetFlightsApi = async (from, to, date, sortBy, sortOrder) => {
  try {
    const params = {};
    if (from) params.from = from;
    if (to) params.to = to;
    if (date) params.date = date;
    if (sortBy) params.sortBy = sortBy;
    if (sortOrder) params.sortOrder = sortOrder;
    const response = await apiClient.get(UserGetFlightsUrl, { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const UserBookFlightApi = async (flightId, seatsBooked) => {
  try {
    const response = await apiClient.post(UserBookFlightUrl, { flightId, seatsBooked });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Hotels
export const UserGetHotelsApi = async (location, sortBy, sortOrder) => {
  try {
    const params = {};
    if (location) params.location = location;
    if (sortBy) params.sortBy = sortBy;
    if (sortOrder) params.sortOrder = sortOrder;
    const response = await apiClient.get(UserGetHotelsUrl, { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const UserBookHotelApi = async (hotelId, roomsBooked) => {
  try {
    const response = await apiClient.post(UserBookHotelUrl, { hotelId, roomsBooked });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Holidays
export const UserGetHolidaysApi = async (location, sortBy, sortOrder) => {
  try {
    const params = {};
    if (location) params.location = location;
    if (sortBy) params.sortBy = sortBy;
    if (sortOrder) params.sortOrder = sortOrder;
    const response = await apiClient.get(UserGetHolidaysUrl, { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const UserBookHolidayApi = async (holidayId, travelers, date) => {
  try {
    const response = await apiClient.post(UserBookHolidayUrl, { holidayId, travelers, date });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Shops
export const UserGetShopsApi = async (location, sortBy, sortOrder) => {
  try {
    const params = {};
    if (location) params.location = location;
    if (sortBy) params.sortBy = sortBy;
    if (sortOrder) params.sortOrder = sortOrder;
    const response = await apiClient.get(UserGetShopsUrl, { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Guides
export const UserGetGuidesApi = async (location, expertiseLocation, status, sortBy, sortOrder) => {
  try {
    const params = {};
    if (location) params.location = location;
    if (expertiseLocation) params.expertiseLocation = expertiseLocation;
    if (status) params.status = status;
    if (sortBy) params.sortBy = sortBy;
    if (sortOrder) params.sortOrder = sortOrder;
    const response = await apiClient.get(UserGetGuidesUrl, { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const UserBookGuideApi = async (guideId, date, hours) => {
  try {
    const response = await apiClient.post(UserBookGuideUrl, { guideId, date, hours });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Currency
export const UserGetCurrencyApi = async (location, currencyType, status, sortBy, sortOrder) => {
  try {
    const params = {};
    if (location) params.location = location;
    if (currencyType) params.currencyType = currencyType;
    if (status) params.status = status;
    if (sortBy) params.sortBy = sortBy;
    if (sortOrder) params.sortOrder = sortOrder;
    const response = await apiClient.get(UserGetCurrencyUrl, { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const UserBookCurrencyApi = async (currencyId, amount) => {
  try {
    const response = await apiClient.post(UserBookCurrencyUrl, { currencyId, amount });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Events
export const UserGetEventsApi = async (location, eventDate, sortBy, sortOrder) => {
  try {
    const params = {};
    if (location) params.location = location;
    if (eventDate) params.eventDate = eventDate;
    if (sortBy) params.sortBy = sortBy;
    if (sortOrder) params.sortOrder = sortOrder;
    const response = await apiClient.get(UserGetEventsUrl, { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const UserBookEventApi = async (eventId, ticketsBooked) => {
  try {
    const response = await apiClient.post(UserBookEventUrl, { eventId, ticketsBooked });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Chatbot
export const UserChatbotApi = async (question, location, destination, city, hotelName, from, to) => {
  try {
    const response = await apiClient.post(UserChatbotUrl, {
      question,
      location,
      destination,
      city,
      hotelName,
      from,
      to
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

