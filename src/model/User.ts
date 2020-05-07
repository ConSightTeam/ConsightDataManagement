export interface User {
    id: number,
    email: string,
    username: string,
    have_password: boolean,
    github_id?: string,
    google_id?: string
}