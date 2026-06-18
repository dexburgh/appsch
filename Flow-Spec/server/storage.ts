import { db } from "./db";
import {
  users, billingEntries, photos, auditLogs,
  type User, type InsertUser,
  type BillingEntry, type InsertBillingEntry,
  type Photo, type InsertPhoto,
  type AuditLog
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Billing Entries
  createBillingEntry(entry: InsertBillingEntry): Promise<BillingEntry>;
  getBillingEntry(id: number): Promise<BillingEntry | undefined>;
  getAllBillingEntries(): Promise<BillingEntry[]>; // For office staff
  getBillingEntriesByAnaesthetist(userId: number): Promise<BillingEntry[]>;
  updateBillingEntryStatus(id: number, status: string, notes?: string, accountNumber?: string): Promise<BillingEntry>;
  
  // Photos
  createPhoto(photo: InsertPhoto): Promise<Photo>;
  getPhotosByEntryId(entryId: number): Promise<Photo[]>;
  
  // Audit
  createAuditLog(log: typeof auditLogs.$inferInsert): Promise<AuditLog>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async createBillingEntry(entry: InsertBillingEntry): Promise<BillingEntry> {
    const [newEntry] = await db.insert(billingEntries).values(entry).returning();
    return newEntry;
  }

  async getBillingEntry(id: number): Promise<BillingEntry | undefined> {
    const [entry] = await db.select().from(billingEntries).where(eq(billingEntries.id, id));
    return entry;
  }

  async getAllBillingEntries(): Promise<BillingEntry[]> {
    return await db.select().from(billingEntries).orderBy(desc(billingEntries.createdAt));
  }

  async getBillingEntriesByAnaesthetist(userId: number): Promise<BillingEntry[]> {
    return await db.select()
      .from(billingEntries)
      .where(eq(billingEntries.anaesthetistId, userId))
      .orderBy(desc(billingEntries.createdAt));
  }

  async updateBillingEntryStatus(id: number, status: string, notes?: string, accountNumber?: string): Promise<BillingEntry> {
    const [updated] = await db.update(billingEntries)
      .set({ 
        status: status as any, 
        officeNotes: notes, 
        accountNumber: accountNumber,
        updatedAt: new Date() 
      })
      .where(eq(billingEntries.id, id))
      .returning();
    return updated;
  }

  async createPhoto(photo: InsertPhoto): Promise<Photo> {
    const [newPhoto] = await db.insert(photos).values(photo).returning();
    return newPhoto;
  }

  async getPhotosByEntryId(entryId: number): Promise<Photo[]> {
    return await db.select().from(photos).where(eq(photos.billingEntryId, entryId));
  }

  async createAuditLog(log: typeof auditLogs.$inferInsert): Promise<AuditLog> {
    const [newLog] = await db.insert(auditLogs).values(log).returning();
    return newLog;
  }
}

export const storage = new DatabaseStorage();
