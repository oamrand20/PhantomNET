//@ts-ignore
import nodemailer from "nodemailer";
import type { NextApiRequest, NextApiResponse } from "next";
import { IncomingForm } from "formidable";

export const config = {
  api: {
    bodyParser: false, // Disable the default body parser to handle form data with files
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Parse form data including files
  const form = new IncomingForm();

  try {
    const [fields, files]: [any, any] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) return reject(err);
        resolve([fields, files]);
      });
    });

    const { name, email, subject, message } = fields;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Ensure values are strings
    const nameStr = Array.isArray(name) ? name[0] : String(name);
    const emailStr = Array.isArray(email) ? email[0] : String(email);
    const subjectStr = Array.isArray(subject) ? subject[0] : String(subject);
    const messageStr = Array.isArray(message) ? message[0] : String(message);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "phantomnet514@gmail.com", // your Gmail address
        pass: "jtgduisqbejbvjut", // Gmail app password
      },
    });

    // Setup email data with enhanced HTML content
    const mailOptions: any = {
      from: `"PhantomNet" <phantomnet514@gmail.com>`,
      to: emailStr,
      subject: `New Contact Message: ${subjectStr}`,
      text: `Name: ${nameStr}\nEmail: ${emailStr}\n\nMessage:\n${messageStr}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; background-color: #f9f9f9;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #333; margin-bottom: 5px;">New Contact Form Submission</h1>
            <div style="height: 3px; background: linear-gradient(90deg, #6e48aa, #9d50bb); margin: 0 auto;"></div>
          </div>
          
          <div style="background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #6e48aa; margin-top: 0;">${subjectStr}</h2>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; width: 100px;">From:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${nameStr}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><a href="mailto:${emailStr}" style="color: #6e48aa;">${emailStr}</a></td>
              </tr>
            </table>
            
            <div style="margin-top: 20px;">
              <h3 style="color: #555; margin-bottom: 10px;">Message:</h3>
              <div style="background-color: #f5f5f5; padding: 15px; border-left: 4px solid #6e48aa; border-radius: 4px;">
                ${
                  typeof messageStr === "string"
                    ? messageStr.replace(/\n/g, "<br>")
                    : messageStr
                }
              </div>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #777; font-size: 14px;">
            <p>This is an automated message from PhantomNet's contact form.</p>
          </div>
        </div>
      `,
      attachments: [],
    };

    // Add attachments if they exist
    if (files.attachment) {
      // Handle array of files or single file
      const attachments = Array.isArray(files.attachment)
        ? files.attachment
        : [files.attachment];

      for (const file of attachments) {
        mailOptions.attachments.push({
          filename: file.originalFilename,
          path: file.filepath,
          contentType: file.mimetype,
        });
      }
    }

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Email send error:", error);
    return res.status(500).json({ message: "Failed to send message" });
  }
}
