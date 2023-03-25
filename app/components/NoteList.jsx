import { Link } from '@remix-run/react';
import styles from './NoteList.css';

export default function NoteList({ notes }) {
  return (
    <ul id="note-list">
      {notes.map((note, index) => (
        <li key={note.id} className="note">
          {/* THis was the first version I tried but then
          I learned Remix can use relative paths and add
          the note id value to the end of the path */}
          {/* <Link to={note.id}> */}
          {/* then if you don't want to modify any file,
           you can use this way */}
          {/* <Link to={`/${note.id}`}> */}
          {/* or you can use this way but then you have
          to modify $noteId to notes.$noteId.jsx.
          Basically the dot changes for a slash*/}
          <Link to={note.id}>
            <article>
              <header>
                <ul className="note-meta">
                  <li>#{index + 1}</li>
                  <li>
                    <time dateTime={note.id}>
                      {new Date(note.id).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </time>
                  </li>
                </ul>
                <h2>{note.title}</h2>
              </header>
              <p>{note.content}</p>
            </article>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function links() {
  return [{ rel: 'stylesheet', href: styles }];
}
