import React, { useState, useEffect, useRef } from 'react';
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
  endOfDay,
  subDays,
  addDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  isSameDay,
  isWithinInterval,
  getDaysInMonth,
  setDate,
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

export default function ArDateRangePicker({
  value, // [startDate, endDate] or null
  onChange,
  label = 'Date Range',
  placeholder = 'All Dates',
  style = {},
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState(value || null);
  const [tempRange, setTempRange] = useState(value || null);
  const [clickCount, setClickCount] = useState(0);

  // Month & Year view for the calendar picker
  const [viewDate, setViewDate] = useState(() => (value && value[0] ? value[0] : new Date()));

  useEffect(() => {
    if (value !== undefined) {
      setSelectedRange(value);
      setTempRange(value);
      if (value && value[0]) {
        setViewDate(value[0]);
      }
    }
  }, [value]);

  const toggleModal = () => {
    if (!isOpen) {
      setTempRange(selectedRange);
      setClickCount(0);
      if (selectedRange && selectedRange[0]) {
        setViewDate(selectedRange[0]);
      } else {
        setViewDate(new Date());
      }
    }
    setIsOpen((prev) => !prev);
  };

  const handleResetAllDates = () => {
    setSelectedRange(null);
    setTempRange(null);
    setClickCount(0);
    onChange?.(null);
    setIsOpen(false);
  };

  const handleApply = () => {
    if (tempRange && (tempRange[0] || tempRange[1])) {
      const s = tempRange[0] || tempRange[1];
      const e = tempRange[1] || tempRange[0] || s;
      const normalized = [startOfDay(s), endOfDay(e)];
      setSelectedRange(normalized);
      onChange?.(normalized);
    } else {
      setSelectedRange(null);
      onChange?.(null);
    }
    setIsOpen(false);
    setClickCount(0);
  };

  const isRangeMatch = (start, end) => {
    const curr = tempRange || selectedRange;
    if (!curr || !curr[0] || !curr[1]) return false;
    return isSameDay(curr[0], start) && isSameDay(curr[1], end);
  };

  // Presets
  const now = new Date();
  const presets = [
    {
      label: 'All Dates',
      action: () => {
        setTempRange(null);
        setClickCount(0);
      },
      isActive: !(tempRange || selectedRange),
    },
    {
      label: 'Today',
      action: () => {
        setTempRange([startOfDay(now), endOfDay(now)]);
        setViewDate(now);
        setClickCount(0);
      },
      isActive: isRangeMatch(startOfDay(now), endOfDay(now)),
    },
    {
      label: 'Yesterday',
      action: () => {
        const y = subDays(now, 1);
        setTempRange([startOfDay(y), endOfDay(y)]);
        setViewDate(y);
        setClickCount(0);
      },
      isActive: isRangeMatch(startOfDay(subDays(now, 1)), endOfDay(subDays(now, 1))),
    },
    {
      label: 'This Week',
      action: () => {
        const s = startOfWeek(now, { weekStartsOn: 1 });
        const e = endOfWeek(now, { weekStartsOn: 1 });
        setTempRange([startOfDay(s), endOfDay(e)]);
        setViewDate(now);
        setClickCount(0);
      },
      isActive: isRangeMatch(startOfWeek(now, { weekStartsOn: 1 }), endOfWeek(now, { weekStartsOn: 1 })),
    },
    {
      label: 'Last Week',
      action: () => {
        const lwStart = subDays(startOfWeek(now, { weekStartsOn: 1 }), 7);
        const lwEnd = subDays(endOfWeek(now, { weekStartsOn: 1 }), 7);
        setTempRange([startOfDay(lwStart), endOfDay(lwEnd)]);
        setViewDate(lwStart);
        setClickCount(0);
      },
      isActive: isRangeMatch(
        subDays(startOfWeek(now, { weekStartsOn: 1 }), 7),
        subDays(endOfWeek(now, { weekStartsOn: 1 }), 7)
      ),
    },
    {
      label: 'This Month',
      action: () => {
        const s = startOfMonth(now);
        const e = endOfMonth(now);
        setTempRange([startOfDay(s), endOfDay(e)]);
        setViewDate(now);
        setClickCount(0);
      },
      isActive: isRangeMatch(startOfMonth(now), endOfMonth(now)),
    },
    {
      label: 'Last Month',
      action: () => {
        const prevMonth = subDays(startOfMonth(now), 1);
        const s = startOfMonth(prevMonth);
        const e = endOfMonth(prevMonth);
        setTempRange([startOfDay(s), endOfDay(e)]);
        setViewDate(s);
        setClickCount(0);
      },
      isActive: (() => {
        const prevMonth = subDays(startOfMonth(now), 1);
        return isRangeMatch(startOfMonth(prevMonth), endOfMonth(prevMonth));
      })(),
    },
    {
      label: 'Last 30 Days',
      action: () => {
        const s = subDays(now, 30);
        setTempRange([startOfDay(s), endOfDay(now)]);
        setViewDate(now);
        setClickCount(0);
      },
      isActive: isRangeMatch(startOfDay(subDays(now, 30)), endOfDay(now)),
    },
    {
      label: 'Last 90 Days',
      action: () => {
        const s = subDays(now, 90);
        setTempRange([startOfDay(s), endOfDay(now)]);
        setViewDate(now);
        setClickCount(0);
      },
      isActive: isRangeMatch(startOfDay(subDays(now, 90)), endOfDay(now)),
    },
  ];

  // Calendar Day Click Handler
  const handleDayClick = (clickedDate) => {
    if (clickCount === 0 || clickCount >= 2 || !tempRange) {
      setTempRange([startOfDay(clickedDate), startOfDay(clickedDate)]);
      setClickCount(1);
    } else {
      // Second click: create range
      const first = tempRange[0];
      if (clickedDate < first) {
        setTempRange([startOfDay(clickedDate), endOfDay(first)]);
      } else {
        setTempRange([startOfDay(first), endOfDay(clickedDate)]);
      }
      setClickCount(2);
    }
  };

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

    // Trailing days of next month to complete 42 or 35 cells
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

  // Formatted Label on Trigger Button
  const formatButtonLabel = () => {
    if (!selectedRange || (!selectedRange[0] && !selectedRange[1])) {
      return placeholder;
    }
    const s = selectedRange[0] || selectedRange[1];
    const e = selectedRange[1] || selectedRange[0] || s;

    if (isSameDay(s, e)) {
      if (isSameDay(s, now)) return 'Today';
      if (isSameDay(s, subDays(now, 1))) return 'Yesterday';
      return format(s, 'MMM d, yyyy');
    }
    return `${format(s, 'MMM d, yyyy')} - ${format(e, 'MMM d, yyyy')}`;
  };

  const daysList = renderCalendarDays();

  // Year options for dropdown
  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let y = currentYear - 5; y <= currentYear + 5; y++) {
    yearOptions.push(y);
  }

  return (
    <div style={{ position: 'relative', display: 'inline-flex', ...style }}>
      {/* Trigger Button */}
      <div
        role="button"
        tabIndex={0}
        onClick={toggleModal}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          height: '38px',
          padding: '0 12px',
          backgroundColor: '#ffffff',
          border: `1px solid ${isOpen ? '#99c229' : '#cbd5e1'}`,
          borderRadius: '8px',
          cursor: 'pointer',
          boxShadow: isOpen
            ? '0 0 0 3px rgba(153, 194, 41, 0.28)'
            : '0 1px 2px rgba(0, 0, 0, 0.04)',
          transition: 'all 0.15s ease',
          fontSize: '13px',
          fontWeight: 500,
          color: selectedRange ? '#111827' : '#64748b',
          whiteSpace: 'nowrap',
          userSelect: 'none',
        }}
      >
        <CalendarIcon
          size={14}
          style={{
            color: selectedRange ? '#99c229' : '#64748b',
            flexShrink: 0,
          }}
        />
        <span>{formatButtonLabel()}</span>

        {selectedRange && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleResetAllDates();
            }}
            title="Clear date filter"
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              padding: '2px',
              cursor: 'pointer',
              display: 'grid',
              placeItems: 'center',
              borderRadius: '4px',
            }}
          >
            <X size={13} />
          </button>
        )}

        <ChevronDown
          size={13}
          style={{
            color: '#64748b',
            flexShrink: 0,
            transition: 'transform 0.18s ease',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </div>

      {/* Modal Popup (Image 2 exact replica) */}
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
                width: '660px',
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
                    Filter by Date Range
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

              {/* Body: Split Presets + Calendar */}
              <div className="ar-datepicker-modal-body" style={{ display: 'flex', flexDirection: 'row', minHeight: '340px' }}>
                {/* Left Sidebar: Presets */}
                <div
                  className="ar-datepicker-presets"
                  style={{
                    width: '160px',
                    minWidth: '160px',
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
                      onClick={p.action}
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

                {/* Right Area: Interactive Range Calendar */}
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
                  {/* Start Date & End Date Boxes */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div
                      style={{
                        border: '1px solid #cbd5e1',
                        borderRadius: '8px',
                        padding: '7px 12px',
                        textAlign: 'center',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: tempRange && tempRange[0] ? '#0f172a' : '#94a3b8',
                        background: '#ffffff',
                      }}
                    >
                      {tempRange && tempRange[0]
                        ? format(tempRange[0], 'MMM d, yyyy')
                        : 'Start Date'}
                    </div>

                    <div
                      style={{
                        border: '1px solid #cbd5e1',
                        borderRadius: '8px',
                        padding: '7px 12px',
                        textAlign: 'center',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: tempRange && (tempRange[1] || tempRange[0]) ? '#0f172a' : '#94a3b8',
                        background: '#ffffff',
                      }}
                    >
                      {tempRange && (tempRange[1] || tempRange[0])
                        ? format(tempRange[1] || tempRange[0], 'MMM d, yyyy')
                        : 'End Date'}
                    </div>
                  </div>

                  {/* Month & Year Bar */}
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

                        const isStart =
                          tempRange && tempRange[0] && isSameDay(date, tempRange[0]);
                        const isEnd =
                          tempRange &&
                          (tempRange[1] || tempRange[0]) &&
                          isSameDay(date, tempRange[1] || tempRange[0]);
                        const isSelectedEdge = isStart || isEnd;

                        const isInRange =
                          tempRange &&
                          tempRange[0] &&
                          tempRange[1] &&
                          !isSameDay(tempRange[0], tempRange[1]) &&
                          isWithinInterval(date, {
                            start: tempRange[0] < tempRange[1] ? tempRange[0] : tempRange[1],
                            end: tempRange[0] < tempRange[1] ? tempRange[1] : tempRange[0],
                          });

                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleDayClick(date)}
                            style={{
                              height: '34px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '12.5px',
                              fontWeight: isSelectedEdge ? 700 : 500,
                              cursor: 'pointer',
                              border: 'none',
                              borderRadius: isSelectedEdge ? '8px' : isInRange ? '0' : '6px',
                              backgroundColor: isSelectedEdge
                                ? '#99c229'
                                : isInRange
                                ? 'rgba(153, 194, 41, 0.22)'
                                : 'transparent',
                              color: isSelectedEdge
                                ? '#ffffff'
                                : isInRange
                                ? '#365314'
                                : !isCurrentMonth
                                ? '#cbd5e1'
                                : '#1e293b',
                              transition: 'all 0.1s ease',
                              outline: 'none',
                            }}
                            onMouseEnter={(e) => {
                              if (!isSelectedEdge && !isInRange) {
                                e.currentTarget.style.backgroundColor =
                                  'rgba(153, 194, 41, 0.12)';
                                e.currentTarget.style.color = '#5f7d10';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isSelectedEdge && !isInRange) {
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
                  onClick={handleResetAllDates}
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
                  <span>All Dates (Default)</span>
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
                    <span>Apply Range</span>
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

