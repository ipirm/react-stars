import React, {Component} from 'react'

import './person-details.css';
import Spinner from "../spinner";
import Person from "./person";

const Record = ({item, field, label}) => {
    return (
        <li className="list-group-item">
            <span className="term">{label}</span>
            <span>{item[field]}</span>
        </li>
    )
}
export {
    Record
}

export default class PersonDetails extends Component {

    constructor() {
        super();
        this.state = {
            item: {
                name: null
            },
            image: null,
            loading: true
        }
    }

    componentDidMount() {
        this.updateItem();
    }

    componentDidUpdate(prevProps) {
        if (this.props.itemId !== prevProps.itemId) {
            this.setState({
                loading: true
            });
            this.updateItem();
        }
    }

    updateItem() {

        const {itemId, getData, getImageUrl} = this.props;
        if (!itemId) {
            return;
        }

        getData(itemId)
            .then((item) => {
                this.setState({
                    item,
                    image: getImageUrl(item),
                    loading: false
                })
            })
    }

    render() {
        const {loading, item: {name}} = this.state;
        const renderItem = (
            <Person item={this.state.item} image={this.state.image} name={name}>{this.props.children}</Person>);
        const content = loading ? <Spinner/> : renderItem;
        return (
            <div className="person-details card">
                {content}
            </div>
        )
    }
}
