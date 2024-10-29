import { useState, useEffect } from 'react';

interface SearchableSelectProps<T> {
  label: string;
  placeholder: string;
  options: T[];
  valueKey: keyof T;
  displayKey: keyof T;
  selectedValue: T | null;
  isEditing: boolean;
  onSelect: (selectedValue: T) => void;
}

function SearchableSelect<T extends Record<string, any>>({
  label,
  placeholder,
  options,
  valueKey,
  displayKey,
  selectedValue,
  isEditing,
  onSelect,
}: SearchableSelectProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<T[]>([]);

  useEffect(() => {
    if (isEditing && selectedValue) {
      // Si estamos en modo de edición, mostramos el nombre seleccionado como texto
      setSearchTerm(selectedValue[displayKey]);
    }
  }, [isEditing, selectedValue, displayKey]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);

    if (term) {
      const filtered = options.filter((option) =>
        option[displayKey].toLowerCase().includes(term.toLowerCase())
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions([]);
    }
  };

  const handleSelect = (selectedOption: T) => {
    onSelect(selectedOption);
    setSearchTerm(selectedOption[displayKey] as string);
    setFilteredOptions([]);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {isEditing ? (
        <input
          type="text"
          value={searchTerm}
          disabled
          className="border px-3 py-2 rounded w-full bg-gray-100 text-gray-700 cursor-not-allowed"
        />
      ) : (
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder={placeholder}
          className="border px-3 py-2 rounded w-full"
        />
      )}
      {!isEditing && filteredOptions.length > 0 && (
        <ul className="border mt-2 rounded max-h-48 overflow-y-auto">
          {filteredOptions.map((option) => (
            <li
              key={option[valueKey] as string}
              onClick={() => handleSelect(option)}
              className="p-2 cursor-pointer hover:bg-gray-200"
            >
              {option[displayKey]}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchableSelect;
