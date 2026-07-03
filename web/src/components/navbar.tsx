"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { createPortal } from "react-dom";
import CardNav, { CardNavItem } from "./ui/card-nav";
import { LayoutDashboard, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { NAV_ITEMS } from "@/lib/navigate";

export default function Navbar() {
    const { data: session } = useSession();
    const [mounted, setMounted] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [dropdownCoords, setDropdownCoords] = useState({ top: 0, left: 0 });
    const [imageError, setImageError] = useState(false);
    const avatarRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handle = requestAnimationFrame(() => setMounted(true));
        return () => cancelAnimationFrame(handle);
    }, []);

    useEffect(() => {
        if (!isDropdownOpen) return;
        const handleClose = () => setIsDropdownOpen(false);
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                avatarRef.current &&
                !avatarRef.current.contains(event.target as Node)
            ) {
                setIsDropdownOpen(false);
            }
        };

        window.addEventListener("scroll", handleClose);
        window.addEventListener("resize", handleClose);
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            window.removeEventListener("scroll", handleClose);
            window.removeEventListener("resize", handleClose);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isDropdownOpen]);

    const toggleDropdown = () => {
        if (!isDropdownOpen && avatarRef.current) {
            const rect = avatarRef.current.getBoundingClientRect();
            setDropdownCoords({
                top: rect.bottom + window.scrollY + 12,
                left: rect.right + window.scrollX - 220,
            });
        }
        setIsDropdownOpen(!isDropdownOpen);
    };

    const initials = session?.user?.name
        ? session.user.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()
        : session?.user?.email
            ? session.user.email.slice(0, 2).toUpperCase()
            : "US";

    const currentItems = [...NAV_ITEMS];
    if (session) {
        currentItems.push({
            label: "Account",
            bgColor: "var(--primary-text-color)",
            textColor: "var(--surface-color)",
            links: [
                { label: "Dashboard", ariaLabel: "Go to Dashboard", href: "/dashboard" },
                { label: "Sign Out", ariaLabel: "Sign Out of Account", onClick: () => signOut({ callbackUrl: "/" }) }
            ]
        });
    } else {
        currentItems.push({
            label: "Account",
            bgColor: "var(--primary-text-color)",
            textColor: "var(--surface-color)",
            links: [
                { label: "Sign In", ariaLabel: "Sign In", href: "/auth/signin" },
                { label: "Sign Up", ariaLabel: "Sign Up", href: "/auth/signup" }
            ]
        });
    }

    const rightElement = session ? (
        <div className="relative hidden md:flex items-center">
            <button
                ref={avatarRef}
                onClick={toggleDropdown}
                className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer overflow-hidden border border-[var(--border-color)] transition hover:ring-2 hover:ring-[var(--primary-color)] outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                aria-label="User menu"
                aria-expanded={isDropdownOpen}
            >
                {session.user?.image && !imageError ? (
                    <Image
                        src={session.user.image}
                        alt={session.user.name || "User Avatar"}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-xs bg-[var(--primary-color)] text-[var(--surface-color)]">
                        {initials}
                    </div>
                )}
            </button>
            {mounted && isDropdownOpen && createPortal(
                <div
                    ref={dropdownRef}
                    style={{
                        position: "absolute",
                        top: dropdownCoords.top,
                        left: dropdownCoords.left,
                        width: "220px",
                        zIndex: 9999,
                    }}
                    className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-2xl shadow-xl p-3 flex flex-col gap-1 transition-all animate-in fade-in slide-in-from-top-2 duration-200"
                >
                    <div className="px-2 py-1.5 border-b border-[var(--border-color)] mb-1.5 max-w-full">
                        <p className="text-xs text-[var(--secondary-text-color)] font-medium">Signed in as</p>
                        <p className="text-sm font-semibold text-[var(--primary-text-color)] truncate">
                            {session.user?.name || "Astra User"}
                        </p>
                        <p className="text-xs text-[var(--secondary-text-color)] truncate">
                            {session.user?.email}
                        </p>
                    </div>
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-[var(--primary-text-color)] hover:bg-[var(--surface-strong-color)] transition-colors no-underline font-medium"
                    >
                        <LayoutDashboard className="w-4 h-4 text-[var(--secondary-text-color)]" />
                        Dashboard
                    </Link>
                    <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="flex items-center gap-2 w-full text-left px-2 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors font-medium cursor-pointer border-0 bg-transparent"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>,
                document.body
            )}
        </div>
    ) : (
        <Link
            href="/auth/signin"
            className="hidden md:inline-flex items-center justify-center font-semibold border-0 rounded-[calc(0.75rem-0.2rem)] px-5 h-10 transition hover:opacity-90 active:scale-95 cursor-pointer select-none no-underline text-sm"
            style={{ backgroundColor: "var(--primary-color)", color: "var(--surface-color)" }}
        >
            Sign In
        </Link>
    );

    return (
        <CardNav
            logo="/logo.svg"
            logoAlt="Astra"
            items={currentItems}
            baseColor="var(--surface-color)"
            menuColor="var(--primary-text-color)"
            buttonBgColor="var(--primary-color)"
            buttonTextColor="var(--surface-color)"
            ease="power3.out"
            rightElement={rightElement}
        />
    );
}