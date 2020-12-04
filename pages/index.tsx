import * as React from "react"
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import {CopyToClipboard} from 'react-copy-to-clipboard'

interface Output {
  password?: string;
}

interface Input {
  numChars: number,
}

type State = Input & Output;

const CHARSET_ALPHABETIC = "ABCDEFGHIKLMNOPQRSTUVXWXYZabcdefghiklmnopqrstuvxyz0123456789";

export default class Home extends React.Component<{}, State> {
  state: State = {
    numChars: 64,
  }

  static generatePassword(input: Input): string {
    let output = "";
    for(let i = 0; i < input.numChars; i++) {
      output += Home.pickRandomChar(CHARSET_ALPHABETIC);
    }
    return output;
  }

  static pickRandomChar(charset: string): string {

    // compute how many bytes are needed for charset
    const count = charset.length;
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

    return charset[index];
  }
  

  doOutput = () => {
    const {numChars} = this.state;
    const password = Home.generatePassword({ numChars });
    this.setState({ password })
  }

  dontSubmit = (event: React.FormEvent) => {
    event.preventDefault();
  }

  storeNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
    const numChars = parseInt(event.currentTarget.value, 10);
    this.setState({ numChars });
  }

  render() {
    const { password, numChars } = this.state;
    return (
      <div className={styles.container}>
        <Head>
          <title>Password Generator</title>
        </Head>

        <form onSubmit={this.dontSubmit}>
          <input type="text" value={password || ""} readOnly />
          <CopyToClipboard text={password || ""}>
            <button>Copy</button>
          </CopyToClipboard>
          <br />
          <input type="number" value={numChars} min="1" onChange={this.storeNumber}></input>
          <br />
          <button onClick={this.doOutput}>Generate</button>
        </form>
      </div>
    );
  }
}
