import { getFirstDoc } from '@/lib/docs';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const firstDoc = await getFirstDoc();

  if (!firstDoc) {
    redirect('/docs/getting-started');
  }

  redirect(`/docs/${firstDoc.slugPath}`);
}
