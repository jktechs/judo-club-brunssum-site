import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { getDuration } from "./agenda/Agenda";
import { Temporal } from "@js-temporal/polyfill";
import { capitalize, DAY_NAMES, TEXT_MAP } from "./translation";

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
      <>
        <article>
          <h1>{capitalize(TEXT_MAP["groups"][language])}</h1>
        </article>
        <article>
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
                    <td data-label="Name">{group.name}</td>
                    <td data-label="Disc.">{group.discription}</td>
                    <td data-label="Price">{"€" + group.price}</td>
                    <td data-label="Timeslots">
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
        </article>
      </>
    );
  }
}
export default Groups;
