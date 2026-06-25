function ScoreBadge({ score, voteCount }) {
  const getLabel = (score) => {
    if (voteCount === 0) return { text: "No votes yet", color: "#555", emoji: "🔍" }
    if (score < 25) return { text: "Professional", color: "#22c55e", emoji: "🏢" }
    if (score < 50) return { text: "Mixed Signals", color: "#eab308", emoji: "⚠️" }
    if (score < 75) return { text: "Lala Tendencies", color: "#f97316", emoji: "🚩" }
    return { text: "Full Lala", color: "#ef4444", emoji: "👴" }
  }

  const { text, color, emoji } = getLabel(score)

  return (
    <div style={{ textAlign: 'right' }}>
      {voteCount > 0 && (
        <div style={{
          fontSize: '28px',
          fontWeight: '800',
          color: color,
        }}>
          {score}%
        </div>
      )}
      <div style={{
        fontSize: '13px',
        color: color,
        fontWeight: '600',
      }}>
        {emoji} {text}
      </div>
      <div style={{
        fontSize: '11px',
        color: '#666',
        marginTop: '2px',
      }}>
        {voteCount} {voteCount === 1 ? 'vote' : 'votes'}
      </div>
    </div>
  )
}

export default ScoreBadge