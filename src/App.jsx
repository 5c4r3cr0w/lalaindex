import { useEffect, useState } from "react"
import { HashRouter, Routes, Route, useNavigate } from "react-router-dom"
import { collection, getDocs } from "firebase/firestore"
import { db } from "./firebase/config"
import Fuse from "fuse.js"
import SearchBar from "./components/SearchBar"
import CompanyCard from "./components/CompanyCard"
import CompanyPage from "./pages/CompanyPage"

function Home() {
  const [companies, setCompanies] = useState([])
  const [query, setQuery] = useState("")
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCompanies = async () => {
      const snapshot = await getDocs(collection(db, "companies"))
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setCompanies(data)
      setResults(data)
      setLoading(false)
    }
    fetchCompanies()
  }, [])

  useEffect(() => {
    if (!query.trim()) { setResults(companies); return }
    const fuse = new Fuse(companies, { keys: ["name", "city", "industry"], threshold: 0.4 })
    setResults(fuse.search(query).map(r => r.item))
  }, [query, companies])

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '42px', marginBottom: '8px' }}>🧐 Lala Index</h1>
        <p style={{ color: '#888', fontSize: '16px' }}>
          India's crowdsourced guide to workplace culture.<br />
          Is your company professionally run — or full lala?
        </p>
      </div>
      <div style={{ marginBottom: '32px' }}>
        <SearchBar value={query} onChange={setQuery} />
      </div>
      {loading ? (
        <p style={{ textAlign: 'center', color: '#666' }}>Loading companies...</p>
      ) : results.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666' }}>No companies found.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {results.map(company => (
            <div key={company.id} onClick={() => navigate(`/company/${company.slug}`)}>
              <CompanyCard company={company} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/company/:slug" element={<CompanyPage />} />
      </Routes>
    </HashRouter>
  )
}

export default App