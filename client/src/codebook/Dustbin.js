import { Paper, Dialog, DialogActions, DialogContent, Button, DialogTitle, Chip, IconButton, Stack, TextField, Tooltip, Typography, Box } from '@mui/material'
import { memo, useState } from 'react'
import { useDrop } from 'react-dnd'
import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';

const style = {
    // height: '5rem',
    width: '95%',
    // border: '1px dashed black',
    color: 'white',
    padding: '0.5rem',
    textAlign: 'center',
    fontSize: '0.5rem',
    lineHeight: 'normal',
    float: 'left',
}
const ListItem = styled('li')(({ theme }) => ({
    margin: theme.spacing(0.5),
}));

export const Dustbin = memo(function Dustbin({
    groupName,
    accept,
    droppedItems,
    onDrop,
    changeGroupName,
    onDeleteCode,
    onDeleteCodeGroup
}) {
    const [{ isOver, canDrop }, drop] = useDrop({
        accept,
        drop: onDrop,
        collect: (monitor) => {
            return {
                isOver: monitor.isOver(),
                canDrop: monitor.canDrop(),
            }
        },
    })
    const isActive = isOver && canDrop
    const [openChangeNameDialog, setOpenChangeNameDialog] = useState(false)
    const [updatedGroupName, setUpdatedGroupName] = useState(groupName)

    const handleDialogClose = (isSaving) => {
        setOpenChangeNameDialog(false)
        if (isSaving) changeGroupName(updatedGroupName)
    }
    return (
        <div ref={drop} style={{ ...style }} data-testid="dustbin">
            <Stack direction="row" justifyContent="flex-start" spacing={0}>
                <Accordion sx={{ width: '100%' }}>

                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="codegroup-content"
                        id="codegroup-header"
                        sx={{ bgcolor: "secondary_container.main" }}
                    >
                        <Typography variant='h5' sx={{ pt: 0.5 }}>
                            {isActive
                                ? 'Release to drop'
                                : `${groupName}`}
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {droppedItems && (
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'left',
                                    flexWrap: 'wrap',
                                    listStyle: 'none',
                                    pr: 0.5,
                                    pl: 0.5,
                                    m: 0,
                                }}
                                component="ul"
                            >
                                {droppedItems.map((item, index) => {

                                    return (
                                        <Tooltip
                                            key={index}
                                            title={item.name.sentences}
                                            placement="right">
                                            <ListItem key={index}>
                                                <Chip
                                                    label={item.name.code}
                                                    variant="contained"
                                                    onDelete={() => onDeleteCode(groupName, index)}
                                                />
                                            </ListItem>
                                        </Tooltip>
                                    );
                                })}
                            </Box>
                        )
                        }
                    </AccordionDetails>

                </Accordion>
                <Button
                    sx={{ height: 50 }}
                    size='small'
                    onClick={() => { setOpenChangeNameDialog(true) }}
                >
                    <EditIcon />
                </Button>
                <Button
                    sx={{ height: 50 }}
                    size='small'
                    onClick={onDeleteCodeGroup}
                >
                    <DeleteIcon />
                </Button>
            </Stack>
            <Dialog
                open={openChangeNameDialog}
                onClose={handleDialogClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {`Rename ${groupName}?`}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        id="standard-basic"
                        label="Name"
                        variant="standard"
                        defaultValue={groupName}
                        onChangeCapture={(e) => setUpdatedGroupName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleDialogClose(false)}>Cancel</Button>
                    <Button onClick={() => handleDialogClose(true)} autoFocus>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
})
