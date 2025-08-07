import SidebarLayout from "@/components/SidebarLayout";
import Footer from "@/components/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: {
        default: "ELearnWeb",
        template: "%s | Heulwentech",
    },
    description: "Created by Heulwen",
};

export default function ClientRootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <SidebarLayout>
                {children}
            </SidebarLayout>
            <Footer />
        </>
    );
}