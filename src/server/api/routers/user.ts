import { z } from "zod";

import {
  createTRPCRouter,
  professorOrStudentProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { UserRole } from "@prisma/client";

export const userRouter = createTRPCRouter({
  searchUsers: professorOrStudentProcedure
    .input(
      z
        .object({
          role: z.enum([UserRole.professor, UserRole.student]),
          query: z.string().min(1).max(50),
        })
    )
    .mutation(async ({ ctx, input: { query, role } }) => {
      try {

        const users = await ctx.prisma.user.findMany({
          where: {
            AND: [
              {
                OR: [
                  {
                    name: {
                      contains: query,
                      mode: 'insensitive'
                    }
                  },
                  {
                    email: {
                      contains: query,
                      mode: 'insensitive'
                    }
                  }
                ]
              },
              {
                role: {
                  equals: role,
                }
              }

            ]
          }
        });

        return users;

      } catch (error) {
        if (error instanceof TRPCError)
          throw (error)

        // if (error instanceof PrismaClientKnownRequestError)
        //   if (error.code === 'P2025')
        //     throw new TRPCError({ code: "NOT_FOUND", message: "Availability Not Found" })

        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: JSON.stringify(error) })
      }
    }),
});
