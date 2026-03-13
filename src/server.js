const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { exec } = require('child_process');

dotenv.config();

const app = express();

// CORS configuration
const { allowedOrigins } = require('./config/corsOrigin');
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());

// Import routes
const routes = require('./routes/index');

const PORT = process.env.PORT || 5000;

function ensurePortFree(port) {
  return new Promise((resolve) => {
    // Only implemented for Windows since that's the environment being used.
    const cmd = `netstat -ano | findstr ":${port}" | findstr LISTENING`;
    exec(cmd, (err, stdout) => {
      if (err || !stdout) return resolve();

      const pids = Array.from(new Set(
        stdout
          .trim()
          .split(/\r?\n/)
          .map((line) => {
            const match = line.trim().match(/\b(\d+)$/);
            return match ? match[1] : null;
          })
          .filter(Boolean)
      ));

      const currentPid = String(process.pid);
      const targets = pids.filter((pid) => pid !== currentPid);
      if (!targets.length) return resolve();

      const killPromises = targets.map((pid) =>
        new Promise((res) => {
          console.log(`Port ${port} is in use by PID ${pid}; attempting to free it...`);
          exec(`taskkill /PID ${pid} /F`, (killErr) => {
            if (killErr) {
              console.warn(`Could not kill PID ${pid}:`, killErr.message);
            } else {
              console.log(`Terminated process ${pid} to free port ${port}.`);
            }
            res();
          });
        })
      );

      Promise.all(killPromises).then(() => setTimeout(resolve, 500));
    });
  });
}

async function connectDb() {
	const uri = process.env.MONGODB_URI;
	if (!uri) {
		console.warn('MONGODB_URI not set; skipping MongoDB connection');
		return;
	}
	try {
		await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
		console.log('MongoDB connected');
	} catch (err) {
		console.error('MongoDB connection error:', err.message || err);
	}
}

// Register routes
app.use('/api', routes);

app.get('/', (req, res) => {
	res.json({ status: 'ok' });
});

let server;

function shutdown(exitCode = 0) {
  if (server) {
    server.close(() => {
      console.log('Server closed');
      process.exit(exitCode);
    });
  } else {
    process.exit(exitCode);
  }
}

function listen(port) {
  return new Promise((resolve, reject) => {
    const srv = app.listen(port, () => resolve(srv));
    srv.on('error', reject);
  });
}

async function startServer() {
  const maxAttempts = 5;
  let attempt = 0;
  let lastError;

  while (attempt < maxAttempts) {
    try {
      await ensurePortFree(PORT);
      server = await listen(Number(PORT));
      console.log(`Server running on port ${PORT}`);
      return;
    } catch (err) {
      lastError = err;
      if (err && err.code === 'EADDRINUSE') {
        console.warn(`Port ${PORT} is in use (attempt ${attempt + 1}/${maxAttempts}). Retrying in 1s...`);
        await new Promise((res) => setTimeout(res, 1000));
        attempt += 1;
        continue;
      }
      console.error('Server error:', err);
      break;
    }
  }

  console.error('Unable to start server after multiple attempts.', lastError);
  process.exit(1);
}

connectDb().then(startServer);

// Graceful shutdown handlers
process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  shutdown(1);
});
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
  shutdown(1);
});

