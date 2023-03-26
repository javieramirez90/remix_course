import { json, redirect } from '@remix-run/node';
import { Link, useCatch, useLoaderData } from '@remix-run/react';
import NewNote, { links as newNoteLinks } from '~/components/NewNote';
import NoteList, { links as noteListLinks, } from '~/components/NoteList';
import { getStoredNotes, storeNotes } from '~/data/notes';

export default function NotesPages() {
  // This hook is used to get data from the loader function.
  const notes = useLoaderData();
  return (
    <main>
      <NewNote />
      <NoteList notes={notes} />
    </main>
  );
}

export async function loader() {
  const notes = await getStoredNotes();
  if (!notes || notes.length === 0) {
    throw json({ message: 'No notes found' }, { status: 404, statusText: 'Not Found' });
  }
  return notes;
  // // This is what Remix do under the hood
  // return new Response(JSON.stringify(notes), {headers: {'Content-Type': 'application/json'}});
}

export async function action({ request }) {
  const formData = await request.formData();
  const noteData = Object.fromEntries(formData);
  // // you can also get data this way
  // const noteData = {
  //   title: formData.get('title'),
  //   content: formData.get('content')
  // }

  if (noteData.title.trim().length < 5 || noteData.content.trim() === '') {
    // return redirect('/notes?error=invalid-input');
    return { message: 'Invalid title - must be at least 5 characters long' };
  }

  const existingNotes = await getStoredNotes();
  noteData.id = new Date().toISOString();
  const updatedNotes = existingNotes.concat(noteData);
  await storeNotes(updatedNotes);
  return redirect('/notes');
};

export function links() {
  return [
    ...newNoteLinks(),
    ...noteListLinks()
  ];
};

export function meta() {
  return {
    title: 'All Notes',
    description: 'This is a page for all your notes',
  };
}

// this will handle the error thrown by the loader function for this route
export function CatchBoundary() {
  const caught = useCatch();

  return (
    <main className="error">
      <h1>Caught</h1>
      <p>Status: {caught.status}</p>
      <pre>
        <code>{JSON.stringify(caught.data?.message || 'Data not found.', null, 2)}</code>
      </pre>
    </main>
  );
}

export function ErrorBoundary({ error }) {
  return (
    <main className="error">
      <h1>An error occurred!</h1>
      <p>{error.message}</p>
      <p>
        Back to <Link to="/">safety</Link>!
      </p>
    </main>
  );
}