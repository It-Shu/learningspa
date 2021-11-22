import React, {useEffect, useState} from 'react'
import s from './Pagination.module.css'

type PaginationProps = {
    totalCount: number,
    countPerPage: number,
    currentPage: number,
    onChangePage: (page: number) => void
    step?: number
}

export const Pagination = ({totalCount, countPerPage, currentPage, onChangePage, step = 10}: PaginationProps) => {
    const [prevIsHidden, setPrevIsHidden] = useState(false)
    const [nextIsHidden, setNextIsHidden] = useState(false)

    let pageNumbers: number = Math.ceil(totalCount / countPerPage)
    let pages = []
    for (let i = 1; i <= pageNumbers; i++) {
        pages.push(i)
    }

    const previousPage = currentPage !== 1 ? currentPage - 1 : 1
    const nextPage = currentPage !== pageNumbers ? currentPage + 1 : pageNumbers
    let pageNextStep = (currentPage + step) > pageNumbers ? pageNumbers : currentPage + step
    let pagePreviousStep = (currentPage - step) < 1 ? 1 : currentPage - step

    useEffect(() => {
        previousPage === currentPage ? setPrevIsHidden(true) : setPrevIsHidden(false)
        nextPage === currentPage ? setNextIsHidden(true) : setNextIsHidden(false)
    }, [currentPage, nextPage, previousPage])

    if (isNaN(pageNumbers) || totalCount === 0) {
        return <></>
    }

    return (
        <div className={s.container}>
            <span className={`${prevIsHidden && s.hidden}`}
                  onClick={() => onChangePage(currentPage - 1)}>Prev</span>

            <span className={`${prevIsHidden && s.hidden}`}
                  onClick={() => onChangePage(1)}>Start</span>

            <span className={`${prevIsHidden && s.hidden}`}
                  onClick={() => onChangePage(pagePreviousStep)}>...</span>

            <span className={`${prevIsHidden && s.hidden}`}
                  onClick={() => onChangePage(previousPage)}>{previousPage !== currentPage && previousPage}</span>

            <span className={s.active}>{currentPage}</span>

            <span className={`${nextIsHidden && s.hidden}`}
                  onClick={() => onChangePage(nextPage)}>{nextPage !== currentPage && nextPage}</span>

            <span className={`${nextIsHidden && s.hidden}`}
                  onClick={() => onChangePage(pageNextStep)}>...</span>

            <span className={`${nextIsHidden && s.hidden}`}
                  onClick={() => onChangePage(pageNumbers)}>End</span>

            <span className={`${nextIsHidden && s.hidden}`}
                  onClick={() => onChangePage(currentPage + 1)}>Next</span>
        </div>
    )
}