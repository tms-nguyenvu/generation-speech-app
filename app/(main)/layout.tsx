export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="container mx-auto px-4 sm:px-8 h-screen py-10">
        {children}
      </main>
    </>
  )
}
