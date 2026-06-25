import ScoreBadge from "./ScoreBadge"

function CompanyCard({ company }) {
  return (
    <div style={{
      backgroundColor: '#1a1a1a',
      border: '1px solid #2a2a2a',
      borderRadius: '12px',
      padding: '20px 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      cursor: 'pointer',
      transition: 'border-color 0.2s',
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = '#444'}
      onMouseLeave={e => e.currentTarget.style.borderColor = '#2a2a2a'}
    >
      <div>
        <div style={{ fontSize: '17px', fontWeight: '600', marginBottom: '4px' }}>
          {company.name}
        </div>
        <div style={{ fontSize: '13px', color: '#888' }}>
          {company.city} · {company.industry}
        </div>
      </div>
      <ScoreBadge score={company.lalaScore} voteCount={company.voteCount} />
    </div>
  )
}

export default CompanyCard