// frontend routings for frontend
const baseUrl = "http://localhost:3000/"
const frontendRoutes = {
    REGISTER_URL: '/register',
    LOGIN_URL: '/login',
    LOGOUT_URL: '/logout',
    EDIT_URL: '/:owner/:project/edit/:userName',
    PROJECTS_URL: '/:userName/projects',
    ADD_PROJECT_URL: '/:userName/add_project',
    TEAM_URL: '/:owner/:project/team/:userName',
    PROFILE_URL: '/:userName/profile',
    CODEBOOK_URL:'/:owner/:project/codebook/:userName',
}

const createUrl = (urlTemp, userName) => {
    return urlTemp.replace(":userName", userName)
}
const createUrl3 = (urlTemp, owner, project, userName) => {
    return urlTemp
        .replace(":userName", userName)
        .replace(":owner", owner)
        .replace(":project", project)

}
const createEditUrl = (owner, project, userName) => createUrl3(frontendRoutes.EDIT_URL, owner, project, userName)
const createProjectsUrl = (userName) => createUrl(frontendRoutes.PROJECTS_URL, userName)
const createAddProjectUrl = (userName) => createUrl(frontendRoutes.ADD_PROJECT_URL, userName)
const createTeamUrl = (owner, project, userName) => createUrl3(frontendRoutes.TEAM_URL, owner, project, userName)
const createCodebookUrl = (owner, project, userName) => createUrl3(frontendRoutes.CODEBOOK_URL, owner, project, userName)
const createProfileUrl = (userName) => createUrl(frontendRoutes.PROFILE_URL, userName)

module.exports = {
    frontendRoutes,
    createEditUrl,
    createProjectsUrl,
    createAddProjectUrl,
    createTeamUrl,
    createProfileUrl,
    createCodebookUrl
};