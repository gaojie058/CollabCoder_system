import React, { useState, useEffect } from "react";
import CodebookTable from './CodebookTable'
import Typography from '@mui/material/Typography';
import EditorTable from './EditorTable'
import { Box, Grid } from '@mui/material';
import axios from 'axios';
import backendRoutes from "../backendRoutes";
import { useParams } from "react-router-dom";
import NoAccess from "../login/NoAccess";
import Loading from "../ui-component/Loading";
import { Stack } from "@mui/system";
import { EditTab } from "../ui-component/ProjectTabs";
import { Constants } from "../Constant";

const TABLE_HEIGHT = 3000
const isValidArray = (data) => {
    return (Array.isArray(data) && data.length > 0)
}

const processCodebookRes = (data, userName) => {
    let codeTimeDic = {}
    const temp = data.map((sentence) => {
        let choices = new Set(sentence.codes
            .filter(obj => obj.author == userName)
            .map(obj => {
                codeTimeDic[obj.code] = obj.time
                return obj.code
            }))
        return Array.from(choices)
    })
        .flat()
        .filter(n => n)

    return Array.from(new Set(temp)).map((value, index) => (
        {
            id: index,
            code: value,
            time: codeTimeDic[value]
        }
    ))
}

const processRowsContentRes = (data, userName) => {

    return data.map((sentence) => {
        var defCode = ''
        var defUncertainty = 5
        let userCode = sentence.codes.filter(value => value.author == userName)

        if (userCode.length >= 1 && userCode[0].code != undefined) {
            defCode = userCode[0].code
            defUncertainty = userCode[0].uncertainty
        }

        let userKeywords = sentence.keywords.filter(element => element.author == userName).map(e => e.keywords)

        return {
            id: sentence.id,
            interview_data: sentence.interview_data,
            code: defCode,
            keywords: userKeywords,
            uncertainty: defUncertainty
        }
    })
}

const processAutocomChoices = (data, userName) => {
    return data.map(sentence => {
        let suggestions = sentence.codes
            .filter(obj => obj.author == userName && obj.codeSuggestion)
            .map(obj => obj.codeSuggestion)[0]
        return {
            id: sentence.id,
            suggestions: suggestions
        }
    })
        .filter(obj => obj.suggestions)
        .map(obj => ({
            id: obj.id,
            gptsummary: obj.suggestions.gptsummary,
            similarCodes: obj.suggestions.similarCodes
        }))
        .map(obj => {
            let codes = []
            if (obj.gptsummary) {
                obj.gptsummary.forEach(element => {
                    codes.push({
                        id: obj.id,
                        code: element,
                        author: Constants.OPEN_AI_MODEL,
                    })
                })
            }
            if (obj.similarCodes) {
                obj.similarCodes.forEach(element => {
                    codes.push({
                        id: obj.id,
                        code: element,
                        author: userName,
                    })
                })
            }
            return codes
        }).flat(1)

}
const updateKeywordsDb = async (method, rowId, keyword, owner, userName, project_name, refresh) => {
    axios({
        url: backendRoutes.EDIT_URL + "/keyword",
        method: method,
        data: {
            owner: owner,
            userName: userName,
            project: project_name,
            rowId: rowId,
            keyword: keyword,
        }
    }).then(res => {
        if (res.status == 200) {
            refresh()
        }
    }).catch(console.log)
}


export default function EditPage() {
    const token = JSON.parse(localStorage.getItem('token'));
    const { owner, userName, project } = useParams()

    if (token && (token == userName)) {
        const DOCUMENT_URL = backendRoutes.DOCUMENT_URL + project + "/"
        const [loading, setLoading] = useState(true);

        const [rowsContent, setRowsContent] = useState([]);
        const [codebookChoices, setCodebookChoices] = useState([]);
        const [autocomChoices, setAutocomChoices] = useState([]);

        const refresh = async () => {
            console.log("refreshing...")
            let result = await axios(DOCUMENT_URL);
            var interviews = []
            var savedCodeChoices = []
            var savedAutocomChoices = []
            if (isValidArray(result.data)) {

                interviews = processRowsContentRes(result.data, userName)
                savedCodeChoices = processCodebookRes(result.data, userName)
                savedAutocomChoices = processAutocomChoices(result.data, userName)
                console.log(interviews)
            }
            setCodebookChoices(savedCodeChoices)
            setRowsContent(interviews)
            setAutocomChoices(savedAutocomChoices)
        }

        const fetchData = async () => {
            try {
                refresh()
                setLoading(false);
            } catch (err) {
                setLoading(false);
                alert(err)
            }
        };

        useEffect(() => {
            setLoading(true);
            fetchData()
            setTimeout(() => {
                fetchData()
            }, 1000)
        }, []);

        const updateKeyword = (rowId, keyword) => {
            updateKeywordsDb("post", rowId, keyword, owner, userName, project, refresh)
        }

        const removeKeyword = (rowId, keyword) => {
            updateKeywordsDb("delete", rowId, keyword, owner, userName, project, refresh)
        }

        return (
            <div>
                {loading && <Loading />}
                {!loading &&
                    <Box sx={{ width: 1, pt: 1.5 }}>
                        <Grid container direction="row" justifyContent="left" spacing={2} columns={10} sx={{ bgcolor: 'surface_variant.main' }}>
                            <Grid item xs={10} >
                                <Stack spacing={2} sx={{ p: 2, pl: 4 }} >
                                    <Typography variant="h2" >
                                        {project}
                                    </Typography>
                                    <EditTab owner={owner} project={project} userName={userName} />
                                </Stack>
                            </Grid>
                        </Grid>
                        <Box sx={{ p: 3, width: 1 }}>
                            <Grid container direction="row" justifyContent="left" spacing={2} columns={10}>
                                <Grid item xs={7}>
                                    <Stack >
                                        <Typography variant="h3" >
                                            Editor
                                        </Typography>
                                        <EditorTable
                                            rowsContent={rowsContent}
                                            options={autocomChoices}
                                            refresh={refresh}
                                            table_height={TABLE_HEIGHT}
                                            updateOptions={(newChoices) => {
                                                setAutocomChoices([...autocomChoices, newChoices].flat())
                                            }}
                                            updateKeyword={updateKeyword}
                                            removeKeyword={removeKeyword}
                                            currentCodesList={codebookChoices}
                                        />
                                    </Stack>
                                </Grid>
                                <Grid item xs={3}>
                                    <Stack >
                                        <Typography variant="h3" >
                                            Codebook
                                        </Typography>
                                        <CodebookTable
                                            options={codebookChoices}
                                            refresh={refresh}
                                            table_height={TABLE_HEIGHT}
                                        />
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box >
                }
            </div>
        )
    } else { return <NoAccess /> }
}
