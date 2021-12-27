import { initializeApp } from "firebase/app";
import { getAuth, linkWithCredential, EmailAuthProvider, 
  GoogleAuthProvider, FacebookAuthProvider, TwitterAuthProvider, fetchSignInMethodsForEmail, 
  signInWithEmailAndPassword, signInWithPopup, createUserWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification 
} from "firebase/auth";
import { getFirestore, 
  collection, doc, getDoc
} from 'firebase/firestore';

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};

class Firebase {
  constructor() {
    const app = initializeApp(config);

    /* Helper */
    //this.fieldValue = app.firestore.FieldValue;
    this.emailAuthProvider = EmailAuthProvider;

    /* Firebase APIs */
    this.auth = getAuth(app);
    this.db = getFirestore(app);

    /* Social Sign In Method Provider */
    this.googleProvider = new GoogleAuthProvider();
    this.facebookProvider = new FacebookAuthProvider();
    this.twitterProvider = new TwitterAuthProvider();
  }

  // *** Auth API ***
  doCreateUserWithEmailAndPassword = (email, password) =>
    createUserWithEmailAndPassword(this.auth, email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    signInWithEmailAndPassword(this.auth, email, password);

  doSignInWithGoogle = () =>
    signInWithPopup(this.auth, this.googleProvider);

  doSignInWithFacebook = () =>
  signInWithPopup(this.auth, this.facebookProvider);

  doSignInWithTwitter = () =>
    signInWithPopup(this.auth, this.twitterProvider);

  doSignOut = () => this.auth.signOut();

  doPasswordReset = email => sendPasswordResetEmail(this.auth. email);

  doSendEmailVerification = () =>
    sendEmailVerification(this.auth.currentUser);

  doPasswordUpdate = password =>
    this.auth.currentUser.updatePassword(password);

  dofetchSignInMethodsForEmail = email => fetchSignInMethodsForEmail(this.auth, email);


  // *** Merge Auth and DB User API *** //
  onAuthUserListener = (next, fallback) =>
    this.auth.onAuthStateChanged(authUser => {
      if (authUser) {
        getDoc(this.user(authUser.uid))
          .then(snapshot => {
            const dbUser = snapshot.data();

            
            // default empty roles
            if (!dbUser.roles) {
              dbUser.roles = {};
            }

            // merge auth and db user
            authUser = {
              uid: authUser.uid,
              email: authUser.email,
              emailVerified: authUser.emailVerified,
              providerData: authUser.providerData,
              ...dbUser,
            };

            next(authUser);
          });
      } else {
        fallback();
      }
    });

  // *** User API ***
  user = uid => doc(this.db, "users", uid);
  users = () => collection(this.db, 'users');

  // *** Message API ***
  message = uid => doc(this.db, "messages", uid);
  messages = () => collection(this.db, 'messages');

  // *** Workout API ***
  exercise = name => doc(this.db, "exercises", name);
  exercises = () => collection(this.db, 'exercises');
}

export default Firebase;
