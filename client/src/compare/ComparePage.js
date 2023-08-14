import React, { useState, useEffect } from "react";
import { Box, Typography, Stack, Grid, Fab, CircularProgress, Drawer, Button, Collapse } from '@mui/material';
import ProgressList from './ProgressList';
import axios from 'axios';
import backendRoutes from "../backendRoutes";
import { useParams } from "react-router-dom";
import NoAccess from "../login/NoAccess";
import Loading from "../ui-component/Loading";
import { CompareTab as CompareTab } from "../ui-component/ProjectTabs";
import CompareTable from "./CompareTable";
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

let assertSetsEqual = (a, b) => a.size === b.size && [...a].every(value => b.has(value));

const calcCohenKappa = async (codeList1, codeList2, setCK) => {
    axios({
        method: 'post',
        url: backendRoutes.COHEN_KAPPA_URL,
        data: {
            code1: codeList1,
            code2: codeList2
        }
    })
        .then(result => setCK(result.data))
        .catch(console.log);
};

const sortScoreData = (scores) => {
    let dataList = scores.data
    dataList.sort((a, b) => a.sentence_id - b.sentence_id)
    return dataList
}

const processScoresResponse = (scores) => {
    let similaritiesTemp = []
    let dataList = sortScoreData(scores)
    dataList.map((ele) => {
        if (Object.keys(ele).includes("score")) {
            similaritiesTemp.push(ele.score)
        } else {
            similaritiesTemp.push("Error")
        }
        return ele
    })
    return similaritiesTemp
}

const swapUser = (project, userName) => {
    // shuffle coders to have user at the first place
    let tmpCoders = project.coders.map((e) => e.name)
    tmpCoders.splice(tmpCoders.indexOf(userName), 1)
    tmpCoders.unshift(userName)
    return tmpCoders
};

const cKCodeFiltering = (segmented_data, coderName) => {
    return segmented_data.map((sentence) => {
        let choices = new Set(sentence.codes
            .filter(obj => obj.author == coderName)
            .map(obj => obj.code))
        return Array.from(choices)
    }).flat().filter(n => n)
}

const processAutocomChoices = (segmented_data) => {
    return segmented_data.filter(sen => sen.decisions)
        .map(sen => sen.decisions.map(d => ({
            id: sen.id,
            author: d.author,
            decision: d.decision
        }))).flat()
}

const processSimilarities = (segmented_data) => {
    //note: this can only work if <= 2 collaborators in db
    const codes = segmented_data.map(sen => sen.codes.map(c => c.code)).map(array => new Set(array))
    if (!Object.keys(segmented_data[0]).includes("similarity")) {
        return Array(segmented_data.length - 1).fill("")
    } else {
        return segmented_data.map(sen => sen.similarity)
            .map((simiObj, index) => {
                if (assertSetsEqual(codes[index], new Set([simiObj.word1, simiObj.word2]))) {
                    return simiObj.score
                } else {
                    return ""
                }
            }
            ).flat()
    }

}

const calculateAgreementRate = (similarities) => {
    let rate = similarities.filter(n => n > 0.8).length / similarities.length
    return Math.round(rate * 100) / 100
}


export default function ComparePage() {

    const token = JSON.parse(localStorage.getItem('token'));
    const { owner, project, userName } = useParams()

    if (token && (token == userName)) {
        const PROJECT_URL = backendRoutes.PROJECT_URL + owner + "/" + project + "/"

        const [loading, setLoading] = useState(true);

        const [currentProject, setCurrentProject] = useState({});
        const [allProgress, setAllProgress] = useState([]);
        const [coders, setCoders] = useState([]);

        const [checks, setChecks] = useState([true])
        const [simiLoading, setSimiLoading] = useState(false)
        const [similarities, setSimilarities] = useState([])
        const [ck, setCK] = React.useState("Choose 2 coders to calculate.")
        const [agreement, setAgreement] = React.useState("Choose 2 coders to calculate.")
        const [autocomChoices, setAutocomChoices] = useState([]);

        const [checkedProgressCard, setCheckedProgressCard] = useState(true);

        const refresh = async () => {
            console.log("refreshing...")
            const result = await axios(PROJECT_URL);
            let p = result.data[0]
            setCurrentProject(p)
            setAutocomChoices(processAutocomChoices(p.segmented_data))
            setChecks(checks.concat(Array(p.coders.length - 1).fill(false)))
            let tempSimilarities = processSimilarities(p.segmented_data)
            setSimilarities(tempSimilarities)
            setAllProgress(result.data[1])
            setCoders(swapUser(p, userName))
            setAgreement(calculateAgreementRate(tempSimilarities))
        }

        const fetchData = async () => {
            try {
                await refresh()
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
            }, 500)
        }, []);

        const cacheCalcedSimilarities = async (scoredict) => {

            const result = await axios({
                method: 'put',
                url: backendRoutes.SIMILARITY_URL,
                data: {
                    scoredict: scoredict,
                }
            })
        }

        const calcTwoCodersSimilarity = async (segmented_data, coder0, coder1) => {
            console.log("calcTwoCodersSimilarity called")
            setSimiLoading(true)
            const scores = await axios({
                method: 'post',
                url: backendRoutes.SIMILARITY_URL,
                data: {
                    coder0: coder0,
                    coder1: coder1,
                    segmented_data: segmented_data,
                    project_name: project,
                    owner: owner,
                }
            })
            if (scores.status == 200) {
                let tempSimilarities = processScoresResponse(scores)
                setSimilarities(tempSimilarities);
                setSimiLoading(false)
                cacheCalcedSimilarities(sortScoreData(scores))
                setAgreement(calculateAgreementRate(tempSimilarities))
            }
        }

        const calcStats = (coders, segmented_data, checksList) => {
            // check 2 coders
            console.log("Calculating stats...")
            if (checksList.filter(v => v == true).length == 2) {
                // filter coders
                const compareCoders = []
                checksList.forEach((element, index) => {
                    if (element) {
                        compareCoders.push(coders[index])
                    }
                });
                // calc simi
                calcTwoCodersSimilarity(segmented_data, compareCoders[0], compareCoders[1])
                // calc ck
                let codeList1 = cKCodeFiltering(segmented_data, compareCoders[0])
                let codeList2 = cKCodeFiltering(segmented_data, compareCoders[1])
                calcCohenKappa(codeList1, codeList2, setCK)
            } else {
                alert("Please choose exactly 2 coders to compare.")
            }

        }

        const handleChecksChange = (coder_index, checked) => {
            let newChecks = checks.slice()
            let userFinished = allProgress[userName] == 100
            let toCheckFinished = allProgress[coders[coder_index]] == 100
            if ((userFinished && toCheckFinished) || coder_index == 0) {
                newChecks[coder_index] = checked
                setChecks(newChecks)
            } else {
                if (!userFinished) alert("You haven't finished adding codes yet. Thus you are not allowed to view others codes.")
                else if (!toCheckFinished) alert("The user you want to compare with hasn't finished adding codes yet. Thus you are not allowed to view their codes.")
            }
        }

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
                                    <CompareTab owner={owner} project={project} userName={userName} />
                                </Stack>
                            </Grid>

                        </Grid>

                        <Box sx={{ p: 3, width: 1 }}>
                            <Grid container direction="row" justifyContent="center" spacing={2} columns={10}>

                                <Grid item xs={10}>
                                    <CompareTable
                                        coders={coders}
                                        segmented_data={currentProject.segmented_data}
                                        checks={checks}
                                        similarities={similarities}
                                        options={autocomChoices}
                                        refresh={refresh}
                                        updateOptions={(newChoices) => {
                                            setAutocomChoices([...autocomChoices, newChoices].flat())
                                        }}
                                        calcStats={() => { calcStats(coders, currentProject.segmented_data, checks) }}
                                        simiLoading={simiLoading}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                        <Box
                            sx={{
                                borderRadius: 0,
                                position: 'fixed',
                                right: 10,
                                bottom: 10,
                                bgcolor: "primary_container.main"
                            }}
                        >
                            <Button
                                sx={{ width: 1, justifyContent: "left" }}
                                onClick={() => { setCheckedProgressCard(!checkedProgressCard) }}
                                startIcon={checkedProgressCard ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}
                            >
                                Statistics
                            </Button>
                            <Collapse
                                orientation="vertical"
                                in={checkedProgressCard}
                            >
                                <Box sx={{ p: 2 }}>
                                    <ProgressList
                                        file_names={currentProject.file_names}
                                        coders={coders}
                                        progressList={allProgress}
                                        checks={checks}
                                        handleChecksChange={handleChecksChange}
                                        ck={ck}
                                        agreement={agreement}
                                    />
                                </Box>

                            </Collapse>
                        </Box>
                    </Box >
                }
            </div >
        )

    } else { return <NoAccess /> }
}
