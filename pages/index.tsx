import * as React from "react"
import Head from 'next/head'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { GetStaticProps } from "next";

import Page from "../components/page";


import Input from 'muicss/lib/react/input';
import Button from 'muicss/lib/react/button';
import { Checkbox, Col, Divider, Row } from "muicss/react";


interface StateOutput {
  password?: string;
}

interface StateInput {
  numChars: number,
  charset: Charset,
}

type State = StateInput & StateOutput;

interface Props {
  defaultNumChar: number,

  /* available presets for the number of characters */
  numPresets: Array<number>
}

enum CharCategory {
  LowerCaseLetters = "Lowercase Letters",
  UpperCaseLetters = "Uppercase Letters",
  Numbers = "Numbers",
  Symbols = "Symbols",
}

const CHAR_CATEGORIES = [
  CharCategory.LowerCaseLetters,
  CharCategory.UpperCaseLetters,
  CharCategory.Numbers,
  CharCategory.Symbols,
];

type Charset = Record<CharCategory,boolean>;
function CharsetToString(charset: Charset): string {
  return Object.keys(charset).map(k => charset[k] ? CHARSETS_CHARS[k] : "").join("");
}

const CHARSETS_CHARS: Record<CharCategory, string> = {
  [CharCategory.LowerCaseLetters]: "abcdefghijklmnopqrstuvwxyz",
  [CharCategory.UpperCaseLetters]: "ABCDEFGHIKLMNOPQRSTUVXYZ",
  [CharCategory.Numbers]: "0123456789",
  [CharCategory.Symbols]: "!\"$%^'()*+,-./:;<=>?@[\\]^_`",
}


export default class Home extends React.Component<Props, State> {
  state: State = {
    numChars: this.props.defaultNumChar,
    charset: {
      [CharCategory.LowerCaseLetters]: true,
      [CharCategory.UpperCaseLetters]: true,
      [CharCategory.Numbers]: true,
      [CharCategory.Symbols]: false,
    }
  }

  static generatePassword(input: StateInput): string {
    const charset = CharsetToString(input.charset);
    let output = "";
    for(let i = 0; i < input.numChars; i++) {
      output += Home.pickRandomChar(charset);
    }
    return output;
  }

  static pickRandomChar(charSetString: string): string {
    if (charSetString === "") return "";

    // compute how many bytes are needed for charset
    const count = charSetString.length;
    const numBytes = Math.ceil(count/256);
    let buffer = new Uint8Array(numBytes);

    // find a random index that is less than the number of bytes needed
    let index = 0;
    do {
      buffer = crypto.getRandomValues(buffer);

      index = 0;
      buffer.forEach((v, i) => {
        index += v << i * 8;
      });

    } while( index >= count);

    return charSetString[index];
  }
  

  generatePassword = () => {
    const {numChars, charset} = this.state;
    const password = Home.generatePassword({ numChars, charset });
    this.setState({ password })
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

  setCharCategory = (category: CharCategory, event: React.ChangeEvent<HTMLInputElement>) => {
    const { charset } = this.state;
    const newCharset =  {...charset, [category]: event.target.checked};

    this.setState({
      charset: newCharset,
    })
  }

  render() {
    const { password, numChars, charset } = this.state;
    const { numPresets } = this.props;
    return (
      <>
        <Page title="Password Generator" url="https://secure.everyone.wtf/" description="Generate a secure random password" />
        <Row>
            <Col className="mui--text-subhead">
              <h1>Password Generator</h1>
              <p>
                Use this page to quickly generate a random password.
                All data is generated and never leaves your device. 
              </p>
              <p>
                It's only stored in the clipboard if you click the "Copy" Button.
                If you close the page and forget to copy the password, it's gone. 
              </p>
            </Col>
        </Row>

        <Row>
          <Col md={10}>
            <Input type="text" value={password || ""} onChange={this.preventDefault} readOnly autoComplete="off"/>
          </Col>
          <Col md={2}>
            {password ? 
              <CopyToClipboard text={password || ""}>
                <Button color="primary">Copy To Clipboard</Button>
              </CopyToClipboard> :
              <Button color="primary" disabled>Copy To Clipboard</Button>
            }
          </Col>
        </Row>

        <Row>
          <Col>
            <Button color="danger" variant="large" onClick={this.generatePassword}>Generate Password</Button>
          </Col>
        </Row>

        <Row>
          <Col>
            <h2>Options</h2>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Input label="Password Length" type="number" value={numChars} min="1" onChange={this.storeNumChars} autoComplete="off" />

            <span className="mui--text-caption">
              Common:
            </span>
            {numPresets.map(v => <Button variant="flat" color="primary" onClick={this.loadNumCharsPreset.bind(this, v)} key={`prefix-${v}`} size="small">{v}</Button>)}
          </Col>
          <Col md={6}>
            {CHAR_CATEGORIES.map(c => <React.Fragment key={c}>
              <Checkbox label={<>{c}{" "}<code style={{color: "red"}}>{CHARSETS_CHARS[c]}</code></>} checked={charset[c]} onChange={this.setCharCategory.bind(this, c)} />         
            </React.Fragment>)}
            
          </Col>
        </Row>
      </>
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