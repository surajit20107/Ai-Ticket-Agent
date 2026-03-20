import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { serve } from "inngest/express";
import { inngest } from "./inngest/client.js";
import { userRegister } from "./inngest/functions/user.inngest.js";
import { ticketCreated } from "./inngest/functions/ticket.inngest.js";
import { connectDB } from "./config/db.js";
import userRouter from "./routes/user.routes.js";
import ticketRouter from "./routes/ticket.routes.js";
import { limiter } from "./middlewares/ratelimit.js"

const app = express();
config();

app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  }),
);

const port = process.env.PORT || 3000;

// ping route for cron job monitoring
app.get("/", (_, res) => {
  res.status(200).json({
    message: "Welcome to AI Ticket App 🚀",
    version: "1.0.0",
    author: "Surajit",
    github: "https://github.com/surajit20107",
  });
});

// ping route for uptimerobot
// for avoiding inactivity server spin down
app.head("/", (_, res) => {
  res.status(200).json({
    message: "server is running...!!",
  });
});

app.use("/api/users", userRouter);
app.use("/api/tickets", ticketRouter);
app.use(
  "/api/inngest",
  serve({
    client: inngest,
    functions: [userRegister, ticketCreated],
  }),
);

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is up & running...!! 🚀`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed connecting to the database:", err.message);
  });
