import Head from "next/head";
import { MouseEvent, useState } from "react";
import styles from "../styles/home.module.css";

interface Event {
  id: string;
  date: Date;
  title: string;
}

type Schedule = Map<string, Map<string, Event>>;

export default function Home() {
  const [date, setDate] = useState<Date>(() => new Date());
  const [schedule, setSchedule] = useState<Schedule>(() => new Map());

  const month = date.toLocaleDateString("es-UY", {
    month: "long",
    year: "numeric",
  });
  const month_capitalize = month.charAt(0).toUpperCase() + month.slice(1);

  const handleMonthChange = (offset: number) => {
    const draft = new Date(date);
    draft.setMonth(date.getMonth() + offset);
    setDate(draft);
  };

  const handleNewEvent = (key: string) => {
    const draft = new Map(schedule);
    if (!draft.has(key)) {
      draft.set(key, new Map());
    }
    const day = draft.get(key)!;
    const id = String(+new Date());
    const title = window.prompt("Event title");

    if (!title) return;

    day.set(id, {
      id,
      title,
      date: new Date(),
    });
    console.log(draft);
    setSchedule(draft);
  };

  const handleDeleteEvent = (ev: MouseEvent, key: string, event: Event) => {
    ev.stopPropagation();
    const draft = new Map(schedule);
    const day = draft.get(key)!;
    day.delete(event.id);
    setSchedule(draft);
  }

  return (
    <div>
      <Head>
        <title>Cookunity Challenge</title>
        <meta name="description" content="Challenge for CookUnity" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.calendar}>
          <nav className={styles.calendar_nav}>
            <button onClick={() => handleMonthChange(-1)}>←</button>
            <span className={styles.calendar_month}>{month_capitalize}</span>
            <button onClick={() => handleMonthChange(1)}>→</button>
          </nav>
          <div className={styles.calendar_inner}>
            {Array.from(
              {
                length: new Date(
                  date.getFullYear(),
                  date.getMonth() + 1,
                  0
                ).getDate(),
              },
              (_, i) => {
                const key = `${date.getFullYear()}/${date.getMonth() + 1}/${
                  i + 1
                }`;
                const events = schedule.get(key);
                return (
                  <div
                    onClick={() => handleNewEvent(key)}
                    key={i}
                    className={`${styles.calendar_day} ${i + 1} ${
                      i + 1 == date.getDate() ? styles.calendar_today : ""
                    }`}
                  >
                    <>
                      <div className={styles.calendary_day_number}>{i + 1}</div>
                      {events && (
                        <div className={styles.calendar_event_container}>
                          {Array.from(events.values()).map((event) => (
                            <div onClick={(ev) => handleDeleteEvent(ev, key, event)} className={styles.calendar_event} key={event.id}>{event.title}</div>
                          ))}
                        </div>
                      )}
                    </>
                  </div>
                );
              }
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
