export default interface User {
    id: string
    username: string
    email: string
    password?: string
    role: "client" | "admin"
    created_at: string
    is_active: boolean
}
