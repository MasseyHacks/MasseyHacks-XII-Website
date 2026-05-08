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
const LANES = ['Logistics', 'Food', 'Workshops', 'Activities', 'Activities 2', 'Activites 3','Hacking'];

const scheduleEvents: ScheduleEvent[] = [
  // ─── SATURDAY MAY 9 ───────────────────────────────────────────────────────

  // Lane 0 – Logistics
  { lane: 0, startH: 0,     dur: 1,    title: 'Check-In',                          sub: '9:00AM – 10:00AM · Front Rotunda',     color: '#FFC3C3', info: 'Check in at the front desk to receive your hacker badge and welcome package!' },
  { lane: 0, startH: 1.5,   dur: 0.5,  title: 'Opening Ceremony',                  sub: '10:30AM – 11:00AM · Gym',              color: '#9EF1EB', info: 'Join us for the official kickoff of MasseyHacks XII!' },
  { lane: 0, startH: 13,    dur: 0.5,  title: 'Check-Out',                         sub: '10:00PM – 10:30PM · Front Rotunda',    color: '#FFC3C3', info: 'Check out for the evening. See you tomorrow morning!' },

  // Lane 1 – Food
  { lane: 1, startH: 0,     dur: 1.25, title: 'Breakfast Snacks',                  sub: '9:00AM – 10:15AM · Cafeteria',         color: '#FFA4D5', info: '' },
  { lane: 1, startH: 3.75,  dur: 1.25, title: 'Lunch',                             sub: '12:45PM – 2:00PM · Cafeteria',         color: '#FFA4D5', info: '' },
  { lane: 1, startH: 9.25,  dur: 1.25, title: 'Dinner',                            sub: '6:15PM – 7:30PM · Cafeteria',          color: '#FFA4D5', info: '' },

  // Lane 2 – Workshops Room 101
  { lane: 2, startH: 2,     dur: 0.5,  title: 'Team Formation',                    sub: '11:00AM – 11:30AM · Gym',              color: '#E1BDFF', info: 'Looking for team members? Join us to meet other hackers and form your dream team!' },
  { lane: 2, startH: 2.5,   dur: 1,    title: 'Developing and Debugging Websites', sub: '11:30AM – 12:30PM · Room 101',         color: '#ABFF80', info: 'Planning to make a website? Come learn tips and tricks from a seasoned professional Web Developer. Topics include front-end frameworks, making the most of your debug tools, and back-end architecture. Whether you\'ve never touched web code or made websites before, there\'s something for everyone. Hosted by Alex Millerman. Prerequisites: editor of choice (e.g. VSCode) and your browser.' },
  { lane: 2, startH: 5.25,  dur: 1,    title: 'Game Development with Godot',       sub: '2:15PM – 3:15PM · Room 101',           color: '#ABFF80', info: 'Get a hands-on introduction to the Godot game engine! Learn what a game engine does behind the scenes, walk through the basics of the editor and GDScript, and build a simple playable maze game. Hosted by Adam Mehdi. Prerequisites: knowledge of if statements, loops, and lists; install Godot beforehand.' },
  { lane: 2, startH: 7.75,  dur: 1,    title: 'Origami',                           sub: '4:45PM – 5:45PM · Room 101',           color: '#E1BDFF', info: 'Create your own sea animal origami while learning simple paper-folding techniques. A relaxing, beginner-friendly activity where you can work alongside fellow participants to make your favourite sea creatures!' },
  { lane: 2, startH: 8.75,  dur: 0.5,  title: 'Odette School of Business Talk',    sub: '5:45PM – 6:15PM · Sponsor Booths',     color: '#FF69B4', info: 'Learn more about the Odette School of Business and the programs that they offer!' },
  { lane: 2, startH: 10.5,  dur: 0.75, title: 'Github Copilot',                    sub: '7:30PM – 8:15PM · Room 149',           color: '#ABFF80', info: 'Elevate your hackathon game! Join this workshop on Making Better Hacks, Faster with GitHub Copilot, and discover how this AI companion transforms the coding experience for beginners and seasoned developers. Copilot isn\'t just another tool — it\'s like having another hacker on your team! Hosted by Major League Hacking.' },

  // Lane 3 – Activities / Room 149
  { lane: 3, startH: 2.5,   dur: 1,    title: 'Introduction to Python with mckPy', sub: '11:30AM – 12:30PM · Room 149',         color: '#ABFF80', info: 'An introduction to programming and how to think like a programmer, using a custom package (mckPy) built on pygame. Learn to draw shapes, create graphical programs, and build interactive projects. Hosted by Mr. McKenzie. Prerequisites: install Python with pygame.' },
  { lane: 3, startH: 5,     dur: 1,    title: 'St. Clair College Talk',            sub: '2:00PM – 3:00PM · Room 149',           color: '#9EF1EB', info: 'Learn more about the programs available in the Zekelman School of IT at St. Clair College. Hosted by Darren Takaki.' },
  { lane: 3, startH: 6.5,   dur: 1,    title: 'Debugging C++ with Visual Studio',  sub: '3:30PM – 4:30PM · Room 149',           color: '#ABFF80', info: 'Don\'t be the person who only uses print statements! Learn how to use Visual Studio\'s GUI-based debugger — skills that generalize to other debuggers too. An interactive session with simple steps to get comfortable fast. Hosted by Claire Andrews. Prerequisites: Visual Studio 2019 or later with "Desktop development with C++" workload.' },
  { lane: 4, startH: 6.25,  dur: 1,    title: 'Cupstacking',                       sub: '3:15PM – 4:15PM · Cafeteria',          color: '#E1BDFF', info: 'Work together in teams to complete fast-paced cup stacking challenges that test communication, coordination, and problem-solving skills. A quick and fun way to break the ice and build teamwork!' },
  { lane: 3, startH: 7.5,   dur: 0.5,  title: 'Tech Together',                     sub: '4:15PM – 4:45PM · Cafeteria',          color: '#E1BDFF', info: 'An underrepresented genders (and allies!) meetup — connect, share ideas, and meet other hackers who identify as an underrepresented gender.' },
  { lane: 3, startH: 8.5,   dur: 1,    title: 'Start-up Pitch Game',               sub: '5:30PM – 6:30PM · Room 149',           color: '#E1BDFF', info: 'Pitch the next billion dollar startup using a completely random slideshow you\'ve never seen before! Think slideshow karaoke, but startup edition. Improvise your way through wild ideas, unexpected products, and chaotic investor pitches.' },
  { lane: 3, startH: 11.5,  dur: 1,    title: 'Werewolf',                           sub: '8:30PM – 9:30PM · Cafeteria',          color: '#E1BDFF', info: 'A classic social deduction game where villagers work together to uncover the hidden werewolves before it\'s too late. Bluff, debate, and survive the night!' },
  { lane: 4, startH: 12,    dur: 1,    title: 'Karaoke',                            sub: '9:00PM – 10:00PM · Cafeteria',         color: '#E1BDFF', info: 'Sing your favorite songs with friends in a fun and relaxed karaoke session! Whether you\'re a great singer or just here for the chaos, everyone is welcome to grab the mic and join in.' },
  { lane: 3, startH: 14.5,  dur: 1,    title: 'Clash Royale',                       sub: '11:30PM – 12:30AM · Online',           color: '#E1BDFF', info: 'Play Clash Royale online with fellow hackers! Find us on the MasseyHacks XII Discord server.' },

  // Lane 4 – Activities 2
  { lane: 5, startH: 5,     dur: 21,   title: 'HackengerHunt',                    sub: '2:00PM SAT – 11:00AM SUN · Online',    color: '#9BA3FF', info: 'Solve tech-related challenges for prizes and swag!' },
  { lane: 4, startH: 14.5,  dur: 1.5,  title: 'Minecraft Bedwars',                sub: '11:30PM – 1:00AM · Online',            color: '#E1BDFF', info: '' },
  { lane: 5, startH: 14.5,  dur: 1.5,  title: 'League of Legends',                sub: '11:30PM – 1:00AM · Online',            color: '#C8E6C9', info: '' },

  // Lane 6 – Hacking
  { lane: 6, startH: 2,     dur: 23.5, title: 'Hacking Period',                   sub: '11:00AM SAT – 10:30AM SUN',            color: '#a8d4ff', info: 'Work on your projects with your team! Mentors will be available throughout.' },

  // ─── SUNDAY MAY 10 ────────────────────────────────────────────────────────

  // Lane 0 – Logistics
  { lane: 0, startH: 23,    dur: 1,    title: 'Check-In',                         sub: '8:00AM – 9:00AM · Front Rotunda',      color: '#FFC3C3', info: 'Welcome back! Check in to continue working on your projects.' },
  { lane: 0, startH: 29,    dur: 0.5,  title: 'Trivia',                           sub: '2:00PM – 2:30PM · Cafeteria',          color: '#E1BDFF', info: 'Test your MasseyHacks knowledge with fun trivia questions!' },
  { lane: 0, startH: 29.5,  dur: 0.5,  title: 'Closing Ceremony',                 sub: '2:30PM – 3:00PM · Gym',                color: '#9EF1EB', info: "Join us for the final ceremony where we announce winners and celebrate everyone's hard work!" },
  { lane: 0, startH: 30,    dur: 0.5,  title: 'Check-Out',                        sub: '3:00PM – 3:30PM · Front Rotunda',      color: '#FFC3C3', info: 'Thank you for participating in MasseyHacks XII!' },

  // Lane 1 – Food
  { lane: 1, startH: 23.5,  dur: 1,    title: 'Breakfast',                        sub: '8:30AM – 9:30AM · Cafeteria',          color: '#FFA4D5', info: '' },
  { lane: 1, startH: 26,    dur: 1.5,  title: 'Group A Lunch',                    sub: '11:00AM – 12:30PM · Cafeteria',        color: '#FFA4D5', info: '' },
  { lane: 1, startH: 27.5,  dur: 1.5,  title: 'Group B Lunch',                    sub: '12:30PM – 2:00PM · Cafeteria',         color: '#FFA4D5', info: '' },

  // Lane 2 – Workshops
  { lane: 2, startH: 24.75, dur: 1,    title: 'Humans in the Loop: How AI, Social Media, and You Shape Modern Applications', sub: '9:45AM – 10:45AM · Room 149', color: '#ABFF80', info: 'Explore how Instagram, TikTok, and YouTube work behind the scenes—how your actions, algorithms, and AI all shape what you see online. Then take part in a live, guided build where we create a small app together using an AI coding assistant. Hosted by Sasanka Vithanage (Rocket Innovation Studio).' },
  { lane: 2, startH: 26,    dur: 1.5,  title: 'Group B Judging',                  sub: '11:00AM – 12:30PM · Cafeteria',        color: '#9EF1EB', info: '' },
  { lane: 2, startH: 27.5,  dur: 1.5,  title: 'Group A Judging',                  sub: '12:30PM – 2:00PM · Cafeteria',         color: '#9EF1EB', info: '' },

  // Lane 3 – Activities
  { lane: 3, startH: 25,    dur: 0.5,  title: 'Submission Help',                  sub: '10:00AM – 10:30AM · TBD',              color: '#E1BDFF', info: '' },
  { lane: 3, startH: 24.83, dur: 1,    title: 'Startup Pitch Game',               sub: '9:50AM – 10:50AM · TBD',               color: '#E1BDFF', info: '' },
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

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.sch-event')) {
        setActivePopup(null);
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

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

  const hourTicks: number[] = [];
  for (let h = 0; h <= TOTAL_HOURS; h += 2) hourTicks.push(h);

  const gridLines: number[] = [];
  for (let h = 0; h <= TOTAL_HOURS; h++) gridLines.push(h);

  const activeEvent = activePopup !== null ? scheduleEvents[activePopup] : null;

  return (
    <section id="schedule" className="relative py-12 sm:py-16 md:py-24 px-4 sm:px-6">
      <div className="schedule-container">

        <div className="schedule-title">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center mb-2 sm:mb-3 drop-shadow-lg">
            Schedule
          </h1>
          <h5 className="text-sm sm:text-base md:text-lg text-white/90 text-center drop-shadow-md">
            Click on the events for more info!
          </h5>
        </div>

        <div ref={scrollRef} className="timeline-wrapper">
          <div style={{ width: totalWidth + 100, minWidth: 'max-content', paddingRight: 24, paddingBottom: 8 }}>

            {/* Hour labels */}
            <div className="sch-header-row">
              <div className="sch-lane-label-col" />
              <div style={{ position: 'relative', width: totalWidth, height: 28, flexShrink: 0 }}>
                {hourTicks.map(h => (
                  <span key={h} className="sch-hour-label" style={{ left: h * COL_W }}>
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
                <div className="sch-lane-label-col">
                  <span className="sch-lane-label">{laneName}</span>
                </div>
                <div className="sch-lane-track" style={{ width: totalWidth }}>
                  {gridLines.map(h => (
                    <div
                      key={h}
                      className={h % 2 === 0 ? 'sch-grid-line' : 'sch-grid-line-half'}
                      style={{ left: h * COL_W }}
                    />
                  ))}
                  <div className="sch-sunday-marker" style={{ left: 23 * COL_W }} />
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
                        <span className="sch-event-title" style={{ color: textColor }}>{ev.title}</span>
                        <span className="sch-event-sub" style={{ color: textColor }}>{ev.sub}</span>
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