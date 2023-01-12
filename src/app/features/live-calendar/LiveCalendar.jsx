import { Button, CircularProgress, IconButton, LinearProgress, Pagination } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { getLiveCalendar, refreshLiveData } from "./liveCalendarSlice";
import { getCountries } from "../calendar/calendarSlice";
import { Input, Select } from "antd";
import ClearIcon from '@mui/icons-material/Clear';

import styles from "./LiveStyles.module.css";
import { useNavigate } from "react-router-dom";

export default function LiveCalendar() {

  const dispatch = useDispatch();

  const liveCalendar = useSelector(state => state.liveCalendar.liveCalendar);
  const loadingLiveCalendar = useSelector(state => state.liveCalendar.loadingLiveCalendar);
  const totalItems = useSelector(state => state.liveCalendar.liveCalendarItems);
  const countries = useSelector(state => state.calendar.countries);
  const loadingCountries = useSelector(state => state.calendar.loadingCountries);
  const refreshingLiveData = useSelector(state => state.liveCalendar.refreshingLiveData);

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getLiveCalendar({ page: 1, country: null, search: '' }))
  }, [dispatch]);

  useEffect(() => {
    dispatch(getCountries())
  }, [dispatch])

  useEffect(() => {
    if (totalItems) {
      setTotalPages(totalItems % 15 === 0 ? parseInt(totalItems / 15) : parseInt(totalItems / 15) + 1)
    } else {
      setTotalPages(0);
    }
  }, [totalItems])

  const loadLive = (pageNo, send = true) => {
    setPage(pageNo);
    let obj = { page: pageNo, ...(send ? { country: selectedCountry, search: search } : {}) }
    console.log(obj);
    dispatch(getLiveCalendar(obj));
  }

  const refreshData = () => {
    dispatch(refreshLiveData()).then(() => {
      loadLive(1);
    })
  }

  const onEventClick = (eventDetails) => {
    navigate(`/live-calendar/${eventDetails.event_id}`)
  }

  const clearSearch = () => {
    setSelectedCountry(null);
    setSearch('');
    loadLive(1, false)
  }

  return (
    <div className="py-4">
      <div className="container-xxl">
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between">
              <div className="h4 fw-semibold">Live Calendar</div>
              <div className="px-2 d-flex align-items-center justify-content-end">
                {refreshingLiveData ? (<CircularProgress size={16} />) : ""}
                <div className="ps-2">
                  <Button variant="text" onClick={refreshData} disabled={refreshingLiveData} size="small">
                    Refresh Data
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container-xxl py-3">
        <div className="row align-items-end">
          <div className="col-4">
            <div>
              <div className="cs-label">Country / Zone</div>
              <Select
                className='w-100'
                options={countries.map(country => ({ label: country.name ? country.name : country.short_name, value: country.short_name }))}
                value={selectedCountry}
                loading={loadingCountries}
                showSearch
                clearIcon
                disabled={loadingCountries || loadingLiveCalendar}
                onChange={(v) => setSelectedCountry(v)}
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                placeholder="Select Country / Zone" />
            </div>
          </div>
          <div className="col-4">
            <div className="cs-label">Search Event Name</div>
            <Input
              className="w-100"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="col-2 pb-1 px-0">
            <IconButton className="p-1" disabled={loadingLiveCalendar} color="error" onClick={clearSearch}>
              <ClearIcon sx={{ fontSize: "16px" }} />
            </IconButton>
            <Button size="small" disabled={loadingLiveCalendar} onClick={() => loadLive(1)}>Search</Button>
          </div>
        </div>
        <div className="row">
          <div className="col-12 pt-3">
            <div style={{ height: "5px" }}>
              {loadingLiveCalendar ? (
                <LinearProgress />
              ) : ""}
            </div>
            <div className="table-responsive">
              <table className="table table-bordered border-primary">
                <thead>
                  <tr>
                    <th scope="col" width="10%">Date</th>
                    <th scope="col" width="60%">Event</th>
                    <th scope="col" width="10%">Country</th>
                    <th scope="col" width="10%">Actual</th>
                    <th scope="col" width="10%">Previous</th>
                  </tr>
                </thead>
                <tbody>
                  {liveCalendar.map(item => (
                    <tr key={item.id.toString()}>
                      <td>{dayjs(item.date).format("MMM DD YYYY")}</td>
                      <td><div className={styles.ClickableText} onClick={() => onEventClick(item)}>{item.event_name}</div></td>
                      <td>{item.country}</td>
                      <td>{item.actual}</td>
                      <td>{item.previous}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="pt-2 d-flex justify-content-end">
              <Pagination disabled={loadingLiveCalendar} page={page} onChange={(_, no) => loadLive(no)} count={totalPages} shape="rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
