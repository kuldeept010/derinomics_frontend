import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const liveCalendarSlice = createSlice({
  name: 'liveCalendar',
  initialState: {
    loadingLiveCalendar: false,
    liveCalendar: [],
    liveCalendarItems: 0,
    refreshingLiveData: false,
    eventDetails: null,
    loadingEventDetails: false,
  },
  reducers: {
    clearEvent(state) {
      state.eventDetails = null;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(getLiveCalendar.pending, (state, action) => {
        state.loadingLiveCalendar = true
      })
      .addCase(getLiveCalendar.fulfilled, (state, action) => {
        state.liveCalendar = action.payload.calendar
        state.liveCalendarItems = action.payload.total
        state.loadingLiveCalendar = false
      })
      .addCase(refreshLiveData.pending, (state, action) => {
        state.refreshingLiveData = true
      })
      .addCase(refreshLiveData.fulfilled, (state, action) => {
        state.refreshingLiveData = false
      })
      .addCase(getEventDetails.pending, (state, action) => {
        state.loadingEventDetails = true
      })
      .addCase(getEventDetails.fulfilled, (state, action) => {
        state.eventDetails = action.payload;
        state.loadingEventDetails = false
      })
  }
})

export const getLiveCalendar = createAsyncThunk('liveCalendar/getLiveCalendar', async (params) => {
  let { page = 1, country = null, search = '' } = params;
  const response = await axios({
    url: `/api/v1/calendar-events/live`,
    method: 'GET',
    params: {
      page: page,
      ...(country !== null ? { country: country } : {}),
      ...(search ? { search: search } : {})
    },
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  });
  return response.data;
});

export const refreshLiveData = createAsyncThunk('liveCalendar/refreshLiveData', async () => {
  const response = await axios({
    url: `/api/v1/calendar-events/refresh`,
    method: 'GET',
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  })
  return response.data;
})

export const getEventDetails = createAsyncThunk('liveCalendar/getEventDetails', async (eventId) => {
  const response = await axios({
    url: `/api/v1/events/${eventId}`,
    method: 'GET',
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  })
  return response.data;
})

export const { clearEvent } = liveCalendarSlice.actions;
export default liveCalendarSlice.reducer;
