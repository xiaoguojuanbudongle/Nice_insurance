"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { mockSignOut } from "@/lib/mock";
import { supabase } from "@/lib/supabase";
import { hasSupabaseEnv } from "@/lib/supabase";
import type { UserRole } from "@/types/database";

const nav = {
  customer: [
    ["Dashboard", "/customer"],
    ["Profile", "/customer/profile"],
    ["Auto Policies", "/customer/auto-policies"],
    ["Home Policies", "/customer/home-policies"],
    ["Claims", "/customer/claims"],
    ["Invoices", "/customer/invoices"]
  ],
  employee: [
    ["Dashboard", "/employee"],
    ["Customers", "/employee/customers"],
    ["Auto Policies", "/employee/auto-policies"],
    ["Home Policies", "/employee/home-policies"],
    ["Claims", "/employee/claims"],
    ["Invoices", "/employee/invoices"],
    ["Analytics", "/employee/analytics"]
  ]
} satisfies Record<UserRole, string[][]>;

type AppShellProps = {
  role: UserRole;
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
};

export function AppShell({ role, title, eyebrow, children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    if (hasSupabaseEnv) {
      await supabase.auth.signOut();
    } else {
      await mockSignOut();
    }
    router.replace("/login");
  }

  return (
    <div className="app-frame">
      <aside className="sidebar">
        <Link href={`/${role}`} className="brand">
          <span className="brand-mark">I</span>
          <span>InsureOps</span>
        </Link>
        <nav className="nav-list" aria-label={`${role} navigation`}>
          {nav[role].map(([label, href]) => (
            <Link key={href} href={href} className={pathname === href ? "nav-link active" : "nav-link"}>
              {label}
            </Link>
          ))}
        </nav>
        <button className="ghost-button" onClick={signOut}>
          Sign out
        </button>
      </aside>
      <main className="content">
        <header className="page-header">
          <div>
            {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
            <h1>{title}</h1>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
