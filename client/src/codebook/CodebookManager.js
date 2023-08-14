import { Box, Button, Grid, Typography, List, ListItem, CircularProgress, Tooltip } from '@mui/material'
import { Stack } from '@mui/system'
import { memo, useCallback, useState } from 'react'
import backendRoutes from '../backendRoutes.js'
import { DraggableBox } from './DraggableBox.js'
import { Dustbin } from './Dustbin.js'
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import axios from 'axios'

const TypeCode = "Code"

// uniqueCodesDict: all the unique codes in the decision list.
// generatedCodeGroups: code array contains three code group themes and code group members
// processCodeGroups: put all the group members into the drappedItems list
const processCodeGroups = (generatedCodeGroups, uniqueCodesDict) => {
  return generatedCodeGroups.map(group => {
    const droppedItems = [];

    // avoid strange symbols in codes like "/"
    group.groupMembers.forEach(code => {
      const sentence = uniqueCodesDict[code];

      if (sentence) {
        let sentences = [sentence]
        if (Array.isArray(sentence)) { sentences = sentence }
        droppedItems.push({
          name: { code, sentences: sentences },
          type: TypeCode
        });
      }
    });

    return {
      groupName: group.groupName,
      accepts: [TypeCode],
      droppedItems
    };
  });
}


// getNewlyAddedCodesDict: 
// filter those codes that are not in the historial groups, 
// these new codes will be listed in the right part
// uniqueCodes = codes in rawCodeGroups + newlyAddedCodes
const getNewlyAddedCodesDict = (rawCodeGroups, uniqueCodesDict) => {

  let rawCodes = rawCodeGroups ? rawCodeGroups.map(it => it.groupMembers).flat() : []
  let uniqueCodes = Object.keys(uniqueCodesDict);
  let newlyAddedCodes = uniqueCodes.filter(x => !rawCodes.includes(x))

  let newlyAddedCodesDict = {}
  if (newlyAddedCodes.length > 0) {
    for (let i = 0; i < newlyAddedCodes.length; i++) {
      const newCode = newlyAddedCodes[i];
      const sentence = uniqueCodesDict[newCode];
      newlyAddedCodesDict[newCode] = sentence;
    }
  }

  return newlyAddedCodesDict
}


// uniqueCodesDict: all the codes
// rawCodeGroups: codes in the raw code groups (within database)

export const CodebookManager = memo(function Container({ uniqueCodesDict, rawCodeGroups, owner, project, coders }) {
  //uniqueCodes =["code","code"...]
  let newlyAddedCodesDict = []
  let processedCodeGroups = []
  if (rawCodeGroups) {
    newlyAddedCodesDict = getNewlyAddedCodesDict(rawCodeGroups, uniqueCodesDict)
    processedCodeGroups = processCodeGroups(rawCodeGroups, uniqueCodesDict)
  }
  console.log(processedCodeGroups)
  const [codeGroups, setCodeGroups] = useState(processedCodeGroups)

  // put these new codes into the code decision list in the right hand
  const [codeBoxes, setCodeBoxes] = useState(
    Object.entries(newlyAddedCodesDict).map(([code, sentence]) => ({
      name: {
        code: code,
        sentences: [sentence],
      }, type: TypeCode
    }))
  )

  const [aiCreatingLoading, setAiCreatingLoading] = useState(false)

  const [droppedCodes, setDroppedCodes] = useState([])

  function isDropped(boxName) {
    return droppedCodes.indexOf(boxName) > -1
  }
  const handleDrop = useCallback(
    (cgindex, item) => {
      const { name } = item
      setDroppedCodes([...droppedCodes, name])

      setCodeGroups(codeGroups.map((cg, idx) => {
        if (idx == cgindex) {
          return {
            groupName: cg.groupName,
            accepts: cg.accepts,
            droppedItems: cg.droppedItems.concat({ name: name, type: TypeCode })
          }
        } else return cg
      }))
      // remove grouped from box
      setCodeBoxes(codeBoxes.filter(code => code.name != item.name))
    },
    [droppedCodes, codeGroups],
  )
  const changeGroupName = (index, newName) => {
    setCodeGroups(codeGroups.slice().map((group, idx) => {
      if (idx == index) {
        group.groupName = newName
        return group
      } else return group
    }))
  }

  const onDeleteCode = (groupName, itemIndex) => {
    // remove from code groups
    let groupIndex = codeGroups.findIndex(group => group.groupName == groupName)
    let temp = codeGroups.slice()
    let removed = temp[groupIndex].droppedItems.splice(itemIndex, 1)[0]
    setCodeGroups(temp)
    // add to codeboxes
    setCodeBoxes([removed, ...codeBoxes])

  }

  const onDeleteCodeGroup = (groupIndex) => {
    let temp = codeGroups.slice()
    let removed = temp.splice(groupIndex, 1)

    // remove from code groups
    setCodeGroups(temp)
    // add to codeboxes
    setCodeBoxes(codeBoxes.concat(removed[0].droppedItems))
  }

  const generateGroups = async () => {

    const uniqueCodes = Object.keys(uniqueCodesDict);

    setAiCreatingLoading(true)
    axios({
      method: 'post',
      url: backendRoutes.CODE_GROUP_URL,
      data: {
        codes: uniqueCodes,
        owner: owner,
        project_name: project,
      }
    })
      .then(result => {
        let newCodeGroups = result.data
        let newDraggedCodeGroups = processCodeGroups(newCodeGroups, uniqueCodesDict)

        // set code group
        setCodeGroups(newDraggedCodeGroups)

        // set code boxes
        let codeBoxItemsDict = getNewlyAddedCodesDict(newCodeGroups, uniqueCodesDict)

        setCodeBoxes(Object.entries(codeBoxItemsDict).map(([code, interview_data]) => ({
          name: {
            code,
            sentences: [interview_data],
          }, type: TypeCode
        })))
        setAiCreatingLoading(false)
      })
      .catch(err => {
        console.log(err)
        setAiCreatingLoading(false)
      });
  }

  const saveGroupings = async () => {
    try {
      axios({
        method: 'put',
        url: backendRoutes.CODE_GROUP_URL,
        data: {
          codeGroups: codeGroups.map(g => ({ groupName: g.groupName, groupMembers: g.droppedItems.map(item => item.name.code) })),
          owner: owner,
          project_name: project,
        }
      })
        .then(result => {
          if (result.status == 200) {
            alert("Updated and saved successfully!")
          }
        })
        .catch(console.log);
    } catch (err) {
      console.log(err)
    }
  }

  const changeCodeDecision = async (oldDecision, newDecision) => {
    console.log("changeCodeDecision...")
    axios({
      method: 'post',
      url: backendRoutes.DECISION_URL + "/codebook",
      data: {
        owner: owner,
        userName: coders,
        project: project,
        oldDecision: oldDecision,
        newDecision: newDecision,
      }
    })
      .then(res => {
        if (res.data.modifiedCount > 0) {
          console.log("Successfully update code")
        } else {
          console.log(`modifiedCount = ${res.data.modifiedCount}`)
        }
      })
      .catch(err => {
        console.log(err)
      });
  }


  return (

    <Box
      sx={{ width: 1, p: 1 }}
    >
      <Stack direction="column" alignItems="left" justifyContent="space-between" spacing={5}>
        <Grid container direction="row" justifyContent="left" spacing={2} columns={10}>
          <Grid item xs={7}>
            <Stack >
              <Typography variant="h3" sx={{ ml: 1 }}>
                Code Groups
              </Typography>
              <Stack direction="row" spacing={2} sx={{ m: 1, mt: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  aria-label="Add a group"
                  onClick={() => {
                    setCodeGroups([...codeGroups, { groupName: "Default", accepts: [TypeCode], droppedItems: [] }])
                  }}
                >
                  Add new group
                </Button>
                <Button
                  variant="contained"
                  startIcon={aiCreatingLoading ? <CircularProgress disableShrink size={15} /> : <SmartToyOutlinedIcon />}
                  disabled={aiCreatingLoading}
                  aria-label="Add new group"
                  onClick={generateGroups}
                >
                  Create Code Groups by AI
                </Button>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  aria-label="save groups"
                  onClick={saveGroupings}
                  title="Click here to update/save code groups"
                  color="warning"
                >
                  Update/save Groups
                </Button>
              </Stack>
              {codeGroups.length > 0 ? (
                <List sx={{ width: '100%' }}>
                  {codeGroups.map(({ groupName, accepts, droppedItems }, index) => (
                    <ListItem disablePadding key={groupName + index}>
                      <Dustbin
                        groupName={groupName}
                        accept={accepts}
                        droppedItems={droppedItems}
                        onDrop={(item) => handleDrop(index, item)}
                        key={index}
                        changeGroupName={(newName) => changeGroupName(index, newName)}
                        onDeleteCode={onDeleteCode}
                        onDeleteCodeGroup={() => { onDeleteCodeGroup(index) }}
                      />
                    </ListItem>
                  ))}
                </List>) : (
                <p>No code groups </p>
              )}
            </Stack>
          </Grid>
          <Grid item xs={3}>
            <Stack >
              <Typography variant="h3" >
                Code Decision List
              </Typography>
              <Typography variant='caption'>
                {">> Double click to change the code. The codes in 'comparision' page will also be changed"}
              </Typography>
              <List sx={{ width: '100%', mt: 1 }}>
                {codeBoxes.map(({ name, type }, index) => (
                  <Tooltip title={
                    name.sentences[0] && name.sentences[0].includes('\n\n')
                      ? name.sentences[0].split('\n\n').map((sentence, i) => <p key={i}>{sentence}</p>)
                      : name.sentences[0]
                  }
                    key={index}
                  >
                    <ListItem disablePadding key={name + index}>
                      <DraggableBox
                        name={name}
                        type={type}
                        isDropped={isDropped(name)}
                        key={index + name.code}
                        changeCode={(newCode) => changeCodeDecision(name.code, newCode)}
                      />
                    </ListItem>
                  </Tooltip>

                ))}
              </List>
            </Stack>
          </Grid>
        </Grid>
      </Stack >

    </Box >
  )
})
