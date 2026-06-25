import { PrismaClient } from "../generated/prisma/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";
import { DATABASE_URL } from "./config.ts";

const adapter = new PrismaPg({
    connectionString: DATABASE_URL,
});

export const prisma = new PrismaClient({ adapter });