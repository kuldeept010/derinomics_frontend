import { Table } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
export default function EventsDataTable() {

  const calendarEvents = useSelector(state => state.calendar.calendarEvents);
  const loadingCalendar = useSelector(state => state.calendar.loadingCalendar);

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
                <h6>Events History</h6>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container-xxl">
        <div className="row">
          <div className="col-12">
            <Table rowKey="id" loading={loadingCalendar} columns={columns} size="small" dataSource={calendarEvents} scroll={{ y: 400 }} />
          </div>
        </div>
      </div>
    </div>
  )
}