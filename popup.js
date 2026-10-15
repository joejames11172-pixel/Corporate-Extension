(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });
  var __commonJS = (cb, mod) => function __require2() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/tssrp6a/dist/crossEnvCrypto.js
  var require_crossEnvCrypto = __commonJS({
    "node_modules/tssrp6a/dist/crossEnvCrypto.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.crossEnvCrypto = void 0;
      try {
        const webcrypto = typeof window !== "undefined" && window.crypto || // eslint-disable-next-line @typescript-eslint/no-var-requires
        __require("crypto").webcrypto;
        if (webcrypto) {
          if (!webcrypto.subtle) {
            throw new Error("Crypto.Subtle is undefined. Make sure you are using HTTPS in a compatible browser.");
          }
          const digestFunctionToHashFunction = (algorithm) => (data) => webcrypto.subtle.digest(algorithm, data);
          exports.crossEnvCrypto = {
            randomBytes: webcrypto.getRandomValues.bind(webcrypto),
            hashFunctions: {
              SHA1: digestFunctionToHashFunction("SHA-1"),
              SHA256: digestFunctionToHashFunction("SHA-256"),
              SHA384: digestFunctionToHashFunction("SHA-384"),
              SHA512: digestFunctionToHashFunction("SHA-512")
            }
          };
        } else {
          const nodeCrypto = __require("crypto");
          const nodeCreateHashToHashFunction = (algorithm) => (data) => nodeCrypto.createHash(algorithm).update(data).digest().buffer;
          exports.crossEnvCrypto = {
            randomBytes: nodeCrypto.randomFillSync,
            hashFunctions: {
              SHA1: nodeCreateHashToHashFunction("sha1"),
              SHA256: nodeCreateHashToHashFunction("sha256"),
              SHA384: nodeCreateHashToHashFunction("sha384"),
              SHA512: nodeCreateHashToHashFunction("sha512")
            }
          };
        }
      } catch (e) {
        console.error(e);
        throw new Error("No suitable crypto library was found. You may need a polyfill.");
      }
    }
  });

  // node_modules/tssrp6a/dist/parameters.js
  var require_parameters = __commonJS({
    "node_modules/tssrp6a/dist/parameters.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.SRPParameters = void 0;
      var crossEnvCrypto_1 = require_crossEnvCrypto();
      var SRPParameters2 = class _SRPParameters {
        constructor(primeGroup = _SRPParameters.PrimeGroup[2048], H = _SRPParameters.H.SHA512) {
          this.primeGroup = primeGroup;
          this.H = H;
          this.NBits = this.primeGroup.N.toString(2).length;
          if (!H) {
            throw new Error("Hash function required");
          }
        }
      };
      exports.SRPParameters = SRPParameters2;
      SRPParameters2.PrimeGroup = {
        256: {
          N: BigInt("125617018995153554710546479714086468244499594888726646874671447258204721048803"),
          g: BigInt(2)
        },
        512: {
          N: BigInt("11144252439149533417835749556168991736939157778924947037200268358613863350040339017097790259154750906072491181606044774215413467851989724116331597513345603"),
          g: BigInt(2)
        },
        768: {
          N: BigInt("1087179135105457859072065649059069760280540086975817629066444682366896187793570736574549981488868217843627094867924800342887096064844227836735667168319981288765377499806385489913341488724152562880918438701129530606139552645689583147"),
          g: BigInt(2)
        },
        1024: {
          N: BigInt("167609434410335061345139523764350090260135525329813904557420930309800865859473551531551523800013916573891864789934747039010546328480848979516637673776605610374669426214776197828492691384519453218253702788022233205683635831626913357154941914129985489522629902540768368409482248290641036967659389658897350067939"),
          g: BigInt(2)
        },
        1536: {
          N: BigInt("1486998185923128292816507353619409521152457662596380074614818966810244974827752411420380336514078832314731499938313197533147998565301020797040787428051479639316928015998415709101293902971072960487527411068082311763171549170528008620813391411445907584912865222076100726050255271567749213905330659264908657221124284665444825474741087704974475795505492821585749417639344967192301749033325359286273431675492866492416941152646940908101472416714421046022696100064262587"),
          g: BigInt(2)
        },
        2048: {
          N: BigInt("21766174458617435773191008891802753781907668374255538511144643224689886235383840957210909013086056401571399717235807266581649606472148410291413364152197364477180887395655483738115072677402235101762521901569820740293149529620419333266262073471054548368736039519702486226506248861060256971802984953561121442680157668000761429988222457090413873973970171927093992114751765168063614761119615476233422096442783117971236371647333871414335895773474667308967050807005509320424799678417036867928316761272274230314067548291133582479583061439577559347101961771406173684378522703483495337037655006751328447510550299250924469288819"),
          g: BigInt(2)
        }
      };
      SRPParameters2.H = {
        SHA1: crossEnvCrypto_1.crossEnvCrypto.hashFunctions.SHA1,
        SHA256: crossEnvCrypto_1.crossEnvCrypto.hashFunctions.SHA256,
        SHA384: crossEnvCrypto_1.crossEnvCrypto.hashFunctions.SHA384,
        SHA512: crossEnvCrypto_1.crossEnvCrypto.hashFunctions.SHA512
      };
    }
  });

  // node_modules/tssrp6a/dist/utils.js
  var require_utils = __commonJS({
    "node_modules/tssrp6a/dist/utils.js"(exports) {
      "use strict";
      var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
        function adopt(value) {
          return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
          });
        }
        return new (P || (P = Promise))(function(resolve, reject) {
          function fulfilled(value) {
            try {
              step(generator.next(value));
            } catch (e) {
              reject(e);
            }
          }
          function rejected(value) {
            try {
              step(generator["throw"](value));
            } catch (e) {
              reject(e);
            }
          }
          function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
          }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.modPow = exports.hashBitCount = exports.createVerifierAndSalt = exports.createVerifier = exports.generateRandomBigInt = exports.generateRandomString = exports.hashPadded = exports.hash = exports.padStartArrayBuffer = exports.stringToArrayBuffer = exports.arrayBufferToBigInt = exports.bigIntToArrayBuffer = void 0;
      var crossEnvCrypto_1 = require_crossEnvCrypto();
      var ZERO = BigInt(0);
      var ONE = BigInt(1);
      var TWO = BigInt(2);
      var bigIntToArrayBuffer = (n) => {
        const hex2 = n.toString(16);
        const arrayBuffer = new ArrayBuffer(Math.ceil(hex2.length / 2));
        const u8 = new Uint8Array(arrayBuffer);
        let offset = 0;
        if (hex2.length % 2 !== 0) {
          u8[0] = parseInt(hex2[0], 16);
          offset = 1;
        }
        for (let i = 0; i < arrayBuffer.byteLength; i++) {
          u8[i + offset] = parseInt(hex2.slice(2 * i + offset, 2 * i + 2 + offset), 16);
        }
        return arrayBuffer;
      };
      exports.bigIntToArrayBuffer = bigIntToArrayBuffer;
      var arrayBufferToBigInt = (arrayBuffer) => {
        const hex2 = [];
        new Uint8Array(arrayBuffer).forEach((i) => {
          hex2.push(("0" + i.toString(16)).slice(-2));
        });
        return BigInt(`0x${hex2.join("")}`);
      };
      exports.arrayBufferToBigInt = arrayBufferToBigInt;
      function stringToArrayBuffer(str) {
        return new TextEncoder().encode(str).buffer;
      }
      exports.stringToArrayBuffer = stringToArrayBuffer;
      var padStartArrayBuffer = (arrayBuffer, targetLength) => {
        const u8 = new Uint8Array(arrayBuffer);
        if (u8.length < targetLength) {
          const tmp = new Uint8Array(targetLength);
          tmp.fill(0, 0, targetLength - u8.length);
          tmp.set(u8, targetLength - u8.length);
          return tmp;
        }
        return u8;
      };
      exports.padStartArrayBuffer = padStartArrayBuffer;
      function hash(parameters, ...arrays) {
        const length = arrays.reduce((p, c) => p + c.byteLength, 0);
        const target = new Uint8Array(length);
        for (let offset = 0, i = 0; i < arrays.length; i++) {
          target.set(new Uint8Array(arrays[i]), offset);
          offset += arrays[i].byteLength;
        }
        return parameters.H(target);
      }
      exports.hash = hash;
      function hashPadded(parameters, targetLen, ...arrays) {
        const arraysPadded = arrays.map((arrayBuffer) => exports.padStartArrayBuffer(arrayBuffer, targetLen));
        return hash(parameters, ...arraysPadded);
      }
      exports.hashPadded = hashPadded;
      function generateRandomString(characterCount = 10) {
        const u8 = new Uint8Array(Math.ceil(Math.ceil(characterCount / 2)));
        crossEnvCrypto_1.crossEnvCrypto.randomBytes(u8);
        return u8.reduce((str, i) => {
          const hex2 = i.toString(16).toString();
          if (hex2.length === 1) {
            return str + "0" + hex2;
          }
          return str + hex2;
        }, "").slice(0, characterCount);
      }
      exports.generateRandomString = generateRandomString;
      function generateRandomBigInt(numBytes = 16) {
        return exports.arrayBufferToBigInt(generateRandom(numBytes));
      }
      exports.generateRandomBigInt = generateRandomBigInt;
      function createVerifier(routines2, I, s, P) {
        return __awaiter(this, void 0, void 0, function* () {
          if (!I || !I.trim()) {
            throw new Error("Identity (I) must not be null or empty.");
          }
          if (!s) {
            throw new Error("Salt (s) must not be null.");
          }
          if (!P) {
            throw new Error("Password (P) must not be null");
          }
          const x = yield routines2.computeX(I, s, P);
          return routines2.computeVerifier(x);
        });
      }
      exports.createVerifier = createVerifier;
      function createVerifierAndSalt(routines2, I, P, sBytes) {
        return __awaiter(this, void 0, void 0, function* () {
          const s = yield routines2.generateRandomSalt(sBytes);
          return {
            s,
            v: yield createVerifier(routines2, I, s, P)
          };
        });
      }
      exports.createVerifierAndSalt = createVerifierAndSalt;
      var hashBitCount = (parameters) => __awaiter(void 0, void 0, void 0, function* () {
        return (yield hash(parameters, exports.bigIntToArrayBuffer(BigInt(1)))).byteLength * 8;
      });
      exports.hashBitCount = hashBitCount;
      function modPow(x, pow, mod) {
        let result = ONE;
        while (pow > ZERO) {
          if (pow % TWO == ONE) {
            result = x * result % mod;
            pow -= ONE;
          } else {
            x = x * x % mod;
            pow /= TWO;
          }
        }
        return result;
      }
      exports.modPow = modPow;
      var generateRandom = (numBytes) => {
        const u8 = new Uint8Array(numBytes);
        crossEnvCrypto_1.crossEnvCrypto.randomBytes(u8);
        return u8.buffer;
      };
    }
  });

  // node_modules/tssrp6a/dist/routines.js
  var require_routines = __commonJS({
    "node_modules/tssrp6a/dist/routines.js"(exports) {
      "use strict";
      var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
        function adopt(value) {
          return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
          });
        }
        return new (P || (P = Promise))(function(resolve, reject) {
          function fulfilled(value) {
            try {
              step(generator.next(value));
            } catch (e) {
              reject(e);
            }
          }
          function rejected(value) {
            try {
              step(generator["throw"](value));
            } catch (e) {
              reject(e);
            }
          }
          function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
          }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.SRPRoutines = void 0;
      var utils_1 = require_utils();
      var SRPRoutines2 = class {
        constructor(parameters) {
          this.parameters = parameters;
        }
        hash(...as) {
          return utils_1.hash(this.parameters, ...as);
        }
        hashPadded(...as) {
          const targetLength = Math.trunc((this.parameters.NBits + 7) / 8);
          return utils_1.hashPadded(this.parameters, targetLength, ...as);
        }
        computeK() {
          return __awaiter(this, void 0, void 0, function* () {
            return utils_1.arrayBufferToBigInt(yield this.hashPadded(utils_1.bigIntToArrayBuffer(this.parameters.primeGroup.N), utils_1.bigIntToArrayBuffer(this.parameters.primeGroup.g)));
          });
        }
        generateRandomSalt(numBytes) {
          return __awaiter(this, void 0, void 0, function* () {
            const HBits = yield utils_1.hashBitCount(this.parameters);
            const saltBytes = numBytes || 2 * HBits / 8;
            return utils_1.generateRandomBigInt(saltBytes);
          });
        }
        computeX(I, s, P) {
          return __awaiter(this, void 0, void 0, function* () {
            return utils_1.arrayBufferToBigInt(yield this.hash(utils_1.bigIntToArrayBuffer(s), yield this.computeIdentityHash(I, P)));
          });
        }
        computeXStep2(s, identityHash) {
          return __awaiter(this, void 0, void 0, function* () {
            return utils_1.arrayBufferToBigInt(yield this.hash(utils_1.bigIntToArrayBuffer(s), identityHash));
          });
        }
        computeIdentityHash(_, P) {
          return __awaiter(this, void 0, void 0, function* () {
            return yield this.hash(utils_1.stringToArrayBuffer(P));
          });
        }
        computeVerifier(x) {
          return utils_1.modPow(this.parameters.primeGroup.g, x, this.parameters.primeGroup.N);
        }
        generatePrivateValue() {
          const numBits = Math.max(256, this.parameters.NBits);
          let bi;
          do {
            bi = utils_1.generateRandomBigInt(numBits / 8) % this.parameters.primeGroup.N;
          } while (bi === BigInt(0));
          return bi;
        }
        computeClientPublicValue(a) {
          return utils_1.modPow(this.parameters.primeGroup.g, a, this.parameters.primeGroup.N);
        }
        isValidPublicValue(value) {
          return value % this.parameters.primeGroup.N !== BigInt(0);
        }
        computeU(A, B) {
          return __awaiter(this, void 0, void 0, function* () {
            return utils_1.arrayBufferToBigInt(yield this.hashPadded(utils_1.bigIntToArrayBuffer(A), utils_1.bigIntToArrayBuffer(B)));
          });
        }
        computeClientEvidence(_I, _s, A, B, S) {
          return __awaiter(this, void 0, void 0, function* () {
            return utils_1.arrayBufferToBigInt(yield this.hash(utils_1.bigIntToArrayBuffer(A), utils_1.bigIntToArrayBuffer(B), utils_1.bigIntToArrayBuffer(S)));
          });
        }
        computeServerEvidence(A, M1, S) {
          return __awaiter(this, void 0, void 0, function* () {
            return utils_1.arrayBufferToBigInt(yield this.hash(utils_1.bigIntToArrayBuffer(A), utils_1.bigIntToArrayBuffer(M1), utils_1.bigIntToArrayBuffer(S)));
          });
        }
        computeClientSessionKey(k, x, u, a, B) {
          const N = this.parameters.primeGroup.N;
          const exp = u * x + a;
          const tmp = utils_1.modPow(this.parameters.primeGroup.g, x, N) * k % N;
          return utils_1.modPow(B + N - tmp, exp, N);
        }
      };
      exports.SRPRoutines = SRPRoutines2;
    }
  });

  // node_modules/tssrp6a/dist/session-client.js
  var require_session_client = __commonJS({
    "node_modules/tssrp6a/dist/session-client.js"(exports) {
      "use strict";
      var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
        function adopt(value) {
          return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
          });
        }
        return new (P || (P = Promise))(function(resolve, reject) {
          function fulfilled(value) {
            try {
              step(generator.next(value));
            } catch (e) {
              reject(e);
            }
          }
          function rejected(value) {
            try {
              step(generator["throw"](value));
            } catch (e) {
              reject(e);
            }
          }
          function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
          }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.SRPClientSessionStep2 = exports.SRPClientSessionStep1 = exports.SRPClientSession = void 0;
      var SRPClientSession2 = class {
        constructor(routines2) {
          this.routines = routines2;
        }
        step1(userId, userPassword) {
          return __awaiter(this, void 0, void 0, function* () {
            if (!userId || !userId.trim()) {
              throw new Error("User identity must not be null nor empty");
            }
            if (!userPassword) {
              throw new Error("User password must not be null");
            }
            const IH = yield this.routines.computeIdentityHash(userId, userPassword);
            return new SRPClientSessionStep1(this.routines, userId, IH);
          });
        }
      };
      exports.SRPClientSession = SRPClientSession2;
      var SRPClientSessionStep1 = class _SRPClientSessionStep1 {
        constructor(routines2, I, IH) {
          this.routines = routines2;
          this.I = I;
          this.IH = IH;
        }
        step2(salt, B) {
          return __awaiter(this, void 0, void 0, function* () {
            if (!salt) {
              throw new Error("Salt (s) must not be null");
            }
            if (!B) {
              throw new Error("Public server value (B) must not be null");
            }
            const x = yield this.routines.computeXStep2(salt, this.IH);
            const a = this.routines.generatePrivateValue();
            const A = this.routines.computeClientPublicValue(a);
            const k = yield this.routines.computeK();
            const u = yield this.routines.computeU(A, B);
            const S = this.routines.computeClientSessionKey(k, x, u, a, B);
            const M1 = yield this.routines.computeClientEvidence(this.I, salt, A, B, S);
            return new SRPClientSessionStep2(this.routines, A, M1, S);
          });
        }
        toJSON() {
          return { I: this.I, IH: Array.from(new Uint8Array(this.IH)) };
        }
        static fromState(routines2, state) {
          return new _SRPClientSessionStep1(routines2, state.I, new Uint8Array(state.IH).buffer);
        }
      };
      exports.SRPClientSessionStep1 = SRPClientSessionStep1;
      var SRPClientSessionStep2 = class _SRPClientSessionStep2 {
        constructor(routines2, A, M1, S) {
          this.routines = routines2;
          this.A = A;
          this.M1 = M1;
          this.S = S;
        }
        step3(M2) {
          return __awaiter(this, void 0, void 0, function* () {
            if (!M2) {
              throw new Error("Server evidence (M2) must not be null");
            }
            const computedM2 = yield this.routines.computeServerEvidence(this.A, this.M1, this.S);
            if (computedM2 !== M2) {
              throw new Error("Bad server credentials");
            }
          });
        }
        toJSON() {
          return {
            A: this.A.toString(16),
            M1: this.M1.toString(16),
            S: this.S.toString(16)
          };
        }
        static fromState(routines2, state) {
          return new _SRPClientSessionStep2(routines2, BigInt("0x" + state.A), BigInt("0x" + state.M1), BigInt("0x" + state.S));
        }
      };
      exports.SRPClientSessionStep2 = SRPClientSessionStep2;
    }
  });

  // node_modules/tssrp6a/dist/session-server.js
  var require_session_server = __commonJS({
    "node_modules/tssrp6a/dist/session-server.js"(exports) {
      "use strict";
      var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
        function adopt(value) {
          return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
          });
        }
        return new (P || (P = Promise))(function(resolve, reject) {
          function fulfilled(value) {
            try {
              step(generator.next(value));
            } catch (e) {
              reject(e);
            }
          }
          function rejected(value) {
            try {
              step(generator["throw"](value));
            } catch (e) {
              reject(e);
            }
          }
          function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
          }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.SRPServerSessionStep1 = exports.SRPServerSession = void 0;
      var utils_1 = require_utils();
      var SRPServerSession = class {
        constructor(routines2) {
          this.routines = routines2;
        }
        step1(identifier, salt, verifier) {
          return __awaiter(this, void 0, void 0, function* () {
            const b = this.routines.generatePrivateValue();
            const k = yield this.routines.computeK();
            const B = computeServerPublicValue(this.routines.parameters, k, verifier, b);
            return new SRPServerSessionStep1(this.routines, identifier, salt, verifier, b, B);
          });
        }
      };
      exports.SRPServerSession = SRPServerSession;
      var SRPServerSessionStep1 = class _SRPServerSessionStep1 {
        constructor(routines2, identifier, salt, verifier, b, B) {
          this.routines = routines2;
          this.identifier = identifier;
          this.salt = salt;
          this.verifier = verifier;
          this.b = b;
          this.B = B;
        }
        /**
         * Compute the session key "S" without computing or checking client evidence
         */
        sessionKey(A) {
          return __awaiter(this, void 0, void 0, function* () {
            if (A === null) {
              throw new Error("Client public value (A) must not be null");
            }
            if (!this.routines.isValidPublicValue(A)) {
              throw new Error(`Invalid Client public value (A): ${A.toString(16)}`);
            }
            const u = yield this.routines.computeU(A, this.B);
            const S = computeServerSessionKey(this.routines.parameters.primeGroup.N, this.verifier, u, A, this.b);
            return S;
          });
        }
        step2(A, M1) {
          return __awaiter(this, void 0, void 0, function* () {
            if (!M1) {
              throw new Error("Client evidence (M1) must not be null");
            }
            const S = yield this.sessionKey(A);
            const computedM1 = yield this.routines.computeClientEvidence(this.identifier, this.salt, A, this.B, S);
            if (computedM1 !== M1) {
              throw new Error("Bad client credentials");
            }
            const M2 = this.routines.computeServerEvidence(A, M1, S);
            return M2;
          });
        }
        toJSON() {
          return {
            identifier: this.identifier,
            salt: this.salt.toString(16),
            verifier: this.verifier.toString(16),
            b: this.b.toString(16),
            B: this.B.toString(16)
          };
        }
        static fromState(routines2, state) {
          return new _SRPServerSessionStep1(routines2, state.identifier, BigInt("0x" + state.salt), BigInt("0x" + state.verifier), BigInt("0x" + state.b), BigInt("0x" + state.B));
        }
      };
      exports.SRPServerSessionStep1 = SRPServerSessionStep1;
      var computeServerPublicValue = (parameters, k, v, b) => {
        return (utils_1.modPow(parameters.primeGroup.g, b, parameters.primeGroup.N) + v * k) % parameters.primeGroup.N;
      };
      var computeServerSessionKey = (N, v, u, A, b) => {
        return utils_1.modPow(utils_1.modPow(v, u, N) * A, b, N);
      };
    }
  });

  // node_modules/tssrp6a/dist/index.js
  var require_dist = __commonJS({
    "node_modules/tssrp6a/dist/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.generateRandomBigInt = exports.arrayBufferToBigInt = exports.bigIntToArrayBuffer = exports.createVerifierAndSalt = exports.SRPServerSessionStep1 = exports.SRPServerSession = exports.SRPClientSessionStep2 = exports.SRPClientSessionStep1 = exports.SRPClientSession = exports.SRPRoutines = exports.SRPParameters = void 0;
      var parameters_1 = require_parameters();
      Object.defineProperty(exports, "SRPParameters", { enumerable: true, get: function() {
        return parameters_1.SRPParameters;
      } });
      var routines_1 = require_routines();
      Object.defineProperty(exports, "SRPRoutines", { enumerable: true, get: function() {
        return routines_1.SRPRoutines;
      } });
      var session_client_1 = require_session_client();
      Object.defineProperty(exports, "SRPClientSession", { enumerable: true, get: function() {
        return session_client_1.SRPClientSession;
      } });
      Object.defineProperty(exports, "SRPClientSessionStep1", { enumerable: true, get: function() {
        return session_client_1.SRPClientSessionStep1;
      } });
      Object.defineProperty(exports, "SRPClientSessionStep2", { enumerable: true, get: function() {
        return session_client_1.SRPClientSessionStep2;
      } });
      var session_server_1 = require_session_server();
      Object.defineProperty(exports, "SRPServerSession", { enumerable: true, get: function() {
        return session_server_1.SRPServerSession;
      } });
      Object.defineProperty(exports, "SRPServerSessionStep1", { enumerable: true, get: function() {
        return session_server_1.SRPServerSessionStep1;
      } });
      var utils_1 = require_utils();
      Object.defineProperty(exports, "createVerifierAndSalt", { enumerable: true, get: function() {
        return utils_1.createVerifierAndSalt;
      } });
      Object.defineProperty(exports, "bigIntToArrayBuffer", { enumerable: true, get: function() {
        return utils_1.bigIntToArrayBuffer;
      } });
      Object.defineProperty(exports, "arrayBufferToBigInt", { enumerable: true, get: function() {
        return utils_1.arrayBufferToBigInt;
      } });
      Object.defineProperty(exports, "generateRandomBigInt", { enumerable: true, get: function() {
        return utils_1.generateRandomBigInt;
      } });
    }
  });

  // popup-entry.js
  var import_tssrp6a = __toESM(require_dist());
  var $ = (id) => document.getElementById(id);
  var status = (s) => {
    $("status").textContent = s;
  };
  var params = new import_tssrp6a.SRPParameters(import_tssrp6a.SRPParameters.PrimeGroup[2048], import_tssrp6a.SRPParameters.H.SHA256);
  var routines = new import_tssrp6a.SRPRoutines(params);
  var hex = (n) => n.toString(16);
  function integer(s) {
    if (typeof s !== "string" || !/^[0-9a-f]{1,512}$/.test(s)) throw Error("Invalid SRP response");
    return BigInt("0x" + s);
  }
  async function post(base, path, data) {
    const r = await fetch(base + path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data), credentials: "omit", redirect: "error", signal: AbortSignal.timeout(1e4) });
    if (!r.ok) throw Error("Pairing rejected");
    return r.json();
  }
  $("pair").onclick = async () => {
    try {
      const u = new URL($("url").value);
      if (u.protocol !== "https:" || u.username || u.password || u.search || u.hash || u.pathname !== "/") throw Error("Use an HTTPS origin only");
      const base = u.origin;
      if (!await chrome.permissions.request({ origins: [base + "/*"] })) throw Error("Bridge permission declined");
      const identity = $("identity").value, password = $("password").value;
      if (!identity || password.length < 16) throw Error("Use your enrolled identity and a password of at least 16 characters");
      status("Checking mutual SRP proofs\u2026");
      const c1 = await new import_tssrp6a.SRPClientSession(routines).step1(identity, password);
      $("password").value = "";
      const first = await post(base, "/srp/start", { identity });
      const c2 = await c1.step2(integer(first.salt), integer(first.B));
      const result = await post(base, "/srp/finish", { challenge: first.challenge, A: hex(c2.A), M1: hex(c2.M1) });
      if (typeof result.sid !== "string" || !/^[0-9a-f]{48}$/.test(result.sid) || result.expires_seconds !== 3600) throw Error("Invalid session response");
      await c2.step3(integer(result.M2));
      const enc = new TextEncoder();
      const raw = await crypto.subtle.importKey("raw", enc.encode(hex(c2.S)), "HKDF", false, ["deriveBits"]);
      const key = await crypto.subtle.deriveBits({ name: "HKDF", hash: "SHA-256", salt: enc.encode(result.sid), info: enc.encode("peostectica-browser-v1") }, raw, 256);
      const keyHex = [...new Uint8Array(key)].map((x) => x.toString(16).padStart(2, "0")).join("");
      const accepted = await chrome.runtime.sendMessage({ op: "pair", session: { base, sid: result.sid, keyHex, expires: Date.now() + 36e5 } });
      if (!accepted?.ok) throw Error("Pairing storage failed");
      status("Paired. Enable one tab to test reading.");
    } catch {
      status("Pairing failed. Verify bridge certificate, address, identity and password.");
      $("password").value = "";
    }
  };
  $("allow").onclick = async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      const u = new URL(tab.url);
      if (!["https:", "http:"].includes(u.protocol)) throw Error();
      const r = await chrome.runtime.sendMessage({ op: "allow", tabId: tab.id, origin: u.origin });
      if (!r?.ok) throw Error();
      status("This tab is enabled.");
    } catch {
      status("Unable to enable this tab. Pair first and select an HTTP/HTTPS page.");
    }
  };
  $("disconnect").onclick = async () => {
    await chrome.runtime.sendMessage({ op: "disconnect" });
    status("Disconnected.");
  };
  chrome.storage.session.get("session").then(({ session }) => {
    if (session && session.expires > Date.now()) {
      $("url").value = session.base;
      status("Paired; one-hour session active.");
    }
  });
})();
