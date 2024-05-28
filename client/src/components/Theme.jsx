import React from 'react'
import DarkModeIcon from '@mui/icons-material/DarkMode';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import {IconButton } from '@mui/material'
import { toggleTheme } from '../redux/themeSlice/themeSlice'
import { useDispatch, useSelector } from 'react-redux'

const Theme = () => {
    const dispatch = useDispatch()
    const { darkMode } = useSelector(state => state.theme)
    return ( 
        <div className='fixed top-1 right-5 hidden md:block'>
        <IconButton onClick={() => dispatch(toggleTheme())}>
            {
            darkMode ? 
            <WbSunnyIcon className='text-slate-500 text-6xl' /> 
            :
            <DarkModeIcon className='text-slate-500 text-6xl' />
            }
        </IconButton>        
        </div>
    )
}

export default Theme
