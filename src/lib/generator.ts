export class PasswordGenerator {
    private readonly charBuffer: Uint8Array;
    private readonly charsetSize: number;

    constructor(public readonly charset: string) {
        this.charsetSize = charset.length;

        const numBytes = Math.ceil(this.charsetSize/(1 << 8));
        this.charBuffer = new Uint8Array(numBytes);
    }

    /** generates a set of characters of the provided length */
    public generate(length: number): string {
        if(length <= 0) throw new TypeError("length must be positive");

        let buffer = "";
        for(let i = 0; i < length; i++) {
            buffer += this.generateChar();
        }
        return buffer;
    }

    /** generates a single char of randomness */
    public generateChar(): string {
        if(this.charsetSize <= 0) return "";
        
        let value: number;
        do {
            crypto.getRandomValues(this.charBuffer);

            value = 0;
            this.charBuffer.forEach((byte, index) =>
                value += byte << index
            );
        } while(value >= this.charsetSize);

        return this.charset[value];
    }
}