import { notification } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllEventsCorrelations } from "./calendarSlice";
import { LinearProgress, Pagination } from "@mui/material";
export default function CorrelationTable({ selectedEvent }) {

  const loading = useSelector(state => state.calendar.loadingCorrelations);

  const dispatch = useDispatch();
  const [dataSource, setDataSource] = useState([]);
  const [totalItems, setTotalItems] = useState(1);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (selectedEvent) {
      setPage(1);
      dispatch(getAllEventsCorrelations({ event: selectedEvent, page: 1, pageSize: 20 })).unwrap().then((res) => {
        setDataSource(res.events);   let items = res.rows;
        if (items) {
          setTotalItems(items % 20 === 0 ? parseInt(items / 20) : parseInt(items / 20) + 1)
        } else {
          setTotalItems(1)
        }
      }).catch(err => {
        setDataSource([]);
        console.log(err);
        notification.error({
          message: "Failed to load Correlation",
          description: err && err.message ? err.message : ""
        })
      })
    }
  }, [selectedEvent, dispatch])

  const loadPage = (pageNo) => {
    setPage(pageNo);
    dispatch(getAllEventsCorrelations({ event: selectedEvent, page: pageNo, pageSize: 20 })).unwrap().then((res) => {
      setDataSource(res.events);
      let items = res.rows;
      if (items) {
        setTotalItems(items % 20 === 0 ? parseInt(items / 20) : parseInt(items / 20) + 1)
      } else {
        setTotalItems(1)
      }
    }).catch(err => {
      setDataSource([]);
      console.log(err);
      notification.error({
        message: "Failed to load Correlation",
        description: err && err.message ? err.message : ""
      })
    })
  }

  return (
    <div>
      <div className="container-xxl pt-3">
        <div className="row">
          <div className="col-12">
            <div>
              <div className="cs-label"><h6>Correlation Data</h6></div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div>
              <div className="row">
                <div className="col-12 pt-3">
                  <div style={{ height: "5px" }}>
                    {loading ? (
                      <LinearProgress />
                    ) : ""}
                  </div>
                  <div className="table-responsive">
                    <table className="table table-bordered border-primary">
                      <thead>
                        <tr>
                          <th scope="col" width="70%">Event Name</th>
                          <th scope="col" width="30%">Correlation</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dataSource.map(event => (
                          <tr key={event.id.toString()}>
                            <td>{event.event_name}</td>
                            <td>{event.corr.toFixed(2)}</td>
                          </tr>
                        ))}
                        {dataSource.length === 0 ? (
                          <tr>
                            <td colSpan={2} className="text-center">No Events.</td>
                          </tr>
                        ) : null}
                      </tbody>
                    </table>
                  </div>
                  <div className="pt-2 d-flex justify-content-end">
                    <Pagination disabled={loading} page={page} onChange={(_, no) => loadPage(no)} count={totalItems} shape="rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}