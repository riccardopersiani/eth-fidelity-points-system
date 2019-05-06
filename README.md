## __Fidelity Point System__ [![HitCount](http://hits.dwyl.io/riccardopersiani/fidelity-points-system-thesis.svg)](http://hits.dwyl.io/riccardopersiani/fidelity-points-system-thesis)[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg?v=103)](https://opensource.org/licenses/mit-license.php)

Computer Engineering Master's Degree thesis progect at Technical University of Turin

### __Architecture__

These are 2 main components:

__❍__ next.js: server connected to the blockchain.

__❍__ express.js: server for authentication via oauth and for performing the PSD2 payment.

### :page_with_curl: __Instructions__:

**1)** Go on the Infura website to get an Infura key: [infura.io](https://infura.io).

**2)** Get a mnemonic passphrase, an easy way is to get a Metamask one: [metamask.io](https://metamask.io/)

**3)** Fire up your favourite console & clone this repo somewhere:

__`❍ git clone https://github.com/riccardopersiani/fidelity-points-system-thesis.git`__

**4)** Enter this directory & install dependencies:

__`❍ cd fidelity-points-system-thesis && npm install`__

**5)** Go in `ethereum` folder and run `node compile.js` (Solidity 0.4.25):

__`❍ cd ethereum && npx truffle compile`__

**6)** In `fidelity-points-system-thesis`, create a new file `apikeys.js` or `.env` and add the mnemonic passphrase and the Infura key to it, such as:

```javascript
// apikeys.js example

module.exports = {
  mnemonic: 'word1 word2 word3 word4 word5 word6 word7 word8 word9 word10 word11 word12',
  infuraKey: '0123456789abcdef0123456789abcdef'
}
```

**7)** Deploy the contracts with Truffle leveraging a testnet, such as Kovan:

__`❍ npx truffle  deploy --network kovan`__

**8)** In the main folder build the Next server:

__`❍ npm run build`__

**9)** In the main folder start the Next server:

__`❍ npm run dev`__

**10)** Start the Express server:

__`❍ cd psd2 && node oauth.js`__

### :black_nib: Notes

__❍__ Note that your own Infura key and the Metamask passphrase must be kept secure. The ones provided here are simply placeholders.

__❍__ The frontend application for the loyalty point system is reachable at https://localhost:3000/

__❍__ The frontend application for the PSD2 payment is reachable at https://localhost:8085/ - https://localhost:8888/

__*Happy developing!*__
