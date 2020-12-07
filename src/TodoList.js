import React, { useState } from "react";
import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

const todoListState = atom({
  key: 'todoListState',
  defult: []
})

function TodoList() {
  const todoList = useRecoilValue(todoListState);

  return (
    <>
      {/* <TodoListStats /> */}
      {/* <TodoListFilters /> */}
      <TodoItemCreator />

      {todoList && todoList.map((todoItem) => (
        <TodoItem key={todoItem.id} item={todoItem} />
      ))}
    </>
  );
}

function TodoItemCreator() {
  const [inputValue, setInputValue] = useState('')
  const setTodoList = useSetRecoilState(todoListState)

  const addItem = () => {
    setTodoList((oldTodoList) => {
      if (!oldTodoList) {
        return [{
          id: getId(),
          text: inputValue,
          isComplete: false
        }]
      }
      return [
        ...oldTodoList,
        {
          id: getId(),
          text: inputValue,
          isComplete: false
        }
      ]
    })
    setInputValue('')
  }

  const onChange = ({ target: { value } }) => {
    setInputValue(value);
  }

  return (
    <div>
      <input type="text" value={inputValue} onChange={onChange} ></input>
      <button onClick={addItem} >Add</button>
    </div>
  )
}

let id = 0;
function getId() {
  return id++
}

function TodoItem({ item }) {
  const [todoList, setTodoList] = useRecoilState(todoListState)
  const index = todoList.findIndex((listItem) => listItem === item)

  const editItemText = ({ target: { value } }) => {
    const newList = replaceItemAtIndex(todoList, index, {
      ...item,
      text: value
    })

    setTodoList(newList)
  }

  const toggleItemCompletion = () => {
    const newList = replaceItemAtIndex(todoList, index, {
      ...item,
      isComplete: !item.isComplete
    })

    setTodoList(newList)
  }

  const deleteItem = () => {
    const newList = removeItemAtIndex(todoList, index);

    setTodoList(newList)
  }

  return (
    <div>
      <input type="text" value={item.text} onChange={editItemText} />
      <input type="checkbox" checked={item.isComplete} onChange={toggleItemCompletion} />
      <button onClick={deleteItem} >X</button>
    </div>
  )
}


function replaceItemAtIndex(arr, index, newValue) {
  return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)]
}

function removeItemAtIndex(arr, index) {
  return [...arr.slice(0, index), ...arr.slice(index + 1)]
}

export default TodoList;