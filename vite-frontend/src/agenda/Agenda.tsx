import { useParams } from "react-router-dom";
import "./Agenda.css";
import { type MouseEvent } from "react"; // type MouseEvent
import { gql, useQuery } from "@apollo/client";
import { Temporal } from "@js-temporal/polyfill";
import { DocumentRenderer } from "@keystone-6/document-renderer";

const MONTHS = gql`
  query ($language: String, $start: DateTime, $end: DateTime) {
    jan: keyTranslation(where: { key: "january" }) {
      value(language: $language)
    }
    feb: keyTranslation(where: { key: "february" }) {
      value(language: $language)
    }
    mar: keyTranslation(where: { key: "march" }) {
      value(language: $language)
    }
    apr: keyTranslation(where: { key: "april" }) {
      value(language: $language)
    }
    may: keyTranslation(where: { key: "may" }) {
      value(language: $language)
    }
    jun: keyTranslation(where: { key: "june" }) {
      value(language: $language)
    }
    jul: keyTranslation(where: { key: "july" }) {
      value(language: $language)
    }
    aug: keyTranslation(where: { key: "august" }) {
      value(language: $language)
    }
    sep: keyTranslation(where: { key: "september" }) {
      value(language: $language)
    }
    oct: keyTranslation(where: { key: "october" }) {
      value(language: $language)
    }
    nov: keyTranslation(where: { key: "november" }) {
      value(language: $language)
    }
    dec: keyTranslation(where: { key: "december" }) {
      value(language: $language)
    }
    events(where: { start: { lt: $end }, repeat_end: { gt: $start } }) {
      id
      label(language: $language)
      discription(language: $language)
      duration
      start
      repeat
      repeat_end
      exception {
        id
      }
    }
  }
`;

function opendialog(event: MouseEvent) {
  const dialog = event.currentTarget.querySelector("dialog");
  console.log(dialog);
  if (dialog?.open) dialog.close();
  else dialog?.showModal();
}

type Event = {
  id: string;
  exception: { id: string }[];
  discription: unknown;
  duration: string;
  label: string;
  start: string;
  repeat: "daily" | "weekly" | "never";
  repeat_end: string;
};
type Month = {
  padding: number;
  events: {
    // eslint-disable-next-line
    discription: any;
    hours: number;
    minutes: number;
    label: string;
    start: Temporal.ZonedDateTime;
  }[][];
};

function getDays(
  start: Temporal.ZonedDateTime,
  end: Temporal.ZonedDateTime,
  events: Event[],
): Month {
  const data: Month = { padding: start.dayOfWeek - 1, events: [] };
  for (let i = 0; i < start.daysInMonth; i++) {
    data.events.push([]);
  }
  for (const event of events) {
    const event_start = Temporal.Instant.from(event.start).toZonedDateTimeISO(
      "Europe/Amsterdam",
    );
    const [hours, minutes] = event.duration.split(":").map(Number);
    const modified = {
      label: event.label,
      discription: event.discription,
      start: event_start,
      hours,
      minutes,
    };
    if (event.repeat === "never") {
      data.events[event_start.day - 1].push(modified);
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
          data.events[i - 1].push(modified);
        }
      } else if (event.repeat === "weekly") {
        const offset = (event_start.dayOfWeek - start.dayOfWeek + 7) % 7;
        for (let i = offset; i <= start.daysInMonth; i += 7) {
          data.events[i].push(modified);
        }
      }
    }
  }
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
  const { date, language } = useParams();
  let { year, month } = Temporal.Now.plainDateISO();
  if (date != undefined) {
    [year, month] = date.split("-").map(Number);
  }
  const month_start = monthStart(year, month);
  const month_end = monthStart(year, month + 1);
  const { loading, error, data } = useQuery(MONTHS, {
    variables: {
      language,
      start: month_start.toInstant().toString(),
      end: month_end.toInstant().toString(),
    },
  });
  if (loading || error !== undefined) {
    return <article aria-busy="true"></article>;
  }
  const { jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec } = data;
  let months: { value: string }[] = [];
  months = [jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec];
  const days = getDays(month_start, month_end, data.events);
  console.dir(days);
  return (
    <>
      <article>
        <h1>
          {year}-{months[month - 1].value}
        </h1>
      </article>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr 1fr",
        }}
      >
        {Array.from({ length: days.padding }, (_, i) => (
          // @ts-expect-error: ignoring type mismatch for now
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
