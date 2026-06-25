export const PORT = process.env.PORT || 9000;
export const DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/postgres";
export const MICROSERVICE_BASE_URL = process.env.MICROSERVICE_BASE_URL || "http://localhost:8000";
export const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const LOGS_DIRECTORY = "logs";