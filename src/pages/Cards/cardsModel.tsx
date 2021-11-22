import {Button} from '../../components/UI/Button/Button'
import {TableModel} from '../../components/UI/Table/Table'
import {Card} from '../../api/cards-api'

export const cardsModel = (add: () => void, remove: (id: string) => void, update: (id: string) => void): TableModel[] => [
    {
        header: index => <th key={'question-title-' + index}>Question</th>,
        body: (item: Card) => <td key={'question-cell-' + item._id}>{item.question}</td>
    },
    {
        header: index => <th key={'answer-title-' + index}>Answer</th>,
        body: (item: Card) => <td key={'answer-cell-' + item._id}>{item.answer}</td>
    },
    {
        header: index => <th key={'grade-title-' + index}>Grade</th>,
        body: (item: Card) => <td key={'grade-cell-' + item._id}>{item.grade}</td>
    },
    {
        header: index => <th key={'update-title-' + index}>Updated</th>,
        body: (item: Card) => <td key={'update-cell-' + item._id}>{item.updated.slice(5, 16)}</td>
    },
    {
        header: index => <th key={'buttons-title-' + index}><Button onClick={add}>Add</Button></th>,
        body: (item: Card) => <td key={'buttons-cell-' + item._id} className={'tablesButtonsCell'}>
            <Button onClick={() => remove(item._id)}>Delete</Button>
            <Button onClick={() => update(item._id)}>Update</Button>
        </td>
    }
]