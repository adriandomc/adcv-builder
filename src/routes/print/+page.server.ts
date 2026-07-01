import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { takeDoc } from '$lib/server/pdfDocStore';

// Not a user-facing route — reached only by the headless browser in
// POST /api/pdf, which hands the parsed document over via a single-use token.
export const load: PageServerLoad = ({ url }) => {
  const token = url.searchParams.get('token');
  const document = token ? takeDoc(token) : undefined;
  if (!document) throw error(404, 'Not found');
  return { document };
};
