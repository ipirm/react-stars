import React, {Fragment} from "react";

const Person = ({item,image, children}) => {
    const {name} = item;
    return (
        <Fragment>
            <img className="person-image"
                 src={image}/>
            <div className="card-body">
                <h4>{name}</h4>
                <ul className="list-group list-group-flush">
                    {React.Children.map(children, (child)=>{
                        return React.cloneElement(child,{item})
                    })}
                </ul>
            </div>
        </Fragment>
    )
}

export default Person
