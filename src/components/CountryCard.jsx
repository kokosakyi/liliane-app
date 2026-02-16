import { getFlagUrl } from '../utils/flagLoader'

function CountryCard({ country, showCapital = true, size = 'large' }) {
  const flagSrc = getFlagUrl(country.flag)

  return (
    <div className={`country-card country-card-${size}`}>
      <div className="country-flag-container">
        <img 
          src={flagSrc} 
          alt={`Flag of ${country.name}`}
          className="country-flag"
        />
      </div>
      <div className="country-info">
        <h3 className="country-name">{country.name}</h3>
        {showCapital && country.capital && (
          <p className="country-capital">
            <span className="capital-label">Capital:</span> {country.capital}
          </p>
        )}
        <span className={`continent-badge continent-${country.continent.toLowerCase().replace(' ', '-')}`}>
          {country.continent}
        </span>
      </div>
    </div>
  )
}

export default CountryCard
