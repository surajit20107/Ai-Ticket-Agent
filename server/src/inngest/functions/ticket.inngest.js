import { inngest } from "../client.js";
import { NonRetriableError } from "inngest";
import { Ticket } from "../../models/ticket.model.js";
import { User } from "../../models/user.model.js";
import { processTicket } from "../../lib/agent.lib.js";
import { sendMail } from "../../lib/mail.lib.js";

export const ticketCreated = inngest.createFunction(
  { id: "ticket-created", retries: 2 },
  { event: "ticket/created" },
  async ({ event, step }) => {
    try {
      const { ticket } = event.data;

      if (!ticket) {
        throw new NonRetriableError("Ticket ID is required");
      }

      await step.run("update-ticket", async () => {
        const aiResponse = await processTicket(ticket);

        if (!aiResponse) {
          throw new Error("Failed to process ticket");
        }

        const ticketPriority = ["low", "medium", "high"].includes(aiResponse.priority) ? aiResponse.priority : "medium";

        let ticketResolver = await User.findOne({
          role: "moderator",
          skills: {
            $elemMatch: {
              $regex: aiResponse.relatedSkills.join("|"),
              $options: "i",
            }
          },
        });

        if (!ticketResolver) {
          ticketResolver = await User.findOne({ role: "admin" });
        }
console.log(ticketResolver)
        await Ticket.findByIdAndUpdate(
          ticket._id,
          {
            status: "in-progress",
            assignedTo: ticketResolver._id,
            priority: ticketPriority,
            helpfulNotes: aiResponse.helpfulNotes || aiResponse.summary || "",
            deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            relatedSkills: aiResponse.relatedSkills || [],
          },
          { new: true },
        );

        const mailSubject = `New Ticket Assigned: ${ticket.title}`;
        const mailBody = `
        A new support ticket has been assigned to you:
        
        Ticket ID: ${ticket._id}
        Title: ${ticket.title}
        Description: ${ticket.description}
        Priority: ${ticketPriority}
        
        Please review the ticket and take appropriate action.
        `.trim();
        await sendMail(ticketResolver.email, mailSubject, mailBody);
      });
    } catch (error) {
      console.error("❌ Error in ticket-created function:", error);
    }
  },
);
