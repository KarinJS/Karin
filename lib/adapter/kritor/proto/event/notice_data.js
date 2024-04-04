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

    kritor.event = (function() {

        /**
         * Namespace event.
         * @memberof kritor
         * @namespace
         */
        const event = {};

        event.FriendPokeNotice = (function() {

            /**
             * Properties of a FriendPokeNotice.
             * @memberof kritor.event
             * @interface IFriendPokeNotice
             * @property {string|null} [operatorUid] FriendPokeNotice operatorUid
             * @property {number|Long|null} [operatorUin] FriendPokeNotice operatorUin
             * @property {string|null} [action] FriendPokeNotice action
             * @property {string|null} [suffix] FriendPokeNotice suffix
             * @property {string|null} [actionImage] FriendPokeNotice actionImage
             */

            /**
             * Constructs a new FriendPokeNotice.
             * @memberof kritor.event
             * @classdesc Represents a FriendPokeNotice.
             * @implements IFriendPokeNotice
             * @constructor
             * @param {kritor.event.IFriendPokeNotice=} [properties] Properties to set
             */
            function FriendPokeNotice(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * FriendPokeNotice operatorUid.
             * @member {string} operatorUid
             * @memberof kritor.event.FriendPokeNotice
             * @instance
             */
            FriendPokeNotice.prototype.operatorUid = "";

            /**
             * FriendPokeNotice operatorUin.
             * @member {number|Long} operatorUin
             * @memberof kritor.event.FriendPokeNotice
             * @instance
             */
            FriendPokeNotice.prototype.operatorUin = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * FriendPokeNotice action.
             * @member {string} action
             * @memberof kritor.event.FriendPokeNotice
             * @instance
             */
            FriendPokeNotice.prototype.action = "";

            /**
             * FriendPokeNotice suffix.
             * @member {string} suffix
             * @memberof kritor.event.FriendPokeNotice
             * @instance
             */
            FriendPokeNotice.prototype.suffix = "";

            /**
             * FriendPokeNotice actionImage.
             * @member {string} actionImage
             * @memberof kritor.event.FriendPokeNotice
             * @instance
             */
            FriendPokeNotice.prototype.actionImage = "";

            /**
             * Creates a new FriendPokeNotice instance using the specified properties.
             * @function create
             * @memberof kritor.event.FriendPokeNotice
             * @static
             * @param {kritor.event.IFriendPokeNotice=} [properties] Properties to set
             * @returns {kritor.event.FriendPokeNotice} FriendPokeNotice instance
             */
            FriendPokeNotice.create = function create(properties) {
                return new FriendPokeNotice(properties);
            };

            /**
             * Encodes the specified FriendPokeNotice message. Does not implicitly {@link kritor.event.FriendPokeNotice.verify|verify} messages.
             * @function encode
             * @memberof kritor.event.FriendPokeNotice
             * @static
             * @param {kritor.event.IFriendPokeNotice} message FriendPokeNotice message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            FriendPokeNotice.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.operatorUid != null && Object.hasOwnProperty.call(message, "operatorUid"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.operatorUid);
                if (message.operatorUin != null && Object.hasOwnProperty.call(message, "operatorUin"))
                    writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.operatorUin);
                if (message.action != null && Object.hasOwnProperty.call(message, "action"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.action);
                if (message.suffix != null && Object.hasOwnProperty.call(message, "suffix"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.suffix);
                if (message.actionImage != null && Object.hasOwnProperty.call(message, "actionImage"))
                    writer.uint32(/* id 5, wireType 2 =*/42).string(message.actionImage);
                return writer;
            };

            /**
             * Encodes the specified FriendPokeNotice message, length delimited. Does not implicitly {@link kritor.event.FriendPokeNotice.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.event.FriendPokeNotice
             * @static
             * @param {kritor.event.IFriendPokeNotice} message FriendPokeNotice message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            FriendPokeNotice.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a FriendPokeNotice message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.event.FriendPokeNotice
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.event.FriendPokeNotice} FriendPokeNotice
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            FriendPokeNotice.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.event.FriendPokeNotice();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.operatorUid = reader.string();
                            break;
                        }
                    case 2: {
                            message.operatorUin = reader.uint64();
                            break;
                        }
                    case 3: {
                            message.action = reader.string();
                            break;
                        }
                    case 4: {
                            message.suffix = reader.string();
                            break;
                        }
                    case 5: {
                            message.actionImage = reader.string();
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
             * Decodes a FriendPokeNotice message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.event.FriendPokeNotice
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.event.FriendPokeNotice} FriendPokeNotice
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            FriendPokeNotice.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a FriendPokeNotice message.
             * @function verify
             * @memberof kritor.event.FriendPokeNotice
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            FriendPokeNotice.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.operatorUid != null && message.hasOwnProperty("operatorUid"))
                    if (!$util.isString(message.operatorUid))
                        return "operatorUid: string expected";
                if (message.operatorUin != null && message.hasOwnProperty("operatorUin"))
                    if (!$util.isInteger(message.operatorUin) && !(message.operatorUin && $util.isInteger(message.operatorUin.low) && $util.isInteger(message.operatorUin.high)))
                        return "operatorUin: integer|Long expected";
                if (message.action != null && message.hasOwnProperty("action"))
                    if (!$util.isString(message.action))
                        return "action: string expected";
                if (message.suffix != null && message.hasOwnProperty("suffix"))
                    if (!$util.isString(message.suffix))
                        return "suffix: string expected";
                if (message.actionImage != null && message.hasOwnProperty("actionImage"))
                    if (!$util.isString(message.actionImage))
                        return "actionImage: string expected";
                return null;
            };

            /**
             * Creates a FriendPokeNotice message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.event.FriendPokeNotice
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.event.FriendPokeNotice} FriendPokeNotice
             */
            FriendPokeNotice.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.event.FriendPokeNotice)
                    return object;
                let message = new $root.kritor.event.FriendPokeNotice();
                if (object.operatorUid != null)
                    message.operatorUid = String(object.operatorUid);
                if (object.operatorUin != null)
                    if ($util.Long)
                        (message.operatorUin = $util.Long.fromValue(object.operatorUin)).unsigned = true;
                    else if (typeof object.operatorUin === "string")
                        message.operatorUin = parseInt(object.operatorUin, 10);
                    else if (typeof object.operatorUin === "number")
                        message.operatorUin = object.operatorUin;
                    else if (typeof object.operatorUin === "object")
                        message.operatorUin = new $util.LongBits(object.operatorUin.low >>> 0, object.operatorUin.high >>> 0).toNumber(true);
                if (object.action != null)
                    message.action = String(object.action);
                if (object.suffix != null)
                    message.suffix = String(object.suffix);
                if (object.actionImage != null)
                    message.actionImage = String(object.actionImage);
                return message;
            };

            /**
             * Creates a plain object from a FriendPokeNotice message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.event.FriendPokeNotice
             * @static
             * @param {kritor.event.FriendPokeNotice} message FriendPokeNotice
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            FriendPokeNotice.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.operatorUid = "";
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.operatorUin = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.operatorUin = options.longs === String ? "0" : 0;
                    object.action = "";
                    object.suffix = "";
                    object.actionImage = "";
                }
                if (message.operatorUid != null && message.hasOwnProperty("operatorUid"))
                    object.operatorUid = message.operatorUid;
                if (message.operatorUin != null && message.hasOwnProperty("operatorUin"))
                    if (typeof message.operatorUin === "number")
                        object.operatorUin = options.longs === String ? String(message.operatorUin) : message.operatorUin;
                    else
                        object.operatorUin = options.longs === String ? $util.Long.prototype.toString.call(message.operatorUin) : options.longs === Number ? new $util.LongBits(message.operatorUin.low >>> 0, message.operatorUin.high >>> 0).toNumber(true) : message.operatorUin;
                if (message.action != null && message.hasOwnProperty("action"))
                    object.action = message.action;
                if (message.suffix != null && message.hasOwnProperty("suffix"))
                    object.suffix = message.suffix;
                if (message.actionImage != null && message.hasOwnProperty("actionImage"))
                    object.actionImage = message.actionImage;
                return object;
            };

            /**
             * Converts this FriendPokeNotice to JSON.
             * @function toJSON
             * @memberof kritor.event.FriendPokeNotice
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            FriendPokeNotice.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for FriendPokeNotice
             * @function getTypeUrl
             * @memberof kritor.event.FriendPokeNotice
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            FriendPokeNotice.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.event.FriendPokeNotice";
            };

            return FriendPokeNotice;
        })();

        event.FriendRecallNotice = (function() {

            /**
             * Properties of a FriendRecallNotice.
             * @memberof kritor.event
             * @interface IFriendRecallNotice
             * @property {string|null} [operatorUid] FriendRecallNotice operatorUid
             * @property {number|Long|null} [operatorUin] FriendRecallNotice operatorUin
             * @property {string|null} [messageId] FriendRecallNotice messageId
             * @property {string|null} [tipText] FriendRecallNotice tipText
             */

            /**
             * Constructs a new FriendRecallNotice.
             * @memberof kritor.event
             * @classdesc Represents a FriendRecallNotice.
             * @implements IFriendRecallNotice
             * @constructor
             * @param {kritor.event.IFriendRecallNotice=} [properties] Properties to set
             */
            function FriendRecallNotice(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * FriendRecallNotice operatorUid.
             * @member {string} operatorUid
             * @memberof kritor.event.FriendRecallNotice
             * @instance
             */
            FriendRecallNotice.prototype.operatorUid = "";

            /**
             * FriendRecallNotice operatorUin.
             * @member {number|Long} operatorUin
             * @memberof kritor.event.FriendRecallNotice
             * @instance
             */
            FriendRecallNotice.prototype.operatorUin = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * FriendRecallNotice messageId.
             * @member {string} messageId
             * @memberof kritor.event.FriendRecallNotice
             * @instance
             */
            FriendRecallNotice.prototype.messageId = "";

            /**
             * FriendRecallNotice tipText.
             * @member {string} tipText
             * @memberof kritor.event.FriendRecallNotice
             * @instance
             */
            FriendRecallNotice.prototype.tipText = "";

            /**
             * Creates a new FriendRecallNotice instance using the specified properties.
             * @function create
             * @memberof kritor.event.FriendRecallNotice
             * @static
             * @param {kritor.event.IFriendRecallNotice=} [properties] Properties to set
             * @returns {kritor.event.FriendRecallNotice} FriendRecallNotice instance
             */
            FriendRecallNotice.create = function create(properties) {
                return new FriendRecallNotice(properties);
            };

            /**
             * Encodes the specified FriendRecallNotice message. Does not implicitly {@link kritor.event.FriendRecallNotice.verify|verify} messages.
             * @function encode
             * @memberof kritor.event.FriendRecallNotice
             * @static
             * @param {kritor.event.IFriendRecallNotice} message FriendRecallNotice message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            FriendRecallNotice.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.operatorUid != null && Object.hasOwnProperty.call(message, "operatorUid"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.operatorUid);
                if (message.operatorUin != null && Object.hasOwnProperty.call(message, "operatorUin"))
                    writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.operatorUin);
                if (message.messageId != null && Object.hasOwnProperty.call(message, "messageId"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.messageId);
                if (message.tipText != null && Object.hasOwnProperty.call(message, "tipText"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.tipText);
                return writer;
            };

            /**
             * Encodes the specified FriendRecallNotice message, length delimited. Does not implicitly {@link kritor.event.FriendRecallNotice.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.event.FriendRecallNotice
             * @static
             * @param {kritor.event.IFriendRecallNotice} message FriendRecallNotice message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            FriendRecallNotice.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a FriendRecallNotice message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.event.FriendRecallNotice
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.event.FriendRecallNotice} FriendRecallNotice
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            FriendRecallNotice.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.event.FriendRecallNotice();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.operatorUid = reader.string();
                            break;
                        }
                    case 2: {
                            message.operatorUin = reader.uint64();
                            break;
                        }
                    case 3: {
                            message.messageId = reader.string();
                            break;
                        }
                    case 4: {
                            message.tipText = reader.string();
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
             * Decodes a FriendRecallNotice message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.event.FriendRecallNotice
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.event.FriendRecallNotice} FriendRecallNotice
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            FriendRecallNotice.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a FriendRecallNotice message.
             * @function verify
             * @memberof kritor.event.FriendRecallNotice
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            FriendRecallNotice.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.operatorUid != null && message.hasOwnProperty("operatorUid"))
                    if (!$util.isString(message.operatorUid))
                        return "operatorUid: string expected";
                if (message.operatorUin != null && message.hasOwnProperty("operatorUin"))
                    if (!$util.isInteger(message.operatorUin) && !(message.operatorUin && $util.isInteger(message.operatorUin.low) && $util.isInteger(message.operatorUin.high)))
                        return "operatorUin: integer|Long expected";
                if (message.messageId != null && message.hasOwnProperty("messageId"))
                    if (!$util.isString(message.messageId))
                        return "messageId: string expected";
                if (message.tipText != null && message.hasOwnProperty("tipText"))
                    if (!$util.isString(message.tipText))
                        return "tipText: string expected";
                return null;
            };

            /**
             * Creates a FriendRecallNotice message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.event.FriendRecallNotice
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.event.FriendRecallNotice} FriendRecallNotice
             */
            FriendRecallNotice.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.event.FriendRecallNotice)
                    return object;
                let message = new $root.kritor.event.FriendRecallNotice();
                if (object.operatorUid != null)
                    message.operatorUid = String(object.operatorUid);
                if (object.operatorUin != null)
                    if ($util.Long)
                        (message.operatorUin = $util.Long.fromValue(object.operatorUin)).unsigned = true;
                    else if (typeof object.operatorUin === "string")
                        message.operatorUin = parseInt(object.operatorUin, 10);
                    else if (typeof object.operatorUin === "number")
                        message.operatorUin = object.operatorUin;
                    else if (typeof object.operatorUin === "object")
                        message.operatorUin = new $util.LongBits(object.operatorUin.low >>> 0, object.operatorUin.high >>> 0).toNumber(true);
                if (object.messageId != null)
                    message.messageId = String(object.messageId);
                if (object.tipText != null)
                    message.tipText = String(object.tipText);
                return message;
            };

            /**
             * Creates a plain object from a FriendRecallNotice message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.event.FriendRecallNotice
             * @static
             * @param {kritor.event.FriendRecallNotice} message FriendRecallNotice
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            FriendRecallNotice.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.operatorUid = "";
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.operatorUin = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.operatorUin = options.longs === String ? "0" : 0;
                    object.messageId = "";
                    object.tipText = "";
                }
                if (message.operatorUid != null && message.hasOwnProperty("operatorUid"))
                    object.operatorUid = message.operatorUid;
                if (message.operatorUin != null && message.hasOwnProperty("operatorUin"))
                    if (typeof message.operatorUin === "number")
                        object.operatorUin = options.longs === String ? String(message.operatorUin) : message.operatorUin;
                    else
                        object.operatorUin = options.longs === String ? $util.Long.prototype.toString.call(message.operatorUin) : options.longs === Number ? new $util.LongBits(message.operatorUin.low >>> 0, message.operatorUin.high >>> 0).toNumber(true) : message.operatorUin;
                if (message.messageId != null && message.hasOwnProperty("messageId"))
                    object.messageId = message.messageId;
                if (message.tipText != null && message.hasOwnProperty("tipText"))
                    object.tipText = message.tipText;
                return object;
            };

            /**
             * Converts this FriendRecallNotice to JSON.
             * @function toJSON
             * @memberof kritor.event.FriendRecallNotice
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            FriendRecallNotice.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for FriendRecallNotice
             * @function getTypeUrl
             * @memberof kritor.event.FriendRecallNotice
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            FriendRecallNotice.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.event.FriendRecallNotice";
            };

            return FriendRecallNotice;
        })();

        event.GroupUniqueTitleChangedNotice = (function() {

            /**
             * Properties of a GroupUniqueTitleChangedNotice.
             * @memberof kritor.event
             * @interface IGroupUniqueTitleChangedNotice
             * @property {number|Long|null} [target] GroupUniqueTitleChangedNotice target
             * @property {string|null} [title] GroupUniqueTitleChangedNotice title
             * @property {number|Long|null} [groupId] GroupUniqueTitleChangedNotice groupId
             */

            /**
             * Constructs a new GroupUniqueTitleChangedNotice.
             * @memberof kritor.event
             * @classdesc Represents a GroupUniqueTitleChangedNotice.
             * @implements IGroupUniqueTitleChangedNotice
             * @constructor
             * @param {kritor.event.IGroupUniqueTitleChangedNotice=} [properties] Properties to set
             */
            function GroupUniqueTitleChangedNotice(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GroupUniqueTitleChangedNotice target.
             * @member {number|Long} target
             * @memberof kritor.event.GroupUniqueTitleChangedNotice
             * @instance
             */
            GroupUniqueTitleChangedNotice.prototype.target = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * GroupUniqueTitleChangedNotice title.
             * @member {string} title
             * @memberof kritor.event.GroupUniqueTitleChangedNotice
             * @instance
             */
            GroupUniqueTitleChangedNotice.prototype.title = "";

            /**
             * GroupUniqueTitleChangedNotice groupId.
             * @member {number|Long} groupId
             * @memberof kritor.event.GroupUniqueTitleChangedNotice
             * @instance
             */
            GroupUniqueTitleChangedNotice.prototype.groupId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * Creates a new GroupUniqueTitleChangedNotice instance using the specified properties.
             * @function create
             * @memberof kritor.event.GroupUniqueTitleChangedNotice
             * @static
             * @param {kritor.event.IGroupUniqueTitleChangedNotice=} [properties] Properties to set
             * @returns {kritor.event.GroupUniqueTitleChangedNotice} GroupUniqueTitleChangedNotice instance
             */
            GroupUniqueTitleChangedNotice.create = function create(properties) {
                return new GroupUniqueTitleChangedNotice(properties);
            };

            /**
             * Encodes the specified GroupUniqueTitleChangedNotice message. Does not implicitly {@link kritor.event.GroupUniqueTitleChangedNotice.verify|verify} messages.
             * @function encode
             * @memberof kritor.event.GroupUniqueTitleChangedNotice
             * @static
             * @param {kritor.event.IGroupUniqueTitleChangedNotice} message GroupUniqueTitleChangedNotice message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GroupUniqueTitleChangedNotice.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.target != null && Object.hasOwnProperty.call(message, "target"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.target);
                if (message.title != null && Object.hasOwnProperty.call(message, "title"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.title);
                if (message.groupId != null && Object.hasOwnProperty.call(message, "groupId"))
                    writer.uint32(/* id 3, wireType 0 =*/24).uint64(message.groupId);
                return writer;
            };

            /**
             * Encodes the specified GroupUniqueTitleChangedNotice message, length delimited. Does not implicitly {@link kritor.event.GroupUniqueTitleChangedNotice.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.event.GroupUniqueTitleChangedNotice
             * @static
             * @param {kritor.event.IGroupUniqueTitleChangedNotice} message GroupUniqueTitleChangedNotice message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GroupUniqueTitleChangedNotice.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GroupUniqueTitleChangedNotice message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.event.GroupUniqueTitleChangedNotice
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.event.GroupUniqueTitleChangedNotice} GroupUniqueTitleChangedNotice
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GroupUniqueTitleChangedNotice.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.event.GroupUniqueTitleChangedNotice();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.target = reader.uint64();
                            break;
                        }
                    case 2: {
                            message.title = reader.string();
                            break;
                        }
                    case 3: {
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
             * Decodes a GroupUniqueTitleChangedNotice message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.event.GroupUniqueTitleChangedNotice
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.event.GroupUniqueTitleChangedNotice} GroupUniqueTitleChangedNotice
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GroupUniqueTitleChangedNotice.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GroupUniqueTitleChangedNotice message.
             * @function verify
             * @memberof kritor.event.GroupUniqueTitleChangedNotice
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GroupUniqueTitleChangedNotice.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.target != null && message.hasOwnProperty("target"))
                    if (!$util.isInteger(message.target) && !(message.target && $util.isInteger(message.target.low) && $util.isInteger(message.target.high)))
                        return "target: integer|Long expected";
                if (message.title != null && message.hasOwnProperty("title"))
                    if (!$util.isString(message.title))
                        return "title: string expected";
                if (message.groupId != null && message.hasOwnProperty("groupId"))
                    if (!$util.isInteger(message.groupId) && !(message.groupId && $util.isInteger(message.groupId.low) && $util.isInteger(message.groupId.high)))
                        return "groupId: integer|Long expected";
                return null;
            };

            /**
             * Creates a GroupUniqueTitleChangedNotice message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.event.GroupUniqueTitleChangedNotice
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.event.GroupUniqueTitleChangedNotice} GroupUniqueTitleChangedNotice
             */
            GroupUniqueTitleChangedNotice.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.event.GroupUniqueTitleChangedNotice)
                    return object;
                let message = new $root.kritor.event.GroupUniqueTitleChangedNotice();
                if (object.target != null)
                    if ($util.Long)
                        (message.target = $util.Long.fromValue(object.target)).unsigned = true;
                    else if (typeof object.target === "string")
                        message.target = parseInt(object.target, 10);
                    else if (typeof object.target === "number")
                        message.target = object.target;
                    else if (typeof object.target === "object")
                        message.target = new $util.LongBits(object.target.low >>> 0, object.target.high >>> 0).toNumber(true);
                if (object.title != null)
                    message.title = String(object.title);
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
             * Creates a plain object from a GroupUniqueTitleChangedNotice message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.event.GroupUniqueTitleChangedNotice
             * @static
             * @param {kritor.event.GroupUniqueTitleChangedNotice} message GroupUniqueTitleChangedNotice
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GroupUniqueTitleChangedNotice.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.target = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.target = options.longs === String ? "0" : 0;
                    object.title = "";
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.groupId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.groupId = options.longs === String ? "0" : 0;
                }
                if (message.target != null && message.hasOwnProperty("target"))
                    if (typeof message.target === "number")
                        object.target = options.longs === String ? String(message.target) : message.target;
                    else
                        object.target = options.longs === String ? $util.Long.prototype.toString.call(message.target) : options.longs === Number ? new $util.LongBits(message.target.low >>> 0, message.target.high >>> 0).toNumber(true) : message.target;
                if (message.title != null && message.hasOwnProperty("title"))
                    object.title = message.title;
                if (message.groupId != null && message.hasOwnProperty("groupId"))
                    if (typeof message.groupId === "number")
                        object.groupId = options.longs === String ? String(message.groupId) : message.groupId;
                    else
                        object.groupId = options.longs === String ? $util.Long.prototype.toString.call(message.groupId) : options.longs === Number ? new $util.LongBits(message.groupId.low >>> 0, message.groupId.high >>> 0).toNumber(true) : message.groupId;
                return object;
            };

            /**
             * Converts this GroupUniqueTitleChangedNotice to JSON.
             * @function toJSON
             * @memberof kritor.event.GroupUniqueTitleChangedNotice
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GroupUniqueTitleChangedNotice.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GroupUniqueTitleChangedNotice
             * @function getTypeUrl
             * @memberof kritor.event.GroupUniqueTitleChangedNotice
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GroupUniqueTitleChangedNotice.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.event.GroupUniqueTitleChangedNotice";
            };

            return GroupUniqueTitleChangedNotice;
        })();

        event.GroupEssenceMessageNotice = (function() {

            /**
             * Properties of a GroupEssenceMessageNotice.
             * @memberof kritor.event
             * @interface IGroupEssenceMessageNotice
             * @property {number|Long|null} [groupId] GroupEssenceMessageNotice groupId
             * @property {string|null} [operatorUid] GroupEssenceMessageNotice operatorUid
             * @property {number|Long|null} [operatorUin] GroupEssenceMessageNotice operatorUin
             * @property {string|null} [targetUid] GroupEssenceMessageNotice targetUid
             * @property {number|Long|null} [targetUin] GroupEssenceMessageNotice targetUin
             * @property {string|null} [messageId] GroupEssenceMessageNotice messageId
             * @property {number|null} [subType] GroupEssenceMessageNotice subType
             */

            /**
             * Constructs a new GroupEssenceMessageNotice.
             * @memberof kritor.event
             * @classdesc Represents a GroupEssenceMessageNotice.
             * @implements IGroupEssenceMessageNotice
             * @constructor
             * @param {kritor.event.IGroupEssenceMessageNotice=} [properties] Properties to set
             */
            function GroupEssenceMessageNotice(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GroupEssenceMessageNotice groupId.
             * @member {number|Long} groupId
             * @memberof kritor.event.GroupEssenceMessageNotice
             * @instance
             */
            GroupEssenceMessageNotice.prototype.groupId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * GroupEssenceMessageNotice operatorUid.
             * @member {string} operatorUid
             * @memberof kritor.event.GroupEssenceMessageNotice
             * @instance
             */
            GroupEssenceMessageNotice.prototype.operatorUid = "";

            /**
             * GroupEssenceMessageNotice operatorUin.
             * @member {number|Long} operatorUin
             * @memberof kritor.event.GroupEssenceMessageNotice
             * @instance
             */
            GroupEssenceMessageNotice.prototype.operatorUin = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * GroupEssenceMessageNotice targetUid.
             * @member {string} targetUid
             * @memberof kritor.event.GroupEssenceMessageNotice
             * @instance
             */
            GroupEssenceMessageNotice.prototype.targetUid = "";

            /**
             * GroupEssenceMessageNotice targetUin.
             * @member {number|Long} targetUin
             * @memberof kritor.event.GroupEssenceMessageNotice
             * @instance
             */
            GroupEssenceMessageNotice.prototype.targetUin = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * GroupEssenceMessageNotice messageId.
             * @member {string} messageId
             * @memberof kritor.event.GroupEssenceMessageNotice
             * @instance
             */
            GroupEssenceMessageNotice.prototype.messageId = "";

            /**
             * GroupEssenceMessageNotice subType.
             * @member {number} subType
             * @memberof kritor.event.GroupEssenceMessageNotice
             * @instance
             */
            GroupEssenceMessageNotice.prototype.subType = 0;

            /**
             * Creates a new GroupEssenceMessageNotice instance using the specified properties.
             * @function create
             * @memberof kritor.event.GroupEssenceMessageNotice
             * @static
             * @param {kritor.event.IGroupEssenceMessageNotice=} [properties] Properties to set
             * @returns {kritor.event.GroupEssenceMessageNotice} GroupEssenceMessageNotice instance
             */
            GroupEssenceMessageNotice.create = function create(properties) {
                return new GroupEssenceMessageNotice(properties);
            };

            /**
             * Encodes the specified GroupEssenceMessageNotice message. Does not implicitly {@link kritor.event.GroupEssenceMessageNotice.verify|verify} messages.
             * @function encode
             * @memberof kritor.event.GroupEssenceMessageNotice
             * @static
             * @param {kritor.event.IGroupEssenceMessageNotice} message GroupEssenceMessageNotice message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GroupEssenceMessageNotice.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.groupId != null && Object.hasOwnProperty.call(message, "groupId"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.groupId);
                if (message.operatorUid != null && Object.hasOwnProperty.call(message, "operatorUid"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.operatorUid);
                if (message.operatorUin != null && Object.hasOwnProperty.call(message, "operatorUin"))
                    writer.uint32(/* id 3, wireType 0 =*/24).uint64(message.operatorUin);
                if (message.targetUid != null && Object.hasOwnProperty.call(message, "targetUid"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.targetUid);
                if (message.targetUin != null && Object.hasOwnProperty.call(message, "targetUin"))
                    writer.uint32(/* id 5, wireType 0 =*/40).uint64(message.targetUin);
                if (message.messageId != null && Object.hasOwnProperty.call(message, "messageId"))
                    writer.uint32(/* id 6, wireType 2 =*/50).string(message.messageId);
                if (message.subType != null && Object.hasOwnProperty.call(message, "subType"))
                    writer.uint32(/* id 7, wireType 0 =*/56).uint32(message.subType);
                return writer;
            };

            /**
             * Encodes the specified GroupEssenceMessageNotice message, length delimited. Does not implicitly {@link kritor.event.GroupEssenceMessageNotice.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.event.GroupEssenceMessageNotice
             * @static
             * @param {kritor.event.IGroupEssenceMessageNotice} message GroupEssenceMessageNotice message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GroupEssenceMessageNotice.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GroupEssenceMessageNotice message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.event.GroupEssenceMessageNotice
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.event.GroupEssenceMessageNotice} GroupEssenceMessageNotice
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GroupEssenceMessageNotice.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.event.GroupEssenceMessageNotice();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.groupId = reader.uint64();
                            break;
                        }
                    case 2: {
                            message.operatorUid = reader.string();
                            break;
                        }
                    case 3: {
                            message.operatorUin = reader.uint64();
                            break;
                        }
                    case 4: {
                            message.targetUid = reader.string();
                            break;
                        }
                    case 5: {
                            message.targetUin = reader.uint64();
                            break;
                        }
                    case 6: {
                            message.messageId = reader.string();
                            break;
                        }
                    case 7: {
                            message.subType = reader.uint32();
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
             * Decodes a GroupEssenceMessageNotice message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.event.GroupEssenceMessageNotice
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.event.GroupEssenceMessageNotice} GroupEssenceMessageNotice
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GroupEssenceMessageNotice.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GroupEssenceMessageNotice message.
             * @function verify
             * @memberof kritor.event.GroupEssenceMessageNotice
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GroupEssenceMessageNotice.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.groupId != null && message.hasOwnProperty("groupId"))
                    if (!$util.isInteger(message.groupId) && !(message.groupId && $util.isInteger(message.groupId.low) && $util.isInteger(message.groupId.high)))
                        return "groupId: integer|Long expected";
                if (message.operatorUid != null && message.hasOwnProperty("operatorUid"))
                    if (!$util.isString(message.operatorUid))
                        return "operatorUid: string expected";
                if (message.operatorUin != null && message.hasOwnProperty("operatorUin"))
                    if (!$util.isInteger(message.operatorUin) && !(message.operatorUin && $util.isInteger(message.operatorUin.low) && $util.isInteger(message.operatorUin.high)))
                        return "operatorUin: integer|Long expected";
                if (message.targetUid != null && message.hasOwnProperty("targetUid"))
                    if (!$util.isString(message.targetUid))
                        return "targetUid: string expected";
                if (message.targetUin != null && message.hasOwnProperty("targetUin"))
                    if (!$util.isInteger(message.targetUin) && !(message.targetUin && $util.isInteger(message.targetUin.low) && $util.isInteger(message.targetUin.high)))
                        return "targetUin: integer|Long expected";
                if (message.messageId != null && message.hasOwnProperty("messageId"))
                    if (!$util.isString(message.messageId))
                        return "messageId: string expected";
                if (message.subType != null && message.hasOwnProperty("subType"))
                    if (!$util.isInteger(message.subType))
                        return "subType: integer expected";
                return null;
            };

            /**
             * Creates a GroupEssenceMessageNotice message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.event.GroupEssenceMessageNotice
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.event.GroupEssenceMessageNotice} GroupEssenceMessageNotice
             */
            GroupEssenceMessageNotice.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.event.GroupEssenceMessageNotice)
                    return object;
                let message = new $root.kritor.event.GroupEssenceMessageNotice();
                if (object.groupId != null)
                    if ($util.Long)
                        (message.groupId = $util.Long.fromValue(object.groupId)).unsigned = true;
                    else if (typeof object.groupId === "string")
                        message.groupId = parseInt(object.groupId, 10);
                    else if (typeof object.groupId === "number")
                        message.groupId = object.groupId;
                    else if (typeof object.groupId === "object")
                        message.groupId = new $util.LongBits(object.groupId.low >>> 0, object.groupId.high >>> 0).toNumber(true);
                if (object.operatorUid != null)
                    message.operatorUid = String(object.operatorUid);
                if (object.operatorUin != null)
                    if ($util.Long)
                        (message.operatorUin = $util.Long.fromValue(object.operatorUin)).unsigned = true;
                    else if (typeof object.operatorUin === "string")
                        message.operatorUin = parseInt(object.operatorUin, 10);
                    else if (typeof object.operatorUin === "number")
                        message.operatorUin = object.operatorUin;
                    else if (typeof object.operatorUin === "object")
                        message.operatorUin = new $util.LongBits(object.operatorUin.low >>> 0, object.operatorUin.high >>> 0).toNumber(true);
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
                if (object.messageId != null)
                    message.messageId = String(object.messageId);
                if (object.subType != null)
                    message.subType = object.subType >>> 0;
                return message;
            };

            /**
             * Creates a plain object from a GroupEssenceMessageNotice message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.event.GroupEssenceMessageNotice
             * @static
             * @param {kritor.event.GroupEssenceMessageNotice} message GroupEssenceMessageNotice
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GroupEssenceMessageNotice.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.groupId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.groupId = options.longs === String ? "0" : 0;
                    object.operatorUid = "";
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.operatorUin = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.operatorUin = options.longs === String ? "0" : 0;
                    object.targetUid = "";
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.targetUin = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.targetUin = options.longs === String ? "0" : 0;
                    object.messageId = "";
                    object.subType = 0;
                }
                if (message.groupId != null && message.hasOwnProperty("groupId"))
                    if (typeof message.groupId === "number")
                        object.groupId = options.longs === String ? String(message.groupId) : message.groupId;
                    else
                        object.groupId = options.longs === String ? $util.Long.prototype.toString.call(message.groupId) : options.longs === Number ? new $util.LongBits(message.groupId.low >>> 0, message.groupId.high >>> 0).toNumber(true) : message.groupId;
                if (message.operatorUid != null && message.hasOwnProperty("operatorUid"))
                    object.operatorUid = message.operatorUid;
                if (message.operatorUin != null && message.hasOwnProperty("operatorUin"))
                    if (typeof message.operatorUin === "number")
                        object.operatorUin = options.longs === String ? String(message.operatorUin) : message.operatorUin;
                    else
                        object.operatorUin = options.longs === String ? $util.Long.prototype.toString.call(message.operatorUin) : options.longs === Number ? new $util.LongBits(message.operatorUin.low >>> 0, message.operatorUin.high >>> 0).toNumber(true) : message.operatorUin;
                if (message.targetUid != null && message.hasOwnProperty("targetUid"))
                    object.targetUid = message.targetUid;
                if (message.targetUin != null && message.hasOwnProperty("targetUin"))
                    if (typeof message.targetUin === "number")
                        object.targetUin = options.longs === String ? String(message.targetUin) : message.targetUin;
                    else
                        object.targetUin = options.longs === String ? $util.Long.prototype.toString.call(message.targetUin) : options.longs === Number ? new $util.LongBits(message.targetUin.low >>> 0, message.targetUin.high >>> 0).toNumber(true) : message.targetUin;
                if (message.messageId != null && message.hasOwnProperty("messageId"))
                    object.messageId = message.messageId;
                if (message.subType != null && message.hasOwnProperty("subType"))
                    object.subType = message.subType;
                return object;
            };

            /**
             * Converts this GroupEssenceMessageNotice to JSON.
             * @function toJSON
             * @memberof kritor.event.GroupEssenceMessageNotice
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GroupEssenceMessageNotice.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GroupEssenceMessageNotice
             * @function getTypeUrl
             * @memberof kritor.event.GroupEssenceMessageNotice
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GroupEssenceMessageNotice.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.event.GroupEssenceMessageNotice";
            };

            return GroupEssenceMessageNotice;
        })();

        event.GroupPokeNotice = (function() {

            /**
             * Properties of a GroupPokeNotice.
             * @memberof kritor.event
             * @interface IGroupPokeNotice
             * @property {number|Long|null} [groupId] GroupPokeNotice groupId
             * @property {string|null} [operatorUid] GroupPokeNotice operatorUid
             * @property {number|Long|null} [operatorUin] GroupPokeNotice operatorUin
             * @property {string|null} [targetUid] GroupPokeNotice targetUid
             * @property {number|Long|null} [targetUin] GroupPokeNotice targetUin
             * @property {string|null} [action] GroupPokeNotice action
             * @property {string|null} [suffix] GroupPokeNotice suffix
             * @property {string|null} [actionImage] GroupPokeNotice actionImage
             */

            /**
             * Constructs a new GroupPokeNotice.
             * @memberof kritor.event
             * @classdesc Represents a GroupPokeNotice.
             * @implements IGroupPokeNotice
             * @constructor
             * @param {kritor.event.IGroupPokeNotice=} [properties] Properties to set
             */
            function GroupPokeNotice(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GroupPokeNotice groupId.
             * @member {number|Long} groupId
             * @memberof kritor.event.GroupPokeNotice
             * @instance
             */
            GroupPokeNotice.prototype.groupId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * GroupPokeNotice operatorUid.
             * @member {string} operatorUid
             * @memberof kritor.event.GroupPokeNotice
             * @instance
             */
            GroupPokeNotice.prototype.operatorUid = "";

            /**
             * GroupPokeNotice operatorUin.
             * @member {number|Long} operatorUin
             * @memberof kritor.event.GroupPokeNotice
             * @instance
             */
            GroupPokeNotice.prototype.operatorUin = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * GroupPokeNotice targetUid.
             * @member {string} targetUid
             * @memberof kritor.event.GroupPokeNotice
             * @instance
             */
            GroupPokeNotice.prototype.targetUid = "";

            /**
             * GroupPokeNotice targetUin.
             * @member {number|Long} targetUin
             * @memberof kritor.event.GroupPokeNotice
             * @instance
             */
            GroupPokeNotice.prototype.targetUin = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * GroupPokeNotice action.
             * @member {string} action
             * @memberof kritor.event.GroupPokeNotice
             * @instance
             */
            GroupPokeNotice.prototype.action = "";

            /**
             * GroupPokeNotice suffix.
             * @member {string} suffix
             * @memberof kritor.event.GroupPokeNotice
             * @instance
             */
            GroupPokeNotice.prototype.suffix = "";

            /**
             * GroupPokeNotice actionImage.
             * @member {string} actionImage
             * @memberof kritor.event.GroupPokeNotice
             * @instance
             */
            GroupPokeNotice.prototype.actionImage = "";

            /**
             * Creates a new GroupPokeNotice instance using the specified properties.
             * @function create
             * @memberof kritor.event.GroupPokeNotice
             * @static
             * @param {kritor.event.IGroupPokeNotice=} [properties] Properties to set
             * @returns {kritor.event.GroupPokeNotice} GroupPokeNotice instance
             */
            GroupPokeNotice.create = function create(properties) {
                return new GroupPokeNotice(properties);
            };

            /**
             * Encodes the specified GroupPokeNotice message. Does not implicitly {@link kritor.event.GroupPokeNotice.verify|verify} messages.
             * @function encode
             * @memberof kritor.event.GroupPokeNotice
             * @static
             * @param {kritor.event.IGroupPokeNotice} message GroupPokeNotice message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GroupPokeNotice.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.groupId != null && Object.hasOwnProperty.call(message, "groupId"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.groupId);
                if (message.operatorUid != null && Object.hasOwnProperty.call(message, "operatorUid"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.operatorUid);
                if (message.operatorUin != null && Object.hasOwnProperty.call(message, "operatorUin"))
                    writer.uint32(/* id 3, wireType 0 =*/24).uint64(message.operatorUin);
                if (message.targetUid != null && Object.hasOwnProperty.call(message, "targetUid"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.targetUid);
                if (message.targetUin != null && Object.hasOwnProperty.call(message, "targetUin"))
                    writer.uint32(/* id 5, wireType 0 =*/40).uint64(message.targetUin);
                if (message.action != null && Object.hasOwnProperty.call(message, "action"))
                    writer.uint32(/* id 6, wireType 2 =*/50).string(message.action);
                if (message.suffix != null && Object.hasOwnProperty.call(message, "suffix"))
                    writer.uint32(/* id 7, wireType 2 =*/58).string(message.suffix);
                if (message.actionImage != null && Object.hasOwnProperty.call(message, "actionImage"))
                    writer.uint32(/* id 8, wireType 2 =*/66).string(message.actionImage);
                return writer;
            };

            /**
             * Encodes the specified GroupPokeNotice message, length delimited. Does not implicitly {@link kritor.event.GroupPokeNotice.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.event.GroupPokeNotice
             * @static
             * @param {kritor.event.IGroupPokeNotice} message GroupPokeNotice message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GroupPokeNotice.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GroupPokeNotice message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.event.GroupPokeNotice
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.event.GroupPokeNotice} GroupPokeNotice
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GroupPokeNotice.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.event.GroupPokeNotice();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.groupId = reader.uint64();
                            break;
                        }
                    case 2: {
                            message.operatorUid = reader.string();
                            break;
                        }
                    case 3: {
                            message.operatorUin = reader.uint64();
                            break;
                        }
                    case 4: {
                            message.targetUid = reader.string();
                            break;
                        }
                    case 5: {
                            message.targetUin = reader.uint64();
                            break;
                        }
                    case 6: {
                            message.action = reader.string();
                            break;
                        }
                    case 7: {
                            message.suffix = reader.string();
                            break;
                        }
                    case 8: {
                            message.actionImage = reader.string();
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
             * Decodes a GroupPokeNotice message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.event.GroupPokeNotice
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.event.GroupPokeNotice} GroupPokeNotice
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GroupPokeNotice.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GroupPokeNotice message.
             * @function verify
             * @memberof kritor.event.GroupPokeNotice
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GroupPokeNotice.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.groupId != null && message.hasOwnProperty("groupId"))
                    if (!$util.isInteger(message.groupId) && !(message.groupId && $util.isInteger(message.groupId.low) && $util.isInteger(message.groupId.high)))
                        return "groupId: integer|Long expected";
                if (message.operatorUid != null && message.hasOwnProperty("operatorUid"))
                    if (!$util.isString(message.operatorUid))
                        return "operatorUid: string expected";
                if (message.operatorUin != null && message.hasOwnProperty("operatorUin"))
                    if (!$util.isInteger(message.operatorUin) && !(message.operatorUin && $util.isInteger(message.operatorUin.low) && $util.isInteger(message.operatorUin.high)))
                        return "operatorUin: integer|Long expected";
                if (message.targetUid != null && message.hasOwnProperty("targetUid"))
                    if (!$util.isString(message.targetUid))
                        return "targetUid: string expected";
                if (message.targetUin != null && message.hasOwnProperty("targetUin"))
                    if (!$util.isInteger(message.targetUin) && !(message.targetUin && $util.isInteger(message.targetUin.low) && $util.isInteger(message.targetUin.high)))
                        return "targetUin: integer|Long expected";
                if (message.action != null && message.hasOwnProperty("action"))
                    if (!$util.isString(message.action))
                        return "action: string expected";
                if (message.suffix != null && message.hasOwnProperty("suffix"))
                    if (!$util.isString(message.suffix))
                        return "suffix: string expected";
                if (message.actionImage != null && message.hasOwnProperty("actionImage"))
                    if (!$util.isString(message.actionImage))
                        return "actionImage: string expected";
                return null;
            };

            /**
             * Creates a GroupPokeNotice message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.event.GroupPokeNotice
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.event.GroupPokeNotice} GroupPokeNotice
             */
            GroupPokeNotice.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.event.GroupPokeNotice)
                    return object;
                let message = new $root.kritor.event.GroupPokeNotice();
                if (object.groupId != null)
                    if ($util.Long)
                        (message.groupId = $util.Long.fromValue(object.groupId)).unsigned = true;
                    else if (typeof object.groupId === "string")
                        message.groupId = parseInt(object.groupId, 10);
                    else if (typeof object.groupId === "number")
                        message.groupId = object.groupId;
                    else if (typeof object.groupId === "object")
                        message.groupId = new $util.LongBits(object.groupId.low >>> 0, object.groupId.high >>> 0).toNumber(true);
                if (object.operatorUid != null)
                    message.operatorUid = String(object.operatorUid);
                if (object.operatorUin != null)
                    if ($util.Long)
                        (message.operatorUin = $util.Long.fromValue(object.operatorUin)).unsigned = true;
                    else if (typeof object.operatorUin === "string")
                        message.operatorUin = parseInt(object.operatorUin, 10);
                    else if (typeof object.operatorUin === "number")
                        message.operatorUin = object.operatorUin;
                    else if (typeof object.operatorUin === "object")
                        message.operatorUin = new $util.LongBits(object.operatorUin.low >>> 0, object.operatorUin.high >>> 0).toNumber(true);
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
                if (object.action != null)
                    message.action = String(object.action);
                if (object.suffix != null)
                    message.suffix = String(object.suffix);
                if (object.actionImage != null)
                    message.actionImage = String(object.actionImage);
                return message;
            };

            /**
             * Creates a plain object from a GroupPokeNotice message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.event.GroupPokeNotice
             * @static
             * @param {kritor.event.GroupPokeNotice} message GroupPokeNotice
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GroupPokeNotice.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.groupId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.groupId = options.longs === String ? "0" : 0;
                    object.operatorUid = "";
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.operatorUin = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.operatorUin = options.longs === String ? "0" : 0;
                    object.targetUid = "";
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.targetUin = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.targetUin = options.longs === String ? "0" : 0;
                    object.action = "";
                    object.suffix = "";
                    object.actionImage = "";
                }
                if (message.groupId != null && message.hasOwnProperty("groupId"))
                    if (typeof message.groupId === "number")
                        object.groupId = options.longs === String ? String(message.groupId) : message.groupId;
                    else
                        object.groupId = options.longs === String ? $util.Long.prototype.toString.call(message.groupId) : options.longs === Number ? new $util.LongBits(message.groupId.low >>> 0, message.groupId.high >>> 0).toNumber(true) : message.groupId;
                if (message.operatorUid != null && message.hasOwnProperty("operatorUid"))
                    object.operatorUid = message.operatorUid;
                if (message.operatorUin != null && message.hasOwnProperty("operatorUin"))
                    if (typeof message.operatorUin === "number")
                        object.operatorUin = options.longs === String ? String(message.operatorUin) : message.operatorUin;
                    else
                        object.operatorUin = options.longs === String ? $util.Long.prototype.toString.call(message.operatorUin) : options.longs === Number ? new $util.LongBits(message.operatorUin.low >>> 0, message.operatorUin.high >>> 0).toNumber(true) : message.operatorUin;
                if (message.targetUid != null && message.hasOwnProperty("targetUid"))
                    object.targetUid = message.targetUid;
                if (message.targetUin != null && message.hasOwnProperty("targetUin"))
                    if (typeof message.targetUin === "number")
                        object.targetUin = options.longs === String ? String(message.targetUin) : message.targetUin;
                    else
                        object.targetUin = options.longs === String ? $util.Long.prototype.toString.call(message.targetUin) : options.longs === Number ? new $util.LongBits(message.targetUin.low >>> 0, message.targetUin.high >>> 0).toNumber(true) : message.targetUin;
                if (message.action != null && message.hasOwnProperty("action"))
                    object.action = message.action;
                if (message.suffix != null && message.hasOwnProperty("suffix"))
                    object.suffix = message.suffix;
                if (message.actionImage != null && message.hasOwnProperty("actionImage"))
                    object.actionImage = message.actionImage;
                return object;
            };

            /**
             * Converts this GroupPokeNotice to JSON.
             * @function toJSON
             * @memberof kritor.event.GroupPokeNotice
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GroupPokeNotice.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GroupPokeNotice
             * @function getTypeUrl
             * @memberof kritor.event.GroupPokeNotice
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GroupPokeNotice.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.event.GroupPokeNotice";
            };

            return GroupPokeNotice;
        })();

        event.GroupCardChangedNotice = (function() {

            /**
             * Properties of a GroupCardChangedNotice.
             * @memberof kritor.event
             * @interface IGroupCardChangedNotice
             * @property {number|Long|null} [groupId] GroupCardChangedNotice groupId
             * @property {string|null} [operatorUid] GroupCardChangedNotice operatorUid
             * @property {number|Long|null} [operatorUin] GroupCardChangedNotice operatorUin
             * @property {string|null} [targetUid] GroupCardChangedNotice targetUid
             * @property {number|Long|null} [targetUin] GroupCardChangedNotice targetUin
             * @property {string|null} [newCard] GroupCardChangedNotice newCard
             */

            /**
             * Constructs a new GroupCardChangedNotice.
             * @memberof kritor.event
             * @classdesc Represents a GroupCardChangedNotice.
             * @implements IGroupCardChangedNotice
             * @constructor
             * @param {kritor.event.IGroupCardChangedNotice=} [properties] Properties to set
             */
            function GroupCardChangedNotice(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GroupCardChangedNotice groupId.
             * @member {number|Long} groupId
             * @memberof kritor.event.GroupCardChangedNotice
             * @instance
             */
            GroupCardChangedNotice.prototype.groupId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * GroupCardChangedNotice operatorUid.
             * @member {string} operatorUid
             * @memberof kritor.event.GroupCardChangedNotice
             * @instance
             */
            GroupCardChangedNotice.prototype.operatorUid = "";

            /**
             * GroupCardChangedNotice operatorUin.
             * @member {number|Long} operatorUin
             * @memberof kritor.event.GroupCardChangedNotice
             * @instance
             */
            GroupCardChangedNotice.prototype.operatorUin = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * GroupCardChangedNotice targetUid.
             * @member {string} targetUid
             * @memberof kritor.event.GroupCardChangedNotice
             * @instance
             */
            GroupCardChangedNotice.prototype.targetUid = "";

            /**
             * GroupCardChangedNotice targetUin.
             * @member {number|Long} targetUin
             * @memberof kritor.event.GroupCardChangedNotice
             * @instance
             */
            GroupCardChangedNotice.prototype.targetUin = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * GroupCardChangedNotice newCard.
             * @member {string} newCard
             * @memberof kritor.event.GroupCardChangedNotice
             * @instance
             */
            GroupCardChangedNotice.prototype.newCard = "";

            /**
             * Creates a new GroupCardChangedNotice instance using the specified properties.
             * @function create
             * @memberof kritor.event.GroupCardChangedNotice
             * @static
             * @param {kritor.event.IGroupCardChangedNotice=} [properties] Properties to set
             * @returns {kritor.event.GroupCardChangedNotice} GroupCardChangedNotice instance
             */
            GroupCardChangedNotice.create = function create(properties) {
                return new GroupCardChangedNotice(properties);
            };

            /**
             * Encodes the specified GroupCardChangedNotice message. Does not implicitly {@link kritor.event.GroupCardChangedNotice.verify|verify} messages.
             * @function encode
             * @memberof kritor.event.GroupCardChangedNotice
             * @static
             * @param {kritor.event.IGroupCardChangedNotice} message GroupCardChangedNotice message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GroupCardChangedNotice.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.groupId != null && Object.hasOwnProperty.call(message, "groupId"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.groupId);
                if (message.operatorUid != null && Object.hasOwnProperty.call(message, "operatorUid"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.operatorUid);
                if (message.operatorUin != null && Object.hasOwnProperty.call(message, "operatorUin"))
                    writer.uint32(/* id 3, wireType 0 =*/24).uint64(message.operatorUin);
                if (message.targetUid != null && Object.hasOwnProperty.call(message, "targetUid"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.targetUid);
                if (message.targetUin != null && Object.hasOwnProperty.call(message, "targetUin"))
                    writer.uint32(/* id 5, wireType 0 =*/40).uint64(message.targetUin);
                if (message.newCard != null && Object.hasOwnProperty.call(message, "newCard"))
                    writer.uint32(/* id 6, wireType 2 =*/50).string(message.newCard);
                return writer;
            };

            /**
             * Encodes the specified GroupCardChangedNotice message, length delimited. Does not implicitly {@link kritor.event.GroupCardChangedNotice.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.event.GroupCardChangedNotice
             * @static
             * @param {kritor.event.IGroupCardChangedNotice} message GroupCardChangedNotice message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GroupCardChangedNotice.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GroupCardChangedNotice message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.event.GroupCardChangedNotice
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.event.GroupCardChangedNotice} GroupCardChangedNotice
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GroupCardChangedNotice.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.event.GroupCardChangedNotice();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.groupId = reader.uint64();
                            break;
                        }
                    case 2: {
                            message.operatorUid = reader.string();
                            break;
                        }
                    case 3: {
                            message.operatorUin = reader.uint64();
                            break;
                        }
                    case 4: {
                            message.targetUid = reader.string();
                            break;
                        }
                    case 5: {
                            message.targetUin = reader.uint64();
                            break;
                        }
                    case 6: {
                            message.newCard = reader.string();
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
             * Decodes a GroupCardChangedNotice message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.event.GroupCardChangedNotice
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.event.GroupCardChangedNotice} GroupCardChangedNotice
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GroupCardChangedNotice.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GroupCardChangedNotice message.
             * @function verify
             * @memberof kritor.event.GroupCardChangedNotice
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GroupCardChangedNotice.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.groupId != null && message.hasOwnProperty("groupId"))
                    if (!$util.isInteger(message.groupId) && !(message.groupId && $util.isInteger(message.groupId.low) && $util.isInteger(message.groupId.high)))
                        return "groupId: integer|Long expected";
                if (message.operatorUid != null && message.hasOwnProperty("operatorUid"))
                    if (!$util.isString(message.operatorUid))
                        return "operatorUid: string expected";
                if (message.operatorUin != null && message.hasOwnProperty("operatorUin"))
                    if (!$util.isInteger(message.operatorUin) && !(message.operatorUin && $util.isInteger(message.operatorUin.low) && $util.isInteger(message.operatorUin.high)))
                        return "operatorUin: integer|Long expected";
                if (message.targetUid != null && message.hasOwnProperty("targetUid"))
                    if (!$util.isString(message.targetUid))
                        return "targetUid: string expected";
                if (message.targetUin != null && message.hasOwnProperty("targetUin"))
                    if (!$util.isInteger(message.targetUin) && !(message.targetUin && $util.isInteger(message.targetUin.low) && $util.isInteger(message.targetUin.high)))
                        return "targetUin: integer|Long expected";
                if (message.newCard != null && message.hasOwnProperty("newCard"))
                    if (!$util.isString(message.newCard))
                        return "newCard: string expected";
                return null;
            };

            /**
             * Creates a GroupCardChangedNotice message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.event.GroupCardChangedNotice
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.event.GroupCardChangedNotice} GroupCardChangedNotice
             */
            GroupCardChangedNotice.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.event.GroupCardChangedNotice)
                    return object;
                let message = new $root.kritor.event.GroupCardChangedNotice();
                if (object.groupId != null)
                    if ($util.Long)
                        (message.groupId = $util.Long.fromValue(object.groupId)).unsigned = true;
                    else if (typeof object.groupId === "string")
                        message.groupId = parseInt(object.groupId, 10);
                    else if (typeof object.groupId === "number")
                        message.groupId = object.groupId;
                    else if (typeof object.groupId === "object")
                        message.groupId = new $util.LongBits(object.groupId.low >>> 0, object.groupId.high >>> 0).toNumber(true);
                if (object.operatorUid != null)
                    message.operatorUid = String(object.operatorUid);
                if (object.operatorUin != null)
                    if ($util.Long)
                        (message.operatorUin = $util.Long.fromValue(object.operatorUin)).unsigned = true;
                    else if (typeof object.operatorUin === "string")
                        message.operatorUin = parseInt(object.operatorUin, 10);
                    else if (typeof object.operatorUin === "number")
                        message.operatorUin = object.operatorUin;
                    else if (typeof object.operatorUin === "object")
                        message.operatorUin = new $util.LongBits(object.operatorUin.low >>> 0, object.operatorUin.high >>> 0).toNumber(true);
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
                if (object.newCard != null)
                    message.newCard = String(object.newCard);
                return message;
            };

            /**
             * Creates a plain object from a GroupCardChangedNotice message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.event.GroupCardChangedNotice
             * @static
             * @param {kritor.event.GroupCardChangedNotice} message GroupCardChangedNotice
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GroupCardChangedNotice.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.groupId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.groupId = options.longs === String ? "0" : 0;
                    object.operatorUid = "";
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.operatorUin = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.operatorUin = options.longs === String ? "0" : 0;
                    object.targetUid = "";
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.targetUin = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.targetUin = options.longs === String ? "0" : 0;
                    object.newCard = "";
                }
                if (message.groupId != null && message.hasOwnProperty("groupId"))
                    if (typeof message.groupId === "number")
                        object.groupId = options.longs === String ? String(message.groupId) : message.groupId;
                    else
                        object.groupId = options.longs === String ? $util.Long.prototype.toString.call(message.groupId) : options.longs === Number ? new $util.LongBits(message.groupId.low >>> 0, message.groupId.high >>> 0).toNumber(true) : message.groupId;
                if (message.operatorUid != null && message.hasOwnProperty("operatorUid"))
                    object.operatorUid = message.operatorUid;
                if (message.operatorUin != null && message.hasOwnProperty("operatorUin"))
                    if (typeof message.operatorUin === "number")
                        object.operatorUin = options.longs === String ? String(message.operatorUin) : message.operatorUin;
                    else
                        object.operatorUin = options.longs === String ? $util.Long.prototype.toString.call(message.operatorUin) : options.longs === Number ? new $util.LongBits(message.operatorUin.low >>> 0, message.operatorUin.high >>> 0).toNumber(true) : message.operatorUin;
                if (message.targetUid != null && message.hasOwnProperty("targetUid"))
                    object.targetUid = message.targetUid;
                if (message.targetUin != null && message.hasOwnProperty("targetUin"))
                    if (typeof message.targetUin === "number")
                        object.targetUin = options.longs === String ? String(message.targetUin) : message.targetUin;
                    else
                        object.targetUin = options.longs === String ? $util.Long.prototype.toString.call(message.targetUin) : options.longs === Number ? new $util.LongBits(message.targetUin.low >>> 0, message.targetUin.high >>> 0).toNumber(true) : message.targetUin;
                if (message.newCard != null && message.hasOwnProperty("newCard"))
                    object.newCard = message.newCard;
                return object;
            };

            /**
             * Converts this GroupCardChangedNotice to JSON.
             * @function toJSON
             * @memberof kritor.event.GroupCardChangedNotice
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GroupCardChangedNotice.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GroupCardChangedNotice
             * @function getTypeUrl
             * @memberof kritor.event.GroupCardChangedNotice
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GroupCardChangedNotice.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.event.GroupCardChangedNotice";
            };

            return GroupCardChangedNotice;
        })();

        event.GroupMemberIncreasedNotice = (function() {

            /**
             * Properties of a GroupMemberIncreasedNotice.
             * @memberof kritor.event
             * @interface IGroupMemberIncreasedNotice
             * @property {number|Long|null} [groupId] GroupMemberIncreasedNotice groupId
             * @property {string|null} [operatorUid] GroupMemberIncreasedNotice operatorUid
             * @property {number|Long|null} [operatorUin] GroupMemberIncreasedNotice operatorUin
             * @property {string|null} [targetUid] GroupMemberIncreasedNotice targetUid
             * @property {number|Long|null} [targetUin] GroupMemberIncreasedNotice targetUin
             * @property {kritor.event.GroupMemberIncreasedNotice.GroupMemberIncreasedType|null} [type] GroupMemberIncreasedNotice type
             */

            /**
             * Constructs a new GroupMemberIncreasedNotice.
             * @memberof kritor.event
             * @classdesc Represents a GroupMemberIncreasedNotice.
             * @implements IGroupMemberIncreasedNotice
             * @constructor
             * @param {kritor.event.IGroupMemberIncreasedNotice=} [properties] Properties to set
             */
            function GroupMemberIncreasedNotice(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GroupMemberIncreasedNotice groupId.
             * @member {number|Long} groupId
             * @memberof kritor.event.GroupMemberIncreasedNotice
             * @instance
             */
            GroupMemberIncreasedNotice.prototype.groupId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * GroupMemberIncreasedNotice operatorUid.
             * @member {string} operatorUid
             * @memberof kritor.event.GroupMemberIncreasedNotice
             * @instance
             */
            GroupMemberIncreasedNotice.prototype.operatorUid = "";

            /**
             * GroupMemberIncreasedNotice operatorUin.
             * @member {number|Long} operatorUin
             * @memberof kritor.event.GroupMemberIncreasedNotice
             * @instance
             */
            GroupMemberIncreasedNotice.prototype.operatorUin = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * GroupMemberIncreasedNotice targetUid.
             * @member {string} targetUid
             * @memberof kritor.event.GroupMemberIncreasedNotice
             * @instance
             */
            GroupMemberIncreasedNotice.prototype.targetUid = "";

            /**
             * GroupMemberIncreasedNotice targetUin.
             * @member {number|Long} targetUin
             * @memberof kritor.event.GroupMemberIncreasedNotice
             * @instance
             */
            GroupMemberIncreasedNotice.prototype.targetUin = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * GroupMemberIncreasedNotice type.
             * @member {kritor.event.GroupMemberIncreasedNotice.GroupMemberIncreasedType} type
             * @memberof kritor.event.GroupMemberIncreasedNotice
             * @instance
             */
            GroupMemberIncreasedNotice.prototype.type = 0;

            /**
             * Creates a new GroupMemberIncreasedNotice instance using the specified properties.
             * @function create
             * @memberof kritor.event.GroupMemberIncreasedNotice
             * @static
             * @param {kritor.event.IGroupMemberIncreasedNotice=} [properties] Properties to set
             * @returns {kritor.event.GroupMemberIncreasedNotice} GroupMemberIncreasedNotice instance
             */
            GroupMemberIncreasedNotice.create = function create(properties) {
                return new GroupMemberIncreasedNotice(properties);
            };

            /**
             * Encodes the specified GroupMemberIncreasedNotice message. Does not implicitly {@link kritor.event.GroupMemberIncreasedNotice.verify|verify} messages.
             * @function encode
             * @memberof kritor.event.GroupMemberIncreasedNotice
             * @static
             * @param {kritor.event.IGroupMemberIncreasedNotice} message GroupMemberIncreasedNotice message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GroupMemberIncreasedNotice.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.groupId != null && Object.hasOwnProperty.call(message, "groupId"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.groupId);
                if (message.operatorUid != null && Object.hasOwnProperty.call(message, "operatorUid"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.operatorUid);
                if (message.operatorUin != null && Object.hasOwnProperty.call(message, "operatorUin"))
                    writer.uint32(/* id 3, wireType 0 =*/24).uint64(message.operatorUin);
                if (message.targetUid != null && Object.hasOwnProperty.call(message, "targetUid"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.targetUid);
                if (message.targetUin != null && Object.hasOwnProperty.call(message, "targetUin"))
                    writer.uint32(/* id 5, wireType 0 =*/40).uint64(message.targetUin);
                if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                    writer.uint32(/* id 6, wireType 0 =*/48).int32(message.type);
                return writer;
            };

            /**
             * Encodes the specified GroupMemberIncreasedNotice message, length delimited. Does not implicitly {@link kritor.event.GroupMemberIncreasedNotice.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.event.GroupMemberIncreasedNotice
             * @static
             * @param {kritor.event.IGroupMemberIncreasedNotice} message GroupMemberIncreasedNotice message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GroupMemberIncreasedNotice.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GroupMemberIncreasedNotice message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.event.GroupMemberIncreasedNotice
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.event.GroupMemberIncreasedNotice} GroupMemberIncreasedNotice
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GroupMemberIncreasedNotice.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.event.GroupMemberIncreasedNotice();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.groupId = reader.uint64();
                            break;
                        }
                    case 2: {
                            message.operatorUid = reader.string();
                            break;
                        }
                    case 3: {
                            message.operatorUin = reader.uint64();
                            break;
                        }
                    case 4: {
                            message.targetUid = reader.string();
                            break;
                        }
                    case 5: {
                            message.targetUin = reader.uint64();
                            break;
                        }
                    case 6: {
                            message.type = reader.int32();
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
             * Decodes a GroupMemberIncreasedNotice message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.event.GroupMemberIncreasedNotice
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.event.GroupMemberIncreasedNotice} GroupMemberIncreasedNotice
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GroupMemberIncreasedNotice.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GroupMemberIncreasedNotice message.
             * @function verify
             * @memberof kritor.event.GroupMemberIncreasedNotice
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GroupMemberIncreasedNotice.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.groupId != null && message.hasOwnProperty("groupId"))
                    if (!$util.isInteger(message.groupId) && !(message.groupId && $util.isInteger(message.groupId.low) && $util.isInteger(message.groupId.high)))
                        return "groupId: integer|Long expected";
                if (message.operatorUid != null && message.hasOwnProperty("operatorUid"))
                    if (!$util.isString(message.operatorUid))
                        return "operatorUid: string expected";
                if (message.operatorUin != null && message.hasOwnProperty("operatorUin"))
                    if (!$util.isInteger(message.operatorUin) && !(message.operatorUin && $util.isInteger(message.operatorUin.low) && $util.isInteger(message.operatorUin.high)))
                        return "operatorUin: integer|Long expected";
                if (message.targetUid != null && message.hasOwnProperty("targetUid"))
                    if (!$util.isString(message.targetUid))
                        return "targetUid: string expected";
                if (message.targetUin != null && message.hasOwnProperty("targetUin"))
                    if (!$util.isInteger(message.targetUin) && !(message.targetUin && $util.isInteger(message.targetUin.low) && $util.isInteger(message.targetUin.high)))
                        return "targetUin: integer|Long expected";
                if (message.type != null && message.hasOwnProperty("type"))
                    switch (message.type) {
                    default:
                        return "type: enum value expected";
                    case 0:
                    case 1:
                        break;
                    }
                return null;
            };

            /**
             * Creates a GroupMemberIncreasedNotice message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.event.GroupMemberIncreasedNotice
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.event.GroupMemberIncreasedNotice} GroupMemberIncreasedNotice
             */
            GroupMemberIncreasedNotice.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.event.GroupMemberIncreasedNotice)
                    return object;
                let message = new $root.kritor.event.GroupMemberIncreasedNotice();
                if (object.groupId != null)
                    if ($util.Long)
                        (message.groupId = $util.Long.fromValue(object.groupId)).unsigned = true;
                    else if (typeof object.groupId === "string")
                        message.groupId = parseInt(object.groupId, 10);
                    else if (typeof object.groupId === "number")
                        message.groupId = object.groupId;
                    else if (typeof object.groupId === "object")
                        message.groupId = new $util.LongBits(object.groupId.low >>> 0, object.groupId.high >>> 0).toNumber(true);
                if (object.operatorUid != null)
                    message.operatorUid = String(object.operatorUid);
                if (object.operatorUin != null)
                    if ($util.Long)
                        (message.operatorUin = $util.Long.fromValue(object.operatorUin)).unsigned = true;
                    else if (typeof object.operatorUin === "string")
                        message.operatorUin = parseInt(object.operatorUin, 10);
                    else if (typeof object.operatorUin === "number")
                        message.operatorUin = object.operatorUin;
                    else if (typeof object.operatorUin === "object")
                        message.operatorUin = new $util.LongBits(object.operatorUin.low >>> 0, object.operatorUin.high >>> 0).toNumber(true);
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
                switch (object.type) {
                default:
                    if (typeof object.type === "number") {
                        message.type = object.type;
                        break;
                    }
                    break;
                case "APPROVE":
                case 0:
                    message.type = 0;
                    break;
                case "INVITE":
                case 1:
                    message.type = 1;
                    break;
                }
                return message;
            };

            /**
             * Creates a plain object from a GroupMemberIncreasedNotice message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.event.GroupMemberIncreasedNotice
             * @static
             * @param {kritor.event.GroupMemberIncreasedNotice} message GroupMemberIncreasedNotice
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GroupMemberIncreasedNotice.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.groupId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.groupId = options.longs === String ? "0" : 0;
                    object.operatorUid = "";
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.operatorUin = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.operatorUin = options.longs === String ? "0" : 0;
                    object.targetUid = "";
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.targetUin = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.targetUin = options.longs === String ? "0" : 0;
                    object.type = options.enums === String ? "APPROVE" : 0;
                }
                if (message.groupId != null && message.hasOwnProperty("groupId"))
                    if (typeof message.groupId === "number")
                        object.groupId = options.longs === String ? String(message.groupId) : message.groupId;
                    else
                        object.groupId = options.longs === String ? $util.Long.prototype.toString.call(message.groupId) : options.longs === Number ? new $util.LongBits(message.groupId.low >>> 0, message.groupId.high >>> 0).toNumber(true) : message.groupId;
                if (message.operatorUid != null && message.hasOwnProperty("operatorUid"))
                    object.operatorUid = message.operatorUid;
                if (message.operatorUin != null && message.hasOwnProperty("operatorUin"))
                    if (typeof message.operatorUin === "number")
                        object.operatorUin = options.longs === String ? String(message.operatorUin) : message.operatorUin;
                    else
                        object.operatorUin = options.longs === String ? $util.Long.prototype.toString.call(message.operatorUin) : options.longs === Number ? new $util.LongBits(message.operatorUin.low >>> 0, message.operatorUin.high >>> 0).toNumber(true) : message.operatorUin;
                if (message.targetUid != null && message.hasOwnProperty("targetUid"))
                    object.targetUid = message.targetUid;
                if (message.targetUin != null && message.hasOwnProperty("targetUin"))
                    if (typeof message.targetUin === "number")
                        object.targetUin = options.longs === String ? String(message.targetUin) : message.targetUin;
                    else
                        object.targetUin = options.longs === String ? $util.Long.prototype.toString.call(message.targetUin) : options.longs === Number ? new $util.LongBits(message.targetUin.low >>> 0, message.targetUin.high >>> 0).toNumber(true) : message.targetUin;
                if (message.type != null && message.hasOwnProperty("type"))
                    object.type = options.enums === String ? $root.kritor.event.GroupMemberIncreasedNotice.GroupMemberIncreasedType[message.type] === undefined ? message.type : $root.kritor.event.GroupMemberIncreasedNotice.GroupMemberIncreasedType[message.type] : message.type;
                return object;
            };

            /**
             * Converts this GroupMemberIncreasedNotice to JSON.
             * @function toJSON
             * @memberof kritor.event.GroupMemberIncreasedNotice
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GroupMemberIncreasedNotice.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GroupMemberIncreasedNotice
             * @function getTypeUrl
             * @memberof kritor.event.GroupMemberIncreasedNotice
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GroupMemberIncreasedNotice.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.event.GroupMemberIncreasedNotice";
            };

            /**
             * GroupMemberIncreasedType enum.
             * @name kritor.event.GroupMemberIncreasedNotice.GroupMemberIncreasedType
             * @enum {number}
             * @property {number} APPROVE=0 APPROVE value
             * @property {number} INVITE=1 INVITE value
             */
            GroupMemberIncreasedNotice.GroupMemberIncreasedType = (function() {
                const valuesById = {}, values = Object.create(valuesById);
                values[valuesById[0] = "APPROVE"] = 0;
                values[valuesById[1] = "INVITE"] = 1;
                return values;
            })();

            return GroupMemberIncreasedNotice;
        })();

        event.GroupMemberDecreasedNotice = (function() {

            /**
             * Properties of a GroupMemberDecreasedNotice.
             * @memberof kritor.event
             * @interface IGroupMemberDecreasedNotice
             * @property {number|Long|null} [groupId] GroupMemberDecreasedNotice groupId
             * @property {string|null} [operatorUid] GroupMemberDecreasedNotice operatorUid
             * @property {number|Long|null} [operatorUin] GroupMemberDecreasedNotice operatorUin
             * @property {string|null} [targetUid] GroupMemberDecreasedNotice targetUid
             * @property {number|Long|null} [targetUin] GroupMemberDecreasedNotice targetUin
             * @property {kritor.event.GroupMemberDecreasedNotice.GroupMemberDecreasedType|null} [type] GroupMemberDecreasedNotice type
             */

            /**
             * Constructs a new GroupMemberDecreasedNotice.
             * @memberof kritor.event
             * @classdesc Represents a GroupMemberDecreasedNotice.
             * @implements IGroupMemberDecreasedNotice
             * @constructor
             * @param {kritor.event.IGroupMemberDecreasedNotice=} [properties] Properties to set
             */
            function GroupMemberDecreasedNotice(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GroupMemberDecreasedNotice groupId.
             * @member {number|Long} groupId
             * @memberof kritor.event.GroupMemberDecreasedNotice
             * @instance
             */
            GroupMemberDecreasedNotice.prototype.groupId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * GroupMemberDecreasedNotice operatorUid.
             * @member {string|null|undefined} operatorUid
             * @memberof kritor.event.GroupMemberDecreasedNotice
             * @instance
             */
            GroupMemberDecreasedNotice.prototype.operatorUid = null;

            /**
             * GroupMemberDecreasedNotice operatorUin.
             * @member {number|Long|null|undefined} operatorUin
             * @memberof kritor.event.GroupMemberDecreasedNotice
             * @instance
             */
            GroupMemberDecreasedNotice.prototype.operatorUin = null;

            /**
             * GroupMemberDecreasedNotice targetUid.
             * @member {string|null|undefined} targetUid
             * @memberof kritor.event.GroupMemberDecreasedNotice
             * @instance
             */
            GroupMemberDecreasedNotice.prototype.targetUid = null;

            /**
             * GroupMemberDecreasedNotice targetUin.
             * @member {number|Long|null|undefined} targetUin
             * @memberof kritor.event.GroupMemberDecreasedNotice
             * @instance
             */
            GroupMemberDecreasedNotice.prototype.targetUin = null;

            /**
             * GroupMemberDecreasedNotice type.
             * @member {kritor.event.GroupMemberDecreasedNotice.GroupMemberDecreasedType} type
             * @memberof kritor.event.GroupMemberDecreasedNotice
             * @instance
             */
            GroupMemberDecreasedNotice.prototype.type = 0;

            // OneOf field names bound to virtual getters and setters
            let $oneOfFields;

            /**
             * GroupMemberDecreasedNotice _operatorUid.
             * @member {"operatorUid"|undefined} _operatorUid
             * @memberof kritor.event.GroupMemberDecreasedNotice
             * @instance
             */
            Object.defineProperty(GroupMemberDecreasedNotice.prototype, "_operatorUid", {
                get: $util.oneOfGetter($oneOfFields = ["operatorUid"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * GroupMemberDecreasedNotice _operatorUin.
             * @member {"operatorUin"|undefined} _operatorUin
             * @memberof kritor.event.GroupMemberDecreasedNotice
             * @instance
             */
            Object.defineProperty(GroupMemberDecreasedNotice.prototype, "_operatorUin", {
                get: $util.oneOfGetter($oneOfFields = ["operatorUin"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * GroupMemberDecreasedNotice _targetUid.
             * @member {"targetUid"|undefined} _targetUid
             * @memberof kritor.event.GroupMemberDecreasedNotice
             * @instance
             */
            Object.defineProperty(GroupMemberDecreasedNotice.prototype, "_targetUid", {
                get: $util.oneOfGetter($oneOfFields = ["targetUid"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * GroupMemberDecreasedNotice _targetUin.
             * @member {"targetUin"|undefined} _targetUin
             * @memberof kritor.event.GroupMemberDecreasedNotice
             * @instance
             */
            Object.defineProperty(GroupMemberDecreasedNotice.prototype, "_targetUin", {
                get: $util.oneOfGetter($oneOfFields = ["targetUin"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new GroupMemberDecreasedNotice instance using the specified properties.
             * @function create
             * @memberof kritor.event.GroupMemberDecreasedNotice
             * @static
             * @param {kritor.event.IGroupMemberDecreasedNotice=} [properties] Properties to set
             * @returns {kritor.event.GroupMemberDecreasedNotice} GroupMemberDecreasedNotice instance
             */
            GroupMemberDecreasedNotice.create = function create(properties) {
                return new GroupMemberDecreasedNotice(properties);
            };

            /**
             * Encodes the specified GroupMemberDecreasedNotice message. Does not implicitly {@link kritor.event.GroupMemberDecreasedNotice.verify|verify} messages.
             * @function encode
             * @memberof kritor.event.GroupMemberDecreasedNotice
             * @static
             * @param {kritor.event.IGroupMemberDecreasedNotice} message GroupMemberDecreasedNotice message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GroupMemberDecreasedNotice.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.groupId != null && Object.hasOwnProperty.call(message, "groupId"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.groupId);
                if (message.operatorUid != null && Object.hasOwnProperty.call(message, "operatorUid"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.operatorUid);
                if (message.operatorUin != null && Object.hasOwnProperty.call(message, "operatorUin"))
                    writer.uint32(/* id 3, wireType 0 =*/24).uint64(message.operatorUin);
                if (message.targetUid != null && Object.hasOwnProperty.call(message, "targetUid"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.targetUid);
                if (message.targetUin != null && Object.hasOwnProperty.call(message, "targetUin"))
                    writer.uint32(/* id 5, wireType 0 =*/40).uint64(message.targetUin);
                if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                    writer.uint32(/* id 6, wireType 0 =*/48).int32(message.type);
                return writer;
            };

            /**
             * Encodes the specified GroupMemberDecreasedNotice message, length delimited. Does not implicitly {@link kritor.event.GroupMemberDecreasedNotice.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.event.GroupMemberDecreasedNotice
             * @static
             * @param {kritor.event.IGroupMemberDecreasedNotice} message GroupMemberDecreasedNotice message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GroupMemberDecreasedNotice.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GroupMemberDecreasedNotice message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.event.GroupMemberDecreasedNotice
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.event.GroupMemberDecreasedNotice} GroupMemberDecreasedNotice
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GroupMemberDecreasedNotice.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.event.GroupMemberDecreasedNotice();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.groupId = reader.uint64();
                            break;
                        }
                    case 2: {
                            message.operatorUid = reader.string();
                            break;
                        }
                    case 3: {
                            message.operatorUin = reader.uint64();
                            break;
                        }
                    case 4: {
                            message.targetUid = reader.string();
                            break;
                        }
                    case 5: {
                            message.targetUin = reader.uint64();
                            break;
                        }
                    case 6: {
                            message.type = reader.int32();
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
             * Decodes a GroupMemberDecreasedNotice message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.event.GroupMemberDecreasedNotice
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.event.GroupMemberDecreasedNotice} GroupMemberDecreasedNotice
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GroupMemberDecreasedNotice.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GroupMemberDecreasedNotice message.
             * @function verify
             * @memberof kritor.event.GroupMemberDecreasedNotice
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GroupMemberDecreasedNotice.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                let properties = {};
                if (message.groupId != null && message.hasOwnProperty("groupId"))
                    if (!$util.isInteger(message.groupId) && !(message.groupId && $util.isInteger(message.groupId.low) && $util.isInteger(message.groupId.high)))
                        return "groupId: integer|Long expected";
                if (message.operatorUid != null && message.hasOwnProperty("operatorUid")) {
                    properties._operatorUid = 1;
                    if (!$util.isString(message.operatorUid))
                        return "operatorUid: string expected";
                }
                if (message.operatorUin != null && message.hasOwnProperty("operatorUin")) {
                    properties._operatorUin = 1;
                    if (!$util.isInteger(message.operatorUin) && !(message.operatorUin && $util.isInteger(message.operatorUin.low) && $util.isInteger(message.operatorUin.high)))
                        return "operatorUin: integer|Long expected";
                }
                if (message.targetUid != null && message.hasOwnProperty("targetUid")) {
                    properties._targetUid = 1;
                    if (!$util.isString(message.targetUid))
                        return "targetUid: string expected";
                }
                if (message.targetUin != null && message.hasOwnProperty("targetUin")) {
                    properties._targetUin = 1;
                    if (!$util.isInteger(message.targetUin) && !(message.targetUin && $util.isInteger(message.targetUin.low) && $util.isInteger(message.targetUin.high)))
                        return "targetUin: integer|Long expected";
                }
                if (message.type != null && message.hasOwnProperty("type"))
                    switch (message.type) {
                    default:
                        return "type: enum value expected";
                    case 0:
                    case 1:
                    case 2:
                        break;
                    }
                return null;
            };

            /**
             * Creates a GroupMemberDecreasedNotice message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.event.GroupMemberDecreasedNotice
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.event.GroupMemberDecreasedNotice} GroupMemberDecreasedNotice
             */
            GroupMemberDecreasedNotice.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.event.GroupMemberDecreasedNotice)
                    return object;
                let message = new $root.kritor.event.GroupMemberDecreasedNotice();
                if (object.groupId != null)
                    if ($util.Long)
                        (message.groupId = $util.Long.fromValue(object.groupId)).unsigned = true;
                    else if (typeof object.groupId === "string")
                        message.groupId = parseInt(object.groupId, 10);
                    else if (typeof object.groupId === "number")
                        message.groupId = object.groupId;
                    else if (typeof object.groupId === "object")
                        message.groupId = new $util.LongBits(object.groupId.low >>> 0, object.groupId.high >>> 0).toNumber(true);
                if (object.operatorUid != null)
                    message.operatorUid = String(object.operatorUid);
                if (object.operatorUin != null)
                    if ($util.Long)
                        (message.operatorUin = $util.Long.fromValue(object.operatorUin)).unsigned = true;
                    else if (typeof object.operatorUin === "string")
                        message.operatorUin = parseInt(object.operatorUin, 10);
                    else if (typeof object.operatorUin === "number")
                        message.operatorUin = object.operatorUin;
                    else if (typeof object.operatorUin === "object")
                        message.operatorUin = new $util.LongBits(object.operatorUin.low >>> 0, object.operatorUin.high >>> 0).toNumber(true);
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
                switch (object.type) {
                default:
                    if (typeof object.type === "number") {
                        message.type = object.type;
                        break;
                    }
                    break;
                case "LEAVE":
                case 0:
                    message.type = 0;
                    break;
                case "KICK":
                case 1:
                    message.type = 1;
                    break;
                case "KICK_ME":
                case 2:
                    message.type = 2;
                    break;
                }
                return message;
            };

            /**
             * Creates a plain object from a GroupMemberDecreasedNotice message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.event.GroupMemberDecreasedNotice
             * @static
             * @param {kritor.event.GroupMemberDecreasedNotice} message GroupMemberDecreasedNotice
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GroupMemberDecreasedNotice.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.groupId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.groupId = options.longs === String ? "0" : 0;
                    object.type = options.enums === String ? "LEAVE" : 0;
                }
                if (message.groupId != null && message.hasOwnProperty("groupId"))
                    if (typeof message.groupId === "number")
                        object.groupId = options.longs === String ? String(message.groupId) : message.groupId;
                    else
                        object.groupId = options.longs === String ? $util.Long.prototype.toString.call(message.groupId) : options.longs === Number ? new $util.LongBits(message.groupId.low >>> 0, message.groupId.high >>> 0).toNumber(true) : message.groupId;
                if (message.operatorUid != null && message.hasOwnProperty("operatorUid")) {
                    object.operatorUid = message.operatorUid;
                    if (options.oneofs)
                        object._operatorUid = "operatorUid";
                }
                if (message.operatorUin != null && message.hasOwnProperty("operatorUin")) {
                    if (typeof message.operatorUin === "number")
                        object.operatorUin = options.longs === String ? String(message.operatorUin) : message.operatorUin;
                    else
                        object.operatorUin = options.longs === String ? $util.Long.prototype.toString.call(message.operatorUin) : options.longs === Number ? new $util.LongBits(message.operatorUin.low >>> 0, message.operatorUin.high >>> 0).toNumber(true) : message.operatorUin;
                    if (options.oneofs)
                        object._operatorUin = "operatorUin";
                }
                if (message.targetUid != null && message.hasOwnProperty("targetUid")) {
                    object.targetUid = message.targetUid;
                    if (options.oneofs)
                        object._targetUid = "targetUid";
                }
                if (message.targetUin != null && message.hasOwnProperty("targetUin")) {
                    if (typeof message.targetUin === "number")
                        object.targetUin = options.longs === String ? String(message.targetUin) : message.targetUin;
                    else
                        object.targetUin = options.longs === String ? $util.Long.prototype.toString.call(message.targetUin) : options.longs === Number ? new $util.LongBits(message.targetUin.low >>> 0, message.targetUin.high >>> 0).toNumber(true) : message.targetUin;
                    if (options.oneofs)
                        object._targetUin = "targetUin";
                }
                if (message.type != null && message.hasOwnProperty("type"))
                    object.type = options.enums === String ? $root.kritor.event.GroupMemberDecreasedNotice.GroupMemberDecreasedType[message.type] === undefined ? message.type : $root.kritor.event.GroupMemberDecreasedNotice.GroupMemberDecreasedType[message.type] : message.type;
                return object;
            };

            /**
             * Converts this GroupMemberDecreasedNotice to JSON.
             * @function toJSON
             * @memberof kritor.event.GroupMemberDecreasedNotice
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GroupMemberDecreasedNotice.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GroupMemberDecreasedNotice
             * @function getTypeUrl
             * @memberof kritor.event.GroupMemberDecreasedNotice
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GroupMemberDecreasedNotice.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.event.GroupMemberDecreasedNotice";
            };

            /**
             * GroupMemberDecreasedType enum.
             * @name kritor.event.GroupMemberDecreasedNotice.GroupMemberDecreasedType
             * @enum {number}
             * @property {number} LEAVE=0 LEAVE value
             * @property {number} KICK=1 KICK value
             * @property {number} KICK_ME=2 KICK_ME value
             */
            GroupMemberDecreasedNotice.GroupMemberDecreasedType = (function() {
                const valuesById = {}, values = Object.create(valuesById);
                values[valuesById[0] = "LEAVE"] = 0;
                values[valuesById[1] = "KICK"] = 1;
                values[valuesById[2] = "KICK_ME"] = 2;
                return values;
            })();

            return GroupMemberDecreasedNotice;
        })();

        event.GroupAdminChangedNotice = (function() {

            /**
             * Properties of a GroupAdminChangedNotice.
             * @memberof kritor.event
             * @interface IGroupAdminChangedNotice
             * @property {number|Long|null} [groupId] GroupAdminChangedNotice groupId
             * @property {string|null} [targetUid] GroupAdminChangedNotice targetUid
             * @property {number|Long|null} [targetUin] GroupAdminChangedNotice targetUin
             * @property {boolean|null} [isAdmin] GroupAdminChangedNotice isAdmin
             */

            /**
             * Constructs a new GroupAdminChangedNotice.
             * @memberof kritor.event
             * @classdesc Represents a GroupAdminChangedNotice.
             * @implements IGroupAdminChangedNotice
             * @constructor
             * @param {kritor.event.IGroupAdminChangedNotice=} [properties] Properties to set
             */
            function GroupAdminChangedNotice(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GroupAdminChangedNotice groupId.
             * @member {number|Long} groupId
             * @memberof kritor.event.GroupAdminChangedNotice
             * @instance
             */
            GroupAdminChangedNotice.prototype.groupId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * GroupAdminChangedNotice targetUid.
             * @member {string} targetUid
             * @memberof kritor.event.GroupAdminChangedNotice
             * @instance
             */
            GroupAdminChangedNotice.prototype.targetUid = "";

            /**
             * GroupAdminChangedNotice targetUin.
             * @member {number|Long} targetUin
             * @memberof kritor.event.GroupAdminChangedNotice
             * @instance
             */
            GroupAdminChangedNotice.prototype.targetUin = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * GroupAdminChangedNotice isAdmin.
             * @member {boolean} isAdmin
             * @memberof kritor.event.GroupAdminChangedNotice
             * @instance
             */
            GroupAdminChangedNotice.prototype.isAdmin = false;

            /**
             * Creates a new GroupAdminChangedNotice instance using the specified properties.
             * @function create
             * @memberof kritor.event.GroupAdminChangedNotice
             * @static
             * @param {kritor.event.IGroupAdminChangedNotice=} [properties] Properties to set
             * @returns {kritor.event.GroupAdminChangedNotice} GroupAdminChangedNotice instance
             */
            GroupAdminChangedNotice.create = function create(properties) {
                return new GroupAdminChangedNotice(properties);
            };

            /**
             * Encodes the specified GroupAdminChangedNotice message. Does not implicitly {@link kritor.event.GroupAdminChangedNotice.verify|verify} messages.
             * @function encode
             * @memberof kritor.event.GroupAdminChangedNotice
             * @static
             * @param {kritor.event.IGroupAdminChangedNotice} message GroupAdminChangedNotice message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GroupAdminChangedNotice.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.groupId != null && Object.hasOwnProperty.call(message, "groupId"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.groupId);
                if (message.targetUid != null && Object.hasOwnProperty.call(message, "targetUid"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.targetUid);
                if (message.targetUin != null && Object.hasOwnProperty.call(message, "targetUin"))
                    writer.uint32(/* id 5, wireType 0 =*/40).uint64(message.targetUin);
                if (message.isAdmin != null && Object.hasOwnProperty.call(message, "isAdmin"))
                    writer.uint32(/* id 6, wireType 0 =*/48).bool(message.isAdmin);
                return writer;
            };

            /**
             * Encodes the specified GroupAdminChangedNotice message, length delimited. Does not implicitly {@link kritor.event.GroupAdminChangedNotice.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.event.GroupAdminChangedNotice
             * @static
             * @param {kritor.event.IGroupAdminChangedNotice} message GroupAdminChangedNotice message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GroupAdminChangedNotice.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GroupAdminChangedNotice message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.event.GroupAdminChangedNotice
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.event.GroupAdminChangedNotice} GroupAdminChangedNotice
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GroupAdminChangedNotice.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.event.GroupAdminChangedNotice();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.groupId = reader.uint64();
                            break;
                        }
                    case 4: {
                            message.targetUid = reader.string();
                            break;
                        }
                    case 5: {
                            message.targetUin = reader.uint64();
                            break;
                        }
                    case 6: {
                            message.isAdmin = reader.bool();
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
             * Decodes a GroupAdminChangedNotice message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.event.GroupAdminChangedNotice
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.event.GroupAdminChangedNotice} GroupAdminChangedNotice
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GroupAdminChangedNotice.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GroupAdminChangedNotice message.
             * @function verify
             * @memberof kritor.event.GroupAdminChangedNotice
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GroupAdminChangedNotice.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.groupId != null && message.hasOwnProperty("groupId"))
                    if (!$util.isInteger(message.groupId) && !(message.groupId && $util.isInteger(message.groupId.low) && $util.isInteger(message.groupId.high)))
                        return "groupId: integer|Long expected";
                if (message.targetUid != null && message.hasOwnProperty("targetUid"))
                    if (!$util.isString(message.targetUid))
                        return "targetUid: string expected";
                if (message.targetUin != null && message.hasOwnProperty("targetUin"))
                    if (!$util.isInteger(message.targetUin) && !(message.targetUin && $util.isInteger(message.targetUin.low) && $util.isInteger(message.targetUin.high)))
                        return "targetUin: integer|Long expected";
                if (message.isAdmin != null && message.hasOwnProperty("isAdmin"))
                    if (typeof message.isAdmin !== "boolean")
                        return "isAdmin: boolean expected";
                return null;
            };

            /**
             * Creates a GroupAdminChangedNotice message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.event.GroupAdminChangedNotice
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.event.GroupAdminChangedNotice} GroupAdminChangedNotice
             */
            GroupAdminChangedNotice.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.event.GroupAdminChangedNotice)
                    return object;
                let message = new $root.kritor.event.GroupAdminChangedNotice();
                if (object.groupId != null)
                    if ($util.Long)
                        (message.groupId = $util.Long.fromValue(object.groupId)).unsigned = true;
                    else if (typeof object.groupId === "string")
                        message.groupId = parseInt(object.groupId, 10);
                    else if (typeof object.groupId === "number")
                        message.groupId = object.groupId;
                    else if (typeof object.groupId === "object")
                        message.groupId = new $util.LongBits(object.groupId.low >>> 0, object.groupId.high >>> 0).toNumber(true);
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
                if (object.isAdmin != null)
                    message.isAdmin = Boolean(object.isAdmin);
                return message;
            };

            /**
             * Creates a plain object from a GroupAdminChangedNotice message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.event.GroupAdminChangedNotice
             * @static
             * @param {kritor.event.GroupAdminChangedNotice} message GroupAdminChangedNotice
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GroupAdminChangedNotice.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.groupId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.groupId = options.longs === String ? "0" : 0;
                    object.targetUid = "";
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.targetUin = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.targetUin = options.longs === String ? "0" : 0;
                    object.isAdmin = false;
                }
                if (message.groupId != null && message.hasOwnProperty("groupId"))
                    if (typeof message.groupId === "number")
                        object.groupId = options.longs === String ? String(message.groupId) : message.groupId;
                    else
                        object.groupId = options.longs === String ? $util.Long.prototype.toString.call(message.groupId) : options.longs === Number ? new $util.LongBits(message.groupId.low >>> 0, message.groupId.high >>> 0).toNumber(true) : message.groupId;
                if (message.targetUid != null && message.hasOwnProperty("targetUid"))
                    object.targetUid = message.targetUid;
                if (message.targetUin != null && message.hasOwnProperty("targetUin"))
                    if (typeof message.targetUin === "number")
                        object.targetUin = options.longs === String ? String(message.targetUin) : message.targetUin;
                    else
                        object.targetUin = options.longs === String ? $util.Long.prototype.toString.call(message.targetUin) : options.longs === Number ? new $util.LongBits(message.targetUin.low >>> 0, message.targetUin.high >>> 0).toNumber(true) : message.targetUin;
                if (message.isAdmin != null && message.hasOwnProperty("isAdmin"))
                    object.isAdmin = message.isAdmin;
                return object;
            };

            /**
             * Converts this GroupAdminChangedNotice to JSON.
             * @function toJSON
             * @memberof kritor.event.GroupAdminChangedNotice
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GroupAdminChangedNotice.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GroupAdminChangedNotice
             * @function getTypeUrl
             * @memberof kritor.event.GroupAdminChangedNotice
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GroupAdminChangedNotice.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.event.GroupAdminChangedNotice";
            };

            return GroupAdminChangedNotice;
        })();

        event.GroupMemberBanNotice = (function() {

            /**
             * Properties of a GroupMemberBanNotice.
             * @memberof kritor.event
             * @interface IGroupMemberBanNotice
             * @property {number|Long|null} [groupId] GroupMemberBanNotice groupId
             * @property {string|null} [operatorUid] GroupMemberBanNotice operatorUid
             * @property {number|Long|null} [operatorUin] GroupMemberBanNotice operatorUin
             * @property {string|null} [targetUid] GroupMemberBanNotice targetUid
             * @property {number|Long|null} [targetUin] GroupMemberBanNotice targetUin
             * @property {number|null} [duration] GroupMemberBanNotice duration
             * @property {kritor.event.GroupMemberBanNotice.GroupMemberBanType|null} [type] GroupMemberBanNotice type
             */

            /**
             * Constructs a new GroupMemberBanNotice.
             * @memberof kritor.event
             * @classdesc Represents a GroupMemberBanNotice.
             * @implements IGroupMemberBanNotice
             * @constructor
             * @param {kritor.event.IGroupMemberBanNotice=} [properties] Properties to set
             */
            function GroupMemberBanNotice(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GroupMemberBanNotice groupId.
             * @member {number|Long} groupId
             * @memberof kritor.event.GroupMemberBanNotice
             * @instance
             */
            GroupMemberBanNotice.prototype.groupId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * GroupMemberBanNotice operatorUid.
             * @member {string} operatorUid
             * @memberof kritor.event.GroupMemberBanNotice
             * @instance
             */
            GroupMemberBanNotice.prototype.operatorUid = "";

            /**
             * GroupMemberBanNotice operatorUin.
             * @member {number|Long} operatorUin
             * @memberof kritor.event.GroupMemberBanNotice
             * @instance
             */
            GroupMemberBanNotice.prototype.operatorUin = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * GroupMemberBanNotice targetUid.
             * @member {string} targetUid
             * @memberof kritor.event.GroupMemberBanNotice
             * @instance
             */
            GroupMemberBanNotice.prototype.targetUid = "";

            /**
             * GroupMemberBanNotice targetUin.
             * @member {number|Long} targetUin
             * @memberof kritor.event.GroupMemberBanNotice
             * @instance
             */
            GroupMemberBanNotice.prototype.targetUin = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * GroupMemberBanNotice duration.
             * @member {number} duration
             * @memberof kritor.event.GroupMemberBanNotice
             * @instance
             */
            GroupMemberBanNotice.prototype.duration = 0;

            /**
             * GroupMemberBanNotice type.
             * @member {kritor.event.GroupMemberBanNotice.GroupMemberBanType} type
             * @memberof kritor.event.GroupMemberBanNotice
             * @instance
             */
            GroupMemberBanNotice.prototype.type = 0;

            /**
             * Creates a new GroupMemberBanNotice instance using the specified properties.
             * @function create
             * @memberof kritor.event.GroupMemberBanNotice
             * @static
             * @param {kritor.event.IGroupMemberBanNotice=} [properties] Properties to set
             * @returns {kritor.event.GroupMemberBanNotice} GroupMemberBanNotice instance
             */
            GroupMemberBanNotice.create = function create(properties) {
                return new GroupMemberBanNotice(properties);
            };

            /**
             * Encodes the specified GroupMemberBanNotice message. Does not implicitly {@link kritor.event.GroupMemberBanNotice.verify|verify} messages.
             * @function encode
             * @memberof kritor.event.GroupMemberBanNotice
             * @static
             * @param {kritor.event.IGroupMemberBanNotice} message GroupMemberBanNotice message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GroupMemberBanNotice.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.groupId != null && Object.hasOwnProperty.call(message, "groupId"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.groupId);
                if (message.operatorUid != null && Object.hasOwnProperty.call(message, "operatorUid"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.operatorUid);
                if (message.operatorUin != null && Object.hasOwnProperty.call(message, "operatorUin"))
                    writer.uint32(/* id 3, wireType 0 =*/24).uint64(message.operatorUin);
                if (message.targetUid != null && Object.hasOwnProperty.call(message, "targetUid"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.targetUid);
                if (message.targetUin != null && Object.hasOwnProperty.call(message, "targetUin"))
                    writer.uint32(/* id 5, wireType 0 =*/40).uint64(message.targetUin);
                if (message.duration != null && Object.hasOwnProperty.call(message, "duration"))
                    writer.uint32(/* id 6, wireType 0 =*/48).int32(message.duration);
                if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                    writer.uint32(/* id 7, wireType 0 =*/56).int32(message.type);
                return writer;
            };

            /**
             * Encodes the specified GroupMemberBanNotice message, length delimited. Does not implicitly {@link kritor.event.GroupMemberBanNotice.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.event.GroupMemberBanNotice
             * @static
             * @param {kritor.event.IGroupMemberBanNotice} message GroupMemberBanNotice message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GroupMemberBanNotice.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GroupMemberBanNotice message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.event.GroupMemberBanNotice
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.event.GroupMemberBanNotice} GroupMemberBanNotice
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GroupMemberBanNotice.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.event.GroupMemberBanNotice();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.groupId = reader.uint64();
                            break;
                        }
                    case 2: {
                            message.operatorUid = reader.string();
                            break;
                        }
                    case 3: {
                            message.operatorUin = reader.uint64();
                            break;
                        }
                    case 4: {
                            message.targetUid = reader.string();
                            break;
                        }
                    case 5: {
                            message.targetUin = reader.uint64();
                            break;
                        }
                    case 6: {
                            message.duration = reader.int32();
                            break;
                        }
                    case 7: {
                            message.type = reader.int32();
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
             * Decodes a GroupMemberBanNotice message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.event.GroupMemberBanNotice
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.event.GroupMemberBanNotice} GroupMemberBanNotice
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GroupMemberBanNotice.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GroupMemberBanNotice message.
             * @function verify
             * @memberof kritor.event.GroupMemberBanNotice
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GroupMemberBanNotice.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.groupId != null && message.hasOwnProperty("groupId"))
                    if (!$util.isInteger(message.groupId) && !(message.groupId && $util.isInteger(message.groupId.low) && $util.isInteger(message.groupId.high)))
                        return "groupId: integer|Long expected";
                if (message.operatorUid != null && message.hasOwnProperty("operatorUid"))
                    if (!$util.isString(message.operatorUid))
                        return "operatorUid: string expected";
                if (message.operatorUin != null && message.hasOwnProperty("operatorUin"))
                    if (!$util.isInteger(message.operatorUin) && !(message.operatorUin && $util.isInteger(message.operatorUin.low) && $util.isInteger(message.operatorUin.high)))
                        return "operatorUin: integer|Long expected";
                if (message.targetUid != null && message.hasOwnProperty("targetUid"))
                    if (!$util.isString(message.targetUid))
                        return "targetUid: string expected";
                if (message.targetUin != null && message.hasOwnProperty("targetUin"))
                    if (!$util.isInteger(message.targetUin) && !(message.targetUin && $util.isInteger(message.targetUin.low) && $util.isInteger(message.targetUin.high)))
                        return "targetUin: integer|Long expected";
                if (message.duration != null && message.hasOwnProperty("duration"))
                    if (!$util.isInteger(message.duration))
                        return "duration: integer expected";
                if (message.type != null && message.hasOwnProperty("type"))
                    switch (message.type) {
                    default:
                        return "type: enum value expected";
                    case 0:
                    case 1:
                        break;
                    }
                return null;
            };

            /**
             * Creates a GroupMemberBanNotice message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.event.GroupMemberBanNotice
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.event.GroupMemberBanNotice} GroupMemberBanNotice
             */
            GroupMemberBanNotice.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.event.GroupMemberBanNotice)
                    return object;
                let message = new $root.kritor.event.GroupMemberBanNotice();
                if (object.groupId != null)
                    if ($util.Long)
                        (message.groupId = $util.Long.fromValue(object.groupId)).unsigned = true;
                    else if (typeof object.groupId === "string")
                        message.groupId = parseInt(object.groupId, 10);
                    else if (typeof object.groupId === "number")
                        message.groupId = object.groupId;
                    else if (typeof object.groupId === "object")
                        message.groupId = new $util.LongBits(object.groupId.low >>> 0, object.groupId.high >>> 0).toNumber(true);
                if (object.operatorUid != null)
                    message.operatorUid = String(object.operatorUid);
                if (object.operatorUin != null)
                    if ($util.Long)
                        (message.operatorUin = $util.Long.fromValue(object.operatorUin)).unsigned = true;
                    else if (typeof object.operatorUin === "string")
                        message.operatorUin = parseInt(object.operatorUin, 10);
                    else if (typeof object.operatorUin === "number")
                        message.operatorUin = object.operatorUin;
                    else if (typeof object.operatorUin === "object")
                        message.operatorUin = new $util.LongBits(object.operatorUin.low >>> 0, object.operatorUin.high >>> 0).toNumber(true);
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
                if (object.duration != null)
                    message.duration = object.duration | 0;
                switch (object.type) {
                default:
                    if (typeof object.type === "number") {
                        message.type = object.type;
                        break;
                    }
                    break;
                case "LIFT_BAN":
                case 0:
                    message.type = 0;
                    break;
                case "BAN":
                case 1:
                    message.type = 1;
                    break;
                }
                return message;
            };

            /**
             * Creates a plain object from a GroupMemberBanNotice message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.event.GroupMemberBanNotice
             * @static
             * @param {kritor.event.GroupMemberBanNotice} message GroupMemberBanNotice
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GroupMemberBanNotice.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.groupId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.groupId = options.longs === String ? "0" : 0;
                    object.operatorUid = "";
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.operatorUin = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.operatorUin = options.longs === String ? "0" : 0;
                    object.targetUid = "";
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.targetUin = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.targetUin = options.longs === String ? "0" : 0;
                    object.duration = 0;
                    object.type = options.enums === String ? "LIFT_BAN" : 0;
                }
                if (message.groupId != null && message.hasOwnProperty("groupId"))
                    if (typeof message.groupId === "number")
                        object.groupId = options.longs === String ? String(message.groupId) : message.groupId;
                    else
                        object.groupId = options.longs === String ? $util.Long.prototype.toString.call(message.groupId) : options.longs === Number ? new $util.LongBits(message.groupId.low >>> 0, message.groupId.high >>> 0).toNumber(true) : message.groupId;
                if (message.operatorUid != null && message.hasOwnProperty("operatorUid"))
                    object.operatorUid = message.operatorUid;
                if (message.operatorUin != null && message.hasOwnProperty("operatorUin"))
                    if (typeof message.operatorUin === "number")
                        object.operatorUin = options.longs === String ? String(message.operatorUin) : message.operatorUin;
                    else
                        object.operatorUin = options.longs === String ? $util.Long.prototype.toString.call(message.operatorUin) : options.longs === Number ? new $util.LongBits(message.operatorUin.low >>> 0, message.operatorUin.high >>> 0).toNumber(true) : message.operatorUin;
                if (message.targetUid != null && message.hasOwnProperty("targetUid"))
                    object.targetUid = message.targetUid;
                if (message.targetUin != null && message.hasOwnProperty("targetUin"))
                    if (typeof message.targetUin === "number")
                        object.targetUin = options.longs === String ? String(message.targetUin) : message.targetUin;
                    else
                        object.targetUin = options.longs === String ? $util.Long.prototype.toString.call(message.targetUin) : options.longs === Number ? new $util.LongBits(message.targetUin.low >>> 0, message.targetUin.high >>> 0).toNumber(true) : message.targetUin;
                if (message.duration != null && message.hasOwnProperty("duration"))
                    object.duration = message.duration;
                if (message.type != null && message.hasOwnProperty("type"))
                    object.type = options.enums === String ? $root.kritor.event.GroupMemberBanNotice.GroupMemberBanType[message.type] === undefined ? message.type : $root.kritor.event.GroupMemberBanNotice.GroupMemberBanType[message.type] : message.type;
                return object;
            };

            /**
             * Converts this GroupMemberBanNotice to JSON.
             * @function toJSON
             * @memberof kritor.event.GroupMemberBanNotice
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GroupMemberBanNotice.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GroupMemberBanNotice
             * @function getTypeUrl
             * @memberof kritor.event.GroupMemberBanNotice
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GroupMemberBanNotice.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.event.GroupMemberBanNotice";
            };

            /**
             * GroupMemberBanType enum.
             * @name kritor.event.GroupMemberBanNotice.GroupMemberBanType
             * @enum {number}
             * @property {number} LIFT_BAN=0 LIFT_BAN value
             * @property {number} BAN=1 BAN value
             */
            GroupMemberBanNotice.GroupMemberBanType = (function() {
                const valuesById = {}, values = Object.create(valuesById);
                values[valuesById[0] = "LIFT_BAN"] = 0;
                values[valuesById[1] = "BAN"] = 1;
                return values;
            })();

            return GroupMemberBanNotice;
        })();

        event.GroupRecallNotice = (function() {

            /**
             * Properties of a GroupRecallNotice.
             * @memberof kritor.event
             * @interface IGroupRecallNotice
             * @property {number|Long|null} [groupId] GroupRecallNotice groupId
             * @property {string|null} [messageId] GroupRecallNotice messageId
             * @property {string|null} [tipText] GroupRecallNotice tipText
             * @property {string|null} [operatorUid] GroupRecallNotice operatorUid
             * @property {number|Long|null} [operatorUin] GroupRecallNotice operatorUin
             * @property {string|null} [targetUid] GroupRecallNotice targetUid
             * @property {number|Long|null} [targetUin] GroupRecallNotice targetUin
             * @property {number|Long|null} [messageSeq] GroupRecallNotice messageSeq
             */

            /**
             * Constructs a new GroupRecallNotice.
             * @memberof kritor.event
             * @classdesc Represents a GroupRecallNotice.
             * @implements IGroupRecallNotice
             * @constructor
             * @param {kritor.event.IGroupRecallNotice=} [properties] Properties to set
             */
            function GroupRecallNotice(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GroupRecallNotice groupId.
             * @member {number|Long} groupId
             * @memberof kritor.event.GroupRecallNotice
             * @instance
             */
            GroupRecallNotice.prototype.groupId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * GroupRecallNotice messageId.
             * @member {string} messageId
             * @memberof kritor.event.GroupRecallNotice
             * @instance
             */
            GroupRecallNotice.prototype.messageId = "";

            /**
             * GroupRecallNotice tipText.
             * @member {string} tipText
             * @memberof kritor.event.GroupRecallNotice
             * @instance
             */
            GroupRecallNotice.prototype.tipText = "";

            /**
             * GroupRecallNotice operatorUid.
             * @member {string} operatorUid
             * @memberof kritor.event.GroupRecallNotice
             * @instance
             */
            GroupRecallNotice.prototype.operatorUid = "";

            /**
             * GroupRecallNotice operatorUin.
             * @member {number|Long} operatorUin
             * @memberof kritor.event.GroupRecallNotice
             * @instance
             */
            GroupRecallNotice.prototype.operatorUin = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * GroupRecallNotice targetUid.
             * @member {string} targetUid
             * @memberof kritor.event.GroupRecallNotice
             * @instance
             */
            GroupRecallNotice.prototype.targetUid = "";

            /**
             * GroupRecallNotice targetUin.
             * @member {number|Long} targetUin
             * @memberof kritor.event.GroupRecallNotice
             * @instance
             */
            GroupRecallNotice.prototype.targetUin = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * GroupRecallNotice messageSeq.
             * @member {number|Long} messageSeq
             * @memberof kritor.event.GroupRecallNotice
             * @instance
             */
            GroupRecallNotice.prototype.messageSeq = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * Creates a new GroupRecallNotice instance using the specified properties.
             * @function create
             * @memberof kritor.event.GroupRecallNotice
             * @static
             * @param {kritor.event.IGroupRecallNotice=} [properties] Properties to set
             * @returns {kritor.event.GroupRecallNotice} GroupRecallNotice instance
             */
            GroupRecallNotice.create = function create(properties) {
                return new GroupRecallNotice(properties);
            };

            /**
             * Encodes the specified GroupRecallNotice message. Does not implicitly {@link kritor.event.GroupRecallNotice.verify|verify} messages.
             * @function encode
             * @memberof kritor.event.GroupRecallNotice
             * @static
             * @param {kritor.event.IGroupRecallNotice} message GroupRecallNotice message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GroupRecallNotice.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.groupId != null && Object.hasOwnProperty.call(message, "groupId"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.groupId);
                if (message.messageId != null && Object.hasOwnProperty.call(message, "messageId"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.messageId);
                if (message.tipText != null && Object.hasOwnProperty.call(message, "tipText"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.tipText);
                if (message.operatorUid != null && Object.hasOwnProperty.call(message, "operatorUid"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.operatorUid);
                if (message.operatorUin != null && Object.hasOwnProperty.call(message, "operatorUin"))
                    writer.uint32(/* id 5, wireType 0 =*/40).uint64(message.operatorUin);
                if (message.targetUid != null && Object.hasOwnProperty.call(message, "targetUid"))
                    writer.uint32(/* id 6, wireType 2 =*/50).string(message.targetUid);
                if (message.targetUin != null && Object.hasOwnProperty.call(message, "targetUin"))
                    writer.uint32(/* id 7, wireType 0 =*/56).uint64(message.targetUin);
                if (message.messageSeq != null && Object.hasOwnProperty.call(message, "messageSeq"))
                    writer.uint32(/* id 8, wireType 0 =*/64).uint64(message.messageSeq);
                return writer;
            };

            /**
             * Encodes the specified GroupRecallNotice message, length delimited. Does not implicitly {@link kritor.event.GroupRecallNotice.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.event.GroupRecallNotice
             * @static
             * @param {kritor.event.IGroupRecallNotice} message GroupRecallNotice message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GroupRecallNotice.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GroupRecallNotice message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.event.GroupRecallNotice
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.event.GroupRecallNotice} GroupRecallNotice
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GroupRecallNotice.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.event.GroupRecallNotice();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.groupId = reader.uint64();
                            break;
                        }
                    case 2: {
                            message.messageId = reader.string();
                            break;
                        }
                    case 3: {
                            message.tipText = reader.string();
                            break;
                        }
                    case 4: {
                            message.operatorUid = reader.string();
                            break;
                        }
                    case 5: {
                            message.operatorUin = reader.uint64();
                            break;
                        }
                    case 6: {
                            message.targetUid = reader.string();
                            break;
                        }
                    case 7: {
                            message.targetUin = reader.uint64();
                            break;
                        }
                    case 8: {
                            message.messageSeq = reader.uint64();
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
             * Decodes a GroupRecallNotice message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.event.GroupRecallNotice
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.event.GroupRecallNotice} GroupRecallNotice
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GroupRecallNotice.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GroupRecallNotice message.
             * @function verify
             * @memberof kritor.event.GroupRecallNotice
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GroupRecallNotice.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.groupId != null && message.hasOwnProperty("groupId"))
                    if (!$util.isInteger(message.groupId) && !(message.groupId && $util.isInteger(message.groupId.low) && $util.isInteger(message.groupId.high)))
                        return "groupId: integer|Long expected";
                if (message.messageId != null && message.hasOwnProperty("messageId"))
                    if (!$util.isString(message.messageId))
                        return "messageId: string expected";
                if (message.tipText != null && message.hasOwnProperty("tipText"))
                    if (!$util.isString(message.tipText))
                        return "tipText: string expected";
                if (message.operatorUid != null && message.hasOwnProperty("operatorUid"))
                    if (!$util.isString(message.operatorUid))
                        return "operatorUid: string expected";
                if (message.operatorUin != null && message.hasOwnProperty("operatorUin"))
                    if (!$util.isInteger(message.operatorUin) && !(message.operatorUin && $util.isInteger(message.operatorUin.low) && $util.isInteger(message.operatorUin.high)))
                        return "operatorUin: integer|Long expected";
                if (message.targetUid != null && message.hasOwnProperty("targetUid"))
                    if (!$util.isString(message.targetUid))
                        return "targetUid: string expected";
                if (message.targetUin != null && message.hasOwnProperty("targetUin"))
                    if (!$util.isInteger(message.targetUin) && !(message.targetUin && $util.isInteger(message.targetUin.low) && $util.isInteger(message.targetUin.high)))
                        return "targetUin: integer|Long expected";
                if (message.messageSeq != null && message.hasOwnProperty("messageSeq"))
                    if (!$util.isInteger(message.messageSeq) && !(message.messageSeq && $util.isInteger(message.messageSeq.low) && $util.isInteger(message.messageSeq.high)))
                        return "messageSeq: integer|Long expected";
                return null;
            };

            /**
             * Creates a GroupRecallNotice message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.event.GroupRecallNotice
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.event.GroupRecallNotice} GroupRecallNotice
             */
            GroupRecallNotice.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.event.GroupRecallNotice)
                    return object;
                let message = new $root.kritor.event.GroupRecallNotice();
                if (object.groupId != null)
                    if ($util.Long)
                        (message.groupId = $util.Long.fromValue(object.groupId)).unsigned = true;
                    else if (typeof object.groupId === "string")
                        message.groupId = parseInt(object.groupId, 10);
                    else if (typeof object.groupId === "number")
                        message.groupId = object.groupId;
                    else if (typeof object.groupId === "object")
                        message.groupId = new $util.LongBits(object.groupId.low >>> 0, object.groupId.high >>> 0).toNumber(true);
                if (object.messageId != null)
                    message.messageId = String(object.messageId);
                if (object.tipText != null)
                    message.tipText = String(object.tipText);
                if (object.operatorUid != null)
                    message.operatorUid = String(object.operatorUid);
                if (object.operatorUin != null)
                    if ($util.Long)
                        (message.operatorUin = $util.Long.fromValue(object.operatorUin)).unsigned = true;
                    else if (typeof object.operatorUin === "string")
                        message.operatorUin = parseInt(object.operatorUin, 10);
                    else if (typeof object.operatorUin === "number")
                        message.operatorUin = object.operatorUin;
                    else if (typeof object.operatorUin === "object")
                        message.operatorUin = new $util.LongBits(object.operatorUin.low >>> 0, object.operatorUin.high >>> 0).toNumber(true);
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
                if (object.messageSeq != null)
                    if ($util.Long)
                        (message.messageSeq = $util.Long.fromValue(object.messageSeq)).unsigned = true;
                    else if (typeof object.messageSeq === "string")
                        message.messageSeq = parseInt(object.messageSeq, 10);
                    else if (typeof object.messageSeq === "number")
                        message.messageSeq = object.messageSeq;
                    else if (typeof object.messageSeq === "object")
                        message.messageSeq = new $util.LongBits(object.messageSeq.low >>> 0, object.messageSeq.high >>> 0).toNumber(true);
                return message;
            };

            /**
             * Creates a plain object from a GroupRecallNotice message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.event.GroupRecallNotice
             * @static
             * @param {kritor.event.GroupRecallNotice} message GroupRecallNotice
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GroupRecallNotice.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.groupId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.groupId = options.longs === String ? "0" : 0;
                    object.messageId = "";
                    object.tipText = "";
                    object.operatorUid = "";
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.operatorUin = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.operatorUin = options.longs === String ? "0" : 0;
                    object.targetUid = "";
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.targetUin = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.targetUin = options.longs === String ? "0" : 0;
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.messageSeq = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.messageSeq = options.longs === String ? "0" : 0;
                }
                if (message.groupId != null && message.hasOwnProperty("groupId"))
                    if (typeof message.groupId === "number")
                        object.groupId = options.longs === String ? String(message.groupId) : message.groupId;
                    else
                        object.groupId = options.longs === String ? $util.Long.prototype.toString.call(message.groupId) : options.longs === Number ? new $util.LongBits(message.groupId.low >>> 0, message.groupId.high >>> 0).toNumber(true) : message.groupId;
                if (message.messageId != null && message.hasOwnProperty("messageId"))
                    object.messageId = message.messageId;
                if (message.tipText != null && message.hasOwnProperty("tipText"))
                    object.tipText = message.tipText;
                if (message.operatorUid != null && message.hasOwnProperty("operatorUid"))
                    object.operatorUid = message.operatorUid;
                if (message.operatorUin != null && message.hasOwnProperty("operatorUin"))
                    if (typeof message.operatorUin === "number")
                        object.operatorUin = options.longs === String ? String(message.operatorUin) : message.operatorUin;
                    else
                        object.operatorUin = options.longs === String ? $util.Long.prototype.toString.call(message.operatorUin) : options.longs === Number ? new $util.LongBits(message.operatorUin.low >>> 0, message.operatorUin.high >>> 0).toNumber(true) : message.operatorUin;
                if (message.targetUid != null && message.hasOwnProperty("targetUid"))
                    object.targetUid = message.targetUid;
                if (message.targetUin != null && message.hasOwnProperty("targetUin"))
                    if (typeof message.targetUin === "number")
                        object.targetUin = options.longs === String ? String(message.targetUin) : message.targetUin;
                    else
                        object.targetUin = options.longs === String ? $util.Long.prototype.toString.call(message.targetUin) : options.longs === Number ? new $util.LongBits(message.targetUin.low >>> 0, message.targetUin.high >>> 0).toNumber(true) : message.targetUin;
                if (message.messageSeq != null && message.hasOwnProperty("messageSeq"))
                    if (typeof message.messageSeq === "number")
                        object.messageSeq = options.longs === String ? String(message.messageSeq) : message.messageSeq;
                    else
                        object.messageSeq = options.longs === String ? $util.Long.prototype.toString.call(message.messageSeq) : options.longs === Number ? new $util.LongBits(message.messageSeq.low >>> 0, message.messageSeq.high >>> 0).toNumber(true) : message.messageSeq;
                return object;
            };

            /**
             * Converts this GroupRecallNotice to JSON.
             * @function toJSON
             * @memberof kritor.event.GroupRecallNotice
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GroupRecallNotice.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GroupRecallNotice
             * @function getTypeUrl
             * @memberof kritor.event.GroupRecallNotice
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GroupRecallNotice.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.event.GroupRecallNotice";
            };

            return GroupRecallNotice;
        })();

        event.GroupSignInNotice = (function() {

            /**
             * Properties of a GroupSignInNotice.
             * @memberof kritor.event
             * @interface IGroupSignInNotice
             * @property {number|Long|null} [groupId] GroupSignInNotice groupId
             * @property {string|null} [targetUid] GroupSignInNotice targetUid
             * @property {number|Long|null} [targetUin] GroupSignInNotice targetUin
             * @property {string|null} [action] GroupSignInNotice action
             * @property {string|null} [suffix] GroupSignInNotice suffix
             * @property {string|null} [rankImage] GroupSignInNotice rankImage
             */

            /**
             * Constructs a new GroupSignInNotice.
             * @memberof kritor.event
             * @classdesc Represents a GroupSignInNotice.
             * @implements IGroupSignInNotice
             * @constructor
             * @param {kritor.event.IGroupSignInNotice=} [properties] Properties to set
             */
            function GroupSignInNotice(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GroupSignInNotice groupId.
             * @member {number|Long} groupId
             * @memberof kritor.event.GroupSignInNotice
             * @instance
             */
            GroupSignInNotice.prototype.groupId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * GroupSignInNotice targetUid.
             * @member {string} targetUid
             * @memberof kritor.event.GroupSignInNotice
             * @instance
             */
            GroupSignInNotice.prototype.targetUid = "";

            /**
             * GroupSignInNotice targetUin.
             * @member {number|Long} targetUin
             * @memberof kritor.event.GroupSignInNotice
             * @instance
             */
            GroupSignInNotice.prototype.targetUin = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * GroupSignInNotice action.
             * @member {string} action
             * @memberof kritor.event.GroupSignInNotice
             * @instance
             */
            GroupSignInNotice.prototype.action = "";

            /**
             * GroupSignInNotice suffix.
             * @member {string} suffix
             * @memberof kritor.event.GroupSignInNotice
             * @instance
             */
            GroupSignInNotice.prototype.suffix = "";

            /**
             * GroupSignInNotice rankImage.
             * @member {string} rankImage
             * @memberof kritor.event.GroupSignInNotice
             * @instance
             */
            GroupSignInNotice.prototype.rankImage = "";

            /**
             * Creates a new GroupSignInNotice instance using the specified properties.
             * @function create
             * @memberof kritor.event.GroupSignInNotice
             * @static
             * @param {kritor.event.IGroupSignInNotice=} [properties] Properties to set
             * @returns {kritor.event.GroupSignInNotice} GroupSignInNotice instance
             */
            GroupSignInNotice.create = function create(properties) {
                return new GroupSignInNotice(properties);
            };

            /**
             * Encodes the specified GroupSignInNotice message. Does not implicitly {@link kritor.event.GroupSignInNotice.verify|verify} messages.
             * @function encode
             * @memberof kritor.event.GroupSignInNotice
             * @static
             * @param {kritor.event.IGroupSignInNotice} message GroupSignInNotice message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GroupSignInNotice.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.groupId != null && Object.hasOwnProperty.call(message, "groupId"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.groupId);
                if (message.targetUid != null && Object.hasOwnProperty.call(message, "targetUid"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.targetUid);
                if (message.targetUin != null && Object.hasOwnProperty.call(message, "targetUin"))
                    writer.uint32(/* id 3, wireType 0 =*/24).uint64(message.targetUin);
                if (message.action != null && Object.hasOwnProperty.call(message, "action"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.action);
                if (message.suffix != null && Object.hasOwnProperty.call(message, "suffix"))
                    writer.uint32(/* id 5, wireType 2 =*/42).string(message.suffix);
                if (message.rankImage != null && Object.hasOwnProperty.call(message, "rankImage"))
                    writer.uint32(/* id 6, wireType 2 =*/50).string(message.rankImage);
                return writer;
            };

            /**
             * Encodes the specified GroupSignInNotice message, length delimited. Does not implicitly {@link kritor.event.GroupSignInNotice.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.event.GroupSignInNotice
             * @static
             * @param {kritor.event.IGroupSignInNotice} message GroupSignInNotice message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GroupSignInNotice.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GroupSignInNotice message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.event.GroupSignInNotice
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.event.GroupSignInNotice} GroupSignInNotice
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GroupSignInNotice.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.event.GroupSignInNotice();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.groupId = reader.uint64();
                            break;
                        }
                    case 2: {
                            message.targetUid = reader.string();
                            break;
                        }
                    case 3: {
                            message.targetUin = reader.uint64();
                            break;
                        }
                    case 4: {
                            message.action = reader.string();
                            break;
                        }
                    case 5: {
                            message.suffix = reader.string();
                            break;
                        }
                    case 6: {
                            message.rankImage = reader.string();
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
             * Decodes a GroupSignInNotice message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.event.GroupSignInNotice
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.event.GroupSignInNotice} GroupSignInNotice
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GroupSignInNotice.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GroupSignInNotice message.
             * @function verify
             * @memberof kritor.event.GroupSignInNotice
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GroupSignInNotice.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.groupId != null && message.hasOwnProperty("groupId"))
                    if (!$util.isInteger(message.groupId) && !(message.groupId && $util.isInteger(message.groupId.low) && $util.isInteger(message.groupId.high)))
                        return "groupId: integer|Long expected";
                if (message.targetUid != null && message.hasOwnProperty("targetUid"))
                    if (!$util.isString(message.targetUid))
                        return "targetUid: string expected";
                if (message.targetUin != null && message.hasOwnProperty("targetUin"))
                    if (!$util.isInteger(message.targetUin) && !(message.targetUin && $util.isInteger(message.targetUin.low) && $util.isInteger(message.targetUin.high)))
                        return "targetUin: integer|Long expected";
                if (message.action != null && message.hasOwnProperty("action"))
                    if (!$util.isString(message.action))
                        return "action: string expected";
                if (message.suffix != null && message.hasOwnProperty("suffix"))
                    if (!$util.isString(message.suffix))
                        return "suffix: string expected";
                if (message.rankImage != null && message.hasOwnProperty("rankImage"))
                    if (!$util.isString(message.rankImage))
                        return "rankImage: string expected";
                return null;
            };

            /**
             * Creates a GroupSignInNotice message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.event.GroupSignInNotice
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.event.GroupSignInNotice} GroupSignInNotice
             */
            GroupSignInNotice.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.event.GroupSignInNotice)
                    return object;
                let message = new $root.kritor.event.GroupSignInNotice();
                if (object.groupId != null)
                    if ($util.Long)
                        (message.groupId = $util.Long.fromValue(object.groupId)).unsigned = true;
                    else if (typeof object.groupId === "string")
                        message.groupId = parseInt(object.groupId, 10);
                    else if (typeof object.groupId === "number")
                        message.groupId = object.groupId;
                    else if (typeof object.groupId === "object")
                        message.groupId = new $util.LongBits(object.groupId.low >>> 0, object.groupId.high >>> 0).toNumber(true);
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
                if (object.action != null)
                    message.action = String(object.action);
                if (object.suffix != null)
                    message.suffix = String(object.suffix);
                if (object.rankImage != null)
                    message.rankImage = String(object.rankImage);
                return message;
            };

            /**
             * Creates a plain object from a GroupSignInNotice message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.event.GroupSignInNotice
             * @static
             * @param {kritor.event.GroupSignInNotice} message GroupSignInNotice
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GroupSignInNotice.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.groupId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.groupId = options.longs === String ? "0" : 0;
                    object.targetUid = "";
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.targetUin = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.targetUin = options.longs === String ? "0" : 0;
                    object.action = "";
                    object.suffix = "";
                    object.rankImage = "";
                }
                if (message.groupId != null && message.hasOwnProperty("groupId"))
                    if (typeof message.groupId === "number")
                        object.groupId = options.longs === String ? String(message.groupId) : message.groupId;
                    else
                        object.groupId = options.longs === String ? $util.Long.prototype.toString.call(message.groupId) : options.longs === Number ? new $util.LongBits(message.groupId.low >>> 0, message.groupId.high >>> 0).toNumber(true) : message.groupId;
                if (message.targetUid != null && message.hasOwnProperty("targetUid"))
                    object.targetUid = message.targetUid;
                if (message.targetUin != null && message.hasOwnProperty("targetUin"))
                    if (typeof message.targetUin === "number")
                        object.targetUin = options.longs === String ? String(message.targetUin) : message.targetUin;
                    else
                        object.targetUin = options.longs === String ? $util.Long.prototype.toString.call(message.targetUin) : options.longs === Number ? new $util.LongBits(message.targetUin.low >>> 0, message.targetUin.high >>> 0).toNumber(true) : message.targetUin;
                if (message.action != null && message.hasOwnProperty("action"))
                    object.action = message.action;
                if (message.suffix != null && message.hasOwnProperty("suffix"))
                    object.suffix = message.suffix;
                if (message.rankImage != null && message.hasOwnProperty("rankImage"))
                    object.rankImage = message.rankImage;
                return object;
            };

            /**
             * Converts this GroupSignInNotice to JSON.
             * @function toJSON
             * @memberof kritor.event.GroupSignInNotice
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GroupSignInNotice.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GroupSignInNotice
             * @function getTypeUrl
             * @memberof kritor.event.GroupSignInNotice
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GroupSignInNotice.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.event.GroupSignInNotice";
            };

            return GroupSignInNotice;
        })();

        event.GroupWholeBanNotice = (function() {

            /**
             * Properties of a GroupWholeBanNotice.
             * @memberof kritor.event
             * @interface IGroupWholeBanNotice
             * @property {number|Long|null} [groupId] GroupWholeBanNotice groupId
             * @property {string|null} [operatorUid] GroupWholeBanNotice operatorUid
             * @property {number|Long|null} [operatorUin] GroupWholeBanNotice operatorUin
             * @property {boolean|null} [isBan] GroupWholeBanNotice isBan
             */

            /**
             * Constructs a new GroupWholeBanNotice.
             * @memberof kritor.event
             * @classdesc Represents a GroupWholeBanNotice.
             * @implements IGroupWholeBanNotice
             * @constructor
             * @param {kritor.event.IGroupWholeBanNotice=} [properties] Properties to set
             */
            function GroupWholeBanNotice(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GroupWholeBanNotice groupId.
             * @member {number|Long} groupId
             * @memberof kritor.event.GroupWholeBanNotice
             * @instance
             */
            GroupWholeBanNotice.prototype.groupId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * GroupWholeBanNotice operatorUid.
             * @member {string} operatorUid
             * @memberof kritor.event.GroupWholeBanNotice
             * @instance
             */
            GroupWholeBanNotice.prototype.operatorUid = "";

            /**
             * GroupWholeBanNotice operatorUin.
             * @member {number|Long} operatorUin
             * @memberof kritor.event.GroupWholeBanNotice
             * @instance
             */
            GroupWholeBanNotice.prototype.operatorUin = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * GroupWholeBanNotice isBan.
             * @member {boolean} isBan
             * @memberof kritor.event.GroupWholeBanNotice
             * @instance
             */
            GroupWholeBanNotice.prototype.isBan = false;

            /**
             * Creates a new GroupWholeBanNotice instance using the specified properties.
             * @function create
             * @memberof kritor.event.GroupWholeBanNotice
             * @static
             * @param {kritor.event.IGroupWholeBanNotice=} [properties] Properties to set
             * @returns {kritor.event.GroupWholeBanNotice} GroupWholeBanNotice instance
             */
            GroupWholeBanNotice.create = function create(properties) {
                return new GroupWholeBanNotice(properties);
            };

            /**
             * Encodes the specified GroupWholeBanNotice message. Does not implicitly {@link kritor.event.GroupWholeBanNotice.verify|verify} messages.
             * @function encode
             * @memberof kritor.event.GroupWholeBanNotice
             * @static
             * @param {kritor.event.IGroupWholeBanNotice} message GroupWholeBanNotice message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GroupWholeBanNotice.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.groupId != null && Object.hasOwnProperty.call(message, "groupId"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.groupId);
                if (message.operatorUid != null && Object.hasOwnProperty.call(message, "operatorUid"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.operatorUid);
                if (message.operatorUin != null && Object.hasOwnProperty.call(message, "operatorUin"))
                    writer.uint32(/* id 3, wireType 0 =*/24).uint64(message.operatorUin);
                if (message.isBan != null && Object.hasOwnProperty.call(message, "isBan"))
                    writer.uint32(/* id 4, wireType 0 =*/32).bool(message.isBan);
                return writer;
            };

            /**
             * Encodes the specified GroupWholeBanNotice message, length delimited. Does not implicitly {@link kritor.event.GroupWholeBanNotice.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.event.GroupWholeBanNotice
             * @static
             * @param {kritor.event.IGroupWholeBanNotice} message GroupWholeBanNotice message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GroupWholeBanNotice.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GroupWholeBanNotice message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.event.GroupWholeBanNotice
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.event.GroupWholeBanNotice} GroupWholeBanNotice
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GroupWholeBanNotice.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.event.GroupWholeBanNotice();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.groupId = reader.uint64();
                            break;
                        }
                    case 2: {
                            message.operatorUid = reader.string();
                            break;
                        }
                    case 3: {
                            message.operatorUin = reader.uint64();
                            break;
                        }
                    case 4: {
                            message.isBan = reader.bool();
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
             * Decodes a GroupWholeBanNotice message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.event.GroupWholeBanNotice
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.event.GroupWholeBanNotice} GroupWholeBanNotice
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GroupWholeBanNotice.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GroupWholeBanNotice message.
             * @function verify
             * @memberof kritor.event.GroupWholeBanNotice
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GroupWholeBanNotice.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.groupId != null && message.hasOwnProperty("groupId"))
                    if (!$util.isInteger(message.groupId) && !(message.groupId && $util.isInteger(message.groupId.low) && $util.isInteger(message.groupId.high)))
                        return "groupId: integer|Long expected";
                if (message.operatorUid != null && message.hasOwnProperty("operatorUid"))
                    if (!$util.isString(message.operatorUid))
                        return "operatorUid: string expected";
                if (message.operatorUin != null && message.hasOwnProperty("operatorUin"))
                    if (!$util.isInteger(message.operatorUin) && !(message.operatorUin && $util.isInteger(message.operatorUin.low) && $util.isInteger(message.operatorUin.high)))
                        return "operatorUin: integer|Long expected";
                if (message.isBan != null && message.hasOwnProperty("isBan"))
                    if (typeof message.isBan !== "boolean")
                        return "isBan: boolean expected";
                return null;
            };

            /**
             * Creates a GroupWholeBanNotice message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.event.GroupWholeBanNotice
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.event.GroupWholeBanNotice} GroupWholeBanNotice
             */
            GroupWholeBanNotice.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.event.GroupWholeBanNotice)
                    return object;
                let message = new $root.kritor.event.GroupWholeBanNotice();
                if (object.groupId != null)
                    if ($util.Long)
                        (message.groupId = $util.Long.fromValue(object.groupId)).unsigned = true;
                    else if (typeof object.groupId === "string")
                        message.groupId = parseInt(object.groupId, 10);
                    else if (typeof object.groupId === "number")
                        message.groupId = object.groupId;
                    else if (typeof object.groupId === "object")
                        message.groupId = new $util.LongBits(object.groupId.low >>> 0, object.groupId.high >>> 0).toNumber(true);
                if (object.operatorUid != null)
                    message.operatorUid = String(object.operatorUid);
                if (object.operatorUin != null)
                    if ($util.Long)
                        (message.operatorUin = $util.Long.fromValue(object.operatorUin)).unsigned = true;
                    else if (typeof object.operatorUin === "string")
                        message.operatorUin = parseInt(object.operatorUin, 10);
                    else if (typeof object.operatorUin === "number")
                        message.operatorUin = object.operatorUin;
                    else if (typeof object.operatorUin === "object")
                        message.operatorUin = new $util.LongBits(object.operatorUin.low >>> 0, object.operatorUin.high >>> 0).toNumber(true);
                if (object.isBan != null)
                    message.isBan = Boolean(object.isBan);
                return message;
            };

            /**
             * Creates a plain object from a GroupWholeBanNotice message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.event.GroupWholeBanNotice
             * @static
             * @param {kritor.event.GroupWholeBanNotice} message GroupWholeBanNotice
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GroupWholeBanNotice.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.groupId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.groupId = options.longs === String ? "0" : 0;
                    object.operatorUid = "";
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.operatorUin = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.operatorUin = options.longs === String ? "0" : 0;
                    object.isBan = false;
                }
                if (message.groupId != null && message.hasOwnProperty("groupId"))
                    if (typeof message.groupId === "number")
                        object.groupId = options.longs === String ? String(message.groupId) : message.groupId;
                    else
                        object.groupId = options.longs === String ? $util.Long.prototype.toString.call(message.groupId) : options.longs === Number ? new $util.LongBits(message.groupId.low >>> 0, message.groupId.high >>> 0).toNumber(true) : message.groupId;
                if (message.operatorUid != null && message.hasOwnProperty("operatorUid"))
                    object.operatorUid = message.operatorUid;
                if (message.operatorUin != null && message.hasOwnProperty("operatorUin"))
                    if (typeof message.operatorUin === "number")
                        object.operatorUin = options.longs === String ? String(message.operatorUin) : message.operatorUin;
                    else
                        object.operatorUin = options.longs === String ? $util.Long.prototype.toString.call(message.operatorUin) : options.longs === Number ? new $util.LongBits(message.operatorUin.low >>> 0, message.operatorUin.high >>> 0).toNumber(true) : message.operatorUin;
                if (message.isBan != null && message.hasOwnProperty("isBan"))
                    object.isBan = message.isBan;
                return object;
            };

            /**
             * Converts this GroupWholeBanNotice to JSON.
             * @function toJSON
             * @memberof kritor.event.GroupWholeBanNotice
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GroupWholeBanNotice.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GroupWholeBanNotice
             * @function getTypeUrl
             * @memberof kritor.event.GroupWholeBanNotice
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GroupWholeBanNotice.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.event.GroupWholeBanNotice";
            };

            return GroupWholeBanNotice;
        })();

        event.FriendFileUploadedNotice = (function() {

            /**
             * Properties of a FriendFileUploadedNotice.
             * @memberof kritor.event
             * @interface IFriendFileUploadedNotice
             * @property {string|null} [operatorUid] FriendFileUploadedNotice operatorUid
             * @property {number|Long|null} [operatorUin] FriendFileUploadedNotice operatorUin
             * @property {string|null} [fileId] FriendFileUploadedNotice fileId
             * @property {string|null} [fileSubId] FriendFileUploadedNotice fileSubId
             * @property {string|null} [fileName] FriendFileUploadedNotice fileName
             * @property {number|Long|null} [fileSize] FriendFileUploadedNotice fileSize
             * @property {number|null} [expireTime] FriendFileUploadedNotice expireTime
             * @property {string|null} [url] FriendFileUploadedNotice url
             */

            /**
             * Constructs a new FriendFileUploadedNotice.
             * @memberof kritor.event
             * @classdesc Represents a FriendFileUploadedNotice.
             * @implements IFriendFileUploadedNotice
             * @constructor
             * @param {kritor.event.IFriendFileUploadedNotice=} [properties] Properties to set
             */
            function FriendFileUploadedNotice(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * FriendFileUploadedNotice operatorUid.
             * @member {string} operatorUid
             * @memberof kritor.event.FriendFileUploadedNotice
             * @instance
             */
            FriendFileUploadedNotice.prototype.operatorUid = "";

            /**
             * FriendFileUploadedNotice operatorUin.
             * @member {number|Long} operatorUin
             * @memberof kritor.event.FriendFileUploadedNotice
             * @instance
             */
            FriendFileUploadedNotice.prototype.operatorUin = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * FriendFileUploadedNotice fileId.
             * @member {string} fileId
             * @memberof kritor.event.FriendFileUploadedNotice
             * @instance
             */
            FriendFileUploadedNotice.prototype.fileId = "";

            /**
             * FriendFileUploadedNotice fileSubId.
             * @member {string} fileSubId
             * @memberof kritor.event.FriendFileUploadedNotice
             * @instance
             */
            FriendFileUploadedNotice.prototype.fileSubId = "";

            /**
             * FriendFileUploadedNotice fileName.
             * @member {string} fileName
             * @memberof kritor.event.FriendFileUploadedNotice
             * @instance
             */
            FriendFileUploadedNotice.prototype.fileName = "";

            /**
             * FriendFileUploadedNotice fileSize.
             * @member {number|Long} fileSize
             * @memberof kritor.event.FriendFileUploadedNotice
             * @instance
             */
            FriendFileUploadedNotice.prototype.fileSize = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * FriendFileUploadedNotice expireTime.
             * @member {number} expireTime
             * @memberof kritor.event.FriendFileUploadedNotice
             * @instance
             */
            FriendFileUploadedNotice.prototype.expireTime = 0;

            /**
             * FriendFileUploadedNotice url.
             * @member {string} url
             * @memberof kritor.event.FriendFileUploadedNotice
             * @instance
             */
            FriendFileUploadedNotice.prototype.url = "";

            /**
             * Creates a new FriendFileUploadedNotice instance using the specified properties.
             * @function create
             * @memberof kritor.event.FriendFileUploadedNotice
             * @static
             * @param {kritor.event.IFriendFileUploadedNotice=} [properties] Properties to set
             * @returns {kritor.event.FriendFileUploadedNotice} FriendFileUploadedNotice instance
             */
            FriendFileUploadedNotice.create = function create(properties) {
                return new FriendFileUploadedNotice(properties);
            };

            /**
             * Encodes the specified FriendFileUploadedNotice message. Does not implicitly {@link kritor.event.FriendFileUploadedNotice.verify|verify} messages.
             * @function encode
             * @memberof kritor.event.FriendFileUploadedNotice
             * @static
             * @param {kritor.event.IFriendFileUploadedNotice} message FriendFileUploadedNotice message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            FriendFileUploadedNotice.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.operatorUid != null && Object.hasOwnProperty.call(message, "operatorUid"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.operatorUid);
                if (message.operatorUin != null && Object.hasOwnProperty.call(message, "operatorUin"))
                    writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.operatorUin);
                if (message.fileId != null && Object.hasOwnProperty.call(message, "fileId"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.fileId);
                if (message.fileSubId != null && Object.hasOwnProperty.call(message, "fileSubId"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.fileSubId);
                if (message.fileName != null && Object.hasOwnProperty.call(message, "fileName"))
                    writer.uint32(/* id 5, wireType 2 =*/42).string(message.fileName);
                if (message.fileSize != null && Object.hasOwnProperty.call(message, "fileSize"))
                    writer.uint32(/* id 6, wireType 0 =*/48).uint64(message.fileSize);
                if (message.expireTime != null && Object.hasOwnProperty.call(message, "expireTime"))
                    writer.uint32(/* id 7, wireType 0 =*/56).uint32(message.expireTime);
                if (message.url != null && Object.hasOwnProperty.call(message, "url"))
                    writer.uint32(/* id 8, wireType 2 =*/66).string(message.url);
                return writer;
            };

            /**
             * Encodes the specified FriendFileUploadedNotice message, length delimited. Does not implicitly {@link kritor.event.FriendFileUploadedNotice.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.event.FriendFileUploadedNotice
             * @static
             * @param {kritor.event.IFriendFileUploadedNotice} message FriendFileUploadedNotice message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            FriendFileUploadedNotice.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a FriendFileUploadedNotice message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.event.FriendFileUploadedNotice
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.event.FriendFileUploadedNotice} FriendFileUploadedNotice
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            FriendFileUploadedNotice.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.event.FriendFileUploadedNotice();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.operatorUid = reader.string();
                            break;
                        }
                    case 2: {
                            message.operatorUin = reader.uint64();
                            break;
                        }
                    case 3: {
                            message.fileId = reader.string();
                            break;
                        }
                    case 4: {
                            message.fileSubId = reader.string();
                            break;
                        }
                    case 5: {
                            message.fileName = reader.string();
                            break;
                        }
                    case 6: {
                            message.fileSize = reader.uint64();
                            break;
                        }
                    case 7: {
                            message.expireTime = reader.uint32();
                            break;
                        }
                    case 8: {
                            message.url = reader.string();
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
             * Decodes a FriendFileUploadedNotice message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.event.FriendFileUploadedNotice
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.event.FriendFileUploadedNotice} FriendFileUploadedNotice
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            FriendFileUploadedNotice.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a FriendFileUploadedNotice message.
             * @function verify
             * @memberof kritor.event.FriendFileUploadedNotice
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            FriendFileUploadedNotice.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.operatorUid != null && message.hasOwnProperty("operatorUid"))
                    if (!$util.isString(message.operatorUid))
                        return "operatorUid: string expected";
                if (message.operatorUin != null && message.hasOwnProperty("operatorUin"))
                    if (!$util.isInteger(message.operatorUin) && !(message.operatorUin && $util.isInteger(message.operatorUin.low) && $util.isInteger(message.operatorUin.high)))
                        return "operatorUin: integer|Long expected";
                if (message.fileId != null && message.hasOwnProperty("fileId"))
                    if (!$util.isString(message.fileId))
                        return "fileId: string expected";
                if (message.fileSubId != null && message.hasOwnProperty("fileSubId"))
                    if (!$util.isString(message.fileSubId))
                        return "fileSubId: string expected";
                if (message.fileName != null && message.hasOwnProperty("fileName"))
                    if (!$util.isString(message.fileName))
                        return "fileName: string expected";
                if (message.fileSize != null && message.hasOwnProperty("fileSize"))
                    if (!$util.isInteger(message.fileSize) && !(message.fileSize && $util.isInteger(message.fileSize.low) && $util.isInteger(message.fileSize.high)))
                        return "fileSize: integer|Long expected";
                if (message.expireTime != null && message.hasOwnProperty("expireTime"))
                    if (!$util.isInteger(message.expireTime))
                        return "expireTime: integer expected";
                if (message.url != null && message.hasOwnProperty("url"))
                    if (!$util.isString(message.url))
                        return "url: string expected";
                return null;
            };

            /**
             * Creates a FriendFileUploadedNotice message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.event.FriendFileUploadedNotice
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.event.FriendFileUploadedNotice} FriendFileUploadedNotice
             */
            FriendFileUploadedNotice.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.event.FriendFileUploadedNotice)
                    return object;
                let message = new $root.kritor.event.FriendFileUploadedNotice();
                if (object.operatorUid != null)
                    message.operatorUid = String(object.operatorUid);
                if (object.operatorUin != null)
                    if ($util.Long)
                        (message.operatorUin = $util.Long.fromValue(object.operatorUin)).unsigned = true;
                    else if (typeof object.operatorUin === "string")
                        message.operatorUin = parseInt(object.operatorUin, 10);
                    else if (typeof object.operatorUin === "number")
                        message.operatorUin = object.operatorUin;
                    else if (typeof object.operatorUin === "object")
                        message.operatorUin = new $util.LongBits(object.operatorUin.low >>> 0, object.operatorUin.high >>> 0).toNumber(true);
                if (object.fileId != null)
                    message.fileId = String(object.fileId);
                if (object.fileSubId != null)
                    message.fileSubId = String(object.fileSubId);
                if (object.fileName != null)
                    message.fileName = String(object.fileName);
                if (object.fileSize != null)
                    if ($util.Long)
                        (message.fileSize = $util.Long.fromValue(object.fileSize)).unsigned = true;
                    else if (typeof object.fileSize === "string")
                        message.fileSize = parseInt(object.fileSize, 10);
                    else if (typeof object.fileSize === "number")
                        message.fileSize = object.fileSize;
                    else if (typeof object.fileSize === "object")
                        message.fileSize = new $util.LongBits(object.fileSize.low >>> 0, object.fileSize.high >>> 0).toNumber(true);
                if (object.expireTime != null)
                    message.expireTime = object.expireTime >>> 0;
                if (object.url != null)
                    message.url = String(object.url);
                return message;
            };

            /**
             * Creates a plain object from a FriendFileUploadedNotice message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.event.FriendFileUploadedNotice
             * @static
             * @param {kritor.event.FriendFileUploadedNotice} message FriendFileUploadedNotice
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            FriendFileUploadedNotice.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.operatorUid = "";
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.operatorUin = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.operatorUin = options.longs === String ? "0" : 0;
                    object.fileId = "";
                    object.fileSubId = "";
                    object.fileName = "";
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.fileSize = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.fileSize = options.longs === String ? "0" : 0;
                    object.expireTime = 0;
                    object.url = "";
                }
                if (message.operatorUid != null && message.hasOwnProperty("operatorUid"))
                    object.operatorUid = message.operatorUid;
                if (message.operatorUin != null && message.hasOwnProperty("operatorUin"))
                    if (typeof message.operatorUin === "number")
                        object.operatorUin = options.longs === String ? String(message.operatorUin) : message.operatorUin;
                    else
                        object.operatorUin = options.longs === String ? $util.Long.prototype.toString.call(message.operatorUin) : options.longs === Number ? new $util.LongBits(message.operatorUin.low >>> 0, message.operatorUin.high >>> 0).toNumber(true) : message.operatorUin;
                if (message.fileId != null && message.hasOwnProperty("fileId"))
                    object.fileId = message.fileId;
                if (message.fileSubId != null && message.hasOwnProperty("fileSubId"))
                    object.fileSubId = message.fileSubId;
                if (message.fileName != null && message.hasOwnProperty("fileName"))
                    object.fileName = message.fileName;
                if (message.fileSize != null && message.hasOwnProperty("fileSize"))
                    if (typeof message.fileSize === "number")
                        object.fileSize = options.longs === String ? String(message.fileSize) : message.fileSize;
                    else
                        object.fileSize = options.longs === String ? $util.Long.prototype.toString.call(message.fileSize) : options.longs === Number ? new $util.LongBits(message.fileSize.low >>> 0, message.fileSize.high >>> 0).toNumber(true) : message.fileSize;
                if (message.expireTime != null && message.hasOwnProperty("expireTime"))
                    object.expireTime = message.expireTime;
                if (message.url != null && message.hasOwnProperty("url"))
                    object.url = message.url;
                return object;
            };

            /**
             * Converts this FriendFileUploadedNotice to JSON.
             * @function toJSON
             * @memberof kritor.event.FriendFileUploadedNotice
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            FriendFileUploadedNotice.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for FriendFileUploadedNotice
             * @function getTypeUrl
             * @memberof kritor.event.FriendFileUploadedNotice
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            FriendFileUploadedNotice.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.event.FriendFileUploadedNotice";
            };

            return FriendFileUploadedNotice;
        })();

        event.GroupFileUploadedNotice = (function() {

            /**
             * Properties of a GroupFileUploadedNotice.
             * @memberof kritor.event
             * @interface IGroupFileUploadedNotice
             * @property {number|Long|null} [groupId] GroupFileUploadedNotice groupId
             * @property {string|null} [operatorUid] GroupFileUploadedNotice operatorUid
             * @property {number|Long|null} [operatorUin] GroupFileUploadedNotice operatorUin
             * @property {string|null} [fileId] GroupFileUploadedNotice fileId
             * @property {string|null} [fileSubId] GroupFileUploadedNotice fileSubId
             * @property {string|null} [fileName] GroupFileUploadedNotice fileName
             * @property {number|Long|null} [fileSize] GroupFileUploadedNotice fileSize
             * @property {number|null} [expireTime] GroupFileUploadedNotice expireTime
             * @property {number|null} [biz] GroupFileUploadedNotice biz
             * @property {string|null} [url] GroupFileUploadedNotice url
             */

            /**
             * Constructs a new GroupFileUploadedNotice.
             * @memberof kritor.event
             * @classdesc Represents a GroupFileUploadedNotice.
             * @implements IGroupFileUploadedNotice
             * @constructor
             * @param {kritor.event.IGroupFileUploadedNotice=} [properties] Properties to set
             */
            function GroupFileUploadedNotice(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GroupFileUploadedNotice groupId.
             * @member {number|Long} groupId
             * @memberof kritor.event.GroupFileUploadedNotice
             * @instance
             */
            GroupFileUploadedNotice.prototype.groupId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * GroupFileUploadedNotice operatorUid.
             * @member {string} operatorUid
             * @memberof kritor.event.GroupFileUploadedNotice
             * @instance
             */
            GroupFileUploadedNotice.prototype.operatorUid = "";

            /**
             * GroupFileUploadedNotice operatorUin.
             * @member {number|Long} operatorUin
             * @memberof kritor.event.GroupFileUploadedNotice
             * @instance
             */
            GroupFileUploadedNotice.prototype.operatorUin = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * GroupFileUploadedNotice fileId.
             * @member {string} fileId
             * @memberof kritor.event.GroupFileUploadedNotice
             * @instance
             */
            GroupFileUploadedNotice.prototype.fileId = "";

            /**
             * GroupFileUploadedNotice fileSubId.
             * @member {string} fileSubId
             * @memberof kritor.event.GroupFileUploadedNotice
             * @instance
             */
            GroupFileUploadedNotice.prototype.fileSubId = "";

            /**
             * GroupFileUploadedNotice fileName.
             * @member {string} fileName
             * @memberof kritor.event.GroupFileUploadedNotice
             * @instance
             */
            GroupFileUploadedNotice.prototype.fileName = "";

            /**
             * GroupFileUploadedNotice fileSize.
             * @member {number|Long} fileSize
             * @memberof kritor.event.GroupFileUploadedNotice
             * @instance
             */
            GroupFileUploadedNotice.prototype.fileSize = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * GroupFileUploadedNotice expireTime.
             * @member {number} expireTime
             * @memberof kritor.event.GroupFileUploadedNotice
             * @instance
             */
            GroupFileUploadedNotice.prototype.expireTime = 0;

            /**
             * GroupFileUploadedNotice biz.
             * @member {number} biz
             * @memberof kritor.event.GroupFileUploadedNotice
             * @instance
             */
            GroupFileUploadedNotice.prototype.biz = 0;

            /**
             * GroupFileUploadedNotice url.
             * @member {string} url
             * @memberof kritor.event.GroupFileUploadedNotice
             * @instance
             */
            GroupFileUploadedNotice.prototype.url = "";

            /**
             * Creates a new GroupFileUploadedNotice instance using the specified properties.
             * @function create
             * @memberof kritor.event.GroupFileUploadedNotice
             * @static
             * @param {kritor.event.IGroupFileUploadedNotice=} [properties] Properties to set
             * @returns {kritor.event.GroupFileUploadedNotice} GroupFileUploadedNotice instance
             */
            GroupFileUploadedNotice.create = function create(properties) {
                return new GroupFileUploadedNotice(properties);
            };

            /**
             * Encodes the specified GroupFileUploadedNotice message. Does not implicitly {@link kritor.event.GroupFileUploadedNotice.verify|verify} messages.
             * @function encode
             * @memberof kritor.event.GroupFileUploadedNotice
             * @static
             * @param {kritor.event.IGroupFileUploadedNotice} message GroupFileUploadedNotice message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GroupFileUploadedNotice.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.groupId != null && Object.hasOwnProperty.call(message, "groupId"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.groupId);
                if (message.operatorUid != null && Object.hasOwnProperty.call(message, "operatorUid"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.operatorUid);
                if (message.operatorUin != null && Object.hasOwnProperty.call(message, "operatorUin"))
                    writer.uint32(/* id 3, wireType 0 =*/24).uint64(message.operatorUin);
                if (message.fileId != null && Object.hasOwnProperty.call(message, "fileId"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.fileId);
                if (message.fileSubId != null && Object.hasOwnProperty.call(message, "fileSubId"))
                    writer.uint32(/* id 5, wireType 2 =*/42).string(message.fileSubId);
                if (message.fileName != null && Object.hasOwnProperty.call(message, "fileName"))
                    writer.uint32(/* id 6, wireType 2 =*/50).string(message.fileName);
                if (message.fileSize != null && Object.hasOwnProperty.call(message, "fileSize"))
                    writer.uint32(/* id 7, wireType 0 =*/56).uint64(message.fileSize);
                if (message.expireTime != null && Object.hasOwnProperty.call(message, "expireTime"))
                    writer.uint32(/* id 8, wireType 0 =*/64).uint32(message.expireTime);
                if (message.biz != null && Object.hasOwnProperty.call(message, "biz"))
                    writer.uint32(/* id 9, wireType 0 =*/72).int32(message.biz);
                if (message.url != null && Object.hasOwnProperty.call(message, "url"))
                    writer.uint32(/* id 10, wireType 2 =*/82).string(message.url);
                return writer;
            };

            /**
             * Encodes the specified GroupFileUploadedNotice message, length delimited. Does not implicitly {@link kritor.event.GroupFileUploadedNotice.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.event.GroupFileUploadedNotice
             * @static
             * @param {kritor.event.IGroupFileUploadedNotice} message GroupFileUploadedNotice message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GroupFileUploadedNotice.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GroupFileUploadedNotice message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.event.GroupFileUploadedNotice
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.event.GroupFileUploadedNotice} GroupFileUploadedNotice
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GroupFileUploadedNotice.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.event.GroupFileUploadedNotice();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.groupId = reader.uint64();
                            break;
                        }
                    case 2: {
                            message.operatorUid = reader.string();
                            break;
                        }
                    case 3: {
                            message.operatorUin = reader.uint64();
                            break;
                        }
                    case 4: {
                            message.fileId = reader.string();
                            break;
                        }
                    case 5: {
                            message.fileSubId = reader.string();
                            break;
                        }
                    case 6: {
                            message.fileName = reader.string();
                            break;
                        }
                    case 7: {
                            message.fileSize = reader.uint64();
                            break;
                        }
                    case 8: {
                            message.expireTime = reader.uint32();
                            break;
                        }
                    case 9: {
                            message.biz = reader.int32();
                            break;
                        }
                    case 10: {
                            message.url = reader.string();
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
             * Decodes a GroupFileUploadedNotice message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.event.GroupFileUploadedNotice
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.event.GroupFileUploadedNotice} GroupFileUploadedNotice
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GroupFileUploadedNotice.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GroupFileUploadedNotice message.
             * @function verify
             * @memberof kritor.event.GroupFileUploadedNotice
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GroupFileUploadedNotice.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.groupId != null && message.hasOwnProperty("groupId"))
                    if (!$util.isInteger(message.groupId) && !(message.groupId && $util.isInteger(message.groupId.low) && $util.isInteger(message.groupId.high)))
                        return "groupId: integer|Long expected";
                if (message.operatorUid != null && message.hasOwnProperty("operatorUid"))
                    if (!$util.isString(message.operatorUid))
                        return "operatorUid: string expected";
                if (message.operatorUin != null && message.hasOwnProperty("operatorUin"))
                    if (!$util.isInteger(message.operatorUin) && !(message.operatorUin && $util.isInteger(message.operatorUin.low) && $util.isInteger(message.operatorUin.high)))
                        return "operatorUin: integer|Long expected";
                if (message.fileId != null && message.hasOwnProperty("fileId"))
                    if (!$util.isString(message.fileId))
                        return "fileId: string expected";
                if (message.fileSubId != null && message.hasOwnProperty("fileSubId"))
                    if (!$util.isString(message.fileSubId))
                        return "fileSubId: string expected";
                if (message.fileName != null && message.hasOwnProperty("fileName"))
                    if (!$util.isString(message.fileName))
                        return "fileName: string expected";
                if (message.fileSize != null && message.hasOwnProperty("fileSize"))
                    if (!$util.isInteger(message.fileSize) && !(message.fileSize && $util.isInteger(message.fileSize.low) && $util.isInteger(message.fileSize.high)))
                        return "fileSize: integer|Long expected";
                if (message.expireTime != null && message.hasOwnProperty("expireTime"))
                    if (!$util.isInteger(message.expireTime))
                        return "expireTime: integer expected";
                if (message.biz != null && message.hasOwnProperty("biz"))
                    if (!$util.isInteger(message.biz))
                        return "biz: integer expected";
                if (message.url != null && message.hasOwnProperty("url"))
                    if (!$util.isString(message.url))
                        return "url: string expected";
                return null;
            };

            /**
             * Creates a GroupFileUploadedNotice message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.event.GroupFileUploadedNotice
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.event.GroupFileUploadedNotice} GroupFileUploadedNotice
             */
            GroupFileUploadedNotice.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.event.GroupFileUploadedNotice)
                    return object;
                let message = new $root.kritor.event.GroupFileUploadedNotice();
                if (object.groupId != null)
                    if ($util.Long)
                        (message.groupId = $util.Long.fromValue(object.groupId)).unsigned = true;
                    else if (typeof object.groupId === "string")
                        message.groupId = parseInt(object.groupId, 10);
                    else if (typeof object.groupId === "number")
                        message.groupId = object.groupId;
                    else if (typeof object.groupId === "object")
                        message.groupId = new $util.LongBits(object.groupId.low >>> 0, object.groupId.high >>> 0).toNumber(true);
                if (object.operatorUid != null)
                    message.operatorUid = String(object.operatorUid);
                if (object.operatorUin != null)
                    if ($util.Long)
                        (message.operatorUin = $util.Long.fromValue(object.operatorUin)).unsigned = true;
                    else if (typeof object.operatorUin === "string")
                        message.operatorUin = parseInt(object.operatorUin, 10);
                    else if (typeof object.operatorUin === "number")
                        message.operatorUin = object.operatorUin;
                    else if (typeof object.operatorUin === "object")
                        message.operatorUin = new $util.LongBits(object.operatorUin.low >>> 0, object.operatorUin.high >>> 0).toNumber(true);
                if (object.fileId != null)
                    message.fileId = String(object.fileId);
                if (object.fileSubId != null)
                    message.fileSubId = String(object.fileSubId);
                if (object.fileName != null)
                    message.fileName = String(object.fileName);
                if (object.fileSize != null)
                    if ($util.Long)
                        (message.fileSize = $util.Long.fromValue(object.fileSize)).unsigned = true;
                    else if (typeof object.fileSize === "string")
                        message.fileSize = parseInt(object.fileSize, 10);
                    else if (typeof object.fileSize === "number")
                        message.fileSize = object.fileSize;
                    else if (typeof object.fileSize === "object")
                        message.fileSize = new $util.LongBits(object.fileSize.low >>> 0, object.fileSize.high >>> 0).toNumber(true);
                if (object.expireTime != null)
                    message.expireTime = object.expireTime >>> 0;
                if (object.biz != null)
                    message.biz = object.biz | 0;
                if (object.url != null)
                    message.url = String(object.url);
                return message;
            };

            /**
             * Creates a plain object from a GroupFileUploadedNotice message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.event.GroupFileUploadedNotice
             * @static
             * @param {kritor.event.GroupFileUploadedNotice} message GroupFileUploadedNotice
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GroupFileUploadedNotice.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.groupId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.groupId = options.longs === String ? "0" : 0;
                    object.operatorUid = "";
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.operatorUin = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.operatorUin = options.longs === String ? "0" : 0;
                    object.fileId = "";
                    object.fileSubId = "";
                    object.fileName = "";
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.fileSize = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.fileSize = options.longs === String ? "0" : 0;
                    object.expireTime = 0;
                    object.biz = 0;
                    object.url = "";
                }
                if (message.groupId != null && message.hasOwnProperty("groupId"))
                    if (typeof message.groupId === "number")
                        object.groupId = options.longs === String ? String(message.groupId) : message.groupId;
                    else
                        object.groupId = options.longs === String ? $util.Long.prototype.toString.call(message.groupId) : options.longs === Number ? new $util.LongBits(message.groupId.low >>> 0, message.groupId.high >>> 0).toNumber(true) : message.groupId;
                if (message.operatorUid != null && message.hasOwnProperty("operatorUid"))
                    object.operatorUid = message.operatorUid;
                if (message.operatorUin != null && message.hasOwnProperty("operatorUin"))
                    if (typeof message.operatorUin === "number")
                        object.operatorUin = options.longs === String ? String(message.operatorUin) : message.operatorUin;
                    else
                        object.operatorUin = options.longs === String ? $util.Long.prototype.toString.call(message.operatorUin) : options.longs === Number ? new $util.LongBits(message.operatorUin.low >>> 0, message.operatorUin.high >>> 0).toNumber(true) : message.operatorUin;
                if (message.fileId != null && message.hasOwnProperty("fileId"))
                    object.fileId = message.fileId;
                if (message.fileSubId != null && message.hasOwnProperty("fileSubId"))
                    object.fileSubId = message.fileSubId;
                if (message.fileName != null && message.hasOwnProperty("fileName"))
                    object.fileName = message.fileName;
                if (message.fileSize != null && message.hasOwnProperty("fileSize"))
                    if (typeof message.fileSize === "number")
                        object.fileSize = options.longs === String ? String(message.fileSize) : message.fileSize;
                    else
                        object.fileSize = options.longs === String ? $util.Long.prototype.toString.call(message.fileSize) : options.longs === Number ? new $util.LongBits(message.fileSize.low >>> 0, message.fileSize.high >>> 0).toNumber(true) : message.fileSize;
                if (message.expireTime != null && message.hasOwnProperty("expireTime"))
                    object.expireTime = message.expireTime;
                if (message.biz != null && message.hasOwnProperty("biz"))
                    object.biz = message.biz;
                if (message.url != null && message.hasOwnProperty("url"))
                    object.url = message.url;
                return object;
            };

            /**
             * Converts this GroupFileUploadedNotice to JSON.
             * @function toJSON
             * @memberof kritor.event.GroupFileUploadedNotice
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GroupFileUploadedNotice.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GroupFileUploadedNotice
             * @function getTypeUrl
             * @memberof kritor.event.GroupFileUploadedNotice
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GroupFileUploadedNotice.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.event.GroupFileUploadedNotice";
            };

            return GroupFileUploadedNotice;
        })();

        return event;
    })();

    return kritor;
})();

export { $root as default };
