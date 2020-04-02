import React, { useEffect, useState } from 'react'
import { Ocean } from '@oceanprotocol/squid'
import Web3 from 'web3'

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import Publish from './components/Publish'
import Search from './components/Search'

import { OCEAN_SETUP_OPTIONS } from './config'

import oceanLogoLight from './assets/oceanLogoLight.svg'
import oceanLogoDark from './assets/oceanLogoDark.svg'

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  appBarLogo: {
    height: 75,
    padding: theme.spacing(2),
  },
  mainLogo: {
    height: 150,
  },
  layout: {
    width: 'auto',
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(1200 + theme.spacing(2) * 2)]: {
      width: 1200,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  button: {
    background: "linear-gradient(to bottom right, rgb(123, 17, 115) 0%, rgb(246, 56, 138) 100%)"
  },
  address: {
    marginRight: theme.spacing(2),
  },
  accountIcon: {
    marginRight: theme.spacing(1),
  }
}));

const AddressDisplay = ({ userAddress }) => {
  const classes = useStyles();
  if (!userAddress) {
    return (
      <Typography color="inherit" className={classes.address}>
        No account found!
      </Typography>
    )
  }

  return (
    <>
      <AccountCircleIcon className={classes.accountIcon}/>
      <Typography color="inherit" className={classes.address}>
        {`${userAddress.slice(0,6)}...${userAddress.slice(-5,-1)}`}
      </Typography>
    </>
  )
}

const TopBar = ({userAddress, publish, setPublish}) => {
  const classes = useStyles();
  const togglePublish = () => setPublish(!publish)
  return (
    <AppBar position="absolute" className={classes.appBar}>
      <Grid 
        container 
        justify="space-between"
        alignItems="center"
      >
        <Grid item >
          <Toolbar>
            <img src={oceanLogoDark} className={classes.appBarLogo} alt="ocean-logo" />
          </Toolbar>
        </Grid>
        <Grid item >
          <Toolbar>
            <AddressDisplay userAddress={userAddress} />
            <Button color="secondary" variant="contained" className={classes.button} onClick={togglePublish}>
              { publish ? "Search Data" : "Publish Data" }
            </Button>
          </Toolbar>
        </Grid>
      </Grid>
    </AppBar>
  )
}

const App = (props) => {
  const classes = useStyles();
  const [userAddress, setUserAddress] = useState("")
  const [ocean, setOcean] = useState()
  const [publish, setPublish ] = useState(false)

  useEffect(()=> {
    async function getOcean (){
      
      const web3 = new Web3(window.web3.currentProvider)
      await window.ethereum.enable()

      const ocean = await new Ocean.getInstance({
        web3Provider: web3,
        ...OCEAN_SETUP_OPTIONS,
        verbose: true
      })
      setOcean(ocean)
      
      const accounts = await ocean.accounts.list()
      setUserAddress(accounts[0].id)
      console.log('Finished loading contracts.')
    }
    getOcean()
  }, [])

  return (
    <>
      <TopBar userAddress={userAddress} publish={publish} setPublish={setPublish} />
      <main className={classes.layout}>
        <Grid 
          container 
          direction="column"
          justify="space-around"
          alignItems="center"
          alignContent="center"
          spacing={3}
          className={classes.layout}
        >
          <Grid item>
            <Typography variant="h6" color="inherit" noWrap>
              Welcome to the Ocean Protocol Quick Start App
            </Typography>
          </Grid>
          
          <Grid item>
            <img src={oceanLogoLight} className={classes.mainLogo} alt="ocean-logo" />
          </Grid>
          {publish ? 
            <Publish ocean={ocean}/>
            :
            <Search ocean={ocean}/>
          }
        </Grid>
      </main>
    </>
  )
}


export default App;
