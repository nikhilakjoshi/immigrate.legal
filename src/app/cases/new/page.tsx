"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Users, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
interface Template {
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
}

interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  nationality: string | null;
}

export default function NewCasePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    clientId: "",
    templateId: "",
    priority: "MEDIUM" as "LOW" | "MEDIUM" | "HIGH" | "URGENT",
    dueDate: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch templates and clients
        const [templatesRes, clientsRes] = await Promise.all([
          fetch("/api/templates"),
          fetch("/api/clients"),
        ]);

        if (templatesRes.ok) {
          const templatesData = await templatesRes.json();
          setTemplates(templatesData);
        }

        if (clientsRes.ok) {
          const clientsData = await clientsRes.json();
          setClients(clientsData);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  const handleTemplateChange = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    setSelectedTemplate(template || null);
    setFormData((prev) => ({ ...prev, templateId }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/cases", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          dueDate: formData.dueDate
            ? new Date(formData.dueDate).toISOString()
            : null,
        }),
      });

      if (response.ok) {
        const newCase = await response.json();
        router.push(`/cases/${newCase.id}`);
      } else {
        const error = await response.json();
        console.error("Failed to create case:", error);
        alert("Failed to create case. Please try again.");
      }
    } catch (error) {
      console.error("Error creating case:", error);
      alert("An error occurred while creating the case.");
    } finally {
      setLoading(false);
    }
  };

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
              Create New Case
            </h1>
            <p className="text-muted-foreground">
              Set up a new legal case with client and template
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Case Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Case Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Case Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Enter case title"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Enter case description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value: string) =>
                      setFormData((prev) => ({
                        ...prev,
                        priority: value as typeof formData.priority,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">Low</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                      <SelectItem value="URGENT">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        dueDate: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Client Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Client Assignment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="client">Select Client *</Label>
                <Select
                  value={formData.clientId}
                  onValueChange={(value: string) =>
                    setFormData((prev) => ({ ...prev, clientId: value }))
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.firstName} {client.lastName} ({client.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {clients.length === 0 && (
                <div className="text-sm text-muted-foreground">
                  No clients available. You may need to add clients first.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Template Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Case Template</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="template">Select Template</Label>
              <Select
                value={formData.templateId}
                onValueChange={handleTemplateChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a case template (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name} - {template.type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedTemplate && (
              <div className="border rounded-lg p-4 bg-muted/50">
                <h4 className="font-medium mb-2">{selectedTemplate.name}</h4>
                {selectedTemplate.description && (
                  <p className="text-sm text-muted-foreground mb-3">
                    {selectedTemplate.description}
                  </p>
                )}
                <div>
                  <p className="text-sm font-medium mb-2">
                    Template includes {selectedTemplate.tasks.length} tasks:
                  </p>
                  <div className="space-y-1">
                    {selectedTemplate.tasks
                      .sort((a, b) => (a.order || 0) - (b.order || 0))
                      .slice(0, 5)
                      .map((task) => (
                        <div
                          key={task.id}
                          className="flex items-center gap-2 text-sm"
                        >
                          <Badge
                            variant={task.isRequired ? "default" : "secondary"}
                          >
                            {task.isRequired ? "Required" : "Optional"}
                          </Badge>
                          <span>{task.title}</span>
                        </div>
                      ))}
                    {selectedTemplate.tasks.length > 5 && (
                      <p className="text-sm text-muted-foreground">
                        ...and {selectedTemplate.tasks.length - 5} more tasks
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/cases")}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading || !formData.title || !formData.clientId}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Creating...
              </div>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Create Case
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
