import instance from "./instance";

// 自动登录函数
const useGetAutoLogin = async () => {
    try {
        const result = await instance.get("/autoLogin")
        if (result.message === 'success') {
            //自动登录成功
            return {
                status: true,
                user: result.username
            }
        } else {
            //自动登录失败
            throw new Error(result.message)
        }
    } catch (error) {
        console.log(error);
        return {
            status: false,
            user: null
        }
    }
}

export default useGetAutoLogin;