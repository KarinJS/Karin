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

    kritor.common = (function() {

        /**
         * Namespace common.
         * @memberof kritor
         * @namespace
         */
        const common = {};

        /**
         * Scene enum.
         * @name kritor.common.Scene
         * @enum {number}
         * @property {number} GROUP=0 GROUP value
         * @property {number} FRIEND=1 FRIEND value
         * @property {number} GUILD=2 GUILD value
         * @property {number} STRANGER_FROM_GROUP=10 STRANGER_FROM_GROUP value
         * @property {number} NEARBY=5 NEARBY value
         * @property {number} STRANGER=9 STRANGER value
         */
        common.Scene = (function() {
            const valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "GROUP"] = 0;
            values[valuesById[1] = "FRIEND"] = 1;
            values[valuesById[2] = "GUILD"] = 2;
            values[valuesById[10] = "STRANGER_FROM_GROUP"] = 10;
            values[valuesById[5] = "NEARBY"] = 5;
            values[valuesById[9] = "STRANGER"] = 9;
            return values;
        })();

        common.Contact = (function() {

            /**
             * Properties of a Contact.
             * @memberof kritor.common
             * @interface IContact
             * @property {kritor.common.Scene|null} [scene] Contact scene
             * @property {string|null} [peer] Contact peer
             * @property {string|null} [subPeer] Contact subPeer
             */

            /**
             * Constructs a new Contact.
             * @memberof kritor.common
             * @classdesc Represents a Contact.
             * @implements IContact
             * @constructor
             * @param {kritor.common.IContact=} [properties] Properties to set
             */
            function Contact(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Contact scene.
             * @member {kritor.common.Scene} scene
             * @memberof kritor.common.Contact
             * @instance
             */
            Contact.prototype.scene = 0;

            /**
             * Contact peer.
             * @member {string} peer
             * @memberof kritor.common.Contact
             * @instance
             */
            Contact.prototype.peer = "";

            /**
             * Contact subPeer.
             * @member {string|null|undefined} subPeer
             * @memberof kritor.common.Contact
             * @instance
             */
            Contact.prototype.subPeer = null;

            // OneOf field names bound to virtual getters and setters
            let $oneOfFields;

            /**
             * Contact _subPeer.
             * @member {"subPeer"|undefined} _subPeer
             * @memberof kritor.common.Contact
             * @instance
             */
            Object.defineProperty(Contact.prototype, "_subPeer", {
                get: $util.oneOfGetter($oneOfFields = ["subPeer"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new Contact instance using the specified properties.
             * @function create
             * @memberof kritor.common.Contact
             * @static
             * @param {kritor.common.IContact=} [properties] Properties to set
             * @returns {kritor.common.Contact} Contact instance
             */
            Contact.create = function create(properties) {
                return new Contact(properties);
            };

            /**
             * Encodes the specified Contact message. Does not implicitly {@link kritor.common.Contact.verify|verify} messages.
             * @function encode
             * @memberof kritor.common.Contact
             * @static
             * @param {kritor.common.IContact} message Contact message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Contact.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.scene != null && Object.hasOwnProperty.call(message, "scene"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int32(message.scene);
                if (message.peer != null && Object.hasOwnProperty.call(message, "peer"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.peer);
                if (message.subPeer != null && Object.hasOwnProperty.call(message, "subPeer"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.subPeer);
                return writer;
            };

            /**
             * Encodes the specified Contact message, length delimited. Does not implicitly {@link kritor.common.Contact.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.common.Contact
             * @static
             * @param {kritor.common.IContact} message Contact message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Contact.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a Contact message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.common.Contact
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.common.Contact} Contact
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Contact.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.common.Contact();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.scene = reader.int32();
                            break;
                        }
                    case 2: {
                            message.peer = reader.string();
                            break;
                        }
                    case 3: {
                            message.subPeer = reader.string();
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
             * Decodes a Contact message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.common.Contact
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.common.Contact} Contact
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Contact.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a Contact message.
             * @function verify
             * @memberof kritor.common.Contact
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Contact.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                let properties = {};
                if (message.scene != null && message.hasOwnProperty("scene"))
                    switch (message.scene) {
                    default:
                        return "scene: enum value expected";
                    case 0:
                    case 1:
                    case 2:
                    case 10:
                    case 5:
                    case 9:
                        break;
                    }
                if (message.peer != null && message.hasOwnProperty("peer"))
                    if (!$util.isString(message.peer))
                        return "peer: string expected";
                if (message.subPeer != null && message.hasOwnProperty("subPeer")) {
                    properties._subPeer = 1;
                    if (!$util.isString(message.subPeer))
                        return "subPeer: string expected";
                }
                return null;
            };

            /**
             * Creates a Contact message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.common.Contact
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.common.Contact} Contact
             */
            Contact.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.common.Contact)
                    return object;
                let message = new $root.kritor.common.Contact();
                switch (object.scene) {
                default:
                    if (typeof object.scene === "number") {
                        message.scene = object.scene;
                        break;
                    }
                    break;
                case "GROUP":
                case 0:
                    message.scene = 0;
                    break;
                case "FRIEND":
                case 1:
                    message.scene = 1;
                    break;
                case "GUILD":
                case 2:
                    message.scene = 2;
                    break;
                case "STRANGER_FROM_GROUP":
                case 10:
                    message.scene = 10;
                    break;
                case "NEARBY":
                case 5:
                    message.scene = 5;
                    break;
                case "STRANGER":
                case 9:
                    message.scene = 9;
                    break;
                }
                if (object.peer != null)
                    message.peer = String(object.peer);
                if (object.subPeer != null)
                    message.subPeer = String(object.subPeer);
                return message;
            };

            /**
             * Creates a plain object from a Contact message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.common.Contact
             * @static
             * @param {kritor.common.Contact} message Contact
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Contact.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.scene = options.enums === String ? "GROUP" : 0;
                    object.peer = "";
                }
                if (message.scene != null && message.hasOwnProperty("scene"))
                    object.scene = options.enums === String ? $root.kritor.common.Scene[message.scene] === undefined ? message.scene : $root.kritor.common.Scene[message.scene] : message.scene;
                if (message.peer != null && message.hasOwnProperty("peer"))
                    object.peer = message.peer;
                if (message.subPeer != null && message.hasOwnProperty("subPeer")) {
                    object.subPeer = message.subPeer;
                    if (options.oneofs)
                        object._subPeer = "subPeer";
                }
                return object;
            };

            /**
             * Converts this Contact to JSON.
             * @function toJSON
             * @memberof kritor.common.Contact
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Contact.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for Contact
             * @function getTypeUrl
             * @memberof kritor.common.Contact
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            Contact.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.common.Contact";
            };

            return Contact;
        })();

        common.Sender = (function() {

            /**
             * Properties of a Sender.
             * @memberof kritor.common
             * @interface ISender
             * @property {string|null} [uid] Sender uid
             * @property {number|Long|null} [uin] Sender uin
             * @property {string|null} [nick] Sender nick
             */

            /**
             * Constructs a new Sender.
             * @memberof kritor.common
             * @classdesc Represents a Sender.
             * @implements ISender
             * @constructor
             * @param {kritor.common.ISender=} [properties] Properties to set
             */
            function Sender(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Sender uid.
             * @member {string} uid
             * @memberof kritor.common.Sender
             * @instance
             */
            Sender.prototype.uid = "";

            /**
             * Sender uin.
             * @member {number|Long|null|undefined} uin
             * @memberof kritor.common.Sender
             * @instance
             */
            Sender.prototype.uin = null;

            /**
             * Sender nick.
             * @member {string|null|undefined} nick
             * @memberof kritor.common.Sender
             * @instance
             */
            Sender.prototype.nick = null;

            // OneOf field names bound to virtual getters and setters
            let $oneOfFields;

            /**
             * Sender _uin.
             * @member {"uin"|undefined} _uin
             * @memberof kritor.common.Sender
             * @instance
             */
            Object.defineProperty(Sender.prototype, "_uin", {
                get: $util.oneOfGetter($oneOfFields = ["uin"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Sender _nick.
             * @member {"nick"|undefined} _nick
             * @memberof kritor.common.Sender
             * @instance
             */
            Object.defineProperty(Sender.prototype, "_nick", {
                get: $util.oneOfGetter($oneOfFields = ["nick"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new Sender instance using the specified properties.
             * @function create
             * @memberof kritor.common.Sender
             * @static
             * @param {kritor.common.ISender=} [properties] Properties to set
             * @returns {kritor.common.Sender} Sender instance
             */
            Sender.create = function create(properties) {
                return new Sender(properties);
            };

            /**
             * Encodes the specified Sender message. Does not implicitly {@link kritor.common.Sender.verify|verify} messages.
             * @function encode
             * @memberof kritor.common.Sender
             * @static
             * @param {kritor.common.ISender} message Sender message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Sender.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.uid != null && Object.hasOwnProperty.call(message, "uid"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.uid);
                if (message.uin != null && Object.hasOwnProperty.call(message, "uin"))
                    writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.uin);
                if (message.nick != null && Object.hasOwnProperty.call(message, "nick"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.nick);
                return writer;
            };

            /**
             * Encodes the specified Sender message, length delimited. Does not implicitly {@link kritor.common.Sender.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.common.Sender
             * @static
             * @param {kritor.common.ISender} message Sender message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Sender.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a Sender message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.common.Sender
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.common.Sender} Sender
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Sender.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.common.Sender();
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
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a Sender message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.common.Sender
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.common.Sender} Sender
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Sender.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a Sender message.
             * @function verify
             * @memberof kritor.common.Sender
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Sender.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                let properties = {};
                if (message.uid != null && message.hasOwnProperty("uid"))
                    if (!$util.isString(message.uid))
                        return "uid: string expected";
                if (message.uin != null && message.hasOwnProperty("uin")) {
                    properties._uin = 1;
                    if (!$util.isInteger(message.uin) && !(message.uin && $util.isInteger(message.uin.low) && $util.isInteger(message.uin.high)))
                        return "uin: integer|Long expected";
                }
                if (message.nick != null && message.hasOwnProperty("nick")) {
                    properties._nick = 1;
                    if (!$util.isString(message.nick))
                        return "nick: string expected";
                }
                return null;
            };

            /**
             * Creates a Sender message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.common.Sender
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.common.Sender} Sender
             */
            Sender.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.common.Sender)
                    return object;
                let message = new $root.kritor.common.Sender();
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
                return message;
            };

            /**
             * Creates a plain object from a Sender message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.common.Sender
             * @static
             * @param {kritor.common.Sender} message Sender
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Sender.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults)
                    object.uid = "";
                if (message.uid != null && message.hasOwnProperty("uid"))
                    object.uid = message.uid;
                if (message.uin != null && message.hasOwnProperty("uin")) {
                    if (typeof message.uin === "number")
                        object.uin = options.longs === String ? String(message.uin) : message.uin;
                    else
                        object.uin = options.longs === String ? $util.Long.prototype.toString.call(message.uin) : options.longs === Number ? new $util.LongBits(message.uin.low >>> 0, message.uin.high >>> 0).toNumber(true) : message.uin;
                    if (options.oneofs)
                        object._uin = "uin";
                }
                if (message.nick != null && message.hasOwnProperty("nick")) {
                    object.nick = message.nick;
                    if (options.oneofs)
                        object._nick = "nick";
                }
                return object;
            };

            /**
             * Converts this Sender to JSON.
             * @function toJSON
             * @memberof kritor.common.Sender
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Sender.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for Sender
             * @function getTypeUrl
             * @memberof kritor.common.Sender
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            Sender.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.common.Sender";
            };

            return Sender;
        })();

        return common;
    })();

    return kritor;
})();

export { $root as default };
