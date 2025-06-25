import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { getDuration } from "./agenda/Agenda";
import { Temporal } from "@js-temporal/polyfill";

const GROUPS = gql`
  query ($language: String) {
    groups {
      name
      price
      discription(language: $language)
      timeslots {
        start
        duration
      }
    }
    mon: keyTranslation(where: { key: "monday" }) {
      value(language: $language)
    }
    tue: keyTranslation(where: { key: "tuesday" }) {
      value(language: $language)
    }
    wed: keyTranslation(where: { key: "wednesday" }) {
      value(language: $language)
    }
    thu: keyTranslation(where: { key: "thursday" }) {
      value(language: $language)
    }
    fri: keyTranslation(where: { key: "friday" }) {
      value(language: $language)
    }
    sat: keyTranslation(where: { key: "saturday" }) {
      value(language: $language)
    }
    sun: keyTranslation(where: { key: "sunday" }) {
      value(language: $language)
    }
  }
`;
type Group = {
  groups: {
    name: string;
    price: string;
    discription: string;
    timeslots: { start: string; duration: string }[];
  }[];
} & { [key: string]: { value: string } };
function Groups() {
  const { language } = useParams();
  const { loading, error, data } = useQuery<Group>(GROUPS, {
    variables: { language },
  });
  if (loading || error !== undefined || data === undefined) {
    return <article aria-busy="true"></article>;
  } else {
    const { mon, tue, wed, thu, fri, sat, sun } = data;
    const days = [mon, tue, wed, thu, fri, sat, sun];
    return (
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Disc.</th>
            <th>Price</th>
            <th>Timeslots</th>
          </tr>
        </thead>
        <tbody>
          {data.groups.map((group) => {
            return (
              <tr key={group.name}>
                <td>{group.name}</td>
                <td>{group.discription}</td>
                <td>{"€" + group.price}</td>
                <td>
                  {group.timeslots.map((timeslot) => {
                    const [hour, minute] = timeslot.duration
                      .split(":")
                      .map(Number);
                    const start = Temporal.Instant.from(
                      timeslot.start,
                    ).toZonedDateTimeISO("Europe/Amsterdam");
                    return (
                      <p key={timeslot.start}>
                        {days[start.dayOfWeek - 1].value}{" "}
                        {getDuration(hour, minute, start)}
                      </p>
                    );
                  })}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }
}
export default Groups;
