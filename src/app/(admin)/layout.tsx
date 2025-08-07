"use client"
import React, { useReducer } from "react";
import AdminSidebarLayout from "@/components/AdminSidebarLayout";
import Footer from "@/components/Footer";
import MyUserReducer from "@/reducers/MyUserReducer";
import UserContext from "@/configs/UserContext";

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
    const [user, dispatch] = useReducer(MyUserReducer, null);
    return (
        <UserContext.Provider value={{user, dispatch}}>
            <AdminSidebarLayout>
                {children}
            </AdminSidebarLayout>
            <Footer/>
        </UserContext.Provider>
    );
}