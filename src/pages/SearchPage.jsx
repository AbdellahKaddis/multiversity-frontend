import React, { useState, useCallback } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { SearchInput } from '../components/common/SearchInput';
import { Badge } from '../components/common/Badge';
import { EmptyState } from '../components/common/EmptyState';
import { Skeleton } from '../components/common/Skeleton';
import { PROGRAMS, COURSES, PROFESSORS, FACULTIES, NEWS, EVENTS } from '../data/data';

export function SearchPage({ onNavigate }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const performSearch = useCallback(() => {
    if (!query.trim()) {
      setResults(null);
      setSearched(false);
      return;
    }
    setLoading(true);
    setSearched(true);
    setTimeout(() => {
      const q = query.toLowerCase().trim();
      const matches = {
        programs: PROGRAMS.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.faculty.toLowerCase().includes(q)),
        courses: COURSES.filter(c => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q) || c.program.toLowerCase().includes(q)),
        professors: PROFESSORS.filter(p => p.name.toLowerCase().includes(q) || p.department.toLowerCase().includes(q) || p.faculty.toLowerCase().includes(q)),
        faculties: FACULTIES.filter(f => f.name.toLowerCase().includes(q) || f.description.toLowerCase().includes(q) || f.code.toLowerCase().includes(q)),
        news: NEWS.filter(n => n.title.toLowerCase().includes(q) || n.excerpt.toLowerCase().includes(q) || n.category.toLowerCase().includes(q)),
        events: EVENTS.filter(e => e.title.toLowerCase().includes(q) || e.location.toLowerCase().includes(q) || e.description.toLowerCase().includes(q)),
      };
      setResults(matches);
      setLoading(false);
    }, 500);
  }, [query]);

  const totalResults = results ? Object.values(results).reduce((sum, arr) => sum + arr.length, 0) : 0;

  const renderResultCategory = (title, items, viewFn) => {
    if (!items || items.length === 0) return null;
    return (
      <div className="result-category">
        <h4>{title} ({items.length})</h4>
        {items.map((item, idx) => (
          <div key={idx} className="result-item" style={{ cursor: 'pointer' }} onClick={() => viewFn && viewFn(item.id)}>
            <div>
              <div className="title">{item.name || item.title}</div>
              <div className="sub">{item.faculty || item.category || item.location || item.department || item.program || ''}</div>
            </div>
            <Badge>{title.slice(0, -1)}</Badge>
          </div>
        ))}
      </div>
    );
  };

  const handleView = (type, id) => {
    const map = {
      programs: () => onNavigate('program', { id }),
      courses: () => onNavigate('course', { id }),
      professors: () => onNavigate('professor', { id }),
      faculties: () => onNavigate('faculty', { id }),
      news: () => onNavigate('newsDetail', { id }),
      events: () => onNavigate('eventDetail', { id }),
    };
    if (map[type]) map[type]();
  };

  return (
    <>
      <PageHeader title="Search" subtitle="Find programs, courses, professors, and more." />
      <section className="section">
        <div className="container">
          <div className="search-page">
            <SearchInput
              value={query}
              onChange={setQuery}
              onSearch={performSearch}
              placeholder="Search for programs, courses, professors..."
              loading={loading}
            />
            <div className="search-results">
              {loading ? (
                <div className="result-category">
                  <h4>Searching...</h4>
                  {[1, 2, 3].map(i => <Skeleton key={i} type="text" />)}
                </div>
              ) : searched && results && totalResults === 0 ? (
                <EmptyState title="No results found" description="Try a different search term." />
              ) : results ? (
                <>
                  {renderResultCategory('Programs', results.programs, (id) => handleView('programs', id))}
                  {renderResultCategory('Courses', results.courses, (id) => handleView('courses', id))}
                  {renderResultCategory('Professors', results.professors, (id) => handleView('professors', id))}
                  {renderResultCategory('Faculties', results.faculties, (id) => handleView('faculties', id))}
                  {renderResultCategory('News', results.news, (id) => handleView('news', id))}
                  {renderResultCategory('Events', results.events, (id) => handleView('events', id))}
                </>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}