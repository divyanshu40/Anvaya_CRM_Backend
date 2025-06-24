const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { initializeDatabase } = require("./db/db.connect");
const {salesAgent} = require("./models/salesAgent.model");
const { lead } = require("./models/lead.model");
const { comment } = require("./models/comment.model");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

initializeDatabase();




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

// function to add multiple leads
async function addMultipleLeads(leadsData) {
    let addedLeads = await lead.insertMany(leadsData);
    return { addedLeads };
}

// function to get all sales agents
async function getAllSalesAgents() {
    let salesAgents = await salesAgent.find();
    return { salesAgents }
}

// function to get all leads
async function getAllLeads() {
    let leads = await lead.find();
    return leads
}

// function to get lead by id
async function getLeadById(leadId) {
    let leadDetails = await lead.findById(leadId);
    if (! leadDetails) {
        return null;
    }
    return leadDetails;
}

// function to filter leads
async function filterLeads(filterParams) {
    let {status, salesAgent, tags, source } = filterParams;
    let filter = {};
    if (status) {
        filter.status = status;
    }
    if (salesAgent) {
        filter.salesAgent = salesAgent;
    }
    if (tags) {
        filter.tags = Array.isArray(tags) ? { $in: tags } : tags;
    }
    if (source) {
        filter.source = source;
    }
    let filteredLeads = await lead.find(filter);
    return filteredLeads;

}

// function to update lead
async function updateALead(leadId, leadData) {
    let updatedLead = await lead.findByIdAndUpdate(leadId, leadData, { new: true });
    if (! updatedLead) {
        return null;
    }
    return updatedLead;
}

// function to delete a lead
async function deleteALead(leadId) {
    let deletedLead = await lead.findByIdAndDelete(leadId);
    if (! deletedLead) {
        return null;
    }
    return deletedLead;
}

// function to add new comment
async function addNewComment(commentData) {
    let addedComment = await new comment(commentData).save();
    return addedComment;
}

// function to get all comments of a lead
async function getAllCommentsOfLead(leadId) {
    let comments = await comment.find({ lead: leadId });
    return comments;
}

// function to get leads closed last week
async function getLeadsClosedLastWeek() {
    let today = new Date();
    let oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(today.getDate() - 7);
    let leads = await lead.find({
        status: "Closed",
        closedAt: { $gte: oneWeekAgo, $lte: today }
    }).sort({ closedAt: -1 });
    return leads;
}

// function to get all leads in the pipeline
async function getAllLeadsInPipeline() {
    let leads = await lead.find({ status: { $in: ['New', 'Contacted', 'Qualified', 'Proposal Sent'] } });
    return leads;
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

// POST Route to add multiple leads
app.post("/leads/new", async (req, res) => {
    let leadsData = req.body;
    try {
        let response = await addMultipleLeads(leadsData);
        return res.status(201).json(response);
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
});

// POST Route to update lead
app.post("/leads/update/:id", async (req, res) => {
    let leadId = req.params.id;
    let leadData = req.body;
    try {
        let response = await updateALead(leadId, leadData);
        if (response === null) {
            return res.status(404).json({ message: "Lead not found" });
        }
        return res.status(200).json(response);
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
});

// POST Route to add new comment 
app.post("/comments/new", async (req, res) => {
    let commentData = req.body;
    try {
        let response = await addNewComment(commentData);
        return res.status(201).json(response);
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE route to delete lead
app.delete("/leads/delete/:id", async (req, res) => {
    let leadId = req.params.id;
    try {
        let response = await deleteALead(leadId);
        if (response === null) {
            return res.status(404).json({ message: "Lead not found" });
        }
        return res.status(200).json(response);
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
});

// GET route to get all sales agents
app.get("/salesAgents", async (req, res) => {
    try {
        let response = await getAllSalesAgents();
        if (response.salesAgents.length === 0) {
            return res.status(404).json({ message: "No sales agents found" });
        }
        return res.status(200).json(response);
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
});

// GET Route to get all leads
app.get("/leads", async (req, res) => {
    try {
        let response = await getAllLeads();
        if (response.length === 0) {
            return res.status(404).json({ message: "No leads found" });
        }
        return res.status(200).json(response);
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
});

// GET Route to get lead by id
app.get("/lead/details/:id", async (req, res) => {
    let leadId = req.params.id;
    try {
        let response = await getLeadById(leadId);
        if (response === null) {
            return res.status(404).json({ message: "Lead not found" });
        }
        return res.status(200).json(response);
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
});

// GET Route to filter leads
app.get("/leads/filter", async (req, res) => {
    let filterParams = req.query;
    try {
        let response = await filterLeads(filterParams);
        if (response.length === 0) {
            return res.status(404).json({ message: "No leads found" });
        }
        return res.status(200).json(response);
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
});

// GET Route to get all comments of lead
app.get("/comments/lead/:id", async (req, res) => {
    let leadId = req.params.id;
    try {
        let response = await getAllCommentsOfLead(leadId);
        if (response.length === 0) {
            return res.status(404).json({ message: "No comments found" });
        }
        return res.status(200).json(response);
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
});

// GET Route to get leads closed last week
app.get("/leads/closed/last-week", async (req, res) => {
    try {
        let response = await getLeadsClosedLastWeek();
        if (response.length === 0) {
            return res.status(404).json({ message: "No leads found" });
        }
        return res.status(200).json(response);
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
});

// GET Route to get all leads in the pipeline
app.get("/leads/pipeline", async (req, res) => {
    try {
        let response = await getAllLeadsInPipeline();
        if (response.length === 0) {
            return res.status(404).json({ message: "No leads found" });
        }
        return res.status(200).json(response);
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
         console.log(`Server is running on PORT ${PORT}` )
     })

