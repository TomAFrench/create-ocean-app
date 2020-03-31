import React, { useState, useEffect, useCallback } from 'react'
// import useIpfsApi, { IpfsConfig } from '../../../../hooks/use-ipfs-api'
// import Spinner from '../../../../components/atoms/Spinner'
import { useDropzone } from 'react-dropzone'
// import {  pingUrl, streamFiles } from '../../../../utils/utils'
// import { ipfsGatewayUri, ipfsNodeUri } from '../../../../config'
import axios from 'axios'
import ipfsClient from 'ipfs-http-client'

export const ipfsGatewayUri =
    process.env.REACT_APP_IPFS_GATEWAY_URI || 'https://gateway.ipfs.io'
export const ipfsNodeUri =
    process.env.REACT_APP_IPFS_NODE_URI || 'https://ipfs.infura.io:5001'

console.log(ipfsGatewayUri, ipfsNodeUri)

function formatBytes(a, b) {
  if (a === 0) return '0 Bytes'
  const c = 1024
  const d = b || 2
  const e = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const f = Math.floor(Math.log(a) / Math.log(c))

  return parseFloat((a / Math.pow(c, f)).toFixed(d)) + ' ' + e[f]
}

async function pingUrl(url) {
  try {
      const response = await axios(url)
      if (response.status !== 200) console.error(`Not found: ${url}`)
      return true
  } catch (error) {
  }
  return false
}

function streamFiles(ipfs, files) {
  return new Promise((resolve, reject) => {
      const stream = ipfs.addReadableStream({
          wrapWithDirectory: true
          // progress: (length: number) =>
          //     setFileSizeReceived(formatBytes(length, 0))
      })

      stream.on('data', (data) => {
          console.log(`Added ${data.path} hash: ${data.hash}`)
          // The last data event will contain the directory hash
          if (data.path === '') resolve(data.hash)
      })

      stream.on('error', reject)
      stream.write(files)
      stream.end()
  })
}

let ipfs = null
let ipfsMessage = ''
let ipfsVersion = ''

function useIpfsApi(config) {
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

function Dropzone({
  handleOnDrop,
  disabled,
  multiple
}) {
  const onDrop = useCallback(acceptedFiles => {
    console.log(acceptedFiles)
    handleOnDrop(acceptedFiles)
  }, [
      handleOnDrop
  ])

  const {
      acceptedFiles,
      getRootProps,
      getInputProps,
      isDragActive,
      isDragReject
  } = useDropzone({ onDrop })

  const files = acceptedFiles.map((file: any) => (
      <li key={file.path}>
          {file.path} - {formatBytes(file.size, 0)}
      </li>
  ))

  return (
      <>
          {acceptedFiles.length > 0 ? (
              <aside >
                  <ul>{files}</ul>
              </aside>
          ) : (
              <div
                  {...getRootProps({
                      className: isDragActive
                  })}
              >
                  <input {...getInputProps({ multiple })} />
                  <p>
                      {isDragActive && !isDragReject
                          ? `Drop it like it's hot!`
                          : multiple
                          ? `Drag 'n' drop some files here, or click to select files`
                          : `Drag 'n' drop a file here, or click to select a file`}
                      {}
                  </p>
              </div>
          )}
      </>
  )
}

function Form({
  children,
  ipfsMessage,
  ipfsError,
  isIpfsReady,
  error
}) {
  return (
      <div>
          {/* <Label htmlFor="fileUpload" required> */}
              Add File To IPFS
          {/* </Label> */}
          {children}
          {/* <Status */}
              {/* message={ipfsMessage} */}
              {/* isIpfsReady={isIpfsReady} */}
              {/* error={ipfsError || error} */}
          {/* /> */}
      </div>
  )
}

export default function Ipfs({ addFile }: { addFile(url: string): void }) {
    const { hostname, port, protocol } = new URL(ipfsNodeUri)

    const ipfsConfig: IpfsConfig = {
        protocol: protocol.replace(':', ''),
        host: hostname,
        port: port || '443'
    }

    const { ipfs, isIpfsReady, ipfsError, ipfsMessage } = useIpfsApi(ipfsConfig)
    console.log({ ipfs, isIpfsReady, ipfsError, ipfsMessage })
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [fileSize, setFileSize] = useState('')
    const [fileSizeReceived] = useState('')
    const [error, setError] = useState('')

    useEffect(() => {
        setMessage(
            `Adding to IPFS<br />
             <small>${fileSizeReceived || 0}/${fileSize}</small><br />`
        )
    }, [fileSize, fileSizeReceived])

    async function addToIpfs(data: any) {
        try {
            console.log(`starting to stream:${data}`)
            const cid = await streamFiles(ipfs, data)
            console.log(`File added: ${cid}`)
            return cid
        } catch (error) {
            console.error(`Adding to IPFS failed: ${error.message}`)
            setLoading(false)
        }
    }

    async function handleOnDrop(acceptedFiles: any) {
      console.log("IPFS handleDrop", acceptedFiles)
        if (!acceptedFiles[0]) return

        setLoading(true)
        setError('')

        const file = acceptedFiles[0]
        const { path, size } = file
        const totalSize = formatBytes(size, 0)
        setFileSize(totalSize)

        // Add file to IPFS node
        const fileDetails = { path, content: file }
        console.log("fileDetails", fileDetails)

        const cid = await addToIpfs(fileDetails)
        console.log("CID", cid)
        if (!cid) return

        // Ping gateway url to make it globally available,
        // but store native url in DDO.
        const urlGateway = `${ipfsGatewayUri}/ipfs/${cid}/${path}`
        const url = `ipfs://${cid}/${path}`

        setMessage('Checking IPFS gateway URL')

        const isAvailable = await pingUrl(urlGateway)
        // add IPFS url to file.url
        isAvailable && addFile(url)
    }

    return (
        <Form
            error={error}
            ipfsMessage={ipfsMessage}
            ipfsError={ipfsError}
            isIpfsReady={isIpfsReady}
        >
            {loading ? (
              "Loading"
                // <Spinner message={message} />
            ) : (
                <Dropzone
                    multiple={false}
                    handleOnDrop={handleOnDrop}
                    disabled={!isIpfsReady}
                />
            )}
        </Form>
    )
}