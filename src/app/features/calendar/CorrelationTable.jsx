import { Table } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import correlationCoefficientR from "../../../correlation";

export default function CorrelationTable({ selectedEvents }) {

  const calendar = useSelector(state => state.calendar.calendarEvents);
  const events = useSelector(state => state.calendar.events);

  const [dataSource, setDataSource] = useState([]);
  const [showError, setShowError] = useState(true);

  useEffect(() => {
    if (selectedEvents && selectedEvents.length === 2) {
      let dataX = calendar.filter(x => x.event_id === selectedEvents[0] && x.actual !== null).map(y => y.actual);
      let dataY = calendar.filter(x => x.event_id === selectedEvents[1] && x.actual !== null).map(y => y.actual);
      console.log(dataX, dataY);

      if (dataX.length && dataY.length) {
        let correlation = correlationCoefficientR(dataX, dataY);
        setDataSource([{
          id: selectedEvents[0],
          event_name: events.find(x => x.id === selectedEvents[0]).name,
          correlation: correlation,
        }, {
          id: selectedEvents[1],
          event_name: events.find(x => x.id === selectedEvents[1]).name,
          correlation: correlation
        }])
        setShowError(false);
      } else {
        setDataSource([]);
        setShowError(true);
      }
    } else {
      setDataSource([]);
      setShowError(true);
    }
  }, [events, calendar, selectedEvents])

  const columns = [{
    title: "Events",
    dataIndex: 'event_name',
    rowSpan: 1
  },
  {
    title: "Correlation",
    dataIndex: "correlation",
    rowSpan: 2,
    onCell: (_, index) => {
      if (index === 0) {
        return { rowSpan: 2 }
      }
      if (index === 1) {
        return { rowSpan: 0 }
      }
    },
    fixed: 'right',
  }]

  return (
    <div>
      <div className="container-xxl pt-3">
        <div className="row">
          <div className="col-12">
            <div>
              <div className="cs-label"><h6>Correlation Data <span style={{ color: "red", fontSize: "13px" }}>
                {showError ? " - Please select any 2 events to calculate Correlation value." : ""}
              </span></h6></div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div>
              <Table size="small" columns={columns} dataSource={dataSource} rowKey="id" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}