import React, { useState, useEffect, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useIpfsApi } from '../hooks/IPFS'

import formatBytes from '../utils/formatBytes'
import pingUrl from '../utils/pingUrl'

import { ipfsGatewayUri, ipfsNodeUri } from '../config'

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

function Form({ children, ipfsMessage, ipfsError, isIpfsReady, error }) {
  return (
      <div>
          {children}
          {/* <Status */}
              {/* message={ipfsMessage} */}
              {/* isIpfsReady={isIpfsReady} */}
              {/* error={ipfsError || error} */}
          {/* /> */}
      </div>
  )
}

export default function Ipfs({addFile}) {
  const { hostname, port, protocol } = new URL(ipfsNodeUri)

  const ipfsConfig: IpfsConfig = {
      protocol: protocol.replace(':', ''),
      host: hostname,
      port: port || '443'
  }

  const { ipfs, isIpfsReady, ipfsError, ipfsMessage } = useIpfsApi(ipfsConfig)
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
    if (!acceptedFiles[0]) return

    setLoading(true)
    setError('')

    const file = acceptedFiles[0]
    const { path, size } = file
    const totalSize = formatBytes(size, 0)
    setFileSize(totalSize)

    // Add file to IPFS node
    const fileDetails = { path, content: file }

    const cid = await addToIpfs(fileDetails)
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

function Dropzone({handleOnDrop, disabled, multiple }) {
  const onDrop = useCallback(
    acceptedFiles => handleOnDrop(acceptedFiles),
    [handleOnDrop]
  )

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