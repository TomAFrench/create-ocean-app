import React, { useState } from 'react'

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import SearchResults from './search/SearchResults'

const useStyles = makeStyles((theme) => ({
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
      <>
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
      </>
  )
}




export default Search