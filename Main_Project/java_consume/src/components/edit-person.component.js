import React, { Component } from 'react';
import { makeRequest } from '../request';

export default class EditPerson extends Component {
    constructor(props) {
        super(props);

        this.state = {
            firstName:'',
            lastName: ''
        }
    }

    componentDidMount() {
        makeRequest({
            url: "http://localhost:8080/people/"+this.props.match.params.id,
            method: "GET"
        }).then(x => {
            this.setState({
                firstName: x.firstName,
                lastName: x.lastName
            });
        }).catch(err => {
            console.error(err);
        });
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

        const updatedPerson = {
            firstName: this.state.firstName,
            lastName: this.state.lastName
        }

        makeRequest({
            url: "http://localhost:8080/people/"+this.props.match.params.id,
            body: JSON.stringify(updatedPerson),
            method: "PUT"
        }).then(res => {
            console.log(res);
            this.props.history.push('/');
        }).catch(err => {
            console.error(err);
        });
    }

    render() {
        return (
            <div>
                <h3 align="center">Update Person</h3>
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
                               value="Update Person"
                               className="btn btn-primary"
                               />
                    </div>
                </form>
            </div>
        )
    }
}