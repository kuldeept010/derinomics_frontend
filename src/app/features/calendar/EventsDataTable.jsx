import { Table } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import dayjs from "dayjs";
import { getEventDetails } from "../live-calendar/liveCalendarSlice";

export default function EventsDataTable({ selectedEvent }) {

  const dispatch = useDispatch();

  const [eventHistory, setEventHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getDetails = () => {
      setLoading(true);
      dispatch(getEventDetails(selectedEvent.id)).unwrap().then(res => {
        if (res.calendar_events) {
          setEventHistory(res.calendar_events);
        }
      }).catch(err => {
        console.log(err);
      }).finally(() => setLoading(false))
    }
    if (selectedEvent) {
      getDetails()
    }
  }, [selectedEvent, dispatch])

  const columns = [
    {
      title: 'Event',
      dataIndex: 'event_name',
      ellipsis: true
    },
    {
      title: 'Date',
      dataIndex: 'date',
      render: (text) => dayjs(text).format("DD-MM-YYYY")
    },
    {
      title: 'Actual',
      dataIndex: 'actual',
    },
    {
      title: 'Previous',
      dataIndex: 'previous',
    }
  ]

  return (
    <div>
      <div className="container-xxl pt-3">
        <div className="row">
          <div className="col-12">
            <div>
              <div className="cs-label">
                <h6>Event History</h6>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container-xxl">
        <div className="row">
          <div className="col-12">
            <Table rowKey="id" loading={loading} columns={columns} size="small" dataSource={eventHistory} scroll={{ y: 400 }} />
          </div>
        </div>
      </div>
    </div>
  )
}