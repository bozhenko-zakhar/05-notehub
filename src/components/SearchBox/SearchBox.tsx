import css from './SearchBox.module.css'

interface SearchBoxParams {
	updateSearchQuery: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export default function SearchBox({updateSearchQuery}: SearchBoxParams) {

  return (
    <input
			onChange={updateSearchQuery}
			className={css.input}
			type="text"
			placeholder="Search notes"
		/>
  )
}