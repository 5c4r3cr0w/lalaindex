import { useEffect, useState } from "react"
import { HashRouter, Routes, Route, useNavigate } from "react-router-dom"
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore"
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
  const [showSuggest, setShowSuggest] = useState(false)
  const [form, setForm] = useState({ name: "", city: "", industry: "" })
  const [submitStatus, setSubmitStatus] = useState("idle")
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCompanies = async () => {
      const snapshot = await getDocs(collection(db, "companies"))
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setCompanies(data)
      setLoading(false)
    }
    fetchCompanies()
  }, [])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }
    const fuse = new Fuse(companies, { keys: ["name", "city", "industry"], threshold: 0.4 })
    setResults(fuse.search(query).map(r => r.item))
  }, [query, companies])

  const handleSuggest = async () => {
    if (!form.name.trim()) return
    setSubmitStatus("loading")
    await addDoc(collection(db, "pendingCompanies"), {
      ...form,
      submittedAt: serverTimestamp(),
      status: "pending"
    })
    setSubmitStatus("submitted")
    setForm({ name: "", city: "", industry: "" })
  }

  const displayList = query.trim() ? results : companies.slice(0, 8)

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '42px', marginBottom: '8px' }}>🧐 Lala Index</h1>
        <p style={{ color: '#888', fontSize: '16px' }}>
          India's crowdsourced guide to workplace culture.<br />
          Is your company professionally run — or full lala?
        </p>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '32px' }}>
        <SearchBar value={query} onChange={setQuery} />
      </div>

      {/* Results */}
      {loading ? (
        <p style={{ textAlign: 'center', color: '#666' }}>Loading companies...</p>
      ) : (
        <>
          {query.trim() && results.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <p style={{ color: '#666', marginBottom: '16px' }}>
                No results for "<span style={{ color: '#888' }}>{query}</span>"
              </p>
              <button
                onClick={() => { setShowSuggest(true); setForm({ ...form, name: query }) }}
                style={{
                  padding: '10px 20px',
                  backgroundColor: 'transparent',
                  border: '1px solid #f97316',
                  color: '#f97316',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                + Suggest "{query}" to be added
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {displayList.map(company => (
                <div key={company.id} onClick={() => navigate(`/company/${company.slug}`)}>
                  <CompanyCard company={company} />
                </div>
              ))}
            </div>
          )}

          {/* Footer hint when showing default 8 */}
          {!query.trim() && companies.length > 8 && (
            <p style={{ textAlign: 'center', color: '#555', fontSize: '13px', marginTop: '24px' }}>
              Showing 8 of {companies.length} companies — search to find yours
            </p>
          )}

          {/* Suggest button */}
          {!showSuggest && (
            <div style={{ textAlign: 'center', marginTop: '40px' }}>
              <button
                onClick={() => setShowSuggest(true)}
                style={{
                  padding: '10px 24px',
                  backgroundColor: 'transparent',
                  border: '1px solid #333',
                  color: '#888',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                + Suggest a company
              </button>
            </div>
          )}

          {/* Suggest Form */}
          {showSuggest && submitStatus !== "submitted" && (
            <div style={{
              marginTop: '40px',
              backgroundColor: '#1a1a1a',
              border: '1px solid #2a2a2a',
              borderRadius: '12px',
              padding: '24px',
            }}>
              <h3 style={{ marginBottom: '4px', fontSize: '18px' }}>Suggest a Company</h3>
              <p style={{ color: '#666', fontSize: '13px', marginBottom: '20px' }}>
                We'll review and add it within a few days.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input
                  placeholder="Company name *"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  style={inputStyle}
                />
                <input
                  placeholder="City (e.g. Mumbai)"
                  value={form.city}
                  onChange={e => setForm({ ...form, city: e.target.value })}
                  style={inputStyle}
                />
                <input
                  placeholder="Industry (e.g. IT Services, FMCG)"
                  value={form.industry}
                  onChange={e => setForm({ ...form, industry: e.target.value })}
                  style={inputStyle}
                />
                <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                  <button
                    onClick={handleSuggest}
                    disabled={submitStatus === "loading" || !form.name.trim()}
                    style={{
                      flex: 1,
                      padding: '12px',
                      backgroundColor: '#f97316',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '700',
                      fontSize: '14px',
                      opacity: !form.name.trim() ? 0.5 : 1,
                    }}
                  >
                    {submitStatus === "loading" ? "Submitting..." : "Submit Suggestion"}
                  </button>
                  <button
                    onClick={() => { setShowSuggest(false); setForm({ name: "", city: "", industry: "" }) }}
                    style={{
                      padding: '12px 20px',
                      backgroundColor: 'transparent',
                      border: '1px solid #333',
                      color: '#888',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {submitStatus === "submitted" && (
            <div style={{
              marginTop: '40px',
              backgroundColor: '#14532d',
              border: '1px solid #22c55e',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center',
              color: '#22c55e',
            }}>
              ✅ Thanks! We'll review and add it soon.
            </div>
          )}
        </>
      )}
    </div>
  )
}

const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  fontSize: '14px',
  borderRadius: '8px',
  border: '1px solid #2a2a2a',
  backgroundColor: '#111',
  color: '#f0f0f0',
  outline: 'none',
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