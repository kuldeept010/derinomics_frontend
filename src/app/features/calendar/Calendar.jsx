import { useState, useEffect } from "react";
import { Button, Select } from 'antd';
import { useDispatch, useSelector } from "react-redux";
import { getCountries, getEventNamesByCountry, getCalendarEvents } from "./calendarSlice";
import CorrelationTable from "./CorrelationTable";
import EventsDataTable from "./EventsDataTable";

export default function Calendar() {

  const dispatch = useDispatch();

  const countries = useSelector(state => state.calendar.countries);
  const events = useSelector(state => state.calendar.events);
  const loadingCountries = useSelector(state => state.calendar.loadingCountries);
  const loadingEvents = useSelector(state => state.calendar.loadingEvents);

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedEvents, setSelectedEvents] = useState([]);

  useEffect(() => {
    dispatch(getCountries());
  }, [dispatch]);

  useEffect(() => {
    if (selectedCountry) {
      dispatch(getEventNamesByCountry(selectedCountry));
    }
    setSelectedEvents([]);
  }, [dispatch, selectedCountry]);

  const getEvents = () => {
    if (selectedEvents && selectedEvents.length > 0) {
      dispatch(getCalendarEvents(selectedEvents))
    }
  }

  return (
    <div>
      <div className="container-xxl pt-3">
        <div className="row align-items-end">
          <div className="col-sm-6 col-md-4 col-lg-3 col-xl-2">
            <div>
              <div className="cs-label">Country / Zone</div>
              <Select
                className='w-100'
                options={countries.map(country => ({ label: country.name, value: country.id }))}
                value={selectedCountry}
                loading={loadingCountries}
                disabled={loadingCountries}
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                placeholder="Select Country / Zone" onChange={(v) => setSelectedCountry(v)} />
            </div>
          </div>
          <div className="col-sm-12 col-md-6 col-lg-6 col-xl-4">
            <div>
              <div className="cs-label">Event</div>
              <Select
                className="w-100 cs-ant-select"
                placeholder="Select Events"
                mode="multiple"
                loading={loadingEvents}
                disabled={selectedCountry === null}
                value={selectedEvents}
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                autoClearSearchValue={false}
                onChange={(v) => setSelectedEvents(v)}
                options={events.map(event => ({ label: `${event.name} - (${event.calendarEvents})`, value: event.id }))}
              />
            </div>
          </div>
          <div className="col-sm-6 col-md-2 col-lg-2 col-xl-2">
            <div>
              <Button type="primary" onClick={getEvents} disabled={selectedEvents.length === 0}>Get Data</Button>
            </div>
          </div>
        </div>
      </div>
      <CorrelationTable selectedEvents={selectedEvents} />
      <EventsDataTable />
    </div>
  )
}