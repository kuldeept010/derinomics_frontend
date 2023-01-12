import { Button, CircularProgress } from "@mui/material";
import dayjs from "dayjs";
import { Modal, notification, Select } from "antd";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom";
import { clearEvent, getEventDetails } from "./liveCalendarSlice";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { eventTypes } from "../../utils/constants";
import { updateEvent } from "../calendar/calendarSlice";

export default function EventDetails() {

  const dispatch = useDispatch();

  const { eventId } = useParams();

  const loadingEventDetails = useSelector(state => state.liveCalendar.loadingEventDetails);
  const eventDetails = useSelector(state => state.liveCalendar.eventDetails);

  const [submittingForm, setSubmittingForm] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [type, setType] = useState(null);

  useEffect(() => {
    dispatch(getEventDetails(eventId))
    return () => {
      dispatch(clearEvent())
    }
  }, [dispatch, eventId]);

  const onAddToHome = () => {
    setOpenModal(true);
    if (eventDetails.event_type) {
      setType(eventDetails.event_type);
    }
  }

  const onSave = (isAdd = true) => {
    setSubmittingForm(true);
    let formData = {
      event_id: eventId,
      show_at_home: isAdd ? 1 : false,
      event_type: isAdd ? type : eventDetails.event_type
    }
    dispatch(updateEvent(formData)).unwrap().then(() => {
      if (isAdd) {
        notification.success({
          message: "Success",
          description: "Event Added to Home Successfully."
        })
        setOpenModal(false);
      } else {
        notification.success({
          message: "Success",
          description: "Event Removed from Home Successfully."
        })
        setConfirmModal(false);
      }
    }).catch((err) => {
      console.log(err);
      notification.error({
        message: "Error!",
        description: "There was an error while saving data."
      })
    }).finally(() => setSubmittingForm(false))
  }

  const onClose = () => {
    setType(null);
    setSubmittingForm(false);
    dispatch(getEventDetails(eventId))
  }

  const onRemoveFromHome = () => {
    setConfirmModal(true);
  }

  return (
    <div>
      <div className="py-4">
        <div className="container-xxl">
          <div className="row">
            <div className="col-12">
              <div className="d-flex justify-content-between">
                <div className="h4 fw-semibold">Event Details {loadingEventDetails ? <CircularProgress size={16} /> : ""}</div>
              </div>
            </div>
          </div>
        </div>
        {eventDetails ? (
          <div>
            <div className="container-xxl pt-2">
              <div className="row">
                <div className="col-12">
                  <div className="d-flex justify-content-between">
                    <div className="h6 fw-semibold">{eventDetails.name}</div>
                    <div>
                      {eventDetails.show_at_home ? (
                        <Button color="error" onClick={onRemoveFromHome} variant="outlined" disabled={loadingEventDetails} startIcon={<RemoveIcon />} size="small">Remove from Home</Button>
                      ) : (
                        <Button variant="outlined" disabled={loadingEventDetails} onClick={onAddToHome} startIcon={<AddIcon />} size="small">Add to Home</Button>
                      )}
                    </div>
                  </div>
                  <div className="">{eventDetails.country.name ? `${eventDetails.country.name} - ${eventDetails.country.short_name}` : eventDetails.country.short_name}</div>
                  <div>{eventDetails.event_type ? `Occurance - ${eventDetails.event_type}` : ""}</div>
                </div>
              </div>
            </div>
            <div className="container-xxl pt-3">
              <div className="row">
                <div className="col-12">
                  <div className="h6 fw-semibold">History</div>
                  <div>
                    <table className="table table-bordered border-primary">
                      <thead>
                        <tr>
                          <th scope="col" width="10%">Date</th>
                          <th scope="col" width="70%">Event</th>
                          <th scope="col" width="10%">Actual</th>
                          <th scope="col" width="10%">Previous</th>
                        </tr>
                      </thead>
                      <tbody>
                        {eventDetails.calendar_events.map(record => (
                          <tr key={record.id.toString()}>
                            <td>{dayjs(record.date).format("MMM DD YYYY")}</td>
                            <td>{record.event_name}</td>
                            <td>{record.actual}</td>
                            <td>{record.previous}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : ""}
      </div>
      {eventDetails && Object.keys(eventDetails).length > 0 ? (
        <Modal
          title={`Add ${eventDetails.name} to Home`}
          centered
          open={openModal}
          afterClose={onClose}
          footer={null}
          closable={false}
          maskClosable={false}
        >
          <div className="container-fluid px-0">
            <div className="row">
              <div className="col-12">
                <div className="">Please select event type</div>
                <Select
                  className="w-100 cs-ant-select"
                  options={eventTypes.map(x => ({ label: x, value: x }))}
                  placeholder="Select Type"
                  value={type}
                  disabled={submittingForm}
                  showSearch
                  autoClearSearchValue={false}
                  onChange={(v) => setType(v)} />
                <div className="d-flex justify-content-between my-3">
                  <div className="">
                    <Button color="error" variant="text" size="small" onClick={() => setOpenModal(false)}>Cancel</Button>
                  </div>
                  <div className="d-flex align-items-center justify-content-end">
                    {submittingForm ? (<div className="px-2 pt-2"><CircularProgress size={16} /></div>) : ""}
                    <Button color="primary" disabled={!type || submittingForm} variant="contained" size="small" onClick={onSave}>Save</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      ) : ""}

      {eventDetails && Object.keys(eventDetails).length > 0 ? (
        <Modal
          title={`Remove ${eventDetails.name} from Home`}
          centered
          open={confirmModal}
          afterClose={onClose}
          footer={null}
          closable={false}
          maskClosable={false}
        >
          <div className="container-fluid px-0">
            <div className="row">
              <div className="col-12">
                <div className="pb-2">Are you sure you want to remove this event from Home?</div>
                <div className="d-flex justify-content-between my-3">
                  <div className="">
                    <Button color="error" variant="text" size="small" onClick={() => setConfirmModal(false)}>Cancel</Button>
                  </div>
                  <div className="d-flex align-items-center justify-content-end">
                    {submittingForm ? (<div className="px-2 pt-2"><CircularProgress size={16} /></div>) : ""}
                    <Button color="primary" disabled={submittingForm} variant="contained" size="small" onClick={() => onSave(false)}>Confirm</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      ) : ""}
    </div>
  )
}