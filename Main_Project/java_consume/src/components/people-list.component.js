import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { makeRequest } from '../request';

// This was the first solution I though of, other than reconfiguring Spring.
// Although, this seemed easier and probably faster, not sure the though.
const idGrab = /\w{24}/g;

const Person = props => (
    <tr>
        <td className={props.person.todo_completed ? 'completed' : ''}>{props.person.firstName}</td>
        <td className={props.person.todo_completed ? 'completed' : ''}>{props.person.lastName}</td>
        <td>
            <Link to={"/edit/"+
                        props.person._links.self.href.match(idGrab)[0]} 
                  style={{marginLeft:5, marginRight: 5}}
            >Edit</Link>
            <Link
                to=""
                style={{marginLeft: 5, 
                        marginRight: 5, 
                        color: "Crimson"}}
                onClick={e => props.ele.personDelete(props.person._links.self.href.match(idGrab)[0])}
                >Delete</Link>
        </td>
    </tr>
);

export default class PeopleList extends Component {
    constructor(props) {
        super(props);
        this.state = {people: []};
    }
    // Chose my own little XHR promise script instead to prevent another import (Although, in production 
    // a library such as, Axios would probably do much better)    
    componentDidMount() {
        makeRequest({
            url: "http://localhost:8080/people",
            method: "GET",
        }).then(x => {
            console.log(x)
            this.setState({
                people: x._embedded.people
            });
        }).catch(err => {
            console.error(err);
        });
    }

    peopleList() {
        return this.state.people.map((currentPerson, i) => {
            return <Person person={currentPerson} key={i} ele={this}/>
        });
    }

    personDelete(id) {
        const url = "http://localhost:8080/people/"+id;
        makeRequest({
            url: url,
            method: "DELETE",
        }).then(() => {
            let newPeople = []
            this.state.people.forEach((x,i) => {
                if(x["_links"]["person"]["href"] !== url){
                    newPeople.unshift(x)
                }
            })
            this.setState({
                people: newPeople
            })
        }).catch(err => {
            console.error(err);
        });
    }

    render() {
        return (
            <div>
                <h3>People List</h3>
                <table className="table table-striped" style={{marginTop:20}}>
                    <thead>
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.peopleList()}
                    </tbody>
                </table>
            </div>
        );
    }
}