import { configureStore } from '@reduxjs/toolkit'
import calendarReducer from './features/calendar/calendarSlice'
import liveCalendarReducer from './features/live-calendar/liveCalendarSlice';
import homeReducer from './features/home/homeSlice'

export default configureStore({
  reducer: {
    calendar: calendarReducer,
    liveCalendar: liveCalendarReducer,
    home: homeReducer
  }
})