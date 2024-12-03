import { Note } from './App'
import { Navigate, Outlet, useOutletContext, useParams } from 'react-router-dom'

type Props = {
    notes:Note[]
}

const NoteLayout = ({notes}: Props) => {
    const {id} = useParams()
    const note = notes.find(note => note.id.toString() === id?.toString())
    // console.log(note);
    
    if(note == null) return <Navigate to={"/"} replace />
  return (
    <Outlet context={note} />
  )
}

export function useNote() {
  return useOutletContext<Note>()
}

export default NoteLayout