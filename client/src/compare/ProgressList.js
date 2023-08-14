import React from "react";
import { List, Stack, Typography, Checkbox, Tooltip } from '@mui/material';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import stringAvatar from "../ui-component/StringAvatar";

export default function ProgressList(props) {
    let coders = props.coders

    const checks = props.checks
    const handleChecksChange = props.handleChecksChange

    return (
        <Stack spacing={1} sx={{ width: 200 }}>
            <Typography variant="h4" >
                Progress
            </Typography>
            <List sx={{ width: '100%' }}>
                {Array.isArray(coders) && coders.length > 0 && coders.map((coderName, index) => (
                    <ListItem
                        key={coderName}
                        disablePadding
                        secondaryAction={
                            <Stack direction="row" spacing={2}>
                                <Checkbox
                                    checked={checks[index]}
                                    onChange={event => { handleChecksChange(index, event.target.checked) }}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                />
                            </Stack>
                        }
                    >
                        <ListItemAvatar>
                            <Avatar {...stringAvatar(coderName)} />
                        </ListItemAvatar>
                        <ListItemText
                            primary={coderName}
                            secondary={props.progressList[coderName] + "%"} />
                    </ListItem>
                ))}
            </List>

            <Stack spacing={2}>
                <Typography variant="h4" >
                    Cohen's Kappa
                </Typography>
                <Typography variant="body"  >
                    {props.ck}
                </Typography>
            </Stack>

            <Stack spacing={2}>
                <Tooltip title="Percentage of elements with similarity score > 0.8">
                    <Typography variant="h4" >
                        Agreement Rate
                    </Typography>
                </Tooltip>
                <Typography variant="body"  >
                    {props.agreement}
                </Typography>
            </Stack>

        </Stack>
    );
}