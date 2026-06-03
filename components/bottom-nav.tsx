"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, CalendarDays, House, Search, User } from "lucide-react";

const items = [
  { href: "/feed", label: "Feed", icon: House },
  { href: "/competitions", label: "Competitions", icon: CalendarDays },
  { href: "/search", label: "Search", icon: Search },
  { href: "/diary", label: "Diary", icon: BookOpen },
  { href: "/settings", label: "Profile", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 inset-x-0 mx-auto max-w-md border-t border-[#22304A] bg-[#111B2E]/95 backdrop-blur z-40">
      <ul className="grid grid-cols-5">
        {items.map((item) => {
          const ActiveIcon = item.icon;
          const active = pathname?.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex flex-col items-center justify-center py-2 text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A3E635] ${
                  active ? "text-[#A3E635]" : "text-[#94A3B8]"
                }`}
              >
                <ActiveIcon size={18} />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
