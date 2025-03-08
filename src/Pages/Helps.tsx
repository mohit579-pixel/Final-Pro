import { useState, useEffect } from "react";
import Modal from "./Modal";

const getDaysInMonth = (month: number, year: number) => {
  const days = [];
  const date = new Date(year, month, 1);
  while (date.getMonth() === month) {
    days.push({
      day: date.toLocaleString("en-US", { weekday: "long" }),
      date: date.getDate(),
    });
    date.setDate(date.getDate() + 1);
  }
  return days;
};

const Helps = () => {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [startIndex, setStartIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [content, setContent] = useState<{ [key: string]: string }>({});

  const allDays = getDaysInMonth(month, year);
  const todayIndex = allDays.findIndex((d) => d.date === today.getDate()) || 0;

  useEffect(() => {
    setStartIndex(todayIndex);
  }, [month, year]);

  const displayedDays = allDays.slice(startIndex, startIndex + 5);

  const handleNext = () => {
    if (startIndex + 5 < allDays.length) setStartIndex(startIndex + 1);
  };

  const handlePrev = () => {
    if (startIndex > todayIndex) setStartIndex(startIndex - 1);
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
    setStartIndex(0);
  };

  const handlePrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
    setStartIndex(0);
  };

  const handleNextYear = () => {
    setYear(year + 1);
    setStartIndex(0);
  };

  const handlePrevYear = () => {
    setYear(year - 1);
    setStartIndex(0);
  };

  const handleDateClick = (date: string) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleSaveContent = (content: string) => {
    setContent((prevContent) => ({
      ...prevContent,
      [selectedDate]: content,
    }));
    // Save content to backend here
  };
  console.log(content);

  return (
    <div className="flex flex-col items-center bg-gray-900 text-white p-6 rounded-lg shadow-xl w-full">
      <h2 className="text-2xl font-bold mb-4">
        {new Date(year, month).toLocaleString("en-US", { month: "long" })} {year}
      </h2>
      
      {/* Date List */}
      <div className="flex flex-row space-x-2 w-full">
        {displayedDays.map((d, index) => (
          <div
            key={index}
            className="flex-1 bg-gray-800 p-3 rounded-lg text-center shadow-md cursor-pointer"
            onClick={() => handleDateClick(`${d.date}-${month + 1}-${year}`)}
          >
            <p className="text-lg font-semibold">{d.day}</p>
            <p className="text-xl font-bold">{d.date}</p>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between w-full mt-4">
        <button onClick={handlePrev} disabled={startIndex === todayIndex} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 rounded-lg">
          ◀
        </button>
        <button onClick={handleNext} disabled={startIndex + 5 >= allDays.length} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 rounded-lg">
          ▶
        </button>
      </div>

      {/* Display Content */}
      {selectedDate && content[selectedDate] && (
        <div className="mt-4 p-4 bg-gray-800 rounded-lg shadow-md w-full">
          <h3 className="text-lg font-bold mb-2">Content for {selectedDate}</h3>
          <p>{content[selectedDate]}</p>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveContent}
        date={selectedDate}
      />
    </div>
  );
};

export default Helps;