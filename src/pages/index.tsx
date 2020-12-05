import * as React from "react"
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { GetStaticProps } from "next";

import Page from "../components/page";


import { AllClasses, CharClass, CharSet, CharsetToString, ClassChars, NewCharset } from "../lib/charset";
import { PasswordGenerator } from "../lib/generator";

import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Container from "@material-ui/core/Container";
import Fab from "@material-ui/core/Fab";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import FormLabel from "@material-ui/core/FormLabel";
import Grid from "@material-ui/core/Grid";
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Switch from "@material-ui/core/Switch";
import TextField from "@material-ui/core/TextField";

interface StateOutput {
  password?: string;
}

interface StateInput {
  numChars: number,
  charset: CharSet,
}

type State = StateInput & StateOutput;

interface Props {
  defaultNumChar: number,

  /* available presets for the number of characters */
  numPresets: Array<number>
}

export default class Home extends React.Component<Props, State> {
  state: State = {
    numChars: this.props.defaultNumChar,
    charset: NewCharset(),
  }


  generatePassword = () => {
    const { numChars, charset } = this.state;

    const generator = new PasswordGenerator(CharsetToString(charset));
    const password = generator.generate(numChars);

    this.setState({ password })
  }

  selectElement = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.select();
  }

  preventDefault = (event: React.SyntheticEvent) => {
    event.preventDefault();
  }

  storeNumChars = (event: React.ChangeEvent<HTMLInputElement>) => {
    const numChars = parseInt(event.target.value, 10);
    this.setState({ numChars });
  }

  loadNumCharsPreset = (numChars: number) => {
    this.setState({ numChars })
  }

  setCharClass = (clz: CharClass, event: React.ChangeEvent<HTMLInputElement>) => {
    const { charset } = this.state;
    const newCharset = { ...charset, [clz]: event.target.checked };

    this.setState({
      charset: newCharset,
    })
  }

  render() {
    const { password, numChars, charset } = this.state;
    const { numPresets } = this.props;
    return (
      <Container maxWidth="md">
        <form noValidate onSubmit={this.preventDefault} autoComplete="off">
          <Page title="Password Generator" url="https://secure.everyone.wtf/" description="Generate a secure random password" />

          <Card>
            <CardHeader title="Password Generator" subheader="Use this page to quickly generate a random password. All data is generated locally and never leaves your device. " />
            <CardContent>
              
              <Grid container direction="row" spacing={1}>
                <Grid container spacing={1}>
                  <Grid item sm={10}>
                    <TextField fullWidth type="text" value={password || ""} onChange={this.preventDefault} inputProps={{ readOnly: true }} autoComplete="off" onFocus={this.selectElement} />
                  </Grid>
                  <Grid item sm={2}>
                    {password ?
                      <CopyToClipboard text={password || ""}>
                        <Button color="primary">Copy To Clipboard</Button>
                      </CopyToClipboard> :
                      <Button color="primary" disabled>Copy To Clipboard</Button>
                    }
                  </Grid>
                </Grid>
                
                <Grid container spacing={1}>
                  <Grid item sm={6}>
                    <FormLabel component="legend">Password Length</FormLabel>
                    <Grid container spacing={1}>
                      <Grid item sm={6}>
                        <TextField type="number" value={numChars} inputProps={{ min: "1" }} onChange={this.storeNumChars} autoComplete="off" />
                      </Grid>
                      <Grid item sm={6}>
                        <ButtonGroup variant="contained" color="primary" aria-label="contained primary button group">
                          {numPresets.map(v => <Button onClick={this.loadNumCharsPreset.bind(this, v)} key={`prefix-${v}`}>{v}</Button>)}
                        </ButtonGroup>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item sm={6}>
                    <FormGroup>
                      <FormLabel component="legend">Allowed Characters</FormLabel>
                      {AllClasses.map(c => <React.Fragment key={c}>
                        <FormControlLabel
                          label={<>{c}{" "}<code style={{ color: "red" }}>{ClassChars[c]}</code></>}
                          control={<Switch checked={charset[c]} onChange={this.setCharClass.bind(this, c)} />}
                        />
                      </React.Fragment>)}
                    </FormGroup>
                  </Grid>
                </Grid>
              </Grid>

              <CardActions>
                <Fab variant="extended" onClick={this.generatePassword}>
                      Generate Password
                  </Fab>
              </CardActions>
            </CardContent>
          </Card>
        </form>
      </Container>
    );
  }
}

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const props = {
    defaultNumChar: 64,
    numPresets: [50, 64, 128],
  }
  return { props };
}