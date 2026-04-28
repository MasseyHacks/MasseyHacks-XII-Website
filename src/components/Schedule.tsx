import { useEffect, useRef, useState } from 'react';
import '../styles/schedule.css';

interface ScheduleEvent {
  lane: number;
  startH: number;
  dur: number;
  title: string;
  sub: string;
  color: string;
  info: string;
}

// Layout constants
const COL_W = 300; // px per hour
const TOTAL_HOURS = 31.5; // 9AM Sat → 3:30PM Sun
const SAT_START_HOUR = 9;
const LANES = ['Logistics', 'Food', 'Workshops', 'Activities', 'Activities 2', 'Hacking'];

const scheduleEvents: ScheduleEvent[] = [
  // --- SATURDAY MAY 9 ---
  // Lane 0 - Logistics
  { lane: 0, startH: 0,     dur: 1,    title: 'Check-In',                        sub: '9:00AM – 10:00AM · Front Rotunda',    color: '#FFC3C3', info: 'Check in at the front desk to receive your hacker badge and welcome package!' },
  { lane: 0, startH: 1.5,   dur: 0.5,  title: 'Opening Ceremony',                sub: '10:30AM – 11:00AM · Gym',             color: '#9EF1EB', info: 'Join us for the official kickoff of MasseyHacks XII!' },
  { lane: 0, startH: 13,    dur: 0.5,  title: 'Check-Out',                       sub: '10:00PM – 10:30PM · Front Rotunda',   color: '#FFC3C3', info: 'Check out for the evening. See you tomorrow morning!' },

  // Lane 1 - Food
  { lane: 1, startH: 0,     dur: 1.25, title: 'Breakfast Snacks',                sub: '9:00AM – 10:15AM · Cafeteria',        color: '#FFA4D5', info: '' },
  { lane: 1, startH: 3.75,  dur: 1.25, title: 'Lunch',                           sub: '12:45PM – 2:00PM · Cafeteria',        color: '#FFA4D5', info: '' },
  { lane: 1, startH: 9.25,  dur: 1.25, title: 'Dinner',                          sub: '6:15PM – 7:30PM · Cafeteria',         color: '#FFA4D5', info: '' },

  // Lane 2 - Workshops
  { lane: 2, startH: 2,     dur: 0.5,  title: 'Team Formation',                  sub: '11:00AM – 11:30AM · Gym',             color: '#E1BDFF', info: 'Looking for team members? Join us to meet other hackers and form your dream team!' },
  { lane: 2, startH: 2.5,   dur: 1,    title: 'Workshop Incoming',                  sub: '11:30AM – 12:30PM · Workshop Room 1', color: '#ABFF80', info: 'Workshop TBD' },
  { lane: 2, startH: 5.25,  dur: 1,    title: 'Workshop Incoming',                      sub: '2:15PM – 3:15PM · Workshop Room 1',   color: '#ABFF80', info: 'Workshop TBD' },
  { lane: 2, startH: 6.5,   dur: 1,    title: 'Workshop Incoming ',                    sub: '3:30PM – 4:30PM · Workshop Room 1',   color: '#ABFF80', info: 'Workshop TBD' },
  { lane: 2, startH: 7.75,  dur: 1,    title: 'Origami',                         sub: '4:45PM – 5:45PM · Workshop Room 1',   color: '#ABFF80', info: '' },
  { lane: 2, startH: 8.75,  dur: 0.5,  title: 'Odette School of Business Talk',  sub: '5:45PM – 6:15PM · Workshop Room 1',   color: '#FF69B4', info: '' },
  { lane: 2, startH: 10.75, dur: 1,    title: 'MLH',                             sub: '7:45PM – 8:45PM · Workshop Room 1',   color: '#ABFF80', info: '' },

  // Lane 3 - Workshop Room 2 / Activities
  { lane: 3, startH: 2.5,   dur: 1,    title: 'Workshop Incoming',                  sub: '11:30AM – 12:30PM · Workshop Room 2', color: '#ABFF80', info: 'Workshop TBD' },
  { lane: 3, startH: 4.5,   dur: 0.5, title: 'Karaoke',                         sub: '1:30PM – 2PM · Cafeteria',         color: '#E1BDFF', info: '' },
  { lane: 3, startH: 5,     dur: 21,   title: 'HackengerHunt',                   sub: '2:00PM SAT – 11:00AM SUN · Online',   color: '#9BA3FF', info: 'Solve tech-related challenges for prizes and swag!' },
  { lane: 3, startH: 6.5,   dur: 1,    title: 'Cupstacking',                     sub: '3:15PM – 4:15PM · Cafeteria',         color: '#E1BDFF', info: 'A MasseyHacks favourite! Create the tallest cup tower possible!' },
  { lane: 3, startH: 12,    dur: 1,    title: 'Logic Puzzles & Riddles',          sub: '9:00PM – 10:00PM · Cafeteria',        color: '#E1BDFF', info: '' },
  { lane: 3, startH: 14,    dur: 2,    title: 'Clash Royale',                    sub: '11:00PM – 1:00AM · Online',          color: '#E1BDFF', info: '' },

  // Lane 4 - Activities 2
  { lane: 4, startH: 7.5,  dur: 0.5,  title: 'Tech Together',                   sub: '4:15PM – 4:45PM · Cafeteria',         color: '#E1BDFF', info: '' },
  { lane: 4, startH: 14,    dur: 2,    title: 'Minecraft',                       sub: '11:00PM – 1:00AM · Online',           color: '#E1BDFF', info: '' },
  { lane: 4, startH: 14,    dur: 2,    title: 'League of Legends',               sub: '11:00PM – 1:00AM · Online',           color: '#E1BDFF', info: '' },

  // Lane 5 - Hacking
  { lane: 5, startH: 2,     dur: 23.5, title: 'Hacking Period',                  sub: '11:00AM SAT – 10:30AM SUN',           color: '#a8d4ff', info: 'Work on your projects with your team! Mentors will be available throughout.' },

  // --- SUNDAY MAY 10 --- (startH = hours since 9AM Sat; 8AM Sun = +23h)
  // Lane 0 - Logistics
  { lane: 0, startH: 23,    dur: 1,    title: 'Check-In',                        sub: '8:00AM – 9:00AM · Front Rotunda',     color: '#FFC3C3', info: 'Welcome back! Check in to continue working on your projects.' },
  { lane: 0, startH: 29,    dur: 0.5,  title: 'Trivia',                          sub: '2:00PM – 2:30PM · Cafeteria',         color: '#E1BDFF', info: 'Test your MasseyHacks knowledge with fun trivia questions!' },
  { lane: 0, startH: 29.5,  dur: 0.5,  title: 'Closing Ceremony',                sub: '2:30PM – 3:00PM · Gym',               color: '#9EF1EB', info: "Join us for the final ceremony where we announce winners and celebrate everyone's hard work!" },
  { lane: 0, startH: 30,    dur: 0.5,  title: 'Check-Out',                       sub: '3:00PM – 3:30PM · Front Rotunda',     color: '#FFC3C3', info: 'Thank you for participating in MasseyHacks XII!' },

  // Lane 1 - Food
  { lane: 1, startH: 23.5,  dur: 1,    title: 'Breakfast',                       sub: '8:30AM – 9:30AM · Cafeteria',         color: '#FFA4D5', info: '' },
  { lane: 1, startH: 26,    dur: 1.5,  title: 'Group A Lunch',                   sub: '11:00AM – 12:30PM · Cafeteria',       color: '#FFA4D5', info: '' },
  { lane: 1, startH: 27.5,  dur: 1.5,  title: 'Group B Lunch',                   sub: '12:30PM – 2:00PM · Cafeteria',        color: '#FFA4D5', info: '' },

  // Lane 2 - Workshops
  { lane: 2, startH: 24.75, dur: 1,    title: 'Rocket Innovation',                          sub: '9:45AM – 10:45AM · Workshop Room 1',  color: '#ABFF80', info: '' },
  { lane: 2, startH: 26,    dur: 1.5,  title: 'Group B Judging',                 sub: '11:00AM – 12:30PM · Cafeteria',       color: '#9EF1EB', info: '' },
  { lane: 2, startH: 27.5,  dur: 1.5,  title: 'Group A Judging',                 sub: '12:30PM – 2:00PM · Cafeteria',        color: '#9EF1EB', info: '' },

  // Lane 3 - Activities
  { lane: 3, startH: 25,    dur: 0.5,  title: 'Submission Help',                 sub: '10:00AM – 10:30AM · TBD',             color: '#E1BDFF', info: '' },
  { lane: 4, startH: 24.83, dur: 1,    title: 'Startup Pitch Game',              sub: '9:50AM – 10:50AM · TBD',              color: '#E1BDFF', info: '' },
];
function darkenHex(hex: string, amount = 0.45): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgb(${Math.round(r * amount)},${Math.round(g * amount)},${Math.round(b * amount)})`;
}

function hourLabel(h: number): string {
  const abs = SAT_START_HOUR + h;
  const hr = abs % 24;
  const disp = hr === 0 ? 12 : hr > 12 ? hr - 12 : hr;
  const ampm = hr < 12 ? 'AM' : 'PM';
  return `${disp}${ampm}`;
}

export default function Schedule() {
  const [activePopup, setActivePopup] = useState<number | null>(null);
  const [popupPos, setPopupPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const scrollRef = useRef<HTMLDivElement>(null);

  const totalWidth = TOTAL_HOURS * COL_W;

  // Close popup on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.sch-event')) {
        setActivePopup(null);
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  // Shift+scroll → horizontal scroll
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      if (e.shiftKey) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };
    el.addEventListener('wheel', handler, { passive: false });
    return () => el.removeEventListener('wheel', handler);
  }, []);

  function handleEventClick(e: React.MouseEvent, idx: number) {
    e.stopPropagation();
    if (activePopup === idx) {
      setActivePopup(null);
      return;
    }
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    let top = rect.bottom + 8;
    let left = rect.left;
    if (left + 320 > window.innerWidth) left = window.innerWidth - 328;
    if (left < 8) left = 8;
    if (top + 130 > window.innerHeight) top = rect.top - 138;
    setPopupPos({ top, left });
    setActivePopup(idx);
  }

  // Hour tick marks — every 2 hours
  const hourTicks: number[] = [];
  for (let h = 0; h <= TOTAL_HOURS; h += 2) hourTicks.push(h);

  // All hour grid lines (every 1 hour)
  const gridLines: number[] = [];
  for (let h = 0; h <= TOTAL_HOURS; h++) gridLines.push(h);

  const activeEvent = activePopup !== null ? scheduleEvents[activePopup] : null;

  return (
    <section id="schedule" className="relative py-12 sm:py-16 md:py-24 px-4 sm:px-6">
      <div className="schedule-container">

        {/* Title */}
        <div className="schedule-title">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center mb-2 sm:mb-3 drop-shadow-lg">
            Schedule
          </h1>
          <h5 className="text-sm sm:text-base md:text-lg text-white/90 text-center drop-shadow-md">
            Click on the events for more info!
          </h5>
        </div>

        {/* Scrollable timeline */}
        <div ref={scrollRef} className="timeline-wrapper">
          <div style={{ width: totalWidth + 100, minWidth: 'max-content', paddingRight: 24, paddingBottom: 8 }}>

            {/* Hour labels */}
            <div className="sch-header-row">
              <div className="sch-lane-label-col" />
              <div style={{ position: 'relative', width: totalWidth, height: 28, flexShrink: 0 }}>
                {hourTicks.map(h => (
                  <span
                    key={h}
                    className="sch-hour-label"
                    style={{ left: h * COL_W }}
                  >
                    {hourLabel(h)}
                  </span>
                ))}
              </div>
            </div>

            {/* Saturday label */}
            <div className="sch-day-divider">
              <div className="sch-lane-label-col" />
              <div className="sch-day-line" />
              <span className="sch-day-text">Saturday, May 9</span>
              <div className="sch-day-line" />
            </div>

            {/* Lanes */}
            {LANES.map((laneName, laneIdx) => (
              <div key={laneIdx} className="sch-lane-row">
                {/* Lane label */}
                <div className="sch-lane-label-col">
                  <span className="sch-lane-label">{laneName}</span>
                </div>

                {/* Lane track */}
                <div className="sch-lane-track" style={{ width: totalWidth }}>

                  {/* Grid lines */}
                  {gridLines.map(h => (
                    <div
                      key={h}
                      className={h % 2 === 0 ? 'sch-grid-line' : 'sch-grid-line-half'}
                      style={{ left: h * COL_W }}
                    />
                  ))}

                  {/* Sunday marker */}
                  <div className="sch-sunday-marker" style={{ left: 23 * COL_W }} />

                  {/* Events in this lane */}
                  {scheduleEvents.map((ev, evIdx) => {
                    if (ev.lane !== laneIdx) return null;
                    const textColor = darkenHex(ev.color);
                    return (
                      <div
                        key={evIdx}
                        className="sch-event"
                        style={{
                          left: ev.startH * COL_W + 2,
                          width: ev.dur * COL_W - 4,
                          background: ev.color,
                        }}
                        onClick={(e) => handleEventClick(e, evIdx)}
                      >
                        <span className="sch-event-title" style={{ color: textColor }}>
                          {ev.title}
                        </span>
                        <span className="sch-event-sub" style={{ color: textColor }}>
                          {ev.sub}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Sunday label */}
            <div className="sch-day-divider" style={{ marginTop: 8 }}>
              <div className="sch-lane-label-col" />
              <div className="sch-day-line" />
              <span className="sch-day-text">Sunday, May 10</span>
              <div className="sch-day-line" />
            </div>

          </div>
        </div>

        <p id="scroll_tip" className="text-xs sm:text-sm text-white/70 text-center italic mt-4">
          Tip: shift + scroll to scroll horizontally
        </p>
      </div>

      {/* Popup — fixed position, outside scroll container */}
      {activeEvent && (
        <div
          className="sch-popup"
          style={{ top: popupPos.top, left: popupPos.left }}
          onClick={(e) => e.stopPropagation()}
        >
          <h2>{activeEvent.title}</h2>
          <p>{activeEvent.sub}</p>
          {activeEvent.info && <p>{activeEvent.info}</p>}
        </div>
      )}
    </section>
  );
}