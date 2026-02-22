import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { fetchNotes } from "../../services/noteService"
import NoteList from '../NoteList/NoteList';
import Pagination from '../Pagination/Pagination';
import Modal from '../Modal/Modal';
import SearchBox from '../SearchBox/SearchBox';
import Loader from '../Loader/Loader';
import css from './App.module.css';
import NoteForm from '../NoteForm/NoteForm';

export default function App() {
	const [searchQuery, setSearchQuery] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [isModalActive, setModalActive] = useState(false);

	const { data, isError, isLoading, isSuccess, isFetched } = useQuery({
		queryKey: ['notes', searchQuery, currentPage],
		queryFn: () => fetchNotes({currentPage: currentPage, searchText: searchQuery }),
		placeholderData: keepPreviousData,
	});

	const updateSearchQuery = useDebouncedCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(event.target.value);
		setCurrentPage(1);
	}, 300)

	
	
	const total_pages = data?.totalPages ?? 0;

  return (
    <div className={css.app}>
			<header className={css.toolbar}>
				<SearchBox onChange={updateSearchQuery} />
				{ isSuccess && total_pages > 1 && (
					<Pagination totalPages={total_pages} currentPage={currentPage} setCurrentPage={setCurrentPage}/>
				) }

				<button className={css.button} onClick={() => setModalActive(true)}>Create note +</button>

				{ isModalActive &&
					<Modal closeModal={() => setModalActive(false)}>
						<NoteForm closeModal={() => setModalActive(false)} />
					</Modal>
				} 
			</header>

			{ data?.notes &&
				<NoteList notes={data.notes}/>
			}

			{ isLoading && !isError && 
				<Loader />
			}

			{
				isFetched && data?.notes.length == 0 &&
				<p className={css.not_found}>No documents were found for the query «{searchQuery}»</p>
			}

			<Toaster />
		</div>

  )
}