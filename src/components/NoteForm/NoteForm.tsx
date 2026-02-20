import { useId } from 'react'
import * as Yup from "yup"
import css from './NoteForm.module.css'
import {Formik, Form, Field, ErrorMessage} from "formik"

export default function NoteForm() {
	const fieldId = useId();

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

	function handleSubmit (values: interface, actions: FormikHelpers<interface>) {

  	actions.resetForm()
	}

  return (
		<Formik initialValues={{}} validationSchema={NoteFormSchema} onSubmit={handleSubmit}>
			<Form className={css.form}>
				<div className={css.formGroup}>
					<label htmlFor={`${fieldId}-title`}>Title</label>
					<Field className={css.input} type="text" name="title" id={`${fieldId}-title`} />
					
					<ErrorMessage name="title" component="span" className={css.error} />
				</div>

				<div className={css.formGroup}>
					<label htmlFor="content">Content</label>
					<textarea
						id="content"
						name="content"
						rows={8}
						className={css.textarea}
					/>
					<span name="content" className={css.error} />
				</div>

				<div className={css.formGroup}>
					<label htmlFor="tag">Tag</label>
					<select id="tag" name="tag" className={css.select}>
						<option value="Todo">Todo</option>
						<option value="Work">Work</option>
						<option value="Personal">Personal</option>
						<option value="Meeting">Meeting</option>
						<option value="Shopping">Shopping</option>
					</select>
					<span name="tag" className={css.error} />
				</div>

				<div className={css.actions}>
					<button type="button" className={css.cancelButton}>
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