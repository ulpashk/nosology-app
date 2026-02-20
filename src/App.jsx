import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Header from './components/comps/HeaderV';
import HomePage from './pages/HomePageV';
import AnalyticsPage from './pages/AnalyticsPageV';
import PersonalPage from './pages/PersonalPageV';

function App() {
  return (
    <Router>
      <div className="App h-full w-full flex flex-col overflow-hidden">
        <Header/>
        <main className="flex-1 overflow-hidden">
          <Routes>
            <Route path="/" element={<HomePage/>}/>
            <Route path="/analytics" element={<AnalyticsPage/>}/>
            <Route path="/personal" element={<PersonalPage/>}/>
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
