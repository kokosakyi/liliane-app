function MultipleChoice({ choices, onSelect, disabled }) {
  return (
    <div className="choices-container">
      {choices.map((choice, index) => (
        <button
          key={index}
          className="choice-btn"
          onClick={() => onSelect(choice)}
          disabled={disabled}
        >
          {choice}
        </button>
      ))}
    </div>
  )
}

export default MultipleChoice
