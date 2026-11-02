import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ArSelect from './ArSelect.jsx';

export default function ArPagination({
  currentPage = 1,
  totalItems = 0,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20, 50],
  showRowsSelector = true,
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  if (totalItems === 0) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers with smart ellipsis
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div
      className="ar-pagination-container"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 18px',
        borderTop: '1px solid var(--ar-border)',
        backgroundColor: '#ffffff',
        flexWrap: 'wrap',
        gap: '12px',
      }}
    >
      {/* Left: Range Info */}
      <div className="ar-pagination-info" style={{ fontSize: '13px', color: '#64748b' }}>
        Showing <strong style={{ color: '#0f172a' }}>{startItem}</strong> to{' '}
        <strong style={{ color: '#0f172a' }}>{endItem}</strong> of{' '}
        <strong style={{ color: '#0f172a' }}>{totalItems}</strong> entries
      </div>

      {/* Right: Rows per page + Page Buttons */}
      <div className="ar-pagination-actions" style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
        {showRowsSelector && onPageSizeChange && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12.5px', color: '#64748b' }}>Rows:</span>
            <ArSelect
              value={String(pageSize)}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              options={pageSizeOptions.map((sz) => ({ label: `${sz} / page`, value: String(sz) }))}
              width={100}
              searchable={false}
            />
          </div>
        )}

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            style={{
              height: '34px',
              minWidth: '34px',
              padding: '0 8px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              color: currentPage === 1 ? '#cbd5e1' : '#475569',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              display: 'grid',
              placeItems: 'center',
              transition: 'all 0.15s ease',
            }}
            title="Previous page"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Mobile Page Indicator */}
          <span className="ar-page-mobile-indicator">
            {currentPage} / {totalPages}
          </span>

          <div className="ar-page-numbers" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {pageNumbers.map((p, idx) => {
              if (p === '...') {
                return (
                  <span
                    key={`ellipsis_${idx}`}
                    style={{
                      height: '34px',
                      width: '28px',
                      display: 'grid',
                      placeItems: 'center',
                      fontSize: '12px',
                      color: '#94a3b8',
                    }}
                  >
                    ...
                  </span>
                );
              }

              const isActive = p === currentPage;
              return (
                <button
                  key={`page_${p}`}
                  type="button"
                  onClick={() => onPageChange(p)}
                  style={{
                    height: '34px',
                    minWidth: '34px',
                    padding: '0 10px',
                    borderRadius: '6px',
                    border: isActive ? '1px solid #99c229' : '1px solid #cbd5e1',
                    backgroundColor: isActive ? '#99c229' : '#ffffff',
                    color: isActive ? '#ffffff' : '#334155',
                    fontSize: '12.5px',
                    fontWeight: isActive ? 700 : 600,
                    cursor: 'pointer',
                    transition: 'all 0.12s ease',
                    boxShadow: isActive ? '0 2px 6px rgba(153, 194, 41, 0.3)' : 'none',
                  }}
                >
                  {p}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            style={{
              height: '34px',
              minWidth: '34px',
              padding: '0 8px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              color: currentPage === totalPages ? '#cbd5e1' : '#475569',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              display: 'grid',
              placeItems: 'center',
              transition: 'all 0.15s ease',
            }}
            title="Next page"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

