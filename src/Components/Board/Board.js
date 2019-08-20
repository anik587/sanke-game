import React from 'react';
import BoardRow from '../BoardRow/BoardRow';

const Board = ({ board, fruitType }) => {
	let boardRowID = 0;
	return (
		<div className='Board'>
			{
				board.map(boardRow => (
					<BoardRow 
						key={boardRowID++}
						fruitType={fruitType}
						boardRow={boardRow}
					/>
				))
			}
		</div>
	)
}

export default Board;