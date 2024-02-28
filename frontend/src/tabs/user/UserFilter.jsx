import { useEffect, useState } from "react"

export function UserFilter({ filterBy, onSetFilterBy }) {

    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)


    useEffect(() => {
        onSetFilterBy(filterByToEdit)
    }, [filterByToEdit])

    function handleChange({ target }) {
        const field = target.name
        let value = target.value
        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
    }

    function onSubmitFilter(ev) {
        ev.preventDefault()
        onSetFilterBy(filterByToEdit)
    }


    function handleClearFilter() {
        setFilterByToEdit({ text: "", minScore: "" })
    }

    const { text, minScore } = filterByToEdit
    return (
        <section className="user-filter">
            <h2>Filter Our User</h2>
            <form onSubmit={onSubmitFilter}>
                <label htmlFor="text">Title: </label>
                <input value={text} onChange={handleChange} type="text" placeholder="By User & Full Name" id="text" name="text" />

                <label htmlFor="minScore">Min Score: </label>
                <input value={minScore} onChange={handleChange} type="number" placeholder="By Min Score" id="minScore" name="minScore" />

                <button type="submit">Set Filter</button>

                <button type="button" onClick={handleClearFilter}>Clear Filter</button>
            </form>
        </section>
    )
}
