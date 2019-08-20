import React from 'react';
import Square from '../Square/Square';
import './BoardRow.css';

const BoardRow = ({ fruitType, boardRow }) => {
	return (
		<div className='BoardRow'>
			{
				boardRow.map(square => {
					const { id, status } = square;
					return (
						<Square
							key={id}
							id={id}
							status={status}
							fruitType={fruitType}
						/>
					);
				})
			}
		</div>
	)
}

export default BoardRow;