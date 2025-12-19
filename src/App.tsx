import * as React from "react"
import { CopyToClipboard } from 'react-copy-to-clipboard-ts'

import { AllClasses, CharClass, CharSet, CharsetToString, ClassChars, NewCharset } from "./lib/charset";
import { PasswordGenerator } from "./lib/generator";

import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Container from "@mui/material/Container";
import Fab from "@mui/material/Fab";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/GridLegacy";
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";

interface StateOutput {
  password?: string;
}

interface StateInput {
  numChars: number,
  charset: CharSet,

  customEnabled: boolean;
  custom: string,
}

type State = StateInput & StateOutput;

interface Props {
  defaultNumChar: number,

  /* available presets for the number of characters */
  numPresets: Array<number>
}

export default class App extends React.Component<Props, State> {
  state: State = {
    numChars: this.props.defaultNumChar,
    charset: NewCharset(),
    customEnabled: false,
    custom: "",
  }


  generatePassword = () => {
    const { numChars, charset, customEnabled, custom } = this.state;

    const groups = CharsetToString(charset);
    const customs = customEnabled ? custom : "";

    const chars = new Set((groups + customs).split(""));

    const generator = new PasswordGenerator(Array.from(chars).join(""));
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

  toggleCustom = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ customEnabled: event.target.checked })
  }
  updateCustom = (event: React.ChangeEvent<HTMLInputElement>) => {
    const custom = event.target.value
    this.setState({ customEnabled: custom != "", custom })
  }

  render() {
    const { password, numChars, charset, custom, customEnabled } = this.state;
    const { numPresets } = this.props;
    return (
      <Container maxWidth="md">
        <form noValidate onSubmit={this.preventDefault} autoComplete="off">
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
                      <Grid item sm={6} style={{marginTop: 'auto', marginBottom: 'auto'}}>
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
                      <>
                        <Grid container>
                          <Grid item lg={3} style={{marginTop: 'auto', marginBottom: 'auto', marginRight: '1em'}}>
                            <FormControlLabel
                              label="Custom"
                              control={<Switch checked={customEnabled} onChange={this.toggleCustom} />}
                            />
                          </Grid>
                          <Grid item lg={8}>
                            <TextField fullWidth type="text" value={custom || ""} onChange={this.updateCustom} autoComplete="off" />
                          </Grid>
                        </Grid>
                      </>
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

