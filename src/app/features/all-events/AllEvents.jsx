import Calendar from "../calendar/Calendar";

export default function AllEvents() {
  return (
    <div className="py-4">
      <div className="container-xxl">
        <div className="row">
          <div className="col-12">
            <div className="h4 fw-semibold">All Events</div>
          </div>
        </div>
      </div>
      <Calendar />
    </div>
  )
}
