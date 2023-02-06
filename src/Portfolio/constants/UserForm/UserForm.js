import DateFnsUtils from '@date-io/date-fns'
import { Button, Grid, makeStyles, TextField } from '@material-ui/core'
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import React, { useState } from 'react'
import * as userService from "./userService"

const useStyle = makeStyles(theme => ({
    root: {
        '& .MuiFormControl-root':{
            width: '90%',
            margin: theme.spacing(1)
        }
    }
}))

const initialFValues = {
    id: 0,
    Shares: '',
    AverageCostPerShare: '',
    date: new Date()
}

function UserForm() {
    const [values, setValues] = useState(initialFValues)
    const classes = useStyle()

    const handleInputChange = e => {
        const {name, value} = e.target
        setValues(
            {
                ...values,
                [name]: value //update the changing values
            }
        )

    }

    const convertToDefEventPara = (name, value) => ({
        target: {
            name, value
        }
    })

    const handleSubmit = e => {
        console.log("clicked")
        e.preventDefault()
        userService.insertUser(values)
    }

  return (
    <form className={classes.root} onSubmit={handleSubmit}>
        <Grid item xs={12}>
            <TextField
                variant='outlined'
                name='Shares'
                label="Number of Shares"
                value={values.Shares}
                onChange={handleInputChange}
            />
            <TextField
                variant='outlined'
                name='AverageCostPerShare'
                label="Average Cost Per Share"
                value={values.AverageCostPerShare}
                onChange={handleInputChange}
            />
        </Grid>
        <Grid item xs={12}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker disableToolbar variant='inline' inputVariant='outlined'
                    label = 'Date'
                    format='dd/MM/yyyy'
                    name='date'
                    value={values.date}
                    onChange={date => handleInputChange(convertToDefEventPara('date', date))}
                    />
            </MuiPickersUtilsProvider>
            <div className='flex flex-row x-3 p-3 justify-center'>
            <Button className='m-4'
                variant = "contained"
                color = "primary"
                size = "large"
                text = "Submit"
                type = "submit"
                > Submit
            </Button>

            </div>

            
        </Grid>
    </form>
  )
}

export default UserForm