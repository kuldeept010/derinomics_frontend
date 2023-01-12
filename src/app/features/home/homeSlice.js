import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const homeSlice = createSlice({
  name: 'home',
  initialState: {
    loadingEvents: false,
    events: [],
    loadingHistory: false,
    eventsHistory: []
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getEventsByType.pending, (state, action) => {
        state.loadingEvents = true
      })
      .addCase(getEventsByType.fulfilled, (state, action) => {
        state.events = action.payload
        state.loadingEvents = false
      })
  }
})

export const getEventsByType = createAsyncThunk('home/getEventsByType', async (type) => {
  const response = await axios({
    url: '/api/v1/events',
    method: 'GET',
    baseURL: process.env.REACT_APP_BASE_URL,
    params: {
      type: type
    },
    headers: {
      Accept: "application/json",
      'Content-Type': 'application/json'
    }
  });
  return response.data;
});

export default homeSlice.reducer;
