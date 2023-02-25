import { notification, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllEventsCorrelations } from "./calendarSlice";

export default function CorrelationTable({ selectedEvent }) {

  const loading = useSelector(state => state.calendar.loadingCorrelations);

  const dispatch = useDispatch();
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    if (selectedEvent) {
      dispatch(getAllEventsCorrelations(selectedEvent)).unwrap().then((res) => {
        setDataSource(res);
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

  const columns = [{
    title: "Events",
    dataIndex: 'event_name',
    rowSpan: 1
  },
  {
    title: "Correlation",
    dataIndex: "corr",
    render: (val) => <span>{val === "NaN" ? "-" : val}</span>,
    fixed: 'right',
  }]

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
              <Table size="small" loading={loading} columns={columns} dataSource={dataSource} rowKey="event2Id" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}