import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { getDuration } from "../agenda/Agenda";
import { Temporal } from "@js-temporal/polyfill";
import { capitalize, DAY_NAMES, TEXT_MAP } from "../translation";
import "./Groups.css";
import { GROUPS_QUERY } from "../queries";

export default function Groups() {
  const { language = "nl" } = useParams();
  const { error, data } = useQuery(GROUPS_QUERY, {
    variables: { language },
  });
  if (error !== undefined) {
    console.error(JSON.stringify(error));
  }
  if (data === undefined) {
    return <article aria-busy="true" />;
  } else {
    return (
      <>
        <article>
          <h1>{capitalize(TEXT_MAP["groups"][language])}</h1>
        </article>
        <article>
          <p>
            Hieronder vind je de lestijden en de groepsindeling. De leeftijden
            die genoemd staan, zijn grove richtlijnen. De daadwerkelijke
            indeling wordt door de trainers op individuele basis gemaakt, om
            ervoor te zorgen dat iedereen op zijn/haar eigen niveau kan trainen
            en voldoende uitgedaagd wordt.
          </p>
          <table>
            <thead>
              <tr>
                <th>{capitalize(TEXT_MAP["name"][language])}</th>
                <th>{capitalize(TEXT_MAP["description"][language])}</th>
                <th>{capitalize(TEXT_MAP["price"][language])}</th>
                <th>{capitalize(TEXT_MAP["timeslots"][language])}</th>
              </tr>
            </thead>
            <tbody>
              {data.groups.map((group) => {
                return (
                  <tr key={group.name}>
                    <td data-label={capitalize(TEXT_MAP["name"][language])}>
                      {group.name}
                    </td>
                    <td
                      data-label={capitalize(TEXT_MAP["description"][language])}
                    >
                      {group.discription}
                    </td>
                    <td data-label={capitalize(TEXT_MAP["price"][language])}>
                      {"€" +
                        (Math.round(Number(group.price) * 100) / 100).toFixed(
                          2,
                        )}
                    </td>
                    <td
                      data-label={capitalize(TEXT_MAP["timeslots"][language])}
                    >
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
          <p>
            Daarnaast bieden we gratis aanvullende trainingen in de vorm van
            wedstrijdtraining voor onze jeugd en conditie-/krachttraining voor
            onze senioreleden. Heb je interesse in één van deze trainingen,
            vraag dan even aan je leraar of het geschikt voor je is.
          </p>
        </article>
      </>
    );
  }
}
