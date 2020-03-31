import React from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const createNewAsset = (assetInfo) => {
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

const registerAsset = async (ocean, asset) => {
  try {
    const accounts = await ocean.accounts.list()
    const ddo = await ocean.assets.create(asset, accounts[0])
    console.log('Asset successfully submitted.')
    console.log(ddo)
    // keep track of this registered asset for consumption later on
    alert(
      'Asset successfully submitted. Look into your console to see the response DDO object.'
    )
  } catch (error) {
    console.error(error.message)
  }
}

export default function Register({ ocean, assetInfo }) {
  console.log(assetInfo)
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Register
      </Typography>
      <Typography gutterBottom>
        Splendid, we got all the data. Now let's register your data set.

        After clicking the button below you will be asked by your wallet to sign this request.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          const asset = createNewAsset(assetInfo)
          registerAsset(ocean, asset)
        }}
        // className={classes.button}
        >
        Register Asset
      </Button>
    </>
  );
}