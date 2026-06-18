import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const procedures = pgTable("procedures", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patientId: text("patient_id").notNull(),
  procedureName: text("procedure_name").notNull(),
  status: text("status").notNull().default("in-progress"), // "in-progress", "completed", "draft"
  startTime: text("start_time"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const procedureImages = pgTable("procedure_images", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  procedureId: text("procedure_id").notNull(),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(),
  capturedAt: timestamp("captured_at").defaultNow(),
});

export const medicalCodes = pgTable("medical_codes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  procedureId: text("procedure_id").notNull(),
  codeType: text("code_type").notNull(), // "cpt", "icd", "procedure"
  code: text("code").notNull(),
  description: text("description").notNull(),
  isPMB: text("is_pmb").default("false"), // PMB flag for ICD codes
  addedAt: timestamp("added_at").defaultNow(),
});

export const procedureTimes = pgTable("procedure_times", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  procedureId: text("procedure_id").notNull(),
  anesthesiaStart: text("anesthesia_start"),
  procedureStart: text("procedure_start"),
  procedureEnd: text("procedure_end"),
  anesthesiaEnd: text("anesthesia_end"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const clinicalNotes = pgTable("clinical_notes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  procedureId: text("procedure_id").notNull(),
  preOperative: text("pre_operative").default(""),
  intraOperative: text("intra_operative").default(""),
  postOperative: text("post_operative").default(""),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas
export const insertProcedureSchema = createInsertSchema(procedures).omit({ id: true, createdAt: true });
export const insertProcedureImageSchema = createInsertSchema(procedureImages).omit({ id: true, capturedAt: true });
export const insertMedicalCodeSchema = createInsertSchema(medicalCodes).omit({ id: true, addedAt: true });
export const insertProcedureTimesSchema = createInsertSchema(procedureTimes).omit({ id: true, updatedAt: true });
export const insertClinicalNotesSchema = createInsertSchema(clinicalNotes).omit({ id: true, updatedAt: true });

// Types
export type InsertProcedure = z.infer<typeof insertProcedureSchema>;
export type InsertProcedureImage = z.infer<typeof insertProcedureImageSchema>;
export type InsertMedicalCode = z.infer<typeof insertMedicalCodeSchema>;
export type InsertProcedureTimes = z.infer<typeof insertProcedureTimesSchema>;
export type InsertClinicalNotes = z.infer<typeof insertClinicalNotesSchema>;

export type Procedure = typeof procedures.$inferSelect;
export type ProcedureImage = typeof procedureImages.$inferSelect;
export type MedicalCode = typeof medicalCodes.$inferSelect;
export type ProcedureTimes = typeof procedureTimes.$inferSelect;
export type ClinicalNotes = typeof clinicalNotes.$inferSelect;

// Complete procedure data type for frontend
export type CompleteProcedureData = {
  procedure: Procedure;
  images: ProcedureImage[];
  codes: MedicalCode[];
  times: ProcedureTimes | null;
  notes: ClinicalNotes | null;
};
