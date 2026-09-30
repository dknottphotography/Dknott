import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import OurStory from './pages/OurStory'
import About from './pages/About'
import WeddingFilms from './pages/WeddingFilms'
import RealWeddings from './pages/RealWeddings'
import ClientGuide from './pages/ClientGuide'
import Contact from './pages/Contact'
import LinkTree from './pages/Index'
import Universe from './pages/Universe'

function ScrollToTop() {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<About />} />
        <Route path="/about" element={<About />} />
        <Route path="/index" element={<LinkTree />} />
        <Route path="/home" element={<Home />} />
        <Route path="/our_story" element={<OurStory />} />
        <Route path="/wedding_films" element={<WeddingFilms />} />
        <Route path="/real_weddings" element={<RealWeddings />} />
        <Route path="/client_guide" element={<ClientGuide />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/universe" element={<Universe />} />
      </Routes>
    </Router>
  )
}

export default App
