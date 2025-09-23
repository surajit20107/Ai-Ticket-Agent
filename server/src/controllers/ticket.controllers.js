import { ticketSchema } from "../lib/zod.lib.js";
import { Ticket } from "../models/ticket.model.js";
import { inngest } from "../inngest/client.js";
import mongoose from "mongoose";

export const createTicket = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { title, description } = req.body;

    const parsed = ticketSchema.safeParse({ title, description });

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: parsed.error.errors,
      });
    }

    const ticket = await Ticket.create({
      title,
      description,
      createdBy: userId,
    });

    res.status(201).json({
      success: true,
      message: "Ticket created successfully",
      ticket,
    });

    inngest
      .send({
        name: "ticket/created",
        data: {
          ticket,
        },
      })
      .catch((err) => {
        console.error("❌ Failed to send inngest event", err.message);
      });
  } catch (error) {
    console.error("Failed to create ticket:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getTickets = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = 50;
    const skip = (page - 1) * limit;
    let tickets;

    if (user.role === "user") {
      tickets = await Ticket.find({ createdBy: user.id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("createdBy");
    } else {
      tickets = await Ticket.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("createdBy")
        .populate("assignedTo");
    }

    if (!tickets || tickets.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No tickets found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Tickets fetched successfully",
      tickets,
      page: page,
    });
  } catch (error) {
    console.error("❌ Failed to get all tickets:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getTicket = async (req, res) => {
  try {
    const ticketId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(ticketId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ticket ID",
      });
    }

    const user = req.user;
    let ticket;

    if (user.role === "user") {
      ticket = await Ticket.findOne({
        _id: ticketId,
        createdBy: user.id,
      }).populate("assignedTo", "name");
    } else {
      ticket = await Ticket.findById(ticketId)
        .populate("assignedTo", "name")
        .populate("createdBy", "name email");
    }

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Ticket fetched successfully",
      ticket,
    });
  } catch (error) {
    console.error("❌ Failed to get ticket:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteTicket = async (req, res) => {
  const ticketId = req.params.id;
  try {
    const ticket = await Ticket.findByIdAndDelete(ticketId);
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Ticket deleted successfully",
    });
  } catch (error) {
    console.error("Error while deleting ticket", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const toggleTicketStatus = async (req, res) => {
  const ticketId = req.params.id;
  try {
    if (req.user.role === "user") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to perform this action",
      });
    }

    const ticket = await Ticket.findByIdAndUpdate(
      ticketId,
      {
        status: "resolved",
      },
      { new: true },
    );

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }
  } catch (error) {
    console.error("Error while changing ticket status", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
