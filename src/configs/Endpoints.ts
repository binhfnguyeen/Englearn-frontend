const endpoints = {
    login:"/login",
    profile:"/secure/profile",
    topics:"/topics",
    topic:(id: number) => `/topics/${id}`,
    topic_vocabs:(id: number) => `/topics/${id}/vocabularies`,
    vocabularies: "/vocabularies",
    vocabulary: (id: number) => `/vocabularies/${id}`,
    vocabNotInTopic: (id: number) => `/topics/${id}/vocabularies/not-in`,
    Tests: "/tests",
    Test: (id: number) => `/tests/${id}`,
    fullTests: (id: number) => `/tests/full/${id}`
}

export default endpoints;