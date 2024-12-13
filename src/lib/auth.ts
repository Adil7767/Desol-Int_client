import Cookies from 'js-cookie'

export const setToken = (token: string) => {
    Cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        expires: 1 / 24 
    })
}

export const getToken = () => {
    return Cookies.get('token')
}

export const removeToken = () => {
    Cookies.remove('token')
}

export const isAuthenticated = () => {
    const token = getToken()
    return !!token
}
