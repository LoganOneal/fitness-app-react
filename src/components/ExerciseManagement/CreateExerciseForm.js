import React, { Component } from 'react';
import { setDoc } from 'firebase/firestore';

import { withFirebase } from '../Firebase';

const INITIAL_STATE = {
    name: '',
    desc: '',
    bodypart: '',
    equipment: '',
    image: '',
    error: null,
  };

const ERROR_INFO_MISSING = 'Information is missing from the form.';

const ERROR_EXERCISE_EXISTS = `An exercise with this name has already been created.`;

class CreateExerciseFormBase extends Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };
    }

    onSubmit = event => {
        const { name, desc, bodypart, equipment, image } = this.state;

        setDoc(this.props.firebase.exercise(name), 
        {
            name, 
            desc, 
            bodypart, 
            equipment, 
            image
        }, 
        { merge: true })
        .then(() => {
            this.setState({ ...INITIAL_STATE });
        })
        .catch(error => {
            if (error.code === ERROR_INFO_MISSING) {
              error.message = ERROR_INFO_MISSING;
            }

            this.setState({ error });
        });

        event.preventDefault();
    };

    
    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        const { name, desc, bodypart, equipment, image, error} = this.state;

        const isInvalid = 
            name === '' ||
            desc === '' ||
            bodypart === '';

        return (
            <div>
                <h2>Add Exercise</h2>

                <form onSubmit={this.onSubmit}>
                    <input
                    name="name"
                    value={name}
                    onChange={this.onChange}
                    type="text"
                    placeholder="Exercise Name"
                    />
                    <input
                    name="desc"
                    value={desc}
                    onChange={this.onChange}
                    type="text"
                    placeholder="Description / Instructions"
                    />
                    <input
                    name="bodypart"
                    value={bodypart}
                    onChange={this.onChange}
                    type="text"
                    placeholder="Bodypart(s) seperated by comma"
                    />
                    <input
                    name="equipment"
                    value={equipment}
                    onChange={this.onChange}
                    type="text"
                    placeholder="Equipment Seperated by comma"
                    />
                    <input
                    name="image"
                    value={image}
                    onChange={this.onChange}
                    type="text"
                    placeholder="Image Link"
                    />
                
                    <button disabled={isInvalid} type="submit">
                      Add Exercise
                    </button>

                    {error && <p>{error.message}</p>}
                </form>
            </div>
        );
    }
}

const CreateExerciseForm = withFirebase(CreateExerciseFormBase)

export { CreateExerciseForm };