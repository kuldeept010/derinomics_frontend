import { Button, Select } from "antd";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { eventTypes } from "../../utils/constants";
import { getCalendarEvents } from "../calendar/calendarSlice";
import { getEventsByType } from "./homeSlice";
import correlationCoefficientR from "../../../correlation";
import { CircularProgress } from "@mui/material";

export default function Home() {

  const dispatch = useDispatch();

  const [event1, setEvent1] = useState(null);
  const [event2, setEvent2] = useState(null);
  const [type, setType] = useState(null);
  const [correlation, setCorrelation] = useState(null);
  const [loadingCorrelation, setLoadingCorrelation] = useState(false);

  const events = useSelector(state => state.home.events);
  const loadingEvents = useSelector(state => state.home.loadingEvents);

  const getEvents = (eventType) => {
    if (eventType) {
      setType(eventType);
    }
    dispatch(getEventsByType(eventType))
  }

  const getCorrelation = () => {
    setLoadingCorrelation(true);
    setCorrelation(null);
    dispatch(getCalendarEvents([event1, event2])).unwrap().then((res) => {
      let dataX = res.filter(x => x.event_id === event1 && x.actual !== null).map(y => y.actual);
      let dataY = res.filter(x => x.event_id === event2 && x.actual !== null).map(y => y.actual);
      if (dataX.length === dataY.length) {
        let correlation = correlationCoefficientR(dataX, dataY);
        console.log(correlation);
        setCorrelation(correlation.toFixed(3))
      } else {
        setCorrelation("Invalid Data")
      }
    }).finally(() => setLoadingCorrelation(false))
  }

  return (
    <div className="py-4">
      <div className="container-xxl">
        <div className="row">
          <div className="col-12">
            <div className="h4 fw-semibold">Home</div>
          </div>
        </div>
      </div>
      <div className="container-xxl pt-2">
        <div className="row align-items-end">
          <div className="col-3">
            <div className="cs-label">Event Type</div>
            <Select
              className="w-100 cs-ant-select"
              options={eventTypes.map(x => ({ label: x, value: x }))}
              placeholder="Select Type"
              value={type}
              loading={loadingEvents}
              showSearch
              autoClearSearchValue={false}
              onChange={(v) => getEvents(v)}
            />
          </div>
          <div className="col-3">
            <div className="cs-label">Event 1</div>
            <Select
              className="w-100 cs-ant-select"
              placeholder="Select Event 1"
              loading={loadingEvents}
              disabled={type === null}
              value={event1}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              autoClearSearchValue={false}
              onChange={(v) => setEvent1(v)}
              options={events.map(event => ({
                label: `${event.name} - (${event._count && event._count.calendar_events ? event._count.calendar_events : ""})`,
                value: event.id
              }))}
            />
          </div>
          <div className="col-3">
            <div className="cs-label">Event 2</div>
            <Select
              className="w-100 cs-ant-select"
              placeholder="Select Event 2"
              loading={loadingEvents}
              disabled={type === null}
              value={event2}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              autoClearSearchValue={false}
              onChange={(v) => setEvent2(v)}
              options={events.map(event => ({
                label: `${event.name} - (${event._count && event._count.calendar_events ? event._count.calendar_events : ""})`,
                value: event.id
              }))}
            />
          </div>
          <div className="col-3">
            <Button type="primary" disabled={loadingCorrelation || (!event1 && !event2)} onClick={getCorrelation}>Get Correlation</Button>
          </div>
        </div>
      </div>
      <div className="container-xxl pt-3">
        <div className="row">
          <div className="col-4">
            <div className="cs-card">
              <div className="cs-card-title">Correlation {loadingCorrelation ? <CircularProgress thickness={6} size={14} sx={{ color: "#fff" }} /> : ""}</div>
              <div className="cs-body">
                <div className="display-6 fw-bold text-center">{correlation}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}