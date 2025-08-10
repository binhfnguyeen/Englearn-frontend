"use client"
import MySpinner from "@/components/MySpinner";
import Apis from "@/configs/Apis";
import endpoints from "@/configs/Endpoints";
import UserContext from "@/configs/UserContext";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { Button, Card, Container, ProgressBar } from "react-bootstrap";
import * as Icon from 'react-bootstrap-icons';
import { Await } from "react-router-dom";
import Swal from "sweetalert2";

interface Vocabulary {
    id: number;
    word: string;
    meaning: string;
    partOfSpeech: string;
    speech: string;
    picture: string;
}

export default function Learning() {
    const { topicId } = useParams();
    const id = Number(topicId);
    const router = useRouter();
    const context = useContext(UserContext);
    const [total, setTotal] = useState<number>(0);
    const [vocabularies, setVocabularies] = useState<Vocabulary[]>([]);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(false);

    if (!context) return null;

    const { user, dispatch } = context;

    const loadVocabularies = async () => {
        let url = `${endpoints["topic_vocabs"](id)}?page=${page}&size=1`;
        try {
            setLoading(true);
            let res = await Apis.get(url);

            const content = res.data.result.content || [];
            setHasMore(!res.data.result.last)

            if (page === 0) {
                setTotal(res.data.result.totalElements || 0);
                setVocabularies(content);
            } else {
                setVocabularies(prev => [...prev, ...content]);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadVocabularies();
    }, [id, page])

    const loadMore = () => {
        setPage(page + 1);
    }

    const playAudio = (url: string) => {
        new Audio(url).play();
    }

    const handleNext = async (vocabId: number) => {
        try {
            const currentDate = new Date().getDate();

            await Apis.post(endpoints["learnedWords"], {
                date: new Date().toISOString().split('T')[0],
                userId: user.result.id,
                vocabularyId: vocabId
            });
        } catch (err) {
            console.error(err);
        }

        if (hasMore) {
            setPage(prev => prev + 1);
        }
    }

    const handleFinish = async (e: React.MouseEvent<HTMLButtonElement>, vocabId: number) => {
        e.preventDefault();

        const clap = new Audio("/sounds/tiengvotayreoho.mp3");
        clap.play();

        await Swal.fire({
            icon: "success",
            title: "Hoàn thành bài học!",
            showConfirmButton: true,
        });

        try {
            const currentDate = new Date().getDate();

            await Apis.post(endpoints["learnedWords"], {
                date: new Date().toISOString().split('T')[0],
                userId: user.result.id,
                vocabularyId: vocabId
            });

            router.push("/topics");
        } catch (err) {
            console.error(err);
        }
    };


    const currentVocab = vocabularies[vocabularies.length - 1];
    const progress = total > 0 ? (vocabularies.length / total) * 100 : 0;


    return (
        <Container className="my-5 d-flex justify-content-center">
            {loading && vocabularies.length === 0 ? (
                <MySpinner />
            ) : currentVocab ? (
                <Card
                    className="shadow-lg text-center p-4"
                    style={{ maxWidth: "500px", width: "100%", borderRadius: "20px" }}
                >
                    <ProgressBar
                        now={progress}
                        className="mb-4"
                        style={{ height: "20px", borderRadius: "10px" }}
                    />

                    <Card.Img
                        variant="top"
                        src={currentVocab.picture}
                        alt={currentVocab.word}
                        className="mb-3"
                        style={{
                            maxHeight: "250px",
                            objectFit: "cover",
                            borderRadius: "15px",
                        }}
                    />
                    <Card.Title className="fw-bold fs-1 mb-2">
                        {currentVocab.word}
                        <Button
                            variant="link"
                            className="ms-2 p-0"
                            onClick={() => playAudio(currentVocab.speech)}
                        >
                            <Icon.VolumeUp size={32} color="black" className="ms-2" />
                        </Button>
                    </Card.Title>
                    <Card.Subtitle className="text-muted mb-2">
                        ({currentVocab.partOfSpeech})
                    </Card.Subtitle>

                    <Card.Text className="fs-4 mb-4">{currentVocab.meaning}</Card.Text>

                    {hasMore ? <Button variant="primary"
                        size="lg" onClick={() => handleNext(currentVocab.id)}
                        className="fw-bold px-5 py-2"
                        style={{ borderRadius: "12px" }}>
                        Tiếp tục
                    </Button> : <Button
                        variant={"success"}
                        size="lg"
                        onClick={(e) => handleFinish(e, currentVocab.id)}
                        className="fw-bold px-5 py-2"
                        style={{ borderRadius: "12px" }}
                    >
                        Kết thúc
                    </Button>}
                </Card>
            ) : (
                <div className="text-center">
                    <p>Không có từ vựng nào.</p>
                    <Link href="/topics" className="btn btn-secondary">
                        Chọn lại chủ đề
                    </Link>
                </div>
            )}
        </Container>
    );
}