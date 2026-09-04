"use client";

import {
  Plus,
  Sparkles,
  Search,
  PenLine,
  Library,
} from "lucide-react";

export default function Sidebar({ onNewChat }) {
  return (
    <aside className="hidden h-screen w-64 flex-col border-r border-zinc-200 bg-zinc-50 md:flex">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
          <Sparkles size={18} />
        </div>

        <h1 className="text-lg font-semibold text-zinc-900">
          Researchly
        </h1>
      </div>

      {/* New Chat */}
      <div className="px-3">
        <button
          onClick={onNewChat}
          className="flex w-full items-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-indigo-700"
        >
          <Plus size={17} />

          New Research
        </button>
      </div>

      {/* Navigation */}
      <div className="mt-8 px-3">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
          Workspace
        </p>

        <SidebarItem
          icon={Sparkles}
          label="Research Agent"
          active
        />

        <SidebarItem
          icon={Search}
          label="Research"
        />

        <SidebarItem
          icon={Library}
          label="Library"
        />

        <SidebarItem
          icon={PenLine}
          label="Writer"
        />
      </div>

      <div className="flex-1" />

      {/* User */}
      <div className="border-t border-zinc-200 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 text-sm font-medium text-white">
            G
          </div>

          <div>
            <p className="text-sm font-medium text-zinc-900">
              Researchly User
            </p>

            <p className="text-xs text-zinc-500">
              Research workspace
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function SidebarItem({
  icon: Icon,
  label,
  active = false,
}) {
  return (
    <button
      className={`mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
        active
          ? "bg-indigo-50 font-medium text-indigo-700"
          : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
      }`}
    >
      <Icon size={17} />

      {label}
    </button>
  );
}