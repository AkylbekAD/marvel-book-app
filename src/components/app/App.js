import {lazy, Suspense} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

import AppHeader from '../appHeader/AppHeader';

import loadingGear from '../spinner/loading-gear.gif';

import './SingleComicPage/singleComicPage.scss';

const Page404 = lazy(() => import('./Page404'));
const MainPage = lazy(() => import('./MainPage'));
const ComicsPage = lazy(() => import('./ComicsPage'));
const SingleComicPage = lazy(() => import('./SingleComicPage/SingleComicPage'))

const App = () => {

    return (
       <Router>
            <div className="app">
              <AppHeader/>
                <main>
                    <Suspense fallback={<img src={loadingGear} alt="loading..." className="center"/>}>
                        <Routes>
                            <Route exact path="/" element={<MainPage/>}/>
                            <Route exact path="/comics" element={<ComicsPage/>}/>
                            <Route path="/comics/:comicId" element={<SingleComicPage/>}/>
                            <Route path="*" element={<Page404/>}/>
                        </Routes>
                    </Suspense>
                </main>
             </div>
       </Router>
    )
    }

export default App;