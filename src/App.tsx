import React from 'react';
import './App.css';

type Lake = {
    id: number;
    name: string;
    trailhead: string;
}

const App = ({lakes}: {lakes: Lake[]}) => (
    <ul className='App'>
      {lakes.map(lake => <li key={lake.id}>{lake.name} Trailhead: {lake.trailhead}</li>)}
    </ul>
);

export default App;
