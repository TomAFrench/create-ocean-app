import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Essentials from './publish/Essentials';
import Information from './publish/Information';
import Authorship from './publish/Authorship';
import Register from './publish/Register';


const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      width: 600,
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  stepper: {
    padding: theme.spacing(3, 0, 5),
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
}));

const steps = ['Essentials', 'Information', 'Authorship', 'Register'];

export default function Publish({ocean}) {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);

  const [title, setTitle] = useState("")
  const [files, setFiles] = useState([])
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [creationDate, setCreationDate] = useState("2020-01-01")
  const [author, setAuthor] = useState("")
  const [copyrightHolder, setCopyrightHolder] = useState("")
  const [license, setLicense] = useState("")

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const renderActiveStep = (step) => {
    switch(step) {
      case 0:
        return (
          <Essentials
            title={title}
            setTitle={setTitle}
            files={files}
            setFiles={setFiles}
          />
        )
      case 1:
        return (
          <Information
            description={description}
            setDescription={setDescription}
            categories={category}
            setCategories={setCategory}
            creationDate={creationDate}
            setCreationDate={setCreationDate}
          />
        )
      case 2:
        return (
          <Authorship
            author={author}
            setAuthor={setAuthor}
            copyrightHolder={copyrightHolder}
            setCopyrightHolder={setCopyrightHolder}
            license={license}
            setLicense={setLicense}
          />
        )
      case 3:
        const assetInfo = { title, files, description, category, creationDate, author, copyrightHolder, license }
        return (
          <Register
            ocean={ocean}
            assetInfo={assetInfo}
          />
        )
      default:
        throw new Error('Unknown step');
    }
  }
  
  return (
    <Grid item>
      <Paper className={classes.paper}>
        <Typography component="h1" variant="h4" align="center">
          Publish
        </Typography>
        <Stepper activeStep={activeStep} className={classes.stepper}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {activeStep === steps.length ? (
          <>
            <Typography variant="h5" gutterBottom>
              Thank you for publishing.
            </Typography>
            <Typography variant="subtitle1">
              We're now uploading
            </Typography>
          </>
        ) : (
          <>
            {renderActiveStep(activeStep)}
            <div className={classes.buttons}>
              {activeStep !== 0 && (
                <Button onClick={handleBack} className={classes.button}>
                  Back
                </Button>
              )}
              {activeStep !== steps.length - 1 && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  className={classes.button}
                >
                  Next
                </Button>
              )}

            </div>
          </>
        )}
      </Paper>
    </Grid>
  );
}