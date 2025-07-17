import FragrancePage from "./components/pages/fragrances/FragrancePage.jsx";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from "./components/pages/HomePage.jsx";
import AllBrandsPage from "./components/pages/brands/AllBrandsPage.jsx";
import AllFragrancesPage from "./components/pages/fragrances/AllFragrancesPage.jsx";
import AllNotesPage from "./components/pages/notes/AllNotesPage.jsx";
import NotePage from "./components/pages/notes/NotePage.jsx";
import AllAccordsPage from "./components/pages/accords/AllAccordsPage.jsx";
import AccordPage from "./components/pages/accords/AccordPage.jsx";
import BrandPage from "./components/pages/brands/BrandPage.jsx";
import AllPerfumersPage from "./components/pages/perfumers/AllPerfumersPage.jsx";
import PerfumerPage from "./components/pages/perfumers/PerfumerPage.jsx";

//<Route path="/perfumers/:perfumer" element={<PerfumerPage />} />
//<Route path="/perfumers/:perfumer/" element={<PerfumerPage />} />
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
                <Route path="/brands/:brand" element={<BrandPage />} />
                <Route path="/brands/:brand/" element={<BrandPage />} />
                <Route path="/fragrances" element={<AllFragrancesPage />} />
                <Route path="/fragrances/" element={<AllFragrancesPage />} />
                <Route path="/notes" element={<AllNotesPage />} />
                <Route path="/notes/" element={<AllNotesPage />} />
                <Route path="/notes/:note" element={<NotePage />} />
                <Route path="/notes/:note/" element={<NotePage />} />
                <Route path="/accords" element={<AllAccordsPage />} />
                <Route path="/accords/" element={<AllAccordsPage />} />
                <Route path="/accords/:accord" element={<AccordPage />} />
                <Route path="/accords/:accord/" element={<AccordPage />} />
                <Route path="/perfumers" element={<AllPerfumersPage />} />
                <Route path="/perfumers/" element={<AllPerfumersPage />} />
                <Route path="/perfumers/:perfumer" element={<PerfumerPage />} />
                <Route path="/perfumers/:perfumer/" element={<PerfumerPage />} />
            </Routes>
        </Router>
    </>
  )
}

export default App
