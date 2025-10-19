"use client";

import { useMemo } from "react";
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  BackgroundVariant,
} from "reactflow";
import "reactflow/dist/style.css";
import { Badge } from "@/components/ui/badge";

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  order: number | null;
  completedAt: string | null;
}

interface CaseWorkflowProps {
  tasks: Task[];
}

const statusColors = {
  PENDING: { bg: "#f3f4f6", border: "#d1d5db", text: "#374151" },
  IN_PROGRESS: { bg: "#fef3c7", border: "#f59e0b", text: "#92400e" },
  COMPLETED: { bg: "#d1fae5", border: "#10b981", text: "#065f46" },
  BLOCKED: { bg: "#fee2e2", border: "#ef4444", text: "#991b1b" },
  CANCELLED: { bg: "#f3f4f6", border: "#6b7280", text: "#374151" },
};

export function CaseWorkflow({ tasks }: CaseWorkflowProps) {
  const { nodes, edges } = useMemo(() => {
    const sortedTasks = [...tasks].sort(
      (a, b) => (a.order || 0) - (b.order || 0)
    );

    const nodes: Node[] = sortedTasks.map((task, index) => {
      const colors =
        statusColors[task.status as keyof typeof statusColors] ||
        statusColors.PENDING;

      return {
        id: task.id,
        type: "default",
        position: { x: index * 300, y: 100 },
        data: {
          label: (
            <div className="p-4 min-w-[250px]">
              <div className="flex items-center justify-between mb-2">
                <Badge
                  style={{
                    backgroundColor: colors.bg,
                    borderColor: colors.border,
                    color: colors.text,
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  {task.status.replace("_", " ")}
                </Badge>
                <span className="text-xs text-gray-500">#{task.order}</span>
              </div>
              <h3 className="font-semibold text-sm mb-1">{task.title}</h3>
              {task.description && (
                <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                  {task.description}
                </p>
              )}
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">
                  {task.priority}
                </Badge>
                {task.completedAt && (
                  <span className="text-xs text-green-600">✓ Completed</span>
                )}
              </div>
            </div>
          ),
        },
        style: {
          background: colors.bg,
          border: `2px solid ${colors.border}`,
          borderRadius: "8px",
          fontSize: "12px",
          color: colors.text,
        },
      };
    });

    const edges: Edge[] = sortedTasks.slice(0, -1).map((task, index) => ({
      id: `${task.id}-${sortedTasks[index + 1].id}`,
      source: task.id,
      target: sortedTasks[index + 1].id,
      type: "smoothstep",
      animated: sortedTasks[index + 1].status === "IN_PROGRESS",
      style: {
        stroke: "#6b7280",
        strokeWidth: 2,
      },
    }));

    return { nodes, edges };
  }, [tasks]);

  if (tasks.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        No tasks available for this case
      </div>
    );
  }

  return (
    <div className="h-96 w-full border rounded-lg">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        attributionPosition="bottom-left"
      >
        <Controls />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}
