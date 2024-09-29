// import { redirect } from 'next/navigation';
// import { getUser } from './actions/auth';
import HomePage from './home/page';

export default async function Home() {
  // const data = await getUser();

  // if (!data || data.token === '') {
  //   redirect('/login');
  // }

  return (
    <div className="flex flex-col items-center justify-items-center font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <HomePage />
      </main>
    </div>
  );
}
