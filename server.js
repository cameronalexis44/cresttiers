import "./globals.css";

export const metadata = {
  title: "CrestTiers",
  description: "A community PvP ranking board",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
