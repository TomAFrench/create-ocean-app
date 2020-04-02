import React, {lazy, Suspense, useState} from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import filesize from 'filesize'
import Dotdotdot from 'react-dotdotdot'
import axios from 'axios'
import isUrl from 'is-url-superb'
import cleanupContentType from '../../utils/cleanupContentType'

const Ipfs = lazy(() => import('../IpfsDropzone'))

const Item = ({ item, removeFile }) => (
    <Grid container direction="column" spacing={3} alignContent="flex-start">
      <Grid item>
        <a href={item.url} title={item.url}>
            <Dotdotdot clamp={2}>{item.url}</Dotdotdot>
        </a>
        </Grid>
        <Grid item container spacing={3} alignItems="center">
          <Grid item>
            URL {item.found ? 'confirmed' : ' not confirmed'}
          </Grid>
          <Grid item>
            {
            item.found && item.contentLength
              ? filesize(item.contentLength)
              : 'unknown size'
            }
          </Grid>
          <Grid item>
            {
            item.found && item.contentType
              ? item.contentType.split('/')[1]
              : 'unknown type'
            }
          </Grid>
          <Grid item>
            <Button color="primary" variant="contained" title="Remove item" onClick={removeFile}>
              &times;
            </Button>
          </Grid>

    </Grid>
  </Grid>
)

const ItemForm = ({addFile}) => {
  const [url, setUrl] = useState('')
  const [hasError, setHasError] = useState(false)
  const [noUrl, setNoUrl] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()

    // return when required fields are empty, and url value is no url
    // Can't use browser validation cause we are in a form within a form
    if (!url) {
      setHasError(true)
      return
    }

    if (!url.includes('ipfs://') && !isUrl(url)) {
      setNoUrl(true)
      return
    }

    addFile(url)
  }

  const handleChangeUrl = (e) => {
    setUrl(e.currentTarget.value)
    clearErrors()
  }

  const clearErrors = () => {
      if (hasError) setHasError(false)
      if (noUrl) setNoUrl(false)
  }

  return (
    <Grid item container spacing={3} >
      <Grid item xs={8}>
          <TextField
            required
            id="url"
            name="url"
            label="URL"
            value={url}
            onChange={handleChangeUrl}
            placeholder="e.g. https://file.com/file.json"
            fullWidth
          />
      </Grid>
      <Grid item xs={4}>
          <Button color="primary" variant="contained" onClick={e => handleSubmit(e)}>
              Add File
          </Button>

          {hasError && (
              <span >
                  Please fill in all required fields.
              </span>
          )}
          {noUrl && (
              <span >
                  Please enter a valid URL.
              </span>
          )}
      </Grid>
    </Grid>
  )
}

const FileInput = ({files, setFiles}) => {
  const [open, setOpen] = useState(false)

  const buttons = [
    {
      id: 'url',
      title: '+ From URL',
      titleActive: '- Cancel'
    },
    {
      id: 'ipfs',
      title: '+ Add to IPFS',
      titleActive: '- Cancel'
    }
  ]

  // for canceling axios requests
  const signal = axios.CancelToken.source()

  const addFile = async (url) => {
    console.log(url)
    // check for duplicate urls
    const duplicateFiles = files
      .filter(props => url.includes(props.url))

    if (duplicateFiles.length > 0) {
        setOpen(false)
    }

    if (url.includes('ipfs://')) {
      const cid = url.split('ipfs://')[1]
      url = `${'https://gateway.ipfs.io'}/ipfs/${cid}`
    }


    const file = await getFile(url)
    setFiles([file])
    setOpen(false)
  }

  const getFile = async (url) => {
    const file = {
        url,
        contentType: '',
        found: false // non-standard
    }

    try {
      const { headers, status } = await axios({
        method: 'GET',
        url: url,
        cancelToken: signal.token
      })

      let contentLength
      let contentType
      let found = status.toString().startsWith('2') || status.toString().startsWith('416')
      console.log(headers)
      if ( headers['content-length'] ) {
        contentLength = headers['content-length'] // convert to number
      }
      // if ( headers['content-range'] && !headers['content-length'] ) {
      //     const size = headers['content-range'].split('/')[1]
      //     contentLength = parseInt(size) // convert to number
      // }
      if (headers['content-type']) {
        contentType = headers['content-type'].split(';')[0]
      }

      
      if (contentLength) file.contentLength = contentLength
      if (contentType) {
          file.contentType = contentType
          file.compression = cleanupContentType(contentType)
      }

      file.found = found

      return file
    } catch (error) {
      !axios.isCancel(error) && console.error(error.message)
    }
  }

  function removeFile(index) {
    const filesCopy = files.slice()
    filesCopy.splice(index, 1)
    setFiles(filesCopy)
  }

  const toggleForm = (form) => {
    // Toggle to provided form.
    // close form if toggling to itself.
    setOpen(open !== form && form)
  }

  return (
    <Grid container direction="column" spacing={3}>
      <Grid item >
        <Typography variant="h6" gutterBottom>
          Add File
        </Typography>
      </Grid>
      <Grid item >
        {buttons.map(button => {
            const isActive = button.id === open
            return (
              <Button
                key={button.id}
                link
                onClick={() => toggleForm(button.id)}
              >
                {isActive ? button.titleActive : button.title}
              </Button>
            )
        })}
      </Grid>
      <Grid item>
        { open === "url" ?
          <ItemForm
            placeholder={"testplaceholder"}
            addFile={addFile}
          /> 
          : 
          open === "ipfs" ?
            <Suspense fallback={<p>Loading...</p>}>
              <Ipfs addFile={addFile} />
            </Suspense>
          :
          null
        }
      </Grid>
      {files.length > 0 && (
        <Grid item>
          <Typography variant="h6" gutterBottom>
            Files to be published
          </Typography>
          {files.map((item, index) => 
            <Item
              key={index}
              item={item}
              removeFile={() => removeFile(index)}
            />
            )}
        </Grid>
      )}
    </Grid>
  )
}

export default function Essentials({title, setTitle, files, setFiles}) {
  console.log({title, setTitle, files, setFiles})

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Essentials
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            required
            id="title"
            name="title"
            label="Title"
            value={title}
            onChange={event => setTitle(event.target.value)}
            placeholder="e.g. Shapes of Desert Plants"
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <FileInput files={files} setFiles={setFiles}/>
        </Grid>
      </Grid>
    </>
  );
}