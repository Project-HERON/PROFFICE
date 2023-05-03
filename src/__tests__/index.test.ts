import { PrismaClient } from "@prisma/client";
import { appRouter } from "~/server/api/root";

appRouter.createCaller({
    prisma: new PrismaClient(),
    session: null,
}).example.getAll()