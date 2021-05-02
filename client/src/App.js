import { Switch, Route } from 'react-router-dom';

import Header from './components/Header';
import People from './components/People';
import Wards from './components/Wards';
import Diagnosis from './components/Diagnosis';

function App() {
  return (
    <div className="App">
      <Header/>
      <Switch>
          <Route exact path='/' component={People}/>
          <Route path='/wards' component={Wards}/>
          <Route path='/diagnosis' component={Diagnosis}/>
      </Switch>
    </div>
  );
}

export default App;
