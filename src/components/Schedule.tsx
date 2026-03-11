import { useEffect, useRef, useState } from 'react';
import '../styles/schedule.css';

interface ScheduleEvent {
  row: number;
  col: number;
  startGap: number;
  duration: number;
  title: string;
  description: string;
  color: string;
  info: string;
}

const colAmt = 34;
const rowAmt = 4;
const eventStartTime = 9;
const lineHeight = '90px';

const scheduleEvents: ScheduleEvent[] = [
  { row: 1, col: 1, startGap: 0, duration: 1, title: 'Check-In', description: '9:00AM - 10:00AM | Front Desk', color: '#FFC3C3', info: 'Check in at the front desk to receive your hacker badge and welcome package!' },
  { row: 1, col: 2, startGap: 0.5, duration: 0.5, title: 'Opening Ceremony', description: '10:30AM - 11:00AM | North Gym', color: '#9EF1EB', info: 'Join us for the official kickoff of MasseyHacks XII! Learn about the event schedule, rules, and prizes.' },
  { row: 4, col: 3, startGap: 0, duration: 24, title: 'Hacking Period', description: '11:00AM - 11:00AM | ', color: '#a8d4ff', info: 'Work on your projects with your team! Mentors will be available to help throughout the hacking period.' },
  { row: 3, col: 3, startGap: 0, duration: 0.5, title: 'Team Formation', description: '11:00AM - 11:30AM | North Gym', color: '#E1BDFF', info: 'Looking for team members? Join us to meet other hackers and form your dream team!' },
  { row: 2, col: 1, startGap: 0, duration: 1.25, title: 'Breakfast Snacks', description: '9:00AM - 10:15AM | Cafeteria', color: '#FFA4D5', info: '' },
  { row: 2, col: 5, startGap: 0, duration: 1.25, title: 'Lunch', description: '1:00PM - 2:15PM | Cafeteria', color: '#FFA4D5', info: '' },
  { row: 1, col: 3, startGap: 0.75, duration: 1, title: 'Intro to Web Dev', description: '11:45AM - 12:45PM | Room 149', color: '#ABFF80', info: 'Learn the basics of web development with HTML, CSS, and JavaScript. Perfect for beginners!' },
  { row: 2, col: 3, startGap: 0.75, duration: 1, title: 'React Workshop', description: '11:45AM - 12:45PM | Room 101', color: '#ABFF80', info: 'Build your first React application in this hands-on workshop.' },
  { row: 1, col: 6, startGap: 0.5, duration: 1, title: 'Python Basics', description: '2:30PM - 3:30PM | Room 149', color: '#ABFF80', info: 'Introduction to Python programming. Learn variables, loops, and functions!' },
  { row: 2, col: 6, startGap: 0.5, duration: 1, title: 'API Development', description: '2:30PM - 3:30PM | Room 101', color: '#ABFF80', info: 'Learn how to build RESTful APIs and integrate them into your projects.' },
  { row: 1, col: 7, startGap: 0.5, duration: 1, title: 'Cupstacking', description: '3:30PM - 4:30PM | Cafeteria', color: '#E1BDFF', info: 'A MasseyHacks favourite! Create the tallest cup tower possible!' },
  { row: 1, col: 9, startGap: 0, duration: 1, title: 'GitHub Workshop', description: '5:00PM - 6:00PM | Room 101', color: '#ABFF80', info: 'Learn version control with Git and GitHub. Essential for any developer!' },
  { row: 2, col: 9, startGap: 0, duration: 1, title: 'Hardware Hacking', description: '5:00PM - 6:00PM | Cafeteria', color: '#ABFF80', info: 'Get hands-on with Arduino and Raspberry Pi. Build your first IoT project!' },
  { row: 2, col: 10, startGap: 0.25, duration: 1.25, title: 'Dinner', description: '6:15PM - 7:30PM | Cafeteria', color: '#FFA4D5', info: '' },
  { row: 1, col: 11, startGap: 0.5, duration: 0.5, title: 'Careers in Tech', description: '7:30PM - 8:00PM | Cafeteria', color: '#ABFF80', info: 'Learn about different career paths in technology from industry professionals!' },
  { row: 1, col: 12, startGap: 0, duration: 1, title: 'AI/ML Workshop', description: '8:00PM - 9:00PM | Room 101', color: '#ABFF80', info: 'Introduction to Artificial Intelligence and Machine Learning concepts.' },
  { row: 2, col: 13, startGap: 0, duration: 1, title: 'Karaoke', description: '9:00PM - 10:00PM | Cafeteria', color: '#E1BDFF', info: 'Take a break and show off your singing skills!' },
  { row: 1, col: 14, startGap: 0, duration: 0.5, title: 'Check-Out', description: '10:00PM - 10:30PM | Front Desk', color: '#FFC3C3', info: 'Check out for the evening. See you tomorrow morning!' },
  { row: 3, col: 10, startGap: 0, duration: 18, title: 'Hackenger Hunt', description: '6:00PM - 12:00PM | Online', color: '#9BA3FF', info: 'Solve tech-related challenges for prizes and swag!' },
  { row: 2, col: 15, startGap: 0.5, duration: 1, title: 'Skribbl.io', description: '11:30PM - 12:30AM | Online', color: '#E1BDFF', info: '' },
  { row: 2, col: 17, startGap: 0, duration: 1, title: 'Minecraft Tournament', description: '1:00AM - 2:00AM | Online', color: '#E1BDFF', info: '' },
  { row: 1, col: 24, startGap: 0, duration: 1, title: 'Check-In', description: '8:00AM - 9:00AM | Front Desk', color: '#FFC3C3', info: 'Welcome back! Check in to continue working on your projects.' },
  { row: 2, col: 24, startGap: 0.5, duration: 1, title: 'Pancake Breakfast', description: '8:30AM - 9:30AM | Cafeteria', color: '#FFA4D5', info: '' },
  { row: 2, col: 26, startGap: 0, duration: 1.5, title: 'Therapy Dogs', description: '10:00AM - 11:30AM | Room 101', color: '#E1BDFF', info: '' },
  { row: 2, col: 28, startGap: 0.5, duration: 1.5, title: 'Lunch', description: '12:30PM - 2:00PM | Cafeteria', color: '#FFA4D5', info: '' },
  { row: 3, col: 30, startGap: 0, duration: 2, title: 'Judging', description: '2:00PM - 4:00PM | Cafeteria', color: '#9EF1EB', info: '' },
  { row: 1, col: 32, startGap: 0.5, duration: 0.5, title: 'Closing Ceremony', description: '4:30PM - 5:00PM | North Gym', color: '#9EF1EB', info: 'Join us for the final ceremony where we announce winners and celebrate everyone\'s hard work!' },
  { row: 2, col: 32, startGap: 0, duration: 0.5, title: 'Trivia', description: '4:00PM - 4:30PM | Cafeteria', color: '#E1BDFF', info: 'Test your MasseyHacks knowledge with fun trivia questions!' },
  { row: 2, col: 33, startGap: 0, duration: 0.5, title: 'Check-Out', description: '5:00PM - 5:30PM | Front Desk', color: '#FFC3C3', info: 'Thank you for participating in MasseyHacks XII!' }
];

export default function Schedule() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [activePopup, setActivePopup] = useState<number | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.popup')) {
        setActivePopup(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const renderTimeline = () => {
    const columns: JSX.Element[][] = Array.from({ length: colAmt }, () => []);

    scheduleEvents.forEach((event, eventIndex) => {
      const { row, col, startGap, duration, title, description, color, info } = event;
      const [desc1, desc2] = description.split(' | ');

      const remainingGap = 1 - startGap - Math.floor(startGap);
      let durationFilled;
      let width;

      if (duration <= remainingGap) {
        durationFilled = duration;
        width = `${duration * 100}%`;
      } else {
        durationFilled = remainingGap;
        width = `${remainingGap * 110}%`;
      }

      const left = `${(startGap - Math.floor(startGap)) * 100}%`;

      const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setActivePopup(activePopup === eventIndex ? null : eventIndex);
      };

      const firstCell = (
        <div
          key={`event-${eventIndex}-0`}
          className="timeline-event popup"
          style={{
            width,
            left,
            height: lineHeight,
            backgroundColor: color,
            position: 'absolute',
            boxShadow: '0 3px 10px -8px rgb(0 0 0 / 0.3)',
            borderRadius: '10px',
            marginLeft: remainingGap === 1 ? '2px' : '0',
          }}
          onClick={handleClick}
        >
          <div className="timeline-text-section">
            <h5>{title}</h5>
            <p>{desc1}</p>
            {desc2 && <p>{desc2}</p>}
          </div>
          <div className={`popuptext ${activePopup === eventIndex ? 'show' : ''}`} style={{ bottom: row === 2 || row === 3 ? 'unset' : '0', top: row === 2 || row === 3 ? '0' : 'unset' }}>
            <h2>{title}</h2>
            <p>{description}</p>
            {info && <p>{info}</p>}
          </div>
        </div>
      );

      if (columns[col - 1] && columns[col - 1][row - 1] === undefined) {
        columns[col - 1][row - 1] = firstCell;
      }

      let time = durationFilled;
      let colCounter = 1;

      while (time + 2 <= Math.floor(duration)) {
        const fullCell = (
          <div
            key={`event-${eventIndex}-${colCounter}`}
            className="timeline-event"
            style={{
              width: '100%',
              height: lineHeight,
              backgroundColor: color,
              position: 'absolute'
            }}
            onClick={handleClick}
          />
        );

        if (columns[col - 1 + colCounter]) {
          columns[col - 1 + colCounter][row - 1] = fullCell;
        }
        time++;
        colCounter++;
      }

      if (duration - time > 0.001 && time < duration) {
        const endCell = (
          <div
            key={`event-${eventIndex}-${colCounter}`}
            className="timeline-event"
            style={{
              width: `${(duration - time) * 100 + 10}%`,
              marginLeft: '-30px',
              height: lineHeight,
              backgroundColor: color,
              boxShadow: '0 3px 10px -8px rgb(0 0 0 / 0.3)',
              borderRadius: '10px',
              position: 'relative'
            }}
            onClick={handleClick}
          />
        );

        if (columns[col - 1 + colCounter]) {
          columns[col - 1 + colCounter][row - 1] = endCell;
        }
      }
    });

    return columns.map((column, colIndex) => {
      const hour = ((eventStartTime + colIndex - 1) % 12) + 1;
      const period = (eventStartTime + colIndex) % 24 >= 12 ? 'PM' : 'AM';

      return (
        <div key={colIndex} className="timeline-col-container">
          <div className="timeline-label">{`${hour}:00 ${period}`}</div>
          {Array.from({ length: rowAmt }).map((_, rowIndex) => (
            <div key={rowIndex}>
              <div className="timeline-cell">
                {column[rowIndex]}
              </div>
              <div className="divvy" />
            </div>
          ))}
        </div>
      );
    });
  };

  return (
    <section id="schedule" className="relative py-12 sm:py-16 md:py-24 px-4 sm:px-6">
      <div className="schedule-container">
        <div className="schedule-title">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center mb-2 sm:mb-3 drop-shadow-lg">Schedule</h1>
          <h5 className="text-sm sm:text-base md:text-lg text-white/90 text-center drop-shadow-md">Click on the events for more info!</h5>
        </div>
        <div ref={wrapperRef} className="timeline-wrapper">
          {renderTimeline()}
        </div>
        <h5 id="scroll_tip" className="text-xs sm:text-sm text-white/70 text-center italic mt-4">
          Tip: shift + scroll to scroll horizontally
        </h5>
      </div>
    </section>
  );
}
