import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { collection, query, where, getDocs, addDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore"
import { db } from "../firebase/config"
import FingerprintJS from "@fingerprintjs/fingerprintjs"

const SIGNALS = [
  { id: "cashSalary", label: "💸 Salary arrives like a surprise — sometimes on time, sometimes not" },
  { id: "familyMembers", label: "👨‍👩‍👧 Seth's son is your 'Senior Manager' despite being 23" },
  { id: "noHR", label: "🤷 HR exists only on paper. Real HR is Seth's mood" },
  { id: "moodBoss", label: "🎲 Appraisals are basically a dice roll based on boss's feelings" },
  { id: "noOffer", label: "📄 Offer letter was a WhatsApp message. CTC was verbal" },
  { id: "oneDecision", label: "☝️ One man. All decisions. Even which vendor to buy chai from" },
  { id: "expenseBattle", label: "🧾 Submitting an expense report feels like filing a court case" },
  { id: "sirCulture", label: "🙏 'Sir' is mandatory. First name basis is a privilege you haven't earned" },
  { id: "loyaltyFirst", label: "🐕 Top performer got fired. Chamcha who does nothing got promoted" },
  { id: "noPF", label: "🏦 PF? ESI? 'Hum family hain yahan, in sab ki zaroorat nahi'" },
  { id: "noLeavePolicy", label: "🏖️ Leave policy exists but taking leave is somehow a personal betrayal" },
  { id: "lateNightCalls", label: "🌙 Seth calls at 10pm expecting immediate response. It's Saturday" },
  { id: "dresscode", label: "👔 Dress code enforced strictly. For employees only, not Seth's son" },
  { id: "noContract", label: "🤝 Employment is on 'trust'. Which means only your trust, not theirs" },
  { id: "gossipNetwork", label: "📡 Office gossip reaches Seth faster than your actual work does" },
  { id: "inflatedTitle", label: "💼 Your title is 'Assistant Vice President'. Team size is zero" },
  { id: "noTraining", label: "📚 Training budget is zero. 'Kaam karte karte seekh jaoge'" },
  { id: "parkingPolitics", label: "🚗 Covered parking is reserved for family. You park in the sun" },
  { id: "birthdayMandatory", label: "🎂 Seth's birthday is an unofficial company holiday. Attendance mandatory" },
  { id: "exitDrama", label: "🚪 Someone resigned last month. They're still serving notice period" },
]

function CompanyPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [company, setCompany] = useState(null)
  const [companyDocId, setCompanyDocId] = useState(null)
  const [checked, setChecked] = useState({})
  const [status, setStatus] = useState("idle") // idle | loading | already_voted | submitted
  const [fingerprint, setFingerprint] = useState(null)

  // Load company from Firestore by slug
  useEffect(() => {
    const fetchCompany = async () => {
      const q = query(collection(db, "companies"), where("slug", "==", slug))
      const snapshot = await getDocs(q)
      if (!snapshot.empty) {
        const docSnap = snapshot.docs[0]
        setCompany(docSnap.data())
        setCompanyDocId(docSnap.id)
      }
    }
    fetchCompany()
  }, [slug])

  // Generate fingerprint
  useEffect(() => {
    const getFingerprint = async () => {
      const fp = await FingerprintJS.load()
      const result = await fp.get()
      setFingerprint(result.visitorId)
    }
    getFingerprint()
  }, [])

  // Check if already voted
  useEffect(() => {
    if (!fingerprint || !companyDocId) return
    const checkVote = async () => {
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      const q = query(
        collection(db, "votes"),
        where("companyId", "==", companyDocId),
        where("fingerprint", "==", fingerprint)
      )
      const snapshot = await getDocs(q)
      if (!snapshot.empty) setStatus("already_voted")
    }
    checkVote()
  }, [fingerprint, companyDocId])

  const toggleSignal = (id) => {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const handleSubmit = async () => {
    if (status !== "idle") return
    setStatus("loading")

    const signalValues = {}
    SIGNALS.forEach(s => { signalValues[s.id] = !!checked[s.id] })

    const checkedCount = Object.values(signalValues).filter(Boolean).length
    const scoreContribution = Math.round((checkedCount / SIGNALS.length) * 100)

    // Write the vote
    await addDoc(collection(db, "votes"), {
      companyId: companyDocId,
      signals: signalValues,
      fingerprint: fingerprint,
      timestamp: serverTimestamp(),
    })

    // Recalculate company score
    const allVotesSnap = await getDocs(
      query(collection(db, "votes"), where("companyId", "==", companyDocId))
    )
    const allVotes = allVotesSnap.docs.map(d => d.data())
    const newVoteCount = allVotes.length
    const newScore = Math.round(
      allVotes.reduce((sum, vote) => {
        const c = Object.values(vote.signals).filter(Boolean).length
        return sum + (c / SIGNALS.length) * 100
      }, 0) / newVoteCount
    )

    // Update company document
    await updateDoc(doc(db, "companies", companyDocId), {
      voteCount: newVoteCount,
      lalaScore: newScore,
    })

    setStatus("submitted")
  }

  if (!company) return (
    <div style={{ textAlign: 'center', padding: '80px', color: '#888' }}>
      Loading...
    </div>
  )

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '40px 20px' }}>

      {/* Back */}
      <button
        onClick={() => navigate("/")}
        style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '14px', marginBottom: '24px', padding: 0 }}
      >
        ← Back to Index
      </button>

      {/* Company Header */}
      <h1 style={{ fontSize: '32px', marginBottom: '4px' }}>{company.name}</h1>
      <p style={{ color: '#888', marginBottom: '32px' }}>{company.city} · {company.industry}</p>

      {/* Current Score */}
      <div style={{
        backgroundColor: '#1a1a1a',
        border: '1px solid #2a2a2a',
        borderRadius: '12px',
        padding: '20px 24px',
        marginBottom: '32px',
        textAlign: 'center',
      }}>
        {company.voteCount === 0 ? (
          <p style={{ color: '#666' }}>No votes yet. Be the first to rate this company.</p>
        ) : (
          <>
            <div style={{ fontSize: '48px', fontWeight: '800', color: company.lalaScore >= 75 ? '#ef4444' : company.lalaScore >= 50 ? '#f97316' : company.lalaScore >= 25 ? '#eab308' : '#22c55e' }}>
              {company.lalaScore}%
            </div>
            <div style={{ color: '#888', fontSize: '14px' }}>Lala Score · {company.voteCount} votes</div>
          </>
        )}
      </div>

      {/* Vote Section */}
      {status === "submitted" && (
        <div style={{ backgroundColor: '#14532d', border: '1px solid #22c55e', borderRadius: '12px', padding: '20px', textAlign: 'center', color: '#22c55e' }}>
          ✅ Vote submitted! Thank you for contributing.
        </div>
      )}

      {status === "already_voted" && (
        <div style={{ backgroundColor: '#1c1917', border: '1px solid #555', borderRadius: '12px', padding: '20px', textAlign: 'center', color: '#888' }}>
          🕐 You've already voted for this company in the last 30 days.
        </div>
      )}

      {(status === "idle" || status === "loading") && (
        <>
          <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>
            Rate this company
          </h2>
          <p style={{ color: '#888', fontSize: '14px', marginBottom: '24px' }}>
            Check everything that matches your experience working here.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
            {SIGNALS.map(signal => (
              <label
                key={signal.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  backgroundColor: checked[signal.id] ? '#1c1917' : '#1a1a1a',
                  border: `1px solid ${checked[signal.id] ? '#f97316' : '#2a2a2a'}`,
                  borderRadius: '10px',
                  padding: '14px 18px',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                <input
                  type="checkbox"
                  checked={!!checked[signal.id]}
                  onChange={() => toggleSignal(signal.id)}
                  style={{ width: '18px', height: '18px', accentColor: '#f97316', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '15px' }}>{signal.label}</span>
              </label>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            disabled={status === "loading"}
            style={{
              width: '100%',
              padding: '16px',
              backgroundColor: '#f97316',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: '700',
              cursor: status === "loading" ? 'not-allowed' : 'pointer',
              opacity: status === "loading" ? 0.7 : 1,
            }}
          >
            {status === "loading" ? "Submitting..." : "Submit My Rating"}
          </button>
        </>
      )}

    </div>
  )
}

export default CompanyPage