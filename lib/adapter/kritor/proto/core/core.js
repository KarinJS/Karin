/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import $protobuf from "protobufjs/minimal.js";

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
const $root = $protobuf.roots || ($protobuf.roots = {})

export const kritor = $root.kritor = (() => {

    /**
     * Namespace kritor.
     * @exports kritor
     * @namespace
     */
    const kritor = {};

    kritor.core = (function() {

        /**
         * Namespace core.
         * @memberof kritor
         * @namespace
         */
        const core = {};

        core.CoreService = (function() {

            /**
             * Constructs a new CoreService service.
             * @memberof kritor.core
             * @classdesc Represents a CoreService
             * @extends $protobuf.rpc.Service
             * @constructor
             * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
             * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
             * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
             */
            function CoreService(rpcImpl, requestDelimited, responseDelimited) {
                $protobuf.rpc.Service.call(this, rpcImpl, requestDelimited, responseDelimited);
            }

            (CoreService.prototype = Object.create($protobuf.rpc.Service.prototype)).constructor = CoreService;

            /**
             * Creates new CoreService service using the specified rpc implementation.
             * @function create
             * @memberof kritor.core.CoreService
             * @static
             * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
             * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
             * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
             * @returns {CoreService} RPC service. Useful where requests and/or responses are streamed.
             */
            CoreService.create = function create(rpcImpl, requestDelimited, responseDelimited) {
                return new this(rpcImpl, requestDelimited, responseDelimited);
            };

            /**
             * Callback as used by {@link kritor.core.CoreService#getVersion}.
             * @memberof kritor.core.CoreService
             * @typedef GetVersionCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.core.GetVersionResponse} [response] GetVersionResponse
             */

            /**
             * Calls GetVersion.
             * @function getVersion
             * @memberof kritor.core.CoreService
             * @instance
             * @param {kritor.core.IGetVersionRequest} request GetVersionRequest message or plain object
             * @param {kritor.core.CoreService.GetVersionCallback} callback Node-style callback called with the error, if any, and GetVersionResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(CoreService.prototype.getVersion = function getVersion(request, callback) {
                return this.rpcCall(getVersion, $root.kritor.core.GetVersionRequest, $root.kritor.core.GetVersionResponse, request, callback);
            }, "name", { value: "GetVersion" });

            /**
             * Calls GetVersion.
             * @function getVersion
             * @memberof kritor.core.CoreService
             * @instance
             * @param {kritor.core.IGetVersionRequest} request GetVersionRequest message or plain object
             * @returns {Promise<kritor.core.GetVersionResponse>} Promise
             * @variation 2
             */

            /**
             * Callback as used by {@link kritor.core.CoreService#downloadFile}.
             * @memberof kritor.core.CoreService
             * @typedef DownloadFileCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.core.DownloadFileResponse} [response] DownloadFileResponse
             */

            /**
             * Calls DownloadFile.
             * @function downloadFile
             * @memberof kritor.core.CoreService
             * @instance
             * @param {kritor.core.IDownloadFileRequest} request DownloadFileRequest message or plain object
             * @param {kritor.core.CoreService.DownloadFileCallback} callback Node-style callback called with the error, if any, and DownloadFileResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(CoreService.prototype.downloadFile = function downloadFile(request, callback) {
                return this.rpcCall(downloadFile, $root.kritor.core.DownloadFileRequest, $root.kritor.core.DownloadFileResponse, request, callback);
            }, "name", { value: "DownloadFile" });

            /**
             * Calls DownloadFile.
             * @function downloadFile
             * @memberof kritor.core.CoreService
             * @instance
             * @param {kritor.core.IDownloadFileRequest} request DownloadFileRequest message or plain object
             * @returns {Promise<kritor.core.DownloadFileResponse>} Promise
             * @variation 2
             */

            /**
             * Callback as used by {@link kritor.core.CoreService#getCurrentAccount}.
             * @memberof kritor.core.CoreService
             * @typedef GetCurrentAccountCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.core.GetCurrentAccountResponse} [response] GetCurrentAccountResponse
             */

            /**
             * Calls GetCurrentAccount.
             * @function getCurrentAccount
             * @memberof kritor.core.CoreService
             * @instance
             * @param {kritor.core.IGetCurrentAccountRequest} request GetCurrentAccountRequest message or plain object
             * @param {kritor.core.CoreService.GetCurrentAccountCallback} callback Node-style callback called with the error, if any, and GetCurrentAccountResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(CoreService.prototype.getCurrentAccount = function getCurrentAccount(request, callback) {
                return this.rpcCall(getCurrentAccount, $root.kritor.core.GetCurrentAccountRequest, $root.kritor.core.GetCurrentAccountResponse, request, callback);
            }, "name", { value: "GetCurrentAccount" });

            /**
             * Calls GetCurrentAccount.
             * @function getCurrentAccount
             * @memberof kritor.core.CoreService
             * @instance
             * @param {kritor.core.IGetCurrentAccountRequest} request GetCurrentAccountRequest message or plain object
             * @returns {Promise<kritor.core.GetCurrentAccountResponse>} Promise
             * @variation 2
             */

            /**
             * Callback as used by {@link kritor.core.CoreService#switchAccount}.
             * @memberof kritor.core.CoreService
             * @typedef SwitchAccountCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.core.SwitchAccountResponse} [response] SwitchAccountResponse
             */

            /**
             * Calls SwitchAccount.
             * @function switchAccount
             * @memberof kritor.core.CoreService
             * @instance
             * @param {kritor.core.ISwitchAccountRequest} request SwitchAccountRequest message or plain object
             * @param {kritor.core.CoreService.SwitchAccountCallback} callback Node-style callback called with the error, if any, and SwitchAccountResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(CoreService.prototype.switchAccount = function switchAccount(request, callback) {
                return this.rpcCall(switchAccount, $root.kritor.core.SwitchAccountRequest, $root.kritor.core.SwitchAccountResponse, request, callback);
            }, "name", { value: "SwitchAccount" });

            /**
             * Calls SwitchAccount.
             * @function switchAccount
             * @memberof kritor.core.CoreService
             * @instance
             * @param {kritor.core.ISwitchAccountRequest} request SwitchAccountRequest message or plain object
             * @returns {Promise<kritor.core.SwitchAccountResponse>} Promise
             * @variation 2
             */

            return CoreService;
        })();

        core.GetVersionRequest = (function() {

            /**
             * Properties of a GetVersionRequest.
             * @memberof kritor.core
             * @interface IGetVersionRequest
             */

            /**
             * Constructs a new GetVersionRequest.
             * @memberof kritor.core
             * @classdesc Represents a GetVersionRequest.
             * @implements IGetVersionRequest
             * @constructor
             * @param {kritor.core.IGetVersionRequest=} [properties] Properties to set
             */
            function GetVersionRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Creates a new GetVersionRequest instance using the specified properties.
             * @function create
             * @memberof kritor.core.GetVersionRequest
             * @static
             * @param {kritor.core.IGetVersionRequest=} [properties] Properties to set
             * @returns {kritor.core.GetVersionRequest} GetVersionRequest instance
             */
            GetVersionRequest.create = function create(properties) {
                return new GetVersionRequest(properties);
            };

            /**
             * Encodes the specified GetVersionRequest message. Does not implicitly {@link kritor.core.GetVersionRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.core.GetVersionRequest
             * @static
             * @param {kritor.core.IGetVersionRequest} message GetVersionRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetVersionRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                return writer;
            };

            /**
             * Encodes the specified GetVersionRequest message, length delimited. Does not implicitly {@link kritor.core.GetVersionRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.core.GetVersionRequest
             * @static
             * @param {kritor.core.IGetVersionRequest} message GetVersionRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetVersionRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetVersionRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.core.GetVersionRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.core.GetVersionRequest} GetVersionRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetVersionRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.core.GetVersionRequest();
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
             * Decodes a GetVersionRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.core.GetVersionRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.core.GetVersionRequest} GetVersionRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetVersionRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetVersionRequest message.
             * @function verify
             * @memberof kritor.core.GetVersionRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetVersionRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                return null;
            };

            /**
             * Creates a GetVersionRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.core.GetVersionRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.core.GetVersionRequest} GetVersionRequest
             */
            GetVersionRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.core.GetVersionRequest)
                    return object;
                return new $root.kritor.core.GetVersionRequest();
            };

            /**
             * Creates a plain object from a GetVersionRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.core.GetVersionRequest
             * @static
             * @param {kritor.core.GetVersionRequest} message GetVersionRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetVersionRequest.toObject = function toObject() {
                return {};
            };

            /**
             * Converts this GetVersionRequest to JSON.
             * @function toJSON
             * @memberof kritor.core.GetVersionRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetVersionRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GetVersionRequest
             * @function getTypeUrl
             * @memberof kritor.core.GetVersionRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetVersionRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.core.GetVersionRequest";
            };

            return GetVersionRequest;
        })();

        core.GetVersionResponse = (function() {

            /**
             * Properties of a GetVersionResponse.
             * @memberof kritor.core
             * @interface IGetVersionResponse
             * @property {string|null} [version] GetVersionResponse version
             * @property {string|null} [appName] GetVersionResponse appName
             */

            /**
             * Constructs a new GetVersionResponse.
             * @memberof kritor.core
             * @classdesc Represents a GetVersionResponse.
             * @implements IGetVersionResponse
             * @constructor
             * @param {kritor.core.IGetVersionResponse=} [properties] Properties to set
             */
            function GetVersionResponse(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetVersionResponse version.
             * @member {string} version
             * @memberof kritor.core.GetVersionResponse
             * @instance
             */
            GetVersionResponse.prototype.version = "";

            /**
             * GetVersionResponse appName.
             * @member {string} appName
             * @memberof kritor.core.GetVersionResponse
             * @instance
             */
            GetVersionResponse.prototype.appName = "";

            /**
             * Creates a new GetVersionResponse instance using the specified properties.
             * @function create
             * @memberof kritor.core.GetVersionResponse
             * @static
             * @param {kritor.core.IGetVersionResponse=} [properties] Properties to set
             * @returns {kritor.core.GetVersionResponse} GetVersionResponse instance
             */
            GetVersionResponse.create = function create(properties) {
                return new GetVersionResponse(properties);
            };

            /**
             * Encodes the specified GetVersionResponse message. Does not implicitly {@link kritor.core.GetVersionResponse.verify|verify} messages.
             * @function encode
             * @memberof kritor.core.GetVersionResponse
             * @static
             * @param {kritor.core.IGetVersionResponse} message GetVersionResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetVersionResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.version != null && Object.hasOwnProperty.call(message, "version"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.version);
                if (message.appName != null && Object.hasOwnProperty.call(message, "appName"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.appName);
                return writer;
            };

            /**
             * Encodes the specified GetVersionResponse message, length delimited. Does not implicitly {@link kritor.core.GetVersionResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.core.GetVersionResponse
             * @static
             * @param {kritor.core.IGetVersionResponse} message GetVersionResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetVersionResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetVersionResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.core.GetVersionResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.core.GetVersionResponse} GetVersionResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetVersionResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.core.GetVersionResponse();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.version = reader.string();
                            break;
                        }
                    case 2: {
                            message.appName = reader.string();
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
             * Decodes a GetVersionResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.core.GetVersionResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.core.GetVersionResponse} GetVersionResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetVersionResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetVersionResponse message.
             * @function verify
             * @memberof kritor.core.GetVersionResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetVersionResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.version != null && message.hasOwnProperty("version"))
                    if (!$util.isString(message.version))
                        return "version: string expected";
                if (message.appName != null && message.hasOwnProperty("appName"))
                    if (!$util.isString(message.appName))
                        return "appName: string expected";
                return null;
            };

            /**
             * Creates a GetVersionResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.core.GetVersionResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.core.GetVersionResponse} GetVersionResponse
             */
            GetVersionResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.core.GetVersionResponse)
                    return object;
                let message = new $root.kritor.core.GetVersionResponse();
                if (object.version != null)
                    message.version = String(object.version);
                if (object.appName != null)
                    message.appName = String(object.appName);
                return message;
            };

            /**
             * Creates a plain object from a GetVersionResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.core.GetVersionResponse
             * @static
             * @param {kritor.core.GetVersionResponse} message GetVersionResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetVersionResponse.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.version = "";
                    object.appName = "";
                }
                if (message.version != null && message.hasOwnProperty("version"))
                    object.version = message.version;
                if (message.appName != null && message.hasOwnProperty("appName"))
                    object.appName = message.appName;
                return object;
            };

            /**
             * Converts this GetVersionResponse to JSON.
             * @function toJSON
             * @memberof kritor.core.GetVersionResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetVersionResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GetVersionResponse
             * @function getTypeUrl
             * @memberof kritor.core.GetVersionResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetVersionResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.core.GetVersionResponse";
            };

            return GetVersionResponse;
        })();

        core.DownloadFileRequest = (function() {

            /**
             * Properties of a DownloadFileRequest.
             * @memberof kritor.core
             * @interface IDownloadFileRequest
             * @property {string|null} [url] DownloadFileRequest url
             * @property {string|null} [base64] DownloadFileRequest base64
             * @property {string|null} [rootPath] DownloadFileRequest rootPath
             * @property {string|null} [fileName] DownloadFileRequest fileName
             * @property {number|null} [threadCnt] DownloadFileRequest threadCnt
             * @property {string|null} [headers] DownloadFileRequest headers
             */

            /**
             * Constructs a new DownloadFileRequest.
             * @memberof kritor.core
             * @classdesc Represents a DownloadFileRequest.
             * @implements IDownloadFileRequest
             * @constructor
             * @param {kritor.core.IDownloadFileRequest=} [properties] Properties to set
             */
            function DownloadFileRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * DownloadFileRequest url.
             * @member {string|null|undefined} url
             * @memberof kritor.core.DownloadFileRequest
             * @instance
             */
            DownloadFileRequest.prototype.url = null;

            /**
             * DownloadFileRequest base64.
             * @member {string|null|undefined} base64
             * @memberof kritor.core.DownloadFileRequest
             * @instance
             */
            DownloadFileRequest.prototype.base64 = null;

            /**
             * DownloadFileRequest rootPath.
             * @member {string|null|undefined} rootPath
             * @memberof kritor.core.DownloadFileRequest
             * @instance
             */
            DownloadFileRequest.prototype.rootPath = null;

            /**
             * DownloadFileRequest fileName.
             * @member {string|null|undefined} fileName
             * @memberof kritor.core.DownloadFileRequest
             * @instance
             */
            DownloadFileRequest.prototype.fileName = null;

            /**
             * DownloadFileRequest threadCnt.
             * @member {number|null|undefined} threadCnt
             * @memberof kritor.core.DownloadFileRequest
             * @instance
             */
            DownloadFileRequest.prototype.threadCnt = null;

            /**
             * DownloadFileRequest headers.
             * @member {string|null|undefined} headers
             * @memberof kritor.core.DownloadFileRequest
             * @instance
             */
            DownloadFileRequest.prototype.headers = null;

            // OneOf field names bound to virtual getters and setters
            let $oneOfFields;

            /**
             * DownloadFileRequest _url.
             * @member {"url"|undefined} _url
             * @memberof kritor.core.DownloadFileRequest
             * @instance
             */
            Object.defineProperty(DownloadFileRequest.prototype, "_url", {
                get: $util.oneOfGetter($oneOfFields = ["url"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * DownloadFileRequest _base64.
             * @member {"base64"|undefined} _base64
             * @memberof kritor.core.DownloadFileRequest
             * @instance
             */
            Object.defineProperty(DownloadFileRequest.prototype, "_base64", {
                get: $util.oneOfGetter($oneOfFields = ["base64"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * DownloadFileRequest _rootPath.
             * @member {"rootPath"|undefined} _rootPath
             * @memberof kritor.core.DownloadFileRequest
             * @instance
             */
            Object.defineProperty(DownloadFileRequest.prototype, "_rootPath", {
                get: $util.oneOfGetter($oneOfFields = ["rootPath"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * DownloadFileRequest _fileName.
             * @member {"fileName"|undefined} _fileName
             * @memberof kritor.core.DownloadFileRequest
             * @instance
             */
            Object.defineProperty(DownloadFileRequest.prototype, "_fileName", {
                get: $util.oneOfGetter($oneOfFields = ["fileName"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * DownloadFileRequest _threadCnt.
             * @member {"threadCnt"|undefined} _threadCnt
             * @memberof kritor.core.DownloadFileRequest
             * @instance
             */
            Object.defineProperty(DownloadFileRequest.prototype, "_threadCnt", {
                get: $util.oneOfGetter($oneOfFields = ["threadCnt"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * DownloadFileRequest _headers.
             * @member {"headers"|undefined} _headers
             * @memberof kritor.core.DownloadFileRequest
             * @instance
             */
            Object.defineProperty(DownloadFileRequest.prototype, "_headers", {
                get: $util.oneOfGetter($oneOfFields = ["headers"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new DownloadFileRequest instance using the specified properties.
             * @function create
             * @memberof kritor.core.DownloadFileRequest
             * @static
             * @param {kritor.core.IDownloadFileRequest=} [properties] Properties to set
             * @returns {kritor.core.DownloadFileRequest} DownloadFileRequest instance
             */
            DownloadFileRequest.create = function create(properties) {
                return new DownloadFileRequest(properties);
            };

            /**
             * Encodes the specified DownloadFileRequest message. Does not implicitly {@link kritor.core.DownloadFileRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.core.DownloadFileRequest
             * @static
             * @param {kritor.core.IDownloadFileRequest} message DownloadFileRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DownloadFileRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.url != null && Object.hasOwnProperty.call(message, "url"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.url);
                if (message.base64 != null && Object.hasOwnProperty.call(message, "base64"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.base64);
                if (message.rootPath != null && Object.hasOwnProperty.call(message, "rootPath"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.rootPath);
                if (message.fileName != null && Object.hasOwnProperty.call(message, "fileName"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.fileName);
                if (message.threadCnt != null && Object.hasOwnProperty.call(message, "threadCnt"))
                    writer.uint32(/* id 5, wireType 0 =*/40).uint32(message.threadCnt);
                if (message.headers != null && Object.hasOwnProperty.call(message, "headers"))
                    writer.uint32(/* id 6, wireType 2 =*/50).string(message.headers);
                return writer;
            };

            /**
             * Encodes the specified DownloadFileRequest message, length delimited. Does not implicitly {@link kritor.core.DownloadFileRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.core.DownloadFileRequest
             * @static
             * @param {kritor.core.IDownloadFileRequest} message DownloadFileRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DownloadFileRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a DownloadFileRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.core.DownloadFileRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.core.DownloadFileRequest} DownloadFileRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DownloadFileRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.core.DownloadFileRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.url = reader.string();
                            break;
                        }
                    case 2: {
                            message.base64 = reader.string();
                            break;
                        }
                    case 3: {
                            message.rootPath = reader.string();
                            break;
                        }
                    case 4: {
                            message.fileName = reader.string();
                            break;
                        }
                    case 5: {
                            message.threadCnt = reader.uint32();
                            break;
                        }
                    case 6: {
                            message.headers = reader.string();
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
             * Decodes a DownloadFileRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.core.DownloadFileRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.core.DownloadFileRequest} DownloadFileRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DownloadFileRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a DownloadFileRequest message.
             * @function verify
             * @memberof kritor.core.DownloadFileRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            DownloadFileRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                let properties = {};
                if (message.url != null && message.hasOwnProperty("url")) {
                    properties._url = 1;
                    if (!$util.isString(message.url))
                        return "url: string expected";
                }
                if (message.base64 != null && message.hasOwnProperty("base64")) {
                    properties._base64 = 1;
                    if (!$util.isString(message.base64))
                        return "base64: string expected";
                }
                if (message.rootPath != null && message.hasOwnProperty("rootPath")) {
                    properties._rootPath = 1;
                    if (!$util.isString(message.rootPath))
                        return "rootPath: string expected";
                }
                if (message.fileName != null && message.hasOwnProperty("fileName")) {
                    properties._fileName = 1;
                    if (!$util.isString(message.fileName))
                        return "fileName: string expected";
                }
                if (message.threadCnt != null && message.hasOwnProperty("threadCnt")) {
                    properties._threadCnt = 1;
                    if (!$util.isInteger(message.threadCnt))
                        return "threadCnt: integer expected";
                }
                if (message.headers != null && message.hasOwnProperty("headers")) {
                    properties._headers = 1;
                    if (!$util.isString(message.headers))
                        return "headers: string expected";
                }
                return null;
            };

            /**
             * Creates a DownloadFileRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.core.DownloadFileRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.core.DownloadFileRequest} DownloadFileRequest
             */
            DownloadFileRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.core.DownloadFileRequest)
                    return object;
                let message = new $root.kritor.core.DownloadFileRequest();
                if (object.url != null)
                    message.url = String(object.url);
                if (object.base64 != null)
                    message.base64 = String(object.base64);
                if (object.rootPath != null)
                    message.rootPath = String(object.rootPath);
                if (object.fileName != null)
                    message.fileName = String(object.fileName);
                if (object.threadCnt != null)
                    message.threadCnt = object.threadCnt >>> 0;
                if (object.headers != null)
                    message.headers = String(object.headers);
                return message;
            };

            /**
             * Creates a plain object from a DownloadFileRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.core.DownloadFileRequest
             * @static
             * @param {kritor.core.DownloadFileRequest} message DownloadFileRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            DownloadFileRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (message.url != null && message.hasOwnProperty("url")) {
                    object.url = message.url;
                    if (options.oneofs)
                        object._url = "url";
                }
                if (message.base64 != null && message.hasOwnProperty("base64")) {
                    object.base64 = message.base64;
                    if (options.oneofs)
                        object._base64 = "base64";
                }
                if (message.rootPath != null && message.hasOwnProperty("rootPath")) {
                    object.rootPath = message.rootPath;
                    if (options.oneofs)
                        object._rootPath = "rootPath";
                }
                if (message.fileName != null && message.hasOwnProperty("fileName")) {
                    object.fileName = message.fileName;
                    if (options.oneofs)
                        object._fileName = "fileName";
                }
                if (message.threadCnt != null && message.hasOwnProperty("threadCnt")) {
                    object.threadCnt = message.threadCnt;
                    if (options.oneofs)
                        object._threadCnt = "threadCnt";
                }
                if (message.headers != null && message.hasOwnProperty("headers")) {
                    object.headers = message.headers;
                    if (options.oneofs)
                        object._headers = "headers";
                }
                return object;
            };

            /**
             * Converts this DownloadFileRequest to JSON.
             * @function toJSON
             * @memberof kritor.core.DownloadFileRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            DownloadFileRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for DownloadFileRequest
             * @function getTypeUrl
             * @memberof kritor.core.DownloadFileRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            DownloadFileRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.core.DownloadFileRequest";
            };

            return DownloadFileRequest;
        })();

        core.DownloadFileResponse = (function() {

            /**
             * Properties of a DownloadFileResponse.
             * @memberof kritor.core
             * @interface IDownloadFileResponse
             * @property {string|null} [fileAbsolutePath] DownloadFileResponse fileAbsolutePath
             * @property {string|null} [fileMd5] DownloadFileResponse fileMd5
             */

            /**
             * Constructs a new DownloadFileResponse.
             * @memberof kritor.core
             * @classdesc Represents a DownloadFileResponse.
             * @implements IDownloadFileResponse
             * @constructor
             * @param {kritor.core.IDownloadFileResponse=} [properties] Properties to set
             */
            function DownloadFileResponse(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * DownloadFileResponse fileAbsolutePath.
             * @member {string} fileAbsolutePath
             * @memberof kritor.core.DownloadFileResponse
             * @instance
             */
            DownloadFileResponse.prototype.fileAbsolutePath = "";

            /**
             * DownloadFileResponse fileMd5.
             * @member {string} fileMd5
             * @memberof kritor.core.DownloadFileResponse
             * @instance
             */
            DownloadFileResponse.prototype.fileMd5 = "";

            /**
             * Creates a new DownloadFileResponse instance using the specified properties.
             * @function create
             * @memberof kritor.core.DownloadFileResponse
             * @static
             * @param {kritor.core.IDownloadFileResponse=} [properties] Properties to set
             * @returns {kritor.core.DownloadFileResponse} DownloadFileResponse instance
             */
            DownloadFileResponse.create = function create(properties) {
                return new DownloadFileResponse(properties);
            };

            /**
             * Encodes the specified DownloadFileResponse message. Does not implicitly {@link kritor.core.DownloadFileResponse.verify|verify} messages.
             * @function encode
             * @memberof kritor.core.DownloadFileResponse
             * @static
             * @param {kritor.core.IDownloadFileResponse} message DownloadFileResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DownloadFileResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.fileAbsolutePath != null && Object.hasOwnProperty.call(message, "fileAbsolutePath"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.fileAbsolutePath);
                if (message.fileMd5 != null && Object.hasOwnProperty.call(message, "fileMd5"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.fileMd5);
                return writer;
            };

            /**
             * Encodes the specified DownloadFileResponse message, length delimited. Does not implicitly {@link kritor.core.DownloadFileResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.core.DownloadFileResponse
             * @static
             * @param {kritor.core.IDownloadFileResponse} message DownloadFileResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DownloadFileResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a DownloadFileResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.core.DownloadFileResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.core.DownloadFileResponse} DownloadFileResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DownloadFileResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.core.DownloadFileResponse();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.fileAbsolutePath = reader.string();
                            break;
                        }
                    case 2: {
                            message.fileMd5 = reader.string();
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
             * Decodes a DownloadFileResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.core.DownloadFileResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.core.DownloadFileResponse} DownloadFileResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DownloadFileResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a DownloadFileResponse message.
             * @function verify
             * @memberof kritor.core.DownloadFileResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            DownloadFileResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.fileAbsolutePath != null && message.hasOwnProperty("fileAbsolutePath"))
                    if (!$util.isString(message.fileAbsolutePath))
                        return "fileAbsolutePath: string expected";
                if (message.fileMd5 != null && message.hasOwnProperty("fileMd5"))
                    if (!$util.isString(message.fileMd5))
                        return "fileMd5: string expected";
                return null;
            };

            /**
             * Creates a DownloadFileResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.core.DownloadFileResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.core.DownloadFileResponse} DownloadFileResponse
             */
            DownloadFileResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.core.DownloadFileResponse)
                    return object;
                let message = new $root.kritor.core.DownloadFileResponse();
                if (object.fileAbsolutePath != null)
                    message.fileAbsolutePath = String(object.fileAbsolutePath);
                if (object.fileMd5 != null)
                    message.fileMd5 = String(object.fileMd5);
                return message;
            };

            /**
             * Creates a plain object from a DownloadFileResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.core.DownloadFileResponse
             * @static
             * @param {kritor.core.DownloadFileResponse} message DownloadFileResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            DownloadFileResponse.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.fileAbsolutePath = "";
                    object.fileMd5 = "";
                }
                if (message.fileAbsolutePath != null && message.hasOwnProperty("fileAbsolutePath"))
                    object.fileAbsolutePath = message.fileAbsolutePath;
                if (message.fileMd5 != null && message.hasOwnProperty("fileMd5"))
                    object.fileMd5 = message.fileMd5;
                return object;
            };

            /**
             * Converts this DownloadFileResponse to JSON.
             * @function toJSON
             * @memberof kritor.core.DownloadFileResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            DownloadFileResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for DownloadFileResponse
             * @function getTypeUrl
             * @memberof kritor.core.DownloadFileResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            DownloadFileResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.core.DownloadFileResponse";
            };

            return DownloadFileResponse;
        })();

        core.GetCurrentAccountRequest = (function() {

            /**
             * Properties of a GetCurrentAccountRequest.
             * @memberof kritor.core
             * @interface IGetCurrentAccountRequest
             */

            /**
             * Constructs a new GetCurrentAccountRequest.
             * @memberof kritor.core
             * @classdesc Represents a GetCurrentAccountRequest.
             * @implements IGetCurrentAccountRequest
             * @constructor
             * @param {kritor.core.IGetCurrentAccountRequest=} [properties] Properties to set
             */
            function GetCurrentAccountRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Creates a new GetCurrentAccountRequest instance using the specified properties.
             * @function create
             * @memberof kritor.core.GetCurrentAccountRequest
             * @static
             * @param {kritor.core.IGetCurrentAccountRequest=} [properties] Properties to set
             * @returns {kritor.core.GetCurrentAccountRequest} GetCurrentAccountRequest instance
             */
            GetCurrentAccountRequest.create = function create(properties) {
                return new GetCurrentAccountRequest(properties);
            };

            /**
             * Encodes the specified GetCurrentAccountRequest message. Does not implicitly {@link kritor.core.GetCurrentAccountRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.core.GetCurrentAccountRequest
             * @static
             * @param {kritor.core.IGetCurrentAccountRequest} message GetCurrentAccountRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetCurrentAccountRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                return writer;
            };

            /**
             * Encodes the specified GetCurrentAccountRequest message, length delimited. Does not implicitly {@link kritor.core.GetCurrentAccountRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.core.GetCurrentAccountRequest
             * @static
             * @param {kritor.core.IGetCurrentAccountRequest} message GetCurrentAccountRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetCurrentAccountRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetCurrentAccountRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.core.GetCurrentAccountRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.core.GetCurrentAccountRequest} GetCurrentAccountRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetCurrentAccountRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.core.GetCurrentAccountRequest();
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
             * Decodes a GetCurrentAccountRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.core.GetCurrentAccountRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.core.GetCurrentAccountRequest} GetCurrentAccountRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetCurrentAccountRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetCurrentAccountRequest message.
             * @function verify
             * @memberof kritor.core.GetCurrentAccountRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetCurrentAccountRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                return null;
            };

            /**
             * Creates a GetCurrentAccountRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.core.GetCurrentAccountRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.core.GetCurrentAccountRequest} GetCurrentAccountRequest
             */
            GetCurrentAccountRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.core.GetCurrentAccountRequest)
                    return object;
                return new $root.kritor.core.GetCurrentAccountRequest();
            };

            /**
             * Creates a plain object from a GetCurrentAccountRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.core.GetCurrentAccountRequest
             * @static
             * @param {kritor.core.GetCurrentAccountRequest} message GetCurrentAccountRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetCurrentAccountRequest.toObject = function toObject() {
                return {};
            };

            /**
             * Converts this GetCurrentAccountRequest to JSON.
             * @function toJSON
             * @memberof kritor.core.GetCurrentAccountRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetCurrentAccountRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GetCurrentAccountRequest
             * @function getTypeUrl
             * @memberof kritor.core.GetCurrentAccountRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetCurrentAccountRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.core.GetCurrentAccountRequest";
            };

            return GetCurrentAccountRequest;
        })();

        core.GetCurrentAccountResponse = (function() {

            /**
             * Properties of a GetCurrentAccountResponse.
             * @memberof kritor.core
             * @interface IGetCurrentAccountResponse
             * @property {string|null} [accountUid] GetCurrentAccountResponse accountUid
             * @property {number|Long|null} [accountUin] GetCurrentAccountResponse accountUin
             * @property {string|null} [accountName] GetCurrentAccountResponse accountName
             */

            /**
             * Constructs a new GetCurrentAccountResponse.
             * @memberof kritor.core
             * @classdesc Represents a GetCurrentAccountResponse.
             * @implements IGetCurrentAccountResponse
             * @constructor
             * @param {kritor.core.IGetCurrentAccountResponse=} [properties] Properties to set
             */
            function GetCurrentAccountResponse(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetCurrentAccountResponse accountUid.
             * @member {string} accountUid
             * @memberof kritor.core.GetCurrentAccountResponse
             * @instance
             */
            GetCurrentAccountResponse.prototype.accountUid = "";

            /**
             * GetCurrentAccountResponse accountUin.
             * @member {number|Long} accountUin
             * @memberof kritor.core.GetCurrentAccountResponse
             * @instance
             */
            GetCurrentAccountResponse.prototype.accountUin = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * GetCurrentAccountResponse accountName.
             * @member {string} accountName
             * @memberof kritor.core.GetCurrentAccountResponse
             * @instance
             */
            GetCurrentAccountResponse.prototype.accountName = "";

            /**
             * Creates a new GetCurrentAccountResponse instance using the specified properties.
             * @function create
             * @memberof kritor.core.GetCurrentAccountResponse
             * @static
             * @param {kritor.core.IGetCurrentAccountResponse=} [properties] Properties to set
             * @returns {kritor.core.GetCurrentAccountResponse} GetCurrentAccountResponse instance
             */
            GetCurrentAccountResponse.create = function create(properties) {
                return new GetCurrentAccountResponse(properties);
            };

            /**
             * Encodes the specified GetCurrentAccountResponse message. Does not implicitly {@link kritor.core.GetCurrentAccountResponse.verify|verify} messages.
             * @function encode
             * @memberof kritor.core.GetCurrentAccountResponse
             * @static
             * @param {kritor.core.IGetCurrentAccountResponse} message GetCurrentAccountResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetCurrentAccountResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.accountUid != null && Object.hasOwnProperty.call(message, "accountUid"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.accountUid);
                if (message.accountUin != null && Object.hasOwnProperty.call(message, "accountUin"))
                    writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.accountUin);
                if (message.accountName != null && Object.hasOwnProperty.call(message, "accountName"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.accountName);
                return writer;
            };

            /**
             * Encodes the specified GetCurrentAccountResponse message, length delimited. Does not implicitly {@link kritor.core.GetCurrentAccountResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.core.GetCurrentAccountResponse
             * @static
             * @param {kritor.core.IGetCurrentAccountResponse} message GetCurrentAccountResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetCurrentAccountResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetCurrentAccountResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.core.GetCurrentAccountResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.core.GetCurrentAccountResponse} GetCurrentAccountResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetCurrentAccountResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.core.GetCurrentAccountResponse();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.accountUid = reader.string();
                            break;
                        }
                    case 2: {
                            message.accountUin = reader.uint64();
                            break;
                        }
                    case 3: {
                            message.accountName = reader.string();
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
             * Decodes a GetCurrentAccountResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.core.GetCurrentAccountResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.core.GetCurrentAccountResponse} GetCurrentAccountResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetCurrentAccountResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetCurrentAccountResponse message.
             * @function verify
             * @memberof kritor.core.GetCurrentAccountResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetCurrentAccountResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.accountUid != null && message.hasOwnProperty("accountUid"))
                    if (!$util.isString(message.accountUid))
                        return "accountUid: string expected";
                if (message.accountUin != null && message.hasOwnProperty("accountUin"))
                    if (!$util.isInteger(message.accountUin) && !(message.accountUin && $util.isInteger(message.accountUin.low) && $util.isInteger(message.accountUin.high)))
                        return "accountUin: integer|Long expected";
                if (message.accountName != null && message.hasOwnProperty("accountName"))
                    if (!$util.isString(message.accountName))
                        return "accountName: string expected";
                return null;
            };

            /**
             * Creates a GetCurrentAccountResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.core.GetCurrentAccountResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.core.GetCurrentAccountResponse} GetCurrentAccountResponse
             */
            GetCurrentAccountResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.core.GetCurrentAccountResponse)
                    return object;
                let message = new $root.kritor.core.GetCurrentAccountResponse();
                if (object.accountUid != null)
                    message.accountUid = String(object.accountUid);
                if (object.accountUin != null)
                    if ($util.Long)
                        (message.accountUin = $util.Long.fromValue(object.accountUin)).unsigned = true;
                    else if (typeof object.accountUin === "string")
                        message.accountUin = parseInt(object.accountUin, 10);
                    else if (typeof object.accountUin === "number")
                        message.accountUin = object.accountUin;
                    else if (typeof object.accountUin === "object")
                        message.accountUin = new $util.LongBits(object.accountUin.low >>> 0, object.accountUin.high >>> 0).toNumber(true);
                if (object.accountName != null)
                    message.accountName = String(object.accountName);
                return message;
            };

            /**
             * Creates a plain object from a GetCurrentAccountResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.core.GetCurrentAccountResponse
             * @static
             * @param {kritor.core.GetCurrentAccountResponse} message GetCurrentAccountResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetCurrentAccountResponse.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.accountUid = "";
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.accountUin = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.accountUin = options.longs === String ? "0" : 0;
                    object.accountName = "";
                }
                if (message.accountUid != null && message.hasOwnProperty("accountUid"))
                    object.accountUid = message.accountUid;
                if (message.accountUin != null && message.hasOwnProperty("accountUin"))
                    if (typeof message.accountUin === "number")
                        object.accountUin = options.longs === String ? String(message.accountUin) : message.accountUin;
                    else
                        object.accountUin = options.longs === String ? $util.Long.prototype.toString.call(message.accountUin) : options.longs === Number ? new $util.LongBits(message.accountUin.low >>> 0, message.accountUin.high >>> 0).toNumber(true) : message.accountUin;
                if (message.accountName != null && message.hasOwnProperty("accountName"))
                    object.accountName = message.accountName;
                return object;
            };

            /**
             * Converts this GetCurrentAccountResponse to JSON.
             * @function toJSON
             * @memberof kritor.core.GetCurrentAccountResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetCurrentAccountResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GetCurrentAccountResponse
             * @function getTypeUrl
             * @memberof kritor.core.GetCurrentAccountResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetCurrentAccountResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.core.GetCurrentAccountResponse";
            };

            return GetCurrentAccountResponse;
        })();

        core.SwitchAccountRequest = (function() {

            /**
             * Properties of a SwitchAccountRequest.
             * @memberof kritor.core
             * @interface ISwitchAccountRequest
             * @property {string|null} [accountUid] SwitchAccountRequest accountUid
             * @property {number|Long|null} [accountUin] SwitchAccountRequest accountUin
             * @property {string|null} [superTicket] SwitchAccountRequest superTicket
             */

            /**
             * Constructs a new SwitchAccountRequest.
             * @memberof kritor.core
             * @classdesc Represents a SwitchAccountRequest.
             * @implements ISwitchAccountRequest
             * @constructor
             * @param {kritor.core.ISwitchAccountRequest=} [properties] Properties to set
             */
            function SwitchAccountRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * SwitchAccountRequest accountUid.
             * @member {string|null|undefined} accountUid
             * @memberof kritor.core.SwitchAccountRequest
             * @instance
             */
            SwitchAccountRequest.prototype.accountUid = null;

            /**
             * SwitchAccountRequest accountUin.
             * @member {number|Long|null|undefined} accountUin
             * @memberof kritor.core.SwitchAccountRequest
             * @instance
             */
            SwitchAccountRequest.prototype.accountUin = null;

            /**
             * SwitchAccountRequest superTicket.
             * @member {string} superTicket
             * @memberof kritor.core.SwitchAccountRequest
             * @instance
             */
            SwitchAccountRequest.prototype.superTicket = "";

            // OneOf field names bound to virtual getters and setters
            let $oneOfFields;

            /**
             * SwitchAccountRequest account.
             * @member {"accountUid"|"accountUin"|undefined} account
             * @memberof kritor.core.SwitchAccountRequest
             * @instance
             */
            Object.defineProperty(SwitchAccountRequest.prototype, "account", {
                get: $util.oneOfGetter($oneOfFields = ["accountUid", "accountUin"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new SwitchAccountRequest instance using the specified properties.
             * @function create
             * @memberof kritor.core.SwitchAccountRequest
             * @static
             * @param {kritor.core.ISwitchAccountRequest=} [properties] Properties to set
             * @returns {kritor.core.SwitchAccountRequest} SwitchAccountRequest instance
             */
            SwitchAccountRequest.create = function create(properties) {
                return new SwitchAccountRequest(properties);
            };

            /**
             * Encodes the specified SwitchAccountRequest message. Does not implicitly {@link kritor.core.SwitchAccountRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.core.SwitchAccountRequest
             * @static
             * @param {kritor.core.ISwitchAccountRequest} message SwitchAccountRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SwitchAccountRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.accountUid != null && Object.hasOwnProperty.call(message, "accountUid"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.accountUid);
                if (message.accountUin != null && Object.hasOwnProperty.call(message, "accountUin"))
                    writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.accountUin);
                if (message.superTicket != null && Object.hasOwnProperty.call(message, "superTicket"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.superTicket);
                return writer;
            };

            /**
             * Encodes the specified SwitchAccountRequest message, length delimited. Does not implicitly {@link kritor.core.SwitchAccountRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.core.SwitchAccountRequest
             * @static
             * @param {kritor.core.ISwitchAccountRequest} message SwitchAccountRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SwitchAccountRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a SwitchAccountRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.core.SwitchAccountRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.core.SwitchAccountRequest} SwitchAccountRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SwitchAccountRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.core.SwitchAccountRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.accountUid = reader.string();
                            break;
                        }
                    case 2: {
                            message.accountUin = reader.uint64();
                            break;
                        }
                    case 3: {
                            message.superTicket = reader.string();
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
             * Decodes a SwitchAccountRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.core.SwitchAccountRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.core.SwitchAccountRequest} SwitchAccountRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SwitchAccountRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a SwitchAccountRequest message.
             * @function verify
             * @memberof kritor.core.SwitchAccountRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            SwitchAccountRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                let properties = {};
                if (message.accountUid != null && message.hasOwnProperty("accountUid")) {
                    properties.account = 1;
                    if (!$util.isString(message.accountUid))
                        return "accountUid: string expected";
                }
                if (message.accountUin != null && message.hasOwnProperty("accountUin")) {
                    if (properties.account === 1)
                        return "account: multiple values";
                    properties.account = 1;
                    if (!$util.isInteger(message.accountUin) && !(message.accountUin && $util.isInteger(message.accountUin.low) && $util.isInteger(message.accountUin.high)))
                        return "accountUin: integer|Long expected";
                }
                if (message.superTicket != null && message.hasOwnProperty("superTicket"))
                    if (!$util.isString(message.superTicket))
                        return "superTicket: string expected";
                return null;
            };

            /**
             * Creates a SwitchAccountRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.core.SwitchAccountRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.core.SwitchAccountRequest} SwitchAccountRequest
             */
            SwitchAccountRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.core.SwitchAccountRequest)
                    return object;
                let message = new $root.kritor.core.SwitchAccountRequest();
                if (object.accountUid != null)
                    message.accountUid = String(object.accountUid);
                if (object.accountUin != null)
                    if ($util.Long)
                        (message.accountUin = $util.Long.fromValue(object.accountUin)).unsigned = true;
                    else if (typeof object.accountUin === "string")
                        message.accountUin = parseInt(object.accountUin, 10);
                    else if (typeof object.accountUin === "number")
                        message.accountUin = object.accountUin;
                    else if (typeof object.accountUin === "object")
                        message.accountUin = new $util.LongBits(object.accountUin.low >>> 0, object.accountUin.high >>> 0).toNumber(true);
                if (object.superTicket != null)
                    message.superTicket = String(object.superTicket);
                return message;
            };

            /**
             * Creates a plain object from a SwitchAccountRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.core.SwitchAccountRequest
             * @static
             * @param {kritor.core.SwitchAccountRequest} message SwitchAccountRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            SwitchAccountRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults)
                    object.superTicket = "";
                if (message.accountUid != null && message.hasOwnProperty("accountUid")) {
                    object.accountUid = message.accountUid;
                    if (options.oneofs)
                        object.account = "accountUid";
                }
                if (message.accountUin != null && message.hasOwnProperty("accountUin")) {
                    if (typeof message.accountUin === "number")
                        object.accountUin = options.longs === String ? String(message.accountUin) : message.accountUin;
                    else
                        object.accountUin = options.longs === String ? $util.Long.prototype.toString.call(message.accountUin) : options.longs === Number ? new $util.LongBits(message.accountUin.low >>> 0, message.accountUin.high >>> 0).toNumber(true) : message.accountUin;
                    if (options.oneofs)
                        object.account = "accountUin";
                }
                if (message.superTicket != null && message.hasOwnProperty("superTicket"))
                    object.superTicket = message.superTicket;
                return object;
            };

            /**
             * Converts this SwitchAccountRequest to JSON.
             * @function toJSON
             * @memberof kritor.core.SwitchAccountRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            SwitchAccountRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for SwitchAccountRequest
             * @function getTypeUrl
             * @memberof kritor.core.SwitchAccountRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            SwitchAccountRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.core.SwitchAccountRequest";
            };

            return SwitchAccountRequest;
        })();

        core.SwitchAccountResponse = (function() {

            /**
             * Properties of a SwitchAccountResponse.
             * @memberof kritor.core
             * @interface ISwitchAccountResponse
             */

            /**
             * Constructs a new SwitchAccountResponse.
             * @memberof kritor.core
             * @classdesc Represents a SwitchAccountResponse.
             * @implements ISwitchAccountResponse
             * @constructor
             * @param {kritor.core.ISwitchAccountResponse=} [properties] Properties to set
             */
            function SwitchAccountResponse(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Creates a new SwitchAccountResponse instance using the specified properties.
             * @function create
             * @memberof kritor.core.SwitchAccountResponse
             * @static
             * @param {kritor.core.ISwitchAccountResponse=} [properties] Properties to set
             * @returns {kritor.core.SwitchAccountResponse} SwitchAccountResponse instance
             */
            SwitchAccountResponse.create = function create(properties) {
                return new SwitchAccountResponse(properties);
            };

            /**
             * Encodes the specified SwitchAccountResponse message. Does not implicitly {@link kritor.core.SwitchAccountResponse.verify|verify} messages.
             * @function encode
             * @memberof kritor.core.SwitchAccountResponse
             * @static
             * @param {kritor.core.ISwitchAccountResponse} message SwitchAccountResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SwitchAccountResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                return writer;
            };

            /**
             * Encodes the specified SwitchAccountResponse message, length delimited. Does not implicitly {@link kritor.core.SwitchAccountResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.core.SwitchAccountResponse
             * @static
             * @param {kritor.core.ISwitchAccountResponse} message SwitchAccountResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SwitchAccountResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a SwitchAccountResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.core.SwitchAccountResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.core.SwitchAccountResponse} SwitchAccountResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SwitchAccountResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.core.SwitchAccountResponse();
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
             * Decodes a SwitchAccountResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.core.SwitchAccountResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.core.SwitchAccountResponse} SwitchAccountResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SwitchAccountResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a SwitchAccountResponse message.
             * @function verify
             * @memberof kritor.core.SwitchAccountResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            SwitchAccountResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                return null;
            };

            /**
             * Creates a SwitchAccountResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.core.SwitchAccountResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.core.SwitchAccountResponse} SwitchAccountResponse
             */
            SwitchAccountResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.core.SwitchAccountResponse)
                    return object;
                return new $root.kritor.core.SwitchAccountResponse();
            };

            /**
             * Creates a plain object from a SwitchAccountResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.core.SwitchAccountResponse
             * @static
             * @param {kritor.core.SwitchAccountResponse} message SwitchAccountResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            SwitchAccountResponse.toObject = function toObject() {
                return {};
            };

            /**
             * Converts this SwitchAccountResponse to JSON.
             * @function toJSON
             * @memberof kritor.core.SwitchAccountResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            SwitchAccountResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for SwitchAccountResponse
             * @function getTypeUrl
             * @memberof kritor.core.SwitchAccountResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            SwitchAccountResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.core.SwitchAccountResponse";
            };

            return SwitchAccountResponse;
        })();

        return core;
    })();

    return kritor;
})();

export { $root as default };
