import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props){
  return (
    <button className="square" onClick={props.onClick} style = {props.winningSquare ? {backgroundColor:'lightGreen'}: null}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    let winningSquare = this.props.winner && this.props.winner.includes(i) ? true : false;
    return (
      <Square key = {i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        winningSquare = {winningSquare}
      />
    );
  }

  render() {
    const boardSquares = [];
    for(let row = 0; row < 3; row++){
      const boardRow = [];
      //boardRow.push(<div className="board-row">);
      for(let col = 0; col < 3; col++){
        boardRow.push(this.renderSquare((row*3)+col));
      }
      boardSquares.push(<div className='board-row' key = {row}>{boardRow}</div>)
    }
    return (
      <div>
        {boardSquares}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        col: -1,
        row: -1,
      }],
      stepNumber: 0,
      xIsNext: true,
      ascending: true,
    };
  }
  changeSquareStyle(i,winner){
    for(let j = 0; j < winner.length; j++){
      if(winner[j] == i){
        return {
          backgroundColor: 'green',
        }
      }
    }

  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber+1);
    const current = history[history.length-1];
    const squares = current.squares.slice();
    if(calculateWinner(squares) || squares[i]){
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    //se determina la columna y la fila a partir del numero de cuadrado cliqueado
    let col = (i%3)+1;
    let row = Math.floor((i/3)+1);
    this.setState({
      history: history.concat([
        {
        squares: squares,
        col: col,
        row: row,
        }
    ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step){ 
    this.setState({ //las propiedades del state que no se cambian se quedan igual
      stepNumber: step,
      xIsNext: (step%2) === 0,
    })
  }
  orderList(){
    this.setState({
      ascending: !this.state.ascending,
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step,move) =>{ /*step se refiere al valor del elemento en history y move se refiere al indice del elemento en history */
      const colRow = "(Col: " +step.col +", Row: " + step.row + ")";  
      const desc = move ?
        'Go to move #' + move + " " + colRow:
        'Go to game start';
      const style = {
        fontWeight: this.state.stepNumber == move ? 'bold':'normal',
      }
      return (
        <li key = {move}>
          <button style={style} onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner.winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }
    let orderButtonText = this.state.ascending? 'Order list in descending order' : 'Order list in ascending order'
    let order = <button onClick = {() => this.orderList(history)}>{orderButtonText}</button>
    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares = {current.squares}
            onClick = {i => this.handleClick(i)}
            winner = {winner && winner.winningSquares}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>{order}</div>
          <ol>{this.state.ascending ? moves : moves.reverse()}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

function calculateWinner(squares){
  const lines = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6],
  ];
  for(let i = 0; i < lines.length; i++){
    const[a,b,c] = lines[i];
    if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
      return {
        winner: squares[a],
        winningSquares: lines[i],
      }
    }
  }
  return null;
}