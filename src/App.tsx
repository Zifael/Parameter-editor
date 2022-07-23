import React from 'react';
import './App.css';
import ParamEditor from './components/ParamEditor/ParamEditor';
import Container from 'react-bootstrap/Container';

function App() {

  const state = {
    params: [
      {id: 1, name: 'Назначени'},
      {id: 2, name: 'Длина'},
      {id: 3, name: 'Цвет'}
    ],
    model: {
      paramValue: [
        {id: 1, paramId: 1, value: 'повседневное'},
        {id: 2, paramId: 2, value: 'макси'},
        {id: 3, paramId: 3, value: 'красный'},
        {id: 4, paramId: 1, value: 'концертное'}, 
      ],
      colors: []
    }
  }

  return (
    <Container className="App">
      <ParamEditor params={state.params} model={state.model}/>
    </Container>
  );
}

export default App;
