import React from 'react';
import './GameOver.css';

const GameOver = (props) => {
	if (props.status) {
		return (
			<div className='wrapGameOver'>
				<div className='GameOver'>
					<h1>Ooooops...</h1>
					<h4>Your snake is in trouble!</h4>
					<button className='btn' onClick={props.PlayAgain}>Play Again!</button>
				</div>
				<div className='blurBoard'>
					{ props.children }
				</div>
			</div>
		)
	} else {
		return props.children;
	}
}

export default GameOver;