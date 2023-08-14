import { memo, useState } from 'react'
import { useDrag } from 'react-dnd'
import { TextField, Dialog, DialogActions, DialogContent, Button, DialogTitle } from '@mui/material'

const style = {
  border: '1px dashed gray',
  backgroundColor: 'white',
  padding: '0rem 1rem',
  cursor: 'move',
  float: 'left',
  width: '100%',
}
export const DraggableBox = memo(function Box({ name, type, changeCode }) {
  const [code, setCode] = useState(name.code)
  const [openChangeCodeDialog, setOpenChangeCodeDialog] = useState(false)

  const handleDialogClose = (isSaving) => {
    setOpenChangeCodeDialog(false)
    if (isSaving) changeCode(code)
  }

  const [{ opacity }, drag] = useDrag(
    () => ({
      type,
      item: { name },
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.4 : 1,
      }),
    }),
    [name, type],
  )
  return (
    <div ref={drag} style={{ ...style, opacity }} data-testid="box" onDoubleClick={() => { setOpenChangeCodeDialog(true) }}>
      <p>{code}</p>
      <Dialog
        open={openChangeCodeDialog}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {`Rename ${name.code}?`}
        </DialogTitle>
        <DialogContent>
          <TextField
            id="standard-basic"
            fullWidth
            label="Code"
            variant="standard"
            defaultValue={code}
            onChangeCapture={(e) => setCode(e.target.value)}
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
