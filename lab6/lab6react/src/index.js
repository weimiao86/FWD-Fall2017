import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

//squares of a bar component
function Square(props){
  let divStyle = {
    background: 'rgb(' + Math.round(Math.random() * 255) + ',' + Math.round(Math.random() * 255) + ',' + Math.round(Math.random() * 255) + ')',
    width:'100%',
    height: '30px',
    borderRadius:'5px',
  }
  return (
    <div style={divStyle} className="square"></div>
  );
}

//spectrum bar component
class Bar extends React.Component {
  renderSquare() {
    return(
      <Square />
    )
  }
  render(){
    let barStyle={
      width:'3%',
      marginLeft:'5px',
      marginRight:'5px'
    }
    let h2Style={
      textAlign:'center',
      color: 'rgb(' + Math.round(Math.random() * 255) + ',' + Math.round(Math.random() * 255) + ',' + Math.round(Math.random() * 255) + ')',
    }
    const isKeydown = this.props.isKeydown;
    if(isKeydown === 1){
      return(
        <div style={barStyle} className="bar">
          <h2 style={h2Style}>{this.props.keyChar}</h2>
          {this.renderSquare()}
          {this.renderSquare()}
          {this.renderSquare()}
          {this.renderSquare()}
          {this.renderSquare()}
          {this.renderSquare()}
          {this.renderSquare()}
          {this.renderSquare()}
          {this.renderSquare()}
          {this.renderSquare()}
          {this.renderSquare()}
        </div>
      )
    }

    return(
      <div style={barStyle} className="bar">
        <h2 style={h2Style}>{this.props.keyChar}</h2>
        {this.renderSquare()}
      </div>
    )
  }
}

//spectrum board component
class Board extends React.Component {
  constructor(props) {
      super(props);
      this.state={
        pressedKeys: Array(26).fill(0),
      };
      this.handleKeyDown = this.handleKeyDown.bind(this);
      this.handleKeyUp = this.handleKeyUp.bind(this);
  }
  componentWillMount(){
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }
  componentWillUnmount(){
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
  }
  handleKeyDown(e){
    let kd = e.keyCode-65;
    let tempArr = this.state.pressedKeys;
    tempArr[kd]=1;
    this.setState({
      pressedKeys:tempArr
    });
  }
  handleKeyUp(e){
    let kd = e.keyCode-65;
    let tempArr = this.state.pressedKeys;
    tempArr[kd]=0;
    this.setState({
      pressedKeys:tempArr
    });
  }
  renderBar(keyVal,isKeydown){
    return(
      <Bar keyChar={keyVal} isKeydown={isKeydown} />
    )
  }
  render(){
    let boardStyle={
      display: 'flex',
      flexDirection: 'row',
      flex: '1'
    }
    return(
      <div style={boardStyle} className="board">
        {this.renderBar('A',this.state.pressedKeys[0])}
        {this.renderBar('B',this.state.pressedKeys[1])}
        {this.renderBar('C',this.state.pressedKeys[2])}
        {this.renderBar('D',this.state.pressedKeys[3])}
        {this.renderBar('E',this.state.pressedKeys[4])}
        {this.renderBar('F',this.state.pressedKeys[5])}
        {this.renderBar('G',this.state.pressedKeys[6])}
        {this.renderBar('H',this.state.pressedKeys[7])}
        {this.renderBar('I',this.state.pressedKeys[8])}
        {this.renderBar('J',this.state.pressedKeys[9])}
        {this.renderBar('K',this.state.pressedKeys[10])}
        {this.renderBar('L',this.state.pressedKeys[11])}
        {this.renderBar('M',this.state.pressedKeys[12])}
        {this.renderBar('N',this.state.pressedKeys[13])}
        {this.renderBar('O',this.state.pressedKeys[14])}
        {this.renderBar('P',this.state.pressedKeys[15])}
        {this.renderBar('Q',this.state.pressedKeys[16])}
        {this.renderBar('R',this.state.pressedKeys[17])}
        {this.renderBar('S',this.state.pressedKeys[18])}
        {this.renderBar('T',this.state.pressedKeys[19])}
        {this.renderBar('U',this.state.pressedKeys[20])}
        {this.renderBar('V',this.state.pressedKeys[21])}
        {this.renderBar('W',this.state.pressedKeys[22])}
        {this.renderBar('X',this.state.pressedKeys[23])}
        {this.renderBar('Y',this.state.pressedKeys[24])}
        {this.renderBar('Z',this.state.pressedKeys[25])}
      </div>
    )
  }
}

ReactDOM.render(<Board />, document.getElementById('root'));
