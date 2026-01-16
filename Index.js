const express = require("express");
const app = express();

app.use(express.json());

// Simple in-memory job store for testing
let jobs = {};
let jobIdCounter = 1;

// Root endpoint (test)
app.get("/", (req, res) => {
  res.send("API is running");
});

// POST /jobs/test → create a fake job
app.post("/jobs/test", (req, res) => {
  const jobId = jobIdCounter++;
  jobs[jobId] = {
    id: jobId,
    status: "processing",
    output: null,
    createdAt: new Date().toISOString()
  };

  // Simulate async processing (3 seconds)
  setTimeout(() => {
    jobs[jobId].status = "completed";
    jobs[jobId].output = "This is a test result for job #" + jobId;
  }, 3000);

  res.json({ job_id: jobId, status: jobs[jobId].status });
});

// GET /jobs/:id → check job status
app.get("/jobs/:id", (req, res) => {
  const job = jobs[req.params.id];
  if (!job) {
    return res.status(404).json({ error: "Job not found" });
  }
  res.json(job);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server started on port", PORT);
});
