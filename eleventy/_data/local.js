const static_query = `
  query {
    roles { role }
    events {
      label
      discription
      day
      start_time
      end_time
      repeat
      repeat_end
      id
      exception {
        id
      }
    }
  }
`;
const lang_query = `
  query($lang: String) {
    infoPages {
      title_en
      title(language: $lang)
      content(language: $lang)
    }
    menuItems(orderBy: {order: asc}) {
      label(language: $lang)
      links {
        label(language: $lang)
        href
      }
    }
    groups {
      discription(language: $lang)
      timeslots {
        day
        start_time
        end_time
      }
      name
    }
    people {
      discription(language: $lang)
      name
      picture { url }
    }
    downloads {
      file {
        url
        filename
      }
      label(language: $lang)
    }
    roles {
      role
      discription(language: $lang)
      person {
        name
        picture { url }
      }
    }
    keyTranslations {
      key
      value(language: $lang)
    }
  }
`;
function last_year(events) {
  let last = new Date();
  for (let i of events) {
    if (last === undefined || last < i.day) {
      last = i.day;
    } else if (i.repeat != "never" && last < i.repeat_end) {
      last = i.repeat_end;
    }
  }
  if (last.getDate() == 1 && last.getMonth() == 0) {
    return last.getFullYear();
  } else {
    return last.getFullYear() + 1;
  }
}
function generate_month(year, month, events) {
  let days = [];
  // day 0 of month in year.
  let month_start = new Date(year, month - 1);
  // day 0 of month+1 in year.
  let month_end = new Date(year, month);

  let padding = month_start.getDay();
  if (padding == 0) padding += 7;

  // day -1 of month+1 which is the last day of month in year.
  let day_count = new Date(year, month, 0).getDate();
  for (let i = 1 - padding; i < day_count; i++) {
    days.push({
      date: new Date(year, month - 1, 1 + i),
      events: [],
      padding: 1 + i <= 0,
    });
  }

  for (let i of events) {
    let day = new Date(i.day);
    let end = undefined;
    // "daily", "weekly", "never"
    if (i.repeat != "never") {
      end = new Date(i.repeat_end);
    } else {
      end = day;
    }
    if (
      (day <= month_start && end > month_start) ||
      (day < month_end && end >= month_end) ||
      (day >= month_start && end < month_end)
    ) {
      let current = day;
      if (i.repeat != "never") {
        while (current < month_end) {
          if (current >= month_start) {
            days[current.getDate() - 1 + padding - 1].events.push(i);
          }
          if (i.repeat == "weekly") {
            current = new Date(current.setDate(current.getDate() + 7));
          } else {
            current = new Date(current.setDate(current.getDate() + 1));
          }
        }
      } else {
        days[day.getDate() - 1 + padding - 1].events.push(i);
      }
    }
  }
  for (let day of days) {
    let events = [];
    for (let event of day.events) {
      if (
        !event.exception.some((e1) => day.events.some((e2) => e2.id === e1.id))
      ) {
        events.push(event);
      }
    }
    day.events = events;
  }
  return days;
}

async function request(query, variables) {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  let response = await fetch("http://keystonejs:3000/api/graphql", {
    method: "POST",
    headers: headers,
    body: JSON.stringify({ query, variables }),
    redirect: "follow",
  });
  let json = await response.json();

  // let json = await Fetch("http://keystonejs:3000/api/graphql", {
  //   duration: "0s",
  //   type: "json",
  //   verbose: true,
  //   fetchOptions: {
  //     method: "post",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(data),
  //   },
  // });
  return json.data;
}

export default async function (config) {
  let languages = [
    { code: "nl", name: "Nederlands", language: "Taal" },
    { code: "en", name: "Engels", language: "Language" },
  ];

  let statics = await request(static_query, {});
  let max_year = last_year(statics.events);
  let min_year = new Date().getFullYear();
  let months = [];
  let years = [];
  for (let i = min_year; i <= max_year; i++) {
    years.push(i);
    for (let j = 1; j <= 12; j++) {
      months.push({
        year: i,
        month: j,
        days: generate_month(i, j, statics.events),
      });
    }
  }
  // get all roles used.
  let unique_roles = [];
  for (let role of statics.roles) {
    if (!unique_roles.includes(role.role)) {
      unique_roles.push(role.role);
    }
  }

  // split data into languages
  let data = { languages };
  for (let lang of data.languages) {
    let json = await request(lang_query, { lang: lang.code });

    for (let i of Object.keys(json)) {
      for (let j of json[i]) {
        j["language"] = lang.code;
      }
      data[i] = (data[i] || []).concat(json[i]);
    }
  }

  // double paginate the role pages by language and role.
  data["rolepages"] = unique_roles.flatMap((role) =>
    data.languages.map(({ code }) => ({ role, language: code })),
  );
  data["months"] = months.flatMap((month) =>
    data.languages.map(({ code }) => ({ ...month, language: code })),
  );
  data["years"] = years;

  // debug log the global state.
  console.log(JSON.stringify(data));
  return data;
}
