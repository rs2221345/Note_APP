import 'bootstrap/dist/css/bootstrap.min.css'
import { Container } from 'react-bootstrap'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import NewNote from './NewNote'
import { useLocalStorage } from './useLocalStorage'
import { useMemo } from 'react'
import {v4 as uuidV4} from 'uuid'
import NoteList from './NoteList'
import NoteLayout from './NoteLayout'
import Note from './Note'
import EditNote from './EditNote'


// type for our single note with an id
export type Note = {
  id:string
} & NoteData

export type RawNote ={
  id:string,
} & RawNoteData

export type RawNoteData ={
  title:string,
  markdown:string,
  tagIds:string[] // ids of all the tag related that post
}

//export type for our note data
export type NoteData = {
  title:string,
  markdown:string,
  tags:Tag[] // tag with id and label
}


// export type for our single tag
export type Tag = {
  id:string,
  label:string
}


function App() {
  const navigate = useNavigate()

  const [notes,setNotes] = useLocalStorage<RawNote[]>("NOTES",[])
  const [tags,setTags] = useLocalStorage<Tag[]>("TAGS",[])

  const notesWithTags = useMemo(() => {
    return notes.map((note) => {
      return {...note, tags:tags.filter(tag => note.tagIds.includes(tag.id))}
    })
  },[notes,tags])

  function onCreateNote({tags,...data}:NoteData){
    setNotes(prevNotes => {
      return [
        ...prevNotes,
        {
          ...data,
          id:uuidV4(), 
          tagIds: tags.map(tag => tag.id)
        }
      ]
    })
  }
  function onUpdateNote(id:string,{tags,...data}:NoteData){
    setNotes(prevNotes => {
      return prevNotes.map(note => {
        if (note.id === id) {
          return {...note,...data,tagIds:tags.map(tag => tag.id)}
        } else {
          return note
        }
      }) 
    })
  }

  function deleteNote(id:string){
    setNotes(prevNotes => {
      return prevNotes.filter(note => note.id !== id)
    })
    navigate("/")
  }

  function addTag(tag:Tag){
    setTags(prev => [...prev,tag])
  }

  function updateTag(id:string,label:string){
    setTags(prevTags => {
      return prevTags.map(tag => {
        if(tag.id === id){
          return {...tag,label}
        } else {
          return tag
        }
      })
    })
  }

  function deleteTag(id:string){
    setTags(prevTags => {
      return prevTags.filter(tag => tag.id !== id)
    })
  }



  return (
    <Container className='my-4'>
      <Routes>
        <Route 
          path='/' 
          element={
            <NoteList
              updateTag={updateTag}
              deleteTag={deleteTag}
              notes={notesWithTags.reverse()}
              availableTags={tags}
            />
          }
        />
        <Route 
          path='/new' 
          element={
            <NewNote 
              onAddTag={addTag} 
              availableTags={tags}
              onSubmit={onCreateNote}
            />
          }
        />
        <Route 
          path='/:id' 
          element={
            <NoteLayout 
              notes={notesWithTags} 
            />
            }
          >
          <Route index element={<Note deleteNote={deleteNote} />} />
          <Route 
            path="edit" 
            element={
              <EditNote
                onSubmit={onUpdateNote}
                onAddTag={addTag} 
                availableTags={tags}
              />
            } 
          />
        </Route>
        <Route 
          path='*' 
          element={
            <Navigate to={"/"}/>
            }
          />
      </Routes>
    </Container>
  )
}

export default App
