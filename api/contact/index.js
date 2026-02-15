const { TableClient, AzureNamedKeyCredential } = require("@azure/data-tables");
const { Client } = require("@microsoft/microsoft-graph-client");
require("isomorphic-fetch");

module.exports = async function (context, req) {
  // --- Validate input ---
  const { name, email, company, phone, message, service } = req.body || {};

  if (!name || !email || !message) {
    context.res = {
      status: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Name, email, and message are required." }),
    };
    return;
  }

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    context.res = {
      status: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Invalid email address." }),
    };
    return;
  }

  const timestamp = new Date().toISOString();
  const submissionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // --- Save to Azure Table Storage ---
  try {
    const account = process.env.STORAGE_ACCOUNT_NAME;
    const accountKey = process.env.STORAGE_ACCOUNT_KEY;
    const tableName = "ContactSubmissions";

    const credential = new AzureNamedKeyCredential(account, accountKey);
    const tableClient = new TableClient(
      `https://${account}.table.core.windows.net`,
      tableName,
      credential
    );

    // Create table if it doesn't exist (idempotent)
    try {
      await tableClient.createTable();
    } catch (e) {
      // Table already exists — that's fine
      if (e.statusCode !== 409) throw e;
    }

    // Save the submission
    const entity = {
      partitionKey: new Date().toISOString().slice(0, 7), // e.g., "2025-06" — partitioned by month
      rowKey: submissionId,
      name: name,
      email: email,
      company: company || "",
      phone: phone || "",
      service: service || "",
      message: message,
      submittedAt: timestamp,
      ipAddress: req.headers["x-forwarded-for"] || req.headers["client-ip"] || "unknown",
    };

    await tableClient.createEntity(entity);
    context.log(`Saved submission ${submissionId} to Table Storage`);
  } catch (error) {
    context.log.error("Table Storage error:", error.message);
    // Don't fail the whole request — still try to send the email
  }

  // --- Send email notification via Microsoft Graph API ---
  try {
    const graphClient = Client.init({
      authProvider: async (done) => {
        // Get token using client credentials flow
        const tokenEndpoint = `https://login.microsoftonline.com/${process.env.GRAPH_TENANT_ID}/oauth2/v2.0/token`;

        const tokenResponse = await fetch(tokenEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            client_id: process.env.GRAPH_CLIENT_ID,
            client_secret: process.env.GRAPH_CLIENT_SECRET,
            scope: "https://graph.microsoft.com/.default",
            grant_type: "client_credentials",
          }),
        });

        const tokenData = await tokenResponse.json();
        if (tokenData.access_token) {
          done(null, tokenData.access_token);
        } else {
          done(new Error("Failed to acquire Graph token"), null);
        }
      },
    });

    const mailBody = {
      message: {
        subject: `[Stanchion Security] New Contact Form: ${name}`,
        body: {
          contentType: "HTML",
          content: `
            <h2>New Contact Form Submission</h2>
            <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
              <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Name</td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(name)}</td></tr>
              <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Email</td><td style="padding: 8px; border: 1px solid #ddd;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
              <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Company</td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(company || "Not provided")}</td></tr>
              <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Phone</td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(phone || "Not provided")}</td></tr>
              <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Service Interest</td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(service || "Not specified")}</td></tr>
              <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Message</td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(message)}</td></tr>
            </table>
            <p style="margin-top: 16px; color: #666; font-size: 12px;">Submitted at ${timestamp} | ID: ${submissionId}</p>
          `,
        },
        toRecipients: [
          {
            emailAddress: { address: "tom@stanchionsecurity.com" },
          },
        ],
      },
      saveToSentItems: "true",
    };

    // Send as tom@stanchionsecurity.com (requires Mail.Send permission)
    await graphClient
      .api(`/users/${process.env.GRAPH_SENDER_EMAIL}/sendMail`)
      .post(mailBody);

    context.log(`Email notification sent for submission ${submissionId}`);
  } catch (error) {
    context.log.error("Graph API email error:", error.message);
    // Log but don't fail — the submission is already saved
  }

  // --- Success response ---
  context.res = {
    status: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      success: true,
      message: "Thank you for contacting Stanchion Security. We'll be in touch shortly.",
      id: submissionId,
    }),
  };
};

// HTML escape helper to prevent XSS in email body
function escapeHtml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
