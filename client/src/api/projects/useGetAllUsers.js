import instance from "../instance";

const useGetAllUsers = async () => {
    try {
        const result = await instance.get("/users");
        if (result.message === "success") {
            return {
                status: true,
                data: result.data
            }
        } else {
            throw new Error("failed to get all users");
        }

    } catch (error) {
        console.error(error)
        return {
            status: false,
            data: []
        }
    }
}

export default useGetAllUsers