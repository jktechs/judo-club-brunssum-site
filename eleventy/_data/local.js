import Fetch from "@11ty/eleventy-fetch";

const query = `
  query($lang: String) {
    infoPages {
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
      end_monday
      end_saturday
      start_monday
      start_saturday
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
    teachers: roles(where: {role: {equals: teacher}}) {
      discription(language: $lang)
      person {
        name
        picture { url }
      }
    }
    board: roles(where: {role: {equals: board}}) {
      discription(language: $lang)
      person {
        name
        picture { url }
      }
    }
    counselor: roles(where: {role: {equals: counselor}}) {
      discription(language: $lang)
      person {
        name
        picture { url }
      }
    }
  }
`;

async function request(data) {
  let json = await Fetch("http://192.168.2.8:3000/api/graphql", {
    duration: "0d",
    type: "json",
    verbose: true,
    fetchOptions: {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  });
  return json.data;
}

export default async function (config) {
  let languages = [
    { code: "nl", name: "Nederlands", language: "Taal" },
    { code: "en", name: "Engels", language: "Language" },
  ];
  let roles = await request({
    query: "query { roles { role } }",
  }).roles;

  let data = {};
  let unique_roles = [];
  for (let role of roles) {
    if (!unique_roles.includes(role.role)) {
      unique_roles.push(role);
    }
  }
  for (let lang of languages) {
    let json = await request({ query, variables: { lang: lang.code } });
    for (let i of Object.keys(json)) {
      for (let j of json[i]) {
        j["language"] = lang.code;
      }
      data[i] = (data[i] || []).concat(json[i]);
    }
  }
  data["languages"] = info.languages;
  data["rolepages"] = roles.flatMap((role) =>
    data["languages"].map(({ code }) => ({ role, lang: code })),
  );
  console.log(JSON.stringify(data));
  return data;
}
