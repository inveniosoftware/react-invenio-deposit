import React, { Component } from "react";
import ReactDOM from 'react-dom';

class App extends Component {
  render() {
    return <p>Hello World</p>
  }
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
