import { inngest } from "../client.js";
import { NonRetriableError } from "inngest";
import { sendMail } from "../../lib/mail.lib.js";

export const userRegister = inngest.createFunction(
  { id: "user-register", retries: 2 },
  { event: "user/register" },
  async ({ event, step }) => {
    try {
      const { email, name } = event.data;

      if (!email || !name) {
        throw new NonRetriableError("Missing required fields");
      }

      await step.run("send-welcome-email", async () => {
        const subject = "Welcome to Ticket App";
        const body = `Welcome, ${name}
        \n\n
        Thank for signup, we're glad to have you onboard! 🎉
        `;
        await sendMail(email, subject, body);
        console.log("✅ welcome email sent to", email);
        return { success: true };
      });
    } catch (error) {
      console.error("❌ Error in user-register function:", error.message);
    }
  },
);
