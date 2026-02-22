import { useId } from 'react'
import * as Yup from "yup"
import css from './NoteForm.module.css'
import {Formik, Form, Field, ErrorMessage, type FormikHelpers} from "formik"
import type { NewNote } from '../../types/note'

interface NoteFormParams {
	closeModal: () => void,
	createNote: (newNote: NewNote) => void
}

export default function NoteForm({closeModal, createNote}: NoteFormParams) {
	const fieldId = useId();

	const noteInitValues: NewNote = {
		title: "Continuing GoIt course",
		content: "Now we are completing 5th course of React + Next module. So we are close for the next completing on 6th!",
		tag: "Personal"
	} 

	const NoteFormSchema = Yup.object().shape({
		title: Yup.string()
			.required("title is required")
			.min(3)
			.max(50),
		content: Yup.string()
			.max(500),
		tag: Yup.string()
			.required("tag is required")
			.matches(/(Todo|Work|Personal|Meeting|Shopping)/)
	})


	function handleSubmit (values: NewNote, actions: FormikHelpers<NewNote>) {
		createNote({
			title: values.title,
			content: values.content,
			tag: values.tag
		})

  	actions.resetForm();
		closeModal();
	}

  return (
		<Formik initialValues={noteInitValues} validationSchema={NoteFormSchema} onSubmit={handleSubmit}>
			<Form className={css.form}>
				<div className={css.formGroup}>
					<label htmlFor={`${fieldId}-title`}>Title</label>
					<Field className={css.input} type="text" name="title" id={`${fieldId}-title`} />
					
					<ErrorMessage name="title" component="span" className={css.error} />
				</div>

				<div className={css.formGroup}>
					<label htmlFor={`${fieldId}-content`}>Content</label>
					<Field
						as="textarea"
						className={css.textarea}
						id={`${fieldId}-content`}
						name="content"
						rows={8}
					/>
					<ErrorMessage name="content" component="span" className={css.error} />
				</div>

				<div className={css.formGroup}>
					<label htmlFor={`${fieldId}-tag`}>Tag</label>
					<Field
						as="select"
						className={css.select}
						id={`${fieldId}-tag`}
						name="tag"
					>
						<option value="Todo">Todo</option>
						<option value="Work">Work</option>
						<option value="Personal">Personal</option>
						<option value="Meeting">Meeting</option>
						<option value="Shopping">Shopping</option>
					</Field>
					<ErrorMessage name="tag" component="span" className={css.error} />
				</div>

				<div className={css.actions}>
					<button onClick={() => closeModal()} type="button" className={css.cancelButton}>
						Cancel
					</button>
					<button
						type="submit"
						className={css.submitButton}
						disabled={false}
					>
						Create note
					</button>
				</div>
			</Form>
		</Formik>
  )
}