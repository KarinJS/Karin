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

    kritor.group = (function() {

        /**
         * Namespace group.
         * @memberof kritor
         * @namespace
         */
        const group = {};

        group.GroupInfo = (function() {

            /**
             * Properties of a GroupInfo.
             * @memberof kritor.group
             * @interface IGroupInfo
             * @property {number|Long|null} [groupId] GroupInfo groupId
             * @property {string|null} [groupName] GroupInfo groupName
             * @property {string|null} [groupRemark] GroupInfo groupRemark
             * @property {number|Long|null} [owner] GroupInfo owner
             * @property {Array.<number|Long>|null} [admins] GroupInfo admins
             * @property {number|null} [maxMemberCount] GroupInfo maxMemberCount
             * @property {number|null} [memberCount] GroupInfo memberCount
             * @property {number|Long|null} [groupUin] GroupInfo groupUin
             */

            /**
             * Constructs a new GroupInfo.
             * @memberof kritor.group
             * @classdesc Represents a GroupInfo.
             * @implements IGroupInfo
             * @constructor
             * @param {kritor.group.IGroupInfo=} [properties] Properties to set
             */
            function GroupInfo(properties) {
                this.admins = [];
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GroupInfo groupId.
             * @member {number|Long} groupId
             * @memberof kritor.group.GroupInfo
             * @instance
             */
            GroupInfo.prototype.groupId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * GroupInfo groupName.
             * @member {string} groupName
             * @memberof kritor.group.GroupInfo
             * @instance
             */
            GroupInfo.prototype.groupName = "";

            /**
             * GroupInfo groupRemark.
             * @member {string} groupRemark
             * @memberof kritor.group.GroupInfo
             * @instance
             */
            GroupInfo.prototype.groupRemark = "";

            /**
             * GroupInfo owner.
             * @member {number|Long} owner
             * @memberof kritor.group.GroupInfo
             * @instance
             */
            GroupInfo.prototype.owner = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * GroupInfo admins.
             * @member {Array.<number|Long>} admins
             * @memberof kritor.group.GroupInfo
             * @instance
             */
            GroupInfo.prototype.admins = $util.emptyArray;

            /**
             * GroupInfo maxMemberCount.
             * @member {number} maxMemberCount
             * @memberof kritor.group.GroupInfo
             * @instance
             */
            GroupInfo.prototype.maxMemberCount = 0;

            /**
             * GroupInfo memberCount.
             * @member {number} memberCount
             * @memberof kritor.group.GroupInfo
             * @instance
             */
            GroupInfo.prototype.memberCount = 0;

            /**
             * GroupInfo groupUin.
             * @member {number|Long} groupUin
             * @memberof kritor.group.GroupInfo
             * @instance
             */
            GroupInfo.prototype.groupUin = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * Creates a new GroupInfo instance using the specified properties.
             * @function create
             * @memberof kritor.group.GroupInfo
             * @static
             * @param {kritor.group.IGroupInfo=} [properties] Properties to set
             * @returns {kritor.group.GroupInfo} GroupInfo instance
             */
            GroupInfo.create = function create(properties) {
                return new GroupInfo(properties);
            };

            /**
             * Encodes the specified GroupInfo message. Does not implicitly {@link kritor.group.GroupInfo.verify|verify} messages.
             * @function encode
             * @memberof kritor.group.GroupInfo
             * @static
             * @param {kritor.group.IGroupInfo} message GroupInfo message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GroupInfo.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.groupId != null && Object.hasOwnProperty.call(message, "groupId"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.groupId);
                if (message.groupName != null && Object.hasOwnProperty.call(message, "groupName"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.groupName);
                if (message.groupRemark != null && Object.hasOwnProperty.call(message, "groupRemark"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.groupRemark);
                if (message.owner != null && Object.hasOwnProperty.call(message, "owner"))
                    writer.uint32(/* id 4, wireType 0 =*/32).uint64(message.owner);
                if (message.admins != null && message.admins.length) {
                    writer.uint32(/* id 5, wireType 2 =*/42).fork();
                    for (let i = 0; i < message.admins.length; ++i)
                        writer.uint64(message.admins[i]);
                    writer.ldelim();
                }
                if (message.maxMemberCount != null && Object.hasOwnProperty.call(message, "maxMemberCount"))
                    writer.uint32(/* id 6, wireType 0 =*/48).uint32(message.maxMemberCount);
                if (message.memberCount != null && Object.hasOwnProperty.call(message, "memberCount"))
                    writer.uint32(/* id 7, wireType 0 =*/56).uint32(message.memberCount);
                if (message.groupUin != null && Object.hasOwnProperty.call(message, "groupUin"))
                    writer.uint32(/* id 10, wireType 0 =*/80).uint64(message.groupUin);
                return writer;
            };

            /**
             * Encodes the specified GroupInfo message, length delimited. Does not implicitly {@link kritor.group.GroupInfo.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.group.GroupInfo
             * @static
             * @param {kritor.group.IGroupInfo} message GroupInfo message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GroupInfo.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GroupInfo message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.group.GroupInfo
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.group.GroupInfo} GroupInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GroupInfo.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.group.GroupInfo();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.groupId = reader.uint64();
                            break;
                        }
                    case 2: {
                            message.groupName = reader.string();
                            break;
                        }
                    case 3: {
                            message.groupRemark = reader.string();
                            break;
                        }
                    case 4: {
                            message.owner = reader.uint64();
                            break;
                        }
                    case 5: {
                            if (!(message.admins && message.admins.length))
                                message.admins = [];
                            if ((tag & 7) === 2) {
                                let end2 = reader.uint32() + reader.pos;
                                while (reader.pos < end2)
                                    message.admins.push(reader.uint64());
                            } else
                                message.admins.push(reader.uint64());
                            break;
                        }
                    case 6: {
                            message.maxMemberCount = reader.uint32();
                            break;
                        }
                    case 7: {
                            message.memberCount = reader.uint32();
                            break;
                        }
                    case 10: {
                            message.groupUin = reader.uint64();
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
             * Decodes a GroupInfo message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.group.GroupInfo
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.group.GroupInfo} GroupInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GroupInfo.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GroupInfo message.
             * @function verify
             * @memberof kritor.group.GroupInfo
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GroupInfo.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.groupId != null && message.hasOwnProperty("groupId"))
                    if (!$util.isInteger(message.groupId) && !(message.groupId && $util.isInteger(message.groupId.low) && $util.isInteger(message.groupId.high)))
                        return "groupId: integer|Long expected";
                if (message.groupName != null && message.hasOwnProperty("groupName"))
                    if (!$util.isString(message.groupName))
                        return "groupName: string expected";
                if (message.groupRemark != null && message.hasOwnProperty("groupRemark"))
                    if (!$util.isString(message.groupRemark))
                        return "groupRemark: string expected";
                if (message.owner != null && message.hasOwnProperty("owner"))
                    if (!$util.isInteger(message.owner) && !(message.owner && $util.isInteger(message.owner.low) && $util.isInteger(message.owner.high)))
                        return "owner: integer|Long expected";
                if (message.admins != null && message.hasOwnProperty("admins")) {
                    if (!Array.isArray(message.admins))
                        return "admins: array expected";
                    for (let i = 0; i < message.admins.length; ++i)
                        if (!$util.isInteger(message.admins[i]) && !(message.admins[i] && $util.isInteger(message.admins[i].low) && $util.isInteger(message.admins[i].high)))
                            return "admins: integer|Long[] expected";
                }
                if (message.maxMemberCount != null && message.hasOwnProperty("maxMemberCount"))
                    if (!$util.isInteger(message.maxMemberCount))
                        return "maxMemberCount: integer expected";
                if (message.memberCount != null && message.hasOwnProperty("memberCount"))
                    if (!$util.isInteger(message.memberCount))
                        return "memberCount: integer expected";
                if (message.groupUin != null && message.hasOwnProperty("groupUin"))
                    if (!$util.isInteger(message.groupUin) && !(message.groupUin && $util.isInteger(message.groupUin.low) && $util.isInteger(message.groupUin.high)))
                        return "groupUin: integer|Long expected";
                return null;
            };

            /**
             * Creates a GroupInfo message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.group.GroupInfo
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.group.GroupInfo} GroupInfo
             */
            GroupInfo.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.group.GroupInfo)
                    return object;
                let message = new $root.kritor.group.GroupInfo();
                if (object.groupId != null)
                    if ($util.Long)
                        (message.groupId = $util.Long.fromValue(object.groupId)).unsigned = true;
                    else if (typeof object.groupId === "string")
                        message.groupId = parseInt(object.groupId, 10);
                    else if (typeof object.groupId === "number")
                        message.groupId = object.groupId;
                    else if (typeof object.groupId === "object")
                        message.groupId = new $util.LongBits(object.groupId.low >>> 0, object.groupId.high >>> 0).toNumber(true);
                if (object.groupName != null)
                    message.groupName = String(object.groupName);
                if (object.groupRemark != null)
                    message.groupRemark = String(object.groupRemark);
                if (object.owner != null)
                    if ($util.Long)
                        (message.owner = $util.Long.fromValue(object.owner)).unsigned = true;
                    else if (typeof object.owner === "string")
                        message.owner = parseInt(object.owner, 10);
                    else if (typeof object.owner === "number")
                        message.owner = object.owner;
                    else if (typeof object.owner === "object")
                        message.owner = new $util.LongBits(object.owner.low >>> 0, object.owner.high >>> 0).toNumber(true);
                if (object.admins) {
                    if (!Array.isArray(object.admins))
                        throw TypeError(".kritor.group.GroupInfo.admins: array expected");
                    message.admins = [];
                    for (let i = 0; i < object.admins.length; ++i)
                        if ($util.Long)
                            (message.admins[i] = $util.Long.fromValue(object.admins[i])).unsigned = true;
                        else if (typeof object.admins[i] === "string")
                            message.admins[i] = parseInt(object.admins[i], 10);
                        else if (typeof object.admins[i] === "number")
                            message.admins[i] = object.admins[i];
                        else if (typeof object.admins[i] === "object")
                            message.admins[i] = new $util.LongBits(object.admins[i].low >>> 0, object.admins[i].high >>> 0).toNumber(true);
                }
                if (object.maxMemberCount != null)
                    message.maxMemberCount = object.maxMemberCount >>> 0;
                if (object.memberCount != null)
                    message.memberCount = object.memberCount >>> 0;
                if (object.groupUin != null)
                    if ($util.Long)
                        (message.groupUin = $util.Long.fromValue(object.groupUin)).unsigned = true;
                    else if (typeof object.groupUin === "string")
                        message.groupUin = parseInt(object.groupUin, 10);
                    else if (typeof object.groupUin === "number")
                        message.groupUin = object.groupUin;
                    else if (typeof object.groupUin === "object")
                        message.groupUin = new $util.LongBits(object.groupUin.low >>> 0, object.groupUin.high >>> 0).toNumber(true);
                return message;
            };

            /**
             * Creates a plain object from a GroupInfo message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.group.GroupInfo
             * @static
             * @param {kritor.group.GroupInfo} message GroupInfo
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GroupInfo.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.arrays || options.defaults)
                    object.admins = [];
                if (options.defaults) {
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.groupId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.groupId = options.longs === String ? "0" : 0;
                    object.groupName = "";
                    object.groupRemark = "";
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.owner = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.owner = options.longs === String ? "0" : 0;
                    object.maxMemberCount = 0;
                    object.memberCount = 0;
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.groupUin = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.groupUin = options.longs === String ? "0" : 0;
                }
                if (message.groupId != null && message.hasOwnProperty("groupId"))
                    if (typeof message.groupId === "number")
                        object.groupId = options.longs === String ? String(message.groupId) : message.groupId;
                    else
                        object.groupId = options.longs === String ? $util.Long.prototype.toString.call(message.groupId) : options.longs === Number ? new $util.LongBits(message.groupId.low >>> 0, message.groupId.high >>> 0).toNumber(true) : message.groupId;
                if (message.groupName != null && message.hasOwnProperty("groupName"))
                    object.groupName = message.groupName;
                if (message.groupRemark != null && message.hasOwnProperty("groupRemark"))
                    object.groupRemark = message.groupRemark;
                if (message.owner != null && message.hasOwnProperty("owner"))
                    if (typeof message.owner === "number")
                        object.owner = options.longs === String ? String(message.owner) : message.owner;
                    else
                        object.owner = options.longs === String ? $util.Long.prototype.toString.call(message.owner) : options.longs === Number ? new $util.LongBits(message.owner.low >>> 0, message.owner.high >>> 0).toNumber(true) : message.owner;
                if (message.admins && message.admins.length) {
                    object.admins = [];
                    for (let j = 0; j < message.admins.length; ++j)
                        if (typeof message.admins[j] === "number")
                            object.admins[j] = options.longs === String ? String(message.admins[j]) : message.admins[j];
                        else
                            object.admins[j] = options.longs === String ? $util.Long.prototype.toString.call(message.admins[j]) : options.longs === Number ? new $util.LongBits(message.admins[j].low >>> 0, message.admins[j].high >>> 0).toNumber(true) : message.admins[j];
                }
                if (message.maxMemberCount != null && message.hasOwnProperty("maxMemberCount"))
                    object.maxMemberCount = message.maxMemberCount;
                if (message.memberCount != null && message.hasOwnProperty("memberCount"))
                    object.memberCount = message.memberCount;
                if (message.groupUin != null && message.hasOwnProperty("groupUin"))
                    if (typeof message.groupUin === "number")
                        object.groupUin = options.longs === String ? String(message.groupUin) : message.groupUin;
                    else
                        object.groupUin = options.longs === String ? $util.Long.prototype.toString.call(message.groupUin) : options.longs === Number ? new $util.LongBits(message.groupUin.low >>> 0, message.groupUin.high >>> 0).toNumber(true) : message.groupUin;
                return object;
            };

            /**
             * Converts this GroupInfo to JSON.
             * @function toJSON
             * @memberof kritor.group.GroupInfo
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GroupInfo.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GroupInfo
             * @function getTypeUrl
             * @memberof kritor.group.GroupInfo
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GroupInfo.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.group.GroupInfo";
            };

            return GroupInfo;
        })();

        group.NotJoinedGroupInfo = (function() {

            /**
             * Properties of a NotJoinedGroupInfo.
             * @memberof kritor.group
             * @interface INotJoinedGroupInfo
             * @property {number|Long|null} [groupId] NotJoinedGroupInfo groupId
             * @property {number|null} [maxMemberCount] NotJoinedGroupInfo maxMemberCount
             * @property {number|null} [memberCount] NotJoinedGroupInfo memberCount
             * @property {string|null} [groupName] NotJoinedGroupInfo groupName
             * @property {string|null} [groupDesc] NotJoinedGroupInfo groupDesc
             * @property {number|Long|null} [owner] NotJoinedGroupInfo owner
             * @property {number|null} [createTime] NotJoinedGroupInfo createTime
             * @property {number|null} [groupFlag] NotJoinedGroupInfo groupFlag
             * @property {number|null} [groupFlagExt] NotJoinedGroupInfo groupFlagExt
             */

            /**
             * Constructs a new NotJoinedGroupInfo.
             * @memberof kritor.group
             * @classdesc Represents a NotJoinedGroupInfo.
             * @implements INotJoinedGroupInfo
             * @constructor
             * @param {kritor.group.INotJoinedGroupInfo=} [properties] Properties to set
             */
            function NotJoinedGroupInfo(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * NotJoinedGroupInfo groupId.
             * @member {number|Long} groupId
             * @memberof kritor.group.NotJoinedGroupInfo
             * @instance
             */
            NotJoinedGroupInfo.prototype.groupId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * NotJoinedGroupInfo maxMemberCount.
             * @member {number} maxMemberCount
             * @memberof kritor.group.NotJoinedGroupInfo
             * @instance
             */
            NotJoinedGroupInfo.prototype.maxMemberCount = 0;

            /**
             * NotJoinedGroupInfo memberCount.
             * @member {number} memberCount
             * @memberof kritor.group.NotJoinedGroupInfo
             * @instance
             */
            NotJoinedGroupInfo.prototype.memberCount = 0;

            /**
             * NotJoinedGroupInfo groupName.
             * @member {string} groupName
             * @memberof kritor.group.NotJoinedGroupInfo
             * @instance
             */
            NotJoinedGroupInfo.prototype.groupName = "";

            /**
             * NotJoinedGroupInfo groupDesc.
             * @member {string} groupDesc
             * @memberof kritor.group.NotJoinedGroupInfo
             * @instance
             */
            NotJoinedGroupInfo.prototype.groupDesc = "";

            /**
             * NotJoinedGroupInfo owner.
             * @member {number|Long} owner
             * @memberof kritor.group.NotJoinedGroupInfo
             * @instance
             */
            NotJoinedGroupInfo.prototype.owner = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * NotJoinedGroupInfo createTime.
             * @member {number} createTime
             * @memberof kritor.group.NotJoinedGroupInfo
             * @instance
             */
            NotJoinedGroupInfo.prototype.createTime = 0;

            /**
             * NotJoinedGroupInfo groupFlag.
             * @member {number} groupFlag
             * @memberof kritor.group.NotJoinedGroupInfo
             * @instance
             */
            NotJoinedGroupInfo.prototype.groupFlag = 0;

            /**
             * NotJoinedGroupInfo groupFlagExt.
             * @member {number} groupFlagExt
             * @memberof kritor.group.NotJoinedGroupInfo
             * @instance
             */
            NotJoinedGroupInfo.prototype.groupFlagExt = 0;

            /**
             * Creates a new NotJoinedGroupInfo instance using the specified properties.
             * @function create
             * @memberof kritor.group.NotJoinedGroupInfo
             * @static
             * @param {kritor.group.INotJoinedGroupInfo=} [properties] Properties to set
             * @returns {kritor.group.NotJoinedGroupInfo} NotJoinedGroupInfo instance
             */
            NotJoinedGroupInfo.create = function create(properties) {
                return new NotJoinedGroupInfo(properties);
            };

            /**
             * Encodes the specified NotJoinedGroupInfo message. Does not implicitly {@link kritor.group.NotJoinedGroupInfo.verify|verify} messages.
             * @function encode
             * @memberof kritor.group.NotJoinedGroupInfo
             * @static
             * @param {kritor.group.INotJoinedGroupInfo} message NotJoinedGroupInfo message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            NotJoinedGroupInfo.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.groupId != null && Object.hasOwnProperty.call(message, "groupId"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.groupId);
                if (message.maxMemberCount != null && Object.hasOwnProperty.call(message, "maxMemberCount"))
                    writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.maxMemberCount);
                if (message.memberCount != null && Object.hasOwnProperty.call(message, "memberCount"))
                    writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.memberCount);
                if (message.groupName != null && Object.hasOwnProperty.call(message, "groupName"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.groupName);
                if (message.groupDesc != null && Object.hasOwnProperty.call(message, "groupDesc"))
                    writer.uint32(/* id 5, wireType 2 =*/42).string(message.groupDesc);
                if (message.owner != null && Object.hasOwnProperty.call(message, "owner"))
                    writer.uint32(/* id 6, wireType 0 =*/48).uint64(message.owner);
                if (message.createTime != null && Object.hasOwnProperty.call(message, "createTime"))
                    writer.uint32(/* id 7, wireType 0 =*/56).uint32(message.createTime);
                if (message.groupFlag != null && Object.hasOwnProperty.call(message, "groupFlag"))
                    writer.uint32(/* id 8, wireType 0 =*/64).uint32(message.groupFlag);
                if (message.groupFlagExt != null && Object.hasOwnProperty.call(message, "groupFlagExt"))
                    writer.uint32(/* id 9, wireType 0 =*/72).uint32(message.groupFlagExt);
                return writer;
            };

            /**
             * Encodes the specified NotJoinedGroupInfo message, length delimited. Does not implicitly {@link kritor.group.NotJoinedGroupInfo.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.group.NotJoinedGroupInfo
             * @static
             * @param {kritor.group.INotJoinedGroupInfo} message NotJoinedGroupInfo message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            NotJoinedGroupInfo.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a NotJoinedGroupInfo message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.group.NotJoinedGroupInfo
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.group.NotJoinedGroupInfo} NotJoinedGroupInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            NotJoinedGroupInfo.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.group.NotJoinedGroupInfo();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.groupId = reader.uint64();
                            break;
                        }
                    case 2: {
                            message.maxMemberCount = reader.uint32();
                            break;
                        }
                    case 3: {
                            message.memberCount = reader.uint32();
                            break;
                        }
                    case 4: {
                            message.groupName = reader.string();
                            break;
                        }
                    case 5: {
                            message.groupDesc = reader.string();
                            break;
                        }
                    case 6: {
                            message.owner = reader.uint64();
                            break;
                        }
                    case 7: {
                            message.createTime = reader.uint32();
                            break;
                        }
                    case 8: {
                            message.groupFlag = reader.uint32();
                            break;
                        }
                    case 9: {
                            message.groupFlagExt = reader.uint32();
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
             * Decodes a NotJoinedGroupInfo message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.group.NotJoinedGroupInfo
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.group.NotJoinedGroupInfo} NotJoinedGroupInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            NotJoinedGroupInfo.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a NotJoinedGroupInfo message.
             * @function verify
             * @memberof kritor.group.NotJoinedGroupInfo
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            NotJoinedGroupInfo.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.groupId != null && message.hasOwnProperty("groupId"))
                    if (!$util.isInteger(message.groupId) && !(message.groupId && $util.isInteger(message.groupId.low) && $util.isInteger(message.groupId.high)))
                        return "groupId: integer|Long expected";
                if (message.maxMemberCount != null && message.hasOwnProperty("maxMemberCount"))
                    if (!$util.isInteger(message.maxMemberCount))
                        return "maxMemberCount: integer expected";
                if (message.memberCount != null && message.hasOwnProperty("memberCount"))
                    if (!$util.isInteger(message.memberCount))
                        return "memberCount: integer expected";
                if (message.groupName != null && message.hasOwnProperty("groupName"))
                    if (!$util.isString(message.groupName))
                        return "groupName: string expected";
                if (message.groupDesc != null && message.hasOwnProperty("groupDesc"))
                    if (!$util.isString(message.groupDesc))
                        return "groupDesc: string expected";
                if (message.owner != null && message.hasOwnProperty("owner"))
                    if (!$util.isInteger(message.owner) && !(message.owner && $util.isInteger(message.owner.low) && $util.isInteger(message.owner.high)))
                        return "owner: integer|Long expected";
                if (message.createTime != null && message.hasOwnProperty("createTime"))
                    if (!$util.isInteger(message.createTime))
                        return "createTime: integer expected";
                if (message.groupFlag != null && message.hasOwnProperty("groupFlag"))
                    if (!$util.isInteger(message.groupFlag))
                        return "groupFlag: integer expected";
                if (message.groupFlagExt != null && message.hasOwnProperty("groupFlagExt"))
                    if (!$util.isInteger(message.groupFlagExt))
                        return "groupFlagExt: integer expected";
                return null;
            };

            /**
             * Creates a NotJoinedGroupInfo message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.group.NotJoinedGroupInfo
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.group.NotJoinedGroupInfo} NotJoinedGroupInfo
             */
            NotJoinedGroupInfo.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.group.NotJoinedGroupInfo)
                    return object;
                let message = new $root.kritor.group.NotJoinedGroupInfo();
                if (object.groupId != null)
                    if ($util.Long)
                        (message.groupId = $util.Long.fromValue(object.groupId)).unsigned = true;
                    else if (typeof object.groupId === "string")
                        message.groupId = parseInt(object.groupId, 10);
                    else if (typeof object.groupId === "number")
                        message.groupId = object.groupId;
                    else if (typeof object.groupId === "object")
                        message.groupId = new $util.LongBits(object.groupId.low >>> 0, object.groupId.high >>> 0).toNumber(true);
                if (object.maxMemberCount != null)
                    message.maxMemberCount = object.maxMemberCount >>> 0;
                if (object.memberCount != null)
                    message.memberCount = object.memberCount >>> 0;
                if (object.groupName != null)
                    message.groupName = String(object.groupName);
                if (object.groupDesc != null)
                    message.groupDesc = String(object.groupDesc);
                if (object.owner != null)
                    if ($util.Long)
                        (message.owner = $util.Long.fromValue(object.owner)).unsigned = true;
                    else if (typeof object.owner === "string")
                        message.owner = parseInt(object.owner, 10);
                    else if (typeof object.owner === "number")
                        message.owner = object.owner;
                    else if (typeof object.owner === "object")
                        message.owner = new $util.LongBits(object.owner.low >>> 0, object.owner.high >>> 0).toNumber(true);
                if (object.createTime != null)
                    message.createTime = object.createTime >>> 0;
                if (object.groupFlag != null)
                    message.groupFlag = object.groupFlag >>> 0;
                if (object.groupFlagExt != null)
                    message.groupFlagExt = object.groupFlagExt >>> 0;
                return message;
            };

            /**
             * Creates a plain object from a NotJoinedGroupInfo message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.group.NotJoinedGroupInfo
             * @static
             * @param {kritor.group.NotJoinedGroupInfo} message NotJoinedGroupInfo
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            NotJoinedGroupInfo.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.groupId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.groupId = options.longs === String ? "0" : 0;
                    object.maxMemberCount = 0;
                    object.memberCount = 0;
                    object.groupName = "";
                    object.groupDesc = "";
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.owner = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.owner = options.longs === String ? "0" : 0;
                    object.createTime = 0;
                    object.groupFlag = 0;
                    object.groupFlagExt = 0;
                }
                if (message.groupId != null && message.hasOwnProperty("groupId"))
                    if (typeof message.groupId === "number")
                        object.groupId = options.longs === String ? String(message.groupId) : message.groupId;
                    else
                        object.groupId = options.longs === String ? $util.Long.prototype.toString.call(message.groupId) : options.longs === Number ? new $util.LongBits(message.groupId.low >>> 0, message.groupId.high >>> 0).toNumber(true) : message.groupId;
                if (message.maxMemberCount != null && message.hasOwnProperty("maxMemberCount"))
                    object.maxMemberCount = message.maxMemberCount;
                if (message.memberCount != null && message.hasOwnProperty("memberCount"))
                    object.memberCount = message.memberCount;
                if (message.groupName != null && message.hasOwnProperty("groupName"))
                    object.groupName = message.groupName;
                if (message.groupDesc != null && message.hasOwnProperty("groupDesc"))
                    object.groupDesc = message.groupDesc;
                if (message.owner != null && message.hasOwnProperty("owner"))
                    if (typeof message.owner === "number")
                        object.owner = options.longs === String ? String(message.owner) : message.owner;
                    else
                        object.owner = options.longs === String ? $util.Long.prototype.toString.call(message.owner) : options.longs === Number ? new $util.LongBits(message.owner.low >>> 0, message.owner.high >>> 0).toNumber(true) : message.owner;
                if (message.createTime != null && message.hasOwnProperty("createTime"))
                    object.createTime = message.createTime;
                if (message.groupFlag != null && message.hasOwnProperty("groupFlag"))
                    object.groupFlag = message.groupFlag;
                if (message.groupFlagExt != null && message.hasOwnProperty("groupFlagExt"))
                    object.groupFlagExt = message.groupFlagExt;
                return object;
            };

            /**
             * Converts this NotJoinedGroupInfo to JSON.
             * @function toJSON
             * @memberof kritor.group.NotJoinedGroupInfo
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            NotJoinedGroupInfo.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for NotJoinedGroupInfo
             * @function getTypeUrl
             * @memberof kritor.group.NotJoinedGroupInfo
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            NotJoinedGroupInfo.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.group.NotJoinedGroupInfo";
            };

            return NotJoinedGroupInfo;
        })();

        group.ProhibitedUserInfo = (function() {

            /**
             * Properties of a ProhibitedUserInfo.
             * @memberof kritor.group
             * @interface IProhibitedUserInfo
             * @property {string|null} [uid] ProhibitedUserInfo uid
             * @property {number|Long|null} [uin] ProhibitedUserInfo uin
             * @property {number|null} [prohibitedTime] ProhibitedUserInfo prohibitedTime
             */

            /**
             * Constructs a new ProhibitedUserInfo.
             * @memberof kritor.group
             * @classdesc Represents a ProhibitedUserInfo.
             * @implements IProhibitedUserInfo
             * @constructor
             * @param {kritor.group.IProhibitedUserInfo=} [properties] Properties to set
             */
            function ProhibitedUserInfo(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * ProhibitedUserInfo uid.
             * @member {string} uid
             * @memberof kritor.group.ProhibitedUserInfo
             * @instance
             */
            ProhibitedUserInfo.prototype.uid = "";

            /**
             * ProhibitedUserInfo uin.
             * @member {number|Long} uin
             * @memberof kritor.group.ProhibitedUserInfo
             * @instance
             */
            ProhibitedUserInfo.prototype.uin = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * ProhibitedUserInfo prohibitedTime.
             * @member {number} prohibitedTime
             * @memberof kritor.group.ProhibitedUserInfo
             * @instance
             */
            ProhibitedUserInfo.prototype.prohibitedTime = 0;

            /**
             * Creates a new ProhibitedUserInfo instance using the specified properties.
             * @function create
             * @memberof kritor.group.ProhibitedUserInfo
             * @static
             * @param {kritor.group.IProhibitedUserInfo=} [properties] Properties to set
             * @returns {kritor.group.ProhibitedUserInfo} ProhibitedUserInfo instance
             */
            ProhibitedUserInfo.create = function create(properties) {
                return new ProhibitedUserInfo(properties);
            };

            /**
             * Encodes the specified ProhibitedUserInfo message. Does not implicitly {@link kritor.group.ProhibitedUserInfo.verify|verify} messages.
             * @function encode
             * @memberof kritor.group.ProhibitedUserInfo
             * @static
             * @param {kritor.group.IProhibitedUserInfo} message ProhibitedUserInfo message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ProhibitedUserInfo.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.uid != null && Object.hasOwnProperty.call(message, "uid"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.uid);
                if (message.uin != null && Object.hasOwnProperty.call(message, "uin"))
                    writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.uin);
                if (message.prohibitedTime != null && Object.hasOwnProperty.call(message, "prohibitedTime"))
                    writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.prohibitedTime);
                return writer;
            };

            /**
             * Encodes the specified ProhibitedUserInfo message, length delimited. Does not implicitly {@link kritor.group.ProhibitedUserInfo.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.group.ProhibitedUserInfo
             * @static
             * @param {kritor.group.IProhibitedUserInfo} message ProhibitedUserInfo message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ProhibitedUserInfo.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a ProhibitedUserInfo message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.group.ProhibitedUserInfo
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.group.ProhibitedUserInfo} ProhibitedUserInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ProhibitedUserInfo.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.group.ProhibitedUserInfo();
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
                            message.prohibitedTime = reader.uint32();
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
             * Decodes a ProhibitedUserInfo message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.group.ProhibitedUserInfo
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.group.ProhibitedUserInfo} ProhibitedUserInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ProhibitedUserInfo.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a ProhibitedUserInfo message.
             * @function verify
             * @memberof kritor.group.ProhibitedUserInfo
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ProhibitedUserInfo.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.uid != null && message.hasOwnProperty("uid"))
                    if (!$util.isString(message.uid))
                        return "uid: string expected";
                if (message.uin != null && message.hasOwnProperty("uin"))
                    if (!$util.isInteger(message.uin) && !(message.uin && $util.isInteger(message.uin.low) && $util.isInteger(message.uin.high)))
                        return "uin: integer|Long expected";
                if (message.prohibitedTime != null && message.hasOwnProperty("prohibitedTime"))
                    if (!$util.isInteger(message.prohibitedTime))
                        return "prohibitedTime: integer expected";
                return null;
            };

            /**
             * Creates a ProhibitedUserInfo message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.group.ProhibitedUserInfo
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.group.ProhibitedUserInfo} ProhibitedUserInfo
             */
            ProhibitedUserInfo.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.group.ProhibitedUserInfo)
                    return object;
                let message = new $root.kritor.group.ProhibitedUserInfo();
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
                if (object.prohibitedTime != null)
                    message.prohibitedTime = object.prohibitedTime >>> 0;
                return message;
            };

            /**
             * Creates a plain object from a ProhibitedUserInfo message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.group.ProhibitedUserInfo
             * @static
             * @param {kritor.group.ProhibitedUserInfo} message ProhibitedUserInfo
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ProhibitedUserInfo.toObject = function toObject(message, options) {
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
                    object.prohibitedTime = 0;
                }
                if (message.uid != null && message.hasOwnProperty("uid"))
                    object.uid = message.uid;
                if (message.uin != null && message.hasOwnProperty("uin"))
                    if (typeof message.uin === "number")
                        object.uin = options.longs === String ? String(message.uin) : message.uin;
                    else
                        object.uin = options.longs === String ? $util.Long.prototype.toString.call(message.uin) : options.longs === Number ? new $util.LongBits(message.uin.low >>> 0, message.uin.high >>> 0).toNumber(true) : message.uin;
                if (message.prohibitedTime != null && message.hasOwnProperty("prohibitedTime"))
                    object.prohibitedTime = message.prohibitedTime;
                return object;
            };

            /**
             * Converts this ProhibitedUserInfo to JSON.
             * @function toJSON
             * @memberof kritor.group.ProhibitedUserInfo
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ProhibitedUserInfo.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for ProhibitedUserInfo
             * @function getTypeUrl
             * @memberof kritor.group.ProhibitedUserInfo
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            ProhibitedUserInfo.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.group.ProhibitedUserInfo";
            };

            return ProhibitedUserInfo;
        })();

        group.GroupHonorInfo = (function() {

            /**
             * Properties of a GroupHonorInfo.
             * @memberof kritor.group
             * @interface IGroupHonorInfo
             * @property {string|null} [uid] GroupHonorInfo uid
             * @property {number|Long|null} [uin] GroupHonorInfo uin
             * @property {string|null} [nick] GroupHonorInfo nick
             * @property {string|null} [honorName] GroupHonorInfo honorName
             * @property {string|null} [avatar] GroupHonorInfo avatar
             * @property {number|null} [id] GroupHonorInfo id
             * @property {string|null} [description] GroupHonorInfo description
             */

            /**
             * Constructs a new GroupHonorInfo.
             * @memberof kritor.group
             * @classdesc Represents a GroupHonorInfo.
             * @implements IGroupHonorInfo
             * @constructor
             * @param {kritor.group.IGroupHonorInfo=} [properties] Properties to set
             */
            function GroupHonorInfo(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GroupHonorInfo uid.
             * @member {string} uid
             * @memberof kritor.group.GroupHonorInfo
             * @instance
             */
            GroupHonorInfo.prototype.uid = "";

            /**
             * GroupHonorInfo uin.
             * @member {number|Long} uin
             * @memberof kritor.group.GroupHonorInfo
             * @instance
             */
            GroupHonorInfo.prototype.uin = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * GroupHonorInfo nick.
             * @member {string} nick
             * @memberof kritor.group.GroupHonorInfo
             * @instance
             */
            GroupHonorInfo.prototype.nick = "";

            /**
             * GroupHonorInfo honorName.
             * @member {string} honorName
             * @memberof kritor.group.GroupHonorInfo
             * @instance
             */
            GroupHonorInfo.prototype.honorName = "";

            /**
             * GroupHonorInfo avatar.
             * @member {string} avatar
             * @memberof kritor.group.GroupHonorInfo
             * @instance
             */
            GroupHonorInfo.prototype.avatar = "";

            /**
             * GroupHonorInfo id.
             * @member {number} id
             * @memberof kritor.group.GroupHonorInfo
             * @instance
             */
            GroupHonorInfo.prototype.id = 0;

            /**
             * GroupHonorInfo description.
             * @member {string} description
             * @memberof kritor.group.GroupHonorInfo
             * @instance
             */
            GroupHonorInfo.prototype.description = "";

            /**
             * Creates a new GroupHonorInfo instance using the specified properties.
             * @function create
             * @memberof kritor.group.GroupHonorInfo
             * @static
             * @param {kritor.group.IGroupHonorInfo=} [properties] Properties to set
             * @returns {kritor.group.GroupHonorInfo} GroupHonorInfo instance
             */
            GroupHonorInfo.create = function create(properties) {
                return new GroupHonorInfo(properties);
            };

            /**
             * Encodes the specified GroupHonorInfo message. Does not implicitly {@link kritor.group.GroupHonorInfo.verify|verify} messages.
             * @function encode
             * @memberof kritor.group.GroupHonorInfo
             * @static
             * @param {kritor.group.IGroupHonorInfo} message GroupHonorInfo message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GroupHonorInfo.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.uid != null && Object.hasOwnProperty.call(message, "uid"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.uid);
                if (message.uin != null && Object.hasOwnProperty.call(message, "uin"))
                    writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.uin);
                if (message.nick != null && Object.hasOwnProperty.call(message, "nick"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.nick);
                if (message.honorName != null && Object.hasOwnProperty.call(message, "honorName"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.honorName);
                if (message.avatar != null && Object.hasOwnProperty.call(message, "avatar"))
                    writer.uint32(/* id 5, wireType 2 =*/42).string(message.avatar);
                if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                    writer.uint32(/* id 6, wireType 0 =*/48).uint32(message.id);
                if (message.description != null && Object.hasOwnProperty.call(message, "description"))
                    writer.uint32(/* id 7, wireType 2 =*/58).string(message.description);
                return writer;
            };

            /**
             * Encodes the specified GroupHonorInfo message, length delimited. Does not implicitly {@link kritor.group.GroupHonorInfo.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.group.GroupHonorInfo
             * @static
             * @param {kritor.group.IGroupHonorInfo} message GroupHonorInfo message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GroupHonorInfo.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GroupHonorInfo message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.group.GroupHonorInfo
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.group.GroupHonorInfo} GroupHonorInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GroupHonorInfo.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.group.GroupHonorInfo();
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
                            message.nick = reader.string();
                            break;
                        }
                    case 4: {
                            message.honorName = reader.string();
                            break;
                        }
                    case 5: {
                            message.avatar = reader.string();
                            break;
                        }
                    case 6: {
                            message.id = reader.uint32();
                            break;
                        }
                    case 7: {
                            message.description = reader.string();
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
             * Decodes a GroupHonorInfo message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.group.GroupHonorInfo
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.group.GroupHonorInfo} GroupHonorInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GroupHonorInfo.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GroupHonorInfo message.
             * @function verify
             * @memberof kritor.group.GroupHonorInfo
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GroupHonorInfo.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.uid != null && message.hasOwnProperty("uid"))
                    if (!$util.isString(message.uid))
                        return "uid: string expected";
                if (message.uin != null && message.hasOwnProperty("uin"))
                    if (!$util.isInteger(message.uin) && !(message.uin && $util.isInteger(message.uin.low) && $util.isInteger(message.uin.high)))
                        return "uin: integer|Long expected";
                if (message.nick != null && message.hasOwnProperty("nick"))
                    if (!$util.isString(message.nick))
                        return "nick: string expected";
                if (message.honorName != null && message.hasOwnProperty("honorName"))
                    if (!$util.isString(message.honorName))
                        return "honorName: string expected";
                if (message.avatar != null && message.hasOwnProperty("avatar"))
                    if (!$util.isString(message.avatar))
                        return "avatar: string expected";
                if (message.id != null && message.hasOwnProperty("id"))
                    if (!$util.isInteger(message.id))
                        return "id: integer expected";
                if (message.description != null && message.hasOwnProperty("description"))
                    if (!$util.isString(message.description))
                        return "description: string expected";
                return null;
            };

            /**
             * Creates a GroupHonorInfo message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.group.GroupHonorInfo
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.group.GroupHonorInfo} GroupHonorInfo
             */
            GroupHonorInfo.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.group.GroupHonorInfo)
                    return object;
                let message = new $root.kritor.group.GroupHonorInfo();
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
                if (object.nick != null)
                    message.nick = String(object.nick);
                if (object.honorName != null)
                    message.honorName = String(object.honorName);
                if (object.avatar != null)
                    message.avatar = String(object.avatar);
                if (object.id != null)
                    message.id = object.id >>> 0;
                if (object.description != null)
                    message.description = String(object.description);
                return message;
            };

            /**
             * Creates a plain object from a GroupHonorInfo message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.group.GroupHonorInfo
             * @static
             * @param {kritor.group.GroupHonorInfo} message GroupHonorInfo
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GroupHonorInfo.toObject = function toObject(message, options) {
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
                    object.nick = "";
                    object.honorName = "";
                    object.avatar = "";
                    object.id = 0;
                    object.description = "";
                }
                if (message.uid != null && message.hasOwnProperty("uid"))
                    object.uid = message.uid;
                if (message.uin != null && message.hasOwnProperty("uin"))
                    if (typeof message.uin === "number")
                        object.uin = options.longs === String ? String(message.uin) : message.uin;
                    else
                        object.uin = options.longs === String ? $util.Long.prototype.toString.call(message.uin) : options.longs === Number ? new $util.LongBits(message.uin.low >>> 0, message.uin.high >>> 0).toNumber(true) : message.uin;
                if (message.nick != null && message.hasOwnProperty("nick"))
                    object.nick = message.nick;
                if (message.honorName != null && message.hasOwnProperty("honorName"))
                    object.honorName = message.honorName;
                if (message.avatar != null && message.hasOwnProperty("avatar"))
                    object.avatar = message.avatar;
                if (message.id != null && message.hasOwnProperty("id"))
                    object.id = message.id;
                if (message.description != null && message.hasOwnProperty("description"))
                    object.description = message.description;
                return object;
            };

            /**
             * Converts this GroupHonorInfo to JSON.
             * @function toJSON
             * @memberof kritor.group.GroupHonorInfo
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GroupHonorInfo.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GroupHonorInfo
             * @function getTypeUrl
             * @memberof kritor.group.GroupHonorInfo
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GroupHonorInfo.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.group.GroupHonorInfo";
            };

            return GroupHonorInfo;
        })();

        /**
         * MemberRole enum.
         * @name kritor.group.MemberRole
         * @enum {number}
         * @property {number} ADMIN=0 ADMIN value
         * @property {number} MEMBER=1 MEMBER value
         * @property {number} OWNER=2 OWNER value
         * @property {number} STRANGER=3 STRANGER value
         */
        group.MemberRole = (function() {
            const valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "ADMIN"] = 0;
            values[valuesById[1] = "MEMBER"] = 1;
            values[valuesById[2] = "OWNER"] = 2;
            values[valuesById[3] = "STRANGER"] = 3;
            return values;
        })();

        group.GroupMemberInfo = (function() {

            /**
             * Properties of a GroupMemberInfo.
             * @memberof kritor.group
             * @interface IGroupMemberInfo
             * @property {string|null} [uid] GroupMemberInfo uid
             * @property {number|Long|null} [uin] GroupMemberInfo uin
             * @property {string|null} [nick] GroupMemberInfo nick
             * @property {number|null} [age] GroupMemberInfo age
             * @property {string|null} [uniqueTitle] GroupMemberInfo uniqueTitle
             * @property {number|null} [uniqueTitleExpireTime] GroupMemberInfo uniqueTitleExpireTime
             * @property {string|null} [card] GroupMemberInfo card
             * @property {number|Long|null} [joinTime] GroupMemberInfo joinTime
             * @property {number|Long|null} [lastActiveTime] GroupMemberInfo lastActiveTime
             * @property {number|null} [level] GroupMemberInfo level
             * @property {number|Long|null} [shutUpTimestamp] GroupMemberInfo shutUpTimestamp
             * @property {number|null} [distance] GroupMemberInfo distance
             * @property {Array.<number>|null} [honors] GroupMemberInfo honors
             * @property {boolean|null} [unfriendly] GroupMemberInfo unfriendly
             * @property {boolean|null} [cardChangeable] GroupMemberInfo cardChangeable
             */

            /**
             * Constructs a new GroupMemberInfo.
             * @memberof kritor.group
             * @classdesc Represents a GroupMemberInfo.
             * @implements IGroupMemberInfo
             * @constructor
             * @param {kritor.group.IGroupMemberInfo=} [properties] Properties to set
             */
            function GroupMemberInfo(properties) {
                this.honors = [];
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GroupMemberInfo uid.
             * @member {string} uid
             * @memberof kritor.group.GroupMemberInfo
             * @instance
             */
            GroupMemberInfo.prototype.uid = "";

            /**
             * GroupMemberInfo uin.
             * @member {number|Long} uin
             * @memberof kritor.group.GroupMemberInfo
             * @instance
             */
            GroupMemberInfo.prototype.uin = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * GroupMemberInfo nick.
             * @member {string} nick
             * @memberof kritor.group.GroupMemberInfo
             * @instance
             */
            GroupMemberInfo.prototype.nick = "";

            /**
             * GroupMemberInfo age.
             * @member {number} age
             * @memberof kritor.group.GroupMemberInfo
             * @instance
             */
            GroupMemberInfo.prototype.age = 0;

            /**
             * GroupMemberInfo uniqueTitle.
             * @member {string} uniqueTitle
             * @memberof kritor.group.GroupMemberInfo
             * @instance
             */
            GroupMemberInfo.prototype.uniqueTitle = "";

            /**
             * GroupMemberInfo uniqueTitleExpireTime.
             * @member {number} uniqueTitleExpireTime
             * @memberof kritor.group.GroupMemberInfo
             * @instance
             */
            GroupMemberInfo.prototype.uniqueTitleExpireTime = 0;

            /**
             * GroupMemberInfo card.
             * @member {string} card
             * @memberof kritor.group.GroupMemberInfo
             * @instance
             */
            GroupMemberInfo.prototype.card = "";

            /**
             * GroupMemberInfo joinTime.
             * @member {number|Long} joinTime
             * @memberof kritor.group.GroupMemberInfo
             * @instance
             */
            GroupMemberInfo.prototype.joinTime = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * GroupMemberInfo lastActiveTime.
             * @member {number|Long} lastActiveTime
             * @memberof kritor.group.GroupMemberInfo
             * @instance
             */
            GroupMemberInfo.prototype.lastActiveTime = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * GroupMemberInfo level.
             * @member {number} level
             * @memberof kritor.group.GroupMemberInfo
             * @instance
             */
            GroupMemberInfo.prototype.level = 0;

            /**
             * GroupMemberInfo shutUpTimestamp.
             * @member {number|Long} shutUpTimestamp
             * @memberof kritor.group.GroupMemberInfo
             * @instance
             */
            GroupMemberInfo.prototype.shutUpTimestamp = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * GroupMemberInfo distance.
             * @member {number|null|undefined} distance
             * @memberof kritor.group.GroupMemberInfo
             * @instance
             */
            GroupMemberInfo.prototype.distance = null;

            /**
             * GroupMemberInfo honors.
             * @member {Array.<number>} honors
             * @memberof kritor.group.GroupMemberInfo
             * @instance
             */
            GroupMemberInfo.prototype.honors = $util.emptyArray;

            /**
             * GroupMemberInfo unfriendly.
             * @member {boolean|null|undefined} unfriendly
             * @memberof kritor.group.GroupMemberInfo
             * @instance
             */
            GroupMemberInfo.prototype.unfriendly = null;

            /**
             * GroupMemberInfo cardChangeable.
             * @member {boolean|null|undefined} cardChangeable
             * @memberof kritor.group.GroupMemberInfo
             * @instance
             */
            GroupMemberInfo.prototype.cardChangeable = null;

            // OneOf field names bound to virtual getters and setters
            let $oneOfFields;

            /**
             * GroupMemberInfo _distance.
             * @member {"distance"|undefined} _distance
             * @memberof kritor.group.GroupMemberInfo
             * @instance
             */
            Object.defineProperty(GroupMemberInfo.prototype, "_distance", {
                get: $util.oneOfGetter($oneOfFields = ["distance"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * GroupMemberInfo _unfriendly.
             * @member {"unfriendly"|undefined} _unfriendly
             * @memberof kritor.group.GroupMemberInfo
             * @instance
             */
            Object.defineProperty(GroupMemberInfo.prototype, "_unfriendly", {
                get: $util.oneOfGetter($oneOfFields = ["unfriendly"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * GroupMemberInfo _cardChangeable.
             * @member {"cardChangeable"|undefined} _cardChangeable
             * @memberof kritor.group.GroupMemberInfo
             * @instance
             */
            Object.defineProperty(GroupMemberInfo.prototype, "_cardChangeable", {
                get: $util.oneOfGetter($oneOfFields = ["cardChangeable"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new GroupMemberInfo instance using the specified properties.
             * @function create
             * @memberof kritor.group.GroupMemberInfo
             * @static
             * @param {kritor.group.IGroupMemberInfo=} [properties] Properties to set
             * @returns {kritor.group.GroupMemberInfo} GroupMemberInfo instance
             */
            GroupMemberInfo.create = function create(properties) {
                return new GroupMemberInfo(properties);
            };

            /**
             * Encodes the specified GroupMemberInfo message. Does not implicitly {@link kritor.group.GroupMemberInfo.verify|verify} messages.
             * @function encode
             * @memberof kritor.group.GroupMemberInfo
             * @static
             * @param {kritor.group.IGroupMemberInfo} message GroupMemberInfo message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GroupMemberInfo.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.uid != null && Object.hasOwnProperty.call(message, "uid"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.uid);
                if (message.uin != null && Object.hasOwnProperty.call(message, "uin"))
                    writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.uin);
                if (message.nick != null && Object.hasOwnProperty.call(message, "nick"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.nick);
                if (message.age != null && Object.hasOwnProperty.call(message, "age"))
                    writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.age);
                if (message.uniqueTitle != null && Object.hasOwnProperty.call(message, "uniqueTitle"))
                    writer.uint32(/* id 5, wireType 2 =*/42).string(message.uniqueTitle);
                if (message.uniqueTitleExpireTime != null && Object.hasOwnProperty.call(message, "uniqueTitleExpireTime"))
                    writer.uint32(/* id 6, wireType 0 =*/48).uint32(message.uniqueTitleExpireTime);
                if (message.card != null && Object.hasOwnProperty.call(message, "card"))
                    writer.uint32(/* id 7, wireType 2 =*/58).string(message.card);
                if (message.joinTime != null && Object.hasOwnProperty.call(message, "joinTime"))
                    writer.uint32(/* id 8, wireType 0 =*/64).uint64(message.joinTime);
                if (message.lastActiveTime != null && Object.hasOwnProperty.call(message, "lastActiveTime"))
                    writer.uint32(/* id 9, wireType 0 =*/72).uint64(message.lastActiveTime);
                if (message.level != null && Object.hasOwnProperty.call(message, "level"))
                    writer.uint32(/* id 10, wireType 0 =*/80).uint32(message.level);
                if (message.shutUpTimestamp != null && Object.hasOwnProperty.call(message, "shutUpTimestamp"))
                    writer.uint32(/* id 11, wireType 0 =*/88).uint64(message.shutUpTimestamp);
                if (message.distance != null && Object.hasOwnProperty.call(message, "distance"))
                    writer.uint32(/* id 100, wireType 0 =*/800).uint32(message.distance);
                if (message.honors != null && message.honors.length) {
                    writer.uint32(/* id 101, wireType 2 =*/810).fork();
                    for (let i = 0; i < message.honors.length; ++i)
                        writer.uint32(message.honors[i]);
                    writer.ldelim();
                }
                if (message.unfriendly != null && Object.hasOwnProperty.call(message, "unfriendly"))
                    writer.uint32(/* id 102, wireType 0 =*/816).bool(message.unfriendly);
                if (message.cardChangeable != null && Object.hasOwnProperty.call(message, "cardChangeable"))
                    writer.uint32(/* id 103, wireType 0 =*/824).bool(message.cardChangeable);
                return writer;
            };

            /**
             * Encodes the specified GroupMemberInfo message, length delimited. Does not implicitly {@link kritor.group.GroupMemberInfo.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.group.GroupMemberInfo
             * @static
             * @param {kritor.group.IGroupMemberInfo} message GroupMemberInfo message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GroupMemberInfo.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GroupMemberInfo message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.group.GroupMemberInfo
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.group.GroupMemberInfo} GroupMemberInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GroupMemberInfo.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.group.GroupMemberInfo();
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
                            message.nick = reader.string();
                            break;
                        }
                    case 4: {
                            message.age = reader.uint32();
                            break;
                        }
                    case 5: {
                            message.uniqueTitle = reader.string();
                            break;
                        }
                    case 6: {
                            message.uniqueTitleExpireTime = reader.uint32();
                            break;
                        }
                    case 7: {
                            message.card = reader.string();
                            break;
                        }
                    case 8: {
                            message.joinTime = reader.uint64();
                            break;
                        }
                    case 9: {
                            message.lastActiveTime = reader.uint64();
                            break;
                        }
                    case 10: {
                            message.level = reader.uint32();
                            break;
                        }
                    case 11: {
                            message.shutUpTimestamp = reader.uint64();
                            break;
                        }
                    case 100: {
                            message.distance = reader.uint32();
                            break;
                        }
                    case 101: {
                            if (!(message.honors && message.honors.length))
                                message.honors = [];
                            if ((tag & 7) === 2) {
                                let end2 = reader.uint32() + reader.pos;
                                while (reader.pos < end2)
                                    message.honors.push(reader.uint32());
                            } else
                                message.honors.push(reader.uint32());
                            break;
                        }
                    case 102: {
                            message.unfriendly = reader.bool();
                            break;
                        }
                    case 103: {
                            message.cardChangeable = reader.bool();
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
             * Decodes a GroupMemberInfo message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.group.GroupMemberInfo
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.group.GroupMemberInfo} GroupMemberInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GroupMemberInfo.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GroupMemberInfo message.
             * @function verify
             * @memberof kritor.group.GroupMemberInfo
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GroupMemberInfo.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                let properties = {};
                if (message.uid != null && message.hasOwnProperty("uid"))
                    if (!$util.isString(message.uid))
                        return "uid: string expected";
                if (message.uin != null && message.hasOwnProperty("uin"))
                    if (!$util.isInteger(message.uin) && !(message.uin && $util.isInteger(message.uin.low) && $util.isInteger(message.uin.high)))
                        return "uin: integer|Long expected";
                if (message.nick != null && message.hasOwnProperty("nick"))
                    if (!$util.isString(message.nick))
                        return "nick: string expected";
                if (message.age != null && message.hasOwnProperty("age"))
                    if (!$util.isInteger(message.age))
                        return "age: integer expected";
                if (message.uniqueTitle != null && message.hasOwnProperty("uniqueTitle"))
                    if (!$util.isString(message.uniqueTitle))
                        return "uniqueTitle: string expected";
                if (message.uniqueTitleExpireTime != null && message.hasOwnProperty("uniqueTitleExpireTime"))
                    if (!$util.isInteger(message.uniqueTitleExpireTime))
                        return "uniqueTitleExpireTime: integer expected";
                if (message.card != null && message.hasOwnProperty("card"))
                    if (!$util.isString(message.card))
                        return "card: string expected";
                if (message.joinTime != null && message.hasOwnProperty("joinTime"))
                    if (!$util.isInteger(message.joinTime) && !(message.joinTime && $util.isInteger(message.joinTime.low) && $util.isInteger(message.joinTime.high)))
                        return "joinTime: integer|Long expected";
                if (message.lastActiveTime != null && message.hasOwnProperty("lastActiveTime"))
                    if (!$util.isInteger(message.lastActiveTime) && !(message.lastActiveTime && $util.isInteger(message.lastActiveTime.low) && $util.isInteger(message.lastActiveTime.high)))
                        return "lastActiveTime: integer|Long expected";
                if (message.level != null && message.hasOwnProperty("level"))
                    if (!$util.isInteger(message.level))
                        return "level: integer expected";
                if (message.shutUpTimestamp != null && message.hasOwnProperty("shutUpTimestamp"))
                    if (!$util.isInteger(message.shutUpTimestamp) && !(message.shutUpTimestamp && $util.isInteger(message.shutUpTimestamp.low) && $util.isInteger(message.shutUpTimestamp.high)))
                        return "shutUpTimestamp: integer|Long expected";
                if (message.distance != null && message.hasOwnProperty("distance")) {
                    properties._distance = 1;
                    if (!$util.isInteger(message.distance))
                        return "distance: integer expected";
                }
                if (message.honors != null && message.hasOwnProperty("honors")) {
                    if (!Array.isArray(message.honors))
                        return "honors: array expected";
                    for (let i = 0; i < message.honors.length; ++i)
                        if (!$util.isInteger(message.honors[i]))
                            return "honors: integer[] expected";
                }
                if (message.unfriendly != null && message.hasOwnProperty("unfriendly")) {
                    properties._unfriendly = 1;
                    if (typeof message.unfriendly !== "boolean")
                        return "unfriendly: boolean expected";
                }
                if (message.cardChangeable != null && message.hasOwnProperty("cardChangeable")) {
                    properties._cardChangeable = 1;
                    if (typeof message.cardChangeable !== "boolean")
                        return "cardChangeable: boolean expected";
                }
                return null;
            };

            /**
             * Creates a GroupMemberInfo message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.group.GroupMemberInfo
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.group.GroupMemberInfo} GroupMemberInfo
             */
            GroupMemberInfo.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.group.GroupMemberInfo)
                    return object;
                let message = new $root.kritor.group.GroupMemberInfo();
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
                if (object.nick != null)
                    message.nick = String(object.nick);
                if (object.age != null)
                    message.age = object.age >>> 0;
                if (object.uniqueTitle != null)
                    message.uniqueTitle = String(object.uniqueTitle);
                if (object.uniqueTitleExpireTime != null)
                    message.uniqueTitleExpireTime = object.uniqueTitleExpireTime >>> 0;
                if (object.card != null)
                    message.card = String(object.card);
                if (object.joinTime != null)
                    if ($util.Long)
                        (message.joinTime = $util.Long.fromValue(object.joinTime)).unsigned = true;
                    else if (typeof object.joinTime === "string")
                        message.joinTime = parseInt(object.joinTime, 10);
                    else if (typeof object.joinTime === "number")
                        message.joinTime = object.joinTime;
                    else if (typeof object.joinTime === "object")
                        message.joinTime = new $util.LongBits(object.joinTime.low >>> 0, object.joinTime.high >>> 0).toNumber(true);
                if (object.lastActiveTime != null)
                    if ($util.Long)
                        (message.lastActiveTime = $util.Long.fromValue(object.lastActiveTime)).unsigned = true;
                    else if (typeof object.lastActiveTime === "string")
                        message.lastActiveTime = parseInt(object.lastActiveTime, 10);
                    else if (typeof object.lastActiveTime === "number")
                        message.lastActiveTime = object.lastActiveTime;
                    else if (typeof object.lastActiveTime === "object")
                        message.lastActiveTime = new $util.LongBits(object.lastActiveTime.low >>> 0, object.lastActiveTime.high >>> 0).toNumber(true);
                if (object.level != null)
                    message.level = object.level >>> 0;
                if (object.shutUpTimestamp != null)
                    if ($util.Long)
                        (message.shutUpTimestamp = $util.Long.fromValue(object.shutUpTimestamp)).unsigned = true;
                    else if (typeof object.shutUpTimestamp === "string")
                        message.shutUpTimestamp = parseInt(object.shutUpTimestamp, 10);
                    else if (typeof object.shutUpTimestamp === "number")
                        message.shutUpTimestamp = object.shutUpTimestamp;
                    else if (typeof object.shutUpTimestamp === "object")
                        message.shutUpTimestamp = new $util.LongBits(object.shutUpTimestamp.low >>> 0, object.shutUpTimestamp.high >>> 0).toNumber(true);
                if (object.distance != null)
                    message.distance = object.distance >>> 0;
                if (object.honors) {
                    if (!Array.isArray(object.honors))
                        throw TypeError(".kritor.group.GroupMemberInfo.honors: array expected");
                    message.honors = [];
                    for (let i = 0; i < object.honors.length; ++i)
                        message.honors[i] = object.honors[i] >>> 0;
                }
                if (object.unfriendly != null)
                    message.unfriendly = Boolean(object.unfriendly);
                if (object.cardChangeable != null)
                    message.cardChangeable = Boolean(object.cardChangeable);
                return message;
            };

            /**
             * Creates a plain object from a GroupMemberInfo message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.group.GroupMemberInfo
             * @static
             * @param {kritor.group.GroupMemberInfo} message GroupMemberInfo
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GroupMemberInfo.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.arrays || options.defaults)
                    object.honors = [];
                if (options.defaults) {
                    object.uid = "";
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.uin = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.uin = options.longs === String ? "0" : 0;
                    object.nick = "";
                    object.age = 0;
                    object.uniqueTitle = "";
                    object.uniqueTitleExpireTime = 0;
                    object.card = "";
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.joinTime = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.joinTime = options.longs === String ? "0" : 0;
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.lastActiveTime = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.lastActiveTime = options.longs === String ? "0" : 0;
                    object.level = 0;
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.shutUpTimestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.shutUpTimestamp = options.longs === String ? "0" : 0;
                }
                if (message.uid != null && message.hasOwnProperty("uid"))
                    object.uid = message.uid;
                if (message.uin != null && message.hasOwnProperty("uin"))
                    if (typeof message.uin === "number")
                        object.uin = options.longs === String ? String(message.uin) : message.uin;
                    else
                        object.uin = options.longs === String ? $util.Long.prototype.toString.call(message.uin) : options.longs === Number ? new $util.LongBits(message.uin.low >>> 0, message.uin.high >>> 0).toNumber(true) : message.uin;
                if (message.nick != null && message.hasOwnProperty("nick"))
                    object.nick = message.nick;
                if (message.age != null && message.hasOwnProperty("age"))
                    object.age = message.age;
                if (message.uniqueTitle != null && message.hasOwnProperty("uniqueTitle"))
                    object.uniqueTitle = message.uniqueTitle;
                if (message.uniqueTitleExpireTime != null && message.hasOwnProperty("uniqueTitleExpireTime"))
                    object.uniqueTitleExpireTime = message.uniqueTitleExpireTime;
                if (message.card != null && message.hasOwnProperty("card"))
                    object.card = message.card;
                if (message.joinTime != null && message.hasOwnProperty("joinTime"))
                    if (typeof message.joinTime === "number")
                        object.joinTime = options.longs === String ? String(message.joinTime) : message.joinTime;
                    else
                        object.joinTime = options.longs === String ? $util.Long.prototype.toString.call(message.joinTime) : options.longs === Number ? new $util.LongBits(message.joinTime.low >>> 0, message.joinTime.high >>> 0).toNumber(true) : message.joinTime;
                if (message.lastActiveTime != null && message.hasOwnProperty("lastActiveTime"))
                    if (typeof message.lastActiveTime === "number")
                        object.lastActiveTime = options.longs === String ? String(message.lastActiveTime) : message.lastActiveTime;
                    else
                        object.lastActiveTime = options.longs === String ? $util.Long.prototype.toString.call(message.lastActiveTime) : options.longs === Number ? new $util.LongBits(message.lastActiveTime.low >>> 0, message.lastActiveTime.high >>> 0).toNumber(true) : message.lastActiveTime;
                if (message.level != null && message.hasOwnProperty("level"))
                    object.level = message.level;
                if (message.shutUpTimestamp != null && message.hasOwnProperty("shutUpTimestamp"))
                    if (typeof message.shutUpTimestamp === "number")
                        object.shutUpTimestamp = options.longs === String ? String(message.shutUpTimestamp) : message.shutUpTimestamp;
                    else
                        object.shutUpTimestamp = options.longs === String ? $util.Long.prototype.toString.call(message.shutUpTimestamp) : options.longs === Number ? new $util.LongBits(message.shutUpTimestamp.low >>> 0, message.shutUpTimestamp.high >>> 0).toNumber(true) : message.shutUpTimestamp;
                if (message.distance != null && message.hasOwnProperty("distance")) {
                    object.distance = message.distance;
                    if (options.oneofs)
                        object._distance = "distance";
                }
                if (message.honors && message.honors.length) {
                    object.honors = [];
                    for (let j = 0; j < message.honors.length; ++j)
                        object.honors[j] = message.honors[j];
                }
                if (message.unfriendly != null && message.hasOwnProperty("unfriendly")) {
                    object.unfriendly = message.unfriendly;
                    if (options.oneofs)
                        object._unfriendly = "unfriendly";
                }
                if (message.cardChangeable != null && message.hasOwnProperty("cardChangeable")) {
                    object.cardChangeable = message.cardChangeable;
                    if (options.oneofs)
                        object._cardChangeable = "cardChangeable";
                }
                return object;
            };

            /**
             * Converts this GroupMemberInfo to JSON.
             * @function toJSON
             * @memberof kritor.group.GroupMemberInfo
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GroupMemberInfo.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GroupMemberInfo
             * @function getTypeUrl
             * @memberof kritor.group.GroupMemberInfo
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GroupMemberInfo.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.group.GroupMemberInfo";
            };

            return GroupMemberInfo;
        })();

        return group;
    })();

    return kritor;
})();

export { $root as default };
