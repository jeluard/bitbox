An experimental fat binary bundler leveraging Node.js [single-executable-applications](https://nodejs.org/api/single-executable-applications.html) (or `SEA`) feature. 
It packages a complete node project (including `node_modules`) as a `tar.gz` that is embedded in a binary.
At runtime, the project is uncompressed and executed.

Only supports OSX and linux. Requires Node.JS v21.7+.

To test:

```shell
node src/index.js example
./bitbox-buid/example
```