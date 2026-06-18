import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProcedureSchema, insertProcedureImageSchema, insertMedicalCodeSchema, insertProcedureTimesSchema, insertClinicalNotesSchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for image uploads
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  dest: uploadDir,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ["image/jpeg", "image/png", "image/jpg"];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG, PNG images are allowed"));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get all procedures
  app.get("/api/procedures", async (req, res) => {
    try {
      const procedures = await storage.getAllProcedures();
      res.json(procedures);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch procedures" });
    }
  });

  // Create a new procedure
  app.post("/api/procedures", async (req, res) => {
    try {
      const validatedData = insertProcedureSchema.parse(req.body);
      const procedure = await storage.createProcedure(validatedData);
      res.status(201).json(procedure);
    } catch (error) {
      res.status(400).json({ message: "Invalid procedure data" });
    }
  });

  // Get complete procedure data
  app.get("/api/procedures/:id/complete", async (req, res) => {
    try {
      const { id } = req.params;
      const data = await storage.getCompleteProcedureData(id);
      if (!data) {
        return res.status(404).json({ message: "Procedure not found" });
      }
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch procedure data" });
    }
  });

  // Update procedure
  app.patch("/api/procedures/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const procedure = await storage.updateProcedure(id, updates);
      if (!procedure) {
        return res.status(404).json({ message: "Procedure not found" });
      }
      res.json(procedure);
    } catch (error) {
      res.status(500).json({ message: "Failed to update procedure" });
    }
  });

  // Upload procedure image
  app.post("/api/procedures/:id/images", upload.single("image"), async (req, res) => {
    try {
      const { id } = req.params;
      const file = req.file;
      
      if (!file) {
        return res.status(400).json({ message: "No image file provided" });
      }

      const imageData = {
        procedureId: id,
        filename: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
      };

      const image = await storage.addProcedureImage(imageData);
      res.status(201).json(image);
    } catch (error) {
      res.status(500).json({ message: "Failed to upload image" });
    }
  });

  // Get procedure images
  app.get("/api/procedures/:id/images", async (req, res) => {
    try {
      const { id } = req.params;
      const images = await storage.getProcedureImages(id);
      res.json(images);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch images" });
    }
  });

  // Delete procedure image
  app.delete("/api/images/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteProcedureImage(id);
      if (!deleted) {
        return res.status(404).json({ message: "Image not found" });
      }
      res.json({ message: "Image deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete image" });
    }
  });

  // Serve uploaded images
  app.get("/api/images/:filename", (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(uploadDir, filename);
    
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).json({ message: "Image not found" });
    }
  });

  // Add medical code
  app.post("/api/procedures/:id/codes", async (req, res) => {
    try {
      const { id } = req.params;
      const codeData = { ...req.body, procedureId: id };
      const validatedData = insertMedicalCodeSchema.parse(codeData);
      const code = await storage.addMedicalCode(validatedData);
      res.status(201).json(code);
    } catch (error) {
      res.status(400).json({ message: "Invalid code data" });
    }
  });

  // Get procedure codes
  app.get("/api/procedures/:id/codes", async (req, res) => {
    try {
      const { id } = req.params;
      const codes = await storage.getProcedureCodes(id);
      res.json(codes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch codes" });
    }
  });

  // Delete medical code
  app.delete("/api/codes/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteMedicalCode(id);
      if (!deleted) {
        return res.status(404).json({ message: "Code not found" });
      }
      res.json({ message: "Code deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete code" });
    }
  });

  // Update procedure times
  app.put("/api/procedures/:id/times", async (req, res) => {
    try {
      const { id } = req.params;
      const timesData = { ...req.body, procedureId: id };
      const validatedData = insertProcedureTimesSchema.parse(timesData);
      const times = await storage.upsertProcedureTimes(validatedData);
      res.json(times);
    } catch (error) {
      res.status(400).json({ message: "Invalid times data" });
    }
  });

  // Update clinical notes
  app.put("/api/procedures/:id/notes", async (req, res) => {
    try {
      const { id } = req.params;
      const notesData = { ...req.body, procedureId: id };
      const validatedData = insertClinicalNotesSchema.parse(notesData);
      const notes = await storage.upsertClinicalNotes(validatedData);
      res.json(notes);
    } catch (error) {
      res.status(400).json({ message: "Invalid notes data" });
    }
  });

  // Submit to billing (mock PMA integration)
  app.post("/api/procedures/:id/submit", async (req, res) => {
    try {
      const { id } = req.params;
      const procedureData = await storage.getCompleteProcedureData(id);
      
      if (!procedureData) {
        return res.status(404).json({ message: "Procedure not found" });
      }

      // Mock PMA system integration
      // In real implementation, this would format data according to HL7 FHIR
      // and send to external PMA system
      
      // Update procedure status to completed
      await storage.updateProcedure(id, { status: "completed" });
      
      // Mock successful submission
      const submissionResult = {
        success: true,
        submissionId: `SUB-${Date.now()}`,
        timestamp: new Date().toISOString(),
        message: "Successfully submitted to PMA system",
        data: {
          procedureId: id,
          patientId: procedureData.procedure.patientId,
          imageCount: procedureData.images.length,
          codeCount: procedureData.codes.length,
          hasCompleteData: !!(procedureData.times && procedureData.notes),
        },
      };
      
      res.json(submissionResult);
    } catch (error) {
      res.status(500).json({ message: "Failed to submit to billing system" });
    }
  });

  // Search medical codes (mock implementation)
  app.get("/api/codes/search", async (req, res) => {
    const query = req.query.q?.toString().toLowerCase() || "";
    const codeType = req.query.type?.toString() || "both";
    
    // Mock CPT codes
    const cptCodes = [
      { code: "00400", description: "Anesthesia for procedures on integumentary system" },
      { code: "00402", description: "Anesthesia for procedures on lower leg" },
      { code: "00410", description: "Anesthesia for procedures on knee and lower leg" },
      { code: "00454", description: "Anesthesia for procedures on foot" },
      { code: "00100", description: "Anesthesia for procedures on salivary glands" },
      { code: "00102", description: "Anesthesia for procedures involving plastic repair of cleft lip" },
      { code: "00103", description: "Anesthesia for reconstructive procedures of eyelid" },
    ];
    
    // Mock ICD codes with PMB status
    const icdCodes = [
      { code: "M23.221", description: "Derangement of anterior horn of medial meniscus, right knee", isPMB: true },
      { code: "M23.222", description: "Derangement of anterior horn of medial meniscus, left knee", isPMB: true },
      { code: "M23.201", description: "Derangement of unspecified meniscus due to old tear, right knee", isPMB: false },
      { code: "M17.0", description: "Bilateral primary osteoarthritis of knee", isPMB: true },
      { code: "M17.10", description: "Unilateral primary osteoarthritis, unspecified knee", isPMB: true },
      { code: "S83.271A", description: "Other tear of lateral meniscus, current injury, right knee", isPMB: false },
    ];

    // Mock Procedure codes
    const procedureCodes = [
      { code: "PROC001", description: "Arthroscopic meniscectomy, medial or lateral" },
      { code: "PROC002", description: "Arthroscopic repair of meniscus" },
      { code: "PROC003", description: "Total knee replacement" },
      { code: "PROC004", description: "Partial knee replacement" },
      { code: "PROC005", description: "Ligament reconstruction" },
    ];
    
    let results: any[] = [];
    
    if (codeType === "cpt" || codeType === "both") {
      const filteredCpt = query ? 
        cptCodes.filter(code => 
          code.code.toLowerCase().includes(query) ||
          code.description.toLowerCase().includes(query)
        ) : cptCodes;
      results = [...results, ...filteredCpt.map(code => ({ ...code, type: "cpt" }))];
    }
    
    if (codeType === "icd" || codeType === "both") {
      const filteredIcd = query ? 
        icdCodes.filter(code => 
          code.code.toLowerCase().includes(query) ||
          code.description.toLowerCase().includes(query)
        ) : icdCodes;
      results = [...results, ...filteredIcd.map(code => ({ ...code, type: "icd" }))];
    }
    
    if (codeType === "procedure" || codeType === "both") {
      const filteredProcedure = query ? 
        procedureCodes.filter(code => 
          code.code.toLowerCase().includes(query) ||
          code.description.toLowerCase().includes(query)
        ) : procedureCodes;
      results = [...results, ...filteredProcedure.map(code => ({ ...code, type: "procedure" }))];
    }
    
    res.json(results.slice(0, 20)); // Limit results
  });

  const httpServer = createServer(app);
  return httpServer;
}
