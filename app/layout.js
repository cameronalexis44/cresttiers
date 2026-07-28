import "./globals.css";

export const metadata = {
  title: "BPtiers",
  description: "A community PvP ranking board",
  themeColor: "#ef4444",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
