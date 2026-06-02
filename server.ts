import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import nodemailer from "nodemailer";
import twilio from "twilio";

// Simple file-based db for bookings
const DB_FILE = path.join(process.cwd(), "db.json");

// Nodemailer setup
let transporter: nodemailer.Transporter | null = null;
function getTransporter() {
  if (!transporter && process.env.SMTP_HOST && process.env.SMTP_USER) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      secure: Number(process.env.SMTP_PORT) === 465,
    });
  }
  return transporter;
}

// Twilio setup
let twilioClient: twilio.Twilio | null = null;
function getTwilio() {
  if (!twilioClient && process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  }
  return twilioClient;
}

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || process.env.SMTP_USER;

const FROM_EMAIL = process.env.FROM_EMAIL || process.env.SMTP_USER;

interface Booking {
  id: string;
  name: string;
  mobile: string;
  brand: string;
  model: string;
  issue: string;
  address: string;
  timeSlot: string;
  paymentMethod: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
  rating?: number;
  review?: string;
  reviewSubmitted?: boolean;
}

function getBookings(): Booking[] {
  if (!fs.existsSync(DB_FILE)) {
    return [];
  }
  try {
    const data = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function saveBookings(bookings: Booking[]) {
  fs.writeFileSync(DB_FILE, JSON.stringify(bookings, null, 2));
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API ROUTES
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/bookings", (req, res) => {
    const { name, mobile, brand, model, issue, address, timeSlot, paymentMethod } = req.body;
    
    // Basic validation
    if (!name || !mobile || !brand || !model || !issue || !address || !timeSlot || !paymentMethod) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newBooking: Booking = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      mobile,
      brand,
      model,
      issue,
      address,
      timeSlot,
      paymentMethod,
      status: "pending",
      createdAt: new Date().toISOString()
    };

    const bookings = getBookings();
    bookings.push(newBooking);
    saveBookings(bookings);

    // Send notifications in the background
    const mailer = getTransporter();
    if (mailer && ADMIN_EMAIL && FROM_EMAIL) {
      const emailContent = `
New Booking Application:
Name: ${name}
Mobile: ${mobile}
Brand & Model: ${brand} ${model}
Issue: ${issue}
Address: ${address}
Preferred Time Slot: ${timeSlot}
Payment Method: ${paymentMethod}
      `.trim();

      mailer.sendMail({
        from: FROM_EMAIL,
        to: ADMIN_EMAIL,
        subject: `New Repair Booking - ${brand} ${model}`,
        text: emailContent,
      }).catch(err => console.error("Error sending admin email:", err));
      
      // Optionally notify user if email provided (assuming we had an email field, else skip)
    }

    res.json({ success: true, booking: newBooking });
  });

  app.get("/api/bookings", (req, res) => {
    // Basic hardcoded auth for demo admin
    const authHeader = req.headers.authorization;
    if (authHeader !== "Bearer admin-secret-key") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    res.json(getBookings().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  });

  app.patch("/api/bookings/:id", (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader !== "Bearer admin-secret-key") {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { status } = req.body;
    const { id } = req.params;
    
    const bookings = getBookings();
    const index = bookings.findIndex(b => b.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const previousStatus = bookings[index].status;
    bookings[index].status = status;
    saveBookings(bookings);

    res.json(bookings[index]);
  });

  app.post("/api/bookings/:id/feedback", (req, res) => {
    const { id } = req.params;
    const { rating, review } = req.body;
    
    const bookings = getBookings();
    const index = bookings.findIndex(b => b.id === id);
    if (index === -1) return res.status(404).json({ error: "Booking not found" });

    bookings[index].rating = rating;
    bookings[index].review = review;
    bookings[index].reviewSubmitted = true;
    saveBookings(bookings);

    res.json(bookings[index]);
  });

  app.get("/api/reviews", (req, res) => {
    const reviews = getBookings()
      .filter(b => b.reviewSubmitted && b.rating && b.rating >= 4)
      .map(b => ({
        id: b.id,
        name: b.name,
        brand: b.brand,
        model: b.model,
        rating: b.rating,
        review: b.review,
        createdAt: b.createdAt
      }))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 9);
    res.json(reviews);
  });

  app.get("/api/bookings/user/:mobile", (req, res) => {
    const { mobile } = req.params;
    
    // In a real app, verify OTP/Auth here
    const bookings = getBookings().filter(b => b.mobile === mobile);
    
    // Return non-sensitive fields
    res.json(bookings.map(b => ({
      id: b.id,
      brand: b.brand,
      model: b.model,
      issue: b.issue,
      status: b.status,
      createdAt: b.createdAt
    })).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  });

  app.get("/api/bookings/status/:id", (req, res) => {
    const { id } = req.params;
    
    const bookings = getBookings();
    const booking = bookings.find(b => b.id === id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Only return non-sensitive fields
    res.json({
      id: booking.id,
      brand: booking.brand,
      model: booking.model,
      issue: booking.issue,
      status: booking.status,
      createdAt: booking.createdAt,
      reviewSubmitted: booking.reviewSubmitted
    });
  });

  // VITE MIDDLEWARE (Dev) OR STATIC SERVING (Prod)
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
