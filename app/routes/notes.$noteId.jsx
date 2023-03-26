import { json } from '@remix-run/node';
import { Link, useCatch, useLoaderData } from '@remix-run/react';
import styles from '~/styles/note-details.css';
import { getNoteById } from '../data/notes';

export default function NoteDetailsPage() {
  const note = useLoaderData();
  return (
    <main id="note-details">
      <header>
        <nav>
          <Link to="/notes">Back to all Notes</Link>
        </nav>
        <h1>{note.title}</h1>
      </header>
      <p id="note-details-content">{note.content}</p>
    </main>
  );
}

export async function loader({ params }) {
  const { noteId } = params;
  const note = await getNoteById(noteId);
  console.log({note})
  if (!note) {
    throw json(
      { message: 'No note found with that id' },
      { status: 404, statusText: 'Not Found' }
    );
  }

  return note;
}

export function CatchBoundary() {
  const caught = useCatch();
  return (
    <main className="error">
      <h1>Caught</h1>
      <p>Status: {caught.status}</p>
      <pre>
        <code>
          {JSON.stringify(
            caught.data?.message || 'Data not found.',
            null,
            2
          )}
        </code>
      </pre>
    </main>
  );
}

export function links() {
  return [{ rel: 'stylesheet', href: styles }];
}

export function meta({ data }) {
  return {
    title: data.title,
    description: 'This is a page for all your notes',
  };
}
