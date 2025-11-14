import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Plane } from 'lucide-react';
import { UserGetFlightsApi } from '../api/UserApi';

const WeekCalendar = ({ onDateSelect, selectedDate }) => {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Monday as first day
    const monday = new Date(today);
    monday.setDate(today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));
    monday.setHours(0, 0, 0, 0);
    return monday;
  });

  const [flightsCount, setFlightsCount] = useState({});
  const [loadingDates, setLoadingDates] = useState(new Set());

  // Get week dates using useMemo
  const weekDates = useMemo(() => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeekStart);
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  }, [currentWeekStart]);

  // Fetch flights count for each date in the week
  useEffect(() => {
    const fetchFlightsForWeek = async () => {
      const newLoadingDates = new Set();
      const newFlightsCount = {};

      for (const date of weekDates) {
        // Format date as YYYY-MM-DD using local timezone
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;
        newLoadingDates.add(dateStr);
        
        try {
          const flights = await UserGetFlightsApi(undefined, undefined, dateStr);
          newFlightsCount[dateStr] = Array.isArray(flights) ? flights.length : 0;
        } catch (error) {
          console.error(`Error fetching flights for ${dateStr}:`, error);
          newFlightsCount[dateStr] = 0;
        } finally {
          newLoadingDates.delete(dateStr);
        }
      }

      setFlightsCount(newFlightsCount);
      setLoadingDates(newLoadingDates);
    };

    fetchFlightsForWeek();
  }, [weekDates]);

  const navigateWeek = (direction) => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeekStart(newDate);
  };

  const goToCurrentWeek = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const monday = new Date(today);
    monday.setDate(today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));
    monday.setHours(0, 0, 0, 0);
    setCurrentWeekStart(monday);
  };

  // Format date as YYYY-MM-DD using local timezone (fixes timezone bug)
  const formatDateString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatDay = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (date) => {
    if (!selectedDate) return false;
    const dateStr = formatDateString(date);
    return dateStr === selectedDate;
  };

  const handleDateClick = (date) => {
    const dateStr = formatDateString(date);
    if (onDateSelect) {
      onDateSelect(dateStr);
    }
  };

  const weekRange = `${formatDate(weekDates[0])} - ${formatDate(weekDates[6])}`;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900">Select Travel Date</h3>
            <p className="text-sm text-gray-500">{weekRange}</p>
          </div>
        </div>
        <button
          onClick={goToCurrentWeek}
          className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          Today
        </button>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => navigateWeek('prev')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Previous week"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>

        <div className="flex-1 grid grid-cols-7 gap-2">
          {weekDates.map((date, index) => {
            // Format date as YYYY-MM-DD using local timezone
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const dateStr = `${year}-${month}-${day}`;
            const dayName = formatDay(date);
            const dateNum = date.getDate();
            const count = flightsCount[dateStr] || 0;
            const isLoading = loadingDates.has(dateStr);
            const today = isToday(date);
            const selected = isSelected(date);

            return (
              <button
                key={index}
                onClick={() => handleDateClick(date)}
                disabled={isLoading}
                className={`
                  relative p-3 rounded-xl border-2 transition-all duration-200
                  ${selected
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : today
                    ? 'border-blue-300 bg-blue-50/50'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/30'
                  }
                  ${isLoading ? 'opacity-50 cursor-wait' : 'cursor-pointer hover:shadow-md'}
                `}
              >
                <div className="text-center">
                  <div className={`text-xs font-medium mb-1 ${selected ? 'text-blue-600' : 'text-gray-500'}`}>
                    {dayName}
                  </div>
                  <div className={`text-lg font-bold mb-1 ${selected ? 'text-blue-600' : today ? 'text-blue-600' : 'text-gray-900'}`}>
                    {dateNum}
                  </div>
                  {isLoading ? (
                    <div className="h-4 w-4 mx-auto border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <div className="flex items-center justify-center gap-1">
                      {count > 0 ? (
                        <>
                          <Plane className="w-3 h-3 text-green-500" />
                          <span className="text-xs font-semibold text-green-600">{count}</span>
                        </>
                      ) : (
                        <span className="text-xs text-gray-400">-</span>
                      )}
                    </div>
                  )}
                </div>
                {today && !selected && (
                  <div className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => navigateWeek('next')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Next week"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="flex items-center justify-center gap-4 text-xs text-gray-500 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 border-2 border-blue-300 bg-blue-50/50 rounded"></div>
          <span>Today</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 border-2 border-blue-500 bg-blue-50 rounded"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <Plane className="w-3 h-3 text-green-500" />
          <span>Flights Available</span>
        </div>
      </div>
    </div>
  );
};

export default WeekCalendar;

