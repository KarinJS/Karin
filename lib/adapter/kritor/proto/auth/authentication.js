/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/minimal";

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

    kritor.authentication = (function() {

        /**
         * Namespace authentication.
         * @memberof kritor
         * @namespace
         */
        const authentication = {};

        authentication.AuthenticationService = (function() {

            /**
             * Constructs a new AuthenticationService service.
             * @memberof kritor.authentication
             * @classdesc Represents an AuthenticationService
             * @extends $protobuf.rpc.Service
             * @constructor
             * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
             * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
             * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
             */
            function AuthenticationService(rpcImpl, requestDelimited, responseDelimited) {
                $protobuf.rpc.Service.call(this, rpcImpl, requestDelimited, responseDelimited);
            }

            (AuthenticationService.prototype = Object.create($protobuf.rpc.Service.prototype)).constructor = AuthenticationService;

            /**
             * Creates new AuthenticationService service using the specified rpc implementation.
             * @function create
             * @memberof kritor.authentication.AuthenticationService
             * @static
             * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
             * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
             * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
             * @returns {AuthenticationService} RPC service. Useful where requests and/or responses are streamed.
             */
            AuthenticationService.create = function create(rpcImpl, requestDelimited, responseDelimited) {
                return new this(rpcImpl, requestDelimited, responseDelimited);
            };

            /**
             * Callback as used by {@link kritor.authentication.AuthenticationService#authenticate}.
             * @memberof kritor.authentication.AuthenticationService
             * @typedef AuthenticateCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.authentication.AuthenticateResponse} [response] AuthenticateResponse
             */

            /**
             * Calls Authenticate.
             * @function authenticate
             * @memberof kritor.authentication.AuthenticationService
             * @instance
             * @param {kritor.authentication.IAuthenticateRequest} request AuthenticateRequest message or plain object
             * @param {kritor.authentication.AuthenticationService.AuthenticateCallback} callback Node-style callback called with the error, if any, and AuthenticateResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(AuthenticationService.prototype.authenticate = function authenticate(request, callback) {
                return this.rpcCall(authenticate, $root.kritor.authentication.AuthenticateRequest, $root.kritor.authentication.AuthenticateResponse, request, callback);
            }, "name", { value: "Authenticate" });

            /**
             * Calls Authenticate.
             * @function authenticate
             * @memberof kritor.authentication.AuthenticationService
             * @instance
             * @param {kritor.authentication.IAuthenticateRequest} request AuthenticateRequest message or plain object
             * @returns {Promise<kritor.authentication.AuthenticateResponse>} Promise
             * @variation 2
             */

            /**
             * Callback as used by {@link kritor.authentication.AuthenticationService#getAuthenticationState}.
             * @memberof kritor.authentication.AuthenticationService
             * @typedef GetAuthenticationStateCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.authentication.GetAuthenticationStateResponse} [response] GetAuthenticationStateResponse
             */

            /**
             * Calls GetAuthenticationState.
             * @function getAuthenticationState
             * @memberof kritor.authentication.AuthenticationService
             * @instance
             * @param {kritor.authentication.IGetAuthenticationStateRequest} request GetAuthenticationStateRequest message or plain object
             * @param {kritor.authentication.AuthenticationService.GetAuthenticationStateCallback} callback Node-style callback called with the error, if any, and GetAuthenticationStateResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(AuthenticationService.prototype.getAuthenticationState = function getAuthenticationState(request, callback) {
                return this.rpcCall(getAuthenticationState, $root.kritor.authentication.GetAuthenticationStateRequest, $root.kritor.authentication.GetAuthenticationStateResponse, request, callback);
            }, "name", { value: "GetAuthenticationState" });

            /**
             * Calls GetAuthenticationState.
             * @function getAuthenticationState
             * @memberof kritor.authentication.AuthenticationService
             * @instance
             * @param {kritor.authentication.IGetAuthenticationStateRequest} request GetAuthenticationStateRequest message or plain object
             * @returns {Promise<kritor.authentication.GetAuthenticationStateResponse>} Promise
             * @variation 2
             */

            /**
             * Callback as used by {@link kritor.authentication.AuthenticationService#getTicket}.
             * @memberof kritor.authentication.AuthenticationService
             * @typedef GetTicketCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.authentication.GetTicketResponse} [response] GetTicketResponse
             */

            /**
             * Calls GetTicket.
             * @function getTicket
             * @memberof kritor.authentication.AuthenticationService
             * @instance
             * @param {kritor.authentication.IGetTicketRequest} request GetTicketRequest message or plain object
             * @param {kritor.authentication.AuthenticationService.GetTicketCallback} callback Node-style callback called with the error, if any, and GetTicketResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(AuthenticationService.prototype.getTicket = function getTicket(request, callback) {
                return this.rpcCall(getTicket, $root.kritor.authentication.GetTicketRequest, $root.kritor.authentication.GetTicketResponse, request, callback);
            }, "name", { value: "GetTicket" });

            /**
             * Calls GetTicket.
             * @function getTicket
             * @memberof kritor.authentication.AuthenticationService
             * @instance
             * @param {kritor.authentication.IGetTicketRequest} request GetTicketRequest message or plain object
             * @returns {Promise<kritor.authentication.GetTicketResponse>} Promise
             * @variation 2
             */

            /**
             * Callback as used by {@link kritor.authentication.AuthenticationService#addTicket}.
             * @memberof kritor.authentication.AuthenticationService
             * @typedef AddTicketCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.authentication.AddTicketResponse} [response] AddTicketResponse
             */

            /**
             * Calls AddTicket.
             * @function addTicket
             * @memberof kritor.authentication.AuthenticationService
             * @instance
             * @param {kritor.authentication.IAddTicketRequest} request AddTicketRequest message or plain object
             * @param {kritor.authentication.AuthenticationService.AddTicketCallback} callback Node-style callback called with the error, if any, and AddTicketResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(AuthenticationService.prototype.addTicket = function addTicket(request, callback) {
                return this.rpcCall(addTicket, $root.kritor.authentication.AddTicketRequest, $root.kritor.authentication.AddTicketResponse, request, callback);
            }, "name", { value: "AddTicket" });

            /**
             * Calls AddTicket.
             * @function addTicket
             * @memberof kritor.authentication.AuthenticationService
             * @instance
             * @param {kritor.authentication.IAddTicketRequest} request AddTicketRequest message or plain object
             * @returns {Promise<kritor.authentication.AddTicketResponse>} Promise
             * @variation 2
             */

            /**
             * Callback as used by {@link kritor.authentication.AuthenticationService#deleteTicket}.
             * @memberof kritor.authentication.AuthenticationService
             * @typedef DeleteTicketCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.authentication.DeleteTicketResponse} [response] DeleteTicketResponse
             */

            /**
             * Calls DeleteTicket.
             * @function deleteTicket
             * @memberof kritor.authentication.AuthenticationService
             * @instance
             * @param {kritor.authentication.IDeleteTicketRequest} request DeleteTicketRequest message or plain object
             * @param {kritor.authentication.AuthenticationService.DeleteTicketCallback} callback Node-style callback called with the error, if any, and DeleteTicketResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(AuthenticationService.prototype.deleteTicket = function deleteTicket(request, callback) {
                return this.rpcCall(deleteTicket, $root.kritor.authentication.DeleteTicketRequest, $root.kritor.authentication.DeleteTicketResponse, request, callback);
            }, "name", { value: "DeleteTicket" });

            /**
             * Calls DeleteTicket.
             * @function deleteTicket
             * @memberof kritor.authentication.AuthenticationService
             * @instance
             * @param {kritor.authentication.IDeleteTicketRequest} request DeleteTicketRequest message or plain object
             * @returns {Promise<kritor.authentication.DeleteTicketResponse>} Promise
             * @variation 2
             */

            return AuthenticationService;
        })();

        authentication.AuthenticateRequest = (function() {

            /**
             * Properties of an AuthenticateRequest.
             * @memberof kritor.authentication
             * @interface IAuthenticateRequest
             * @property {string|null} [account] AuthenticateRequest account
             * @property {string|null} [ticket] AuthenticateRequest ticket
             */

            /**
             * Constructs a new AuthenticateRequest.
             * @memberof kritor.authentication
             * @classdesc Represents an AuthenticateRequest.
             * @implements IAuthenticateRequest
             * @constructor
             * @param {kritor.authentication.IAuthenticateRequest=} [properties] Properties to set
             */
            function AuthenticateRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * AuthenticateRequest account.
             * @member {string} account
             * @memberof kritor.authentication.AuthenticateRequest
             * @instance
             */
            AuthenticateRequest.prototype.account = "";

            /**
             * AuthenticateRequest ticket.
             * @member {string} ticket
             * @memberof kritor.authentication.AuthenticateRequest
             * @instance
             */
            AuthenticateRequest.prototype.ticket = "";

            /**
             * Creates a new AuthenticateRequest instance using the specified properties.
             * @function create
             * @memberof kritor.authentication.AuthenticateRequest
             * @static
             * @param {kritor.authentication.IAuthenticateRequest=} [properties] Properties to set
             * @returns {kritor.authentication.AuthenticateRequest} AuthenticateRequest instance
             */
            AuthenticateRequest.create = function create(properties) {
                return new AuthenticateRequest(properties);
            };

            /**
             * Encodes the specified AuthenticateRequest message. Does not implicitly {@link kritor.authentication.AuthenticateRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.authentication.AuthenticateRequest
             * @static
             * @param {kritor.authentication.IAuthenticateRequest} message AuthenticateRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            AuthenticateRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.account != null && Object.hasOwnProperty.call(message, "account"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.account);
                if (message.ticket != null && Object.hasOwnProperty.call(message, "ticket"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.ticket);
                return writer;
            };

            /**
             * Encodes the specified AuthenticateRequest message, length delimited. Does not implicitly {@link kritor.authentication.AuthenticateRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.authentication.AuthenticateRequest
             * @static
             * @param {kritor.authentication.IAuthenticateRequest} message AuthenticateRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            AuthenticateRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an AuthenticateRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.authentication.AuthenticateRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.authentication.AuthenticateRequest} AuthenticateRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            AuthenticateRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.authentication.AuthenticateRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.account = reader.string();
                            break;
                        }
                    case 2: {
                            message.ticket = reader.string();
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
             * Decodes an AuthenticateRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.authentication.AuthenticateRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.authentication.AuthenticateRequest} AuthenticateRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            AuthenticateRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an AuthenticateRequest message.
             * @function verify
             * @memberof kritor.authentication.AuthenticateRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            AuthenticateRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.account != null && message.hasOwnProperty("account"))
                    if (!$util.isString(message.account))
                        return "account: string expected";
                if (message.ticket != null && message.hasOwnProperty("ticket"))
                    if (!$util.isString(message.ticket))
                        return "ticket: string expected";
                return null;
            };

            /**
             * Creates an AuthenticateRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.authentication.AuthenticateRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.authentication.AuthenticateRequest} AuthenticateRequest
             */
            AuthenticateRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.authentication.AuthenticateRequest)
                    return object;
                let message = new $root.kritor.authentication.AuthenticateRequest();
                if (object.account != null)
                    message.account = String(object.account);
                if (object.ticket != null)
                    message.ticket = String(object.ticket);
                return message;
            };

            /**
             * Creates a plain object from an AuthenticateRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.authentication.AuthenticateRequest
             * @static
             * @param {kritor.authentication.AuthenticateRequest} message AuthenticateRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            AuthenticateRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.account = "";
                    object.ticket = "";
                }
                if (message.account != null && message.hasOwnProperty("account"))
                    object.account = message.account;
                if (message.ticket != null && message.hasOwnProperty("ticket"))
                    object.ticket = message.ticket;
                return object;
            };

            /**
             * Converts this AuthenticateRequest to JSON.
             * @function toJSON
             * @memberof kritor.authentication.AuthenticateRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            AuthenticateRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for AuthenticateRequest
             * @function getTypeUrl
             * @memberof kritor.authentication.AuthenticateRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            AuthenticateRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.authentication.AuthenticateRequest";
            };

            return AuthenticateRequest;
        })();

        authentication.AuthenticateResponse = (function() {

            /**
             * Properties of an AuthenticateResponse.
             * @memberof kritor.authentication
             * @interface IAuthenticateResponse
             * @property {kritor.authentication.AuthenticateResponse.AuthenticateResponseCode|null} [code] AuthenticateResponse code
             * @property {string|null} [msg] AuthenticateResponse msg
             */

            /**
             * Constructs a new AuthenticateResponse.
             * @memberof kritor.authentication
             * @classdesc Represents an AuthenticateResponse.
             * @implements IAuthenticateResponse
             * @constructor
             * @param {kritor.authentication.IAuthenticateResponse=} [properties] Properties to set
             */
            function AuthenticateResponse(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * AuthenticateResponse code.
             * @member {kritor.authentication.AuthenticateResponse.AuthenticateResponseCode} code
             * @memberof kritor.authentication.AuthenticateResponse
             * @instance
             */
            AuthenticateResponse.prototype.code = 0;

            /**
             * AuthenticateResponse msg.
             * @member {string} msg
             * @memberof kritor.authentication.AuthenticateResponse
             * @instance
             */
            AuthenticateResponse.prototype.msg = "";

            /**
             * Creates a new AuthenticateResponse instance using the specified properties.
             * @function create
             * @memberof kritor.authentication.AuthenticateResponse
             * @static
             * @param {kritor.authentication.IAuthenticateResponse=} [properties] Properties to set
             * @returns {kritor.authentication.AuthenticateResponse} AuthenticateResponse instance
             */
            AuthenticateResponse.create = function create(properties) {
                return new AuthenticateResponse(properties);
            };

            /**
             * Encodes the specified AuthenticateResponse message. Does not implicitly {@link kritor.authentication.AuthenticateResponse.verify|verify} messages.
             * @function encode
             * @memberof kritor.authentication.AuthenticateResponse
             * @static
             * @param {kritor.authentication.IAuthenticateResponse} message AuthenticateResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            AuthenticateResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.code != null && Object.hasOwnProperty.call(message, "code"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int32(message.code);
                if (message.msg != null && Object.hasOwnProperty.call(message, "msg"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.msg);
                return writer;
            };

            /**
             * Encodes the specified AuthenticateResponse message, length delimited. Does not implicitly {@link kritor.authentication.AuthenticateResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.authentication.AuthenticateResponse
             * @static
             * @param {kritor.authentication.IAuthenticateResponse} message AuthenticateResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            AuthenticateResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an AuthenticateResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.authentication.AuthenticateResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.authentication.AuthenticateResponse} AuthenticateResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            AuthenticateResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.authentication.AuthenticateResponse();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.code = reader.int32();
                            break;
                        }
                    case 2: {
                            message.msg = reader.string();
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
             * Decodes an AuthenticateResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.authentication.AuthenticateResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.authentication.AuthenticateResponse} AuthenticateResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            AuthenticateResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an AuthenticateResponse message.
             * @function verify
             * @memberof kritor.authentication.AuthenticateResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            AuthenticateResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.code != null && message.hasOwnProperty("code"))
                    switch (message.code) {
                    default:
                        return "code: enum value expected";
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                        break;
                    }
                if (message.msg != null && message.hasOwnProperty("msg"))
                    if (!$util.isString(message.msg))
                        return "msg: string expected";
                return null;
            };

            /**
             * Creates an AuthenticateResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.authentication.AuthenticateResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.authentication.AuthenticateResponse} AuthenticateResponse
             */
            AuthenticateResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.authentication.AuthenticateResponse)
                    return object;
                let message = new $root.kritor.authentication.AuthenticateResponse();
                switch (object.code) {
                default:
                    if (typeof object.code === "number") {
                        message.code = object.code;
                        break;
                    }
                    break;
                case "OK":
                case 0:
                    message.code = 0;
                    break;
                case "NO_ACCOUNT":
                case 1:
                    message.code = 1;
                    break;
                case "NO_TICKET":
                case 2:
                    message.code = 2;
                    break;
                case "LOGIC_ERROR":
                case 3:
                    message.code = 3;
                    break;
                }
                if (object.msg != null)
                    message.msg = String(object.msg);
                return message;
            };

            /**
             * Creates a plain object from an AuthenticateResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.authentication.AuthenticateResponse
             * @static
             * @param {kritor.authentication.AuthenticateResponse} message AuthenticateResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            AuthenticateResponse.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.code = options.enums === String ? "OK" : 0;
                    object.msg = "";
                }
                if (message.code != null && message.hasOwnProperty("code"))
                    object.code = options.enums === String ? $root.kritor.authentication.AuthenticateResponse.AuthenticateResponseCode[message.code] === undefined ? message.code : $root.kritor.authentication.AuthenticateResponse.AuthenticateResponseCode[message.code] : message.code;
                if (message.msg != null && message.hasOwnProperty("msg"))
                    object.msg = message.msg;
                return object;
            };

            /**
             * Converts this AuthenticateResponse to JSON.
             * @function toJSON
             * @memberof kritor.authentication.AuthenticateResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            AuthenticateResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for AuthenticateResponse
             * @function getTypeUrl
             * @memberof kritor.authentication.AuthenticateResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            AuthenticateResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.authentication.AuthenticateResponse";
            };

            /**
             * AuthenticateResponseCode enum.
             * @name kritor.authentication.AuthenticateResponse.AuthenticateResponseCode
             * @enum {number}
             * @property {number} OK=0 OK value
             * @property {number} NO_ACCOUNT=1 NO_ACCOUNT value
             * @property {number} NO_TICKET=2 NO_TICKET value
             * @property {number} LOGIC_ERROR=3 LOGIC_ERROR value
             */
            AuthenticateResponse.AuthenticateResponseCode = (function() {
                const valuesById = {}, values = Object.create(valuesById);
                values[valuesById[0] = "OK"] = 0;
                values[valuesById[1] = "NO_ACCOUNT"] = 1;
                values[valuesById[2] = "NO_TICKET"] = 2;
                values[valuesById[3] = "LOGIC_ERROR"] = 3;
                return values;
            })();

            return AuthenticateResponse;
        })();

        authentication.GetAuthenticationStateRequest = (function() {

            /**
             * Properties of a GetAuthenticationStateRequest.
             * @memberof kritor.authentication
             * @interface IGetAuthenticationStateRequest
             * @property {string|null} [account] GetAuthenticationStateRequest account
             */

            /**
             * Constructs a new GetAuthenticationStateRequest.
             * @memberof kritor.authentication
             * @classdesc Represents a GetAuthenticationStateRequest.
             * @implements IGetAuthenticationStateRequest
             * @constructor
             * @param {kritor.authentication.IGetAuthenticationStateRequest=} [properties] Properties to set
             */
            function GetAuthenticationStateRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetAuthenticationStateRequest account.
             * @member {string} account
             * @memberof kritor.authentication.GetAuthenticationStateRequest
             * @instance
             */
            GetAuthenticationStateRequest.prototype.account = "";

            /**
             * Creates a new GetAuthenticationStateRequest instance using the specified properties.
             * @function create
             * @memberof kritor.authentication.GetAuthenticationStateRequest
             * @static
             * @param {kritor.authentication.IGetAuthenticationStateRequest=} [properties] Properties to set
             * @returns {kritor.authentication.GetAuthenticationStateRequest} GetAuthenticationStateRequest instance
             */
            GetAuthenticationStateRequest.create = function create(properties) {
                return new GetAuthenticationStateRequest(properties);
            };

            /**
             * Encodes the specified GetAuthenticationStateRequest message. Does not implicitly {@link kritor.authentication.GetAuthenticationStateRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.authentication.GetAuthenticationStateRequest
             * @static
             * @param {kritor.authentication.IGetAuthenticationStateRequest} message GetAuthenticationStateRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetAuthenticationStateRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.account != null && Object.hasOwnProperty.call(message, "account"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.account);
                return writer;
            };

            /**
             * Encodes the specified GetAuthenticationStateRequest message, length delimited. Does not implicitly {@link kritor.authentication.GetAuthenticationStateRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.authentication.GetAuthenticationStateRequest
             * @static
             * @param {kritor.authentication.IGetAuthenticationStateRequest} message GetAuthenticationStateRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetAuthenticationStateRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetAuthenticationStateRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.authentication.GetAuthenticationStateRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.authentication.GetAuthenticationStateRequest} GetAuthenticationStateRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetAuthenticationStateRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.authentication.GetAuthenticationStateRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.account = reader.string();
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
             * Decodes a GetAuthenticationStateRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.authentication.GetAuthenticationStateRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.authentication.GetAuthenticationStateRequest} GetAuthenticationStateRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetAuthenticationStateRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetAuthenticationStateRequest message.
             * @function verify
             * @memberof kritor.authentication.GetAuthenticationStateRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetAuthenticationStateRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.account != null && message.hasOwnProperty("account"))
                    if (!$util.isString(message.account))
                        return "account: string expected";
                return null;
            };

            /**
             * Creates a GetAuthenticationStateRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.authentication.GetAuthenticationStateRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.authentication.GetAuthenticationStateRequest} GetAuthenticationStateRequest
             */
            GetAuthenticationStateRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.authentication.GetAuthenticationStateRequest)
                    return object;
                let message = new $root.kritor.authentication.GetAuthenticationStateRequest();
                if (object.account != null)
                    message.account = String(object.account);
                return message;
            };

            /**
             * Creates a plain object from a GetAuthenticationStateRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.authentication.GetAuthenticationStateRequest
             * @static
             * @param {kritor.authentication.GetAuthenticationStateRequest} message GetAuthenticationStateRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetAuthenticationStateRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults)
                    object.account = "";
                if (message.account != null && message.hasOwnProperty("account"))
                    object.account = message.account;
                return object;
            };

            /**
             * Converts this GetAuthenticationStateRequest to JSON.
             * @function toJSON
             * @memberof kritor.authentication.GetAuthenticationStateRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetAuthenticationStateRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GetAuthenticationStateRequest
             * @function getTypeUrl
             * @memberof kritor.authentication.GetAuthenticationStateRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetAuthenticationStateRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.authentication.GetAuthenticationStateRequest";
            };

            return GetAuthenticationStateRequest;
        })();

        authentication.GetAuthenticationStateResponse = (function() {

            /**
             * Properties of a GetAuthenticationStateResponse.
             * @memberof kritor.authentication
             * @interface IGetAuthenticationStateResponse
             * @property {boolean|null} [isRequired] GetAuthenticationStateResponse isRequired
             */

            /**
             * Constructs a new GetAuthenticationStateResponse.
             * @memberof kritor.authentication
             * @classdesc Represents a GetAuthenticationStateResponse.
             * @implements IGetAuthenticationStateResponse
             * @constructor
             * @param {kritor.authentication.IGetAuthenticationStateResponse=} [properties] Properties to set
             */
            function GetAuthenticationStateResponse(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetAuthenticationStateResponse isRequired.
             * @member {boolean} isRequired
             * @memberof kritor.authentication.GetAuthenticationStateResponse
             * @instance
             */
            GetAuthenticationStateResponse.prototype.isRequired = false;

            /**
             * Creates a new GetAuthenticationStateResponse instance using the specified properties.
             * @function create
             * @memberof kritor.authentication.GetAuthenticationStateResponse
             * @static
             * @param {kritor.authentication.IGetAuthenticationStateResponse=} [properties] Properties to set
             * @returns {kritor.authentication.GetAuthenticationStateResponse} GetAuthenticationStateResponse instance
             */
            GetAuthenticationStateResponse.create = function create(properties) {
                return new GetAuthenticationStateResponse(properties);
            };

            /**
             * Encodes the specified GetAuthenticationStateResponse message. Does not implicitly {@link kritor.authentication.GetAuthenticationStateResponse.verify|verify} messages.
             * @function encode
             * @memberof kritor.authentication.GetAuthenticationStateResponse
             * @static
             * @param {kritor.authentication.IGetAuthenticationStateResponse} message GetAuthenticationStateResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetAuthenticationStateResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.isRequired != null && Object.hasOwnProperty.call(message, "isRequired"))
                    writer.uint32(/* id 1, wireType 0 =*/8).bool(message.isRequired);
                return writer;
            };

            /**
             * Encodes the specified GetAuthenticationStateResponse message, length delimited. Does not implicitly {@link kritor.authentication.GetAuthenticationStateResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.authentication.GetAuthenticationStateResponse
             * @static
             * @param {kritor.authentication.IGetAuthenticationStateResponse} message GetAuthenticationStateResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetAuthenticationStateResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetAuthenticationStateResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.authentication.GetAuthenticationStateResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.authentication.GetAuthenticationStateResponse} GetAuthenticationStateResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetAuthenticationStateResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.authentication.GetAuthenticationStateResponse();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.isRequired = reader.bool();
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
             * Decodes a GetAuthenticationStateResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.authentication.GetAuthenticationStateResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.authentication.GetAuthenticationStateResponse} GetAuthenticationStateResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetAuthenticationStateResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetAuthenticationStateResponse message.
             * @function verify
             * @memberof kritor.authentication.GetAuthenticationStateResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetAuthenticationStateResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.isRequired != null && message.hasOwnProperty("isRequired"))
                    if (typeof message.isRequired !== "boolean")
                        return "isRequired: boolean expected";
                return null;
            };

            /**
             * Creates a GetAuthenticationStateResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.authentication.GetAuthenticationStateResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.authentication.GetAuthenticationStateResponse} GetAuthenticationStateResponse
             */
            GetAuthenticationStateResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.authentication.GetAuthenticationStateResponse)
                    return object;
                let message = new $root.kritor.authentication.GetAuthenticationStateResponse();
                if (object.isRequired != null)
                    message.isRequired = Boolean(object.isRequired);
                return message;
            };

            /**
             * Creates a plain object from a GetAuthenticationStateResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.authentication.GetAuthenticationStateResponse
             * @static
             * @param {kritor.authentication.GetAuthenticationStateResponse} message GetAuthenticationStateResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetAuthenticationStateResponse.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults)
                    object.isRequired = false;
                if (message.isRequired != null && message.hasOwnProperty("isRequired"))
                    object.isRequired = message.isRequired;
                return object;
            };

            /**
             * Converts this GetAuthenticationStateResponse to JSON.
             * @function toJSON
             * @memberof kritor.authentication.GetAuthenticationStateResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetAuthenticationStateResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GetAuthenticationStateResponse
             * @function getTypeUrl
             * @memberof kritor.authentication.GetAuthenticationStateResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetAuthenticationStateResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.authentication.GetAuthenticationStateResponse";
            };

            return GetAuthenticationStateResponse;
        })();

        /**
         * TicketOperationResponseCode enum.
         * @name kritor.authentication.TicketOperationResponseCode
         * @enum {number}
         * @property {number} OK=0 OK value
         * @property {number} ERROR=1 ERROR value
         */
        authentication.TicketOperationResponseCode = (function() {
            const valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "OK"] = 0;
            values[valuesById[1] = "ERROR"] = 1;
            return values;
        })();

        authentication.GetTicketRequest = (function() {

            /**
             * Properties of a GetTicketRequest.
             * @memberof kritor.authentication
             * @interface IGetTicketRequest
             * @property {string|null} [account] GetTicketRequest account
             * @property {string|null} [superTicket] GetTicketRequest superTicket
             */

            /**
             * Constructs a new GetTicketRequest.
             * @memberof kritor.authentication
             * @classdesc Represents a GetTicketRequest.
             * @implements IGetTicketRequest
             * @constructor
             * @param {kritor.authentication.IGetTicketRequest=} [properties] Properties to set
             */
            function GetTicketRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetTicketRequest account.
             * @member {string} account
             * @memberof kritor.authentication.GetTicketRequest
             * @instance
             */
            GetTicketRequest.prototype.account = "";

            /**
             * GetTicketRequest superTicket.
             * @member {string} superTicket
             * @memberof kritor.authentication.GetTicketRequest
             * @instance
             */
            GetTicketRequest.prototype.superTicket = "";

            /**
             * Creates a new GetTicketRequest instance using the specified properties.
             * @function create
             * @memberof kritor.authentication.GetTicketRequest
             * @static
             * @param {kritor.authentication.IGetTicketRequest=} [properties] Properties to set
             * @returns {kritor.authentication.GetTicketRequest} GetTicketRequest instance
             */
            GetTicketRequest.create = function create(properties) {
                return new GetTicketRequest(properties);
            };

            /**
             * Encodes the specified GetTicketRequest message. Does not implicitly {@link kritor.authentication.GetTicketRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.authentication.GetTicketRequest
             * @static
             * @param {kritor.authentication.IGetTicketRequest} message GetTicketRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetTicketRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.account != null && Object.hasOwnProperty.call(message, "account"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.account);
                if (message.superTicket != null && Object.hasOwnProperty.call(message, "superTicket"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.superTicket);
                return writer;
            };

            /**
             * Encodes the specified GetTicketRequest message, length delimited. Does not implicitly {@link kritor.authentication.GetTicketRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.authentication.GetTicketRequest
             * @static
             * @param {kritor.authentication.IGetTicketRequest} message GetTicketRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetTicketRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetTicketRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.authentication.GetTicketRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.authentication.GetTicketRequest} GetTicketRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetTicketRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.authentication.GetTicketRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.account = reader.string();
                            break;
                        }
                    case 2: {
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
             * Decodes a GetTicketRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.authentication.GetTicketRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.authentication.GetTicketRequest} GetTicketRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetTicketRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetTicketRequest message.
             * @function verify
             * @memberof kritor.authentication.GetTicketRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetTicketRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.account != null && message.hasOwnProperty("account"))
                    if (!$util.isString(message.account))
                        return "account: string expected";
                if (message.superTicket != null && message.hasOwnProperty("superTicket"))
                    if (!$util.isString(message.superTicket))
                        return "superTicket: string expected";
                return null;
            };

            /**
             * Creates a GetTicketRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.authentication.GetTicketRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.authentication.GetTicketRequest} GetTicketRequest
             */
            GetTicketRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.authentication.GetTicketRequest)
                    return object;
                let message = new $root.kritor.authentication.GetTicketRequest();
                if (object.account != null)
                    message.account = String(object.account);
                if (object.superTicket != null)
                    message.superTicket = String(object.superTicket);
                return message;
            };

            /**
             * Creates a plain object from a GetTicketRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.authentication.GetTicketRequest
             * @static
             * @param {kritor.authentication.GetTicketRequest} message GetTicketRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetTicketRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.account = "";
                    object.superTicket = "";
                }
                if (message.account != null && message.hasOwnProperty("account"))
                    object.account = message.account;
                if (message.superTicket != null && message.hasOwnProperty("superTicket"))
                    object.superTicket = message.superTicket;
                return object;
            };

            /**
             * Converts this GetTicketRequest to JSON.
             * @function toJSON
             * @memberof kritor.authentication.GetTicketRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetTicketRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GetTicketRequest
             * @function getTypeUrl
             * @memberof kritor.authentication.GetTicketRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetTicketRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.authentication.GetTicketRequest";
            };

            return GetTicketRequest;
        })();

        authentication.GetTicketResponse = (function() {

            /**
             * Properties of a GetTicketResponse.
             * @memberof kritor.authentication
             * @interface IGetTicketResponse
             * @property {kritor.authentication.TicketOperationResponseCode|null} [code] GetTicketResponse code
             * @property {string|null} [msg] GetTicketResponse msg
             * @property {Array.<string>|null} [tickets] GetTicketResponse tickets
             */

            /**
             * Constructs a new GetTicketResponse.
             * @memberof kritor.authentication
             * @classdesc Represents a GetTicketResponse.
             * @implements IGetTicketResponse
             * @constructor
             * @param {kritor.authentication.IGetTicketResponse=} [properties] Properties to set
             */
            function GetTicketResponse(properties) {
                this.tickets = [];
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetTicketResponse code.
             * @member {kritor.authentication.TicketOperationResponseCode} code
             * @memberof kritor.authentication.GetTicketResponse
             * @instance
             */
            GetTicketResponse.prototype.code = 0;

            /**
             * GetTicketResponse msg.
             * @member {string} msg
             * @memberof kritor.authentication.GetTicketResponse
             * @instance
             */
            GetTicketResponse.prototype.msg = "";

            /**
             * GetTicketResponse tickets.
             * @member {Array.<string>} tickets
             * @memberof kritor.authentication.GetTicketResponse
             * @instance
             */
            GetTicketResponse.prototype.tickets = $util.emptyArray;

            /**
             * Creates a new GetTicketResponse instance using the specified properties.
             * @function create
             * @memberof kritor.authentication.GetTicketResponse
             * @static
             * @param {kritor.authentication.IGetTicketResponse=} [properties] Properties to set
             * @returns {kritor.authentication.GetTicketResponse} GetTicketResponse instance
             */
            GetTicketResponse.create = function create(properties) {
                return new GetTicketResponse(properties);
            };

            /**
             * Encodes the specified GetTicketResponse message. Does not implicitly {@link kritor.authentication.GetTicketResponse.verify|verify} messages.
             * @function encode
             * @memberof kritor.authentication.GetTicketResponse
             * @static
             * @param {kritor.authentication.IGetTicketResponse} message GetTicketResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetTicketResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.code != null && Object.hasOwnProperty.call(message, "code"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int32(message.code);
                if (message.msg != null && Object.hasOwnProperty.call(message, "msg"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.msg);
                if (message.tickets != null && message.tickets.length)
                    for (let i = 0; i < message.tickets.length; ++i)
                        writer.uint32(/* id 3, wireType 2 =*/26).string(message.tickets[i]);
                return writer;
            };

            /**
             * Encodes the specified GetTicketResponse message, length delimited. Does not implicitly {@link kritor.authentication.GetTicketResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.authentication.GetTicketResponse
             * @static
             * @param {kritor.authentication.IGetTicketResponse} message GetTicketResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetTicketResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetTicketResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.authentication.GetTicketResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.authentication.GetTicketResponse} GetTicketResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetTicketResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.authentication.GetTicketResponse();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.code = reader.int32();
                            break;
                        }
                    case 2: {
                            message.msg = reader.string();
                            break;
                        }
                    case 3: {
                            if (!(message.tickets && message.tickets.length))
                                message.tickets = [];
                            message.tickets.push(reader.string());
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
             * Decodes a GetTicketResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.authentication.GetTicketResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.authentication.GetTicketResponse} GetTicketResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetTicketResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetTicketResponse message.
             * @function verify
             * @memberof kritor.authentication.GetTicketResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetTicketResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.code != null && message.hasOwnProperty("code"))
                    switch (message.code) {
                    default:
                        return "code: enum value expected";
                    case 0:
                    case 1:
                        break;
                    }
                if (message.msg != null && message.hasOwnProperty("msg"))
                    if (!$util.isString(message.msg))
                        return "msg: string expected";
                if (message.tickets != null && message.hasOwnProperty("tickets")) {
                    if (!Array.isArray(message.tickets))
                        return "tickets: array expected";
                    for (let i = 0; i < message.tickets.length; ++i)
                        if (!$util.isString(message.tickets[i]))
                            return "tickets: string[] expected";
                }
                return null;
            };

            /**
             * Creates a GetTicketResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.authentication.GetTicketResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.authentication.GetTicketResponse} GetTicketResponse
             */
            GetTicketResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.authentication.GetTicketResponse)
                    return object;
                let message = new $root.kritor.authentication.GetTicketResponse();
                switch (object.code) {
                default:
                    if (typeof object.code === "number") {
                        message.code = object.code;
                        break;
                    }
                    break;
                case "OK":
                case 0:
                    message.code = 0;
                    break;
                case "ERROR":
                case 1:
                    message.code = 1;
                    break;
                }
                if (object.msg != null)
                    message.msg = String(object.msg);
                if (object.tickets) {
                    if (!Array.isArray(object.tickets))
                        throw TypeError(".kritor.authentication.GetTicketResponse.tickets: array expected");
                    message.tickets = [];
                    for (let i = 0; i < object.tickets.length; ++i)
                        message.tickets[i] = String(object.tickets[i]);
                }
                return message;
            };

            /**
             * Creates a plain object from a GetTicketResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.authentication.GetTicketResponse
             * @static
             * @param {kritor.authentication.GetTicketResponse} message GetTicketResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetTicketResponse.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.arrays || options.defaults)
                    object.tickets = [];
                if (options.defaults) {
                    object.code = options.enums === String ? "OK" : 0;
                    object.msg = "";
                }
                if (message.code != null && message.hasOwnProperty("code"))
                    object.code = options.enums === String ? $root.kritor.authentication.TicketOperationResponseCode[message.code] === undefined ? message.code : $root.kritor.authentication.TicketOperationResponseCode[message.code] : message.code;
                if (message.msg != null && message.hasOwnProperty("msg"))
                    object.msg = message.msg;
                if (message.tickets && message.tickets.length) {
                    object.tickets = [];
                    for (let j = 0; j < message.tickets.length; ++j)
                        object.tickets[j] = message.tickets[j];
                }
                return object;
            };

            /**
             * Converts this GetTicketResponse to JSON.
             * @function toJSON
             * @memberof kritor.authentication.GetTicketResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetTicketResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GetTicketResponse
             * @function getTypeUrl
             * @memberof kritor.authentication.GetTicketResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetTicketResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.authentication.GetTicketResponse";
            };

            return GetTicketResponse;
        })();

        authentication.AddTicketRequest = (function() {

            /**
             * Properties of an AddTicketRequest.
             * @memberof kritor.authentication
             * @interface IAddTicketRequest
             * @property {string|null} [account] AddTicketRequest account
             * @property {string|null} [superTicket] AddTicketRequest superTicket
             * @property {string|null} [ticket] AddTicketRequest ticket
             */

            /**
             * Constructs a new AddTicketRequest.
             * @memberof kritor.authentication
             * @classdesc Represents an AddTicketRequest.
             * @implements IAddTicketRequest
             * @constructor
             * @param {kritor.authentication.IAddTicketRequest=} [properties] Properties to set
             */
            function AddTicketRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * AddTicketRequest account.
             * @member {string} account
             * @memberof kritor.authentication.AddTicketRequest
             * @instance
             */
            AddTicketRequest.prototype.account = "";

            /**
             * AddTicketRequest superTicket.
             * @member {string} superTicket
             * @memberof kritor.authentication.AddTicketRequest
             * @instance
             */
            AddTicketRequest.prototype.superTicket = "";

            /**
             * AddTicketRequest ticket.
             * @member {string} ticket
             * @memberof kritor.authentication.AddTicketRequest
             * @instance
             */
            AddTicketRequest.prototype.ticket = "";

            /**
             * Creates a new AddTicketRequest instance using the specified properties.
             * @function create
             * @memberof kritor.authentication.AddTicketRequest
             * @static
             * @param {kritor.authentication.IAddTicketRequest=} [properties] Properties to set
             * @returns {kritor.authentication.AddTicketRequest} AddTicketRequest instance
             */
            AddTicketRequest.create = function create(properties) {
                return new AddTicketRequest(properties);
            };

            /**
             * Encodes the specified AddTicketRequest message. Does not implicitly {@link kritor.authentication.AddTicketRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.authentication.AddTicketRequest
             * @static
             * @param {kritor.authentication.IAddTicketRequest} message AddTicketRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            AddTicketRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.account != null && Object.hasOwnProperty.call(message, "account"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.account);
                if (message.superTicket != null && Object.hasOwnProperty.call(message, "superTicket"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.superTicket);
                if (message.ticket != null && Object.hasOwnProperty.call(message, "ticket"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.ticket);
                return writer;
            };

            /**
             * Encodes the specified AddTicketRequest message, length delimited. Does not implicitly {@link kritor.authentication.AddTicketRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.authentication.AddTicketRequest
             * @static
             * @param {kritor.authentication.IAddTicketRequest} message AddTicketRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            AddTicketRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an AddTicketRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.authentication.AddTicketRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.authentication.AddTicketRequest} AddTicketRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            AddTicketRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.authentication.AddTicketRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.account = reader.string();
                            break;
                        }
                    case 2: {
                            message.superTicket = reader.string();
                            break;
                        }
                    case 3: {
                            message.ticket = reader.string();
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
             * Decodes an AddTicketRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.authentication.AddTicketRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.authentication.AddTicketRequest} AddTicketRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            AddTicketRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an AddTicketRequest message.
             * @function verify
             * @memberof kritor.authentication.AddTicketRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            AddTicketRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.account != null && message.hasOwnProperty("account"))
                    if (!$util.isString(message.account))
                        return "account: string expected";
                if (message.superTicket != null && message.hasOwnProperty("superTicket"))
                    if (!$util.isString(message.superTicket))
                        return "superTicket: string expected";
                if (message.ticket != null && message.hasOwnProperty("ticket"))
                    if (!$util.isString(message.ticket))
                        return "ticket: string expected";
                return null;
            };

            /**
             * Creates an AddTicketRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.authentication.AddTicketRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.authentication.AddTicketRequest} AddTicketRequest
             */
            AddTicketRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.authentication.AddTicketRequest)
                    return object;
                let message = new $root.kritor.authentication.AddTicketRequest();
                if (object.account != null)
                    message.account = String(object.account);
                if (object.superTicket != null)
                    message.superTicket = String(object.superTicket);
                if (object.ticket != null)
                    message.ticket = String(object.ticket);
                return message;
            };

            /**
             * Creates a plain object from an AddTicketRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.authentication.AddTicketRequest
             * @static
             * @param {kritor.authentication.AddTicketRequest} message AddTicketRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            AddTicketRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.account = "";
                    object.superTicket = "";
                    object.ticket = "";
                }
                if (message.account != null && message.hasOwnProperty("account"))
                    object.account = message.account;
                if (message.superTicket != null && message.hasOwnProperty("superTicket"))
                    object.superTicket = message.superTicket;
                if (message.ticket != null && message.hasOwnProperty("ticket"))
                    object.ticket = message.ticket;
                return object;
            };

            /**
             * Converts this AddTicketRequest to JSON.
             * @function toJSON
             * @memberof kritor.authentication.AddTicketRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            AddTicketRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for AddTicketRequest
             * @function getTypeUrl
             * @memberof kritor.authentication.AddTicketRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            AddTicketRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.authentication.AddTicketRequest";
            };

            return AddTicketRequest;
        })();

        authentication.AddTicketResponse = (function() {

            /**
             * Properties of an AddTicketResponse.
             * @memberof kritor.authentication
             * @interface IAddTicketResponse
             * @property {kritor.authentication.TicketOperationResponseCode|null} [code] AddTicketResponse code
             * @property {string|null} [msg] AddTicketResponse msg
             */

            /**
             * Constructs a new AddTicketResponse.
             * @memberof kritor.authentication
             * @classdesc Represents an AddTicketResponse.
             * @implements IAddTicketResponse
             * @constructor
             * @param {kritor.authentication.IAddTicketResponse=} [properties] Properties to set
             */
            function AddTicketResponse(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * AddTicketResponse code.
             * @member {kritor.authentication.TicketOperationResponseCode} code
             * @memberof kritor.authentication.AddTicketResponse
             * @instance
             */
            AddTicketResponse.prototype.code = 0;

            /**
             * AddTicketResponse msg.
             * @member {string} msg
             * @memberof kritor.authentication.AddTicketResponse
             * @instance
             */
            AddTicketResponse.prototype.msg = "";

            /**
             * Creates a new AddTicketResponse instance using the specified properties.
             * @function create
             * @memberof kritor.authentication.AddTicketResponse
             * @static
             * @param {kritor.authentication.IAddTicketResponse=} [properties] Properties to set
             * @returns {kritor.authentication.AddTicketResponse} AddTicketResponse instance
             */
            AddTicketResponse.create = function create(properties) {
                return new AddTicketResponse(properties);
            };

            /**
             * Encodes the specified AddTicketResponse message. Does not implicitly {@link kritor.authentication.AddTicketResponse.verify|verify} messages.
             * @function encode
             * @memberof kritor.authentication.AddTicketResponse
             * @static
             * @param {kritor.authentication.IAddTicketResponse} message AddTicketResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            AddTicketResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.code != null && Object.hasOwnProperty.call(message, "code"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int32(message.code);
                if (message.msg != null && Object.hasOwnProperty.call(message, "msg"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.msg);
                return writer;
            };

            /**
             * Encodes the specified AddTicketResponse message, length delimited. Does not implicitly {@link kritor.authentication.AddTicketResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.authentication.AddTicketResponse
             * @static
             * @param {kritor.authentication.IAddTicketResponse} message AddTicketResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            AddTicketResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an AddTicketResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.authentication.AddTicketResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.authentication.AddTicketResponse} AddTicketResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            AddTicketResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.authentication.AddTicketResponse();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.code = reader.int32();
                            break;
                        }
                    case 2: {
                            message.msg = reader.string();
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
             * Decodes an AddTicketResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.authentication.AddTicketResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.authentication.AddTicketResponse} AddTicketResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            AddTicketResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an AddTicketResponse message.
             * @function verify
             * @memberof kritor.authentication.AddTicketResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            AddTicketResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.code != null && message.hasOwnProperty("code"))
                    switch (message.code) {
                    default:
                        return "code: enum value expected";
                    case 0:
                    case 1:
                        break;
                    }
                if (message.msg != null && message.hasOwnProperty("msg"))
                    if (!$util.isString(message.msg))
                        return "msg: string expected";
                return null;
            };

            /**
             * Creates an AddTicketResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.authentication.AddTicketResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.authentication.AddTicketResponse} AddTicketResponse
             */
            AddTicketResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.authentication.AddTicketResponse)
                    return object;
                let message = new $root.kritor.authentication.AddTicketResponse();
                switch (object.code) {
                default:
                    if (typeof object.code === "number") {
                        message.code = object.code;
                        break;
                    }
                    break;
                case "OK":
                case 0:
                    message.code = 0;
                    break;
                case "ERROR":
                case 1:
                    message.code = 1;
                    break;
                }
                if (object.msg != null)
                    message.msg = String(object.msg);
                return message;
            };

            /**
             * Creates a plain object from an AddTicketResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.authentication.AddTicketResponse
             * @static
             * @param {kritor.authentication.AddTicketResponse} message AddTicketResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            AddTicketResponse.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.code = options.enums === String ? "OK" : 0;
                    object.msg = "";
                }
                if (message.code != null && message.hasOwnProperty("code"))
                    object.code = options.enums === String ? $root.kritor.authentication.TicketOperationResponseCode[message.code] === undefined ? message.code : $root.kritor.authentication.TicketOperationResponseCode[message.code] : message.code;
                if (message.msg != null && message.hasOwnProperty("msg"))
                    object.msg = message.msg;
                return object;
            };

            /**
             * Converts this AddTicketResponse to JSON.
             * @function toJSON
             * @memberof kritor.authentication.AddTicketResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            AddTicketResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for AddTicketResponse
             * @function getTypeUrl
             * @memberof kritor.authentication.AddTicketResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            AddTicketResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.authentication.AddTicketResponse";
            };

            return AddTicketResponse;
        })();

        authentication.DeleteTicketRequest = (function() {

            /**
             * Properties of a DeleteTicketRequest.
             * @memberof kritor.authentication
             * @interface IDeleteTicketRequest
             * @property {string|null} [account] DeleteTicketRequest account
             * @property {string|null} [superTicket] DeleteTicketRequest superTicket
             * @property {string|null} [ticket] DeleteTicketRequest ticket
             */

            /**
             * Constructs a new DeleteTicketRequest.
             * @memberof kritor.authentication
             * @classdesc Represents a DeleteTicketRequest.
             * @implements IDeleteTicketRequest
             * @constructor
             * @param {kritor.authentication.IDeleteTicketRequest=} [properties] Properties to set
             */
            function DeleteTicketRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * DeleteTicketRequest account.
             * @member {string} account
             * @memberof kritor.authentication.DeleteTicketRequest
             * @instance
             */
            DeleteTicketRequest.prototype.account = "";

            /**
             * DeleteTicketRequest superTicket.
             * @member {string} superTicket
             * @memberof kritor.authentication.DeleteTicketRequest
             * @instance
             */
            DeleteTicketRequest.prototype.superTicket = "";

            /**
             * DeleteTicketRequest ticket.
             * @member {string} ticket
             * @memberof kritor.authentication.DeleteTicketRequest
             * @instance
             */
            DeleteTicketRequest.prototype.ticket = "";

            /**
             * Creates a new DeleteTicketRequest instance using the specified properties.
             * @function create
             * @memberof kritor.authentication.DeleteTicketRequest
             * @static
             * @param {kritor.authentication.IDeleteTicketRequest=} [properties] Properties to set
             * @returns {kritor.authentication.DeleteTicketRequest} DeleteTicketRequest instance
             */
            DeleteTicketRequest.create = function create(properties) {
                return new DeleteTicketRequest(properties);
            };

            /**
             * Encodes the specified DeleteTicketRequest message. Does not implicitly {@link kritor.authentication.DeleteTicketRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.authentication.DeleteTicketRequest
             * @static
             * @param {kritor.authentication.IDeleteTicketRequest} message DeleteTicketRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DeleteTicketRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.account != null && Object.hasOwnProperty.call(message, "account"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.account);
                if (message.superTicket != null && Object.hasOwnProperty.call(message, "superTicket"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.superTicket);
                if (message.ticket != null && Object.hasOwnProperty.call(message, "ticket"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.ticket);
                return writer;
            };

            /**
             * Encodes the specified DeleteTicketRequest message, length delimited. Does not implicitly {@link kritor.authentication.DeleteTicketRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.authentication.DeleteTicketRequest
             * @static
             * @param {kritor.authentication.IDeleteTicketRequest} message DeleteTicketRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DeleteTicketRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a DeleteTicketRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.authentication.DeleteTicketRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.authentication.DeleteTicketRequest} DeleteTicketRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DeleteTicketRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.authentication.DeleteTicketRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.account = reader.string();
                            break;
                        }
                    case 2: {
                            message.superTicket = reader.string();
                            break;
                        }
                    case 3: {
                            message.ticket = reader.string();
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
             * Decodes a DeleteTicketRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.authentication.DeleteTicketRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.authentication.DeleteTicketRequest} DeleteTicketRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DeleteTicketRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a DeleteTicketRequest message.
             * @function verify
             * @memberof kritor.authentication.DeleteTicketRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            DeleteTicketRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.account != null && message.hasOwnProperty("account"))
                    if (!$util.isString(message.account))
                        return "account: string expected";
                if (message.superTicket != null && message.hasOwnProperty("superTicket"))
                    if (!$util.isString(message.superTicket))
                        return "superTicket: string expected";
                if (message.ticket != null && message.hasOwnProperty("ticket"))
                    if (!$util.isString(message.ticket))
                        return "ticket: string expected";
                return null;
            };

            /**
             * Creates a DeleteTicketRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.authentication.DeleteTicketRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.authentication.DeleteTicketRequest} DeleteTicketRequest
             */
            DeleteTicketRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.authentication.DeleteTicketRequest)
                    return object;
                let message = new $root.kritor.authentication.DeleteTicketRequest();
                if (object.account != null)
                    message.account = String(object.account);
                if (object.superTicket != null)
                    message.superTicket = String(object.superTicket);
                if (object.ticket != null)
                    message.ticket = String(object.ticket);
                return message;
            };

            /**
             * Creates a plain object from a DeleteTicketRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.authentication.DeleteTicketRequest
             * @static
             * @param {kritor.authentication.DeleteTicketRequest} message DeleteTicketRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            DeleteTicketRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.account = "";
                    object.superTicket = "";
                    object.ticket = "";
                }
                if (message.account != null && message.hasOwnProperty("account"))
                    object.account = message.account;
                if (message.superTicket != null && message.hasOwnProperty("superTicket"))
                    object.superTicket = message.superTicket;
                if (message.ticket != null && message.hasOwnProperty("ticket"))
                    object.ticket = message.ticket;
                return object;
            };

            /**
             * Converts this DeleteTicketRequest to JSON.
             * @function toJSON
             * @memberof kritor.authentication.DeleteTicketRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            DeleteTicketRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for DeleteTicketRequest
             * @function getTypeUrl
             * @memberof kritor.authentication.DeleteTicketRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            DeleteTicketRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.authentication.DeleteTicketRequest";
            };

            return DeleteTicketRequest;
        })();

        authentication.DeleteTicketResponse = (function() {

            /**
             * Properties of a DeleteTicketResponse.
             * @memberof kritor.authentication
             * @interface IDeleteTicketResponse
             * @property {kritor.authentication.TicketOperationResponseCode|null} [code] DeleteTicketResponse code
             * @property {string|null} [msg] DeleteTicketResponse msg
             */

            /**
             * Constructs a new DeleteTicketResponse.
             * @memberof kritor.authentication
             * @classdesc Represents a DeleteTicketResponse.
             * @implements IDeleteTicketResponse
             * @constructor
             * @param {kritor.authentication.IDeleteTicketResponse=} [properties] Properties to set
             */
            function DeleteTicketResponse(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * DeleteTicketResponse code.
             * @member {kritor.authentication.TicketOperationResponseCode} code
             * @memberof kritor.authentication.DeleteTicketResponse
             * @instance
             */
            DeleteTicketResponse.prototype.code = 0;

            /**
             * DeleteTicketResponse msg.
             * @member {string} msg
             * @memberof kritor.authentication.DeleteTicketResponse
             * @instance
             */
            DeleteTicketResponse.prototype.msg = "";

            /**
             * Creates a new DeleteTicketResponse instance using the specified properties.
             * @function create
             * @memberof kritor.authentication.DeleteTicketResponse
             * @static
             * @param {kritor.authentication.IDeleteTicketResponse=} [properties] Properties to set
             * @returns {kritor.authentication.DeleteTicketResponse} DeleteTicketResponse instance
             */
            DeleteTicketResponse.create = function create(properties) {
                return new DeleteTicketResponse(properties);
            };

            /**
             * Encodes the specified DeleteTicketResponse message. Does not implicitly {@link kritor.authentication.DeleteTicketResponse.verify|verify} messages.
             * @function encode
             * @memberof kritor.authentication.DeleteTicketResponse
             * @static
             * @param {kritor.authentication.IDeleteTicketResponse} message DeleteTicketResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DeleteTicketResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.code != null && Object.hasOwnProperty.call(message, "code"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int32(message.code);
                if (message.msg != null && Object.hasOwnProperty.call(message, "msg"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.msg);
                return writer;
            };

            /**
             * Encodes the specified DeleteTicketResponse message, length delimited. Does not implicitly {@link kritor.authentication.DeleteTicketResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.authentication.DeleteTicketResponse
             * @static
             * @param {kritor.authentication.IDeleteTicketResponse} message DeleteTicketResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DeleteTicketResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a DeleteTicketResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.authentication.DeleteTicketResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.authentication.DeleteTicketResponse} DeleteTicketResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DeleteTicketResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.authentication.DeleteTicketResponse();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.code = reader.int32();
                            break;
                        }
                    case 2: {
                            message.msg = reader.string();
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
             * Decodes a DeleteTicketResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.authentication.DeleteTicketResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.authentication.DeleteTicketResponse} DeleteTicketResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DeleteTicketResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a DeleteTicketResponse message.
             * @function verify
             * @memberof kritor.authentication.DeleteTicketResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            DeleteTicketResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.code != null && message.hasOwnProperty("code"))
                    switch (message.code) {
                    default:
                        return "code: enum value expected";
                    case 0:
                    case 1:
                        break;
                    }
                if (message.msg != null && message.hasOwnProperty("msg"))
                    if (!$util.isString(message.msg))
                        return "msg: string expected";
                return null;
            };

            /**
             * Creates a DeleteTicketResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.authentication.DeleteTicketResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.authentication.DeleteTicketResponse} DeleteTicketResponse
             */
            DeleteTicketResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.authentication.DeleteTicketResponse)
                    return object;
                let message = new $root.kritor.authentication.DeleteTicketResponse();
                switch (object.code) {
                default:
                    if (typeof object.code === "number") {
                        message.code = object.code;
                        break;
                    }
                    break;
                case "OK":
                case 0:
                    message.code = 0;
                    break;
                case "ERROR":
                case 1:
                    message.code = 1;
                    break;
                }
                if (object.msg != null)
                    message.msg = String(object.msg);
                return message;
            };

            /**
             * Creates a plain object from a DeleteTicketResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.authentication.DeleteTicketResponse
             * @static
             * @param {kritor.authentication.DeleteTicketResponse} message DeleteTicketResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            DeleteTicketResponse.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.code = options.enums === String ? "OK" : 0;
                    object.msg = "";
                }
                if (message.code != null && message.hasOwnProperty("code"))
                    object.code = options.enums === String ? $root.kritor.authentication.TicketOperationResponseCode[message.code] === undefined ? message.code : $root.kritor.authentication.TicketOperationResponseCode[message.code] : message.code;
                if (message.msg != null && message.hasOwnProperty("msg"))
                    object.msg = message.msg;
                return object;
            };

            /**
             * Converts this DeleteTicketResponse to JSON.
             * @function toJSON
             * @memberof kritor.authentication.DeleteTicketResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            DeleteTicketResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for DeleteTicketResponse
             * @function getTypeUrl
             * @memberof kritor.authentication.DeleteTicketResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            DeleteTicketResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.authentication.DeleteTicketResponse";
            };

            return DeleteTicketResponse;
        })();

        return authentication;
    })();

    return kritor;
})();

export { $root as default };
