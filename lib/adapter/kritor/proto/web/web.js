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

    kritor.web = (function() {

        /**
         * Namespace web.
         * @memberof kritor
         * @namespace
         */
        const web = {};

        web.WebService = (function() {

            /**
             * Constructs a new WebService service.
             * @memberof kritor.web
             * @classdesc Represents a WebService
             * @extends $protobuf.rpc.Service
             * @constructor
             * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
             * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
             * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
             */
            function WebService(rpcImpl, requestDelimited, responseDelimited) {
                $protobuf.rpc.Service.call(this, rpcImpl, requestDelimited, responseDelimited);
            }

            (WebService.prototype = Object.create($protobuf.rpc.Service.prototype)).constructor = WebService;

            /**
             * Creates new WebService service using the specified rpc implementation.
             * @function create
             * @memberof kritor.web.WebService
             * @static
             * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
             * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
             * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
             * @returns {WebService} RPC service. Useful where requests and/or responses are streamed.
             */
            WebService.create = function create(rpcImpl, requestDelimited, responseDelimited) {
                return new this(rpcImpl, requestDelimited, responseDelimited);
            };

            /**
             * Callback as used by {@link kritor.web.WebService#getCookies}.
             * @memberof kritor.web.WebService
             * @typedef GetCookiesCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.web.GetCookiesResponse} [response] GetCookiesResponse
             */

            /**
             * Calls GetCookies.
             * @function getCookies
             * @memberof kritor.web.WebService
             * @instance
             * @param {kritor.web.IGetCookiesRequest} request GetCookiesRequest message or plain object
             * @param {kritor.web.WebService.GetCookiesCallback} callback Node-style callback called with the error, if any, and GetCookiesResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(WebService.prototype.getCookies = function getCookies(request, callback) {
                return this.rpcCall(getCookies, $root.kritor.web.GetCookiesRequest, $root.kritor.web.GetCookiesResponse, request, callback);
            }, "name", { value: "GetCookies" });

            /**
             * Calls GetCookies.
             * @function getCookies
             * @memberof kritor.web.WebService
             * @instance
             * @param {kritor.web.IGetCookiesRequest} request GetCookiesRequest message or plain object
             * @returns {Promise<kritor.web.GetCookiesResponse>} Promise
             * @variation 2
             */

            /**
             * Callback as used by {@link kritor.web.WebService#getCredentials}.
             * @memberof kritor.web.WebService
             * @typedef GetCredentialsCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.web.GetCredentialsResponse} [response] GetCredentialsResponse
             */

            /**
             * Calls GetCredentials.
             * @function getCredentials
             * @memberof kritor.web.WebService
             * @instance
             * @param {kritor.web.IGetCredentialsRequest} request GetCredentialsRequest message or plain object
             * @param {kritor.web.WebService.GetCredentialsCallback} callback Node-style callback called with the error, if any, and GetCredentialsResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(WebService.prototype.getCredentials = function getCredentials(request, callback) {
                return this.rpcCall(getCredentials, $root.kritor.web.GetCredentialsRequest, $root.kritor.web.GetCredentialsResponse, request, callback);
            }, "name", { value: "GetCredentials" });

            /**
             * Calls GetCredentials.
             * @function getCredentials
             * @memberof kritor.web.WebService
             * @instance
             * @param {kritor.web.IGetCredentialsRequest} request GetCredentialsRequest message or plain object
             * @returns {Promise<kritor.web.GetCredentialsResponse>} Promise
             * @variation 2
             */

            /**
             * Callback as used by {@link kritor.web.WebService#getCSRFToken}.
             * @memberof kritor.web.WebService
             * @typedef GetCSRFTokenCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.web.GetCSRFTokenResponse} [response] GetCSRFTokenResponse
             */

            /**
             * Calls GetCSRFToken.
             * @function getCSRFToken
             * @memberof kritor.web.WebService
             * @instance
             * @param {kritor.web.IGetCSRFTokenRequest} request GetCSRFTokenRequest message or plain object
             * @param {kritor.web.WebService.GetCSRFTokenCallback} callback Node-style callback called with the error, if any, and GetCSRFTokenResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(WebService.prototype.getCSRFToken = function getCSRFToken(request, callback) {
                return this.rpcCall(getCSRFToken, $root.kritor.web.GetCSRFTokenRequest, $root.kritor.web.GetCSRFTokenResponse, request, callback);
            }, "name", { value: "GetCSRFToken" });

            /**
             * Calls GetCSRFToken.
             * @function getCSRFToken
             * @memberof kritor.web.WebService
             * @instance
             * @param {kritor.web.IGetCSRFTokenRequest} request GetCSRFTokenRequest message or plain object
             * @returns {Promise<kritor.web.GetCSRFTokenResponse>} Promise
             * @variation 2
             */

            /**
             * Callback as used by {@link kritor.web.WebService#getHttpCookies}.
             * @memberof kritor.web.WebService
             * @typedef GetHttpCookiesCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.web.GetHttpCookiesResponse} [response] GetHttpCookiesResponse
             */

            /**
             * Calls GetHttpCookies.
             * @function getHttpCookies
             * @memberof kritor.web.WebService
             * @instance
             * @param {kritor.web.IGetHttpCookiesRequest} request GetHttpCookiesRequest message or plain object
             * @param {kritor.web.WebService.GetHttpCookiesCallback} callback Node-style callback called with the error, if any, and GetHttpCookiesResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(WebService.prototype.getHttpCookies = function getHttpCookies(request, callback) {
                return this.rpcCall(getHttpCookies, $root.kritor.web.GetHttpCookiesRequest, $root.kritor.web.GetHttpCookiesResponse, request, callback);
            }, "name", { value: "GetHttpCookies" });

            /**
             * Calls GetHttpCookies.
             * @function getHttpCookies
             * @memberof kritor.web.WebService
             * @instance
             * @param {kritor.web.IGetHttpCookiesRequest} request GetHttpCookiesRequest message or plain object
             * @returns {Promise<kritor.web.GetHttpCookiesResponse>} Promise
             * @variation 2
             */

            return WebService;
        })();

        web.GetCookiesRequest = (function() {

            /**
             * Properties of a GetCookiesRequest.
             * @memberof kritor.web
             * @interface IGetCookiesRequest
             * @property {string|null} [domain] GetCookiesRequest domain
             */

            /**
             * Constructs a new GetCookiesRequest.
             * @memberof kritor.web
             * @classdesc Represents a GetCookiesRequest.
             * @implements IGetCookiesRequest
             * @constructor
             * @param {kritor.web.IGetCookiesRequest=} [properties] Properties to set
             */
            function GetCookiesRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetCookiesRequest domain.
             * @member {string|null|undefined} domain
             * @memberof kritor.web.GetCookiesRequest
             * @instance
             */
            GetCookiesRequest.prototype.domain = null;

            // OneOf field names bound to virtual getters and setters
            let $oneOfFields;

            /**
             * GetCookiesRequest _domain.
             * @member {"domain"|undefined} _domain
             * @memberof kritor.web.GetCookiesRequest
             * @instance
             */
            Object.defineProperty(GetCookiesRequest.prototype, "_domain", {
                get: $util.oneOfGetter($oneOfFields = ["domain"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new GetCookiesRequest instance using the specified properties.
             * @function create
             * @memberof kritor.web.GetCookiesRequest
             * @static
             * @param {kritor.web.IGetCookiesRequest=} [properties] Properties to set
             * @returns {kritor.web.GetCookiesRequest} GetCookiesRequest instance
             */
            GetCookiesRequest.create = function create(properties) {
                return new GetCookiesRequest(properties);
            };

            /**
             * Encodes the specified GetCookiesRequest message. Does not implicitly {@link kritor.web.GetCookiesRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.web.GetCookiesRequest
             * @static
             * @param {kritor.web.IGetCookiesRequest} message GetCookiesRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetCookiesRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.domain != null && Object.hasOwnProperty.call(message, "domain"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.domain);
                return writer;
            };

            /**
             * Encodes the specified GetCookiesRequest message, length delimited. Does not implicitly {@link kritor.web.GetCookiesRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.web.GetCookiesRequest
             * @static
             * @param {kritor.web.IGetCookiesRequest} message GetCookiesRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetCookiesRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetCookiesRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.web.GetCookiesRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.web.GetCookiesRequest} GetCookiesRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetCookiesRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.web.GetCookiesRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.domain = reader.string();
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
             * Decodes a GetCookiesRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.web.GetCookiesRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.web.GetCookiesRequest} GetCookiesRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetCookiesRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetCookiesRequest message.
             * @function verify
             * @memberof kritor.web.GetCookiesRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetCookiesRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                let properties = {};
                if (message.domain != null && message.hasOwnProperty("domain")) {
                    properties._domain = 1;
                    if (!$util.isString(message.domain))
                        return "domain: string expected";
                }
                return null;
            };

            /**
             * Creates a GetCookiesRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.web.GetCookiesRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.web.GetCookiesRequest} GetCookiesRequest
             */
            GetCookiesRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.web.GetCookiesRequest)
                    return object;
                let message = new $root.kritor.web.GetCookiesRequest();
                if (object.domain != null)
                    message.domain = String(object.domain);
                return message;
            };

            /**
             * Creates a plain object from a GetCookiesRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.web.GetCookiesRequest
             * @static
             * @param {kritor.web.GetCookiesRequest} message GetCookiesRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetCookiesRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (message.domain != null && message.hasOwnProperty("domain")) {
                    object.domain = message.domain;
                    if (options.oneofs)
                        object._domain = "domain";
                }
                return object;
            };

            /**
             * Converts this GetCookiesRequest to JSON.
             * @function toJSON
             * @memberof kritor.web.GetCookiesRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetCookiesRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GetCookiesRequest
             * @function getTypeUrl
             * @memberof kritor.web.GetCookiesRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetCookiesRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.web.GetCookiesRequest";
            };

            return GetCookiesRequest;
        })();

        web.GetCookiesResponse = (function() {

            /**
             * Properties of a GetCookiesResponse.
             * @memberof kritor.web
             * @interface IGetCookiesResponse
             * @property {string|null} [cookie] GetCookiesResponse cookie
             */

            /**
             * Constructs a new GetCookiesResponse.
             * @memberof kritor.web
             * @classdesc Represents a GetCookiesResponse.
             * @implements IGetCookiesResponse
             * @constructor
             * @param {kritor.web.IGetCookiesResponse=} [properties] Properties to set
             */
            function GetCookiesResponse(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetCookiesResponse cookie.
             * @member {string} cookie
             * @memberof kritor.web.GetCookiesResponse
             * @instance
             */
            GetCookiesResponse.prototype.cookie = "";

            /**
             * Creates a new GetCookiesResponse instance using the specified properties.
             * @function create
             * @memberof kritor.web.GetCookiesResponse
             * @static
             * @param {kritor.web.IGetCookiesResponse=} [properties] Properties to set
             * @returns {kritor.web.GetCookiesResponse} GetCookiesResponse instance
             */
            GetCookiesResponse.create = function create(properties) {
                return new GetCookiesResponse(properties);
            };

            /**
             * Encodes the specified GetCookiesResponse message. Does not implicitly {@link kritor.web.GetCookiesResponse.verify|verify} messages.
             * @function encode
             * @memberof kritor.web.GetCookiesResponse
             * @static
             * @param {kritor.web.IGetCookiesResponse} message GetCookiesResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetCookiesResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.cookie != null && Object.hasOwnProperty.call(message, "cookie"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.cookie);
                return writer;
            };

            /**
             * Encodes the specified GetCookiesResponse message, length delimited. Does not implicitly {@link kritor.web.GetCookiesResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.web.GetCookiesResponse
             * @static
             * @param {kritor.web.IGetCookiesResponse} message GetCookiesResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetCookiesResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetCookiesResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.web.GetCookiesResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.web.GetCookiesResponse} GetCookiesResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetCookiesResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.web.GetCookiesResponse();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.cookie = reader.string();
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
             * Decodes a GetCookiesResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.web.GetCookiesResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.web.GetCookiesResponse} GetCookiesResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetCookiesResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetCookiesResponse message.
             * @function verify
             * @memberof kritor.web.GetCookiesResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetCookiesResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.cookie != null && message.hasOwnProperty("cookie"))
                    if (!$util.isString(message.cookie))
                        return "cookie: string expected";
                return null;
            };

            /**
             * Creates a GetCookiesResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.web.GetCookiesResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.web.GetCookiesResponse} GetCookiesResponse
             */
            GetCookiesResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.web.GetCookiesResponse)
                    return object;
                let message = new $root.kritor.web.GetCookiesResponse();
                if (object.cookie != null)
                    message.cookie = String(object.cookie);
                return message;
            };

            /**
             * Creates a plain object from a GetCookiesResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.web.GetCookiesResponse
             * @static
             * @param {kritor.web.GetCookiesResponse} message GetCookiesResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetCookiesResponse.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults)
                    object.cookie = "";
                if (message.cookie != null && message.hasOwnProperty("cookie"))
                    object.cookie = message.cookie;
                return object;
            };

            /**
             * Converts this GetCookiesResponse to JSON.
             * @function toJSON
             * @memberof kritor.web.GetCookiesResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetCookiesResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GetCookiesResponse
             * @function getTypeUrl
             * @memberof kritor.web.GetCookiesResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetCookiesResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.web.GetCookiesResponse";
            };

            return GetCookiesResponse;
        })();

        web.GetCredentialsRequest = (function() {

            /**
             * Properties of a GetCredentialsRequest.
             * @memberof kritor.web
             * @interface IGetCredentialsRequest
             * @property {string|null} [domain] GetCredentialsRequest domain
             */

            /**
             * Constructs a new GetCredentialsRequest.
             * @memberof kritor.web
             * @classdesc Represents a GetCredentialsRequest.
             * @implements IGetCredentialsRequest
             * @constructor
             * @param {kritor.web.IGetCredentialsRequest=} [properties] Properties to set
             */
            function GetCredentialsRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetCredentialsRequest domain.
             * @member {string|null|undefined} domain
             * @memberof kritor.web.GetCredentialsRequest
             * @instance
             */
            GetCredentialsRequest.prototype.domain = null;

            // OneOf field names bound to virtual getters and setters
            let $oneOfFields;

            /**
             * GetCredentialsRequest _domain.
             * @member {"domain"|undefined} _domain
             * @memberof kritor.web.GetCredentialsRequest
             * @instance
             */
            Object.defineProperty(GetCredentialsRequest.prototype, "_domain", {
                get: $util.oneOfGetter($oneOfFields = ["domain"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new GetCredentialsRequest instance using the specified properties.
             * @function create
             * @memberof kritor.web.GetCredentialsRequest
             * @static
             * @param {kritor.web.IGetCredentialsRequest=} [properties] Properties to set
             * @returns {kritor.web.GetCredentialsRequest} GetCredentialsRequest instance
             */
            GetCredentialsRequest.create = function create(properties) {
                return new GetCredentialsRequest(properties);
            };

            /**
             * Encodes the specified GetCredentialsRequest message. Does not implicitly {@link kritor.web.GetCredentialsRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.web.GetCredentialsRequest
             * @static
             * @param {kritor.web.IGetCredentialsRequest} message GetCredentialsRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetCredentialsRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.domain != null && Object.hasOwnProperty.call(message, "domain"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.domain);
                return writer;
            };

            /**
             * Encodes the specified GetCredentialsRequest message, length delimited. Does not implicitly {@link kritor.web.GetCredentialsRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.web.GetCredentialsRequest
             * @static
             * @param {kritor.web.IGetCredentialsRequest} message GetCredentialsRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetCredentialsRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetCredentialsRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.web.GetCredentialsRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.web.GetCredentialsRequest} GetCredentialsRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetCredentialsRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.web.GetCredentialsRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.domain = reader.string();
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
             * Decodes a GetCredentialsRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.web.GetCredentialsRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.web.GetCredentialsRequest} GetCredentialsRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetCredentialsRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetCredentialsRequest message.
             * @function verify
             * @memberof kritor.web.GetCredentialsRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetCredentialsRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                let properties = {};
                if (message.domain != null && message.hasOwnProperty("domain")) {
                    properties._domain = 1;
                    if (!$util.isString(message.domain))
                        return "domain: string expected";
                }
                return null;
            };

            /**
             * Creates a GetCredentialsRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.web.GetCredentialsRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.web.GetCredentialsRequest} GetCredentialsRequest
             */
            GetCredentialsRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.web.GetCredentialsRequest)
                    return object;
                let message = new $root.kritor.web.GetCredentialsRequest();
                if (object.domain != null)
                    message.domain = String(object.domain);
                return message;
            };

            /**
             * Creates a plain object from a GetCredentialsRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.web.GetCredentialsRequest
             * @static
             * @param {kritor.web.GetCredentialsRequest} message GetCredentialsRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetCredentialsRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (message.domain != null && message.hasOwnProperty("domain")) {
                    object.domain = message.domain;
                    if (options.oneofs)
                        object._domain = "domain";
                }
                return object;
            };

            /**
             * Converts this GetCredentialsRequest to JSON.
             * @function toJSON
             * @memberof kritor.web.GetCredentialsRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetCredentialsRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GetCredentialsRequest
             * @function getTypeUrl
             * @memberof kritor.web.GetCredentialsRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetCredentialsRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.web.GetCredentialsRequest";
            };

            return GetCredentialsRequest;
        })();

        web.GetCredentialsResponse = (function() {

            /**
             * Properties of a GetCredentialsResponse.
             * @memberof kritor.web
             * @interface IGetCredentialsResponse
             * @property {string|null} [bkn] GetCredentialsResponse bkn
             * @property {string|null} [cookie] GetCredentialsResponse cookie
             */

            /**
             * Constructs a new GetCredentialsResponse.
             * @memberof kritor.web
             * @classdesc Represents a GetCredentialsResponse.
             * @implements IGetCredentialsResponse
             * @constructor
             * @param {kritor.web.IGetCredentialsResponse=} [properties] Properties to set
             */
            function GetCredentialsResponse(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetCredentialsResponse bkn.
             * @member {string} bkn
             * @memberof kritor.web.GetCredentialsResponse
             * @instance
             */
            GetCredentialsResponse.prototype.bkn = "";

            /**
             * GetCredentialsResponse cookie.
             * @member {string} cookie
             * @memberof kritor.web.GetCredentialsResponse
             * @instance
             */
            GetCredentialsResponse.prototype.cookie = "";

            /**
             * Creates a new GetCredentialsResponse instance using the specified properties.
             * @function create
             * @memberof kritor.web.GetCredentialsResponse
             * @static
             * @param {kritor.web.IGetCredentialsResponse=} [properties] Properties to set
             * @returns {kritor.web.GetCredentialsResponse} GetCredentialsResponse instance
             */
            GetCredentialsResponse.create = function create(properties) {
                return new GetCredentialsResponse(properties);
            };

            /**
             * Encodes the specified GetCredentialsResponse message. Does not implicitly {@link kritor.web.GetCredentialsResponse.verify|verify} messages.
             * @function encode
             * @memberof kritor.web.GetCredentialsResponse
             * @static
             * @param {kritor.web.IGetCredentialsResponse} message GetCredentialsResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetCredentialsResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.bkn != null && Object.hasOwnProperty.call(message, "bkn"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.bkn);
                if (message.cookie != null && Object.hasOwnProperty.call(message, "cookie"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.cookie);
                return writer;
            };

            /**
             * Encodes the specified GetCredentialsResponse message, length delimited. Does not implicitly {@link kritor.web.GetCredentialsResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.web.GetCredentialsResponse
             * @static
             * @param {kritor.web.IGetCredentialsResponse} message GetCredentialsResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetCredentialsResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetCredentialsResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.web.GetCredentialsResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.web.GetCredentialsResponse} GetCredentialsResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetCredentialsResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.web.GetCredentialsResponse();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.bkn = reader.string();
                            break;
                        }
                    case 2: {
                            message.cookie = reader.string();
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
             * Decodes a GetCredentialsResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.web.GetCredentialsResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.web.GetCredentialsResponse} GetCredentialsResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetCredentialsResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetCredentialsResponse message.
             * @function verify
             * @memberof kritor.web.GetCredentialsResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetCredentialsResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.bkn != null && message.hasOwnProperty("bkn"))
                    if (!$util.isString(message.bkn))
                        return "bkn: string expected";
                if (message.cookie != null && message.hasOwnProperty("cookie"))
                    if (!$util.isString(message.cookie))
                        return "cookie: string expected";
                return null;
            };

            /**
             * Creates a GetCredentialsResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.web.GetCredentialsResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.web.GetCredentialsResponse} GetCredentialsResponse
             */
            GetCredentialsResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.web.GetCredentialsResponse)
                    return object;
                let message = new $root.kritor.web.GetCredentialsResponse();
                if (object.bkn != null)
                    message.bkn = String(object.bkn);
                if (object.cookie != null)
                    message.cookie = String(object.cookie);
                return message;
            };

            /**
             * Creates a plain object from a GetCredentialsResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.web.GetCredentialsResponse
             * @static
             * @param {kritor.web.GetCredentialsResponse} message GetCredentialsResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetCredentialsResponse.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.bkn = "";
                    object.cookie = "";
                }
                if (message.bkn != null && message.hasOwnProperty("bkn"))
                    object.bkn = message.bkn;
                if (message.cookie != null && message.hasOwnProperty("cookie"))
                    object.cookie = message.cookie;
                return object;
            };

            /**
             * Converts this GetCredentialsResponse to JSON.
             * @function toJSON
             * @memberof kritor.web.GetCredentialsResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetCredentialsResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GetCredentialsResponse
             * @function getTypeUrl
             * @memberof kritor.web.GetCredentialsResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetCredentialsResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.web.GetCredentialsResponse";
            };

            return GetCredentialsResponse;
        })();

        web.GetCSRFTokenRequest = (function() {

            /**
             * Properties of a GetCSRFTokenRequest.
             * @memberof kritor.web
             * @interface IGetCSRFTokenRequest
             * @property {string|null} [domain] GetCSRFTokenRequest domain
             */

            /**
             * Constructs a new GetCSRFTokenRequest.
             * @memberof kritor.web
             * @classdesc Represents a GetCSRFTokenRequest.
             * @implements IGetCSRFTokenRequest
             * @constructor
             * @param {kritor.web.IGetCSRFTokenRequest=} [properties] Properties to set
             */
            function GetCSRFTokenRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetCSRFTokenRequest domain.
             * @member {string|null|undefined} domain
             * @memberof kritor.web.GetCSRFTokenRequest
             * @instance
             */
            GetCSRFTokenRequest.prototype.domain = null;

            // OneOf field names bound to virtual getters and setters
            let $oneOfFields;

            /**
             * GetCSRFTokenRequest _domain.
             * @member {"domain"|undefined} _domain
             * @memberof kritor.web.GetCSRFTokenRequest
             * @instance
             */
            Object.defineProperty(GetCSRFTokenRequest.prototype, "_domain", {
                get: $util.oneOfGetter($oneOfFields = ["domain"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new GetCSRFTokenRequest instance using the specified properties.
             * @function create
             * @memberof kritor.web.GetCSRFTokenRequest
             * @static
             * @param {kritor.web.IGetCSRFTokenRequest=} [properties] Properties to set
             * @returns {kritor.web.GetCSRFTokenRequest} GetCSRFTokenRequest instance
             */
            GetCSRFTokenRequest.create = function create(properties) {
                return new GetCSRFTokenRequest(properties);
            };

            /**
             * Encodes the specified GetCSRFTokenRequest message. Does not implicitly {@link kritor.web.GetCSRFTokenRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.web.GetCSRFTokenRequest
             * @static
             * @param {kritor.web.IGetCSRFTokenRequest} message GetCSRFTokenRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetCSRFTokenRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.domain != null && Object.hasOwnProperty.call(message, "domain"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.domain);
                return writer;
            };

            /**
             * Encodes the specified GetCSRFTokenRequest message, length delimited. Does not implicitly {@link kritor.web.GetCSRFTokenRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.web.GetCSRFTokenRequest
             * @static
             * @param {kritor.web.IGetCSRFTokenRequest} message GetCSRFTokenRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetCSRFTokenRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetCSRFTokenRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.web.GetCSRFTokenRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.web.GetCSRFTokenRequest} GetCSRFTokenRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetCSRFTokenRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.web.GetCSRFTokenRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.domain = reader.string();
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
             * Decodes a GetCSRFTokenRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.web.GetCSRFTokenRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.web.GetCSRFTokenRequest} GetCSRFTokenRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetCSRFTokenRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetCSRFTokenRequest message.
             * @function verify
             * @memberof kritor.web.GetCSRFTokenRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetCSRFTokenRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                let properties = {};
                if (message.domain != null && message.hasOwnProperty("domain")) {
                    properties._domain = 1;
                    if (!$util.isString(message.domain))
                        return "domain: string expected";
                }
                return null;
            };

            /**
             * Creates a GetCSRFTokenRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.web.GetCSRFTokenRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.web.GetCSRFTokenRequest} GetCSRFTokenRequest
             */
            GetCSRFTokenRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.web.GetCSRFTokenRequest)
                    return object;
                let message = new $root.kritor.web.GetCSRFTokenRequest();
                if (object.domain != null)
                    message.domain = String(object.domain);
                return message;
            };

            /**
             * Creates a plain object from a GetCSRFTokenRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.web.GetCSRFTokenRequest
             * @static
             * @param {kritor.web.GetCSRFTokenRequest} message GetCSRFTokenRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetCSRFTokenRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (message.domain != null && message.hasOwnProperty("domain")) {
                    object.domain = message.domain;
                    if (options.oneofs)
                        object._domain = "domain";
                }
                return object;
            };

            /**
             * Converts this GetCSRFTokenRequest to JSON.
             * @function toJSON
             * @memberof kritor.web.GetCSRFTokenRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetCSRFTokenRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GetCSRFTokenRequest
             * @function getTypeUrl
             * @memberof kritor.web.GetCSRFTokenRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetCSRFTokenRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.web.GetCSRFTokenRequest";
            };

            return GetCSRFTokenRequest;
        })();

        web.GetCSRFTokenResponse = (function() {

            /**
             * Properties of a GetCSRFTokenResponse.
             * @memberof kritor.web
             * @interface IGetCSRFTokenResponse
             * @property {string|null} [bkn] GetCSRFTokenResponse bkn
             */

            /**
             * Constructs a new GetCSRFTokenResponse.
             * @memberof kritor.web
             * @classdesc Represents a GetCSRFTokenResponse.
             * @implements IGetCSRFTokenResponse
             * @constructor
             * @param {kritor.web.IGetCSRFTokenResponse=} [properties] Properties to set
             */
            function GetCSRFTokenResponse(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetCSRFTokenResponse bkn.
             * @member {string} bkn
             * @memberof kritor.web.GetCSRFTokenResponse
             * @instance
             */
            GetCSRFTokenResponse.prototype.bkn = "";

            /**
             * Creates a new GetCSRFTokenResponse instance using the specified properties.
             * @function create
             * @memberof kritor.web.GetCSRFTokenResponse
             * @static
             * @param {kritor.web.IGetCSRFTokenResponse=} [properties] Properties to set
             * @returns {kritor.web.GetCSRFTokenResponse} GetCSRFTokenResponse instance
             */
            GetCSRFTokenResponse.create = function create(properties) {
                return new GetCSRFTokenResponse(properties);
            };

            /**
             * Encodes the specified GetCSRFTokenResponse message. Does not implicitly {@link kritor.web.GetCSRFTokenResponse.verify|verify} messages.
             * @function encode
             * @memberof kritor.web.GetCSRFTokenResponse
             * @static
             * @param {kritor.web.IGetCSRFTokenResponse} message GetCSRFTokenResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetCSRFTokenResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.bkn != null && Object.hasOwnProperty.call(message, "bkn"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.bkn);
                return writer;
            };

            /**
             * Encodes the specified GetCSRFTokenResponse message, length delimited. Does not implicitly {@link kritor.web.GetCSRFTokenResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.web.GetCSRFTokenResponse
             * @static
             * @param {kritor.web.IGetCSRFTokenResponse} message GetCSRFTokenResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetCSRFTokenResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetCSRFTokenResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.web.GetCSRFTokenResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.web.GetCSRFTokenResponse} GetCSRFTokenResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetCSRFTokenResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.web.GetCSRFTokenResponse();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.bkn = reader.string();
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
             * Decodes a GetCSRFTokenResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.web.GetCSRFTokenResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.web.GetCSRFTokenResponse} GetCSRFTokenResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetCSRFTokenResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetCSRFTokenResponse message.
             * @function verify
             * @memberof kritor.web.GetCSRFTokenResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetCSRFTokenResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.bkn != null && message.hasOwnProperty("bkn"))
                    if (!$util.isString(message.bkn))
                        return "bkn: string expected";
                return null;
            };

            /**
             * Creates a GetCSRFTokenResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.web.GetCSRFTokenResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.web.GetCSRFTokenResponse} GetCSRFTokenResponse
             */
            GetCSRFTokenResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.web.GetCSRFTokenResponse)
                    return object;
                let message = new $root.kritor.web.GetCSRFTokenResponse();
                if (object.bkn != null)
                    message.bkn = String(object.bkn);
                return message;
            };

            /**
             * Creates a plain object from a GetCSRFTokenResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.web.GetCSRFTokenResponse
             * @static
             * @param {kritor.web.GetCSRFTokenResponse} message GetCSRFTokenResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetCSRFTokenResponse.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults)
                    object.bkn = "";
                if (message.bkn != null && message.hasOwnProperty("bkn"))
                    object.bkn = message.bkn;
                return object;
            };

            /**
             * Converts this GetCSRFTokenResponse to JSON.
             * @function toJSON
             * @memberof kritor.web.GetCSRFTokenResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetCSRFTokenResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GetCSRFTokenResponse
             * @function getTypeUrl
             * @memberof kritor.web.GetCSRFTokenResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetCSRFTokenResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.web.GetCSRFTokenResponse";
            };

            return GetCSRFTokenResponse;
        })();

        web.GetHttpCookiesRequest = (function() {

            /**
             * Properties of a GetHttpCookiesRequest.
             * @memberof kritor.web
             * @interface IGetHttpCookiesRequest
             * @property {string|null} [appid] GetHttpCookiesRequest appid
             * @property {string|null} [daid] GetHttpCookiesRequest daid
             * @property {string|null} [jumpUrl] GetHttpCookiesRequest jumpUrl
             */

            /**
             * Constructs a new GetHttpCookiesRequest.
             * @memberof kritor.web
             * @classdesc Represents a GetHttpCookiesRequest.
             * @implements IGetHttpCookiesRequest
             * @constructor
             * @param {kritor.web.IGetHttpCookiesRequest=} [properties] Properties to set
             */
            function GetHttpCookiesRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetHttpCookiesRequest appid.
             * @member {string} appid
             * @memberof kritor.web.GetHttpCookiesRequest
             * @instance
             */
            GetHttpCookiesRequest.prototype.appid = "";

            /**
             * GetHttpCookiesRequest daid.
             * @member {string} daid
             * @memberof kritor.web.GetHttpCookiesRequest
             * @instance
             */
            GetHttpCookiesRequest.prototype.daid = "";

            /**
             * GetHttpCookiesRequest jumpUrl.
             * @member {string} jumpUrl
             * @memberof kritor.web.GetHttpCookiesRequest
             * @instance
             */
            GetHttpCookiesRequest.prototype.jumpUrl = "";

            /**
             * Creates a new GetHttpCookiesRequest instance using the specified properties.
             * @function create
             * @memberof kritor.web.GetHttpCookiesRequest
             * @static
             * @param {kritor.web.IGetHttpCookiesRequest=} [properties] Properties to set
             * @returns {kritor.web.GetHttpCookiesRequest} GetHttpCookiesRequest instance
             */
            GetHttpCookiesRequest.create = function create(properties) {
                return new GetHttpCookiesRequest(properties);
            };

            /**
             * Encodes the specified GetHttpCookiesRequest message. Does not implicitly {@link kritor.web.GetHttpCookiesRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.web.GetHttpCookiesRequest
             * @static
             * @param {kritor.web.IGetHttpCookiesRequest} message GetHttpCookiesRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetHttpCookiesRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.appid != null && Object.hasOwnProperty.call(message, "appid"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.appid);
                if (message.daid != null && Object.hasOwnProperty.call(message, "daid"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.daid);
                if (message.jumpUrl != null && Object.hasOwnProperty.call(message, "jumpUrl"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.jumpUrl);
                return writer;
            };

            /**
             * Encodes the specified GetHttpCookiesRequest message, length delimited. Does not implicitly {@link kritor.web.GetHttpCookiesRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.web.GetHttpCookiesRequest
             * @static
             * @param {kritor.web.IGetHttpCookiesRequest} message GetHttpCookiesRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetHttpCookiesRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetHttpCookiesRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.web.GetHttpCookiesRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.web.GetHttpCookiesRequest} GetHttpCookiesRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetHttpCookiesRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.web.GetHttpCookiesRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.appid = reader.string();
                            break;
                        }
                    case 2: {
                            message.daid = reader.string();
                            break;
                        }
                    case 3: {
                            message.jumpUrl = reader.string();
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
             * Decodes a GetHttpCookiesRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.web.GetHttpCookiesRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.web.GetHttpCookiesRequest} GetHttpCookiesRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetHttpCookiesRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetHttpCookiesRequest message.
             * @function verify
             * @memberof kritor.web.GetHttpCookiesRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetHttpCookiesRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.appid != null && message.hasOwnProperty("appid"))
                    if (!$util.isString(message.appid))
                        return "appid: string expected";
                if (message.daid != null && message.hasOwnProperty("daid"))
                    if (!$util.isString(message.daid))
                        return "daid: string expected";
                if (message.jumpUrl != null && message.hasOwnProperty("jumpUrl"))
                    if (!$util.isString(message.jumpUrl))
                        return "jumpUrl: string expected";
                return null;
            };

            /**
             * Creates a GetHttpCookiesRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.web.GetHttpCookiesRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.web.GetHttpCookiesRequest} GetHttpCookiesRequest
             */
            GetHttpCookiesRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.web.GetHttpCookiesRequest)
                    return object;
                let message = new $root.kritor.web.GetHttpCookiesRequest();
                if (object.appid != null)
                    message.appid = String(object.appid);
                if (object.daid != null)
                    message.daid = String(object.daid);
                if (object.jumpUrl != null)
                    message.jumpUrl = String(object.jumpUrl);
                return message;
            };

            /**
             * Creates a plain object from a GetHttpCookiesRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.web.GetHttpCookiesRequest
             * @static
             * @param {kritor.web.GetHttpCookiesRequest} message GetHttpCookiesRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetHttpCookiesRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.appid = "";
                    object.daid = "";
                    object.jumpUrl = "";
                }
                if (message.appid != null && message.hasOwnProperty("appid"))
                    object.appid = message.appid;
                if (message.daid != null && message.hasOwnProperty("daid"))
                    object.daid = message.daid;
                if (message.jumpUrl != null && message.hasOwnProperty("jumpUrl"))
                    object.jumpUrl = message.jumpUrl;
                return object;
            };

            /**
             * Converts this GetHttpCookiesRequest to JSON.
             * @function toJSON
             * @memberof kritor.web.GetHttpCookiesRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetHttpCookiesRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GetHttpCookiesRequest
             * @function getTypeUrl
             * @memberof kritor.web.GetHttpCookiesRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetHttpCookiesRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.web.GetHttpCookiesRequest";
            };

            return GetHttpCookiesRequest;
        })();

        web.GetHttpCookiesResponse = (function() {

            /**
             * Properties of a GetHttpCookiesResponse.
             * @memberof kritor.web
             * @interface IGetHttpCookiesResponse
             * @property {string|null} [cookie] GetHttpCookiesResponse cookie
             */

            /**
             * Constructs a new GetHttpCookiesResponse.
             * @memberof kritor.web
             * @classdesc Represents a GetHttpCookiesResponse.
             * @implements IGetHttpCookiesResponse
             * @constructor
             * @param {kritor.web.IGetHttpCookiesResponse=} [properties] Properties to set
             */
            function GetHttpCookiesResponse(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetHttpCookiesResponse cookie.
             * @member {string} cookie
             * @memberof kritor.web.GetHttpCookiesResponse
             * @instance
             */
            GetHttpCookiesResponse.prototype.cookie = "";

            /**
             * Creates a new GetHttpCookiesResponse instance using the specified properties.
             * @function create
             * @memberof kritor.web.GetHttpCookiesResponse
             * @static
             * @param {kritor.web.IGetHttpCookiesResponse=} [properties] Properties to set
             * @returns {kritor.web.GetHttpCookiesResponse} GetHttpCookiesResponse instance
             */
            GetHttpCookiesResponse.create = function create(properties) {
                return new GetHttpCookiesResponse(properties);
            };

            /**
             * Encodes the specified GetHttpCookiesResponse message. Does not implicitly {@link kritor.web.GetHttpCookiesResponse.verify|verify} messages.
             * @function encode
             * @memberof kritor.web.GetHttpCookiesResponse
             * @static
             * @param {kritor.web.IGetHttpCookiesResponse} message GetHttpCookiesResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetHttpCookiesResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.cookie != null && Object.hasOwnProperty.call(message, "cookie"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.cookie);
                return writer;
            };

            /**
             * Encodes the specified GetHttpCookiesResponse message, length delimited. Does not implicitly {@link kritor.web.GetHttpCookiesResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.web.GetHttpCookiesResponse
             * @static
             * @param {kritor.web.IGetHttpCookiesResponse} message GetHttpCookiesResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetHttpCookiesResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetHttpCookiesResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.web.GetHttpCookiesResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.web.GetHttpCookiesResponse} GetHttpCookiesResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetHttpCookiesResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.web.GetHttpCookiesResponse();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.cookie = reader.string();
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
             * Decodes a GetHttpCookiesResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.web.GetHttpCookiesResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.web.GetHttpCookiesResponse} GetHttpCookiesResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetHttpCookiesResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetHttpCookiesResponse message.
             * @function verify
             * @memberof kritor.web.GetHttpCookiesResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetHttpCookiesResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.cookie != null && message.hasOwnProperty("cookie"))
                    if (!$util.isString(message.cookie))
                        return "cookie: string expected";
                return null;
            };

            /**
             * Creates a GetHttpCookiesResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.web.GetHttpCookiesResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.web.GetHttpCookiesResponse} GetHttpCookiesResponse
             */
            GetHttpCookiesResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.web.GetHttpCookiesResponse)
                    return object;
                let message = new $root.kritor.web.GetHttpCookiesResponse();
                if (object.cookie != null)
                    message.cookie = String(object.cookie);
                return message;
            };

            /**
             * Creates a plain object from a GetHttpCookiesResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.web.GetHttpCookiesResponse
             * @static
             * @param {kritor.web.GetHttpCookiesResponse} message GetHttpCookiesResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetHttpCookiesResponse.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults)
                    object.cookie = "";
                if (message.cookie != null && message.hasOwnProperty("cookie"))
                    object.cookie = message.cookie;
                return object;
            };

            /**
             * Converts this GetHttpCookiesResponse to JSON.
             * @function toJSON
             * @memberof kritor.web.GetHttpCookiesResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetHttpCookiesResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GetHttpCookiesResponse
             * @function getTypeUrl
             * @memberof kritor.web.GetHttpCookiesResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetHttpCookiesResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.web.GetHttpCookiesResponse";
            };

            return GetHttpCookiesResponse;
        })();

        return web;
    })();

    return kritor;
})();

export { $root as default };
