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

    kritor.customization = (function() {

        /**
         * Namespace customization.
         * @memberof kritor
         * @namespace
         */
        const customization = {};

        customization.CustomizationService = (function() {

            /**
             * Constructs a new CustomizationService service.
             * @memberof kritor.customization
             * @classdesc Represents a CustomizationService
             * @extends $protobuf.rpc.Service
             * @constructor
             * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
             * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
             * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
             */
            function CustomizationService(rpcImpl, requestDelimited, responseDelimited) {
                $protobuf.rpc.Service.call(this, rpcImpl, requestDelimited, responseDelimited);
            }

            (CustomizationService.prototype = Object.create($protobuf.rpc.Service.prototype)).constructor = CustomizationService;

            /**
             * Creates new CustomizationService service using the specified rpc implementation.
             * @function create
             * @memberof kritor.customization.CustomizationService
             * @static
             * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
             * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
             * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
             * @returns {CustomizationService} RPC service. Useful where requests and/or responses are streamed.
             */
            CustomizationService.create = function create(rpcImpl, requestDelimited, responseDelimited) {
                return new this(rpcImpl, requestDelimited, responseDelimited);
            };

            /**
             * Callback as used by {@link kritor.customization.CustomizationService#callFunction}.
             * @memberof kritor.customization.CustomizationService
             * @typedef CallFunctionCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.common.Response} [response] Response
             */

            /**
             * Calls CallFunction.
             * @function callFunction
             * @memberof kritor.customization.CustomizationService
             * @instance
             * @param {kritor.common.IRequest} request Request message or plain object
             * @param {kritor.customization.CustomizationService.CallFunctionCallback} callback Node-style callback called with the error, if any, and Response
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(CustomizationService.prototype.callFunction = function callFunction(request, callback) {
                return this.rpcCall(callFunction, $root.kritor.common.Request, $root.kritor.common.Response, request, callback);
            }, "name", { value: "CallFunction" });

            /**
             * Calls CallFunction.
             * @function callFunction
             * @memberof kritor.customization.CustomizationService
             * @instance
             * @param {kritor.common.IRequest} request Request message or plain object
             * @returns {Promise<kritor.common.Response>} Promise
             * @variation 2
             */

            return CustomizationService;
        })();

        return customization;
    })();

    kritor.common = (function() {

        /**
         * Namespace common.
         * @memberof kritor
         * @namespace
         */
        const common = {};

        common.Request = (function() {

            /**
             * Properties of a Request.
             * @memberof kritor.common
             * @interface IRequest
             * @property {string|null} [cmd] Request cmd
             * @property {number|null} [seq] Request seq
             * @property {Uint8Array|null} [buf] Request buf
             * @property {boolean|null} [noResponse] Request noResponse
             */

            /**
             * Constructs a new Request.
             * @memberof kritor.common
             * @classdesc Represents a Request.
             * @implements IRequest
             * @constructor
             * @param {kritor.common.IRequest=} [properties] Properties to set
             */
            function Request(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Request cmd.
             * @member {string} cmd
             * @memberof kritor.common.Request
             * @instance
             */
            Request.prototype.cmd = "";

            /**
             * Request seq.
             * @member {number} seq
             * @memberof kritor.common.Request
             * @instance
             */
            Request.prototype.seq = 0;

            /**
             * Request buf.
             * @member {Uint8Array} buf
             * @memberof kritor.common.Request
             * @instance
             */
            Request.prototype.buf = $util.newBuffer([]);

            /**
             * Request noResponse.
             * @member {boolean} noResponse
             * @memberof kritor.common.Request
             * @instance
             */
            Request.prototype.noResponse = false;

            /**
             * Creates a new Request instance using the specified properties.
             * @function create
             * @memberof kritor.common.Request
             * @static
             * @param {kritor.common.IRequest=} [properties] Properties to set
             * @returns {kritor.common.Request} Request instance
             */
            Request.create = function create(properties) {
                return new Request(properties);
            };

            /**
             * Encodes the specified Request message. Does not implicitly {@link kritor.common.Request.verify|verify} messages.
             * @function encode
             * @memberof kritor.common.Request
             * @static
             * @param {kritor.common.IRequest} message Request message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Request.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.cmd != null && Object.hasOwnProperty.call(message, "cmd"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.cmd);
                if (message.seq != null && Object.hasOwnProperty.call(message, "seq"))
                    writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.seq);
                if (message.buf != null && Object.hasOwnProperty.call(message, "buf"))
                    writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.buf);
                if (message.noResponse != null && Object.hasOwnProperty.call(message, "noResponse"))
                    writer.uint32(/* id 4, wireType 0 =*/32).bool(message.noResponse);
                return writer;
            };

            /**
             * Encodes the specified Request message, length delimited. Does not implicitly {@link kritor.common.Request.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.common.Request
             * @static
             * @param {kritor.common.IRequest} message Request message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Request.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a Request message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.common.Request
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.common.Request} Request
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Request.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.common.Request();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.cmd = reader.string();
                            break;
                        }
                    case 2: {
                            message.seq = reader.uint32();
                            break;
                        }
                    case 3: {
                            message.buf = reader.bytes();
                            break;
                        }
                    case 4: {
                            message.noResponse = reader.bool();
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
             * Decodes a Request message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.common.Request
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.common.Request} Request
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Request.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a Request message.
             * @function verify
             * @memberof kritor.common.Request
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Request.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.cmd != null && message.hasOwnProperty("cmd"))
                    if (!$util.isString(message.cmd))
                        return "cmd: string expected";
                if (message.seq != null && message.hasOwnProperty("seq"))
                    if (!$util.isInteger(message.seq))
                        return "seq: integer expected";
                if (message.buf != null && message.hasOwnProperty("buf"))
                    if (!(message.buf && typeof message.buf.length === "number" || $util.isString(message.buf)))
                        return "buf: buffer expected";
                if (message.noResponse != null && message.hasOwnProperty("noResponse"))
                    if (typeof message.noResponse !== "boolean")
                        return "noResponse: boolean expected";
                return null;
            };

            /**
             * Creates a Request message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.common.Request
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.common.Request} Request
             */
            Request.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.common.Request)
                    return object;
                let message = new $root.kritor.common.Request();
                if (object.cmd != null)
                    message.cmd = String(object.cmd);
                if (object.seq != null)
                    message.seq = object.seq >>> 0;
                if (object.buf != null)
                    if (typeof object.buf === "string")
                        $util.base64.decode(object.buf, message.buf = $util.newBuffer($util.base64.length(object.buf)), 0);
                    else if (object.buf.length >= 0)
                        message.buf = object.buf;
                if (object.noResponse != null)
                    message.noResponse = Boolean(object.noResponse);
                return message;
            };

            /**
             * Creates a plain object from a Request message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.common.Request
             * @static
             * @param {kritor.common.Request} message Request
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Request.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.cmd = "";
                    object.seq = 0;
                    if (options.bytes === String)
                        object.buf = "";
                    else {
                        object.buf = [];
                        if (options.bytes !== Array)
                            object.buf = $util.newBuffer(object.buf);
                    }
                    object.noResponse = false;
                }
                if (message.cmd != null && message.hasOwnProperty("cmd"))
                    object.cmd = message.cmd;
                if (message.seq != null && message.hasOwnProperty("seq"))
                    object.seq = message.seq;
                if (message.buf != null && message.hasOwnProperty("buf"))
                    object.buf = options.bytes === String ? $util.base64.encode(message.buf, 0, message.buf.length) : options.bytes === Array ? Array.prototype.slice.call(message.buf) : message.buf;
                if (message.noResponse != null && message.hasOwnProperty("noResponse"))
                    object.noResponse = message.noResponse;
                return object;
            };

            /**
             * Converts this Request to JSON.
             * @function toJSON
             * @memberof kritor.common.Request
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Request.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for Request
             * @function getTypeUrl
             * @memberof kritor.common.Request
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            Request.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.common.Request";
            };

            return Request;
        })();

        common.Response = (function() {

            /**
             * Properties of a Response.
             * @memberof kritor.common
             * @interface IResponse
             * @property {string|null} [cmd] Response cmd
             * @property {number|null} [seq] Response seq
             * @property {kritor.common.Response.ResponseCode|null} [code] Response code
             * @property {string|null} [msg] Response msg
             * @property {Uint8Array|null} [buf] Response buf
             */

            /**
             * Constructs a new Response.
             * @memberof kritor.common
             * @classdesc Represents a Response.
             * @implements IResponse
             * @constructor
             * @param {kritor.common.IResponse=} [properties] Properties to set
             */
            function Response(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Response cmd.
             * @member {string} cmd
             * @memberof kritor.common.Response
             * @instance
             */
            Response.prototype.cmd = "";

            /**
             * Response seq.
             * @member {number} seq
             * @memberof kritor.common.Response
             * @instance
             */
            Response.prototype.seq = 0;

            /**
             * Response code.
             * @member {kritor.common.Response.ResponseCode} code
             * @memberof kritor.common.Response
             * @instance
             */
            Response.prototype.code = 0;

            /**
             * Response msg.
             * @member {string|null|undefined} msg
             * @memberof kritor.common.Response
             * @instance
             */
            Response.prototype.msg = null;

            /**
             * Response buf.
             * @member {Uint8Array} buf
             * @memberof kritor.common.Response
             * @instance
             */
            Response.prototype.buf = $util.newBuffer([]);

            // OneOf field names bound to virtual getters and setters
            let $oneOfFields;

            /**
             * Response _msg.
             * @member {"msg"|undefined} _msg
             * @memberof kritor.common.Response
             * @instance
             */
            Object.defineProperty(Response.prototype, "_msg", {
                get: $util.oneOfGetter($oneOfFields = ["msg"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new Response instance using the specified properties.
             * @function create
             * @memberof kritor.common.Response
             * @static
             * @param {kritor.common.IResponse=} [properties] Properties to set
             * @returns {kritor.common.Response} Response instance
             */
            Response.create = function create(properties) {
                return new Response(properties);
            };

            /**
             * Encodes the specified Response message. Does not implicitly {@link kritor.common.Response.verify|verify} messages.
             * @function encode
             * @memberof kritor.common.Response
             * @static
             * @param {kritor.common.IResponse} message Response message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Response.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.cmd != null && Object.hasOwnProperty.call(message, "cmd"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.cmd);
                if (message.seq != null && Object.hasOwnProperty.call(message, "seq"))
                    writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.seq);
                if (message.code != null && Object.hasOwnProperty.call(message, "code"))
                    writer.uint32(/* id 3, wireType 0 =*/24).int32(message.code);
                if (message.msg != null && Object.hasOwnProperty.call(message, "msg"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.msg);
                if (message.buf != null && Object.hasOwnProperty.call(message, "buf"))
                    writer.uint32(/* id 5, wireType 2 =*/42).bytes(message.buf);
                return writer;
            };

            /**
             * Encodes the specified Response message, length delimited. Does not implicitly {@link kritor.common.Response.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.common.Response
             * @static
             * @param {kritor.common.IResponse} message Response message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Response.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a Response message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.common.Response
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.common.Response} Response
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Response.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.common.Response();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.cmd = reader.string();
                            break;
                        }
                    case 2: {
                            message.seq = reader.uint32();
                            break;
                        }
                    case 3: {
                            message.code = reader.int32();
                            break;
                        }
                    case 4: {
                            message.msg = reader.string();
                            break;
                        }
                    case 5: {
                            message.buf = reader.bytes();
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
             * Decodes a Response message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.common.Response
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.common.Response} Response
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Response.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a Response message.
             * @function verify
             * @memberof kritor.common.Response
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Response.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                let properties = {};
                if (message.cmd != null && message.hasOwnProperty("cmd"))
                    if (!$util.isString(message.cmd))
                        return "cmd: string expected";
                if (message.seq != null && message.hasOwnProperty("seq"))
                    if (!$util.isInteger(message.seq))
                        return "seq: integer expected";
                if (message.code != null && message.hasOwnProperty("code"))
                    switch (message.code) {
                    default:
                        return "code: enum value expected";
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                        break;
                    }
                if (message.msg != null && message.hasOwnProperty("msg")) {
                    properties._msg = 1;
                    if (!$util.isString(message.msg))
                        return "msg: string expected";
                }
                if (message.buf != null && message.hasOwnProperty("buf"))
                    if (!(message.buf && typeof message.buf.length === "number" || $util.isString(message.buf)))
                        return "buf: buffer expected";
                return null;
            };

            /**
             * Creates a Response message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.common.Response
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.common.Response} Response
             */
            Response.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.common.Response)
                    return object;
                let message = new $root.kritor.common.Response();
                if (object.cmd != null)
                    message.cmd = String(object.cmd);
                if (object.seq != null)
                    message.seq = object.seq >>> 0;
                switch (object.code) {
                default:
                    if (typeof object.code === "number") {
                        message.code = object.code;
                        break;
                    }
                    break;
                case "SUCCESS":
                case 0:
                    message.code = 0;
                    break;
                case "INVALID_ARGUMENT":
                case 1:
                    message.code = 1;
                    break;
                case "INTERNAL":
                case 2:
                    message.code = 2;
                    break;
                case "UNAUTHENTICATED":
                case 3:
                    message.code = 3;
                    break;
                case "PERMISSION_DENIED":
                case 4:
                    message.code = 4;
                    break;
                }
                if (object.msg != null)
                    message.msg = String(object.msg);
                if (object.buf != null)
                    if (typeof object.buf === "string")
                        $util.base64.decode(object.buf, message.buf = $util.newBuffer($util.base64.length(object.buf)), 0);
                    else if (object.buf.length >= 0)
                        message.buf = object.buf;
                return message;
            };

            /**
             * Creates a plain object from a Response message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.common.Response
             * @static
             * @param {kritor.common.Response} message Response
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Response.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.cmd = "";
                    object.seq = 0;
                    object.code = options.enums === String ? "SUCCESS" : 0;
                    if (options.bytes === String)
                        object.buf = "";
                    else {
                        object.buf = [];
                        if (options.bytes !== Array)
                            object.buf = $util.newBuffer(object.buf);
                    }
                }
                if (message.cmd != null && message.hasOwnProperty("cmd"))
                    object.cmd = message.cmd;
                if (message.seq != null && message.hasOwnProperty("seq"))
                    object.seq = message.seq;
                if (message.code != null && message.hasOwnProperty("code"))
                    object.code = options.enums === String ? $root.kritor.common.Response.ResponseCode[message.code] === undefined ? message.code : $root.kritor.common.Response.ResponseCode[message.code] : message.code;
                if (message.msg != null && message.hasOwnProperty("msg")) {
                    object.msg = message.msg;
                    if (options.oneofs)
                        object._msg = "msg";
                }
                if (message.buf != null && message.hasOwnProperty("buf"))
                    object.buf = options.bytes === String ? $util.base64.encode(message.buf, 0, message.buf.length) : options.bytes === Array ? Array.prototype.slice.call(message.buf) : message.buf;
                return object;
            };

            /**
             * Converts this Response to JSON.
             * @function toJSON
             * @memberof kritor.common.Response
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Response.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for Response
             * @function getTypeUrl
             * @memberof kritor.common.Response
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            Response.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.common.Response";
            };

            /**
             * ResponseCode enum.
             * @name kritor.common.Response.ResponseCode
             * @enum {number}
             * @property {number} SUCCESS=0 SUCCESS value
             * @property {number} INVALID_ARGUMENT=1 INVALID_ARGUMENT value
             * @property {number} INTERNAL=2 INTERNAL value
             * @property {number} UNAUTHENTICATED=3 UNAUTHENTICATED value
             * @property {number} PERMISSION_DENIED=4 PERMISSION_DENIED value
             */
            Response.ResponseCode = (function() {
                const valuesById = {}, values = Object.create(valuesById);
                values[valuesById[0] = "SUCCESS"] = 0;
                values[valuesById[1] = "INVALID_ARGUMENT"] = 1;
                values[valuesById[2] = "INTERNAL"] = 2;
                values[valuesById[3] = "UNAUTHENTICATED"] = 3;
                values[valuesById[4] = "PERMISSION_DENIED"] = 4;
                return values;
            })();

            return Response;
        })();

        return common;
    })();

    return kritor;
})();

export { $root as default };
