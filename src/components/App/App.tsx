
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { fetchNotes, createNote, deleteNote } from "../../services/noteService"
import css from './App.module.css'
import NoteList from '../NoteList/NoteList';

export default function App() {
	const [searchQuery, setSearchQuery] = useState<string>("");

	const { data, isFetching } = useQuery({
		queryKey: ['notes', searchQuery],
		queryFn: () => fetchNotes({currentPage: 1}), // {..., searchText: searchQuery }
		placeholderData: keepPreviousData,
	})

  return (
    <div className={css.app}>
			<header className={css.toolbar}>
				{/* Компонент SearchBox */}
				{/* Пагінація */}
				{/* Кнопка створення нотатки */}
			</header>
			<NoteList notes={data}/>
		</div>

  )
}