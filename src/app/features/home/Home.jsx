import { Select } from "antd";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCalendarEvents } from "../calendar/calendarSlice";
import { getHomeEvents } from "./homeSlice";
import correlationCoefficientR from "../../../correlation";
import { CircularProgress } from "@mui/material";
import { useEffect } from "react";

export default function Home() {

  const dispatch = useDispatch();

  const [event1, setEvent1] = useState(null);
  const [event2, setEvent2] = useState(null);
  const [correlation, setCorrelation] = useState(null);
  const [loadingCorrelation, setLoadingCorrelation] = useState(false);

  const events = useSelector(state => state.home.events);
  const loadingEvents = useSelector(state => state.home.loadingEvents);

  useEffect(() => {
    const getEvents = () => {
      dispatch(getHomeEvents())
    }
    getEvents();
  }, [dispatch]);

  useEffect(() => {
    const getCorrelation = () => {
      setLoadingCorrelation(true);
      setCorrelation(null);
      dispatch(getCalendarEvents([event1, event2])).unwrap().then((res) => {
        let dataX = res.filter(x => x.event_id === event1 && x.actual !== null).map(y => y.actual);
        let dataY = res.filter(x => x.event_id === event2 && x.actual !== null).map(y => y.actual);
        if (dataX.length === dataY.length) {
          let correlation = correlationCoefficientR(dataX, dataY);
          // console.log(correlation);
          setCorrelation(correlation.toFixed(3))
        } else {
          setCorrelation("Invalid Data")
        }
      }).finally(() => setLoadingCorrelation(false))
    }

    if (event1 && event2) {
      getCorrelation();
    }
  }, [event1, event2, dispatch])

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
          <div className="col-lg-4 col-md-6">
            <div className="cs-label">Event 1</div>
            <Select
              className="w-100 cs-ant-select"
              placeholder="Select Event 1"
              loading={loadingEvents}
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
          <div className="col-lg-4 col-md-6">
            <div className="cs-label">Event 2</div>
            <Select
              className="w-100 cs-ant-select"
              placeholder="Select Event 2"
              loading={loadingEvents}
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
        </div>
      </div>
      <div className="container-xxl pt-3">
        <div className="row">
          <div className="col-lg-4 col-md-8 col-sm-12 offset-lg-2 offset-md-2">
            <div className="cs-card my-4">
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