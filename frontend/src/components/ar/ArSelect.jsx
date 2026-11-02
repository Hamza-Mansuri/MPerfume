import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Search, ChevronDown, Check } from 'lucide-react';

/**
 * Enterprise Searchable Select Dropdown
 * Matches Mredesign theme with brand green #99c229 accent, smooth hover, search input & checkmarks.
 */
export default function ArSelect({
  value,
  onChange,
  options = [],
  placeholder = 'Select option...',
  label,
  name,
  disabled = false,
  searchable = true,
  style = {},
  className = '',
  width = 'auto',
  minWidth = 140,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [coords, setCoords] = useState({
    top: 0,
    left: 0,
    width: 200,
    maxHeight: 280,
  });

  const buttonRef = useRef(null);
  const menuRef = useRef(null);
  const searchInputRef = useRef(null);

  // Normalize options
  const normalizedOptions = options.map((opt) => {
    if (typeof opt === 'string' || typeof opt === 'number') {
      return { label: String(opt), value: String(opt) };
    }
    return { label: String(opt.label), value: String(opt.value) };
  });

  // Calculate selected label
  const selectedStr = value !== undefined && value !== null ? String(value) : '';
  const selectedOption = normalizedOptions.find(
    (opt) => opt.value.toLowerCase() === selectedStr.toLowerCase()
  );
  const displayLabel = selectedOption ? selectedOption.label : selectedStr || placeholder;

  const updateCoords = () => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const targetWidth = Math.max(rect.width, 160);

    let left = rect.left;
    if (typeof window !== 'undefined' && left + targetWidth > window.innerWidth - 10) {
      left = Math.max(10, window.innerWidth - targetWidth - 10);
    }

    const GAP = 4;
    const MAX_H = 280;
    const spaceBelow = typeof window !== 'undefined' ? window.innerHeight - rect.bottom - GAP - 10 : MAX_H;
    const spaceAbove = typeof window !== 'undefined' ? rect.top - GAP - 10 : 0;
    const openAbove = spaceBelow < 170 && spaceAbove > spaceBelow;

    if (openAbove) {
      setCoords({
        bottom: window.innerHeight - rect.top + GAP,
        left,
        width: targetWidth,
        maxHeight: Math.max(120, Math.min(MAX_H, spaceAbove)),
      });
    } else {
      setCoords({
        top: rect.bottom + GAP,
        left,
        width: targetWidth,
        maxHeight: Math.max(120, Math.min(MAX_H, spaceBelow)),
      });
    }
  };

  const handleToggle = (e) => {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();
    if (!isOpen) {
      setSearchTerm('');
      updateCoords();
    }
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    if (isOpen && searchable) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 40);
    }
  }, [isOpen, searchable]);

  // Click outside and keydown listeners
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(e.target) &&
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    const handleScroll = () => {
      if (isOpen) updateCoords();
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
      window.addEventListener('scroll', handleScroll, true);
      window.addEventListener('resize', handleScroll);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleScroll);
    };
  }, [isOpen]);

  const handleSelect = (optValue) => {
    if (onChange) {
      // Support both direct value and synthetic event
      onChange({ target: { name, value: optValue } });
    }
    setIsOpen(false);
  };

  const filteredOptions = searchTerm.trim()
    ? normalizedOptions.filter((opt) =>
        opt.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : normalizedOptions;

  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        width: width === '100%' ? '100%' : 'auto',
        minWidth,
        position: 'relative',
        ...style,
      }}
      className={className}
    >
      {label && (
        <label
          style={{
            fontSize: '12.5px',
            fontWeight: 700,
            color: '#334155',
            marginBottom: '4px',
            display: 'block',
          }}
        >
          {label}
        </label>
      )}

      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        onClick={handleToggle}
        style={{
          width: '100%',
          height: '38px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          backgroundColor: disabled ? '#f8fafc' : '#ffffff',
          border: `1px solid ${isOpen ? '#99c229' : '#cbd5e1'}`,
          borderRadius: '8px',
          padding: '6px 12px',
          fontSize: '13px',
          fontWeight: 500,
          color: disabled ? '#94a3b8' : '#111827',
          cursor: disabled ? 'not-allowed' : 'pointer',
          boxShadow: isOpen
            ? '0 0 0 3px rgba(153, 194, 41, 0.28)'
            : '0 1px 2px rgba(0, 0, 0, 0.04)',
          transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
          outline: 'none',
          textAlign: 'left',
          userSelect: 'none',
        }}
      >
        <span
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            flex: 1,
            color: selectedOption ? '#111827' : '#64748b',
          }}
        >
          {displayLabel}
        </span>
        <ChevronDown
          size={14}
          style={{
            color: '#64748b',
            flexShrink: 0,
            transition: 'transform 0.18s ease',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </button>

      {/* Portaled Dropdown Menu */}
      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: 'fixed',
              top: coords.top !== undefined ? `${coords.top}px` : 'auto',
              bottom: coords.bottom !== undefined ? `${coords.bottom}px` : 'auto',
              left: `${coords.left}px`,
              width: `${coords.width}px`,
              maxHeight: `${coords.maxHeight}px`,
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '10px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
              padding: '6px',
              zIndex: 999999,
              display: 'flex',
              flexDirection: 'column',
              boxSizing: 'border-box',
              animation: 'fadeIn 0.12s ease',
            }}
          >
            {/* Search Box */}
            {searchable && normalizedOptions.length > 3 && (
              <div
                style={{
                  position: 'relative',
                  padding: '2px 2px 6px',
                  borderBottom: '1px solid #f1f5f9',
                  marginBottom: '4px',
                }}
              >
                <Search
                  size={13}
                  style={{
                    position: 'absolute',
                    left: '10px',
                    top: '42%',
                    transform: 'translateY(-50%)',
                    color: '#94a3b8',
                    pointerEvents: 'none',
                  }}
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                  style={{
                    width: '100%',
                    height: '32px',
                    fontSize: '12px',
                    paddingLeft: '30px',
                    paddingRight: '10px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    outline: 'none',
                    backgroundColor: '#f8fafc',
                    color: '#111827',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            )}

            {/* Options List */}
            <div
              style={{
                overflowY: 'auto',
                flex: 1,
                maxHeight: '220px',
              }}
            >
              {filteredOptions.length === 0 ? (
                <div
                  style={{
                    padding: '10px',
                    fontSize: '12px',
                    color: '#94a3b8',
                    textAlign: 'center',
                  }}
                >
                  No options found
                </div>
              ) : (
                filteredOptions.map((opt, idx) => {
                  const isSelected =
                    opt.value.toLowerCase() === selectedStr.toLowerCase();

                  return (
                    <button
                      key={`ar_opt_${idx}_${opt.value}`}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleSelect(opt.value);
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '7.5px 12px',
                        border: 'none',
                        borderRadius: '6px',
                        backgroundColor: isSelected ? '#99c229' : 'transparent',
                        color: isSelected ? '#ffffff' : '#1e293b',
                        fontSize: '13px',
                        fontWeight: isSelected ? 700 : 500,
                        cursor: 'pointer',
                        transition: 'background-color 0.12s ease, color 0.12s ease',
                        marginBottom: '2px',
                        textAlign: 'left',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                      onMouseEnter={(e) => {
                        if (isSelected) {
                          e.currentTarget.style.backgroundColor = '#86ad1f';
                        } else {
                          e.currentTarget.style.backgroundColor = 'rgba(153, 194, 41, 0.12)';
                          e.currentTarget.style.color = '#5f7d10';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (isSelected) {
                          e.currentTarget.style.backgroundColor = '#99c229';
                        } else {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#1e293b';
                        }
                      }}
                    >
                      <span
                        style={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {opt.label}
                      </span>
                      {isSelected && (
                        <Check
                          size={14}
                          strokeWidth={2.5}
                          style={{
                            flexShrink: 0,
                            marginLeft: '8px',
                            color: '#ffffff',
                          }}
                        />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

