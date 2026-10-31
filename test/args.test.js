import assert from "node:assert/strict";
import test from "node:test";
import { parseArgs } from "../dist/args.js";

test("parses a project name with installation options", () => {
  assert.deepEqual(parseArgs(["my-app", "--install"]), {
    projectName: "my-app",
    install: true,
    yes: false,
    help: false,
    version: false,
  });
});

test("supports short aliases and no-install", () => {
  assert.equal(parseArgs(["-y", "-i"]).yes, true);
  assert.equal(parseArgs(["my-app", "--no-install"]).install, false);
  assert.equal(parseArgs(["-h"]).help, true);
  assert.equal(parseArgs(["-v"]).version, true);
});

test("rejects conflicting install flags and unknown options", () => {
  assert.throws(() => parseArgs(["--install", "--no-install"]), /cannot be used together/);
  assert.throws(() => parseArgs(["--unknown"]), /Unknown option/);
});

test("rejects multiple project directories", () => {
  assert.throws(() => parseArgs(["one", "two"]), /only one project directory/);
});
