/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth_emailOtp from "../auth/emailOtp.js";
import type * as auth_emailOtp from "../auth/emailOtp.js";
import type * as auth from "../auth.js";
import type * as auth from "../auth.js";
import type * as circles from "../circles.js";
import type * as circles from "../circles.js";
import type * as http from "../http.js";
import type * as http from "../http.js";
import type * as investments from "../investments.js";
import type * as investments from "../investments.js";
import type * as lifeGoals from "../lifeGoals.js";
import type * as lifeGoals from "../lifeGoals.js";
import type * as moodJournals from "../moodJournals.js";
import type * as moodJournals from "../moodJournals.js";
import type * as newsletters from "../newsletters.js";
import type * as newsletters from "../newsletters.js";
import type * as profile from "../profile.js";
import type * as profile from "../profile.js";
import type * as seedData from "../seedData.js";
import type * as seedData from "../seedData.js";
import type * as soulScans from "../soulScans.js";
import type * as soulScans from "../soulScans.js";
import type * as users from "../users.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  "auth/emailOtp": typeof auth_emailOtp;
  "auth/emailOtp": typeof auth_emailOtp;
  auth: typeof auth;
  auth: typeof auth;
  circles: typeof circles;
  circles: typeof circles;
  http: typeof http;
  http: typeof http;
  investments: typeof investments;
  investments: typeof investments;
  lifeGoals: typeof lifeGoals;
  lifeGoals: typeof lifeGoals;
  moodJournals: typeof moodJournals;
  moodJournals: typeof moodJournals;
  newsletters: typeof newsletters;
  newsletters: typeof newsletters;
  profile: typeof profile;
  profile: typeof profile;
  seedData: typeof seedData;
  seedData: typeof seedData;
  soulScans: typeof soulScans;
  soulScans: typeof soulScans;
  users: typeof users;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
