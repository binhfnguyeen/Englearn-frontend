import React from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <aside>Sidebar Admin</aside>
            <main>{children}</main>
        </>
    );
}