import { useState } from 'react';
import { useEffect } from 'react';
import { Person } from '../types/Person';

type Props = {
  peoples: Person[];
  onSelected?: (person: Person | null) => void;
  delay?: number;
};

export const Autocomplete: React.FC<Props> = ({
  peoples,
  onSelected,
  delay = 300,
}) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [isOpen, setIsOpen] = useState(false);
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    onSelected?.(null);
  };

  const filteredPerson = peoples.filter(people =>
    people.name.toLowerCase().includes(debouncedQuery.toLowerCase()),
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [query, delay]);

  return (
    <div
      className={`dropdown ${isOpen && debouncedQuery !== null ? 'is-active' : ' '}`}
    >
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
        />
      </div>

      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content">
          {filteredPerson.map(person => (
            <div
              key={person.name}
              className="dropdown-item"
              data-cy="suggestion-item"
              onClick={() => {
                onSelected?.(person);
                setQuery(person.name);
                setIsOpen(false);
              }}
            >
              <p className="has-text-link">{person.name}</p>
            </div>
          ))}
        </div>
      </div>
      {query && filteredPerson.length === 0 && (
        <div
          className="
            notification
            is-danger
            is-light
            mt-3
            is-align-self-flex-start
          "
          role="alert"
          data-cy="no-suggestions-message"
        >
          <p className="has-text-danger">No matching suggestions</p>
        </div>
      )}
    </div>
  );
};
