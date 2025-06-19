const express = require("express");
const cors = require("cors");
const { initializeDatabase } = require("./db/db.connect");
const {salesAgent} = require("./models/salesAgent.model");
const { lead } = require("./models/lead.model");
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());


initializeDatabase()
.then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
        console.log("server is running on PORT 3000");
    })
})

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

// POST Route to add new sales agent
app.post("/salesAgent/new", async (req, res) => {
    let salesAgentData = req.body;
    try {
        let response = await addNewSalesAgent(salesAgentData);
        return res.status(201).json(response);
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
});

// POST Route to add new lead
app.post("/lead/new", async (req, res) => {
    let leadData = req.body;
    try {
        let response = await addNewLead(leadData);
        res.status(201).json(response);
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
});