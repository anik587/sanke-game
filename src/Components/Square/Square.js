import React from 'react';
import './Square.css';

const Square = ({ id, status, fruitType }) => {
	// status options: failed, fruit, boardBorder, snakeBody, emptyCell
	if (status === 'fruit') {
		return (
			<div className={`Square ${status} ${fruitType}`}>
			</div>
		)
	} else {
		return (
			<div className={`Square ${status}`}>
			</div>
		)
	}
}

export default Square;