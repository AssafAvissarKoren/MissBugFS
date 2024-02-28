import { useEffect, useState } from "react"

export function BugFilter({ filterBy, onSetFilterBy }) {

    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)

    useEffect(() => {
        onSetFilterBy(filterByToEdit)
    }, [filterByToEdit])

    function handleChange({ target }) {
        console.log('target:', target)
        const field = target.name
        let value = target.value
        if (field === "labels") {
            value = value.trim() === "" ? [] : value.split(",").map(label => label.trim())
        }
        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
    }

    function onSubmitFilter(ev) {
        ev.preventDefault()
        onSetFilterBy(filterByToEdit)
    }

    function handleClearFilter() {
        setFilterByToEdit({ text: "", minSeverity: "", labels: [], sortCriterion: "" })
    }

    const { text, minSeverity, labels, sortCriterion } = filterByToEdit
    return (
        <section className="bug-filter">
            <h2>Filter Our Bugs</h2>
            <form onSubmit={onSubmitFilter}>
                <label htmlFor="text">Title: </label>
                <input value={text} onChange={handleChange} type="text" placeholder="By Title & Description" id="text" name="text" />

                <label htmlFor="minSeverity">Min Severity: </label>
                <input value={minSeverity} onChange={handleChange} type="number" placeholder="By Min Severity" id="minSeverity" name="minSeverity" />

                <label htmlFor="labels">Labels: </label>
                <input value={labels} onChange={handleChange} type="text" placeholder="Separate Labels by ," id="labels" name="labels" />

                <label htmlFor="sortCriterion">Sort By: </label>
                <select value={sortCriterion} onChange={handleChange} id="sortCriterion" name="sortCriterion">
                    <option value="">None</option>
                    <option value="date">Date</option>
                    <option value="title">Title</option>
                </select>

                <button type="submit">Set Filter</button>

                <button type="button" onClick={handleClearFilter}>Clear Filter</button>
            </form>
        </section>
    )
}
