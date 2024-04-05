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

    kritor.event = (function() {

        /**
         * Namespace event.
         * @memberof kritor
         * @namespace
         */
        const event = {};

        event.FriendApplyRequest = (function() {

            /**
             * Properties of a FriendApplyRequest.
             * @memberof kritor.event
             * @interface IFriendApplyRequest
             * @property {string|null} [applierUid] FriendApplyRequest applierUid
             * @property {number|Long|null} [applierUin] FriendApplyRequest applierUin
             * @property {string|null} [flag] FriendApplyRequest flag
             * @property {string|null} [message] FriendApplyRequest message
             */

            /**
             * Constructs a new FriendApplyRequest.
             * @memberof kritor.event
             * @classdesc Represents a FriendApplyRequest.
             * @implements IFriendApplyRequest
             * @constructor
             * @param {kritor.event.IFriendApplyRequest=} [properties] Properties to set
             */
            function FriendApplyRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * FriendApplyRequest applierUid.
             * @member {string} applierUid
             * @memberof kritor.event.FriendApplyRequest
             * @instance
             */
            FriendApplyRequest.prototype.applierUid = "";

            /**
             * FriendApplyRequest applierUin.
             * @member {number|Long} applierUin
             * @memberof kritor.event.FriendApplyRequest
             * @instance
             */
            FriendApplyRequest.prototype.applierUin = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * FriendApplyRequest flag.
             * @member {string} flag
             * @memberof kritor.event.FriendApplyRequest
             * @instance
             */
            FriendApplyRequest.prototype.flag = "";

            /**
             * FriendApplyRequest message.
             * @member {string} message
             * @memberof kritor.event.FriendApplyRequest
             * @instance
             */
            FriendApplyRequest.prototype.message = "";

            /**
             * Creates a new FriendApplyRequest instance using the specified properties.
             * @function create
             * @memberof kritor.event.FriendApplyRequest
             * @static
             * @param {kritor.event.IFriendApplyRequest=} [properties] Properties to set
             * @returns {kritor.event.FriendApplyRequest} FriendApplyRequest instance
             */
            FriendApplyRequest.create = function create(properties) {
                return new FriendApplyRequest(properties);
            };

            /**
             * Encodes the specified FriendApplyRequest message. Does not implicitly {@link kritor.event.FriendApplyRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.event.FriendApplyRequest
             * @static
             * @param {kritor.event.IFriendApplyRequest} message FriendApplyRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            FriendApplyRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.applierUid != null && Object.hasOwnProperty.call(message, "applierUid"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.applierUid);
                if (message.applierUin != null && Object.hasOwnProperty.call(message, "applierUin"))
                    writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.applierUin);
                if (message.flag != null && Object.hasOwnProperty.call(message, "flag"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.flag);
                if (message.message != null && Object.hasOwnProperty.call(message, "message"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.message);
                return writer;
            };

            /**
             * Encodes the specified FriendApplyRequest message, length delimited. Does not implicitly {@link kritor.event.FriendApplyRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.event.FriendApplyRequest
             * @static
             * @param {kritor.event.IFriendApplyRequest} message FriendApplyRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            FriendApplyRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a FriendApplyRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.event.FriendApplyRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.event.FriendApplyRequest} FriendApplyRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            FriendApplyRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.event.FriendApplyRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.applierUid = reader.string();
                            break;
                        }
                    case 2: {
                            message.applierUin = reader.uint64();
                            break;
                        }
                    case 3: {
                            message.flag = reader.string();
                            break;
                        }
                    case 4: {
                            message.message = reader.string();
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
             * Decodes a FriendApplyRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.event.FriendApplyRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.event.FriendApplyRequest} FriendApplyRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            FriendApplyRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a FriendApplyRequest message.
             * @function verify
             * @memberof kritor.event.FriendApplyRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            FriendApplyRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.applierUid != null && message.hasOwnProperty("applierUid"))
                    if (!$util.isString(message.applierUid))
                        return "applierUid: string expected";
                if (message.applierUin != null && message.hasOwnProperty("applierUin"))
                    if (!$util.isInteger(message.applierUin) && !(message.applierUin && $util.isInteger(message.applierUin.low) && $util.isInteger(message.applierUin.high)))
                        return "applierUin: integer|Long expected";
                if (message.flag != null && message.hasOwnProperty("flag"))
                    if (!$util.isString(message.flag))
                        return "flag: string expected";
                if (message.message != null && message.hasOwnProperty("message"))
                    if (!$util.isString(message.message))
                        return "message: string expected";
                return null;
            };

            /**
             * Creates a FriendApplyRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.event.FriendApplyRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.event.FriendApplyRequest} FriendApplyRequest
             */
            FriendApplyRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.event.FriendApplyRequest)
                    return object;
                let message = new $root.kritor.event.FriendApplyRequest();
                if (object.applierUid != null)
                    message.applierUid = String(object.applierUid);
                if (object.applierUin != null)
                    if ($util.Long)
                        (message.applierUin = $util.Long.fromValue(object.applierUin)).unsigned = true;
                    else if (typeof object.applierUin === "string")
                        message.applierUin = parseInt(object.applierUin, 10);
                    else if (typeof object.applierUin === "number")
                        message.applierUin = object.applierUin;
                    else if (typeof object.applierUin === "object")
                        message.applierUin = new $util.LongBits(object.applierUin.low >>> 0, object.applierUin.high >>> 0).toNumber(true);
                if (object.flag != null)
                    message.flag = String(object.flag);
                if (object.message != null)
                    message.message = String(object.message);
                return message;
            };

            /**
             * Creates a plain object from a FriendApplyRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.event.FriendApplyRequest
             * @static
             * @param {kritor.event.FriendApplyRequest} message FriendApplyRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            FriendApplyRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.applierUid = "";
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.applierUin = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.applierUin = options.longs === String ? "0" : 0;
                    object.flag = "";
                    object.message = "";
                }
                if (message.applierUid != null && message.hasOwnProperty("applierUid"))
                    object.applierUid = message.applierUid;
                if (message.applierUin != null && message.hasOwnProperty("applierUin"))
                    if (typeof message.applierUin === "number")
                        object.applierUin = options.longs === String ? String(message.applierUin) : message.applierUin;
                    else
                        object.applierUin = options.longs === String ? $util.Long.prototype.toString.call(message.applierUin) : options.longs === Number ? new $util.LongBits(message.applierUin.low >>> 0, message.applierUin.high >>> 0).toNumber(true) : message.applierUin;
                if (message.flag != null && message.hasOwnProperty("flag"))
                    object.flag = message.flag;
                if (message.message != null && message.hasOwnProperty("message"))
                    object.message = message.message;
                return object;
            };

            /**
             * Converts this FriendApplyRequest to JSON.
             * @function toJSON
             * @memberof kritor.event.FriendApplyRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            FriendApplyRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for FriendApplyRequest
             * @function getTypeUrl
             * @memberof kritor.event.FriendApplyRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            FriendApplyRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.event.FriendApplyRequest";
            };

            return FriendApplyRequest;
        })();

        event.GroupApplyRequest = (function() {

            /**
             * Properties of a GroupApplyRequest.
             * @memberof kritor.event
             * @interface IGroupApplyRequest
             * @property {number|Long|null} [groupId] GroupApplyRequest groupId
             * @property {string|null} [applierUid] GroupApplyRequest applierUid
             * @property {number|Long|null} [applierUin] GroupApplyRequest applierUin
             * @property {string|null} [inviterUid] GroupApplyRequest inviterUid
             * @property {number|Long|null} [inviterUin] GroupApplyRequest inviterUin
             * @property {string|null} [reason] GroupApplyRequest reason
             * @property {string|null} [flag] GroupApplyRequest flag
             */

            /**
             * Constructs a new GroupApplyRequest.
             * @memberof kritor.event
             * @classdesc Represents a GroupApplyRequest.
             * @implements IGroupApplyRequest
             * @constructor
             * @param {kritor.event.IGroupApplyRequest=} [properties] Properties to set
             */
            function GroupApplyRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GroupApplyRequest groupId.
             * @member {number|Long} groupId
             * @memberof kritor.event.GroupApplyRequest
             * @instance
             */
            GroupApplyRequest.prototype.groupId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * GroupApplyRequest applierUid.
             * @member {string} applierUid
             * @memberof kritor.event.GroupApplyRequest
             * @instance
             */
            GroupApplyRequest.prototype.applierUid = "";

            /**
             * GroupApplyRequest applierUin.
             * @member {number|Long} applierUin
             * @memberof kritor.event.GroupApplyRequest
             * @instance
             */
            GroupApplyRequest.prototype.applierUin = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * GroupApplyRequest inviterUid.
             * @member {string} inviterUid
             * @memberof kritor.event.GroupApplyRequest
             * @instance
             */
            GroupApplyRequest.prototype.inviterUid = "";

            /**
             * GroupApplyRequest inviterUin.
             * @member {number|Long} inviterUin
             * @memberof kritor.event.GroupApplyRequest
             * @instance
             */
            GroupApplyRequest.prototype.inviterUin = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * GroupApplyRequest reason.
             * @member {string} reason
             * @memberof kritor.event.GroupApplyRequest
             * @instance
             */
            GroupApplyRequest.prototype.reason = "";

            /**
             * GroupApplyRequest flag.
             * @member {string} flag
             * @memberof kritor.event.GroupApplyRequest
             * @instance
             */
            GroupApplyRequest.prototype.flag = "";

            /**
             * Creates a new GroupApplyRequest instance using the specified properties.
             * @function create
             * @memberof kritor.event.GroupApplyRequest
             * @static
             * @param {kritor.event.IGroupApplyRequest=} [properties] Properties to set
             * @returns {kritor.event.GroupApplyRequest} GroupApplyRequest instance
             */
            GroupApplyRequest.create = function create(properties) {
                return new GroupApplyRequest(properties);
            };

            /**
             * Encodes the specified GroupApplyRequest message. Does not implicitly {@link kritor.event.GroupApplyRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.event.GroupApplyRequest
             * @static
             * @param {kritor.event.IGroupApplyRequest} message GroupApplyRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GroupApplyRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.groupId != null && Object.hasOwnProperty.call(message, "groupId"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.groupId);
                if (message.applierUid != null && Object.hasOwnProperty.call(message, "applierUid"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.applierUid);
                if (message.applierUin != null && Object.hasOwnProperty.call(message, "applierUin"))
                    writer.uint32(/* id 3, wireType 0 =*/24).uint64(message.applierUin);
                if (message.inviterUid != null && Object.hasOwnProperty.call(message, "inviterUid"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.inviterUid);
                if (message.inviterUin != null && Object.hasOwnProperty.call(message, "inviterUin"))
                    writer.uint32(/* id 5, wireType 0 =*/40).uint64(message.inviterUin);
                if (message.reason != null && Object.hasOwnProperty.call(message, "reason"))
                    writer.uint32(/* id 6, wireType 2 =*/50).string(message.reason);
                if (message.flag != null && Object.hasOwnProperty.call(message, "flag"))
                    writer.uint32(/* id 7, wireType 2 =*/58).string(message.flag);
                return writer;
            };

            /**
             * Encodes the specified GroupApplyRequest message, length delimited. Does not implicitly {@link kritor.event.GroupApplyRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.event.GroupApplyRequest
             * @static
             * @param {kritor.event.IGroupApplyRequest} message GroupApplyRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GroupApplyRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GroupApplyRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.event.GroupApplyRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.event.GroupApplyRequest} GroupApplyRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GroupApplyRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.event.GroupApplyRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.groupId = reader.uint64();
                            break;
                        }
                    case 2: {
                            message.applierUid = reader.string();
                            break;
                        }
                    case 3: {
                            message.applierUin = reader.uint64();
                            break;
                        }
                    case 4: {
                            message.inviterUid = reader.string();
                            break;
                        }
                    case 5: {
                            message.inviterUin = reader.uint64();
                            break;
                        }
                    case 6: {
                            message.reason = reader.string();
                            break;
                        }
                    case 7: {
                            message.flag = reader.string();
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
             * Decodes a GroupApplyRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.event.GroupApplyRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.event.GroupApplyRequest} GroupApplyRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GroupApplyRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GroupApplyRequest message.
             * @function verify
             * @memberof kritor.event.GroupApplyRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GroupApplyRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.groupId != null && message.hasOwnProperty("groupId"))
                    if (!$util.isInteger(message.groupId) && !(message.groupId && $util.isInteger(message.groupId.low) && $util.isInteger(message.groupId.high)))
                        return "groupId: integer|Long expected";
                if (message.applierUid != null && message.hasOwnProperty("applierUid"))
                    if (!$util.isString(message.applierUid))
                        return "applierUid: string expected";
                if (message.applierUin != null && message.hasOwnProperty("applierUin"))
                    if (!$util.isInteger(message.applierUin) && !(message.applierUin && $util.isInteger(message.applierUin.low) && $util.isInteger(message.applierUin.high)))
                        return "applierUin: integer|Long expected";
                if (message.inviterUid != null && message.hasOwnProperty("inviterUid"))
                    if (!$util.isString(message.inviterUid))
                        return "inviterUid: string expected";
                if (message.inviterUin != null && message.hasOwnProperty("inviterUin"))
                    if (!$util.isInteger(message.inviterUin) && !(message.inviterUin && $util.isInteger(message.inviterUin.low) && $util.isInteger(message.inviterUin.high)))
                        return "inviterUin: integer|Long expected";
                if (message.reason != null && message.hasOwnProperty("reason"))
                    if (!$util.isString(message.reason))
                        return "reason: string expected";
                if (message.flag != null && message.hasOwnProperty("flag"))
                    if (!$util.isString(message.flag))
                        return "flag: string expected";
                return null;
            };

            /**
             * Creates a GroupApplyRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.event.GroupApplyRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.event.GroupApplyRequest} GroupApplyRequest
             */
            GroupApplyRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.event.GroupApplyRequest)
                    return object;
                let message = new $root.kritor.event.GroupApplyRequest();
                if (object.groupId != null)
                    if ($util.Long)
                        (message.groupId = $util.Long.fromValue(object.groupId)).unsigned = true;
                    else if (typeof object.groupId === "string")
                        message.groupId = parseInt(object.groupId, 10);
                    else if (typeof object.groupId === "number")
                        message.groupId = object.groupId;
                    else if (typeof object.groupId === "object")
                        message.groupId = new $util.LongBits(object.groupId.low >>> 0, object.groupId.high >>> 0).toNumber(true);
                if (object.applierUid != null)
                    message.applierUid = String(object.applierUid);
                if (object.applierUin != null)
                    if ($util.Long)
                        (message.applierUin = $util.Long.fromValue(object.applierUin)).unsigned = true;
                    else if (typeof object.applierUin === "string")
                        message.applierUin = parseInt(object.applierUin, 10);
                    else if (typeof object.applierUin === "number")
                        message.applierUin = object.applierUin;
                    else if (typeof object.applierUin === "object")
                        message.applierUin = new $util.LongBits(object.applierUin.low >>> 0, object.applierUin.high >>> 0).toNumber(true);
                if (object.inviterUid != null)
                    message.inviterUid = String(object.inviterUid);
                if (object.inviterUin != null)
                    if ($util.Long)
                        (message.inviterUin = $util.Long.fromValue(object.inviterUin)).unsigned = true;
                    else if (typeof object.inviterUin === "string")
                        message.inviterUin = parseInt(object.inviterUin, 10);
                    else if (typeof object.inviterUin === "number")
                        message.inviterUin = object.inviterUin;
                    else if (typeof object.inviterUin === "object")
                        message.inviterUin = new $util.LongBits(object.inviterUin.low >>> 0, object.inviterUin.high >>> 0).toNumber(true);
                if (object.reason != null)
                    message.reason = String(object.reason);
                if (object.flag != null)
                    message.flag = String(object.flag);
                return message;
            };

            /**
             * Creates a plain object from a GroupApplyRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.event.GroupApplyRequest
             * @static
             * @param {kritor.event.GroupApplyRequest} message GroupApplyRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GroupApplyRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.groupId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.groupId = options.longs === String ? "0" : 0;
                    object.applierUid = "";
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.applierUin = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.applierUin = options.longs === String ? "0" : 0;
                    object.inviterUid = "";
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.inviterUin = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.inviterUin = options.longs === String ? "0" : 0;
                    object.reason = "";
                    object.flag = "";
                }
                if (message.groupId != null && message.hasOwnProperty("groupId"))
                    if (typeof message.groupId === "number")
                        object.groupId = options.longs === String ? String(message.groupId) : message.groupId;
                    else
                        object.groupId = options.longs === String ? $util.Long.prototype.toString.call(message.groupId) : options.longs === Number ? new $util.LongBits(message.groupId.low >>> 0, message.groupId.high >>> 0).toNumber(true) : message.groupId;
                if (message.applierUid != null && message.hasOwnProperty("applierUid"))
                    object.applierUid = message.applierUid;
                if (message.applierUin != null && message.hasOwnProperty("applierUin"))
                    if (typeof message.applierUin === "number")
                        object.applierUin = options.longs === String ? String(message.applierUin) : message.applierUin;
                    else
                        object.applierUin = options.longs === String ? $util.Long.prototype.toString.call(message.applierUin) : options.longs === Number ? new $util.LongBits(message.applierUin.low >>> 0, message.applierUin.high >>> 0).toNumber(true) : message.applierUin;
                if (message.inviterUid != null && message.hasOwnProperty("inviterUid"))
                    object.inviterUid = message.inviterUid;
                if (message.inviterUin != null && message.hasOwnProperty("inviterUin"))
                    if (typeof message.inviterUin === "number")
                        object.inviterUin = options.longs === String ? String(message.inviterUin) : message.inviterUin;
                    else
                        object.inviterUin = options.longs === String ? $util.Long.prototype.toString.call(message.inviterUin) : options.longs === Number ? new $util.LongBits(message.inviterUin.low >>> 0, message.inviterUin.high >>> 0).toNumber(true) : message.inviterUin;
                if (message.reason != null && message.hasOwnProperty("reason"))
                    object.reason = message.reason;
                if (message.flag != null && message.hasOwnProperty("flag"))
                    object.flag = message.flag;
                return object;
            };

            /**
             * Converts this GroupApplyRequest to JSON.
             * @function toJSON
             * @memberof kritor.event.GroupApplyRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GroupApplyRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GroupApplyRequest
             * @function getTypeUrl
             * @memberof kritor.event.GroupApplyRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GroupApplyRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.event.GroupApplyRequest";
            };

            return GroupApplyRequest;
        })();

        event.InvitedJoinGroupRequest = (function() {

            /**
             * Properties of an InvitedJoinGroupRequest.
             * @memberof kritor.event
             * @interface IInvitedJoinGroupRequest
             * @property {number|Long|null} [groupId] InvitedJoinGroupRequest groupId
             * @property {string|null} [inviterUid] InvitedJoinGroupRequest inviterUid
             * @property {number|Long|null} [inviterUin] InvitedJoinGroupRequest inviterUin
             * @property {string|null} [flag] InvitedJoinGroupRequest flag
             */

            /**
             * Constructs a new InvitedJoinGroupRequest.
             * @memberof kritor.event
             * @classdesc Represents an InvitedJoinGroupRequest.
             * @implements IInvitedJoinGroupRequest
             * @constructor
             * @param {kritor.event.IInvitedJoinGroupRequest=} [properties] Properties to set
             */
            function InvitedJoinGroupRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * InvitedJoinGroupRequest groupId.
             * @member {number|Long} groupId
             * @memberof kritor.event.InvitedJoinGroupRequest
             * @instance
             */
            InvitedJoinGroupRequest.prototype.groupId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * InvitedJoinGroupRequest inviterUid.
             * @member {string} inviterUid
             * @memberof kritor.event.InvitedJoinGroupRequest
             * @instance
             */
            InvitedJoinGroupRequest.prototype.inviterUid = "";

            /**
             * InvitedJoinGroupRequest inviterUin.
             * @member {number|Long} inviterUin
             * @memberof kritor.event.InvitedJoinGroupRequest
             * @instance
             */
            InvitedJoinGroupRequest.prototype.inviterUin = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * InvitedJoinGroupRequest flag.
             * @member {string} flag
             * @memberof kritor.event.InvitedJoinGroupRequest
             * @instance
             */
            InvitedJoinGroupRequest.prototype.flag = "";

            /**
             * Creates a new InvitedJoinGroupRequest instance using the specified properties.
             * @function create
             * @memberof kritor.event.InvitedJoinGroupRequest
             * @static
             * @param {kritor.event.IInvitedJoinGroupRequest=} [properties] Properties to set
             * @returns {kritor.event.InvitedJoinGroupRequest} InvitedJoinGroupRequest instance
             */
            InvitedJoinGroupRequest.create = function create(properties) {
                return new InvitedJoinGroupRequest(properties);
            };

            /**
             * Encodes the specified InvitedJoinGroupRequest message. Does not implicitly {@link kritor.event.InvitedJoinGroupRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.event.InvitedJoinGroupRequest
             * @static
             * @param {kritor.event.IInvitedJoinGroupRequest} message InvitedJoinGroupRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            InvitedJoinGroupRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.groupId != null && Object.hasOwnProperty.call(message, "groupId"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.groupId);
                if (message.inviterUid != null && Object.hasOwnProperty.call(message, "inviterUid"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.inviterUid);
                if (message.inviterUin != null && Object.hasOwnProperty.call(message, "inviterUin"))
                    writer.uint32(/* id 3, wireType 0 =*/24).uint64(message.inviterUin);
                if (message.flag != null && Object.hasOwnProperty.call(message, "flag"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.flag);
                return writer;
            };

            /**
             * Encodes the specified InvitedJoinGroupRequest message, length delimited. Does not implicitly {@link kritor.event.InvitedJoinGroupRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.event.InvitedJoinGroupRequest
             * @static
             * @param {kritor.event.IInvitedJoinGroupRequest} message InvitedJoinGroupRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            InvitedJoinGroupRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an InvitedJoinGroupRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.event.InvitedJoinGroupRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.event.InvitedJoinGroupRequest} InvitedJoinGroupRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            InvitedJoinGroupRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.event.InvitedJoinGroupRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.groupId = reader.uint64();
                            break;
                        }
                    case 2: {
                            message.inviterUid = reader.string();
                            break;
                        }
                    case 3: {
                            message.inviterUin = reader.uint64();
                            break;
                        }
                    case 4: {
                            message.flag = reader.string();
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
             * Decodes an InvitedJoinGroupRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.event.InvitedJoinGroupRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.event.InvitedJoinGroupRequest} InvitedJoinGroupRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            InvitedJoinGroupRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an InvitedJoinGroupRequest message.
             * @function verify
             * @memberof kritor.event.InvitedJoinGroupRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            InvitedJoinGroupRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.groupId != null && message.hasOwnProperty("groupId"))
                    if (!$util.isInteger(message.groupId) && !(message.groupId && $util.isInteger(message.groupId.low) && $util.isInteger(message.groupId.high)))
                        return "groupId: integer|Long expected";
                if (message.inviterUid != null && message.hasOwnProperty("inviterUid"))
                    if (!$util.isString(message.inviterUid))
                        return "inviterUid: string expected";
                if (message.inviterUin != null && message.hasOwnProperty("inviterUin"))
                    if (!$util.isInteger(message.inviterUin) && !(message.inviterUin && $util.isInteger(message.inviterUin.low) && $util.isInteger(message.inviterUin.high)))
                        return "inviterUin: integer|Long expected";
                if (message.flag != null && message.hasOwnProperty("flag"))
                    if (!$util.isString(message.flag))
                        return "flag: string expected";
                return null;
            };

            /**
             * Creates an InvitedJoinGroupRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.event.InvitedJoinGroupRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.event.InvitedJoinGroupRequest} InvitedJoinGroupRequest
             */
            InvitedJoinGroupRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.event.InvitedJoinGroupRequest)
                    return object;
                let message = new $root.kritor.event.InvitedJoinGroupRequest();
                if (object.groupId != null)
                    if ($util.Long)
                        (message.groupId = $util.Long.fromValue(object.groupId)).unsigned = true;
                    else if (typeof object.groupId === "string")
                        message.groupId = parseInt(object.groupId, 10);
                    else if (typeof object.groupId === "number")
                        message.groupId = object.groupId;
                    else if (typeof object.groupId === "object")
                        message.groupId = new $util.LongBits(object.groupId.low >>> 0, object.groupId.high >>> 0).toNumber(true);
                if (object.inviterUid != null)
                    message.inviterUid = String(object.inviterUid);
                if (object.inviterUin != null)
                    if ($util.Long)
                        (message.inviterUin = $util.Long.fromValue(object.inviterUin)).unsigned = true;
                    else if (typeof object.inviterUin === "string")
                        message.inviterUin = parseInt(object.inviterUin, 10);
                    else if (typeof object.inviterUin === "number")
                        message.inviterUin = object.inviterUin;
                    else if (typeof object.inviterUin === "object")
                        message.inviterUin = new $util.LongBits(object.inviterUin.low >>> 0, object.inviterUin.high >>> 0).toNumber(true);
                if (object.flag != null)
                    message.flag = String(object.flag);
                return message;
            };

            /**
             * Creates a plain object from an InvitedJoinGroupRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.event.InvitedJoinGroupRequest
             * @static
             * @param {kritor.event.InvitedJoinGroupRequest} message InvitedJoinGroupRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            InvitedJoinGroupRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.groupId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.groupId = options.longs === String ? "0" : 0;
                    object.inviterUid = "";
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.inviterUin = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.inviterUin = options.longs === String ? "0" : 0;
                    object.flag = "";
                }
                if (message.groupId != null && message.hasOwnProperty("groupId"))
                    if (typeof message.groupId === "number")
                        object.groupId = options.longs === String ? String(message.groupId) : message.groupId;
                    else
                        object.groupId = options.longs === String ? $util.Long.prototype.toString.call(message.groupId) : options.longs === Number ? new $util.LongBits(message.groupId.low >>> 0, message.groupId.high >>> 0).toNumber(true) : message.groupId;
                if (message.inviterUid != null && message.hasOwnProperty("inviterUid"))
                    object.inviterUid = message.inviterUid;
                if (message.inviterUin != null && message.hasOwnProperty("inviterUin"))
                    if (typeof message.inviterUin === "number")
                        object.inviterUin = options.longs === String ? String(message.inviterUin) : message.inviterUin;
                    else
                        object.inviterUin = options.longs === String ? $util.Long.prototype.toString.call(message.inviterUin) : options.longs === Number ? new $util.LongBits(message.inviterUin.low >>> 0, message.inviterUin.high >>> 0).toNumber(true) : message.inviterUin;
                if (message.flag != null && message.hasOwnProperty("flag"))
                    object.flag = message.flag;
                return object;
            };

            /**
             * Converts this InvitedJoinGroupRequest to JSON.
             * @function toJSON
             * @memberof kritor.event.InvitedJoinGroupRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            InvitedJoinGroupRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for InvitedJoinGroupRequest
             * @function getTypeUrl
             * @memberof kritor.event.InvitedJoinGroupRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            InvitedJoinGroupRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.event.InvitedJoinGroupRequest";
            };

            return InvitedJoinGroupRequest;
        })();

        return event;
    })();

    return kritor;
})();

export { $root as default };
