function SearchBar({ value, onChange }) {
  return (
    <div style={{
      width: '100%',
      maxWidth: '600px',
      margin: '0 auto',
    }}>
      <input
        type="text"
        placeholder="Search a company... e.g. Infosys, Reliance"
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%',
          padding: '14px 20px',
          fontSize: '16px',
          borderRadius: '10px',
          border: '2px solid #2a2a2a',
          backgroundColor: '#1a1a1a',
          color: '#f0f0f0',
          outline: 'none',
        }}
      />
    </div>
  )
}

export default SearchBar