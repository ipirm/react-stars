import React, {Component} from 'react';

import Header from '../header';
import RandomPlanet from '../random-planet';

import './app.css';
import ErrorIndicator from "../error-indicator";
import PeoplePage from "../people-page";
import Row from "./row";
import PersonDetails from "../person-details";
import SwapiService from "../../services/swapi-service";
import {Record} from "../person-details/person-details";

export default class App extends Component {

    swapiService = new SwapiService();

    constructor() {
        super();
        this.state = {
            hasError: false
        }
    }

    componentDidCatch() {
        this.setState({
            hasError: true
        })
    }

    render() {

        if (this.state.hasError) {
            return <ErrorIndicator/>
        }

        const {getPerson, getStarship, getPersonImage, getStarsShipImage} = this.swapiService;

        const personDetails = (
            <PersonDetails
                itemId={11}
                getData={getPerson}
                getImageUrl={getPersonImage}
            >
                <Record field="gender" label="Gender"/>
                <Record field="eyeColor" label="Eye Color"/>
                <Record field="birthYear" label="Birth Year"/>
            </PersonDetails>
        )

        const starshipDetails = (
            <PersonDetails
                itemId={5}
                getData={getStarship}
                getImageUrl={getStarsShipImage}
            >
                <Record field="model" label="Model"/>
                <Record field="length" label="Length"/>
                <Record field="costInCredits" label="Cost In Credits"/>
            </PersonDetails>
        )

        return (
            <div className="container-fluid">
                <Header/>
                <RandomPlanet/>
                <Row left={personDetails} right={starshipDetails}/>
                <PeoplePage/>
            </div>
        );
    }
};
