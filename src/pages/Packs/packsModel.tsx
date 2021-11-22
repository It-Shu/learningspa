import {Button} from '../../components/UI/Button/Button'
import {PATH} from '../../routes/routes'
import {Link} from 'react-router-dom'
import {TableModel} from '../../components/UI/Table/Table'
import {CardsPack} from '../../api/packs-api'

export const packsModel = (add: () => void, remove: (id: string) => void, update: (id: string) => void): TableModel[] => [
    {
        header: index => <th key={'name-title-' + index}>Pack Name</th>,
        body: (item: CardsPack) => <td key={'name-cell-' + item._id}><Link to={PATH.CARDS + '/' + item._id}>{item.name}</Link></td>
    },
    {
        header: index => <th key={'userName-title-' + index}>User Name</th>,
        body: (item: CardsPack) => <td key={'name-cell-' + item.user_name}>{item.user_name}</td>
    },
    {
        header: index => <th key={'cardsCount-title-' + index}>Cards count</th>,
        body: (item: CardsPack) => <td key={'cardsCount-cell-' + item._id}>{item.cardsCount}</td>
    },
    {
        header: index => <th key={'updated-title-' + index}>Updated</th>,
        body: (item: CardsPack) => <td key={'updated-cell-' + item._id}>{item.updated.slice(5, 16)}</td>
    },
    {
        header: index => <th key={'buttons-title-' + index}><Button onClick={add}>Add</Button></th>,
        body: (item: CardsPack) => <td key={'buttons-cell-' + item._id} className={'tablesButtonsCell'}>
            <Button onClick={() => remove(item._id)}>Delete</Button>
            <Button onClick={() => update(item._id)}>Update</Button>
        </td>
    },

]