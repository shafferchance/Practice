import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { makeRequest } from '../request';

const Person = props => (
    <tr>
        <td className={props.person.todo_completed ? 'completed' : ''}>{props.person.todo_description}</td>
        <td className={props.person.todo_completed ? 'completed' : ''}>{props.person.todo_responsible}</td>
        <td className={props.person.todo_completed ? 'completed' : ''}>{props.person.todo_priority}</td>
        <td>
            <Link to={"/edit/"+props.person.id}>Edit</Link>
        </td>
    </tr>
);

export default class PeopleList extends Component {
    constructor(props) {
        super(props);
        this.state = {people: []};
    }
    // Chose my own little XHR promise script instead to prevent another import (Although, in production something
    //  such as, Axios would probably do much better)
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
            return <Person person={currentPerson} key={i} />
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