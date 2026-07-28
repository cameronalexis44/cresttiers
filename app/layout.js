import "./globals.css";

export const metadata = {
  title: "BPtiers",
  description: "A community PvP ranking board",
  themeColor: "#3b82f6",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
