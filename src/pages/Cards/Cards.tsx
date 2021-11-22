import React, {ChangeEvent, FC, useCallback, useEffect, useRef, useState} from 'react'
import {cardsModel} from './cardsModel'
import {useDispatch} from 'react-redux'
import {
    createCard,
    deleteCard,
    fetchCards,
    setCardsCountOnPage,
    setCardsCurrentPage,
    setCurrentCardsPackID,
    setMinMaxGrade,
    updateCard
} from '../../store/reducers/cards-reducer'
import {useHistory, useParams} from 'react-router-dom'
import {Table} from '../../components/UI/Table/Table'
import {useTypedSelector} from '../../hooks/hooks'
import _ from 'lodash'
import {Input} from '../../components/UI/Input/Input'
import {Pagination} from '../../components/UI/Pagination/Pagination'
import {Range} from 'rc-slider'
import {Select} from '../../components/UI/Select/Select'
import s from './Cards.module.css'
import {PATH} from '../../routes/routes'
import queryString from 'querystring'

type CardsQueryParams = {
    page?: number
    pageCount?: number
    minGrade?: number
    maxGrade?: number
    searchQuestionValue?: string
    searchAnswerValue?: string
}

export const Cards: FC = () => {
    const history = useHistory()
    const dispatch = useDispatch()
    const {id} = useParams<{ id: string }>()
    const {
        cards,
        page,
        pageCount,
        cardsTotalCount,
        minGrade,
        maxGrade,
    } = useTypedSelector(state => state.cards)
    const cardPacks = useTypedSelector(state => state.packs.cardPacks)
    const [searchQuestionValue, setSearchQuestionValue] = useState('')
    const [searchAnswerValue, setSearchAnswerValue] = useState('')
    const [rangeValues, setRangeValues] = useState([minGrade, maxGrade])

    const ref = useRef<HTMLDivElement>(null)

    const currentCardsPack = cardPacks.find(p => p._id === id)

    const model = cardsModel(
        () => {
            const question = prompt()
            dispatch(createCard({card: {cardsPack_id: id, question: question!}}))
        },
        id => {
            dispatch(deleteCard({id: id}))
        },
        id => {
            const question = prompt()
            dispatch(updateCard({card: {_id: id, question: question!}}))
        }
    )

    const rangeMarks = {
        0: {style: {fontSize: 16}, label: rangeValues[0]},
        6: {style: {fontSize: 16}, label: rangeValues[1]}
    }

    const onPageChangeHandler = (page: number) => dispatch(setCardsCurrentPage({page}))
    const onSelectChangeHandler = (option: string) => dispatch(setCardsCountOnPage({count: Number(option)}))

    const onQuestionSearchChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchQuestionValue(e.currentTarget.value)
        debouncedQuestionSearch(e.currentTarget.value)
    }

    const onAnswerSearchChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchAnswerValue(e.currentTarget.value)
        debouncedAnswerSearch(e.currentTarget.value)
    }

    const debouncedQuestionSearch = useCallback(_.debounce(value => dispatch(fetchCards({cardQuestion: value})), 500), [])
    const debouncedAnswerSearch = useCallback(_.debounce(value => dispatch(fetchCards({cardAnswer: value})), 500), [])

    const onRangeChangeHandler = (values: number[]) => {
        setRangeValues(values)
        debouncedRange(values)
    }

    const debouncedRange = useCallback(_.debounce(values => dispatch(setMinMaxGrade({values: values})), 500), [])

    useEffect(() => {
        dispatch(setCurrentCardsPackID({id}))
    }, [id])

    useEffect(() => {
        id && dispatch(fetchCards())
    }, [page, pageCount, minGrade, maxGrade])

    useEffect(() => {
        ref.current?.scrollIntoView({behavior: 'smooth'})
    }, [page])

    /*useEffect(() => {
        const queryURL: CardsQueryParams = {
            page,
            pageCount,
            minGrade,
            maxGrade,
            searchQuestionValue,
            searchAnswerValue
        }

        history.push({
            pathname: PATH.CARDS,
            search: queryString.stringify(queryURL)
        })
    }, [page, pageCount, minGrade, maxGrade, searchQuestionValue, searchAnswerValue])*/

    return (
        <div ref={ref}>
            <h1>Cards</h1>
            {currentCardsPack && <div style={{margin: '40px 0'}}>
				<p>Pack owner: {currentCardsPack.user_name}</p>
				<p>Pack name: {currentCardsPack.name}</p>
			</div>}

            <label htmlFor='cards-question-search'>
                Question Search
                <Input id={'cards-question-search'}
                       placeholder={'Enter question...'}
                       value={searchQuestionValue}
                       onChange={onQuestionSearchChangeHandler}/>
            </label>

            <label htmlFor='cards-answer-search'>
                Answer Search
                <Input id={'cards-answer-search'}
                       placeholder={'Enter answer...'}
                       value={searchAnswerValue}
                       onChange={onAnswerSearchChangeHandler}/>
            </label>

            <Range value={rangeValues}
                   marks={rangeMarks}
                   max={6}
                   onChange={onRangeChangeHandler}
                   style={{margin: '32px 8px 48px 8px', width: 'inherit'}}/>

            <Table model={model} data={cards}/>

            <div className={s.paginationContainer}>
                <Pagination totalCount={cardsTotalCount}
                            countPerPage={pageCount}
                            currentPage={page}
                            onChangePage={onPageChangeHandler}/>

                <div>
                    <span style={{paddingRight: 16}}> Show on page:</span>
                    <Select options={[5, 20, 50]} onChangeOption={onSelectChangeHandler}/>
                </div>
            </div>
        </div>
    )
}