import { Button, Dialog, DialogContent, DialogTitle } from '@material-ui/core'
import React from 'react'

/**
 * React popup component used for displaying a pop up form when edite button is clicked in user's portfolio.
 * @component 
 */
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
                    onClick={() => {setOpenPopup(false)}}
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