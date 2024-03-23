import * as React from 'react';
import { Stack, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import { createTeamUrl, createEditUrl, createCodebookUrl } from '../frontendRoutes';
import BookIcon from '@mui/icons-material/Book';
import { useNavigate } from 'react-router-dom';


export function EditTab(props) {
  const navigate = useNavigate()

  return (
    <Stack direction="row" spacing={3}>
      <Button
        startIcon={<EditIcon />}
        sx={{ width: 120, color: 'on_surface_variant.main', borderBottom: 2, borderColor: 'primary.main', fontSize: 16 }}
      >
        Edit
      </Button>
      <Button
        startIcon={<CompareArrowsIcon />}
        sx={{ width: 120, color: 'on_surface_variant.main', fontSize: 16 }}
        // component="a"
        component="span"
        // href={createTeamUrl(props.owner, props.project, props.userName)}
        onClick={() => navigate(createTeamUrl(props.owner, props.project, props.userName))}
      >
        Compare
      </Button>
      <Button
        startIcon={<BookIcon />}
        sx={{ width: 120, color: 'on_surface_variant.main', fontSize: 16 }}
        // component="a"
        // href={createCodebookUrl(props.owner, props.project, props.userName)}
        component="span"
        onClick={() => navigate(createCodebookUrl(props.owner, props.project, props.userName))}
      >
        Codebook
      </Button>
    </Stack>
  );
}

export function CompareTab(props) {
  const navigate = useNavigate()
  return (
    <Stack direction="row" spacing={3}>
      <Button
        startIcon={<EditIcon />}
        sx={{ width: 120, color: 'on_surface_variant.main', fontSize: 16 }}
        // component="a"
        // href={createEditUrl(props.owner, props.project, props.userName)}
        component="span"
        onClick={() => navigate(createEditUrl(props.owner, props.project, props.userName))}
      >
        Edit
      </Button>
      <Button
        startIcon={<CompareArrowsIcon />}
        sx={{ width: 120, color: 'on_surface_variant.main', borderBottom: 2, borderColor: 'primary.main', fontSize: 16 }}
      >
        Compare
      </Button>
      <Button
        startIcon={<BookIcon />}
        sx={{ width: 120, color: 'on_surface_variant.main', fontSize: 16 }}
        // component="a"
        // href={createCodebookUrl(props.owner, props.project, props.userName)}
        component="span"
        onClick={() => navigate(createCodebookUrl(props.owner, props.project, props.userName))}
      >
        Codebook
      </Button>
    </Stack>
  );
}

export function CodebookTab(props) {
  const navigate = useNavigate()
  return (
    <Stack direction="row" spacing={3}>
      <Button
        startIcon={<EditIcon />}
        sx={{ width: 120, color: 'on_surface_variant.main', fontSize: 16 }}
        // component="a"
        // href={createEditUrl(props.owner, props.project, props.userName)}
        component="span"
        onClick={() => navigate(createEditUrl(props.owner, props.project, props.userName))}
      >
        Edit
      </Button>
      <Button
        startIcon={<CompareArrowsIcon />}
        sx={{ width: 120, color: 'on_surface_variant.main', fontSize: 16 }}
        // component="a"
        // href={createTeamUrl(props.owner, props.project, props.userName)}
        component="span"
        onClick={() => navigate(createTeamUrl(props.owner, props.project, props.userName))}
      >
        Compare
      </Button>
      <Button
        startIcon={<BookIcon />}
        sx={{ width: 120, color: 'on_surface_variant.main', borderBottom: 2, borderColor: 'primary.main', fontSize: 16 }}
      >
        Codebook
      </Button>
    </Stack>
  );
}