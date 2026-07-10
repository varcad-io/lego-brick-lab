import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const examplesDirectory = path.join(repositoryRoot, "examples");
const outputPath = path.join(examplesDirectory, "catalog.json");

const parseLiteral = (source, fileName, parameterName) => {
  const value = source.trim();
  if (value === "true") return true;
  if (value === "false") return false;
  if (value.startsWith('"') && value.endsWith('"')) return value.slice(1, -1);
  if (/^[0-9+*/().\s-]+$/.test(value)) {
    const result = Function(`"use strict"; return (${value});`)();
    if (Number.isFinite(result)) return result;
  }
  throw new Error(`Unsupported ${parameterName} value in ${fileName}: ${value}`);
};

const catalog = Object.create(null);
const exampleFiles = fs.readdirSync(examplesDirectory)
  .filter((name) => name.endsWith(".scad"))
  .sort((left, right) => left.localeCompare(right, undefined, { numeric: true }));

for (const fileName of exampleFiles) {
  const source = fs.readFileSync(path.join(examplesDirectory, fileName), "utf8");
  const call = source.match(/block\s*\(([\s\S]*?)\);/);
  if (!call) throw new Error(`Missing block() call in ${fileName}`);

  const parameters = Object.create(null);
  for (const rawParameter of call[1].split(",")) {
    const parameter = rawParameter.trim();
    if (!parameter) continue;
    const assignment = parameter.match(/^([\w$]+)\s*=\s*([\s\S]+)$/);
    if (!assignment) throw new Error(`Unsupported block() argument in ${fileName}: ${parameter}`);
    parameters[assignment[1]] = parseLiteral(assignment[2], fileName, assignment[1]);
  }
  catalog[`/examples/${fileName}`] = parameters;
}

fs.writeFileSync(outputPath, `${JSON.stringify(catalog, null, 2)}\n`);
console.log(`Wrote ${exampleFiles.length} examples to ${path.relative(repositoryRoot, outputPath)}`);
