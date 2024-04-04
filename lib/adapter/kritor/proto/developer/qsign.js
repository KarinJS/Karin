/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import $protobuf from "protobufjs/minimal.js";

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const kritor = $root.kritor = (() => {

    /**
     * Namespace kritor.
     * @exports kritor
     * @namespace
     */
    const kritor = {};

    kritor.developer = (function() {

        /**
         * Namespace developer.
         * @memberof kritor
         * @namespace
         */
        const developer = {};

        developer.QsignService = (function() {

            /**
             * Constructs a new QsignService service.
             * @memberof kritor.developer
             * @classdesc Represents a QsignService
             * @extends $protobuf.rpc.Service
             * @constructor
             * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
             * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
             * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
             */
            function QsignService(rpcImpl, requestDelimited, responseDelimited) {
                $protobuf.rpc.Service.call(this, rpcImpl, requestDelimited, responseDelimited);
            }

            (QsignService.prototype = Object.create($protobuf.rpc.Service.prototype)).constructor = QsignService;

            /**
             * Creates new QsignService service using the specified rpc implementation.
             * @function create
             * @memberof kritor.developer.QsignService
             * @static
             * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
             * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
             * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
             * @returns {QsignService} RPC service. Useful where requests and/or responses are streamed.
             */
            QsignService.create = function create(rpcImpl, requestDelimited, responseDelimited) {
                return new this(rpcImpl, requestDelimited, responseDelimited);
            };

            /**
             * Callback as used by {@link kritor.developer.QsignService#sign}.
             * @memberof kritor.developer.QsignService
             * @typedef SignCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.developer.SignResponse} [response] SignResponse
             */

            /**
             * Calls Sign.
             * @function sign
             * @memberof kritor.developer.QsignService
             * @instance
             * @param {kritor.developer.ISignRequest} request SignRequest message or plain object
             * @param {kritor.developer.QsignService.SignCallback} callback Node-style callback called with the error, if any, and SignResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(QsignService.prototype.sign = function sign(request, callback) {
                return this.rpcCall(sign, $root.kritor.developer.SignRequest, $root.kritor.developer.SignResponse, request, callback);
            }, "name", { value: "Sign" });

            /**
             * Calls Sign.
             * @function sign
             * @memberof kritor.developer.QsignService
             * @instance
             * @param {kritor.developer.ISignRequest} request SignRequest message or plain object
             * @returns {Promise<kritor.developer.SignResponse>} Promise
             * @variation 2
             */

            /**
             * Callback as used by {@link kritor.developer.QsignService#energy}.
             * @memberof kritor.developer.QsignService
             * @typedef EnergyCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.developer.EnergyResponse} [response] EnergyResponse
             */

            /**
             * Calls Energy.
             * @function energy
             * @memberof kritor.developer.QsignService
             * @instance
             * @param {kritor.developer.IEnergyRequest} request EnergyRequest message or plain object
             * @param {kritor.developer.QsignService.EnergyCallback} callback Node-style callback called with the error, if any, and EnergyResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(QsignService.prototype.energy = function energy(request, callback) {
                return this.rpcCall(energy, $root.kritor.developer.EnergyRequest, $root.kritor.developer.EnergyResponse, request, callback);
            }, "name", { value: "Energy" });

            /**
             * Calls Energy.
             * @function energy
             * @memberof kritor.developer.QsignService
             * @instance
             * @param {kritor.developer.IEnergyRequest} request EnergyRequest message or plain object
             * @returns {Promise<kritor.developer.EnergyResponse>} Promise
             * @variation 2
             */

            /**
             * Callback as used by {@link kritor.developer.QsignService#getCmdWhitelist}.
             * @memberof kritor.developer.QsignService
             * @typedef GetCmdWhitelistCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.developer.GetCmdWhitelistResponse} [response] GetCmdWhitelistResponse
             */

            /**
             * Calls GetCmdWhitelist.
             * @function getCmdWhitelist
             * @memberof kritor.developer.QsignService
             * @instance
             * @param {kritor.developer.IGetCmdWhitelistRequest} request GetCmdWhitelistRequest message or plain object
             * @param {kritor.developer.QsignService.GetCmdWhitelistCallback} callback Node-style callback called with the error, if any, and GetCmdWhitelistResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(QsignService.prototype.getCmdWhitelist = function getCmdWhitelist(request, callback) {
                return this.rpcCall(getCmdWhitelist, $root.kritor.developer.GetCmdWhitelistRequest, $root.kritor.developer.GetCmdWhitelistResponse, request, callback);
            }, "name", { value: "GetCmdWhitelist" });

            /**
             * Calls GetCmdWhitelist.
             * @function getCmdWhitelist
             * @memberof kritor.developer.QsignService
             * @instance
             * @param {kritor.developer.IGetCmdWhitelistRequest} request GetCmdWhitelistRequest message or plain object
             * @returns {Promise<kritor.developer.GetCmdWhitelistResponse>} Promise
             * @variation 2
             */

            return QsignService;
        })();

        developer.SignRequest = (function() {

            /**
             * Properties of a SignRequest.
             * @memberof kritor.developer
             * @interface ISignRequest
             * @property {string|null} [uin] SignRequest uin
             * @property {string|null} [command] SignRequest command
             * @property {number|null} [seq] SignRequest seq
             * @property {Uint8Array|null} [buffer] SignRequest buffer
             * @property {string|null} [qua] SignRequest qua
             */

            /**
             * Constructs a new SignRequest.
             * @memberof kritor.developer
             * @classdesc Represents a SignRequest.
             * @implements ISignRequest
             * @constructor
             * @param {kritor.developer.ISignRequest=} [properties] Properties to set
             */
            function SignRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * SignRequest uin.
             * @member {string} uin
             * @memberof kritor.developer.SignRequest
             * @instance
             */
            SignRequest.prototype.uin = "";

            /**
             * SignRequest command.
             * @member {string} command
             * @memberof kritor.developer.SignRequest
             * @instance
             */
            SignRequest.prototype.command = "";

            /**
             * SignRequest seq.
             * @member {number} seq
             * @memberof kritor.developer.SignRequest
             * @instance
             */
            SignRequest.prototype.seq = 0;

            /**
             * SignRequest buffer.
             * @member {Uint8Array} buffer
             * @memberof kritor.developer.SignRequest
             * @instance
             */
            SignRequest.prototype.buffer = $util.newBuffer([]);

            /**
             * SignRequest qua.
             * @member {string|null|undefined} qua
             * @memberof kritor.developer.SignRequest
             * @instance
             */
            SignRequest.prototype.qua = null;

            // OneOf field names bound to virtual getters and setters
            let $oneOfFields;

            /**
             * SignRequest _qua.
             * @member {"qua"|undefined} _qua
             * @memberof kritor.developer.SignRequest
             * @instance
             */
            Object.defineProperty(SignRequest.prototype, "_qua", {
                get: $util.oneOfGetter($oneOfFields = ["qua"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new SignRequest instance using the specified properties.
             * @function create
             * @memberof kritor.developer.SignRequest
             * @static
             * @param {kritor.developer.ISignRequest=} [properties] Properties to set
             * @returns {kritor.developer.SignRequest} SignRequest instance
             */
            SignRequest.create = function create(properties) {
                return new SignRequest(properties);
            };

            /**
             * Encodes the specified SignRequest message. Does not implicitly {@link kritor.developer.SignRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.developer.SignRequest
             * @static
             * @param {kritor.developer.ISignRequest} message SignRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SignRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.uin != null && Object.hasOwnProperty.call(message, "uin"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.uin);
                if (message.command != null && Object.hasOwnProperty.call(message, "command"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.command);
                if (message.seq != null && Object.hasOwnProperty.call(message, "seq"))
                    writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.seq);
                if (message.buffer != null && Object.hasOwnProperty.call(message, "buffer"))
                    writer.uint32(/* id 4, wireType 2 =*/34).bytes(message.buffer);
                if (message.qua != null && Object.hasOwnProperty.call(message, "qua"))
                    writer.uint32(/* id 6, wireType 2 =*/50).string(message.qua);
                return writer;
            };

            /**
             * Encodes the specified SignRequest message, length delimited. Does not implicitly {@link kritor.developer.SignRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.developer.SignRequest
             * @static
             * @param {kritor.developer.ISignRequest} message SignRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SignRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a SignRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.developer.SignRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.developer.SignRequest} SignRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SignRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.developer.SignRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.uin = reader.string();
                            break;
                        }
                    case 2: {
                            message.command = reader.string();
                            break;
                        }
                    case 3: {
                            message.seq = reader.uint32();
                            break;
                        }
                    case 4: {
                            message.buffer = reader.bytes();
                            break;
                        }
                    case 6: {
                            message.qua = reader.string();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a SignRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.developer.SignRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.developer.SignRequest} SignRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SignRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a SignRequest message.
             * @function verify
             * @memberof kritor.developer.SignRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            SignRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                let properties = {};
                if (message.uin != null && message.hasOwnProperty("uin"))
                    if (!$util.isString(message.uin))
                        return "uin: string expected";
                if (message.command != null && message.hasOwnProperty("command"))
                    if (!$util.isString(message.command))
                        return "command: string expected";
                if (message.seq != null && message.hasOwnProperty("seq"))
                    if (!$util.isInteger(message.seq))
                        return "seq: integer expected";
                if (message.buffer != null && message.hasOwnProperty("buffer"))
                    if (!(message.buffer && typeof message.buffer.length === "number" || $util.isString(message.buffer)))
                        return "buffer: buffer expected";
                if (message.qua != null && message.hasOwnProperty("qua")) {
                    properties._qua = 1;
                    if (!$util.isString(message.qua))
                        return "qua: string expected";
                }
                return null;
            };

            /**
             * Creates a SignRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.developer.SignRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.developer.SignRequest} SignRequest
             */
            SignRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.developer.SignRequest)
                    return object;
                let message = new $root.kritor.developer.SignRequest();
                if (object.uin != null)
                    message.uin = String(object.uin);
                if (object.command != null)
                    message.command = String(object.command);
                if (object.seq != null)
                    message.seq = object.seq >>> 0;
                if (object.buffer != null)
                    if (typeof object.buffer === "string")
                        $util.base64.decode(object.buffer, message.buffer = $util.newBuffer($util.base64.length(object.buffer)), 0);
                    else if (object.buffer.length >= 0)
                        message.buffer = object.buffer;
                if (object.qua != null)
                    message.qua = String(object.qua);
                return message;
            };

            /**
             * Creates a plain object from a SignRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.developer.SignRequest
             * @static
             * @param {kritor.developer.SignRequest} message SignRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            SignRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.uin = "";
                    object.command = "";
                    object.seq = 0;
                    if (options.bytes === String)
                        object.buffer = "";
                    else {
                        object.buffer = [];
                        if (options.bytes !== Array)
                            object.buffer = $util.newBuffer(object.buffer);
                    }
                }
                if (message.uin != null && message.hasOwnProperty("uin"))
                    object.uin = message.uin;
                if (message.command != null && message.hasOwnProperty("command"))
                    object.command = message.command;
                if (message.seq != null && message.hasOwnProperty("seq"))
                    object.seq = message.seq;
                if (message.buffer != null && message.hasOwnProperty("buffer"))
                    object.buffer = options.bytes === String ? $util.base64.encode(message.buffer, 0, message.buffer.length) : options.bytes === Array ? Array.prototype.slice.call(message.buffer) : message.buffer;
                if (message.qua != null && message.hasOwnProperty("qua")) {
                    object.qua = message.qua;
                    if (options.oneofs)
                        object._qua = "qua";
                }
                return object;
            };

            /**
             * Converts this SignRequest to JSON.
             * @function toJSON
             * @memberof kritor.developer.SignRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            SignRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for SignRequest
             * @function getTypeUrl
             * @memberof kritor.developer.SignRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            SignRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.developer.SignRequest";
            };

            return SignRequest;
        })();

        developer.SignResponse = (function() {

            /**
             * Properties of a SignResponse.
             * @memberof kritor.developer
             * @interface ISignResponse
             * @property {Uint8Array|null} [secSig] SignResponse secSig
             * @property {Uint8Array|null} [secDeviceToken] SignResponse secDeviceToken
             * @property {Uint8Array|null} [secExtra] SignResponse secExtra
             */

            /**
             * Constructs a new SignResponse.
             * @memberof kritor.developer
             * @classdesc Represents a SignResponse.
             * @implements ISignResponse
             * @constructor
             * @param {kritor.developer.ISignResponse=} [properties] Properties to set
             */
            function SignResponse(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * SignResponse secSig.
             * @member {Uint8Array} secSig
             * @memberof kritor.developer.SignResponse
             * @instance
             */
            SignResponse.prototype.secSig = $util.newBuffer([]);

            /**
             * SignResponse secDeviceToken.
             * @member {Uint8Array} secDeviceToken
             * @memberof kritor.developer.SignResponse
             * @instance
             */
            SignResponse.prototype.secDeviceToken = $util.newBuffer([]);

            /**
             * SignResponse secExtra.
             * @member {Uint8Array} secExtra
             * @memberof kritor.developer.SignResponse
             * @instance
             */
            SignResponse.prototype.secExtra = $util.newBuffer([]);

            /**
             * Creates a new SignResponse instance using the specified properties.
             * @function create
             * @memberof kritor.developer.SignResponse
             * @static
             * @param {kritor.developer.ISignResponse=} [properties] Properties to set
             * @returns {kritor.developer.SignResponse} SignResponse instance
             */
            SignResponse.create = function create(properties) {
                return new SignResponse(properties);
            };

            /**
             * Encodes the specified SignResponse message. Does not implicitly {@link kritor.developer.SignResponse.verify|verify} messages.
             * @function encode
             * @memberof kritor.developer.SignResponse
             * @static
             * @param {kritor.developer.ISignResponse} message SignResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SignResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.secSig != null && Object.hasOwnProperty.call(message, "secSig"))
                    writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.secSig);
                if (message.secDeviceToken != null && Object.hasOwnProperty.call(message, "secDeviceToken"))
                    writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.secDeviceToken);
                if (message.secExtra != null && Object.hasOwnProperty.call(message, "secExtra"))
                    writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.secExtra);
                return writer;
            };

            /**
             * Encodes the specified SignResponse message, length delimited. Does not implicitly {@link kritor.developer.SignResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.developer.SignResponse
             * @static
             * @param {kritor.developer.ISignResponse} message SignResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SignResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a SignResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.developer.SignResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.developer.SignResponse} SignResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SignResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.developer.SignResponse();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.secSig = reader.bytes();
                            break;
                        }
                    case 2: {
                            message.secDeviceToken = reader.bytes();
                            break;
                        }
                    case 3: {
                            message.secExtra = reader.bytes();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a SignResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.developer.SignResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.developer.SignResponse} SignResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SignResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a SignResponse message.
             * @function verify
             * @memberof kritor.developer.SignResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            SignResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.secSig != null && message.hasOwnProperty("secSig"))
                    if (!(message.secSig && typeof message.secSig.length === "number" || $util.isString(message.secSig)))
                        return "secSig: buffer expected";
                if (message.secDeviceToken != null && message.hasOwnProperty("secDeviceToken"))
                    if (!(message.secDeviceToken && typeof message.secDeviceToken.length === "number" || $util.isString(message.secDeviceToken)))
                        return "secDeviceToken: buffer expected";
                if (message.secExtra != null && message.hasOwnProperty("secExtra"))
                    if (!(message.secExtra && typeof message.secExtra.length === "number" || $util.isString(message.secExtra)))
                        return "secExtra: buffer expected";
                return null;
            };

            /**
             * Creates a SignResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.developer.SignResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.developer.SignResponse} SignResponse
             */
            SignResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.developer.SignResponse)
                    return object;
                let message = new $root.kritor.developer.SignResponse();
                if (object.secSig != null)
                    if (typeof object.secSig === "string")
                        $util.base64.decode(object.secSig, message.secSig = $util.newBuffer($util.base64.length(object.secSig)), 0);
                    else if (object.secSig.length >= 0)
                        message.secSig = object.secSig;
                if (object.secDeviceToken != null)
                    if (typeof object.secDeviceToken === "string")
                        $util.base64.decode(object.secDeviceToken, message.secDeviceToken = $util.newBuffer($util.base64.length(object.secDeviceToken)), 0);
                    else if (object.secDeviceToken.length >= 0)
                        message.secDeviceToken = object.secDeviceToken;
                if (object.secExtra != null)
                    if (typeof object.secExtra === "string")
                        $util.base64.decode(object.secExtra, message.secExtra = $util.newBuffer($util.base64.length(object.secExtra)), 0);
                    else if (object.secExtra.length >= 0)
                        message.secExtra = object.secExtra;
                return message;
            };

            /**
             * Creates a plain object from a SignResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.developer.SignResponse
             * @static
             * @param {kritor.developer.SignResponse} message SignResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            SignResponse.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    if (options.bytes === String)
                        object.secSig = "";
                    else {
                        object.secSig = [];
                        if (options.bytes !== Array)
                            object.secSig = $util.newBuffer(object.secSig);
                    }
                    if (options.bytes === String)
                        object.secDeviceToken = "";
                    else {
                        object.secDeviceToken = [];
                        if (options.bytes !== Array)
                            object.secDeviceToken = $util.newBuffer(object.secDeviceToken);
                    }
                    if (options.bytes === String)
                        object.secExtra = "";
                    else {
                        object.secExtra = [];
                        if (options.bytes !== Array)
                            object.secExtra = $util.newBuffer(object.secExtra);
                    }
                }
                if (message.secSig != null && message.hasOwnProperty("secSig"))
                    object.secSig = options.bytes === String ? $util.base64.encode(message.secSig, 0, message.secSig.length) : options.bytes === Array ? Array.prototype.slice.call(message.secSig) : message.secSig;
                if (message.secDeviceToken != null && message.hasOwnProperty("secDeviceToken"))
                    object.secDeviceToken = options.bytes === String ? $util.base64.encode(message.secDeviceToken, 0, message.secDeviceToken.length) : options.bytes === Array ? Array.prototype.slice.call(message.secDeviceToken) : message.secDeviceToken;
                if (message.secExtra != null && message.hasOwnProperty("secExtra"))
                    object.secExtra = options.bytes === String ? $util.base64.encode(message.secExtra, 0, message.secExtra.length) : options.bytes === Array ? Array.prototype.slice.call(message.secExtra) : message.secExtra;
                return object;
            };

            /**
             * Converts this SignResponse to JSON.
             * @function toJSON
             * @memberof kritor.developer.SignResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            SignResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for SignResponse
             * @function getTypeUrl
             * @memberof kritor.developer.SignResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            SignResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.developer.SignResponse";
            };

            return SignResponse;
        })();

        developer.EnergyRequest = (function() {

            /**
             * Properties of an EnergyRequest.
             * @memberof kritor.developer
             * @interface IEnergyRequest
             * @property {string|null} [data] EnergyRequest data
             * @property {Uint8Array|null} [salt] EnergyRequest salt
             */

            /**
             * Constructs a new EnergyRequest.
             * @memberof kritor.developer
             * @classdesc Represents an EnergyRequest.
             * @implements IEnergyRequest
             * @constructor
             * @param {kritor.developer.IEnergyRequest=} [properties] Properties to set
             */
            function EnergyRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * EnergyRequest data.
             * @member {string} data
             * @memberof kritor.developer.EnergyRequest
             * @instance
             */
            EnergyRequest.prototype.data = "";

            /**
             * EnergyRequest salt.
             * @member {Uint8Array} salt
             * @memberof kritor.developer.EnergyRequest
             * @instance
             */
            EnergyRequest.prototype.salt = $util.newBuffer([]);

            /**
             * Creates a new EnergyRequest instance using the specified properties.
             * @function create
             * @memberof kritor.developer.EnergyRequest
             * @static
             * @param {kritor.developer.IEnergyRequest=} [properties] Properties to set
             * @returns {kritor.developer.EnergyRequest} EnergyRequest instance
             */
            EnergyRequest.create = function create(properties) {
                return new EnergyRequest(properties);
            };

            /**
             * Encodes the specified EnergyRequest message. Does not implicitly {@link kritor.developer.EnergyRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.developer.EnergyRequest
             * @static
             * @param {kritor.developer.IEnergyRequest} message EnergyRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            EnergyRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.data != null && Object.hasOwnProperty.call(message, "data"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.data);
                if (message.salt != null && Object.hasOwnProperty.call(message, "salt"))
                    writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.salt);
                return writer;
            };

            /**
             * Encodes the specified EnergyRequest message, length delimited. Does not implicitly {@link kritor.developer.EnergyRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.developer.EnergyRequest
             * @static
             * @param {kritor.developer.IEnergyRequest} message EnergyRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            EnergyRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an EnergyRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.developer.EnergyRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.developer.EnergyRequest} EnergyRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            EnergyRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.developer.EnergyRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 2: {
                            message.data = reader.string();
                            break;
                        }
                    case 3: {
                            message.salt = reader.bytes();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes an EnergyRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.developer.EnergyRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.developer.EnergyRequest} EnergyRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            EnergyRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an EnergyRequest message.
             * @function verify
             * @memberof kritor.developer.EnergyRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            EnergyRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.data != null && message.hasOwnProperty("data"))
                    if (!$util.isString(message.data))
                        return "data: string expected";
                if (message.salt != null && message.hasOwnProperty("salt"))
                    if (!(message.salt && typeof message.salt.length === "number" || $util.isString(message.salt)))
                        return "salt: buffer expected";
                return null;
            };

            /**
             * Creates an EnergyRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.developer.EnergyRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.developer.EnergyRequest} EnergyRequest
             */
            EnergyRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.developer.EnergyRequest)
                    return object;
                let message = new $root.kritor.developer.EnergyRequest();
                if (object.data != null)
                    message.data = String(object.data);
                if (object.salt != null)
                    if (typeof object.salt === "string")
                        $util.base64.decode(object.salt, message.salt = $util.newBuffer($util.base64.length(object.salt)), 0);
                    else if (object.salt.length >= 0)
                        message.salt = object.salt;
                return message;
            };

            /**
             * Creates a plain object from an EnergyRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.developer.EnergyRequest
             * @static
             * @param {kritor.developer.EnergyRequest} message EnergyRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            EnergyRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.data = "";
                    if (options.bytes === String)
                        object.salt = "";
                    else {
                        object.salt = [];
                        if (options.bytes !== Array)
                            object.salt = $util.newBuffer(object.salt);
                    }
                }
                if (message.data != null && message.hasOwnProperty("data"))
                    object.data = message.data;
                if (message.salt != null && message.hasOwnProperty("salt"))
                    object.salt = options.bytes === String ? $util.base64.encode(message.salt, 0, message.salt.length) : options.bytes === Array ? Array.prototype.slice.call(message.salt) : message.salt;
                return object;
            };

            /**
             * Converts this EnergyRequest to JSON.
             * @function toJSON
             * @memberof kritor.developer.EnergyRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            EnergyRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for EnergyRequest
             * @function getTypeUrl
             * @memberof kritor.developer.EnergyRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            EnergyRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.developer.EnergyRequest";
            };

            return EnergyRequest;
        })();

        developer.EnergyResponse = (function() {

            /**
             * Properties of an EnergyResponse.
             * @memberof kritor.developer
             * @interface IEnergyResponse
             * @property {Uint8Array|null} [result] EnergyResponse result
             */

            /**
             * Constructs a new EnergyResponse.
             * @memberof kritor.developer
             * @classdesc Represents an EnergyResponse.
             * @implements IEnergyResponse
             * @constructor
             * @param {kritor.developer.IEnergyResponse=} [properties] Properties to set
             */
            function EnergyResponse(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * EnergyResponse result.
             * @member {Uint8Array} result
             * @memberof kritor.developer.EnergyResponse
             * @instance
             */
            EnergyResponse.prototype.result = $util.newBuffer([]);

            /**
             * Creates a new EnergyResponse instance using the specified properties.
             * @function create
             * @memberof kritor.developer.EnergyResponse
             * @static
             * @param {kritor.developer.IEnergyResponse=} [properties] Properties to set
             * @returns {kritor.developer.EnergyResponse} EnergyResponse instance
             */
            EnergyResponse.create = function create(properties) {
                return new EnergyResponse(properties);
            };

            /**
             * Encodes the specified EnergyResponse message. Does not implicitly {@link kritor.developer.EnergyResponse.verify|verify} messages.
             * @function encode
             * @memberof kritor.developer.EnergyResponse
             * @static
             * @param {kritor.developer.IEnergyResponse} message EnergyResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            EnergyResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.result != null && Object.hasOwnProperty.call(message, "result"))
                    writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.result);
                return writer;
            };

            /**
             * Encodes the specified EnergyResponse message, length delimited. Does not implicitly {@link kritor.developer.EnergyResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.developer.EnergyResponse
             * @static
             * @param {kritor.developer.IEnergyResponse} message EnergyResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            EnergyResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an EnergyResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.developer.EnergyResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.developer.EnergyResponse} EnergyResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            EnergyResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.developer.EnergyResponse();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.result = reader.bytes();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes an EnergyResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.developer.EnergyResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.developer.EnergyResponse} EnergyResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            EnergyResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an EnergyResponse message.
             * @function verify
             * @memberof kritor.developer.EnergyResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            EnergyResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.result != null && message.hasOwnProperty("result"))
                    if (!(message.result && typeof message.result.length === "number" || $util.isString(message.result)))
                        return "result: buffer expected";
                return null;
            };

            /**
             * Creates an EnergyResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.developer.EnergyResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.developer.EnergyResponse} EnergyResponse
             */
            EnergyResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.developer.EnergyResponse)
                    return object;
                let message = new $root.kritor.developer.EnergyResponse();
                if (object.result != null)
                    if (typeof object.result === "string")
                        $util.base64.decode(object.result, message.result = $util.newBuffer($util.base64.length(object.result)), 0);
                    else if (object.result.length >= 0)
                        message.result = object.result;
                return message;
            };

            /**
             * Creates a plain object from an EnergyResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.developer.EnergyResponse
             * @static
             * @param {kritor.developer.EnergyResponse} message EnergyResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            EnergyResponse.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults)
                    if (options.bytes === String)
                        object.result = "";
                    else {
                        object.result = [];
                        if (options.bytes !== Array)
                            object.result = $util.newBuffer(object.result);
                    }
                if (message.result != null && message.hasOwnProperty("result"))
                    object.result = options.bytes === String ? $util.base64.encode(message.result, 0, message.result.length) : options.bytes === Array ? Array.prototype.slice.call(message.result) : message.result;
                return object;
            };

            /**
             * Converts this EnergyResponse to JSON.
             * @function toJSON
             * @memberof kritor.developer.EnergyResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            EnergyResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for EnergyResponse
             * @function getTypeUrl
             * @memberof kritor.developer.EnergyResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            EnergyResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.developer.EnergyResponse";
            };

            return EnergyResponse;
        })();

        developer.GetCmdWhitelistRequest = (function() {

            /**
             * Properties of a GetCmdWhitelistRequest.
             * @memberof kritor.developer
             * @interface IGetCmdWhitelistRequest
             */

            /**
             * Constructs a new GetCmdWhitelistRequest.
             * @memberof kritor.developer
             * @classdesc Represents a GetCmdWhitelistRequest.
             * @implements IGetCmdWhitelistRequest
             * @constructor
             * @param {kritor.developer.IGetCmdWhitelistRequest=} [properties] Properties to set
             */
            function GetCmdWhitelistRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Creates a new GetCmdWhitelistRequest instance using the specified properties.
             * @function create
             * @memberof kritor.developer.GetCmdWhitelistRequest
             * @static
             * @param {kritor.developer.IGetCmdWhitelistRequest=} [properties] Properties to set
             * @returns {kritor.developer.GetCmdWhitelistRequest} GetCmdWhitelistRequest instance
             */
            GetCmdWhitelistRequest.create = function create(properties) {
                return new GetCmdWhitelistRequest(properties);
            };

            /**
             * Encodes the specified GetCmdWhitelistRequest message. Does not implicitly {@link kritor.developer.GetCmdWhitelistRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.developer.GetCmdWhitelistRequest
             * @static
             * @param {kritor.developer.IGetCmdWhitelistRequest} message GetCmdWhitelistRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetCmdWhitelistRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                return writer;
            };

            /**
             * Encodes the specified GetCmdWhitelistRequest message, length delimited. Does not implicitly {@link kritor.developer.GetCmdWhitelistRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.developer.GetCmdWhitelistRequest
             * @static
             * @param {kritor.developer.IGetCmdWhitelistRequest} message GetCmdWhitelistRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetCmdWhitelistRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetCmdWhitelistRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.developer.GetCmdWhitelistRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.developer.GetCmdWhitelistRequest} GetCmdWhitelistRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetCmdWhitelistRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.developer.GetCmdWhitelistRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a GetCmdWhitelistRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.developer.GetCmdWhitelistRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.developer.GetCmdWhitelistRequest} GetCmdWhitelistRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetCmdWhitelistRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetCmdWhitelistRequest message.
             * @function verify
             * @memberof kritor.developer.GetCmdWhitelistRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetCmdWhitelistRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                return null;
            };

            /**
             * Creates a GetCmdWhitelistRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.developer.GetCmdWhitelistRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.developer.GetCmdWhitelistRequest} GetCmdWhitelistRequest
             */
            GetCmdWhitelistRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.developer.GetCmdWhitelistRequest)
                    return object;
                return new $root.kritor.developer.GetCmdWhitelistRequest();
            };

            /**
             * Creates a plain object from a GetCmdWhitelistRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.developer.GetCmdWhitelistRequest
             * @static
             * @param {kritor.developer.GetCmdWhitelistRequest} message GetCmdWhitelistRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetCmdWhitelistRequest.toObject = function toObject() {
                return {};
            };

            /**
             * Converts this GetCmdWhitelistRequest to JSON.
             * @function toJSON
             * @memberof kritor.developer.GetCmdWhitelistRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetCmdWhitelistRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GetCmdWhitelistRequest
             * @function getTypeUrl
             * @memberof kritor.developer.GetCmdWhitelistRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetCmdWhitelistRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.developer.GetCmdWhitelistRequest";
            };

            return GetCmdWhitelistRequest;
        })();

        developer.GetCmdWhitelistResponse = (function() {

            /**
             * Properties of a GetCmdWhitelistResponse.
             * @memberof kritor.developer
             * @interface IGetCmdWhitelistResponse
             * @property {Array.<string>|null} [commands] GetCmdWhitelistResponse commands
             */

            /**
             * Constructs a new GetCmdWhitelistResponse.
             * @memberof kritor.developer
             * @classdesc Represents a GetCmdWhitelistResponse.
             * @implements IGetCmdWhitelistResponse
             * @constructor
             * @param {kritor.developer.IGetCmdWhitelistResponse=} [properties] Properties to set
             */
            function GetCmdWhitelistResponse(properties) {
                this.commands = [];
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetCmdWhitelistResponse commands.
             * @member {Array.<string>} commands
             * @memberof kritor.developer.GetCmdWhitelistResponse
             * @instance
             */
            GetCmdWhitelistResponse.prototype.commands = $util.emptyArray;

            /**
             * Creates a new GetCmdWhitelistResponse instance using the specified properties.
             * @function create
             * @memberof kritor.developer.GetCmdWhitelistResponse
             * @static
             * @param {kritor.developer.IGetCmdWhitelistResponse=} [properties] Properties to set
             * @returns {kritor.developer.GetCmdWhitelistResponse} GetCmdWhitelistResponse instance
             */
            GetCmdWhitelistResponse.create = function create(properties) {
                return new GetCmdWhitelistResponse(properties);
            };

            /**
             * Encodes the specified GetCmdWhitelistResponse message. Does not implicitly {@link kritor.developer.GetCmdWhitelistResponse.verify|verify} messages.
             * @function encode
             * @memberof kritor.developer.GetCmdWhitelistResponse
             * @static
             * @param {kritor.developer.IGetCmdWhitelistResponse} message GetCmdWhitelistResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetCmdWhitelistResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.commands != null && message.commands.length)
                    for (let i = 0; i < message.commands.length; ++i)
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.commands[i]);
                return writer;
            };

            /**
             * Encodes the specified GetCmdWhitelistResponse message, length delimited. Does not implicitly {@link kritor.developer.GetCmdWhitelistResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.developer.GetCmdWhitelistResponse
             * @static
             * @param {kritor.developer.IGetCmdWhitelistResponse} message GetCmdWhitelistResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetCmdWhitelistResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetCmdWhitelistResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.developer.GetCmdWhitelistResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.developer.GetCmdWhitelistResponse} GetCmdWhitelistResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetCmdWhitelistResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.developer.GetCmdWhitelistResponse();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            if (!(message.commands && message.commands.length))
                                message.commands = [];
                            message.commands.push(reader.string());
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a GetCmdWhitelistResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.developer.GetCmdWhitelistResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.developer.GetCmdWhitelistResponse} GetCmdWhitelistResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetCmdWhitelistResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetCmdWhitelistResponse message.
             * @function verify
             * @memberof kritor.developer.GetCmdWhitelistResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetCmdWhitelistResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.commands != null && message.hasOwnProperty("commands")) {
                    if (!Array.isArray(message.commands))
                        return "commands: array expected";
                    for (let i = 0; i < message.commands.length; ++i)
                        if (!$util.isString(message.commands[i]))
                            return "commands: string[] expected";
                }
                return null;
            };

            /**
             * Creates a GetCmdWhitelistResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.developer.GetCmdWhitelistResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.developer.GetCmdWhitelistResponse} GetCmdWhitelistResponse
             */
            GetCmdWhitelistResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.developer.GetCmdWhitelistResponse)
                    return object;
                let message = new $root.kritor.developer.GetCmdWhitelistResponse();
                if (object.commands) {
                    if (!Array.isArray(object.commands))
                        throw TypeError(".kritor.developer.GetCmdWhitelistResponse.commands: array expected");
                    message.commands = [];
                    for (let i = 0; i < object.commands.length; ++i)
                        message.commands[i] = String(object.commands[i]);
                }
                return message;
            };

            /**
             * Creates a plain object from a GetCmdWhitelistResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.developer.GetCmdWhitelistResponse
             * @static
             * @param {kritor.developer.GetCmdWhitelistResponse} message GetCmdWhitelistResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetCmdWhitelistResponse.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.arrays || options.defaults)
                    object.commands = [];
                if (message.commands && message.commands.length) {
                    object.commands = [];
                    for (let j = 0; j < message.commands.length; ++j)
                        object.commands[j] = message.commands[j];
                }
                return object;
            };

            /**
             * Converts this GetCmdWhitelistResponse to JSON.
             * @function toJSON
             * @memberof kritor.developer.GetCmdWhitelistResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetCmdWhitelistResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GetCmdWhitelistResponse
             * @function getTypeUrl
             * @memberof kritor.developer.GetCmdWhitelistResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetCmdWhitelistResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.developer.GetCmdWhitelistResponse";
            };

            return GetCmdWhitelistResponse;
        })();

        return developer;
    })();

    return kritor;
})();

export { $root as default };
