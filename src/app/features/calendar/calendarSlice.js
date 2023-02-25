import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const calendarSlice = createSlice({
  name: 'calendar',
  initialState: {
    loadingCountries: false,
    countries: [],
    events: [],
    loadingEvents: false,
    loadingCalendar: false,
    calendarEvents: [],
    loadingCorrelations: false,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getCountries.pending, (state, action) => {
        state.loadingCountries = true
      })
      .addCase(getCountries.fulfilled, (state, action) => {
        state.countries = action.payload
        state.loadingCountries = false
      })
      .addCase(getEventNamesByCountry.pending, (state, action) => {
        state.loadingEvents = true
      })
      .addCase(getEventNamesByCountry.fulfilled, (state, action) => {
        state.events = JSON.parse(action.payload.body)
        state.loadingEvents = false
      })
      .addCase(getCalendarEvents.pending, (state, action) => {
        state.loadingCalendar = true
      })
      .addCase(getCalendarEvents.fulfilled, (state, action) => {
        state.calendarEvents = action.payload
        state.loadingCalendar = false
      })
      .addCase(getAllEventsCorrelations.pending, (state, action) => {
        state.loadingCorrelations = true
      }).addCase(getAllEventsCorrelations.fulfilled, (state, action) => {
        state.loadingCorrelations = false
      }).addCase(getAllEventsCorrelations.rejected, (state, action) => {
        state.loadingCorrelations = false
      })
  }
})

export const getCountries = createAsyncThunk('calendar/getCountries', async () => {
  const response = await axios({
    url: '/api/v1/countries',
    method: 'GET',
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
      Accept: "application/json",
      'Content-Type': 'application/json'
    }
  });
  return response.data;
});

export const getEventNamesByCountry = createAsyncThunk('calendar/getEventsByCountry', async (countryId) => {
  const response = await axios({
    url: `/api/v1/events/all/${countryId}`,
    method: 'GET',
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  });
  return response.data;
});

export const getCalendarEvents = createAsyncThunk('calendar/getCalendarEventsById', async (events) => {
  const response = await axios({
    url: `/api/v1/calendar-events?events=${events.join(',')}`,
    method: 'GET',
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  });
  return response.data;
});

export const updateEvent = createAsyncThunk('calendar/updateEvent', async (formData) => {
  let { event_id } = formData;
  const response = await axios({
    url: `/api/v1//events/${event_id}`,
    method: 'PUT',
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded"
    },
    data: formData
  });
  return response.data;
})

export const getAllEventsCorrelations = createAsyncThunk('calendar/getEventCorrelations', async ({id, total}) => {
  const response = await axios({
    url: `/correlate?eventId=${id}&totalEvents=${total}`,
    method: 'GET',
    baseURL: process.env.REACT_APP_CORRELATE_URL,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
  return response.data;
})

export default calendarSlice.reducer;
