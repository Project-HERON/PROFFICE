import { createTRPCRouter } from "~/server/api/trpc";
import { availabilityRouter } from "~/server/api/routers/availability";
import { officeHoursSessionRouter } from "./routers/officeHoursSession";
import { userRouter } from "./routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  availability: availabilityRouter,
  officeHoursSession: officeHoursSessionRouter,
  user: userRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
