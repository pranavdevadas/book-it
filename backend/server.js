import http from "http";
import { Server as socketIo } from "socket.io";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/userRoute.js";
import adminRoutes from "./routes/adminRoute.js";
import ownerRoutes from "./routes/ownerRoute.js";
import chatRoutes from "./routes/chatRoute.js";
import { router as paymentRoutes } from "./routes/payment.js";
import path from "path";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import { dirname } from "path";

dotenv.config();
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const port = process.env.PORT || 5000;
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Enable CORS
const allowedOrigins = [
  "http://localhost:3000",
  "https://book-it-psi.vercel.app",
  "https://bookitt.online",
];
// app.use(
//   cors({
//     origin: allowedOrigins,
//     methods: ["GET", "POST"],
//     credentials: true,
//   })
// );

app.use(
  cors({
    origin: function (origin, callback) {
      // Check if the origin is in the allowedOrigins array
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ["GET", "POST", "OPTIONS"],  // Allow OPTIONS for preflight
    credentials: true,                    // Allow cookies to be sent
  })
);

// Routes
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/owner", ownerRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/chat", chatRoutes);
app.use(express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => res.send("Server is ready"));

app.use(notFound);
app.use(errorHandler);

const server = http.createServer(app);

const io = new socketIo(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  //console.log('User connected');

  socket.on("sendMessage", (messageData) => {
    const { chatId, message, timestamp } = messageData;
    io.emit("receiveMessage", messageData);
    io.emit("newMessage", { chatId, message, timestamp });
  });

  socket.on("disconnect", () => {
    //console.log('User disconnected');
  });
});

// Start server
server.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on port ${port}`);
});
