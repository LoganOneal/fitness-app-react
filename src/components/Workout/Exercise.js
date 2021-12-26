import React, { Component } from 'react';

import { withFirebase } from '../Firebase';

class Exercise extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      user: null,
      ...props.location.state,
    };
  }

  componentDidMount() {
    if (this.state.exercise) {
      return;
    }

    this.setState({ loading: true });

    this.unsubscribe = this.props.firebase
      .exercise(this.props.match.params.id)
      .onSnapshot(snapshot => {
        this.setState({
          exercise: snapshot.data(),
          loading: false,
        });
      });
  }

  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe();
  }

  // onSendPasswordResetEmail = () => {
  //   this.props.firebase.doPasswordReset(this.state.user.email);
  // };

  render() {
    const { exercise, loading } = this.state;

    return (
      <div>
        <h2>Exercise ({this.props.match.params.id})</h2>
        {loading && <div>Loading ...</div>}

        {exercise && (
          <div>
            <span>
              <strong>ID:</strong> {exercise.uid}
            </span>
            <span>
              <strong>E-Mail:</strong> {exercise.email}
            </span>
            <span>
              <strong>Username:</strong> {exercise.username}
            </span>
            <span>
              <button
                type="button"
                onClick={this.onSendPasswordResetEmail}
              >
                Send Password Reset
              </button>
            </span>
          </div>
        )}
      </div>
    );
  }
}

export default withFirebase(Exercise);
