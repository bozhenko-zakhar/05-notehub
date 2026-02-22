import { createPortal } from 'react-dom'
import css from './Modal.module.css'
import { useEffect } from 'react';
import NoteForm from '../NoteForm/NoteForm';
import type { NewNote } from '../../types/note';

interface ModalProps {
	closeModal: () => void;
	createNote: (newNote: NewNote) => void;
}

export default function Modal({closeModal, createNote}: ModalProps) {
	function handleBackdropClick(event: React.MouseEvent<HTMLDivElement>) {
		if (event.target === event.currentTarget) {
      closeModal();
    }
	}
	
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
      	closeModal();
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		document.body.style.overflow = "hidden";

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
			document.body.style.overflow = "";
		};
	}, [closeModal])

  return createPortal(
		<div
			className={css.backdrop}
			role="dialog"
			aria-modal="true"
			onClick={handleBackdropClick}
		>
			<div className={css.modal}>
				<NoteForm closeModal={() => closeModal()} createNote={createNote} />
			</div>
		</div>,
		document.body
	)
}