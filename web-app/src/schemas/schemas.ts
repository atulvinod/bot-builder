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
    timestamp,
} from "drizzle-orm/pg-core";

export const statusEnum = pgEnum("status", [
    "queued",
    "inprogress",
    "created",
    "failed",
    "failed_queue_push",
]);

export const botDetails = pgTable("bot_details", {
    id: serial("id").primaryKey(),
    name: varchar("name", {
        length: Number(constants.MAX_BOT_NAME_LENGTH),
    }).notNull(),
    description: text("description").notNull(),
    created_by_user_id: integer("created_by_user_id").notNull(),
    created_at: timestamp("created_at", { mode: "date" })
        .defaultNow()
        .notNull(),
    status: statusEnum("status").default("queued"),
    spec: json("spec"),
    is_deleted: boolean("is_deleted").default(false),
    avatar_image: text("avatar_image"),
    assets_id: text("assets_id"),
    is_private: boolean("is_private").default(false).notNull(),
});

export const chatSessions = pgTable("chat_sessions", {
    id: serial("id").primaryKey(),
    created_at: timestamp("created_at", { mode: "date" })
        .defaultNow()
        .notNull(),
    user_id: integer("user_id").notNull(),
    session_id: text("session_id").notNull(),
    bot_id: integer("bot_id").notNull(),
});

export const user = pgTable("users", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    picture: text("picture"),
    email: text("email").notNull().unique(),
    created_at: timestamp("created_at", { mode: "date" })
        .defaultNow()
        .notNull(),
});