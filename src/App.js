import React, { useRef, useState } from 'react'
import { v4 as uuid } from 'uuid'
import './App.css'

// some values to start off with
const starters = ['walk the dog', 'clean the dishes', 'drink coffee']
const starterList = starters.map(t => ({ id: uuid(), value: t }))

function App() {
  // keep track of the list of items/questions
  const [list, setList] = useState(starterList)
  // handle controlled input
  const [inputValue, setInputValue ] = useState('')
  // handle dragging state
  const [dragging, setDragging] = useState(false)

  // refs - dragItem to reference the item value, dragNode to reference the DOM node
  const dragItem = useRef()
  const dragNode = useRef()

  // controls how the list of items/questions is updated
  function dragEnter(e, question) {
    setList(oldList => {
      // create new copy
      const newList = [ ...oldList ]

      // get indices
      const draggableIndex = newList.findIndex(el => el.id === dragItem.current.id)
      const hoveredIndex = newList.findIndex(el => el.id === question.id)
  
      // change positions
      newList[draggableIndex] = question
      newList[hoveredIndex] = dragItem.current

      return newList
    })
  }

  function dragStart(e, question) {
    // set refs and drag state
    dragItem.current = question
    dragNode.current = e.target
    setDragging(true)

    // handle when dragging is done
    dragNode.current.addEventListener('dragend', handleDragEnd)
  }

  // end drag state and remove refs
  function handleDragEnd() {
    setDragging(false)
    dragItem.current = null
    dragNode.current = null
  }

  // when user hits enter, capture value and clear it
  function handleEnter(e) {
    if (e.charCode === 13) {
      const data = { id: uuid(), value: e.target.value }
      setList([ ...list, data ])
      setInputValue('')
    }
  }

  // handle styles for draggable item
  function getStyles(item) {
    if (dragItem.current?.id === item.id) {
        return 'item dragging-item'
    }
    return 'item'
  }

  return (
    <div className="app">
      <input
        className="list-input"
        placeholder="Enter something..."
        onKeyPress={handleEnter}
        onChange={e => setInputValue(e.target.value)}
        value={inputValue}
      />
      <div onDragOver={(e)=> e.preventDefault()}>
        {list.map((question, i) => {
          return (
            <div
              className={dragging ? getStyles(question) : 'item'}
              draggable
              key={i}
              onDragEnter={dragging ? (e) => dragEnter(e, question) : null}
              onDragStart={e => dragStart(e, question)}
            >
              {question.value}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default App
