import * as constants from "../lib/constants";
import {
    serial,
    text,
    varchar,
    pgTable,
    pgSchema,
    integer,
    date,
    pgEnum,
    json,
    boolean,
} from "drizzle-orm/pg-core";

export const statusEnum = pgEnum("status", [
    "queued",
    "inprogress",
    "created",
    "failed",
]);

export const botDetails = pgTable("bot_details", {
    id: serial("id").primaryKey(),
    name: varchar("name", {
        length: Number(constants.MAX_BOT_NAME_LENGTH),
    }).notNull(),
    description: text("description").notNull(),
    created_by_user_id: integer("created_by_user_id").notNull(),
    created_at: date("created_at", { mode: "date" }).defaultNow().notNull(),
    status: statusEnum("status").default("queued"),
    spec: json("spec"),
    is_deleted: boolean("is_deleted").default(false),
});
