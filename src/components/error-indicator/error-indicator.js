import React from 'react'

import './error-indicator.css'
import icon
    from './img/IMGBIN_club-penguin-island-anakin-skywalker-death-star-star-wars-png_SzEfYiYq.png'

const ErrorIndicator = () => {
    return (
        <div className="error-indicator">
            <img className="error-icon" src={icon} alt="error-icon"/>
            <span className="boom">BOOM !</span>
            <span>
         Something has gone terrible wrong
     </span>
            <span>
         ( but we already send droids to fix it )
     </span>
        </div>
    )
}

export default ErrorIndicator
