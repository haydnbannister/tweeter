import React, { Component } from 'react';
import logo from './Tweeter-Logo.png';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Amplify, {API, graphqlOperation, Auth } from 'aws-amplify';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import aws_exports from './aws-exports'; // specify the location of aws-exports.js file on your project
Amplify.configure(aws_exports);

const createNote = `mutation createNote($note: String! $owner: String){
  createNote(input:{
    note: $note
    owner: $owner
  }){
    __typename
    id
    note
    owner
  }
}`;

const readNote = `query listNotes{
  listNotes{
    items{
      __typename
      id
      note
      owner
    }
  }
}`;

const updateNote = `mutation updateNote($id: ID!,$note: String){
  updateNote(input:{
    id: $id
    note: $note
  }){
    __typename
    id
    note
    owner
  }
}`;

const deleteNote = `mutation deleteNote($id: ID!){
  deleteNote(input:{
    id: $id
  }){
    __typename
    id
    note
    owner
  }
}`;

class App extends Component {
  constructor(props){
    super(props);
    this.state={
      id:"",
      user:"",
      notes:[],
      value:"",
      displayOnlyMine:false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
  }

  async componentDidMount(){
    let userAttributes = await Auth.currentAuthenticatedUser();
    const notes = await API.graphql(graphqlOperation(readNote));
    this.setState({notes:notes.data.listNotes.items, user:userAttributes.username});
  }

  handleFilter(){
    this.setState({displayOnlyMine:!this.state.displayOnlyMine});
  }
  handleChange(event) {
    this.setState({value:event.target.value});
  }
  async handleSubmit(event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.state.value !== "") {
      const note = {"note":this.state.value}
      await API.graphql(graphqlOperation(createNote, note, ""));
      this.listNotes();
      this.setState({value:""});
    }
  }
  async handleDelete(id) {
    const noteId = {"id":id};
    await API.graphql(graphqlOperation(deleteNote, noteId));
    this.listNotes();
  }
  async listNotes(){
    const notes = await API.graphql(graphqlOperation(readNote));
    this.setState({notes:notes.data.listNotes.items});
  }
  
  render() {
    const data = [].concat(this.state.notes)
      .filter(note => ((this.state.displayOnlyMine) ? note.owner===this.state.user : note.owner!=this.state.user))
      .map((item,i)=>
      <div className="alert alert-primary alert-dismissible show" style={{ padding: "16px" }} role="alert">
      {this.state.displayOnlyMine ?
        <button key={item.i} type="button" className="btn btn-danger hang-right" onClick={this.handleDelete.bind(this, item.id)}>
          Delete Tweet
        </button>
        : null }
        <span class="lead"><span class="badge text-dark"><strong>{item.owner}</strong></span>
          <br/>
          {item.note}
        </span>
      </div>
      )
    return (
      <div className="App">
        <header className="jumbotron jumbotron-fluid">
          <div class="App-logout">
            <AmplifySignOut />
          </div>
          <img src={logo} alt="logo" style={{ width: "70%" }}/>
        </header>

        <h5>Hi {this.state.user}!</h5>
        <button type="button" className="btn btn-primary" onClick={this.handleFilter.bind(this)}>
          {this.state.displayOnlyMine ? 'Other\'s' : 'My'} Tweets
        </button>
        <br/><br/>
        <div className="container">
          {this.state.displayOnlyMine ?
            <form onSubmit={this.handleSubmit}>
              <div className="input-group mb-3">
                <input type="text" className="form-control form-control-lg" onInput={(e)=>{e.target.value = e.target.value.slice(0,160)}} placeholder="New Tweet..." value={this.state.value} onChange={this.handleChange}/>
                <div className="input-group-append">
                  <button className="btn btn-primary App-button" type="submit">Add Tweet</button>
                </div>
              </div>
            </form>
          : null }
        </div>
        <br/>
        <div className="container">
          {data}
        </div>
      </div>
    );
  }
}
export default withAuthenticator(App, { includeGreetings: true });