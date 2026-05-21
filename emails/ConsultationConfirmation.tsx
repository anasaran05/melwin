import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Section,
  Row,
  Column,
  Link,
} from "@react-email/components";
import * as React from "react";

interface ConsultationConfirmationProps {
  name: string;
  date: string;
  time: string;
}

export const ConsultationConfirmationEmail = ({
  name = "User",
  date = "June 23, 2026",
  time = "10:00 AM",
}: ConsultationConfirmationProps) => {
  return (
    <Html>
      <Head />
      <Preview>Your Consultation with Dr. Melwin Vincent is Confirmed!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Consultation Confirmed</Heading>
          
          <Text style={text}>Hi {name},</Text>
          
          <Text style={text}>
            Thank you for booking a consultation. Your payment was successful and your slot has been confirmed!
          </Text>

          <Section style={detailsContainer}>
            <Row>
              <Column>
                <Text style={detailsTitle}>Date & Time</Text>
                <Text style={detailsValue}>{date} at {time}</Text>
              </Column>
            </Row>
          </Section>

          <Text style={text}>
            We will send a calendar invite with the meeting link shortly. If you need to reschedule or have any questions, please reach out to us.
          </Text>

          <Section style={footer}>
            <Text style={footerText}>
              Zane ProEd | <Link href="https://zaneproed.com" style={link}>zaneproed.com</Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default ConsultationConfirmationEmail;

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  borderRadius: "8px",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  maxWidth: "600px",
};

const h1 = {
  color: "#333",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0 40px",
  textAlign: "center" as const,
};

const text = {
  color: "#333",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  fontSize: "16px",
  lineHeight: "24px",
  padding: "0 40px",
};

const detailsContainer = {
  padding: "24px",
  backgroundColor: "#f9fafb",
  borderRadius: "8px",
  margin: "24px 40px",
};

const detailsTitle = {
  color: "#6b7280",
  fontSize: "14px",
  fontWeight: "500",
  margin: "0 0 8px",
};

const detailsValue = {
  color: "#111827",
  fontSize: "16px",
  fontWeight: "600",
  margin: "0",
};

const footer = {
  padding: "0 40px",
  marginTop: "40px",
};

const footerText = {
  color: "#6b7280",
  fontSize: "12px",
  textAlign: "center" as const,
};

const link = {
  color: "#2563eb",
  textDecoration: "underline",
};
