import { z } from "zod";
import moment from 'moment';

import {
  createTRPCRouter,
  professorProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { validIntervals } from "~/utils/constants";

export const availabilityRouter = createTRPCRouter({
  createAvailability: professorProcedure
    .input(
      z
        .object({
          startDate: z.date(),
          endDate: z.date(),
          interval: z.number(),
        })
        .refine(
          (data) => moment(data.endDate).isAfter(moment(data.startDate)),
          'End Date must be after Start date',
        )
        .refine(
          (data) => validIntervals.includes(data.interval),
          (data) => ({ message: `${data.interval} is not a valid interval` })
        )
    )
    .mutation(async ({ ctx, input: { endDate, startDate, interval } }) => {
      try {

        let tempStartDate: Date = startDate, tempEndDate: Date = moment(startDate).add(interval, 'minutes').toDate();
        while (moment(tempEndDate).isSameOrBefore(endDate)) {
          await ctx.prisma.availability.create({
            data: {
              startDate: tempStartDate,
              endDate: tempEndDate,
              professor: {
                connect: {
                  id: ctx.session.user.id,
                }
              },
            }
          });

          tempStartDate = tempEndDate;
          tempEndDate = moment(tempStartDate).add(interval, 'minutes').toDate()

        }
      } catch (error) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: JSON.stringify(error) })
      }
    }),
});
