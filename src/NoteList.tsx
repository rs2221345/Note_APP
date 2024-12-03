import { useMemo, useState } from 'react'
import { Button, Col, Form, Modal, Row, Stack } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import ReactSelect from 'react-select'
import { Tag } from './App'
import NoteCard from './NoteCard'

type NoteListProps = {
    availableTags:Tag[]
    notes:SimplifiedNote[]
    deleteTag: (id:string) => void
    updateTag: (id:string,label:string) => void
}


export type SimplifiedNote = {
    tags:Tag[]
    title:string
    id:string
    
}

type EditTagsModalProps = {
    availableTags:Tag[],
    show:boolean,
    handleClose : () => void
    deleteTag: (id:string) => void
    updateTag: (id:string,label:string) => void
}

const NoteList = ({availableTags,notes,deleteTag,updateTag}:NoteListProps) => {
    const [selectedTags, setSelectedTags] = useState<Tag[]>([])
    const [title, setTitle] = useState<string>("")
    const [isEditTagModalOpen,setIsEditTagModalOpen] = useState<boolean>(false)

    const filteredNotes = useMemo(() => {
        return notes.filter(note => {
          return (
            (title === "" ||
              note.title.toLowerCase().includes(title.toLowerCase())) &&
            (selectedTags.length === 0 ||
              selectedTags.every(tag =>
                note.tags.some(noteTag => noteTag.id === tag.id)
              ))
          )
        })
      }, [title, selectedTags, notes])
    
  return (
    <>
        <Row className='align-items-center mb-4'>
            <Col>
                <h1>Notes</h1>
            </Col>
            <Col xs='auto'>
                <Stack gap={2} direction='horizontal'>
                    <Link to={"/new"}>
                        <Button variant='primary'>Create</Button>
                    </Link>
                    <Button onClick={() => setIsEditTagModalOpen(true)} variant='outline-secondary'>Edits Tags</Button>
                </Stack>
            </Col>
        </Row>
        <Form>
            <Row className='mb-4'>
                <Col>
                    <Form.Group controlId='title' >
                        <Form.Label>Title</Form.Label>
                        <Form.Control value={title} onChange={e => setTitle(e.target.value)} type='text'/>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId='tags' >
                        <Form.Label>Tags</Form.Label>
                        <ReactSelect 
                            isMulti
                            
                            options={availableTags.map(tag => {
                                return {label:tag.label,value:tag.id}
                            })}
                            value={selectedTags.map(tag => {
                                return {label:tag.label,value:tag.id}
                            })} //CreatableReactSelect expects us label and value in return
                            onChange={tags => {
                                setSelectedTags(tags.map(tag => {
                                    return {label:tag.label, id:tag.value}
                                }))
                            }}
                        />
                    </Form.Group>
                </Col>
            </Row>
        </Form>
        <Row xs={1} sm={2} lg={3} xl={4} className='g-3'>
            {
                filteredNotes.length > 0 ? 
                    (filteredNotes.map(note => (
                        <Col key={note.id}>
                            <NoteCard
                                id={note.id}
                                title={note.title}
                                tags={note.tags}
                            />
                        </Col>
                    ))) : (
                        <Col>
                            <h3>No Notes yet</h3>
                            <Link to={"/new"}>
                                <Button  className='mt-1' variant='outline-primary' >Add One</Button>
                            </Link>
                        </Col>
                    )
            }
        </Row>
        <EditTagsModal 
            handleClose={() => setIsEditTagModalOpen(false)} 
            show={isEditTagModalOpen} 
            availableTags={availableTags}
            deleteTag={deleteTag}
            updateTag={updateTag}
        />
    </>
  )
}

export default NoteList


function EditTagsModal({availableTags,handleClose,show,deleteTag,updateTag}:EditTagsModalProps){
    return <Modal  show={show} onHide={handleClose} >
        <Modal.Header>
            <Modal.Title>Edit Tags</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Stack gap={2}>
                {availableTags.map(tag => (
                    <Row key={tag.id}>
                        <Col>
                        <Form.Control
                            type="text"
                            value={tag.label}
                            onChange={e => updateTag(tag.id, e.target.value)}
                        />
                        </Col>
                        <Col xs="auto">
                        <Button
                            onClick={() => deleteTag(tag.id)}
                            variant="outline-danger"
                        >
                            &times;
                        </Button>
                        </Col>
                    </Row>
                    ))}
                </Stack>
            </Form>
        </Modal.Body>
    </Modal>
}