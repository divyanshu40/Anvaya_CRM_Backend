const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { initializeDatabase } = require("./db/db.connect");
const {salesAgent} = require("./models/salesAgent.model");
const { lead } = require("./models/lead.model");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());



// function to add new sales agent
async function addNewSalesAgent(salesAgentData) {
    let addedSalesAgent = await new salesAgent(salesAgentData).save();
    return { addedSalesAgent };
}

// function to add new lead
async function addNewLead(leadData) {
    let addedLead = await new lead(leadData).save();
    return { addedLead };
}

// function to get all sales agents
async function getAllSalesAgents() {
    let salesAgents = await salesAgent.find();
    return { salesAgents }
}

(async () => {
  try {
    await initializeDatabase();

    // Routes
    app.post("/salesAgent/new", async (req, res) => {
      try {
        const addedSalesAgent = await new salesAgent(req.body).save();
        res.status(201).json({ addedSalesAgent });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    app.post("/lead/new", async (req, res) => {
      try {
        const addedLead = await new lead(req.body).save();
        res.status(201).json({ addedLead });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    app.get("/salesAgents", async (req, res) => {
      try {
        const salesAgents = await salesAgent.find();
        if (salesAgents.length === 0) {
          return res.status(404).json({ message: "No sales agents found" });
        }
        res.status(200).json({ salesAgents });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

  } catch (err) {
    console.error("Failed to initialize database:", err);
  }
})();

module.exports = app