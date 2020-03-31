import React, { useEffect, useState } from 'react'
import { Ocean } from '@oceanprotocol/squid'
import Web3 from 'web3'
import { fromWei } from 'web3-utils'

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import oceanLogoLight from './assets/oceanLogoLight.svg'
import oceanLogoDark from './assets/oceanLogoDark.svg'

import consumeAsset from './utils/consume'

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
  const [searchText, setSearchText] = useState("")
  const [results, setResults] = useState({})

  useEffect(()=> {
    async function getOcean (){
      const ocean = await new Ocean.getInstance({
        web3Provider: web3,
        nodeUri: 'https://nile.dev-ocean.com',
        aquariusUri: 'https://aquarius.marketplace.dev-ocean.com',
        brizoUri: 'https://brizo.marketplace.dev-ocean.com',
        brizoAddress: '0x4aaab179035dc57b35e2ce066919048686f82972',
        secretStoreUri: 'https://secret-store.nile.dev-ocean.com',
        // local Spree connection
        // nodeUri: 'http://localhost:8545',
        // aquariusUri: 'http://aquarius:5000',
        // brizoUri: 'http://localhost:8030',
        // brizoAddress: '0x00bd138abd70e2f00903268f3db08f2d25677c9e',
        // secretStoreUri: 'http://localhost:12001',
        verbose: true
      })
      setOcean(ocean)
      
      const accounts = await ocean.accounts.list()
      setUserAddress(accounts[0].id)
      console.log('Finished loading contracts.')
    }
    getOcean()
  }, [])

  // const registerAsset = async () => {
  //   try {
  //     const accounts = await ocean.accounts.list()
  //     const ddo = await ocean.assets.create(asset, accounts[0])
  //     console.log('Asset successfully submitted.')
  //     console.log(ddo)
  //     // keep track of this registered asset for consumption later on
  //     setDdo(ddo)
  //     alert(
  //       'Asset successfully submitted. Look into your console to see the response DDO object.'
  //     )
  //   } catch (error) {
  //     console.error(error.message)
  //   }
  // }

  const searchAssets = async (searchText) => {
    try {
      console.log("searching for", searchText)
      const results = await ocean.assets.search(searchText)
      setResults(results)
      console.log(results)
    } catch (error) {
      console.error(error.message)
    }
  }

  const clearSearch = () => setResults({})

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
                <Button color="secondary" variant="contained" >
                  Publish Data
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

        <Grid item container justify="center">
          <Grid item>
            <TextField
              id="search"
              label="Search Datasets..."
              value={searchText}
              onChange={event => {clearSearch(); setSearchText(event.target.value)}}
              fullWidth
              />
          </Grid>
          <Grid item className={classes.button}>
              <Button color="primary" variant="contained" onClick={() => searchAssets(searchText)}>
                Search
              </Button>
          </Grid>
        </Grid>
        <Grid item>
          <SearchResults
            ocean={ocean} 
            search={results}
            query={searchText}
          />
          </Grid>
      </Grid>
    </main>
    </>
  )
}

function getDataSize (files) {
  return files
    .map(file => parseInt(file.contentLength))
    .reduce((total, fileSize) => total + fileSize, 0)
}

const SearchResults = ({ocean, search, query}) => {
  const classes = useStyles();
  if (!query || search.totalResults === undefined ) return null

  function extractMetadata(ddo) {
    try {
      // get metadata service
      const metadata = ddo.findServiceByType('metadata')
      return metadata.attributes
    } catch (error) {
      console.error(error.message)
    }
  }

  const { results } = search
  
  // If the search has failed to find any results then display failure
  if (results.length === 0) {
    return (
      <Grid item>
        <Typography variant="h6" color="inherit" noWrap>
        { results.length === 0 ?
          `Found no results for "${query}"`
          :
          `Found ${results.length} search results for "${query}"`
        }
        </Typography>
      </Grid>
    )
  }
  
  return (
    <Grid container item direction="column" alignItems="center" spacing={3}>
      <Grid item>
      <Typography variant="h6" color="inherit" noWrap>
        {`Found ${results.length} search results for "${query}"`}
      </Typography>
      </Grid>
      <Grid item>
      <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell align="right">Description</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="right">Size</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {results.map((ddo) => {
            const metadata = extractMetadata(ddo)
            const { name, price, files } = metadata.main || {}
            const { description } = metadata.additionalInformation || {}
            return (
            <TableRow key={ddo.id}>
              <TableCell component="th" scope="row">
                {name}
              </TableCell>
              <TableCell align="right">{description || "No Description"}</TableCell>
              <TableCell align="center">{fromWei(price)}&nbsp;OCEAN</TableCell>
              <TableCell align="right">{getDataSize(files)}&nbsp;Bytes</TableCell>
              <TableCell align="right">
                <Button color="primary" variant="contained" onClick={() => consumeAsset(ocean, ddo) }>
                  Consume
                </Button>
              </TableCell>
            </TableRow>
            )}
          )}
        </TableBody>
      </Table>
    </TableContainer>
    </Grid>
  </Grid>
  )
}

export default App;
