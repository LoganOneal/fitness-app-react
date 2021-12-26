import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';

const AddExercise = () => (
  <div>
    <h1>Add Exercise</h1>
    <AddExerciseForm />
  </div>
);


const INITIAL_STATE = {
  name: '',
  sets: 0, 
  reps: 0,
  bodypart: '',
  isAdmin: false,
  error: null,
};

const ERROR_CODE_ACCOUNT_EXISTS = 'auth/email-already-in-use';

const ERROR_MSG_ACCOUNT_EXISTS = `
  An account with this E-Mail address already exists.
  Try to login with this account instead. If you think the
  account is already used from one of the social logins, try
  to sign in with one of them. Afterward, associate your accounts
  on your personal account page.
`;

class AddExerciseFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { name, sets, reps, bodypart, isAdmin } = this.state;
    const roles = {};

    if (isAdmin) {
      roles[ROLES.ADMIN] = ROLES.ADMIN;
    }

    // add exercise to database 


    return this.props.firebase.exercise(name).set(
        {
        name,
        sets,
        reps,
        },
        { merge: true },
    ).then(() => {
    this.setState({ ...INITIAL_STATE });
    this.props.history.push(ROUTES.HOME);
    })
    .catch(error => {

        if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
            error.message = ERROR_MSG_ACCOUNT_EXISTS;
        }

        this.setState({ error });
    });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onChangeCheckbox = event => {
    this.setState({ [event.target.name]: event.target.checked });
  };

  render() {
    const {
      name, 
      sets, 
      reps, 
      bodypart,
      isAdmin,
      error,
    } = this.state;

    const isInvalid =
      name === '' ||
      sets === '' ||
      reps === '';

    return (
      <form onSubmit={this.onSubmit}>
        <input
          name="name"
          value={name}
          onChange={this.onChange}
          type="text"
          placeholder="Exercise Name"
        />
        <input
          name="sets"
          value={sets}
          onChange={this.onChange}
          type="text"
          placeholder="Number of Sets"
        />
        <input
          name="reps"
          value={reps}
          onChange={this.onChange}
          type="text"
          placeholder="Number of Reps"
        />
        <input
          name="bodypart"
          value={bodypart}
          onChange={this.onChange}
          type="text"
          placeholder="Target Bodypart"
        />
        <button disabled={isInvalid} type="submit">
          Submit Exercise
        </button>

        {error && <p>{error.message}</p>}
      </form>
    );
  }
}


const AddExerciseForm = withRouter(withFirebase(AddExerciseFormBase));

export default AddExercise;
