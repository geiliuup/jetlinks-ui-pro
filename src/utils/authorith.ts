export function getAccessToken(): string {
    return localStorage.getItem('x-access-token') || `${new Date().getTime()}`;
}

export function setAccessToken(token: string) {
    localStorage.setItem('x-access-token', token);
}