import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createTaskTemplatesAndTasks() {
  try {
    // Create task templates for EB1A
    const eb1aTaskTemplates = [
      {
        id: "eb1a-task-1",
        title: "Initial Client Consultation",
        description:
          "Meet with client to assess qualifications and gather preliminary documents",
        order: 1,
        isRequired: true,
        templateId: "eb1a-template",
      },
      {
        id: "eb1a-task-2",
        title: "Evidence Collection",
        description:
          "Gather evidence of extraordinary ability (awards, publications, media coverage)",
        order: 2,
        isRequired: true,
        templateId: "eb1a-template",
      },
      {
        id: "eb1a-task-3",
        title: "Petition Preparation",
        description: "Prepare Form I-140 and supporting documentation",
        order: 3,
        isRequired: true,
        templateId: "eb1a-template",
      },
      {
        id: "eb1a-task-4",
        title: "File Petition",
        description: "Submit petition to USCIS",
        order: 4,
        isRequired: true,
        templateId: "eb1a-template",
      },
      {
        id: "eb1a-task-5",
        title: "Monitor Case Status",
        description:
          "Track petition status and respond to any requests for evidence",
        order: 5,
        isRequired: true,
        templateId: "eb1a-template",
      },
    ];

    // Create task templates for H1B
    const h1bTaskTemplates = [
      {
        id: "h1b-task-1",
        title: "LCA Filing",
        description:
          "File Labor Condition Application with Department of Labor",
        order: 1,
        isRequired: true,
        templateId: "h1b-template",
      },
      {
        id: "h1b-task-2",
        title: "Gather Supporting Documents",
        description:
          "Collect degree certificates, job offer letter, and company documentation",
        order: 2,
        isRequired: true,
        templateId: "h1b-template",
      },
      {
        id: "h1b-task-3",
        title: "Prepare H1B Petition",
        description: "Complete Form I-129 and compile supporting evidence",
        order: 3,
        isRequired: true,
        templateId: "h1b-template",
      },
      {
        id: "h1b-task-4",
        title: "Submit to USCIS",
        description: "File H1B petition with USCIS during filing season",
        order: 4,
        isRequired: true,
        templateId: "h1b-template",
      },
    ];

    // Insert task templates
    for (const template of [...eb1aTaskTemplates, ...h1bTaskTemplates]) {
      await prisma.taskTemplate.upsert({
        where: { id: template.id },
        update: {},
        create: template,
      });
    }

    // Create actual tasks for case-1 (EB1A)
    const case1Tasks = [
      {
        id: "case-1-task-1",
        title: "Initial Client Consultation",
        description: "Meet with Alice Johnson to assess qualifications",
        status: "COMPLETED" as const,
        priority: "HIGH" as const,
        order: 1,
        completedAt: new Date("2025-01-15"),
        caseId: "case-1",
        templateId: "eb1a-task-1",
      },
      {
        id: "case-1-task-2",
        title: "Evidence Collection",
        description: "Gathering software engineering awards and publications",
        status: "IN_PROGRESS" as const,
        priority: "HIGH" as const,
        order: 2,
        caseId: "case-1",
        templateId: "eb1a-task-2",
      },
      {
        id: "case-1-task-3",
        title: "Petition Preparation",
        description: "Prepare Form I-140 for Alice Johnson",
        status: "PENDING" as const,
        priority: "MEDIUM" as const,
        order: 3,
        caseId: "case-1",
        templateId: "eb1a-task-3",
      },
    ];

    // Create actual tasks for case-2 (H1B)
    const case2Tasks = [
      {
        id: "case-2-task-1",
        title: "LCA Filing",
        description: "File Labor Condition Application for Bob Smith",
        status: "COMPLETED" as const,
        priority: "MEDIUM" as const,
        order: 1,
        completedAt: new Date("2025-02-01"),
        caseId: "case-2",
        templateId: "h1b-task-1",
      },
      {
        id: "case-2-task-2",
        title: "Gather Supporting Documents",
        description: "Collecting degree and job offer documentation",
        status: "PENDING" as const,
        priority: "MEDIUM" as const,
        order: 2,
        caseId: "case-2",
        templateId: "h1b-task-2",
      },
    ];

    // Insert tasks
    for (const task of [...case1Tasks, ...case2Tasks]) {
      await prisma.task.upsert({
        where: { id: task.id },
        update: {},
        create: task,
      });
    }

    console.log("Task templates and tasks created successfully!");
  } catch (error) {
    console.error("Error creating task templates and tasks:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createTaskTemplatesAndTasks();
