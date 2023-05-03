import { createTRPCRouter } from "~/server/api/trpc";
import { availabilityRouter } from "~/server/api/routers/availability";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  availability: availabilityRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
