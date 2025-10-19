"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Filter, Grid, List, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

interface Case {
  id: string;
  title: string;
  status: string;
  priority: string;
  dueDate: string | null;
  client: {
    firstName: string;
    lastName: string;
  };
  template: {
    name: string;
    type: string;
  } | null;
  createdAt: string;
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

export function CasesContent() {
  const [cases, setCases] = useState<Case[]>([]);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const response = await fetch("/api/cases");
        if (response.ok) {
          const data = await response.json();
          setCases(data);
        }
      } catch (error) {
        console.error("Failed to fetch cases:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  const filteredCases = cases.filter((case_) => {
    const matchesSearch =
      case_.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${case_.client.firstName} ${case_.client.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || case_.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Cases</h1>
          <p className="text-muted-foreground">
            Manage and track all legal cases
          </p>
        </div>
        <Button asChild>
          <Link href="/cases/new">
            <Plus className="mr-2 h-4 w-4" />
            New Case
          </Link>
        </Button>
      </div>

      {/* Filters and Controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search cases..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Status
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                All Statuses
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("OPEN")}>
                Open
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("IN_PROGRESS")}>
                In Progress
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setStatusFilter("PENDING_REVIEW")}
              >
                Pending Review
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("APPROVED")}>
                Approved
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("DENIED")}>
                Denied
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("CLOSED")}>
                Closed
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("table")}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            <Grid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Cases Display */}
      {viewMode === "table" ? (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Case Title</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCases.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No cases found
                  </TableCell>
                </TableRow>
              ) : (
                filteredCases.map((case_) => (
                  <TableRow key={case_.id}>
                    <TableCell className="font-medium">{case_.title}</TableCell>
                    <TableCell>
                      {case_.client.firstName} {case_.client.lastName}
                    </TableCell>
                    <TableCell>{case_.template?.type || "N/A"}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          statusColors[
                            case_.status as keyof typeof statusColors
                          ]
                        }
                      >
                        {case_.status.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          priorityColors[
                            case_.priority as keyof typeof priorityColors
                          ]
                        }
                      >
                        {case_.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {case_.dueDate
                        ? formatDate(case_.dueDate)
                        : "No due date"}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/cases/${case_.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCases.length === 0 ? (
            <div className="col-span-full text-center py-8">No cases found</div>
          ) : (
            filteredCases.map((case_) => (
              <Card
                key={case_.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{case_.title}</CardTitle>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/cases/${case_.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Client</p>
                      <p className="font-medium">
                        {case_.client.firstName} {case_.client.lastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Type</p>
                      <p className="font-medium">
                        {case_.template?.type || "N/A"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={
                          statusColors[
                            case_.status as keyof typeof statusColors
                          ]
                        }
                      >
                        {case_.status.replace("_", " ")}
                      </Badge>
                      <Badge
                        className={
                          priorityColors[
                            case_.priority as keyof typeof priorityColors
                          ]
                        }
                      >
                        {case_.priority}
                      </Badge>
                    </div>
                    {case_.dueDate && (
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Due Date
                        </p>
                        <p className="font-medium">
                          {formatDate(case_.dueDate)}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
