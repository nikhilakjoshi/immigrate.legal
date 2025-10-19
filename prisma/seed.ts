import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create a test user
  const hashedPassword = await bcrypt.hash("password123", 12);

  const user = await prisma.user.upsert({
    where: { email: "john@example.com" },
    update: {},
    create: {
      email: "john@example.com",
      passwordHash: hashedPassword,
      name: "John Doe",
      role: "LAWYER",
    },
  });

  // Create sample clients
  const client1 = await prisma.client.upsert({
    where: { email: "alice@example.com" },
    update: {},
    create: {
      firstName: "Alice",
      lastName: "Johnson",
      email: "alice@example.com",
      phone: "+1-555-0123",
      nationality: "Canadian",
    },
  });

  const client2 = await prisma.client.upsert({
    where: { email: "bob@example.com" },
    update: {},
    create: {
      firstName: "Bob",
      lastName: "Smith",
      email: "bob@example.com",
      phone: "+1-555-0456",
      nationality: "British",
    },
  });

  // Create templates
  const eb1aTemplate = await prisma.template.upsert({
    where: { id: "eb1a-template" },
    update: {},
    create: {
      id: "eb1a-template",
      name: "EB1A - Extraordinary Ability",
      type: "EB1A",
      description:
        "Employment-based petition for individuals with extraordinary ability",
    },
  });

  const h1bTemplate = await prisma.template.upsert({
    where: { id: "h1b-template" },
    update: {},
    create: {
      id: "h1b-template",
      name: "H1B - Specialty Occupation",
      type: "H1B",
      description: "Temporary worker in specialty occupation",
    },
  });

  // Create sample cases
  const case1 = await prisma.case.upsert({
    where: { id: "case-1" },
    update: {},
    create: {
      id: "case-1",
      title: "EB1A Petition for Alice Johnson",
      description: "Extraordinary ability petition for software engineer",
      status: "IN_PROGRESS",
      priority: "HIGH",
      dueDate: new Date("2025-12-31"),
      clientId: client1.id,
      lawyerId: user.id,
      templateId: eb1aTemplate.id,
    },
  });

  const case2 = await prisma.case.upsert({
    where: { id: "case-2" },
    update: {},
    create: {
      id: "case-2",
      title: "H1B Application for Bob Smith",
      description: "H1B visa application for data scientist position",
      status: "OPEN",
      priority: "MEDIUM",
      dueDate: new Date("2025-06-30"),
      clientId: client2.id,
      lawyerId: user.id,
      templateId: h1bTemplate.id,
    },
  });

  console.log("Seed data created:", { user, client1, client2, case1, case2 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
