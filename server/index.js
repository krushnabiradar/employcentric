const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIO = require("socket.io");
const passport = require("passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const config = require("./config/config");
const connectDB = require("./config/database");
const logger = require("./utils/logger");
require("./config/passport")();

// Route imports
const authRoutes = require("./routes/authRoutes");
const leaveRoutes = require("./routes/leaveRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const payrollRoutes = require("./routes/payrollRoutes");
const tenantRoutes = require("./routes/tenantRoutes");
const superadminRoutes = require("./routes/superadminRoutes");
const systemRoutes = require("./routes/systemRoutes");

// Initialize express app
const app = express();

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS configuration
const corsOptions = {
  origin: function(origin, callback) {
    const allowedOrigins = ['http://localhost:3000', 'http://localhost:5173'];
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Cookie', 'X-Auth-Token', 'X-Requested-With'],
  exposedHeaders: ['Authorization', 'Set-Cookie'],
  optionsSuccessStatus: 200,
  preflightContinue: false,
  maxAge: 86400 // 24 hours in seconds
};

app.use(cors(corsOptions));

// Connect to MongoDB
connectDB();

// Setup express-session
app.use(
  session({
    secret: config.sessionSecret || "employcentric_secret",
    resave: false,
    saveUninitialized: false,
    proxy: true, // Required for secure cookies behind a proxy/load balancer
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      path: '/',
      domain: 'localhost' // Explicitly set for local development
    },
    name: 'sessionId' // Custom name to avoid default 'connect.sid'
  })
);

// Log all requests for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, {
    cookies: req.headers.cookie,
    origin: req.headers.origin,
  });
  next();
});

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());


// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/payroll", payrollRoutes);
app.use("/api/tenants", tenantRoutes);
app.use("/api/superadmin", superadminRoutes);
app.use("/api/system", systemRoutes);
app.use("/api/superadmin", superadminRoutes);
app.use("/api/system", systemRoutes);

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = socketIO(server, {
  cors: {
    origin: config.corsOrigin,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Socket.io connection handler
io.on("connection", (socket) => {
  logger.info(`New socket connection: ${socket.id}`);

  socket.on("authenticate", (userId) => {
    logger.info(`User ${userId} authenticated on socket ${socket.id}`);
    socket.join(userId);
  });

  socket.on("disconnect", () => {
    logger.info(`Socket disconnected: ${socket.id}`);
  });
});

// Make io accessible to our routes
app.set("io", io);

// Start server
const PORT = config.port;
server.listen(PORT, () => {
  logger.info(`Server running in ${config.nodeEnv} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  logger.error(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
