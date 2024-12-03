import React from 'react'
import { useNote } from './NoteLayout'
import { Badge, Button, Col, Row, Stack } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
type Props = {
    deleteNote: (id:string) => void
}

const Note = ({deleteNote}: Props) => {
    const note = useNote()
  return (
    <>
        <Row className='align-items-start mb-4'>
            <Col className=''>
                <h1>{note.title}</h1>
                {note.tags.length > 0 && (
                    <Stack gap={1} direction='horizontal' className='flex-wrap'>
                        {note.tags.map(tag => (
                            <Badge className='text-truncate p-2' key={tag.id}>
                                {tag.label}
                            </Badge>
                        ))}
                    </Stack>    
                )}
            </Col>
            <Col xs='auto'>
                <Stack gap={2} direction='horizontal'>
                    <Link to={`/${note.id}/edit`}>
                        <Button variant='primary'>Edit</Button>
                    </Link>
                    <Button onClick={() => deleteNote(note.id)} variant='outline-danger'>Delete</Button>
                    <Link to={"/"}>
                        <Button variant='outline-secondary'>Back</Button>
                    </Link>
                </Stack>
            </Col>
        </Row>
        <ReactMarkdown>
            {note.markdown}
        </ReactMarkdown>
    </>
  )
}

export default Note