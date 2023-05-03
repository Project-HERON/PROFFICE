import { z } from "zod";
import moment from 'moment';

import {
  createTRPCRouter,
  professorProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const availabilityRouter = createTRPCRouter({
  createAvailability: professorProcedure
    .input(
      z
        .object({
          startDate: z.date(),
          endDate: z.date(),
        })
        .refine(
          (data) => moment(data.endDate).isAfter(moment(data.startDate)),
          'End Date must be after Start date',
        )
    )
    .mutation(async ({ ctx, input: { endDate, startDate } }) => {
      try {
        
        const conflictingAvailabilities = await ctx.prisma.availability.findMany({
          where: {
            AND: [
              {
                OR: [
                  {
                    AND: [
                      {
                        startDate: {
                          lt: startDate
                        }
                      },
                      {
                        endDate: {
                          lt: endDate
                        }
                      },
                    ]
                  },
                  {
                    AND: [
                      {
                        startDate: {
                          gt: startDate
                        }
                      },
                      {
                        endDate: {
                          gt: endDate
                        }
                      },
                    ]
                  },
                ],
              },
              {
                userId: {
                  equals: ctx.session.user.id
                }
              }
            ]
          }
        });


        if(conflictingAvailabilities.length)
          throw new TRPCError({ code: "CONFLICT", message: "Cannot add availability, conflicting availabilities found!" });


        const availability = await ctx.prisma.availability.create({
          data: {
            startDate,
            endDate,
            user: {
              connect: {
                id: ctx.session.user.id,
              }
            }
          }
        })
      } catch (error) {
      }
    }),
});
