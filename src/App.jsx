import FragrancePage from "./components/FragrancePage.jsx";

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {

  return (
    <>
        <Router>
            <Routes>
                <Route path="/brands/:brand/:name" element={<FragrancePage />} />
            </Routes>
        </Router>
    </>
  )
}

export default App
