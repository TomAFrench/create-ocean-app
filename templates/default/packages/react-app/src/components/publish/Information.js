import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

import {categories as categoryList} from '../../constants'

export default function Information( { description, setDescription, categories, setCategories, creationDate, setCreationDate }) {
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Information
      </Typography>
      <Grid container spacing={3} direction="column">
        <Grid item xs={12}>
          <TextField
            required
            id="description"
            label="Description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            fullWidth
            multiline
            rowsMax="6"
            />
        </Grid>
        <Grid item>
          <TextField
            select
            label="Category"
            SelectProps={{
              native: true,
            }}
            value={categories}
            onChange={(event) => setCategories([event.target.value])}
            variant="filled"
            fullWidth
          >
            {categoryList.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
            ))}
          </TextField>
        </Grid>
        <Grid item>
          <TextField
            id="date"
            label="Creation Date"
            type="date"
            value={creationDate}
            onChange={(event) => setCreationDate(event.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
          />
        </Grid>  
      </Grid>
    </>
  );
}