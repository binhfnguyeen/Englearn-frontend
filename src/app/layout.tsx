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

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <SidebarLayout>
                    {children}
                </SidebarLayout>
                <Footer/>
            </body>
        </html>
    );
}