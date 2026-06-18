import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import multer from "multer";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import { registerObjectStorageRoutes } from "./replit_integrations/object_storage";

const upload = multer({ storage: multer.memoryStorage() });

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Integrations
  await setupAuth(app);
  registerAuthRoutes(app);
  registerObjectStorageRoutes(app);

  // Seed Data
  try {
    const existing = await storage.getUserByUsername("dr_anaesthetist");
    if (!existing) {
      const doc = await storage.createUser({ username: "dr_anaesthetist", role: "anaesthetist" });
      const staff = await storage.createUser({ username: "office_staff", role: "office_staff" });
      
      const entry = await storage.createBillingEntry({
        anaesthetistId: doc.id,
        patientHeight: "175",
        patientWeight: "75",
        icd10Code: "K35.8",
        procedureName: "Appendectomy",
        procedureCode: "43805",
        theatreStartTime: new Date(),
        theatreEndTime: new Date(Date.now() + 3600000),
        status: "submitted"
      });
      console.log("Database seeded!");
    }
  } catch (e) {
    console.error("Seeding failed:", e);
  }

  // Business Logic Routes
  // For now, we'll assume a middleware populates req.user
  // Or we can provide a login endpoint for development
  
  app.post("/api/login-dev", async (req, res) => {
    const { username, role } = req.body;
    let user = await storage.getUserByUsername(username);
    if (!user) {
      user = await storage.createUser({ username, role });
    }
    // In a real app, set session. For now, client stores user info or we rely on Replit Auth
    // Replit Auth will automatically handle /login
    res.json(user);
  });

  app.get(api.auth.me.path, async (req, res) => {
    // If Replit Auth is active
    if (req.header("x-replit-user-id")) {
      // Sync Replit user with our DB
      const username = req.header("x-replit-user-name")!;
      let user = await storage.getUserByUsername(username);
      if (!user) {
        // Default new users to anaesthetist, can be changed in DB
        user = await storage.createUser({ username, role: "anaesthetist" });
      }
      return res.json(user);
    }
    
    // Fallback for dev without Replit Auth headers
    // For prototype, return a mock user or 401
    // res.status(401).json({ message: "Not authenticated" });
    
    // MOCK USER FOR DEVELOPMENT IF NO AUTH HEADERS
    const mockUser = await storage.getUserByUsername("dev_anaesthetist");
    if (mockUser) return res.json(mockUser);
    
    res.status(401).json({ message: "Not authenticated" });
  });

  // Billing Entries
  app.get(api.billingEntries.list.path, async (req, res) => {
    // Get user from session/context (Mocked as query param for simplicity if needed, but ideally from auth)
    // const userId = req.user?.id;
    // For now, fetching all for demonstration or specific user if we had the context
    
    const entries = await storage.getAllBillingEntries();
    // Populate relations manually or use a join in storage (keeping it simple here)
    const entriesWithDetails = await Promise.all(entries.map(async (entry) => {
      const photos = await storage.getPhotosByEntryId(entry.id);
      const anaesthetist = await storage.getUser(entry.anaesthetistId);
      return { ...entry, photos, anaesthetist };
    }));
    
    res.json(entriesWithDetails);
  });

  app.get(api.billingEntries.get.path, async (req, res) => {
    const id = parseInt(req.params.id);
    const entry = await storage.getBillingEntry(id);
    if (!entry) return res.status(404).json({ message: "Not found" });
    
    const photos = await storage.getPhotosByEntryId(id);
    res.json({ ...entry, photos });
  });

  app.post(api.billingEntries.create.path, async (req, res) => {
    try {
      const input = api.billingEntries.create.input.parse(req.body);
      const { photoUrls, ...entryData } = input;
      
      // Determine anaesthetist ID (from Auth)
      // For now, finding a default user or creating one
      let user = await storage.getUserByUsername("dev_anaesthetist");
      if (!user) {
        user = await storage.createUser({ username: "dev_anaesthetist", role: "anaesthetist" });
      }
      
      const entry = await storage.createBillingEntry({
        ...entryData,
        anaesthetistId: user.id
      });
      
      if (photoUrls) {
        for (const url of photoUrls) {
          await storage.createPhoto({ billingEntryId: entry.id, url });
        }
      }
      
      await storage.createAuditLog({
        userId: user.id,
        action: "create_entry",
        entityId: entry.id,
        details: "Created new billing entry"
      });
      
      res.status(201).json(entry);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.patch(api.billingEntries.process.path, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const input = api.billingEntries.process.input.parse(req.body);
      
      // Get office staff user
      let user = await storage.getUserByUsername("dev_office");
      if (!user) {
        user = await storage.createUser({ username: "dev_office", role: "office_staff" });
      }

      const updated = await storage.updateBillingEntryStatus(
        id, 
        input.status, 
        input.officeNotes, 
        input.accountNumber
      );
      
      await storage.createAuditLog({
        userId: user.id,
        action: `process_entry_${input.status}`,
        entityId: id,
        details: JSON.stringify(input)
      });
      
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  // Uploads
  app.post(api.uploads.create.path, upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    
    // In a real implementation with Replit Object Storage, we would upload there.
    // For this prototype, we'll return a data URI or a mock URL.
    // Since we added the integration, we should try to use it, but the generated code needs to handle it.
    // Simplest approach for prototype: Return a base64 data URI (limitations on size) OR
    // just pretend we uploaded it.
    
    // For a robust prototype without external storage working 100% yet:
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataUrl = `data:${req.file.mimetype};base64,${b64}`;
    
    res.json({ url: dataUrl });
  });

  return httpServer;
}
