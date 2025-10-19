"use client";

import * as React from "react";
import {
  AudioWaveform,
  BarChart3,
  Briefcase,
  Calendar,
  Command,
  FileText,
  FolderOpen,
  Home,
  MessageCircleQuestion,
  Settings2,
  Users,
} from "lucide-react";

import { NavFavorites } from "@/components/nav-favorites";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavWorkspaces } from "@/components/nav-workspaces";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// Legal firm data
const data = {
  teams: [
    {
      name: "Immigration Law Firm",
      logo: Command,
      plan: "Professional",
    },
    {
      name: "Personal Practice",
      logo: AudioWaveform,
      plan: "Solo",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
      isActive: true,
    },
    {
      title: "Cases",
      url: "/cases",
      icon: Briefcase,
      badge: "12",
    },
    {
      title: "Clients",
      url: "/clients",
      icon: Users,
    },
    {
      title: "Documents",
      url: "/documents",
      icon: FileText,
    },
  ],
  navSecondary: [
    {
      title: "Calendar",
      url: "/calendar",
      icon: Calendar,
    },
    {
      title: "Templates",
      url: "/templates",
      icon: FolderOpen,
    },
    {
      title: "Reports",
      url: "/reports",
      icon: BarChart3,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
    },
    {
      title: "Help",
      url: "/help",
      icon: MessageCircleQuestion,
    },
  ],
  favorites: [
    {
      name: "High Priority Cases",
      url: "/cases?priority=high",
      emoji: "�",
    },
    {
      name: "EB1A Applications",
      url: "/cases?template=eb1a",
      emoji: "🏆",
    },
    {
      name: "H1B Renewals",
      url: "/cases?template=h1b",
      emoji: "💼",
    },
    {
      name: "New Client Onboarding",
      url: "/clients?status=new",
      emoji: "👋",
    },
    {
      name: "Pending Document Review",
      url: "/documents?status=pending",
      emoji: "📋",
    },
  ],
  workspaces: [
    {
      name: "Active Cases",
      emoji: "📁",
      pages: [
        {
          name: "Immigration Petitions",
          url: "/cases?category=immigration",
          emoji: "�",
        },
        {
          name: "Work Visas",
          url: "/cases?category=work",
          emoji: "💼",
        },
        {
          name: "Family Visas",
          url: "/cases?category=family",
          emoji: "👨‍👩‍👧‍👦",
        },
      ],
    },
    {
      name: "Case Templates",
      emoji: "�",
      pages: [
        {
          name: "EB1A - Extraordinary Ability",
          url: "/templates/eb1a",
          emoji: "⭐",
        },
        {
          name: "NIW - National Interest Waiver",
          url: "/templates/niw",
          emoji: "🇺🇸",
        },
        {
          name: "H1B - Specialty Occupation",
          url: "/templates/h1b",
          emoji: "💻",
        },
        {
          name: "L1 - Intracompany Transfer",
          url: "/templates/l1",
          emoji: "🏢",
        },
        {
          name: "O1 - Extraordinary Achievement",
          url: "/templates/o1",
          emoji: "�",
        },
      ],
    },
    {
      name: "Client Management",
      emoji: "👥",
      pages: [
        {
          name: "Individual Clients",
          url: "/clients?type=individual",
          emoji: "�",
        },
        {
          name: "Corporate Clients",
          url: "/clients?type=corporate",
          emoji: "🏢",
        },
        {
          name: "Client Communications",
          url: "/communications",
          emoji: "�",
        },
      ],
    },
  ],
};

export function SidebarLeft({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
        <NavMain items={data.navMain} />
      </SidebarHeader>
      <SidebarContent>
        <NavFavorites favorites={data.favorites} />
        <NavWorkspaces workspaces={data.workspaces} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
