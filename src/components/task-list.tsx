"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Circle, Clock, User, FileText } from "lucide-react";

interface Task {
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
}

interface TaskListProps {
  tasks: Task[];
}

const statusColors = {
  PENDING: "bg-gray-100 text-gray-800",
  IN_PROGRESS: "bg-yellow-100 text-yellow-800",
  COMPLETED: "bg-green-100 text-green-800",
  BLOCKED: "bg-red-100 text-red-800",
  CANCELLED: "bg-gray-100 text-gray-800",
};

const priorityColors = {
  LOW: "bg-green-100 text-green-800",
  MEDIUM: "bg-yellow-100 text-yellow-800",
  HIGH: "bg-orange-100 text-orange-800",
  URGENT: "bg-red-100 text-red-800",
};

export function TaskList({ tasks }: TaskListProps) {
  const sortedTasks = [...tasks].sort(
    (a, b) => (a.order || 0) - (b.order || 0)
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "IN_PROGRESS":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      default:
        return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-muted-foreground">
        No tasks available for this case
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sortedTasks.map((task, index) => (
        <Card key={task.id} className="transition-shadow hover:shadow-md">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className="flex flex-col items-center">
                  {getStatusIcon(task.status)}
                  {index < sortedTasks.length - 1 && (
                    <div className="w-px h-8 bg-gray-200 mt-2"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-sm">{task.title}</h3>
                    <Badge
                      className={
                        statusColors[task.status as keyof typeof statusColors]
                      }
                    >
                      {task.status.replace("_", " ")}
                    </Badge>
                    <Badge
                      className={
                        priorityColors[
                          task.priority as keyof typeof priorityColors
                        ]
                      }
                    >
                      {task.priority}
                    </Badge>
                  </div>

                  {task.description && (
                    <p className="text-sm text-gray-600 mb-3">
                      {task.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    {task.assignee && (
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>{task.assignee.name || task.assignee.email}</span>
                      </div>
                    )}

                    {task.dueDate && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>Due {formatDate(task.dueDate)}</span>
                      </div>
                    )}

                    {task.completedAt && (
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        <span>Completed {formatDate(task.completedAt)}</span>
                      </div>
                    )}

                    {task.documents.length > 0 && (
                      <div className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        <span>
                          {task.documents.length} document
                          {task.documents.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {task.status === "PENDING" && (
                  <Button variant="outline" size="sm">
                    Start
                  </Button>
                )}
                {task.status === "IN_PROGRESS" && (
                  <Button variant="default" size="sm">
                    Complete
                  </Button>
                )}
                <Button variant="ghost" size="sm">
                  Edit
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
