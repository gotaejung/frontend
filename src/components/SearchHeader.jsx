import { useNavigate } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMagnifyingGlass,
  faFilm,
  faUsers,
  faFolder,
  faBuilding,
  faTag,
  // faTv,
} from '@fortawesome/free-solid-svg-icons';

export default function SearchHeader({ selectedType = 'multi', onTypeChange }) {
  const navigate = useNavigate();

  const searchTypes = [
    { value: 'multi', label: '통합 검색', icon: faMagnifyingGlass },
    { value: 'movie', label: '영화', icon: faFilm },
    /* { value: 'tv', label: 'TV 시리즈', icon: faTv }, */
    { value: 'person', label: '인물', icon: faUsers },
    { value: 'collection', label: '컬렉션', icon: faFolder },
    { value: 'company', label: '제작사', icon: faBuilding },
    { value: 'keyword', label: '키워드', icon: faTag },
  ];

  const goSearch = (type) => {
    onTypeChange?.(type);
    navigate(`/search?type=${type}`);
  };

  return (
    <div className="container mx-auto px-4 py-4 md:py-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mb-4 md:mb-6">
        {searchTypes.map((t) => (
          <button
            key={t.value}
            onClick={() => goSearch(t.value)}
            className={`px-2 md:px-3 py-2 rounded-lg font-medium transition-colors text-xs md:text-sm ${
              selectedType === t.value ? 'bg-amber-500 text-black' : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
          >
            <span className="block text-base md:text-lg">
              <FontAwesomeIcon icon={t.icon} />
            </span>
            <span className="text-xs">{t.label}</span>
          </button>
        ))}
      </div>

      <div className="relative mx-auto">
        <input
          type="text"
          placeholder="영화 검색..."
          readOnly
          onFocus={() => goSearch(selectedType)}
          onClick={() => goSearch(selectedType)}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 transition-colors cursor-pointer text-sm md:text-base"
        />
      </div>
    </div>
  );
}