
import "@/styles/globals.css";
type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html lang="en">
      <head>
        {/* <link rel="icon" href="/icons/Study-Room-Fevicon.png" /> */}
      </head>
      <>
        <body className="bg-white">
          <>{children}</>
          <div id="portal"></div>
        </body>
      </>
    </html>
  );
}
