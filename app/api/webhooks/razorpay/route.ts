import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import ConsultationConfirmationEmail from "@/emails/ConsultationConfirmation";

// Helper function to get Supabase client
const getSupabase = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  // Return null if credentials are not configured to avoid crashing
  if (!supabaseUrl || !supabaseServiceKey) return null;
  return createClient(supabaseUrl, supabaseServiceKey);
};

// Helper function to get Nodemailer transporter
const getTransporter = () => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER_MELWIN) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "465", 10),
    secure: true,
    auth: {
      user: process.env.SMTP_USER_MELWIN,
      pass: process.env.SMTP_PASS_MELWIN,
    },
  });
};

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const body = JSON.parse(rawBody);

    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!secret) {
      console.error("RAZORPAY_WEBHOOK_SECRET is not defined");
      return NextResponse.json({ error: "Configuration error" }, { status: 500 });
    }

    // Verify Razorpay signature
    const signature = req.headers.get("x-razorpay-signature");

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");

    if (expectedSignature !== signature) {
      console.error("Invalid Razorpay webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Process the event
    const event = body.event;

    if (event === "order.paid" || event === "payment.captured") {
      const paymentEntity = body.payload.payment.entity;
      // In a real scenario, you'd fetch the order details or pass data in notes.
      // Here we assume notes contains necessary info, or you look it up by order_id.
      
      const orderId = paymentEntity.order_id;
      const paymentId = paymentEntity.id;
      const email = paymentEntity.email;
      const phone = paymentEntity.contact;
      
      // Attempt to extract notes if they were passed during order creation
      const notes = paymentEntity.notes || {};
      const name = notes.name || "Customer";
      const date = notes.date || "TBD";
      const time = notes.time || "TBD";

      // 1. Insert into Supabase
      const supabase = getSupabase();
      if (supabase) {
        const { data, error } = await supabase
          .from("consultations")
          .insert([
            {
              name: name,
              email: email,
              phone: phone,
              date: date,
              time: time,
              razorpay_order_id: orderId,
              razorpay_payment_id: paymentId,
              status: "confirmed",
            },
          ]);

        if (error) {
          console.error("Error inserting into Supabase:", error);
          // Continue processing to try sending emails/notifications even if DB fails, or fail early.
        }
      } else {
        console.error("Supabase client not initialized.");
      }

      // 2. Send Email via Nodemailer
      const transporter = getTransporter();
      if (transporter) {
        try {
          const emailHtml = await render(ConsultationConfirmationEmail({ name, date, time }));
          await transporter.sendMail({
            from: process.env.SMTP_FROM_MELWIN || '"BUILD WITH MELWIN" <melwin@zaneproed.com>',
            to: email,
            subject: "Consultation Booking Confirmed",
            html: emailHtml,
          });
          console.log("Confirmation email sent to:", email);
        } catch (emailError) {
          console.error("Error sending email:", emailError);
        }
      }

      // 3. Send Discord Notification (optional)
      const discordWebhook = process.env.DISCORD_WEBHOOK_URL;
      if (discordWebhook) {
        try {
          await fetch(discordWebhook, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              content: `🎉 New Consultation Booking Paid!\n**Name:** ${name}\n**Email:** ${email}\n**Order ID:** ${orderId}`,
            }),
          });
        } catch (discordError) {
          console.error("Error sending Discord notification:", discordError);
        }
      }

      return NextResponse.json({ status: "success" });
    }

    // Return 200 for other events to acknowledge receipt
    return NextResponse.json({ status: "ignored" });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
