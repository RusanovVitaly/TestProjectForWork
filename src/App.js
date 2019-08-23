import React from 'react';
import './sass/App.sass';
import 'antd/dist/antd.css';
import {Route, Switch, BrowserRouter} from "react-router-dom";
import Main from './pages/main';
import MainLayout from './layout/main';
import Artist from './pages/artist/Artist';

const MainPage = () => <MainLayout>
    <Main/>
</MainLayout>;

function App() {
  return (
    <div className="App">
        <BrowserRouter>
            <Switch>
                <Route exact path='/' component={MainPage}/>
                <Route exact path='/artist/:artist' component={Artist}/>
            </Switch>
        </BrowserRouter>
    </div>
  );
}

export default App;
