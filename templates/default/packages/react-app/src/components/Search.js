import React, { useState } from 'react'
import { fromWei } from 'web3-utils'
import filesize from 'filesize'

import { makeStyles } from '@material-ui/core/styles';
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

import oceanLogoLight from '../assets/oceanLogoLight.svg'

import consumeAsset from '../utils/consume'

const useStyles = makeStyles((theme) => ({
  mainLogo: {
    height: 150,
  },
  button: {
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(1),
  },
}));

const Search = ({ocean}) => {
  const classes = useStyles();
  const [searchText, setSearchText] = useState("")
  const [results, setResults] = useState({})

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
  )
}


function getDataSize (files) {
  const totalContentLength = files
    .map(file => parseInt(file.contentLength))
    .reduce((total, fileSize) => total + fileSize, 0)

  return parseInt(totalContentLength) ? filesize(totalContentLength) : "UNKNOWN"
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
              <TableCell align="right">{getDataSize(files)}</TableCell>
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

export default Search