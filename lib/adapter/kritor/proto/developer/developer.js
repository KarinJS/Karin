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

        developer.DeveloperService = (function() {

            /**
             * Constructs a new DeveloperService service.
             * @memberof kritor.developer
             * @classdesc Represents a DeveloperService
             * @extends $protobuf.rpc.Service
             * @constructor
             * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
             * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
             * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
             */
            function DeveloperService(rpcImpl, requestDelimited, responseDelimited) {
                $protobuf.rpc.Service.call(this, rpcImpl, requestDelimited, responseDelimited);
            }

            (DeveloperService.prototype = Object.create($protobuf.rpc.Service.prototype)).constructor = DeveloperService;

            /**
             * Creates new DeveloperService service using the specified rpc implementation.
             * @function create
             * @memberof kritor.developer.DeveloperService
             * @static
             * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
             * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
             * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
             * @returns {DeveloperService} RPC service. Useful where requests and/or responses are streamed.
             */
            DeveloperService.create = function create(rpcImpl, requestDelimited, responseDelimited) {
                return new this(rpcImpl, requestDelimited, responseDelimited);
            };

            /**
             * Callback as used by {@link kritor.developer.DeveloperService#shell}.
             * @memberof kritor.developer.DeveloperService
             * @typedef ShellCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.developer.ShellResponse} [response] ShellResponse
             */

            /**
             * Calls Shell.
             * @function shell
             * @memberof kritor.developer.DeveloperService
             * @instance
             * @param {kritor.developer.IShellRequest} request ShellRequest message or plain object
             * @param {kritor.developer.DeveloperService.ShellCallback} callback Node-style callback called with the error, if any, and ShellResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(DeveloperService.prototype.shell = function shell(request, callback) {
                return this.rpcCall(shell, $root.kritor.developer.ShellRequest, $root.kritor.developer.ShellResponse, request, callback);
            }, "name", { value: "Shell" });

            /**
             * Calls Shell.
             * @function shell
             * @memberof kritor.developer.DeveloperService
             * @instance
             * @param {kritor.developer.IShellRequest} request ShellRequest message or plain object
             * @returns {Promise<kritor.developer.ShellResponse>} Promise
             * @variation 2
             */

            /**
             * Callback as used by {@link kritor.developer.DeveloperService#getLog}.
             * @memberof kritor.developer.DeveloperService
             * @typedef GetLogCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.developer.GetLogResponse} [response] GetLogResponse
             */

            /**
             * Calls GetLog.
             * @function getLog
             * @memberof kritor.developer.DeveloperService
             * @instance
             * @param {kritor.developer.IGetLogRequest} request GetLogRequest message or plain object
             * @param {kritor.developer.DeveloperService.GetLogCallback} callback Node-style callback called with the error, if any, and GetLogResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(DeveloperService.prototype.getLog = function getLog(request, callback) {
                return this.rpcCall(getLog, $root.kritor.developer.GetLogRequest, $root.kritor.developer.GetLogResponse, request, callback);
            }, "name", { value: "GetLog" });

            /**
             * Calls GetLog.
             * @function getLog
             * @memberof kritor.developer.DeveloperService
             * @instance
             * @param {kritor.developer.IGetLogRequest} request GetLogRequest message or plain object
             * @returns {Promise<kritor.developer.GetLogResponse>} Promise
             * @variation 2
             */

            /**
             * Callback as used by {@link kritor.developer.DeveloperService#clearCache}.
             * @memberof kritor.developer.DeveloperService
             * @typedef ClearCacheCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.developer.ClearCacheResponse} [response] ClearCacheResponse
             */

            /**
             * Calls ClearCache.
             * @function clearCache
             * @memberof kritor.developer.DeveloperService
             * @instance
             * @param {kritor.developer.IClearCacheRequest} request ClearCacheRequest message or plain object
             * @param {kritor.developer.DeveloperService.ClearCacheCallback} callback Node-style callback called with the error, if any, and ClearCacheResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(DeveloperService.prototype.clearCache = function clearCache(request, callback) {
                return this.rpcCall(clearCache, $root.kritor.developer.ClearCacheRequest, $root.kritor.developer.ClearCacheResponse, request, callback);
            }, "name", { value: "ClearCache" });

            /**
             * Calls ClearCache.
             * @function clearCache
             * @memberof kritor.developer.DeveloperService
             * @instance
             * @param {kritor.developer.IClearCacheRequest} request ClearCacheRequest message or plain object
             * @returns {Promise<kritor.developer.ClearCacheResponse>} Promise
             * @variation 2
             */

            /**
             * Callback as used by {@link kritor.developer.DeveloperService#getDeviceBattery}.
             * @memberof kritor.developer.DeveloperService
             * @typedef GetDeviceBatteryCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.developer.GetDeviceBatteryResponse} [response] GetDeviceBatteryResponse
             */

            /**
             * Calls GetDeviceBattery.
             * @function getDeviceBattery
             * @memberof kritor.developer.DeveloperService
             * @instance
             * @param {kritor.developer.IGetDeviceBatteryRequest} request GetDeviceBatteryRequest message or plain object
             * @param {kritor.developer.DeveloperService.GetDeviceBatteryCallback} callback Node-style callback called with the error, if any, and GetDeviceBatteryResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(DeveloperService.prototype.getDeviceBattery = function getDeviceBattery(request, callback) {
                return this.rpcCall(getDeviceBattery, $root.kritor.developer.GetDeviceBatteryRequest, $root.kritor.developer.GetDeviceBatteryResponse, request, callback);
            }, "name", { value: "GetDeviceBattery" });

            /**
             * Calls GetDeviceBattery.
             * @function getDeviceBattery
             * @memberof kritor.developer.DeveloperService
             * @instance
             * @param {kritor.developer.IGetDeviceBatteryRequest} request GetDeviceBatteryRequest message or plain object
             * @returns {Promise<kritor.developer.GetDeviceBatteryResponse>} Promise
             * @variation 2
             */

            /**
             * Callback as used by {@link kritor.developer.DeveloperService#uploadImage}.
             * @memberof kritor.developer.DeveloperService
             * @typedef UploadImageCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.developer.UploadImageResponse} [response] UploadImageResponse
             */

            /**
             * Calls UploadImage.
             * @function uploadImage
             * @memberof kritor.developer.DeveloperService
             * @instance
             * @param {kritor.developer.IUploadImageRequest} request UploadImageRequest message or plain object
             * @param {kritor.developer.DeveloperService.UploadImageCallback} callback Node-style callback called with the error, if any, and UploadImageResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(DeveloperService.prototype.uploadImage = function uploadImage(request, callback) {
                return this.rpcCall(uploadImage, $root.kritor.developer.UploadImageRequest, $root.kritor.developer.UploadImageResponse, request, callback);
            }, "name", { value: "UploadImage" });

            /**
             * Calls UploadImage.
             * @function uploadImage
             * @memberof kritor.developer.DeveloperService
             * @instance
             * @param {kritor.developer.IUploadImageRequest} request UploadImageRequest message or plain object
             * @returns {Promise<kritor.developer.UploadImageResponse>} Promise
             * @variation 2
             */

            /**
             * Callback as used by {@link kritor.developer.DeveloperService#sendPacket}.
             * @memberof kritor.developer.DeveloperService
             * @typedef SendPacketCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.developer.SendPacketResponse} [response] SendPacketResponse
             */

            /**
             * Calls SendPacket.
             * @function sendPacket
             * @memberof kritor.developer.DeveloperService
             * @instance
             * @param {kritor.developer.ISendPacketRequest} request SendPacketRequest message or plain object
             * @param {kritor.developer.DeveloperService.SendPacketCallback} callback Node-style callback called with the error, if any, and SendPacketResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(DeveloperService.prototype.sendPacket = function sendPacket(request, callback) {
                return this.rpcCall(sendPacket, $root.kritor.developer.SendPacketRequest, $root.kritor.developer.SendPacketResponse, request, callback);
            }, "name", { value: "SendPacket" });

            /**
             * Calls SendPacket.
             * @function sendPacket
             * @memberof kritor.developer.DeveloperService
             * @instance
             * @param {kritor.developer.ISendPacketRequest} request SendPacketRequest message or plain object
             * @returns {Promise<kritor.developer.SendPacketResponse>} Promise
             * @variation 2
             */

            return DeveloperService;
        })();

        developer.ShellRequest = (function() {

            /**
             * Properties of a ShellRequest.
             * @memberof kritor.developer
             * @interface IShellRequest
             * @property {string|null} [command] ShellRequest command
             * @property {string|null} [directory] ShellRequest directory
             */

            /**
             * Constructs a new ShellRequest.
             * @memberof kritor.developer
             * @classdesc Represents a ShellRequest.
             * @implements IShellRequest
             * @constructor
             * @param {kritor.developer.IShellRequest=} [properties] Properties to set
             */
            function ShellRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * ShellRequest command.
             * @member {string} command
             * @memberof kritor.developer.ShellRequest
             * @instance
             */
            ShellRequest.prototype.command = "";

            /**
             * ShellRequest directory.
             * @member {string} directory
             * @memberof kritor.developer.ShellRequest
             * @instance
             */
            ShellRequest.prototype.directory = "";

            /**
             * Creates a new ShellRequest instance using the specified properties.
             * @function create
             * @memberof kritor.developer.ShellRequest
             * @static
             * @param {kritor.developer.IShellRequest=} [properties] Properties to set
             * @returns {kritor.developer.ShellRequest} ShellRequest instance
             */
            ShellRequest.create = function create(properties) {
                return new ShellRequest(properties);
            };

            /**
             * Encodes the specified ShellRequest message. Does not implicitly {@link kritor.developer.ShellRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.developer.ShellRequest
             * @static
             * @param {kritor.developer.IShellRequest} message ShellRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ShellRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.command != null && Object.hasOwnProperty.call(message, "command"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.command);
                if (message.directory != null && Object.hasOwnProperty.call(message, "directory"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.directory);
                return writer;
            };

            /**
             * Encodes the specified ShellRequest message, length delimited. Does not implicitly {@link kritor.developer.ShellRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.developer.ShellRequest
             * @static
             * @param {kritor.developer.IShellRequest} message ShellRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ShellRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a ShellRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.developer.ShellRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.developer.ShellRequest} ShellRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ShellRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.developer.ShellRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.command = reader.string();
                            break;
                        }
                    case 2: {
                            message.directory = reader.string();
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
             * Decodes a ShellRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.developer.ShellRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.developer.ShellRequest} ShellRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ShellRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a ShellRequest message.
             * @function verify
             * @memberof kritor.developer.ShellRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ShellRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.command != null && message.hasOwnProperty("command"))
                    if (!$util.isString(message.command))
                        return "command: string expected";
                if (message.directory != null && message.hasOwnProperty("directory"))
                    if (!$util.isString(message.directory))
                        return "directory: string expected";
                return null;
            };

            /**
             * Creates a ShellRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.developer.ShellRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.developer.ShellRequest} ShellRequest
             */
            ShellRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.developer.ShellRequest)
                    return object;
                let message = new $root.kritor.developer.ShellRequest();
                if (object.command != null)
                    message.command = String(object.command);
                if (object.directory != null)
                    message.directory = String(object.directory);
                return message;
            };

            /**
             * Creates a plain object from a ShellRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.developer.ShellRequest
             * @static
             * @param {kritor.developer.ShellRequest} message ShellRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ShellRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.command = "";
                    object.directory = "";
                }
                if (message.command != null && message.hasOwnProperty("command"))
                    object.command = message.command;
                if (message.directory != null && message.hasOwnProperty("directory"))
                    object.directory = message.directory;
                return object;
            };

            /**
             * Converts this ShellRequest to JSON.
             * @function toJSON
             * @memberof kritor.developer.ShellRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ShellRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for ShellRequest
             * @function getTypeUrl
             * @memberof kritor.developer.ShellRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            ShellRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.developer.ShellRequest";
            };

            return ShellRequest;
        })();

        developer.ShellResponse = (function() {

            /**
             * Properties of a ShellResponse.
             * @memberof kritor.developer
             * @interface IShellResponse
             * @property {boolean|null} [isSuccess] ShellResponse isSuccess
             * @property {string|null} [data] ShellResponse data
             */

            /**
             * Constructs a new ShellResponse.
             * @memberof kritor.developer
             * @classdesc Represents a ShellResponse.
             * @implements IShellResponse
             * @constructor
             * @param {kritor.developer.IShellResponse=} [properties] Properties to set
             */
            function ShellResponse(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * ShellResponse isSuccess.
             * @member {boolean} isSuccess
             * @memberof kritor.developer.ShellResponse
             * @instance
             */
            ShellResponse.prototype.isSuccess = false;

            /**
             * ShellResponse data.
             * @member {string} data
             * @memberof kritor.developer.ShellResponse
             * @instance
             */
            ShellResponse.prototype.data = "";

            /**
             * Creates a new ShellResponse instance using the specified properties.
             * @function create
             * @memberof kritor.developer.ShellResponse
             * @static
             * @param {kritor.developer.IShellResponse=} [properties] Properties to set
             * @returns {kritor.developer.ShellResponse} ShellResponse instance
             */
            ShellResponse.create = function create(properties) {
                return new ShellResponse(properties);
            };

            /**
             * Encodes the specified ShellResponse message. Does not implicitly {@link kritor.developer.ShellResponse.verify|verify} messages.
             * @function encode
             * @memberof kritor.developer.ShellResponse
             * @static
             * @param {kritor.developer.IShellResponse} message ShellResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ShellResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.isSuccess != null && Object.hasOwnProperty.call(message, "isSuccess"))
                    writer.uint32(/* id 1, wireType 0 =*/8).bool(message.isSuccess);
                if (message.data != null && Object.hasOwnProperty.call(message, "data"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.data);
                return writer;
            };

            /**
             * Encodes the specified ShellResponse message, length delimited. Does not implicitly {@link kritor.developer.ShellResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.developer.ShellResponse
             * @static
             * @param {kritor.developer.IShellResponse} message ShellResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ShellResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a ShellResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.developer.ShellResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.developer.ShellResponse} ShellResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ShellResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.developer.ShellResponse();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.isSuccess = reader.bool();
                            break;
                        }
                    case 2: {
                            message.data = reader.string();
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
             * Decodes a ShellResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.developer.ShellResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.developer.ShellResponse} ShellResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ShellResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a ShellResponse message.
             * @function verify
             * @memberof kritor.developer.ShellResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ShellResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.isSuccess != null && message.hasOwnProperty("isSuccess"))
                    if (typeof message.isSuccess !== "boolean")
                        return "isSuccess: boolean expected";
                if (message.data != null && message.hasOwnProperty("data"))
                    if (!$util.isString(message.data))
                        return "data: string expected";
                return null;
            };

            /**
             * Creates a ShellResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.developer.ShellResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.developer.ShellResponse} ShellResponse
             */
            ShellResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.developer.ShellResponse)
                    return object;
                let message = new $root.kritor.developer.ShellResponse();
                if (object.isSuccess != null)
                    message.isSuccess = Boolean(object.isSuccess);
                if (object.data != null)
                    message.data = String(object.data);
                return message;
            };

            /**
             * Creates a plain object from a ShellResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.developer.ShellResponse
             * @static
             * @param {kritor.developer.ShellResponse} message ShellResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ShellResponse.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.isSuccess = false;
                    object.data = "";
                }
                if (message.isSuccess != null && message.hasOwnProperty("isSuccess"))
                    object.isSuccess = message.isSuccess;
                if (message.data != null && message.hasOwnProperty("data"))
                    object.data = message.data;
                return object;
            };

            /**
             * Converts this ShellResponse to JSON.
             * @function toJSON
             * @memberof kritor.developer.ShellResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ShellResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for ShellResponse
             * @function getTypeUrl
             * @memberof kritor.developer.ShellResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            ShellResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.developer.ShellResponse";
            };

            return ShellResponse;
        })();

        developer.GetLogRequest = (function() {

            /**
             * Properties of a GetLogRequest.
             * @memberof kritor.developer
             * @interface IGetLogRequest
             * @property {number|Long|null} [start] GetLogRequest start
             * @property {boolean|null} [recent] GetLogRequest recent
             */

            /**
             * Constructs a new GetLogRequest.
             * @memberof kritor.developer
             * @classdesc Represents a GetLogRequest.
             * @implements IGetLogRequest
             * @constructor
             * @param {kritor.developer.IGetLogRequest=} [properties] Properties to set
             */
            function GetLogRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetLogRequest start.
             * @member {number|Long} start
             * @memberof kritor.developer.GetLogRequest
             * @instance
             */
            GetLogRequest.prototype.start = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * GetLogRequest recent.
             * @member {boolean} recent
             * @memberof kritor.developer.GetLogRequest
             * @instance
             */
            GetLogRequest.prototype.recent = false;

            /**
             * Creates a new GetLogRequest instance using the specified properties.
             * @function create
             * @memberof kritor.developer.GetLogRequest
             * @static
             * @param {kritor.developer.IGetLogRequest=} [properties] Properties to set
             * @returns {kritor.developer.GetLogRequest} GetLogRequest instance
             */
            GetLogRequest.create = function create(properties) {
                return new GetLogRequest(properties);
            };

            /**
             * Encodes the specified GetLogRequest message. Does not implicitly {@link kritor.developer.GetLogRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.developer.GetLogRequest
             * @static
             * @param {kritor.developer.IGetLogRequest} message GetLogRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetLogRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.start != null && Object.hasOwnProperty.call(message, "start"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.start);
                if (message.recent != null && Object.hasOwnProperty.call(message, "recent"))
                    writer.uint32(/* id 2, wireType 0 =*/16).bool(message.recent);
                return writer;
            };

            /**
             * Encodes the specified GetLogRequest message, length delimited. Does not implicitly {@link kritor.developer.GetLogRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.developer.GetLogRequest
             * @static
             * @param {kritor.developer.IGetLogRequest} message GetLogRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetLogRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetLogRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.developer.GetLogRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.developer.GetLogRequest} GetLogRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetLogRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.developer.GetLogRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.start = reader.uint64();
                            break;
                        }
                    case 2: {
                            message.recent = reader.bool();
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
             * Decodes a GetLogRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.developer.GetLogRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.developer.GetLogRequest} GetLogRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetLogRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetLogRequest message.
             * @function verify
             * @memberof kritor.developer.GetLogRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetLogRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.start != null && message.hasOwnProperty("start"))
                    if (!$util.isInteger(message.start) && !(message.start && $util.isInteger(message.start.low) && $util.isInteger(message.start.high)))
                        return "start: integer|Long expected";
                if (message.recent != null && message.hasOwnProperty("recent"))
                    if (typeof message.recent !== "boolean")
                        return "recent: boolean expected";
                return null;
            };

            /**
             * Creates a GetLogRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.developer.GetLogRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.developer.GetLogRequest} GetLogRequest
             */
            GetLogRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.developer.GetLogRequest)
                    return object;
                let message = new $root.kritor.developer.GetLogRequest();
                if (object.start != null)
                    if ($util.Long)
                        (message.start = $util.Long.fromValue(object.start)).unsigned = true;
                    else if (typeof object.start === "string")
                        message.start = parseInt(object.start, 10);
                    else if (typeof object.start === "number")
                        message.start = object.start;
                    else if (typeof object.start === "object")
                        message.start = new $util.LongBits(object.start.low >>> 0, object.start.high >>> 0).toNumber(true);
                if (object.recent != null)
                    message.recent = Boolean(object.recent);
                return message;
            };

            /**
             * Creates a plain object from a GetLogRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.developer.GetLogRequest
             * @static
             * @param {kritor.developer.GetLogRequest} message GetLogRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetLogRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.start = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.start = options.longs === String ? "0" : 0;
                    object.recent = false;
                }
                if (message.start != null && message.hasOwnProperty("start"))
                    if (typeof message.start === "number")
                        object.start = options.longs === String ? String(message.start) : message.start;
                    else
                        object.start = options.longs === String ? $util.Long.prototype.toString.call(message.start) : options.longs === Number ? new $util.LongBits(message.start.low >>> 0, message.start.high >>> 0).toNumber(true) : message.start;
                if (message.recent != null && message.hasOwnProperty("recent"))
                    object.recent = message.recent;
                return object;
            };

            /**
             * Converts this GetLogRequest to JSON.
             * @function toJSON
             * @memberof kritor.developer.GetLogRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetLogRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GetLogRequest
             * @function getTypeUrl
             * @memberof kritor.developer.GetLogRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetLogRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.developer.GetLogRequest";
            };

            return GetLogRequest;
        })();

        developer.GetLogResponse = (function() {

            /**
             * Properties of a GetLogResponse.
             * @memberof kritor.developer
             * @interface IGetLogResponse
             * @property {boolean|null} [isSuccess] GetLogResponse isSuccess
             * @property {string|null} [log] GetLogResponse log
             */

            /**
             * Constructs a new GetLogResponse.
             * @memberof kritor.developer
             * @classdesc Represents a GetLogResponse.
             * @implements IGetLogResponse
             * @constructor
             * @param {kritor.developer.IGetLogResponse=} [properties] Properties to set
             */
            function GetLogResponse(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetLogResponse isSuccess.
             * @member {boolean} isSuccess
             * @memberof kritor.developer.GetLogResponse
             * @instance
             */
            GetLogResponse.prototype.isSuccess = false;

            /**
             * GetLogResponse log.
             * @member {string} log
             * @memberof kritor.developer.GetLogResponse
             * @instance
             */
            GetLogResponse.prototype.log = "";

            /**
             * Creates a new GetLogResponse instance using the specified properties.
             * @function create
             * @memberof kritor.developer.GetLogResponse
             * @static
             * @param {kritor.developer.IGetLogResponse=} [properties] Properties to set
             * @returns {kritor.developer.GetLogResponse} GetLogResponse instance
             */
            GetLogResponse.create = function create(properties) {
                return new GetLogResponse(properties);
            };

            /**
             * Encodes the specified GetLogResponse message. Does not implicitly {@link kritor.developer.GetLogResponse.verify|verify} messages.
             * @function encode
             * @memberof kritor.developer.GetLogResponse
             * @static
             * @param {kritor.developer.IGetLogResponse} message GetLogResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetLogResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.isSuccess != null && Object.hasOwnProperty.call(message, "isSuccess"))
                    writer.uint32(/* id 1, wireType 0 =*/8).bool(message.isSuccess);
                if (message.log != null && Object.hasOwnProperty.call(message, "log"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.log);
                return writer;
            };

            /**
             * Encodes the specified GetLogResponse message, length delimited. Does not implicitly {@link kritor.developer.GetLogResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.developer.GetLogResponse
             * @static
             * @param {kritor.developer.IGetLogResponse} message GetLogResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetLogResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetLogResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.developer.GetLogResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.developer.GetLogResponse} GetLogResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetLogResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.developer.GetLogResponse();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.isSuccess = reader.bool();
                            break;
                        }
                    case 2: {
                            message.log = reader.string();
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
             * Decodes a GetLogResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.developer.GetLogResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.developer.GetLogResponse} GetLogResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetLogResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetLogResponse message.
             * @function verify
             * @memberof kritor.developer.GetLogResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetLogResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.isSuccess != null && message.hasOwnProperty("isSuccess"))
                    if (typeof message.isSuccess !== "boolean")
                        return "isSuccess: boolean expected";
                if (message.log != null && message.hasOwnProperty("log"))
                    if (!$util.isString(message.log))
                        return "log: string expected";
                return null;
            };

            /**
             * Creates a GetLogResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.developer.GetLogResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.developer.GetLogResponse} GetLogResponse
             */
            GetLogResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.developer.GetLogResponse)
                    return object;
                let message = new $root.kritor.developer.GetLogResponse();
                if (object.isSuccess != null)
                    message.isSuccess = Boolean(object.isSuccess);
                if (object.log != null)
                    message.log = String(object.log);
                return message;
            };

            /**
             * Creates a plain object from a GetLogResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.developer.GetLogResponse
             * @static
             * @param {kritor.developer.GetLogResponse} message GetLogResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetLogResponse.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.isSuccess = false;
                    object.log = "";
                }
                if (message.isSuccess != null && message.hasOwnProperty("isSuccess"))
                    object.isSuccess = message.isSuccess;
                if (message.log != null && message.hasOwnProperty("log"))
                    object.log = message.log;
                return object;
            };

            /**
             * Converts this GetLogResponse to JSON.
             * @function toJSON
             * @memberof kritor.developer.GetLogResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetLogResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GetLogResponse
             * @function getTypeUrl
             * @memberof kritor.developer.GetLogResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetLogResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.developer.GetLogResponse";
            };

            return GetLogResponse;
        })();

        developer.ClearCacheRequest = (function() {

            /**
             * Properties of a ClearCacheRequest.
             * @memberof kritor.developer
             * @interface IClearCacheRequest
             */

            /**
             * Constructs a new ClearCacheRequest.
             * @memberof kritor.developer
             * @classdesc Represents a ClearCacheRequest.
             * @implements IClearCacheRequest
             * @constructor
             * @param {kritor.developer.IClearCacheRequest=} [properties] Properties to set
             */
            function ClearCacheRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Creates a new ClearCacheRequest instance using the specified properties.
             * @function create
             * @memberof kritor.developer.ClearCacheRequest
             * @static
             * @param {kritor.developer.IClearCacheRequest=} [properties] Properties to set
             * @returns {kritor.developer.ClearCacheRequest} ClearCacheRequest instance
             */
            ClearCacheRequest.create = function create(properties) {
                return new ClearCacheRequest(properties);
            };

            /**
             * Encodes the specified ClearCacheRequest message. Does not implicitly {@link kritor.developer.ClearCacheRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.developer.ClearCacheRequest
             * @static
             * @param {kritor.developer.IClearCacheRequest} message ClearCacheRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ClearCacheRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                return writer;
            };

            /**
             * Encodes the specified ClearCacheRequest message, length delimited. Does not implicitly {@link kritor.developer.ClearCacheRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.developer.ClearCacheRequest
             * @static
             * @param {kritor.developer.IClearCacheRequest} message ClearCacheRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ClearCacheRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a ClearCacheRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.developer.ClearCacheRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.developer.ClearCacheRequest} ClearCacheRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ClearCacheRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.developer.ClearCacheRequest();
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
             * Decodes a ClearCacheRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.developer.ClearCacheRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.developer.ClearCacheRequest} ClearCacheRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ClearCacheRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a ClearCacheRequest message.
             * @function verify
             * @memberof kritor.developer.ClearCacheRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ClearCacheRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                return null;
            };

            /**
             * Creates a ClearCacheRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.developer.ClearCacheRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.developer.ClearCacheRequest} ClearCacheRequest
             */
            ClearCacheRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.developer.ClearCacheRequest)
                    return object;
                return new $root.kritor.developer.ClearCacheRequest();
            };

            /**
             * Creates a plain object from a ClearCacheRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.developer.ClearCacheRequest
             * @static
             * @param {kritor.developer.ClearCacheRequest} message ClearCacheRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ClearCacheRequest.toObject = function toObject() {
                return {};
            };

            /**
             * Converts this ClearCacheRequest to JSON.
             * @function toJSON
             * @memberof kritor.developer.ClearCacheRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ClearCacheRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for ClearCacheRequest
             * @function getTypeUrl
             * @memberof kritor.developer.ClearCacheRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            ClearCacheRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.developer.ClearCacheRequest";
            };

            return ClearCacheRequest;
        })();

        developer.ClearCacheResponse = (function() {

            /**
             * Properties of a ClearCacheResponse.
             * @memberof kritor.developer
             * @interface IClearCacheResponse
             */

            /**
             * Constructs a new ClearCacheResponse.
             * @memberof kritor.developer
             * @classdesc Represents a ClearCacheResponse.
             * @implements IClearCacheResponse
             * @constructor
             * @param {kritor.developer.IClearCacheResponse=} [properties] Properties to set
             */
            function ClearCacheResponse(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Creates a new ClearCacheResponse instance using the specified properties.
             * @function create
             * @memberof kritor.developer.ClearCacheResponse
             * @static
             * @param {kritor.developer.IClearCacheResponse=} [properties] Properties to set
             * @returns {kritor.developer.ClearCacheResponse} ClearCacheResponse instance
             */
            ClearCacheResponse.create = function create(properties) {
                return new ClearCacheResponse(properties);
            };

            /**
             * Encodes the specified ClearCacheResponse message. Does not implicitly {@link kritor.developer.ClearCacheResponse.verify|verify} messages.
             * @function encode
             * @memberof kritor.developer.ClearCacheResponse
             * @static
             * @param {kritor.developer.IClearCacheResponse} message ClearCacheResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ClearCacheResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                return writer;
            };

            /**
             * Encodes the specified ClearCacheResponse message, length delimited. Does not implicitly {@link kritor.developer.ClearCacheResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.developer.ClearCacheResponse
             * @static
             * @param {kritor.developer.IClearCacheResponse} message ClearCacheResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ClearCacheResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a ClearCacheResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.developer.ClearCacheResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.developer.ClearCacheResponse} ClearCacheResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ClearCacheResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.developer.ClearCacheResponse();
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
             * Decodes a ClearCacheResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.developer.ClearCacheResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.developer.ClearCacheResponse} ClearCacheResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ClearCacheResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a ClearCacheResponse message.
             * @function verify
             * @memberof kritor.developer.ClearCacheResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ClearCacheResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                return null;
            };

            /**
             * Creates a ClearCacheResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.developer.ClearCacheResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.developer.ClearCacheResponse} ClearCacheResponse
             */
            ClearCacheResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.developer.ClearCacheResponse)
                    return object;
                return new $root.kritor.developer.ClearCacheResponse();
            };

            /**
             * Creates a plain object from a ClearCacheResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.developer.ClearCacheResponse
             * @static
             * @param {kritor.developer.ClearCacheResponse} message ClearCacheResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ClearCacheResponse.toObject = function toObject() {
                return {};
            };

            /**
             * Converts this ClearCacheResponse to JSON.
             * @function toJSON
             * @memberof kritor.developer.ClearCacheResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ClearCacheResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for ClearCacheResponse
             * @function getTypeUrl
             * @memberof kritor.developer.ClearCacheResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            ClearCacheResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.developer.ClearCacheResponse";
            };

            return ClearCacheResponse;
        })();

        developer.GetDeviceBatteryRequest = (function() {

            /**
             * Properties of a GetDeviceBatteryRequest.
             * @memberof kritor.developer
             * @interface IGetDeviceBatteryRequest
             */

            /**
             * Constructs a new GetDeviceBatteryRequest.
             * @memberof kritor.developer
             * @classdesc Represents a GetDeviceBatteryRequest.
             * @implements IGetDeviceBatteryRequest
             * @constructor
             * @param {kritor.developer.IGetDeviceBatteryRequest=} [properties] Properties to set
             */
            function GetDeviceBatteryRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Creates a new GetDeviceBatteryRequest instance using the specified properties.
             * @function create
             * @memberof kritor.developer.GetDeviceBatteryRequest
             * @static
             * @param {kritor.developer.IGetDeviceBatteryRequest=} [properties] Properties to set
             * @returns {kritor.developer.GetDeviceBatteryRequest} GetDeviceBatteryRequest instance
             */
            GetDeviceBatteryRequest.create = function create(properties) {
                return new GetDeviceBatteryRequest(properties);
            };

            /**
             * Encodes the specified GetDeviceBatteryRequest message. Does not implicitly {@link kritor.developer.GetDeviceBatteryRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.developer.GetDeviceBatteryRequest
             * @static
             * @param {kritor.developer.IGetDeviceBatteryRequest} message GetDeviceBatteryRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetDeviceBatteryRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                return writer;
            };

            /**
             * Encodes the specified GetDeviceBatteryRequest message, length delimited. Does not implicitly {@link kritor.developer.GetDeviceBatteryRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.developer.GetDeviceBatteryRequest
             * @static
             * @param {kritor.developer.IGetDeviceBatteryRequest} message GetDeviceBatteryRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetDeviceBatteryRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetDeviceBatteryRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.developer.GetDeviceBatteryRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.developer.GetDeviceBatteryRequest} GetDeviceBatteryRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetDeviceBatteryRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.developer.GetDeviceBatteryRequest();
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
             * Decodes a GetDeviceBatteryRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.developer.GetDeviceBatteryRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.developer.GetDeviceBatteryRequest} GetDeviceBatteryRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetDeviceBatteryRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetDeviceBatteryRequest message.
             * @function verify
             * @memberof kritor.developer.GetDeviceBatteryRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetDeviceBatteryRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                return null;
            };

            /**
             * Creates a GetDeviceBatteryRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.developer.GetDeviceBatteryRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.developer.GetDeviceBatteryRequest} GetDeviceBatteryRequest
             */
            GetDeviceBatteryRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.developer.GetDeviceBatteryRequest)
                    return object;
                return new $root.kritor.developer.GetDeviceBatteryRequest();
            };

            /**
             * Creates a plain object from a GetDeviceBatteryRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.developer.GetDeviceBatteryRequest
             * @static
             * @param {kritor.developer.GetDeviceBatteryRequest} message GetDeviceBatteryRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetDeviceBatteryRequest.toObject = function toObject() {
                return {};
            };

            /**
             * Converts this GetDeviceBatteryRequest to JSON.
             * @function toJSON
             * @memberof kritor.developer.GetDeviceBatteryRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetDeviceBatteryRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GetDeviceBatteryRequest
             * @function getTypeUrl
             * @memberof kritor.developer.GetDeviceBatteryRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetDeviceBatteryRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.developer.GetDeviceBatteryRequest";
            };

            return GetDeviceBatteryRequest;
        })();

        developer.GetDeviceBatteryResponse = (function() {

            /**
             * Properties of a GetDeviceBatteryResponse.
             * @memberof kritor.developer
             * @interface IGetDeviceBatteryResponse
             * @property {number|null} [battery] GetDeviceBatteryResponse battery
             * @property {number|null} [scale] GetDeviceBatteryResponse scale
             * @property {number|null} [status] GetDeviceBatteryResponse status
             */

            /**
             * Constructs a new GetDeviceBatteryResponse.
             * @memberof kritor.developer
             * @classdesc Represents a GetDeviceBatteryResponse.
             * @implements IGetDeviceBatteryResponse
             * @constructor
             * @param {kritor.developer.IGetDeviceBatteryResponse=} [properties] Properties to set
             */
            function GetDeviceBatteryResponse(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetDeviceBatteryResponse battery.
             * @member {number} battery
             * @memberof kritor.developer.GetDeviceBatteryResponse
             * @instance
             */
            GetDeviceBatteryResponse.prototype.battery = 0;

            /**
             * GetDeviceBatteryResponse scale.
             * @member {number} scale
             * @memberof kritor.developer.GetDeviceBatteryResponse
             * @instance
             */
            GetDeviceBatteryResponse.prototype.scale = 0;

            /**
             * GetDeviceBatteryResponse status.
             * @member {number} status
             * @memberof kritor.developer.GetDeviceBatteryResponse
             * @instance
             */
            GetDeviceBatteryResponse.prototype.status = 0;

            /**
             * Creates a new GetDeviceBatteryResponse instance using the specified properties.
             * @function create
             * @memberof kritor.developer.GetDeviceBatteryResponse
             * @static
             * @param {kritor.developer.IGetDeviceBatteryResponse=} [properties] Properties to set
             * @returns {kritor.developer.GetDeviceBatteryResponse} GetDeviceBatteryResponse instance
             */
            GetDeviceBatteryResponse.create = function create(properties) {
                return new GetDeviceBatteryResponse(properties);
            };

            /**
             * Encodes the specified GetDeviceBatteryResponse message. Does not implicitly {@link kritor.developer.GetDeviceBatteryResponse.verify|verify} messages.
             * @function encode
             * @memberof kritor.developer.GetDeviceBatteryResponse
             * @static
             * @param {kritor.developer.IGetDeviceBatteryResponse} message GetDeviceBatteryResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetDeviceBatteryResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.battery != null && Object.hasOwnProperty.call(message, "battery"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.battery);
                if (message.scale != null && Object.hasOwnProperty.call(message, "scale"))
                    writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.scale);
                if (message.status != null && Object.hasOwnProperty.call(message, "status"))
                    writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.status);
                return writer;
            };

            /**
             * Encodes the specified GetDeviceBatteryResponse message, length delimited. Does not implicitly {@link kritor.developer.GetDeviceBatteryResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.developer.GetDeviceBatteryResponse
             * @static
             * @param {kritor.developer.IGetDeviceBatteryResponse} message GetDeviceBatteryResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetDeviceBatteryResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetDeviceBatteryResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.developer.GetDeviceBatteryResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.developer.GetDeviceBatteryResponse} GetDeviceBatteryResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetDeviceBatteryResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.developer.GetDeviceBatteryResponse();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.battery = reader.uint32();
                            break;
                        }
                    case 2: {
                            message.scale = reader.uint32();
                            break;
                        }
                    case 3: {
                            message.status = reader.uint32();
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
             * Decodes a GetDeviceBatteryResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.developer.GetDeviceBatteryResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.developer.GetDeviceBatteryResponse} GetDeviceBatteryResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetDeviceBatteryResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetDeviceBatteryResponse message.
             * @function verify
             * @memberof kritor.developer.GetDeviceBatteryResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetDeviceBatteryResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.battery != null && message.hasOwnProperty("battery"))
                    if (!$util.isInteger(message.battery))
                        return "battery: integer expected";
                if (message.scale != null && message.hasOwnProperty("scale"))
                    if (!$util.isInteger(message.scale))
                        return "scale: integer expected";
                if (message.status != null && message.hasOwnProperty("status"))
                    if (!$util.isInteger(message.status))
                        return "status: integer expected";
                return null;
            };

            /**
             * Creates a GetDeviceBatteryResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.developer.GetDeviceBatteryResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.developer.GetDeviceBatteryResponse} GetDeviceBatteryResponse
             */
            GetDeviceBatteryResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.developer.GetDeviceBatteryResponse)
                    return object;
                let message = new $root.kritor.developer.GetDeviceBatteryResponse();
                if (object.battery != null)
                    message.battery = object.battery >>> 0;
                if (object.scale != null)
                    message.scale = object.scale >>> 0;
                if (object.status != null)
                    message.status = object.status >>> 0;
                return message;
            };

            /**
             * Creates a plain object from a GetDeviceBatteryResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.developer.GetDeviceBatteryResponse
             * @static
             * @param {kritor.developer.GetDeviceBatteryResponse} message GetDeviceBatteryResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetDeviceBatteryResponse.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.battery = 0;
                    object.scale = 0;
                    object.status = 0;
                }
                if (message.battery != null && message.hasOwnProperty("battery"))
                    object.battery = message.battery;
                if (message.scale != null && message.hasOwnProperty("scale"))
                    object.scale = message.scale;
                if (message.status != null && message.hasOwnProperty("status"))
                    object.status = message.status;
                return object;
            };

            /**
             * Converts this GetDeviceBatteryResponse to JSON.
             * @function toJSON
             * @memberof kritor.developer.GetDeviceBatteryResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetDeviceBatteryResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GetDeviceBatteryResponse
             * @function getTypeUrl
             * @memberof kritor.developer.GetDeviceBatteryResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetDeviceBatteryResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.developer.GetDeviceBatteryResponse";
            };

            return GetDeviceBatteryResponse;
        })();

        developer.UploadImageRequest = (function() {

            /**
             * Properties of an UploadImageRequest.
             * @memberof kritor.developer
             * @interface IUploadImageRequest
             * @property {Uint8Array|null} [file] UploadImageRequest file
             * @property {string|null} [fileName] UploadImageRequest fileName
             * @property {string|null} [filePath] UploadImageRequest filePath
             * @property {string|null} [fileUrl] UploadImageRequest fileUrl
             * @property {number|Long|null} [groupId] UploadImageRequest groupId
             */

            /**
             * Constructs a new UploadImageRequest.
             * @memberof kritor.developer
             * @classdesc Represents an UploadImageRequest.
             * @implements IUploadImageRequest
             * @constructor
             * @param {kritor.developer.IUploadImageRequest=} [properties] Properties to set
             */
            function UploadImageRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * UploadImageRequest file.
             * @member {Uint8Array|null|undefined} file
             * @memberof kritor.developer.UploadImageRequest
             * @instance
             */
            UploadImageRequest.prototype.file = null;

            /**
             * UploadImageRequest fileName.
             * @member {string|null|undefined} fileName
             * @memberof kritor.developer.UploadImageRequest
             * @instance
             */
            UploadImageRequest.prototype.fileName = null;

            /**
             * UploadImageRequest filePath.
             * @member {string|null|undefined} filePath
             * @memberof kritor.developer.UploadImageRequest
             * @instance
             */
            UploadImageRequest.prototype.filePath = null;

            /**
             * UploadImageRequest fileUrl.
             * @member {string|null|undefined} fileUrl
             * @memberof kritor.developer.UploadImageRequest
             * @instance
             */
            UploadImageRequest.prototype.fileUrl = null;

            /**
             * UploadImageRequest groupId.
             * @member {number|Long} groupId
             * @memberof kritor.developer.UploadImageRequest
             * @instance
             */
            UploadImageRequest.prototype.groupId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            // OneOf field names bound to virtual getters and setters
            let $oneOfFields;

            /**
             * UploadImageRequest data.
             * @member {"file"|"fileName"|"filePath"|"fileUrl"|undefined} data
             * @memberof kritor.developer.UploadImageRequest
             * @instance
             */
            Object.defineProperty(UploadImageRequest.prototype, "data", {
                get: $util.oneOfGetter($oneOfFields = ["file", "fileName", "filePath", "fileUrl"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new UploadImageRequest instance using the specified properties.
             * @function create
             * @memberof kritor.developer.UploadImageRequest
             * @static
             * @param {kritor.developer.IUploadImageRequest=} [properties] Properties to set
             * @returns {kritor.developer.UploadImageRequest} UploadImageRequest instance
             */
            UploadImageRequest.create = function create(properties) {
                return new UploadImageRequest(properties);
            };

            /**
             * Encodes the specified UploadImageRequest message. Does not implicitly {@link kritor.developer.UploadImageRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.developer.UploadImageRequest
             * @static
             * @param {kritor.developer.IUploadImageRequest} message UploadImageRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            UploadImageRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.file != null && Object.hasOwnProperty.call(message, "file"))
                    writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.file);
                if (message.fileName != null && Object.hasOwnProperty.call(message, "fileName"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.fileName);
                if (message.filePath != null && Object.hasOwnProperty.call(message, "filePath"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.filePath);
                if (message.fileUrl != null && Object.hasOwnProperty.call(message, "fileUrl"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.fileUrl);
                if (message.groupId != null && Object.hasOwnProperty.call(message, "groupId"))
                    writer.uint32(/* id 5, wireType 0 =*/40).uint64(message.groupId);
                return writer;
            };

            /**
             * Encodes the specified UploadImageRequest message, length delimited. Does not implicitly {@link kritor.developer.UploadImageRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.developer.UploadImageRequest
             * @static
             * @param {kritor.developer.IUploadImageRequest} message UploadImageRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            UploadImageRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an UploadImageRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.developer.UploadImageRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.developer.UploadImageRequest} UploadImageRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            UploadImageRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.developer.UploadImageRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.file = reader.bytes();
                            break;
                        }
                    case 2: {
                            message.fileName = reader.string();
                            break;
                        }
                    case 3: {
                            message.filePath = reader.string();
                            break;
                        }
                    case 4: {
                            message.fileUrl = reader.string();
                            break;
                        }
                    case 5: {
                            message.groupId = reader.uint64();
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
             * Decodes an UploadImageRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.developer.UploadImageRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.developer.UploadImageRequest} UploadImageRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            UploadImageRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an UploadImageRequest message.
             * @function verify
             * @memberof kritor.developer.UploadImageRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            UploadImageRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                let properties = {};
                if (message.file != null && message.hasOwnProperty("file")) {
                    properties.data = 1;
                    if (!(message.file && typeof message.file.length === "number" || $util.isString(message.file)))
                        return "file: buffer expected";
                }
                if (message.fileName != null && message.hasOwnProperty("fileName")) {
                    if (properties.data === 1)
                        return "data: multiple values";
                    properties.data = 1;
                    if (!$util.isString(message.fileName))
                        return "fileName: string expected";
                }
                if (message.filePath != null && message.hasOwnProperty("filePath")) {
                    if (properties.data === 1)
                        return "data: multiple values";
                    properties.data = 1;
                    if (!$util.isString(message.filePath))
                        return "filePath: string expected";
                }
                if (message.fileUrl != null && message.hasOwnProperty("fileUrl")) {
                    if (properties.data === 1)
                        return "data: multiple values";
                    properties.data = 1;
                    if (!$util.isString(message.fileUrl))
                        return "fileUrl: string expected";
                }
                if (message.groupId != null && message.hasOwnProperty("groupId"))
                    if (!$util.isInteger(message.groupId) && !(message.groupId && $util.isInteger(message.groupId.low) && $util.isInteger(message.groupId.high)))
                        return "groupId: integer|Long expected";
                return null;
            };

            /**
             * Creates an UploadImageRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.developer.UploadImageRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.developer.UploadImageRequest} UploadImageRequest
             */
            UploadImageRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.developer.UploadImageRequest)
                    return object;
                let message = new $root.kritor.developer.UploadImageRequest();
                if (object.file != null)
                    if (typeof object.file === "string")
                        $util.base64.decode(object.file, message.file = $util.newBuffer($util.base64.length(object.file)), 0);
                    else if (object.file.length >= 0)
                        message.file = object.file;
                if (object.fileName != null)
                    message.fileName = String(object.fileName);
                if (object.filePath != null)
                    message.filePath = String(object.filePath);
                if (object.fileUrl != null)
                    message.fileUrl = String(object.fileUrl);
                if (object.groupId != null)
                    if ($util.Long)
                        (message.groupId = $util.Long.fromValue(object.groupId)).unsigned = true;
                    else if (typeof object.groupId === "string")
                        message.groupId = parseInt(object.groupId, 10);
                    else if (typeof object.groupId === "number")
                        message.groupId = object.groupId;
                    else if (typeof object.groupId === "object")
                        message.groupId = new $util.LongBits(object.groupId.low >>> 0, object.groupId.high >>> 0).toNumber(true);
                return message;
            };

            /**
             * Creates a plain object from an UploadImageRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.developer.UploadImageRequest
             * @static
             * @param {kritor.developer.UploadImageRequest} message UploadImageRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            UploadImageRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults)
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.groupId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.groupId = options.longs === String ? "0" : 0;
                if (message.file != null && message.hasOwnProperty("file")) {
                    object.file = options.bytes === String ? $util.base64.encode(message.file, 0, message.file.length) : options.bytes === Array ? Array.prototype.slice.call(message.file) : message.file;
                    if (options.oneofs)
                        object.data = "file";
                }
                if (message.fileName != null && message.hasOwnProperty("fileName")) {
                    object.fileName = message.fileName;
                    if (options.oneofs)
                        object.data = "fileName";
                }
                if (message.filePath != null && message.hasOwnProperty("filePath")) {
                    object.filePath = message.filePath;
                    if (options.oneofs)
                        object.data = "filePath";
                }
                if (message.fileUrl != null && message.hasOwnProperty("fileUrl")) {
                    object.fileUrl = message.fileUrl;
                    if (options.oneofs)
                        object.data = "fileUrl";
                }
                if (message.groupId != null && message.hasOwnProperty("groupId"))
                    if (typeof message.groupId === "number")
                        object.groupId = options.longs === String ? String(message.groupId) : message.groupId;
                    else
                        object.groupId = options.longs === String ? $util.Long.prototype.toString.call(message.groupId) : options.longs === Number ? new $util.LongBits(message.groupId.low >>> 0, message.groupId.high >>> 0).toNumber(true) : message.groupId;
                return object;
            };

            /**
             * Converts this UploadImageRequest to JSON.
             * @function toJSON
             * @memberof kritor.developer.UploadImageRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            UploadImageRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for UploadImageRequest
             * @function getTypeUrl
             * @memberof kritor.developer.UploadImageRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            UploadImageRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.developer.UploadImageRequest";
            };

            return UploadImageRequest;
        })();

        developer.UploadImageResponse = (function() {

            /**
             * Properties of an UploadImageResponse.
             * @memberof kritor.developer
             * @interface IUploadImageResponse
             * @property {boolean|null} [isSuccess] UploadImageResponse isSuccess
             * @property {string|null} [imageUrl] UploadImageResponse imageUrl
             */

            /**
             * Constructs a new UploadImageResponse.
             * @memberof kritor.developer
             * @classdesc Represents an UploadImageResponse.
             * @implements IUploadImageResponse
             * @constructor
             * @param {kritor.developer.IUploadImageResponse=} [properties] Properties to set
             */
            function UploadImageResponse(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * UploadImageResponse isSuccess.
             * @member {boolean} isSuccess
             * @memberof kritor.developer.UploadImageResponse
             * @instance
             */
            UploadImageResponse.prototype.isSuccess = false;

            /**
             * UploadImageResponse imageUrl.
             * @member {string} imageUrl
             * @memberof kritor.developer.UploadImageResponse
             * @instance
             */
            UploadImageResponse.prototype.imageUrl = "";

            /**
             * Creates a new UploadImageResponse instance using the specified properties.
             * @function create
             * @memberof kritor.developer.UploadImageResponse
             * @static
             * @param {kritor.developer.IUploadImageResponse=} [properties] Properties to set
             * @returns {kritor.developer.UploadImageResponse} UploadImageResponse instance
             */
            UploadImageResponse.create = function create(properties) {
                return new UploadImageResponse(properties);
            };

            /**
             * Encodes the specified UploadImageResponse message. Does not implicitly {@link kritor.developer.UploadImageResponse.verify|verify} messages.
             * @function encode
             * @memberof kritor.developer.UploadImageResponse
             * @static
             * @param {kritor.developer.IUploadImageResponse} message UploadImageResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            UploadImageResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.isSuccess != null && Object.hasOwnProperty.call(message, "isSuccess"))
                    writer.uint32(/* id 1, wireType 0 =*/8).bool(message.isSuccess);
                if (message.imageUrl != null && Object.hasOwnProperty.call(message, "imageUrl"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.imageUrl);
                return writer;
            };

            /**
             * Encodes the specified UploadImageResponse message, length delimited. Does not implicitly {@link kritor.developer.UploadImageResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.developer.UploadImageResponse
             * @static
             * @param {kritor.developer.IUploadImageResponse} message UploadImageResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            UploadImageResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an UploadImageResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.developer.UploadImageResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.developer.UploadImageResponse} UploadImageResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            UploadImageResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.developer.UploadImageResponse();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.isSuccess = reader.bool();
                            break;
                        }
                    case 2: {
                            message.imageUrl = reader.string();
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
             * Decodes an UploadImageResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.developer.UploadImageResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.developer.UploadImageResponse} UploadImageResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            UploadImageResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an UploadImageResponse message.
             * @function verify
             * @memberof kritor.developer.UploadImageResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            UploadImageResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.isSuccess != null && message.hasOwnProperty("isSuccess"))
                    if (typeof message.isSuccess !== "boolean")
                        return "isSuccess: boolean expected";
                if (message.imageUrl != null && message.hasOwnProperty("imageUrl"))
                    if (!$util.isString(message.imageUrl))
                        return "imageUrl: string expected";
                return null;
            };

            /**
             * Creates an UploadImageResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.developer.UploadImageResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.developer.UploadImageResponse} UploadImageResponse
             */
            UploadImageResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.developer.UploadImageResponse)
                    return object;
                let message = new $root.kritor.developer.UploadImageResponse();
                if (object.isSuccess != null)
                    message.isSuccess = Boolean(object.isSuccess);
                if (object.imageUrl != null)
                    message.imageUrl = String(object.imageUrl);
                return message;
            };

            /**
             * Creates a plain object from an UploadImageResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.developer.UploadImageResponse
             * @static
             * @param {kritor.developer.UploadImageResponse} message UploadImageResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            UploadImageResponse.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.isSuccess = false;
                    object.imageUrl = "";
                }
                if (message.isSuccess != null && message.hasOwnProperty("isSuccess"))
                    object.isSuccess = message.isSuccess;
                if (message.imageUrl != null && message.hasOwnProperty("imageUrl"))
                    object.imageUrl = message.imageUrl;
                return object;
            };

            /**
             * Converts this UploadImageResponse to JSON.
             * @function toJSON
             * @memberof kritor.developer.UploadImageResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            UploadImageResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for UploadImageResponse
             * @function getTypeUrl
             * @memberof kritor.developer.UploadImageResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            UploadImageResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.developer.UploadImageResponse";
            };

            return UploadImageResponse;
        })();

        developer.SendPacketRequest = (function() {

            /**
             * Properties of a SendPacketRequest.
             * @memberof kritor.developer
             * @interface ISendPacketRequest
             * @property {string|null} [command] SendPacketRequest command
             * @property {Uint8Array|null} [requestBuffer] SendPacketRequest requestBuffer
             * @property {boolean|null} [isProtobuf] SendPacketRequest isProtobuf
             * @property {Object.<string,string>|null} [attrs] SendPacketRequest attrs
             */

            /**
             * Constructs a new SendPacketRequest.
             * @memberof kritor.developer
             * @classdesc Represents a SendPacketRequest.
             * @implements ISendPacketRequest
             * @constructor
             * @param {kritor.developer.ISendPacketRequest=} [properties] Properties to set
             */
            function SendPacketRequest(properties) {
                this.attrs = {};
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * SendPacketRequest command.
             * @member {string} command
             * @memberof kritor.developer.SendPacketRequest
             * @instance
             */
            SendPacketRequest.prototype.command = "";

            /**
             * SendPacketRequest requestBuffer.
             * @member {Uint8Array} requestBuffer
             * @memberof kritor.developer.SendPacketRequest
             * @instance
             */
            SendPacketRequest.prototype.requestBuffer = $util.newBuffer([]);

            /**
             * SendPacketRequest isProtobuf.
             * @member {boolean} isProtobuf
             * @memberof kritor.developer.SendPacketRequest
             * @instance
             */
            SendPacketRequest.prototype.isProtobuf = false;

            /**
             * SendPacketRequest attrs.
             * @member {Object.<string,string>} attrs
             * @memberof kritor.developer.SendPacketRequest
             * @instance
             */
            SendPacketRequest.prototype.attrs = $util.emptyObject;

            /**
             * Creates a new SendPacketRequest instance using the specified properties.
             * @function create
             * @memberof kritor.developer.SendPacketRequest
             * @static
             * @param {kritor.developer.ISendPacketRequest=} [properties] Properties to set
             * @returns {kritor.developer.SendPacketRequest} SendPacketRequest instance
             */
            SendPacketRequest.create = function create(properties) {
                return new SendPacketRequest(properties);
            };

            /**
             * Encodes the specified SendPacketRequest message. Does not implicitly {@link kritor.developer.SendPacketRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.developer.SendPacketRequest
             * @static
             * @param {kritor.developer.ISendPacketRequest} message SendPacketRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SendPacketRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.command != null && Object.hasOwnProperty.call(message, "command"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.command);
                if (message.requestBuffer != null && Object.hasOwnProperty.call(message, "requestBuffer"))
                    writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.requestBuffer);
                if (message.isProtobuf != null && Object.hasOwnProperty.call(message, "isProtobuf"))
                    writer.uint32(/* id 3, wireType 0 =*/24).bool(message.isProtobuf);
                if (message.attrs != null && Object.hasOwnProperty.call(message, "attrs"))
                    for (let keys = Object.keys(message.attrs), i = 0; i < keys.length; ++i)
                        writer.uint32(/* id 4, wireType 2 =*/34).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]).uint32(/* id 2, wireType 2 =*/18).string(message.attrs[keys[i]]).ldelim();
                return writer;
            };

            /**
             * Encodes the specified SendPacketRequest message, length delimited. Does not implicitly {@link kritor.developer.SendPacketRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.developer.SendPacketRequest
             * @static
             * @param {kritor.developer.ISendPacketRequest} message SendPacketRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SendPacketRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a SendPacketRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.developer.SendPacketRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.developer.SendPacketRequest} SendPacketRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SendPacketRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.developer.SendPacketRequest(), key, value;
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.command = reader.string();
                            break;
                        }
                    case 2: {
                            message.requestBuffer = reader.bytes();
                            break;
                        }
                    case 3: {
                            message.isProtobuf = reader.bool();
                            break;
                        }
                    case 4: {
                            if (message.attrs === $util.emptyObject)
                                message.attrs = {};
                            let end2 = reader.uint32() + reader.pos;
                            key = "";
                            value = "";
                            while (reader.pos < end2) {
                                let tag2 = reader.uint32();
                                switch (tag2 >>> 3) {
                                case 1:
                                    key = reader.string();
                                    break;
                                case 2:
                                    value = reader.string();
                                    break;
                                default:
                                    reader.skipType(tag2 & 7);
                                    break;
                                }
                            }
                            message.attrs[key] = value;
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
             * Decodes a SendPacketRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.developer.SendPacketRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.developer.SendPacketRequest} SendPacketRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SendPacketRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a SendPacketRequest message.
             * @function verify
             * @memberof kritor.developer.SendPacketRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            SendPacketRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.command != null && message.hasOwnProperty("command"))
                    if (!$util.isString(message.command))
                        return "command: string expected";
                if (message.requestBuffer != null && message.hasOwnProperty("requestBuffer"))
                    if (!(message.requestBuffer && typeof message.requestBuffer.length === "number" || $util.isString(message.requestBuffer)))
                        return "requestBuffer: buffer expected";
                if (message.isProtobuf != null && message.hasOwnProperty("isProtobuf"))
                    if (typeof message.isProtobuf !== "boolean")
                        return "isProtobuf: boolean expected";
                if (message.attrs != null && message.hasOwnProperty("attrs")) {
                    if (!$util.isObject(message.attrs))
                        return "attrs: object expected";
                    let key = Object.keys(message.attrs);
                    for (let i = 0; i < key.length; ++i)
                        if (!$util.isString(message.attrs[key[i]]))
                            return "attrs: string{k:string} expected";
                }
                return null;
            };

            /**
             * Creates a SendPacketRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.developer.SendPacketRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.developer.SendPacketRequest} SendPacketRequest
             */
            SendPacketRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.developer.SendPacketRequest)
                    return object;
                let message = new $root.kritor.developer.SendPacketRequest();
                if (object.command != null)
                    message.command = String(object.command);
                if (object.requestBuffer != null)
                    if (typeof object.requestBuffer === "string")
                        $util.base64.decode(object.requestBuffer, message.requestBuffer = $util.newBuffer($util.base64.length(object.requestBuffer)), 0);
                    else if (object.requestBuffer.length >= 0)
                        message.requestBuffer = object.requestBuffer;
                if (object.isProtobuf != null)
                    message.isProtobuf = Boolean(object.isProtobuf);
                if (object.attrs) {
                    if (typeof object.attrs !== "object")
                        throw TypeError(".kritor.developer.SendPacketRequest.attrs: object expected");
                    message.attrs = {};
                    for (let keys = Object.keys(object.attrs), i = 0; i < keys.length; ++i)
                        message.attrs[keys[i]] = String(object.attrs[keys[i]]);
                }
                return message;
            };

            /**
             * Creates a plain object from a SendPacketRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.developer.SendPacketRequest
             * @static
             * @param {kritor.developer.SendPacketRequest} message SendPacketRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            SendPacketRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.objects || options.defaults)
                    object.attrs = {};
                if (options.defaults) {
                    object.command = "";
                    if (options.bytes === String)
                        object.requestBuffer = "";
                    else {
                        object.requestBuffer = [];
                        if (options.bytes !== Array)
                            object.requestBuffer = $util.newBuffer(object.requestBuffer);
                    }
                    object.isProtobuf = false;
                }
                if (message.command != null && message.hasOwnProperty("command"))
                    object.command = message.command;
                if (message.requestBuffer != null && message.hasOwnProperty("requestBuffer"))
                    object.requestBuffer = options.bytes === String ? $util.base64.encode(message.requestBuffer, 0, message.requestBuffer.length) : options.bytes === Array ? Array.prototype.slice.call(message.requestBuffer) : message.requestBuffer;
                if (message.isProtobuf != null && message.hasOwnProperty("isProtobuf"))
                    object.isProtobuf = message.isProtobuf;
                let keys2;
                if (message.attrs && (keys2 = Object.keys(message.attrs)).length) {
                    object.attrs = {};
                    for (let j = 0; j < keys2.length; ++j)
                        object.attrs[keys2[j]] = message.attrs[keys2[j]];
                }
                return object;
            };

            /**
             * Converts this SendPacketRequest to JSON.
             * @function toJSON
             * @memberof kritor.developer.SendPacketRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            SendPacketRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for SendPacketRequest
             * @function getTypeUrl
             * @memberof kritor.developer.SendPacketRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            SendPacketRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.developer.SendPacketRequest";
            };

            return SendPacketRequest;
        })();

        developer.SendPacketResponse = (function() {

            /**
             * Properties of a SendPacketResponse.
             * @memberof kritor.developer
             * @interface ISendPacketResponse
             * @property {boolean|null} [isSuccess] SendPacketResponse isSuccess
             * @property {Uint8Array|null} [responseBuffer] SendPacketResponse responseBuffer
             */

            /**
             * Constructs a new SendPacketResponse.
             * @memberof kritor.developer
             * @classdesc Represents a SendPacketResponse.
             * @implements ISendPacketResponse
             * @constructor
             * @param {kritor.developer.ISendPacketResponse=} [properties] Properties to set
             */
            function SendPacketResponse(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * SendPacketResponse isSuccess.
             * @member {boolean} isSuccess
             * @memberof kritor.developer.SendPacketResponse
             * @instance
             */
            SendPacketResponse.prototype.isSuccess = false;

            /**
             * SendPacketResponse responseBuffer.
             * @member {Uint8Array} responseBuffer
             * @memberof kritor.developer.SendPacketResponse
             * @instance
             */
            SendPacketResponse.prototype.responseBuffer = $util.newBuffer([]);

            /**
             * Creates a new SendPacketResponse instance using the specified properties.
             * @function create
             * @memberof kritor.developer.SendPacketResponse
             * @static
             * @param {kritor.developer.ISendPacketResponse=} [properties] Properties to set
             * @returns {kritor.developer.SendPacketResponse} SendPacketResponse instance
             */
            SendPacketResponse.create = function create(properties) {
                return new SendPacketResponse(properties);
            };

            /**
             * Encodes the specified SendPacketResponse message. Does not implicitly {@link kritor.developer.SendPacketResponse.verify|verify} messages.
             * @function encode
             * @memberof kritor.developer.SendPacketResponse
             * @static
             * @param {kritor.developer.ISendPacketResponse} message SendPacketResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SendPacketResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.isSuccess != null && Object.hasOwnProperty.call(message, "isSuccess"))
                    writer.uint32(/* id 1, wireType 0 =*/8).bool(message.isSuccess);
                if (message.responseBuffer != null && Object.hasOwnProperty.call(message, "responseBuffer"))
                    writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.responseBuffer);
                return writer;
            };

            /**
             * Encodes the specified SendPacketResponse message, length delimited. Does not implicitly {@link kritor.developer.SendPacketResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.developer.SendPacketResponse
             * @static
             * @param {kritor.developer.ISendPacketResponse} message SendPacketResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SendPacketResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a SendPacketResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.developer.SendPacketResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.developer.SendPacketResponse} SendPacketResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SendPacketResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.developer.SendPacketResponse();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.isSuccess = reader.bool();
                            break;
                        }
                    case 2: {
                            message.responseBuffer = reader.bytes();
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
             * Decodes a SendPacketResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.developer.SendPacketResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.developer.SendPacketResponse} SendPacketResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SendPacketResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a SendPacketResponse message.
             * @function verify
             * @memberof kritor.developer.SendPacketResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            SendPacketResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.isSuccess != null && message.hasOwnProperty("isSuccess"))
                    if (typeof message.isSuccess !== "boolean")
                        return "isSuccess: boolean expected";
                if (message.responseBuffer != null && message.hasOwnProperty("responseBuffer"))
                    if (!(message.responseBuffer && typeof message.responseBuffer.length === "number" || $util.isString(message.responseBuffer)))
                        return "responseBuffer: buffer expected";
                return null;
            };

            /**
             * Creates a SendPacketResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.developer.SendPacketResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.developer.SendPacketResponse} SendPacketResponse
             */
            SendPacketResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.developer.SendPacketResponse)
                    return object;
                let message = new $root.kritor.developer.SendPacketResponse();
                if (object.isSuccess != null)
                    message.isSuccess = Boolean(object.isSuccess);
                if (object.responseBuffer != null)
                    if (typeof object.responseBuffer === "string")
                        $util.base64.decode(object.responseBuffer, message.responseBuffer = $util.newBuffer($util.base64.length(object.responseBuffer)), 0);
                    else if (object.responseBuffer.length >= 0)
                        message.responseBuffer = object.responseBuffer;
                return message;
            };

            /**
             * Creates a plain object from a SendPacketResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.developer.SendPacketResponse
             * @static
             * @param {kritor.developer.SendPacketResponse} message SendPacketResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            SendPacketResponse.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.isSuccess = false;
                    if (options.bytes === String)
                        object.responseBuffer = "";
                    else {
                        object.responseBuffer = [];
                        if (options.bytes !== Array)
                            object.responseBuffer = $util.newBuffer(object.responseBuffer);
                    }
                }
                if (message.isSuccess != null && message.hasOwnProperty("isSuccess"))
                    object.isSuccess = message.isSuccess;
                if (message.responseBuffer != null && message.hasOwnProperty("responseBuffer"))
                    object.responseBuffer = options.bytes === String ? $util.base64.encode(message.responseBuffer, 0, message.responseBuffer.length) : options.bytes === Array ? Array.prototype.slice.call(message.responseBuffer) : message.responseBuffer;
                return object;
            };

            /**
             * Converts this SendPacketResponse to JSON.
             * @function toJSON
             * @memberof kritor.developer.SendPacketResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            SendPacketResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for SendPacketResponse
             * @function getTypeUrl
             * @memberof kritor.developer.SendPacketResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            SendPacketResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.developer.SendPacketResponse";
            };

            return SendPacketResponse;
        })();

        return developer;
    })();

    return kritor;
})();

export { $root as default };
