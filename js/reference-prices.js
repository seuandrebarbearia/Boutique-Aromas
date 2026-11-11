// Snapshot of public reference prices consulted on 2026-11-10.
// Some source pages are cached by the search provider; this is not live stock
// or a promise that a promotion remains available. Match by product and size.
const base = "https://www.boutiquedearomas.com.br";
const sources = {
  home: ["/", "today"],
  aromas: ["/collections/aromas-e-ambientes", "5 days"],
  aromas4: ["/collections/aromas-e-ambientes?page=4", "2 months"],
  body: ["/collections/corpo-e-banho", "3 months"],
  body2: ["/collections/corpo-e-banho?page=2", "2 months"],
  professional: ["/collections/marketing-olfativo", "3 months"]
};

const rows = [
  ["7150", 9890, "home"], ["7149", 10990, "home"],
  ["5024", 8490, "home"], ["6513", 15790, "home"],
  ["7153", 15490, "home"], ["6586", 9390, "home"],
  ["6588", 19790, "home"], ["6855", 10890, "home"],
  ["7152", 15490, "home"], ["7159", 9890, "home"],
  ["6514", 10390, "home"], ["7029", 23890, "home"],
  ["6189", 8790, "home"],
  ["6405", 4690, "aromas"], ["6175", 5832, "aromas"],
  ["6401", 6490, "aromas"], ["6577", 7512, "aromas"],
  ["6564", 9390, "aromas"], ["6106", 5490, "aromas"],
  ["6400", 6090, "aromas"], ["5252", 6090, "aromas"],
  ["6682", 12090, "aromas"], ["6391", 10190, "aromas"],
  ["5254", 4890, "aromas"], ["6375", 3212, "aromas"],
  ["6848", 21790, "professional"], ["6847", 27990, "professional"],
  ["6836", 34990, "professional"], ["6845", 19990, "professional"],
  ["7151", 8990, "body"], ["6523", 6190, "body"],
  ["6988", 8552, "body"], ["6522", 6190, "body"],
  ["6987", 12490, "body"], ["7115", 36290, "body"],
  ["7056", 8590, "body"], ["6755", 13290, "body"],
  ["6854", 9690, "body"], ["6190", 5390, "body"],
  ["6409", 6090, "aromas4"], ["6744", 4790, "aromas4"],
  ["6402", 5590, "aromas4"], ["6925", 12090, "aromas4"],
  ["6746", 8090, "aromas4"], ["6844", 10190, "aromas4"],
  ["6100", 7290, "aromas4"], ["6578", 7512, "aromas4"],
  ["4540", 20590, "aromas4"], ["7117", 15390, "aromas4"],
  ["5248", 4390, "aromas4"], ["6114", 3590, "aromas4"],
  ["6515", 4390, "aromas4"], ["6679", 12090, "aromas4"],
  ["6900", 11890, "body2"], ["6899", 8590, "body2"],
  ["6986", 10990, "body2"], ["7057", 8590, "body2"],
  ["6840", 8090, "body2"], ["7034", 11890, "body2"],
  ["7033", 11890, "body2"]
];

export const referencePricesById = Object.fromEntries(rows.map(([id, priceCents, source]) => [id, {
  priceCents,
  sourceUrl: base + sources[source][0],
  sourceCacheAge: sources[source][1],
  consultedAt: "2026-11-10"
}]));
