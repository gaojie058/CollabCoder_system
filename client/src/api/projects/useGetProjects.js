import instance from "../instance";

const useGetProjects = async (username) => {
    try {
        const result = await instance.get(`projects/${username}/`);
        if (result.message = 'success') {
            return {
                status: true,
                data: result.data
            }
        } else {
            throw new Error('Error fetching projects');
        }
    } catch (err) {
        console.error(err);
        return {
            status: false,
            data: []
        }
    }
}

export default useGetProjects