import DateFnsUtils from '@date-io/date-fns'
import { Button, FormControlLabel, FormLabel, Grid, makeStyles, Radio, RadioGroup, TextField } from '@material-ui/core'
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import React, { useContext, useState } from 'react'
import * as userService from "./userService"
import StockPortfolioContext from '../../StockPortfolioContext'

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
    date: new Date(),
    Action: 'buy'
}

function UserForm({idx}) {
    const [values, setValues] = useState(initialFValues)
    const classes = useStyle()
    const [openPopup, setOpenPopup] = useState(false)
    const [records, setrecords] = useState(userService.getAllUsers())
    const [recordsforedite, setrecordsforedit] = useState(null)
    const {Results, setResults} = useContext(StockPortfolioContext)
    console.log(idx)

    const handleInputChange = e => {
        const {name, value} = e.target
        console.log(name)
        console.log(value)
        setValues(
            {
                ...values,
                [name]: value //update the changing values
            }
        )

    }

    const resetForm = () => {
        setValues(initialFValues)
    }

    const convertToDefEventPara = (name, value) => ({
        target: {
            name, value
        }
    })

    const addOrEdit = (user, restForm) => {
        userService.insertUser(user)
        restForm()
        setOpenPopup(false)
    }

    const handleSubmit = e => {
        console.log("clicked")
        e.preventDefault()
        if(values.Action === "sell"){
            console.log("hello")
            console.log(-1*values.Shares)
            console.log(values)
            const newArray = values
            values.Shares = -1*values.Shares
            setValues(values)

            // setValues(
            //     {
            //         ...values,
            //         ["Shares"]: -1*values.Shares //update the changing values
            //     }
            // )
            // values.Shares = toString(-1 * parseInt(values.Shares))
        }
        userService.insertUser(values, idx)
        // userService.updateUser(values)
        console.log(values)
        // addOrEdit(values, resetForm)
        resetForm()
        setOpenPopup(false)
        setrecords(userService.getAllUsers())
        setResults(userService.getAllUsers())
        console.log(records)
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


            <div>
            <FormLabel>Action</FormLabel>
            <RadioGroup row = {true}
                name = "Action"
                value = {values.Action}
                onChange = {handleInputChange}
            >
                <FormControlLabel value="buy" control={<Radio/>} label="Buy"/>
                <FormControlLabel value="sell" control={<Radio/>} label="Sell"/>
            </RadioGroup>
            </div>
            

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