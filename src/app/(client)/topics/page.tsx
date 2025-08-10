"use client"
import MySpinner from "@/components/MySpinner";
import Apis from "@/configs/Apis";
import endpoints from "@/configs/Endpoints";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Alert, Button, Card, Col, Container, Form, Row } from "react-bootstrap";

interface Topic {
    id: number;
    name: string;
    description: string;
}

export default function Topics() {
    const [topics, setTopics] = useState<Topic[]>([]);
    const [page, setPage] = useState<number>(0);
    const [keyword, setKeyword] = useState<string>("");
    const [hasMore, setHasMore] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const loadTopics = async () => {
        let url = `${endpoints["topics"]}?page=${page}`;
        if (keyword) url += `&keyword=${keyword}`;

        try {
            setLoading(true);
            let res = await Apis.get(url);
            const content = res.data.result.content || [];
            setHasMore(!res.data.result.last);

            if (page === 0) {
                setTopics(content);
            } else {
                setTopics(prev => [...prev, ...content]);
            }
        } catch (ex) {
            console.error(ex);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        let timer = setTimeout(() => {
            if (page === 0 || (page > 0 && hasMore)) {
                loadTopics();
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [page, keyword]);

    useEffect(() => {
        setPage(0);
    }, [keyword]);

    const loadMore = () => {
        setPage(prev => prev + 1);
    };

    return (
        <Container className="my-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold">English Topics</h2>
                <Form className="mb-4">
                    <Form.Control
                        value={keyword}
                        onChange={kw => setKeyword(kw.target.value)}
                        type="text"
                        placeholder="Tìm kiếm chủ đề..."
                        className="shadow-sm"
                    />
                </Form>
            </div>

            <Row xs={1} md={2} lg={3} className="g-4">
                {topics.map((topic) => (
                    <Col key={topic.id}>
                        <Card className="h-100 shadow-sm border-0 rounded-3">
                            <Card.Header className="bg-primary text-white fw-bold">
                                {topic.name}
                            </Card.Header>
                            <Card.Body>
                                <Card.Text>{topic.description}</Card.Text>
                            </Card.Body>
                            <Card.Footer className="bg-white border-0">
                                <div className="d-flex gap-2">
                                    <Link href={`/topics/${topic.id}`} className="btn btn-outline-primary btn-sm flex-fill">
                                        Học từ vựng với chủ đề {topic.name}
                                    </Link>
                                </div>
                            </Card.Footer>
                        </Card>
                    </Col>
                ))}
            </Row>

            {topics.length === 0 &&
                <Alert className="mt-4" variant="info">Không có chủ đề</Alert>
            }

            {loading && <MySpinner />}

            {page > 0 && hasMore && (
                <div className="mt-4 text-center">
                    <Button variant="secondary" onClick={loadMore}>
                        Xem thêm...
                    </Button>
                </div>
            )}
        </Container>
    );
}