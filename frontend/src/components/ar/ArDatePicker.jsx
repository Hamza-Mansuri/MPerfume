import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Calendar as CalendarIcon,
  Check,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import {
  format,
  startOfDay,
  subDays,
  isSameDay,
  getDaysInMonth,
  setMonth,
  setYear,
} from 'date-fns';

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const WEEKDAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function ArDatePicker({
  value, // string 'YYYY-MM-DD' or Date
  onChange,
  name,
  label,
  title = 'Select Date',
  required = false,
  placeholder = 'Select Date',
  disabled = false,
  width = '100%',
  style = {},
}) {
  const [isOpen, setIsOpen] = useState(false);

  // Normalize initial value to Date object
  const parseInitialDate = (val) => {
    if (!val) return new Date();
    if (val instanceof Date && !isNaN(val)) return val;
    try {
      const parsed = new Date(val);
      return !isNaN(parsed) ? parsed : new Date();
    } catch {
      return new Date();
    }
  };

  const [selectedDate, setSelectedDate] = useState(() => parseInitialDate(value));
  const [tempDate, setTempDate] = useState(() => parseInitialDate(value));
  const [viewDate, setViewDate] = useState(() => parseInitialDate(value));

  useEffect(() => {
    if (value) {
      const d = parseInitialDate(value);
      setSelectedDate(d);
      setTempDate(d);
      setViewDate(d);
    }
  }, [value]);

  const toggleModal = (e) => {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();
    if (!isOpen) {
      setTempDate(selectedDate);
      setViewDate(selectedDate || new Date());
    }
    setIsOpen((prev) => !prev);
  };

  const handleApply = () => {
    const chosen = tempDate || new Date();
    setSelectedDate(chosen);
    const dateStr = format(chosen, 'yyyy-MM-dd');
    if (onChange) {
      onChange({ target: { name, value: dateStr } });
    }
    setIsOpen(false);
  };

  const handlePresetSelect = (dateVal) => {
    setTempDate(dateVal);
    setViewDate(dateVal);
  };

  const handleResetToday = () => {
    const today = startOfDay(new Date());
    setTempDate(today);
    setViewDate(today);
  };

  const now = new Date();
  const presets = [
    {
      label: 'Today',
      date: startOfDay(now),
      isActive: isSameDay(tempDate, now),
    },
    {
      label: 'Yesterday',
      date: startOfDay(subDays(now, 1)),
      isActive: isSameDay(tempDate, subDays(now, 1)),
    },
    {
      label: '2 Days Ago',
      date: startOfDay(subDays(now, 2)),
      isActive: isSameDay(tempDate, subDays(now, 2)),
    },
    {
      label: 'Last Week',
      date: startOfDay(subDays(now, 7)),
      isActive: isSameDay(tempDate, subDays(now, 7)),
    },
    {
      label: '1 Month Ago',
      date: startOfDay(subDays(now, 30)),
      isActive: isSameDay(tempDate, subDays(now, 30)),
    },
  ];

  // Month Navigation
  const prevMonth = () => {
    const curMonth = viewDate.getMonth();
    const curYear = viewDate.getFullYear();
    if (curMonth === 0) {
      setViewDate(new Date(curYear - 1, 11, 1));
    } else {
      setViewDate(new Date(curYear, curMonth - 1, 1));
    }
  };

  const nextMonth = () => {
    const curMonth = viewDate.getMonth();
    const curYear = viewDate.getFullYear();
    if (curMonth === 11) {
      setViewDate(new Date(curYear + 1, 0, 1));
    } else {
      setViewDate(new Date(curYear, curMonth + 1, 1));
    }
  };

  // Render Calendar Grid for `viewDate`
  const renderCalendarDays = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sun
    const totalDays = getDaysInMonth(viewDate);
    const prevMonthDays = getDaysInMonth(new Date(year, month === 0 ? 11 : month - 1, 1));

    const days = [];

    // Leading days from previous month
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = prevMonthDays - i;
      days.push({
        date: new Date(year, month - 1, d),
        dayNum: d,
        isCurrentMonth: false,
      });
    }

    // Days of current month
    for (let i = 1; i <= totalDays; i++) {
      days.push({
        date: new Date(year, month, i),
        dayNum: i,
        isCurrentMonth: true,
      });
    }

    // Trailing days
    const remaining = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        dayNum: i,
        isCurrentMonth: false,
      });
    }

    return days;
  };

  const daysList = renderCalendarDays();

  // Year options for dropdown
  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let y = currentYear - 5; y <= currentYear + 5; y++) {
    yearOptions.push(y);
  }

  // Display label on button
  const displayLabel = value
    ? format(selectedDate, 'MMM d, yyyy')
    : placeholder;

  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        width: width === '100%' ? '100%' : 'auto',
        position: 'relative',
        ...style,
      }}
    >
      {label && (
        <label
          style={{
            fontSize: '12.5px',
            fontWeight: 700,
            color: '#334155',
            marginBottom: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span>
            {label} {required && <span style={{ color: '#e11d48' }}>*</span>}
          </span>
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={toggleModal}
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
          transition: 'all 0.15s ease',
          outline: 'none',
          textAlign: 'left',
          userSelect: 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
          <CalendarIcon
            size={15}
            style={{
              color: value ? '#99c229' : '#64748b',
              flexShrink: 0,
            }}
          />
          <span
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              color: value ? '#111827' : '#64748b',
              fontWeight: value ? 600 : 500,
            }}
          >
            {displayLabel}
          </span>
        </div>

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

      {/* Date Picker Modal (Identical to Image 2 Theme) */}
      {isOpen &&
        createPortal(
          <div
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsOpen(false);
            }}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.5)',
              backdropFilter: 'blur(3px)',
              zIndex: 999999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
            }}
          >
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                boxShadow: '0 20px 45px rgba(0, 0, 0, 0.22)',
                border: '1px solid #e2e8f0',
                width: '640px',
                maxWidth: '96vw',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                animation: 'fadeIn 0.15s ease',
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 20px',
                  backgroundColor: '#f8fafc',
                  borderBottom: '1px solid #eef2f6',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CalendarIcon size={16} style={{ color: '#99c229' }} />
                  <span style={{ fontWeight: 700, fontSize: '14.5px', color: '#0f172a' }}>
                    {title}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    color: '#64748b',
                    padding: '4px',
                    display: 'grid',
                    placeItems: 'center',
                    borderRadius: '6px',
                  }}
                >
                  <X size={17} />
                </button>
              </div>

              {/* Body: Presets + Calendar */}
              <div className="ar-datepicker-modal-body" style={{ display: 'flex', flexDirection: 'row', minHeight: '330px' }}>
                {/* Left Sidebar: Presets */}
                <div
                  className="ar-datepicker-presets"
                  style={{
                    width: '150px',
                    minWidth: '150px',
                    borderRight: '1px solid #eef2f6',
                    backgroundColor: '#f8fafc',
                    padding: '12px 10px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      color: '#64748b',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      padding: '4px 8px 6px',
                    }}
                  >
                    PRESETS
                  </div>

                  {presets.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handlePresetSelect(p.date)}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '7px 11px',
                        borderRadius: '8px',
                        fontSize: '12.5px',
                        fontWeight: p.isActive ? 700 : 500,
                        border: p.isActive ? '1px solid #99c229' : '1px solid transparent',
                        backgroundColor: p.isActive
                          ? 'rgba(153, 194, 41, 0.15)'
                          : 'transparent',
                        color: p.isActive ? '#365314' : '#334155',
                        cursor: 'pointer',
                        transition: 'all 0.12s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                      onMouseEnter={(e) => {
                        if (!p.isActive) {
                          e.currentTarget.style.backgroundColor = '#f1f5f9';
                          e.currentTarget.style.color = '#0f172a';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!p.isActive) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#334155';
                        }
                      }}
                    >
                      <span>{p.label}</span>
                      {p.isActive && (
                        <Check size={13} style={{ color: '#99c229' }} strokeWidth={3} />
                      )}
                    </button>
                  ))}
                </div>

                {/* Right Area: Calendar Grid */}
                <div
                  style={{
                    flex: 1,
                    padding: '16px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    backgroundColor: '#ffffff',
                  }}
                >
                  {/* Selected Date Preview Box */}
                  <div
                    style={{
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      padding: '8px 14px',
                      textAlign: 'center',
                      fontSize: '13px',
                      fontWeight: 700,
                      color: '#0f172a',
                      background: '#f8fafc',
                    }}
                  >
                    Selected: {format(tempDate, 'EEEE, MMMM d, yyyy')}
                  </div>

                  {/* Month & Year Navigation */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '4px 0',
                    }}
                  >
                    <button
                      type="button"
                      onClick={prevMonth}
                      style={{
                        width: '28px',
                        height: '28px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        background: '#f8fafc',
                        cursor: 'pointer',
                        display: 'grid',
                        placeItems: 'center',
                        color: '#475569',
                      }}
                    >
                      <ChevronLeft size={16} />
                    </button>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <select
                        value={viewDate.getMonth()}
                        onChange={(e) =>
                          setViewDate(setMonth(viewDate, parseInt(e.target.value)))
                        }
                        style={{
                          height: '30px',
                          border: '1px solid #cbd5e1',
                          borderRadius: '6px',
                          padding: '0 8px',
                          fontSize: '12.5px',
                          fontWeight: 600,
                          color: '#111827',
                          background: '#ffffff',
                          cursor: 'pointer',
                        }}
                      >
                        {MONTH_NAMES.map((name, i) => (
                          <option key={name} value={i}>
                            {name}
                          </option>
                        ))}
                      </select>

                      <select
                        value={viewDate.getFullYear()}
                        onChange={(e) =>
                          setViewDate(setYear(viewDate, parseInt(e.target.value)))
                        }
                        style={{
                          height: '30px',
                          border: '1px solid #cbd5e1',
                          borderRadius: '6px',
                          padding: '0 8px',
                          fontSize: '12.5px',
                          fontWeight: 600,
                          color: '#111827',
                          background: '#ffffff',
                          cursor: 'pointer',
                        }}
                      >
                        {yearOptions.map((y) => (
                          <option key={y} value={y}>
                            {y}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={nextMonth}
                      style={{
                        width: '28px',
                        height: '28px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        background: '#f8fafc',
                        cursor: 'pointer',
                        display: 'grid',
                        placeItems: 'center',
                        color: '#475569',
                      }}
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>

                  {/* Calendar Grid */}
                  <div>
                    {/* Weekday headers */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(7, 1fr)',
                        textAlign: 'center',
                        fontSize: '11px',
                        fontWeight: 700,
                        color: '#64748b',
                        paddingBottom: '6px',
                      }}
                    >
                      {WEEKDAY_NAMES.map((w) => (
                        <div key={w}>{w}</div>
                      ))}
                    </div>

                    {/* Day cells */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(7, 1fr)',
                        gap: '2px',
                      }}
                    >
                      {daysList.map((dayItem, idx) => {
                        const { date, dayNum, isCurrentMonth } = dayItem;
                        const isSelected = isSameDay(date, tempDate);

                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setTempDate(date)}
                            style={{
                              height: '34px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '12.5px',
                              fontWeight: isSelected ? 700 : 500,
                              cursor: 'pointer',
                              border: 'none',
                              borderRadius: isSelected ? '8px' : '6px',
                              backgroundColor: isSelected ? '#99c229' : 'transparent',
                              color: isSelected
                                ? '#ffffff'
                                : !isCurrentMonth
                                ? '#cbd5e1'
                                : '#1e293b',
                              transition: 'all 0.1s ease',
                              outline: 'none',
                            }}
                            onMouseEnter={(e) => {
                              if (!isSelected) {
                                e.currentTarget.style.backgroundColor =
                                  'rgba(153, 194, 41, 0.12)';
                                e.currentTarget.style.color = '#5f7d10';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isSelected) {
                                e.currentTarget.style.backgroundColor = 'transparent';
                                e.currentTarget.style.color = !isCurrentMonth
                                  ? '#cbd5e1'
                                  : '#1e293b';
                              }
                            }}
                          >
                            {dayNum}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 20px',
                  backgroundColor: '#f8fafc',
                  borderTop: '1px solid #eef2f6',
                  gap: '10px',
                }}
              >
                <button
                  type="button"
                  onClick={handleResetToday}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#475569',
                    borderRadius: '8px',
                    padding: '7px 14px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <RotateCcw size={13} />
                  <span>Today</span>
                </button>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    style={{
                      border: '1px solid #e2e8f0',
                      background: '#ffffff',
                      color: '#64748b',
                      borderRadius: '8px',
                      padding: '7px 14px',
                      fontSize: '13px',
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleApply}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      border: 'none',
                      background: '#99c229',
                      color: '#ffffff',
                      borderRadius: '8px',
                      padding: '7px 18px',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(153, 194, 41, 0.3)',
                    }}
                  >
                    <Check size={14} strokeWidth={2.5} />
                    <span>Apply Date</span>
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

