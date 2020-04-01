import React, {lazy, Suspense, PureComponent, useState} from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import filesize from 'filesize'
import Dotdotdot from 'react-dotdotdot'
import axios from 'axios'

const Ipfs = lazy(() => import('../IpfsDropzone'))

const cleanupContentType = (contentType: string) => {
  // strip away the 'application/' part
  const contentTypeSplit = contentType.split('/')[1]

  if (!contentTypeSplit) return contentType

  let contentTypeCleaned

  // TODO: add all the possible archive & compression MIME types
  switch (contentType) {
      case 'application/x-lzma':
      case 'application/x-xz':
      case 'application/x-tar':
      case 'application/x-gtar':
      case 'application/x-bzip2':
      case 'application/x-gzip':
      case 'application/x-7z-compressed':
      case 'application/x-rar-compressed':
      case 'application/x-zip-compressed':
      case 'application/x-apple-diskimage':
          contentTypeCleaned = contentTypeSplit
              .replace('x-', '')
              .replace('-compressed', '')
          break
      default:
          contentTypeCleaned = contentTypeSplit
          break
  }

  // Manual replacements
  contentTypeCleaned = contentTypeCleaned
      .replace(
          'vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'xlsx'
      )
      .replace('vnd.ms-excel', 'xls')
      .replace('apple-diskimage', 'dmg')
      .replace('octet-stream', 'Binary')
      .replace('svg+xml', 'svg')

  return contentTypeCleaned
}


const Item = ({ item, removeFile }) => (
    <li>
        <a href={item.url} title={item.url}>
            <Dotdotdot clamp={2}>{item.url}</Dotdotdot>
        </a>
        <div >
            <span>URL {item.found ? 'confirmed' : ' not confirmed'}</span>
            <span>
                {item.found && item.contentLength
                    ? filesize(item.contentLength)
                    : 'unknown size'}
            </span>
            <span>
                {item.found && item.contentType
                    ? item.contentType.split('/')[1]
                    : 'unknown type'}
            </span>
        </div>
        <button
            type="button"
            title="Remove item"
            onClick={removeFile}
        >
            &times;
        </button>
    </li>
)

class ItemForm extends PureComponent{
    state = {
        url: '',
        hasError: false,
        noUrl: false
    }

    handleSubmit = (e) => {
        e.preventDefault()

        const { url } = this.state

        // return when required fields are empty, and url value is no url
        // Can't use browser validation cause we are in a form within a form
        if (!url) {
            this.setState({ hasError: true })
            return
        }

        if (url && !url.includes('ipfs://') /*&& !isUrl(url)*/) {
            this.setState({ noUrl: true })
            return
        }

        this.props.addFile(url)
    }

    handleChangeUrl = (e) => {
        this.setState({ url: e.currentTarget.value })
        this.clearErrors()
    }

    clearErrors() {
        if (this.state.hasError) this.setState({ hasError: false })
        if (this.state.noUrl) this.setState({ noUrl: false })
    }

    render() {
      const { url, hasError, noUrl } = this.state

      return (
        <Grid item container spacing={3}>
          <Grid item xs={8}>
            Enter URL
          </Grid>
          <Grid item xs={8}>
              <TextField
                required
                id="url"
                name="url"
                label="URL"
                value={url}
                onChange={this.handleChangeUrl}
                placeholder="e.g. https://file.com/file.json"
                fullWidth
              />
          </Grid>
          <Grid item xs={4}>
              <Button onClick={(e: Event) => this.handleSubmit(e)}>
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
        if ( headers['content-range'] && !headers['content-length'] ) {
            const size = headers['content-range'].split('/')[1]
            contentLength = parseInt(size) // convert to number
        }
        if (headers['content-type']) {
          contentType = headers['content-type'].split(';')[0]
        }

        
        if (contentLength) file.contentLength = contentLength
        if (contentType) {
            file.contentType = contentType
            file.compression = cleanupContentType(contentType)
        }

        // file.found = found

        return file
    } catch (error) {
        !axios.isCancel(error) && console.error(error.message)
    }
  }

  function removeFile(index) {
    console.log(files, index)
    const fileCopy = files
    const deleted = fileCopy.splice(index, 1)
    console.log(fileCopy)
    setFiles(fileCopy)
  }

  const toggleForm = (form) => {
    // Toggle to provided form.
    // close form if toggling to itself.
    setOpen(open !== form && form)
  }

  return (
    <Grid container direction="column">
      <Grid item >
        <Typography variant="h6" gutterBottom>
          Add File
        </Typography>
      </Grid>
      <input
        type="hidden"
        // name={name}
        value={JSON.stringify(files)}
        // onChange={onChange}
        data-testid="files"
      />
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
        { open === "url" ?
            <ItemForm
              placeholder={"testplaceholder"}
              addFile={addFile}
            /> 
            : open === "ipfs" ?
              <Suspense fallback={<p>Loading...</p>}>
                <Ipfs addFile={addFile} />
              </Suspense>
              :
              null
          }
      {files.length > 0 && (
        <ul >
            {files.map((item, index) => (
                <Item
                    key={index}
                    item={item}
                    removeFile={() => removeFile(index)}
                />
            ))}
        </ul>
      )}
      </Grid>
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