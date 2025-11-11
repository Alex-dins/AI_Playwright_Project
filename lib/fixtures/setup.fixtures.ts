import { mergeTests } from "@playwright/test";
import { test as pages } from "../fixtures/pages";
import { test as api } from "../fixtures/api";

export const test = mergeTests(pages, api);
