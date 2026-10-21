const { useState, useEffect, useRef } = React;
function LiveSearch() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);
    useEffect(() => {
        if (query.trim().length < 2) {
            setResults([]);
            setIsOpen(false);
            return;
        }
        const fetchBooks = async () => {
            try {
                const response = await fetch(`/api/books?search=${encodeURIComponent(query)}`);
                const books = await response.json();
                setResults(books);
                setIsOpen(books.length > 0);
            } catch (err) {
                console.error('Помилка живого пошуку:', err);
            }
        };
        const timeoutId = setTimeout(fetchBooks, 300);
        return () => clearTimeout(timeoutId);
    }, [query]);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    return (
        <div className="search-bar" ref={containerRef} style={{ position: 'relative' }}>
            <input
                type="text"
                placeholder="Search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => { if (results.length > 0) setIsOpen(true); }}
            />
            <button type="button">Find</button>
            {isOpen && (
                <div id="search-results" style={{ display: 'block', position: 'absolute', top: '100%', left: 0, width: '100%', background: 'white', zIndex: 100, border: '1px solid #ccc' }}>
                    {results.map((book) => (
                        <div
                            key={book.bookid}
                            className="search-item"
                            onClick={() => window.location.href = `book-details.html?id=${book.bookid}`}
                            style={{ display: 'flex', alignItems: 'center', padding: '10px', cursor: 'pointer' }}
                        >
                            <img src={book.coverpath} alt="cover" style={{ width: '40px', marginRight: '10px' }} />
                            <span style={{ color: 'black' }}>{book.name} ‒ {book.authorname}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

const rootNode = document.getElementById('react-search-root');
if (rootNode) {
    const root = ReactDOM.createRoot(rootNode);
    root.render(<LiveSearch />);
}