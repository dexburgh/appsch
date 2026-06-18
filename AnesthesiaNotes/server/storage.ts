import { 
  type Procedure, 
  type InsertProcedure,
  type ProcedureImage,
  type InsertProcedureImage,
  type MedicalCode,
  type InsertMedicalCode,
  type ProcedureTimes,
  type InsertProcedureTimes,
  type ClinicalNotes,
  type InsertClinicalNotes,
  type CompleteProcedureData,
  procedures,
  procedureImages,
  medicalCodes,
  procedureTimes,
  clinicalNotes
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  // Procedures
  createProcedure(procedure: InsertProcedure): Promise<Procedure>;
  getProcedure(id: string): Promise<Procedure | undefined>;
  getAllProcedures(): Promise<Procedure[]>;
  updateProcedure(id: string, updates: Partial<InsertProcedure>): Promise<Procedure | undefined>;
  
  // Images
  addProcedureImage(image: InsertProcedureImage): Promise<ProcedureImage>;
  getProcedureImages(procedureId: string): Promise<ProcedureImage[]>;
  deleteProcedureImage(id: string): Promise<boolean>;
  
  // Medical Codes
  addMedicalCode(code: InsertMedicalCode): Promise<MedicalCode>;
  getProcedureCodes(procedureId: string): Promise<MedicalCode[]>;
  deleteMedicalCode(id: string): Promise<boolean>;
  
  // Times
  upsertProcedureTimes(times: InsertProcedureTimes): Promise<ProcedureTimes>;
  getProcedureTimes(procedureId: string): Promise<ProcedureTimes | undefined>;
  
  // Notes
  upsertClinicalNotes(notes: InsertClinicalNotes): Promise<ClinicalNotes>;
  getClinicalNotes(procedureId: string): Promise<ClinicalNotes | undefined>;
  
  // Complete data
  getCompleteProcedureData(procedureId: string): Promise<CompleteProcedureData | undefined>;
}

export class MemStorage implements IStorage {
  private procedures: Map<string, Procedure> = new Map();
  private images: Map<string, ProcedureImage> = new Map();
  private codes: Map<string, MedicalCode> = new Map();
  private times: Map<string, ProcedureTimes> = new Map();
  private notes: Map<string, ClinicalNotes> = new Map();

  async createProcedure(insertProcedure: InsertProcedure): Promise<Procedure> {
    const id = randomUUID();
    const procedure: Procedure = {
      ...insertProcedure,
      id,
      createdAt: new Date(),
    };
    this.procedures.set(id, procedure);
    return procedure;
  }

  async getProcedure(id: string): Promise<Procedure | undefined> {
    return this.procedures.get(id);
  }

  async getAllProcedures(): Promise<Procedure[]> {
    return Array.from(this.procedures.values()).sort((a, b) => 
      b.createdAt!.getTime() - a.createdAt!.getTime()
    );
  }

  async updateProcedure(id: string, updates: Partial<InsertProcedure>): Promise<Procedure | undefined> {
    const procedure = this.procedures.get(id);
    if (!procedure) return undefined;
    
    const updated = { ...procedure, ...updates };
    this.procedures.set(id, updated);
    return updated;
  }

  async addProcedureImage(insertImage: InsertProcedureImage): Promise<ProcedureImage> {
    const id = randomUUID();
    const image: ProcedureImage = {
      ...insertImage,
      id,
      capturedAt: new Date(),
    };
    this.images.set(id, image);
    return image;
  }

  async getProcedureImages(procedureId: string): Promise<ProcedureImage[]> {
    return Array.from(this.images.values())
      .filter(img => img.procedureId === procedureId)
      .sort((a, b) => b.capturedAt!.getTime() - a.capturedAt!.getTime());
  }

  async deleteProcedureImage(id: string): Promise<boolean> {
    return this.images.delete(id);
  }

  async addMedicalCode(insertCode: InsertMedicalCode): Promise<MedicalCode> {
    const id = randomUUID();
    const code: MedicalCode = {
      ...insertCode,
      id,
      addedAt: new Date(),
    };
    this.codes.set(id, code);
    return code;
  }

  async getProcedureCodes(procedureId: string): Promise<MedicalCode[]> {
    return Array.from(this.codes.values())
      .filter(code => code.procedureId === procedureId)
      .sort((a, b) => b.addedAt!.getTime() - a.addedAt!.getTime());
  }

  async deleteMedicalCode(id: string): Promise<boolean> {
    return this.codes.delete(id);
  }

  async upsertProcedureTimes(insertTimes: InsertProcedureTimes): Promise<ProcedureTimes> {
    const existing = Array.from(this.times.values())
      .find(t => t.procedureId === insertTimes.procedureId);
    
    if (existing) {
      const updated: ProcedureTimes = {
        ...existing,
        ...insertTimes,
        updatedAt: new Date(),
      };
      this.times.set(existing.id, updated);
      return updated;
    } else {
      const id = randomUUID();
      const times: ProcedureTimes = {
        ...insertTimes,
        id,
        updatedAt: new Date(),
      };
      this.times.set(id, times);
      return times;
    }
  }

  async getProcedureTimes(procedureId: string): Promise<ProcedureTimes | undefined> {
    return Array.from(this.times.values())
      .find(t => t.procedureId === procedureId);
  }

  async upsertClinicalNotes(insertNotes: InsertClinicalNotes): Promise<ClinicalNotes> {
    const existing = Array.from(this.notes.values())
      .find(n => n.procedureId === insertNotes.procedureId);
    
    if (existing) {
      const updated: ClinicalNotes = {
        ...existing,
        ...insertNotes,
        updatedAt: new Date(),
      };
      this.notes.set(existing.id, updated);
      return updated;
    } else {
      const id = randomUUID();
      const notes: ClinicalNotes = {
        ...insertNotes,
        id,
        updatedAt: new Date(),
      };
      this.notes.set(id, notes);
      return notes;
    }
  }

  async getClinicalNotes(procedureId: string): Promise<ClinicalNotes | undefined> {
    return Array.from(this.notes.values())
      .find(n => n.procedureId === procedureId);
  }

  async getCompleteProcedureData(procedureId: string): Promise<CompleteProcedureData | undefined> {
    const procedure = await this.getProcedure(procedureId);
    if (!procedure) return undefined;
    
    const [images, codes, times, notes] = await Promise.all([
      this.getProcedureImages(procedureId),
      this.getProcedureCodes(procedureId),
      this.getProcedureTimes(procedureId),
      this.getClinicalNotes(procedureId),
    ]);
    
    return {
      procedure,
      images,
      codes,
      times,
      notes,
    };
  }
}

export class DatabaseStorage implements IStorage {
  async createProcedure(insertProcedure: InsertProcedure): Promise<Procedure> {
    const [procedure] = await db
      .insert(procedures)
      .values(insertProcedure)
      .returning();
    return procedure;
  }

  async getProcedure(id: string): Promise<Procedure | undefined> {
    const [procedure] = await db
      .select()
      .from(procedures)
      .where(eq(procedures.id, id));
    return procedure || undefined;
  }

  async getAllProcedures(): Promise<Procedure[]> {
    return await db
      .select()
      .from(procedures)
      .orderBy(desc(procedures.createdAt));
  }

  async updateProcedure(id: string, updates: Partial<InsertProcedure>): Promise<Procedure | undefined> {
    const [updated] = await db
      .update(procedures)
      .set(updates)
      .where(eq(procedures.id, id))
      .returning();
    return updated || undefined;
  }

  async addProcedureImage(insertImage: InsertProcedureImage): Promise<ProcedureImage> {
    const [image] = await db
      .insert(procedureImages)
      .values(insertImage)
      .returning();
    return image;
  }

  async getProcedureImages(procedureId: string): Promise<ProcedureImage[]> {
    return await db
      .select()
      .from(procedureImages)
      .where(eq(procedureImages.procedureId, procedureId))
      .orderBy(desc(procedureImages.capturedAt));
  }

  async deleteProcedureImage(id: string): Promise<boolean> {
    const result = await db
      .delete(procedureImages)
      .where(eq(procedureImages.id, id));
    return result.rowCount! > 0;
  }

  async addMedicalCode(insertCode: InsertMedicalCode): Promise<MedicalCode> {
    const [code] = await db
      .insert(medicalCodes)
      .values({
        ...insertCode,
        isPMB: insertCode.isPMB || "false"
      })
      .returning();
    return code;
  }

  async getProcedureCodes(procedureId: string): Promise<MedicalCode[]> {
    return await db
      .select()
      .from(medicalCodes)
      .where(eq(medicalCodes.procedureId, procedureId))
      .orderBy(desc(medicalCodes.addedAt));
  }

  async deleteMedicalCode(id: string): Promise<boolean> {
    const result = await db
      .delete(medicalCodes)
      .where(eq(medicalCodes.id, id));
    return result.rowCount! > 0;
  }

  async upsertProcedureTimes(insertTimes: InsertProcedureTimes): Promise<ProcedureTimes> {
    const existing = await db
      .select()
      .from(procedureTimes)
      .where(eq(procedureTimes.procedureId, insertTimes.procedureId));

    if (existing.length > 0) {
      const [updated] = await db
        .update(procedureTimes)
        .set(insertTimes)
        .where(eq(procedureTimes.procedureId, insertTimes.procedureId))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(procedureTimes)
        .values(insertTimes)
        .returning();
      return created;
    }
  }

  async getProcedureTimes(procedureId: string): Promise<ProcedureTimes | undefined> {
    const [times] = await db
      .select()
      .from(procedureTimes)
      .where(eq(procedureTimes.procedureId, procedureId));
    return times || undefined;
  }

  async upsertClinicalNotes(insertNotes: InsertClinicalNotes): Promise<ClinicalNotes> {
    const existing = await db
      .select()
      .from(clinicalNotes)
      .where(eq(clinicalNotes.procedureId, insertNotes.procedureId));

    if (existing.length > 0) {
      const [updated] = await db
        .update(clinicalNotes)
        .set(insertNotes)
        .where(eq(clinicalNotes.procedureId, insertNotes.procedureId))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(clinicalNotes)
        .values(insertNotes)
        .returning();
      return created;
    }
  }

  async getClinicalNotes(procedureId: string): Promise<ClinicalNotes | undefined> {
    const [notes] = await db
      .select()
      .from(clinicalNotes)
      .where(eq(clinicalNotes.procedureId, procedureId));
    return notes || undefined;
  }

  async getCompleteProcedureData(procedureId: string): Promise<CompleteProcedureData | undefined> {
    const procedure = await this.getProcedure(procedureId);
    if (!procedure) return undefined;
    
    const [images, codes, times, notes] = await Promise.all([
      this.getProcedureImages(procedureId),
      this.getProcedureCodes(procedureId),
      this.getProcedureTimes(procedureId),
      this.getClinicalNotes(procedureId),
    ]);
    
    return {
      procedure,
      images,
      codes,
      times: times || null,
      notes: notes || null,
    };
  }
}

export const storage = new DatabaseStorage();
