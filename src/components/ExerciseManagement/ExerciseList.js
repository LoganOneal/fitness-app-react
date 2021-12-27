import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { query, orderBy, limit, onSnapshot } from "firebase/firestore";  

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

class ExerciseList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      exercises: [],
    };
  }

  componentDidMount() {
    this.setState({ loading: true });

    
    const q = query(this.props.firebase.exercises());

    this.unsubscribe = onSnapshot(q, (querySnapshot) => {
        let exercises = [];

        querySnapshot.forEach(doc =>
          exercises.push({ ...doc.data(), uid: doc.id }),
        );

        this.setState({
            exercises,
            loading: false,
        });
    });

  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const { exercises, loading } = this.state;

    return (
      <div>
        <h2>Exercises</h2>
        {loading && <div>Loading ...</div>}
        <ul>
          {exercises.map(exercise => (
            <li key={exercise.uid}>
              <span>
                <strong> ID: </strong> {exercise.uid}
              </span>
              <span>
                <strong> Exercise: </strong> {exercise.name}
              </span>
              <span>
                <strong> Description: </strong> {exercise.desc}
              </span>
              <span>
                <strong> Bodypart: </strong> {exercise.bodypart}
              </span>
              <span>
                <strong> Equipment: </strong> {exercise.equipment}
              </span>
              <span>
                <strong> Image URL: </strong> {exercise.image}
              </span>
              <span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default withFirebase(ExerciseList);
