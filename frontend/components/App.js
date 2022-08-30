import React from 'react'
import axios from 'axios'

const URL = 'http://localhost:9000/api/todos'

export default class App extends React.Component {
  state = {
    todos: [],
    error: '',
    todoNameInput: '',
  }

  onInputChange = e => {
    const { value } = e.target
    this.setState({
      ...this.state, 
      todoNameInput: value
    })
  }

  setAxiosResponseError = err => this.setState({
    ...this.state, 
    error: err.response.data.message
  })

  resetForm = () => 
    this.setState({
      ...this.state,
      todoNameInput: ''
    })
  

  postNewTodo = () => {
    axios.post(URL, {name: this.state.todoNameInput})
    .then (res => {
      this.setState({
        ...this.state,
        todos: this.state.todos.concat(res.data.data)
      })
      this.resetForm()
      })
    .catch (this.setAxiosResponseError)
  }

  onInputSubmit = e => {
    e.preventDefault();
    this.postNewTodo();    
  }

  fetchAllTodos = () => {
    axios.get(URL)
    .then(res => {
      this.setState({
        ...this.state, 
        todos: res.data.data })
    })
    .catch(err => {
      this.setState(this.setAxiosResponseError)
    })
  }

  componentDidMount(){
    this.fetchAllTodos()
  }

  toggleCompleted = id => () => {
    axios.patch(`${URL}/${id}`)
    .then(res => {
      this.setState({
        ...this.state,
        todos: this.state.todos.map(td =>{
          if (td.id !== id) return td
          return res.data.data
        })
      })
    })
    .catch(this.setAxiosResponseError)
  }

  handleClear = () => {
    this.setState({
      ...this.state, 
      todos: this.state.todos.filter(todo => { 
        return (todo.completed === false)
    })
  });
  }

  render() {
    return (
      <div>
        <div id="todos">
          <h2>Todos:</h2>
          {this.state.todos.map(td => {
            return <div onClick={this.toggleCompleted(td.id)} key={td.id}>{td.name} {td.completed ? '- Completed' : ''}</div>
          })}
          <form id="todoForm" onSubmit={this.onInputSubmit}> 
            <input
            type="text"
            onChange={this.onInputChange}
            value={this.state.todoNameInput}
            placeholder="Type something ToDo"
            />
            <input type="submit"></input>
          </form>
          <button onClick={this.handleClear}>Clear Completed</button>
        </div>
      </div>
    )
  }
}
