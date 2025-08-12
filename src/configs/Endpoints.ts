const endpoints = {
    login:"/login",
    profile:"/secure/profile",
    topics:"/topics",
    register: "/users",
    topic:(id: number) => `/topics/${id}`,
    topic_vocabs:(id: number) => `/topics/${id}/vocabularies`,
    vocabularies: "/vocabularies",
    vocabulary: (id: number) => `/vocabularies/${id}`,
    vocabNotInTopic: (id: number) => `/topics/${id}/vocabularies/not-in`,
    Tests: "/tests",
    Test: (id: number) => `/tests/${id}`,
    fullTests: (id: number) => `/tests/full/${id}`,
    testResults: (id: number) => `/tests/${id}/results`,
    addTestResult: "/test-results",
    answers: (trId: number) => `/test-results/${trId}/answer`,
    learnedWords: "/learnedWords",
    learnedWord: (id: number) => `/learnedWords/${id}`
}

export default endpoints;