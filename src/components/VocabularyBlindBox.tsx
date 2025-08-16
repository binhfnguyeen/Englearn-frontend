"use client";
import { useContext, useEffect, useState } from "react";
import styles from "@/components/VocabularyBlindBox.module.css";
import UserContext from "@/configs/UserContext";
import Apis from "@/configs/Apis";
import endpoints from "@/configs/Endpoints";
import MySpinner from "./MySpinner";

interface Word {
  id: number;
  word: string;
  meaning: string;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  isActive: boolean;
  avatar: string;
  role: string;
}

interface Progress {
  userId: User;
  daysStudied: number;
  wordsLearned: number;
  level: string;
}

export default function VocabularyBlindBox() {
  const [words, setWords] = useState<Word[]>([]);
  const [progress, setProgress] = useState<Progress>();
  const [loading, setLoading] = useState<boolean>(false);

  const [flipped, setFlipped] = useState<boolean[]>([false, false, false]);

  const context = useContext(UserContext);
  if (!context) return null;
  const { user } = context;

  const loadProgress = async () => {
    try {
      setLoading(true);
      let res = await Apis.get(endpoints["progress"](user.result.id));
      setProgress(res.data.result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadWords = async (progress: Progress) => {
    try {
      setLoading(true);
      const res = await fetch("/api/blindbox", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ progress }),
      });

      if (!res.ok) throw new Error("Gemini API error");
      const data: Word[] = await res.json();
      setWords(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const toggleFlip = (index: number) => {
    setFlipped((prev) =>
      prev.map((f, i) => (i === index ? !f : f))
    );
  };

  useEffect(() => {
    if (words.length > 0) {
      setFlipped(Array(words.length).fill(false));
    }
  }, [words]);

  useEffect(() => {
    loadProgress();
  }, [user])

  useEffect(() => {
    if (progress)
      loadWords(progress);
  }, [progress])

  return (
    <div className={styles.container}>
      {words.map((w, index) => (
        <div
          key={w.id}
          className={`${styles.card} ${flipped[index] ? styles.flipped : ""}`}
          onClick={() => toggleFlip(index)}
        >
          <div className={styles.inner}>
            <div className={styles.front}>
              <h3>{w.word}</h3>
            </div>
            <div className={styles.back}>
              <p>{w.meaning}</p>
            </div>
          </div>
        </div>
      ))}

      {loading && <MySpinner />}
    </div>
  );
}
