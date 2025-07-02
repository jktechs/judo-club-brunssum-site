import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { getDuration } from "./agenda/Agenda";
import { Temporal } from "@js-temporal/polyfill";
import { DAY_NAMES } from "./translation";

function Groups() {
  const { language = "nl" } = useParams();
  const { error, data } = useQuery<{
    groups: {
      name: string;
      price: string;
      discription: string;
      timeslots: { start: string; duration: string }[];
    }[];
  }>(
    gql`
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
      }
    `,
    {
      variables: { language },
    },
  );
  if (error !== undefined) {
    console.error(JSON.stringify(error));
  }
  if (data === undefined) {
    return <article aria-busy="true"></article>;
  } else {
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
                        {DAY_NAMES[start.dayOfWeek - 1][language]}{" "}
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
