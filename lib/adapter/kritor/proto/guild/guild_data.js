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

    kritor.guild = (function() {

        /**
         * Namespace guild.
         * @memberof kritor
         * @namespace
         */
        const guild = {};

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
