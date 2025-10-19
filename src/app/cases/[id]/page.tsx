"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Calendar,
  User,
  FileText,
  ArrowLeft,
  Settings,
  Workflow,
  List,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { CaseWorkflow } from "@/components/case-workflow";
import { TaskList } from "@/components/task-list";

interface CaseDetail {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueDate: string | null;
  createdAt: string;
  client: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    nationality: string | null;
  };
  lawyer: {
    name: string | null;
    email: string;
  };
  template: {
    id: string;
    name: string;
    type: string;
    description: string | null;
    tasks: Array<{
      id: string;
      title: string;
      description: string | null;
      order: number | null;
      isRequired: boolean;
    }>;
  } | null;
  tasks: Array<{
    id: string;
    title: string;
    description: string | null;
    status: string;
    priority: string;
    dueDate: string | null;
    completedAt: string | null;
    order: number | null;
    assignee: {
      name: string | null;
      email: string;
    } | null;
    documents: Array<{
      id: string;
      name: string;
      type: string;
    }>;
  }>;
  documents: Array<{
    id: string;
    name: string;
    type: string;
    filePath: string;
    createdAt: string;
  }>;
}

const statusColors = {
  OPEN: "bg-blue-100 text-blue-800",
  IN_PROGRESS: "bg-yellow-100 text-yellow-800",
  PENDING_REVIEW: "bg-purple-100 text-purple-800",
  APPROVED: "bg-green-100 text-green-800",
  DENIED: "bg-red-100 text-red-800",
  CLOSED: "bg-gray-100 text-gray-800",
};

const priorityColors = {
  LOW: "bg-green-100 text-green-800",
  MEDIUM: "bg-yellow-100 text-yellow-800",
  HIGH: "bg-orange-100 text-orange-800",
  URGENT: "bg-red-100 text-red-800",
};

export default function CaseDetailPage() {
  const params = useParams();
  const [caseDetail, setCaseDetail] = useState<CaseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("workflow");

  useEffect(() => {
    const fetchCaseDetail = async () => {
      try {
        const response = await fetch(`/api/cases/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setCaseDetail(data);
        } else {
          console.error("Failed to fetch case details");
        }
      } catch (error) {
        console.error("Error fetching case details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchCaseDetail();
    }
  }, [params.id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!caseDetail) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <h2 className="text-xl font-semibold">Case not found</h2>
        <Button asChild>
          <Link href="/cases">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Cases
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/cases">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Cases
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {caseDetail.title}
            </h1>
            <p className="text-muted-foreground">
              {caseDetail.template?.name || "No template assigned"}
            </p>
          </div>
        </div>
        <Button>
          <Settings className="mr-2 h-4 w-4" />
          Case Settings
        </Button>
      </div>

      {/* Case Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge
              className={
                statusColors[caseDetail.status as keyof typeof statusColors]
              }
            >
              {caseDetail.status.replace("_", " ")}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge
              className={
                priorityColors[
                  caseDetail.priority as keyof typeof priorityColors
                ]
              }
            >
              {caseDetail.priority}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Client</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {caseDetail.client.firstName} {caseDetail.client.lastName}
            </div>
            <p className="text-xs text-muted-foreground">
              {caseDetail.client.email}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Due Date</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {caseDetail.dueDate
                ? formatDate(caseDetail.dueDate)
                : "No due date"}
            </div>
            <p className="text-xs text-muted-foreground">
              Created {formatDate(caseDetail.createdAt)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Case Details and Workflow */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="workflow" className="flex items-center gap-2">
            <Workflow className="h-4 w-4" />
            Workflow
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            Task List
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Documents ({caseDetail.documents.length})
          </TabsTrigger>
          <TabsTrigger value="details" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Details
          </TabsTrigger>
        </TabsList>

        <TabsContent value="workflow">
          <Card>
            <CardHeader>
              <CardTitle>Case Workflow</CardTitle>
            </CardHeader>
            <CardContent>
              <CaseWorkflow tasks={caseDetail.tasks} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <CardTitle>Tasks ({caseDetail.tasks.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <TaskList tasks={caseDetail.tasks} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent>
              {caseDetail.documents.length === 0 ? (
                <p className="text-muted-foreground">
                  No documents uploaded yet.
                </p>
              ) : (
                <div className="space-y-2">
                  {caseDetail.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-2 border rounded"
                    >
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {doc.type} • {formatDate(doc.createdAt)}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <FileText className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Client Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <p>
                    {caseDetail.client.firstName} {caseDetail.client.lastName}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <p>{caseDetail.client.email}</p>
                </div>
                {caseDetail.client.phone && (
                  <div>
                    <label className="text-sm font-medium">Phone</label>
                    <p>{caseDetail.client.phone}</p>
                  </div>
                )}
                {caseDetail.client.nationality && (
                  <div>
                    <label className="text-sm font-medium">Nationality</label>
                    <p>{caseDetail.client.nationality}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Case Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <p>{caseDetail.description || "No description provided."}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Assigned Lawyer</label>
                  <p>{caseDetail.lawyer.name || caseDetail.lawyer.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Template</label>
                  <p>{caseDetail.template?.name || "No template assigned"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Created</label>
                  <p>{formatDate(caseDetail.createdAt)}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
