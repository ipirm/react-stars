import React from 'react';
import ItemList from '../item-list'
import {withData} from '../hoc-helpers'
import SwapiService from '../../services/swapi-service'


const swapiService = new SwapiService();

const {
    getAllPeople,
    getAllStarships,
    getAllPlanets
} = swapiService

const PersonList = withData(ItemList, getAllPeople);
const PlanetsList = withData(ItemList, getAllPlanets);
const Starshiplist = withData(ItemList, getAllStarships);

export {
    PersonList,
    PlanetsList,
    Starshiplist
}
