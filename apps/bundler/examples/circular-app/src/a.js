import { readB } from "./b.js";

export function labelA() {
  return "A";
}

export function readA() {
  return `A -> ${readB()}`;
}
