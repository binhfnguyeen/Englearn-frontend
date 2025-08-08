const endpoints = {
    login:"/login",
    profile:"/secure/profile",
    topics:"/topics",
    topic:(id: number) => `/topics/${id}`,
    topic_vocabs:(id: number) => `/topics/${id}/vocabularies`,
    vocabularies: "/vocabularies",
    vocabulary: (id: number) => `/vocabularies/${id}`
}

export default endpoints;