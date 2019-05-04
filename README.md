## Fidelity Point System - Riccardo Persiani's MD Thesis [![HitCount](http://hits.dwyl.io/riccardopersiani/fidelity-points-system-thesis.svg)](http://hits.dwyl.io/riccardopersiani/fidelity-points-system-thesis)

Computer Engineering Master's Degree thesis progect at Technical University of Turin

### Architeture

These are 2 main components:

* next.js: server connected to the blockchain.

* express.js: server for authentication via oauth and for performing the PSD2 payment.

### :page_with_curl: __Instructions__:

**1)** Start the Next server from the main folder using `node server.js`.

**2)** Start the express.js server from `psd2` folder using `node oauth.js`.

### :black_nib: Notes

**❍** The frontend application for the loyalty point system is reachable at https://localhost:3000/

**❍** The frontend application for the PSD2 payment is reachable at https://localhost:8085/ - https://localhost:8888/
