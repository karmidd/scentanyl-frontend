import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import {ThemeProvider} from "./components/contexts/ThemeContext.jsx";

// Lazy load all components
const HomePage = lazy(() => import("./components/pages/primary/HomePage.jsx"));
const FragrancePage = lazy(() => import("./components/pages/fragrances/FragrancePage.jsx"));
const AllBrandsPage = lazy(() => import("./components/pages/brands/AllBrandsPage.jsx"));
const BrandPage = lazy(() => import("./components/pages/brands/BrandPage.jsx"));
const AllFragrancesPage = lazy(() => import("./components/pages/fragrances/AllFragrancesPage.jsx"));
const AllNotesPage = lazy(() => import("./components/pages/notes/AllNotesPage.jsx"));
const NotePage = lazy(() => import("./components/pages/notes/NotePage.jsx"));
const AllAccordsPage = lazy(() => import("./components/pages/accords/AllAccordsPage.jsx"));
const AccordPage = lazy(() => import("./components/pages/accords/AccordPage.jsx"));
const AllPerfumersPage = lazy(() => import("./components/pages/perfumers/AllPerfumersPage.jsx"));
const PerfumerPage = lazy(() => import("./components/pages/perfumers/PerfumerPage.jsx"));
const AboutPage = lazy(() => import("./components/pages/secondary/AboutPage.jsx"));
const PrivacyPolicyPage = lazy(() => import("./components/pages/secondary/./PrivacyPolicyPage"));
const ContactPage = lazy(() => import("./components/pages/secondary/ContactPage.jsx"));
const ErrorPage = lazy(() => import("./components/pages/secondary/ErrorPage.jsx"));

function App() {
    return (
        <>
            <ThemeProvider>
                <Router>
                    <div className="App">
                        <Routes>
                            <Route path="" element={<HomePage />} />
                            <Route path="/" element={<HomePage />} />
                            <Route path="/fragrances/:brand/:name/:id" element={<FragrancePage />} />
                            <Route path="/fragrances/:brand/:name/:id/" element={<FragrancePage />} />
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
                            <Route path="/about" element={<AboutPage />} />
                            <Route path="/about/" element={<AboutPage />} />
                            <Route path="/contact" element={<ContactPage />} />
                            <Route path="/contact/" element={<ContactPage />} />
                            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                            <Route path="/privacy-policy/" element={<PrivacyPolicyPage />} />
                            <Route path="*" element={<ErrorPage />} />
                        </Routes>
                    </div>
                </Router>
            </ThemeProvider>
        </>
    )
}

export default App