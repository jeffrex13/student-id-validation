import Dashboard from './dashboard/page';

export default async function Home() {
  return (
    <div className="flex flex-col items-center font-[family-name:var(--font-geist-sans)]">
      <main className="container mx-auto w-full max-w-7xl px-4 py-8">
        <Dashboard />
      </main>
    </div>
  );
}
