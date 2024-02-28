import React from 'react'

export function PageNumbers ({ totalNum, numPerPage, filterBy, onSetFilterBy, setCurrentPage }) {
    const pageNumbers = []
    for (let i = 1; i <= Math.ceil(totalNum / numPerPage); i++) {
        pageNumbers.push(i)
    }

    const renderPageNumbers = pageNumbers.map(number => (
        <button key={number} onClick={() => {
            onSetFilterBy({ ...filterBy, pageIdx: number })
            setCurrentPage(number)
        }}>
            {number}
        </button>
    ))
    
    return (
        <div>
            {renderPageNumbers}
        </div>
    )
}