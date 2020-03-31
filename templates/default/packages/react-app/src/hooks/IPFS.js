import { useState, useEffect } from 'react'
import ipfsClient from 'ipfs-http-client'

let ipfs = null
let ipfsMessage = ''
let ipfsVersion = ''

export function useIpfsApi(config) {
  const [isIpfsReady, setIpfsReady] = useState(Boolean(ipfs))
  const [ipfsError, setIpfsError] = useState('')

  useEffect(() => {
      async function initIpfs() {
          if (ipfs !== null) return

          ipfsMessage = 'Checking IPFS gateway...'

          try {
              ipfs = await ipfsClient(config)
              const version = await ipfs.version()
              ipfsVersion = version.version
              ipfsMessage = `Connected to ${config.host}`
          } catch (error) {
              setIpfsError(`IPFS connection error: ${error.message}`)
          }
          setIpfsReady(Boolean(await (ipfs && ipfs.version())))
      }

      initIpfs()
  }, [config])

  useEffect(() => {
      return function cleanup() {
          if (ipfs) {
              setIpfsReady(false)
              ipfs = null
              ipfsMessage = ''
              ipfsVersion = ''
              setIpfsError('')
          }
      }
  }, [])

  return { ipfs, ipfsVersion, isIpfsReady, ipfsError, ipfsMessage }
}





