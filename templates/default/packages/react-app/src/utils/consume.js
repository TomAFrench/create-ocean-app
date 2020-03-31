const consumeAsset = async (ocean, ddo) => {
  try {
    // get all accounts
    const accounts = await ocean.accounts.list()
    // order service agreement
    const agreement = await ocean.assets.order(
      ddo.id,
      accounts[0]
    )
    // consume it
    await ocean.assets.consume(
      agreement,
      ddo.id,
      accounts[0],
      '',
      0
    )
  } catch (error) {
    console.error(error.message)
  }
}

export default consumeAsset