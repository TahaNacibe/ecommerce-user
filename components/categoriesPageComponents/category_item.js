

export default function CategoriesItem({ cat, selectedTags, toggleTag }) {
    return (
        <button
        key={cat.name}
        onClick={() => toggleTag()}
        className={`px-4 py-2 rounded-lg transition-colors duration-200 
                  ${selectedTags.includes(cat.name) 
                    ? 'bg-black text-white hover:bg-gray-800' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'}`}
      >
        {cat.name}
      </button>
    )
}