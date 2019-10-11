import firebase from "firebase/app"

/*import {
    API_KEY,
    AUTH_DOMAIN,
    DATABASE_URL,
    PROJECT_ID,
    STORAGE_BUCKET,
    MESSAGING_SENDER_ID,
    APP_ID
}from "react-native-dotenv"*/

import "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyAiH95dfeksCh_ZuAPcT4ieebrz4I-TNlU",//API_KEY,
    authDomain: "test-project-67aff.firebaseapp.com",//AUTH_DOMAIN,
    databaseURL: "https://test-project-67aff.firebaseio.com",//DATABASE_URL,
    projectId: "test-project-67aff",//PROJECT_ID,
    storageBucket: "test-project-67aff.appspot.com",//STORAGE_BUCKET,
    messagingSenderId: "36159811627",//MESSAGING_SENDER_ID,
    appId: "1:36159811627:web:ef42d4303bbf168d"//APP_ID
  };

  firebase.initializeApp(firebaseConfig);
  //firebase.firestore().settings()//from net ninja

  // just before export default statement
  export const firestore = firebase.firestore()
  export default firebase