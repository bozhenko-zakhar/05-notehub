import type { Note } from '../../types/note'
import css from './NoteList.module.css'
import { deleteNote } from '../../services/noteService'

interface NoteListProps {
	notes: Note[]
}

export default function NoteList({notes}: NoteListProps) {

  return (
    <ul className={css.list}>
			{
				notes?.map(note => (
					<li className={css.listItem} key={note.id}>
						<h2 className={css.title}>{note.title}</h2>
						<p className={css.content}>{note.content}</p>
						<div className={css.footer}>
							<span className={css.tag}>{note.tag}</span>
							<button onClick={() => deleteNote({currentId: note.id})} className={css.button}>Delete</button> 
							{/* Add useMutation */}
						</div>
					</li>
				))
			}
		</ul>
  )
}