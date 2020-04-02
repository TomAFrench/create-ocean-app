import React from 'react'
import { fromWei } from 'web3-utils'
import filesize from 'filesize'

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

import consumeAsset from '../../utils/consume'

function getDataSize (files) {
  const totalContentLength = files
    .map(file => parseInt(file.contentLength))
    .reduce((total, fileSize) => total + fileSize, 0)

  return parseInt(totalContentLength) ? filesize(totalContentLength) : "UNKNOWN"
}

function extractMetadata(ddo) {
  try {
    // get metadata service
    const metadata = ddo.findServiceByType('metadata')
    return metadata.attributes
  } catch (error) {
    console.error(error.message)
  }
}

const SearchResults = ({ocean, search, query}) => {
  if (!query || search.totalResults === undefined ) return null

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
      <Table>
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

export default SearchResults