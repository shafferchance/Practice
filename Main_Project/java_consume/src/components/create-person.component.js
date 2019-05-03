import React, { Component } from 'react';
import { makeRequest } from '../request';

export default class CreatePerson extends Component {
    constructor(props) {
        super(props);

        this.state = {
            firstName: '',
            lastName: ''
        }
    }

    onChangeFirstName(e) {
        this.setState({
            firstName: e.target.value
        });
    }

    onChangeLastName(e) {
        this.setState({
            lastName: e.target.value
        });
    }

    onSubmit(e) {
        e.preventDefault();

        const newPerson = {
            firstName: this.state.firstName,
            lastName: this.state.lastName
        }

        makeRequest({
            url: "http://localhost:8080/people/",
            method: "POST",
            body: JSON.stringify(newPerson)
        }).then(x => console.log(x)).catch(err => console.error(err));

        this.setState({
            firstName: '',
            lastName: ''
        })
    }

    render() {
        return (
            <div style={{marginTop: 10 }}>
                <h3>Create New Person</h3>
                <form onSubmit={e => this.onSubmit(e)}>
                    <div className="form-group">
                        <label>First Name: </label>
                        <input type="text"
                               className="form-control"
                               value={this.state.firstName}
                               onChange={e => this.onChangeFirstName(e)}
                               />
                    </div>
                    <div className="form-group">
                        <label>Last Name: </label>
                        <input type="text"
                               className="form-control"
                               value={this.state.lastName}
                               onChange={e => this.onChangeLastName(e)}
                               />
                    </div>
                    <br />
                    <div className="form-group">
                        <input type="submit"
                               value="Create Person"
                               className="btn btn-primary"
                               />
                    </div>
                </form>
            </div>
        )
    }
}