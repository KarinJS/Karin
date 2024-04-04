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

    kritor.friend = (function() {

        /**
         * Namespace friend.
         * @memberof kritor
         * @namespace
         */
        const friend = {};

        friend.FriendService = (function() {

            /**
             * Constructs a new FriendService service.
             * @memberof kritor.friend
             * @classdesc Represents a FriendService
             * @extends $protobuf.rpc.Service
             * @constructor
             * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
             * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
             * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
             */
            function FriendService(rpcImpl, requestDelimited, responseDelimited) {
                $protobuf.rpc.Service.call(this, rpcImpl, requestDelimited, responseDelimited);
            }

            (FriendService.prototype = Object.create($protobuf.rpc.Service.prototype)).constructor = FriendService;

            /**
             * Creates new FriendService service using the specified rpc implementation.
             * @function create
             * @memberof kritor.friend.FriendService
             * @static
             * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
             * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
             * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
             * @returns {FriendService} RPC service. Useful where requests and/or responses are streamed.
             */
            FriendService.create = function create(rpcImpl, requestDelimited, responseDelimited) {
                return new this(rpcImpl, requestDelimited, responseDelimited);
            };

            /**
             * Callback as used by {@link kritor.friend.FriendService#getFriendList}.
             * @memberof kritor.friend.FriendService
             * @typedef GetFriendListCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.friend.GetFriendListResponse} [response] GetFriendListResponse
             */

            /**
             * Calls GetFriendList.
             * @function getFriendList
             * @memberof kritor.friend.FriendService
             * @instance
             * @param {kritor.friend.IGetFriendListRequest} request GetFriendListRequest message or plain object
             * @param {kritor.friend.FriendService.GetFriendListCallback} callback Node-style callback called with the error, if any, and GetFriendListResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(FriendService.prototype.getFriendList = function getFriendList(request, callback) {
                return this.rpcCall(getFriendList, $root.kritor.friend.GetFriendListRequest, $root.kritor.friend.GetFriendListResponse, request, callback);
            }, "name", { value: "GetFriendList" });

            /**
             * Calls GetFriendList.
             * @function getFriendList
             * @memberof kritor.friend.FriendService
             * @instance
             * @param {kritor.friend.IGetFriendListRequest} request GetFriendListRequest message or plain object
             * @returns {Promise<kritor.friend.GetFriendListResponse>} Promise
             * @variation 2
             */

            /**
             * Callback as used by {@link kritor.friend.FriendService#getFriendProfileCard}.
             * @memberof kritor.friend.FriendService
             * @typedef GetFriendProfileCardCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.friend.GetFriendProfileCardResponse} [response] GetFriendProfileCardResponse
             */

            /**
             * Calls GetFriendProfileCard.
             * @function getFriendProfileCard
             * @memberof kritor.friend.FriendService
             * @instance
             * @param {kritor.friend.IGetFriendProfileCardRequest} request GetFriendProfileCardRequest message or plain object
             * @param {kritor.friend.FriendService.GetFriendProfileCardCallback} callback Node-style callback called with the error, if any, and GetFriendProfileCardResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(FriendService.prototype.getFriendProfileCard = function getFriendProfileCard(request, callback) {
                return this.rpcCall(getFriendProfileCard, $root.kritor.friend.GetFriendProfileCardRequest, $root.kritor.friend.GetFriendProfileCardResponse, request, callback);
            }, "name", { value: "GetFriendProfileCard" });

            /**
             * Calls GetFriendProfileCard.
             * @function getFriendProfileCard
             * @memberof kritor.friend.FriendService
             * @instance
             * @param {kritor.friend.IGetFriendProfileCardRequest} request GetFriendProfileCardRequest message or plain object
             * @returns {Promise<kritor.friend.GetFriendProfileCardResponse>} Promise
             * @variation 2
             */

            /**
             * Callback as used by {@link kritor.friend.FriendService#getStrangerProfileCard}.
             * @memberof kritor.friend.FriendService
             * @typedef GetStrangerProfileCardCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.friend.GetStrangerProfileCardResponse} [response] GetStrangerProfileCardResponse
             */

            /**
             * Calls GetStrangerProfileCard.
             * @function getStrangerProfileCard
             * @memberof kritor.friend.FriendService
             * @instance
             * @param {kritor.friend.IGetStrangerProfileCardRequest} request GetStrangerProfileCardRequest message or plain object
             * @param {kritor.friend.FriendService.GetStrangerProfileCardCallback} callback Node-style callback called with the error, if any, and GetStrangerProfileCardResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(FriendService.prototype.getStrangerProfileCard = function getStrangerProfileCard(request, callback) {
                return this.rpcCall(getStrangerProfileCard, $root.kritor.friend.GetStrangerProfileCardRequest, $root.kritor.friend.GetStrangerProfileCardResponse, request, callback);
            }, "name", { value: "GetStrangerProfileCard" });

            /**
             * Calls GetStrangerProfileCard.
             * @function getStrangerProfileCard
             * @memberof kritor.friend.FriendService
             * @instance
             * @param {kritor.friend.IGetStrangerProfileCardRequest} request GetStrangerProfileCardRequest message or plain object
             * @returns {Promise<kritor.friend.GetStrangerProfileCardResponse>} Promise
             * @variation 2
             */

            /**
             * Callback as used by {@link kritor.friend.FriendService#setProfileCard}.
             * @memberof kritor.friend.FriendService
             * @typedef SetProfileCardCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.friend.SetProfileCardResponse} [response] SetProfileCardResponse
             */

            /**
             * Calls SetProfileCard.
             * @function setProfileCard
             * @memberof kritor.friend.FriendService
             * @instance
             * @param {kritor.friend.ISetProfileCardRequest} request SetProfileCardRequest message or plain object
             * @param {kritor.friend.FriendService.SetProfileCardCallback} callback Node-style callback called with the error, if any, and SetProfileCardResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(FriendService.prototype.setProfileCard = function setProfileCard(request, callback) {
                return this.rpcCall(setProfileCard, $root.kritor.friend.SetProfileCardRequest, $root.kritor.friend.SetProfileCardResponse, request, callback);
            }, "name", { value: "SetProfileCard" });

            /**
             * Calls SetProfileCard.
             * @function setProfileCard
             * @memberof kritor.friend.FriendService
             * @instance
             * @param {kritor.friend.ISetProfileCardRequest} request SetProfileCardRequest message or plain object
             * @returns {Promise<kritor.friend.SetProfileCardResponse>} Promise
             * @variation 2
             */

            /**
             * Callback as used by {@link kritor.friend.FriendService#isBlackListUser}.
             * @memberof kritor.friend.FriendService
             * @typedef IsBlackListUserCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.friend.IsBlackListUserResponse} [response] IsBlackListUserResponse
             */

            /**
             * Calls IsBlackListUser.
             * @function isBlackListUser
             * @memberof kritor.friend.FriendService
             * @instance
             * @param {kritor.friend.IIsBlackListUserRequest} request IsBlackListUserRequest message or plain object
             * @param {kritor.friend.FriendService.IsBlackListUserCallback} callback Node-style callback called with the error, if any, and IsBlackListUserResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(FriendService.prototype.isBlackListUser = function isBlackListUser(request, callback) {
                return this.rpcCall(isBlackListUser, $root.kritor.friend.IsBlackListUserRequest, $root.kritor.friend.IsBlackListUserResponse, request, callback);
            }, "name", { value: "IsBlackListUser" });

            /**
             * Calls IsBlackListUser.
             * @function isBlackListUser
             * @memberof kritor.friend.FriendService
             * @instance
             * @param {kritor.friend.IIsBlackListUserRequest} request IsBlackListUserRequest message or plain object
             * @returns {Promise<kritor.friend.IsBlackListUserResponse>} Promise
             * @variation 2
             */

            /**
             * Callback as used by {@link kritor.friend.FriendService#voteUser}.
             * @memberof kritor.friend.FriendService
             * @typedef VoteUserCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.friend.VoteUserResponse} [response] VoteUserResponse
             */

            /**
             * Calls VoteUser.
             * @function voteUser
             * @memberof kritor.friend.FriendService
             * @instance
             * @param {kritor.friend.IVoteUserRequest} request VoteUserRequest message or plain object
             * @param {kritor.friend.FriendService.VoteUserCallback} callback Node-style callback called with the error, if any, and VoteUserResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(FriendService.prototype.voteUser = function voteUser(request, callback) {
                return this.rpcCall(voteUser, $root.kritor.friend.VoteUserRequest, $root.kritor.friend.VoteUserResponse, request, callback);
            }, "name", { value: "VoteUser" });

            /**
             * Calls VoteUser.
             * @function voteUser
             * @memberof kritor.friend.FriendService
             * @instance
             * @param {kritor.friend.IVoteUserRequest} request VoteUserRequest message or plain object
             * @returns {Promise<kritor.friend.VoteUserResponse>} Promise
             * @variation 2
             */

            /**
             * Callback as used by {@link kritor.friend.FriendService#getUidByUin}.
             * @memberof kritor.friend.FriendService
             * @typedef GetUidByUinCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.friend.GetUidByUinResponse} [response] GetUidByUinResponse
             */

            /**
             * Calls GetUidByUin.
             * @function getUidByUin
             * @memberof kritor.friend.FriendService
             * @instance
             * @param {kritor.friend.IGetUidByUinRequest} request GetUidByUinRequest message or plain object
             * @param {kritor.friend.FriendService.GetUidByUinCallback} callback Node-style callback called with the error, if any, and GetUidByUinResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(FriendService.prototype.getUidByUin = function getUidByUin(request, callback) {
                return this.rpcCall(getUidByUin, $root.kritor.friend.GetUidByUinRequest, $root.kritor.friend.GetUidByUinResponse, request, callback);
            }, "name", { value: "GetUidByUin" });

            /**
             * Calls GetUidByUin.
             * @function getUidByUin
             * @memberof kritor.friend.FriendService
             * @instance
             * @param {kritor.friend.IGetUidByUinRequest} request GetUidByUinRequest message or plain object
             * @returns {Promise<kritor.friend.GetUidByUinResponse>} Promise
             * @variation 2
             */

            /**
             * Callback as used by {@link kritor.friend.FriendService#getUinByUid}.
             * @memberof kritor.friend.FriendService
             * @typedef GetUinByUidCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.friend.GetUinByUidResponse} [response] GetUinByUidResponse
             */

            /**
             * Calls GetUinByUid.
             * @function getUinByUid
             * @memberof kritor.friend.FriendService
             * @instance
             * @param {kritor.friend.IGetUinByUidRequest} request GetUinByUidRequest message or plain object
             * @param {kritor.friend.FriendService.GetUinByUidCallback} callback Node-style callback called with the error, if any, and GetUinByUidResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(FriendService.prototype.getUinByUid = function getUinByUid(request, callback) {
                return this.rpcCall(getUinByUid, $root.kritor.friend.GetUinByUidRequest, $root.kritor.friend.GetUinByUidResponse, request, callback);
            }, "name", { value: "GetUinByUid" });

            /**
             * Calls GetUinByUid.
             * @function getUinByUid
             * @memberof kritor.friend.FriendService
             * @instance
             * @param {kritor.friend.IGetUinByUidRequest} request GetUinByUidRequest message or plain object
             * @returns {Promise<kritor.friend.GetUinByUidResponse>} Promise
             * @variation 2
             */

            return FriendService;
        })();

        friend.GetFriendListRequest = (function() {

            /**
             * Properties of a GetFriendListRequest.
             * @memberof kritor.friend
             * @interface IGetFriendListRequest
             * @property {boolean|null} [refresh] GetFriendListRequest refresh
             */

            /**
             * Constructs a new GetFriendListRequest.
             * @memberof kritor.friend
             * @classdesc Represents a GetFriendListRequest.
             * @implements IGetFriendListRequest
             * @constructor
             * @param {kritor.friend.IGetFriendListRequest=} [properties] Properties to set
             */
            function GetFriendListRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetFriendListRequest refresh.
             * @member {boolean|null|undefined} refresh
             * @memberof kritor.friend.GetFriendListRequest
             * @instance
             */
            GetFriendListRequest.prototype.refresh = null;

            // OneOf field names bound to virtual getters and setters
            let $oneOfFields;

            /**
             * GetFriendListRequest _refresh.
             * @member {"refresh"|undefined} _refresh
             * @memberof kritor.friend.GetFriendListRequest
             * @instance
             */
            Object.defineProperty(GetFriendListRequest.prototype, "_refresh", {
                get: $util.oneOfGetter($oneOfFields = ["refresh"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new GetFriendListRequest instance using the specified properties.
             * @function create
             * @memberof kritor.friend.GetFriendListRequest
             * @static
             * @param {kritor.friend.IGetFriendListRequest=} [properties] Properties to set
             * @returns {kritor.friend.GetFriendListRequest} GetFriendListRequest instance
             */
            GetFriendListRequest.create = function create(properties) {
                return new GetFriendListRequest(properties);
            };

            /**
             * Encodes the specified GetFriendListRequest message. Does not implicitly {@link kritor.friend.GetFriendListRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.friend.GetFriendListRequest
             * @static
             * @param {kritor.friend.IGetFriendListRequest} message GetFriendListRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetFriendListRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.refresh != null && Object.hasOwnProperty.call(message, "refresh"))
                    writer.uint32(/* id 1, wireType 0 =*/8).bool(message.refresh);
                return writer;
            };

            /**
             * Encodes the specified GetFriendListRequest message, length delimited. Does not implicitly {@link kritor.friend.GetFriendListRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.friend.GetFriendListRequest
             * @static
             * @param {kritor.friend.IGetFriendListRequest} message GetFriendListRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetFriendListRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetFriendListRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.friend.GetFriendListRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.friend.GetFriendListRequest} GetFriendListRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetFriendListRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.friend.GetFriendListRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.refresh = reader.bool();
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
             * Decodes a GetFriendListRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.friend.GetFriendListRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.friend.GetFriendListRequest} GetFriendListRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetFriendListRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetFriendListRequest message.
             * @function verify
             * @memberof kritor.friend.GetFriendListRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetFriendListRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                let properties = {};
                if (message.refresh != null && message.hasOwnProperty("refresh")) {
                    properties._refresh = 1;
                    if (typeof message.refresh !== "boolean")
                        return "refresh: boolean expected";
                }
                return null;
            };

            /**
             * Creates a GetFriendListRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.friend.GetFriendListRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.friend.GetFriendListRequest} GetFriendListRequest
             */
            GetFriendListRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.friend.GetFriendListRequest)
                    return object;
                let message = new $root.kritor.friend.GetFriendListRequest();
                if (object.refresh != null)
                    message.refresh = Boolean(object.refresh);
                return message;
            };

            /**
             * Creates a plain object from a GetFriendListRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.friend.GetFriendListRequest
             * @static
             * @param {kritor.friend.GetFriendListRequest} message GetFriendListRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetFriendListRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (message.refresh != null && message.hasOwnProperty("refresh")) {
                    object.refresh = message.refresh;
                    if (options.oneofs)
                        object._refresh = "refresh";
                }
                return object;
            };

            /**
             * Converts this GetFriendListRequest to JSON.
             * @function toJSON
             * @memberof kritor.friend.GetFriendListRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetFriendListRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GetFriendListRequest
             * @function getTypeUrl
             * @memberof kritor.friend.GetFriendListRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetFriendListRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.friend.GetFriendListRequest";
            };

            return GetFriendListRequest;
        })();

        friend.GetFriendListResponse = (function() {

            /**
             * Properties of a GetFriendListResponse.
             * @memberof kritor.friend
             * @interface IGetFriendListResponse
             * @property {Array.<kritor.friend.IFriendInfo>|null} [friendsInfo] GetFriendListResponse friendsInfo
             */

            /**
             * Constructs a new GetFriendListResponse.
             * @memberof kritor.friend
             * @classdesc Represents a GetFriendListResponse.
             * @implements IGetFriendListResponse
             * @constructor
             * @param {kritor.friend.IGetFriendListResponse=} [properties] Properties to set
             */
            function GetFriendListResponse(properties) {
                this.friendsInfo = [];
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetFriendListResponse friendsInfo.
             * @member {Array.<kritor.friend.IFriendInfo>} friendsInfo
             * @memberof kritor.friend.GetFriendListResponse
             * @instance
             */
            GetFriendListResponse.prototype.friendsInfo = $util.emptyArray;

            /**
             * Creates a new GetFriendListResponse instance using the specified properties.
             * @function create
             * @memberof kritor.friend.GetFriendListResponse
             * @static
             * @param {kritor.friend.IGetFriendListResponse=} [properties] Properties to set
             * @returns {kritor.friend.GetFriendListResponse} GetFriendListResponse instance
             */
            GetFriendListResponse.create = function create(properties) {
                return new GetFriendListResponse(properties);
            };

            /**
             * Encodes the specified GetFriendListResponse message. Does not implicitly {@link kritor.friend.GetFriendListResponse.verify|verify} messages.
             * @function encode
             * @memberof kritor.friend.GetFriendListResponse
             * @static
             * @param {kritor.friend.IGetFriendListResponse} message GetFriendListResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetFriendListResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.friendsInfo != null && message.friendsInfo.length)
                    for (let i = 0; i < message.friendsInfo.length; ++i)
                        $root.kritor.friend.FriendInfo.encode(message.friendsInfo[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified GetFriendListResponse message, length delimited. Does not implicitly {@link kritor.friend.GetFriendListResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.friend.GetFriendListResponse
             * @static
             * @param {kritor.friend.IGetFriendListResponse} message GetFriendListResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetFriendListResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetFriendListResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.friend.GetFriendListResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.friend.GetFriendListResponse} GetFriendListResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetFriendListResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.friend.GetFriendListResponse();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            if (!(message.friendsInfo && message.friendsInfo.length))
                                message.friendsInfo = [];
                            message.friendsInfo.push($root.kritor.friend.FriendInfo.decode(reader, reader.uint32()));
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
             * Decodes a GetFriendListResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.friend.GetFriendListResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.friend.GetFriendListResponse} GetFriendListResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetFriendListResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetFriendListResponse message.
             * @function verify
             * @memberof kritor.friend.GetFriendListResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetFriendListResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.friendsInfo != null && message.hasOwnProperty("friendsInfo")) {
                    if (!Array.isArray(message.friendsInfo))
                        return "friendsInfo: array expected";
                    for (let i = 0; i < message.friendsInfo.length; ++i) {
                        let error = $root.kritor.friend.FriendInfo.verify(message.friendsInfo[i]);
                        if (error)
                            return "friendsInfo." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a GetFriendListResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.friend.GetFriendListResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.friend.GetFriendListResponse} GetFriendListResponse
             */
            GetFriendListResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.friend.GetFriendListResponse)
                    return object;
                let message = new $root.kritor.friend.GetFriendListResponse();
                if (object.friendsInfo) {
                    if (!Array.isArray(object.friendsInfo))
                        throw TypeError(".kritor.friend.GetFriendListResponse.friendsInfo: array expected");
                    message.friendsInfo = [];
                    for (let i = 0; i < object.friendsInfo.length; ++i) {
                        if (typeof object.friendsInfo[i] !== "object")
                            throw TypeError(".kritor.friend.GetFriendListResponse.friendsInfo: object expected");
                        message.friendsInfo[i] = $root.kritor.friend.FriendInfo.fromObject(object.friendsInfo[i]);
                    }
                }
                return message;
            };

            /**
             * Creates a plain object from a GetFriendListResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.friend.GetFriendListResponse
             * @static
             * @param {kritor.friend.GetFriendListResponse} message GetFriendListResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetFriendListResponse.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.arrays || options.defaults)
                    object.friendsInfo = [];
                if (message.friendsInfo && message.friendsInfo.length) {
                    object.friendsInfo = [];
                    for (let j = 0; j < message.friendsInfo.length; ++j)
                        object.friendsInfo[j] = $root.kritor.friend.FriendInfo.toObject(message.friendsInfo[j], options);
                }
                return object;
            };

            /**
             * Converts this GetFriendListResponse to JSON.
             * @function toJSON
             * @memberof kritor.friend.GetFriendListResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetFriendListResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GetFriendListResponse
             * @function getTypeUrl
             * @memberof kritor.friend.GetFriendListResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetFriendListResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.friend.GetFriendListResponse";
            };

            return GetFriendListResponse;
        })();

        friend.GetFriendProfileCardRequest = (function() {

            /**
             * Properties of a GetFriendProfileCardRequest.
             * @memberof kritor.friend
             * @interface IGetFriendProfileCardRequest
             * @property {Array.<string>|null} [targetUids] GetFriendProfileCardRequest targetUids
             * @property {Array.<number|Long>|null} [targetUins] GetFriendProfileCardRequest targetUins
             */

            /**
             * Constructs a new GetFriendProfileCardRequest.
             * @memberof kritor.friend
             * @classdesc Represents a GetFriendProfileCardRequest.
             * @implements IGetFriendProfileCardRequest
             * @constructor
             * @param {kritor.friend.IGetFriendProfileCardRequest=} [properties] Properties to set
             */
            function GetFriendProfileCardRequest(properties) {
                this.targetUids = [];
                this.targetUins = [];
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetFriendProfileCardRequest targetUids.
             * @member {Array.<string>} targetUids
             * @memberof kritor.friend.GetFriendProfileCardRequest
             * @instance
             */
            GetFriendProfileCardRequest.prototype.targetUids = $util.emptyArray;

            /**
             * GetFriendProfileCardRequest targetUins.
             * @member {Array.<number|Long>} targetUins
             * @memberof kritor.friend.GetFriendProfileCardRequest
             * @instance
             */
            GetFriendProfileCardRequest.prototype.targetUins = $util.emptyArray;

            /**
             * Creates a new GetFriendProfileCardRequest instance using the specified properties.
             * @function create
             * @memberof kritor.friend.GetFriendProfileCardRequest
             * @static
             * @param {kritor.friend.IGetFriendProfileCardRequest=} [properties] Properties to set
             * @returns {kritor.friend.GetFriendProfileCardRequest} GetFriendProfileCardRequest instance
             */
            GetFriendProfileCardRequest.create = function create(properties) {
                return new GetFriendProfileCardRequest(properties);
            };

            /**
             * Encodes the specified GetFriendProfileCardRequest message. Does not implicitly {@link kritor.friend.GetFriendProfileCardRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.friend.GetFriendProfileCardRequest
             * @static
             * @param {kritor.friend.IGetFriendProfileCardRequest} message GetFriendProfileCardRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetFriendProfileCardRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.targetUids != null && message.targetUids.length)
                    for (let i = 0; i < message.targetUids.length; ++i)
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.targetUids[i]);
                if (message.targetUins != null && message.targetUins.length) {
                    writer.uint32(/* id 2, wireType 2 =*/18).fork();
                    for (let i = 0; i < message.targetUins.length; ++i)
                        writer.uint64(message.targetUins[i]);
                    writer.ldelim();
                }
                return writer;
            };

            /**
             * Encodes the specified GetFriendProfileCardRequest message, length delimited. Does not implicitly {@link kritor.friend.GetFriendProfileCardRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.friend.GetFriendProfileCardRequest
             * @static
             * @param {kritor.friend.IGetFriendProfileCardRequest} message GetFriendProfileCardRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetFriendProfileCardRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetFriendProfileCardRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.friend.GetFriendProfileCardRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.friend.GetFriendProfileCardRequest} GetFriendProfileCardRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetFriendProfileCardRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.friend.GetFriendProfileCardRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            if (!(message.targetUids && message.targetUids.length))
                                message.targetUids = [];
                            message.targetUids.push(reader.string());
                            break;
                        }
                    case 2: {
                            if (!(message.targetUins && message.targetUins.length))
                                message.targetUins = [];
                            if ((tag & 7) === 2) {
                                let end2 = reader.uint32() + reader.pos;
                                while (reader.pos < end2)
                                    message.targetUins.push(reader.uint64());
                            } else
                                message.targetUins.push(reader.uint64());
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
             * Decodes a GetFriendProfileCardRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.friend.GetFriendProfileCardRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.friend.GetFriendProfileCardRequest} GetFriendProfileCardRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetFriendProfileCardRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetFriendProfileCardRequest message.
             * @function verify
             * @memberof kritor.friend.GetFriendProfileCardRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetFriendProfileCardRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.targetUids != null && message.hasOwnProperty("targetUids")) {
                    if (!Array.isArray(message.targetUids))
                        return "targetUids: array expected";
                    for (let i = 0; i < message.targetUids.length; ++i)
                        if (!$util.isString(message.targetUids[i]))
                            return "targetUids: string[] expected";
                }
                if (message.targetUins != null && message.hasOwnProperty("targetUins")) {
                    if (!Array.isArray(message.targetUins))
                        return "targetUins: array expected";
                    for (let i = 0; i < message.targetUins.length; ++i)
                        if (!$util.isInteger(message.targetUins[i]) && !(message.targetUins[i] && $util.isInteger(message.targetUins[i].low) && $util.isInteger(message.targetUins[i].high)))
                            return "targetUins: integer|Long[] expected";
                }
                return null;
            };

            /**
             * Creates a GetFriendProfileCardRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.friend.GetFriendProfileCardRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.friend.GetFriendProfileCardRequest} GetFriendProfileCardRequest
             */
            GetFriendProfileCardRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.friend.GetFriendProfileCardRequest)
                    return object;
                let message = new $root.kritor.friend.GetFriendProfileCardRequest();
                if (object.targetUids) {
                    if (!Array.isArray(object.targetUids))
                        throw TypeError(".kritor.friend.GetFriendProfileCardRequest.targetUids: array expected");
                    message.targetUids = [];
                    for (let i = 0; i < object.targetUids.length; ++i)
                        message.targetUids[i] = String(object.targetUids[i]);
                }
                if (object.targetUins) {
                    if (!Array.isArray(object.targetUins))
                        throw TypeError(".kritor.friend.GetFriendProfileCardRequest.targetUins: array expected");
                    message.targetUins = [];
                    for (let i = 0; i < object.targetUins.length; ++i)
                        if ($util.Long)
                            (message.targetUins[i] = $util.Long.fromValue(object.targetUins[i])).unsigned = true;
                        else if (typeof object.targetUins[i] === "string")
                            message.targetUins[i] = parseInt(object.targetUins[i], 10);
                        else if (typeof object.targetUins[i] === "number")
                            message.targetUins[i] = object.targetUins[i];
                        else if (typeof object.targetUins[i] === "object")
                            message.targetUins[i] = new $util.LongBits(object.targetUins[i].low >>> 0, object.targetUins[i].high >>> 0).toNumber(true);
                }
                return message;
            };

            /**
             * Creates a plain object from a GetFriendProfileCardRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.friend.GetFriendProfileCardRequest
             * @static
             * @param {kritor.friend.GetFriendProfileCardRequest} message GetFriendProfileCardRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetFriendProfileCardRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.arrays || options.defaults) {
                    object.targetUids = [];
                    object.targetUins = [];
                }
                if (message.targetUids && message.targetUids.length) {
                    object.targetUids = [];
                    for (let j = 0; j < message.targetUids.length; ++j)
                        object.targetUids[j] = message.targetUids[j];
                }
                if (message.targetUins && message.targetUins.length) {
                    object.targetUins = [];
                    for (let j = 0; j < message.targetUins.length; ++j)
                        if (typeof message.targetUins[j] === "number")
                            object.targetUins[j] = options.longs === String ? String(message.targetUins[j]) : message.targetUins[j];
                        else
                            object.targetUins[j] = options.longs === String ? $util.Long.prototype.toString.call(message.targetUins[j]) : options.longs === Number ? new $util.LongBits(message.targetUins[j].low >>> 0, message.targetUins[j].high >>> 0).toNumber(true) : message.targetUins[j];
                }
                return object;
            };

            /**
             * Converts this GetFriendProfileCardRequest to JSON.
             * @function toJSON
             * @memberof kritor.friend.GetFriendProfileCardRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetFriendProfileCardRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GetFriendProfileCardRequest
             * @function getTypeUrl
             * @memberof kritor.friend.GetFriendProfileCardRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetFriendProfileCardRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.friend.GetFriendProfileCardRequest";
            };

            return GetFriendProfileCardRequest;
        })();

        friend.GetFriendProfileCardResponse = (function() {

            /**
             * Properties of a GetFriendProfileCardResponse.
             * @memberof kritor.friend
             * @interface IGetFriendProfileCardResponse
             * @property {Array.<kritor.friend.IProfileCard>|null} [friendsProfileCard] GetFriendProfileCardResponse friendsProfileCard
             */

            /**
             * Constructs a new GetFriendProfileCardResponse.
             * @memberof kritor.friend
             * @classdesc Represents a GetFriendProfileCardResponse.
             * @implements IGetFriendProfileCardResponse
             * @constructor
             * @param {kritor.friend.IGetFriendProfileCardResponse=} [properties] Properties to set
             */
            function GetFriendProfileCardResponse(properties) {
                this.friendsProfileCard = [];
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetFriendProfileCardResponse friendsProfileCard.
             * @member {Array.<kritor.friend.IProfileCard>} friendsProfileCard
             * @memberof kritor.friend.GetFriendProfileCardResponse
             * @instance
             */
            GetFriendProfileCardResponse.prototype.friendsProfileCard = $util.emptyArray;

            /**
             * Creates a new GetFriendProfileCardResponse instance using the specified properties.
             * @function create
             * @memberof kritor.friend.GetFriendProfileCardResponse
             * @static
             * @param {kritor.friend.IGetFriendProfileCardResponse=} [properties] Properties to set
             * @returns {kritor.friend.GetFriendProfileCardResponse} GetFriendProfileCardResponse instance
             */
            GetFriendProfileCardResponse.create = function create(properties) {
                return new GetFriendProfileCardResponse(properties);
            };

            /**
             * Encodes the specified GetFriendProfileCardResponse message. Does not implicitly {@link kritor.friend.GetFriendProfileCardResponse.verify|verify} messages.
             * @function encode
             * @memberof kritor.friend.GetFriendProfileCardResponse
             * @static
             * @param {kritor.friend.IGetFriendProfileCardResponse} message GetFriendProfileCardResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetFriendProfileCardResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.friendsProfileCard != null && message.friendsProfileCard.length)
                    for (let i = 0; i < message.friendsProfileCard.length; ++i)
                        $root.kritor.friend.ProfileCard.encode(message.friendsProfileCard[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified GetFriendProfileCardResponse message, length delimited. Does not implicitly {@link kritor.friend.GetFriendProfileCardResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.friend.GetFriendProfileCardResponse
             * @static
             * @param {kritor.friend.IGetFriendProfileCardResponse} message GetFriendProfileCardResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetFriendProfileCardResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetFriendProfileCardResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.friend.GetFriendProfileCardResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.friend.GetFriendProfileCardResponse} GetFriendProfileCardResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetFriendProfileCardResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.friend.GetFriendProfileCardResponse();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            if (!(message.friendsProfileCard && message.friendsProfileCard.length))
                                message.friendsProfileCard = [];
                            message.friendsProfileCard.push($root.kritor.friend.ProfileCard.decode(reader, reader.uint32()));
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
             * Decodes a GetFriendProfileCardResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.friend.GetFriendProfileCardResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.friend.GetFriendProfileCardResponse} GetFriendProfileCardResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetFriendProfileCardResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetFriendProfileCardResponse message.
             * @function verify
             * @memberof kritor.friend.GetFriendProfileCardResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetFriendProfileCardResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.friendsProfileCard != null && message.hasOwnProperty("friendsProfileCard")) {
                    if (!Array.isArray(message.friendsProfileCard))
                        return "friendsProfileCard: array expected";
                    for (let i = 0; i < message.friendsProfileCard.length; ++i) {
                        let error = $root.kritor.friend.ProfileCard.verify(message.friendsProfileCard[i]);
                        if (error)
                            return "friendsProfileCard." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a GetFriendProfileCardResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.friend.GetFriendProfileCardResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.friend.GetFriendProfileCardResponse} GetFriendProfileCardResponse
             */
            GetFriendProfileCardResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.friend.GetFriendProfileCardResponse)
                    return object;
                let message = new $root.kritor.friend.GetFriendProfileCardResponse();
                if (object.friendsProfileCard) {
                    if (!Array.isArray(object.friendsProfileCard))
                        throw TypeError(".kritor.friend.GetFriendProfileCardResponse.friendsProfileCard: array expected");
                    message.friendsProfileCard = [];
                    for (let i = 0; i < object.friendsProfileCard.length; ++i) {
                        if (typeof object.friendsProfileCard[i] !== "object")
                            throw TypeError(".kritor.friend.GetFriendProfileCardResponse.friendsProfileCard: object expected");
                        message.friendsProfileCard[i] = $root.kritor.friend.ProfileCard.fromObject(object.friendsProfileCard[i]);
                    }
                }
                return message;
            };

            /**
             * Creates a plain object from a GetFriendProfileCardResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.friend.GetFriendProfileCardResponse
             * @static
             * @param {kritor.friend.GetFriendProfileCardResponse} message GetFriendProfileCardResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetFriendProfileCardResponse.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.arrays || options.defaults)
                    object.friendsProfileCard = [];
                if (message.friendsProfileCard && message.friendsProfileCard.length) {
                    object.friendsProfileCard = [];
                    for (let j = 0; j < message.friendsProfileCard.length; ++j)
                        object.friendsProfileCard[j] = $root.kritor.friend.ProfileCard.toObject(message.friendsProfileCard[j], options);
                }
                return object;
            };

            /**
             * Converts this GetFriendProfileCardResponse to JSON.
             * @function toJSON
             * @memberof kritor.friend.GetFriendProfileCardResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetFriendProfileCardResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GetFriendProfileCardResponse
             * @function getTypeUrl
             * @memberof kritor.friend.GetFriendProfileCardResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetFriendProfileCardResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.friend.GetFriendProfileCardResponse";
            };

            return GetFriendProfileCardResponse;
        })();

        friend.GetStrangerProfileCardRequest = (function() {

            /**
             * Properties of a GetStrangerProfileCardRequest.
             * @memberof kritor.friend
             * @interface IGetStrangerProfileCardRequest
             * @property {Array.<string>|null} [targetUids] GetStrangerProfileCardRequest targetUids
             * @property {Array.<number|Long>|null} [targetUins] GetStrangerProfileCardRequest targetUins
             */

            /**
             * Constructs a new GetStrangerProfileCardRequest.
             * @memberof kritor.friend
             * @classdesc Represents a GetStrangerProfileCardRequest.
             * @implements IGetStrangerProfileCardRequest
             * @constructor
             * @param {kritor.friend.IGetStrangerProfileCardRequest=} [properties] Properties to set
             */
            function GetStrangerProfileCardRequest(properties) {
                this.targetUids = [];
                this.targetUins = [];
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetStrangerProfileCardRequest targetUids.
             * @member {Array.<string>} targetUids
             * @memberof kritor.friend.GetStrangerProfileCardRequest
             * @instance
             */
            GetStrangerProfileCardRequest.prototype.targetUids = $util.emptyArray;

            /**
             * GetStrangerProfileCardRequest targetUins.
             * @member {Array.<number|Long>} targetUins
             * @memberof kritor.friend.GetStrangerProfileCardRequest
             * @instance
             */
            GetStrangerProfileCardRequest.prototype.targetUins = $util.emptyArray;

            /**
             * Creates a new GetStrangerProfileCardRequest instance using the specified properties.
             * @function create
             * @memberof kritor.friend.GetStrangerProfileCardRequest
             * @static
             * @param {kritor.friend.IGetStrangerProfileCardRequest=} [properties] Properties to set
             * @returns {kritor.friend.GetStrangerProfileCardRequest} GetStrangerProfileCardRequest instance
             */
            GetStrangerProfileCardRequest.create = function create(properties) {
                return new GetStrangerProfileCardRequest(properties);
            };

            /**
             * Encodes the specified GetStrangerProfileCardRequest message. Does not implicitly {@link kritor.friend.GetStrangerProfileCardRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.friend.GetStrangerProfileCardRequest
             * @static
             * @param {kritor.friend.IGetStrangerProfileCardRequest} message GetStrangerProfileCardRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetStrangerProfileCardRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.targetUids != null && message.targetUids.length)
                    for (let i = 0; i < message.targetUids.length; ++i)
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.targetUids[i]);
                if (message.targetUins != null && message.targetUins.length) {
                    writer.uint32(/* id 2, wireType 2 =*/18).fork();
                    for (let i = 0; i < message.targetUins.length; ++i)
                        writer.uint64(message.targetUins[i]);
                    writer.ldelim();
                }
                return writer;
            };

            /**
             * Encodes the specified GetStrangerProfileCardRequest message, length delimited. Does not implicitly {@link kritor.friend.GetStrangerProfileCardRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.friend.GetStrangerProfileCardRequest
             * @static
             * @param {kritor.friend.IGetStrangerProfileCardRequest} message GetStrangerProfileCardRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetStrangerProfileCardRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetStrangerProfileCardRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.friend.GetStrangerProfileCardRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.friend.GetStrangerProfileCardRequest} GetStrangerProfileCardRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetStrangerProfileCardRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.friend.GetStrangerProfileCardRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            if (!(message.targetUids && message.targetUids.length))
                                message.targetUids = [];
                            message.targetUids.push(reader.string());
                            break;
                        }
                    case 2: {
                            if (!(message.targetUins && message.targetUins.length))
                                message.targetUins = [];
                            if ((tag & 7) === 2) {
                                let end2 = reader.uint32() + reader.pos;
                                while (reader.pos < end2)
                                    message.targetUins.push(reader.uint64());
                            } else
                                message.targetUins.push(reader.uint64());
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
             * Decodes a GetStrangerProfileCardRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.friend.GetStrangerProfileCardRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.friend.GetStrangerProfileCardRequest} GetStrangerProfileCardRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetStrangerProfileCardRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetStrangerProfileCardRequest message.
             * @function verify
             * @memberof kritor.friend.GetStrangerProfileCardRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetStrangerProfileCardRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.targetUids != null && message.hasOwnProperty("targetUids")) {
                    if (!Array.isArray(message.targetUids))
                        return "targetUids: array expected";
                    for (let i = 0; i < message.targetUids.length; ++i)
                        if (!$util.isString(message.targetUids[i]))
                            return "targetUids: string[] expected";
                }
                if (message.targetUins != null && message.hasOwnProperty("targetUins")) {
                    if (!Array.isArray(message.targetUins))
                        return "targetUins: array expected";
                    for (let i = 0; i < message.targetUins.length; ++i)
                        if (!$util.isInteger(message.targetUins[i]) && !(message.targetUins[i] && $util.isInteger(message.targetUins[i].low) && $util.isInteger(message.targetUins[i].high)))
                            return "targetUins: integer|Long[] expected";
                }
                return null;
            };

            /**
             * Creates a GetStrangerProfileCardRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.friend.GetStrangerProfileCardRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.friend.GetStrangerProfileCardRequest} GetStrangerProfileCardRequest
             */
            GetStrangerProfileCardRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.friend.GetStrangerProfileCardRequest)
                    return object;
                let message = new $root.kritor.friend.GetStrangerProfileCardRequest();
                if (object.targetUids) {
                    if (!Array.isArray(object.targetUids))
                        throw TypeError(".kritor.friend.GetStrangerProfileCardRequest.targetUids: array expected");
                    message.targetUids = [];
                    for (let i = 0; i < object.targetUids.length; ++i)
                        message.targetUids[i] = String(object.targetUids[i]);
                }
                if (object.targetUins) {
                    if (!Array.isArray(object.targetUins))
                        throw TypeError(".kritor.friend.GetStrangerProfileCardRequest.targetUins: array expected");
                    message.targetUins = [];
                    for (let i = 0; i < object.targetUins.length; ++i)
                        if ($util.Long)
                            (message.targetUins[i] = $util.Long.fromValue(object.targetUins[i])).unsigned = true;
                        else if (typeof object.targetUins[i] === "string")
                            message.targetUins[i] = parseInt(object.targetUins[i], 10);
                        else if (typeof object.targetUins[i] === "number")
                            message.targetUins[i] = object.targetUins[i];
                        else if (typeof object.targetUins[i] === "object")
                            message.targetUins[i] = new $util.LongBits(object.targetUins[i].low >>> 0, object.targetUins[i].high >>> 0).toNumber(true);
                }
                return message;
            };

            /**
             * Creates a plain object from a GetStrangerProfileCardRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.friend.GetStrangerProfileCardRequest
             * @static
             * @param {kritor.friend.GetStrangerProfileCardRequest} message GetStrangerProfileCardRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetStrangerProfileCardRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.arrays || options.defaults) {
                    object.targetUids = [];
                    object.targetUins = [];
                }
                if (message.targetUids && message.targetUids.length) {
                    object.targetUids = [];
                    for (let j = 0; j < message.targetUids.length; ++j)
                        object.targetUids[j] = message.targetUids[j];
                }
                if (message.targetUins && message.targetUins.length) {
                    object.targetUins = [];
                    for (let j = 0; j < message.targetUins.length; ++j)
                        if (typeof message.targetUins[j] === "number")
                            object.targetUins[j] = options.longs === String ? String(message.targetUins[j]) : message.targetUins[j];
                        else
                            object.targetUins[j] = options.longs === String ? $util.Long.prototype.toString.call(message.targetUins[j]) : options.longs === Number ? new $util.LongBits(message.targetUins[j].low >>> 0, message.targetUins[j].high >>> 0).toNumber(true) : message.targetUins[j];
                }
                return object;
            };

            /**
             * Converts this GetStrangerProfileCardRequest to JSON.
             * @function toJSON
             * @memberof kritor.friend.GetStrangerProfileCardRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetStrangerProfileCardRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GetStrangerProfileCardRequest
             * @function getTypeUrl
             * @memberof kritor.friend.GetStrangerProfileCardRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetStrangerProfileCardRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.friend.GetStrangerProfileCardRequest";
            };

            return GetStrangerProfileCardRequest;
        })();

        friend.GetStrangerProfileCardResponse = (function() {

            /**
             * Properties of a GetStrangerProfileCardResponse.
             * @memberof kritor.friend
             * @interface IGetStrangerProfileCardResponse
             * @property {Array.<kritor.friend.IProfileCard>|null} [strangersProfileCard] GetStrangerProfileCardResponse strangersProfileCard
             */

            /**
             * Constructs a new GetStrangerProfileCardResponse.
             * @memberof kritor.friend
             * @classdesc Represents a GetStrangerProfileCardResponse.
             * @implements IGetStrangerProfileCardResponse
             * @constructor
             * @param {kritor.friend.IGetStrangerProfileCardResponse=} [properties] Properties to set
             */
            function GetStrangerProfileCardResponse(properties) {
                this.strangersProfileCard = [];
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetStrangerProfileCardResponse strangersProfileCard.
             * @member {Array.<kritor.friend.IProfileCard>} strangersProfileCard
             * @memberof kritor.friend.GetStrangerProfileCardResponse
             * @instance
             */
            GetStrangerProfileCardResponse.prototype.strangersProfileCard = $util.emptyArray;

            /**
             * Creates a new GetStrangerProfileCardResponse instance using the specified properties.
             * @function create
             * @memberof kritor.friend.GetStrangerProfileCardResponse
             * @static
             * @param {kritor.friend.IGetStrangerProfileCardResponse=} [properties] Properties to set
             * @returns {kritor.friend.GetStrangerProfileCardResponse} GetStrangerProfileCardResponse instance
             */
            GetStrangerProfileCardResponse.create = function create(properties) {
                return new GetStrangerProfileCardResponse(properties);
            };

            /**
             * Encodes the specified GetStrangerProfileCardResponse message. Does not implicitly {@link kritor.friend.GetStrangerProfileCardResponse.verify|verify} messages.
             * @function encode
             * @memberof kritor.friend.GetStrangerProfileCardResponse
             * @static
             * @param {kritor.friend.IGetStrangerProfileCardResponse} message GetStrangerProfileCardResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetStrangerProfileCardResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.strangersProfileCard != null && message.strangersProfileCard.length)
                    for (let i = 0; i < message.strangersProfileCard.length; ++i)
                        $root.kritor.friend.ProfileCard.encode(message.strangersProfileCard[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified GetStrangerProfileCardResponse message, length delimited. Does not implicitly {@link kritor.friend.GetStrangerProfileCardResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.friend.GetStrangerProfileCardResponse
             * @static
             * @param {kritor.friend.IGetStrangerProfileCardResponse} message GetStrangerProfileCardResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetStrangerProfileCardResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetStrangerProfileCardResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.friend.GetStrangerProfileCardResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.friend.GetStrangerProfileCardResponse} GetStrangerProfileCardResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetStrangerProfileCardResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.friend.GetStrangerProfileCardResponse();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            if (!(message.strangersProfileCard && message.strangersProfileCard.length))
                                message.strangersProfileCard = [];
                            message.strangersProfileCard.push($root.kritor.friend.ProfileCard.decode(reader, reader.uint32()));
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
             * Decodes a GetStrangerProfileCardResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.friend.GetStrangerProfileCardResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.friend.GetStrangerProfileCardResponse} GetStrangerProfileCardResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetStrangerProfileCardResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetStrangerProfileCardResponse message.
             * @function verify
             * @memberof kritor.friend.GetStrangerProfileCardResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetStrangerProfileCardResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.strangersProfileCard != null && message.hasOwnProperty("strangersProfileCard")) {
                    if (!Array.isArray(message.strangersProfileCard))
                        return "strangersProfileCard: array expected";
                    for (let i = 0; i < message.strangersProfileCard.length; ++i) {
                        let error = $root.kritor.friend.ProfileCard.verify(message.strangersProfileCard[i]);
                        if (error)
                            return "strangersProfileCard." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a GetStrangerProfileCardResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.friend.GetStrangerProfileCardResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.friend.GetStrangerProfileCardResponse} GetStrangerProfileCardResponse
             */
            GetStrangerProfileCardResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.friend.GetStrangerProfileCardResponse)
                    return object;
                let message = new $root.kritor.friend.GetStrangerProfileCardResponse();
                if (object.strangersProfileCard) {
                    if (!Array.isArray(object.strangersProfileCard))
                        throw TypeError(".kritor.friend.GetStrangerProfileCardResponse.strangersProfileCard: array expected");
                    message.strangersProfileCard = [];
                    for (let i = 0; i < object.strangersProfileCard.length; ++i) {
                        if (typeof object.strangersProfileCard[i] !== "object")
                            throw TypeError(".kritor.friend.GetStrangerProfileCardResponse.strangersProfileCard: object expected");
                        message.strangersProfileCard[i] = $root.kritor.friend.ProfileCard.fromObject(object.strangersProfileCard[i]);
                    }
                }
                return message;
            };

            /**
             * Creates a plain object from a GetStrangerProfileCardResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.friend.GetStrangerProfileCardResponse
             * @static
             * @param {kritor.friend.GetStrangerProfileCardResponse} message GetStrangerProfileCardResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetStrangerProfileCardResponse.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.arrays || options.defaults)
                    object.strangersProfileCard = [];
                if (message.strangersProfileCard && message.strangersProfileCard.length) {
                    object.strangersProfileCard = [];
                    for (let j = 0; j < message.strangersProfileCard.length; ++j)
                        object.strangersProfileCard[j] = $root.kritor.friend.ProfileCard.toObject(message.strangersProfileCard[j], options);
                }
                return object;
            };

            /**
             * Converts this GetStrangerProfileCardResponse to JSON.
             * @function toJSON
             * @memberof kritor.friend.GetStrangerProfileCardResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetStrangerProfileCardResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GetStrangerProfileCardResponse
             * @function getTypeUrl
             * @memberof kritor.friend.GetStrangerProfileCardResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetStrangerProfileCardResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.friend.GetStrangerProfileCardResponse";
            };

            return GetStrangerProfileCardResponse;
        })();

        friend.SetProfileCardRequest = (function() {

            /**
             * Properties of a SetProfileCardRequest.
             * @memberof kritor.friend
             * @interface ISetProfileCardRequest
             * @property {string|null} [nickName] SetProfileCardRequest nickName
             * @property {string|null} [company] SetProfileCardRequest company
             * @property {string|null} [email] SetProfileCardRequest email
             * @property {string|null} [college] SetProfileCardRequest college
             * @property {string|null} [personalNote] SetProfileCardRequest personalNote
             * @property {number|null} [birthday] SetProfileCardRequest birthday
             * @property {number|null} [age] SetProfileCardRequest age
             */

            /**
             * Constructs a new SetProfileCardRequest.
             * @memberof kritor.friend
             * @classdesc Represents a SetProfileCardRequest.
             * @implements ISetProfileCardRequest
             * @constructor
             * @param {kritor.friend.ISetProfileCardRequest=} [properties] Properties to set
             */
            function SetProfileCardRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * SetProfileCardRequest nickName.
             * @member {string|null|undefined} nickName
             * @memberof kritor.friend.SetProfileCardRequest
             * @instance
             */
            SetProfileCardRequest.prototype.nickName = null;

            /**
             * SetProfileCardRequest company.
             * @member {string|null|undefined} company
             * @memberof kritor.friend.SetProfileCardRequest
             * @instance
             */
            SetProfileCardRequest.prototype.company = null;

            /**
             * SetProfileCardRequest email.
             * @member {string|null|undefined} email
             * @memberof kritor.friend.SetProfileCardRequest
             * @instance
             */
            SetProfileCardRequest.prototype.email = null;

            /**
             * SetProfileCardRequest college.
             * @member {string|null|undefined} college
             * @memberof kritor.friend.SetProfileCardRequest
             * @instance
             */
            SetProfileCardRequest.prototype.college = null;

            /**
             * SetProfileCardRequest personalNote.
             * @member {string|null|undefined} personalNote
             * @memberof kritor.friend.SetProfileCardRequest
             * @instance
             */
            SetProfileCardRequest.prototype.personalNote = null;

            /**
             * SetProfileCardRequest birthday.
             * @member {number|null|undefined} birthday
             * @memberof kritor.friend.SetProfileCardRequest
             * @instance
             */
            SetProfileCardRequest.prototype.birthday = null;

            /**
             * SetProfileCardRequest age.
             * @member {number|null|undefined} age
             * @memberof kritor.friend.SetProfileCardRequest
             * @instance
             */
            SetProfileCardRequest.prototype.age = null;

            // OneOf field names bound to virtual getters and setters
            let $oneOfFields;

            /**
             * SetProfileCardRequest _nickName.
             * @member {"nickName"|undefined} _nickName
             * @memberof kritor.friend.SetProfileCardRequest
             * @instance
             */
            Object.defineProperty(SetProfileCardRequest.prototype, "_nickName", {
                get: $util.oneOfGetter($oneOfFields = ["nickName"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * SetProfileCardRequest _company.
             * @member {"company"|undefined} _company
             * @memberof kritor.friend.SetProfileCardRequest
             * @instance
             */
            Object.defineProperty(SetProfileCardRequest.prototype, "_company", {
                get: $util.oneOfGetter($oneOfFields = ["company"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * SetProfileCardRequest _email.
             * @member {"email"|undefined} _email
             * @memberof kritor.friend.SetProfileCardRequest
             * @instance
             */
            Object.defineProperty(SetProfileCardRequest.prototype, "_email", {
                get: $util.oneOfGetter($oneOfFields = ["email"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * SetProfileCardRequest _college.
             * @member {"college"|undefined} _college
             * @memberof kritor.friend.SetProfileCardRequest
             * @instance
             */
            Object.defineProperty(SetProfileCardRequest.prototype, "_college", {
                get: $util.oneOfGetter($oneOfFields = ["college"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * SetProfileCardRequest _personalNote.
             * @member {"personalNote"|undefined} _personalNote
             * @memberof kritor.friend.SetProfileCardRequest
             * @instance
             */
            Object.defineProperty(SetProfileCardRequest.prototype, "_personalNote", {
                get: $util.oneOfGetter($oneOfFields = ["personalNote"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * SetProfileCardRequest _birthday.
             * @member {"birthday"|undefined} _birthday
             * @memberof kritor.friend.SetProfileCardRequest
             * @instance
             */
            Object.defineProperty(SetProfileCardRequest.prototype, "_birthday", {
                get: $util.oneOfGetter($oneOfFields = ["birthday"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * SetProfileCardRequest _age.
             * @member {"age"|undefined} _age
             * @memberof kritor.friend.SetProfileCardRequest
             * @instance
             */
            Object.defineProperty(SetProfileCardRequest.prototype, "_age", {
                get: $util.oneOfGetter($oneOfFields = ["age"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new SetProfileCardRequest instance using the specified properties.
             * @function create
             * @memberof kritor.friend.SetProfileCardRequest
             * @static
             * @param {kritor.friend.ISetProfileCardRequest=} [properties] Properties to set
             * @returns {kritor.friend.SetProfileCardRequest} SetProfileCardRequest instance
             */
            SetProfileCardRequest.create = function create(properties) {
                return new SetProfileCardRequest(properties);
            };

            /**
             * Encodes the specified SetProfileCardRequest message. Does not implicitly {@link kritor.friend.SetProfileCardRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.friend.SetProfileCardRequest
             * @static
             * @param {kritor.friend.ISetProfileCardRequest} message SetProfileCardRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SetProfileCardRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.nickName != null && Object.hasOwnProperty.call(message, "nickName"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.nickName);
                if (message.company != null && Object.hasOwnProperty.call(message, "company"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.company);
                if (message.email != null && Object.hasOwnProperty.call(message, "email"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.email);
                if (message.college != null && Object.hasOwnProperty.call(message, "college"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.college);
                if (message.personalNote != null && Object.hasOwnProperty.call(message, "personalNote"))
                    writer.uint32(/* id 5, wireType 2 =*/42).string(message.personalNote);
                if (message.birthday != null && Object.hasOwnProperty.call(message, "birthday"))
                    writer.uint32(/* id 6, wireType 0 =*/48).uint32(message.birthday);
                if (message.age != null && Object.hasOwnProperty.call(message, "age"))
                    writer.uint32(/* id 7, wireType 0 =*/56).uint32(message.age);
                return writer;
            };

            /**
             * Encodes the specified SetProfileCardRequest message, length delimited. Does not implicitly {@link kritor.friend.SetProfileCardRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.friend.SetProfileCardRequest
             * @static
             * @param {kritor.friend.ISetProfileCardRequest} message SetProfileCardRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SetProfileCardRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a SetProfileCardRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.friend.SetProfileCardRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.friend.SetProfileCardRequest} SetProfileCardRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SetProfileCardRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.friend.SetProfileCardRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.nickName = reader.string();
                            break;
                        }
                    case 2: {
                            message.company = reader.string();
                            break;
                        }
                    case 3: {
                            message.email = reader.string();
                            break;
                        }
                    case 4: {
                            message.college = reader.string();
                            break;
                        }
                    case 5: {
                            message.personalNote = reader.string();
                            break;
                        }
                    case 6: {
                            message.birthday = reader.uint32();
                            break;
                        }
                    case 7: {
                            message.age = reader.uint32();
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
             * Decodes a SetProfileCardRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.friend.SetProfileCardRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.friend.SetProfileCardRequest} SetProfileCardRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SetProfileCardRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a SetProfileCardRequest message.
             * @function verify
             * @memberof kritor.friend.SetProfileCardRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            SetProfileCardRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                let properties = {};
                if (message.nickName != null && message.hasOwnProperty("nickName")) {
                    properties._nickName = 1;
                    if (!$util.isString(message.nickName))
                        return "nickName: string expected";
                }
                if (message.company != null && message.hasOwnProperty("company")) {
                    properties._company = 1;
                    if (!$util.isString(message.company))
                        return "company: string expected";
                }
                if (message.email != null && message.hasOwnProperty("email")) {
                    properties._email = 1;
                    if (!$util.isString(message.email))
                        return "email: string expected";
                }
                if (message.college != null && message.hasOwnProperty("college")) {
                    properties._college = 1;
                    if (!$util.isString(message.college))
                        return "college: string expected";
                }
                if (message.personalNote != null && message.hasOwnProperty("personalNote")) {
                    properties._personalNote = 1;
                    if (!$util.isString(message.personalNote))
                        return "personalNote: string expected";
                }
                if (message.birthday != null && message.hasOwnProperty("birthday")) {
                    properties._birthday = 1;
                    if (!$util.isInteger(message.birthday))
                        return "birthday: integer expected";
                }
                if (message.age != null && message.hasOwnProperty("age")) {
                    properties._age = 1;
                    if (!$util.isInteger(message.age))
                        return "age: integer expected";
                }
                return null;
            };

            /**
             * Creates a SetProfileCardRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.friend.SetProfileCardRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.friend.SetProfileCardRequest} SetProfileCardRequest
             */
            SetProfileCardRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.friend.SetProfileCardRequest)
                    return object;
                let message = new $root.kritor.friend.SetProfileCardRequest();
                if (object.nickName != null)
                    message.nickName = String(object.nickName);
                if (object.company != null)
                    message.company = String(object.company);
                if (object.email != null)
                    message.email = String(object.email);
                if (object.college != null)
                    message.college = String(object.college);
                if (object.personalNote != null)
                    message.personalNote = String(object.personalNote);
                if (object.birthday != null)
                    message.birthday = object.birthday >>> 0;
                if (object.age != null)
                    message.age = object.age >>> 0;
                return message;
            };

            /**
             * Creates a plain object from a SetProfileCardRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.friend.SetProfileCardRequest
             * @static
             * @param {kritor.friend.SetProfileCardRequest} message SetProfileCardRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            SetProfileCardRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (message.nickName != null && message.hasOwnProperty("nickName")) {
                    object.nickName = message.nickName;
                    if (options.oneofs)
                        object._nickName = "nickName";
                }
                if (message.company != null && message.hasOwnProperty("company")) {
                    object.company = message.company;
                    if (options.oneofs)
                        object._company = "company";
                }
                if (message.email != null && message.hasOwnProperty("email")) {
                    object.email = message.email;
                    if (options.oneofs)
                        object._email = "email";
                }
                if (message.college != null && message.hasOwnProperty("college")) {
                    object.college = message.college;
                    if (options.oneofs)
                        object._college = "college";
                }
                if (message.personalNote != null && message.hasOwnProperty("personalNote")) {
                    object.personalNote = message.personalNote;
                    if (options.oneofs)
                        object._personalNote = "personalNote";
                }
                if (message.birthday != null && message.hasOwnProperty("birthday")) {
                    object.birthday = message.birthday;
                    if (options.oneofs)
                        object._birthday = "birthday";
                }
                if (message.age != null && message.hasOwnProperty("age")) {
                    object.age = message.age;
                    if (options.oneofs)
                        object._age = "age";
                }
                return object;
            };

            /**
             * Converts this SetProfileCardRequest to JSON.
             * @function toJSON
             * @memberof kritor.friend.SetProfileCardRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            SetProfileCardRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for SetProfileCardRequest
             * @function getTypeUrl
             * @memberof kritor.friend.SetProfileCardRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            SetProfileCardRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.friend.SetProfileCardRequest";
            };

            return SetProfileCardRequest;
        })();

        friend.SetProfileCardResponse = (function() {

            /**
             * Properties of a SetProfileCardResponse.
             * @memberof kritor.friend
             * @interface ISetProfileCardResponse
             */

            /**
             * Constructs a new SetProfileCardResponse.
             * @memberof kritor.friend
             * @classdesc Represents a SetProfileCardResponse.
             * @implements ISetProfileCardResponse
             * @constructor
             * @param {kritor.friend.ISetProfileCardResponse=} [properties] Properties to set
             */
            function SetProfileCardResponse(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Creates a new SetProfileCardResponse instance using the specified properties.
             * @function create
             * @memberof kritor.friend.SetProfileCardResponse
             * @static
             * @param {kritor.friend.ISetProfileCardResponse=} [properties] Properties to set
             * @returns {kritor.friend.SetProfileCardResponse} SetProfileCardResponse instance
             */
            SetProfileCardResponse.create = function create(properties) {
                return new SetProfileCardResponse(properties);
            };

            /**
             * Encodes the specified SetProfileCardResponse message. Does not implicitly {@link kritor.friend.SetProfileCardResponse.verify|verify} messages.
             * @function encode
             * @memberof kritor.friend.SetProfileCardResponse
             * @static
             * @param {kritor.friend.ISetProfileCardResponse} message SetProfileCardResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SetProfileCardResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                return writer;
            };

            /**
             * Encodes the specified SetProfileCardResponse message, length delimited. Does not implicitly {@link kritor.friend.SetProfileCardResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.friend.SetProfileCardResponse
             * @static
             * @param {kritor.friend.ISetProfileCardResponse} message SetProfileCardResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SetProfileCardResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a SetProfileCardResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.friend.SetProfileCardResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.friend.SetProfileCardResponse} SetProfileCardResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SetProfileCardResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.friend.SetProfileCardResponse();
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
             * Decodes a SetProfileCardResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.friend.SetProfileCardResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.friend.SetProfileCardResponse} SetProfileCardResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SetProfileCardResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a SetProfileCardResponse message.
             * @function verify
             * @memberof kritor.friend.SetProfileCardResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            SetProfileCardResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                return null;
            };

            /**
             * Creates a SetProfileCardResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.friend.SetProfileCardResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.friend.SetProfileCardResponse} SetProfileCardResponse
             */
            SetProfileCardResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.friend.SetProfileCardResponse)
                    return object;
                return new $root.kritor.friend.SetProfileCardResponse();
            };

            /**
             * Creates a plain object from a SetProfileCardResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.friend.SetProfileCardResponse
             * @static
             * @param {kritor.friend.SetProfileCardResponse} message SetProfileCardResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            SetProfileCardResponse.toObject = function toObject() {
                return {};
            };

            /**
             * Converts this SetProfileCardResponse to JSON.
             * @function toJSON
             * @memberof kritor.friend.SetProfileCardResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            SetProfileCardResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for SetProfileCardResponse
             * @function getTypeUrl
             * @memberof kritor.friend.SetProfileCardResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            SetProfileCardResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.friend.SetProfileCardResponse";
            };

            return SetProfileCardResponse;
        })();

        friend.IsBlackListUserRequest = (function() {

            /**
             * Properties of an IsBlackListUserRequest.
             * @memberof kritor.friend
             * @interface IIsBlackListUserRequest
             * @property {string|null} [targetUid] IsBlackListUserRequest targetUid
             * @property {number|Long|null} [targetUin] IsBlackListUserRequest targetUin
             */

            /**
             * Constructs a new IsBlackListUserRequest.
             * @memberof kritor.friend
             * @classdesc Represents an IsBlackListUserRequest.
             * @implements IIsBlackListUserRequest
             * @constructor
             * @param {kritor.friend.IIsBlackListUserRequest=} [properties] Properties to set
             */
            function IsBlackListUserRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * IsBlackListUserRequest targetUid.
             * @member {string|null|undefined} targetUid
             * @memberof kritor.friend.IsBlackListUserRequest
             * @instance
             */
            IsBlackListUserRequest.prototype.targetUid = null;

            /**
             * IsBlackListUserRequest targetUin.
             * @member {number|Long|null|undefined} targetUin
             * @memberof kritor.friend.IsBlackListUserRequest
             * @instance
             */
            IsBlackListUserRequest.prototype.targetUin = null;

            // OneOf field names bound to virtual getters and setters
            let $oneOfFields;

            /**
             * IsBlackListUserRequest target.
             * @member {"targetUid"|"targetUin"|undefined} target
             * @memberof kritor.friend.IsBlackListUserRequest
             * @instance
             */
            Object.defineProperty(IsBlackListUserRequest.prototype, "target", {
                get: $util.oneOfGetter($oneOfFields = ["targetUid", "targetUin"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new IsBlackListUserRequest instance using the specified properties.
             * @function create
             * @memberof kritor.friend.IsBlackListUserRequest
             * @static
             * @param {kritor.friend.IIsBlackListUserRequest=} [properties] Properties to set
             * @returns {kritor.friend.IsBlackListUserRequest} IsBlackListUserRequest instance
             */
            IsBlackListUserRequest.create = function create(properties) {
                return new IsBlackListUserRequest(properties);
            };

            /**
             * Encodes the specified IsBlackListUserRequest message. Does not implicitly {@link kritor.friend.IsBlackListUserRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.friend.IsBlackListUserRequest
             * @static
             * @param {kritor.friend.IIsBlackListUserRequest} message IsBlackListUserRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            IsBlackListUserRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.targetUid != null && Object.hasOwnProperty.call(message, "targetUid"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.targetUid);
                if (message.targetUin != null && Object.hasOwnProperty.call(message, "targetUin"))
                    writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.targetUin);
                return writer;
            };

            /**
             * Encodes the specified IsBlackListUserRequest message, length delimited. Does not implicitly {@link kritor.friend.IsBlackListUserRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.friend.IsBlackListUserRequest
             * @static
             * @param {kritor.friend.IIsBlackListUserRequest} message IsBlackListUserRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            IsBlackListUserRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an IsBlackListUserRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.friend.IsBlackListUserRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.friend.IsBlackListUserRequest} IsBlackListUserRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            IsBlackListUserRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.friend.IsBlackListUserRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.targetUid = reader.string();
                            break;
                        }
                    case 2: {
                            message.targetUin = reader.uint64();
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
             * Decodes an IsBlackListUserRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.friend.IsBlackListUserRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.friend.IsBlackListUserRequest} IsBlackListUserRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            IsBlackListUserRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an IsBlackListUserRequest message.
             * @function verify
             * @memberof kritor.friend.IsBlackListUserRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            IsBlackListUserRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                let properties = {};
                if (message.targetUid != null && message.hasOwnProperty("targetUid")) {
                    properties.target = 1;
                    if (!$util.isString(message.targetUid))
                        return "targetUid: string expected";
                }
                if (message.targetUin != null && message.hasOwnProperty("targetUin")) {
                    if (properties.target === 1)
                        return "target: multiple values";
                    properties.target = 1;
                    if (!$util.isInteger(message.targetUin) && !(message.targetUin && $util.isInteger(message.targetUin.low) && $util.isInteger(message.targetUin.high)))
                        return "targetUin: integer|Long expected";
                }
                return null;
            };

            /**
             * Creates an IsBlackListUserRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.friend.IsBlackListUserRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.friend.IsBlackListUserRequest} IsBlackListUserRequest
             */
            IsBlackListUserRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.friend.IsBlackListUserRequest)
                    return object;
                let message = new $root.kritor.friend.IsBlackListUserRequest();
                if (object.targetUid != null)
                    message.targetUid = String(object.targetUid);
                if (object.targetUin != null)
                    if ($util.Long)
                        (message.targetUin = $util.Long.fromValue(object.targetUin)).unsigned = true;
                    else if (typeof object.targetUin === "string")
                        message.targetUin = parseInt(object.targetUin, 10);
                    else if (typeof object.targetUin === "number")
                        message.targetUin = object.targetUin;
                    else if (typeof object.targetUin === "object")
                        message.targetUin = new $util.LongBits(object.targetUin.low >>> 0, object.targetUin.high >>> 0).toNumber(true);
                return message;
            };

            /**
             * Creates a plain object from an IsBlackListUserRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.friend.IsBlackListUserRequest
             * @static
             * @param {kritor.friend.IsBlackListUserRequest} message IsBlackListUserRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            IsBlackListUserRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (message.targetUid != null && message.hasOwnProperty("targetUid")) {
                    object.targetUid = message.targetUid;
                    if (options.oneofs)
                        object.target = "targetUid";
                }
                if (message.targetUin != null && message.hasOwnProperty("targetUin")) {
                    if (typeof message.targetUin === "number")
                        object.targetUin = options.longs === String ? String(message.targetUin) : message.targetUin;
                    else
                        object.targetUin = options.longs === String ? $util.Long.prototype.toString.call(message.targetUin) : options.longs === Number ? new $util.LongBits(message.targetUin.low >>> 0, message.targetUin.high >>> 0).toNumber(true) : message.targetUin;
                    if (options.oneofs)
                        object.target = "targetUin";
                }
                return object;
            };

            /**
             * Converts this IsBlackListUserRequest to JSON.
             * @function toJSON
             * @memberof kritor.friend.IsBlackListUserRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            IsBlackListUserRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for IsBlackListUserRequest
             * @function getTypeUrl
             * @memberof kritor.friend.IsBlackListUserRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            IsBlackListUserRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.friend.IsBlackListUserRequest";
            };

            return IsBlackListUserRequest;
        })();

        friend.IsBlackListUserResponse = (function() {

            /**
             * Properties of an IsBlackListUserResponse.
             * @memberof kritor.friend
             * @interface IIsBlackListUserResponse
             * @property {boolean|null} [isBlackListUser] IsBlackListUserResponse isBlackListUser
             */

            /**
             * Constructs a new IsBlackListUserResponse.
             * @memberof kritor.friend
             * @classdesc Represents an IsBlackListUserResponse.
             * @implements IIsBlackListUserResponse
             * @constructor
             * @param {kritor.friend.IIsBlackListUserResponse=} [properties] Properties to set
             */
            function IsBlackListUserResponse(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * IsBlackListUserResponse isBlackListUser.
             * @member {boolean} isBlackListUser
             * @memberof kritor.friend.IsBlackListUserResponse
             * @instance
             */
            IsBlackListUserResponse.prototype.isBlackListUser = false;

            /**
             * Creates a new IsBlackListUserResponse instance using the specified properties.
             * @function create
             * @memberof kritor.friend.IsBlackListUserResponse
             * @static
             * @param {kritor.friend.IIsBlackListUserResponse=} [properties] Properties to set
             * @returns {kritor.friend.IsBlackListUserResponse} IsBlackListUserResponse instance
             */
            IsBlackListUserResponse.create = function create(properties) {
                return new IsBlackListUserResponse(properties);
            };

            /**
             * Encodes the specified IsBlackListUserResponse message. Does not implicitly {@link kritor.friend.IsBlackListUserResponse.verify|verify} messages.
             * @function encode
             * @memberof kritor.friend.IsBlackListUserResponse
             * @static
             * @param {kritor.friend.IIsBlackListUserResponse} message IsBlackListUserResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            IsBlackListUserResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.isBlackListUser != null && Object.hasOwnProperty.call(message, "isBlackListUser"))
                    writer.uint32(/* id 1, wireType 0 =*/8).bool(message.isBlackListUser);
                return writer;
            };

            /**
             * Encodes the specified IsBlackListUserResponse message, length delimited. Does not implicitly {@link kritor.friend.IsBlackListUserResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.friend.IsBlackListUserResponse
             * @static
             * @param {kritor.friend.IIsBlackListUserResponse} message IsBlackListUserResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            IsBlackListUserResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an IsBlackListUserResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.friend.IsBlackListUserResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.friend.IsBlackListUserResponse} IsBlackListUserResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            IsBlackListUserResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.friend.IsBlackListUserResponse();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.isBlackListUser = reader.bool();
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
             * Decodes an IsBlackListUserResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.friend.IsBlackListUserResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.friend.IsBlackListUserResponse} IsBlackListUserResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            IsBlackListUserResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an IsBlackListUserResponse message.
             * @function verify
             * @memberof kritor.friend.IsBlackListUserResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            IsBlackListUserResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.isBlackListUser != null && message.hasOwnProperty("isBlackListUser"))
                    if (typeof message.isBlackListUser !== "boolean")
                        return "isBlackListUser: boolean expected";
                return null;
            };

            /**
             * Creates an IsBlackListUserResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.friend.IsBlackListUserResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.friend.IsBlackListUserResponse} IsBlackListUserResponse
             */
            IsBlackListUserResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.friend.IsBlackListUserResponse)
                    return object;
                let message = new $root.kritor.friend.IsBlackListUserResponse();
                if (object.isBlackListUser != null)
                    message.isBlackListUser = Boolean(object.isBlackListUser);
                return message;
            };

            /**
             * Creates a plain object from an IsBlackListUserResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.friend.IsBlackListUserResponse
             * @static
             * @param {kritor.friend.IsBlackListUserResponse} message IsBlackListUserResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            IsBlackListUserResponse.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults)
                    object.isBlackListUser = false;
                if (message.isBlackListUser != null && message.hasOwnProperty("isBlackListUser"))
                    object.isBlackListUser = message.isBlackListUser;
                return object;
            };

            /**
             * Converts this IsBlackListUserResponse to JSON.
             * @function toJSON
             * @memberof kritor.friend.IsBlackListUserResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            IsBlackListUserResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for IsBlackListUserResponse
             * @function getTypeUrl
             * @memberof kritor.friend.IsBlackListUserResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            IsBlackListUserResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.friend.IsBlackListUserResponse";
            };

            return IsBlackListUserResponse;
        })();

        friend.VoteUserRequest = (function() {

            /**
             * Properties of a VoteUserRequest.
             * @memberof kritor.friend
             * @interface IVoteUserRequest
             * @property {string|null} [targetUid] VoteUserRequest targetUid
             * @property {number|Long|null} [targetUin] VoteUserRequest targetUin
             * @property {number|null} [voteCount] VoteUserRequest voteCount
             */

            /**
             * Constructs a new VoteUserRequest.
             * @memberof kritor.friend
             * @classdesc Represents a VoteUserRequest.
             * @implements IVoteUserRequest
             * @constructor
             * @param {kritor.friend.IVoteUserRequest=} [properties] Properties to set
             */
            function VoteUserRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * VoteUserRequest targetUid.
             * @member {string|null|undefined} targetUid
             * @memberof kritor.friend.VoteUserRequest
             * @instance
             */
            VoteUserRequest.prototype.targetUid = null;

            /**
             * VoteUserRequest targetUin.
             * @member {number|Long|null|undefined} targetUin
             * @memberof kritor.friend.VoteUserRequest
             * @instance
             */
            VoteUserRequest.prototype.targetUin = null;

            /**
             * VoteUserRequest voteCount.
             * @member {number} voteCount
             * @memberof kritor.friend.VoteUserRequest
             * @instance
             */
            VoteUserRequest.prototype.voteCount = 0;

            // OneOf field names bound to virtual getters and setters
            let $oneOfFields;

            /**
             * VoteUserRequest target.
             * @member {"targetUid"|"targetUin"|undefined} target
             * @memberof kritor.friend.VoteUserRequest
             * @instance
             */
            Object.defineProperty(VoteUserRequest.prototype, "target", {
                get: $util.oneOfGetter($oneOfFields = ["targetUid", "targetUin"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new VoteUserRequest instance using the specified properties.
             * @function create
             * @memberof kritor.friend.VoteUserRequest
             * @static
             * @param {kritor.friend.IVoteUserRequest=} [properties] Properties to set
             * @returns {kritor.friend.VoteUserRequest} VoteUserRequest instance
             */
            VoteUserRequest.create = function create(properties) {
                return new VoteUserRequest(properties);
            };

            /**
             * Encodes the specified VoteUserRequest message. Does not implicitly {@link kritor.friend.VoteUserRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.friend.VoteUserRequest
             * @static
             * @param {kritor.friend.IVoteUserRequest} message VoteUserRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            VoteUserRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.targetUid != null && Object.hasOwnProperty.call(message, "targetUid"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.targetUid);
                if (message.targetUin != null && Object.hasOwnProperty.call(message, "targetUin"))
                    writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.targetUin);
                if (message.voteCount != null && Object.hasOwnProperty.call(message, "voteCount"))
                    writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.voteCount);
                return writer;
            };

            /**
             * Encodes the specified VoteUserRequest message, length delimited. Does not implicitly {@link kritor.friend.VoteUserRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.friend.VoteUserRequest
             * @static
             * @param {kritor.friend.IVoteUserRequest} message VoteUserRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            VoteUserRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a VoteUserRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.friend.VoteUserRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.friend.VoteUserRequest} VoteUserRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            VoteUserRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.friend.VoteUserRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.targetUid = reader.string();
                            break;
                        }
                    case 2: {
                            message.targetUin = reader.uint64();
                            break;
                        }
                    case 3: {
                            message.voteCount = reader.uint32();
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
             * Decodes a VoteUserRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.friend.VoteUserRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.friend.VoteUserRequest} VoteUserRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            VoteUserRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a VoteUserRequest message.
             * @function verify
             * @memberof kritor.friend.VoteUserRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            VoteUserRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                let properties = {};
                if (message.targetUid != null && message.hasOwnProperty("targetUid")) {
                    properties.target = 1;
                    if (!$util.isString(message.targetUid))
                        return "targetUid: string expected";
                }
                if (message.targetUin != null && message.hasOwnProperty("targetUin")) {
                    if (properties.target === 1)
                        return "target: multiple values";
                    properties.target = 1;
                    if (!$util.isInteger(message.targetUin) && !(message.targetUin && $util.isInteger(message.targetUin.low) && $util.isInteger(message.targetUin.high)))
                        return "targetUin: integer|Long expected";
                }
                if (message.voteCount != null && message.hasOwnProperty("voteCount"))
                    if (!$util.isInteger(message.voteCount))
                        return "voteCount: integer expected";
                return null;
            };

            /**
             * Creates a VoteUserRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.friend.VoteUserRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.friend.VoteUserRequest} VoteUserRequest
             */
            VoteUserRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.friend.VoteUserRequest)
                    return object;
                let message = new $root.kritor.friend.VoteUserRequest();
                if (object.targetUid != null)
                    message.targetUid = String(object.targetUid);
                if (object.targetUin != null)
                    if ($util.Long)
                        (message.targetUin = $util.Long.fromValue(object.targetUin)).unsigned = true;
                    else if (typeof object.targetUin === "string")
                        message.targetUin = parseInt(object.targetUin, 10);
                    else if (typeof object.targetUin === "number")
                        message.targetUin = object.targetUin;
                    else if (typeof object.targetUin === "object")
                        message.targetUin = new $util.LongBits(object.targetUin.low >>> 0, object.targetUin.high >>> 0).toNumber(true);
                if (object.voteCount != null)
                    message.voteCount = object.voteCount >>> 0;
                return message;
            };

            /**
             * Creates a plain object from a VoteUserRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.friend.VoteUserRequest
             * @static
             * @param {kritor.friend.VoteUserRequest} message VoteUserRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            VoteUserRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults)
                    object.voteCount = 0;
                if (message.targetUid != null && message.hasOwnProperty("targetUid")) {
                    object.targetUid = message.targetUid;
                    if (options.oneofs)
                        object.target = "targetUid";
                }
                if (message.targetUin != null && message.hasOwnProperty("targetUin")) {
                    if (typeof message.targetUin === "number")
                        object.targetUin = options.longs === String ? String(message.targetUin) : message.targetUin;
                    else
                        object.targetUin = options.longs === String ? $util.Long.prototype.toString.call(message.targetUin) : options.longs === Number ? new $util.LongBits(message.targetUin.low >>> 0, message.targetUin.high >>> 0).toNumber(true) : message.targetUin;
                    if (options.oneofs)
                        object.target = "targetUin";
                }
                if (message.voteCount != null && message.hasOwnProperty("voteCount"))
                    object.voteCount = message.voteCount;
                return object;
            };

            /**
             * Converts this VoteUserRequest to JSON.
             * @function toJSON
             * @memberof kritor.friend.VoteUserRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            VoteUserRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for VoteUserRequest
             * @function getTypeUrl
             * @memberof kritor.friend.VoteUserRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            VoteUserRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.friend.VoteUserRequest";
            };

            return VoteUserRequest;
        })();

        friend.VoteUserResponse = (function() {

            /**
             * Properties of a VoteUserResponse.
             * @memberof kritor.friend
             * @interface IVoteUserResponse
             */

            /**
             * Constructs a new VoteUserResponse.
             * @memberof kritor.friend
             * @classdesc Represents a VoteUserResponse.
             * @implements IVoteUserResponse
             * @constructor
             * @param {kritor.friend.IVoteUserResponse=} [properties] Properties to set
             */
            function VoteUserResponse(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Creates a new VoteUserResponse instance using the specified properties.
             * @function create
             * @memberof kritor.friend.VoteUserResponse
             * @static
             * @param {kritor.friend.IVoteUserResponse=} [properties] Properties to set
             * @returns {kritor.friend.VoteUserResponse} VoteUserResponse instance
             */
            VoteUserResponse.create = function create(properties) {
                return new VoteUserResponse(properties);
            };

            /**
             * Encodes the specified VoteUserResponse message. Does not implicitly {@link kritor.friend.VoteUserResponse.verify|verify} messages.
             * @function encode
             * @memberof kritor.friend.VoteUserResponse
             * @static
             * @param {kritor.friend.IVoteUserResponse} message VoteUserResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            VoteUserResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                return writer;
            };

            /**
             * Encodes the specified VoteUserResponse message, length delimited. Does not implicitly {@link kritor.friend.VoteUserResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.friend.VoteUserResponse
             * @static
             * @param {kritor.friend.IVoteUserResponse} message VoteUserResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            VoteUserResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a VoteUserResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.friend.VoteUserResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.friend.VoteUserResponse} VoteUserResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            VoteUserResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.friend.VoteUserResponse();
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
             * Decodes a VoteUserResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.friend.VoteUserResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.friend.VoteUserResponse} VoteUserResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            VoteUserResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a VoteUserResponse message.
             * @function verify
             * @memberof kritor.friend.VoteUserResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            VoteUserResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                return null;
            };

            /**
             * Creates a VoteUserResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.friend.VoteUserResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.friend.VoteUserResponse} VoteUserResponse
             */
            VoteUserResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.friend.VoteUserResponse)
                    return object;
                return new $root.kritor.friend.VoteUserResponse();
            };

            /**
             * Creates a plain object from a VoteUserResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.friend.VoteUserResponse
             * @static
             * @param {kritor.friend.VoteUserResponse} message VoteUserResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            VoteUserResponse.toObject = function toObject() {
                return {};
            };

            /**
             * Converts this VoteUserResponse to JSON.
             * @function toJSON
             * @memberof kritor.friend.VoteUserResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            VoteUserResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for VoteUserResponse
             * @function getTypeUrl
             * @memberof kritor.friend.VoteUserResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            VoteUserResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.friend.VoteUserResponse";
            };

            return VoteUserResponse;
        })();

        friend.GetUidByUinRequest = (function() {

            /**
             * Properties of a GetUidByUinRequest.
             * @memberof kritor.friend
             * @interface IGetUidByUinRequest
             * @property {Array.<number|Long>|null} [targetUins] GetUidByUinRequest targetUins
             */

            /**
             * Constructs a new GetUidByUinRequest.
             * @memberof kritor.friend
             * @classdesc Represents a GetUidByUinRequest.
             * @implements IGetUidByUinRequest
             * @constructor
             * @param {kritor.friend.IGetUidByUinRequest=} [properties] Properties to set
             */
            function GetUidByUinRequest(properties) {
                this.targetUins = [];
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetUidByUinRequest targetUins.
             * @member {Array.<number|Long>} targetUins
             * @memberof kritor.friend.GetUidByUinRequest
             * @instance
             */
            GetUidByUinRequest.prototype.targetUins = $util.emptyArray;

            /**
             * Creates a new GetUidByUinRequest instance using the specified properties.
             * @function create
             * @memberof kritor.friend.GetUidByUinRequest
             * @static
             * @param {kritor.friend.IGetUidByUinRequest=} [properties] Properties to set
             * @returns {kritor.friend.GetUidByUinRequest} GetUidByUinRequest instance
             */
            GetUidByUinRequest.create = function create(properties) {
                return new GetUidByUinRequest(properties);
            };

            /**
             * Encodes the specified GetUidByUinRequest message. Does not implicitly {@link kritor.friend.GetUidByUinRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.friend.GetUidByUinRequest
             * @static
             * @param {kritor.friend.IGetUidByUinRequest} message GetUidByUinRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetUidByUinRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.targetUins != null && message.targetUins.length) {
                    writer.uint32(/* id 1, wireType 2 =*/10).fork();
                    for (let i = 0; i < message.targetUins.length; ++i)
                        writer.uint64(message.targetUins[i]);
                    writer.ldelim();
                }
                return writer;
            };

            /**
             * Encodes the specified GetUidByUinRequest message, length delimited. Does not implicitly {@link kritor.friend.GetUidByUinRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.friend.GetUidByUinRequest
             * @static
             * @param {kritor.friend.IGetUidByUinRequest} message GetUidByUinRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetUidByUinRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetUidByUinRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.friend.GetUidByUinRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.friend.GetUidByUinRequest} GetUidByUinRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetUidByUinRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.friend.GetUidByUinRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            if (!(message.targetUins && message.targetUins.length))
                                message.targetUins = [];
                            if ((tag & 7) === 2) {
                                let end2 = reader.uint32() + reader.pos;
                                while (reader.pos < end2)
                                    message.targetUins.push(reader.uint64());
                            } else
                                message.targetUins.push(reader.uint64());
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
             * Decodes a GetUidByUinRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.friend.GetUidByUinRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.friend.GetUidByUinRequest} GetUidByUinRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetUidByUinRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetUidByUinRequest message.
             * @function verify
             * @memberof kritor.friend.GetUidByUinRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetUidByUinRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.targetUins != null && message.hasOwnProperty("targetUins")) {
                    if (!Array.isArray(message.targetUins))
                        return "targetUins: array expected";
                    for (let i = 0; i < message.targetUins.length; ++i)
                        if (!$util.isInteger(message.targetUins[i]) && !(message.targetUins[i] && $util.isInteger(message.targetUins[i].low) && $util.isInteger(message.targetUins[i].high)))
                            return "targetUins: integer|Long[] expected";
                }
                return null;
            };

            /**
             * Creates a GetUidByUinRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.friend.GetUidByUinRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.friend.GetUidByUinRequest} GetUidByUinRequest
             */
            GetUidByUinRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.friend.GetUidByUinRequest)
                    return object;
                let message = new $root.kritor.friend.GetUidByUinRequest();
                if (object.targetUins) {
                    if (!Array.isArray(object.targetUins))
                        throw TypeError(".kritor.friend.GetUidByUinRequest.targetUins: array expected");
                    message.targetUins = [];
                    for (let i = 0; i < object.targetUins.length; ++i)
                        if ($util.Long)
                            (message.targetUins[i] = $util.Long.fromValue(object.targetUins[i])).unsigned = true;
                        else if (typeof object.targetUins[i] === "string")
                            message.targetUins[i] = parseInt(object.targetUins[i], 10);
                        else if (typeof object.targetUins[i] === "number")
                            message.targetUins[i] = object.targetUins[i];
                        else if (typeof object.targetUins[i] === "object")
                            message.targetUins[i] = new $util.LongBits(object.targetUins[i].low >>> 0, object.targetUins[i].high >>> 0).toNumber(true);
                }
                return message;
            };

            /**
             * Creates a plain object from a GetUidByUinRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.friend.GetUidByUinRequest
             * @static
             * @param {kritor.friend.GetUidByUinRequest} message GetUidByUinRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetUidByUinRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.arrays || options.defaults)
                    object.targetUins = [];
                if (message.targetUins && message.targetUins.length) {
                    object.targetUins = [];
                    for (let j = 0; j < message.targetUins.length; ++j)
                        if (typeof message.targetUins[j] === "number")
                            object.targetUins[j] = options.longs === String ? String(message.targetUins[j]) : message.targetUins[j];
                        else
                            object.targetUins[j] = options.longs === String ? $util.Long.prototype.toString.call(message.targetUins[j]) : options.longs === Number ? new $util.LongBits(message.targetUins[j].low >>> 0, message.targetUins[j].high >>> 0).toNumber(true) : message.targetUins[j];
                }
                return object;
            };

            /**
             * Converts this GetUidByUinRequest to JSON.
             * @function toJSON
             * @memberof kritor.friend.GetUidByUinRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetUidByUinRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GetUidByUinRequest
             * @function getTypeUrl
             * @memberof kritor.friend.GetUidByUinRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetUidByUinRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.friend.GetUidByUinRequest";
            };

            return GetUidByUinRequest;
        })();

        friend.GetUidByUinResponse = (function() {

            /**
             * Properties of a GetUidByUinResponse.
             * @memberof kritor.friend
             * @interface IGetUidByUinResponse
             * @property {Object.<string,string>|null} [uidMap] GetUidByUinResponse uidMap
             */

            /**
             * Constructs a new GetUidByUinResponse.
             * @memberof kritor.friend
             * @classdesc Represents a GetUidByUinResponse.
             * @implements IGetUidByUinResponse
             * @constructor
             * @param {kritor.friend.IGetUidByUinResponse=} [properties] Properties to set
             */
            function GetUidByUinResponse(properties) {
                this.uidMap = {};
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetUidByUinResponse uidMap.
             * @member {Object.<string,string>} uidMap
             * @memberof kritor.friend.GetUidByUinResponse
             * @instance
             */
            GetUidByUinResponse.prototype.uidMap = $util.emptyObject;

            /**
             * Creates a new GetUidByUinResponse instance using the specified properties.
             * @function create
             * @memberof kritor.friend.GetUidByUinResponse
             * @static
             * @param {kritor.friend.IGetUidByUinResponse=} [properties] Properties to set
             * @returns {kritor.friend.GetUidByUinResponse} GetUidByUinResponse instance
             */
            GetUidByUinResponse.create = function create(properties) {
                return new GetUidByUinResponse(properties);
            };

            /**
             * Encodes the specified GetUidByUinResponse message. Does not implicitly {@link kritor.friend.GetUidByUinResponse.verify|verify} messages.
             * @function encode
             * @memberof kritor.friend.GetUidByUinResponse
             * @static
             * @param {kritor.friend.IGetUidByUinResponse} message GetUidByUinResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetUidByUinResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.uidMap != null && Object.hasOwnProperty.call(message, "uidMap"))
                    for (let keys = Object.keys(message.uidMap), i = 0; i < keys.length; ++i)
                        writer.uint32(/* id 1, wireType 2 =*/10).fork().uint32(/* id 1, wireType 0 =*/8).uint64(keys[i]).uint32(/* id 2, wireType 2 =*/18).string(message.uidMap[keys[i]]).ldelim();
                return writer;
            };

            /**
             * Encodes the specified GetUidByUinResponse message, length delimited. Does not implicitly {@link kritor.friend.GetUidByUinResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.friend.GetUidByUinResponse
             * @static
             * @param {kritor.friend.IGetUidByUinResponse} message GetUidByUinResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetUidByUinResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetUidByUinResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.friend.GetUidByUinResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.friend.GetUidByUinResponse} GetUidByUinResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetUidByUinResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.friend.GetUidByUinResponse(), key, value;
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            if (message.uidMap === $util.emptyObject)
                                message.uidMap = {};
                            let end2 = reader.uint32() + reader.pos;
                            key = 0;
                            value = "";
                            while (reader.pos < end2) {
                                let tag2 = reader.uint32();
                                switch (tag2 >>> 3) {
                                case 1:
                                    key = reader.uint64();
                                    break;
                                case 2:
                                    value = reader.string();
                                    break;
                                default:
                                    reader.skipType(tag2 & 7);
                                    break;
                                }
                            }
                            message.uidMap[typeof key === "object" ? $util.longToHash(key) : key] = value;
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
             * Decodes a GetUidByUinResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.friend.GetUidByUinResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.friend.GetUidByUinResponse} GetUidByUinResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetUidByUinResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetUidByUinResponse message.
             * @function verify
             * @memberof kritor.friend.GetUidByUinResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetUidByUinResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.uidMap != null && message.hasOwnProperty("uidMap")) {
                    if (!$util.isObject(message.uidMap))
                        return "uidMap: object expected";
                    let key = Object.keys(message.uidMap);
                    for (let i = 0; i < key.length; ++i) {
                        if (!$util.key64Re.test(key[i]))
                            return "uidMap: integer|Long key{k:uint64} expected";
                        if (!$util.isString(message.uidMap[key[i]]))
                            return "uidMap: string{k:uint64} expected";
                    }
                }
                return null;
            };

            /**
             * Creates a GetUidByUinResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.friend.GetUidByUinResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.friend.GetUidByUinResponse} GetUidByUinResponse
             */
            GetUidByUinResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.friend.GetUidByUinResponse)
                    return object;
                let message = new $root.kritor.friend.GetUidByUinResponse();
                if (object.uidMap) {
                    if (typeof object.uidMap !== "object")
                        throw TypeError(".kritor.friend.GetUidByUinResponse.uidMap: object expected");
                    message.uidMap = {};
                    for (let keys = Object.keys(object.uidMap), i = 0; i < keys.length; ++i)
                        message.uidMap[keys[i]] = String(object.uidMap[keys[i]]);
                }
                return message;
            };

            /**
             * Creates a plain object from a GetUidByUinResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.friend.GetUidByUinResponse
             * @static
             * @param {kritor.friend.GetUidByUinResponse} message GetUidByUinResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetUidByUinResponse.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.objects || options.defaults)
                    object.uidMap = {};
                let keys2;
                if (message.uidMap && (keys2 = Object.keys(message.uidMap)).length) {
                    object.uidMap = {};
                    for (let j = 0; j < keys2.length; ++j)
                        object.uidMap[keys2[j]] = message.uidMap[keys2[j]];
                }
                return object;
            };

            /**
             * Converts this GetUidByUinResponse to JSON.
             * @function toJSON
             * @memberof kritor.friend.GetUidByUinResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetUidByUinResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GetUidByUinResponse
             * @function getTypeUrl
             * @memberof kritor.friend.GetUidByUinResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetUidByUinResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.friend.GetUidByUinResponse";
            };

            return GetUidByUinResponse;
        })();

        friend.GetUinByUidRequest = (function() {

            /**
             * Properties of a GetUinByUidRequest.
             * @memberof kritor.friend
             * @interface IGetUinByUidRequest
             * @property {Array.<string>|null} [targetUids] GetUinByUidRequest targetUids
             */

            /**
             * Constructs a new GetUinByUidRequest.
             * @memberof kritor.friend
             * @classdesc Represents a GetUinByUidRequest.
             * @implements IGetUinByUidRequest
             * @constructor
             * @param {kritor.friend.IGetUinByUidRequest=} [properties] Properties to set
             */
            function GetUinByUidRequest(properties) {
                this.targetUids = [];
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetUinByUidRequest targetUids.
             * @member {Array.<string>} targetUids
             * @memberof kritor.friend.GetUinByUidRequest
             * @instance
             */
            GetUinByUidRequest.prototype.targetUids = $util.emptyArray;

            /**
             * Creates a new GetUinByUidRequest instance using the specified properties.
             * @function create
             * @memberof kritor.friend.GetUinByUidRequest
             * @static
             * @param {kritor.friend.IGetUinByUidRequest=} [properties] Properties to set
             * @returns {kritor.friend.GetUinByUidRequest} GetUinByUidRequest instance
             */
            GetUinByUidRequest.create = function create(properties) {
                return new GetUinByUidRequest(properties);
            };

            /**
             * Encodes the specified GetUinByUidRequest message. Does not implicitly {@link kritor.friend.GetUinByUidRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.friend.GetUinByUidRequest
             * @static
             * @param {kritor.friend.IGetUinByUidRequest} message GetUinByUidRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetUinByUidRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.targetUids != null && message.targetUids.length)
                    for (let i = 0; i < message.targetUids.length; ++i)
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.targetUids[i]);
                return writer;
            };

            /**
             * Encodes the specified GetUinByUidRequest message, length delimited. Does not implicitly {@link kritor.friend.GetUinByUidRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.friend.GetUinByUidRequest
             * @static
             * @param {kritor.friend.IGetUinByUidRequest} message GetUinByUidRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetUinByUidRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetUinByUidRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.friend.GetUinByUidRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.friend.GetUinByUidRequest} GetUinByUidRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetUinByUidRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.friend.GetUinByUidRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            if (!(message.targetUids && message.targetUids.length))
                                message.targetUids = [];
                            message.targetUids.push(reader.string());
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
             * Decodes a GetUinByUidRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.friend.GetUinByUidRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.friend.GetUinByUidRequest} GetUinByUidRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetUinByUidRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetUinByUidRequest message.
             * @function verify
             * @memberof kritor.friend.GetUinByUidRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetUinByUidRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.targetUids != null && message.hasOwnProperty("targetUids")) {
                    if (!Array.isArray(message.targetUids))
                        return "targetUids: array expected";
                    for (let i = 0; i < message.targetUids.length; ++i)
                        if (!$util.isString(message.targetUids[i]))
                            return "targetUids: string[] expected";
                }
                return null;
            };

            /**
             * Creates a GetUinByUidRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.friend.GetUinByUidRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.friend.GetUinByUidRequest} GetUinByUidRequest
             */
            GetUinByUidRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.friend.GetUinByUidRequest)
                    return object;
                let message = new $root.kritor.friend.GetUinByUidRequest();
                if (object.targetUids) {
                    if (!Array.isArray(object.targetUids))
                        throw TypeError(".kritor.friend.GetUinByUidRequest.targetUids: array expected");
                    message.targetUids = [];
                    for (let i = 0; i < object.targetUids.length; ++i)
                        message.targetUids[i] = String(object.targetUids[i]);
                }
                return message;
            };

            /**
             * Creates a plain object from a GetUinByUidRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.friend.GetUinByUidRequest
             * @static
             * @param {kritor.friend.GetUinByUidRequest} message GetUinByUidRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetUinByUidRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.arrays || options.defaults)
                    object.targetUids = [];
                if (message.targetUids && message.targetUids.length) {
                    object.targetUids = [];
                    for (let j = 0; j < message.targetUids.length; ++j)
                        object.targetUids[j] = message.targetUids[j];
                }
                return object;
            };

            /**
             * Converts this GetUinByUidRequest to JSON.
             * @function toJSON
             * @memberof kritor.friend.GetUinByUidRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetUinByUidRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GetUinByUidRequest
             * @function getTypeUrl
             * @memberof kritor.friend.GetUinByUidRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetUinByUidRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.friend.GetUinByUidRequest";
            };

            return GetUinByUidRequest;
        })();

        friend.GetUinByUidResponse = (function() {

            /**
             * Properties of a GetUinByUidResponse.
             * @memberof kritor.friend
             * @interface IGetUinByUidResponse
             * @property {Object.<string,number|Long>|null} [uinMap] GetUinByUidResponse uinMap
             */

            /**
             * Constructs a new GetUinByUidResponse.
             * @memberof kritor.friend
             * @classdesc Represents a GetUinByUidResponse.
             * @implements IGetUinByUidResponse
             * @constructor
             * @param {kritor.friend.IGetUinByUidResponse=} [properties] Properties to set
             */
            function GetUinByUidResponse(properties) {
                this.uinMap = {};
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetUinByUidResponse uinMap.
             * @member {Object.<string,number|Long>} uinMap
             * @memberof kritor.friend.GetUinByUidResponse
             * @instance
             */
            GetUinByUidResponse.prototype.uinMap = $util.emptyObject;

            /**
             * Creates a new GetUinByUidResponse instance using the specified properties.
             * @function create
             * @memberof kritor.friend.GetUinByUidResponse
             * @static
             * @param {kritor.friend.IGetUinByUidResponse=} [properties] Properties to set
             * @returns {kritor.friend.GetUinByUidResponse} GetUinByUidResponse instance
             */
            GetUinByUidResponse.create = function create(properties) {
                return new GetUinByUidResponse(properties);
            };

            /**
             * Encodes the specified GetUinByUidResponse message. Does not implicitly {@link kritor.friend.GetUinByUidResponse.verify|verify} messages.
             * @function encode
             * @memberof kritor.friend.GetUinByUidResponse
             * @static
             * @param {kritor.friend.IGetUinByUidResponse} message GetUinByUidResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetUinByUidResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.uinMap != null && Object.hasOwnProperty.call(message, "uinMap"))
                    for (let keys = Object.keys(message.uinMap), i = 0; i < keys.length; ++i)
                        writer.uint32(/* id 1, wireType 2 =*/10).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]).uint32(/* id 2, wireType 0 =*/16).uint64(message.uinMap[keys[i]]).ldelim();
                return writer;
            };

            /**
             * Encodes the specified GetUinByUidResponse message, length delimited. Does not implicitly {@link kritor.friend.GetUinByUidResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.friend.GetUinByUidResponse
             * @static
             * @param {kritor.friend.IGetUinByUidResponse} message GetUinByUidResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetUinByUidResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetUinByUidResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.friend.GetUinByUidResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.friend.GetUinByUidResponse} GetUinByUidResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetUinByUidResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.friend.GetUinByUidResponse(), key, value;
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            if (message.uinMap === $util.emptyObject)
                                message.uinMap = {};
                            let end2 = reader.uint32() + reader.pos;
                            key = "";
                            value = 0;
                            while (reader.pos < end2) {
                                let tag2 = reader.uint32();
                                switch (tag2 >>> 3) {
                                case 1:
                                    key = reader.string();
                                    break;
                                case 2:
                                    value = reader.uint64();
                                    break;
                                default:
                                    reader.skipType(tag2 & 7);
                                    break;
                                }
                            }
                            message.uinMap[key] = value;
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
             * Decodes a GetUinByUidResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.friend.GetUinByUidResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.friend.GetUinByUidResponse} GetUinByUidResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetUinByUidResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetUinByUidResponse message.
             * @function verify
             * @memberof kritor.friend.GetUinByUidResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetUinByUidResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.uinMap != null && message.hasOwnProperty("uinMap")) {
                    if (!$util.isObject(message.uinMap))
                        return "uinMap: object expected";
                    let key = Object.keys(message.uinMap);
                    for (let i = 0; i < key.length; ++i)
                        if (!$util.isInteger(message.uinMap[key[i]]) && !(message.uinMap[key[i]] && $util.isInteger(message.uinMap[key[i]].low) && $util.isInteger(message.uinMap[key[i]].high)))
                            return "uinMap: integer|Long{k:string} expected";
                }
                return null;
            };

            /**
             * Creates a GetUinByUidResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.friend.GetUinByUidResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.friend.GetUinByUidResponse} GetUinByUidResponse
             */
            GetUinByUidResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.friend.GetUinByUidResponse)
                    return object;
                let message = new $root.kritor.friend.GetUinByUidResponse();
                if (object.uinMap) {
                    if (typeof object.uinMap !== "object")
                        throw TypeError(".kritor.friend.GetUinByUidResponse.uinMap: object expected");
                    message.uinMap = {};
                    for (let keys = Object.keys(object.uinMap), i = 0; i < keys.length; ++i)
                        if ($util.Long)
                            (message.uinMap[keys[i]] = $util.Long.fromValue(object.uinMap[keys[i]])).unsigned = true;
                        else if (typeof object.uinMap[keys[i]] === "string")
                            message.uinMap[keys[i]] = parseInt(object.uinMap[keys[i]], 10);
                        else if (typeof object.uinMap[keys[i]] === "number")
                            message.uinMap[keys[i]] = object.uinMap[keys[i]];
                        else if (typeof object.uinMap[keys[i]] === "object")
                            message.uinMap[keys[i]] = new $util.LongBits(object.uinMap[keys[i]].low >>> 0, object.uinMap[keys[i]].high >>> 0).toNumber(true);
                }
                return message;
            };

            /**
             * Creates a plain object from a GetUinByUidResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.friend.GetUinByUidResponse
             * @static
             * @param {kritor.friend.GetUinByUidResponse} message GetUinByUidResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetUinByUidResponse.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.objects || options.defaults)
                    object.uinMap = {};
                let keys2;
                if (message.uinMap && (keys2 = Object.keys(message.uinMap)).length) {
                    object.uinMap = {};
                    for (let j = 0; j < keys2.length; ++j)
                        if (typeof message.uinMap[keys2[j]] === "number")
                            object.uinMap[keys2[j]] = options.longs === String ? String(message.uinMap[keys2[j]]) : message.uinMap[keys2[j]];
                        else
                            object.uinMap[keys2[j]] = options.longs === String ? $util.Long.prototype.toString.call(message.uinMap[keys2[j]]) : options.longs === Number ? new $util.LongBits(message.uinMap[keys2[j]].low >>> 0, message.uinMap[keys2[j]].high >>> 0).toNumber(true) : message.uinMap[keys2[j]];
                }
                return object;
            };

            /**
             * Converts this GetUinByUidResponse to JSON.
             * @function toJSON
             * @memberof kritor.friend.GetUinByUidResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetUinByUidResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GetUinByUidResponse
             * @function getTypeUrl
             * @memberof kritor.friend.GetUinByUidResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetUinByUidResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.friend.GetUinByUidResponse";
            };

            return GetUinByUidResponse;
        })();

        friend.FriendInfo = (function() {

            /**
             * Properties of a FriendInfo.
             * @memberof kritor.friend
             * @interface IFriendInfo
             * @property {string|null} [uid] FriendInfo uid
             * @property {number|Long|null} [uin] FriendInfo uin
             * @property {string|null} [qid] FriendInfo qid
             * @property {string|null} [nick] FriendInfo nick
             * @property {string|null} [remark] FriendInfo remark
             * @property {number|null} [level] FriendInfo level
             * @property {number|null} [age] FriendInfo age
             * @property {number|null} [voteCnt] FriendInfo voteCnt
             * @property {number|null} [gender] FriendInfo gender
             * @property {number|null} [groupId] FriendInfo groupId
             * @property {kritor.friend.IExtInfo|null} [ext] FriendInfo ext
             */

            /**
             * Constructs a new FriendInfo.
             * @memberof kritor.friend
             * @classdesc Represents a FriendInfo.
             * @implements IFriendInfo
             * @constructor
             * @param {kritor.friend.IFriendInfo=} [properties] Properties to set
             */
            function FriendInfo(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * FriendInfo uid.
             * @member {string} uid
             * @memberof kritor.friend.FriendInfo
             * @instance
             */
            FriendInfo.prototype.uid = "";

            /**
             * FriendInfo uin.
             * @member {number|Long} uin
             * @memberof kritor.friend.FriendInfo
             * @instance
             */
            FriendInfo.prototype.uin = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * FriendInfo qid.
             * @member {string} qid
             * @memberof kritor.friend.FriendInfo
             * @instance
             */
            FriendInfo.prototype.qid = "";

            /**
             * FriendInfo nick.
             * @member {string} nick
             * @memberof kritor.friend.FriendInfo
             * @instance
             */
            FriendInfo.prototype.nick = "";

            /**
             * FriendInfo remark.
             * @member {string} remark
             * @memberof kritor.friend.FriendInfo
             * @instance
             */
            FriendInfo.prototype.remark = "";

            /**
             * FriendInfo level.
             * @member {number} level
             * @memberof kritor.friend.FriendInfo
             * @instance
             */
            FriendInfo.prototype.level = 0;

            /**
             * FriendInfo age.
             * @member {number} age
             * @memberof kritor.friend.FriendInfo
             * @instance
             */
            FriendInfo.prototype.age = 0;

            /**
             * FriendInfo voteCnt.
             * @member {number} voteCnt
             * @memberof kritor.friend.FriendInfo
             * @instance
             */
            FriendInfo.prototype.voteCnt = 0;

            /**
             * FriendInfo gender.
             * @member {number} gender
             * @memberof kritor.friend.FriendInfo
             * @instance
             */
            FriendInfo.prototype.gender = 0;

            /**
             * FriendInfo groupId.
             * @member {number} groupId
             * @memberof kritor.friend.FriendInfo
             * @instance
             */
            FriendInfo.prototype.groupId = 0;

            /**
             * FriendInfo ext.
             * @member {kritor.friend.IExtInfo|null|undefined} ext
             * @memberof kritor.friend.FriendInfo
             * @instance
             */
            FriendInfo.prototype.ext = null;

            // OneOf field names bound to virtual getters and setters
            let $oneOfFields;

            /**
             * FriendInfo _ext.
             * @member {"ext"|undefined} _ext
             * @memberof kritor.friend.FriendInfo
             * @instance
             */
            Object.defineProperty(FriendInfo.prototype, "_ext", {
                get: $util.oneOfGetter($oneOfFields = ["ext"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new FriendInfo instance using the specified properties.
             * @function create
             * @memberof kritor.friend.FriendInfo
             * @static
             * @param {kritor.friend.IFriendInfo=} [properties] Properties to set
             * @returns {kritor.friend.FriendInfo} FriendInfo instance
             */
            FriendInfo.create = function create(properties) {
                return new FriendInfo(properties);
            };

            /**
             * Encodes the specified FriendInfo message. Does not implicitly {@link kritor.friend.FriendInfo.verify|verify} messages.
             * @function encode
             * @memberof kritor.friend.FriendInfo
             * @static
             * @param {kritor.friend.IFriendInfo} message FriendInfo message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            FriendInfo.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.uid != null && Object.hasOwnProperty.call(message, "uid"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.uid);
                if (message.uin != null && Object.hasOwnProperty.call(message, "uin"))
                    writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.uin);
                if (message.qid != null && Object.hasOwnProperty.call(message, "qid"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.qid);
                if (message.nick != null && Object.hasOwnProperty.call(message, "nick"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.nick);
                if (message.remark != null && Object.hasOwnProperty.call(message, "remark"))
                    writer.uint32(/* id 5, wireType 2 =*/42).string(message.remark);
                if (message.level != null && Object.hasOwnProperty.call(message, "level"))
                    writer.uint32(/* id 6, wireType 0 =*/48).uint32(message.level);
                if (message.age != null && Object.hasOwnProperty.call(message, "age"))
                    writer.uint32(/* id 7, wireType 0 =*/56).uint32(message.age);
                if (message.voteCnt != null && Object.hasOwnProperty.call(message, "voteCnt"))
                    writer.uint32(/* id 8, wireType 0 =*/64).uint32(message.voteCnt);
                if (message.gender != null && Object.hasOwnProperty.call(message, "gender"))
                    writer.uint32(/* id 9, wireType 0 =*/72).int32(message.gender);
                if (message.groupId != null && Object.hasOwnProperty.call(message, "groupId"))
                    writer.uint32(/* id 10, wireType 0 =*/80).int32(message.groupId);
                if (message.ext != null && Object.hasOwnProperty.call(message, "ext"))
                    $root.kritor.friend.ExtInfo.encode(message.ext, writer.uint32(/* id 99, wireType 2 =*/794).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified FriendInfo message, length delimited. Does not implicitly {@link kritor.friend.FriendInfo.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.friend.FriendInfo
             * @static
             * @param {kritor.friend.IFriendInfo} message FriendInfo message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            FriendInfo.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a FriendInfo message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.friend.FriendInfo
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.friend.FriendInfo} FriendInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            FriendInfo.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.friend.FriendInfo();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.uid = reader.string();
                            break;
                        }
                    case 2: {
                            message.uin = reader.uint64();
                            break;
                        }
                    case 3: {
                            message.qid = reader.string();
                            break;
                        }
                    case 4: {
                            message.nick = reader.string();
                            break;
                        }
                    case 5: {
                            message.remark = reader.string();
                            break;
                        }
                    case 6: {
                            message.level = reader.uint32();
                            break;
                        }
                    case 7: {
                            message.age = reader.uint32();
                            break;
                        }
                    case 8: {
                            message.voteCnt = reader.uint32();
                            break;
                        }
                    case 9: {
                            message.gender = reader.int32();
                            break;
                        }
                    case 10: {
                            message.groupId = reader.int32();
                            break;
                        }
                    case 99: {
                            message.ext = $root.kritor.friend.ExtInfo.decode(reader, reader.uint32());
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
             * Decodes a FriendInfo message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.friend.FriendInfo
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.friend.FriendInfo} FriendInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            FriendInfo.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a FriendInfo message.
             * @function verify
             * @memberof kritor.friend.FriendInfo
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            FriendInfo.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                let properties = {};
                if (message.uid != null && message.hasOwnProperty("uid"))
                    if (!$util.isString(message.uid))
                        return "uid: string expected";
                if (message.uin != null && message.hasOwnProperty("uin"))
                    if (!$util.isInteger(message.uin) && !(message.uin && $util.isInteger(message.uin.low) && $util.isInteger(message.uin.high)))
                        return "uin: integer|Long expected";
                if (message.qid != null && message.hasOwnProperty("qid"))
                    if (!$util.isString(message.qid))
                        return "qid: string expected";
                if (message.nick != null && message.hasOwnProperty("nick"))
                    if (!$util.isString(message.nick))
                        return "nick: string expected";
                if (message.remark != null && message.hasOwnProperty("remark"))
                    if (!$util.isString(message.remark))
                        return "remark: string expected";
                if (message.level != null && message.hasOwnProperty("level"))
                    if (!$util.isInteger(message.level))
                        return "level: integer expected";
                if (message.age != null && message.hasOwnProperty("age"))
                    if (!$util.isInteger(message.age))
                        return "age: integer expected";
                if (message.voteCnt != null && message.hasOwnProperty("voteCnt"))
                    if (!$util.isInteger(message.voteCnt))
                        return "voteCnt: integer expected";
                if (message.gender != null && message.hasOwnProperty("gender"))
                    if (!$util.isInteger(message.gender))
                        return "gender: integer expected";
                if (message.groupId != null && message.hasOwnProperty("groupId"))
                    if (!$util.isInteger(message.groupId))
                        return "groupId: integer expected";
                if (message.ext != null && message.hasOwnProperty("ext")) {
                    properties._ext = 1;
                    {
                        let error = $root.kritor.friend.ExtInfo.verify(message.ext);
                        if (error)
                            return "ext." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a FriendInfo message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.friend.FriendInfo
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.friend.FriendInfo} FriendInfo
             */
            FriendInfo.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.friend.FriendInfo)
                    return object;
                let message = new $root.kritor.friend.FriendInfo();
                if (object.uid != null)
                    message.uid = String(object.uid);
                if (object.uin != null)
                    if ($util.Long)
                        (message.uin = $util.Long.fromValue(object.uin)).unsigned = true;
                    else if (typeof object.uin === "string")
                        message.uin = parseInt(object.uin, 10);
                    else if (typeof object.uin === "number")
                        message.uin = object.uin;
                    else if (typeof object.uin === "object")
                        message.uin = new $util.LongBits(object.uin.low >>> 0, object.uin.high >>> 0).toNumber(true);
                if (object.qid != null)
                    message.qid = String(object.qid);
                if (object.nick != null)
                    message.nick = String(object.nick);
                if (object.remark != null)
                    message.remark = String(object.remark);
                if (object.level != null)
                    message.level = object.level >>> 0;
                if (object.age != null)
                    message.age = object.age >>> 0;
                if (object.voteCnt != null)
                    message.voteCnt = object.voteCnt >>> 0;
                if (object.gender != null)
                    message.gender = object.gender | 0;
                if (object.groupId != null)
                    message.groupId = object.groupId | 0;
                if (object.ext != null) {
                    if (typeof object.ext !== "object")
                        throw TypeError(".kritor.friend.FriendInfo.ext: object expected");
                    message.ext = $root.kritor.friend.ExtInfo.fromObject(object.ext);
                }
                return message;
            };

            /**
             * Creates a plain object from a FriendInfo message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.friend.FriendInfo
             * @static
             * @param {kritor.friend.FriendInfo} message FriendInfo
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            FriendInfo.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.uid = "";
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.uin = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.uin = options.longs === String ? "0" : 0;
                    object.qid = "";
                    object.nick = "";
                    object.remark = "";
                    object.level = 0;
                    object.age = 0;
                    object.voteCnt = 0;
                    object.gender = 0;
                    object.groupId = 0;
                }
                if (message.uid != null && message.hasOwnProperty("uid"))
                    object.uid = message.uid;
                if (message.uin != null && message.hasOwnProperty("uin"))
                    if (typeof message.uin === "number")
                        object.uin = options.longs === String ? String(message.uin) : message.uin;
                    else
                        object.uin = options.longs === String ? $util.Long.prototype.toString.call(message.uin) : options.longs === Number ? new $util.LongBits(message.uin.low >>> 0, message.uin.high >>> 0).toNumber(true) : message.uin;
                if (message.qid != null && message.hasOwnProperty("qid"))
                    object.qid = message.qid;
                if (message.nick != null && message.hasOwnProperty("nick"))
                    object.nick = message.nick;
                if (message.remark != null && message.hasOwnProperty("remark"))
                    object.remark = message.remark;
                if (message.level != null && message.hasOwnProperty("level"))
                    object.level = message.level;
                if (message.age != null && message.hasOwnProperty("age"))
                    object.age = message.age;
                if (message.voteCnt != null && message.hasOwnProperty("voteCnt"))
                    object.voteCnt = message.voteCnt;
                if (message.gender != null && message.hasOwnProperty("gender"))
                    object.gender = message.gender;
                if (message.groupId != null && message.hasOwnProperty("groupId"))
                    object.groupId = message.groupId;
                if (message.ext != null && message.hasOwnProperty("ext")) {
                    object.ext = $root.kritor.friend.ExtInfo.toObject(message.ext, options);
                    if (options.oneofs)
                        object._ext = "ext";
                }
                return object;
            };

            /**
             * Converts this FriendInfo to JSON.
             * @function toJSON
             * @memberof kritor.friend.FriendInfo
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            FriendInfo.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for FriendInfo
             * @function getTypeUrl
             * @memberof kritor.friend.FriendInfo
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            FriendInfo.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.friend.FriendInfo";
            };

            return FriendInfo;
        })();

        friend.ProfileCard = (function() {

            /**
             * Properties of a ProfileCard.
             * @memberof kritor.friend
             * @interface IProfileCard
             * @property {string|null} [uid] ProfileCard uid
             * @property {number|Long|null} [uin] ProfileCard uin
             * @property {string|null} [qid] ProfileCard qid
             * @property {string|null} [nick] ProfileCard nick
             * @property {string|null} [remark] ProfileCard remark
             * @property {number|null} [level] ProfileCard level
             * @property {number|Long|null} [birthday] ProfileCard birthday
             * @property {number|null} [loginDay] ProfileCard loginDay
             * @property {number|null} [voteCnt] ProfileCard voteCnt
             * @property {boolean|null} [isSchoolVerified] ProfileCard isSchoolVerified
             * @property {kritor.friend.IExtInfo|null} [ext] ProfileCard ext
             */

            /**
             * Constructs a new ProfileCard.
             * @memberof kritor.friend
             * @classdesc Represents a ProfileCard.
             * @implements IProfileCard
             * @constructor
             * @param {kritor.friend.IProfileCard=} [properties] Properties to set
             */
            function ProfileCard(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * ProfileCard uid.
             * @member {string} uid
             * @memberof kritor.friend.ProfileCard
             * @instance
             */
            ProfileCard.prototype.uid = "";

            /**
             * ProfileCard uin.
             * @member {number|Long} uin
             * @memberof kritor.friend.ProfileCard
             * @instance
             */
            ProfileCard.prototype.uin = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * ProfileCard qid.
             * @member {string} qid
             * @memberof kritor.friend.ProfileCard
             * @instance
             */
            ProfileCard.prototype.qid = "";

            /**
             * ProfileCard nick.
             * @member {string} nick
             * @memberof kritor.friend.ProfileCard
             * @instance
             */
            ProfileCard.prototype.nick = "";

            /**
             * ProfileCard remark.
             * @member {string|null|undefined} remark
             * @memberof kritor.friend.ProfileCard
             * @instance
             */
            ProfileCard.prototype.remark = null;

            /**
             * ProfileCard level.
             * @member {number} level
             * @memberof kritor.friend.ProfileCard
             * @instance
             */
            ProfileCard.prototype.level = 0;

            /**
             * ProfileCard birthday.
             * @member {number|Long|null|undefined} birthday
             * @memberof kritor.friend.ProfileCard
             * @instance
             */
            ProfileCard.prototype.birthday = null;

            /**
             * ProfileCard loginDay.
             * @member {number} loginDay
             * @memberof kritor.friend.ProfileCard
             * @instance
             */
            ProfileCard.prototype.loginDay = 0;

            /**
             * ProfileCard voteCnt.
             * @member {number} voteCnt
             * @memberof kritor.friend.ProfileCard
             * @instance
             */
            ProfileCard.prototype.voteCnt = 0;

            /**
             * ProfileCard isSchoolVerified.
             * @member {boolean|null|undefined} isSchoolVerified
             * @memberof kritor.friend.ProfileCard
             * @instance
             */
            ProfileCard.prototype.isSchoolVerified = null;

            /**
             * ProfileCard ext.
             * @member {kritor.friend.IExtInfo|null|undefined} ext
             * @memberof kritor.friend.ProfileCard
             * @instance
             */
            ProfileCard.prototype.ext = null;

            // OneOf field names bound to virtual getters and setters
            let $oneOfFields;

            /**
             * ProfileCard _remark.
             * @member {"remark"|undefined} _remark
             * @memberof kritor.friend.ProfileCard
             * @instance
             */
            Object.defineProperty(ProfileCard.prototype, "_remark", {
                get: $util.oneOfGetter($oneOfFields = ["remark"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * ProfileCard _birthday.
             * @member {"birthday"|undefined} _birthday
             * @memberof kritor.friend.ProfileCard
             * @instance
             */
            Object.defineProperty(ProfileCard.prototype, "_birthday", {
                get: $util.oneOfGetter($oneOfFields = ["birthday"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * ProfileCard _isSchoolVerified.
             * @member {"isSchoolVerified"|undefined} _isSchoolVerified
             * @memberof kritor.friend.ProfileCard
             * @instance
             */
            Object.defineProperty(ProfileCard.prototype, "_isSchoolVerified", {
                get: $util.oneOfGetter($oneOfFields = ["isSchoolVerified"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * ProfileCard _ext.
             * @member {"ext"|undefined} _ext
             * @memberof kritor.friend.ProfileCard
             * @instance
             */
            Object.defineProperty(ProfileCard.prototype, "_ext", {
                get: $util.oneOfGetter($oneOfFields = ["ext"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new ProfileCard instance using the specified properties.
             * @function create
             * @memberof kritor.friend.ProfileCard
             * @static
             * @param {kritor.friend.IProfileCard=} [properties] Properties to set
             * @returns {kritor.friend.ProfileCard} ProfileCard instance
             */
            ProfileCard.create = function create(properties) {
                return new ProfileCard(properties);
            };

            /**
             * Encodes the specified ProfileCard message. Does not implicitly {@link kritor.friend.ProfileCard.verify|verify} messages.
             * @function encode
             * @memberof kritor.friend.ProfileCard
             * @static
             * @param {kritor.friend.IProfileCard} message ProfileCard message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ProfileCard.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.uid != null && Object.hasOwnProperty.call(message, "uid"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.uid);
                if (message.uin != null && Object.hasOwnProperty.call(message, "uin"))
                    writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.uin);
                if (message.qid != null && Object.hasOwnProperty.call(message, "qid"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.qid);
                if (message.nick != null && Object.hasOwnProperty.call(message, "nick"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.nick);
                if (message.remark != null && Object.hasOwnProperty.call(message, "remark"))
                    writer.uint32(/* id 5, wireType 2 =*/42).string(message.remark);
                if (message.level != null && Object.hasOwnProperty.call(message, "level"))
                    writer.uint32(/* id 6, wireType 0 =*/48).uint32(message.level);
                if (message.birthday != null && Object.hasOwnProperty.call(message, "birthday"))
                    writer.uint32(/* id 7, wireType 0 =*/56).uint64(message.birthday);
                if (message.loginDay != null && Object.hasOwnProperty.call(message, "loginDay"))
                    writer.uint32(/* id 8, wireType 0 =*/64).uint32(message.loginDay);
                if (message.voteCnt != null && Object.hasOwnProperty.call(message, "voteCnt"))
                    writer.uint32(/* id 9, wireType 0 =*/72).uint32(message.voteCnt);
                if (message.isSchoolVerified != null && Object.hasOwnProperty.call(message, "isSchoolVerified"))
                    writer.uint32(/* id 51, wireType 0 =*/408).bool(message.isSchoolVerified);
                if (message.ext != null && Object.hasOwnProperty.call(message, "ext"))
                    $root.kritor.friend.ExtInfo.encode(message.ext, writer.uint32(/* id 99, wireType 2 =*/794).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified ProfileCard message, length delimited. Does not implicitly {@link kritor.friend.ProfileCard.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.friend.ProfileCard
             * @static
             * @param {kritor.friend.IProfileCard} message ProfileCard message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ProfileCard.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a ProfileCard message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.friend.ProfileCard
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.friend.ProfileCard} ProfileCard
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ProfileCard.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.friend.ProfileCard();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.uid = reader.string();
                            break;
                        }
                    case 2: {
                            message.uin = reader.uint64();
                            break;
                        }
                    case 3: {
                            message.qid = reader.string();
                            break;
                        }
                    case 4: {
                            message.nick = reader.string();
                            break;
                        }
                    case 5: {
                            message.remark = reader.string();
                            break;
                        }
                    case 6: {
                            message.level = reader.uint32();
                            break;
                        }
                    case 7: {
                            message.birthday = reader.uint64();
                            break;
                        }
                    case 8: {
                            message.loginDay = reader.uint32();
                            break;
                        }
                    case 9: {
                            message.voteCnt = reader.uint32();
                            break;
                        }
                    case 51: {
                            message.isSchoolVerified = reader.bool();
                            break;
                        }
                    case 99: {
                            message.ext = $root.kritor.friend.ExtInfo.decode(reader, reader.uint32());
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
             * Decodes a ProfileCard message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.friend.ProfileCard
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.friend.ProfileCard} ProfileCard
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ProfileCard.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a ProfileCard message.
             * @function verify
             * @memberof kritor.friend.ProfileCard
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ProfileCard.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                let properties = {};
                if (message.uid != null && message.hasOwnProperty("uid"))
                    if (!$util.isString(message.uid))
                        return "uid: string expected";
                if (message.uin != null && message.hasOwnProperty("uin"))
                    if (!$util.isInteger(message.uin) && !(message.uin && $util.isInteger(message.uin.low) && $util.isInteger(message.uin.high)))
                        return "uin: integer|Long expected";
                if (message.qid != null && message.hasOwnProperty("qid"))
                    if (!$util.isString(message.qid))
                        return "qid: string expected";
                if (message.nick != null && message.hasOwnProperty("nick"))
                    if (!$util.isString(message.nick))
                        return "nick: string expected";
                if (message.remark != null && message.hasOwnProperty("remark")) {
                    properties._remark = 1;
                    if (!$util.isString(message.remark))
                        return "remark: string expected";
                }
                if (message.level != null && message.hasOwnProperty("level"))
                    if (!$util.isInteger(message.level))
                        return "level: integer expected";
                if (message.birthday != null && message.hasOwnProperty("birthday")) {
                    properties._birthday = 1;
                    if (!$util.isInteger(message.birthday) && !(message.birthday && $util.isInteger(message.birthday.low) && $util.isInteger(message.birthday.high)))
                        return "birthday: integer|Long expected";
                }
                if (message.loginDay != null && message.hasOwnProperty("loginDay"))
                    if (!$util.isInteger(message.loginDay))
                        return "loginDay: integer expected";
                if (message.voteCnt != null && message.hasOwnProperty("voteCnt"))
                    if (!$util.isInteger(message.voteCnt))
                        return "voteCnt: integer expected";
                if (message.isSchoolVerified != null && message.hasOwnProperty("isSchoolVerified")) {
                    properties._isSchoolVerified = 1;
                    if (typeof message.isSchoolVerified !== "boolean")
                        return "isSchoolVerified: boolean expected";
                }
                if (message.ext != null && message.hasOwnProperty("ext")) {
                    properties._ext = 1;
                    {
                        let error = $root.kritor.friend.ExtInfo.verify(message.ext);
                        if (error)
                            return "ext." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a ProfileCard message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.friend.ProfileCard
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.friend.ProfileCard} ProfileCard
             */
            ProfileCard.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.friend.ProfileCard)
                    return object;
                let message = new $root.kritor.friend.ProfileCard();
                if (object.uid != null)
                    message.uid = String(object.uid);
                if (object.uin != null)
                    if ($util.Long)
                        (message.uin = $util.Long.fromValue(object.uin)).unsigned = true;
                    else if (typeof object.uin === "string")
                        message.uin = parseInt(object.uin, 10);
                    else if (typeof object.uin === "number")
                        message.uin = object.uin;
                    else if (typeof object.uin === "object")
                        message.uin = new $util.LongBits(object.uin.low >>> 0, object.uin.high >>> 0).toNumber(true);
                if (object.qid != null)
                    message.qid = String(object.qid);
                if (object.nick != null)
                    message.nick = String(object.nick);
                if (object.remark != null)
                    message.remark = String(object.remark);
                if (object.level != null)
                    message.level = object.level >>> 0;
                if (object.birthday != null)
                    if ($util.Long)
                        (message.birthday = $util.Long.fromValue(object.birthday)).unsigned = true;
                    else if (typeof object.birthday === "string")
                        message.birthday = parseInt(object.birthday, 10);
                    else if (typeof object.birthday === "number")
                        message.birthday = object.birthday;
                    else if (typeof object.birthday === "object")
                        message.birthday = new $util.LongBits(object.birthday.low >>> 0, object.birthday.high >>> 0).toNumber(true);
                if (object.loginDay != null)
                    message.loginDay = object.loginDay >>> 0;
                if (object.voteCnt != null)
                    message.voteCnt = object.voteCnt >>> 0;
                if (object.isSchoolVerified != null)
                    message.isSchoolVerified = Boolean(object.isSchoolVerified);
                if (object.ext != null) {
                    if (typeof object.ext !== "object")
                        throw TypeError(".kritor.friend.ProfileCard.ext: object expected");
                    message.ext = $root.kritor.friend.ExtInfo.fromObject(object.ext);
                }
                return message;
            };

            /**
             * Creates a plain object from a ProfileCard message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.friend.ProfileCard
             * @static
             * @param {kritor.friend.ProfileCard} message ProfileCard
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ProfileCard.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.uid = "";
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.uin = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.uin = options.longs === String ? "0" : 0;
                    object.qid = "";
                    object.nick = "";
                    object.level = 0;
                    object.loginDay = 0;
                    object.voteCnt = 0;
                }
                if (message.uid != null && message.hasOwnProperty("uid"))
                    object.uid = message.uid;
                if (message.uin != null && message.hasOwnProperty("uin"))
                    if (typeof message.uin === "number")
                        object.uin = options.longs === String ? String(message.uin) : message.uin;
                    else
                        object.uin = options.longs === String ? $util.Long.prototype.toString.call(message.uin) : options.longs === Number ? new $util.LongBits(message.uin.low >>> 0, message.uin.high >>> 0).toNumber(true) : message.uin;
                if (message.qid != null && message.hasOwnProperty("qid"))
                    object.qid = message.qid;
                if (message.nick != null && message.hasOwnProperty("nick"))
                    object.nick = message.nick;
                if (message.remark != null && message.hasOwnProperty("remark")) {
                    object.remark = message.remark;
                    if (options.oneofs)
                        object._remark = "remark";
                }
                if (message.level != null && message.hasOwnProperty("level"))
                    object.level = message.level;
                if (message.birthday != null && message.hasOwnProperty("birthday")) {
                    if (typeof message.birthday === "number")
                        object.birthday = options.longs === String ? String(message.birthday) : message.birthday;
                    else
                        object.birthday = options.longs === String ? $util.Long.prototype.toString.call(message.birthday) : options.longs === Number ? new $util.LongBits(message.birthday.low >>> 0, message.birthday.high >>> 0).toNumber(true) : message.birthday;
                    if (options.oneofs)
                        object._birthday = "birthday";
                }
                if (message.loginDay != null && message.hasOwnProperty("loginDay"))
                    object.loginDay = message.loginDay;
                if (message.voteCnt != null && message.hasOwnProperty("voteCnt"))
                    object.voteCnt = message.voteCnt;
                if (message.isSchoolVerified != null && message.hasOwnProperty("isSchoolVerified")) {
                    object.isSchoolVerified = message.isSchoolVerified;
                    if (options.oneofs)
                        object._isSchoolVerified = "isSchoolVerified";
                }
                if (message.ext != null && message.hasOwnProperty("ext")) {
                    object.ext = $root.kritor.friend.ExtInfo.toObject(message.ext, options);
                    if (options.oneofs)
                        object._ext = "ext";
                }
                return object;
            };

            /**
             * Converts this ProfileCard to JSON.
             * @function toJSON
             * @memberof kritor.friend.ProfileCard
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ProfileCard.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for ProfileCard
             * @function getTypeUrl
             * @memberof kritor.friend.ProfileCard
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            ProfileCard.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.friend.ProfileCard";
            };

            return ProfileCard;
        })();

        friend.ExtInfo = (function() {

            /**
             * Properties of an ExtInfo.
             * @memberof kritor.friend
             * @interface IExtInfo
             * @property {boolean|null} [bigVip] ExtInfo bigVip
             * @property {boolean|null} [hollywoodVip] ExtInfo hollywoodVip
             * @property {boolean|null} [qqVip] ExtInfo qqVip
             * @property {boolean|null} [superVip] ExtInfo superVip
             * @property {boolean|null} [voted] ExtInfo voted
             */

            /**
             * Constructs a new ExtInfo.
             * @memberof kritor.friend
             * @classdesc Represents an ExtInfo.
             * @implements IExtInfo
             * @constructor
             * @param {kritor.friend.IExtInfo=} [properties] Properties to set
             */
            function ExtInfo(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * ExtInfo bigVip.
             * @member {boolean|null|undefined} bigVip
             * @memberof kritor.friend.ExtInfo
             * @instance
             */
            ExtInfo.prototype.bigVip = null;

            /**
             * ExtInfo hollywoodVip.
             * @member {boolean|null|undefined} hollywoodVip
             * @memberof kritor.friend.ExtInfo
             * @instance
             */
            ExtInfo.prototype.hollywoodVip = null;

            /**
             * ExtInfo qqVip.
             * @member {boolean|null|undefined} qqVip
             * @memberof kritor.friend.ExtInfo
             * @instance
             */
            ExtInfo.prototype.qqVip = null;

            /**
             * ExtInfo superVip.
             * @member {boolean|null|undefined} superVip
             * @memberof kritor.friend.ExtInfo
             * @instance
             */
            ExtInfo.prototype.superVip = null;

            /**
             * ExtInfo voted.
             * @member {boolean|null|undefined} voted
             * @memberof kritor.friend.ExtInfo
             * @instance
             */
            ExtInfo.prototype.voted = null;

            // OneOf field names bound to virtual getters and setters
            let $oneOfFields;

            /**
             * ExtInfo _bigVip.
             * @member {"bigVip"|undefined} _bigVip
             * @memberof kritor.friend.ExtInfo
             * @instance
             */
            Object.defineProperty(ExtInfo.prototype, "_bigVip", {
                get: $util.oneOfGetter($oneOfFields = ["bigVip"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * ExtInfo _hollywoodVip.
             * @member {"hollywoodVip"|undefined} _hollywoodVip
             * @memberof kritor.friend.ExtInfo
             * @instance
             */
            Object.defineProperty(ExtInfo.prototype, "_hollywoodVip", {
                get: $util.oneOfGetter($oneOfFields = ["hollywoodVip"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * ExtInfo _qqVip.
             * @member {"qqVip"|undefined} _qqVip
             * @memberof kritor.friend.ExtInfo
             * @instance
             */
            Object.defineProperty(ExtInfo.prototype, "_qqVip", {
                get: $util.oneOfGetter($oneOfFields = ["qqVip"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * ExtInfo _superVip.
             * @member {"superVip"|undefined} _superVip
             * @memberof kritor.friend.ExtInfo
             * @instance
             */
            Object.defineProperty(ExtInfo.prototype, "_superVip", {
                get: $util.oneOfGetter($oneOfFields = ["superVip"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * ExtInfo _voted.
             * @member {"voted"|undefined} _voted
             * @memberof kritor.friend.ExtInfo
             * @instance
             */
            Object.defineProperty(ExtInfo.prototype, "_voted", {
                get: $util.oneOfGetter($oneOfFields = ["voted"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new ExtInfo instance using the specified properties.
             * @function create
             * @memberof kritor.friend.ExtInfo
             * @static
             * @param {kritor.friend.IExtInfo=} [properties] Properties to set
             * @returns {kritor.friend.ExtInfo} ExtInfo instance
             */
            ExtInfo.create = function create(properties) {
                return new ExtInfo(properties);
            };

            /**
             * Encodes the specified ExtInfo message. Does not implicitly {@link kritor.friend.ExtInfo.verify|verify} messages.
             * @function encode
             * @memberof kritor.friend.ExtInfo
             * @static
             * @param {kritor.friend.IExtInfo} message ExtInfo message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ExtInfo.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.bigVip != null && Object.hasOwnProperty.call(message, "bigVip"))
                    writer.uint32(/* id 1, wireType 0 =*/8).bool(message.bigVip);
                if (message.hollywoodVip != null && Object.hasOwnProperty.call(message, "hollywoodVip"))
                    writer.uint32(/* id 2, wireType 0 =*/16).bool(message.hollywoodVip);
                if (message.qqVip != null && Object.hasOwnProperty.call(message, "qqVip"))
                    writer.uint32(/* id 3, wireType 0 =*/24).bool(message.qqVip);
                if (message.superVip != null && Object.hasOwnProperty.call(message, "superVip"))
                    writer.uint32(/* id 4, wireType 0 =*/32).bool(message.superVip);
                if (message.voted != null && Object.hasOwnProperty.call(message, "voted"))
                    writer.uint32(/* id 5, wireType 0 =*/40).bool(message.voted);
                return writer;
            };

            /**
             * Encodes the specified ExtInfo message, length delimited. Does not implicitly {@link kritor.friend.ExtInfo.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.friend.ExtInfo
             * @static
             * @param {kritor.friend.IExtInfo} message ExtInfo message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ExtInfo.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an ExtInfo message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.friend.ExtInfo
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.friend.ExtInfo} ExtInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ExtInfo.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.friend.ExtInfo();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.bigVip = reader.bool();
                            break;
                        }
                    case 2: {
                            message.hollywoodVip = reader.bool();
                            break;
                        }
                    case 3: {
                            message.qqVip = reader.bool();
                            break;
                        }
                    case 4: {
                            message.superVip = reader.bool();
                            break;
                        }
                    case 5: {
                            message.voted = reader.bool();
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
             * Decodes an ExtInfo message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.friend.ExtInfo
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.friend.ExtInfo} ExtInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ExtInfo.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an ExtInfo message.
             * @function verify
             * @memberof kritor.friend.ExtInfo
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ExtInfo.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                let properties = {};
                if (message.bigVip != null && message.hasOwnProperty("bigVip")) {
                    properties._bigVip = 1;
                    if (typeof message.bigVip !== "boolean")
                        return "bigVip: boolean expected";
                }
                if (message.hollywoodVip != null && message.hasOwnProperty("hollywoodVip")) {
                    properties._hollywoodVip = 1;
                    if (typeof message.hollywoodVip !== "boolean")
                        return "hollywoodVip: boolean expected";
                }
                if (message.qqVip != null && message.hasOwnProperty("qqVip")) {
                    properties._qqVip = 1;
                    if (typeof message.qqVip !== "boolean")
                        return "qqVip: boolean expected";
                }
                if (message.superVip != null && message.hasOwnProperty("superVip")) {
                    properties._superVip = 1;
                    if (typeof message.superVip !== "boolean")
                        return "superVip: boolean expected";
                }
                if (message.voted != null && message.hasOwnProperty("voted")) {
                    properties._voted = 1;
                    if (typeof message.voted !== "boolean")
                        return "voted: boolean expected";
                }
                return null;
            };

            /**
             * Creates an ExtInfo message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.friend.ExtInfo
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.friend.ExtInfo} ExtInfo
             */
            ExtInfo.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.friend.ExtInfo)
                    return object;
                let message = new $root.kritor.friend.ExtInfo();
                if (object.bigVip != null)
                    message.bigVip = Boolean(object.bigVip);
                if (object.hollywoodVip != null)
                    message.hollywoodVip = Boolean(object.hollywoodVip);
                if (object.qqVip != null)
                    message.qqVip = Boolean(object.qqVip);
                if (object.superVip != null)
                    message.superVip = Boolean(object.superVip);
                if (object.voted != null)
                    message.voted = Boolean(object.voted);
                return message;
            };

            /**
             * Creates a plain object from an ExtInfo message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.friend.ExtInfo
             * @static
             * @param {kritor.friend.ExtInfo} message ExtInfo
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ExtInfo.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (message.bigVip != null && message.hasOwnProperty("bigVip")) {
                    object.bigVip = message.bigVip;
                    if (options.oneofs)
                        object._bigVip = "bigVip";
                }
                if (message.hollywoodVip != null && message.hasOwnProperty("hollywoodVip")) {
                    object.hollywoodVip = message.hollywoodVip;
                    if (options.oneofs)
                        object._hollywoodVip = "hollywoodVip";
                }
                if (message.qqVip != null && message.hasOwnProperty("qqVip")) {
                    object.qqVip = message.qqVip;
                    if (options.oneofs)
                        object._qqVip = "qqVip";
                }
                if (message.superVip != null && message.hasOwnProperty("superVip")) {
                    object.superVip = message.superVip;
                    if (options.oneofs)
                        object._superVip = "superVip";
                }
                if (message.voted != null && message.hasOwnProperty("voted")) {
                    object.voted = message.voted;
                    if (options.oneofs)
                        object._voted = "voted";
                }
                return object;
            };

            /**
             * Converts this ExtInfo to JSON.
             * @function toJSON
             * @memberof kritor.friend.ExtInfo
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ExtInfo.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for ExtInfo
             * @function getTypeUrl
             * @memberof kritor.friend.ExtInfo
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            ExtInfo.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.friend.ExtInfo";
            };

            return ExtInfo;
        })();

        return friend;
    })();

    return kritor;
})();

export { $root as default };
