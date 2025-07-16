import FragrancePage from "./components/pages/FragrancePage.jsx";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from "./components/pages/HomePage.jsx";
import AllBrandsPage from "./components/pages/AllBrandsPage.jsx";
import AllFragrancesPage from "./components/pages/AllFragrancesPage.jsx";
import AllNotesPage from "./components/pages/AllNotesPage.jsx";
import AllFragrancesByNotePage from "./components/pages/AllFragrancesByNotePage.jsx";
import AllAccordsPage from "./components/pages/AllAccordsPage.jsx";
import AllFragrancesByAccordPage from "./components/pages/AllFragrancesByAccordPage.jsx";

function App() {

  return (
    <>
        <Router>
            <Routes>
                <Route path="" element={<HomePage />} />
                <Route path="/" element={<HomePage />} />
                <Route path="/fragrances/:brand/:name" element={<FragrancePage />} />
                <Route path="/fragrances/:brand/:name/" element={<FragrancePage />} />
                <Route path="/brands" element={<AllBrandsPage />} />
                <Route path="/brands/" element={<AllBrandsPage />} />
                <Route path="/fragrances" element={<AllFragrancesPage />} />
                <Route path="/fragrances/" element={<AllFragrancesPage />} />
                <Route path="/notes" element={<AllNotesPage />} />
                <Route path="/notes/" element={<AllNotesPage />} />
                <Route path="/notes/:note" element={<AllFragrancesByNotePage />} />
                <Route path="/notes/:note/" element={<AllFragrancesByNotePage />} />
                <Route path="/accords" element={<AllAccordsPage />} />
                <Route path="/accords/" element={<AllAccordsPage />} />
                <Route path="/accords/:accord" element={<AllFragrancesByAccordPage />} />
                <Route path="/accords/:accord/" element={<AllFragrancesByAccordPage />} />
            </Routes>
        </Router>
    </>
  )
}

export default App
