import instance from "../instance";


const useAddProject = async (project) => {
    try {
        const result = instance.post('/addproject/', project)
        if (result.message = 'success') {
            return true
        } else {
            return false
        }
    } catch (error) {
        console.log(error)
        return false
    }
}

export default useAddProject