import { AppBar, Box, Toolbar, Typography } from '@mui/material'
import AccountMenu from 'components/AccountMenu'
import { AuthContextTheme } from 'context/Auth'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { chilld } from 'types/const'

export const AppLayout = ({ children }: chilld): JSX.Element => {
  const { user } = useContext(AuthContextTheme)
  const navigate = useNavigate()
  return (
    <Box>
      <AppBar position="sticky">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            onClick={() => {
              navigate('/')
            }}
            sx={{ flexGrow: 1, cursor: 'pointer' }}
          >
            {`Hello ${user.name}`}
          </Typography>
          <AccountMenu />
        </Toolbar>
      </AppBar>
      <Box padding={3}>{children}</Box>
    </Box>
  )
}
