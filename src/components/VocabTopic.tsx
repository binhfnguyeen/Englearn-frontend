"use client"

import Apis from "@/configs/Apis";
import endpoints from "@/configs/Endpoints";
import { useEffect, useState } from "react"

interface Vocabulary {
    id: number;
    word: string,
    meaning: string,
    partOfSpeech: string,
    speech: string,
    picture: string
}

export default function VocabTopic({ topicId }: { topicId: number }) {
    const [vocabularies, setVocabularies] = useState<Vocabulary[]>([]);

    const loadVocabularies = async () => {
        try {
            let res = await Apis.get(endpoints["topic_vocabs"](topicId));
            setVocabularies(res.data.result);
        } catch (ex) {
            console.error(ex);
        }
    }

    useEffect(() => {
        loadVocabularies();
    }, [topicId]);

    return (
        <div className="container mt-4">
            <h2>Danh sách từ vựng</h2>
            {vocabularies.map((vocab) => (
                <div key={vocab.id} className="card my-3 p-3 shadow-sm">
                    <h5>{vocab.word} <small className="text-muted">({vocab.partOfSpeech})</small></h5>
                    <p>{vocab.meaning}</p>

                    {vocab.picture && (
                        <img
                            src={vocab.picture}
                            alt={vocab.word}
                            style={{ maxWidth: "200px", height: "auto" }}
                            className="mb-2"
                        />
                    )}

                    {vocab.speech && (
                        <audio controls>
                            <source src={vocab.speech} type="audio/mpeg" />
                            Trình duyệt của bạn không hỗ trợ phát âm thanh.
                        </audio>
                    )}
                </div>
            ))}
        </div>
    );
}