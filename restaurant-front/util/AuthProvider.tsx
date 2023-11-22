import { apiI } from "@/service/api"

export const isAuth = async () => {
    try {
        const response = await apiI.get('/auth/isLogged')
        //console.log(response);

        return response.status === 200;
    } catch (error) {
        console.log(error)
        return false;
    }
}