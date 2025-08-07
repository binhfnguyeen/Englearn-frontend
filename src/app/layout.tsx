import { Metadata } from "next";

export const metadata: Metadata = {
    title: "ELearnWeb",
    description: "Created by Heulwen",
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="vi">
            <body>
                {children}
            </body>
        </html>
    );
}