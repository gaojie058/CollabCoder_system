// backend routings for frontend
const baseUrl = "http://localhost:5000/"
const backendRoutes = {
    DOCUMENT_URL: baseUrl + "document/",
    SUMMARY_URL: baseUrl + "summary/",
    DECISION_URL: baseUrl + "decision/",
    PROFILE_URL: baseUrl + "profile/",
    PROJECTS_URL: baseUrl + "projects/",
    PROJECT_URL: baseUrl + "project/",
    ADD_PROJECT_URL: baseUrl + "addproject/",
    LOGIN_URL: baseUrl + "login/",
    REGISTER_URL: baseUrl + "register/",
    EDIT_URL: baseUrl + "edit/",
    SIMILARITY_URL: baseUrl + "stats/" + "similarity/",
    COHEN_KAPPA_URL: baseUrl + "stats/" + "ck/",
    USERS_URL: baseUrl + "users/",
    CODE_GROUP_URL: baseUrl + "codegroup/"
}

export default backendRoutes;