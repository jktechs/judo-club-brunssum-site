import { Link, useParams } from "react-router-dom";
import "./Agenda.css";
import { type MouseEvent } from "react";
import { useQuery } from "@apollo/client";
import { Temporal } from "@js-temporal/polyfill";
import { DocumentRenderer } from "@keystone-6/document-renderer";
import { capitalize, MONTH_NAMES } from "../translation";
import { AGENDA_QUERY, type QueryResult } from "../queries";

function opendialog(event: MouseEvent) {
  const dialog = event.currentTarget.querySelector("dialog");
  if (dialog?.open) dialog.close();
  else dialog?.showModal();
}

type Month = {
  padding: number;
  events: {
    // eslint-disable-next-line
    discription: any;
    hours: number;
    minutes: number;
    label: string;
    start: Temporal.ZonedDateTime;
    id: string;
    exception: { id: string }[];
  }[][];
};

function calcMonth(
  start: Temporal.ZonedDateTime,
  end: Temporal.ZonedDateTime,
  events: QueryResult<typeof AGENDA_QUERY>["events"],
): Month {
  const data: Month = { padding: start.dayOfWeek - 1, events: [] }; // week starts with monday
  for (let i = 0; i < start.daysInMonth; i++) {
    data.events.push([]);
  }
  for (const event of events) {
    const event_start = Temporal.Instant.from(event.start).toZonedDateTimeISO(
      "Europe/Amsterdam",
    );
    const [hours, minutes] = event.duration.split(":").map(Number);
    const modified_event = {
      label: event.label,
      discription: event.discription,
      start: event_start,
      hours,
      minutes,
      id: event.id,
      exception: event.exception,
    };
    if (event.repeat === "never") {
      data.events[event_start.day - 1].push(modified_event);
    } else {
      const event_end = Temporal.Instant.from(
        event.repeat_end,
      ).toZonedDateTimeISO("Europe/Amsterdam");
      if (event.repeat === "daily") {
        const start_day = (
          Temporal.ZonedDateTime.compare(start, event_start) > 0
            ? start
            : event_start
        ).day;
        const end_day =
          Temporal.ZonedDateTime.compare(end, event_end) > 0
            ? event_end.day - 1
            : start.daysInMonth;
        for (let i = start_day; i <= end_day; i++) {
          data.events[i - 1].push(modified_event);
        }
      } else if (event.repeat === "weekly") {
        const offset = (event_start.dayOfWeek - start.dayOfWeek + 7) % 7;
        for (let i = offset; i < start.daysInMonth; i += 7) {
          data.events[i].push(modified_event);
        }
      }
    }
  }
  // filter events using the exceptions
  data.events.map((day) =>
    day.filter((event) =>
      event.exception.every((exception) =>
        day.every((e) => e.id !== exception.id),
      ),
    ),
  );
  return data;
}
function monthStart(year: number, month: number): Temporal.ZonedDateTime {
  if (month === 13) {
    month = 1;
    year += 1;
  }
  return Temporal.ZonedDateTime.from({
    year,
    month,
    day: 1,
    hour: 0,
    minute: 0,
    timeZone: "Europe/Amsterdam",
  });
}
// eslint-disable-next-line
export function getDuration(
  hours: number,
  minutes: number,
  start: Temporal.ZonedDateTime,
) {
  let minute = start.minute + minutes;
  const hour = start.hour + hours + Math.floor(minute / 60);
  minute %= 60;
  return (
    String(start.hour).padStart(2, "0") +
    ":" +
    String(start.minute).padStart(2, "0") +
    "-" +
    String(hour).padStart(2, "0") +
    ":" +
    String(minute).padStart(2, "0")
  );
}
function Agenda() {
  const { date, language = "nl" } = useParams();
  let { year, month } = Temporal.Now.plainDateISO();
  if (date != undefined) {
    [year, month] = date.split("-").map(Number);
  }
  const month_start = monthStart(year, month);
  const month_end = monthStart(year, month + 1);
  const { error, data } = useQuery(AGENDA_QUERY, {
    variables: {
      language,
      start: month_start.toInstant().toString(),
      end: month_end.toInstant().toString(),
    },
  });
  if (error !== undefined) {
    console.error(JSON.stringify(error));
  }
  let days: Month;
  if (data === undefined) {
    days = { padding: 0, events: [] };
    for (let i = 0; i < 30; i++) {
      days.events.push([]);
    }
    // return <article aria-busy="true" />;
  } else {
    days = calcMonth(month_start, month_end, data.events);
  }
  return (
    <>
      <article style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>
          <Link
            className="link-button"
            to={
              "/" +
              language +
              "/agenda/" +
              (month == 1 ? year - 1 : year) +
              "-" +
              (month == 1 ? 12 : month - 1)
            }
          >
            &lt;
          </Link>
          {capitalize(MONTH_NAMES[month - 1][language])}
          <Link
            className="link-button"
            to={
              "/" +
              language +
              "/agenda/" +
              (month == 12 ? year + 1 : year) +
              "-" +
              (month == 12 ? 1 : month + 1)
            }
          >
            &gt;
          </Link>
        </h1>
        <h1>
          <Link
            className="link-button"
            to={"/" + language + "/agenda/" + (year - 1) + "-" + month}
          >
            &lt;
          </Link>
          {year}
          <Link
            className="link-button"
            to={"/" + language + "/agenda/" + (year + 1) + "-" + month}
          >
            &gt;
          </Link>
        </h1>
      </article>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr 1fr",
        }}
      >
        {Array.from({ length: days.padding }, (_, i) => (
          // @ts-expect-error: disabled normaly cant be on an atricle but picocss expects it.
          <article key={i} disabled className="calander-day"></article>
        ))}
        {days.events.map((events, i) => {
          return (
            <article key={i} onClick={opendialog} className="calander-day">
              <p style={{ marginBottom: "2%" }}>{i + 1}</p>
              <div>
                {events.map((event) => {
                  return (
                    <small
                      key={event.label}
                      style={{ textWrap: "nowrap", display: "block" }}
                    >
                      {event.label}
                    </small>
                  );
                })}
              </div>
              <dialog>
                <div className="container">
                  <article>
                    <h1>
                      {year}-{month}-{i + 1}
                    </h1>
                  </article>
                  {events.map((event) => {
                    return (
                      <article
                        key={event.label}
                        style={{ position: "relative" }}
                      >
                        <h3>{event.label}</h3>
                        <DocumentRenderer document={event.discription} />
                        <p
                          style={{
                            position: "absolute",
                            top: "2px",
                            right: "2px",
                          }}
                        >
                          {getDuration(event.hours, event.minutes, event.start)}
                        </p>
                      </article>
                    );
                  })}
                </div>
              </dialog>
            </article>
          );
        })}
      </div>
    </>
  );
}

export default Agenda;
