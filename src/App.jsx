import './App.css';
import { useState } from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Header from './components/comps/HeaderV';
import HomePage from './pages/HomePageV';
import AnalyticsPage from './pages/AnalyticsPageV';

function App() {
  const [selectedDistrict, setSelectedDistrict] = useState(["Все районы"]);
  const [selectedYear, setSelectedYear] = useState(null);
  return (
    <Router>
      <div className="App h-full w-full flex flex-col overflow-hidden">
        <Header/>
        <main className="flex-1 overflow-hidden">
          <Routes>
            <Route 
              path="/" 
              element={
                <HomePage
                  selectedDistrict={selectedDistrict}
                  setSelectedDistrict={setSelectedDistrict}
                  selectedYear={selectedYear}
                  setSelectedYear={setSelectedYear}
                />
              }
            />
            <Route path="/analytics" element={<AnalyticsPage/>}/>
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
