import React from 'react';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

import { licenses } from '../../constants'

export default function Authorship({ author, setAuthor, copyrightHolder, setCopyrightHolder, license, setLicense }) {
  return (
    <Grid container spacing={3} direction="column">
      <Grid item>
        <Typography variant="h6" gutterBottom>
          Authorship
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          id="author"
          label="Author"
          value={author}
          onChange={(event) => setAuthor(event.target.value)}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          id="copyright"
          label="Copyright Holder"
          value={copyrightHolder}
          onChange={(event) => setCopyrightHolder(event.target.value)}
          fullWidth
        />
      </Grid>
      <Grid item>
        <TextField
          select
          label="License"
          value={license}
          onChange={(event) => setLicense(event.target.value)}
          SelectProps={{
            native: true,
          }}
          fullWidth
        >
          <option value=""/>
          {licenses.map(license => (
              <option key={license} value={license}>
                {license}
              </option>
          ))}
        </TextField>
      </Grid> 
    </Grid>
  );
}