import { Button, Dialog, DialogContent, DialogTitle } from '@material-ui/core'
import React from 'react'

function Popup(props) {
    const {title, children, openPopup, setOpenPopup} = props
  return (
    <Dialog open={openPopup}>
        <DialogTitle>
            <div className='flex gap-80'>
            <div>
                    title goes here
                </div>
                <Button text = "X"
                    color = "secondary"
                    variant = "contained"
                    size = "medium"
                    type = "submit"
                >
                X
                </Button>
            </div>
            
        </DialogTitle>
        <DialogContent>
            {children}
        </DialogContent>
    </Dialog>
  )
}

export default Popup