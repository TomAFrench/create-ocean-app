import React from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Grid } from '@material-ui/core';
import registerAsset from '../../utils/register'

const createNewAsset = (assetInfo) => {
  assetInfo.files = assetInfo.files.map(({ found, ...keepAttrs }) => keepAttrs)
  return {
    main: {
      type: 'dataset',
      name: assetInfo.title,
      dateCreated:
          new Date(assetInfo.creationDate)
              .toISOString()
              .split('.')[0] + 'Z', // remove milliseconds
      author: assetInfo.author,
      license: assetInfo.license,
      price: "0",
      files: assetInfo.files
    },
    additionalInformation: {
      description: assetInfo.description,
      copyrightHolder: assetInfo.copyrightHolder,
      categories: assetInfo.category
    }
  }
}

export default function Register({ ocean, assetInfo }) {
  const register = () => {
    const asset = createNewAsset(assetInfo)
    registerAsset(ocean, asset)
  }
  
  return (
    <Grid item container spacing={3} direction="column">
      <Grid item>
        <Typography variant="h6" gutterBottom>
          Register
        </Typography>
      </Grid>   
      <Grid item>
        <Typography gutterBottom>
          Splendid, we've got all the data. Now let's register your data set.

          After clicking the button below you will be asked by your wallet to sign this request.
        </Typography>
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          color="primary"
          onClick={register}
          >
          Register Asset
        </Button>
      </Grid>
    </Grid>
  );
}