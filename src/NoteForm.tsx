import React, { FormEvent, useRef, useState } from 'react'
import { Button, Col, Form, Row, Stack } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import CreatableReactSelect from 'react-select/creatable'
import { NoteData, Tag } from './App'
import {v4 as uuidV4} from 'uuid'



type NoteFormProps = {
    onSubmit : (data:NoteData) => void
    onAddTag:(tag:Tag) => void
    availableTags:Tag[]
} & Partial<NoteData>
 
const NoteForm = ({onSubmit,onAddTag,availableTags,title,markdown,tags=[]} : NoteFormProps) => {
    const navigate = useNavigate()
    const titleRef = useRef<HTMLInputElement>(null)
    const markdownRef = useRef<HTMLTextAreaElement>(null)
    const [selectedTags, setSelectedTags] = useState<Tag[]>(tags) // array of the type Tag (in App.tsx)


    const handleSubmit = (e:FormEvent) => {
        e.preventDefault();
        
        const data:NoteData = {
            title:titleRef.current!.value,  
            // by ending the ! at the end of current means that we are saying this value not gonna be null
            markdown:markdownRef.current!.value,
            tags:selectedTags
        }
        onSubmit(data)
        navigate("..")
        
    }
  return (
    <Form onSubmit={handleSubmit}>
        <Stack gap={4}>
            <Row>
                <Col>
                    <Form.Group controlId='title'>
                        <Form.Label>Title</Form.Label>
                        <Form.Control ref={titleRef} defaultValue={title} required/>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId='tags'>
                        <Form.Label>Tags</Form.Label>
                        <CreatableReactSelect 
                            isMulti
                            // defaultValue={}
                            //The onCreateOption event handler is specific to Creatable select components. It is used when the user enters a value that is not present in the list of existing options and attempts to create a new option on the fly.
                            onCreateOption={label => {
                                const newTag = {id:uuidV4(),label}
                                onAddTag(newTag)
                                setSelectedTags(prev => [...prev,newTag])
                            }}
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
            <Form.Group controlId='markdown'>
                <Form.Label>Body</Form.Label>
                <Form.Control defaultValue={markdown} ref={markdownRef} required as="textarea" rows={15} />
            </Form.Group>
            <Stack direction='horizontal' gap={2} className=' justify-content-end'>
                <Button type='submit' variant='primary'>Save</Button>
                <Link to={".."}>
                    <Button type='button' variant='outline-secondary'>Cancel</Button>
                </Link>
            </Stack>
        </Stack>
    </Form>
  )
}

export default NoteForm