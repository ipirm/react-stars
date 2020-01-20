import React from 'react'
import ReactDOM from 'react-dom'
import * as serviceWorker from './serviceWorker'
import App from './components/app'


// const swapi = new SwapiService();
// swapi.getAllPeople().then((people) => {
//     people.forEach((p) => console.log(p.name))
// });
// swapi.getPerson(5).then((body) => {
//     console.log(body)
// })
// swapi.getStarShip(2).then((body) => {
//     console.log(body)
// })

ReactDOM.render(<App/>, document.getElementById('root'));
serviceWorker.unregister();
