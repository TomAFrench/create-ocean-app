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

let web3

if (window.web3) {
  web3 = new Web3(window.web3.currentProvider)
  window.ethereum.enable()
}

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
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(1),
  },
  address: {
    marginRight: theme.spacing(2),
  },
  accountIcon: {
    marginRight: theme.spacing(1),
  }
}));

const App = (props) => {
  const classes = useStyles();
  const [userAddress, setUserAddress] = useState("")
  const [ocean, setOcean] = useState()
  const [publish, setPublish ] = useState(false)

  useEffect(()=> {
    async function getOcean (){
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
    <AppBar position="absolute" className={classes.appBar}>
      <Grid 
          container 
          justify="space-between"
          alignItems="center"
          >
            <Grid item >
              <Toolbar>
                <img src={oceanLogoDark} className={classes.appBarLogo} alt="ocean-logo" />
                {!web3 && <p>No Web3 Browser!</p>}
              </Toolbar>
            </Grid>
            <Grid item >
              <Toolbar>
                { userAddress ? (
                    <>
                      <AccountCircleIcon className={classes.accountIcon}/>
                      <Typography color="inherit" className={classes.address}>
                        {`${userAddress.slice(0,6)}...${userAddress.slice(-5,-1)}`}
                      </Typography>
                    </>
                  ):(
                    <Typography color="inherit" className={classes.address}>
                      No account found!
                    </Typography>
                  )
                }
                <Button color="secondary" variant="contained" onClick={() => setPublish(!publish)}>
                  { publish ? "Search Data" : "Publish Data" }
                </Button>
              </Toolbar>
            </Grid>
        </Grid>
      
    </AppBar>
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
