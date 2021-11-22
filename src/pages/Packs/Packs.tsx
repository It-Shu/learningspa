import React, {ChangeEvent, FC, useCallback, useEffect, useRef, useState} from 'react'
import {useDispatch} from 'react-redux'
import {
    createCardsPack,
    deleteCardsPack,
    fetchCardPacks,
    setMinMaxCardsCount,
    setPacksCountOnPage,
    setPacksCurrentPage,
    setPrivatePacks,
    updateCardsPack
} from '../../store/reducers/packs-reducer'
import {Pagination} from '../../components/UI/Pagination/Pagination'
import {Table} from '../../components/UI/Table/Table'
import {useTypedSelector} from '../../hooks/hooks'
import {Checkbox} from '../../components/UI/Checkbox/Checkbox'
import {Input} from '../../components/UI/Input/Input'
import _ from 'lodash'
import {packsModel} from './packsModel'
import {Range} from 'rc-slider'
import {Redirect, useHistory, useLocation} from 'react-router-dom'
import {PATH} from '../../routes/routes'
import {Select} from '../../components/UI/Select/Select'
import s from './Packs.module.css'
import * as queryString from 'querystring'

type PacksQueryParams = {
    page?: number
    pageCount?: number
    minCardsCount?: number
    maxCardsCount?: number
    privatePacks?: boolean
    searchValue?: string
}

export const Packs: FC = () => {
    const location = useLocation()
    const history = useHistory()

    const dispatch = useDispatch()
    const isLoggedIn = useTypedSelector(state => state.auth.isLoggedIn)
    const {
        page,
        pageCount,
        cardPacksTotalCount,
        minCardsCount,
        maxCardsCount,
        cardPacks,
        privatePacks
    } = useTypedSelector(state => state.packs)

    const [isPrivatePacks, setIsPrivatePacks] = useState(privatePacks)
    const [searchValue, setSearchValue] = useState('')
    const [rangeValues, setRangeValues] = useState([minCardsCount, maxCardsCount])

    const ref = useRef<HTMLDivElement>(null)

    const rangeMarks = {
        0: {style: {fontSize: 16}, label: rangeValues[0]},
        100: {style: {fontSize: 16}, label: rangeValues[1]}
    }

    const model = packsModel(
        () => {
            const name = prompt()
            dispatch(createCardsPack({cardsPack: {name: name!, private: false}}))
        },
        (id) => {
            dispatch(deleteCardsPack({id}))
        },
        (id) => {
            const name = prompt()
            dispatch(updateCardsPack({cardsPack: {_id: id, name: name!}}))
        },
    )

    const onPageChangeHandler = (page: number) => dispatch(setPacksCurrentPage({page}))

    const onSelectChangeHandler = (option: string) => dispatch(setPacksCountOnPage({count: Number(option)}))

    const onPrivateChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        dispatch(setPrivatePacks({value: e.currentTarget.checked}))
        setIsPrivatePacks(e.currentTarget.checked)
    }

    const onRangeChangeHandler = (values: number[]) => {
        setRangeValues(values)
        debouncedRange(values)
    }

    const debouncedRange = useCallback(_.debounce(values => dispatch(setMinMaxCardsCount({values: values})), 300), [])

    const onSearchChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.currentTarget.value)
        debouncedSearch(e.currentTarget.value)
    }

    const debouncedSearch = useCallback(_.debounce(value => dispatch(fetchCardPacks({packName: value})), 300), [])

    useEffect(() => {
        const parsedURLParams = queryString.parse(location.search)
        dispatch(fetchCardPacks())
    }, [page, pageCount, minCardsCount, maxCardsCount, privatePacks])

    useEffect(() => {
        const queryURL: PacksQueryParams = {
            page,
            pageCount,
            privatePacks,
            minCardsCount,
            maxCardsCount,
            searchValue
        }

        history.push({
            pathname: PATH.PACKS,
            search: queryString.stringify(queryURL)
        })
    }, [page, pageCount, privatePacks, minCardsCount, maxCardsCount, searchValue])

    useEffect(() => {
        ref.current?.scrollIntoView({behavior: 'smooth'})
    }, [page])

    if (!isLoggedIn) return <Redirect to={PATH.LOGIN}/>

    return (
        <div ref={ref}>
            <h1>Packs</h1>

            <label htmlFor='packs-search'>
                Search for packs name:
                <Input id={'packs-search'}
                       placeholder={'Enter pack name...'}
                       value={searchValue}
                       onChange={onSearchChangeHandler}/>
            </label>

            <Range value={rangeValues}
                   marks={rangeMarks}
                   onChange={onRangeChangeHandler}
                   style={{margin: '32px 8px 48px 8px', width: 'inherit'}}/>

            <Checkbox checked={isPrivatePacks}
                      onChange={onPrivateChangeHandler}>
                Show only private packs?
            </Checkbox>

            <Table model={model}
                   data={cardPacks}/>

            <div className={s.paginationContainer}>
                <Pagination totalCount={cardPacksTotalCount}
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