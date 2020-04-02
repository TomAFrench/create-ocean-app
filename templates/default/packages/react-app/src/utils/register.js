const registerAsset = async (ocean, asset) => {
  try {
    const accounts = await ocean.accounts.list()
    const ddo = await ocean.assets.create(asset, accounts[0])
    console.log('Asset successfully submitted.')
    console.log(ddo)
    alert(
      'Asset successfully submitted. Look into your console to see the response DDO object.'
    )
  } catch (error) {
    console.error(error.message)
  }
}

export default registerAsset