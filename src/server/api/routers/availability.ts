import { z } from "zod";
import moment from 'moment';

import {
  createTRPCRouter,
  professorOrStudentProcedure,
  professorProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { validIntervals } from "~/utils/constants";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

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

  getProfessorAvailability: professorOrStudentProcedure
    .input(
      z
        .object({
          professorId: z.string().cuid(),
        })
    )
    .query(async ({ ctx, input: { professorId } }) => {
      try {

        const availabilities = await ctx.prisma.availability.findMany({
          where: {
            professor: {
              id: {
                equals: professorId
              }
            },
          },
          include: {
            officeHoursSession: {
              select: {
                id: true,
              }
            }
          },
          orderBy: {
            startDate: 'asc'
          }
        })

        return availabilities;

      } catch (error) {
        if (error instanceof TRPCError)
          throw error

        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: JSON.stringify(error) })
      }
    }),

  deleteAvailability: professorProcedure
    .input(
      z
        .object({
          availabilityId: z.string().cuid(),
        })
    )
    .mutation(async ({ ctx, input: { availabilityId } }) => {
      try {

        const availability = await ctx.prisma.availability.findUniqueOrThrow({
          where: {
            id: availabilityId
          },
          select: {
            professorId: true
          }
        })

        if(availability.professorId !== ctx.session.user.id)
          throw (new TRPCError({ code: "FORBIDDEN", message: "You don't have permission to delete this availability" }))

        await ctx.prisma.availability.delete({
          where: {
            id: availabilityId,
          }
        })

      } catch (error) {
        if (error instanceof TRPCError)
          throw (error)

        if (error instanceof PrismaClientKnownRequestError)
          if (error.code === 'P2025')
            throw new TRPCError({ code: "NOT_FOUND", message: "Availability Not Found" })

        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: JSON.stringify(error) })
      }
    }),

});
