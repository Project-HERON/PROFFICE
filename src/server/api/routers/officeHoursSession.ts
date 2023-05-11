import type { Availability, OfficeHourSession, User } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  adminProcedure,
  createTRPCRouter,
  professorOrStudentProcedure,
  professorProcedure,
  studentProcedure,
} from "~/server/api/trpc";

export const officeHoursSessionRouter = createTRPCRouter({
  createOfficeHoursSession: studentProcedure
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
          include: {
            officeHoursSession: true
          }
        });

        if (availability.officeHoursSession)
          throw new TRPCError({ code: "BAD_REQUEST", message: "Availability Already booked" })

        await ctx.prisma.officeHourSession.create({
          data: {
            availabilityId,
            studentId: ctx.session.user.id,
          }
        });

      } catch (error) {
        if (error instanceof TRPCError)
          throw error

        if (error instanceof PrismaClientKnownRequestError)
          if (error.code === 'P2025')
            throw new TRPCError({ code: "NOT_FOUND", message: "Availability Not Found" })

        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: JSON.stringify(error) })
      }
    }),

  confirmOfficeHoursSession: professorProcedure
    .input(
      z
        .object({
          officeHoursSessionId: z.string().cuid(),
        })
    )
    .mutation(async ({ ctx, input: { officeHoursSessionId } }) => {
      try {
        const session = await ctx.prisma.officeHourSession.findUniqueOrThrow({
          where: {
            id: officeHoursSessionId
          }
        });

        if (session.status !== 'requested')
          throw new TRPCError({ code: "BAD_REQUEST", message: "Session must be requested to be confirmed" })

        await ctx.prisma.officeHourSession.update({
          where: {
            id: officeHoursSessionId
          },
          data: {
            status: {
              set: 'confirmed'
            }
          }
        })

      } catch (error) {
        if (error instanceof TRPCError)
          throw error

        if (error instanceof PrismaClientKnownRequestError)
          if (error.code === 'P2025')
            throw (new TRPCError({ code: "NOT_FOUND", message: "Office Hours Session Not Found" }))

        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: JSON.stringify(error) })
      }
    }),

  cancelOfficeHoursSession: professorOrStudentProcedure
    .input(
      z
        .object({
          officeHoursSessionId: z.string().cuid(),
        })
    )
    .mutation(async ({ ctx, input: { officeHoursSessionId } }) => {
      try {
        const session = await ctx.prisma.officeHourSession.findUniqueOrThrow({
          where: {
            id: officeHoursSessionId
          }
        });

        // Will add in a later version
        // if (session.status !== 'confirmed')
        //   throw new TRPCError({ code: "BAD_REQUEST", message: "Session must be confirmed to be cancelled" })

        await ctx.prisma.officeHourSession.delete({
          where: {
            id: officeHoursSessionId
          }
        })

      } catch (error) {
        if (error instanceof TRPCError)
          throw error

        if (error instanceof PrismaClientKnownRequestError)
          if (error.code === 'P2025')
            throw new TRPCError({ code: "NOT_FOUND", message: "Office Hours Session Not Found" })

        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: JSON.stringify(error) })
      }
    }),

  completeOfficeHoursSession: professorProcedure
    .input(
      z
        .object({
          officeHoursSessionId: z.string().cuid(),
        })
    )
    .mutation(async ({ ctx, input: { officeHoursSessionId } }) => {
      try {
        const session = await ctx.prisma.officeHourSession.findUniqueOrThrow({
          where: {
            id: officeHoursSessionId
          }
        });

        if (session.status !== 'confirmed')
          throw new TRPCError({ code: "CONFLICT", message: "Session must be confirmed to be marked as attended" })

        await ctx.prisma.officeHourSession.update({
          where: {
            id: officeHoursSessionId
          },
          data: {
            status: {
              set: 'attended'
            }
          }
        })

      } catch (error) {
        if (error instanceof TRPCError)
          throw error

        if (error instanceof PrismaClientKnownRequestError)
          if (error.code === 'P2025')
            throw new TRPCError({ code: "NOT_FOUND", message: "Office Hours Session Not Found" })

        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: JSON.stringify(error) })
      }
    }),

  getAllOfficeHoursSessions: adminProcedure
    .input(
      z
        .object({
          cursor: z.string().cuid().nullish(),
        })
    )
    .query(async ({ ctx, input: { cursor } }) => {
      try {
        const limit = 10;
        const items = await ctx.prisma.officeHourSession.findMany({
          take: limit + 1,
          cursor: cursor ? { id: cursor } : undefined,
          orderBy: {
            availability: {
              startDate: 'asc'
            },
          },
        })
        let nextCursor: typeof cursor | undefined = undefined;
        if (items.length > limit) {
          const nextItem = items.pop()
          nextCursor = nextItem ? nextItem.id : '';
        }
        return {
          items,
          nextCursor,
        };

      } catch (error) {

        if (error instanceof TRPCError)
          throw error

        if (error instanceof PrismaClientKnownRequestError)
          if (error.code === 'P2025')
            throw new TRPCError({ code: "NOT_FOUND", message: "Office Hours Session Not Found" })

        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: JSON.stringify(error) })
      }
    }),

  getMyOfficeHoursSessions: professorOrStudentProcedure
    .query(async ({ ctx }) => {
      try {

        const sessions = await ctx.prisma.officeHourSession.findMany({
          where: {
            availability: ctx.session.user.role === 'professor' ? {
              professor: {
                id: {
                  equals: ctx.session.user.id,
                }
              }
            } : undefined,
            student: ctx.session.user.role === 'student' ? {
              id: {
                equals: ctx.session.user.id,
              }
            } : undefined,
          },
          include: {
            availability: {
              include: {
                professor: true,
              }
            },
            student: true
          }
        });

        return sessions;

      } catch (error) {
        if (error instanceof TRPCError)
          throw error

        if (error instanceof PrismaClientKnownRequestError)
          if (error.code === 'P2025')
            throw new TRPCError({ code: "NOT_FOUND", message: "Office Hours Session Not Found" })

        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: JSON.stringify(error) })
      }
    }),
  getMyCalendar: professorOrStudentProcedure
    .query(async ({ ctx }) => {
      try {

        const sessions = await ctx.prisma.availability.findMany({
          where: {
              professor: ctx.session.user.role === 'professor' ? {
                id: {
                  equals: ctx.session.user.id,
                }
            } : undefined,
            officeHoursSession: {
              student: ctx.session.user.role === 'student' ? {
                id: {
                  equals: ctx.session.user.id,
                }
              } : undefined,
            }
          },
          include: {
            officeHoursSession: {
              include: {
                student: true,
              }
            },
            professor: true
          }
        });

        return sessions;

      } catch (error) {
        if (error instanceof TRPCError)
          throw error

        if (error instanceof PrismaClientKnownRequestError)
          if (error.code === 'P2025')
            throw new TRPCError({ code: "NOT_FOUND", message: "Office Hours Session Not Found" })

        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: JSON.stringify(error) })
      }
    }),
});
