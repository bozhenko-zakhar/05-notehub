
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { fetchNotes, createNote, deleteNote } from "../../services/noteService"
import css from './App.module.css'
import NoteList from '../NoteList/NoteList';
import Pagination from '../Pagination/Pagination';
import Modal from '../Modal/Modal';

export default function App() {
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [currentPage, setCurrentPage] = useState(1);
	const [isModalActive, setModalActive] = useState(false);


	const { data, isSuccess }  = useQuery({
		queryKey: ['notes', searchQuery, currentPage],
		queryFn: () => fetchNotes({currentPage: currentPage}), // {..., searchText: searchQuery }
		placeholderData: keepPreviousData,
	})

	const total_pages = data?.totalPages ?? 0;

  return (
    <div className={css.app}>
			<header className={css.toolbar}>
				{/* Компонент SearchBox */}
				{
					isSuccess && total_pages > 1 && (
						<Pagination totalPages={total_pages} currentPage={currentPage} setCurrentPage={setCurrentPage}/>
					)
				}
				<button className={css.button} onClick={() => setModalActive(true)}>Create note +</button>
				{ isModalActive && <Modal onClose={() => setModalActive(false)}/> } 
			</header>
			{
				data?.notes && <NoteList notes={data.notes}/>
			}
		</div>

  )
}