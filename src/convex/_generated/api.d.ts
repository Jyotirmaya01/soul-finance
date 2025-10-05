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
import type * as aiChat from "../aiChat.js";
import type * as auth_emailOtp from "../auth/emailOtp.js";
import type * as auth from "../auth.js";
import type * as celebrations from "../celebrations.js";
import type * as circles from "../circles.js";
import type * as http from "../http.js";
import type * as investments from "../investments.js";
import type * as lifeGoals from "../lifeGoals.js";
import type * as moodJournals from "../moodJournals.js";
import type * as newsletters from "../newsletters.js";
import type * as profile from "../profile.js";
import type * as seedData from "../seedData.js";
import type * as soulScans from "../soulScans.js";
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
  aiChat: typeof aiChat;
  "auth/emailOtp": typeof auth_emailOtp;
  auth: typeof auth;
  celebrations: typeof celebrations;
  circles: typeof circles;
  http: typeof http;
  investments: typeof investments;
  lifeGoals: typeof lifeGoals;
  moodJournals: typeof moodJournals;
  newsletters: typeof newsletters;
  profile: typeof profile;
  seedData: typeof seedData;
  soulScans: typeof soulScans;
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
