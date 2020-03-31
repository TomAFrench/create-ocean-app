import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

const categoryList = [
  "Image Recognition",
  "Dataset Of Datasets",
  "Language",
  "Performing Arts",
  "Visual Arts & Design",
  "Philosophy",
  "History",
  "Theology",
  "Anthropology & Archeology",
  "Sociology",
  "Psychology",
  "Politics",
  "Interdisciplinary",
  "Economics & Finance",
  "Demography",
  "Biology",
  "Chemistry",
  "Physics & Energy",
  "Earth & Climate",
  "Space & Astronomy",
  "Mathematics",
  "Computer Technology",
  "Engineering",
  "Agriculture & Bio Engineering",
  "Transportation",
  "Urban Planning",
  "Health & Medicine",
  "Business & Management",
  "Sports & Recreation",
  "Communication & Journalism",
  "Deep Learning",
  "Law",
  "Other"
]

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
            multiline />
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