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

    kritor.friend = (function() {

        /**
         * Namespace friend.
         * @memberof kritor
         * @namespace
         */
        const friend = {};

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
