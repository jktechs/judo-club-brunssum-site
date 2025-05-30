import { EleventyRenderPlugin } from "@11ty/eleventy";
import { DocumentRenderer } from "@keystone-6/document-renderer";
import { renderKeystoneDocument } from "./docRender.js";

import markdownIt from "markdown-it";

const md = markdownIt();

export default function (eleventyConfig) {
  eleventyConfig.setUseGitIgnore(false);
  eleventyConfig.addWatchTarget("../keystonejs/keystone.db");
  eleventyConfig.addWatchTarget("trigger.html");
  eleventyConfig.addFilter("replaceLang", function (path, newLang) {
    return "/" + newLang + "/" + path?.split("/").slice(2).join("/");
  });
  eleventyConfig.addFilter("getLang", function (path) {
    return path?.split("/")[1];
  });
  eleventyConfig.addPlugin(EleventyRenderPlugin);
  eleventyConfig.addPassthroughCopy("static");
  eleventyConfig.addPassthroughCopy("favicon.ico");

  eleventyConfig.addFilter("markdown", (content) => {
    return md.render(content || "");
  });
  eleventyConfig.addFilter("slate", (content) => {
    return renderKeystoneDocument(content || "");
  });
  eleventyConfig.addFilter("filterLang", (data, lang) => {
    return data.filter((e) => e.lang == lang);
  });

  return {
    dir: {
      input: ".",
      includes: "_includes",
      output: "_site",
    },
  };
}
