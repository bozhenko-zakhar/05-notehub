import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast, { Toaster } from 'react-hot-toast';
import { fetchNotes, createNote, deleteNote } from "../../services/noteService"
import type { NewNote, Note } from '../../types/note';
import NoteList from '../NoteList/NoteList';
import Pagination from '../Pagination/Pagination';
import Modal from '../Modal/Modal';
import SearchBox from '../SearchBox/SearchBox';
import Loader from '../Loader/Loader';
import css from './App.module.css'

export default function App() {
	const [searchQuery, setSearchQuery] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [isModalActive, setModalActive] = useState(false);

	const queryClient = useQueryClient();

	const { data, isError, isLoading, isSuccess, isFetched } = useQuery({
		queryKey: ['notes', searchQuery, currentPage],
		queryFn: () => fetchNotes({currentPage: currentPage, searchText: searchQuery}),
		placeholderData: keepPreviousData,
	});

	const updateSearchQuery = useDebouncedCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(event.target.value);
	}, 300)

	const deleteNoteMutation = useMutation({
		mutationFn: async (noteId: string) => {
			const deletedNote: Promise<Note> = deleteNote({currentId: noteId});
			return deletedNote;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['notes', searchQuery, currentPage] });

			toast.success("Your note was successfuly deleted");
		},
		onError: (error) => {
			toast.error(`${error}`);
		}
	});
	
	const createNoteMutation = useMutation({
		mutationFn: async (newNote: NewNote) => {
			const createdNote: Promise<Note> = createNote({
				title: newNote.title,
				content: newNote.content,
				tag: newNote.tag
			});
			return createdNote;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['notes', searchQuery, currentPage] });
		
			toast.success("Your note was successfuly created");
		},
		onError: (error) => {
			toast.error(`${error}`);
		}
	});

	function handleCreateNote(newNote: NewNote) {
		createNoteMutation.mutate(newNote);
	}

	function handleDeleteNote(noteId: string) {
		deleteNoteMutation.mutate(noteId)
	}
	
	const total_pages = data?.totalPages ?? 0;

  return (
    <div className={css.app}>
			<header className={css.toolbar}>
				<SearchBox updateSearchQuery={updateSearchQuery} />
				{ isSuccess && total_pages > 1 && (
					<Pagination totalPages={total_pages} currentPage={currentPage} setCurrentPage={setCurrentPage}/>
				) }

				<button className={css.button} onClick={() => setModalActive(true)}>Create note +</button>

				{ isModalActive &&
					<Modal closeModal={() => setModalActive(false)} createNote={handleCreateNote} />
				} 
			</header>

			{ data?.notes &&
				<NoteList notes={data.notes} deleteNote={handleDeleteNote}/>
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