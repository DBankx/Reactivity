import React, { useState, useEffect } from 'react';
import './App.css';
import 'semantic-ui-css/semantic.min.css';
import axios from 'axios';
import { Button } from 'semantic-ui-react';

function App() {
  interface IData {
    id: Number;
    name: String;
  }

  const [values, setValues] = useState([]);

  async function fetchApi() {
    try {
      const res: any = await axios.get('http://localhost:5000/api/values');
      console.log(res.data);
      setValues(res.data);
    } catch (err) {
      console.log('There was a problem');
    }
  }

  return (
    <div className='App'>
      <h1>Hello World</h1>
      <Button
        content='Fetch Api'
        icon='right arrow'
        labelPosition='right'
        onClick={() => fetchApi()}
      />
      {values.length > 0
        ? values.map((value) => {
            return (
              <div>
                <p>Gotten the data</p>
              </div>
            );
          })
        : 'Loading the service'}
    </div>
  );
}

export default App;
