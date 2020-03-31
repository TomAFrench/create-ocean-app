import React from 'react';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

const licenses = [
  "Public Domain",
  "PDDL: Public Domain Dedication and License",
  "ODC-By: Attribution License",
  "ODC-ODbL: Open Database License",
  "CDLA-Sharing: Community Data License Agreement",
  "CDLA-Permissive: Community Data License Agreement",
  "CC0: Public Domain Dedication",
  "CC BY: Attribution 4.0 International",
  "CC BY-SA: Attribution-ShareAlike 4.0 International",
  "CC BY-ND: Attribution-NoDerivatives 4.0 International",
  "CC BY-NC: Attribution-NonCommercial 4.0 International",
  "CC BY-NC-SA: Attribution-NonCommercial-ShareAlike 4.0 International",
  "CC BY-NC-ND: Attribution-NonCommercial-NoDerivatives 4.0 International"
]

export default function Authorship({ author, setAuthor, copyrightHolder, setCopyrightHolder, license, setLicense }) {
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Authorship
      </Typography>
      <Grid container spacing={3} direction="column">
        <Grid item xs={12}>
          <TextField
            required
            id="author"
            label="Author"
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
            fullWidth />
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
            variant="filled"
            fullWidth
          >
            {licenses.map(license => (
                <option key={license} value={license}>
                  {license}
                </option>
            ))}
          </TextField>
        </Grid> 
      </Grid>
    </>
  );
}