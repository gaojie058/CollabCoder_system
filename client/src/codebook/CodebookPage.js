import React, { useState, useEffect } from "react";
import { Box, Typography, Stack, Grid } from '@mui/material';
import axios from 'axios';
import backendRoutes from "../backendRoutes";
import { useParams } from "react-router-dom";
import NoAccess from "../login/NoAccess";
import Loading from "../ui-component/Loading";
import { CodebookTab } from "../ui-component/ProjectTabs";
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { CodebookManager } from "./CodebookManager";

// add unique codes into a decisionsList and decisionsDict
const processUniqueCodes = data => {
    const decisionsList = [];
    const decisionsDict = {};

    // get segmented_data decision
    Object.values(data).forEach(segment => {
        const interview_data = segment.interview_data;
        const decision = segment.decision ? segment.decision.decision : null;

        if (decision) {
            // avoid repeated code decision
            // if decision all diffrent in decisionsDict
            if (!decisionsDict[decision]) {
                decisionsList.push(decision);
                decisionsDict[decision] = interview_data;
            } else {
                decisionsDict[decision] = decisionsDict[decision] + '\n\n' + interview_data;
            }
        } else {
            // if decision null, get segment[0].codes[0].code
            let tempDecision0 = segment.codes[0].code;
            let tempDecision1 = segment.codes[1].code;

            decisionsList.push(tempDecision0);
            decisionsList.push(tempDecision1);

            decisionsDict[tempDecision0] = interview_data;
            decisionsDict[tempDecision1] = interview_data;
        }
    })

    return [decisionsList, decisionsDict];
}



const isValidArray = (data) => {
    return (Array.isArray(data) && data.length > 0)
}

export default function CodebookPage() {

    const token = JSON.parse(localStorage.getItem('token'));
    const { owner, project, userName } = useParams()

    if (token && (token == userName)) {
        const PROJECT_URL = backendRoutes.PROJECT_URL + owner + "/" + project + "/"

        const [loading, setLoading] = useState(true);
        const [codeGroups, setCodeGroups] = useState([]);
        const [uniqueCodesDict, setUniqueCodesDict] = useState([]);
        const [coders, setCoders] = useState([]);

        useEffect(() => {
            const fetchData = async () => {
                try {
                    setLoading(true);
                    let result = await axios(PROJECT_URL, { method: "get" });
                    if (isValidArray(result.data)) {
                        let project = result.data[0]
                        setCoders(project.coders)
                        const [_, uniqueCodesDict] = processUniqueCodes(project.segmented_data);
                        project.CodeGroups ? setCodeGroups(project.CodeGroups) : null;

                        setUniqueCodesDict(uniqueCodesDict)
                        setLoading(false);
                    }
                } catch (err) {
                    setLoading(false);
                    console.log(err)
                }
            };
            fetchData()
        }, []);

        return (
            <div>
                {loading && <Loading />}
                {!loading &&
                    <Box sx={{ width: 1, pt: 2 }}>
                        <Grid container direction="row" justifyContent="left" spacing={2} columns={10} sx={{ bgcolor: 'surface_variant.main' }}>
                            <Grid item xs={10} >
                                <Stack spacing={2} sx={{ p: 2, pl: 4 }} >
                                    <Typography variant="h2" >
                                        {project}
                                    </Typography>
                                    <CodebookTab owner={owner} project={project} userName={userName} />
                                </Stack>
                            </Grid>
                        </Grid>
                        <Box sx={{ p: 3, width: 1 }}>
                            <DndProvider backend={HTML5Backend}>
                                <CodebookManager
                                    rawCodeGroups={codeGroups}
                                    uniqueCodesDict={uniqueCodesDict}
                                    owner={owner}
                                    project={project}
                                    coders={coders}
                                />
                            </DndProvider>
                        </Box>
                    </Box >
                }
            </div>
        )

    } else { return <NoAccess /> }
}
