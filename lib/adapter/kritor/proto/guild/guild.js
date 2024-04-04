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

    kritor.guild = (function() {

        /**
         * Namespace guild.
         * @memberof kritor
         * @namespace
         */
        const guild = {};

        guild.GuildService = (function() {

            /**
             * Constructs a new GuildService service.
             * @memberof kritor.guild
             * @classdesc Represents a GuildService
             * @extends $protobuf.rpc.Service
             * @constructor
             * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
             * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
             * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
             */
            function GuildService(rpcImpl, requestDelimited, responseDelimited) {
                $protobuf.rpc.Service.call(this, rpcImpl, requestDelimited, responseDelimited);
            }

            (GuildService.prototype = Object.create($protobuf.rpc.Service.prototype)).constructor = GuildService;

            /**
             * Creates new GuildService service using the specified rpc implementation.
             * @function create
             * @memberof kritor.guild.GuildService
             * @static
             * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
             * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
             * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
             * @returns {GuildService} RPC service. Useful where requests and/or responses are streamed.
             */
            GuildService.create = function create(rpcImpl, requestDelimited, responseDelimited) {
                return new this(rpcImpl, requestDelimited, responseDelimited);
            };

            /**
             * Callback as used by {@link kritor.guild.GuildService#getBotInfo}.
             * @memberof kritor.guild.GuildService
             * @typedef GetBotInfoCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.guild.GetBotInfoResponse} [response] GetBotInfoResponse
             */

            /**
             * Calls GetBotInfo.
             * @function getBotInfo
             * @memberof kritor.guild.GuildService
             * @instance
             * @param {kritor.guild.IGetBotInfoRequest} request GetBotInfoRequest message or plain object
             * @param {kritor.guild.GuildService.GetBotInfoCallback} callback Node-style callback called with the error, if any, and GetBotInfoResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(GuildService.prototype.getBotInfo = function getBotInfo(request, callback) {
                return this.rpcCall(getBotInfo, $root.kritor.guild.GetBotInfoRequest, $root.kritor.guild.GetBotInfoResponse, request, callback);
            }, "name", { value: "GetBotInfo" });

            /**
             * Calls GetBotInfo.
             * @function getBotInfo
             * @memberof kritor.guild.GuildService
             * @instance
             * @param {kritor.guild.IGetBotInfoRequest} request GetBotInfoRequest message or plain object
             * @returns {Promise<kritor.guild.GetBotInfoResponse>} Promise
             * @variation 2
             */

            /**
             * Callback as used by {@link kritor.guild.GuildService#getChannelList}.
             * @memberof kritor.guild.GuildService
             * @typedef GetChannelListCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.guild.GetChannelListResponse} [response] GetChannelListResponse
             */

            /**
             * Calls GetChannelList.
             * @function getChannelList
             * @memberof kritor.guild.GuildService
             * @instance
             * @param {kritor.guild.IGetChannelListRequest} request GetChannelListRequest message or plain object
             * @param {kritor.guild.GuildService.GetChannelListCallback} callback Node-style callback called with the error, if any, and GetChannelListResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(GuildService.prototype.getChannelList = function getChannelList(request, callback) {
                return this.rpcCall(getChannelList, $root.kritor.guild.GetChannelListRequest, $root.kritor.guild.GetChannelListResponse, request, callback);
            }, "name", { value: "GetChannelList" });

            /**
             * Calls GetChannelList.
             * @function getChannelList
             * @memberof kritor.guild.GuildService
             * @instance
             * @param {kritor.guild.IGetChannelListRequest} request GetChannelListRequest message or plain object
             * @returns {Promise<kritor.guild.GetChannelListResponse>} Promise
             * @variation 2
             */

            /**
             * Callback as used by {@link kritor.guild.GuildService#getGuildMetaByGuest}.
             * @memberof kritor.guild.GuildService
             * @typedef GetGuildMetaByGuestCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.guild.GetGuildMetaByGuestResponse} [response] GetGuildMetaByGuestResponse
             */

            /**
             * Calls GetGuildMetaByGuest.
             * @function getGuildMetaByGuest
             * @memberof kritor.guild.GuildService
             * @instance
             * @param {kritor.guild.IGetGuildMetaByGuestRequest} request GetGuildMetaByGuestRequest message or plain object
             * @param {kritor.guild.GuildService.GetGuildMetaByGuestCallback} callback Node-style callback called with the error, if any, and GetGuildMetaByGuestResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(GuildService.prototype.getGuildMetaByGuest = function getGuildMetaByGuest(request, callback) {
                return this.rpcCall(getGuildMetaByGuest, $root.kritor.guild.GetGuildMetaByGuestRequest, $root.kritor.guild.GetGuildMetaByGuestResponse, request, callback);
            }, "name", { value: "GetGuildMetaByGuest" });

            /**
             * Calls GetGuildMetaByGuest.
             * @function getGuildMetaByGuest
             * @memberof kritor.guild.GuildService
             * @instance
             * @param {kritor.guild.IGetGuildMetaByGuestRequest} request GetGuildMetaByGuestRequest message or plain object
             * @returns {Promise<kritor.guild.GetGuildMetaByGuestResponse>} Promise
             * @variation 2
             */

            /**
             * Callback as used by {@link kritor.guild.GuildService#getGuildChannelList}.
             * @memberof kritor.guild.GuildService
             * @typedef GetGuildChannelListCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.guild.GetGuildChannelListResponse} [response] GetGuildChannelListResponse
             */

            /**
             * Calls GetGuildChannelList.
             * @function getGuildChannelList
             * @memberof kritor.guild.GuildService
             * @instance
             * @param {kritor.guild.IGetGuildChannelListRequest} request GetGuildChannelListRequest message or plain object
             * @param {kritor.guild.GuildService.GetGuildChannelListCallback} callback Node-style callback called with the error, if any, and GetGuildChannelListResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(GuildService.prototype.getGuildChannelList = function getGuildChannelList(request, callback) {
                return this.rpcCall(getGuildChannelList, $root.kritor.guild.GetGuildChannelListRequest, $root.kritor.guild.GetGuildChannelListResponse, request, callback);
            }, "name", { value: "GetGuildChannelList" });

            /**
             * Calls GetGuildChannelList.
             * @function getGuildChannelList
             * @memberof kritor.guild.GuildService
             * @instance
             * @param {kritor.guild.IGetGuildChannelListRequest} request GetGuildChannelListRequest message or plain object
             * @returns {Promise<kritor.guild.GetGuildChannelListResponse>} Promise
             * @variation 2
             */

            /**
             * Callback as used by {@link kritor.guild.GuildService#getGuildMemberList}.
             * @memberof kritor.guild.GuildService
             * @typedef GetGuildMemberListCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.guild.GetGuildMemberListResponse} [response] GetGuildMemberListResponse
             */

            /**
             * Calls GetGuildMemberList.
             * @function getGuildMemberList
             * @memberof kritor.guild.GuildService
             * @instance
             * @param {kritor.guild.IGetGuildMemberListRequest} request GetGuildMemberListRequest message or plain object
             * @param {kritor.guild.GuildService.GetGuildMemberListCallback} callback Node-style callback called with the error, if any, and GetGuildMemberListResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(GuildService.prototype.getGuildMemberList = function getGuildMemberList(request, callback) {
                return this.rpcCall(getGuildMemberList, $root.kritor.guild.GetGuildMemberListRequest, $root.kritor.guild.GetGuildMemberListResponse, request, callback);
            }, "name", { value: "GetGuildMemberList" });

            /**
             * Calls GetGuildMemberList.
             * @function getGuildMemberList
             * @memberof kritor.guild.GuildService
             * @instance
             * @param {kritor.guild.IGetGuildMemberListRequest} request GetGuildMemberListRequest message or plain object
             * @returns {Promise<kritor.guild.GetGuildMemberListResponse>} Promise
             * @variation 2
             */

            /**
             * Callback as used by {@link kritor.guild.GuildService#getGuildMember}.
             * @memberof kritor.guild.GuildService
             * @typedef GetGuildMemberCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.guild.GetGuildMemberResponse} [response] GetGuildMemberResponse
             */

            /**
             * Calls GetGuildMember.
             * @function getGuildMember
             * @memberof kritor.guild.GuildService
             * @instance
             * @param {kritor.guild.IGetGuildMemberRequest} request GetGuildMemberRequest message or plain object
             * @param {kritor.guild.GuildService.GetGuildMemberCallback} callback Node-style callback called with the error, if any, and GetGuildMemberResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(GuildService.prototype.getGuildMember = function getGuildMember(request, callback) {
                return this.rpcCall(getGuildMember, $root.kritor.guild.GetGuildMemberRequest, $root.kritor.guild.GetGuildMemberResponse, request, callback);
            }, "name", { value: "GetGuildMember" });

            /**
             * Calls GetGuildMember.
             * @function getGuildMember
             * @memberof kritor.guild.GuildService
             * @instance
             * @param {kritor.guild.IGetGuildMemberRequest} request GetGuildMemberRequest message or plain object
             * @returns {Promise<kritor.guild.GetGuildMemberResponse>} Promise
             * @variation 2
             */

            /**
             * Callback as used by {@link kritor.guild.GuildService#sendChannelMessage}.
             * @memberof kritor.guild.GuildService
             * @typedef SendChannelMessageCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.guild.SendChannelMessageResponse} [response] SendChannelMessageResponse
             */

            /**
             * Calls SendChannelMessage.
             * @function sendChannelMessage
             * @memberof kritor.guild.GuildService
             * @instance
             * @param {kritor.guild.ISendChannelMessageRequest} request SendChannelMessageRequest message or plain object
             * @param {kritor.guild.GuildService.SendChannelMessageCallback} callback Node-style callback called with the error, if any, and SendChannelMessageResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(GuildService.prototype.sendChannelMessage = function sendChannelMessage(request, callback) {
                return this.rpcCall(sendChannelMessage, $root.kritor.guild.SendChannelMessageRequest, $root.kritor.guild.SendChannelMessageResponse, request, callback);
            }, "name", { value: "SendChannelMessage" });

            /**
             * Calls SendChannelMessage.
             * @function sendChannelMessage
             * @memberof kritor.guild.GuildService
             * @instance
             * @param {kritor.guild.ISendChannelMessageRequest} request SendChannelMessageRequest message or plain object
             * @returns {Promise<kritor.guild.SendChannelMessageResponse>} Promise
             * @variation 2
             */

            /**
             * Callback as used by {@link kritor.guild.GuildService#getGuildFeedList}.
             * @memberof kritor.guild.GuildService
             * @typedef GetGuildFeedListCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.guild.GetGuildFeedListResponse} [response] GetGuildFeedListResponse
             */

            /**
             * Calls GetGuildFeedList.
             * @function getGuildFeedList
             * @memberof kritor.guild.GuildService
             * @instance
             * @param {kritor.guild.IGetGuildFeedListRequest} request GetGuildFeedListRequest message or plain object
             * @param {kritor.guild.GuildService.GetGuildFeedListCallback} callback Node-style callback called with the error, if any, and GetGuildFeedListResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(GuildService.prototype.getGuildFeedList = function getGuildFeedList(request, callback) {
                return this.rpcCall(getGuildFeedList, $root.kritor.guild.GetGuildFeedListRequest, $root.kritor.guild.GetGuildFeedListResponse, request, callback);
            }, "name", { value: "GetGuildFeedList" });

            /**
             * Calls GetGuildFeedList.
             * @function getGuildFeedList
             * @memberof kritor.guild.GuildService
             * @instance
             * @param {kritor.guild.IGetGuildFeedListRequest} request GetGuildFeedListRequest message or plain object
             * @returns {Promise<kritor.guild.GetGuildFeedListResponse>} Promise
             * @variation 2
             */

            /**
             * Callback as used by {@link kritor.guild.GuildService#getGuildRoleList}.
             * @memberof kritor.guild.GuildService
             * @typedef GetGuildRoleListCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.guild.GetGuildRoleListResponse} [response] GetGuildRoleListResponse
             */

            /**
             * Calls GetGuildRoleList.
             * @function getGuildRoleList
             * @memberof kritor.guild.GuildService
             * @instance
             * @param {kritor.guild.IGetGuildRoleListRequest} request GetGuildRoleListRequest message or plain object
             * @param {kritor.guild.GuildService.GetGuildRoleListCallback} callback Node-style callback called with the error, if any, and GetGuildRoleListResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(GuildService.prototype.getGuildRoleList = function getGuildRoleList(request, callback) {
                return this.rpcCall(getGuildRoleList, $root.kritor.guild.GetGuildRoleListRequest, $root.kritor.guild.GetGuildRoleListResponse, request, callback);
            }, "name", { value: "GetGuildRoleList" });

            /**
             * Calls GetGuildRoleList.
             * @function getGuildRoleList
             * @memberof kritor.guild.GuildService
             * @instance
             * @param {kritor.guild.IGetGuildRoleListRequest} request GetGuildRoleListRequest message or plain object
             * @returns {Promise<kritor.guild.GetGuildRoleListResponse>} Promise
             * @variation 2
             */

            /**
             * Callback as used by {@link kritor.guild.GuildService#deleteGuildRole}.
             * @memberof kritor.guild.GuildService
             * @typedef DeleteGuildRoleCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.guild.DeleteGuildRoleResponse} [response] DeleteGuildRoleResponse
             */

            /**
             * Calls DeleteGuildRole.
             * @function deleteGuildRole
             * @memberof kritor.guild.GuildService
             * @instance
             * @param {kritor.guild.IDeleteGuildRoleRequest} request DeleteGuildRoleRequest message or plain object
             * @param {kritor.guild.GuildService.DeleteGuildRoleCallback} callback Node-style callback called with the error, if any, and DeleteGuildRoleResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(GuildService.prototype.deleteGuildRole = function deleteGuildRole(request, callback) {
                return this.rpcCall(deleteGuildRole, $root.kritor.guild.DeleteGuildRoleRequest, $root.kritor.guild.DeleteGuildRoleResponse, request, callback);
            }, "name", { value: "DeleteGuildRole" });

            /**
             * Calls DeleteGuildRole.
             * @function deleteGuildRole
             * @memberof kritor.guild.GuildService
             * @instance
             * @param {kritor.guild.IDeleteGuildRoleRequest} request DeleteGuildRoleRequest message or plain object
             * @returns {Promise<kritor.guild.DeleteGuildRoleResponse>} Promise
             * @variation 2
             */

            /**
             * Callback as used by {@link kritor.guild.GuildService#setGuildMemberRole}.
             * @memberof kritor.guild.GuildService
             * @typedef SetGuildMemberRoleCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.guild.SetGuildMemberRoleResponse} [response] SetGuildMemberRoleResponse
             */

            /**
             * Calls SetGuildMemberRole.
             * @function setGuildMemberRole
             * @memberof kritor.guild.GuildService
             * @instance
             * @param {kritor.guild.ISetGuildMemberRoleRequest} request SetGuildMemberRoleRequest message or plain object
             * @param {kritor.guild.GuildService.SetGuildMemberRoleCallback} callback Node-style callback called with the error, if any, and SetGuildMemberRoleResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(GuildService.prototype.setGuildMemberRole = function setGuildMemberRole(request, callback) {
                return this.rpcCall(setGuildMemberRole, $root.kritor.guild.SetGuildMemberRoleRequest, $root.kritor.guild.SetGuildMemberRoleResponse, request, callback);
            }, "name", { value: "SetGuildMemberRole" });

            /**
             * Calls SetGuildMemberRole.
             * @function setGuildMemberRole
             * @memberof kritor.guild.GuildService
             * @instance
             * @param {kritor.guild.ISetGuildMemberRoleRequest} request SetGuildMemberRoleRequest message or plain object
             * @returns {Promise<kritor.guild.SetGuildMemberRoleResponse>} Promise
             * @variation 2
             */

            /**
             * Callback as used by {@link kritor.guild.GuildService#updateGuildRole}.
             * @memberof kritor.guild.GuildService
             * @typedef UpdateGuildRoleCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.guild.UpdateGuildRoleResponse} [response] UpdateGuildRoleResponse
             */

            /**
             * Calls UpdateGuildRole.
             * @function updateGuildRole
             * @memberof kritor.guild.GuildService
             * @instance
             * @param {kritor.guild.IUpdateGuildRoleRequest} request UpdateGuildRoleRequest message or plain object
             * @param {kritor.guild.GuildService.UpdateGuildRoleCallback} callback Node-style callback called with the error, if any, and UpdateGuildRoleResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(GuildService.prototype.updateGuildRole = function updateGuildRole(request, callback) {
                return this.rpcCall(updateGuildRole, $root.kritor.guild.UpdateGuildRoleRequest, $root.kritor.guild.UpdateGuildRoleResponse, request, callback);
            }, "name", { value: "UpdateGuildRole" });

            /**
             * Calls UpdateGuildRole.
             * @function updateGuildRole
             * @memberof kritor.guild.GuildService
             * @instance
             * @param {kritor.guild.IUpdateGuildRoleRequest} request UpdateGuildRoleRequest message or plain object
             * @returns {Promise<kritor.guild.UpdateGuildRoleResponse>} Promise
             * @variation 2
             */

            /**
             * Callback as used by {@link kritor.guild.GuildService#createGuildRole}.
             * @memberof kritor.guild.GuildService
             * @typedef CreateGuildRoleCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.guild.CreateGuildRoleResponse} [response] CreateGuildRoleResponse
             */

            /**
             * Calls CreateGuildRole.
             * @function createGuildRole
             * @memberof kritor.guild.GuildService
             * @instance
             * @param {kritor.guild.ICreateGuildRoleRequest} request CreateGuildRoleRequest message or plain object
             * @param {kritor.guild.GuildService.CreateGuildRoleCallback} callback Node-style callback called with the error, if any, and CreateGuildRoleResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(GuildService.prototype.createGuildRole = function createGuildRole(request, callback) {
                return this.rpcCall(createGuildRole, $root.kritor.guild.CreateGuildRoleRequest, $root.kritor.guild.CreateGuildRoleResponse, request, callback);
            }, "name", { value: "CreateGuildRole" });

            /**
             * Calls CreateGuildRole.
             * @function createGuildRole
             * @memberof kritor.guild.GuildService
             * @instance
             * @param {kritor.guild.ICreateGuildRoleRequest} request CreateGuildRoleRequest message or plain object
             * @returns {Promise<kritor.guild.CreateGuildRoleResponse>} Promise
             * @variation 2
             */

            return GuildService;
        })();

        guild.GetBotInfoRequest = (function() {

            /**
             * Properties of a GetBotInfoRequest.
             * @memberof kritor.guild
             * @interface IGetBotInfoRequest
             */

            /**
             * Constructs a new GetBotInfoRequest.
             * @memberof kritor.guild
             * @classdesc Represents a GetBotInfoRequest.
             * @implements IGetBotInfoRequest
             * @constructor
             * @param {kritor.guild.IGetBotInfoRequest=} [properties] Properties to set
             */
            function GetBotInfoRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Creates a new GetBotInfoRequest instance using the specified properties.
             * @function create
             * @memberof kritor.guild.GetBotInfoRequest
             * @static
             * @param {kritor.guild.IGetBotInfoRequest=} [properties] Properties to set
             * @returns {kritor.guild.GetBotInfoRequest} GetBotInfoRequest instance
             */
            GetBotInfoRequest.create = function create(properties) {
                return new GetBotInfoRequest(properties);
            };

            /**
             * Encodes the specified GetBotInfoRequest message. Does not implicitly {@link kritor.guild.GetBotInfoRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.guild.GetBotInfoRequest
             * @static
             * @param {kritor.guild.IGetBotInfoRequest} message GetBotInfoRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetBotInfoRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                return writer;
            };

            /**
             * Encodes the specified GetBotInfoRequest message, length delimited. Does not implicitly {@link kritor.guild.GetBotInfoRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.guild.GetBotInfoRequest
             * @static
             * @param {kritor.guild.IGetBotInfoRequest} message GetBotInfoRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetBotInfoRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetBotInfoRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.guild.GetBotInfoRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.guild.GetBotInfoRequest} GetBotInfoRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetBotInfoRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.guild.GetBotInfoRequest();
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
             * Decodes a GetBotInfoRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.guild.GetBotInfoRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.guild.GetBotInfoRequest} GetBotInfoRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetBotInfoRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetBotInfoRequest message.
             * @function verify
             * @memberof kritor.guild.GetBotInfoRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetBotInfoRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                return null;
            };

            /**
             * Creates a GetBotInfoRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.guild.GetBotInfoRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.guild.GetBotInfoRequest} GetBotInfoRequest
             */
            GetBotInfoRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.guild.GetBotInfoRequest)
                    return object;
                return new $root.kritor.guild.GetBotInfoRequest();
            };

            /**
             * Creates a plain object from a GetBotInfoRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.guild.GetBotInfoRequest
             * @static
             * @param {kritor.guild.GetBotInfoRequest} message GetBotInfoRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetBotInfoRequest.toObject = function toObject() {
                return {};
            };

            /**
             * Converts this GetBotInfoRequest to JSON.
             * @function toJSON
             * @memberof kritor.guild.GetBotInfoRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetBotInfoRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GetBotInfoRequest
             * @function getTypeUrl
             * @memberof kritor.guild.GetBotInfoRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetBotInfoRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.guild.GetBotInfoRequest";
            };

            return GetBotInfoRequest;
        })();

        guild.GetBotInfoResponse = (function() {

            /**
             * Properties of a GetBotInfoResponse.
             * @memberof kritor.guild
             * @interface IGetBotInfoResponse
             * @property {string|null} [nickname] GetBotInfoResponse nickname
             * @property {number|Long|null} [tinyId] GetBotInfoResponse tinyId
             * @property {string|null} [avatar] GetBotInfoResponse avatar
             */

            /**
             * Constructs a new GetBotInfoResponse.
             * @memberof kritor.guild
             * @classdesc Represents a GetBotInfoResponse.
             * @implements IGetBotInfoResponse
             * @constructor
             * @param {kritor.guild.IGetBotInfoResponse=} [properties] Properties to set
             */
            function GetBotInfoResponse(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetBotInfoResponse nickname.
             * @member {string} nickname
             * @memberof kritor.guild.GetBotInfoResponse
             * @instance
             */
            GetBotInfoResponse.prototype.nickname = "";

            /**
             * GetBotInfoResponse tinyId.
             * @member {number|Long} tinyId
             * @memberof kritor.guild.GetBotInfoResponse
             * @instance
             */
            GetBotInfoResponse.prototype.tinyId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * GetBotInfoResponse avatar.
             * @member {string} avatar
             * @memberof kritor.guild.GetBotInfoResponse
             * @instance
             */
            GetBotInfoResponse.prototype.avatar = "";

            /**
             * Creates a new GetBotInfoResponse instance using the specified properties.
             * @function create
             * @memberof kritor.guild.GetBotInfoResponse
             * @static
             * @param {kritor.guild.IGetBotInfoResponse=} [properties] Properties to set
             * @returns {kritor.guild.GetBotInfoResponse} GetBotInfoResponse instance
             */
            GetBotInfoResponse.create = function create(properties) {
                return new GetBotInfoResponse(properties);
            };

            /**
             * Encodes the specified GetBotInfoResponse message. Does not implicitly {@link kritor.guild.GetBotInfoResponse.verify|verify} messages.
             * @function encode
             * @memberof kritor.guild.GetBotInfoResponse
             * @static
             * @param {kritor.guild.IGetBotInfoResponse} message GetBotInfoResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetBotInfoResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.nickname != null && Object.hasOwnProperty.call(message, "nickname"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.nickname);
                if (message.tinyId != null && Object.hasOwnProperty.call(message, "tinyId"))
                    writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.tinyId);
                if (message.avatar != null && Object.hasOwnProperty.call(message, "avatar"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.avatar);
                return writer;
            };

            /**
             * Encodes the specified GetBotInfoResponse message, length delimited. Does not implicitly {@link kritor.guild.GetBotInfoResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.guild.GetBotInfoResponse
             * @static
             * @param {kritor.guild.IGetBotInfoResponse} message GetBotInfoResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetBotInfoResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetBotInfoResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.guild.GetBotInfoResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.guild.GetBotInfoResponse} GetBotInfoResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetBotInfoResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.guild.GetBotInfoResponse();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.nickname = reader.string();
                            break;
                        }
                    case 2: {
                            message.tinyId = reader.uint64();
                            break;
                        }
                    case 3: {
                            message.avatar = reader.string();
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
             * Decodes a GetBotInfoResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.guild.GetBotInfoResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.guild.GetBotInfoResponse} GetBotInfoResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetBotInfoResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetBotInfoResponse message.
             * @function verify
             * @memberof kritor.guild.GetBotInfoResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetBotInfoResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.nickname != null && message.hasOwnProperty("nickname"))
                    if (!$util.isString(message.nickname))
                        return "nickname: string expected";
                if (message.tinyId != null && message.hasOwnProperty("tinyId"))
                    if (!$util.isInteger(message.tinyId) && !(message.tinyId && $util.isInteger(message.tinyId.low) && $util.isInteger(message.tinyId.high)))
                        return "tinyId: integer|Long expected";
                if (message.avatar != null && message.hasOwnProperty("avatar"))
                    if (!$util.isString(message.avatar))
                        return "avatar: string expected";
                return null;
            };

            /**
             * Creates a GetBotInfoResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.guild.GetBotInfoResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.guild.GetBotInfoResponse} GetBotInfoResponse
             */
            GetBotInfoResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.guild.GetBotInfoResponse)
                    return object;
                let message = new $root.kritor.guild.GetBotInfoResponse();
                if (object.nickname != null)
                    message.nickname = String(object.nickname);
                if (object.tinyId != null)
                    if ($util.Long)
                        (message.tinyId = $util.Long.fromValue(object.tinyId)).unsigned = true;
                    else if (typeof object.tinyId === "string")
                        message.tinyId = parseInt(object.tinyId, 10);
                    else if (typeof object.tinyId === "number")
                        message.tinyId = object.tinyId;
                    else if (typeof object.tinyId === "object")
                        message.tinyId = new $util.LongBits(object.tinyId.low >>> 0, object.tinyId.high >>> 0).toNumber(true);
                if (object.avatar != null)
                    message.avatar = String(object.avatar);
                return message;
            };

            /**
             * Creates a plain object from a GetBotInfoResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.guild.GetBotInfoResponse
             * @static
             * @param {kritor.guild.GetBotInfoResponse} message GetBotInfoResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetBotInfoResponse.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.nickname = "";
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.tinyId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.tinyId = options.longs === String ? "0" : 0;
                    object.avatar = "";
                }
                if (message.nickname != null && message.hasOwnProperty("nickname"))
                    object.nickname = message.nickname;
                if (message.tinyId != null && message.hasOwnProperty("tinyId"))
                    if (typeof message.tinyId === "number")
                        object.tinyId = options.longs === String ? String(message.tinyId) : message.tinyId;
                    else
                        object.tinyId = options.longs === String ? $util.Long.prototype.toString.call(message.tinyId) : options.longs === Number ? new $util.LongBits(message.tinyId.low >>> 0, message.tinyId.high >>> 0).toNumber(true) : message.tinyId;
                if (message.avatar != null && message.hasOwnProperty("avatar"))
                    object.avatar = message.avatar;
                return object;
            };

            /**
             * Converts this GetBotInfoResponse to JSON.
             * @function toJSON
             * @memberof kritor.guild.GetBotInfoResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetBotInfoResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GetBotInfoResponse
             * @function getTypeUrl
             * @memberof kritor.guild.GetBotInfoResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetBotInfoResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.guild.GetBotInfoResponse";
            };

            return GetBotInfoResponse;
        })();

        guild.GetChannelListRequest = (function() {

            /**
             * Properties of a GetChannelListRequest.
             * @memberof kritor.guild
             * @interface IGetChannelListRequest
             */

            /**
             * Constructs a new GetChannelListRequest.
             * @memberof kritor.guild
             * @classdesc Represents a GetChannelListRequest.
             * @implements IGetChannelListRequest
             * @constructor
             * @param {kritor.guild.IGetChannelListRequest=} [properties] Properties to set
             */
            function GetChannelListRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Creates a new GetChannelListRequest instance using the specified properties.
             * @function create
             * @memberof kritor.guild.GetChannelListRequest
             * @static
             * @param {kritor.guild.IGetChannelListRequest=} [properties] Properties to set
             * @returns {kritor.guild.GetChannelListRequest} GetChannelListRequest instance
             */
            GetChannelListRequest.create = function create(properties) {
                return new GetChannelListRequest(properties);
            };

            /**
             * Encodes the specified GetChannelListRequest message. Does not implicitly {@link kritor.guild.GetChannelListRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.guild.GetChannelListRequest
             * @static
             * @param {kritor.guild.IGetChannelListRequest} message GetChannelListRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetChannelListRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                return writer;
            };

            /**
             * Encodes the specified GetChannelListRequest message, length delimited. Does not implicitly {@link kritor.guild.GetChannelListRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.guild.GetChannelListRequest
             * @static
             * @param {kritor.guild.IGetChannelListRequest} message GetChannelListRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetChannelListRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetChannelListRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.guild.GetChannelListRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.guild.GetChannelListRequest} GetChannelListRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetChannelListRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.guild.GetChannelListRequest();
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
             * Decodes a GetChannelListRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.guild.GetChannelListRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.guild.GetChannelListRequest} GetChannelListRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetChannelListRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetChannelListRequest message.
             * @function verify
             * @memberof kritor.guild.GetChannelListRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetChannelListRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                return null;
            };

            /**
             * Creates a GetChannelListRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.guild.GetChannelListRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.guild.GetChannelListRequest} GetChannelListRequest
             */
            GetChannelListRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.guild.GetChannelListRequest)
                    return object;
                return new $root.kritor.guild.GetChannelListRequest();
            };

            /**
             * Creates a plain object from a GetChannelListRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.guild.GetChannelListRequest
             * @static
             * @param {kritor.guild.GetChannelListRequest} message GetChannelListRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetChannelListRequest.toObject = function toObject() {
                return {};
            };

            /**
             * Converts this GetChannelListRequest to JSON.
             * @function toJSON
             * @memberof kritor.guild.GetChannelListRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetChannelListRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GetChannelListRequest
             * @function getTypeUrl
             * @memberof kritor.guild.GetChannelListRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetChannelListRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.guild.GetChannelListRequest";
            };

            return GetChannelListRequest;
        })();

        guild.GetChannelListResponse = (function() {

            /**
             * Properties of a GetChannelListResponse.
             * @memberof kritor.guild
             * @interface IGetChannelListResponse
             * @property {Array.<kritor.guild.IGuildInfo>|null} [getGuildList] GetChannelListResponse getGuildList
             */

            /**
             * Constructs a new GetChannelListResponse.
             * @memberof kritor.guild
             * @classdesc Represents a GetChannelListResponse.
             * @implements IGetChannelListResponse
             * @constructor
             * @param {kritor.guild.IGetChannelListResponse=} [properties] Properties to set
             */
            function GetChannelListResponse(properties) {
                this.getGuildList = [];
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetChannelListResponse getGuildList.
             * @member {Array.<kritor.guild.IGuildInfo>} getGuildList
             * @memberof kritor.guild.GetChannelListResponse
             * @instance
             */
            GetChannelListResponse.prototype.getGuildList = $util.emptyArray;

            /**
             * Creates a new GetChannelListResponse instance using the specified properties.
             * @function create
             * @memberof kritor.guild.GetChannelListResponse
             * @static
             * @param {kritor.guild.IGetChannelListResponse=} [properties] Properties to set
             * @returns {kritor.guild.GetChannelListResponse} GetChannelListResponse instance
             */
            GetChannelListResponse.create = function create(properties) {
                return new GetChannelListResponse(properties);
            };

            /**
             * Encodes the specified GetChannelListResponse message. Does not implicitly {@link kritor.guild.GetChannelListResponse.verify|verify} messages.
             * @function encode
             * @memberof kritor.guild.GetChannelListResponse
             * @static
             * @param {kritor.guild.IGetChannelListResponse} message GetChannelListResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetChannelListResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.getGuildList != null && message.getGuildList.length)
                    for (let i = 0; i < message.getGuildList.length; ++i)
                        $root.kritor.guild.GuildInfo.encode(message.getGuildList[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified GetChannelListResponse message, length delimited. Does not implicitly {@link kritor.guild.GetChannelListResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.guild.GetChannelListResponse
             * @static
             * @param {kritor.guild.IGetChannelListResponse} message GetChannelListResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetChannelListResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetChannelListResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.guild.GetChannelListResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.guild.GetChannelListResponse} GetChannelListResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetChannelListResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.guild.GetChannelListResponse();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            if (!(message.getGuildList && message.getGuildList.length))
                                message.getGuildList = [];
                            message.getGuildList.push($root.kritor.guild.GuildInfo.decode(reader, reader.uint32()));
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
             * Decodes a GetChannelListResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.guild.GetChannelListResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.guild.GetChannelListResponse} GetChannelListResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetChannelListResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetChannelListResponse message.
             * @function verify
             * @memberof kritor.guild.GetChannelListResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetChannelListResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.getGuildList != null && message.hasOwnProperty("getGuildList")) {
                    if (!Array.isArray(message.getGuildList))
                        return "getGuildList: array expected";
                    for (let i = 0; i < message.getGuildList.length; ++i) {
                        let error = $root.kritor.guild.GuildInfo.verify(message.getGuildList[i]);
                        if (error)
                            return "getGuildList." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a GetChannelListResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.guild.GetChannelListResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.guild.GetChannelListResponse} GetChannelListResponse
             */
            GetChannelListResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.guild.GetChannelListResponse)
                    return object;
                let message = new $root.kritor.guild.GetChannelListResponse();
                if (object.getGuildList) {
                    if (!Array.isArray(object.getGuildList))
                        throw TypeError(".kritor.guild.GetChannelListResponse.getGuildList: array expected");
                    message.getGuildList = [];
                    for (let i = 0; i < object.getGuildList.length; ++i) {
                        if (typeof object.getGuildList[i] !== "object")
                            throw TypeError(".kritor.guild.GetChannelListResponse.getGuildList: object expected");
                        message.getGuildList[i] = $root.kritor.guild.GuildInfo.fromObject(object.getGuildList[i]);
                    }
                }
                return message;
            };

            /**
             * Creates a plain object from a GetChannelListResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.guild.GetChannelListResponse
             * @static
             * @param {kritor.guild.GetChannelListResponse} message GetChannelListResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetChannelListResponse.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.arrays || options.defaults)
                    object.getGuildList = [];
                if (message.getGuildList && message.getGuildList.length) {
                    object.getGuildList = [];
                    for (let j = 0; j < message.getGuildList.length; ++j)
                        object.getGuildList[j] = $root.kritor.guild.GuildInfo.toObject(message.getGuildList[j], options);
                }
                return object;
            };

            /**
             * Converts this GetChannelListResponse to JSON.
             * @function toJSON
             * @memberof kritor.guild.GetChannelListResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetChannelListResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GetChannelListResponse
             * @function getTypeUrl
             * @memberof kritor.guild.GetChannelListResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetChannelListResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.guild.GetChannelListResponse";
            };

            return GetChannelListResponse;
        })();

        guild.GetGuildMetaByGuestRequest = (function() {

            /**
             * Properties of a GetGuildMetaByGuestRequest.
             * @memberof kritor.guild
             * @interface IGetGuildMetaByGuestRequest
             * @property {number|Long|null} [guildId] GetGuildMetaByGuestRequest guildId
             */

            /**
             * Constructs a new GetGuildMetaByGuestRequest.
             * @memberof kritor.guild
             * @classdesc Represents a GetGuildMetaByGuestRequest.
             * @implements IGetGuildMetaByGuestRequest
             * @constructor
             * @param {kritor.guild.IGetGuildMetaByGuestRequest=} [properties] Properties to set
             */
            function GetGuildMetaByGuestRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetGuildMetaByGuestRequest guildId.
             * @member {number|Long} guildId
             * @memberof kritor.guild.GetGuildMetaByGuestRequest
             * @instance
             */
            GetGuildMetaByGuestRequest.prototype.guildId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * Creates a new GetGuildMetaByGuestRequest instance using the specified properties.
             * @function create
             * @memberof kritor.guild.GetGuildMetaByGuestRequest
             * @static
             * @param {kritor.guild.IGetGuildMetaByGuestRequest=} [properties] Properties to set
             * @returns {kritor.guild.GetGuildMetaByGuestRequest} GetGuildMetaByGuestRequest instance
             */
            GetGuildMetaByGuestRequest.create = function create(properties) {
                return new GetGuildMetaByGuestRequest(properties);
            };

            /**
             * Encodes the specified GetGuildMetaByGuestRequest message. Does not implicitly {@link kritor.guild.GetGuildMetaByGuestRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.guild.GetGuildMetaByGuestRequest
             * @static
             * @param {kritor.guild.IGetGuildMetaByGuestRequest} message GetGuildMetaByGuestRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetGuildMetaByGuestRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.guildId != null && Object.hasOwnProperty.call(message, "guildId"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.guildId);
                return writer;
            };

            /**
             * Encodes the specified GetGuildMetaByGuestRequest message, length delimited. Does not implicitly {@link kritor.guild.GetGuildMetaByGuestRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.guild.GetGuildMetaByGuestRequest
             * @static
             * @param {kritor.guild.IGetGuildMetaByGuestRequest} message GetGuildMetaByGuestRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetGuildMetaByGuestRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetGuildMetaByGuestRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.guild.GetGuildMetaByGuestRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.guild.GetGuildMetaByGuestRequest} GetGuildMetaByGuestRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetGuildMetaByGuestRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.guild.GetGuildMetaByGuestRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.guildId = reader.uint64();
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
             * Decodes a GetGuildMetaByGuestRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.guild.GetGuildMetaByGuestRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.guild.GetGuildMetaByGuestRequest} GetGuildMetaByGuestRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetGuildMetaByGuestRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetGuildMetaByGuestRequest message.
             * @function verify
             * @memberof kritor.guild.GetGuildMetaByGuestRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetGuildMetaByGuestRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.guildId != null && message.hasOwnProperty("guildId"))
                    if (!$util.isInteger(message.guildId) && !(message.guildId && $util.isInteger(message.guildId.low) && $util.isInteger(message.guildId.high)))
                        return "guildId: integer|Long expected";
                return null;
            };

            /**
             * Creates a GetGuildMetaByGuestRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.guild.GetGuildMetaByGuestRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.guild.GetGuildMetaByGuestRequest} GetGuildMetaByGuestRequest
             */
            GetGuildMetaByGuestRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.guild.GetGuildMetaByGuestRequest)
                    return object;
                let message = new $root.kritor.guild.GetGuildMetaByGuestRequest();
                if (object.guildId != null)
                    if ($util.Long)
                        (message.guildId = $util.Long.fromValue(object.guildId)).unsigned = true;
                    else if (typeof object.guildId === "string")
                        message.guildId = parseInt(object.guildId, 10);
                    else if (typeof object.guildId === "number")
                        message.guildId = object.guildId;
                    else if (typeof object.guildId === "object")
                        message.guildId = new $util.LongBits(object.guildId.low >>> 0, object.guildId.high >>> 0).toNumber(true);
                return message;
            };

            /**
             * Creates a plain object from a GetGuildMetaByGuestRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.guild.GetGuildMetaByGuestRequest
             * @static
             * @param {kritor.guild.GetGuildMetaByGuestRequest} message GetGuildMetaByGuestRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetGuildMetaByGuestRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults)
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.guildId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.guildId = options.longs === String ? "0" : 0;
                if (message.guildId != null && message.hasOwnProperty("guildId"))
                    if (typeof message.guildId === "number")
                        object.guildId = options.longs === String ? String(message.guildId) : message.guildId;
                    else
                        object.guildId = options.longs === String ? $util.Long.prototype.toString.call(message.guildId) : options.longs === Number ? new $util.LongBits(message.guildId.low >>> 0, message.guildId.high >>> 0).toNumber(true) : message.guildId;
                return object;
            };

            /**
             * Converts this GetGuildMetaByGuestRequest to JSON.
             * @function toJSON
             * @memberof kritor.guild.GetGuildMetaByGuestRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetGuildMetaByGuestRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GetGuildMetaByGuestRequest
             * @function getTypeUrl
             * @memberof kritor.guild.GetGuildMetaByGuestRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetGuildMetaByGuestRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.guild.GetGuildMetaByGuestRequest";
            };

            return GetGuildMetaByGuestRequest;
        })();

        guild.GetGuildMetaByGuestResponse = (function() {

            /**
             * Properties of a GetGuildMetaByGuestResponse.
             * @memberof kritor.guild
             * @interface IGetGuildMetaByGuestResponse
             * @property {number|Long|null} [guildId] GetGuildMetaByGuestResponse guildId
             * @property {string|null} [guildName] GetGuildMetaByGuestResponse guildName
             * @property {string|null} [guildProfile] GetGuildMetaByGuestResponse guildProfile
             * @property {number|Long|null} [createTime] GetGuildMetaByGuestResponse createTime
             * @property {number|Long|null} [maxMemberCount] GetGuildMetaByGuestResponse maxMemberCount
             * @property {number|Long|null} [maxRobotCount] GetGuildMetaByGuestResponse maxRobotCount
             * @property {number|Long|null} [maxAdminCount] GetGuildMetaByGuestResponse maxAdminCount
             * @property {number|Long|null} [memberCount] GetGuildMetaByGuestResponse memberCount
             * @property {number|Long|null} [ownerId] GetGuildMetaByGuestResponse ownerId
             * @property {string|null} [guildDisplayId] GetGuildMetaByGuestResponse guildDisplayId
             */

            /**
             * Constructs a new GetGuildMetaByGuestResponse.
             * @memberof kritor.guild
             * @classdesc Represents a GetGuildMetaByGuestResponse.
             * @implements IGetGuildMetaByGuestResponse
             * @constructor
             * @param {kritor.guild.IGetGuildMetaByGuestResponse=} [properties] Properties to set
             */
            function GetGuildMetaByGuestResponse(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetGuildMetaByGuestResponse guildId.
             * @member {number|Long} guildId
             * @memberof kritor.guild.GetGuildMetaByGuestResponse
             * @instance
             */
            GetGuildMetaByGuestResponse.prototype.guildId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * GetGuildMetaByGuestResponse guildName.
             * @member {string} guildName
             * @memberof kritor.guild.GetGuildMetaByGuestResponse
             * @instance
             */
            GetGuildMetaByGuestResponse.prototype.guildName = "";

            /**
             * GetGuildMetaByGuestResponse guildProfile.
             * @member {string} guildProfile
             * @memberof kritor.guild.GetGuildMetaByGuestResponse
             * @instance
             */
            GetGuildMetaByGuestResponse.prototype.guildProfile = "";

            /**
             * GetGuildMetaByGuestResponse createTime.
             * @member {number|Long} createTime
             * @memberof kritor.guild.GetGuildMetaByGuestResponse
             * @instance
             */
            GetGuildMetaByGuestResponse.prototype.createTime = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * GetGuildMetaByGuestResponse maxMemberCount.
             * @member {number|Long} maxMemberCount
             * @memberof kritor.guild.GetGuildMetaByGuestResponse
             * @instance
             */
            GetGuildMetaByGuestResponse.prototype.maxMemberCount = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * GetGuildMetaByGuestResponse maxRobotCount.
             * @member {number|Long} maxRobotCount
             * @memberof kritor.guild.GetGuildMetaByGuestResponse
             * @instance
             */
            GetGuildMetaByGuestResponse.prototype.maxRobotCount = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * GetGuildMetaByGuestResponse maxAdminCount.
             * @member {number|Long} maxAdminCount
             * @memberof kritor.guild.GetGuildMetaByGuestResponse
             * @instance
             */
            GetGuildMetaByGuestResponse.prototype.maxAdminCount = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * GetGuildMetaByGuestResponse memberCount.
             * @member {number|Long} memberCount
             * @memberof kritor.guild.GetGuildMetaByGuestResponse
             * @instance
             */
            GetGuildMetaByGuestResponse.prototype.memberCount = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * GetGuildMetaByGuestResponse ownerId.
             * @member {number|Long} ownerId
             * @memberof kritor.guild.GetGuildMetaByGuestResponse
             * @instance
             */
            GetGuildMetaByGuestResponse.prototype.ownerId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * GetGuildMetaByGuestResponse guildDisplayId.
             * @member {string} guildDisplayId
             * @memberof kritor.guild.GetGuildMetaByGuestResponse
             * @instance
             */
            GetGuildMetaByGuestResponse.prototype.guildDisplayId = "";

            /**
             * Creates a new GetGuildMetaByGuestResponse instance using the specified properties.
             * @function create
             * @memberof kritor.guild.GetGuildMetaByGuestResponse
             * @static
             * @param {kritor.guild.IGetGuildMetaByGuestResponse=} [properties] Properties to set
             * @returns {kritor.guild.GetGuildMetaByGuestResponse} GetGuildMetaByGuestResponse instance
             */
            GetGuildMetaByGuestResponse.create = function create(properties) {
                return new GetGuildMetaByGuestResponse(properties);
            };

            /**
             * Encodes the specified GetGuildMetaByGuestResponse message. Does not implicitly {@link kritor.guild.GetGuildMetaByGuestResponse.verify|verify} messages.
             * @function encode
             * @memberof kritor.guild.GetGuildMetaByGuestResponse
             * @static
             * @param {kritor.guild.IGetGuildMetaByGuestResponse} message GetGuildMetaByGuestResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetGuildMetaByGuestResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.guildId != null && Object.hasOwnProperty.call(message, "guildId"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.guildId);
                if (message.guildName != null && Object.hasOwnProperty.call(message, "guildName"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.guildName);
                if (message.guildProfile != null && Object.hasOwnProperty.call(message, "guildProfile"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.guildProfile);
                if (message.createTime != null && Object.hasOwnProperty.call(message, "createTime"))
                    writer.uint32(/* id 4, wireType 0 =*/32).uint64(message.createTime);
                if (message.maxMemberCount != null && Object.hasOwnProperty.call(message, "maxMemberCount"))
                    writer.uint32(/* id 5, wireType 0 =*/40).uint64(message.maxMemberCount);
                if (message.maxRobotCount != null && Object.hasOwnProperty.call(message, "maxRobotCount"))
                    writer.uint32(/* id 6, wireType 0 =*/48).uint64(message.maxRobotCount);
                if (message.maxAdminCount != null && Object.hasOwnProperty.call(message, "maxAdminCount"))
                    writer.uint32(/* id 7, wireType 0 =*/56).uint64(message.maxAdminCount);
                if (message.memberCount != null && Object.hasOwnProperty.call(message, "memberCount"))
                    writer.uint32(/* id 8, wireType 0 =*/64).uint64(message.memberCount);
                if (message.ownerId != null && Object.hasOwnProperty.call(message, "ownerId"))
                    writer.uint32(/* id 9, wireType 0 =*/72).uint64(message.ownerId);
                if (message.guildDisplayId != null && Object.hasOwnProperty.call(message, "guildDisplayId"))
                    writer.uint32(/* id 10, wireType 2 =*/82).string(message.guildDisplayId);
                return writer;
            };

            /**
             * Encodes the specified GetGuildMetaByGuestResponse message, length delimited. Does not implicitly {@link kritor.guild.GetGuildMetaByGuestResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.guild.GetGuildMetaByGuestResponse
             * @static
             * @param {kritor.guild.IGetGuildMetaByGuestResponse} message GetGuildMetaByGuestResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetGuildMetaByGuestResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetGuildMetaByGuestResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.guild.GetGuildMetaByGuestResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.guild.GetGuildMetaByGuestResponse} GetGuildMetaByGuestResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetGuildMetaByGuestResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.guild.GetGuildMetaByGuestResponse();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.guildId = reader.uint64();
                            break;
                        }
                    case 2: {
                            message.guildName = reader.string();
                            break;
                        }
                    case 3: {
                            message.guildProfile = reader.string();
                            break;
                        }
                    case 4: {
                            message.createTime = reader.uint64();
                            break;
                        }
                    case 5: {
                            message.maxMemberCount = reader.uint64();
                            break;
                        }
                    case 6: {
                            message.maxRobotCount = reader.uint64();
                            break;
                        }
                    case 7: {
                            message.maxAdminCount = reader.uint64();
                            break;
                        }
                    case 8: {
                            message.memberCount = reader.uint64();
                            break;
                        }
                    case 9: {
                            message.ownerId = reader.uint64();
                            break;
                        }
                    case 10: {
                            message.guildDisplayId = reader.string();
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
             * Decodes a GetGuildMetaByGuestResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.guild.GetGuildMetaByGuestResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.guild.GetGuildMetaByGuestResponse} GetGuildMetaByGuestResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetGuildMetaByGuestResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetGuildMetaByGuestResponse message.
             * @function verify
             * @memberof kritor.guild.GetGuildMetaByGuestResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetGuildMetaByGuestResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.guildId != null && message.hasOwnProperty("guildId"))
                    if (!$util.isInteger(message.guildId) && !(message.guildId && $util.isInteger(message.guildId.low) && $util.isInteger(message.guildId.high)))
                        return "guildId: integer|Long expected";
                if (message.guildName != null && message.hasOwnProperty("guildName"))
                    if (!$util.isString(message.guildName))
                        return "guildName: string expected";
                if (message.guildProfile != null && message.hasOwnProperty("guildProfile"))
                    if (!$util.isString(message.guildProfile))
                        return "guildProfile: string expected";
                if (message.createTime != null && message.hasOwnProperty("createTime"))
                    if (!$util.isInteger(message.createTime) && !(message.createTime && $util.isInteger(message.createTime.low) && $util.isInteger(message.createTime.high)))
                        return "createTime: integer|Long expected";
                if (message.maxMemberCount != null && message.hasOwnProperty("maxMemberCount"))
                    if (!$util.isInteger(message.maxMemberCount) && !(message.maxMemberCount && $util.isInteger(message.maxMemberCount.low) && $util.isInteger(message.maxMemberCount.high)))
                        return "maxMemberCount: integer|Long expected";
                if (message.maxRobotCount != null && message.hasOwnProperty("maxRobotCount"))
                    if (!$util.isInteger(message.maxRobotCount) && !(message.maxRobotCount && $util.isInteger(message.maxRobotCount.low) && $util.isInteger(message.maxRobotCount.high)))
                        return "maxRobotCount: integer|Long expected";
                if (message.maxAdminCount != null && message.hasOwnProperty("maxAdminCount"))
                    if (!$util.isInteger(message.maxAdminCount) && !(message.maxAdminCount && $util.isInteger(message.maxAdminCount.low) && $util.isInteger(message.maxAdminCount.high)))
                        return "maxAdminCount: integer|Long expected";
                if (message.memberCount != null && message.hasOwnProperty("memberCount"))
                    if (!$util.isInteger(message.memberCount) && !(message.memberCount && $util.isInteger(message.memberCount.low) && $util.isInteger(message.memberCount.high)))
                        return "memberCount: integer|Long expected";
                if (message.ownerId != null && message.hasOwnProperty("ownerId"))
                    if (!$util.isInteger(message.ownerId) && !(message.ownerId && $util.isInteger(message.ownerId.low) && $util.isInteger(message.ownerId.high)))
                        return "ownerId: integer|Long expected";
                if (message.guildDisplayId != null && message.hasOwnProperty("guildDisplayId"))
                    if (!$util.isString(message.guildDisplayId))
                        return "guildDisplayId: string expected";
                return null;
            };

            /**
             * Creates a GetGuildMetaByGuestResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.guild.GetGuildMetaByGuestResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.guild.GetGuildMetaByGuestResponse} GetGuildMetaByGuestResponse
             */
            GetGuildMetaByGuestResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.guild.GetGuildMetaByGuestResponse)
                    return object;
                let message = new $root.kritor.guild.GetGuildMetaByGuestResponse();
                if (object.guildId != null)
                    if ($util.Long)
                        (message.guildId = $util.Long.fromValue(object.guildId)).unsigned = true;
                    else if (typeof object.guildId === "string")
                        message.guildId = parseInt(object.guildId, 10);
                    else if (typeof object.guildId === "number")
                        message.guildId = object.guildId;
                    else if (typeof object.guildId === "object")
                        message.guildId = new $util.LongBits(object.guildId.low >>> 0, object.guildId.high >>> 0).toNumber(true);
                if (object.guildName != null)
                    message.guildName = String(object.guildName);
                if (object.guildProfile != null)
                    message.guildProfile = String(object.guildProfile);
                if (object.createTime != null)
                    if ($util.Long)
                        (message.createTime = $util.Long.fromValue(object.createTime)).unsigned = true;
                    else if (typeof object.createTime === "string")
                        message.createTime = parseInt(object.createTime, 10);
                    else if (typeof object.createTime === "number")
                        message.createTime = object.createTime;
                    else if (typeof object.createTime === "object")
                        message.createTime = new $util.LongBits(object.createTime.low >>> 0, object.createTime.high >>> 0).toNumber(true);
                if (object.maxMemberCount != null)
                    if ($util.Long)
                        (message.maxMemberCount = $util.Long.fromValue(object.maxMemberCount)).unsigned = true;
                    else if (typeof object.maxMemberCount === "string")
                        message.maxMemberCount = parseInt(object.maxMemberCount, 10);
                    else if (typeof object.maxMemberCount === "number")
                        message.maxMemberCount = object.maxMemberCount;
                    else if (typeof object.maxMemberCount === "object")
                        message.maxMemberCount = new $util.LongBits(object.maxMemberCount.low >>> 0, object.maxMemberCount.high >>> 0).toNumber(true);
                if (object.maxRobotCount != null)
                    if ($util.Long)
                        (message.maxRobotCount = $util.Long.fromValue(object.maxRobotCount)).unsigned = true;
                    else if (typeof object.maxRobotCount === "string")
                        message.maxRobotCount = parseInt(object.maxRobotCount, 10);
                    else if (typeof object.maxRobotCount === "number")
                        message.maxRobotCount = object.maxRobotCount;
                    else if (typeof object.maxRobotCount === "object")
                        message.maxRobotCount = new $util.LongBits(object.maxRobotCount.low >>> 0, object.maxRobotCount.high >>> 0).toNumber(true);
                if (object.maxAdminCount != null)
                    if ($util.Long)
                        (message.maxAdminCount = $util.Long.fromValue(object.maxAdminCount)).unsigned = true;
                    else if (typeof object.maxAdminCount === "string")
                        message.maxAdminCount = parseInt(object.maxAdminCount, 10);
                    else if (typeof object.maxAdminCount === "number")
                        message.maxAdminCount = object.maxAdminCount;
                    else if (typeof object.maxAdminCount === "object")
                        message.maxAdminCount = new $util.LongBits(object.maxAdminCount.low >>> 0, object.maxAdminCount.high >>> 0).toNumber(true);
                if (object.memberCount != null)
                    if ($util.Long)
                        (message.memberCount = $util.Long.fromValue(object.memberCount)).unsigned = true;
                    else if (typeof object.memberCount === "string")
                        message.memberCount = parseInt(object.memberCount, 10);
                    else if (typeof object.memberCount === "number")
                        message.memberCount = object.memberCount;
                    else if (typeof object.memberCount === "object")
                        message.memberCount = new $util.LongBits(object.memberCount.low >>> 0, object.memberCount.high >>> 0).toNumber(true);
                if (object.ownerId != null)
                    if ($util.Long)
                        (message.ownerId = $util.Long.fromValue(object.ownerId)).unsigned = true;
                    else if (typeof object.ownerId === "string")
                        message.ownerId = parseInt(object.ownerId, 10);
                    else if (typeof object.ownerId === "number")
                        message.ownerId = object.ownerId;
                    else if (typeof object.ownerId === "object")
                        message.ownerId = new $util.LongBits(object.ownerId.low >>> 0, object.ownerId.high >>> 0).toNumber(true);
                if (object.guildDisplayId != null)
                    message.guildDisplayId = String(object.guildDisplayId);
                return message;
            };

            /**
             * Creates a plain object from a GetGuildMetaByGuestResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.guild.GetGuildMetaByGuestResponse
             * @static
             * @param {kritor.guild.GetGuildMetaByGuestResponse} message GetGuildMetaByGuestResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetGuildMetaByGuestResponse.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.guildId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.guildId = options.longs === String ? "0" : 0;
                    object.guildName = "";
                    object.guildProfile = "";
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.createTime = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.createTime = options.longs === String ? "0" : 0;
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.maxMemberCount = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.maxMemberCount = options.longs === String ? "0" : 0;
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.maxRobotCount = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.maxRobotCount = options.longs === String ? "0" : 0;
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.maxAdminCount = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.maxAdminCount = options.longs === String ? "0" : 0;
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.memberCount = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.memberCount = options.longs === String ? "0" : 0;
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.ownerId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.ownerId = options.longs === String ? "0" : 0;
                    object.guildDisplayId = "";
                }
                if (message.guildId != null && message.hasOwnProperty("guildId"))
                    if (typeof message.guildId === "number")
                        object.guildId = options.longs === String ? String(message.guildId) : message.guildId;
                    else
                        object.guildId = options.longs === String ? $util.Long.prototype.toString.call(message.guildId) : options.longs === Number ? new $util.LongBits(message.guildId.low >>> 0, message.guildId.high >>> 0).toNumber(true) : message.guildId;
                if (message.guildName != null && message.hasOwnProperty("guildName"))
                    object.guildName = message.guildName;
                if (message.guildProfile != null && message.hasOwnProperty("guildProfile"))
                    object.guildProfile = message.guildProfile;
                if (message.createTime != null && message.hasOwnProperty("createTime"))
                    if (typeof message.createTime === "number")
                        object.createTime = options.longs === String ? String(message.createTime) : message.createTime;
                    else
                        object.createTime = options.longs === String ? $util.Long.prototype.toString.call(message.createTime) : options.longs === Number ? new $util.LongBits(message.createTime.low >>> 0, message.createTime.high >>> 0).toNumber(true) : message.createTime;
                if (message.maxMemberCount != null && message.hasOwnProperty("maxMemberCount"))
                    if (typeof message.maxMemberCount === "number")
                        object.maxMemberCount = options.longs === String ? String(message.maxMemberCount) : message.maxMemberCount;
                    else
                        object.maxMemberCount = options.longs === String ? $util.Long.prototype.toString.call(message.maxMemberCount) : options.longs === Number ? new $util.LongBits(message.maxMemberCount.low >>> 0, message.maxMemberCount.high >>> 0).toNumber(true) : message.maxMemberCount;
                if (message.maxRobotCount != null && message.hasOwnProperty("maxRobotCount"))
                    if (typeof message.maxRobotCount === "number")
                        object.maxRobotCount = options.longs === String ? String(message.maxRobotCount) : message.maxRobotCount;
                    else
                        object.maxRobotCount = options.longs === String ? $util.Long.prototype.toString.call(message.maxRobotCount) : options.longs === Number ? new $util.LongBits(message.maxRobotCount.low >>> 0, message.maxRobotCount.high >>> 0).toNumber(true) : message.maxRobotCount;
                if (message.maxAdminCount != null && message.hasOwnProperty("maxAdminCount"))
                    if (typeof message.maxAdminCount === "number")
                        object.maxAdminCount = options.longs === String ? String(message.maxAdminCount) : message.maxAdminCount;
                    else
                        object.maxAdminCount = options.longs === String ? $util.Long.prototype.toString.call(message.maxAdminCount) : options.longs === Number ? new $util.LongBits(message.maxAdminCount.low >>> 0, message.maxAdminCount.high >>> 0).toNumber(true) : message.maxAdminCount;
                if (message.memberCount != null && message.hasOwnProperty("memberCount"))
                    if (typeof message.memberCount === "number")
                        object.memberCount = options.longs === String ? String(message.memberCount) : message.memberCount;
                    else
                        object.memberCount = options.longs === String ? $util.Long.prototype.toString.call(message.memberCount) : options.longs === Number ? new $util.LongBits(message.memberCount.low >>> 0, message.memberCount.high >>> 0).toNumber(true) : message.memberCount;
                if (message.ownerId != null && message.hasOwnProperty("ownerId"))
                    if (typeof message.ownerId === "number")
                        object.ownerId = options.longs === String ? String(message.ownerId) : message.ownerId;
                    else
                        object.ownerId = options.longs === String ? $util.Long.prototype.toString.call(message.ownerId) : options.longs === Number ? new $util.LongBits(message.ownerId.low >>> 0, message.ownerId.high >>> 0).toNumber(true) : message.ownerId;
                if (message.guildDisplayId != null && message.hasOwnProperty("guildDisplayId"))
                    object.guildDisplayId = message.guildDisplayId;
                return object;
            };

            /**
             * Converts this GetGuildMetaByGuestResponse to JSON.
             * @function toJSON
             * @memberof kritor.guild.GetGuildMetaByGuestResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetGuildMetaByGuestResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GetGuildMetaByGuestResponse
             * @function getTypeUrl
             * @memberof kritor.guild.GetGuildMetaByGuestResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetGuildMetaByGuestResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.guild.GetGuildMetaByGuestResponse";
            };

            return GetGuildMetaByGuestResponse;
        })();

        guild.GetGuildChannelListRequest = (function() {

            /**
             * Properties of a GetGuildChannelListRequest.
             * @memberof kritor.guild
             * @interface IGetGuildChannelListRequest
             * @property {number|Long|null} [guildId] GetGuildChannelListRequest guildId
             * @property {boolean|null} [refresh] GetGuildChannelListRequest refresh
             */

            /**
             * Constructs a new GetGuildChannelListRequest.
             * @memberof kritor.guild
             * @classdesc Represents a GetGuildChannelListRequest.
             * @implements IGetGuildChannelListRequest
             * @constructor
             * @param {kritor.guild.IGetGuildChannelListRequest=} [properties] Properties to set
             */
            function GetGuildChannelListRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetGuildChannelListRequest guildId.
             * @member {number|Long} guildId
             * @memberof kritor.guild.GetGuildChannelListRequest
             * @instance
             */
            GetGuildChannelListRequest.prototype.guildId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * GetGuildChannelListRequest refresh.
             * @member {boolean} refresh
             * @memberof kritor.guild.GetGuildChannelListRequest
             * @instance
             */
            GetGuildChannelListRequest.prototype.refresh = false;

            /**
             * Creates a new GetGuildChannelListRequest instance using the specified properties.
             * @function create
             * @memberof kritor.guild.GetGuildChannelListRequest
             * @static
             * @param {kritor.guild.IGetGuildChannelListRequest=} [properties] Properties to set
             * @returns {kritor.guild.GetGuildChannelListRequest} GetGuildChannelListRequest instance
             */
            GetGuildChannelListRequest.create = function create(properties) {
                return new GetGuildChannelListRequest(properties);
            };

            /**
             * Encodes the specified GetGuildChannelListRequest message. Does not implicitly {@link kritor.guild.GetGuildChannelListRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.guild.GetGuildChannelListRequest
             * @static
             * @param {kritor.guild.IGetGuildChannelListRequest} message GetGuildChannelListRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetGuildChannelListRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.guildId != null && Object.hasOwnProperty.call(message, "guildId"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.guildId);
                if (message.refresh != null && Object.hasOwnProperty.call(message, "refresh"))
                    writer.uint32(/* id 2, wireType 0 =*/16).bool(message.refresh);
                return writer;
            };

            /**
             * Encodes the specified GetGuildChannelListRequest message, length delimited. Does not implicitly {@link kritor.guild.GetGuildChannelListRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.guild.GetGuildChannelListRequest
             * @static
             * @param {kritor.guild.IGetGuildChannelListRequest} message GetGuildChannelListRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetGuildChannelListRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetGuildChannelListRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.guild.GetGuildChannelListRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.guild.GetGuildChannelListRequest} GetGuildChannelListRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetGuildChannelListRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.guild.GetGuildChannelListRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.guildId = reader.uint64();
                            break;
                        }
                    case 2: {
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
             * Decodes a GetGuildChannelListRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.guild.GetGuildChannelListRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.guild.GetGuildChannelListRequest} GetGuildChannelListRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetGuildChannelListRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetGuildChannelListRequest message.
             * @function verify
             * @memberof kritor.guild.GetGuildChannelListRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetGuildChannelListRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.guildId != null && message.hasOwnProperty("guildId"))
                    if (!$util.isInteger(message.guildId) && !(message.guildId && $util.isInteger(message.guildId.low) && $util.isInteger(message.guildId.high)))
                        return "guildId: integer|Long expected";
                if (message.refresh != null && message.hasOwnProperty("refresh"))
                    if (typeof message.refresh !== "boolean")
                        return "refresh: boolean expected";
                return null;
            };

            /**
             * Creates a GetGuildChannelListRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.guild.GetGuildChannelListRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.guild.GetGuildChannelListRequest} GetGuildChannelListRequest
             */
            GetGuildChannelListRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.guild.GetGuildChannelListRequest)
                    return object;
                let message = new $root.kritor.guild.GetGuildChannelListRequest();
                if (object.guildId != null)
                    if ($util.Long)
                        (message.guildId = $util.Long.fromValue(object.guildId)).unsigned = true;
                    else if (typeof object.guildId === "string")
                        message.guildId = parseInt(object.guildId, 10);
                    else if (typeof object.guildId === "number")
                        message.guildId = object.guildId;
                    else if (typeof object.guildId === "object")
                        message.guildId = new $util.LongBits(object.guildId.low >>> 0, object.guildId.high >>> 0).toNumber(true);
                if (object.refresh != null)
                    message.refresh = Boolean(object.refresh);
                return message;
            };

            /**
             * Creates a plain object from a GetGuildChannelListRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.guild.GetGuildChannelListRequest
             * @static
             * @param {kritor.guild.GetGuildChannelListRequest} message GetGuildChannelListRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetGuildChannelListRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.guildId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.guildId = options.longs === String ? "0" : 0;
                    object.refresh = false;
                }
                if (message.guildId != null && message.hasOwnProperty("guildId"))
                    if (typeof message.guildId === "number")
                        object.guildId = options.longs === String ? String(message.guildId) : message.guildId;
                    else
                        object.guildId = options.longs === String ? $util.Long.prototype.toString.call(message.guildId) : options.longs === Number ? new $util.LongBits(message.guildId.low >>> 0, message.guildId.high >>> 0).toNumber(true) : message.guildId;
                if (message.refresh != null && message.hasOwnProperty("refresh"))
                    object.refresh = message.refresh;
                return object;
            };

            /**
             * Converts this GetGuildChannelListRequest to JSON.
             * @function toJSON
             * @memberof kritor.guild.GetGuildChannelListRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetGuildChannelListRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GetGuildChannelListRequest
             * @function getTypeUrl
             * @memberof kritor.guild.GetGuildChannelListRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetGuildChannelListRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.guild.GetGuildChannelListRequest";
            };

            return GetGuildChannelListRequest;
        })();

        guild.GetGuildChannelListResponse = (function() {

            /**
             * Properties of a GetGuildChannelListResponse.
             * @memberof kritor.guild
             * @interface IGetGuildChannelListResponse
             * @property {Array.<kritor.guild.IChannelInfo>|null} [channelsInfo] GetGuildChannelListResponse channelsInfo
             */

            /**
             * Constructs a new GetGuildChannelListResponse.
             * @memberof kritor.guild
             * @classdesc Represents a GetGuildChannelListResponse.
             * @implements IGetGuildChannelListResponse
             * @constructor
             * @param {kritor.guild.IGetGuildChannelListResponse=} [properties] Properties to set
             */
            function GetGuildChannelListResponse(properties) {
                this.channelsInfo = [];
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetGuildChannelListResponse channelsInfo.
             * @member {Array.<kritor.guild.IChannelInfo>} channelsInfo
             * @memberof kritor.guild.GetGuildChannelListResponse
             * @instance
             */
            GetGuildChannelListResponse.prototype.channelsInfo = $util.emptyArray;

            /**
             * Creates a new GetGuildChannelListResponse instance using the specified properties.
             * @function create
             * @memberof kritor.guild.GetGuildChannelListResponse
             * @static
             * @param {kritor.guild.IGetGuildChannelListResponse=} [properties] Properties to set
             * @returns {kritor.guild.GetGuildChannelListResponse} GetGuildChannelListResponse instance
             */
            GetGuildChannelListResponse.create = function create(properties) {
                return new GetGuildChannelListResponse(properties);
            };

            /**
             * Encodes the specified GetGuildChannelListResponse message. Does not implicitly {@link kritor.guild.GetGuildChannelListResponse.verify|verify} messages.
             * @function encode
             * @memberof kritor.guild.GetGuildChannelListResponse
             * @static
             * @param {kritor.guild.IGetGuildChannelListResponse} message GetGuildChannelListResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetGuildChannelListResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.channelsInfo != null && message.channelsInfo.length)
                    for (let i = 0; i < message.channelsInfo.length; ++i)
                        $root.kritor.guild.ChannelInfo.encode(message.channelsInfo[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified GetGuildChannelListResponse message, length delimited. Does not implicitly {@link kritor.guild.GetGuildChannelListResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.guild.GetGuildChannelListResponse
             * @static
             * @param {kritor.guild.IGetGuildChannelListResponse} message GetGuildChannelListResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetGuildChannelListResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetGuildChannelListResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.guild.GetGuildChannelListResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.guild.GetGuildChannelListResponse} GetGuildChannelListResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetGuildChannelListResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.guild.GetGuildChannelListResponse();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            if (!(message.channelsInfo && message.channelsInfo.length))
                                message.channelsInfo = [];
                            message.channelsInfo.push($root.kritor.guild.ChannelInfo.decode(reader, reader.uint32()));
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
             * Decodes a GetGuildChannelListResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.guild.GetGuildChannelListResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.guild.GetGuildChannelListResponse} GetGuildChannelListResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetGuildChannelListResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetGuildChannelListResponse message.
             * @function verify
             * @memberof kritor.guild.GetGuildChannelListResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetGuildChannelListResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.channelsInfo != null && message.hasOwnProperty("channelsInfo")) {
                    if (!Array.isArray(message.channelsInfo))
                        return "channelsInfo: array expected";
                    for (let i = 0; i < message.channelsInfo.length; ++i) {
                        let error = $root.kritor.guild.ChannelInfo.verify(message.channelsInfo[i]);
                        if (error)
                            return "channelsInfo." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a GetGuildChannelListResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.guild.GetGuildChannelListResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.guild.GetGuildChannelListResponse} GetGuildChannelListResponse
             */
            GetGuildChannelListResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.guild.GetGuildChannelListResponse)
                    return object;
                let message = new $root.kritor.guild.GetGuildChannelListResponse();
                if (object.channelsInfo) {
                    if (!Array.isArray(object.channelsInfo))
                        throw TypeError(".kritor.guild.GetGuildChannelListResponse.channelsInfo: array expected");
                    message.channelsInfo = [];
                    for (let i = 0; i < object.channelsInfo.length; ++i) {
                        if (typeof object.channelsInfo[i] !== "object")
                            throw TypeError(".kritor.guild.GetGuildChannelListResponse.channelsInfo: object expected");
                        message.channelsInfo[i] = $root.kritor.guild.ChannelInfo.fromObject(object.channelsInfo[i]);
                    }
                }
                return message;
            };

            /**
             * Creates a plain object from a GetGuildChannelListResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.guild.GetGuildChannelListResponse
             * @static
             * @param {kritor.guild.GetGuildChannelListResponse} message GetGuildChannelListResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetGuildChannelListResponse.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.arrays || options.defaults)
                    object.channelsInfo = [];
                if (message.channelsInfo && message.channelsInfo.length) {
                    object.channelsInfo = [];
                    for (let j = 0; j < message.channelsInfo.length; ++j)
                        object.channelsInfo[j] = $root.kritor.guild.ChannelInfo.toObject(message.channelsInfo[j], options);
                }
                return object;
            };

            /**
             * Converts this GetGuildChannelListResponse to JSON.
             * @function toJSON
             * @memberof kritor.guild.GetGuildChannelListResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetGuildChannelListResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GetGuildChannelListResponse
             * @function getTypeUrl
             * @memberof kritor.guild.GetGuildChannelListResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetGuildChannelListResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.guild.GetGuildChannelListResponse";
            };

            return GetGuildChannelListResponse;
        })();

        guild.GetGuildMemberListRequest = (function() {

            /**
             * Properties of a GetGuildMemberListRequest.
             * @memberof kritor.guild
             * @interface IGetGuildMemberListRequest
             * @property {number|Long|null} [guildId] GetGuildMemberListRequest guildId
             * @property {string|null} [nextToken] GetGuildMemberListRequest nextToken
             * @property {boolean|null} [all] GetGuildMemberListRequest all
             * @property {boolean|null} [refresh] GetGuildMemberListRequest refresh
             */

            /**
             * Constructs a new GetGuildMemberListRequest.
             * @memberof kritor.guild
             * @classdesc Represents a GetGuildMemberListRequest.
             * @implements IGetGuildMemberListRequest
             * @constructor
             * @param {kritor.guild.IGetGuildMemberListRequest=} [properties] Properties to set
             */
            function GetGuildMemberListRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetGuildMemberListRequest guildId.
             * @member {number|Long} guildId
             * @memberof kritor.guild.GetGuildMemberListRequest
             * @instance
             */
            GetGuildMemberListRequest.prototype.guildId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * GetGuildMemberListRequest nextToken.
             * @member {string} nextToken
             * @memberof kritor.guild.GetGuildMemberListRequest
             * @instance
             */
            GetGuildMemberListRequest.prototype.nextToken = "";

            /**
             * GetGuildMemberListRequest all.
             * @member {boolean} all
             * @memberof kritor.guild.GetGuildMemberListRequest
             * @instance
             */
            GetGuildMemberListRequest.prototype.all = false;

            /**
             * GetGuildMemberListRequest refresh.
             * @member {boolean} refresh
             * @memberof kritor.guild.GetGuildMemberListRequest
             * @instance
             */
            GetGuildMemberListRequest.prototype.refresh = false;

            /**
             * Creates a new GetGuildMemberListRequest instance using the specified properties.
             * @function create
             * @memberof kritor.guild.GetGuildMemberListRequest
             * @static
             * @param {kritor.guild.IGetGuildMemberListRequest=} [properties] Properties to set
             * @returns {kritor.guild.GetGuildMemberListRequest} GetGuildMemberListRequest instance
             */
            GetGuildMemberListRequest.create = function create(properties) {
                return new GetGuildMemberListRequest(properties);
            };

            /**
             * Encodes the specified GetGuildMemberListRequest message. Does not implicitly {@link kritor.guild.GetGuildMemberListRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.guild.GetGuildMemberListRequest
             * @static
             * @param {kritor.guild.IGetGuildMemberListRequest} message GetGuildMemberListRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetGuildMemberListRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.guildId != null && Object.hasOwnProperty.call(message, "guildId"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.guildId);
                if (message.nextToken != null && Object.hasOwnProperty.call(message, "nextToken"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.nextToken);
                if (message.all != null && Object.hasOwnProperty.call(message, "all"))
                    writer.uint32(/* id 3, wireType 0 =*/24).bool(message.all);
                if (message.refresh != null && Object.hasOwnProperty.call(message, "refresh"))
                    writer.uint32(/* id 4, wireType 0 =*/32).bool(message.refresh);
                return writer;
            };

            /**
             * Encodes the specified GetGuildMemberListRequest message, length delimited. Does not implicitly {@link kritor.guild.GetGuildMemberListRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.guild.GetGuildMemberListRequest
             * @static
             * @param {kritor.guild.IGetGuildMemberListRequest} message GetGuildMemberListRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetGuildMemberListRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetGuildMemberListRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.guild.GetGuildMemberListRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.guild.GetGuildMemberListRequest} GetGuildMemberListRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetGuildMemberListRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.guild.GetGuildMemberListRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.guildId = reader.uint64();
                            break;
                        }
                    case 2: {
                            message.nextToken = reader.string();
                            break;
                        }
                    case 3: {
                            message.all = reader.bool();
                            break;
                        }
                    case 4: {
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
             * Decodes a GetGuildMemberListRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.guild.GetGuildMemberListRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.guild.GetGuildMemberListRequest} GetGuildMemberListRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetGuildMemberListRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetGuildMemberListRequest message.
             * @function verify
             * @memberof kritor.guild.GetGuildMemberListRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetGuildMemberListRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.guildId != null && message.hasOwnProperty("guildId"))
                    if (!$util.isInteger(message.guildId) && !(message.guildId && $util.isInteger(message.guildId.low) && $util.isInteger(message.guildId.high)))
                        return "guildId: integer|Long expected";
                if (message.nextToken != null && message.hasOwnProperty("nextToken"))
                    if (!$util.isString(message.nextToken))
                        return "nextToken: string expected";
                if (message.all != null && message.hasOwnProperty("all"))
                    if (typeof message.all !== "boolean")
                        return "all: boolean expected";
                if (message.refresh != null && message.hasOwnProperty("refresh"))
                    if (typeof message.refresh !== "boolean")
                        return "refresh: boolean expected";
                return null;
            };

            /**
             * Creates a GetGuildMemberListRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.guild.GetGuildMemberListRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.guild.GetGuildMemberListRequest} GetGuildMemberListRequest
             */
            GetGuildMemberListRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.guild.GetGuildMemberListRequest)
                    return object;
                let message = new $root.kritor.guild.GetGuildMemberListRequest();
                if (object.guildId != null)
                    if ($util.Long)
                        (message.guildId = $util.Long.fromValue(object.guildId)).unsigned = true;
                    else if (typeof object.guildId === "string")
                        message.guildId = parseInt(object.guildId, 10);
                    else if (typeof object.guildId === "number")
                        message.guildId = object.guildId;
                    else if (typeof object.guildId === "object")
                        message.guildId = new $util.LongBits(object.guildId.low >>> 0, object.guildId.high >>> 0).toNumber(true);
                if (object.nextToken != null)
                    message.nextToken = String(object.nextToken);
                if (object.all != null)
                    message.all = Boolean(object.all);
                if (object.refresh != null)
                    message.refresh = Boolean(object.refresh);
                return message;
            };

            /**
             * Creates a plain object from a GetGuildMemberListRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.guild.GetGuildMemberListRequest
             * @static
             * @param {kritor.guild.GetGuildMemberListRequest} message GetGuildMemberListRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetGuildMemberListRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.guildId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.guildId = options.longs === String ? "0" : 0;
                    object.nextToken = "";
                    object.all = false;
                    object.refresh = false;
                }
                if (message.guildId != null && message.hasOwnProperty("guildId"))
                    if (typeof message.guildId === "number")
                        object.guildId = options.longs === String ? String(message.guildId) : message.guildId;
                    else
                        object.guildId = options.longs === String ? $util.Long.prototype.toString.call(message.guildId) : options.longs === Number ? new $util.LongBits(message.guildId.low >>> 0, message.guildId.high >>> 0).toNumber(true) : message.guildId;
                if (message.nextToken != null && message.hasOwnProperty("nextToken"))
                    object.nextToken = message.nextToken;
                if (message.all != null && message.hasOwnProperty("all"))
                    object.all = message.all;
                if (message.refresh != null && message.hasOwnProperty("refresh"))
                    object.refresh = message.refresh;
                return object;
            };

            /**
             * Converts this GetGuildMemberListRequest to JSON.
             * @function toJSON
             * @memberof kritor.guild.GetGuildMemberListRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetGuildMemberListRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GetGuildMemberListRequest
             * @function getTypeUrl
             * @memberof kritor.guild.GetGuildMemberListRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetGuildMemberListRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.guild.GetGuildMemberListRequest";
            };

            return GetGuildMemberListRequest;
        })();

        guild.GetGuildMemberListResponse = (function() {

            /**
             * Properties of a GetGuildMemberListResponse.
             * @memberof kritor.guild
             * @interface IGetGuildMemberListResponse
             * @property {Array.<kritor.guild.IMemberInfo>|null} [membersInfo] GetGuildMemberListResponse membersInfo
             * @property {string|null} [nextToken] GetGuildMemberListResponse nextToken
             * @property {boolean|null} [finished] GetGuildMemberListResponse finished
             */

            /**
             * Constructs a new GetGuildMemberListResponse.
             * @memberof kritor.guild
             * @classdesc Represents a GetGuildMemberListResponse.
             * @implements IGetGuildMemberListResponse
             * @constructor
             * @param {kritor.guild.IGetGuildMemberListResponse=} [properties] Properties to set
             */
            function GetGuildMemberListResponse(properties) {
                this.membersInfo = [];
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetGuildMemberListResponse membersInfo.
             * @member {Array.<kritor.guild.IMemberInfo>} membersInfo
             * @memberof kritor.guild.GetGuildMemberListResponse
             * @instance
             */
            GetGuildMemberListResponse.prototype.membersInfo = $util.emptyArray;

            /**
             * GetGuildMemberListResponse nextToken.
             * @member {string} nextToken
             * @memberof kritor.guild.GetGuildMemberListResponse
             * @instance
             */
            GetGuildMemberListResponse.prototype.nextToken = "";

            /**
             * GetGuildMemberListResponse finished.
             * @member {boolean} finished
             * @memberof kritor.guild.GetGuildMemberListResponse
             * @instance
             */
            GetGuildMemberListResponse.prototype.finished = false;

            /**
             * Creates a new GetGuildMemberListResponse instance using the specified properties.
             * @function create
             * @memberof kritor.guild.GetGuildMemberListResponse
             * @static
             * @param {kritor.guild.IGetGuildMemberListResponse=} [properties] Properties to set
             * @returns {kritor.guild.GetGuildMemberListResponse} GetGuildMemberListResponse instance
             */
            GetGuildMemberListResponse.create = function create(properties) {
                return new GetGuildMemberListResponse(properties);
            };

            /**
             * Encodes the specified GetGuildMemberListResponse message. Does not implicitly {@link kritor.guild.GetGuildMemberListResponse.verify|verify} messages.
             * @function encode
             * @memberof kritor.guild.GetGuildMemberListResponse
             * @static
             * @param {kritor.guild.IGetGuildMemberListResponse} message GetGuildMemberListResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetGuildMemberListResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.membersInfo != null && message.membersInfo.length)
                    for (let i = 0; i < message.membersInfo.length; ++i)
                        $root.kritor.guild.MemberInfo.encode(message.membersInfo[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                if (message.nextToken != null && Object.hasOwnProperty.call(message, "nextToken"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.nextToken);
                if (message.finished != null && Object.hasOwnProperty.call(message, "finished"))
                    writer.uint32(/* id 3, wireType 0 =*/24).bool(message.finished);
                return writer;
            };

            /**
             * Encodes the specified GetGuildMemberListResponse message, length delimited. Does not implicitly {@link kritor.guild.GetGuildMemberListResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.guild.GetGuildMemberListResponse
             * @static
             * @param {kritor.guild.IGetGuildMemberListResponse} message GetGuildMemberListResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetGuildMemberListResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetGuildMemberListResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.guild.GetGuildMemberListResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.guild.GetGuildMemberListResponse} GetGuildMemberListResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetGuildMemberListResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.guild.GetGuildMemberListResponse();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            if (!(message.membersInfo && message.membersInfo.length))
                                message.membersInfo = [];
                            message.membersInfo.push($root.kritor.guild.MemberInfo.decode(reader, reader.uint32()));
                            break;
                        }
                    case 2: {
                            message.nextToken = reader.string();
                            break;
                        }
                    case 3: {
                            message.finished = reader.bool();
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
             * Decodes a GetGuildMemberListResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.guild.GetGuildMemberListResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.guild.GetGuildMemberListResponse} GetGuildMemberListResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetGuildMemberListResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetGuildMemberListResponse message.
             * @function verify
             * @memberof kritor.guild.GetGuildMemberListResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetGuildMemberListResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.membersInfo != null && message.hasOwnProperty("membersInfo")) {
                    if (!Array.isArray(message.membersInfo))
                        return "membersInfo: array expected";
                    for (let i = 0; i < message.membersInfo.length; ++i) {
                        let error = $root.kritor.guild.MemberInfo.verify(message.membersInfo[i]);
                        if (error)
                            return "membersInfo." + error;
                    }
                }
                if (message.nextToken != null && message.hasOwnProperty("nextToken"))
                    if (!$util.isString(message.nextToken))
                        return "nextToken: string expected";
                if (message.finished != null && message.hasOwnProperty("finished"))
                    if (typeof message.finished !== "boolean")
                        return "finished: boolean expected";
                return null;
            };

            /**
             * Creates a GetGuildMemberListResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.guild.GetGuildMemberListResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.guild.GetGuildMemberListResponse} GetGuildMemberListResponse
             */
            GetGuildMemberListResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.guild.GetGuildMemberListResponse)
                    return object;
                let message = new $root.kritor.guild.GetGuildMemberListResponse();
                if (object.membersInfo) {
                    if (!Array.isArray(object.membersInfo))
                        throw TypeError(".kritor.guild.GetGuildMemberListResponse.membersInfo: array expected");
                    message.membersInfo = [];
                    for (let i = 0; i < object.membersInfo.length; ++i) {
                        if (typeof object.membersInfo[i] !== "object")
                            throw TypeError(".kritor.guild.GetGuildMemberListResponse.membersInfo: object expected");
                        message.membersInfo[i] = $root.kritor.guild.MemberInfo.fromObject(object.membersInfo[i]);
                    }
                }
                if (object.nextToken != null)
                    message.nextToken = String(object.nextToken);
                if (object.finished != null)
                    message.finished = Boolean(object.finished);
                return message;
            };

            /**
             * Creates a plain object from a GetGuildMemberListResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.guild.GetGuildMemberListResponse
             * @static
             * @param {kritor.guild.GetGuildMemberListResponse} message GetGuildMemberListResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetGuildMemberListResponse.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.arrays || options.defaults)
                    object.membersInfo = [];
                if (options.defaults) {
                    object.nextToken = "";
                    object.finished = false;
                }
                if (message.membersInfo && message.membersInfo.length) {
                    object.membersInfo = [];
                    for (let j = 0; j < message.membersInfo.length; ++j)
                        object.membersInfo[j] = $root.kritor.guild.MemberInfo.toObject(message.membersInfo[j], options);
                }
                if (message.nextToken != null && message.hasOwnProperty("nextToken"))
                    object.nextToken = message.nextToken;
                if (message.finished != null && message.hasOwnProperty("finished"))
                    object.finished = message.finished;
                return object;
            };

            /**
             * Converts this GetGuildMemberListResponse to JSON.
             * @function toJSON
             * @memberof kritor.guild.GetGuildMemberListResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetGuildMemberListResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GetGuildMemberListResponse
             * @function getTypeUrl
             * @memberof kritor.guild.GetGuildMemberListResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetGuildMemberListResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.guild.GetGuildMemberListResponse";
            };

            return GetGuildMemberListResponse;
        })();

        guild.GetGuildMemberRequest = (function() {

            /**
             * Properties of a GetGuildMemberRequest.
             * @memberof kritor.guild
             * @interface IGetGuildMemberRequest
             * @property {number|Long|null} [guildId] GetGuildMemberRequest guildId
             * @property {number|Long|null} [tinyId] GetGuildMemberRequest tinyId
             */

            /**
             * Constructs a new GetGuildMemberRequest.
             * @memberof kritor.guild
             * @classdesc Represents a GetGuildMemberRequest.
             * @implements IGetGuildMemberRequest
             * @constructor
             * @param {kritor.guild.IGetGuildMemberRequest=} [properties] Properties to set
             */
            function GetGuildMemberRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetGuildMemberRequest guildId.
             * @member {number|Long} guildId
             * @memberof kritor.guild.GetGuildMemberRequest
             * @instance
             */
            GetGuildMemberRequest.prototype.guildId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * GetGuildMemberRequest tinyId.
             * @member {number|Long} tinyId
             * @memberof kritor.guild.GetGuildMemberRequest
             * @instance
             */
            GetGuildMemberRequest.prototype.tinyId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * Creates a new GetGuildMemberRequest instance using the specified properties.
             * @function create
             * @memberof kritor.guild.GetGuildMemberRequest
             * @static
             * @param {kritor.guild.IGetGuildMemberRequest=} [properties] Properties to set
             * @returns {kritor.guild.GetGuildMemberRequest} GetGuildMemberRequest instance
             */
            GetGuildMemberRequest.create = function create(properties) {
                return new GetGuildMemberRequest(properties);
            };

            /**
             * Encodes the specified GetGuildMemberRequest message. Does not implicitly {@link kritor.guild.GetGuildMemberRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.guild.GetGuildMemberRequest
             * @static
             * @param {kritor.guild.IGetGuildMemberRequest} message GetGuildMemberRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetGuildMemberRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.guildId != null && Object.hasOwnProperty.call(message, "guildId"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.guildId);
                if (message.tinyId != null && Object.hasOwnProperty.call(message, "tinyId"))
                    writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.tinyId);
                return writer;
            };

            /**
             * Encodes the specified GetGuildMemberRequest message, length delimited. Does not implicitly {@link kritor.guild.GetGuildMemberRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.guild.GetGuildMemberRequest
             * @static
             * @param {kritor.guild.IGetGuildMemberRequest} message GetGuildMemberRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetGuildMemberRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetGuildMemberRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.guild.GetGuildMemberRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.guild.GetGuildMemberRequest} GetGuildMemberRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetGuildMemberRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.guild.GetGuildMemberRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.guildId = reader.uint64();
                            break;
                        }
                    case 2: {
                            message.tinyId = reader.uint64();
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
             * Decodes a GetGuildMemberRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.guild.GetGuildMemberRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.guild.GetGuildMemberRequest} GetGuildMemberRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetGuildMemberRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetGuildMemberRequest message.
             * @function verify
             * @memberof kritor.guild.GetGuildMemberRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetGuildMemberRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.guildId != null && message.hasOwnProperty("guildId"))
                    if (!$util.isInteger(message.guildId) && !(message.guildId && $util.isInteger(message.guildId.low) && $util.isInteger(message.guildId.high)))
                        return "guildId: integer|Long expected";
                if (message.tinyId != null && message.hasOwnProperty("tinyId"))
                    if (!$util.isInteger(message.tinyId) && !(message.tinyId && $util.isInteger(message.tinyId.low) && $util.isInteger(message.tinyId.high)))
                        return "tinyId: integer|Long expected";
                return null;
            };

            /**
             * Creates a GetGuildMemberRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.guild.GetGuildMemberRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.guild.GetGuildMemberRequest} GetGuildMemberRequest
             */
            GetGuildMemberRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.guild.GetGuildMemberRequest)
                    return object;
                let message = new $root.kritor.guild.GetGuildMemberRequest();
                if (object.guildId != null)
                    if ($util.Long)
                        (message.guildId = $util.Long.fromValue(object.guildId)).unsigned = true;
                    else if (typeof object.guildId === "string")
                        message.guildId = parseInt(object.guildId, 10);
                    else if (typeof object.guildId === "number")
                        message.guildId = object.guildId;
                    else if (typeof object.guildId === "object")
                        message.guildId = new $util.LongBits(object.guildId.low >>> 0, object.guildId.high >>> 0).toNumber(true);
                if (object.tinyId != null)
                    if ($util.Long)
                        (message.tinyId = $util.Long.fromValue(object.tinyId)).unsigned = true;
                    else if (typeof object.tinyId === "string")
                        message.tinyId = parseInt(object.tinyId, 10);
                    else if (typeof object.tinyId === "number")
                        message.tinyId = object.tinyId;
                    else if (typeof object.tinyId === "object")
                        message.tinyId = new $util.LongBits(object.tinyId.low >>> 0, object.tinyId.high >>> 0).toNumber(true);
                return message;
            };

            /**
             * Creates a plain object from a GetGuildMemberRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.guild.GetGuildMemberRequest
             * @static
             * @param {kritor.guild.GetGuildMemberRequest} message GetGuildMemberRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetGuildMemberRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.guildId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.guildId = options.longs === String ? "0" : 0;
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.tinyId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.tinyId = options.longs === String ? "0" : 0;
                }
                if (message.guildId != null && message.hasOwnProperty("guildId"))
                    if (typeof message.guildId === "number")
                        object.guildId = options.longs === String ? String(message.guildId) : message.guildId;
                    else
                        object.guildId = options.longs === String ? $util.Long.prototype.toString.call(message.guildId) : options.longs === Number ? new $util.LongBits(message.guildId.low >>> 0, message.guildId.high >>> 0).toNumber(true) : message.guildId;
                if (message.tinyId != null && message.hasOwnProperty("tinyId"))
                    if (typeof message.tinyId === "number")
                        object.tinyId = options.longs === String ? String(message.tinyId) : message.tinyId;
                    else
                        object.tinyId = options.longs === String ? $util.Long.prototype.toString.call(message.tinyId) : options.longs === Number ? new $util.LongBits(message.tinyId.low >>> 0, message.tinyId.high >>> 0).toNumber(true) : message.tinyId;
                return object;
            };

            /**
             * Converts this GetGuildMemberRequest to JSON.
             * @function toJSON
             * @memberof kritor.guild.GetGuildMemberRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetGuildMemberRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GetGuildMemberRequest
             * @function getTypeUrl
             * @memberof kritor.guild.GetGuildMemberRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetGuildMemberRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.guild.GetGuildMemberRequest";
            };

            return GetGuildMemberRequest;
        })();

        guild.GetGuildMemberResponse = (function() {

            /**
             * Properties of a GetGuildMemberResponse.
             * @memberof kritor.guild
             * @interface IGetGuildMemberResponse
             * @property {kritor.guild.IMemberProfile|null} [memberInfo] GetGuildMemberResponse memberInfo
             */

            /**
             * Constructs a new GetGuildMemberResponse.
             * @memberof kritor.guild
             * @classdesc Represents a GetGuildMemberResponse.
             * @implements IGetGuildMemberResponse
             * @constructor
             * @param {kritor.guild.IGetGuildMemberResponse=} [properties] Properties to set
             */
            function GetGuildMemberResponse(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetGuildMemberResponse memberInfo.
             * @member {kritor.guild.IMemberProfile|null|undefined} memberInfo
             * @memberof kritor.guild.GetGuildMemberResponse
             * @instance
             */
            GetGuildMemberResponse.prototype.memberInfo = null;

            /**
             * Creates a new GetGuildMemberResponse instance using the specified properties.
             * @function create
             * @memberof kritor.guild.GetGuildMemberResponse
             * @static
             * @param {kritor.guild.IGetGuildMemberResponse=} [properties] Properties to set
             * @returns {kritor.guild.GetGuildMemberResponse} GetGuildMemberResponse instance
             */
            GetGuildMemberResponse.create = function create(properties) {
                return new GetGuildMemberResponse(properties);
            };

            /**
             * Encodes the specified GetGuildMemberResponse message. Does not implicitly {@link kritor.guild.GetGuildMemberResponse.verify|verify} messages.
             * @function encode
             * @memberof kritor.guild.GetGuildMemberResponse
             * @static
             * @param {kritor.guild.IGetGuildMemberResponse} message GetGuildMemberResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetGuildMemberResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.memberInfo != null && Object.hasOwnProperty.call(message, "memberInfo"))
                    $root.kritor.guild.MemberProfile.encode(message.memberInfo, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified GetGuildMemberResponse message, length delimited. Does not implicitly {@link kritor.guild.GetGuildMemberResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.guild.GetGuildMemberResponse
             * @static
             * @param {kritor.guild.IGetGuildMemberResponse} message GetGuildMemberResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetGuildMemberResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetGuildMemberResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.guild.GetGuildMemberResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.guild.GetGuildMemberResponse} GetGuildMemberResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetGuildMemberResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.guild.GetGuildMemberResponse();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.memberInfo = $root.kritor.guild.MemberProfile.decode(reader, reader.uint32());
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
             * Decodes a GetGuildMemberResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.guild.GetGuildMemberResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.guild.GetGuildMemberResponse} GetGuildMemberResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetGuildMemberResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetGuildMemberResponse message.
             * @function verify
             * @memberof kritor.guild.GetGuildMemberResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetGuildMemberResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.memberInfo != null && message.hasOwnProperty("memberInfo")) {
                    let error = $root.kritor.guild.MemberProfile.verify(message.memberInfo);
                    if (error)
                        return "memberInfo." + error;
                }
                return null;
            };

            /**
             * Creates a GetGuildMemberResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.guild.GetGuildMemberResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.guild.GetGuildMemberResponse} GetGuildMemberResponse
             */
            GetGuildMemberResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.guild.GetGuildMemberResponse)
                    return object;
                let message = new $root.kritor.guild.GetGuildMemberResponse();
                if (object.memberInfo != null) {
                    if (typeof object.memberInfo !== "object")
                        throw TypeError(".kritor.guild.GetGuildMemberResponse.memberInfo: object expected");
                    message.memberInfo = $root.kritor.guild.MemberProfile.fromObject(object.memberInfo);
                }
                return message;
            };

            /**
             * Creates a plain object from a GetGuildMemberResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.guild.GetGuildMemberResponse
             * @static
             * @param {kritor.guild.GetGuildMemberResponse} message GetGuildMemberResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetGuildMemberResponse.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults)
                    object.memberInfo = null;
                if (message.memberInfo != null && message.hasOwnProperty("memberInfo"))
                    object.memberInfo = $root.kritor.guild.MemberProfile.toObject(message.memberInfo, options);
                return object;
            };

            /**
             * Converts this GetGuildMemberResponse to JSON.
             * @function toJSON
             * @memberof kritor.guild.GetGuildMemberResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetGuildMemberResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GetGuildMemberResponse
             * @function getTypeUrl
             * @memberof kritor.guild.GetGuildMemberResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetGuildMemberResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.guild.GetGuildMemberResponse";
            };

            return GetGuildMemberResponse;
        })();

        guild.SendChannelMessageRequest = (function() {

            /**
             * Properties of a SendChannelMessageRequest.
             * @memberof kritor.guild
             * @interface ISendChannelMessageRequest
             * @property {number|Long|null} [guildId] SendChannelMessageRequest guildId
             * @property {number|Long|null} [channelId] SendChannelMessageRequest channelId
             * @property {string|null} [message] SendChannelMessageRequest message
             * @property {number|null} [retryCnt] SendChannelMessageRequest retryCnt
             * @property {number|Long|null} [recallDuration] SendChannelMessageRequest recallDuration
             */

            /**
             * Constructs a new SendChannelMessageRequest.
             * @memberof kritor.guild
             * @classdesc Represents a SendChannelMessageRequest.
             * @implements ISendChannelMessageRequest
             * @constructor
             * @param {kritor.guild.ISendChannelMessageRequest=} [properties] Properties to set
             */
            function SendChannelMessageRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * SendChannelMessageRequest guildId.
             * @member {number|Long} guildId
             * @memberof kritor.guild.SendChannelMessageRequest
             * @instance
             */
            SendChannelMessageRequest.prototype.guildId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * SendChannelMessageRequest channelId.
             * @member {number|Long} channelId
             * @memberof kritor.guild.SendChannelMessageRequest
             * @instance
             */
            SendChannelMessageRequest.prototype.channelId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * SendChannelMessageRequest message.
             * @member {string} message
             * @memberof kritor.guild.SendChannelMessageRequest
             * @instance
             */
            SendChannelMessageRequest.prototype.message = "";

            /**
             * SendChannelMessageRequest retryCnt.
             * @member {number} retryCnt
             * @memberof kritor.guild.SendChannelMessageRequest
             * @instance
             */
            SendChannelMessageRequest.prototype.retryCnt = 0;

            /**
             * SendChannelMessageRequest recallDuration.
             * @member {number|Long} recallDuration
             * @memberof kritor.guild.SendChannelMessageRequest
             * @instance
             */
            SendChannelMessageRequest.prototype.recallDuration = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

            /**
             * Creates a new SendChannelMessageRequest instance using the specified properties.
             * @function create
             * @memberof kritor.guild.SendChannelMessageRequest
             * @static
             * @param {kritor.guild.ISendChannelMessageRequest=} [properties] Properties to set
             * @returns {kritor.guild.SendChannelMessageRequest} SendChannelMessageRequest instance
             */
            SendChannelMessageRequest.create = function create(properties) {
                return new SendChannelMessageRequest(properties);
            };

            /**
             * Encodes the specified SendChannelMessageRequest message. Does not implicitly {@link kritor.guild.SendChannelMessageRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.guild.SendChannelMessageRequest
             * @static
             * @param {kritor.guild.ISendChannelMessageRequest} message SendChannelMessageRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SendChannelMessageRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.guildId != null && Object.hasOwnProperty.call(message, "guildId"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.guildId);
                if (message.channelId != null && Object.hasOwnProperty.call(message, "channelId"))
                    writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.channelId);
                if (message.message != null && Object.hasOwnProperty.call(message, "message"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.message);
                if (message.retryCnt != null && Object.hasOwnProperty.call(message, "retryCnt"))
                    writer.uint32(/* id 4, wireType 0 =*/32).int32(message.retryCnt);
                if (message.recallDuration != null && Object.hasOwnProperty.call(message, "recallDuration"))
                    writer.uint32(/* id 5, wireType 0 =*/40).int64(message.recallDuration);
                return writer;
            };

            /**
             * Encodes the specified SendChannelMessageRequest message, length delimited. Does not implicitly {@link kritor.guild.SendChannelMessageRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.guild.SendChannelMessageRequest
             * @static
             * @param {kritor.guild.ISendChannelMessageRequest} message SendChannelMessageRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SendChannelMessageRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a SendChannelMessageRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.guild.SendChannelMessageRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.guild.SendChannelMessageRequest} SendChannelMessageRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SendChannelMessageRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.guild.SendChannelMessageRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.guildId = reader.uint64();
                            break;
                        }
                    case 2: {
                            message.channelId = reader.uint64();
                            break;
                        }
                    case 3: {
                            message.message = reader.string();
                            break;
                        }
                    case 4: {
                            message.retryCnt = reader.int32();
                            break;
                        }
                    case 5: {
                            message.recallDuration = reader.int64();
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
             * Decodes a SendChannelMessageRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.guild.SendChannelMessageRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.guild.SendChannelMessageRequest} SendChannelMessageRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SendChannelMessageRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a SendChannelMessageRequest message.
             * @function verify
             * @memberof kritor.guild.SendChannelMessageRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            SendChannelMessageRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.guildId != null && message.hasOwnProperty("guildId"))
                    if (!$util.isInteger(message.guildId) && !(message.guildId && $util.isInteger(message.guildId.low) && $util.isInteger(message.guildId.high)))
                        return "guildId: integer|Long expected";
                if (message.channelId != null && message.hasOwnProperty("channelId"))
                    if (!$util.isInteger(message.channelId) && !(message.channelId && $util.isInteger(message.channelId.low) && $util.isInteger(message.channelId.high)))
                        return "channelId: integer|Long expected";
                if (message.message != null && message.hasOwnProperty("message"))
                    if (!$util.isString(message.message))
                        return "message: string expected";
                if (message.retryCnt != null && message.hasOwnProperty("retryCnt"))
                    if (!$util.isInteger(message.retryCnt))
                        return "retryCnt: integer expected";
                if (message.recallDuration != null && message.hasOwnProperty("recallDuration"))
                    if (!$util.isInteger(message.recallDuration) && !(message.recallDuration && $util.isInteger(message.recallDuration.low) && $util.isInteger(message.recallDuration.high)))
                        return "recallDuration: integer|Long expected";
                return null;
            };

            /**
             * Creates a SendChannelMessageRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.guild.SendChannelMessageRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.guild.SendChannelMessageRequest} SendChannelMessageRequest
             */
            SendChannelMessageRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.guild.SendChannelMessageRequest)
                    return object;
                let message = new $root.kritor.guild.SendChannelMessageRequest();
                if (object.guildId != null)
                    if ($util.Long)
                        (message.guildId = $util.Long.fromValue(object.guildId)).unsigned = true;
                    else if (typeof object.guildId === "string")
                        message.guildId = parseInt(object.guildId, 10);
                    else if (typeof object.guildId === "number")
                        message.guildId = object.guildId;
                    else if (typeof object.guildId === "object")
                        message.guildId = new $util.LongBits(object.guildId.low >>> 0, object.guildId.high >>> 0).toNumber(true);
                if (object.channelId != null)
                    if ($util.Long)
                        (message.channelId = $util.Long.fromValue(object.channelId)).unsigned = true;
                    else if (typeof object.channelId === "string")
                        message.channelId = parseInt(object.channelId, 10);
                    else if (typeof object.channelId === "number")
                        message.channelId = object.channelId;
                    else if (typeof object.channelId === "object")
                        message.channelId = new $util.LongBits(object.channelId.low >>> 0, object.channelId.high >>> 0).toNumber(true);
                if (object.message != null)
                    message.message = String(object.message);
                if (object.retryCnt != null)
                    message.retryCnt = object.retryCnt | 0;
                if (object.recallDuration != null)
                    if ($util.Long)
                        (message.recallDuration = $util.Long.fromValue(object.recallDuration)).unsigned = false;
                    else if (typeof object.recallDuration === "string")
                        message.recallDuration = parseInt(object.recallDuration, 10);
                    else if (typeof object.recallDuration === "number")
                        message.recallDuration = object.recallDuration;
                    else if (typeof object.recallDuration === "object")
                        message.recallDuration = new $util.LongBits(object.recallDuration.low >>> 0, object.recallDuration.high >>> 0).toNumber();
                return message;
            };

            /**
             * Creates a plain object from a SendChannelMessageRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.guild.SendChannelMessageRequest
             * @static
             * @param {kritor.guild.SendChannelMessageRequest} message SendChannelMessageRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            SendChannelMessageRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.guildId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.guildId = options.longs === String ? "0" : 0;
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.channelId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.channelId = options.longs === String ? "0" : 0;
                    object.message = "";
                    object.retryCnt = 0;
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, false);
                        object.recallDuration = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.recallDuration = options.longs === String ? "0" : 0;
                }
                if (message.guildId != null && message.hasOwnProperty("guildId"))
                    if (typeof message.guildId === "number")
                        object.guildId = options.longs === String ? String(message.guildId) : message.guildId;
                    else
                        object.guildId = options.longs === String ? $util.Long.prototype.toString.call(message.guildId) : options.longs === Number ? new $util.LongBits(message.guildId.low >>> 0, message.guildId.high >>> 0).toNumber(true) : message.guildId;
                if (message.channelId != null && message.hasOwnProperty("channelId"))
                    if (typeof message.channelId === "number")
                        object.channelId = options.longs === String ? String(message.channelId) : message.channelId;
                    else
                        object.channelId = options.longs === String ? $util.Long.prototype.toString.call(message.channelId) : options.longs === Number ? new $util.LongBits(message.channelId.low >>> 0, message.channelId.high >>> 0).toNumber(true) : message.channelId;
                if (message.message != null && message.hasOwnProperty("message"))
                    object.message = message.message;
                if (message.retryCnt != null && message.hasOwnProperty("retryCnt"))
                    object.retryCnt = message.retryCnt;
                if (message.recallDuration != null && message.hasOwnProperty("recallDuration"))
                    if (typeof message.recallDuration === "number")
                        object.recallDuration = options.longs === String ? String(message.recallDuration) : message.recallDuration;
                    else
                        object.recallDuration = options.longs === String ? $util.Long.prototype.toString.call(message.recallDuration) : options.longs === Number ? new $util.LongBits(message.recallDuration.low >>> 0, message.recallDuration.high >>> 0).toNumber() : message.recallDuration;
                return object;
            };

            /**
             * Converts this SendChannelMessageRequest to JSON.
             * @function toJSON
             * @memberof kritor.guild.SendChannelMessageRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            SendChannelMessageRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for SendChannelMessageRequest
             * @function getTypeUrl
             * @memberof kritor.guild.SendChannelMessageRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            SendChannelMessageRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.guild.SendChannelMessageRequest";
            };

            return SendChannelMessageRequest;
        })();

        guild.SendChannelMessageResponse = (function() {

            /**
             * Properties of a SendChannelMessageResponse.
             * @memberof kritor.guild
             * @interface ISendChannelMessageResponse
             * @property {string|null} [messageId] SendChannelMessageResponse messageId
             * @property {number|Long|null} [time] SendChannelMessageResponse time
             */

            /**
             * Constructs a new SendChannelMessageResponse.
             * @memberof kritor.guild
             * @classdesc Represents a SendChannelMessageResponse.
             * @implements ISendChannelMessageResponse
             * @constructor
             * @param {kritor.guild.ISendChannelMessageResponse=} [properties] Properties to set
             */
            function SendChannelMessageResponse(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * SendChannelMessageResponse messageId.
             * @member {string} messageId
             * @memberof kritor.guild.SendChannelMessageResponse
             * @instance
             */
            SendChannelMessageResponse.prototype.messageId = "";

            /**
             * SendChannelMessageResponse time.
             * @member {number|Long} time
             * @memberof kritor.guild.SendChannelMessageResponse
             * @instance
             */
            SendChannelMessageResponse.prototype.time = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

            /**
             * Creates a new SendChannelMessageResponse instance using the specified properties.
             * @function create
             * @memberof kritor.guild.SendChannelMessageResponse
             * @static
             * @param {kritor.guild.ISendChannelMessageResponse=} [properties] Properties to set
             * @returns {kritor.guild.SendChannelMessageResponse} SendChannelMessageResponse instance
             */
            SendChannelMessageResponse.create = function create(properties) {
                return new SendChannelMessageResponse(properties);
            };

            /**
             * Encodes the specified SendChannelMessageResponse message. Does not implicitly {@link kritor.guild.SendChannelMessageResponse.verify|verify} messages.
             * @function encode
             * @memberof kritor.guild.SendChannelMessageResponse
             * @static
             * @param {kritor.guild.ISendChannelMessageResponse} message SendChannelMessageResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SendChannelMessageResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.messageId != null && Object.hasOwnProperty.call(message, "messageId"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.messageId);
                if (message.time != null && Object.hasOwnProperty.call(message, "time"))
                    writer.uint32(/* id 2, wireType 0 =*/16).int64(message.time);
                return writer;
            };

            /**
             * Encodes the specified SendChannelMessageResponse message, length delimited. Does not implicitly {@link kritor.guild.SendChannelMessageResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.guild.SendChannelMessageResponse
             * @static
             * @param {kritor.guild.ISendChannelMessageResponse} message SendChannelMessageResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SendChannelMessageResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a SendChannelMessageResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.guild.SendChannelMessageResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.guild.SendChannelMessageResponse} SendChannelMessageResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SendChannelMessageResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.guild.SendChannelMessageResponse();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.messageId = reader.string();
                            break;
                        }
                    case 2: {
                            message.time = reader.int64();
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
             * Decodes a SendChannelMessageResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.guild.SendChannelMessageResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.guild.SendChannelMessageResponse} SendChannelMessageResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SendChannelMessageResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a SendChannelMessageResponse message.
             * @function verify
             * @memberof kritor.guild.SendChannelMessageResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            SendChannelMessageResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.messageId != null && message.hasOwnProperty("messageId"))
                    if (!$util.isString(message.messageId))
                        return "messageId: string expected";
                if (message.time != null && message.hasOwnProperty("time"))
                    if (!$util.isInteger(message.time) && !(message.time && $util.isInteger(message.time.low) && $util.isInteger(message.time.high)))
                        return "time: integer|Long expected";
                return null;
            };

            /**
             * Creates a SendChannelMessageResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.guild.SendChannelMessageResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.guild.SendChannelMessageResponse} SendChannelMessageResponse
             */
            SendChannelMessageResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.guild.SendChannelMessageResponse)
                    return object;
                let message = new $root.kritor.guild.SendChannelMessageResponse();
                if (object.messageId != null)
                    message.messageId = String(object.messageId);
                if (object.time != null)
                    if ($util.Long)
                        (message.time = $util.Long.fromValue(object.time)).unsigned = false;
                    else if (typeof object.time === "string")
                        message.time = parseInt(object.time, 10);
                    else if (typeof object.time === "number")
                        message.time = object.time;
                    else if (typeof object.time === "object")
                        message.time = new $util.LongBits(object.time.low >>> 0, object.time.high >>> 0).toNumber();
                return message;
            };

            /**
             * Creates a plain object from a SendChannelMessageResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.guild.SendChannelMessageResponse
             * @static
             * @param {kritor.guild.SendChannelMessageResponse} message SendChannelMessageResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            SendChannelMessageResponse.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.messageId = "";
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, false);
                        object.time = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.time = options.longs === String ? "0" : 0;
                }
                if (message.messageId != null && message.hasOwnProperty("messageId"))
                    object.messageId = message.messageId;
                if (message.time != null && message.hasOwnProperty("time"))
                    if (typeof message.time === "number")
                        object.time = options.longs === String ? String(message.time) : message.time;
                    else
                        object.time = options.longs === String ? $util.Long.prototype.toString.call(message.time) : options.longs === Number ? new $util.LongBits(message.time.low >>> 0, message.time.high >>> 0).toNumber() : message.time;
                return object;
            };

            /**
             * Converts this SendChannelMessageResponse to JSON.
             * @function toJSON
             * @memberof kritor.guild.SendChannelMessageResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            SendChannelMessageResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for SendChannelMessageResponse
             * @function getTypeUrl
             * @memberof kritor.guild.SendChannelMessageResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            SendChannelMessageResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.guild.SendChannelMessageResponse";
            };

            return SendChannelMessageResponse;
        })();

        guild.GetGuildFeedListRequest = (function() {

            /**
             * Properties of a GetGuildFeedListRequest.
             * @memberof kritor.guild
             * @interface IGetGuildFeedListRequest
             * @property {number|Long|null} [guildId] GetGuildFeedListRequest guildId
             * @property {number|null} [from] GetGuildFeedListRequest from
             */

            /**
             * Constructs a new GetGuildFeedListRequest.
             * @memberof kritor.guild
             * @classdesc Represents a GetGuildFeedListRequest.
             * @implements IGetGuildFeedListRequest
             * @constructor
             * @param {kritor.guild.IGetGuildFeedListRequest=} [properties] Properties to set
             */
            function GetGuildFeedListRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetGuildFeedListRequest guildId.
             * @member {number|Long} guildId
             * @memberof kritor.guild.GetGuildFeedListRequest
             * @instance
             */
            GetGuildFeedListRequest.prototype.guildId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * GetGuildFeedListRequest from.
             * @member {number} from
             * @memberof kritor.guild.GetGuildFeedListRequest
             * @instance
             */
            GetGuildFeedListRequest.prototype.from = 0;

            /**
             * Creates a new GetGuildFeedListRequest instance using the specified properties.
             * @function create
             * @memberof kritor.guild.GetGuildFeedListRequest
             * @static
             * @param {kritor.guild.IGetGuildFeedListRequest=} [properties] Properties to set
             * @returns {kritor.guild.GetGuildFeedListRequest} GetGuildFeedListRequest instance
             */
            GetGuildFeedListRequest.create = function create(properties) {
                return new GetGuildFeedListRequest(properties);
            };

            /**
             * Encodes the specified GetGuildFeedListRequest message. Does not implicitly {@link kritor.guild.GetGuildFeedListRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.guild.GetGuildFeedListRequest
             * @static
             * @param {kritor.guild.IGetGuildFeedListRequest} message GetGuildFeedListRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetGuildFeedListRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.guildId != null && Object.hasOwnProperty.call(message, "guildId"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.guildId);
                if (message.from != null && Object.hasOwnProperty.call(message, "from"))
                    writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.from);
                return writer;
            };

            /**
             * Encodes the specified GetGuildFeedListRequest message, length delimited. Does not implicitly {@link kritor.guild.GetGuildFeedListRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.guild.GetGuildFeedListRequest
             * @static
             * @param {kritor.guild.IGetGuildFeedListRequest} message GetGuildFeedListRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetGuildFeedListRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetGuildFeedListRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.guild.GetGuildFeedListRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.guild.GetGuildFeedListRequest} GetGuildFeedListRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetGuildFeedListRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.guild.GetGuildFeedListRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.guildId = reader.uint64();
                            break;
                        }
                    case 2: {
                            message.from = reader.uint32();
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
             * Decodes a GetGuildFeedListRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.guild.GetGuildFeedListRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.guild.GetGuildFeedListRequest} GetGuildFeedListRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetGuildFeedListRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetGuildFeedListRequest message.
             * @function verify
             * @memberof kritor.guild.GetGuildFeedListRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetGuildFeedListRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.guildId != null && message.hasOwnProperty("guildId"))
                    if (!$util.isInteger(message.guildId) && !(message.guildId && $util.isInteger(message.guildId.low) && $util.isInteger(message.guildId.high)))
                        return "guildId: integer|Long expected";
                if (message.from != null && message.hasOwnProperty("from"))
                    if (!$util.isInteger(message.from))
                        return "from: integer expected";
                return null;
            };

            /**
             * Creates a GetGuildFeedListRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.guild.GetGuildFeedListRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.guild.GetGuildFeedListRequest} GetGuildFeedListRequest
             */
            GetGuildFeedListRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.guild.GetGuildFeedListRequest)
                    return object;
                let message = new $root.kritor.guild.GetGuildFeedListRequest();
                if (object.guildId != null)
                    if ($util.Long)
                        (message.guildId = $util.Long.fromValue(object.guildId)).unsigned = true;
                    else if (typeof object.guildId === "string")
                        message.guildId = parseInt(object.guildId, 10);
                    else if (typeof object.guildId === "number")
                        message.guildId = object.guildId;
                    else if (typeof object.guildId === "object")
                        message.guildId = new $util.LongBits(object.guildId.low >>> 0, object.guildId.high >>> 0).toNumber(true);
                if (object.from != null)
                    message.from = object.from >>> 0;
                return message;
            };

            /**
             * Creates a plain object from a GetGuildFeedListRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.guild.GetGuildFeedListRequest
             * @static
             * @param {kritor.guild.GetGuildFeedListRequest} message GetGuildFeedListRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetGuildFeedListRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.guildId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.guildId = options.longs === String ? "0" : 0;
                    object.from = 0;
                }
                if (message.guildId != null && message.hasOwnProperty("guildId"))
                    if (typeof message.guildId === "number")
                        object.guildId = options.longs === String ? String(message.guildId) : message.guildId;
                    else
                        object.guildId = options.longs === String ? $util.Long.prototype.toString.call(message.guildId) : options.longs === Number ? new $util.LongBits(message.guildId.low >>> 0, message.guildId.high >>> 0).toNumber(true) : message.guildId;
                if (message.from != null && message.hasOwnProperty("from"))
                    object.from = message.from;
                return object;
            };

            /**
             * Converts this GetGuildFeedListRequest to JSON.
             * @function toJSON
             * @memberof kritor.guild.GetGuildFeedListRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetGuildFeedListRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GetGuildFeedListRequest
             * @function getTypeUrl
             * @memberof kritor.guild.GetGuildFeedListRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetGuildFeedListRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.guild.GetGuildFeedListRequest";
            };

            return GetGuildFeedListRequest;
        })();

        guild.GetGuildFeedListResponse = (function() {

            /**
             * Properties of a GetGuildFeedListResponse.
             * @memberof kritor.guild
             * @interface IGetGuildFeedListResponse
             * @property {Uint8Array|null} [data] GetGuildFeedListResponse data
             */

            /**
             * Constructs a new GetGuildFeedListResponse.
             * @memberof kritor.guild
             * @classdesc Represents a GetGuildFeedListResponse.
             * @implements IGetGuildFeedListResponse
             * @constructor
             * @param {kritor.guild.IGetGuildFeedListResponse=} [properties] Properties to set
             */
            function GetGuildFeedListResponse(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetGuildFeedListResponse data.
             * @member {Uint8Array} data
             * @memberof kritor.guild.GetGuildFeedListResponse
             * @instance
             */
            GetGuildFeedListResponse.prototype.data = $util.newBuffer([]);

            /**
             * Creates a new GetGuildFeedListResponse instance using the specified properties.
             * @function create
             * @memberof kritor.guild.GetGuildFeedListResponse
             * @static
             * @param {kritor.guild.IGetGuildFeedListResponse=} [properties] Properties to set
             * @returns {kritor.guild.GetGuildFeedListResponse} GetGuildFeedListResponse instance
             */
            GetGuildFeedListResponse.create = function create(properties) {
                return new GetGuildFeedListResponse(properties);
            };

            /**
             * Encodes the specified GetGuildFeedListResponse message. Does not implicitly {@link kritor.guild.GetGuildFeedListResponse.verify|verify} messages.
             * @function encode
             * @memberof kritor.guild.GetGuildFeedListResponse
             * @static
             * @param {kritor.guild.IGetGuildFeedListResponse} message GetGuildFeedListResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetGuildFeedListResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.data != null && Object.hasOwnProperty.call(message, "data"))
                    writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.data);
                return writer;
            };

            /**
             * Encodes the specified GetGuildFeedListResponse message, length delimited. Does not implicitly {@link kritor.guild.GetGuildFeedListResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.guild.GetGuildFeedListResponse
             * @static
             * @param {kritor.guild.IGetGuildFeedListResponse} message GetGuildFeedListResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetGuildFeedListResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetGuildFeedListResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.guild.GetGuildFeedListResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.guild.GetGuildFeedListResponse} GetGuildFeedListResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetGuildFeedListResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.guild.GetGuildFeedListResponse();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.data = reader.bytes();
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
             * Decodes a GetGuildFeedListResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.guild.GetGuildFeedListResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.guild.GetGuildFeedListResponse} GetGuildFeedListResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetGuildFeedListResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetGuildFeedListResponse message.
             * @function verify
             * @memberof kritor.guild.GetGuildFeedListResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetGuildFeedListResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.data != null && message.hasOwnProperty("data"))
                    if (!(message.data && typeof message.data.length === "number" || $util.isString(message.data)))
                        return "data: buffer expected";
                return null;
            };

            /**
             * Creates a GetGuildFeedListResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.guild.GetGuildFeedListResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.guild.GetGuildFeedListResponse} GetGuildFeedListResponse
             */
            GetGuildFeedListResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.guild.GetGuildFeedListResponse)
                    return object;
                let message = new $root.kritor.guild.GetGuildFeedListResponse();
                if (object.data != null)
                    if (typeof object.data === "string")
                        $util.base64.decode(object.data, message.data = $util.newBuffer($util.base64.length(object.data)), 0);
                    else if (object.data.length >= 0)
                        message.data = object.data;
                return message;
            };

            /**
             * Creates a plain object from a GetGuildFeedListResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.guild.GetGuildFeedListResponse
             * @static
             * @param {kritor.guild.GetGuildFeedListResponse} message GetGuildFeedListResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetGuildFeedListResponse.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults)
                    if (options.bytes === String)
                        object.data = "";
                    else {
                        object.data = [];
                        if (options.bytes !== Array)
                            object.data = $util.newBuffer(object.data);
                    }
                if (message.data != null && message.hasOwnProperty("data"))
                    object.data = options.bytes === String ? $util.base64.encode(message.data, 0, message.data.length) : options.bytes === Array ? Array.prototype.slice.call(message.data) : message.data;
                return object;
            };

            /**
             * Converts this GetGuildFeedListResponse to JSON.
             * @function toJSON
             * @memberof kritor.guild.GetGuildFeedListResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetGuildFeedListResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GetGuildFeedListResponse
             * @function getTypeUrl
             * @memberof kritor.guild.GetGuildFeedListResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetGuildFeedListResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.guild.GetGuildFeedListResponse";
            };

            return GetGuildFeedListResponse;
        })();

        guild.GetGuildRoleListRequest = (function() {

            /**
             * Properties of a GetGuildRoleListRequest.
             * @memberof kritor.guild
             * @interface IGetGuildRoleListRequest
             * @property {number|Long|null} [guildId] GetGuildRoleListRequest guildId
             */

            /**
             * Constructs a new GetGuildRoleListRequest.
             * @memberof kritor.guild
             * @classdesc Represents a GetGuildRoleListRequest.
             * @implements IGetGuildRoleListRequest
             * @constructor
             * @param {kritor.guild.IGetGuildRoleListRequest=} [properties] Properties to set
             */
            function GetGuildRoleListRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetGuildRoleListRequest guildId.
             * @member {number|Long} guildId
             * @memberof kritor.guild.GetGuildRoleListRequest
             * @instance
             */
            GetGuildRoleListRequest.prototype.guildId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * Creates a new GetGuildRoleListRequest instance using the specified properties.
             * @function create
             * @memberof kritor.guild.GetGuildRoleListRequest
             * @static
             * @param {kritor.guild.IGetGuildRoleListRequest=} [properties] Properties to set
             * @returns {kritor.guild.GetGuildRoleListRequest} GetGuildRoleListRequest instance
             */
            GetGuildRoleListRequest.create = function create(properties) {
                return new GetGuildRoleListRequest(properties);
            };

            /**
             * Encodes the specified GetGuildRoleListRequest message. Does not implicitly {@link kritor.guild.GetGuildRoleListRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.guild.GetGuildRoleListRequest
             * @static
             * @param {kritor.guild.IGetGuildRoleListRequest} message GetGuildRoleListRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetGuildRoleListRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.guildId != null && Object.hasOwnProperty.call(message, "guildId"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.guildId);
                return writer;
            };

            /**
             * Encodes the specified GetGuildRoleListRequest message, length delimited. Does not implicitly {@link kritor.guild.GetGuildRoleListRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.guild.GetGuildRoleListRequest
             * @static
             * @param {kritor.guild.IGetGuildRoleListRequest} message GetGuildRoleListRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetGuildRoleListRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetGuildRoleListRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.guild.GetGuildRoleListRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.guild.GetGuildRoleListRequest} GetGuildRoleListRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetGuildRoleListRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.guild.GetGuildRoleListRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.guildId = reader.uint64();
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
             * Decodes a GetGuildRoleListRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.guild.GetGuildRoleListRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.guild.GetGuildRoleListRequest} GetGuildRoleListRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetGuildRoleListRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetGuildRoleListRequest message.
             * @function verify
             * @memberof kritor.guild.GetGuildRoleListRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetGuildRoleListRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.guildId != null && message.hasOwnProperty("guildId"))
                    if (!$util.isInteger(message.guildId) && !(message.guildId && $util.isInteger(message.guildId.low) && $util.isInteger(message.guildId.high)))
                        return "guildId: integer|Long expected";
                return null;
            };

            /**
             * Creates a GetGuildRoleListRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.guild.GetGuildRoleListRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.guild.GetGuildRoleListRequest} GetGuildRoleListRequest
             */
            GetGuildRoleListRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.guild.GetGuildRoleListRequest)
                    return object;
                let message = new $root.kritor.guild.GetGuildRoleListRequest();
                if (object.guildId != null)
                    if ($util.Long)
                        (message.guildId = $util.Long.fromValue(object.guildId)).unsigned = true;
                    else if (typeof object.guildId === "string")
                        message.guildId = parseInt(object.guildId, 10);
                    else if (typeof object.guildId === "number")
                        message.guildId = object.guildId;
                    else if (typeof object.guildId === "object")
                        message.guildId = new $util.LongBits(object.guildId.low >>> 0, object.guildId.high >>> 0).toNumber(true);
                return message;
            };

            /**
             * Creates a plain object from a GetGuildRoleListRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.guild.GetGuildRoleListRequest
             * @static
             * @param {kritor.guild.GetGuildRoleListRequest} message GetGuildRoleListRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetGuildRoleListRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults)
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.guildId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.guildId = options.longs === String ? "0" : 0;
                if (message.guildId != null && message.hasOwnProperty("guildId"))
                    if (typeof message.guildId === "number")
                        object.guildId = options.longs === String ? String(message.guildId) : message.guildId;
                    else
                        object.guildId = options.longs === String ? $util.Long.prototype.toString.call(message.guildId) : options.longs === Number ? new $util.LongBits(message.guildId.low >>> 0, message.guildId.high >>> 0).toNumber(true) : message.guildId;
                return object;
            };

            /**
             * Converts this GetGuildRoleListRequest to JSON.
             * @function toJSON
             * @memberof kritor.guild.GetGuildRoleListRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetGuildRoleListRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GetGuildRoleListRequest
             * @function getTypeUrl
             * @memberof kritor.guild.GetGuildRoleListRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetGuildRoleListRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.guild.GetGuildRoleListRequest";
            };

            return GetGuildRoleListRequest;
        })();

        guild.GetGuildRoleListResponse = (function() {

            /**
             * Properties of a GetGuildRoleListResponse.
             * @memberof kritor.guild
             * @interface IGetGuildRoleListResponse
             * @property {Array.<kritor.guild.IRoleInfo>|null} [rolesInfo] GetGuildRoleListResponse rolesInfo
             */

            /**
             * Constructs a new GetGuildRoleListResponse.
             * @memberof kritor.guild
             * @classdesc Represents a GetGuildRoleListResponse.
             * @implements IGetGuildRoleListResponse
             * @constructor
             * @param {kritor.guild.IGetGuildRoleListResponse=} [properties] Properties to set
             */
            function GetGuildRoleListResponse(properties) {
                this.rolesInfo = [];
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetGuildRoleListResponse rolesInfo.
             * @member {Array.<kritor.guild.IRoleInfo>} rolesInfo
             * @memberof kritor.guild.GetGuildRoleListResponse
             * @instance
             */
            GetGuildRoleListResponse.prototype.rolesInfo = $util.emptyArray;

            /**
             * Creates a new GetGuildRoleListResponse instance using the specified properties.
             * @function create
             * @memberof kritor.guild.GetGuildRoleListResponse
             * @static
             * @param {kritor.guild.IGetGuildRoleListResponse=} [properties] Properties to set
             * @returns {kritor.guild.GetGuildRoleListResponse} GetGuildRoleListResponse instance
             */
            GetGuildRoleListResponse.create = function create(properties) {
                return new GetGuildRoleListResponse(properties);
            };

            /**
             * Encodes the specified GetGuildRoleListResponse message. Does not implicitly {@link kritor.guild.GetGuildRoleListResponse.verify|verify} messages.
             * @function encode
             * @memberof kritor.guild.GetGuildRoleListResponse
             * @static
             * @param {kritor.guild.IGetGuildRoleListResponse} message GetGuildRoleListResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetGuildRoleListResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.rolesInfo != null && message.rolesInfo.length)
                    for (let i = 0; i < message.rolesInfo.length; ++i)
                        $root.kritor.guild.RoleInfo.encode(message.rolesInfo[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified GetGuildRoleListResponse message, length delimited. Does not implicitly {@link kritor.guild.GetGuildRoleListResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.guild.GetGuildRoleListResponse
             * @static
             * @param {kritor.guild.IGetGuildRoleListResponse} message GetGuildRoleListResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetGuildRoleListResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetGuildRoleListResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.guild.GetGuildRoleListResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.guild.GetGuildRoleListResponse} GetGuildRoleListResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetGuildRoleListResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.guild.GetGuildRoleListResponse();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            if (!(message.rolesInfo && message.rolesInfo.length))
                                message.rolesInfo = [];
                            message.rolesInfo.push($root.kritor.guild.RoleInfo.decode(reader, reader.uint32()));
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
             * Decodes a GetGuildRoleListResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.guild.GetGuildRoleListResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.guild.GetGuildRoleListResponse} GetGuildRoleListResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetGuildRoleListResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetGuildRoleListResponse message.
             * @function verify
             * @memberof kritor.guild.GetGuildRoleListResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetGuildRoleListResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.rolesInfo != null && message.hasOwnProperty("rolesInfo")) {
                    if (!Array.isArray(message.rolesInfo))
                        return "rolesInfo: array expected";
                    for (let i = 0; i < message.rolesInfo.length; ++i) {
                        let error = $root.kritor.guild.RoleInfo.verify(message.rolesInfo[i]);
                        if (error)
                            return "rolesInfo." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a GetGuildRoleListResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.guild.GetGuildRoleListResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.guild.GetGuildRoleListResponse} GetGuildRoleListResponse
             */
            GetGuildRoleListResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.guild.GetGuildRoleListResponse)
                    return object;
                let message = new $root.kritor.guild.GetGuildRoleListResponse();
                if (object.rolesInfo) {
                    if (!Array.isArray(object.rolesInfo))
                        throw TypeError(".kritor.guild.GetGuildRoleListResponse.rolesInfo: array expected");
                    message.rolesInfo = [];
                    for (let i = 0; i < object.rolesInfo.length; ++i) {
                        if (typeof object.rolesInfo[i] !== "object")
                            throw TypeError(".kritor.guild.GetGuildRoleListResponse.rolesInfo: object expected");
                        message.rolesInfo[i] = $root.kritor.guild.RoleInfo.fromObject(object.rolesInfo[i]);
                    }
                }
                return message;
            };

            /**
             * Creates a plain object from a GetGuildRoleListResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.guild.GetGuildRoleListResponse
             * @static
             * @param {kritor.guild.GetGuildRoleListResponse} message GetGuildRoleListResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetGuildRoleListResponse.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.arrays || options.defaults)
                    object.rolesInfo = [];
                if (message.rolesInfo && message.rolesInfo.length) {
                    object.rolesInfo = [];
                    for (let j = 0; j < message.rolesInfo.length; ++j)
                        object.rolesInfo[j] = $root.kritor.guild.RoleInfo.toObject(message.rolesInfo[j], options);
                }
                return object;
            };

            /**
             * Converts this GetGuildRoleListResponse to JSON.
             * @function toJSON
             * @memberof kritor.guild.GetGuildRoleListResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetGuildRoleListResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GetGuildRoleListResponse
             * @function getTypeUrl
             * @memberof kritor.guild.GetGuildRoleListResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetGuildRoleListResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.guild.GetGuildRoleListResponse";
            };

            return GetGuildRoleListResponse;
        })();

        guild.DeleteGuildRoleRequest = (function() {

            /**
             * Properties of a DeleteGuildRoleRequest.
             * @memberof kritor.guild
             * @interface IDeleteGuildRoleRequest
             * @property {number|Long|null} [guildId] DeleteGuildRoleRequest guildId
             * @property {number|Long|null} [roleId] DeleteGuildRoleRequest roleId
             */

            /**
             * Constructs a new DeleteGuildRoleRequest.
             * @memberof kritor.guild
             * @classdesc Represents a DeleteGuildRoleRequest.
             * @implements IDeleteGuildRoleRequest
             * @constructor
             * @param {kritor.guild.IDeleteGuildRoleRequest=} [properties] Properties to set
             */
            function DeleteGuildRoleRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * DeleteGuildRoleRequest guildId.
             * @member {number|Long} guildId
             * @memberof kritor.guild.DeleteGuildRoleRequest
             * @instance
             */
            DeleteGuildRoleRequest.prototype.guildId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * DeleteGuildRoleRequest roleId.
             * @member {number|Long} roleId
             * @memberof kritor.guild.DeleteGuildRoleRequest
             * @instance
             */
            DeleteGuildRoleRequest.prototype.roleId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * Creates a new DeleteGuildRoleRequest instance using the specified properties.
             * @function create
             * @memberof kritor.guild.DeleteGuildRoleRequest
             * @static
             * @param {kritor.guild.IDeleteGuildRoleRequest=} [properties] Properties to set
             * @returns {kritor.guild.DeleteGuildRoleRequest} DeleteGuildRoleRequest instance
             */
            DeleteGuildRoleRequest.create = function create(properties) {
                return new DeleteGuildRoleRequest(properties);
            };

            /**
             * Encodes the specified DeleteGuildRoleRequest message. Does not implicitly {@link kritor.guild.DeleteGuildRoleRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.guild.DeleteGuildRoleRequest
             * @static
             * @param {kritor.guild.IDeleteGuildRoleRequest} message DeleteGuildRoleRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DeleteGuildRoleRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.guildId != null && Object.hasOwnProperty.call(message, "guildId"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.guildId);
                if (message.roleId != null && Object.hasOwnProperty.call(message, "roleId"))
                    writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.roleId);
                return writer;
            };

            /**
             * Encodes the specified DeleteGuildRoleRequest message, length delimited. Does not implicitly {@link kritor.guild.DeleteGuildRoleRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.guild.DeleteGuildRoleRequest
             * @static
             * @param {kritor.guild.IDeleteGuildRoleRequest} message DeleteGuildRoleRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DeleteGuildRoleRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a DeleteGuildRoleRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.guild.DeleteGuildRoleRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.guild.DeleteGuildRoleRequest} DeleteGuildRoleRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DeleteGuildRoleRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.guild.DeleteGuildRoleRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.guildId = reader.uint64();
                            break;
                        }
                    case 2: {
                            message.roleId = reader.uint64();
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
             * Decodes a DeleteGuildRoleRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.guild.DeleteGuildRoleRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.guild.DeleteGuildRoleRequest} DeleteGuildRoleRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DeleteGuildRoleRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a DeleteGuildRoleRequest message.
             * @function verify
             * @memberof kritor.guild.DeleteGuildRoleRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            DeleteGuildRoleRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.guildId != null && message.hasOwnProperty("guildId"))
                    if (!$util.isInteger(message.guildId) && !(message.guildId && $util.isInteger(message.guildId.low) && $util.isInteger(message.guildId.high)))
                        return "guildId: integer|Long expected";
                if (message.roleId != null && message.hasOwnProperty("roleId"))
                    if (!$util.isInteger(message.roleId) && !(message.roleId && $util.isInteger(message.roleId.low) && $util.isInteger(message.roleId.high)))
                        return "roleId: integer|Long expected";
                return null;
            };

            /**
             * Creates a DeleteGuildRoleRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.guild.DeleteGuildRoleRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.guild.DeleteGuildRoleRequest} DeleteGuildRoleRequest
             */
            DeleteGuildRoleRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.guild.DeleteGuildRoleRequest)
                    return object;
                let message = new $root.kritor.guild.DeleteGuildRoleRequest();
                if (object.guildId != null)
                    if ($util.Long)
                        (message.guildId = $util.Long.fromValue(object.guildId)).unsigned = true;
                    else if (typeof object.guildId === "string")
                        message.guildId = parseInt(object.guildId, 10);
                    else if (typeof object.guildId === "number")
                        message.guildId = object.guildId;
                    else if (typeof object.guildId === "object")
                        message.guildId = new $util.LongBits(object.guildId.low >>> 0, object.guildId.high >>> 0).toNumber(true);
                if (object.roleId != null)
                    if ($util.Long)
                        (message.roleId = $util.Long.fromValue(object.roleId)).unsigned = true;
                    else if (typeof object.roleId === "string")
                        message.roleId = parseInt(object.roleId, 10);
                    else if (typeof object.roleId === "number")
                        message.roleId = object.roleId;
                    else if (typeof object.roleId === "object")
                        message.roleId = new $util.LongBits(object.roleId.low >>> 0, object.roleId.high >>> 0).toNumber(true);
                return message;
            };

            /**
             * Creates a plain object from a DeleteGuildRoleRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.guild.DeleteGuildRoleRequest
             * @static
             * @param {kritor.guild.DeleteGuildRoleRequest} message DeleteGuildRoleRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            DeleteGuildRoleRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.guildId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.guildId = options.longs === String ? "0" : 0;
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.roleId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.roleId = options.longs === String ? "0" : 0;
                }
                if (message.guildId != null && message.hasOwnProperty("guildId"))
                    if (typeof message.guildId === "number")
                        object.guildId = options.longs === String ? String(message.guildId) : message.guildId;
                    else
                        object.guildId = options.longs === String ? $util.Long.prototype.toString.call(message.guildId) : options.longs === Number ? new $util.LongBits(message.guildId.low >>> 0, message.guildId.high >>> 0).toNumber(true) : message.guildId;
                if (message.roleId != null && message.hasOwnProperty("roleId"))
                    if (typeof message.roleId === "number")
                        object.roleId = options.longs === String ? String(message.roleId) : message.roleId;
                    else
                        object.roleId = options.longs === String ? $util.Long.prototype.toString.call(message.roleId) : options.longs === Number ? new $util.LongBits(message.roleId.low >>> 0, message.roleId.high >>> 0).toNumber(true) : message.roleId;
                return object;
            };

            /**
             * Converts this DeleteGuildRoleRequest to JSON.
             * @function toJSON
             * @memberof kritor.guild.DeleteGuildRoleRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            DeleteGuildRoleRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for DeleteGuildRoleRequest
             * @function getTypeUrl
             * @memberof kritor.guild.DeleteGuildRoleRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            DeleteGuildRoleRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.guild.DeleteGuildRoleRequest";
            };

            return DeleteGuildRoleRequest;
        })();

        guild.DeleteGuildRoleResponse = (function() {

            /**
             * Properties of a DeleteGuildRoleResponse.
             * @memberof kritor.guild
             * @interface IDeleteGuildRoleResponse
             */

            /**
             * Constructs a new DeleteGuildRoleResponse.
             * @memberof kritor.guild
             * @classdesc Represents a DeleteGuildRoleResponse.
             * @implements IDeleteGuildRoleResponse
             * @constructor
             * @param {kritor.guild.IDeleteGuildRoleResponse=} [properties] Properties to set
             */
            function DeleteGuildRoleResponse(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Creates a new DeleteGuildRoleResponse instance using the specified properties.
             * @function create
             * @memberof kritor.guild.DeleteGuildRoleResponse
             * @static
             * @param {kritor.guild.IDeleteGuildRoleResponse=} [properties] Properties to set
             * @returns {kritor.guild.DeleteGuildRoleResponse} DeleteGuildRoleResponse instance
             */
            DeleteGuildRoleResponse.create = function create(properties) {
                return new DeleteGuildRoleResponse(properties);
            };

            /**
             * Encodes the specified DeleteGuildRoleResponse message. Does not implicitly {@link kritor.guild.DeleteGuildRoleResponse.verify|verify} messages.
             * @function encode
             * @memberof kritor.guild.DeleteGuildRoleResponse
             * @static
             * @param {kritor.guild.IDeleteGuildRoleResponse} message DeleteGuildRoleResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DeleteGuildRoleResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                return writer;
            };

            /**
             * Encodes the specified DeleteGuildRoleResponse message, length delimited. Does not implicitly {@link kritor.guild.DeleteGuildRoleResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.guild.DeleteGuildRoleResponse
             * @static
             * @param {kritor.guild.IDeleteGuildRoleResponse} message DeleteGuildRoleResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DeleteGuildRoleResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a DeleteGuildRoleResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.guild.DeleteGuildRoleResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.guild.DeleteGuildRoleResponse} DeleteGuildRoleResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DeleteGuildRoleResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.guild.DeleteGuildRoleResponse();
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
             * Decodes a DeleteGuildRoleResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.guild.DeleteGuildRoleResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.guild.DeleteGuildRoleResponse} DeleteGuildRoleResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DeleteGuildRoleResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a DeleteGuildRoleResponse message.
             * @function verify
             * @memberof kritor.guild.DeleteGuildRoleResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            DeleteGuildRoleResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                return null;
            };

            /**
             * Creates a DeleteGuildRoleResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.guild.DeleteGuildRoleResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.guild.DeleteGuildRoleResponse} DeleteGuildRoleResponse
             */
            DeleteGuildRoleResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.guild.DeleteGuildRoleResponse)
                    return object;
                return new $root.kritor.guild.DeleteGuildRoleResponse();
            };

            /**
             * Creates a plain object from a DeleteGuildRoleResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.guild.DeleteGuildRoleResponse
             * @static
             * @param {kritor.guild.DeleteGuildRoleResponse} message DeleteGuildRoleResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            DeleteGuildRoleResponse.toObject = function toObject() {
                return {};
            };

            /**
             * Converts this DeleteGuildRoleResponse to JSON.
             * @function toJSON
             * @memberof kritor.guild.DeleteGuildRoleResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            DeleteGuildRoleResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for DeleteGuildRoleResponse
             * @function getTypeUrl
             * @memberof kritor.guild.DeleteGuildRoleResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            DeleteGuildRoleResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.guild.DeleteGuildRoleResponse";
            };

            return DeleteGuildRoleResponse;
        })();

        guild.SetGuildMemberRoleRequest = (function() {

            /**
             * Properties of a SetGuildMemberRoleRequest.
             * @memberof kritor.guild
             * @interface ISetGuildMemberRoleRequest
             * @property {number|Long|null} [guildId] SetGuildMemberRoleRequest guildId
             * @property {number|Long|null} [roleId] SetGuildMemberRoleRequest roleId
             * @property {boolean|null} [set] SetGuildMemberRoleRequest set
             * @property {Array.<string>|null} [tinyIds] SetGuildMemberRoleRequest tinyIds
             */

            /**
             * Constructs a new SetGuildMemberRoleRequest.
             * @memberof kritor.guild
             * @classdesc Represents a SetGuildMemberRoleRequest.
             * @implements ISetGuildMemberRoleRequest
             * @constructor
             * @param {kritor.guild.ISetGuildMemberRoleRequest=} [properties] Properties to set
             */
            function SetGuildMemberRoleRequest(properties) {
                this.tinyIds = [];
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * SetGuildMemberRoleRequest guildId.
             * @member {number|Long} guildId
             * @memberof kritor.guild.SetGuildMemberRoleRequest
             * @instance
             */
            SetGuildMemberRoleRequest.prototype.guildId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * SetGuildMemberRoleRequest roleId.
             * @member {number|Long} roleId
             * @memberof kritor.guild.SetGuildMemberRoleRequest
             * @instance
             */
            SetGuildMemberRoleRequest.prototype.roleId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * SetGuildMemberRoleRequest set.
             * @member {boolean} set
             * @memberof kritor.guild.SetGuildMemberRoleRequest
             * @instance
             */
            SetGuildMemberRoleRequest.prototype.set = false;

            /**
             * SetGuildMemberRoleRequest tinyIds.
             * @member {Array.<string>} tinyIds
             * @memberof kritor.guild.SetGuildMemberRoleRequest
             * @instance
             */
            SetGuildMemberRoleRequest.prototype.tinyIds = $util.emptyArray;

            /**
             * Creates a new SetGuildMemberRoleRequest instance using the specified properties.
             * @function create
             * @memberof kritor.guild.SetGuildMemberRoleRequest
             * @static
             * @param {kritor.guild.ISetGuildMemberRoleRequest=} [properties] Properties to set
             * @returns {kritor.guild.SetGuildMemberRoleRequest} SetGuildMemberRoleRequest instance
             */
            SetGuildMemberRoleRequest.create = function create(properties) {
                return new SetGuildMemberRoleRequest(properties);
            };

            /**
             * Encodes the specified SetGuildMemberRoleRequest message. Does not implicitly {@link kritor.guild.SetGuildMemberRoleRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.guild.SetGuildMemberRoleRequest
             * @static
             * @param {kritor.guild.ISetGuildMemberRoleRequest} message SetGuildMemberRoleRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SetGuildMemberRoleRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.guildId != null && Object.hasOwnProperty.call(message, "guildId"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.guildId);
                if (message.roleId != null && Object.hasOwnProperty.call(message, "roleId"))
                    writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.roleId);
                if (message.set != null && Object.hasOwnProperty.call(message, "set"))
                    writer.uint32(/* id 3, wireType 0 =*/24).bool(message.set);
                if (message.tinyIds != null && message.tinyIds.length)
                    for (let i = 0; i < message.tinyIds.length; ++i)
                        writer.uint32(/* id 4, wireType 2 =*/34).string(message.tinyIds[i]);
                return writer;
            };

            /**
             * Encodes the specified SetGuildMemberRoleRequest message, length delimited. Does not implicitly {@link kritor.guild.SetGuildMemberRoleRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.guild.SetGuildMemberRoleRequest
             * @static
             * @param {kritor.guild.ISetGuildMemberRoleRequest} message SetGuildMemberRoleRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SetGuildMemberRoleRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a SetGuildMemberRoleRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.guild.SetGuildMemberRoleRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.guild.SetGuildMemberRoleRequest} SetGuildMemberRoleRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SetGuildMemberRoleRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.guild.SetGuildMemberRoleRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.guildId = reader.uint64();
                            break;
                        }
                    case 2: {
                            message.roleId = reader.uint64();
                            break;
                        }
                    case 3: {
                            message.set = reader.bool();
                            break;
                        }
                    case 4: {
                            if (!(message.tinyIds && message.tinyIds.length))
                                message.tinyIds = [];
                            message.tinyIds.push(reader.string());
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
             * Decodes a SetGuildMemberRoleRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.guild.SetGuildMemberRoleRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.guild.SetGuildMemberRoleRequest} SetGuildMemberRoleRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SetGuildMemberRoleRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a SetGuildMemberRoleRequest message.
             * @function verify
             * @memberof kritor.guild.SetGuildMemberRoleRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            SetGuildMemberRoleRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.guildId != null && message.hasOwnProperty("guildId"))
                    if (!$util.isInteger(message.guildId) && !(message.guildId && $util.isInteger(message.guildId.low) && $util.isInteger(message.guildId.high)))
                        return "guildId: integer|Long expected";
                if (message.roleId != null && message.hasOwnProperty("roleId"))
                    if (!$util.isInteger(message.roleId) && !(message.roleId && $util.isInteger(message.roleId.low) && $util.isInteger(message.roleId.high)))
                        return "roleId: integer|Long expected";
                if (message.set != null && message.hasOwnProperty("set"))
                    if (typeof message.set !== "boolean")
                        return "set: boolean expected";
                if (message.tinyIds != null && message.hasOwnProperty("tinyIds")) {
                    if (!Array.isArray(message.tinyIds))
                        return "tinyIds: array expected";
                    for (let i = 0; i < message.tinyIds.length; ++i)
                        if (!$util.isString(message.tinyIds[i]))
                            return "tinyIds: string[] expected";
                }
                return null;
            };

            /**
             * Creates a SetGuildMemberRoleRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.guild.SetGuildMemberRoleRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.guild.SetGuildMemberRoleRequest} SetGuildMemberRoleRequest
             */
            SetGuildMemberRoleRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.guild.SetGuildMemberRoleRequest)
                    return object;
                let message = new $root.kritor.guild.SetGuildMemberRoleRequest();
                if (object.guildId != null)
                    if ($util.Long)
                        (message.guildId = $util.Long.fromValue(object.guildId)).unsigned = true;
                    else if (typeof object.guildId === "string")
                        message.guildId = parseInt(object.guildId, 10);
                    else if (typeof object.guildId === "number")
                        message.guildId = object.guildId;
                    else if (typeof object.guildId === "object")
                        message.guildId = new $util.LongBits(object.guildId.low >>> 0, object.guildId.high >>> 0).toNumber(true);
                if (object.roleId != null)
                    if ($util.Long)
                        (message.roleId = $util.Long.fromValue(object.roleId)).unsigned = true;
                    else if (typeof object.roleId === "string")
                        message.roleId = parseInt(object.roleId, 10);
                    else if (typeof object.roleId === "number")
                        message.roleId = object.roleId;
                    else if (typeof object.roleId === "object")
                        message.roleId = new $util.LongBits(object.roleId.low >>> 0, object.roleId.high >>> 0).toNumber(true);
                if (object.set != null)
                    message.set = Boolean(object.set);
                if (object.tinyIds) {
                    if (!Array.isArray(object.tinyIds))
                        throw TypeError(".kritor.guild.SetGuildMemberRoleRequest.tinyIds: array expected");
                    message.tinyIds = [];
                    for (let i = 0; i < object.tinyIds.length; ++i)
                        message.tinyIds[i] = String(object.tinyIds[i]);
                }
                return message;
            };

            /**
             * Creates a plain object from a SetGuildMemberRoleRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.guild.SetGuildMemberRoleRequest
             * @static
             * @param {kritor.guild.SetGuildMemberRoleRequest} message SetGuildMemberRoleRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            SetGuildMemberRoleRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.arrays || options.defaults)
                    object.tinyIds = [];
                if (options.defaults) {
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.guildId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.guildId = options.longs === String ? "0" : 0;
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.roleId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.roleId = options.longs === String ? "0" : 0;
                    object.set = false;
                }
                if (message.guildId != null && message.hasOwnProperty("guildId"))
                    if (typeof message.guildId === "number")
                        object.guildId = options.longs === String ? String(message.guildId) : message.guildId;
                    else
                        object.guildId = options.longs === String ? $util.Long.prototype.toString.call(message.guildId) : options.longs === Number ? new $util.LongBits(message.guildId.low >>> 0, message.guildId.high >>> 0).toNumber(true) : message.guildId;
                if (message.roleId != null && message.hasOwnProperty("roleId"))
                    if (typeof message.roleId === "number")
                        object.roleId = options.longs === String ? String(message.roleId) : message.roleId;
                    else
                        object.roleId = options.longs === String ? $util.Long.prototype.toString.call(message.roleId) : options.longs === Number ? new $util.LongBits(message.roleId.low >>> 0, message.roleId.high >>> 0).toNumber(true) : message.roleId;
                if (message.set != null && message.hasOwnProperty("set"))
                    object.set = message.set;
                if (message.tinyIds && message.tinyIds.length) {
                    object.tinyIds = [];
                    for (let j = 0; j < message.tinyIds.length; ++j)
                        object.tinyIds[j] = message.tinyIds[j];
                }
                return object;
            };

            /**
             * Converts this SetGuildMemberRoleRequest to JSON.
             * @function toJSON
             * @memberof kritor.guild.SetGuildMemberRoleRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            SetGuildMemberRoleRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for SetGuildMemberRoleRequest
             * @function getTypeUrl
             * @memberof kritor.guild.SetGuildMemberRoleRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            SetGuildMemberRoleRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.guild.SetGuildMemberRoleRequest";
            };

            return SetGuildMemberRoleRequest;
        })();

        guild.SetGuildMemberRoleResponse = (function() {

            /**
             * Properties of a SetGuildMemberRoleResponse.
             * @memberof kritor.guild
             * @interface ISetGuildMemberRoleResponse
             */

            /**
             * Constructs a new SetGuildMemberRoleResponse.
             * @memberof kritor.guild
             * @classdesc Represents a SetGuildMemberRoleResponse.
             * @implements ISetGuildMemberRoleResponse
             * @constructor
             * @param {kritor.guild.ISetGuildMemberRoleResponse=} [properties] Properties to set
             */
            function SetGuildMemberRoleResponse(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Creates a new SetGuildMemberRoleResponse instance using the specified properties.
             * @function create
             * @memberof kritor.guild.SetGuildMemberRoleResponse
             * @static
             * @param {kritor.guild.ISetGuildMemberRoleResponse=} [properties] Properties to set
             * @returns {kritor.guild.SetGuildMemberRoleResponse} SetGuildMemberRoleResponse instance
             */
            SetGuildMemberRoleResponse.create = function create(properties) {
                return new SetGuildMemberRoleResponse(properties);
            };

            /**
             * Encodes the specified SetGuildMemberRoleResponse message. Does not implicitly {@link kritor.guild.SetGuildMemberRoleResponse.verify|verify} messages.
             * @function encode
             * @memberof kritor.guild.SetGuildMemberRoleResponse
             * @static
             * @param {kritor.guild.ISetGuildMemberRoleResponse} message SetGuildMemberRoleResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SetGuildMemberRoleResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                return writer;
            };

            /**
             * Encodes the specified SetGuildMemberRoleResponse message, length delimited. Does not implicitly {@link kritor.guild.SetGuildMemberRoleResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.guild.SetGuildMemberRoleResponse
             * @static
             * @param {kritor.guild.ISetGuildMemberRoleResponse} message SetGuildMemberRoleResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SetGuildMemberRoleResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a SetGuildMemberRoleResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.guild.SetGuildMemberRoleResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.guild.SetGuildMemberRoleResponse} SetGuildMemberRoleResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SetGuildMemberRoleResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.guild.SetGuildMemberRoleResponse();
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
             * Decodes a SetGuildMemberRoleResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.guild.SetGuildMemberRoleResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.guild.SetGuildMemberRoleResponse} SetGuildMemberRoleResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SetGuildMemberRoleResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a SetGuildMemberRoleResponse message.
             * @function verify
             * @memberof kritor.guild.SetGuildMemberRoleResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            SetGuildMemberRoleResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                return null;
            };

            /**
             * Creates a SetGuildMemberRoleResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.guild.SetGuildMemberRoleResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.guild.SetGuildMemberRoleResponse} SetGuildMemberRoleResponse
             */
            SetGuildMemberRoleResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.guild.SetGuildMemberRoleResponse)
                    return object;
                return new $root.kritor.guild.SetGuildMemberRoleResponse();
            };

            /**
             * Creates a plain object from a SetGuildMemberRoleResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.guild.SetGuildMemberRoleResponse
             * @static
             * @param {kritor.guild.SetGuildMemberRoleResponse} message SetGuildMemberRoleResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            SetGuildMemberRoleResponse.toObject = function toObject() {
                return {};
            };

            /**
             * Converts this SetGuildMemberRoleResponse to JSON.
             * @function toJSON
             * @memberof kritor.guild.SetGuildMemberRoleResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            SetGuildMemberRoleResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for SetGuildMemberRoleResponse
             * @function getTypeUrl
             * @memberof kritor.guild.SetGuildMemberRoleResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            SetGuildMemberRoleResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.guild.SetGuildMemberRoleResponse";
            };

            return SetGuildMemberRoleResponse;
        })();

        guild.UpdateGuildRoleRequest = (function() {

            /**
             * Properties of an UpdateGuildRoleRequest.
             * @memberof kritor.guild
             * @interface IUpdateGuildRoleRequest
             * @property {number|Long|null} [guildId] UpdateGuildRoleRequest guildId
             * @property {number|Long|null} [roleId] UpdateGuildRoleRequest roleId
             * @property {string|null} [name] UpdateGuildRoleRequest name
             * @property {number|Long|null} [color] UpdateGuildRoleRequest color
             */

            /**
             * Constructs a new UpdateGuildRoleRequest.
             * @memberof kritor.guild
             * @classdesc Represents an UpdateGuildRoleRequest.
             * @implements IUpdateGuildRoleRequest
             * @constructor
             * @param {kritor.guild.IUpdateGuildRoleRequest=} [properties] Properties to set
             */
            function UpdateGuildRoleRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * UpdateGuildRoleRequest guildId.
             * @member {number|Long} guildId
             * @memberof kritor.guild.UpdateGuildRoleRequest
             * @instance
             */
            UpdateGuildRoleRequest.prototype.guildId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * UpdateGuildRoleRequest roleId.
             * @member {number|Long} roleId
             * @memberof kritor.guild.UpdateGuildRoleRequest
             * @instance
             */
            UpdateGuildRoleRequest.prototype.roleId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * UpdateGuildRoleRequest name.
             * @member {string} name
             * @memberof kritor.guild.UpdateGuildRoleRequest
             * @instance
             */
            UpdateGuildRoleRequest.prototype.name = "";

            /**
             * UpdateGuildRoleRequest color.
             * @member {number|Long} color
             * @memberof kritor.guild.UpdateGuildRoleRequest
             * @instance
             */
            UpdateGuildRoleRequest.prototype.color = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

            /**
             * Creates a new UpdateGuildRoleRequest instance using the specified properties.
             * @function create
             * @memberof kritor.guild.UpdateGuildRoleRequest
             * @static
             * @param {kritor.guild.IUpdateGuildRoleRequest=} [properties] Properties to set
             * @returns {kritor.guild.UpdateGuildRoleRequest} UpdateGuildRoleRequest instance
             */
            UpdateGuildRoleRequest.create = function create(properties) {
                return new UpdateGuildRoleRequest(properties);
            };

            /**
             * Encodes the specified UpdateGuildRoleRequest message. Does not implicitly {@link kritor.guild.UpdateGuildRoleRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.guild.UpdateGuildRoleRequest
             * @static
             * @param {kritor.guild.IUpdateGuildRoleRequest} message UpdateGuildRoleRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            UpdateGuildRoleRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.guildId != null && Object.hasOwnProperty.call(message, "guildId"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.guildId);
                if (message.roleId != null && Object.hasOwnProperty.call(message, "roleId"))
                    writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.roleId);
                if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.name);
                if (message.color != null && Object.hasOwnProperty.call(message, "color"))
                    writer.uint32(/* id 4, wireType 0 =*/32).int64(message.color);
                return writer;
            };

            /**
             * Encodes the specified UpdateGuildRoleRequest message, length delimited. Does not implicitly {@link kritor.guild.UpdateGuildRoleRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.guild.UpdateGuildRoleRequest
             * @static
             * @param {kritor.guild.IUpdateGuildRoleRequest} message UpdateGuildRoleRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            UpdateGuildRoleRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an UpdateGuildRoleRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.guild.UpdateGuildRoleRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.guild.UpdateGuildRoleRequest} UpdateGuildRoleRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            UpdateGuildRoleRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.guild.UpdateGuildRoleRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.guildId = reader.uint64();
                            break;
                        }
                    case 2: {
                            message.roleId = reader.uint64();
                            break;
                        }
                    case 3: {
                            message.name = reader.string();
                            break;
                        }
                    case 4: {
                            message.color = reader.int64();
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
             * Decodes an UpdateGuildRoleRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.guild.UpdateGuildRoleRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.guild.UpdateGuildRoleRequest} UpdateGuildRoleRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            UpdateGuildRoleRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an UpdateGuildRoleRequest message.
             * @function verify
             * @memberof kritor.guild.UpdateGuildRoleRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            UpdateGuildRoleRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.guildId != null && message.hasOwnProperty("guildId"))
                    if (!$util.isInteger(message.guildId) && !(message.guildId && $util.isInteger(message.guildId.low) && $util.isInteger(message.guildId.high)))
                        return "guildId: integer|Long expected";
                if (message.roleId != null && message.hasOwnProperty("roleId"))
                    if (!$util.isInteger(message.roleId) && !(message.roleId && $util.isInteger(message.roleId.low) && $util.isInteger(message.roleId.high)))
                        return "roleId: integer|Long expected";
                if (message.name != null && message.hasOwnProperty("name"))
                    if (!$util.isString(message.name))
                        return "name: string expected";
                if (message.color != null && message.hasOwnProperty("color"))
                    if (!$util.isInteger(message.color) && !(message.color && $util.isInteger(message.color.low) && $util.isInteger(message.color.high)))
                        return "color: integer|Long expected";
                return null;
            };

            /**
             * Creates an UpdateGuildRoleRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.guild.UpdateGuildRoleRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.guild.UpdateGuildRoleRequest} UpdateGuildRoleRequest
             */
            UpdateGuildRoleRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.guild.UpdateGuildRoleRequest)
                    return object;
                let message = new $root.kritor.guild.UpdateGuildRoleRequest();
                if (object.guildId != null)
                    if ($util.Long)
                        (message.guildId = $util.Long.fromValue(object.guildId)).unsigned = true;
                    else if (typeof object.guildId === "string")
                        message.guildId = parseInt(object.guildId, 10);
                    else if (typeof object.guildId === "number")
                        message.guildId = object.guildId;
                    else if (typeof object.guildId === "object")
                        message.guildId = new $util.LongBits(object.guildId.low >>> 0, object.guildId.high >>> 0).toNumber(true);
                if (object.roleId != null)
                    if ($util.Long)
                        (message.roleId = $util.Long.fromValue(object.roleId)).unsigned = true;
                    else if (typeof object.roleId === "string")
                        message.roleId = parseInt(object.roleId, 10);
                    else if (typeof object.roleId === "number")
                        message.roleId = object.roleId;
                    else if (typeof object.roleId === "object")
                        message.roleId = new $util.LongBits(object.roleId.low >>> 0, object.roleId.high >>> 0).toNumber(true);
                if (object.name != null)
                    message.name = String(object.name);
                if (object.color != null)
                    if ($util.Long)
                        (message.color = $util.Long.fromValue(object.color)).unsigned = false;
                    else if (typeof object.color === "string")
                        message.color = parseInt(object.color, 10);
                    else if (typeof object.color === "number")
                        message.color = object.color;
                    else if (typeof object.color === "object")
                        message.color = new $util.LongBits(object.color.low >>> 0, object.color.high >>> 0).toNumber();
                return message;
            };

            /**
             * Creates a plain object from an UpdateGuildRoleRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.guild.UpdateGuildRoleRequest
             * @static
             * @param {kritor.guild.UpdateGuildRoleRequest} message UpdateGuildRoleRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            UpdateGuildRoleRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.guildId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.guildId = options.longs === String ? "0" : 0;
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.roleId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.roleId = options.longs === String ? "0" : 0;
                    object.name = "";
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, false);
                        object.color = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.color = options.longs === String ? "0" : 0;
                }
                if (message.guildId != null && message.hasOwnProperty("guildId"))
                    if (typeof message.guildId === "number")
                        object.guildId = options.longs === String ? String(message.guildId) : message.guildId;
                    else
                        object.guildId = options.longs === String ? $util.Long.prototype.toString.call(message.guildId) : options.longs === Number ? new $util.LongBits(message.guildId.low >>> 0, message.guildId.high >>> 0).toNumber(true) : message.guildId;
                if (message.roleId != null && message.hasOwnProperty("roleId"))
                    if (typeof message.roleId === "number")
                        object.roleId = options.longs === String ? String(message.roleId) : message.roleId;
                    else
                        object.roleId = options.longs === String ? $util.Long.prototype.toString.call(message.roleId) : options.longs === Number ? new $util.LongBits(message.roleId.low >>> 0, message.roleId.high >>> 0).toNumber(true) : message.roleId;
                if (message.name != null && message.hasOwnProperty("name"))
                    object.name = message.name;
                if (message.color != null && message.hasOwnProperty("color"))
                    if (typeof message.color === "number")
                        object.color = options.longs === String ? String(message.color) : message.color;
                    else
                        object.color = options.longs === String ? $util.Long.prototype.toString.call(message.color) : options.longs === Number ? new $util.LongBits(message.color.low >>> 0, message.color.high >>> 0).toNumber() : message.color;
                return object;
            };

            /**
             * Converts this UpdateGuildRoleRequest to JSON.
             * @function toJSON
             * @memberof kritor.guild.UpdateGuildRoleRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            UpdateGuildRoleRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for UpdateGuildRoleRequest
             * @function getTypeUrl
             * @memberof kritor.guild.UpdateGuildRoleRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            UpdateGuildRoleRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.guild.UpdateGuildRoleRequest";
            };

            return UpdateGuildRoleRequest;
        })();

        guild.UpdateGuildRoleResponse = (function() {

            /**
             * Properties of an UpdateGuildRoleResponse.
             * @memberof kritor.guild
             * @interface IUpdateGuildRoleResponse
             */

            /**
             * Constructs a new UpdateGuildRoleResponse.
             * @memberof kritor.guild
             * @classdesc Represents an UpdateGuildRoleResponse.
             * @implements IUpdateGuildRoleResponse
             * @constructor
             * @param {kritor.guild.IUpdateGuildRoleResponse=} [properties] Properties to set
             */
            function UpdateGuildRoleResponse(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Creates a new UpdateGuildRoleResponse instance using the specified properties.
             * @function create
             * @memberof kritor.guild.UpdateGuildRoleResponse
             * @static
             * @param {kritor.guild.IUpdateGuildRoleResponse=} [properties] Properties to set
             * @returns {kritor.guild.UpdateGuildRoleResponse} UpdateGuildRoleResponse instance
             */
            UpdateGuildRoleResponse.create = function create(properties) {
                return new UpdateGuildRoleResponse(properties);
            };

            /**
             * Encodes the specified UpdateGuildRoleResponse message. Does not implicitly {@link kritor.guild.UpdateGuildRoleResponse.verify|verify} messages.
             * @function encode
             * @memberof kritor.guild.UpdateGuildRoleResponse
             * @static
             * @param {kritor.guild.IUpdateGuildRoleResponse} message UpdateGuildRoleResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            UpdateGuildRoleResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                return writer;
            };

            /**
             * Encodes the specified UpdateGuildRoleResponse message, length delimited. Does not implicitly {@link kritor.guild.UpdateGuildRoleResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.guild.UpdateGuildRoleResponse
             * @static
             * @param {kritor.guild.IUpdateGuildRoleResponse} message UpdateGuildRoleResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            UpdateGuildRoleResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an UpdateGuildRoleResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.guild.UpdateGuildRoleResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.guild.UpdateGuildRoleResponse} UpdateGuildRoleResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            UpdateGuildRoleResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.guild.UpdateGuildRoleResponse();
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
             * Decodes an UpdateGuildRoleResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.guild.UpdateGuildRoleResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.guild.UpdateGuildRoleResponse} UpdateGuildRoleResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            UpdateGuildRoleResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an UpdateGuildRoleResponse message.
             * @function verify
             * @memberof kritor.guild.UpdateGuildRoleResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            UpdateGuildRoleResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                return null;
            };

            /**
             * Creates an UpdateGuildRoleResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.guild.UpdateGuildRoleResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.guild.UpdateGuildRoleResponse} UpdateGuildRoleResponse
             */
            UpdateGuildRoleResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.guild.UpdateGuildRoleResponse)
                    return object;
                return new $root.kritor.guild.UpdateGuildRoleResponse();
            };

            /**
             * Creates a plain object from an UpdateGuildRoleResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.guild.UpdateGuildRoleResponse
             * @static
             * @param {kritor.guild.UpdateGuildRoleResponse} message UpdateGuildRoleResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            UpdateGuildRoleResponse.toObject = function toObject() {
                return {};
            };

            /**
             * Converts this UpdateGuildRoleResponse to JSON.
             * @function toJSON
             * @memberof kritor.guild.UpdateGuildRoleResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            UpdateGuildRoleResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for UpdateGuildRoleResponse
             * @function getTypeUrl
             * @memberof kritor.guild.UpdateGuildRoleResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            UpdateGuildRoleResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.guild.UpdateGuildRoleResponse";
            };

            return UpdateGuildRoleResponse;
        })();

        guild.CreateGuildRoleRequest = (function() {

            /**
             * Properties of a CreateGuildRoleRequest.
             * @memberof kritor.guild
             * @interface ICreateGuildRoleRequest
             * @property {number|Long|null} [guildId] CreateGuildRoleRequest guildId
             * @property {string|null} [name] CreateGuildRoleRequest name
             * @property {number|Long|null} [color] CreateGuildRoleRequest color
             */

            /**
             * Constructs a new CreateGuildRoleRequest.
             * @memberof kritor.guild
             * @classdesc Represents a CreateGuildRoleRequest.
             * @implements ICreateGuildRoleRequest
             * @constructor
             * @param {kritor.guild.ICreateGuildRoleRequest=} [properties] Properties to set
             */
            function CreateGuildRoleRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * CreateGuildRoleRequest guildId.
             * @member {number|Long} guildId
             * @memberof kritor.guild.CreateGuildRoleRequest
             * @instance
             */
            CreateGuildRoleRequest.prototype.guildId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * CreateGuildRoleRequest name.
             * @member {string} name
             * @memberof kritor.guild.CreateGuildRoleRequest
             * @instance
             */
            CreateGuildRoleRequest.prototype.name = "";

            /**
             * CreateGuildRoleRequest color.
             * @member {number|Long} color
             * @memberof kritor.guild.CreateGuildRoleRequest
             * @instance
             */
            CreateGuildRoleRequest.prototype.color = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

            /**
             * Creates a new CreateGuildRoleRequest instance using the specified properties.
             * @function create
             * @memberof kritor.guild.CreateGuildRoleRequest
             * @static
             * @param {kritor.guild.ICreateGuildRoleRequest=} [properties] Properties to set
             * @returns {kritor.guild.CreateGuildRoleRequest} CreateGuildRoleRequest instance
             */
            CreateGuildRoleRequest.create = function create(properties) {
                return new CreateGuildRoleRequest(properties);
            };

            /**
             * Encodes the specified CreateGuildRoleRequest message. Does not implicitly {@link kritor.guild.CreateGuildRoleRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.guild.CreateGuildRoleRequest
             * @static
             * @param {kritor.guild.ICreateGuildRoleRequest} message CreateGuildRoleRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CreateGuildRoleRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.guildId != null && Object.hasOwnProperty.call(message, "guildId"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.guildId);
                if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
                if (message.color != null && Object.hasOwnProperty.call(message, "color"))
                    writer.uint32(/* id 3, wireType 0 =*/24).int64(message.color);
                return writer;
            };

            /**
             * Encodes the specified CreateGuildRoleRequest message, length delimited. Does not implicitly {@link kritor.guild.CreateGuildRoleRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.guild.CreateGuildRoleRequest
             * @static
             * @param {kritor.guild.ICreateGuildRoleRequest} message CreateGuildRoleRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CreateGuildRoleRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a CreateGuildRoleRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.guild.CreateGuildRoleRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.guild.CreateGuildRoleRequest} CreateGuildRoleRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CreateGuildRoleRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.guild.CreateGuildRoleRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.guildId = reader.uint64();
                            break;
                        }
                    case 2: {
                            message.name = reader.string();
                            break;
                        }
                    case 3: {
                            message.color = reader.int64();
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
             * Decodes a CreateGuildRoleRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.guild.CreateGuildRoleRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.guild.CreateGuildRoleRequest} CreateGuildRoleRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CreateGuildRoleRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a CreateGuildRoleRequest message.
             * @function verify
             * @memberof kritor.guild.CreateGuildRoleRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            CreateGuildRoleRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.guildId != null && message.hasOwnProperty("guildId"))
                    if (!$util.isInteger(message.guildId) && !(message.guildId && $util.isInteger(message.guildId.low) && $util.isInteger(message.guildId.high)))
                        return "guildId: integer|Long expected";
                if (message.name != null && message.hasOwnProperty("name"))
                    if (!$util.isString(message.name))
                        return "name: string expected";
                if (message.color != null && message.hasOwnProperty("color"))
                    if (!$util.isInteger(message.color) && !(message.color && $util.isInteger(message.color.low) && $util.isInteger(message.color.high)))
                        return "color: integer|Long expected";
                return null;
            };

            /**
             * Creates a CreateGuildRoleRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.guild.CreateGuildRoleRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.guild.CreateGuildRoleRequest} CreateGuildRoleRequest
             */
            CreateGuildRoleRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.guild.CreateGuildRoleRequest)
                    return object;
                let message = new $root.kritor.guild.CreateGuildRoleRequest();
                if (object.guildId != null)
                    if ($util.Long)
                        (message.guildId = $util.Long.fromValue(object.guildId)).unsigned = true;
                    else if (typeof object.guildId === "string")
                        message.guildId = parseInt(object.guildId, 10);
                    else if (typeof object.guildId === "number")
                        message.guildId = object.guildId;
                    else if (typeof object.guildId === "object")
                        message.guildId = new $util.LongBits(object.guildId.low >>> 0, object.guildId.high >>> 0).toNumber(true);
                if (object.name != null)
                    message.name = String(object.name);
                if (object.color != null)
                    if ($util.Long)
                        (message.color = $util.Long.fromValue(object.color)).unsigned = false;
                    else if (typeof object.color === "string")
                        message.color = parseInt(object.color, 10);
                    else if (typeof object.color === "number")
                        message.color = object.color;
                    else if (typeof object.color === "object")
                        message.color = new $util.LongBits(object.color.low >>> 0, object.color.high >>> 0).toNumber();
                return message;
            };

            /**
             * Creates a plain object from a CreateGuildRoleRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.guild.CreateGuildRoleRequest
             * @static
             * @param {kritor.guild.CreateGuildRoleRequest} message CreateGuildRoleRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            CreateGuildRoleRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.guildId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.guildId = options.longs === String ? "0" : 0;
                    object.name = "";
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, false);
                        object.color = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.color = options.longs === String ? "0" : 0;
                }
                if (message.guildId != null && message.hasOwnProperty("guildId"))
                    if (typeof message.guildId === "number")
                        object.guildId = options.longs === String ? String(message.guildId) : message.guildId;
                    else
                        object.guildId = options.longs === String ? $util.Long.prototype.toString.call(message.guildId) : options.longs === Number ? new $util.LongBits(message.guildId.low >>> 0, message.guildId.high >>> 0).toNumber(true) : message.guildId;
                if (message.name != null && message.hasOwnProperty("name"))
                    object.name = message.name;
                if (message.color != null && message.hasOwnProperty("color"))
                    if (typeof message.color === "number")
                        object.color = options.longs === String ? String(message.color) : message.color;
                    else
                        object.color = options.longs === String ? $util.Long.prototype.toString.call(message.color) : options.longs === Number ? new $util.LongBits(message.color.low >>> 0, message.color.high >>> 0).toNumber() : message.color;
                return object;
            };

            /**
             * Converts this CreateGuildRoleRequest to JSON.
             * @function toJSON
             * @memberof kritor.guild.CreateGuildRoleRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            CreateGuildRoleRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for CreateGuildRoleRequest
             * @function getTypeUrl
             * @memberof kritor.guild.CreateGuildRoleRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            CreateGuildRoleRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.guild.CreateGuildRoleRequest";
            };

            return CreateGuildRoleRequest;
        })();

        guild.CreateGuildRoleResponse = (function() {

            /**
             * Properties of a CreateGuildRoleResponse.
             * @memberof kritor.guild
             * @interface ICreateGuildRoleResponse
             * @property {number|Long|null} [roleId] CreateGuildRoleResponse roleId
             */

            /**
             * Constructs a new CreateGuildRoleResponse.
             * @memberof kritor.guild
             * @classdesc Represents a CreateGuildRoleResponse.
             * @implements ICreateGuildRoleResponse
             * @constructor
             * @param {kritor.guild.ICreateGuildRoleResponse=} [properties] Properties to set
             */
            function CreateGuildRoleResponse(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * CreateGuildRoleResponse roleId.
             * @member {number|Long} roleId
             * @memberof kritor.guild.CreateGuildRoleResponse
             * @instance
             */
            CreateGuildRoleResponse.prototype.roleId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * Creates a new CreateGuildRoleResponse instance using the specified properties.
             * @function create
             * @memberof kritor.guild.CreateGuildRoleResponse
             * @static
             * @param {kritor.guild.ICreateGuildRoleResponse=} [properties] Properties to set
             * @returns {kritor.guild.CreateGuildRoleResponse} CreateGuildRoleResponse instance
             */
            CreateGuildRoleResponse.create = function create(properties) {
                return new CreateGuildRoleResponse(properties);
            };

            /**
             * Encodes the specified CreateGuildRoleResponse message. Does not implicitly {@link kritor.guild.CreateGuildRoleResponse.verify|verify} messages.
             * @function encode
             * @memberof kritor.guild.CreateGuildRoleResponse
             * @static
             * @param {kritor.guild.ICreateGuildRoleResponse} message CreateGuildRoleResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CreateGuildRoleResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.roleId != null && Object.hasOwnProperty.call(message, "roleId"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.roleId);
                return writer;
            };

            /**
             * Encodes the specified CreateGuildRoleResponse message, length delimited. Does not implicitly {@link kritor.guild.CreateGuildRoleResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.guild.CreateGuildRoleResponse
             * @static
             * @param {kritor.guild.ICreateGuildRoleResponse} message CreateGuildRoleResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CreateGuildRoleResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a CreateGuildRoleResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.guild.CreateGuildRoleResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.guild.CreateGuildRoleResponse} CreateGuildRoleResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CreateGuildRoleResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.guild.CreateGuildRoleResponse();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.roleId = reader.uint64();
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
             * Decodes a CreateGuildRoleResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.guild.CreateGuildRoleResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.guild.CreateGuildRoleResponse} CreateGuildRoleResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CreateGuildRoleResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a CreateGuildRoleResponse message.
             * @function verify
             * @memberof kritor.guild.CreateGuildRoleResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            CreateGuildRoleResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.roleId != null && message.hasOwnProperty("roleId"))
                    if (!$util.isInteger(message.roleId) && !(message.roleId && $util.isInteger(message.roleId.low) && $util.isInteger(message.roleId.high)))
                        return "roleId: integer|Long expected";
                return null;
            };

            /**
             * Creates a CreateGuildRoleResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.guild.CreateGuildRoleResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.guild.CreateGuildRoleResponse} CreateGuildRoleResponse
             */
            CreateGuildRoleResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.guild.CreateGuildRoleResponse)
                    return object;
                let message = new $root.kritor.guild.CreateGuildRoleResponse();
                if (object.roleId != null)
                    if ($util.Long)
                        (message.roleId = $util.Long.fromValue(object.roleId)).unsigned = true;
                    else if (typeof object.roleId === "string")
                        message.roleId = parseInt(object.roleId, 10);
                    else if (typeof object.roleId === "number")
                        message.roleId = object.roleId;
                    else if (typeof object.roleId === "object")
                        message.roleId = new $util.LongBits(object.roleId.low >>> 0, object.roleId.high >>> 0).toNumber(true);
                return message;
            };

            /**
             * Creates a plain object from a CreateGuildRoleResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.guild.CreateGuildRoleResponse
             * @static
             * @param {kritor.guild.CreateGuildRoleResponse} message CreateGuildRoleResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            CreateGuildRoleResponse.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults)
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.roleId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.roleId = options.longs === String ? "0" : 0;
                if (message.roleId != null && message.hasOwnProperty("roleId"))
                    if (typeof message.roleId === "number")
                        object.roleId = options.longs === String ? String(message.roleId) : message.roleId;
                    else
                        object.roleId = options.longs === String ? $util.Long.prototype.toString.call(message.roleId) : options.longs === Number ? new $util.LongBits(message.roleId.low >>> 0, message.roleId.high >>> 0).toNumber(true) : message.roleId;
                return object;
            };

            /**
             * Converts this CreateGuildRoleResponse to JSON.
             * @function toJSON
             * @memberof kritor.guild.CreateGuildRoleResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            CreateGuildRoleResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for CreateGuildRoleResponse
             * @function getTypeUrl
             * @memberof kritor.guild.CreateGuildRoleResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            CreateGuildRoleResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.guild.CreateGuildRoleResponse";
            };

            return CreateGuildRoleResponse;
        })();

        guild.GuildInfo = (function() {

            /**
             * Properties of a GuildInfo.
             * @memberof kritor.guild
             * @interface IGuildInfo
             * @property {number|Long|null} [guildId] GuildInfo guildId
             * @property {string|null} [guildName] GuildInfo guildName
             * @property {string|null} [guildDisplayId] GuildInfo guildDisplayId
             * @property {string|null} [profile] GuildInfo profile
             * @property {boolean|null} [isEnable] GuildInfo isEnable
             * @property {boolean|null} [isBanned] GuildInfo isBanned
             * @property {boolean|null} [isFrozen] GuildInfo isFrozen
             * @property {number|Long|null} [ownerId] GuildInfo ownerId
             * @property {number|Long|null} [shutupExpireTime] GuildInfo shutupExpireTime
             * @property {boolean|null} [allowSearch] GuildInfo allowSearch
             */

            /**
             * Constructs a new GuildInfo.
             * @memberof kritor.guild
             * @classdesc Represents a GuildInfo.
             * @implements IGuildInfo
             * @constructor
             * @param {kritor.guild.IGuildInfo=} [properties] Properties to set
             */
            function GuildInfo(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GuildInfo guildId.
             * @member {number|Long} guildId
             * @memberof kritor.guild.GuildInfo
             * @instance
             */
            GuildInfo.prototype.guildId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * GuildInfo guildName.
             * @member {string} guildName
             * @memberof kritor.guild.GuildInfo
             * @instance
             */
            GuildInfo.prototype.guildName = "";

            /**
             * GuildInfo guildDisplayId.
             * @member {string} guildDisplayId
             * @memberof kritor.guild.GuildInfo
             * @instance
             */
            GuildInfo.prototype.guildDisplayId = "";

            /**
             * GuildInfo profile.
             * @member {string} profile
             * @memberof kritor.guild.GuildInfo
             * @instance
             */
            GuildInfo.prototype.profile = "";

            /**
             * GuildInfo isEnable.
             * @member {boolean} isEnable
             * @memberof kritor.guild.GuildInfo
             * @instance
             */
            GuildInfo.prototype.isEnable = false;

            /**
             * GuildInfo isBanned.
             * @member {boolean} isBanned
             * @memberof kritor.guild.GuildInfo
             * @instance
             */
            GuildInfo.prototype.isBanned = false;

            /**
             * GuildInfo isFrozen.
             * @member {boolean} isFrozen
             * @memberof kritor.guild.GuildInfo
             * @instance
             */
            GuildInfo.prototype.isFrozen = false;

            /**
             * GuildInfo ownerId.
             * @member {number|Long} ownerId
             * @memberof kritor.guild.GuildInfo
             * @instance
             */
            GuildInfo.prototype.ownerId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * GuildInfo shutupExpireTime.
             * @member {number|Long} shutupExpireTime
             * @memberof kritor.guild.GuildInfo
             * @instance
             */
            GuildInfo.prototype.shutupExpireTime = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * GuildInfo allowSearch.
             * @member {boolean} allowSearch
             * @memberof kritor.guild.GuildInfo
             * @instance
             */
            GuildInfo.prototype.allowSearch = false;

            /**
             * Creates a new GuildInfo instance using the specified properties.
             * @function create
             * @memberof kritor.guild.GuildInfo
             * @static
             * @param {kritor.guild.IGuildInfo=} [properties] Properties to set
             * @returns {kritor.guild.GuildInfo} GuildInfo instance
             */
            GuildInfo.create = function create(properties) {
                return new GuildInfo(properties);
            };

            /**
             * Encodes the specified GuildInfo message. Does not implicitly {@link kritor.guild.GuildInfo.verify|verify} messages.
             * @function encode
             * @memberof kritor.guild.GuildInfo
             * @static
             * @param {kritor.guild.IGuildInfo} message GuildInfo message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GuildInfo.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.guildId != null && Object.hasOwnProperty.call(message, "guildId"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.guildId);
                if (message.guildName != null && Object.hasOwnProperty.call(message, "guildName"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.guildName);
                if (message.guildDisplayId != null && Object.hasOwnProperty.call(message, "guildDisplayId"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.guildDisplayId);
                if (message.profile != null && Object.hasOwnProperty.call(message, "profile"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.profile);
                if (message.isEnable != null && Object.hasOwnProperty.call(message, "isEnable"))
                    writer.uint32(/* id 5, wireType 0 =*/40).bool(message.isEnable);
                if (message.isBanned != null && Object.hasOwnProperty.call(message, "isBanned"))
                    writer.uint32(/* id 6, wireType 0 =*/48).bool(message.isBanned);
                if (message.isFrozen != null && Object.hasOwnProperty.call(message, "isFrozen"))
                    writer.uint32(/* id 7, wireType 0 =*/56).bool(message.isFrozen);
                if (message.ownerId != null && Object.hasOwnProperty.call(message, "ownerId"))
                    writer.uint32(/* id 8, wireType 0 =*/64).uint64(message.ownerId);
                if (message.shutupExpireTime != null && Object.hasOwnProperty.call(message, "shutupExpireTime"))
                    writer.uint32(/* id 9, wireType 0 =*/72).uint64(message.shutupExpireTime);
                if (message.allowSearch != null && Object.hasOwnProperty.call(message, "allowSearch"))
                    writer.uint32(/* id 10, wireType 0 =*/80).bool(message.allowSearch);
                return writer;
            };

            /**
             * Encodes the specified GuildInfo message, length delimited. Does not implicitly {@link kritor.guild.GuildInfo.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.guild.GuildInfo
             * @static
             * @param {kritor.guild.IGuildInfo} message GuildInfo message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GuildInfo.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GuildInfo message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.guild.GuildInfo
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.guild.GuildInfo} GuildInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GuildInfo.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.guild.GuildInfo();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.guildId = reader.uint64();
                            break;
                        }
                    case 2: {
                            message.guildName = reader.string();
                            break;
                        }
                    case 3: {
                            message.guildDisplayId = reader.string();
                            break;
                        }
                    case 4: {
                            message.profile = reader.string();
                            break;
                        }
                    case 5: {
                            message.isEnable = reader.bool();
                            break;
                        }
                    case 6: {
                            message.isBanned = reader.bool();
                            break;
                        }
                    case 7: {
                            message.isFrozen = reader.bool();
                            break;
                        }
                    case 8: {
                            message.ownerId = reader.uint64();
                            break;
                        }
                    case 9: {
                            message.shutupExpireTime = reader.uint64();
                            break;
                        }
                    case 10: {
                            message.allowSearch = reader.bool();
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
             * Decodes a GuildInfo message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.guild.GuildInfo
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.guild.GuildInfo} GuildInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GuildInfo.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GuildInfo message.
             * @function verify
             * @memberof kritor.guild.GuildInfo
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GuildInfo.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.guildId != null && message.hasOwnProperty("guildId"))
                    if (!$util.isInteger(message.guildId) && !(message.guildId && $util.isInteger(message.guildId.low) && $util.isInteger(message.guildId.high)))
                        return "guildId: integer|Long expected";
                if (message.guildName != null && message.hasOwnProperty("guildName"))
                    if (!$util.isString(message.guildName))
                        return "guildName: string expected";
                if (message.guildDisplayId != null && message.hasOwnProperty("guildDisplayId"))
                    if (!$util.isString(message.guildDisplayId))
                        return "guildDisplayId: string expected";
                if (message.profile != null && message.hasOwnProperty("profile"))
                    if (!$util.isString(message.profile))
                        return "profile: string expected";
                if (message.isEnable != null && message.hasOwnProperty("isEnable"))
                    if (typeof message.isEnable !== "boolean")
                        return "isEnable: boolean expected";
                if (message.isBanned != null && message.hasOwnProperty("isBanned"))
                    if (typeof message.isBanned !== "boolean")
                        return "isBanned: boolean expected";
                if (message.isFrozen != null && message.hasOwnProperty("isFrozen"))
                    if (typeof message.isFrozen !== "boolean")
                        return "isFrozen: boolean expected";
                if (message.ownerId != null && message.hasOwnProperty("ownerId"))
                    if (!$util.isInteger(message.ownerId) && !(message.ownerId && $util.isInteger(message.ownerId.low) && $util.isInteger(message.ownerId.high)))
                        return "ownerId: integer|Long expected";
                if (message.shutupExpireTime != null && message.hasOwnProperty("shutupExpireTime"))
                    if (!$util.isInteger(message.shutupExpireTime) && !(message.shutupExpireTime && $util.isInteger(message.shutupExpireTime.low) && $util.isInteger(message.shutupExpireTime.high)))
                        return "shutupExpireTime: integer|Long expected";
                if (message.allowSearch != null && message.hasOwnProperty("allowSearch"))
                    if (typeof message.allowSearch !== "boolean")
                        return "allowSearch: boolean expected";
                return null;
            };

            /**
             * Creates a GuildInfo message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.guild.GuildInfo
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.guild.GuildInfo} GuildInfo
             */
            GuildInfo.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.guild.GuildInfo)
                    return object;
                let message = new $root.kritor.guild.GuildInfo();
                if (object.guildId != null)
                    if ($util.Long)
                        (message.guildId = $util.Long.fromValue(object.guildId)).unsigned = true;
                    else if (typeof object.guildId === "string")
                        message.guildId = parseInt(object.guildId, 10);
                    else if (typeof object.guildId === "number")
                        message.guildId = object.guildId;
                    else if (typeof object.guildId === "object")
                        message.guildId = new $util.LongBits(object.guildId.low >>> 0, object.guildId.high >>> 0).toNumber(true);
                if (object.guildName != null)
                    message.guildName = String(object.guildName);
                if (object.guildDisplayId != null)
                    message.guildDisplayId = String(object.guildDisplayId);
                if (object.profile != null)
                    message.profile = String(object.profile);
                if (object.isEnable != null)
                    message.isEnable = Boolean(object.isEnable);
                if (object.isBanned != null)
                    message.isBanned = Boolean(object.isBanned);
                if (object.isFrozen != null)
                    message.isFrozen = Boolean(object.isFrozen);
                if (object.ownerId != null)
                    if ($util.Long)
                        (message.ownerId = $util.Long.fromValue(object.ownerId)).unsigned = true;
                    else if (typeof object.ownerId === "string")
                        message.ownerId = parseInt(object.ownerId, 10);
                    else if (typeof object.ownerId === "number")
                        message.ownerId = object.ownerId;
                    else if (typeof object.ownerId === "object")
                        message.ownerId = new $util.LongBits(object.ownerId.low >>> 0, object.ownerId.high >>> 0).toNumber(true);
                if (object.shutupExpireTime != null)
                    if ($util.Long)
                        (message.shutupExpireTime = $util.Long.fromValue(object.shutupExpireTime)).unsigned = true;
                    else if (typeof object.shutupExpireTime === "string")
                        message.shutupExpireTime = parseInt(object.shutupExpireTime, 10);
                    else if (typeof object.shutupExpireTime === "number")
                        message.shutupExpireTime = object.shutupExpireTime;
                    else if (typeof object.shutupExpireTime === "object")
                        message.shutupExpireTime = new $util.LongBits(object.shutupExpireTime.low >>> 0, object.shutupExpireTime.high >>> 0).toNumber(true);
                if (object.allowSearch != null)
                    message.allowSearch = Boolean(object.allowSearch);
                return message;
            };

            /**
             * Creates a plain object from a GuildInfo message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.guild.GuildInfo
             * @static
             * @param {kritor.guild.GuildInfo} message GuildInfo
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GuildInfo.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.guildId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.guildId = options.longs === String ? "0" : 0;
                    object.guildName = "";
                    object.guildDisplayId = "";
                    object.profile = "";
                    object.isEnable = false;
                    object.isBanned = false;
                    object.isFrozen = false;
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.ownerId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.ownerId = options.longs === String ? "0" : 0;
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.shutupExpireTime = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.shutupExpireTime = options.longs === String ? "0" : 0;
                    object.allowSearch = false;
                }
                if (message.guildId != null && message.hasOwnProperty("guildId"))
                    if (typeof message.guildId === "number")
                        object.guildId = options.longs === String ? String(message.guildId) : message.guildId;
                    else
                        object.guildId = options.longs === String ? $util.Long.prototype.toString.call(message.guildId) : options.longs === Number ? new $util.LongBits(message.guildId.low >>> 0, message.guildId.high >>> 0).toNumber(true) : message.guildId;
                if (message.guildName != null && message.hasOwnProperty("guildName"))
                    object.guildName = message.guildName;
                if (message.guildDisplayId != null && message.hasOwnProperty("guildDisplayId"))
                    object.guildDisplayId = message.guildDisplayId;
                if (message.profile != null && message.hasOwnProperty("profile"))
                    object.profile = message.profile;
                if (message.isEnable != null && message.hasOwnProperty("isEnable"))
                    object.isEnable = message.isEnable;
                if (message.isBanned != null && message.hasOwnProperty("isBanned"))
                    object.isBanned = message.isBanned;
                if (message.isFrozen != null && message.hasOwnProperty("isFrozen"))
                    object.isFrozen = message.isFrozen;
                if (message.ownerId != null && message.hasOwnProperty("ownerId"))
                    if (typeof message.ownerId === "number")
                        object.ownerId = options.longs === String ? String(message.ownerId) : message.ownerId;
                    else
                        object.ownerId = options.longs === String ? $util.Long.prototype.toString.call(message.ownerId) : options.longs === Number ? new $util.LongBits(message.ownerId.low >>> 0, message.ownerId.high >>> 0).toNumber(true) : message.ownerId;
                if (message.shutupExpireTime != null && message.hasOwnProperty("shutupExpireTime"))
                    if (typeof message.shutupExpireTime === "number")
                        object.shutupExpireTime = options.longs === String ? String(message.shutupExpireTime) : message.shutupExpireTime;
                    else
                        object.shutupExpireTime = options.longs === String ? $util.Long.prototype.toString.call(message.shutupExpireTime) : options.longs === Number ? new $util.LongBits(message.shutupExpireTime.low >>> 0, message.shutupExpireTime.high >>> 0).toNumber(true) : message.shutupExpireTime;
                if (message.allowSearch != null && message.hasOwnProperty("allowSearch"))
                    object.allowSearch = message.allowSearch;
                return object;
            };

            /**
             * Converts this GuildInfo to JSON.
             * @function toJSON
             * @memberof kritor.guild.GuildInfo
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GuildInfo.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GuildInfo
             * @function getTypeUrl
             * @memberof kritor.guild.GuildInfo
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GuildInfo.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.guild.GuildInfo";
            };

            return GuildInfo;
        })();

        guild.ChannelInfo = (function() {

            /**
             * Properties of a ChannelInfo.
             * @memberof kritor.guild
             * @interface IChannelInfo
             * @property {number|Long|null} [channelId] ChannelInfo channelId
             * @property {number|Long|null} [guildId] ChannelInfo guildId
             * @property {string|null} [channelName] ChannelInfo channelName
             * @property {number|Long|null} [createTime] ChannelInfo createTime
             * @property {number|Long|null} [maxMemberCount] ChannelInfo maxMemberCount
             * @property {number|Long|null} [creatorTinyId] ChannelInfo creatorTinyId
             * @property {number|Long|null} [talkPermission] ChannelInfo talkPermission
             * @property {number|Long|null} [visibleType] ChannelInfo visibleType
             * @property {number|Long|null} [currentSlowMode] ChannelInfo currentSlowMode
             * @property {Array.<kritor.guild.ISlowModes>|null} [slowModes] ChannelInfo slowModes
             * @property {string|null} [iconUrl] ChannelInfo iconUrl
             * @property {number|Long|null} [jumpSwitch] ChannelInfo jumpSwitch
             * @property {number|Long|null} [jumpType] ChannelInfo jumpType
             * @property {string|null} [jumpUrl] ChannelInfo jumpUrl
             * @property {number|Long|null} [categoryId] ChannelInfo categoryId
             * @property {number|Long|null} [myTalkPermission] ChannelInfo myTalkPermission
             */

            /**
             * Constructs a new ChannelInfo.
             * @memberof kritor.guild
             * @classdesc Represents a ChannelInfo.
             * @implements IChannelInfo
             * @constructor
             * @param {kritor.guild.IChannelInfo=} [properties] Properties to set
             */
            function ChannelInfo(properties) {
                this.slowModes = [];
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * ChannelInfo channelId.
             * @member {number|Long} channelId
             * @memberof kritor.guild.ChannelInfo
             * @instance
             */
            ChannelInfo.prototype.channelId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * ChannelInfo guildId.
             * @member {number|Long} guildId
             * @memberof kritor.guild.ChannelInfo
             * @instance
             */
            ChannelInfo.prototype.guildId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * ChannelInfo channelName.
             * @member {string} channelName
             * @memberof kritor.guild.ChannelInfo
             * @instance
             */
            ChannelInfo.prototype.channelName = "";

            /**
             * ChannelInfo createTime.
             * @member {number|Long} createTime
             * @memberof kritor.guild.ChannelInfo
             * @instance
             */
            ChannelInfo.prototype.createTime = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * ChannelInfo maxMemberCount.
             * @member {number|Long} maxMemberCount
             * @memberof kritor.guild.ChannelInfo
             * @instance
             */
            ChannelInfo.prototype.maxMemberCount = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * ChannelInfo creatorTinyId.
             * @member {number|Long} creatorTinyId
             * @memberof kritor.guild.ChannelInfo
             * @instance
             */
            ChannelInfo.prototype.creatorTinyId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * ChannelInfo talkPermission.
             * @member {number|Long} talkPermission
             * @memberof kritor.guild.ChannelInfo
             * @instance
             */
            ChannelInfo.prototype.talkPermission = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * ChannelInfo visibleType.
             * @member {number|Long} visibleType
             * @memberof kritor.guild.ChannelInfo
             * @instance
             */
            ChannelInfo.prototype.visibleType = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * ChannelInfo currentSlowMode.
             * @member {number|Long} currentSlowMode
             * @memberof kritor.guild.ChannelInfo
             * @instance
             */
            ChannelInfo.prototype.currentSlowMode = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * ChannelInfo slowModes.
             * @member {Array.<kritor.guild.ISlowModes>} slowModes
             * @memberof kritor.guild.ChannelInfo
             * @instance
             */
            ChannelInfo.prototype.slowModes = $util.emptyArray;

            /**
             * ChannelInfo iconUrl.
             * @member {string} iconUrl
             * @memberof kritor.guild.ChannelInfo
             * @instance
             */
            ChannelInfo.prototype.iconUrl = "";

            /**
             * ChannelInfo jumpSwitch.
             * @member {number|Long} jumpSwitch
             * @memberof kritor.guild.ChannelInfo
             * @instance
             */
            ChannelInfo.prototype.jumpSwitch = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * ChannelInfo jumpType.
             * @member {number|Long} jumpType
             * @memberof kritor.guild.ChannelInfo
             * @instance
             */
            ChannelInfo.prototype.jumpType = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * ChannelInfo jumpUrl.
             * @member {string} jumpUrl
             * @memberof kritor.guild.ChannelInfo
             * @instance
             */
            ChannelInfo.prototype.jumpUrl = "";

            /**
             * ChannelInfo categoryId.
             * @member {number|Long} categoryId
             * @memberof kritor.guild.ChannelInfo
             * @instance
             */
            ChannelInfo.prototype.categoryId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * ChannelInfo myTalkPermission.
             * @member {number|Long} myTalkPermission
             * @memberof kritor.guild.ChannelInfo
             * @instance
             */
            ChannelInfo.prototype.myTalkPermission = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * Creates a new ChannelInfo instance using the specified properties.
             * @function create
             * @memberof kritor.guild.ChannelInfo
             * @static
             * @param {kritor.guild.IChannelInfo=} [properties] Properties to set
             * @returns {kritor.guild.ChannelInfo} ChannelInfo instance
             */
            ChannelInfo.create = function create(properties) {
                return new ChannelInfo(properties);
            };

            /**
             * Encodes the specified ChannelInfo message. Does not implicitly {@link kritor.guild.ChannelInfo.verify|verify} messages.
             * @function encode
             * @memberof kritor.guild.ChannelInfo
             * @static
             * @param {kritor.guild.IChannelInfo} message ChannelInfo message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ChannelInfo.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.channelId != null && Object.hasOwnProperty.call(message, "channelId"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.channelId);
                if (message.guildId != null && Object.hasOwnProperty.call(message, "guildId"))
                    writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.guildId);
                if (message.channelName != null && Object.hasOwnProperty.call(message, "channelName"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.channelName);
                if (message.createTime != null && Object.hasOwnProperty.call(message, "createTime"))
                    writer.uint32(/* id 4, wireType 0 =*/32).uint64(message.createTime);
                if (message.maxMemberCount != null && Object.hasOwnProperty.call(message, "maxMemberCount"))
                    writer.uint32(/* id 5, wireType 0 =*/40).uint64(message.maxMemberCount);
                if (message.creatorTinyId != null && Object.hasOwnProperty.call(message, "creatorTinyId"))
                    writer.uint32(/* id 6, wireType 0 =*/48).uint64(message.creatorTinyId);
                if (message.talkPermission != null && Object.hasOwnProperty.call(message, "talkPermission"))
                    writer.uint32(/* id 7, wireType 0 =*/56).uint64(message.talkPermission);
                if (message.visibleType != null && Object.hasOwnProperty.call(message, "visibleType"))
                    writer.uint32(/* id 8, wireType 0 =*/64).uint64(message.visibleType);
                if (message.currentSlowMode != null && Object.hasOwnProperty.call(message, "currentSlowMode"))
                    writer.uint32(/* id 9, wireType 0 =*/72).uint64(message.currentSlowMode);
                if (message.slowModes != null && message.slowModes.length)
                    for (let i = 0; i < message.slowModes.length; ++i)
                        $root.kritor.guild.SlowModes.encode(message.slowModes[i], writer.uint32(/* id 10, wireType 2 =*/82).fork()).ldelim();
                if (message.iconUrl != null && Object.hasOwnProperty.call(message, "iconUrl"))
                    writer.uint32(/* id 11, wireType 2 =*/90).string(message.iconUrl);
                if (message.jumpSwitch != null && Object.hasOwnProperty.call(message, "jumpSwitch"))
                    writer.uint32(/* id 12, wireType 0 =*/96).uint64(message.jumpSwitch);
                if (message.jumpType != null && Object.hasOwnProperty.call(message, "jumpType"))
                    writer.uint32(/* id 13, wireType 0 =*/104).uint64(message.jumpType);
                if (message.jumpUrl != null && Object.hasOwnProperty.call(message, "jumpUrl"))
                    writer.uint32(/* id 14, wireType 2 =*/114).string(message.jumpUrl);
                if (message.categoryId != null && Object.hasOwnProperty.call(message, "categoryId"))
                    writer.uint32(/* id 15, wireType 0 =*/120).uint64(message.categoryId);
                if (message.myTalkPermission != null && Object.hasOwnProperty.call(message, "myTalkPermission"))
                    writer.uint32(/* id 16, wireType 0 =*/128).uint64(message.myTalkPermission);
                return writer;
            };

            /**
             * Encodes the specified ChannelInfo message, length delimited. Does not implicitly {@link kritor.guild.ChannelInfo.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.guild.ChannelInfo
             * @static
             * @param {kritor.guild.IChannelInfo} message ChannelInfo message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ChannelInfo.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a ChannelInfo message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.guild.ChannelInfo
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.guild.ChannelInfo} ChannelInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ChannelInfo.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.guild.ChannelInfo();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.channelId = reader.uint64();
                            break;
                        }
                    case 2: {
                            message.guildId = reader.uint64();
                            break;
                        }
                    case 3: {
                            message.channelName = reader.string();
                            break;
                        }
                    case 4: {
                            message.createTime = reader.uint64();
                            break;
                        }
                    case 5: {
                            message.maxMemberCount = reader.uint64();
                            break;
                        }
                    case 6: {
                            message.creatorTinyId = reader.uint64();
                            break;
                        }
                    case 7: {
                            message.talkPermission = reader.uint64();
                            break;
                        }
                    case 8: {
                            message.visibleType = reader.uint64();
                            break;
                        }
                    case 9: {
                            message.currentSlowMode = reader.uint64();
                            break;
                        }
                    case 10: {
                            if (!(message.slowModes && message.slowModes.length))
                                message.slowModes = [];
                            message.slowModes.push($root.kritor.guild.SlowModes.decode(reader, reader.uint32()));
                            break;
                        }
                    case 11: {
                            message.iconUrl = reader.string();
                            break;
                        }
                    case 12: {
                            message.jumpSwitch = reader.uint64();
                            break;
                        }
                    case 13: {
                            message.jumpType = reader.uint64();
                            break;
                        }
                    case 14: {
                            message.jumpUrl = reader.string();
                            break;
                        }
                    case 15: {
                            message.categoryId = reader.uint64();
                            break;
                        }
                    case 16: {
                            message.myTalkPermission = reader.uint64();
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
             * Decodes a ChannelInfo message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.guild.ChannelInfo
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.guild.ChannelInfo} ChannelInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ChannelInfo.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a ChannelInfo message.
             * @function verify
             * @memberof kritor.guild.ChannelInfo
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ChannelInfo.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.channelId != null && message.hasOwnProperty("channelId"))
                    if (!$util.isInteger(message.channelId) && !(message.channelId && $util.isInteger(message.channelId.low) && $util.isInteger(message.channelId.high)))
                        return "channelId: integer|Long expected";
                if (message.guildId != null && message.hasOwnProperty("guildId"))
                    if (!$util.isInteger(message.guildId) && !(message.guildId && $util.isInteger(message.guildId.low) && $util.isInteger(message.guildId.high)))
                        return "guildId: integer|Long expected";
                if (message.channelName != null && message.hasOwnProperty("channelName"))
                    if (!$util.isString(message.channelName))
                        return "channelName: string expected";
                if (message.createTime != null && message.hasOwnProperty("createTime"))
                    if (!$util.isInteger(message.createTime) && !(message.createTime && $util.isInteger(message.createTime.low) && $util.isInteger(message.createTime.high)))
                        return "createTime: integer|Long expected";
                if (message.maxMemberCount != null && message.hasOwnProperty("maxMemberCount"))
                    if (!$util.isInteger(message.maxMemberCount) && !(message.maxMemberCount && $util.isInteger(message.maxMemberCount.low) && $util.isInteger(message.maxMemberCount.high)))
                        return "maxMemberCount: integer|Long expected";
                if (message.creatorTinyId != null && message.hasOwnProperty("creatorTinyId"))
                    if (!$util.isInteger(message.creatorTinyId) && !(message.creatorTinyId && $util.isInteger(message.creatorTinyId.low) && $util.isInteger(message.creatorTinyId.high)))
                        return "creatorTinyId: integer|Long expected";
                if (message.talkPermission != null && message.hasOwnProperty("talkPermission"))
                    if (!$util.isInteger(message.talkPermission) && !(message.talkPermission && $util.isInteger(message.talkPermission.low) && $util.isInteger(message.talkPermission.high)))
                        return "talkPermission: integer|Long expected";
                if (message.visibleType != null && message.hasOwnProperty("visibleType"))
                    if (!$util.isInteger(message.visibleType) && !(message.visibleType && $util.isInteger(message.visibleType.low) && $util.isInteger(message.visibleType.high)))
                        return "visibleType: integer|Long expected";
                if (message.currentSlowMode != null && message.hasOwnProperty("currentSlowMode"))
                    if (!$util.isInteger(message.currentSlowMode) && !(message.currentSlowMode && $util.isInteger(message.currentSlowMode.low) && $util.isInteger(message.currentSlowMode.high)))
                        return "currentSlowMode: integer|Long expected";
                if (message.slowModes != null && message.hasOwnProperty("slowModes")) {
                    if (!Array.isArray(message.slowModes))
                        return "slowModes: array expected";
                    for (let i = 0; i < message.slowModes.length; ++i) {
                        let error = $root.kritor.guild.SlowModes.verify(message.slowModes[i]);
                        if (error)
                            return "slowModes." + error;
                    }
                }
                if (message.iconUrl != null && message.hasOwnProperty("iconUrl"))
                    if (!$util.isString(message.iconUrl))
                        return "iconUrl: string expected";
                if (message.jumpSwitch != null && message.hasOwnProperty("jumpSwitch"))
                    if (!$util.isInteger(message.jumpSwitch) && !(message.jumpSwitch && $util.isInteger(message.jumpSwitch.low) && $util.isInteger(message.jumpSwitch.high)))
                        return "jumpSwitch: integer|Long expected";
                if (message.jumpType != null && message.hasOwnProperty("jumpType"))
                    if (!$util.isInteger(message.jumpType) && !(message.jumpType && $util.isInteger(message.jumpType.low) && $util.isInteger(message.jumpType.high)))
                        return "jumpType: integer|Long expected";
                if (message.jumpUrl != null && message.hasOwnProperty("jumpUrl"))
                    if (!$util.isString(message.jumpUrl))
                        return "jumpUrl: string expected";
                if (message.categoryId != null && message.hasOwnProperty("categoryId"))
                    if (!$util.isInteger(message.categoryId) && !(message.categoryId && $util.isInteger(message.categoryId.low) && $util.isInteger(message.categoryId.high)))
                        return "categoryId: integer|Long expected";
                if (message.myTalkPermission != null && message.hasOwnProperty("myTalkPermission"))
                    if (!$util.isInteger(message.myTalkPermission) && !(message.myTalkPermission && $util.isInteger(message.myTalkPermission.low) && $util.isInteger(message.myTalkPermission.high)))
                        return "myTalkPermission: integer|Long expected";
                return null;
            };

            /**
             * Creates a ChannelInfo message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.guild.ChannelInfo
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.guild.ChannelInfo} ChannelInfo
             */
            ChannelInfo.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.guild.ChannelInfo)
                    return object;
                let message = new $root.kritor.guild.ChannelInfo();
                if (object.channelId != null)
                    if ($util.Long)
                        (message.channelId = $util.Long.fromValue(object.channelId)).unsigned = true;
                    else if (typeof object.channelId === "string")
                        message.channelId = parseInt(object.channelId, 10);
                    else if (typeof object.channelId === "number")
                        message.channelId = object.channelId;
                    else if (typeof object.channelId === "object")
                        message.channelId = new $util.LongBits(object.channelId.low >>> 0, object.channelId.high >>> 0).toNumber(true);
                if (object.guildId != null)
                    if ($util.Long)
                        (message.guildId = $util.Long.fromValue(object.guildId)).unsigned = true;
                    else if (typeof object.guildId === "string")
                        message.guildId = parseInt(object.guildId, 10);
                    else if (typeof object.guildId === "number")
                        message.guildId = object.guildId;
                    else if (typeof object.guildId === "object")
                        message.guildId = new $util.LongBits(object.guildId.low >>> 0, object.guildId.high >>> 0).toNumber(true);
                if (object.channelName != null)
                    message.channelName = String(object.channelName);
                if (object.createTime != null)
                    if ($util.Long)
                        (message.createTime = $util.Long.fromValue(object.createTime)).unsigned = true;
                    else if (typeof object.createTime === "string")
                        message.createTime = parseInt(object.createTime, 10);
                    else if (typeof object.createTime === "number")
                        message.createTime = object.createTime;
                    else if (typeof object.createTime === "object")
                        message.createTime = new $util.LongBits(object.createTime.low >>> 0, object.createTime.high >>> 0).toNumber(true);
                if (object.maxMemberCount != null)
                    if ($util.Long)
                        (message.maxMemberCount = $util.Long.fromValue(object.maxMemberCount)).unsigned = true;
                    else if (typeof object.maxMemberCount === "string")
                        message.maxMemberCount = parseInt(object.maxMemberCount, 10);
                    else if (typeof object.maxMemberCount === "number")
                        message.maxMemberCount = object.maxMemberCount;
                    else if (typeof object.maxMemberCount === "object")
                        message.maxMemberCount = new $util.LongBits(object.maxMemberCount.low >>> 0, object.maxMemberCount.high >>> 0).toNumber(true);
                if (object.creatorTinyId != null)
                    if ($util.Long)
                        (message.creatorTinyId = $util.Long.fromValue(object.creatorTinyId)).unsigned = true;
                    else if (typeof object.creatorTinyId === "string")
                        message.creatorTinyId = parseInt(object.creatorTinyId, 10);
                    else if (typeof object.creatorTinyId === "number")
                        message.creatorTinyId = object.creatorTinyId;
                    else if (typeof object.creatorTinyId === "object")
                        message.creatorTinyId = new $util.LongBits(object.creatorTinyId.low >>> 0, object.creatorTinyId.high >>> 0).toNumber(true);
                if (object.talkPermission != null)
                    if ($util.Long)
                        (message.talkPermission = $util.Long.fromValue(object.talkPermission)).unsigned = true;
                    else if (typeof object.talkPermission === "string")
                        message.talkPermission = parseInt(object.talkPermission, 10);
                    else if (typeof object.talkPermission === "number")
                        message.talkPermission = object.talkPermission;
                    else if (typeof object.talkPermission === "object")
                        message.talkPermission = new $util.LongBits(object.talkPermission.low >>> 0, object.talkPermission.high >>> 0).toNumber(true);
                if (object.visibleType != null)
                    if ($util.Long)
                        (message.visibleType = $util.Long.fromValue(object.visibleType)).unsigned = true;
                    else if (typeof object.visibleType === "string")
                        message.visibleType = parseInt(object.visibleType, 10);
                    else if (typeof object.visibleType === "number")
                        message.visibleType = object.visibleType;
                    else if (typeof object.visibleType === "object")
                        message.visibleType = new $util.LongBits(object.visibleType.low >>> 0, object.visibleType.high >>> 0).toNumber(true);
                if (object.currentSlowMode != null)
                    if ($util.Long)
                        (message.currentSlowMode = $util.Long.fromValue(object.currentSlowMode)).unsigned = true;
                    else if (typeof object.currentSlowMode === "string")
                        message.currentSlowMode = parseInt(object.currentSlowMode, 10);
                    else if (typeof object.currentSlowMode === "number")
                        message.currentSlowMode = object.currentSlowMode;
                    else if (typeof object.currentSlowMode === "object")
                        message.currentSlowMode = new $util.LongBits(object.currentSlowMode.low >>> 0, object.currentSlowMode.high >>> 0).toNumber(true);
                if (object.slowModes) {
                    if (!Array.isArray(object.slowModes))
                        throw TypeError(".kritor.guild.ChannelInfo.slowModes: array expected");
                    message.slowModes = [];
                    for (let i = 0; i < object.slowModes.length; ++i) {
                        if (typeof object.slowModes[i] !== "object")
                            throw TypeError(".kritor.guild.ChannelInfo.slowModes: object expected");
                        message.slowModes[i] = $root.kritor.guild.SlowModes.fromObject(object.slowModes[i]);
                    }
                }
                if (object.iconUrl != null)
                    message.iconUrl = String(object.iconUrl);
                if (object.jumpSwitch != null)
                    if ($util.Long)
                        (message.jumpSwitch = $util.Long.fromValue(object.jumpSwitch)).unsigned = true;
                    else if (typeof object.jumpSwitch === "string")
                        message.jumpSwitch = parseInt(object.jumpSwitch, 10);
                    else if (typeof object.jumpSwitch === "number")
                        message.jumpSwitch = object.jumpSwitch;
                    else if (typeof object.jumpSwitch === "object")
                        message.jumpSwitch = new $util.LongBits(object.jumpSwitch.low >>> 0, object.jumpSwitch.high >>> 0).toNumber(true);
                if (object.jumpType != null)
                    if ($util.Long)
                        (message.jumpType = $util.Long.fromValue(object.jumpType)).unsigned = true;
                    else if (typeof object.jumpType === "string")
                        message.jumpType = parseInt(object.jumpType, 10);
                    else if (typeof object.jumpType === "number")
                        message.jumpType = object.jumpType;
                    else if (typeof object.jumpType === "object")
                        message.jumpType = new $util.LongBits(object.jumpType.low >>> 0, object.jumpType.high >>> 0).toNumber(true);
                if (object.jumpUrl != null)
                    message.jumpUrl = String(object.jumpUrl);
                if (object.categoryId != null)
                    if ($util.Long)
                        (message.categoryId = $util.Long.fromValue(object.categoryId)).unsigned = true;
                    else if (typeof object.categoryId === "string")
                        message.categoryId = parseInt(object.categoryId, 10);
                    else if (typeof object.categoryId === "number")
                        message.categoryId = object.categoryId;
                    else if (typeof object.categoryId === "object")
                        message.categoryId = new $util.LongBits(object.categoryId.low >>> 0, object.categoryId.high >>> 0).toNumber(true);
                if (object.myTalkPermission != null)
                    if ($util.Long)
                        (message.myTalkPermission = $util.Long.fromValue(object.myTalkPermission)).unsigned = true;
                    else if (typeof object.myTalkPermission === "string")
                        message.myTalkPermission = parseInt(object.myTalkPermission, 10);
                    else if (typeof object.myTalkPermission === "number")
                        message.myTalkPermission = object.myTalkPermission;
                    else if (typeof object.myTalkPermission === "object")
                        message.myTalkPermission = new $util.LongBits(object.myTalkPermission.low >>> 0, object.myTalkPermission.high >>> 0).toNumber(true);
                return message;
            };

            /**
             * Creates a plain object from a ChannelInfo message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.guild.ChannelInfo
             * @static
             * @param {kritor.guild.ChannelInfo} message ChannelInfo
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ChannelInfo.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.arrays || options.defaults)
                    object.slowModes = [];
                if (options.defaults) {
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.channelId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.channelId = options.longs === String ? "0" : 0;
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.guildId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.guildId = options.longs === String ? "0" : 0;
                    object.channelName = "";
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.createTime = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.createTime = options.longs === String ? "0" : 0;
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.maxMemberCount = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.maxMemberCount = options.longs === String ? "0" : 0;
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.creatorTinyId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.creatorTinyId = options.longs === String ? "0" : 0;
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.talkPermission = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.talkPermission = options.longs === String ? "0" : 0;
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.visibleType = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.visibleType = options.longs === String ? "0" : 0;
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.currentSlowMode = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.currentSlowMode = options.longs === String ? "0" : 0;
                    object.iconUrl = "";
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.jumpSwitch = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.jumpSwitch = options.longs === String ? "0" : 0;
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.jumpType = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.jumpType = options.longs === String ? "0" : 0;
                    object.jumpUrl = "";
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.categoryId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.categoryId = options.longs === String ? "0" : 0;
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.myTalkPermission = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.myTalkPermission = options.longs === String ? "0" : 0;
                }
                if (message.channelId != null && message.hasOwnProperty("channelId"))
                    if (typeof message.channelId === "number")
                        object.channelId = options.longs === String ? String(message.channelId) : message.channelId;
                    else
                        object.channelId = options.longs === String ? $util.Long.prototype.toString.call(message.channelId) : options.longs === Number ? new $util.LongBits(message.channelId.low >>> 0, message.channelId.high >>> 0).toNumber(true) : message.channelId;
                if (message.guildId != null && message.hasOwnProperty("guildId"))
                    if (typeof message.guildId === "number")
                        object.guildId = options.longs === String ? String(message.guildId) : message.guildId;
                    else
                        object.guildId = options.longs === String ? $util.Long.prototype.toString.call(message.guildId) : options.longs === Number ? new $util.LongBits(message.guildId.low >>> 0, message.guildId.high >>> 0).toNumber(true) : message.guildId;
                if (message.channelName != null && message.hasOwnProperty("channelName"))
                    object.channelName = message.channelName;
                if (message.createTime != null && message.hasOwnProperty("createTime"))
                    if (typeof message.createTime === "number")
                        object.createTime = options.longs === String ? String(message.createTime) : message.createTime;
                    else
                        object.createTime = options.longs === String ? $util.Long.prototype.toString.call(message.createTime) : options.longs === Number ? new $util.LongBits(message.createTime.low >>> 0, message.createTime.high >>> 0).toNumber(true) : message.createTime;
                if (message.maxMemberCount != null && message.hasOwnProperty("maxMemberCount"))
                    if (typeof message.maxMemberCount === "number")
                        object.maxMemberCount = options.longs === String ? String(message.maxMemberCount) : message.maxMemberCount;
                    else
                        object.maxMemberCount = options.longs === String ? $util.Long.prototype.toString.call(message.maxMemberCount) : options.longs === Number ? new $util.LongBits(message.maxMemberCount.low >>> 0, message.maxMemberCount.high >>> 0).toNumber(true) : message.maxMemberCount;
                if (message.creatorTinyId != null && message.hasOwnProperty("creatorTinyId"))
                    if (typeof message.creatorTinyId === "number")
                        object.creatorTinyId = options.longs === String ? String(message.creatorTinyId) : message.creatorTinyId;
                    else
                        object.creatorTinyId = options.longs === String ? $util.Long.prototype.toString.call(message.creatorTinyId) : options.longs === Number ? new $util.LongBits(message.creatorTinyId.low >>> 0, message.creatorTinyId.high >>> 0).toNumber(true) : message.creatorTinyId;
                if (message.talkPermission != null && message.hasOwnProperty("talkPermission"))
                    if (typeof message.talkPermission === "number")
                        object.talkPermission = options.longs === String ? String(message.talkPermission) : message.talkPermission;
                    else
                        object.talkPermission = options.longs === String ? $util.Long.prototype.toString.call(message.talkPermission) : options.longs === Number ? new $util.LongBits(message.talkPermission.low >>> 0, message.talkPermission.high >>> 0).toNumber(true) : message.talkPermission;
                if (message.visibleType != null && message.hasOwnProperty("visibleType"))
                    if (typeof message.visibleType === "number")
                        object.visibleType = options.longs === String ? String(message.visibleType) : message.visibleType;
                    else
                        object.visibleType = options.longs === String ? $util.Long.prototype.toString.call(message.visibleType) : options.longs === Number ? new $util.LongBits(message.visibleType.low >>> 0, message.visibleType.high >>> 0).toNumber(true) : message.visibleType;
                if (message.currentSlowMode != null && message.hasOwnProperty("currentSlowMode"))
                    if (typeof message.currentSlowMode === "number")
                        object.currentSlowMode = options.longs === String ? String(message.currentSlowMode) : message.currentSlowMode;
                    else
                        object.currentSlowMode = options.longs === String ? $util.Long.prototype.toString.call(message.currentSlowMode) : options.longs === Number ? new $util.LongBits(message.currentSlowMode.low >>> 0, message.currentSlowMode.high >>> 0).toNumber(true) : message.currentSlowMode;
                if (message.slowModes && message.slowModes.length) {
                    object.slowModes = [];
                    for (let j = 0; j < message.slowModes.length; ++j)
                        object.slowModes[j] = $root.kritor.guild.SlowModes.toObject(message.slowModes[j], options);
                }
                if (message.iconUrl != null && message.hasOwnProperty("iconUrl"))
                    object.iconUrl = message.iconUrl;
                if (message.jumpSwitch != null && message.hasOwnProperty("jumpSwitch"))
                    if (typeof message.jumpSwitch === "number")
                        object.jumpSwitch = options.longs === String ? String(message.jumpSwitch) : message.jumpSwitch;
                    else
                        object.jumpSwitch = options.longs === String ? $util.Long.prototype.toString.call(message.jumpSwitch) : options.longs === Number ? new $util.LongBits(message.jumpSwitch.low >>> 0, message.jumpSwitch.high >>> 0).toNumber(true) : message.jumpSwitch;
                if (message.jumpType != null && message.hasOwnProperty("jumpType"))
                    if (typeof message.jumpType === "number")
                        object.jumpType = options.longs === String ? String(message.jumpType) : message.jumpType;
                    else
                        object.jumpType = options.longs === String ? $util.Long.prototype.toString.call(message.jumpType) : options.longs === Number ? new $util.LongBits(message.jumpType.low >>> 0, message.jumpType.high >>> 0).toNumber(true) : message.jumpType;
                if (message.jumpUrl != null && message.hasOwnProperty("jumpUrl"))
                    object.jumpUrl = message.jumpUrl;
                if (message.categoryId != null && message.hasOwnProperty("categoryId"))
                    if (typeof message.categoryId === "number")
                        object.categoryId = options.longs === String ? String(message.categoryId) : message.categoryId;
                    else
                        object.categoryId = options.longs === String ? $util.Long.prototype.toString.call(message.categoryId) : options.longs === Number ? new $util.LongBits(message.categoryId.low >>> 0, message.categoryId.high >>> 0).toNumber(true) : message.categoryId;
                if (message.myTalkPermission != null && message.hasOwnProperty("myTalkPermission"))
                    if (typeof message.myTalkPermission === "number")
                        object.myTalkPermission = options.longs === String ? String(message.myTalkPermission) : message.myTalkPermission;
                    else
                        object.myTalkPermission = options.longs === String ? $util.Long.prototype.toString.call(message.myTalkPermission) : options.longs === Number ? new $util.LongBits(message.myTalkPermission.low >>> 0, message.myTalkPermission.high >>> 0).toNumber(true) : message.myTalkPermission;
                return object;
            };

            /**
             * Converts this ChannelInfo to JSON.
             * @function toJSON
             * @memberof kritor.guild.ChannelInfo
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ChannelInfo.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for ChannelInfo
             * @function getTypeUrl
             * @memberof kritor.guild.ChannelInfo
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            ChannelInfo.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.guild.ChannelInfo";
            };

            return ChannelInfo;
        })();

        guild.SlowModes = (function() {

            /**
             * Properties of a SlowModes.
             * @memberof kritor.guild
             * @interface ISlowModes
             * @property {number|Long|null} [slowModeKey] SlowModes slowModeKey
             * @property {string|null} [slowModeText] SlowModes slowModeText
             * @property {number|Long|null} [speakFrequency] SlowModes speakFrequency
             * @property {number|Long|null} [slowModeCircle] SlowModes slowModeCircle
             */

            /**
             * Constructs a new SlowModes.
             * @memberof kritor.guild
             * @classdesc Represents a SlowModes.
             * @implements ISlowModes
             * @constructor
             * @param {kritor.guild.ISlowModes=} [properties] Properties to set
             */
            function SlowModes(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * SlowModes slowModeKey.
             * @member {number|Long} slowModeKey
             * @memberof kritor.guild.SlowModes
             * @instance
             */
            SlowModes.prototype.slowModeKey = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * SlowModes slowModeText.
             * @member {string} slowModeText
             * @memberof kritor.guild.SlowModes
             * @instance
             */
            SlowModes.prototype.slowModeText = "";

            /**
             * SlowModes speakFrequency.
             * @member {number|Long} speakFrequency
             * @memberof kritor.guild.SlowModes
             * @instance
             */
            SlowModes.prototype.speakFrequency = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * SlowModes slowModeCircle.
             * @member {number|Long} slowModeCircle
             * @memberof kritor.guild.SlowModes
             * @instance
             */
            SlowModes.prototype.slowModeCircle = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * Creates a new SlowModes instance using the specified properties.
             * @function create
             * @memberof kritor.guild.SlowModes
             * @static
             * @param {kritor.guild.ISlowModes=} [properties] Properties to set
             * @returns {kritor.guild.SlowModes} SlowModes instance
             */
            SlowModes.create = function create(properties) {
                return new SlowModes(properties);
            };

            /**
             * Encodes the specified SlowModes message. Does not implicitly {@link kritor.guild.SlowModes.verify|verify} messages.
             * @function encode
             * @memberof kritor.guild.SlowModes
             * @static
             * @param {kritor.guild.ISlowModes} message SlowModes message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SlowModes.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.slowModeKey != null && Object.hasOwnProperty.call(message, "slowModeKey"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.slowModeKey);
                if (message.slowModeText != null && Object.hasOwnProperty.call(message, "slowModeText"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.slowModeText);
                if (message.speakFrequency != null && Object.hasOwnProperty.call(message, "speakFrequency"))
                    writer.uint32(/* id 3, wireType 0 =*/24).uint64(message.speakFrequency);
                if (message.slowModeCircle != null && Object.hasOwnProperty.call(message, "slowModeCircle"))
                    writer.uint32(/* id 4, wireType 0 =*/32).uint64(message.slowModeCircle);
                return writer;
            };

            /**
             * Encodes the specified SlowModes message, length delimited. Does not implicitly {@link kritor.guild.SlowModes.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.guild.SlowModes
             * @static
             * @param {kritor.guild.ISlowModes} message SlowModes message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SlowModes.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a SlowModes message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.guild.SlowModes
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.guild.SlowModes} SlowModes
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SlowModes.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.guild.SlowModes();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.slowModeKey = reader.uint64();
                            break;
                        }
                    case 2: {
                            message.slowModeText = reader.string();
                            break;
                        }
                    case 3: {
                            message.speakFrequency = reader.uint64();
                            break;
                        }
                    case 4: {
                            message.slowModeCircle = reader.uint64();
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
             * Decodes a SlowModes message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.guild.SlowModes
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.guild.SlowModes} SlowModes
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SlowModes.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a SlowModes message.
             * @function verify
             * @memberof kritor.guild.SlowModes
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            SlowModes.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.slowModeKey != null && message.hasOwnProperty("slowModeKey"))
                    if (!$util.isInteger(message.slowModeKey) && !(message.slowModeKey && $util.isInteger(message.slowModeKey.low) && $util.isInteger(message.slowModeKey.high)))
                        return "slowModeKey: integer|Long expected";
                if (message.slowModeText != null && message.hasOwnProperty("slowModeText"))
                    if (!$util.isString(message.slowModeText))
                        return "slowModeText: string expected";
                if (message.speakFrequency != null && message.hasOwnProperty("speakFrequency"))
                    if (!$util.isInteger(message.speakFrequency) && !(message.speakFrequency && $util.isInteger(message.speakFrequency.low) && $util.isInteger(message.speakFrequency.high)))
                        return "speakFrequency: integer|Long expected";
                if (message.slowModeCircle != null && message.hasOwnProperty("slowModeCircle"))
                    if (!$util.isInteger(message.slowModeCircle) && !(message.slowModeCircle && $util.isInteger(message.slowModeCircle.low) && $util.isInteger(message.slowModeCircle.high)))
                        return "slowModeCircle: integer|Long expected";
                return null;
            };

            /**
             * Creates a SlowModes message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.guild.SlowModes
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.guild.SlowModes} SlowModes
             */
            SlowModes.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.guild.SlowModes)
                    return object;
                let message = new $root.kritor.guild.SlowModes();
                if (object.slowModeKey != null)
                    if ($util.Long)
                        (message.slowModeKey = $util.Long.fromValue(object.slowModeKey)).unsigned = true;
                    else if (typeof object.slowModeKey === "string")
                        message.slowModeKey = parseInt(object.slowModeKey, 10);
                    else if (typeof object.slowModeKey === "number")
                        message.slowModeKey = object.slowModeKey;
                    else if (typeof object.slowModeKey === "object")
                        message.slowModeKey = new $util.LongBits(object.slowModeKey.low >>> 0, object.slowModeKey.high >>> 0).toNumber(true);
                if (object.slowModeText != null)
                    message.slowModeText = String(object.slowModeText);
                if (object.speakFrequency != null)
                    if ($util.Long)
                        (message.speakFrequency = $util.Long.fromValue(object.speakFrequency)).unsigned = true;
                    else if (typeof object.speakFrequency === "string")
                        message.speakFrequency = parseInt(object.speakFrequency, 10);
                    else if (typeof object.speakFrequency === "number")
                        message.speakFrequency = object.speakFrequency;
                    else if (typeof object.speakFrequency === "object")
                        message.speakFrequency = new $util.LongBits(object.speakFrequency.low >>> 0, object.speakFrequency.high >>> 0).toNumber(true);
                if (object.slowModeCircle != null)
                    if ($util.Long)
                        (message.slowModeCircle = $util.Long.fromValue(object.slowModeCircle)).unsigned = true;
                    else if (typeof object.slowModeCircle === "string")
                        message.slowModeCircle = parseInt(object.slowModeCircle, 10);
                    else if (typeof object.slowModeCircle === "number")
                        message.slowModeCircle = object.slowModeCircle;
                    else if (typeof object.slowModeCircle === "object")
                        message.slowModeCircle = new $util.LongBits(object.slowModeCircle.low >>> 0, object.slowModeCircle.high >>> 0).toNumber(true);
                return message;
            };

            /**
             * Creates a plain object from a SlowModes message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.guild.SlowModes
             * @static
             * @param {kritor.guild.SlowModes} message SlowModes
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            SlowModes.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.slowModeKey = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.slowModeKey = options.longs === String ? "0" : 0;
                    object.slowModeText = "";
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.speakFrequency = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.speakFrequency = options.longs === String ? "0" : 0;
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.slowModeCircle = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.slowModeCircle = options.longs === String ? "0" : 0;
                }
                if (message.slowModeKey != null && message.hasOwnProperty("slowModeKey"))
                    if (typeof message.slowModeKey === "number")
                        object.slowModeKey = options.longs === String ? String(message.slowModeKey) : message.slowModeKey;
                    else
                        object.slowModeKey = options.longs === String ? $util.Long.prototype.toString.call(message.slowModeKey) : options.longs === Number ? new $util.LongBits(message.slowModeKey.low >>> 0, message.slowModeKey.high >>> 0).toNumber(true) : message.slowModeKey;
                if (message.slowModeText != null && message.hasOwnProperty("slowModeText"))
                    object.slowModeText = message.slowModeText;
                if (message.speakFrequency != null && message.hasOwnProperty("speakFrequency"))
                    if (typeof message.speakFrequency === "number")
                        object.speakFrequency = options.longs === String ? String(message.speakFrequency) : message.speakFrequency;
                    else
                        object.speakFrequency = options.longs === String ? $util.Long.prototype.toString.call(message.speakFrequency) : options.longs === Number ? new $util.LongBits(message.speakFrequency.low >>> 0, message.speakFrequency.high >>> 0).toNumber(true) : message.speakFrequency;
                if (message.slowModeCircle != null && message.hasOwnProperty("slowModeCircle"))
                    if (typeof message.slowModeCircle === "number")
                        object.slowModeCircle = options.longs === String ? String(message.slowModeCircle) : message.slowModeCircle;
                    else
                        object.slowModeCircle = options.longs === String ? $util.Long.prototype.toString.call(message.slowModeCircle) : options.longs === Number ? new $util.LongBits(message.slowModeCircle.low >>> 0, message.slowModeCircle.high >>> 0).toNumber(true) : message.slowModeCircle;
                return object;
            };

            /**
             * Converts this SlowModes to JSON.
             * @function toJSON
             * @memberof kritor.guild.SlowModes
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            SlowModes.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for SlowModes
             * @function getTypeUrl
             * @memberof kritor.guild.SlowModes
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            SlowModes.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.guild.SlowModes";
            };

            return SlowModes;
        })();

        guild.MemberInfo = (function() {

            /**
             * Properties of a MemberInfo.
             * @memberof kritor.guild
             * @interface IMemberInfo
             * @property {number|Long|null} [tinyId] MemberInfo tinyId
             * @property {string|null} [title] MemberInfo title
             * @property {string|null} [nickname] MemberInfo nickname
             * @property {number|Long|null} [roleId] MemberInfo roleId
             * @property {string|null} [roleName] MemberInfo roleName
             * @property {number|Long|null} [roleColor] MemberInfo roleColor
             * @property {number|Long|null} [joinTime] MemberInfo joinTime
             * @property {number|Long|null} [robotType] MemberInfo robotType
             * @property {number|Long|null} [type] MemberInfo type
             * @property {boolean|null} [inBlack] MemberInfo inBlack
             * @property {number|Long|null} [platform] MemberInfo platform
             */

            /**
             * Constructs a new MemberInfo.
             * @memberof kritor.guild
             * @classdesc Represents a MemberInfo.
             * @implements IMemberInfo
             * @constructor
             * @param {kritor.guild.IMemberInfo=} [properties] Properties to set
             */
            function MemberInfo(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * MemberInfo tinyId.
             * @member {number|Long} tinyId
             * @memberof kritor.guild.MemberInfo
             * @instance
             */
            MemberInfo.prototype.tinyId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * MemberInfo title.
             * @member {string} title
             * @memberof kritor.guild.MemberInfo
             * @instance
             */
            MemberInfo.prototype.title = "";

            /**
             * MemberInfo nickname.
             * @member {string} nickname
             * @memberof kritor.guild.MemberInfo
             * @instance
             */
            MemberInfo.prototype.nickname = "";

            /**
             * MemberInfo roleId.
             * @member {number|Long} roleId
             * @memberof kritor.guild.MemberInfo
             * @instance
             */
            MemberInfo.prototype.roleId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * MemberInfo roleName.
             * @member {string} roleName
             * @memberof kritor.guild.MemberInfo
             * @instance
             */
            MemberInfo.prototype.roleName = "";

            /**
             * MemberInfo roleColor.
             * @member {number|Long} roleColor
             * @memberof kritor.guild.MemberInfo
             * @instance
             */
            MemberInfo.prototype.roleColor = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * MemberInfo joinTime.
             * @member {number|Long} joinTime
             * @memberof kritor.guild.MemberInfo
             * @instance
             */
            MemberInfo.prototype.joinTime = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * MemberInfo robotType.
             * @member {number|Long} robotType
             * @memberof kritor.guild.MemberInfo
             * @instance
             */
            MemberInfo.prototype.robotType = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * MemberInfo type.
             * @member {number|Long} type
             * @memberof kritor.guild.MemberInfo
             * @instance
             */
            MemberInfo.prototype.type = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * MemberInfo inBlack.
             * @member {boolean} inBlack
             * @memberof kritor.guild.MemberInfo
             * @instance
             */
            MemberInfo.prototype.inBlack = false;

            /**
             * MemberInfo platform.
             * @member {number|Long} platform
             * @memberof kritor.guild.MemberInfo
             * @instance
             */
            MemberInfo.prototype.platform = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * Creates a new MemberInfo instance using the specified properties.
             * @function create
             * @memberof kritor.guild.MemberInfo
             * @static
             * @param {kritor.guild.IMemberInfo=} [properties] Properties to set
             * @returns {kritor.guild.MemberInfo} MemberInfo instance
             */
            MemberInfo.create = function create(properties) {
                return new MemberInfo(properties);
            };

            /**
             * Encodes the specified MemberInfo message. Does not implicitly {@link kritor.guild.MemberInfo.verify|verify} messages.
             * @function encode
             * @memberof kritor.guild.MemberInfo
             * @static
             * @param {kritor.guild.IMemberInfo} message MemberInfo message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            MemberInfo.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.tinyId != null && Object.hasOwnProperty.call(message, "tinyId"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.tinyId);
                if (message.title != null && Object.hasOwnProperty.call(message, "title"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.title);
                if (message.nickname != null && Object.hasOwnProperty.call(message, "nickname"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.nickname);
                if (message.roleId != null && Object.hasOwnProperty.call(message, "roleId"))
                    writer.uint32(/* id 4, wireType 0 =*/32).uint64(message.roleId);
                if (message.roleName != null && Object.hasOwnProperty.call(message, "roleName"))
                    writer.uint32(/* id 5, wireType 2 =*/42).string(message.roleName);
                if (message.roleColor != null && Object.hasOwnProperty.call(message, "roleColor"))
                    writer.uint32(/* id 6, wireType 0 =*/48).uint64(message.roleColor);
                if (message.joinTime != null && Object.hasOwnProperty.call(message, "joinTime"))
                    writer.uint32(/* id 7, wireType 0 =*/56).uint64(message.joinTime);
                if (message.robotType != null && Object.hasOwnProperty.call(message, "robotType"))
                    writer.uint32(/* id 8, wireType 0 =*/64).uint64(message.robotType);
                if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                    writer.uint32(/* id 9, wireType 0 =*/72).uint64(message.type);
                if (message.inBlack != null && Object.hasOwnProperty.call(message, "inBlack"))
                    writer.uint32(/* id 10, wireType 0 =*/80).bool(message.inBlack);
                if (message.platform != null && Object.hasOwnProperty.call(message, "platform"))
                    writer.uint32(/* id 11, wireType 0 =*/88).uint64(message.platform);
                return writer;
            };

            /**
             * Encodes the specified MemberInfo message, length delimited. Does not implicitly {@link kritor.guild.MemberInfo.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.guild.MemberInfo
             * @static
             * @param {kritor.guild.IMemberInfo} message MemberInfo message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            MemberInfo.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a MemberInfo message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.guild.MemberInfo
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.guild.MemberInfo} MemberInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            MemberInfo.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.guild.MemberInfo();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.tinyId = reader.uint64();
                            break;
                        }
                    case 2: {
                            message.title = reader.string();
                            break;
                        }
                    case 3: {
                            message.nickname = reader.string();
                            break;
                        }
                    case 4: {
                            message.roleId = reader.uint64();
                            break;
                        }
                    case 5: {
                            message.roleName = reader.string();
                            break;
                        }
                    case 6: {
                            message.roleColor = reader.uint64();
                            break;
                        }
                    case 7: {
                            message.joinTime = reader.uint64();
                            break;
                        }
                    case 8: {
                            message.robotType = reader.uint64();
                            break;
                        }
                    case 9: {
                            message.type = reader.uint64();
                            break;
                        }
                    case 10: {
                            message.inBlack = reader.bool();
                            break;
                        }
                    case 11: {
                            message.platform = reader.uint64();
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
             * Decodes a MemberInfo message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.guild.MemberInfo
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.guild.MemberInfo} MemberInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            MemberInfo.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a MemberInfo message.
             * @function verify
             * @memberof kritor.guild.MemberInfo
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            MemberInfo.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.tinyId != null && message.hasOwnProperty("tinyId"))
                    if (!$util.isInteger(message.tinyId) && !(message.tinyId && $util.isInteger(message.tinyId.low) && $util.isInteger(message.tinyId.high)))
                        return "tinyId: integer|Long expected";
                if (message.title != null && message.hasOwnProperty("title"))
                    if (!$util.isString(message.title))
                        return "title: string expected";
                if (message.nickname != null && message.hasOwnProperty("nickname"))
                    if (!$util.isString(message.nickname))
                        return "nickname: string expected";
                if (message.roleId != null && message.hasOwnProperty("roleId"))
                    if (!$util.isInteger(message.roleId) && !(message.roleId && $util.isInteger(message.roleId.low) && $util.isInteger(message.roleId.high)))
                        return "roleId: integer|Long expected";
                if (message.roleName != null && message.hasOwnProperty("roleName"))
                    if (!$util.isString(message.roleName))
                        return "roleName: string expected";
                if (message.roleColor != null && message.hasOwnProperty("roleColor"))
                    if (!$util.isInteger(message.roleColor) && !(message.roleColor && $util.isInteger(message.roleColor.low) && $util.isInteger(message.roleColor.high)))
                        return "roleColor: integer|Long expected";
                if (message.joinTime != null && message.hasOwnProperty("joinTime"))
                    if (!$util.isInteger(message.joinTime) && !(message.joinTime && $util.isInteger(message.joinTime.low) && $util.isInteger(message.joinTime.high)))
                        return "joinTime: integer|Long expected";
                if (message.robotType != null && message.hasOwnProperty("robotType"))
                    if (!$util.isInteger(message.robotType) && !(message.robotType && $util.isInteger(message.robotType.low) && $util.isInteger(message.robotType.high)))
                        return "robotType: integer|Long expected";
                if (message.type != null && message.hasOwnProperty("type"))
                    if (!$util.isInteger(message.type) && !(message.type && $util.isInteger(message.type.low) && $util.isInteger(message.type.high)))
                        return "type: integer|Long expected";
                if (message.inBlack != null && message.hasOwnProperty("inBlack"))
                    if (typeof message.inBlack !== "boolean")
                        return "inBlack: boolean expected";
                if (message.platform != null && message.hasOwnProperty("platform"))
                    if (!$util.isInteger(message.platform) && !(message.platform && $util.isInteger(message.platform.low) && $util.isInteger(message.platform.high)))
                        return "platform: integer|Long expected";
                return null;
            };

            /**
             * Creates a MemberInfo message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.guild.MemberInfo
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.guild.MemberInfo} MemberInfo
             */
            MemberInfo.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.guild.MemberInfo)
                    return object;
                let message = new $root.kritor.guild.MemberInfo();
                if (object.tinyId != null)
                    if ($util.Long)
                        (message.tinyId = $util.Long.fromValue(object.tinyId)).unsigned = true;
                    else if (typeof object.tinyId === "string")
                        message.tinyId = parseInt(object.tinyId, 10);
                    else if (typeof object.tinyId === "number")
                        message.tinyId = object.tinyId;
                    else if (typeof object.tinyId === "object")
                        message.tinyId = new $util.LongBits(object.tinyId.low >>> 0, object.tinyId.high >>> 0).toNumber(true);
                if (object.title != null)
                    message.title = String(object.title);
                if (object.nickname != null)
                    message.nickname = String(object.nickname);
                if (object.roleId != null)
                    if ($util.Long)
                        (message.roleId = $util.Long.fromValue(object.roleId)).unsigned = true;
                    else if (typeof object.roleId === "string")
                        message.roleId = parseInt(object.roleId, 10);
                    else if (typeof object.roleId === "number")
                        message.roleId = object.roleId;
                    else if (typeof object.roleId === "object")
                        message.roleId = new $util.LongBits(object.roleId.low >>> 0, object.roleId.high >>> 0).toNumber(true);
                if (object.roleName != null)
                    message.roleName = String(object.roleName);
                if (object.roleColor != null)
                    if ($util.Long)
                        (message.roleColor = $util.Long.fromValue(object.roleColor)).unsigned = true;
                    else if (typeof object.roleColor === "string")
                        message.roleColor = parseInt(object.roleColor, 10);
                    else if (typeof object.roleColor === "number")
                        message.roleColor = object.roleColor;
                    else if (typeof object.roleColor === "object")
                        message.roleColor = new $util.LongBits(object.roleColor.low >>> 0, object.roleColor.high >>> 0).toNumber(true);
                if (object.joinTime != null)
                    if ($util.Long)
                        (message.joinTime = $util.Long.fromValue(object.joinTime)).unsigned = true;
                    else if (typeof object.joinTime === "string")
                        message.joinTime = parseInt(object.joinTime, 10);
                    else if (typeof object.joinTime === "number")
                        message.joinTime = object.joinTime;
                    else if (typeof object.joinTime === "object")
                        message.joinTime = new $util.LongBits(object.joinTime.low >>> 0, object.joinTime.high >>> 0).toNumber(true);
                if (object.robotType != null)
                    if ($util.Long)
                        (message.robotType = $util.Long.fromValue(object.robotType)).unsigned = true;
                    else if (typeof object.robotType === "string")
                        message.robotType = parseInt(object.robotType, 10);
                    else if (typeof object.robotType === "number")
                        message.robotType = object.robotType;
                    else if (typeof object.robotType === "object")
                        message.robotType = new $util.LongBits(object.robotType.low >>> 0, object.robotType.high >>> 0).toNumber(true);
                if (object.type != null)
                    if ($util.Long)
                        (message.type = $util.Long.fromValue(object.type)).unsigned = true;
                    else if (typeof object.type === "string")
                        message.type = parseInt(object.type, 10);
                    else if (typeof object.type === "number")
                        message.type = object.type;
                    else if (typeof object.type === "object")
                        message.type = new $util.LongBits(object.type.low >>> 0, object.type.high >>> 0).toNumber(true);
                if (object.inBlack != null)
                    message.inBlack = Boolean(object.inBlack);
                if (object.platform != null)
                    if ($util.Long)
                        (message.platform = $util.Long.fromValue(object.platform)).unsigned = true;
                    else if (typeof object.platform === "string")
                        message.platform = parseInt(object.platform, 10);
                    else if (typeof object.platform === "number")
                        message.platform = object.platform;
                    else if (typeof object.platform === "object")
                        message.platform = new $util.LongBits(object.platform.low >>> 0, object.platform.high >>> 0).toNumber(true);
                return message;
            };

            /**
             * Creates a plain object from a MemberInfo message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.guild.MemberInfo
             * @static
             * @param {kritor.guild.MemberInfo} message MemberInfo
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            MemberInfo.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.tinyId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.tinyId = options.longs === String ? "0" : 0;
                    object.title = "";
                    object.nickname = "";
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.roleId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.roleId = options.longs === String ? "0" : 0;
                    object.roleName = "";
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.roleColor = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.roleColor = options.longs === String ? "0" : 0;
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.joinTime = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.joinTime = options.longs === String ? "0" : 0;
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.robotType = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.robotType = options.longs === String ? "0" : 0;
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.type = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.type = options.longs === String ? "0" : 0;
                    object.inBlack = false;
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.platform = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.platform = options.longs === String ? "0" : 0;
                }
                if (message.tinyId != null && message.hasOwnProperty("tinyId"))
                    if (typeof message.tinyId === "number")
                        object.tinyId = options.longs === String ? String(message.tinyId) : message.tinyId;
                    else
                        object.tinyId = options.longs === String ? $util.Long.prototype.toString.call(message.tinyId) : options.longs === Number ? new $util.LongBits(message.tinyId.low >>> 0, message.tinyId.high >>> 0).toNumber(true) : message.tinyId;
                if (message.title != null && message.hasOwnProperty("title"))
                    object.title = message.title;
                if (message.nickname != null && message.hasOwnProperty("nickname"))
                    object.nickname = message.nickname;
                if (message.roleId != null && message.hasOwnProperty("roleId"))
                    if (typeof message.roleId === "number")
                        object.roleId = options.longs === String ? String(message.roleId) : message.roleId;
                    else
                        object.roleId = options.longs === String ? $util.Long.prototype.toString.call(message.roleId) : options.longs === Number ? new $util.LongBits(message.roleId.low >>> 0, message.roleId.high >>> 0).toNumber(true) : message.roleId;
                if (message.roleName != null && message.hasOwnProperty("roleName"))
                    object.roleName = message.roleName;
                if (message.roleColor != null && message.hasOwnProperty("roleColor"))
                    if (typeof message.roleColor === "number")
                        object.roleColor = options.longs === String ? String(message.roleColor) : message.roleColor;
                    else
                        object.roleColor = options.longs === String ? $util.Long.prototype.toString.call(message.roleColor) : options.longs === Number ? new $util.LongBits(message.roleColor.low >>> 0, message.roleColor.high >>> 0).toNumber(true) : message.roleColor;
                if (message.joinTime != null && message.hasOwnProperty("joinTime"))
                    if (typeof message.joinTime === "number")
                        object.joinTime = options.longs === String ? String(message.joinTime) : message.joinTime;
                    else
                        object.joinTime = options.longs === String ? $util.Long.prototype.toString.call(message.joinTime) : options.longs === Number ? new $util.LongBits(message.joinTime.low >>> 0, message.joinTime.high >>> 0).toNumber(true) : message.joinTime;
                if (message.robotType != null && message.hasOwnProperty("robotType"))
                    if (typeof message.robotType === "number")
                        object.robotType = options.longs === String ? String(message.robotType) : message.robotType;
                    else
                        object.robotType = options.longs === String ? $util.Long.prototype.toString.call(message.robotType) : options.longs === Number ? new $util.LongBits(message.robotType.low >>> 0, message.robotType.high >>> 0).toNumber(true) : message.robotType;
                if (message.type != null && message.hasOwnProperty("type"))
                    if (typeof message.type === "number")
                        object.type = options.longs === String ? String(message.type) : message.type;
                    else
                        object.type = options.longs === String ? $util.Long.prototype.toString.call(message.type) : options.longs === Number ? new $util.LongBits(message.type.low >>> 0, message.type.high >>> 0).toNumber(true) : message.type;
                if (message.inBlack != null && message.hasOwnProperty("inBlack"))
                    object.inBlack = message.inBlack;
                if (message.platform != null && message.hasOwnProperty("platform"))
                    if (typeof message.platform === "number")
                        object.platform = options.longs === String ? String(message.platform) : message.platform;
                    else
                        object.platform = options.longs === String ? $util.Long.prototype.toString.call(message.platform) : options.longs === Number ? new $util.LongBits(message.platform.low >>> 0, message.platform.high >>> 0).toNumber(true) : message.platform;
                return object;
            };

            /**
             * Converts this MemberInfo to JSON.
             * @function toJSON
             * @memberof kritor.guild.MemberInfo
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            MemberInfo.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for MemberInfo
             * @function getTypeUrl
             * @memberof kritor.guild.MemberInfo
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            MemberInfo.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.guild.MemberInfo";
            };

            return MemberInfo;
        })();

        guild.MemberProfile = (function() {

            /**
             * Properties of a MemberProfile.
             * @memberof kritor.guild
             * @interface IMemberProfile
             * @property {number|Long|null} [tinyId] MemberProfile tinyId
             * @property {string|null} [nickname] MemberProfile nickname
             * @property {string|null} [avatarUrl] MemberProfile avatarUrl
             * @property {number|Long|null} [joinTime] MemberProfile joinTime
             * @property {Array.<kritor.guild.IMemberRoleInfo>|null} [rolesInfo] MemberProfile rolesInfo
             */

            /**
             * Constructs a new MemberProfile.
             * @memberof kritor.guild
             * @classdesc Represents a MemberProfile.
             * @implements IMemberProfile
             * @constructor
             * @param {kritor.guild.IMemberProfile=} [properties] Properties to set
             */
            function MemberProfile(properties) {
                this.rolesInfo = [];
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * MemberProfile tinyId.
             * @member {number|Long} tinyId
             * @memberof kritor.guild.MemberProfile
             * @instance
             */
            MemberProfile.prototype.tinyId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * MemberProfile nickname.
             * @member {string} nickname
             * @memberof kritor.guild.MemberProfile
             * @instance
             */
            MemberProfile.prototype.nickname = "";

            /**
             * MemberProfile avatarUrl.
             * @member {string} avatarUrl
             * @memberof kritor.guild.MemberProfile
             * @instance
             */
            MemberProfile.prototype.avatarUrl = "";

            /**
             * MemberProfile joinTime.
             * @member {number|Long} joinTime
             * @memberof kritor.guild.MemberProfile
             * @instance
             */
            MemberProfile.prototype.joinTime = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * MemberProfile rolesInfo.
             * @member {Array.<kritor.guild.IMemberRoleInfo>} rolesInfo
             * @memberof kritor.guild.MemberProfile
             * @instance
             */
            MemberProfile.prototype.rolesInfo = $util.emptyArray;

            /**
             * Creates a new MemberProfile instance using the specified properties.
             * @function create
             * @memberof kritor.guild.MemberProfile
             * @static
             * @param {kritor.guild.IMemberProfile=} [properties] Properties to set
             * @returns {kritor.guild.MemberProfile} MemberProfile instance
             */
            MemberProfile.create = function create(properties) {
                return new MemberProfile(properties);
            };

            /**
             * Encodes the specified MemberProfile message. Does not implicitly {@link kritor.guild.MemberProfile.verify|verify} messages.
             * @function encode
             * @memberof kritor.guild.MemberProfile
             * @static
             * @param {kritor.guild.IMemberProfile} message MemberProfile message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            MemberProfile.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.tinyId != null && Object.hasOwnProperty.call(message, "tinyId"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.tinyId);
                if (message.nickname != null && Object.hasOwnProperty.call(message, "nickname"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.nickname);
                if (message.avatarUrl != null && Object.hasOwnProperty.call(message, "avatarUrl"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.avatarUrl);
                if (message.joinTime != null && Object.hasOwnProperty.call(message, "joinTime"))
                    writer.uint32(/* id 4, wireType 0 =*/32).uint64(message.joinTime);
                if (message.rolesInfo != null && message.rolesInfo.length)
                    for (let i = 0; i < message.rolesInfo.length; ++i)
                        $root.kritor.guild.MemberRoleInfo.encode(message.rolesInfo[i], writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified MemberProfile message, length delimited. Does not implicitly {@link kritor.guild.MemberProfile.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.guild.MemberProfile
             * @static
             * @param {kritor.guild.IMemberProfile} message MemberProfile message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            MemberProfile.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a MemberProfile message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.guild.MemberProfile
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.guild.MemberProfile} MemberProfile
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            MemberProfile.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.guild.MemberProfile();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.tinyId = reader.uint64();
                            break;
                        }
                    case 2: {
                            message.nickname = reader.string();
                            break;
                        }
                    case 3: {
                            message.avatarUrl = reader.string();
                            break;
                        }
                    case 4: {
                            message.joinTime = reader.uint64();
                            break;
                        }
                    case 5: {
                            if (!(message.rolesInfo && message.rolesInfo.length))
                                message.rolesInfo = [];
                            message.rolesInfo.push($root.kritor.guild.MemberRoleInfo.decode(reader, reader.uint32()));
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
             * Decodes a MemberProfile message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.guild.MemberProfile
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.guild.MemberProfile} MemberProfile
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            MemberProfile.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a MemberProfile message.
             * @function verify
             * @memberof kritor.guild.MemberProfile
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            MemberProfile.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.tinyId != null && message.hasOwnProperty("tinyId"))
                    if (!$util.isInteger(message.tinyId) && !(message.tinyId && $util.isInteger(message.tinyId.low) && $util.isInteger(message.tinyId.high)))
                        return "tinyId: integer|Long expected";
                if (message.nickname != null && message.hasOwnProperty("nickname"))
                    if (!$util.isString(message.nickname))
                        return "nickname: string expected";
                if (message.avatarUrl != null && message.hasOwnProperty("avatarUrl"))
                    if (!$util.isString(message.avatarUrl))
                        return "avatarUrl: string expected";
                if (message.joinTime != null && message.hasOwnProperty("joinTime"))
                    if (!$util.isInteger(message.joinTime) && !(message.joinTime && $util.isInteger(message.joinTime.low) && $util.isInteger(message.joinTime.high)))
                        return "joinTime: integer|Long expected";
                if (message.rolesInfo != null && message.hasOwnProperty("rolesInfo")) {
                    if (!Array.isArray(message.rolesInfo))
                        return "rolesInfo: array expected";
                    for (let i = 0; i < message.rolesInfo.length; ++i) {
                        let error = $root.kritor.guild.MemberRoleInfo.verify(message.rolesInfo[i]);
                        if (error)
                            return "rolesInfo." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a MemberProfile message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.guild.MemberProfile
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.guild.MemberProfile} MemberProfile
             */
            MemberProfile.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.guild.MemberProfile)
                    return object;
                let message = new $root.kritor.guild.MemberProfile();
                if (object.tinyId != null)
                    if ($util.Long)
                        (message.tinyId = $util.Long.fromValue(object.tinyId)).unsigned = true;
                    else if (typeof object.tinyId === "string")
                        message.tinyId = parseInt(object.tinyId, 10);
                    else if (typeof object.tinyId === "number")
                        message.tinyId = object.tinyId;
                    else if (typeof object.tinyId === "object")
                        message.tinyId = new $util.LongBits(object.tinyId.low >>> 0, object.tinyId.high >>> 0).toNumber(true);
                if (object.nickname != null)
                    message.nickname = String(object.nickname);
                if (object.avatarUrl != null)
                    message.avatarUrl = String(object.avatarUrl);
                if (object.joinTime != null)
                    if ($util.Long)
                        (message.joinTime = $util.Long.fromValue(object.joinTime)).unsigned = true;
                    else if (typeof object.joinTime === "string")
                        message.joinTime = parseInt(object.joinTime, 10);
                    else if (typeof object.joinTime === "number")
                        message.joinTime = object.joinTime;
                    else if (typeof object.joinTime === "object")
                        message.joinTime = new $util.LongBits(object.joinTime.low >>> 0, object.joinTime.high >>> 0).toNumber(true);
                if (object.rolesInfo) {
                    if (!Array.isArray(object.rolesInfo))
                        throw TypeError(".kritor.guild.MemberProfile.rolesInfo: array expected");
                    message.rolesInfo = [];
                    for (let i = 0; i < object.rolesInfo.length; ++i) {
                        if (typeof object.rolesInfo[i] !== "object")
                            throw TypeError(".kritor.guild.MemberProfile.rolesInfo: object expected");
                        message.rolesInfo[i] = $root.kritor.guild.MemberRoleInfo.fromObject(object.rolesInfo[i]);
                    }
                }
                return message;
            };

            /**
             * Creates a plain object from a MemberProfile message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.guild.MemberProfile
             * @static
             * @param {kritor.guild.MemberProfile} message MemberProfile
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            MemberProfile.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.arrays || options.defaults)
                    object.rolesInfo = [];
                if (options.defaults) {
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.tinyId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.tinyId = options.longs === String ? "0" : 0;
                    object.nickname = "";
                    object.avatarUrl = "";
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.joinTime = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.joinTime = options.longs === String ? "0" : 0;
                }
                if (message.tinyId != null && message.hasOwnProperty("tinyId"))
                    if (typeof message.tinyId === "number")
                        object.tinyId = options.longs === String ? String(message.tinyId) : message.tinyId;
                    else
                        object.tinyId = options.longs === String ? $util.Long.prototype.toString.call(message.tinyId) : options.longs === Number ? new $util.LongBits(message.tinyId.low >>> 0, message.tinyId.high >>> 0).toNumber(true) : message.tinyId;
                if (message.nickname != null && message.hasOwnProperty("nickname"))
                    object.nickname = message.nickname;
                if (message.avatarUrl != null && message.hasOwnProperty("avatarUrl"))
                    object.avatarUrl = message.avatarUrl;
                if (message.joinTime != null && message.hasOwnProperty("joinTime"))
                    if (typeof message.joinTime === "number")
                        object.joinTime = options.longs === String ? String(message.joinTime) : message.joinTime;
                    else
                        object.joinTime = options.longs === String ? $util.Long.prototype.toString.call(message.joinTime) : options.longs === Number ? new $util.LongBits(message.joinTime.low >>> 0, message.joinTime.high >>> 0).toNumber(true) : message.joinTime;
                if (message.rolesInfo && message.rolesInfo.length) {
                    object.rolesInfo = [];
                    for (let j = 0; j < message.rolesInfo.length; ++j)
                        object.rolesInfo[j] = $root.kritor.guild.MemberRoleInfo.toObject(message.rolesInfo[j], options);
                }
                return object;
            };

            /**
             * Converts this MemberProfile to JSON.
             * @function toJSON
             * @memberof kritor.guild.MemberProfile
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            MemberProfile.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for MemberProfile
             * @function getTypeUrl
             * @memberof kritor.guild.MemberProfile
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            MemberProfile.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.guild.MemberProfile";
            };

            return MemberProfile;
        })();

        guild.PermissionInfo = (function() {

            /**
             * Properties of a PermissionInfo.
             * @memberof kritor.guild
             * @interface IPermissionInfo
             * @property {number|Long|null} [rootId] PermissionInfo rootId
             * @property {Array.<number|Long>|null} [childIds] PermissionInfo childIds
             */

            /**
             * Constructs a new PermissionInfo.
             * @memberof kritor.guild
             * @classdesc Represents a PermissionInfo.
             * @implements IPermissionInfo
             * @constructor
             * @param {kritor.guild.IPermissionInfo=} [properties] Properties to set
             */
            function PermissionInfo(properties) {
                this.childIds = [];
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * PermissionInfo rootId.
             * @member {number|Long} rootId
             * @memberof kritor.guild.PermissionInfo
             * @instance
             */
            PermissionInfo.prototype.rootId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * PermissionInfo childIds.
             * @member {Array.<number|Long>} childIds
             * @memberof kritor.guild.PermissionInfo
             * @instance
             */
            PermissionInfo.prototype.childIds = $util.emptyArray;

            /**
             * Creates a new PermissionInfo instance using the specified properties.
             * @function create
             * @memberof kritor.guild.PermissionInfo
             * @static
             * @param {kritor.guild.IPermissionInfo=} [properties] Properties to set
             * @returns {kritor.guild.PermissionInfo} PermissionInfo instance
             */
            PermissionInfo.create = function create(properties) {
                return new PermissionInfo(properties);
            };

            /**
             * Encodes the specified PermissionInfo message. Does not implicitly {@link kritor.guild.PermissionInfo.verify|verify} messages.
             * @function encode
             * @memberof kritor.guild.PermissionInfo
             * @static
             * @param {kritor.guild.IPermissionInfo} message PermissionInfo message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            PermissionInfo.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.rootId != null && Object.hasOwnProperty.call(message, "rootId"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.rootId);
                if (message.childIds != null && message.childIds.length) {
                    writer.uint32(/* id 2, wireType 2 =*/18).fork();
                    for (let i = 0; i < message.childIds.length; ++i)
                        writer.uint64(message.childIds[i]);
                    writer.ldelim();
                }
                return writer;
            };

            /**
             * Encodes the specified PermissionInfo message, length delimited. Does not implicitly {@link kritor.guild.PermissionInfo.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.guild.PermissionInfo
             * @static
             * @param {kritor.guild.IPermissionInfo} message PermissionInfo message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            PermissionInfo.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a PermissionInfo message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.guild.PermissionInfo
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.guild.PermissionInfo} PermissionInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            PermissionInfo.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.guild.PermissionInfo();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.rootId = reader.uint64();
                            break;
                        }
                    case 2: {
                            if (!(message.childIds && message.childIds.length))
                                message.childIds = [];
                            if ((tag & 7) === 2) {
                                let end2 = reader.uint32() + reader.pos;
                                while (reader.pos < end2)
                                    message.childIds.push(reader.uint64());
                            } else
                                message.childIds.push(reader.uint64());
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
             * Decodes a PermissionInfo message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.guild.PermissionInfo
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.guild.PermissionInfo} PermissionInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            PermissionInfo.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a PermissionInfo message.
             * @function verify
             * @memberof kritor.guild.PermissionInfo
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            PermissionInfo.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.rootId != null && message.hasOwnProperty("rootId"))
                    if (!$util.isInteger(message.rootId) && !(message.rootId && $util.isInteger(message.rootId.low) && $util.isInteger(message.rootId.high)))
                        return "rootId: integer|Long expected";
                if (message.childIds != null && message.hasOwnProperty("childIds")) {
                    if (!Array.isArray(message.childIds))
                        return "childIds: array expected";
                    for (let i = 0; i < message.childIds.length; ++i)
                        if (!$util.isInteger(message.childIds[i]) && !(message.childIds[i] && $util.isInteger(message.childIds[i].low) && $util.isInteger(message.childIds[i].high)))
                            return "childIds: integer|Long[] expected";
                }
                return null;
            };

            /**
             * Creates a PermissionInfo message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.guild.PermissionInfo
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.guild.PermissionInfo} PermissionInfo
             */
            PermissionInfo.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.guild.PermissionInfo)
                    return object;
                let message = new $root.kritor.guild.PermissionInfo();
                if (object.rootId != null)
                    if ($util.Long)
                        (message.rootId = $util.Long.fromValue(object.rootId)).unsigned = true;
                    else if (typeof object.rootId === "string")
                        message.rootId = parseInt(object.rootId, 10);
                    else if (typeof object.rootId === "number")
                        message.rootId = object.rootId;
                    else if (typeof object.rootId === "object")
                        message.rootId = new $util.LongBits(object.rootId.low >>> 0, object.rootId.high >>> 0).toNumber(true);
                if (object.childIds) {
                    if (!Array.isArray(object.childIds))
                        throw TypeError(".kritor.guild.PermissionInfo.childIds: array expected");
                    message.childIds = [];
                    for (let i = 0; i < object.childIds.length; ++i)
                        if ($util.Long)
                            (message.childIds[i] = $util.Long.fromValue(object.childIds[i])).unsigned = true;
                        else if (typeof object.childIds[i] === "string")
                            message.childIds[i] = parseInt(object.childIds[i], 10);
                        else if (typeof object.childIds[i] === "number")
                            message.childIds[i] = object.childIds[i];
                        else if (typeof object.childIds[i] === "object")
                            message.childIds[i] = new $util.LongBits(object.childIds[i].low >>> 0, object.childIds[i].high >>> 0).toNumber(true);
                }
                return message;
            };

            /**
             * Creates a plain object from a PermissionInfo message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.guild.PermissionInfo
             * @static
             * @param {kritor.guild.PermissionInfo} message PermissionInfo
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            PermissionInfo.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.arrays || options.defaults)
                    object.childIds = [];
                if (options.defaults)
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.rootId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.rootId = options.longs === String ? "0" : 0;
                if (message.rootId != null && message.hasOwnProperty("rootId"))
                    if (typeof message.rootId === "number")
                        object.rootId = options.longs === String ? String(message.rootId) : message.rootId;
                    else
                        object.rootId = options.longs === String ? $util.Long.prototype.toString.call(message.rootId) : options.longs === Number ? new $util.LongBits(message.rootId.low >>> 0, message.rootId.high >>> 0).toNumber(true) : message.rootId;
                if (message.childIds && message.childIds.length) {
                    object.childIds = [];
                    for (let j = 0; j < message.childIds.length; ++j)
                        if (typeof message.childIds[j] === "number")
                            object.childIds[j] = options.longs === String ? String(message.childIds[j]) : message.childIds[j];
                        else
                            object.childIds[j] = options.longs === String ? $util.Long.prototype.toString.call(message.childIds[j]) : options.longs === Number ? new $util.LongBits(message.childIds[j].low >>> 0, message.childIds[j].high >>> 0).toNumber(true) : message.childIds[j];
                }
                return object;
            };

            /**
             * Converts this PermissionInfo to JSON.
             * @function toJSON
             * @memberof kritor.guild.PermissionInfo
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            PermissionInfo.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for PermissionInfo
             * @function getTypeUrl
             * @memberof kritor.guild.PermissionInfo
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            PermissionInfo.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.guild.PermissionInfo";
            };

            return PermissionInfo;
        })();

        guild.MemberRoleInfo = (function() {

            /**
             * Properties of a MemberRoleInfo.
             * @memberof kritor.guild
             * @interface IMemberRoleInfo
             * @property {number|Long|null} [roleId] MemberRoleInfo roleId
             * @property {string|null} [roleName] MemberRoleInfo roleName
             * @property {number|Long|null} [color] MemberRoleInfo color
             * @property {Array.<kritor.guild.IPermissionInfo>|null} [permissions] MemberRoleInfo permissions
             * @property {number|Long|null} [type] MemberRoleInfo type
             * @property {string|null} [displayName] MemberRoleInfo displayName
             */

            /**
             * Constructs a new MemberRoleInfo.
             * @memberof kritor.guild
             * @classdesc Represents a MemberRoleInfo.
             * @implements IMemberRoleInfo
             * @constructor
             * @param {kritor.guild.IMemberRoleInfo=} [properties] Properties to set
             */
            function MemberRoleInfo(properties) {
                this.permissions = [];
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * MemberRoleInfo roleId.
             * @member {number|Long} roleId
             * @memberof kritor.guild.MemberRoleInfo
             * @instance
             */
            MemberRoleInfo.prototype.roleId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * MemberRoleInfo roleName.
             * @member {string} roleName
             * @memberof kritor.guild.MemberRoleInfo
             * @instance
             */
            MemberRoleInfo.prototype.roleName = "";

            /**
             * MemberRoleInfo color.
             * @member {number|Long} color
             * @memberof kritor.guild.MemberRoleInfo
             * @instance
             */
            MemberRoleInfo.prototype.color = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * MemberRoleInfo permissions.
             * @member {Array.<kritor.guild.IPermissionInfo>} permissions
             * @memberof kritor.guild.MemberRoleInfo
             * @instance
             */
            MemberRoleInfo.prototype.permissions = $util.emptyArray;

            /**
             * MemberRoleInfo type.
             * @member {number|Long} type
             * @memberof kritor.guild.MemberRoleInfo
             * @instance
             */
            MemberRoleInfo.prototype.type = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * MemberRoleInfo displayName.
             * @member {string} displayName
             * @memberof kritor.guild.MemberRoleInfo
             * @instance
             */
            MemberRoleInfo.prototype.displayName = "";

            /**
             * Creates a new MemberRoleInfo instance using the specified properties.
             * @function create
             * @memberof kritor.guild.MemberRoleInfo
             * @static
             * @param {kritor.guild.IMemberRoleInfo=} [properties] Properties to set
             * @returns {kritor.guild.MemberRoleInfo} MemberRoleInfo instance
             */
            MemberRoleInfo.create = function create(properties) {
                return new MemberRoleInfo(properties);
            };

            /**
             * Encodes the specified MemberRoleInfo message. Does not implicitly {@link kritor.guild.MemberRoleInfo.verify|verify} messages.
             * @function encode
             * @memberof kritor.guild.MemberRoleInfo
             * @static
             * @param {kritor.guild.IMemberRoleInfo} message MemberRoleInfo message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            MemberRoleInfo.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.roleId != null && Object.hasOwnProperty.call(message, "roleId"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.roleId);
                if (message.roleName != null && Object.hasOwnProperty.call(message, "roleName"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.roleName);
                if (message.color != null && Object.hasOwnProperty.call(message, "color"))
                    writer.uint32(/* id 3, wireType 0 =*/24).uint64(message.color);
                if (message.permissions != null && message.permissions.length)
                    for (let i = 0; i < message.permissions.length; ++i)
                        $root.kritor.guild.PermissionInfo.encode(message.permissions[i], writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                    writer.uint32(/* id 5, wireType 0 =*/40).uint64(message.type);
                if (message.displayName != null && Object.hasOwnProperty.call(message, "displayName"))
                    writer.uint32(/* id 6, wireType 2 =*/50).string(message.displayName);
                return writer;
            };

            /**
             * Encodes the specified MemberRoleInfo message, length delimited. Does not implicitly {@link kritor.guild.MemberRoleInfo.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.guild.MemberRoleInfo
             * @static
             * @param {kritor.guild.IMemberRoleInfo} message MemberRoleInfo message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            MemberRoleInfo.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a MemberRoleInfo message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.guild.MemberRoleInfo
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.guild.MemberRoleInfo} MemberRoleInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            MemberRoleInfo.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.guild.MemberRoleInfo();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.roleId = reader.uint64();
                            break;
                        }
                    case 2: {
                            message.roleName = reader.string();
                            break;
                        }
                    case 3: {
                            message.color = reader.uint64();
                            break;
                        }
                    case 4: {
                            if (!(message.permissions && message.permissions.length))
                                message.permissions = [];
                            message.permissions.push($root.kritor.guild.PermissionInfo.decode(reader, reader.uint32()));
                            break;
                        }
                    case 5: {
                            message.type = reader.uint64();
                            break;
                        }
                    case 6: {
                            message.displayName = reader.string();
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
             * Decodes a MemberRoleInfo message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.guild.MemberRoleInfo
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.guild.MemberRoleInfo} MemberRoleInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            MemberRoleInfo.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a MemberRoleInfo message.
             * @function verify
             * @memberof kritor.guild.MemberRoleInfo
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            MemberRoleInfo.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.roleId != null && message.hasOwnProperty("roleId"))
                    if (!$util.isInteger(message.roleId) && !(message.roleId && $util.isInteger(message.roleId.low) && $util.isInteger(message.roleId.high)))
                        return "roleId: integer|Long expected";
                if (message.roleName != null && message.hasOwnProperty("roleName"))
                    if (!$util.isString(message.roleName))
                        return "roleName: string expected";
                if (message.color != null && message.hasOwnProperty("color"))
                    if (!$util.isInteger(message.color) && !(message.color && $util.isInteger(message.color.low) && $util.isInteger(message.color.high)))
                        return "color: integer|Long expected";
                if (message.permissions != null && message.hasOwnProperty("permissions")) {
                    if (!Array.isArray(message.permissions))
                        return "permissions: array expected";
                    for (let i = 0; i < message.permissions.length; ++i) {
                        let error = $root.kritor.guild.PermissionInfo.verify(message.permissions[i]);
                        if (error)
                            return "permissions." + error;
                    }
                }
                if (message.type != null && message.hasOwnProperty("type"))
                    if (!$util.isInteger(message.type) && !(message.type && $util.isInteger(message.type.low) && $util.isInteger(message.type.high)))
                        return "type: integer|Long expected";
                if (message.displayName != null && message.hasOwnProperty("displayName"))
                    if (!$util.isString(message.displayName))
                        return "displayName: string expected";
                return null;
            };

            /**
             * Creates a MemberRoleInfo message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.guild.MemberRoleInfo
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.guild.MemberRoleInfo} MemberRoleInfo
             */
            MemberRoleInfo.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.guild.MemberRoleInfo)
                    return object;
                let message = new $root.kritor.guild.MemberRoleInfo();
                if (object.roleId != null)
                    if ($util.Long)
                        (message.roleId = $util.Long.fromValue(object.roleId)).unsigned = true;
                    else if (typeof object.roleId === "string")
                        message.roleId = parseInt(object.roleId, 10);
                    else if (typeof object.roleId === "number")
                        message.roleId = object.roleId;
                    else if (typeof object.roleId === "object")
                        message.roleId = new $util.LongBits(object.roleId.low >>> 0, object.roleId.high >>> 0).toNumber(true);
                if (object.roleName != null)
                    message.roleName = String(object.roleName);
                if (object.color != null)
                    if ($util.Long)
                        (message.color = $util.Long.fromValue(object.color)).unsigned = true;
                    else if (typeof object.color === "string")
                        message.color = parseInt(object.color, 10);
                    else if (typeof object.color === "number")
                        message.color = object.color;
                    else if (typeof object.color === "object")
                        message.color = new $util.LongBits(object.color.low >>> 0, object.color.high >>> 0).toNumber(true);
                if (object.permissions) {
                    if (!Array.isArray(object.permissions))
                        throw TypeError(".kritor.guild.MemberRoleInfo.permissions: array expected");
                    message.permissions = [];
                    for (let i = 0; i < object.permissions.length; ++i) {
                        if (typeof object.permissions[i] !== "object")
                            throw TypeError(".kritor.guild.MemberRoleInfo.permissions: object expected");
                        message.permissions[i] = $root.kritor.guild.PermissionInfo.fromObject(object.permissions[i]);
                    }
                }
                if (object.type != null)
                    if ($util.Long)
                        (message.type = $util.Long.fromValue(object.type)).unsigned = true;
                    else if (typeof object.type === "string")
                        message.type = parseInt(object.type, 10);
                    else if (typeof object.type === "number")
                        message.type = object.type;
                    else if (typeof object.type === "object")
                        message.type = new $util.LongBits(object.type.low >>> 0, object.type.high >>> 0).toNumber(true);
                if (object.displayName != null)
                    message.displayName = String(object.displayName);
                return message;
            };

            /**
             * Creates a plain object from a MemberRoleInfo message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.guild.MemberRoleInfo
             * @static
             * @param {kritor.guild.MemberRoleInfo} message MemberRoleInfo
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            MemberRoleInfo.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.arrays || options.defaults)
                    object.permissions = [];
                if (options.defaults) {
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.roleId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.roleId = options.longs === String ? "0" : 0;
                    object.roleName = "";
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.color = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.color = options.longs === String ? "0" : 0;
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.type = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.type = options.longs === String ? "0" : 0;
                    object.displayName = "";
                }
                if (message.roleId != null && message.hasOwnProperty("roleId"))
                    if (typeof message.roleId === "number")
                        object.roleId = options.longs === String ? String(message.roleId) : message.roleId;
                    else
                        object.roleId = options.longs === String ? $util.Long.prototype.toString.call(message.roleId) : options.longs === Number ? new $util.LongBits(message.roleId.low >>> 0, message.roleId.high >>> 0).toNumber(true) : message.roleId;
                if (message.roleName != null && message.hasOwnProperty("roleName"))
                    object.roleName = message.roleName;
                if (message.color != null && message.hasOwnProperty("color"))
                    if (typeof message.color === "number")
                        object.color = options.longs === String ? String(message.color) : message.color;
                    else
                        object.color = options.longs === String ? $util.Long.prototype.toString.call(message.color) : options.longs === Number ? new $util.LongBits(message.color.low >>> 0, message.color.high >>> 0).toNumber(true) : message.color;
                if (message.permissions && message.permissions.length) {
                    object.permissions = [];
                    for (let j = 0; j < message.permissions.length; ++j)
                        object.permissions[j] = $root.kritor.guild.PermissionInfo.toObject(message.permissions[j], options);
                }
                if (message.type != null && message.hasOwnProperty("type"))
                    if (typeof message.type === "number")
                        object.type = options.longs === String ? String(message.type) : message.type;
                    else
                        object.type = options.longs === String ? $util.Long.prototype.toString.call(message.type) : options.longs === Number ? new $util.LongBits(message.type.low >>> 0, message.type.high >>> 0).toNumber(true) : message.type;
                if (message.displayName != null && message.hasOwnProperty("displayName"))
                    object.displayName = message.displayName;
                return object;
            };

            /**
             * Converts this MemberRoleInfo to JSON.
             * @function toJSON
             * @memberof kritor.guild.MemberRoleInfo
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            MemberRoleInfo.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for MemberRoleInfo
             * @function getTypeUrl
             * @memberof kritor.guild.MemberRoleInfo
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            MemberRoleInfo.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.guild.MemberRoleInfo";
            };

            return MemberRoleInfo;
        })();

        guild.RoleInfo = (function() {

            /**
             * Properties of a RoleInfo.
             * @memberof kritor.guild
             * @interface IRoleInfo
             * @property {number|Long|null} [roleId] RoleInfo roleId
             * @property {string|null} [roleName] RoleInfo roleName
             * @property {number|Long|null} [color] RoleInfo color
             * @property {Array.<kritor.guild.IPermissionInfo>|null} [permissions] RoleInfo permissions
             * @property {boolean|null} [disabled] RoleInfo disabled
             * @property {boolean|null} [independent] RoleInfo independent
             * @property {number|Long|null} [maxCount] RoleInfo maxCount
             * @property {number|Long|null} [memberCount] RoleInfo memberCount
             * @property {boolean|null} [owned] RoleInfo owned
             */

            /**
             * Constructs a new RoleInfo.
             * @memberof kritor.guild
             * @classdesc Represents a RoleInfo.
             * @implements IRoleInfo
             * @constructor
             * @param {kritor.guild.IRoleInfo=} [properties] Properties to set
             */
            function RoleInfo(properties) {
                this.permissions = [];
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * RoleInfo roleId.
             * @member {number|Long} roleId
             * @memberof kritor.guild.RoleInfo
             * @instance
             */
            RoleInfo.prototype.roleId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * RoleInfo roleName.
             * @member {string} roleName
             * @memberof kritor.guild.RoleInfo
             * @instance
             */
            RoleInfo.prototype.roleName = "";

            /**
             * RoleInfo color.
             * @member {number|Long} color
             * @memberof kritor.guild.RoleInfo
             * @instance
             */
            RoleInfo.prototype.color = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * RoleInfo permissions.
             * @member {Array.<kritor.guild.IPermissionInfo>} permissions
             * @memberof kritor.guild.RoleInfo
             * @instance
             */
            RoleInfo.prototype.permissions = $util.emptyArray;

            /**
             * RoleInfo disabled.
             * @member {boolean} disabled
             * @memberof kritor.guild.RoleInfo
             * @instance
             */
            RoleInfo.prototype.disabled = false;

            /**
             * RoleInfo independent.
             * @member {boolean} independent
             * @memberof kritor.guild.RoleInfo
             * @instance
             */
            RoleInfo.prototype.independent = false;

            /**
             * RoleInfo maxCount.
             * @member {number|Long} maxCount
             * @memberof kritor.guild.RoleInfo
             * @instance
             */
            RoleInfo.prototype.maxCount = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * RoleInfo memberCount.
             * @member {number|Long} memberCount
             * @memberof kritor.guild.RoleInfo
             * @instance
             */
            RoleInfo.prototype.memberCount = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * RoleInfo owned.
             * @member {boolean} owned
             * @memberof kritor.guild.RoleInfo
             * @instance
             */
            RoleInfo.prototype.owned = false;

            /**
             * Creates a new RoleInfo instance using the specified properties.
             * @function create
             * @memberof kritor.guild.RoleInfo
             * @static
             * @param {kritor.guild.IRoleInfo=} [properties] Properties to set
             * @returns {kritor.guild.RoleInfo} RoleInfo instance
             */
            RoleInfo.create = function create(properties) {
                return new RoleInfo(properties);
            };

            /**
             * Encodes the specified RoleInfo message. Does not implicitly {@link kritor.guild.RoleInfo.verify|verify} messages.
             * @function encode
             * @memberof kritor.guild.RoleInfo
             * @static
             * @param {kritor.guild.IRoleInfo} message RoleInfo message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            RoleInfo.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.roleId != null && Object.hasOwnProperty.call(message, "roleId"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.roleId);
                if (message.roleName != null && Object.hasOwnProperty.call(message, "roleName"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.roleName);
                if (message.color != null && Object.hasOwnProperty.call(message, "color"))
                    writer.uint32(/* id 3, wireType 0 =*/24).uint64(message.color);
                if (message.permissions != null && message.permissions.length)
                    for (let i = 0; i < message.permissions.length; ++i)
                        $root.kritor.guild.PermissionInfo.encode(message.permissions[i], writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                if (message.disabled != null && Object.hasOwnProperty.call(message, "disabled"))
                    writer.uint32(/* id 5, wireType 0 =*/40).bool(message.disabled);
                if (message.independent != null && Object.hasOwnProperty.call(message, "independent"))
                    writer.uint32(/* id 6, wireType 0 =*/48).bool(message.independent);
                if (message.maxCount != null && Object.hasOwnProperty.call(message, "maxCount"))
                    writer.uint32(/* id 7, wireType 0 =*/56).uint64(message.maxCount);
                if (message.memberCount != null && Object.hasOwnProperty.call(message, "memberCount"))
                    writer.uint32(/* id 8, wireType 0 =*/64).uint64(message.memberCount);
                if (message.owned != null && Object.hasOwnProperty.call(message, "owned"))
                    writer.uint32(/* id 9, wireType 0 =*/72).bool(message.owned);
                return writer;
            };

            /**
             * Encodes the specified RoleInfo message, length delimited. Does not implicitly {@link kritor.guild.RoleInfo.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.guild.RoleInfo
             * @static
             * @param {kritor.guild.IRoleInfo} message RoleInfo message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            RoleInfo.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a RoleInfo message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.guild.RoleInfo
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.guild.RoleInfo} RoleInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            RoleInfo.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.guild.RoleInfo();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.roleId = reader.uint64();
                            break;
                        }
                    case 2: {
                            message.roleName = reader.string();
                            break;
                        }
                    case 3: {
                            message.color = reader.uint64();
                            break;
                        }
                    case 4: {
                            if (!(message.permissions && message.permissions.length))
                                message.permissions = [];
                            message.permissions.push($root.kritor.guild.PermissionInfo.decode(reader, reader.uint32()));
                            break;
                        }
                    case 5: {
                            message.disabled = reader.bool();
                            break;
                        }
                    case 6: {
                            message.independent = reader.bool();
                            break;
                        }
                    case 7: {
                            message.maxCount = reader.uint64();
                            break;
                        }
                    case 8: {
                            message.memberCount = reader.uint64();
                            break;
                        }
                    case 9: {
                            message.owned = reader.bool();
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
             * Decodes a RoleInfo message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.guild.RoleInfo
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.guild.RoleInfo} RoleInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            RoleInfo.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a RoleInfo message.
             * @function verify
             * @memberof kritor.guild.RoleInfo
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            RoleInfo.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.roleId != null && message.hasOwnProperty("roleId"))
                    if (!$util.isInteger(message.roleId) && !(message.roleId && $util.isInteger(message.roleId.low) && $util.isInteger(message.roleId.high)))
                        return "roleId: integer|Long expected";
                if (message.roleName != null && message.hasOwnProperty("roleName"))
                    if (!$util.isString(message.roleName))
                        return "roleName: string expected";
                if (message.color != null && message.hasOwnProperty("color"))
                    if (!$util.isInteger(message.color) && !(message.color && $util.isInteger(message.color.low) && $util.isInteger(message.color.high)))
                        return "color: integer|Long expected";
                if (message.permissions != null && message.hasOwnProperty("permissions")) {
                    if (!Array.isArray(message.permissions))
                        return "permissions: array expected";
                    for (let i = 0; i < message.permissions.length; ++i) {
                        let error = $root.kritor.guild.PermissionInfo.verify(message.permissions[i]);
                        if (error)
                            return "permissions." + error;
                    }
                }
                if (message.disabled != null && message.hasOwnProperty("disabled"))
                    if (typeof message.disabled !== "boolean")
                        return "disabled: boolean expected";
                if (message.independent != null && message.hasOwnProperty("independent"))
                    if (typeof message.independent !== "boolean")
                        return "independent: boolean expected";
                if (message.maxCount != null && message.hasOwnProperty("maxCount"))
                    if (!$util.isInteger(message.maxCount) && !(message.maxCount && $util.isInteger(message.maxCount.low) && $util.isInteger(message.maxCount.high)))
                        return "maxCount: integer|Long expected";
                if (message.memberCount != null && message.hasOwnProperty("memberCount"))
                    if (!$util.isInteger(message.memberCount) && !(message.memberCount && $util.isInteger(message.memberCount.low) && $util.isInteger(message.memberCount.high)))
                        return "memberCount: integer|Long expected";
                if (message.owned != null && message.hasOwnProperty("owned"))
                    if (typeof message.owned !== "boolean")
                        return "owned: boolean expected";
                return null;
            };

            /**
             * Creates a RoleInfo message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.guild.RoleInfo
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.guild.RoleInfo} RoleInfo
             */
            RoleInfo.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.guild.RoleInfo)
                    return object;
                let message = new $root.kritor.guild.RoleInfo();
                if (object.roleId != null)
                    if ($util.Long)
                        (message.roleId = $util.Long.fromValue(object.roleId)).unsigned = true;
                    else if (typeof object.roleId === "string")
                        message.roleId = parseInt(object.roleId, 10);
                    else if (typeof object.roleId === "number")
                        message.roleId = object.roleId;
                    else if (typeof object.roleId === "object")
                        message.roleId = new $util.LongBits(object.roleId.low >>> 0, object.roleId.high >>> 0).toNumber(true);
                if (object.roleName != null)
                    message.roleName = String(object.roleName);
                if (object.color != null)
                    if ($util.Long)
                        (message.color = $util.Long.fromValue(object.color)).unsigned = true;
                    else if (typeof object.color === "string")
                        message.color = parseInt(object.color, 10);
                    else if (typeof object.color === "number")
                        message.color = object.color;
                    else if (typeof object.color === "object")
                        message.color = new $util.LongBits(object.color.low >>> 0, object.color.high >>> 0).toNumber(true);
                if (object.permissions) {
                    if (!Array.isArray(object.permissions))
                        throw TypeError(".kritor.guild.RoleInfo.permissions: array expected");
                    message.permissions = [];
                    for (let i = 0; i < object.permissions.length; ++i) {
                        if (typeof object.permissions[i] !== "object")
                            throw TypeError(".kritor.guild.RoleInfo.permissions: object expected");
                        message.permissions[i] = $root.kritor.guild.PermissionInfo.fromObject(object.permissions[i]);
                    }
                }
                if (object.disabled != null)
                    message.disabled = Boolean(object.disabled);
                if (object.independent != null)
                    message.independent = Boolean(object.independent);
                if (object.maxCount != null)
                    if ($util.Long)
                        (message.maxCount = $util.Long.fromValue(object.maxCount)).unsigned = true;
                    else if (typeof object.maxCount === "string")
                        message.maxCount = parseInt(object.maxCount, 10);
                    else if (typeof object.maxCount === "number")
                        message.maxCount = object.maxCount;
                    else if (typeof object.maxCount === "object")
                        message.maxCount = new $util.LongBits(object.maxCount.low >>> 0, object.maxCount.high >>> 0).toNumber(true);
                if (object.memberCount != null)
                    if ($util.Long)
                        (message.memberCount = $util.Long.fromValue(object.memberCount)).unsigned = true;
                    else if (typeof object.memberCount === "string")
                        message.memberCount = parseInt(object.memberCount, 10);
                    else if (typeof object.memberCount === "number")
                        message.memberCount = object.memberCount;
                    else if (typeof object.memberCount === "object")
                        message.memberCount = new $util.LongBits(object.memberCount.low >>> 0, object.memberCount.high >>> 0).toNumber(true);
                if (object.owned != null)
                    message.owned = Boolean(object.owned);
                return message;
            };

            /**
             * Creates a plain object from a RoleInfo message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.guild.RoleInfo
             * @static
             * @param {kritor.guild.RoleInfo} message RoleInfo
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            RoleInfo.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.arrays || options.defaults)
                    object.permissions = [];
                if (options.defaults) {
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.roleId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.roleId = options.longs === String ? "0" : 0;
                    object.roleName = "";
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.color = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.color = options.longs === String ? "0" : 0;
                    object.disabled = false;
                    object.independent = false;
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.maxCount = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.maxCount = options.longs === String ? "0" : 0;
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.memberCount = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.memberCount = options.longs === String ? "0" : 0;
                    object.owned = false;
                }
                if (message.roleId != null && message.hasOwnProperty("roleId"))
                    if (typeof message.roleId === "number")
                        object.roleId = options.longs === String ? String(message.roleId) : message.roleId;
                    else
                        object.roleId = options.longs === String ? $util.Long.prototype.toString.call(message.roleId) : options.longs === Number ? new $util.LongBits(message.roleId.low >>> 0, message.roleId.high >>> 0).toNumber(true) : message.roleId;
                if (message.roleName != null && message.hasOwnProperty("roleName"))
                    object.roleName = message.roleName;
                if (message.color != null && message.hasOwnProperty("color"))
                    if (typeof message.color === "number")
                        object.color = options.longs === String ? String(message.color) : message.color;
                    else
                        object.color = options.longs === String ? $util.Long.prototype.toString.call(message.color) : options.longs === Number ? new $util.LongBits(message.color.low >>> 0, message.color.high >>> 0).toNumber(true) : message.color;
                if (message.permissions && message.permissions.length) {
                    object.permissions = [];
                    for (let j = 0; j < message.permissions.length; ++j)
                        object.permissions[j] = $root.kritor.guild.PermissionInfo.toObject(message.permissions[j], options);
                }
                if (message.disabled != null && message.hasOwnProperty("disabled"))
                    object.disabled = message.disabled;
                if (message.independent != null && message.hasOwnProperty("independent"))
                    object.independent = message.independent;
                if (message.maxCount != null && message.hasOwnProperty("maxCount"))
                    if (typeof message.maxCount === "number")
                        object.maxCount = options.longs === String ? String(message.maxCount) : message.maxCount;
                    else
                        object.maxCount = options.longs === String ? $util.Long.prototype.toString.call(message.maxCount) : options.longs === Number ? new $util.LongBits(message.maxCount.low >>> 0, message.maxCount.high >>> 0).toNumber(true) : message.maxCount;
                if (message.memberCount != null && message.hasOwnProperty("memberCount"))
                    if (typeof message.memberCount === "number")
                        object.memberCount = options.longs === String ? String(message.memberCount) : message.memberCount;
                    else
                        object.memberCount = options.longs === String ? $util.Long.prototype.toString.call(message.memberCount) : options.longs === Number ? new $util.LongBits(message.memberCount.low >>> 0, message.memberCount.high >>> 0).toNumber(true) : message.memberCount;
                if (message.owned != null && message.hasOwnProperty("owned"))
                    object.owned = message.owned;
                return object;
            };

            /**
             * Converts this RoleInfo to JSON.
             * @function toJSON
             * @memberof kritor.guild.RoleInfo
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            RoleInfo.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for RoleInfo
             * @function getTypeUrl
             * @memberof kritor.guild.RoleInfo
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            RoleInfo.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.guild.RoleInfo";
            };

            return RoleInfo;
        })();

        return guild;
    })();

    return kritor;
})();

export { $root as default };
