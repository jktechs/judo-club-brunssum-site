import Fetch from "@11ty/eleventy-fetch";

const query = `
  fragment disc on Role {
    discription(where: {language: {code: {equals: $lang}}}) { content { document } }
  }
  query($lang: String) {
    infoPages {
      title(where: {language: {code: {equals: $lang}}}) { content }
      content(where: {language:  {code: {equals: $lang}}}) { content { document } }
    }
    menuItems(orderBy: {order: asc}) {
      label(where: {language: {code: {equals: $lang}}}) { content }
      links {
        label(where: {language: {code: {equals: $lang}}}) { content }
        href
      }
    }
    groups {
      discription(where: {language: {code: {equals: $lang}}}) { content { document } }
      end_monday
      end_saturday
      start_monday
      start_saturday
      name
    }
    people {
      discription(where: {language: {code: {equals: $lang}}}) { content { document } }
      name
      picture { url }
    }
    downloads {
      file {
        url
        filename
      }
      label(where: {language: {code: {equals: $lang}}}) { content }
    }
    teachers: roles(where: {role: {equals: teacher}}) {
      ...disc
      person {
        name
        picture { url }
      }
    }
    board: roles(where: {role: {equals: board}}) {
      ...disc
      person {
        name
        picture { url }
      }
    }
    counselor: roles(where: {role: {equals: counselor}}) {
      ...disc
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
  let info = await request({
    query: "query { languages { code, name, language } roles { role } }",
  });

  let data = {};
  let roles = [];
  for (let role of info.roles) {
    if (!roles.includes(role.role)) {
      roles.push(role);
    }
  }
  for (let lang of info.languages) {
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
    data["languages"].map(({ code, ..._ }) => ({ role, lang: code })),
  );
  console.log(JSON.stringify(data));
  return data;
}
