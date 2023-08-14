import * as React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import EditPage from './edit/EditPage.js'
import RegisterPage from './login/pages/RegisterPage'
import LoginPage from './login/pages/LoginPage'
import MainLayout from './ui-component/MainLayout'
import ProjectsPage from './projects/ProjectsPage'
import AddNewProjectPage from './projects/AddNewProjectPage'
import ProfilePage from './profile/ProfilePage'
import { frontendRoutes } from './frontendRoutes.js';
import LogoutPage from './login/pages/LogoutPage.js';
import CodebookPage from './codebook/CodebookPage.js';
import ComparePage from './compare/ComparePage.js';

export default function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path={frontendRoutes.REGISTER_URL} element={<RegisterPage />} />
        <Route path={frontendRoutes.LOGIN_URL} element={<LoginPage />} />
        <Route path={frontendRoutes.EDIT_URL} element={<MainLayout content={<EditPage />} />} />
        <Route path={frontendRoutes.PROJECTS_URL} element={<MainLayout content={<ProjectsPage />} />} />
        <Route path={frontendRoutes.ADD_PROJECT_URL} element={<MainLayout content={<AddNewProjectPage />} />} />
        <Route path={frontendRoutes.TEAM_URL} element={<MainLayout content={<ComparePage />} />} />
        <Route path={frontendRoutes.CODEBOOK_URL} element={<MainLayout content={<CodebookPage />} />} />
        <Route path={frontendRoutes.PROFILE_URL} element={<MainLayout content={<ProfilePage />} />} />
        <Route path={frontendRoutes.LOGOUT_URL} element={<LogoutPage />} />
      </Routes>
    </BrowserRouter>
  );
}
