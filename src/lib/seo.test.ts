import assert from "node:assert/strict";
import test from "node:test";
import { ARTIST, faqJsonLd, llmsTxt, studioLine } from "./seo.ts";

test("llms.txt repeats published contact facts and does not invent prices", () => {
  const text = llmsTxt();
  assert.match(text, new RegExp(ARTIST.email));
  assert.match(text, /\+32 474 09 51 77/);
  assert.match(text, /Oude Houtlei, 9000 Ghent, Belgium/);
  assert.match(text, /Oude Houtlei, 9000 Gent, België/);
  assert.match(text, /Prices are not published on this website/);
  assert.match(text, /Prijzen staan niet op deze website/);
  assert.doesNotMatch(text, /€|\bEUR\s*\d/);
  assert.match(text, /https:\/\/isabellabilliet.com\/en\/contact/);
  assert.match(text, /https:\/\/isabellabilliet.com\/nl\/works/);
});

test("studio line follows the locale used on the site", () => {
  assert.equal(studioLine("en"), "Oude Houtlei, 9000 Ghent");
  assert.equal(studioLine("nl"), "Oude Houtlei, 9000 Gent");
});

test("FAQ schema copies the visible question and answer", () => {
  const data = faqJsonLd([{ question: "Where?", answer: "Oude Houtlei, 9000 Ghent" }]);
  assert.equal(data["@type"], "FAQPage");
  const entity = data.mainEntity[0] as {
    name: string;
    acceptedAnswer: { text: string };
  };
  assert.equal(entity.name, "Where?");
  assert.equal(entity.acceptedAnswer.text, "Oude Houtlei, 9000 Ghent");
});
