import {
    Card,
    cardsAPI,
    CardsResponse,
    DeleteCardData,
    GetCardsQueryParams,
    NewCardData,
    UpdateCardData
} from '../../api/cards-api'
import {AppDispatch, RootState, ThunkType} from '../store'
import {setAppIsLoading} from './app-reducer'
import {errorsHandler} from '../../utils/errors'

enum CARDS_ACTIONS_TYPES {
    SET_CARDS = 'CARDS/SET_CARDS',
    SET_CURRENT_CARDS_PACK_ID = 'CARDS/SET_CURRENT_CARDS_PACK_ID',
    SET_CARDS_CURRENT_PAGE = 'CARDS/SET_CARDS_CURRENT_PAGE',
    SET_CARDS_COUNT_ON_PAGE = 'CARDS/SET_CARDS_COUNT_ON_PAGE',
    SET_CARDS_TOTAL_COUNT = 'CARDS/SET_CARDS_TOTAL_COUNT',
    SET_MIN_MAX_GRADE = 'CARDS/SET_MIN_MAX_GRADE',
}

type CardsActions =
    | ReturnType<typeof setCards>
    | ReturnType<typeof setCurrentCardsPackID>
    | ReturnType<typeof setCardsCurrentPage>
    | ReturnType<typeof setCardsCountOnPage>
    | ReturnType<typeof setCardsTotalCount>
    | ReturnType<typeof setMinMaxGrade>

export type CardsInitialState = CardsResponse & {
    currentCardsPackID: string
}

const initialState: CardsInitialState = {
    cards: [],
    page: 1,
    pageCount: 5,
    cardsTotalCount: 0,
    packUserId: '',
    minGrade: 0,
    maxGrade: 6,
    currentCardsPackID: ''
}

export const cardsReducer = (state = initialState, action: CardsActions): CardsInitialState => {
    switch (action.type) {
        case CARDS_ACTIONS_TYPES.SET_CARDS:
            return {...state, cards: action.payload}
        case CARDS_ACTIONS_TYPES.SET_CURRENT_CARDS_PACK_ID:
            return {...state, currentCardsPackID: action.payload.id}
        case CARDS_ACTIONS_TYPES.SET_CARDS_CURRENT_PAGE:
            return {...state, page: action.payload.page}
        case CARDS_ACTIONS_TYPES.SET_CARDS_COUNT_ON_PAGE:
            return {...state, pageCount: action.payload.count}
        case CARDS_ACTIONS_TYPES.SET_CARDS_TOTAL_COUNT:
            return {...state, cardsTotalCount: action.payload.count}
        case CARDS_ACTIONS_TYPES.SET_MIN_MAX_GRADE:
            return {...state, minGrade: action.payload.values[0], maxGrade: action.payload.values[1]}
        default:
            return state
    }
}

const setCards = (payload: Card[]) => ({
    type: CARDS_ACTIONS_TYPES.SET_CARDS,
    payload
} as const)

export const setCardsCurrentPage = (payload: { page: number }) => ({
    type: CARDS_ACTIONS_TYPES.SET_CARDS_CURRENT_PAGE,
    payload
} as const)

export const setCardsCountOnPage = (payload: { count: number }) => ({
    type: CARDS_ACTIONS_TYPES.SET_CARDS_COUNT_ON_PAGE,
    payload
} as const)

export const setCardsTotalCount = (payload: { count: number }) => ({
    type: CARDS_ACTIONS_TYPES.SET_CARDS_TOTAL_COUNT,
    payload
} as const)

export const setCurrentCardsPackID = (payload: { id: string }) => ({
    type: CARDS_ACTIONS_TYPES.SET_CURRENT_CARDS_PACK_ID,
    payload
} as const)

export const setMinMaxGrade = (payload: { values: number[] }) => ({
    type: CARDS_ACTIONS_TYPES.SET_MIN_MAX_GRADE,
    payload
} as const)

export const fetchCards = (payload?: GetCardsQueryParams) => async (dispatch: AppDispatch, getState: () => RootState) => {
    const {
        pageCount,
        page,
        minGrade,
        maxGrade,
        currentCardsPackID
    } = getState().cards

    try {
        dispatch(setAppIsLoading(true))
        const response = await cardsAPI.getCards({
            cardsPack_id: currentCardsPackID,
            page,
            pageCount,
            min: minGrade,
            max: maxGrade,
            cardQuestion: payload?.cardQuestion || undefined,
            cardAnswer: payload?.cardAnswer || undefined,
        })

        dispatch(setCards(response.data.cards))
        dispatch(setCardsCurrentPage({page: response.data.page}))
        dispatch(setCardsCountOnPage({count: response.data.pageCount}))
        dispatch(setCardsTotalCount({count: response.data.cardsTotalCount}))
    } catch (e) {
        errorsHandler(e, dispatch)
    } finally {
        dispatch(setAppIsLoading(false))
    }
}

export const createCard = (payload?: NewCardData): ThunkType => async dispatch => {
    try {
        dispatch(setAppIsLoading(true))
        await cardsAPI.createCard(payload)
        await dispatch(fetchCards())
    } catch (e) {
        errorsHandler(e, dispatch)
    } finally {
        dispatch(setAppIsLoading(false))
    }
}

export const deleteCard = (payload: DeleteCardData): ThunkType => async dispatch => {
    try {
        dispatch(setAppIsLoading(true))
        await cardsAPI.deleteCard(payload)
        await dispatch(fetchCards())
    } catch (e) {
        errorsHandler(e, dispatch)
    } finally {
        dispatch(setAppIsLoading(false))
    }
}

export const updateCard = (payload: UpdateCardData): ThunkType => async dispatch => {
    try {
        dispatch(setAppIsLoading(true))
        await cardsAPI.updateCard(payload)
        await dispatch(fetchCards())
    } catch (e) {
        errorsHandler(e, dispatch)
    } finally {
        dispatch(setAppIsLoading(false))
    }
}