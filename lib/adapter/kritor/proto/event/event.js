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

        event.EventService = (function() {

            /**
             * Constructs a new EventService service.
             * @memberof kritor.event
             * @classdesc Represents an EventService
             * @extends $protobuf.rpc.Service
             * @constructor
             * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
             * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
             * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
             */
            function EventService(rpcImpl, requestDelimited, responseDelimited) {
                $protobuf.rpc.Service.call(this, rpcImpl, requestDelimited, responseDelimited);
            }

            (EventService.prototype = Object.create($protobuf.rpc.Service.prototype)).constructor = EventService;

            /**
             * Creates new EventService service using the specified rpc implementation.
             * @function create
             * @memberof kritor.event.EventService
             * @static
             * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
             * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
             * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
             * @returns {EventService} RPC service. Useful where requests and/or responses are streamed.
             */
            EventService.create = function create(rpcImpl, requestDelimited, responseDelimited) {
                return new this(rpcImpl, requestDelimited, responseDelimited);
            };

            /**
             * Callback as used by {@link kritor.event.EventService#registerActiveListener}.
             * @memberof kritor.event.EventService
             * @typedef RegisterActiveListenerCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.event.EventStructure} [response] EventStructure
             */

            /**
             * Calls RegisterActiveListener.
             * @function registerActiveListener
             * @memberof kritor.event.EventService
             * @instance
             * @param {kritor.event.IRequestPushEvent} request RequestPushEvent message or plain object
             * @param {kritor.event.EventService.RegisterActiveListenerCallback} callback Node-style callback called with the error, if any, and EventStructure
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(EventService.prototype.registerActiveListener = function registerActiveListener(request, callback) {
                return this.rpcCall(registerActiveListener, $root.kritor.event.RequestPushEvent, $root.kritor.event.EventStructure, request, callback);
            }, "name", { value: "RegisterActiveListener" });

            /**
             * Calls RegisterActiveListener.
             * @function registerActiveListener
             * @memberof kritor.event.EventService
             * @instance
             * @param {kritor.event.IRequestPushEvent} request RequestPushEvent message or plain object
             * @returns {Promise<kritor.event.EventStructure>} Promise
             * @variation 2
             */

            /**
             * Callback as used by {@link kritor.event.EventService#registerPassiveListener}.
             * @memberof kritor.event.EventService
             * @typedef RegisterPassiveListenerCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.event.RequestPushEvent} [response] RequestPushEvent
             */

            /**
             * Calls RegisterPassiveListener.
             * @function registerPassiveListener
             * @memberof kritor.event.EventService
             * @instance
             * @param {kritor.event.IEventStructure} request EventStructure message or plain object
             * @param {kritor.event.EventService.RegisterPassiveListenerCallback} callback Node-style callback called with the error, if any, and RequestPushEvent
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(EventService.prototype.registerPassiveListener = function registerPassiveListener(request, callback) {
                return this.rpcCall(registerPassiveListener, $root.kritor.event.EventStructure, $root.kritor.event.RequestPushEvent, request, callback);
            }, "name", { value: "RegisterPassiveListener" });

            /**
             * Calls RegisterPassiveListener.
             * @function registerPassiveListener
             * @memberof kritor.event.EventService
             * @instance
             * @param {kritor.event.IEventStructure} request EventStructure message or plain object
             * @returns {Promise<kritor.event.RequestPushEvent>} Promise
             * @variation 2
             */

            return EventService;
        })();

        /**
         * EventType enum.
         * @name kritor.event.EventType
         * @enum {number}
         * @property {number} EVENT_TYPE_CORE_EVENT=0 EVENT_TYPE_CORE_EVENT value
         * @property {number} EVENT_TYPE_MESSAGE=1 EVENT_TYPE_MESSAGE value
         * @property {number} EVENT_TYPE_NOTICE=2 EVENT_TYPE_NOTICE value
         * @property {number} EVENT_TYPE_REQUEST=3 EVENT_TYPE_REQUEST value
         */
        event.EventType = (function() {
            const valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "EVENT_TYPE_CORE_EVENT"] = 0;
            values[valuesById[1] = "EVENT_TYPE_MESSAGE"] = 1;
            values[valuesById[2] = "EVENT_TYPE_NOTICE"] = 2;
            values[valuesById[3] = "EVENT_TYPE_REQUEST"] = 3;
            return values;
        })();

        event.RequestPushEvent = (function() {

            /**
             * Properties of a RequestPushEvent.
             * @memberof kritor.event
             * @interface IRequestPushEvent
             * @property {kritor.event.EventType|null} [type] RequestPushEvent type
             */

            /**
             * Constructs a new RequestPushEvent.
             * @memberof kritor.event
             * @classdesc Represents a RequestPushEvent.
             * @implements IRequestPushEvent
             * @constructor
             * @param {kritor.event.IRequestPushEvent=} [properties] Properties to set
             */
            function RequestPushEvent(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * RequestPushEvent type.
             * @member {kritor.event.EventType} type
             * @memberof kritor.event.RequestPushEvent
             * @instance
             */
            RequestPushEvent.prototype.type = 0;

            /**
             * Creates a new RequestPushEvent instance using the specified properties.
             * @function create
             * @memberof kritor.event.RequestPushEvent
             * @static
             * @param {kritor.event.IRequestPushEvent=} [properties] Properties to set
             * @returns {kritor.event.RequestPushEvent} RequestPushEvent instance
             */
            RequestPushEvent.create = function create(properties) {
                return new RequestPushEvent(properties);
            };

            /**
             * Encodes the specified RequestPushEvent message. Does not implicitly {@link kritor.event.RequestPushEvent.verify|verify} messages.
             * @function encode
             * @memberof kritor.event.RequestPushEvent
             * @static
             * @param {kritor.event.IRequestPushEvent} message RequestPushEvent message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            RequestPushEvent.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int32(message.type);
                return writer;
            };

            /**
             * Encodes the specified RequestPushEvent message, length delimited. Does not implicitly {@link kritor.event.RequestPushEvent.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.event.RequestPushEvent
             * @static
             * @param {kritor.event.IRequestPushEvent} message RequestPushEvent message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            RequestPushEvent.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a RequestPushEvent message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.event.RequestPushEvent
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.event.RequestPushEvent} RequestPushEvent
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            RequestPushEvent.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.event.RequestPushEvent();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
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
             * Decodes a RequestPushEvent message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.event.RequestPushEvent
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.event.RequestPushEvent} RequestPushEvent
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            RequestPushEvent.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a RequestPushEvent message.
             * @function verify
             * @memberof kritor.event.RequestPushEvent
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            RequestPushEvent.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.type != null && message.hasOwnProperty("type"))
                    switch (message.type) {
                    default:
                        return "type: enum value expected";
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                        break;
                    }
                return null;
            };

            /**
             * Creates a RequestPushEvent message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.event.RequestPushEvent
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.event.RequestPushEvent} RequestPushEvent
             */
            RequestPushEvent.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.event.RequestPushEvent)
                    return object;
                let message = new $root.kritor.event.RequestPushEvent();
                switch (object.type) {
                default:
                    if (typeof object.type === "number") {
                        message.type = object.type;
                        break;
                    }
                    break;
                case "EVENT_TYPE_CORE_EVENT":
                case 0:
                    message.type = 0;
                    break;
                case "EVENT_TYPE_MESSAGE":
                case 1:
                    message.type = 1;
                    break;
                case "EVENT_TYPE_NOTICE":
                case 2:
                    message.type = 2;
                    break;
                case "EVENT_TYPE_REQUEST":
                case 3:
                    message.type = 3;
                    break;
                }
                return message;
            };

            /**
             * Creates a plain object from a RequestPushEvent message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.event.RequestPushEvent
             * @static
             * @param {kritor.event.RequestPushEvent} message RequestPushEvent
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            RequestPushEvent.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults)
                    object.type = options.enums === String ? "EVENT_TYPE_CORE_EVENT" : 0;
                if (message.type != null && message.hasOwnProperty("type"))
                    object.type = options.enums === String ? $root.kritor.event.EventType[message.type] === undefined ? message.type : $root.kritor.event.EventType[message.type] : message.type;
                return object;
            };

            /**
             * Converts this RequestPushEvent to JSON.
             * @function toJSON
             * @memberof kritor.event.RequestPushEvent
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            RequestPushEvent.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for RequestPushEvent
             * @function getTypeUrl
             * @memberof kritor.event.RequestPushEvent
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            RequestPushEvent.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.event.RequestPushEvent";
            };

            return RequestPushEvent;
        })();

        event.EventStructure = (function() {

            /**
             * Properties of an EventStructure.
             * @memberof kritor.event
             * @interface IEventStructure
             * @property {kritor.event.EventType|null} [type] EventStructure type
             * @property {kritor.common.IPushMessageBody|null} [message] EventStructure message
             * @property {kritor.event.IRequestsEvent|null} [request] EventStructure request
             * @property {kritor.event.INoticeEvent|null} [notice] EventStructure notice
             */

            /**
             * Constructs a new EventStructure.
             * @memberof kritor.event
             * @classdesc Represents an EventStructure.
             * @implements IEventStructure
             * @constructor
             * @param {kritor.event.IEventStructure=} [properties] Properties to set
             */
            function EventStructure(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * EventStructure type.
             * @member {kritor.event.EventType} type
             * @memberof kritor.event.EventStructure
             * @instance
             */
            EventStructure.prototype.type = 0;

            /**
             * EventStructure message.
             * @member {kritor.common.IPushMessageBody|null|undefined} message
             * @memberof kritor.event.EventStructure
             * @instance
             */
            EventStructure.prototype.message = null;

            /**
             * EventStructure request.
             * @member {kritor.event.IRequestsEvent|null|undefined} request
             * @memberof kritor.event.EventStructure
             * @instance
             */
            EventStructure.prototype.request = null;

            /**
             * EventStructure notice.
             * @member {kritor.event.INoticeEvent|null|undefined} notice
             * @memberof kritor.event.EventStructure
             * @instance
             */
            EventStructure.prototype.notice = null;

            // OneOf field names bound to virtual getters and setters
            let $oneOfFields;

            /**
             * EventStructure event.
             * @member {"message"|"request"|"notice"|undefined} event
             * @memberof kritor.event.EventStructure
             * @instance
             */
            Object.defineProperty(EventStructure.prototype, "event", {
                get: $util.oneOfGetter($oneOfFields = ["message", "request", "notice"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new EventStructure instance using the specified properties.
             * @function create
             * @memberof kritor.event.EventStructure
             * @static
             * @param {kritor.event.IEventStructure=} [properties] Properties to set
             * @returns {kritor.event.EventStructure} EventStructure instance
             */
            EventStructure.create = function create(properties) {
                return new EventStructure(properties);
            };

            /**
             * Encodes the specified EventStructure message. Does not implicitly {@link kritor.event.EventStructure.verify|verify} messages.
             * @function encode
             * @memberof kritor.event.EventStructure
             * @static
             * @param {kritor.event.IEventStructure} message EventStructure message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            EventStructure.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int32(message.type);
                if (message.message != null && Object.hasOwnProperty.call(message, "message"))
                    $root.kritor.common.PushMessageBody.encode(message.message, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                if (message.request != null && Object.hasOwnProperty.call(message, "request"))
                    $root.kritor.event.RequestsEvent.encode(message.request, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                if (message.notice != null && Object.hasOwnProperty.call(message, "notice"))
                    $root.kritor.event.NoticeEvent.encode(message.notice, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified EventStructure message, length delimited. Does not implicitly {@link kritor.event.EventStructure.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.event.EventStructure
             * @static
             * @param {kritor.event.IEventStructure} message EventStructure message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            EventStructure.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an EventStructure message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.event.EventStructure
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.event.EventStructure} EventStructure
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            EventStructure.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.event.EventStructure();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.type = reader.int32();
                            break;
                        }
                    case 2: {
                            message.message = $root.kritor.common.PushMessageBody.decode(reader, reader.uint32());
                            break;
                        }
                    case 3: {
                            message.request = $root.kritor.event.RequestsEvent.decode(reader, reader.uint32());
                            break;
                        }
                    case 4: {
                            message.notice = $root.kritor.event.NoticeEvent.decode(reader, reader.uint32());
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
             * Decodes an EventStructure message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.event.EventStructure
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.event.EventStructure} EventStructure
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            EventStructure.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an EventStructure message.
             * @function verify
             * @memberof kritor.event.EventStructure
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            EventStructure.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                let properties = {};
                if (message.type != null && message.hasOwnProperty("type"))
                    switch (message.type) {
                    default:
                        return "type: enum value expected";
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                        break;
                    }
                if (message.message != null && message.hasOwnProperty("message")) {
                    properties.event = 1;
                    {
                        let error = $root.kritor.common.PushMessageBody.verify(message.message);
                        if (error)
                            return "message." + error;
                    }
                }
                if (message.request != null && message.hasOwnProperty("request")) {
                    if (properties.event === 1)
                        return "event: multiple values";
                    properties.event = 1;
                    {
                        let error = $root.kritor.event.RequestsEvent.verify(message.request);
                        if (error)
                            return "request." + error;
                    }
                }
                if (message.notice != null && message.hasOwnProperty("notice")) {
                    if (properties.event === 1)
                        return "event: multiple values";
                    properties.event = 1;
                    {
                        let error = $root.kritor.event.NoticeEvent.verify(message.notice);
                        if (error)
                            return "notice." + error;
                    }
                }
                return null;
            };

            /**
             * Creates an EventStructure message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.event.EventStructure
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.event.EventStructure} EventStructure
             */
            EventStructure.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.event.EventStructure)
                    return object;
                let message = new $root.kritor.event.EventStructure();
                switch (object.type) {
                default:
                    if (typeof object.type === "number") {
                        message.type = object.type;
                        break;
                    }
                    break;
                case "EVENT_TYPE_CORE_EVENT":
                case 0:
                    message.type = 0;
                    break;
                case "EVENT_TYPE_MESSAGE":
                case 1:
                    message.type = 1;
                    break;
                case "EVENT_TYPE_NOTICE":
                case 2:
                    message.type = 2;
                    break;
                case "EVENT_TYPE_REQUEST":
                case 3:
                    message.type = 3;
                    break;
                }
                if (object.message != null) {
                    if (typeof object.message !== "object")
                        throw TypeError(".kritor.event.EventStructure.message: object expected");
                    message.message = $root.kritor.common.PushMessageBody.fromObject(object.message);
                }
                if (object.request != null) {
                    if (typeof object.request !== "object")
                        throw TypeError(".kritor.event.EventStructure.request: object expected");
                    message.request = $root.kritor.event.RequestsEvent.fromObject(object.request);
                }
                if (object.notice != null) {
                    if (typeof object.notice !== "object")
                        throw TypeError(".kritor.event.EventStructure.notice: object expected");
                    message.notice = $root.kritor.event.NoticeEvent.fromObject(object.notice);
                }
                return message;
            };

            /**
             * Creates a plain object from an EventStructure message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.event.EventStructure
             * @static
             * @param {kritor.event.EventStructure} message EventStructure
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            EventStructure.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults)
                    object.type = options.enums === String ? "EVENT_TYPE_CORE_EVENT" : 0;
                if (message.type != null && message.hasOwnProperty("type"))
                    object.type = options.enums === String ? $root.kritor.event.EventType[message.type] === undefined ? message.type : $root.kritor.event.EventType[message.type] : message.type;
                if (message.message != null && message.hasOwnProperty("message")) {
                    object.message = $root.kritor.common.PushMessageBody.toObject(message.message, options);
                    if (options.oneofs)
                        object.event = "message";
                }
                if (message.request != null && message.hasOwnProperty("request")) {
                    object.request = $root.kritor.event.RequestsEvent.toObject(message.request, options);
                    if (options.oneofs)
                        object.event = "request";
                }
                if (message.notice != null && message.hasOwnProperty("notice")) {
                    object.notice = $root.kritor.event.NoticeEvent.toObject(message.notice, options);
                    if (options.oneofs)
                        object.event = "notice";
                }
                return object;
            };

            /**
             * Converts this EventStructure to JSON.
             * @function toJSON
             * @memberof kritor.event.EventStructure
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            EventStructure.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for EventStructure
             * @function getTypeUrl
             * @memberof kritor.event.EventStructure
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            EventStructure.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.event.EventStructure";
            };

            return EventStructure;
        })();

        event.NoticeEvent = (function() {

            /**
             * Properties of a NoticeEvent.
             * @memberof kritor.event
             * @interface INoticeEvent
             * @property {kritor.event.NoticeEvent.NoticeType|null} [type] NoticeEvent type
             * @property {number|null} [time] NoticeEvent time
             * @property {kritor.event.IFriendPokeNotice|null} [friendPoke] NoticeEvent friendPoke
             * @property {kritor.event.IFriendRecallNotice|null} [friendRecall] NoticeEvent friendRecall
             * @property {kritor.event.IFriendFileUploadedNotice|null} [friendFileUploaded] NoticeEvent friendFileUploaded
             * @property {kritor.event.IGroupPokeNotice|null} [groupPoke] NoticeEvent groupPoke
             * @property {kritor.event.IGroupCardChangedNotice|null} [groupCardChanged] NoticeEvent groupCardChanged
             * @property {kritor.event.IGroupUniqueTitleChangedNotice|null} [groupMemberUniqueTitleChanged] NoticeEvent groupMemberUniqueTitleChanged
             * @property {kritor.event.IGroupEssenceMessageNotice|null} [groupEssenceChanged] NoticeEvent groupEssenceChanged
             * @property {kritor.event.IGroupRecallNotice|null} [groupRecall] NoticeEvent groupRecall
             * @property {kritor.event.IGroupMemberIncreasedNotice|null} [groupMemberIncrease] NoticeEvent groupMemberIncrease
             * @property {kritor.event.IGroupMemberDecreasedNotice|null} [groupMemberDecrease] NoticeEvent groupMemberDecrease
             * @property {kritor.event.IGroupAdminChangedNotice|null} [groupAdminChange] NoticeEvent groupAdminChange
             * @property {kritor.event.IGroupMemberBanNotice|null} [groupMemberBan] NoticeEvent groupMemberBan
             * @property {kritor.event.IGroupSignInNotice|null} [groupSignIn] NoticeEvent groupSignIn
             * @property {kritor.event.IGroupWholeBanNotice|null} [groupWholeBan] NoticeEvent groupWholeBan
             * @property {kritor.event.IGroupFileUploadedNotice|null} [groupFileUploaded] NoticeEvent groupFileUploaded
             */

            /**
             * Constructs a new NoticeEvent.
             * @memberof kritor.event
             * @classdesc Represents a NoticeEvent.
             * @implements INoticeEvent
             * @constructor
             * @param {kritor.event.INoticeEvent=} [properties] Properties to set
             */
            function NoticeEvent(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * NoticeEvent type.
             * @member {kritor.event.NoticeEvent.NoticeType} type
             * @memberof kritor.event.NoticeEvent
             * @instance
             */
            NoticeEvent.prototype.type = 0;

            /**
             * NoticeEvent time.
             * @member {number} time
             * @memberof kritor.event.NoticeEvent
             * @instance
             */
            NoticeEvent.prototype.time = 0;

            /**
             * NoticeEvent friendPoke.
             * @member {kritor.event.IFriendPokeNotice|null|undefined} friendPoke
             * @memberof kritor.event.NoticeEvent
             * @instance
             */
            NoticeEvent.prototype.friendPoke = null;

            /**
             * NoticeEvent friendRecall.
             * @member {kritor.event.IFriendRecallNotice|null|undefined} friendRecall
             * @memberof kritor.event.NoticeEvent
             * @instance
             */
            NoticeEvent.prototype.friendRecall = null;

            /**
             * NoticeEvent friendFileUploaded.
             * @member {kritor.event.IFriendFileUploadedNotice|null|undefined} friendFileUploaded
             * @memberof kritor.event.NoticeEvent
             * @instance
             */
            NoticeEvent.prototype.friendFileUploaded = null;

            /**
             * NoticeEvent groupPoke.
             * @member {kritor.event.IGroupPokeNotice|null|undefined} groupPoke
             * @memberof kritor.event.NoticeEvent
             * @instance
             */
            NoticeEvent.prototype.groupPoke = null;

            /**
             * NoticeEvent groupCardChanged.
             * @member {kritor.event.IGroupCardChangedNotice|null|undefined} groupCardChanged
             * @memberof kritor.event.NoticeEvent
             * @instance
             */
            NoticeEvent.prototype.groupCardChanged = null;

            /**
             * NoticeEvent groupMemberUniqueTitleChanged.
             * @member {kritor.event.IGroupUniqueTitleChangedNotice|null|undefined} groupMemberUniqueTitleChanged
             * @memberof kritor.event.NoticeEvent
             * @instance
             */
            NoticeEvent.prototype.groupMemberUniqueTitleChanged = null;

            /**
             * NoticeEvent groupEssenceChanged.
             * @member {kritor.event.IGroupEssenceMessageNotice|null|undefined} groupEssenceChanged
             * @memberof kritor.event.NoticeEvent
             * @instance
             */
            NoticeEvent.prototype.groupEssenceChanged = null;

            /**
             * NoticeEvent groupRecall.
             * @member {kritor.event.IGroupRecallNotice|null|undefined} groupRecall
             * @memberof kritor.event.NoticeEvent
             * @instance
             */
            NoticeEvent.prototype.groupRecall = null;

            /**
             * NoticeEvent groupMemberIncrease.
             * @member {kritor.event.IGroupMemberIncreasedNotice|null|undefined} groupMemberIncrease
             * @memberof kritor.event.NoticeEvent
             * @instance
             */
            NoticeEvent.prototype.groupMemberIncrease = null;

            /**
             * NoticeEvent groupMemberDecrease.
             * @member {kritor.event.IGroupMemberDecreasedNotice|null|undefined} groupMemberDecrease
             * @memberof kritor.event.NoticeEvent
             * @instance
             */
            NoticeEvent.prototype.groupMemberDecrease = null;

            /**
             * NoticeEvent groupAdminChange.
             * @member {kritor.event.IGroupAdminChangedNotice|null|undefined} groupAdminChange
             * @memberof kritor.event.NoticeEvent
             * @instance
             */
            NoticeEvent.prototype.groupAdminChange = null;

            /**
             * NoticeEvent groupMemberBan.
             * @member {kritor.event.IGroupMemberBanNotice|null|undefined} groupMemberBan
             * @memberof kritor.event.NoticeEvent
             * @instance
             */
            NoticeEvent.prototype.groupMemberBan = null;

            /**
             * NoticeEvent groupSignIn.
             * @member {kritor.event.IGroupSignInNotice|null|undefined} groupSignIn
             * @memberof kritor.event.NoticeEvent
             * @instance
             */
            NoticeEvent.prototype.groupSignIn = null;

            /**
             * NoticeEvent groupWholeBan.
             * @member {kritor.event.IGroupWholeBanNotice|null|undefined} groupWholeBan
             * @memberof kritor.event.NoticeEvent
             * @instance
             */
            NoticeEvent.prototype.groupWholeBan = null;

            /**
             * NoticeEvent groupFileUploaded.
             * @member {kritor.event.IGroupFileUploadedNotice|null|undefined} groupFileUploaded
             * @memberof kritor.event.NoticeEvent
             * @instance
             */
            NoticeEvent.prototype.groupFileUploaded = null;

            // OneOf field names bound to virtual getters and setters
            let $oneOfFields;

            /**
             * NoticeEvent notice.
             * @member {"friendPoke"|"friendRecall"|"friendFileUploaded"|"groupPoke"|"groupCardChanged"|"groupMemberUniqueTitleChanged"|"groupEssenceChanged"|"groupRecall"|"groupMemberIncrease"|"groupMemberDecrease"|"groupAdminChange"|"groupMemberBan"|"groupSignIn"|"groupWholeBan"|"groupFileUploaded"|undefined} notice
             * @memberof kritor.event.NoticeEvent
             * @instance
             */
            Object.defineProperty(NoticeEvent.prototype, "notice", {
                get: $util.oneOfGetter($oneOfFields = ["friendPoke", "friendRecall", "friendFileUploaded", "groupPoke", "groupCardChanged", "groupMemberUniqueTitleChanged", "groupEssenceChanged", "groupRecall", "groupMemberIncrease", "groupMemberDecrease", "groupAdminChange", "groupMemberBan", "groupSignIn", "groupWholeBan", "groupFileUploaded"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new NoticeEvent instance using the specified properties.
             * @function create
             * @memberof kritor.event.NoticeEvent
             * @static
             * @param {kritor.event.INoticeEvent=} [properties] Properties to set
             * @returns {kritor.event.NoticeEvent} NoticeEvent instance
             */
            NoticeEvent.create = function create(properties) {
                return new NoticeEvent(properties);
            };

            /**
             * Encodes the specified NoticeEvent message. Does not implicitly {@link kritor.event.NoticeEvent.verify|verify} messages.
             * @function encode
             * @memberof kritor.event.NoticeEvent
             * @static
             * @param {kritor.event.INoticeEvent} message NoticeEvent message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            NoticeEvent.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int32(message.type);
                if (message.time != null && Object.hasOwnProperty.call(message, "time"))
                    writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.time);
                if (message.friendPoke != null && Object.hasOwnProperty.call(message, "friendPoke"))
                    $root.kritor.event.FriendPokeNotice.encode(message.friendPoke, writer.uint32(/* id 10, wireType 2 =*/82).fork()).ldelim();
                if (message.friendRecall != null && Object.hasOwnProperty.call(message, "friendRecall"))
                    $root.kritor.event.FriendRecallNotice.encode(message.friendRecall, writer.uint32(/* id 11, wireType 2 =*/90).fork()).ldelim();
                if (message.friendFileUploaded != null && Object.hasOwnProperty.call(message, "friendFileUploaded"))
                    $root.kritor.event.FriendFileUploadedNotice.encode(message.friendFileUploaded, writer.uint32(/* id 12, wireType 2 =*/98).fork()).ldelim();
                if (message.groupPoke != null && Object.hasOwnProperty.call(message, "groupPoke"))
                    $root.kritor.event.GroupPokeNotice.encode(message.groupPoke, writer.uint32(/* id 20, wireType 2 =*/162).fork()).ldelim();
                if (message.groupCardChanged != null && Object.hasOwnProperty.call(message, "groupCardChanged"))
                    $root.kritor.event.GroupCardChangedNotice.encode(message.groupCardChanged, writer.uint32(/* id 21, wireType 2 =*/170).fork()).ldelim();
                if (message.groupMemberUniqueTitleChanged != null && Object.hasOwnProperty.call(message, "groupMemberUniqueTitleChanged"))
                    $root.kritor.event.GroupUniqueTitleChangedNotice.encode(message.groupMemberUniqueTitleChanged, writer.uint32(/* id 22, wireType 2 =*/178).fork()).ldelim();
                if (message.groupEssenceChanged != null && Object.hasOwnProperty.call(message, "groupEssenceChanged"))
                    $root.kritor.event.GroupEssenceMessageNotice.encode(message.groupEssenceChanged, writer.uint32(/* id 23, wireType 2 =*/186).fork()).ldelim();
                if (message.groupRecall != null && Object.hasOwnProperty.call(message, "groupRecall"))
                    $root.kritor.event.GroupRecallNotice.encode(message.groupRecall, writer.uint32(/* id 24, wireType 2 =*/194).fork()).ldelim();
                if (message.groupMemberIncrease != null && Object.hasOwnProperty.call(message, "groupMemberIncrease"))
                    $root.kritor.event.GroupMemberIncreasedNotice.encode(message.groupMemberIncrease, writer.uint32(/* id 25, wireType 2 =*/202).fork()).ldelim();
                if (message.groupMemberDecrease != null && Object.hasOwnProperty.call(message, "groupMemberDecrease"))
                    $root.kritor.event.GroupMemberDecreasedNotice.encode(message.groupMemberDecrease, writer.uint32(/* id 26, wireType 2 =*/210).fork()).ldelim();
                if (message.groupAdminChange != null && Object.hasOwnProperty.call(message, "groupAdminChange"))
                    $root.kritor.event.GroupAdminChangedNotice.encode(message.groupAdminChange, writer.uint32(/* id 27, wireType 2 =*/218).fork()).ldelim();
                if (message.groupMemberBan != null && Object.hasOwnProperty.call(message, "groupMemberBan"))
                    $root.kritor.event.GroupMemberBanNotice.encode(message.groupMemberBan, writer.uint32(/* id 28, wireType 2 =*/226).fork()).ldelim();
                if (message.groupSignIn != null && Object.hasOwnProperty.call(message, "groupSignIn"))
                    $root.kritor.event.GroupSignInNotice.encode(message.groupSignIn, writer.uint32(/* id 29, wireType 2 =*/234).fork()).ldelim();
                if (message.groupWholeBan != null && Object.hasOwnProperty.call(message, "groupWholeBan"))
                    $root.kritor.event.GroupWholeBanNotice.encode(message.groupWholeBan, writer.uint32(/* id 30, wireType 2 =*/242).fork()).ldelim();
                if (message.groupFileUploaded != null && Object.hasOwnProperty.call(message, "groupFileUploaded"))
                    $root.kritor.event.GroupFileUploadedNotice.encode(message.groupFileUploaded, writer.uint32(/* id 31, wireType 2 =*/250).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified NoticeEvent message, length delimited. Does not implicitly {@link kritor.event.NoticeEvent.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.event.NoticeEvent
             * @static
             * @param {kritor.event.INoticeEvent} message NoticeEvent message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            NoticeEvent.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a NoticeEvent message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.event.NoticeEvent
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.event.NoticeEvent} NoticeEvent
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            NoticeEvent.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.event.NoticeEvent();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.type = reader.int32();
                            break;
                        }
                    case 2: {
                            message.time = reader.uint32();
                            break;
                        }
                    case 10: {
                            message.friendPoke = $root.kritor.event.FriendPokeNotice.decode(reader, reader.uint32());
                            break;
                        }
                    case 11: {
                            message.friendRecall = $root.kritor.event.FriendRecallNotice.decode(reader, reader.uint32());
                            break;
                        }
                    case 12: {
                            message.friendFileUploaded = $root.kritor.event.FriendFileUploadedNotice.decode(reader, reader.uint32());
                            break;
                        }
                    case 20: {
                            message.groupPoke = $root.kritor.event.GroupPokeNotice.decode(reader, reader.uint32());
                            break;
                        }
                    case 21: {
                            message.groupCardChanged = $root.kritor.event.GroupCardChangedNotice.decode(reader, reader.uint32());
                            break;
                        }
                    case 22: {
                            message.groupMemberUniqueTitleChanged = $root.kritor.event.GroupUniqueTitleChangedNotice.decode(reader, reader.uint32());
                            break;
                        }
                    case 23: {
                            message.groupEssenceChanged = $root.kritor.event.GroupEssenceMessageNotice.decode(reader, reader.uint32());
                            break;
                        }
                    case 24: {
                            message.groupRecall = $root.kritor.event.GroupRecallNotice.decode(reader, reader.uint32());
                            break;
                        }
                    case 25: {
                            message.groupMemberIncrease = $root.kritor.event.GroupMemberIncreasedNotice.decode(reader, reader.uint32());
                            break;
                        }
                    case 26: {
                            message.groupMemberDecrease = $root.kritor.event.GroupMemberDecreasedNotice.decode(reader, reader.uint32());
                            break;
                        }
                    case 27: {
                            message.groupAdminChange = $root.kritor.event.GroupAdminChangedNotice.decode(reader, reader.uint32());
                            break;
                        }
                    case 28: {
                            message.groupMemberBan = $root.kritor.event.GroupMemberBanNotice.decode(reader, reader.uint32());
                            break;
                        }
                    case 29: {
                            message.groupSignIn = $root.kritor.event.GroupSignInNotice.decode(reader, reader.uint32());
                            break;
                        }
                    case 30: {
                            message.groupWholeBan = $root.kritor.event.GroupWholeBanNotice.decode(reader, reader.uint32());
                            break;
                        }
                    case 31: {
                            message.groupFileUploaded = $root.kritor.event.GroupFileUploadedNotice.decode(reader, reader.uint32());
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
             * Decodes a NoticeEvent message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.event.NoticeEvent
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.event.NoticeEvent} NoticeEvent
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            NoticeEvent.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a NoticeEvent message.
             * @function verify
             * @memberof kritor.event.NoticeEvent
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            NoticeEvent.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                let properties = {};
                if (message.type != null && message.hasOwnProperty("type"))
                    switch (message.type) {
                    default:
                        return "type: enum value expected";
                    case 0:
                    case 10:
                    case 11:
                    case 12:
                    case 20:
                    case 21:
                    case 22:
                    case 23:
                    case 24:
                    case 25:
                    case 26:
                    case 27:
                    case 28:
                    case 29:
                    case 30:
                    case 31:
                        break;
                    }
                if (message.time != null && message.hasOwnProperty("time"))
                    if (!$util.isInteger(message.time))
                        return "time: integer expected";
                if (message.friendPoke != null && message.hasOwnProperty("friendPoke")) {
                    properties.notice = 1;
                    {
                        let error = $root.kritor.event.FriendPokeNotice.verify(message.friendPoke);
                        if (error)
                            return "friendPoke." + error;
                    }
                }
                if (message.friendRecall != null && message.hasOwnProperty("friendRecall")) {
                    if (properties.notice === 1)
                        return "notice: multiple values";
                    properties.notice = 1;
                    {
                        let error = $root.kritor.event.FriendRecallNotice.verify(message.friendRecall);
                        if (error)
                            return "friendRecall." + error;
                    }
                }
                if (message.friendFileUploaded != null && message.hasOwnProperty("friendFileUploaded")) {
                    if (properties.notice === 1)
                        return "notice: multiple values";
                    properties.notice = 1;
                    {
                        let error = $root.kritor.event.FriendFileUploadedNotice.verify(message.friendFileUploaded);
                        if (error)
                            return "friendFileUploaded." + error;
                    }
                }
                if (message.groupPoke != null && message.hasOwnProperty("groupPoke")) {
                    if (properties.notice === 1)
                        return "notice: multiple values";
                    properties.notice = 1;
                    {
                        let error = $root.kritor.event.GroupPokeNotice.verify(message.groupPoke);
                        if (error)
                            return "groupPoke." + error;
                    }
                }
                if (message.groupCardChanged != null && message.hasOwnProperty("groupCardChanged")) {
                    if (properties.notice === 1)
                        return "notice: multiple values";
                    properties.notice = 1;
                    {
                        let error = $root.kritor.event.GroupCardChangedNotice.verify(message.groupCardChanged);
                        if (error)
                            return "groupCardChanged." + error;
                    }
                }
                if (message.groupMemberUniqueTitleChanged != null && message.hasOwnProperty("groupMemberUniqueTitleChanged")) {
                    if (properties.notice === 1)
                        return "notice: multiple values";
                    properties.notice = 1;
                    {
                        let error = $root.kritor.event.GroupUniqueTitleChangedNotice.verify(message.groupMemberUniqueTitleChanged);
                        if (error)
                            return "groupMemberUniqueTitleChanged." + error;
                    }
                }
                if (message.groupEssenceChanged != null && message.hasOwnProperty("groupEssenceChanged")) {
                    if (properties.notice === 1)
                        return "notice: multiple values";
                    properties.notice = 1;
                    {
                        let error = $root.kritor.event.GroupEssenceMessageNotice.verify(message.groupEssenceChanged);
                        if (error)
                            return "groupEssenceChanged." + error;
                    }
                }
                if (message.groupRecall != null && message.hasOwnProperty("groupRecall")) {
                    if (properties.notice === 1)
                        return "notice: multiple values";
                    properties.notice = 1;
                    {
                        let error = $root.kritor.event.GroupRecallNotice.verify(message.groupRecall);
                        if (error)
                            return "groupRecall." + error;
                    }
                }
                if (message.groupMemberIncrease != null && message.hasOwnProperty("groupMemberIncrease")) {
                    if (properties.notice === 1)
                        return "notice: multiple values";
                    properties.notice = 1;
                    {
                        let error = $root.kritor.event.GroupMemberIncreasedNotice.verify(message.groupMemberIncrease);
                        if (error)
                            return "groupMemberIncrease." + error;
                    }
                }
                if (message.groupMemberDecrease != null && message.hasOwnProperty("groupMemberDecrease")) {
                    if (properties.notice === 1)
                        return "notice: multiple values";
                    properties.notice = 1;
                    {
                        let error = $root.kritor.event.GroupMemberDecreasedNotice.verify(message.groupMemberDecrease);
                        if (error)
                            return "groupMemberDecrease." + error;
                    }
                }
                if (message.groupAdminChange != null && message.hasOwnProperty("groupAdminChange")) {
                    if (properties.notice === 1)
                        return "notice: multiple values";
                    properties.notice = 1;
                    {
                        let error = $root.kritor.event.GroupAdminChangedNotice.verify(message.groupAdminChange);
                        if (error)
                            return "groupAdminChange." + error;
                    }
                }
                if (message.groupMemberBan != null && message.hasOwnProperty("groupMemberBan")) {
                    if (properties.notice === 1)
                        return "notice: multiple values";
                    properties.notice = 1;
                    {
                        let error = $root.kritor.event.GroupMemberBanNotice.verify(message.groupMemberBan);
                        if (error)
                            return "groupMemberBan." + error;
                    }
                }
                if (message.groupSignIn != null && message.hasOwnProperty("groupSignIn")) {
                    if (properties.notice === 1)
                        return "notice: multiple values";
                    properties.notice = 1;
                    {
                        let error = $root.kritor.event.GroupSignInNotice.verify(message.groupSignIn);
                        if (error)
                            return "groupSignIn." + error;
                    }
                }
                if (message.groupWholeBan != null && message.hasOwnProperty("groupWholeBan")) {
                    if (properties.notice === 1)
                        return "notice: multiple values";
                    properties.notice = 1;
                    {
                        let error = $root.kritor.event.GroupWholeBanNotice.verify(message.groupWholeBan);
                        if (error)
                            return "groupWholeBan." + error;
                    }
                }
                if (message.groupFileUploaded != null && message.hasOwnProperty("groupFileUploaded")) {
                    if (properties.notice === 1)
                        return "notice: multiple values";
                    properties.notice = 1;
                    {
                        let error = $root.kritor.event.GroupFileUploadedNotice.verify(message.groupFileUploaded);
                        if (error)
                            return "groupFileUploaded." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a NoticeEvent message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.event.NoticeEvent
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.event.NoticeEvent} NoticeEvent
             */
            NoticeEvent.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.event.NoticeEvent)
                    return object;
                let message = new $root.kritor.event.NoticeEvent();
                switch (object.type) {
                default:
                    if (typeof object.type === "number") {
                        message.type = object.type;
                        break;
                    }
                    break;
                case "UNKNOWN":
                case 0:
                    message.type = 0;
                    break;
                case "FRIEND_POKE":
                case 10:
                    message.type = 10;
                    break;
                case "FRIEND_RECALL":
                case 11:
                    message.type = 11;
                    break;
                case "FRIEND_FILE_COME":
                case 12:
                    message.type = 12;
                    break;
                case "GROUP_POKE":
                case 20:
                    message.type = 20;
                    break;
                case "GROUP_CARD_CHANGED":
                case 21:
                    message.type = 21;
                    break;
                case "GROUP_MEMBER_UNIQUE_TITLE_CHANGED":
                case 22:
                    message.type = 22;
                    break;
                case "GROUP_ESSENCE_CHANGED":
                case 23:
                    message.type = 23;
                    break;
                case "GROUP_RECALL":
                case 24:
                    message.type = 24;
                    break;
                case "GROUP_MEMBER_INCREASE":
                case 25:
                    message.type = 25;
                    break;
                case "GROUP_MEMBER_DECREASE":
                case 26:
                    message.type = 26;
                    break;
                case "GROUP_ADMIN_CHANGED":
                case 27:
                    message.type = 27;
                    break;
                case "GROUP_MEMBER_BANNED":
                case 28:
                    message.type = 28;
                    break;
                case "GROUP_SIGN":
                case 29:
                    message.type = 29;
                    break;
                case "GROUP_WHOLE_BAN":
                case 30:
                    message.type = 30;
                    break;
                case "GROUP_FILE_COME":
                case 31:
                    message.type = 31;
                    break;
                }
                if (object.time != null)
                    message.time = object.time >>> 0;
                if (object.friendPoke != null) {
                    if (typeof object.friendPoke !== "object")
                        throw TypeError(".kritor.event.NoticeEvent.friendPoke: object expected");
                    message.friendPoke = $root.kritor.event.FriendPokeNotice.fromObject(object.friendPoke);
                }
                if (object.friendRecall != null) {
                    if (typeof object.friendRecall !== "object")
                        throw TypeError(".kritor.event.NoticeEvent.friendRecall: object expected");
                    message.friendRecall = $root.kritor.event.FriendRecallNotice.fromObject(object.friendRecall);
                }
                if (object.friendFileUploaded != null) {
                    if (typeof object.friendFileUploaded !== "object")
                        throw TypeError(".kritor.event.NoticeEvent.friendFileUploaded: object expected");
                    message.friendFileUploaded = $root.kritor.event.FriendFileUploadedNotice.fromObject(object.friendFileUploaded);
                }
                if (object.groupPoke != null) {
                    if (typeof object.groupPoke !== "object")
                        throw TypeError(".kritor.event.NoticeEvent.groupPoke: object expected");
                    message.groupPoke = $root.kritor.event.GroupPokeNotice.fromObject(object.groupPoke);
                }
                if (object.groupCardChanged != null) {
                    if (typeof object.groupCardChanged !== "object")
                        throw TypeError(".kritor.event.NoticeEvent.groupCardChanged: object expected");
                    message.groupCardChanged = $root.kritor.event.GroupCardChangedNotice.fromObject(object.groupCardChanged);
                }
                if (object.groupMemberUniqueTitleChanged != null) {
                    if (typeof object.groupMemberUniqueTitleChanged !== "object")
                        throw TypeError(".kritor.event.NoticeEvent.groupMemberUniqueTitleChanged: object expected");
                    message.groupMemberUniqueTitleChanged = $root.kritor.event.GroupUniqueTitleChangedNotice.fromObject(object.groupMemberUniqueTitleChanged);
                }
                if (object.groupEssenceChanged != null) {
                    if (typeof object.groupEssenceChanged !== "object")
                        throw TypeError(".kritor.event.NoticeEvent.groupEssenceChanged: object expected");
                    message.groupEssenceChanged = $root.kritor.event.GroupEssenceMessageNotice.fromObject(object.groupEssenceChanged);
                }
                if (object.groupRecall != null) {
                    if (typeof object.groupRecall !== "object")
                        throw TypeError(".kritor.event.NoticeEvent.groupRecall: object expected");
                    message.groupRecall = $root.kritor.event.GroupRecallNotice.fromObject(object.groupRecall);
                }
                if (object.groupMemberIncrease != null) {
                    if (typeof object.groupMemberIncrease !== "object")
                        throw TypeError(".kritor.event.NoticeEvent.groupMemberIncrease: object expected");
                    message.groupMemberIncrease = $root.kritor.event.GroupMemberIncreasedNotice.fromObject(object.groupMemberIncrease);
                }
                if (object.groupMemberDecrease != null) {
                    if (typeof object.groupMemberDecrease !== "object")
                        throw TypeError(".kritor.event.NoticeEvent.groupMemberDecrease: object expected");
                    message.groupMemberDecrease = $root.kritor.event.GroupMemberDecreasedNotice.fromObject(object.groupMemberDecrease);
                }
                if (object.groupAdminChange != null) {
                    if (typeof object.groupAdminChange !== "object")
                        throw TypeError(".kritor.event.NoticeEvent.groupAdminChange: object expected");
                    message.groupAdminChange = $root.kritor.event.GroupAdminChangedNotice.fromObject(object.groupAdminChange);
                }
                if (object.groupMemberBan != null) {
                    if (typeof object.groupMemberBan !== "object")
                        throw TypeError(".kritor.event.NoticeEvent.groupMemberBan: object expected");
                    message.groupMemberBan = $root.kritor.event.GroupMemberBanNotice.fromObject(object.groupMemberBan);
                }
                if (object.groupSignIn != null) {
                    if (typeof object.groupSignIn !== "object")
                        throw TypeError(".kritor.event.NoticeEvent.groupSignIn: object expected");
                    message.groupSignIn = $root.kritor.event.GroupSignInNotice.fromObject(object.groupSignIn);
                }
                if (object.groupWholeBan != null) {
                    if (typeof object.groupWholeBan !== "object")
                        throw TypeError(".kritor.event.NoticeEvent.groupWholeBan: object expected");
                    message.groupWholeBan = $root.kritor.event.GroupWholeBanNotice.fromObject(object.groupWholeBan);
                }
                if (object.groupFileUploaded != null) {
                    if (typeof object.groupFileUploaded !== "object")
                        throw TypeError(".kritor.event.NoticeEvent.groupFileUploaded: object expected");
                    message.groupFileUploaded = $root.kritor.event.GroupFileUploadedNotice.fromObject(object.groupFileUploaded);
                }
                return message;
            };

            /**
             * Creates a plain object from a NoticeEvent message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.event.NoticeEvent
             * @static
             * @param {kritor.event.NoticeEvent} message NoticeEvent
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            NoticeEvent.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.type = options.enums === String ? "UNKNOWN" : 0;
                    object.time = 0;
                }
                if (message.type != null && message.hasOwnProperty("type"))
                    object.type = options.enums === String ? $root.kritor.event.NoticeEvent.NoticeType[message.type] === undefined ? message.type : $root.kritor.event.NoticeEvent.NoticeType[message.type] : message.type;
                if (message.time != null && message.hasOwnProperty("time"))
                    object.time = message.time;
                if (message.friendPoke != null && message.hasOwnProperty("friendPoke")) {
                    object.friendPoke = $root.kritor.event.FriendPokeNotice.toObject(message.friendPoke, options);
                    if (options.oneofs)
                        object.notice = "friendPoke";
                }
                if (message.friendRecall != null && message.hasOwnProperty("friendRecall")) {
                    object.friendRecall = $root.kritor.event.FriendRecallNotice.toObject(message.friendRecall, options);
                    if (options.oneofs)
                        object.notice = "friendRecall";
                }
                if (message.friendFileUploaded != null && message.hasOwnProperty("friendFileUploaded")) {
                    object.friendFileUploaded = $root.kritor.event.FriendFileUploadedNotice.toObject(message.friendFileUploaded, options);
                    if (options.oneofs)
                        object.notice = "friendFileUploaded";
                }
                if (message.groupPoke != null && message.hasOwnProperty("groupPoke")) {
                    object.groupPoke = $root.kritor.event.GroupPokeNotice.toObject(message.groupPoke, options);
                    if (options.oneofs)
                        object.notice = "groupPoke";
                }
                if (message.groupCardChanged != null && message.hasOwnProperty("groupCardChanged")) {
                    object.groupCardChanged = $root.kritor.event.GroupCardChangedNotice.toObject(message.groupCardChanged, options);
                    if (options.oneofs)
                        object.notice = "groupCardChanged";
                }
                if (message.groupMemberUniqueTitleChanged != null && message.hasOwnProperty("groupMemberUniqueTitleChanged")) {
                    object.groupMemberUniqueTitleChanged = $root.kritor.event.GroupUniqueTitleChangedNotice.toObject(message.groupMemberUniqueTitleChanged, options);
                    if (options.oneofs)
                        object.notice = "groupMemberUniqueTitleChanged";
                }
                if (message.groupEssenceChanged != null && message.hasOwnProperty("groupEssenceChanged")) {
                    object.groupEssenceChanged = $root.kritor.event.GroupEssenceMessageNotice.toObject(message.groupEssenceChanged, options);
                    if (options.oneofs)
                        object.notice = "groupEssenceChanged";
                }
                if (message.groupRecall != null && message.hasOwnProperty("groupRecall")) {
                    object.groupRecall = $root.kritor.event.GroupRecallNotice.toObject(message.groupRecall, options);
                    if (options.oneofs)
                        object.notice = "groupRecall";
                }
                if (message.groupMemberIncrease != null && message.hasOwnProperty("groupMemberIncrease")) {
                    object.groupMemberIncrease = $root.kritor.event.GroupMemberIncreasedNotice.toObject(message.groupMemberIncrease, options);
                    if (options.oneofs)
                        object.notice = "groupMemberIncrease";
                }
                if (message.groupMemberDecrease != null && message.hasOwnProperty("groupMemberDecrease")) {
                    object.groupMemberDecrease = $root.kritor.event.GroupMemberDecreasedNotice.toObject(message.groupMemberDecrease, options);
                    if (options.oneofs)
                        object.notice = "groupMemberDecrease";
                }
                if (message.groupAdminChange != null && message.hasOwnProperty("groupAdminChange")) {
                    object.groupAdminChange = $root.kritor.event.GroupAdminChangedNotice.toObject(message.groupAdminChange, options);
                    if (options.oneofs)
                        object.notice = "groupAdminChange";
                }
                if (message.groupMemberBan != null && message.hasOwnProperty("groupMemberBan")) {
                    object.groupMemberBan = $root.kritor.event.GroupMemberBanNotice.toObject(message.groupMemberBan, options);
                    if (options.oneofs)
                        object.notice = "groupMemberBan";
                }
                if (message.groupSignIn != null && message.hasOwnProperty("groupSignIn")) {
                    object.groupSignIn = $root.kritor.event.GroupSignInNotice.toObject(message.groupSignIn, options);
                    if (options.oneofs)
                        object.notice = "groupSignIn";
                }
                if (message.groupWholeBan != null && message.hasOwnProperty("groupWholeBan")) {
                    object.groupWholeBan = $root.kritor.event.GroupWholeBanNotice.toObject(message.groupWholeBan, options);
                    if (options.oneofs)
                        object.notice = "groupWholeBan";
                }
                if (message.groupFileUploaded != null && message.hasOwnProperty("groupFileUploaded")) {
                    object.groupFileUploaded = $root.kritor.event.GroupFileUploadedNotice.toObject(message.groupFileUploaded, options);
                    if (options.oneofs)
                        object.notice = "groupFileUploaded";
                }
                return object;
            };

            /**
             * Converts this NoticeEvent to JSON.
             * @function toJSON
             * @memberof kritor.event.NoticeEvent
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            NoticeEvent.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for NoticeEvent
             * @function getTypeUrl
             * @memberof kritor.event.NoticeEvent
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            NoticeEvent.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.event.NoticeEvent";
            };

            /**
             * NoticeType enum.
             * @name kritor.event.NoticeEvent.NoticeType
             * @enum {number}
             * @property {number} UNKNOWN=0 UNKNOWN value
             * @property {number} FRIEND_POKE=10 FRIEND_POKE value
             * @property {number} FRIEND_RECALL=11 FRIEND_RECALL value
             * @property {number} FRIEND_FILE_COME=12 FRIEND_FILE_COME value
             * @property {number} GROUP_POKE=20 GROUP_POKE value
             * @property {number} GROUP_CARD_CHANGED=21 GROUP_CARD_CHANGED value
             * @property {number} GROUP_MEMBER_UNIQUE_TITLE_CHANGED=22 GROUP_MEMBER_UNIQUE_TITLE_CHANGED value
             * @property {number} GROUP_ESSENCE_CHANGED=23 GROUP_ESSENCE_CHANGED value
             * @property {number} GROUP_RECALL=24 GROUP_RECALL value
             * @property {number} GROUP_MEMBER_INCREASE=25 GROUP_MEMBER_INCREASE value
             * @property {number} GROUP_MEMBER_DECREASE=26 GROUP_MEMBER_DECREASE value
             * @property {number} GROUP_ADMIN_CHANGED=27 GROUP_ADMIN_CHANGED value
             * @property {number} GROUP_MEMBER_BANNED=28 GROUP_MEMBER_BANNED value
             * @property {number} GROUP_SIGN=29 GROUP_SIGN value
             * @property {number} GROUP_WHOLE_BAN=30 GROUP_WHOLE_BAN value
             * @property {number} GROUP_FILE_COME=31 GROUP_FILE_COME value
             */
            NoticeEvent.NoticeType = (function() {
                const valuesById = {}, values = Object.create(valuesById);
                values[valuesById[0] = "UNKNOWN"] = 0;
                values[valuesById[10] = "FRIEND_POKE"] = 10;
                values[valuesById[11] = "FRIEND_RECALL"] = 11;
                values[valuesById[12] = "FRIEND_FILE_COME"] = 12;
                values[valuesById[20] = "GROUP_POKE"] = 20;
                values[valuesById[21] = "GROUP_CARD_CHANGED"] = 21;
                values[valuesById[22] = "GROUP_MEMBER_UNIQUE_TITLE_CHANGED"] = 22;
                values[valuesById[23] = "GROUP_ESSENCE_CHANGED"] = 23;
                values[valuesById[24] = "GROUP_RECALL"] = 24;
                values[valuesById[25] = "GROUP_MEMBER_INCREASE"] = 25;
                values[valuesById[26] = "GROUP_MEMBER_DECREASE"] = 26;
                values[valuesById[27] = "GROUP_ADMIN_CHANGED"] = 27;
                values[valuesById[28] = "GROUP_MEMBER_BANNED"] = 28;
                values[valuesById[29] = "GROUP_SIGN"] = 29;
                values[valuesById[30] = "GROUP_WHOLE_BAN"] = 30;
                values[valuesById[31] = "GROUP_FILE_COME"] = 31;
                return values;
            })();

            return NoticeEvent;
        })();

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

        event.RequestsEvent = (function() {

            /**
             * Properties of a RequestsEvent.
             * @memberof kritor.event
             * @interface IRequestsEvent
             * @property {kritor.event.RequestsEvent.RequestType|null} [type] RequestsEvent type
             * @property {number|null} [time] RequestsEvent time
             * @property {kritor.event.IFriendApplyRequest|null} [friendApply] RequestsEvent friendApply
             * @property {kritor.event.IGroupApplyRequest|null} [groupApply] RequestsEvent groupApply
             * @property {kritor.event.IInvitedJoinGroupRequest|null} [invitedGroup] RequestsEvent invitedGroup
             */

            /**
             * Constructs a new RequestsEvent.
             * @memberof kritor.event
             * @classdesc Represents a RequestsEvent.
             * @implements IRequestsEvent
             * @constructor
             * @param {kritor.event.IRequestsEvent=} [properties] Properties to set
             */
            function RequestsEvent(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * RequestsEvent type.
             * @member {kritor.event.RequestsEvent.RequestType} type
             * @memberof kritor.event.RequestsEvent
             * @instance
             */
            RequestsEvent.prototype.type = 0;

            /**
             * RequestsEvent time.
             * @member {number} time
             * @memberof kritor.event.RequestsEvent
             * @instance
             */
            RequestsEvent.prototype.time = 0;

            /**
             * RequestsEvent friendApply.
             * @member {kritor.event.IFriendApplyRequest|null|undefined} friendApply
             * @memberof kritor.event.RequestsEvent
             * @instance
             */
            RequestsEvent.prototype.friendApply = null;

            /**
             * RequestsEvent groupApply.
             * @member {kritor.event.IGroupApplyRequest|null|undefined} groupApply
             * @memberof kritor.event.RequestsEvent
             * @instance
             */
            RequestsEvent.prototype.groupApply = null;

            /**
             * RequestsEvent invitedGroup.
             * @member {kritor.event.IInvitedJoinGroupRequest|null|undefined} invitedGroup
             * @memberof kritor.event.RequestsEvent
             * @instance
             */
            RequestsEvent.prototype.invitedGroup = null;

            // OneOf field names bound to virtual getters and setters
            let $oneOfFields;

            /**
             * RequestsEvent request.
             * @member {"friendApply"|"groupApply"|"invitedGroup"|undefined} request
             * @memberof kritor.event.RequestsEvent
             * @instance
             */
            Object.defineProperty(RequestsEvent.prototype, "request", {
                get: $util.oneOfGetter($oneOfFields = ["friendApply", "groupApply", "invitedGroup"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new RequestsEvent instance using the specified properties.
             * @function create
             * @memberof kritor.event.RequestsEvent
             * @static
             * @param {kritor.event.IRequestsEvent=} [properties] Properties to set
             * @returns {kritor.event.RequestsEvent} RequestsEvent instance
             */
            RequestsEvent.create = function create(properties) {
                return new RequestsEvent(properties);
            };

            /**
             * Encodes the specified RequestsEvent message. Does not implicitly {@link kritor.event.RequestsEvent.verify|verify} messages.
             * @function encode
             * @memberof kritor.event.RequestsEvent
             * @static
             * @param {kritor.event.IRequestsEvent} message RequestsEvent message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            RequestsEvent.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int32(message.type);
                if (message.time != null && Object.hasOwnProperty.call(message, "time"))
                    writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.time);
                if (message.friendApply != null && Object.hasOwnProperty.call(message, "friendApply"))
                    $root.kritor.event.FriendApplyRequest.encode(message.friendApply, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                if (message.groupApply != null && Object.hasOwnProperty.call(message, "groupApply"))
                    $root.kritor.event.GroupApplyRequest.encode(message.groupApply, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                if (message.invitedGroup != null && Object.hasOwnProperty.call(message, "invitedGroup"))
                    $root.kritor.event.InvitedJoinGroupRequest.encode(message.invitedGroup, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified RequestsEvent message, length delimited. Does not implicitly {@link kritor.event.RequestsEvent.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.event.RequestsEvent
             * @static
             * @param {kritor.event.IRequestsEvent} message RequestsEvent message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            RequestsEvent.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a RequestsEvent message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.event.RequestsEvent
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.event.RequestsEvent} RequestsEvent
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            RequestsEvent.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.event.RequestsEvent();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.type = reader.int32();
                            break;
                        }
                    case 2: {
                            message.time = reader.uint32();
                            break;
                        }
                    case 3: {
                            message.friendApply = $root.kritor.event.FriendApplyRequest.decode(reader, reader.uint32());
                            break;
                        }
                    case 4: {
                            message.groupApply = $root.kritor.event.GroupApplyRequest.decode(reader, reader.uint32());
                            break;
                        }
                    case 5: {
                            message.invitedGroup = $root.kritor.event.InvitedJoinGroupRequest.decode(reader, reader.uint32());
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
             * Decodes a RequestsEvent message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.event.RequestsEvent
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.event.RequestsEvent} RequestsEvent
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            RequestsEvent.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a RequestsEvent message.
             * @function verify
             * @memberof kritor.event.RequestsEvent
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            RequestsEvent.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                let properties = {};
                if (message.type != null && message.hasOwnProperty("type"))
                    switch (message.type) {
                    default:
                        return "type: enum value expected";
                    case 0:
                    case 1:
                    case 2:
                        break;
                    }
                if (message.time != null && message.hasOwnProperty("time"))
                    if (!$util.isInteger(message.time))
                        return "time: integer expected";
                if (message.friendApply != null && message.hasOwnProperty("friendApply")) {
                    properties.request = 1;
                    {
                        let error = $root.kritor.event.FriendApplyRequest.verify(message.friendApply);
                        if (error)
                            return "friendApply." + error;
                    }
                }
                if (message.groupApply != null && message.hasOwnProperty("groupApply")) {
                    if (properties.request === 1)
                        return "request: multiple values";
                    properties.request = 1;
                    {
                        let error = $root.kritor.event.GroupApplyRequest.verify(message.groupApply);
                        if (error)
                            return "groupApply." + error;
                    }
                }
                if (message.invitedGroup != null && message.hasOwnProperty("invitedGroup")) {
                    if (properties.request === 1)
                        return "request: multiple values";
                    properties.request = 1;
                    {
                        let error = $root.kritor.event.InvitedJoinGroupRequest.verify(message.invitedGroup);
                        if (error)
                            return "invitedGroup." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a RequestsEvent message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.event.RequestsEvent
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.event.RequestsEvent} RequestsEvent
             */
            RequestsEvent.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.event.RequestsEvent)
                    return object;
                let message = new $root.kritor.event.RequestsEvent();
                switch (object.type) {
                default:
                    if (typeof object.type === "number") {
                        message.type = object.type;
                        break;
                    }
                    break;
                case "FRIEND_APPLY":
                case 0:
                    message.type = 0;
                    break;
                case "GROUP_APPLY":
                case 1:
                    message.type = 1;
                    break;
                case "INVITED_GROUP":
                case 2:
                    message.type = 2;
                    break;
                }
                if (object.time != null)
                    message.time = object.time >>> 0;
                if (object.friendApply != null) {
                    if (typeof object.friendApply !== "object")
                        throw TypeError(".kritor.event.RequestsEvent.friendApply: object expected");
                    message.friendApply = $root.kritor.event.FriendApplyRequest.fromObject(object.friendApply);
                }
                if (object.groupApply != null) {
                    if (typeof object.groupApply !== "object")
                        throw TypeError(".kritor.event.RequestsEvent.groupApply: object expected");
                    message.groupApply = $root.kritor.event.GroupApplyRequest.fromObject(object.groupApply);
                }
                if (object.invitedGroup != null) {
                    if (typeof object.invitedGroup !== "object")
                        throw TypeError(".kritor.event.RequestsEvent.invitedGroup: object expected");
                    message.invitedGroup = $root.kritor.event.InvitedJoinGroupRequest.fromObject(object.invitedGroup);
                }
                return message;
            };

            /**
             * Creates a plain object from a RequestsEvent message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.event.RequestsEvent
             * @static
             * @param {kritor.event.RequestsEvent} message RequestsEvent
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            RequestsEvent.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.type = options.enums === String ? "FRIEND_APPLY" : 0;
                    object.time = 0;
                }
                if (message.type != null && message.hasOwnProperty("type"))
                    object.type = options.enums === String ? $root.kritor.event.RequestsEvent.RequestType[message.type] === undefined ? message.type : $root.kritor.event.RequestsEvent.RequestType[message.type] : message.type;
                if (message.time != null && message.hasOwnProperty("time"))
                    object.time = message.time;
                if (message.friendApply != null && message.hasOwnProperty("friendApply")) {
                    object.friendApply = $root.kritor.event.FriendApplyRequest.toObject(message.friendApply, options);
                    if (options.oneofs)
                        object.request = "friendApply";
                }
                if (message.groupApply != null && message.hasOwnProperty("groupApply")) {
                    object.groupApply = $root.kritor.event.GroupApplyRequest.toObject(message.groupApply, options);
                    if (options.oneofs)
                        object.request = "groupApply";
                }
                if (message.invitedGroup != null && message.hasOwnProperty("invitedGroup")) {
                    object.invitedGroup = $root.kritor.event.InvitedJoinGroupRequest.toObject(message.invitedGroup, options);
                    if (options.oneofs)
                        object.request = "invitedGroup";
                }
                return object;
            };

            /**
             * Converts this RequestsEvent to JSON.
             * @function toJSON
             * @memberof kritor.event.RequestsEvent
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            RequestsEvent.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for RequestsEvent
             * @function getTypeUrl
             * @memberof kritor.event.RequestsEvent
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            RequestsEvent.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.event.RequestsEvent";
            };

            /**
             * RequestType enum.
             * @name kritor.event.RequestsEvent.RequestType
             * @enum {number}
             * @property {number} FRIEND_APPLY=0 FRIEND_APPLY value
             * @property {number} GROUP_APPLY=1 GROUP_APPLY value
             * @property {number} INVITED_GROUP=2 INVITED_GROUP value
             */
            RequestsEvent.RequestType = (function() {
                const valuesById = {}, values = Object.create(valuesById);
                values[valuesById[0] = "FRIEND_APPLY"] = 0;
                values[valuesById[1] = "GROUP_APPLY"] = 1;
                values[valuesById[2] = "INVITED_GROUP"] = 2;
                return values;
            })();

            return RequestsEvent;
        })();

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

    kritor.common = (function() {

        /**
         * Namespace common.
         * @memberof kritor
         * @namespace
         */
        const common = {};

        common.PushMessageBody = (function() {

            /**
             * Properties of a PushMessageBody.
             * @memberof kritor.common
             * @interface IPushMessageBody
             * @property {number|null} [time] PushMessageBody time
             * @property {string|null} [messageId] PushMessageBody messageId
             * @property {number|Long|null} [messageSeq] PushMessageBody messageSeq
             * @property {kritor.common.IContact|null} [contact] PushMessageBody contact
             * @property {kritor.common.ISender|null} [sender] PushMessageBody sender
             * @property {Array.<kritor.common.IElement>|null} [elements] PushMessageBody elements
             */

            /**
             * Constructs a new PushMessageBody.
             * @memberof kritor.common
             * @classdesc Represents a PushMessageBody.
             * @implements IPushMessageBody
             * @constructor
             * @param {kritor.common.IPushMessageBody=} [properties] Properties to set
             */
            function PushMessageBody(properties) {
                this.elements = [];
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * PushMessageBody time.
             * @member {number} time
             * @memberof kritor.common.PushMessageBody
             * @instance
             */
            PushMessageBody.prototype.time = 0;

            /**
             * PushMessageBody messageId.
             * @member {string} messageId
             * @memberof kritor.common.PushMessageBody
             * @instance
             */
            PushMessageBody.prototype.messageId = "";

            /**
             * PushMessageBody messageSeq.
             * @member {number|Long} messageSeq
             * @memberof kritor.common.PushMessageBody
             * @instance
             */
            PushMessageBody.prototype.messageSeq = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * PushMessageBody contact.
             * @member {kritor.common.IContact|null|undefined} contact
             * @memberof kritor.common.PushMessageBody
             * @instance
             */
            PushMessageBody.prototype.contact = null;

            /**
             * PushMessageBody sender.
             * @member {kritor.common.ISender|null|undefined} sender
             * @memberof kritor.common.PushMessageBody
             * @instance
             */
            PushMessageBody.prototype.sender = null;

            /**
             * PushMessageBody elements.
             * @member {Array.<kritor.common.IElement>} elements
             * @memberof kritor.common.PushMessageBody
             * @instance
             */
            PushMessageBody.prototype.elements = $util.emptyArray;

            /**
             * Creates a new PushMessageBody instance using the specified properties.
             * @function create
             * @memberof kritor.common.PushMessageBody
             * @static
             * @param {kritor.common.IPushMessageBody=} [properties] Properties to set
             * @returns {kritor.common.PushMessageBody} PushMessageBody instance
             */
            PushMessageBody.create = function create(properties) {
                return new PushMessageBody(properties);
            };

            /**
             * Encodes the specified PushMessageBody message. Does not implicitly {@link kritor.common.PushMessageBody.verify|verify} messages.
             * @function encode
             * @memberof kritor.common.PushMessageBody
             * @static
             * @param {kritor.common.IPushMessageBody} message PushMessageBody message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            PushMessageBody.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.time != null && Object.hasOwnProperty.call(message, "time"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.time);
                if (message.messageId != null && Object.hasOwnProperty.call(message, "messageId"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.messageId);
                if (message.messageSeq != null && Object.hasOwnProperty.call(message, "messageSeq"))
                    writer.uint32(/* id 3, wireType 0 =*/24).uint64(message.messageSeq);
                if (message.contact != null && Object.hasOwnProperty.call(message, "contact"))
                    $root.kritor.common.Contact.encode(message.contact, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                if (message.sender != null && Object.hasOwnProperty.call(message, "sender"))
                    $root.kritor.common.Sender.encode(message.sender, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
                if (message.elements != null && message.elements.length)
                    for (let i = 0; i < message.elements.length; ++i)
                        $root.kritor.common.Element.encode(message.elements[i], writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified PushMessageBody message, length delimited. Does not implicitly {@link kritor.common.PushMessageBody.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.common.PushMessageBody
             * @static
             * @param {kritor.common.IPushMessageBody} message PushMessageBody message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            PushMessageBody.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a PushMessageBody message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.common.PushMessageBody
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.common.PushMessageBody} PushMessageBody
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            PushMessageBody.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.common.PushMessageBody();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.time = reader.uint32();
                            break;
                        }
                    case 2: {
                            message.messageId = reader.string();
                            break;
                        }
                    case 3: {
                            message.messageSeq = reader.uint64();
                            break;
                        }
                    case 4: {
                            message.contact = $root.kritor.common.Contact.decode(reader, reader.uint32());
                            break;
                        }
                    case 5: {
                            message.sender = $root.kritor.common.Sender.decode(reader, reader.uint32());
                            break;
                        }
                    case 6: {
                            if (!(message.elements && message.elements.length))
                                message.elements = [];
                            message.elements.push($root.kritor.common.Element.decode(reader, reader.uint32()));
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
             * Decodes a PushMessageBody message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.common.PushMessageBody
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.common.PushMessageBody} PushMessageBody
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            PushMessageBody.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a PushMessageBody message.
             * @function verify
             * @memberof kritor.common.PushMessageBody
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            PushMessageBody.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.time != null && message.hasOwnProperty("time"))
                    if (!$util.isInteger(message.time))
                        return "time: integer expected";
                if (message.messageId != null && message.hasOwnProperty("messageId"))
                    if (!$util.isString(message.messageId))
                        return "messageId: string expected";
                if (message.messageSeq != null && message.hasOwnProperty("messageSeq"))
                    if (!$util.isInteger(message.messageSeq) && !(message.messageSeq && $util.isInteger(message.messageSeq.low) && $util.isInteger(message.messageSeq.high)))
                        return "messageSeq: integer|Long expected";
                if (message.contact != null && message.hasOwnProperty("contact")) {
                    let error = $root.kritor.common.Contact.verify(message.contact);
                    if (error)
                        return "contact." + error;
                }
                if (message.sender != null && message.hasOwnProperty("sender")) {
                    let error = $root.kritor.common.Sender.verify(message.sender);
                    if (error)
                        return "sender." + error;
                }
                if (message.elements != null && message.hasOwnProperty("elements")) {
                    if (!Array.isArray(message.elements))
                        return "elements: array expected";
                    for (let i = 0; i < message.elements.length; ++i) {
                        let error = $root.kritor.common.Element.verify(message.elements[i]);
                        if (error)
                            return "elements." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a PushMessageBody message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.common.PushMessageBody
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.common.PushMessageBody} PushMessageBody
             */
            PushMessageBody.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.common.PushMessageBody)
                    return object;
                let message = new $root.kritor.common.PushMessageBody();
                if (object.time != null)
                    message.time = object.time >>> 0;
                if (object.messageId != null)
                    message.messageId = String(object.messageId);
                if (object.messageSeq != null)
                    if ($util.Long)
                        (message.messageSeq = $util.Long.fromValue(object.messageSeq)).unsigned = true;
                    else if (typeof object.messageSeq === "string")
                        message.messageSeq = parseInt(object.messageSeq, 10);
                    else if (typeof object.messageSeq === "number")
                        message.messageSeq = object.messageSeq;
                    else if (typeof object.messageSeq === "object")
                        message.messageSeq = new $util.LongBits(object.messageSeq.low >>> 0, object.messageSeq.high >>> 0).toNumber(true);
                if (object.contact != null) {
                    if (typeof object.contact !== "object")
                        throw TypeError(".kritor.common.PushMessageBody.contact: object expected");
                    message.contact = $root.kritor.common.Contact.fromObject(object.contact);
                }
                if (object.sender != null) {
                    if (typeof object.sender !== "object")
                        throw TypeError(".kritor.common.PushMessageBody.sender: object expected");
                    message.sender = $root.kritor.common.Sender.fromObject(object.sender);
                }
                if (object.elements) {
                    if (!Array.isArray(object.elements))
                        throw TypeError(".kritor.common.PushMessageBody.elements: array expected");
                    message.elements = [];
                    for (let i = 0; i < object.elements.length; ++i) {
                        if (typeof object.elements[i] !== "object")
                            throw TypeError(".kritor.common.PushMessageBody.elements: object expected");
                        message.elements[i] = $root.kritor.common.Element.fromObject(object.elements[i]);
                    }
                }
                return message;
            };

            /**
             * Creates a plain object from a PushMessageBody message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.common.PushMessageBody
             * @static
             * @param {kritor.common.PushMessageBody} message PushMessageBody
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            PushMessageBody.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.arrays || options.defaults)
                    object.elements = [];
                if (options.defaults) {
                    object.time = 0;
                    object.messageId = "";
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.messageSeq = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.messageSeq = options.longs === String ? "0" : 0;
                    object.contact = null;
                    object.sender = null;
                }
                if (message.time != null && message.hasOwnProperty("time"))
                    object.time = message.time;
                if (message.messageId != null && message.hasOwnProperty("messageId"))
                    object.messageId = message.messageId;
                if (message.messageSeq != null && message.hasOwnProperty("messageSeq"))
                    if (typeof message.messageSeq === "number")
                        object.messageSeq = options.longs === String ? String(message.messageSeq) : message.messageSeq;
                    else
                        object.messageSeq = options.longs === String ? $util.Long.prototype.toString.call(message.messageSeq) : options.longs === Number ? new $util.LongBits(message.messageSeq.low >>> 0, message.messageSeq.high >>> 0).toNumber(true) : message.messageSeq;
                if (message.contact != null && message.hasOwnProperty("contact"))
                    object.contact = $root.kritor.common.Contact.toObject(message.contact, options);
                if (message.sender != null && message.hasOwnProperty("sender"))
                    object.sender = $root.kritor.common.Sender.toObject(message.sender, options);
                if (message.elements && message.elements.length) {
                    object.elements = [];
                    for (let j = 0; j < message.elements.length; ++j)
                        object.elements[j] = $root.kritor.common.Element.toObject(message.elements[j], options);
                }
                return object;
            };

            /**
             * Converts this PushMessageBody to JSON.
             * @function toJSON
             * @memberof kritor.common.PushMessageBody
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            PushMessageBody.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for PushMessageBody
             * @function getTypeUrl
             * @memberof kritor.common.PushMessageBody
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            PushMessageBody.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.common.PushMessageBody";
            };

            return PushMessageBody;
        })();

        common.ForwardMessageBody = (function() {

            /**
             * Properties of a ForwardMessageBody.
             * @memberof kritor.common
             * @interface IForwardMessageBody
             * @property {string|null} [messageId] ForwardMessageBody messageId
             * @property {kritor.common.IPushMessageBody|null} [message] ForwardMessageBody message
             */

            /**
             * Constructs a new ForwardMessageBody.
             * @memberof kritor.common
             * @classdesc Represents a ForwardMessageBody.
             * @implements IForwardMessageBody
             * @constructor
             * @param {kritor.common.IForwardMessageBody=} [properties] Properties to set
             */
            function ForwardMessageBody(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * ForwardMessageBody messageId.
             * @member {string|null|undefined} messageId
             * @memberof kritor.common.ForwardMessageBody
             * @instance
             */
            ForwardMessageBody.prototype.messageId = null;

            /**
             * ForwardMessageBody message.
             * @member {kritor.common.IPushMessageBody|null|undefined} message
             * @memberof kritor.common.ForwardMessageBody
             * @instance
             */
            ForwardMessageBody.prototype.message = null;

            // OneOf field names bound to virtual getters and setters
            let $oneOfFields;

            /**
             * ForwardMessageBody forwardMessage.
             * @member {"messageId"|"message"|undefined} forwardMessage
             * @memberof kritor.common.ForwardMessageBody
             * @instance
             */
            Object.defineProperty(ForwardMessageBody.prototype, "forwardMessage", {
                get: $util.oneOfGetter($oneOfFields = ["messageId", "message"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new ForwardMessageBody instance using the specified properties.
             * @function create
             * @memberof kritor.common.ForwardMessageBody
             * @static
             * @param {kritor.common.IForwardMessageBody=} [properties] Properties to set
             * @returns {kritor.common.ForwardMessageBody} ForwardMessageBody instance
             */
            ForwardMessageBody.create = function create(properties) {
                return new ForwardMessageBody(properties);
            };

            /**
             * Encodes the specified ForwardMessageBody message. Does not implicitly {@link kritor.common.ForwardMessageBody.verify|verify} messages.
             * @function encode
             * @memberof kritor.common.ForwardMessageBody
             * @static
             * @param {kritor.common.IForwardMessageBody} message ForwardMessageBody message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ForwardMessageBody.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.messageId != null && Object.hasOwnProperty.call(message, "messageId"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.messageId);
                if (message.message != null && Object.hasOwnProperty.call(message, "message"))
                    $root.kritor.common.PushMessageBody.encode(message.message, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified ForwardMessageBody message, length delimited. Does not implicitly {@link kritor.common.ForwardMessageBody.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.common.ForwardMessageBody
             * @static
             * @param {kritor.common.IForwardMessageBody} message ForwardMessageBody message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ForwardMessageBody.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a ForwardMessageBody message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.common.ForwardMessageBody
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.common.ForwardMessageBody} ForwardMessageBody
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ForwardMessageBody.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.common.ForwardMessageBody();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.messageId = reader.string();
                            break;
                        }
                    case 2: {
                            message.message = $root.kritor.common.PushMessageBody.decode(reader, reader.uint32());
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
             * Decodes a ForwardMessageBody message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.common.ForwardMessageBody
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.common.ForwardMessageBody} ForwardMessageBody
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ForwardMessageBody.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a ForwardMessageBody message.
             * @function verify
             * @memberof kritor.common.ForwardMessageBody
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ForwardMessageBody.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                let properties = {};
                if (message.messageId != null && message.hasOwnProperty("messageId")) {
                    properties.forwardMessage = 1;
                    if (!$util.isString(message.messageId))
                        return "messageId: string expected";
                }
                if (message.message != null && message.hasOwnProperty("message")) {
                    if (properties.forwardMessage === 1)
                        return "forwardMessage: multiple values";
                    properties.forwardMessage = 1;
                    {
                        let error = $root.kritor.common.PushMessageBody.verify(message.message);
                        if (error)
                            return "message." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a ForwardMessageBody message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.common.ForwardMessageBody
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.common.ForwardMessageBody} ForwardMessageBody
             */
            ForwardMessageBody.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.common.ForwardMessageBody)
                    return object;
                let message = new $root.kritor.common.ForwardMessageBody();
                if (object.messageId != null)
                    message.messageId = String(object.messageId);
                if (object.message != null) {
                    if (typeof object.message !== "object")
                        throw TypeError(".kritor.common.ForwardMessageBody.message: object expected");
                    message.message = $root.kritor.common.PushMessageBody.fromObject(object.message);
                }
                return message;
            };

            /**
             * Creates a plain object from a ForwardMessageBody message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.common.ForwardMessageBody
             * @static
             * @param {kritor.common.ForwardMessageBody} message ForwardMessageBody
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ForwardMessageBody.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (message.messageId != null && message.hasOwnProperty("messageId")) {
                    object.messageId = message.messageId;
                    if (options.oneofs)
                        object.forwardMessage = "messageId";
                }
                if (message.message != null && message.hasOwnProperty("message")) {
                    object.message = $root.kritor.common.PushMessageBody.toObject(message.message, options);
                    if (options.oneofs)
                        object.forwardMessage = "message";
                }
                return object;
            };

            /**
             * Converts this ForwardMessageBody to JSON.
             * @function toJSON
             * @memberof kritor.common.ForwardMessageBody
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ForwardMessageBody.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for ForwardMessageBody
             * @function getTypeUrl
             * @memberof kritor.common.ForwardMessageBody
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            ForwardMessageBody.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.common.ForwardMessageBody";
            };

            return ForwardMessageBody;
        })();

        common.EssenceMessageBody = (function() {

            /**
             * Properties of an EssenceMessageBody.
             * @memberof kritor.common
             * @interface IEssenceMessageBody
             * @property {number|null} [groupId] EssenceMessageBody groupId
             * @property {string|null} [senderUid] EssenceMessageBody senderUid
             * @property {number|Long|null} [senderUin] EssenceMessageBody senderUin
             * @property {string|null} [senderNick] EssenceMessageBody senderNick
             * @property {number|Long|null} [operatorUid] EssenceMessageBody operatorUid
             * @property {number|Long|null} [operatorUin] EssenceMessageBody operatorUin
             * @property {string|null} [operatorNick] EssenceMessageBody operatorNick
             * @property {number|null} [operationTime] EssenceMessageBody operationTime
             * @property {number|null} [messageTime] EssenceMessageBody messageTime
             * @property {string|null} [messageId] EssenceMessageBody messageId
             * @property {number|Long|null} [messageSeq] EssenceMessageBody messageSeq
             * @property {string|null} [jsonElements] EssenceMessageBody jsonElements
             */

            /**
             * Constructs a new EssenceMessageBody.
             * @memberof kritor.common
             * @classdesc Represents an EssenceMessageBody.
             * @implements IEssenceMessageBody
             * @constructor
             * @param {kritor.common.IEssenceMessageBody=} [properties] Properties to set
             */
            function EssenceMessageBody(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * EssenceMessageBody groupId.
             * @member {number} groupId
             * @memberof kritor.common.EssenceMessageBody
             * @instance
             */
            EssenceMessageBody.prototype.groupId = 0;

            /**
             * EssenceMessageBody senderUid.
             * @member {string} senderUid
             * @memberof kritor.common.EssenceMessageBody
             * @instance
             */
            EssenceMessageBody.prototype.senderUid = "";

            /**
             * EssenceMessageBody senderUin.
             * @member {number|Long} senderUin
             * @memberof kritor.common.EssenceMessageBody
             * @instance
             */
            EssenceMessageBody.prototype.senderUin = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * EssenceMessageBody senderNick.
             * @member {string} senderNick
             * @memberof kritor.common.EssenceMessageBody
             * @instance
             */
            EssenceMessageBody.prototype.senderNick = "";

            /**
             * EssenceMessageBody operatorUid.
             * @member {number|Long} operatorUid
             * @memberof kritor.common.EssenceMessageBody
             * @instance
             */
            EssenceMessageBody.prototype.operatorUid = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * EssenceMessageBody operatorUin.
             * @member {number|Long} operatorUin
             * @memberof kritor.common.EssenceMessageBody
             * @instance
             */
            EssenceMessageBody.prototype.operatorUin = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * EssenceMessageBody operatorNick.
             * @member {string} operatorNick
             * @memberof kritor.common.EssenceMessageBody
             * @instance
             */
            EssenceMessageBody.prototype.operatorNick = "";

            /**
             * EssenceMessageBody operationTime.
             * @member {number} operationTime
             * @memberof kritor.common.EssenceMessageBody
             * @instance
             */
            EssenceMessageBody.prototype.operationTime = 0;

            /**
             * EssenceMessageBody messageTime.
             * @member {number} messageTime
             * @memberof kritor.common.EssenceMessageBody
             * @instance
             */
            EssenceMessageBody.prototype.messageTime = 0;

            /**
             * EssenceMessageBody messageId.
             * @member {string} messageId
             * @memberof kritor.common.EssenceMessageBody
             * @instance
             */
            EssenceMessageBody.prototype.messageId = "";

            /**
             * EssenceMessageBody messageSeq.
             * @member {number|Long} messageSeq
             * @memberof kritor.common.EssenceMessageBody
             * @instance
             */
            EssenceMessageBody.prototype.messageSeq = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * EssenceMessageBody jsonElements.
             * @member {string} jsonElements
             * @memberof kritor.common.EssenceMessageBody
             * @instance
             */
            EssenceMessageBody.prototype.jsonElements = "";

            /**
             * Creates a new EssenceMessageBody instance using the specified properties.
             * @function create
             * @memberof kritor.common.EssenceMessageBody
             * @static
             * @param {kritor.common.IEssenceMessageBody=} [properties] Properties to set
             * @returns {kritor.common.EssenceMessageBody} EssenceMessageBody instance
             */
            EssenceMessageBody.create = function create(properties) {
                return new EssenceMessageBody(properties);
            };

            /**
             * Encodes the specified EssenceMessageBody message. Does not implicitly {@link kritor.common.EssenceMessageBody.verify|verify} messages.
             * @function encode
             * @memberof kritor.common.EssenceMessageBody
             * @static
             * @param {kritor.common.IEssenceMessageBody} message EssenceMessageBody message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            EssenceMessageBody.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.groupId != null && Object.hasOwnProperty.call(message, "groupId"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.groupId);
                if (message.senderUid != null && Object.hasOwnProperty.call(message, "senderUid"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.senderUid);
                if (message.senderUin != null && Object.hasOwnProperty.call(message, "senderUin"))
                    writer.uint32(/* id 3, wireType 0 =*/24).uint64(message.senderUin);
                if (message.senderNick != null && Object.hasOwnProperty.call(message, "senderNick"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.senderNick);
                if (message.operatorUid != null && Object.hasOwnProperty.call(message, "operatorUid"))
                    writer.uint32(/* id 5, wireType 0 =*/40).uint64(message.operatorUid);
                if (message.operatorUin != null && Object.hasOwnProperty.call(message, "operatorUin"))
                    writer.uint32(/* id 6, wireType 0 =*/48).uint64(message.operatorUin);
                if (message.operatorNick != null && Object.hasOwnProperty.call(message, "operatorNick"))
                    writer.uint32(/* id 7, wireType 2 =*/58).string(message.operatorNick);
                if (message.operationTime != null && Object.hasOwnProperty.call(message, "operationTime"))
                    writer.uint32(/* id 8, wireType 0 =*/64).uint32(message.operationTime);
                if (message.messageTime != null && Object.hasOwnProperty.call(message, "messageTime"))
                    writer.uint32(/* id 9, wireType 0 =*/72).uint32(message.messageTime);
                if (message.messageId != null && Object.hasOwnProperty.call(message, "messageId"))
                    writer.uint32(/* id 10, wireType 2 =*/82).string(message.messageId);
                if (message.messageSeq != null && Object.hasOwnProperty.call(message, "messageSeq"))
                    writer.uint32(/* id 11, wireType 0 =*/88).uint64(message.messageSeq);
                if (message.jsonElements != null && Object.hasOwnProperty.call(message, "jsonElements"))
                    writer.uint32(/* id 12, wireType 2 =*/98).string(message.jsonElements);
                return writer;
            };

            /**
             * Encodes the specified EssenceMessageBody message, length delimited. Does not implicitly {@link kritor.common.EssenceMessageBody.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.common.EssenceMessageBody
             * @static
             * @param {kritor.common.IEssenceMessageBody} message EssenceMessageBody message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            EssenceMessageBody.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an EssenceMessageBody message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.common.EssenceMessageBody
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.common.EssenceMessageBody} EssenceMessageBody
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            EssenceMessageBody.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.common.EssenceMessageBody();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.groupId = reader.uint32();
                            break;
                        }
                    case 2: {
                            message.senderUid = reader.string();
                            break;
                        }
                    case 3: {
                            message.senderUin = reader.uint64();
                            break;
                        }
                    case 4: {
                            message.senderNick = reader.string();
                            break;
                        }
                    case 5: {
                            message.operatorUid = reader.uint64();
                            break;
                        }
                    case 6: {
                            message.operatorUin = reader.uint64();
                            break;
                        }
                    case 7: {
                            message.operatorNick = reader.string();
                            break;
                        }
                    case 8: {
                            message.operationTime = reader.uint32();
                            break;
                        }
                    case 9: {
                            message.messageTime = reader.uint32();
                            break;
                        }
                    case 10: {
                            message.messageId = reader.string();
                            break;
                        }
                    case 11: {
                            message.messageSeq = reader.uint64();
                            break;
                        }
                    case 12: {
                            message.jsonElements = reader.string();
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
             * Decodes an EssenceMessageBody message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.common.EssenceMessageBody
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.common.EssenceMessageBody} EssenceMessageBody
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            EssenceMessageBody.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an EssenceMessageBody message.
             * @function verify
             * @memberof kritor.common.EssenceMessageBody
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            EssenceMessageBody.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.groupId != null && message.hasOwnProperty("groupId"))
                    if (!$util.isInteger(message.groupId))
                        return "groupId: integer expected";
                if (message.senderUid != null && message.hasOwnProperty("senderUid"))
                    if (!$util.isString(message.senderUid))
                        return "senderUid: string expected";
                if (message.senderUin != null && message.hasOwnProperty("senderUin"))
                    if (!$util.isInteger(message.senderUin) && !(message.senderUin && $util.isInteger(message.senderUin.low) && $util.isInteger(message.senderUin.high)))
                        return "senderUin: integer|Long expected";
                if (message.senderNick != null && message.hasOwnProperty("senderNick"))
                    if (!$util.isString(message.senderNick))
                        return "senderNick: string expected";
                if (message.operatorUid != null && message.hasOwnProperty("operatorUid"))
                    if (!$util.isInteger(message.operatorUid) && !(message.operatorUid && $util.isInteger(message.operatorUid.low) && $util.isInteger(message.operatorUid.high)))
                        return "operatorUid: integer|Long expected";
                if (message.operatorUin != null && message.hasOwnProperty("operatorUin"))
                    if (!$util.isInteger(message.operatorUin) && !(message.operatorUin && $util.isInteger(message.operatorUin.low) && $util.isInteger(message.operatorUin.high)))
                        return "operatorUin: integer|Long expected";
                if (message.operatorNick != null && message.hasOwnProperty("operatorNick"))
                    if (!$util.isString(message.operatorNick))
                        return "operatorNick: string expected";
                if (message.operationTime != null && message.hasOwnProperty("operationTime"))
                    if (!$util.isInteger(message.operationTime))
                        return "operationTime: integer expected";
                if (message.messageTime != null && message.hasOwnProperty("messageTime"))
                    if (!$util.isInteger(message.messageTime))
                        return "messageTime: integer expected";
                if (message.messageId != null && message.hasOwnProperty("messageId"))
                    if (!$util.isString(message.messageId))
                        return "messageId: string expected";
                if (message.messageSeq != null && message.hasOwnProperty("messageSeq"))
                    if (!$util.isInteger(message.messageSeq) && !(message.messageSeq && $util.isInteger(message.messageSeq.low) && $util.isInteger(message.messageSeq.high)))
                        return "messageSeq: integer|Long expected";
                if (message.jsonElements != null && message.hasOwnProperty("jsonElements"))
                    if (!$util.isString(message.jsonElements))
                        return "jsonElements: string expected";
                return null;
            };

            /**
             * Creates an EssenceMessageBody message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.common.EssenceMessageBody
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.common.EssenceMessageBody} EssenceMessageBody
             */
            EssenceMessageBody.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.common.EssenceMessageBody)
                    return object;
                let message = new $root.kritor.common.EssenceMessageBody();
                if (object.groupId != null)
                    message.groupId = object.groupId >>> 0;
                if (object.senderUid != null)
                    message.senderUid = String(object.senderUid);
                if (object.senderUin != null)
                    if ($util.Long)
                        (message.senderUin = $util.Long.fromValue(object.senderUin)).unsigned = true;
                    else if (typeof object.senderUin === "string")
                        message.senderUin = parseInt(object.senderUin, 10);
                    else if (typeof object.senderUin === "number")
                        message.senderUin = object.senderUin;
                    else if (typeof object.senderUin === "object")
                        message.senderUin = new $util.LongBits(object.senderUin.low >>> 0, object.senderUin.high >>> 0).toNumber(true);
                if (object.senderNick != null)
                    message.senderNick = String(object.senderNick);
                if (object.operatorUid != null)
                    if ($util.Long)
                        (message.operatorUid = $util.Long.fromValue(object.operatorUid)).unsigned = true;
                    else if (typeof object.operatorUid === "string")
                        message.operatorUid = parseInt(object.operatorUid, 10);
                    else if (typeof object.operatorUid === "number")
                        message.operatorUid = object.operatorUid;
                    else if (typeof object.operatorUid === "object")
                        message.operatorUid = new $util.LongBits(object.operatorUid.low >>> 0, object.operatorUid.high >>> 0).toNumber(true);
                if (object.operatorUin != null)
                    if ($util.Long)
                        (message.operatorUin = $util.Long.fromValue(object.operatorUin)).unsigned = true;
                    else if (typeof object.operatorUin === "string")
                        message.operatorUin = parseInt(object.operatorUin, 10);
                    else if (typeof object.operatorUin === "number")
                        message.operatorUin = object.operatorUin;
                    else if (typeof object.operatorUin === "object")
                        message.operatorUin = new $util.LongBits(object.operatorUin.low >>> 0, object.operatorUin.high >>> 0).toNumber(true);
                if (object.operatorNick != null)
                    message.operatorNick = String(object.operatorNick);
                if (object.operationTime != null)
                    message.operationTime = object.operationTime >>> 0;
                if (object.messageTime != null)
                    message.messageTime = object.messageTime >>> 0;
                if (object.messageId != null)
                    message.messageId = String(object.messageId);
                if (object.messageSeq != null)
                    if ($util.Long)
                        (message.messageSeq = $util.Long.fromValue(object.messageSeq)).unsigned = true;
                    else if (typeof object.messageSeq === "string")
                        message.messageSeq = parseInt(object.messageSeq, 10);
                    else if (typeof object.messageSeq === "number")
                        message.messageSeq = object.messageSeq;
                    else if (typeof object.messageSeq === "object")
                        message.messageSeq = new $util.LongBits(object.messageSeq.low >>> 0, object.messageSeq.high >>> 0).toNumber(true);
                if (object.jsonElements != null)
                    message.jsonElements = String(object.jsonElements);
                return message;
            };

            /**
             * Creates a plain object from an EssenceMessageBody message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.common.EssenceMessageBody
             * @static
             * @param {kritor.common.EssenceMessageBody} message EssenceMessageBody
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            EssenceMessageBody.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.groupId = 0;
                    object.senderUid = "";
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.senderUin = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.senderUin = options.longs === String ? "0" : 0;
                    object.senderNick = "";
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.operatorUid = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.operatorUid = options.longs === String ? "0" : 0;
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.operatorUin = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.operatorUin = options.longs === String ? "0" : 0;
                    object.operatorNick = "";
                    object.operationTime = 0;
                    object.messageTime = 0;
                    object.messageId = "";
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.messageSeq = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.messageSeq = options.longs === String ? "0" : 0;
                    object.jsonElements = "";
                }
                if (message.groupId != null && message.hasOwnProperty("groupId"))
                    object.groupId = message.groupId;
                if (message.senderUid != null && message.hasOwnProperty("senderUid"))
                    object.senderUid = message.senderUid;
                if (message.senderUin != null && message.hasOwnProperty("senderUin"))
                    if (typeof message.senderUin === "number")
                        object.senderUin = options.longs === String ? String(message.senderUin) : message.senderUin;
                    else
                        object.senderUin = options.longs === String ? $util.Long.prototype.toString.call(message.senderUin) : options.longs === Number ? new $util.LongBits(message.senderUin.low >>> 0, message.senderUin.high >>> 0).toNumber(true) : message.senderUin;
                if (message.senderNick != null && message.hasOwnProperty("senderNick"))
                    object.senderNick = message.senderNick;
                if (message.operatorUid != null && message.hasOwnProperty("operatorUid"))
                    if (typeof message.operatorUid === "number")
                        object.operatorUid = options.longs === String ? String(message.operatorUid) : message.operatorUid;
                    else
                        object.operatorUid = options.longs === String ? $util.Long.prototype.toString.call(message.operatorUid) : options.longs === Number ? new $util.LongBits(message.operatorUid.low >>> 0, message.operatorUid.high >>> 0).toNumber(true) : message.operatorUid;
                if (message.operatorUin != null && message.hasOwnProperty("operatorUin"))
                    if (typeof message.operatorUin === "number")
                        object.operatorUin = options.longs === String ? String(message.operatorUin) : message.operatorUin;
                    else
                        object.operatorUin = options.longs === String ? $util.Long.prototype.toString.call(message.operatorUin) : options.longs === Number ? new $util.LongBits(message.operatorUin.low >>> 0, message.operatorUin.high >>> 0).toNumber(true) : message.operatorUin;
                if (message.operatorNick != null && message.hasOwnProperty("operatorNick"))
                    object.operatorNick = message.operatorNick;
                if (message.operationTime != null && message.hasOwnProperty("operationTime"))
                    object.operationTime = message.operationTime;
                if (message.messageTime != null && message.hasOwnProperty("messageTime"))
                    object.messageTime = message.messageTime;
                if (message.messageId != null && message.hasOwnProperty("messageId"))
                    object.messageId = message.messageId;
                if (message.messageSeq != null && message.hasOwnProperty("messageSeq"))
                    if (typeof message.messageSeq === "number")
                        object.messageSeq = options.longs === String ? String(message.messageSeq) : message.messageSeq;
                    else
                        object.messageSeq = options.longs === String ? $util.Long.prototype.toString.call(message.messageSeq) : options.longs === Number ? new $util.LongBits(message.messageSeq.low >>> 0, message.messageSeq.high >>> 0).toNumber(true) : message.messageSeq;
                if (message.jsonElements != null && message.hasOwnProperty("jsonElements"))
                    object.jsonElements = message.jsonElements;
                return object;
            };

            /**
             * Converts this EssenceMessageBody to JSON.
             * @function toJSON
             * @memberof kritor.common.EssenceMessageBody
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            EssenceMessageBody.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for EssenceMessageBody
             * @function getTypeUrl
             * @memberof kritor.common.EssenceMessageBody
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            EssenceMessageBody.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.common.EssenceMessageBody";
            };

            return EssenceMessageBody;
        })();

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

        common.Element = (function() {

            /**
             * Properties of an Element.
             * @memberof kritor.common
             * @interface IElement
             * @property {kritor.common.Element.ElementType|null} [type] Element type
             * @property {kritor.common.ITextElement|null} [text] Element text
             * @property {kritor.common.IAtElement|null} [at] Element at
             * @property {kritor.common.IFaceElement|null} [face] Element face
             * @property {kritor.common.IBubbleFaceElement|null} [bubbleFace] Element bubbleFace
             * @property {kritor.common.IReplyElement|null} [reply] Element reply
             * @property {kritor.common.IImageElement|null} [image] Element image
             * @property {kritor.common.IVoiceElement|null} [voice] Element voice
             * @property {kritor.common.IVideoElement|null} [video] Element video
             * @property {kritor.common.IBasketballElement|null} [basketball] Element basketball
             * @property {kritor.common.IDiceElement|null} [dice] Element dice
             * @property {kritor.common.IRpsElement|null} [rps] Element rps
             * @property {kritor.common.IPokeElement|null} [poke] Element poke
             * @property {kritor.common.IMusicElement|null} [music] Element music
             * @property {kritor.common.IWeatherElement|null} [weather] Element weather
             * @property {kritor.common.ILocationElement|null} [location] Element location
             * @property {kritor.common.IShareElement|null} [share] Element share
             * @property {kritor.common.IGiftElement|null} [gift] Element gift
             * @property {kritor.common.IMarketFaceElement|null} [marketFace] Element marketFace
             * @property {kritor.common.IForwardElement|null} [forward] Element forward
             * @property {kritor.common.IContactElement|null} [contact] Element contact
             * @property {kritor.common.IJsonElement|null} [json] Element json
             * @property {kritor.common.IXmlElement|null} [xml] Element xml
             * @property {kritor.common.IFileElement|null} [file] Element file
             * @property {kritor.common.IMarkdownElement|null} [markdown] Element markdown
             * @property {kritor.common.IKeyboardElement|null} [keyboard] Element keyboard
             */

            /**
             * Constructs a new Element.
             * @memberof kritor.common
             * @classdesc Represents an Element.
             * @implements IElement
             * @constructor
             * @param {kritor.common.IElement=} [properties] Properties to set
             */
            function Element(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Element type.
             * @member {kritor.common.Element.ElementType} type
             * @memberof kritor.common.Element
             * @instance
             */
            Element.prototype.type = 0;

            /**
             * Element text.
             * @member {kritor.common.ITextElement|null|undefined} text
             * @memberof kritor.common.Element
             * @instance
             */
            Element.prototype.text = null;

            /**
             * Element at.
             * @member {kritor.common.IAtElement|null|undefined} at
             * @memberof kritor.common.Element
             * @instance
             */
            Element.prototype.at = null;

            /**
             * Element face.
             * @member {kritor.common.IFaceElement|null|undefined} face
             * @memberof kritor.common.Element
             * @instance
             */
            Element.prototype.face = null;

            /**
             * Element bubbleFace.
             * @member {kritor.common.IBubbleFaceElement|null|undefined} bubbleFace
             * @memberof kritor.common.Element
             * @instance
             */
            Element.prototype.bubbleFace = null;

            /**
             * Element reply.
             * @member {kritor.common.IReplyElement|null|undefined} reply
             * @memberof kritor.common.Element
             * @instance
             */
            Element.prototype.reply = null;

            /**
             * Element image.
             * @member {kritor.common.IImageElement|null|undefined} image
             * @memberof kritor.common.Element
             * @instance
             */
            Element.prototype.image = null;

            /**
             * Element voice.
             * @member {kritor.common.IVoiceElement|null|undefined} voice
             * @memberof kritor.common.Element
             * @instance
             */
            Element.prototype.voice = null;

            /**
             * Element video.
             * @member {kritor.common.IVideoElement|null|undefined} video
             * @memberof kritor.common.Element
             * @instance
             */
            Element.prototype.video = null;

            /**
             * Element basketball.
             * @member {kritor.common.IBasketballElement|null|undefined} basketball
             * @memberof kritor.common.Element
             * @instance
             */
            Element.prototype.basketball = null;

            /**
             * Element dice.
             * @member {kritor.common.IDiceElement|null|undefined} dice
             * @memberof kritor.common.Element
             * @instance
             */
            Element.prototype.dice = null;

            /**
             * Element rps.
             * @member {kritor.common.IRpsElement|null|undefined} rps
             * @memberof kritor.common.Element
             * @instance
             */
            Element.prototype.rps = null;

            /**
             * Element poke.
             * @member {kritor.common.IPokeElement|null|undefined} poke
             * @memberof kritor.common.Element
             * @instance
             */
            Element.prototype.poke = null;

            /**
             * Element music.
             * @member {kritor.common.IMusicElement|null|undefined} music
             * @memberof kritor.common.Element
             * @instance
             */
            Element.prototype.music = null;

            /**
             * Element weather.
             * @member {kritor.common.IWeatherElement|null|undefined} weather
             * @memberof kritor.common.Element
             * @instance
             */
            Element.prototype.weather = null;

            /**
             * Element location.
             * @member {kritor.common.ILocationElement|null|undefined} location
             * @memberof kritor.common.Element
             * @instance
             */
            Element.prototype.location = null;

            /**
             * Element share.
             * @member {kritor.common.IShareElement|null|undefined} share
             * @memberof kritor.common.Element
             * @instance
             */
            Element.prototype.share = null;

            /**
             * Element gift.
             * @member {kritor.common.IGiftElement|null|undefined} gift
             * @memberof kritor.common.Element
             * @instance
             */
            Element.prototype.gift = null;

            /**
             * Element marketFace.
             * @member {kritor.common.IMarketFaceElement|null|undefined} marketFace
             * @memberof kritor.common.Element
             * @instance
             */
            Element.prototype.marketFace = null;

            /**
             * Element forward.
             * @member {kritor.common.IForwardElement|null|undefined} forward
             * @memberof kritor.common.Element
             * @instance
             */
            Element.prototype.forward = null;

            /**
             * Element contact.
             * @member {kritor.common.IContactElement|null|undefined} contact
             * @memberof kritor.common.Element
             * @instance
             */
            Element.prototype.contact = null;

            /**
             * Element json.
             * @member {kritor.common.IJsonElement|null|undefined} json
             * @memberof kritor.common.Element
             * @instance
             */
            Element.prototype.json = null;

            /**
             * Element xml.
             * @member {kritor.common.IXmlElement|null|undefined} xml
             * @memberof kritor.common.Element
             * @instance
             */
            Element.prototype.xml = null;

            /**
             * Element file.
             * @member {kritor.common.IFileElement|null|undefined} file
             * @memberof kritor.common.Element
             * @instance
             */
            Element.prototype.file = null;

            /**
             * Element markdown.
             * @member {kritor.common.IMarkdownElement|null|undefined} markdown
             * @memberof kritor.common.Element
             * @instance
             */
            Element.prototype.markdown = null;

            /**
             * Element keyboard.
             * @member {kritor.common.IKeyboardElement|null|undefined} keyboard
             * @memberof kritor.common.Element
             * @instance
             */
            Element.prototype.keyboard = null;

            // OneOf field names bound to virtual getters and setters
            let $oneOfFields;

            /**
             * Element data.
             * @member {"text"|"at"|"face"|"bubbleFace"|"reply"|"image"|"voice"|"video"|"basketball"|"dice"|"rps"|"poke"|"music"|"weather"|"location"|"share"|"gift"|"marketFace"|"forward"|"contact"|"json"|"xml"|"file"|"markdown"|"keyboard"|undefined} data
             * @memberof kritor.common.Element
             * @instance
             */
            Object.defineProperty(Element.prototype, "data", {
                get: $util.oneOfGetter($oneOfFields = ["text", "at", "face", "bubbleFace", "reply", "image", "voice", "video", "basketball", "dice", "rps", "poke", "music", "weather", "location", "share", "gift", "marketFace", "forward", "contact", "json", "xml", "file", "markdown", "keyboard"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new Element instance using the specified properties.
             * @function create
             * @memberof kritor.common.Element
             * @static
             * @param {kritor.common.IElement=} [properties] Properties to set
             * @returns {kritor.common.Element} Element instance
             */
            Element.create = function create(properties) {
                return new Element(properties);
            };

            /**
             * Encodes the specified Element message. Does not implicitly {@link kritor.common.Element.verify|verify} messages.
             * @function encode
             * @memberof kritor.common.Element
             * @static
             * @param {kritor.common.IElement} message Element message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Element.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int32(message.type);
                if (message.text != null && Object.hasOwnProperty.call(message, "text"))
                    $root.kritor.common.TextElement.encode(message.text, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                if (message.at != null && Object.hasOwnProperty.call(message, "at"))
                    $root.kritor.common.AtElement.encode(message.at, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                if (message.face != null && Object.hasOwnProperty.call(message, "face"))
                    $root.kritor.common.FaceElement.encode(message.face, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                if (message.bubbleFace != null && Object.hasOwnProperty.call(message, "bubbleFace"))
                    $root.kritor.common.BubbleFaceElement.encode(message.bubbleFace, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
                if (message.reply != null && Object.hasOwnProperty.call(message, "reply"))
                    $root.kritor.common.ReplyElement.encode(message.reply, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
                if (message.image != null && Object.hasOwnProperty.call(message, "image"))
                    $root.kritor.common.ImageElement.encode(message.image, writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
                if (message.voice != null && Object.hasOwnProperty.call(message, "voice"))
                    $root.kritor.common.VoiceElement.encode(message.voice, writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
                if (message.video != null && Object.hasOwnProperty.call(message, "video"))
                    $root.kritor.common.VideoElement.encode(message.video, writer.uint32(/* id 9, wireType 2 =*/74).fork()).ldelim();
                if (message.basketball != null && Object.hasOwnProperty.call(message, "basketball"))
                    $root.kritor.common.BasketballElement.encode(message.basketball, writer.uint32(/* id 10, wireType 2 =*/82).fork()).ldelim();
                if (message.dice != null && Object.hasOwnProperty.call(message, "dice"))
                    $root.kritor.common.DiceElement.encode(message.dice, writer.uint32(/* id 11, wireType 2 =*/90).fork()).ldelim();
                if (message.rps != null && Object.hasOwnProperty.call(message, "rps"))
                    $root.kritor.common.RpsElement.encode(message.rps, writer.uint32(/* id 12, wireType 2 =*/98).fork()).ldelim();
                if (message.poke != null && Object.hasOwnProperty.call(message, "poke"))
                    $root.kritor.common.PokeElement.encode(message.poke, writer.uint32(/* id 13, wireType 2 =*/106).fork()).ldelim();
                if (message.music != null && Object.hasOwnProperty.call(message, "music"))
                    $root.kritor.common.MusicElement.encode(message.music, writer.uint32(/* id 14, wireType 2 =*/114).fork()).ldelim();
                if (message.weather != null && Object.hasOwnProperty.call(message, "weather"))
                    $root.kritor.common.WeatherElement.encode(message.weather, writer.uint32(/* id 15, wireType 2 =*/122).fork()).ldelim();
                if (message.location != null && Object.hasOwnProperty.call(message, "location"))
                    $root.kritor.common.LocationElement.encode(message.location, writer.uint32(/* id 16, wireType 2 =*/130).fork()).ldelim();
                if (message.share != null && Object.hasOwnProperty.call(message, "share"))
                    $root.kritor.common.ShareElement.encode(message.share, writer.uint32(/* id 17, wireType 2 =*/138).fork()).ldelim();
                if (message.gift != null && Object.hasOwnProperty.call(message, "gift"))
                    $root.kritor.common.GiftElement.encode(message.gift, writer.uint32(/* id 18, wireType 2 =*/146).fork()).ldelim();
                if (message.marketFace != null && Object.hasOwnProperty.call(message, "marketFace"))
                    $root.kritor.common.MarketFaceElement.encode(message.marketFace, writer.uint32(/* id 19, wireType 2 =*/154).fork()).ldelim();
                if (message.forward != null && Object.hasOwnProperty.call(message, "forward"))
                    $root.kritor.common.ForwardElement.encode(message.forward, writer.uint32(/* id 20, wireType 2 =*/162).fork()).ldelim();
                if (message.contact != null && Object.hasOwnProperty.call(message, "contact"))
                    $root.kritor.common.ContactElement.encode(message.contact, writer.uint32(/* id 21, wireType 2 =*/170).fork()).ldelim();
                if (message.json != null && Object.hasOwnProperty.call(message, "json"))
                    $root.kritor.common.JsonElement.encode(message.json, writer.uint32(/* id 22, wireType 2 =*/178).fork()).ldelim();
                if (message.xml != null && Object.hasOwnProperty.call(message, "xml"))
                    $root.kritor.common.XmlElement.encode(message.xml, writer.uint32(/* id 23, wireType 2 =*/186).fork()).ldelim();
                if (message.file != null && Object.hasOwnProperty.call(message, "file"))
                    $root.kritor.common.FileElement.encode(message.file, writer.uint32(/* id 24, wireType 2 =*/194).fork()).ldelim();
                if (message.markdown != null && Object.hasOwnProperty.call(message, "markdown"))
                    $root.kritor.common.MarkdownElement.encode(message.markdown, writer.uint32(/* id 25, wireType 2 =*/202).fork()).ldelim();
                if (message.keyboard != null && Object.hasOwnProperty.call(message, "keyboard"))
                    $root.kritor.common.KeyboardElement.encode(message.keyboard, writer.uint32(/* id 26, wireType 2 =*/210).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified Element message, length delimited. Does not implicitly {@link kritor.common.Element.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.common.Element
             * @static
             * @param {kritor.common.IElement} message Element message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Element.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an Element message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.common.Element
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.common.Element} Element
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Element.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.common.Element();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.type = reader.int32();
                            break;
                        }
                    case 2: {
                            message.text = $root.kritor.common.TextElement.decode(reader, reader.uint32());
                            break;
                        }
                    case 3: {
                            message.at = $root.kritor.common.AtElement.decode(reader, reader.uint32());
                            break;
                        }
                    case 4: {
                            message.face = $root.kritor.common.FaceElement.decode(reader, reader.uint32());
                            break;
                        }
                    case 5: {
                            message.bubbleFace = $root.kritor.common.BubbleFaceElement.decode(reader, reader.uint32());
                            break;
                        }
                    case 6: {
                            message.reply = $root.kritor.common.ReplyElement.decode(reader, reader.uint32());
                            break;
                        }
                    case 7: {
                            message.image = $root.kritor.common.ImageElement.decode(reader, reader.uint32());
                            break;
                        }
                    case 8: {
                            message.voice = $root.kritor.common.VoiceElement.decode(reader, reader.uint32());
                            break;
                        }
                    case 9: {
                            message.video = $root.kritor.common.VideoElement.decode(reader, reader.uint32());
                            break;
                        }
                    case 10: {
                            message.basketball = $root.kritor.common.BasketballElement.decode(reader, reader.uint32());
                            break;
                        }
                    case 11: {
                            message.dice = $root.kritor.common.DiceElement.decode(reader, reader.uint32());
                            break;
                        }
                    case 12: {
                            message.rps = $root.kritor.common.RpsElement.decode(reader, reader.uint32());
                            break;
                        }
                    case 13: {
                            message.poke = $root.kritor.common.PokeElement.decode(reader, reader.uint32());
                            break;
                        }
                    case 14: {
                            message.music = $root.kritor.common.MusicElement.decode(reader, reader.uint32());
                            break;
                        }
                    case 15: {
                            message.weather = $root.kritor.common.WeatherElement.decode(reader, reader.uint32());
                            break;
                        }
                    case 16: {
                            message.location = $root.kritor.common.LocationElement.decode(reader, reader.uint32());
                            break;
                        }
                    case 17: {
                            message.share = $root.kritor.common.ShareElement.decode(reader, reader.uint32());
                            break;
                        }
                    case 18: {
                            message.gift = $root.kritor.common.GiftElement.decode(reader, reader.uint32());
                            break;
                        }
                    case 19: {
                            message.marketFace = $root.kritor.common.MarketFaceElement.decode(reader, reader.uint32());
                            break;
                        }
                    case 20: {
                            message.forward = $root.kritor.common.ForwardElement.decode(reader, reader.uint32());
                            break;
                        }
                    case 21: {
                            message.contact = $root.kritor.common.ContactElement.decode(reader, reader.uint32());
                            break;
                        }
                    case 22: {
                            message.json = $root.kritor.common.JsonElement.decode(reader, reader.uint32());
                            break;
                        }
                    case 23: {
                            message.xml = $root.kritor.common.XmlElement.decode(reader, reader.uint32());
                            break;
                        }
                    case 24: {
                            message.file = $root.kritor.common.FileElement.decode(reader, reader.uint32());
                            break;
                        }
                    case 25: {
                            message.markdown = $root.kritor.common.MarkdownElement.decode(reader, reader.uint32());
                            break;
                        }
                    case 26: {
                            message.keyboard = $root.kritor.common.KeyboardElement.decode(reader, reader.uint32());
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
             * Decodes an Element message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.common.Element
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.common.Element} Element
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Element.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an Element message.
             * @function verify
             * @memberof kritor.common.Element
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Element.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                let properties = {};
                if (message.type != null && message.hasOwnProperty("type"))
                    switch (message.type) {
                    default:
                        return "type: enum value expected";
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                    case 6:
                    case 7:
                    case 8:
                    case 9:
                    case 10:
                    case 11:
                    case 12:
                    case 13:
                    case 14:
                    case 15:
                    case 16:
                    case 17:
                    case 18:
                    case 19:
                    case 20:
                    case 21:
                    case 22:
                    case 23:
                    case 24:
                        break;
                    }
                if (message.text != null && message.hasOwnProperty("text")) {
                    properties.data = 1;
                    {
                        let error = $root.kritor.common.TextElement.verify(message.text);
                        if (error)
                            return "text." + error;
                    }
                }
                if (message.at != null && message.hasOwnProperty("at")) {
                    if (properties.data === 1)
                        return "data: multiple values";
                    properties.data = 1;
                    {
                        let error = $root.kritor.common.AtElement.verify(message.at);
                        if (error)
                            return "at." + error;
                    }
                }
                if (message.face != null && message.hasOwnProperty("face")) {
                    if (properties.data === 1)
                        return "data: multiple values";
                    properties.data = 1;
                    {
                        let error = $root.kritor.common.FaceElement.verify(message.face);
                        if (error)
                            return "face." + error;
                    }
                }
                if (message.bubbleFace != null && message.hasOwnProperty("bubbleFace")) {
                    if (properties.data === 1)
                        return "data: multiple values";
                    properties.data = 1;
                    {
                        let error = $root.kritor.common.BubbleFaceElement.verify(message.bubbleFace);
                        if (error)
                            return "bubbleFace." + error;
                    }
                }
                if (message.reply != null && message.hasOwnProperty("reply")) {
                    if (properties.data === 1)
                        return "data: multiple values";
                    properties.data = 1;
                    {
                        let error = $root.kritor.common.ReplyElement.verify(message.reply);
                        if (error)
                            return "reply." + error;
                    }
                }
                if (message.image != null && message.hasOwnProperty("image")) {
                    if (properties.data === 1)
                        return "data: multiple values";
                    properties.data = 1;
                    {
                        let error = $root.kritor.common.ImageElement.verify(message.image);
                        if (error)
                            return "image." + error;
                    }
                }
                if (message.voice != null && message.hasOwnProperty("voice")) {
                    if (properties.data === 1)
                        return "data: multiple values";
                    properties.data = 1;
                    {
                        let error = $root.kritor.common.VoiceElement.verify(message.voice);
                        if (error)
                            return "voice." + error;
                    }
                }
                if (message.video != null && message.hasOwnProperty("video")) {
                    if (properties.data === 1)
                        return "data: multiple values";
                    properties.data = 1;
                    {
                        let error = $root.kritor.common.VideoElement.verify(message.video);
                        if (error)
                            return "video." + error;
                    }
                }
                if (message.basketball != null && message.hasOwnProperty("basketball")) {
                    if (properties.data === 1)
                        return "data: multiple values";
                    properties.data = 1;
                    {
                        let error = $root.kritor.common.BasketballElement.verify(message.basketball);
                        if (error)
                            return "basketball." + error;
                    }
                }
                if (message.dice != null && message.hasOwnProperty("dice")) {
                    if (properties.data === 1)
                        return "data: multiple values";
                    properties.data = 1;
                    {
                        let error = $root.kritor.common.DiceElement.verify(message.dice);
                        if (error)
                            return "dice." + error;
                    }
                }
                if (message.rps != null && message.hasOwnProperty("rps")) {
                    if (properties.data === 1)
                        return "data: multiple values";
                    properties.data = 1;
                    {
                        let error = $root.kritor.common.RpsElement.verify(message.rps);
                        if (error)
                            return "rps." + error;
                    }
                }
                if (message.poke != null && message.hasOwnProperty("poke")) {
                    if (properties.data === 1)
                        return "data: multiple values";
                    properties.data = 1;
                    {
                        let error = $root.kritor.common.PokeElement.verify(message.poke);
                        if (error)
                            return "poke." + error;
                    }
                }
                if (message.music != null && message.hasOwnProperty("music")) {
                    if (properties.data === 1)
                        return "data: multiple values";
                    properties.data = 1;
                    {
                        let error = $root.kritor.common.MusicElement.verify(message.music);
                        if (error)
                            return "music." + error;
                    }
                }
                if (message.weather != null && message.hasOwnProperty("weather")) {
                    if (properties.data === 1)
                        return "data: multiple values";
                    properties.data = 1;
                    {
                        let error = $root.kritor.common.WeatherElement.verify(message.weather);
                        if (error)
                            return "weather." + error;
                    }
                }
                if (message.location != null && message.hasOwnProperty("location")) {
                    if (properties.data === 1)
                        return "data: multiple values";
                    properties.data = 1;
                    {
                        let error = $root.kritor.common.LocationElement.verify(message.location);
                        if (error)
                            return "location." + error;
                    }
                }
                if (message.share != null && message.hasOwnProperty("share")) {
                    if (properties.data === 1)
                        return "data: multiple values";
                    properties.data = 1;
                    {
                        let error = $root.kritor.common.ShareElement.verify(message.share);
                        if (error)
                            return "share." + error;
                    }
                }
                if (message.gift != null && message.hasOwnProperty("gift")) {
                    if (properties.data === 1)
                        return "data: multiple values";
                    properties.data = 1;
                    {
                        let error = $root.kritor.common.GiftElement.verify(message.gift);
                        if (error)
                            return "gift." + error;
                    }
                }
                if (message.marketFace != null && message.hasOwnProperty("marketFace")) {
                    if (properties.data === 1)
                        return "data: multiple values";
                    properties.data = 1;
                    {
                        let error = $root.kritor.common.MarketFaceElement.verify(message.marketFace);
                        if (error)
                            return "marketFace." + error;
                    }
                }
                if (message.forward != null && message.hasOwnProperty("forward")) {
                    if (properties.data === 1)
                        return "data: multiple values";
                    properties.data = 1;
                    {
                        let error = $root.kritor.common.ForwardElement.verify(message.forward);
                        if (error)
                            return "forward." + error;
                    }
                }
                if (message.contact != null && message.hasOwnProperty("contact")) {
                    if (properties.data === 1)
                        return "data: multiple values";
                    properties.data = 1;
                    {
                        let error = $root.kritor.common.ContactElement.verify(message.contact);
                        if (error)
                            return "contact." + error;
                    }
                }
                if (message.json != null && message.hasOwnProperty("json")) {
                    if (properties.data === 1)
                        return "data: multiple values";
                    properties.data = 1;
                    {
                        let error = $root.kritor.common.JsonElement.verify(message.json);
                        if (error)
                            return "json." + error;
                    }
                }
                if (message.xml != null && message.hasOwnProperty("xml")) {
                    if (properties.data === 1)
                        return "data: multiple values";
                    properties.data = 1;
                    {
                        let error = $root.kritor.common.XmlElement.verify(message.xml);
                        if (error)
                            return "xml." + error;
                    }
                }
                if (message.file != null && message.hasOwnProperty("file")) {
                    if (properties.data === 1)
                        return "data: multiple values";
                    properties.data = 1;
                    {
                        let error = $root.kritor.common.FileElement.verify(message.file);
                        if (error)
                            return "file." + error;
                    }
                }
                if (message.markdown != null && message.hasOwnProperty("markdown")) {
                    if (properties.data === 1)
                        return "data: multiple values";
                    properties.data = 1;
                    {
                        let error = $root.kritor.common.MarkdownElement.verify(message.markdown);
                        if (error)
                            return "markdown." + error;
                    }
                }
                if (message.keyboard != null && message.hasOwnProperty("keyboard")) {
                    if (properties.data === 1)
                        return "data: multiple values";
                    properties.data = 1;
                    {
                        let error = $root.kritor.common.KeyboardElement.verify(message.keyboard);
                        if (error)
                            return "keyboard." + error;
                    }
                }
                return null;
            };

            /**
             * Creates an Element message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.common.Element
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.common.Element} Element
             */
            Element.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.common.Element)
                    return object;
                let message = new $root.kritor.common.Element();
                switch (object.type) {
                default:
                    if (typeof object.type === "number") {
                        message.type = object.type;
                        break;
                    }
                    break;
                case "TEXT":
                case 0:
                    message.type = 0;
                    break;
                case "AT":
                case 1:
                    message.type = 1;
                    break;
                case "FACE":
                case 2:
                    message.type = 2;
                    break;
                case "BUBBLE_FACE":
                case 3:
                    message.type = 3;
                    break;
                case "REPLY":
                case 4:
                    message.type = 4;
                    break;
                case "IMAGE":
                case 5:
                    message.type = 5;
                    break;
                case "VOICE":
                case 6:
                    message.type = 6;
                    break;
                case "VIDEO":
                case 7:
                    message.type = 7;
                    break;
                case "BASKETBALL":
                case 8:
                    message.type = 8;
                    break;
                case "DICE":
                case 9:
                    message.type = 9;
                    break;
                case "RPS":
                case 10:
                    message.type = 10;
                    break;
                case "POKE":
                case 11:
                    message.type = 11;
                    break;
                case "MUSIC":
                case 12:
                    message.type = 12;
                    break;
                case "WEATHER":
                case 13:
                    message.type = 13;
                    break;
                case "LOCATION":
                case 14:
                    message.type = 14;
                    break;
                case "SHARE":
                case 15:
                    message.type = 15;
                    break;
                case "GIFT":
                case 16:
                    message.type = 16;
                    break;
                case "MARKET_FACE":
                case 17:
                    message.type = 17;
                    break;
                case "FORWARD":
                case 18:
                    message.type = 18;
                    break;
                case "CONTACT":
                case 19:
                    message.type = 19;
                    break;
                case "JSON":
                case 20:
                    message.type = 20;
                    break;
                case "XML":
                case 21:
                    message.type = 21;
                    break;
                case "FILE":
                case 22:
                    message.type = 22;
                    break;
                case "MARKDOWN":
                case 23:
                    message.type = 23;
                    break;
                case "KEYBOARD":
                case 24:
                    message.type = 24;
                    break;
                }
                if (object.text != null) {
                    if (typeof object.text !== "object")
                        throw TypeError(".kritor.common.Element.text: object expected");
                    message.text = $root.kritor.common.TextElement.fromObject(object.text);
                }
                if (object.at != null) {
                    if (typeof object.at !== "object")
                        throw TypeError(".kritor.common.Element.at: object expected");
                    message.at = $root.kritor.common.AtElement.fromObject(object.at);
                }
                if (object.face != null) {
                    if (typeof object.face !== "object")
                        throw TypeError(".kritor.common.Element.face: object expected");
                    message.face = $root.kritor.common.FaceElement.fromObject(object.face);
                }
                if (object.bubbleFace != null) {
                    if (typeof object.bubbleFace !== "object")
                        throw TypeError(".kritor.common.Element.bubbleFace: object expected");
                    message.bubbleFace = $root.kritor.common.BubbleFaceElement.fromObject(object.bubbleFace);
                }
                if (object.reply != null) {
                    if (typeof object.reply !== "object")
                        throw TypeError(".kritor.common.Element.reply: object expected");
                    message.reply = $root.kritor.common.ReplyElement.fromObject(object.reply);
                }
                if (object.image != null) {
                    if (typeof object.image !== "object")
                        throw TypeError(".kritor.common.Element.image: object expected");
                    message.image = $root.kritor.common.ImageElement.fromObject(object.image);
                }
                if (object.voice != null) {
                    if (typeof object.voice !== "object")
                        throw TypeError(".kritor.common.Element.voice: object expected");
                    message.voice = $root.kritor.common.VoiceElement.fromObject(object.voice);
                }
                if (object.video != null) {
                    if (typeof object.video !== "object")
                        throw TypeError(".kritor.common.Element.video: object expected");
                    message.video = $root.kritor.common.VideoElement.fromObject(object.video);
                }
                if (object.basketball != null) {
                    if (typeof object.basketball !== "object")
                        throw TypeError(".kritor.common.Element.basketball: object expected");
                    message.basketball = $root.kritor.common.BasketballElement.fromObject(object.basketball);
                }
                if (object.dice != null) {
                    if (typeof object.dice !== "object")
                        throw TypeError(".kritor.common.Element.dice: object expected");
                    message.dice = $root.kritor.common.DiceElement.fromObject(object.dice);
                }
                if (object.rps != null) {
                    if (typeof object.rps !== "object")
                        throw TypeError(".kritor.common.Element.rps: object expected");
                    message.rps = $root.kritor.common.RpsElement.fromObject(object.rps);
                }
                if (object.poke != null) {
                    if (typeof object.poke !== "object")
                        throw TypeError(".kritor.common.Element.poke: object expected");
                    message.poke = $root.kritor.common.PokeElement.fromObject(object.poke);
                }
                if (object.music != null) {
                    if (typeof object.music !== "object")
                        throw TypeError(".kritor.common.Element.music: object expected");
                    message.music = $root.kritor.common.MusicElement.fromObject(object.music);
                }
                if (object.weather != null) {
                    if (typeof object.weather !== "object")
                        throw TypeError(".kritor.common.Element.weather: object expected");
                    message.weather = $root.kritor.common.WeatherElement.fromObject(object.weather);
                }
                if (object.location != null) {
                    if (typeof object.location !== "object")
                        throw TypeError(".kritor.common.Element.location: object expected");
                    message.location = $root.kritor.common.LocationElement.fromObject(object.location);
                }
                if (object.share != null) {
                    if (typeof object.share !== "object")
                        throw TypeError(".kritor.common.Element.share: object expected");
                    message.share = $root.kritor.common.ShareElement.fromObject(object.share);
                }
                if (object.gift != null) {
                    if (typeof object.gift !== "object")
                        throw TypeError(".kritor.common.Element.gift: object expected");
                    message.gift = $root.kritor.common.GiftElement.fromObject(object.gift);
                }
                if (object.marketFace != null) {
                    if (typeof object.marketFace !== "object")
                        throw TypeError(".kritor.common.Element.marketFace: object expected");
                    message.marketFace = $root.kritor.common.MarketFaceElement.fromObject(object.marketFace);
                }
                if (object.forward != null) {
                    if (typeof object.forward !== "object")
                        throw TypeError(".kritor.common.Element.forward: object expected");
                    message.forward = $root.kritor.common.ForwardElement.fromObject(object.forward);
                }
                if (object.contact != null) {
                    if (typeof object.contact !== "object")
                        throw TypeError(".kritor.common.Element.contact: object expected");
                    message.contact = $root.kritor.common.ContactElement.fromObject(object.contact);
                }
                if (object.json != null) {
                    if (typeof object.json !== "object")
                        throw TypeError(".kritor.common.Element.json: object expected");
                    message.json = $root.kritor.common.JsonElement.fromObject(object.json);
                }
                if (object.xml != null) {
                    if (typeof object.xml !== "object")
                        throw TypeError(".kritor.common.Element.xml: object expected");
                    message.xml = $root.kritor.common.XmlElement.fromObject(object.xml);
                }
                if (object.file != null) {
                    if (typeof object.file !== "object")
                        throw TypeError(".kritor.common.Element.file: object expected");
                    message.file = $root.kritor.common.FileElement.fromObject(object.file);
                }
                if (object.markdown != null) {
                    if (typeof object.markdown !== "object")
                        throw TypeError(".kritor.common.Element.markdown: object expected");
                    message.markdown = $root.kritor.common.MarkdownElement.fromObject(object.markdown);
                }
                if (object.keyboard != null) {
                    if (typeof object.keyboard !== "object")
                        throw TypeError(".kritor.common.Element.keyboard: object expected");
                    message.keyboard = $root.kritor.common.KeyboardElement.fromObject(object.keyboard);
                }
                return message;
            };

            /**
             * Creates a plain object from an Element message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.common.Element
             * @static
             * @param {kritor.common.Element} message Element
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Element.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults)
                    object.type = options.enums === String ? "TEXT" : 0;
                if (message.type != null && message.hasOwnProperty("type"))
                    object.type = options.enums === String ? $root.kritor.common.Element.ElementType[message.type] === undefined ? message.type : $root.kritor.common.Element.ElementType[message.type] : message.type;
                if (message.text != null && message.hasOwnProperty("text")) {
                    object.text = $root.kritor.common.TextElement.toObject(message.text, options);
                    if (options.oneofs)
                        object.data = "text";
                }
                if (message.at != null && message.hasOwnProperty("at")) {
                    object.at = $root.kritor.common.AtElement.toObject(message.at, options);
                    if (options.oneofs)
                        object.data = "at";
                }
                if (message.face != null && message.hasOwnProperty("face")) {
                    object.face = $root.kritor.common.FaceElement.toObject(message.face, options);
                    if (options.oneofs)
                        object.data = "face";
                }
                if (message.bubbleFace != null && message.hasOwnProperty("bubbleFace")) {
                    object.bubbleFace = $root.kritor.common.BubbleFaceElement.toObject(message.bubbleFace, options);
                    if (options.oneofs)
                        object.data = "bubbleFace";
                }
                if (message.reply != null && message.hasOwnProperty("reply")) {
                    object.reply = $root.kritor.common.ReplyElement.toObject(message.reply, options);
                    if (options.oneofs)
                        object.data = "reply";
                }
                if (message.image != null && message.hasOwnProperty("image")) {
                    object.image = $root.kritor.common.ImageElement.toObject(message.image, options);
                    if (options.oneofs)
                        object.data = "image";
                }
                if (message.voice != null && message.hasOwnProperty("voice")) {
                    object.voice = $root.kritor.common.VoiceElement.toObject(message.voice, options);
                    if (options.oneofs)
                        object.data = "voice";
                }
                if (message.video != null && message.hasOwnProperty("video")) {
                    object.video = $root.kritor.common.VideoElement.toObject(message.video, options);
                    if (options.oneofs)
                        object.data = "video";
                }
                if (message.basketball != null && message.hasOwnProperty("basketball")) {
                    object.basketball = $root.kritor.common.BasketballElement.toObject(message.basketball, options);
                    if (options.oneofs)
                        object.data = "basketball";
                }
                if (message.dice != null && message.hasOwnProperty("dice")) {
                    object.dice = $root.kritor.common.DiceElement.toObject(message.dice, options);
                    if (options.oneofs)
                        object.data = "dice";
                }
                if (message.rps != null && message.hasOwnProperty("rps")) {
                    object.rps = $root.kritor.common.RpsElement.toObject(message.rps, options);
                    if (options.oneofs)
                        object.data = "rps";
                }
                if (message.poke != null && message.hasOwnProperty("poke")) {
                    object.poke = $root.kritor.common.PokeElement.toObject(message.poke, options);
                    if (options.oneofs)
                        object.data = "poke";
                }
                if (message.music != null && message.hasOwnProperty("music")) {
                    object.music = $root.kritor.common.MusicElement.toObject(message.music, options);
                    if (options.oneofs)
                        object.data = "music";
                }
                if (message.weather != null && message.hasOwnProperty("weather")) {
                    object.weather = $root.kritor.common.WeatherElement.toObject(message.weather, options);
                    if (options.oneofs)
                        object.data = "weather";
                }
                if (message.location != null && message.hasOwnProperty("location")) {
                    object.location = $root.kritor.common.LocationElement.toObject(message.location, options);
                    if (options.oneofs)
                        object.data = "location";
                }
                if (message.share != null && message.hasOwnProperty("share")) {
                    object.share = $root.kritor.common.ShareElement.toObject(message.share, options);
                    if (options.oneofs)
                        object.data = "share";
                }
                if (message.gift != null && message.hasOwnProperty("gift")) {
                    object.gift = $root.kritor.common.GiftElement.toObject(message.gift, options);
                    if (options.oneofs)
                        object.data = "gift";
                }
                if (message.marketFace != null && message.hasOwnProperty("marketFace")) {
                    object.marketFace = $root.kritor.common.MarketFaceElement.toObject(message.marketFace, options);
                    if (options.oneofs)
                        object.data = "marketFace";
                }
                if (message.forward != null && message.hasOwnProperty("forward")) {
                    object.forward = $root.kritor.common.ForwardElement.toObject(message.forward, options);
                    if (options.oneofs)
                        object.data = "forward";
                }
                if (message.contact != null && message.hasOwnProperty("contact")) {
                    object.contact = $root.kritor.common.ContactElement.toObject(message.contact, options);
                    if (options.oneofs)
                        object.data = "contact";
                }
                if (message.json != null && message.hasOwnProperty("json")) {
                    object.json = $root.kritor.common.JsonElement.toObject(message.json, options);
                    if (options.oneofs)
                        object.data = "json";
                }
                if (message.xml != null && message.hasOwnProperty("xml")) {
                    object.xml = $root.kritor.common.XmlElement.toObject(message.xml, options);
                    if (options.oneofs)
                        object.data = "xml";
                }
                if (message.file != null && message.hasOwnProperty("file")) {
                    object.file = $root.kritor.common.FileElement.toObject(message.file, options);
                    if (options.oneofs)
                        object.data = "file";
                }
                if (message.markdown != null && message.hasOwnProperty("markdown")) {
                    object.markdown = $root.kritor.common.MarkdownElement.toObject(message.markdown, options);
                    if (options.oneofs)
                        object.data = "markdown";
                }
                if (message.keyboard != null && message.hasOwnProperty("keyboard")) {
                    object.keyboard = $root.kritor.common.KeyboardElement.toObject(message.keyboard, options);
                    if (options.oneofs)
                        object.data = "keyboard";
                }
                return object;
            };

            /**
             * Converts this Element to JSON.
             * @function toJSON
             * @memberof kritor.common.Element
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Element.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for Element
             * @function getTypeUrl
             * @memberof kritor.common.Element
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            Element.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.common.Element";
            };

            /**
             * ElementType enum.
             * @name kritor.common.Element.ElementType
             * @enum {number}
             * @property {number} TEXT=0 TEXT value
             * @property {number} AT=1 AT value
             * @property {number} FACE=2 FACE value
             * @property {number} BUBBLE_FACE=3 BUBBLE_FACE value
             * @property {number} REPLY=4 REPLY value
             * @property {number} IMAGE=5 IMAGE value
             * @property {number} VOICE=6 VOICE value
             * @property {number} VIDEO=7 VIDEO value
             * @property {number} BASKETBALL=8 BASKETBALL value
             * @property {number} DICE=9 DICE value
             * @property {number} RPS=10 RPS value
             * @property {number} POKE=11 POKE value
             * @property {number} MUSIC=12 MUSIC value
             * @property {number} WEATHER=13 WEATHER value
             * @property {number} LOCATION=14 LOCATION value
             * @property {number} SHARE=15 SHARE value
             * @property {number} GIFT=16 GIFT value
             * @property {number} MARKET_FACE=17 MARKET_FACE value
             * @property {number} FORWARD=18 FORWARD value
             * @property {number} CONTACT=19 CONTACT value
             * @property {number} JSON=20 JSON value
             * @property {number} XML=21 XML value
             * @property {number} FILE=22 FILE value
             * @property {number} MARKDOWN=23 MARKDOWN value
             * @property {number} KEYBOARD=24 KEYBOARD value
             */
            Element.ElementType = (function() {
                const valuesById = {}, values = Object.create(valuesById);
                values[valuesById[0] = "TEXT"] = 0;
                values[valuesById[1] = "AT"] = 1;
                values[valuesById[2] = "FACE"] = 2;
                values[valuesById[3] = "BUBBLE_FACE"] = 3;
                values[valuesById[4] = "REPLY"] = 4;
                values[valuesById[5] = "IMAGE"] = 5;
                values[valuesById[6] = "VOICE"] = 6;
                values[valuesById[7] = "VIDEO"] = 7;
                values[valuesById[8] = "BASKETBALL"] = 8;
                values[valuesById[9] = "DICE"] = 9;
                values[valuesById[10] = "RPS"] = 10;
                values[valuesById[11] = "POKE"] = 11;
                values[valuesById[12] = "MUSIC"] = 12;
                values[valuesById[13] = "WEATHER"] = 13;
                values[valuesById[14] = "LOCATION"] = 14;
                values[valuesById[15] = "SHARE"] = 15;
                values[valuesById[16] = "GIFT"] = 16;
                values[valuesById[17] = "MARKET_FACE"] = 17;
                values[valuesById[18] = "FORWARD"] = 18;
                values[valuesById[19] = "CONTACT"] = 19;
                values[valuesById[20] = "JSON"] = 20;
                values[valuesById[21] = "XML"] = 21;
                values[valuesById[22] = "FILE"] = 22;
                values[valuesById[23] = "MARKDOWN"] = 23;
                values[valuesById[24] = "KEYBOARD"] = 24;
                return values;
            })();

            return Element;
        })();

        common.TextElement = (function() {

            /**
             * Properties of a TextElement.
             * @memberof kritor.common
             * @interface ITextElement
             * @property {string|null} [text] TextElement text
             */

            /**
             * Constructs a new TextElement.
             * @memberof kritor.common
             * @classdesc Represents a TextElement.
             * @implements ITextElement
             * @constructor
             * @param {kritor.common.ITextElement=} [properties] Properties to set
             */
            function TextElement(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * TextElement text.
             * @member {string} text
             * @memberof kritor.common.TextElement
             * @instance
             */
            TextElement.prototype.text = "";

            /**
             * Creates a new TextElement instance using the specified properties.
             * @function create
             * @memberof kritor.common.TextElement
             * @static
             * @param {kritor.common.ITextElement=} [properties] Properties to set
             * @returns {kritor.common.TextElement} TextElement instance
             */
            TextElement.create = function create(properties) {
                return new TextElement(properties);
            };

            /**
             * Encodes the specified TextElement message. Does not implicitly {@link kritor.common.TextElement.verify|verify} messages.
             * @function encode
             * @memberof kritor.common.TextElement
             * @static
             * @param {kritor.common.ITextElement} message TextElement message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            TextElement.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.text != null && Object.hasOwnProperty.call(message, "text"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.text);
                return writer;
            };

            /**
             * Encodes the specified TextElement message, length delimited. Does not implicitly {@link kritor.common.TextElement.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.common.TextElement
             * @static
             * @param {kritor.common.ITextElement} message TextElement message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            TextElement.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a TextElement message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.common.TextElement
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.common.TextElement} TextElement
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            TextElement.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.common.TextElement();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.text = reader.string();
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
             * Decodes a TextElement message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.common.TextElement
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.common.TextElement} TextElement
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            TextElement.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a TextElement message.
             * @function verify
             * @memberof kritor.common.TextElement
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            TextElement.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.text != null && message.hasOwnProperty("text"))
                    if (!$util.isString(message.text))
                        return "text: string expected";
                return null;
            };

            /**
             * Creates a TextElement message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.common.TextElement
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.common.TextElement} TextElement
             */
            TextElement.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.common.TextElement)
                    return object;
                let message = new $root.kritor.common.TextElement();
                if (object.text != null)
                    message.text = String(object.text);
                return message;
            };

            /**
             * Creates a plain object from a TextElement message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.common.TextElement
             * @static
             * @param {kritor.common.TextElement} message TextElement
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            TextElement.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults)
                    object.text = "";
                if (message.text != null && message.hasOwnProperty("text"))
                    object.text = message.text;
                return object;
            };

            /**
             * Converts this TextElement to JSON.
             * @function toJSON
             * @memberof kritor.common.TextElement
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            TextElement.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for TextElement
             * @function getTypeUrl
             * @memberof kritor.common.TextElement
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            TextElement.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.common.TextElement";
            };

            return TextElement;
        })();

        common.AtElement = (function() {

            /**
             * Properties of an AtElement.
             * @memberof kritor.common
             * @interface IAtElement
             * @property {string|null} [uid] AtElement uid
             * @property {number|Long|null} [uin] AtElement uin
             */

            /**
             * Constructs a new AtElement.
             * @memberof kritor.common
             * @classdesc Represents an AtElement.
             * @implements IAtElement
             * @constructor
             * @param {kritor.common.IAtElement=} [properties] Properties to set
             */
            function AtElement(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * AtElement uid.
             * @member {string} uid
             * @memberof kritor.common.AtElement
             * @instance
             */
            AtElement.prototype.uid = "";

            /**
             * AtElement uin.
             * @member {number|Long|null|undefined} uin
             * @memberof kritor.common.AtElement
             * @instance
             */
            AtElement.prototype.uin = null;

            // OneOf field names bound to virtual getters and setters
            let $oneOfFields;

            /**
             * AtElement _uin.
             * @member {"uin"|undefined} _uin
             * @memberof kritor.common.AtElement
             * @instance
             */
            Object.defineProperty(AtElement.prototype, "_uin", {
                get: $util.oneOfGetter($oneOfFields = ["uin"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new AtElement instance using the specified properties.
             * @function create
             * @memberof kritor.common.AtElement
             * @static
             * @param {kritor.common.IAtElement=} [properties] Properties to set
             * @returns {kritor.common.AtElement} AtElement instance
             */
            AtElement.create = function create(properties) {
                return new AtElement(properties);
            };

            /**
             * Encodes the specified AtElement message. Does not implicitly {@link kritor.common.AtElement.verify|verify} messages.
             * @function encode
             * @memberof kritor.common.AtElement
             * @static
             * @param {kritor.common.IAtElement} message AtElement message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            AtElement.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.uid != null && Object.hasOwnProperty.call(message, "uid"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.uid);
                if (message.uin != null && Object.hasOwnProperty.call(message, "uin"))
                    writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.uin);
                return writer;
            };

            /**
             * Encodes the specified AtElement message, length delimited. Does not implicitly {@link kritor.common.AtElement.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.common.AtElement
             * @static
             * @param {kritor.common.IAtElement} message AtElement message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            AtElement.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an AtElement message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.common.AtElement
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.common.AtElement} AtElement
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            AtElement.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.common.AtElement();
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
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes an AtElement message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.common.AtElement
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.common.AtElement} AtElement
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            AtElement.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an AtElement message.
             * @function verify
             * @memberof kritor.common.AtElement
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            AtElement.verify = function verify(message) {
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
                return null;
            };

            /**
             * Creates an AtElement message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.common.AtElement
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.common.AtElement} AtElement
             */
            AtElement.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.common.AtElement)
                    return object;
                let message = new $root.kritor.common.AtElement();
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
                return message;
            };

            /**
             * Creates a plain object from an AtElement message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.common.AtElement
             * @static
             * @param {kritor.common.AtElement} message AtElement
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            AtElement.toObject = function toObject(message, options) {
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
                return object;
            };

            /**
             * Converts this AtElement to JSON.
             * @function toJSON
             * @memberof kritor.common.AtElement
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            AtElement.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for AtElement
             * @function getTypeUrl
             * @memberof kritor.common.AtElement
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            AtElement.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.common.AtElement";
            };

            return AtElement;
        })();

        common.FaceElement = (function() {

            /**
             * Properties of a FaceElement.
             * @memberof kritor.common
             * @interface IFaceElement
             * @property {number|null} [id] FaceElement id
             * @property {boolean|null} [isBig] FaceElement isBig
             * @property {number|null} [result] FaceElement result
             */

            /**
             * Constructs a new FaceElement.
             * @memberof kritor.common
             * @classdesc Represents a FaceElement.
             * @implements IFaceElement
             * @constructor
             * @param {kritor.common.IFaceElement=} [properties] Properties to set
             */
            function FaceElement(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * FaceElement id.
             * @member {number} id
             * @memberof kritor.common.FaceElement
             * @instance
             */
            FaceElement.prototype.id = 0;

            /**
             * FaceElement isBig.
             * @member {boolean|null|undefined} isBig
             * @memberof kritor.common.FaceElement
             * @instance
             */
            FaceElement.prototype.isBig = null;

            /**
             * FaceElement result.
             * @member {number|null|undefined} result
             * @memberof kritor.common.FaceElement
             * @instance
             */
            FaceElement.prototype.result = null;

            // OneOf field names bound to virtual getters and setters
            let $oneOfFields;

            /**
             * FaceElement _isBig.
             * @member {"isBig"|undefined} _isBig
             * @memberof kritor.common.FaceElement
             * @instance
             */
            Object.defineProperty(FaceElement.prototype, "_isBig", {
                get: $util.oneOfGetter($oneOfFields = ["isBig"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * FaceElement _result.
             * @member {"result"|undefined} _result
             * @memberof kritor.common.FaceElement
             * @instance
             */
            Object.defineProperty(FaceElement.prototype, "_result", {
                get: $util.oneOfGetter($oneOfFields = ["result"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new FaceElement instance using the specified properties.
             * @function create
             * @memberof kritor.common.FaceElement
             * @static
             * @param {kritor.common.IFaceElement=} [properties] Properties to set
             * @returns {kritor.common.FaceElement} FaceElement instance
             */
            FaceElement.create = function create(properties) {
                return new FaceElement(properties);
            };

            /**
             * Encodes the specified FaceElement message. Does not implicitly {@link kritor.common.FaceElement.verify|verify} messages.
             * @function encode
             * @memberof kritor.common.FaceElement
             * @static
             * @param {kritor.common.IFaceElement} message FaceElement message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            FaceElement.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.id);
                if (message.isBig != null && Object.hasOwnProperty.call(message, "isBig"))
                    writer.uint32(/* id 2, wireType 0 =*/16).bool(message.isBig);
                if (message.result != null && Object.hasOwnProperty.call(message, "result"))
                    writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.result);
                return writer;
            };

            /**
             * Encodes the specified FaceElement message, length delimited. Does not implicitly {@link kritor.common.FaceElement.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.common.FaceElement
             * @static
             * @param {kritor.common.IFaceElement} message FaceElement message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            FaceElement.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a FaceElement message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.common.FaceElement
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.common.FaceElement} FaceElement
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            FaceElement.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.common.FaceElement();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.id = reader.uint32();
                            break;
                        }
                    case 2: {
                            message.isBig = reader.bool();
                            break;
                        }
                    case 3: {
                            message.result = reader.uint32();
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
             * Decodes a FaceElement message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.common.FaceElement
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.common.FaceElement} FaceElement
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            FaceElement.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a FaceElement message.
             * @function verify
             * @memberof kritor.common.FaceElement
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            FaceElement.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                let properties = {};
                if (message.id != null && message.hasOwnProperty("id"))
                    if (!$util.isInteger(message.id))
                        return "id: integer expected";
                if (message.isBig != null && message.hasOwnProperty("isBig")) {
                    properties._isBig = 1;
                    if (typeof message.isBig !== "boolean")
                        return "isBig: boolean expected";
                }
                if (message.result != null && message.hasOwnProperty("result")) {
                    properties._result = 1;
                    if (!$util.isInteger(message.result))
                        return "result: integer expected";
                }
                return null;
            };

            /**
             * Creates a FaceElement message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.common.FaceElement
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.common.FaceElement} FaceElement
             */
            FaceElement.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.common.FaceElement)
                    return object;
                let message = new $root.kritor.common.FaceElement();
                if (object.id != null)
                    message.id = object.id >>> 0;
                if (object.isBig != null)
                    message.isBig = Boolean(object.isBig);
                if (object.result != null)
                    message.result = object.result >>> 0;
                return message;
            };

            /**
             * Creates a plain object from a FaceElement message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.common.FaceElement
             * @static
             * @param {kritor.common.FaceElement} message FaceElement
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            FaceElement.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults)
                    object.id = 0;
                if (message.id != null && message.hasOwnProperty("id"))
                    object.id = message.id;
                if (message.isBig != null && message.hasOwnProperty("isBig")) {
                    object.isBig = message.isBig;
                    if (options.oneofs)
                        object._isBig = "isBig";
                }
                if (message.result != null && message.hasOwnProperty("result")) {
                    object.result = message.result;
                    if (options.oneofs)
                        object._result = "result";
                }
                return object;
            };

            /**
             * Converts this FaceElement to JSON.
             * @function toJSON
             * @memberof kritor.common.FaceElement
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            FaceElement.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for FaceElement
             * @function getTypeUrl
             * @memberof kritor.common.FaceElement
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            FaceElement.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.common.FaceElement";
            };

            return FaceElement;
        })();

        common.BubbleFaceElement = (function() {

            /**
             * Properties of a BubbleFaceElement.
             * @memberof kritor.common
             * @interface IBubbleFaceElement
             * @property {number|null} [id] BubbleFaceElement id
             * @property {number|null} [count] BubbleFaceElement count
             */

            /**
             * Constructs a new BubbleFaceElement.
             * @memberof kritor.common
             * @classdesc Represents a BubbleFaceElement.
             * @implements IBubbleFaceElement
             * @constructor
             * @param {kritor.common.IBubbleFaceElement=} [properties] Properties to set
             */
            function BubbleFaceElement(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * BubbleFaceElement id.
             * @member {number} id
             * @memberof kritor.common.BubbleFaceElement
             * @instance
             */
            BubbleFaceElement.prototype.id = 0;

            /**
             * BubbleFaceElement count.
             * @member {number} count
             * @memberof kritor.common.BubbleFaceElement
             * @instance
             */
            BubbleFaceElement.prototype.count = 0;

            /**
             * Creates a new BubbleFaceElement instance using the specified properties.
             * @function create
             * @memberof kritor.common.BubbleFaceElement
             * @static
             * @param {kritor.common.IBubbleFaceElement=} [properties] Properties to set
             * @returns {kritor.common.BubbleFaceElement} BubbleFaceElement instance
             */
            BubbleFaceElement.create = function create(properties) {
                return new BubbleFaceElement(properties);
            };

            /**
             * Encodes the specified BubbleFaceElement message. Does not implicitly {@link kritor.common.BubbleFaceElement.verify|verify} messages.
             * @function encode
             * @memberof kritor.common.BubbleFaceElement
             * @static
             * @param {kritor.common.IBubbleFaceElement} message BubbleFaceElement message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            BubbleFaceElement.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.id);
                if (message.count != null && Object.hasOwnProperty.call(message, "count"))
                    writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.count);
                return writer;
            };

            /**
             * Encodes the specified BubbleFaceElement message, length delimited. Does not implicitly {@link kritor.common.BubbleFaceElement.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.common.BubbleFaceElement
             * @static
             * @param {kritor.common.IBubbleFaceElement} message BubbleFaceElement message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            BubbleFaceElement.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a BubbleFaceElement message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.common.BubbleFaceElement
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.common.BubbleFaceElement} BubbleFaceElement
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            BubbleFaceElement.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.common.BubbleFaceElement();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.id = reader.uint32();
                            break;
                        }
                    case 2: {
                            message.count = reader.uint32();
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
             * Decodes a BubbleFaceElement message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.common.BubbleFaceElement
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.common.BubbleFaceElement} BubbleFaceElement
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            BubbleFaceElement.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a BubbleFaceElement message.
             * @function verify
             * @memberof kritor.common.BubbleFaceElement
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            BubbleFaceElement.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.id != null && message.hasOwnProperty("id"))
                    if (!$util.isInteger(message.id))
                        return "id: integer expected";
                if (message.count != null && message.hasOwnProperty("count"))
                    if (!$util.isInteger(message.count))
                        return "count: integer expected";
                return null;
            };

            /**
             * Creates a BubbleFaceElement message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.common.BubbleFaceElement
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.common.BubbleFaceElement} BubbleFaceElement
             */
            BubbleFaceElement.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.common.BubbleFaceElement)
                    return object;
                let message = new $root.kritor.common.BubbleFaceElement();
                if (object.id != null)
                    message.id = object.id >>> 0;
                if (object.count != null)
                    message.count = object.count >>> 0;
                return message;
            };

            /**
             * Creates a plain object from a BubbleFaceElement message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.common.BubbleFaceElement
             * @static
             * @param {kritor.common.BubbleFaceElement} message BubbleFaceElement
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            BubbleFaceElement.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.id = 0;
                    object.count = 0;
                }
                if (message.id != null && message.hasOwnProperty("id"))
                    object.id = message.id;
                if (message.count != null && message.hasOwnProperty("count"))
                    object.count = message.count;
                return object;
            };

            /**
             * Converts this BubbleFaceElement to JSON.
             * @function toJSON
             * @memberof kritor.common.BubbleFaceElement
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            BubbleFaceElement.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for BubbleFaceElement
             * @function getTypeUrl
             * @memberof kritor.common.BubbleFaceElement
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            BubbleFaceElement.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.common.BubbleFaceElement";
            };

            return BubbleFaceElement;
        })();

        common.ReplyElement = (function() {

            /**
             * Properties of a ReplyElement.
             * @memberof kritor.common
             * @interface IReplyElement
             * @property {string|null} [messageId] ReplyElement messageId
             */

            /**
             * Constructs a new ReplyElement.
             * @memberof kritor.common
             * @classdesc Represents a ReplyElement.
             * @implements IReplyElement
             * @constructor
             * @param {kritor.common.IReplyElement=} [properties] Properties to set
             */
            function ReplyElement(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * ReplyElement messageId.
             * @member {string} messageId
             * @memberof kritor.common.ReplyElement
             * @instance
             */
            ReplyElement.prototype.messageId = "";

            /**
             * Creates a new ReplyElement instance using the specified properties.
             * @function create
             * @memberof kritor.common.ReplyElement
             * @static
             * @param {kritor.common.IReplyElement=} [properties] Properties to set
             * @returns {kritor.common.ReplyElement} ReplyElement instance
             */
            ReplyElement.create = function create(properties) {
                return new ReplyElement(properties);
            };

            /**
             * Encodes the specified ReplyElement message. Does not implicitly {@link kritor.common.ReplyElement.verify|verify} messages.
             * @function encode
             * @memberof kritor.common.ReplyElement
             * @static
             * @param {kritor.common.IReplyElement} message ReplyElement message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ReplyElement.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.messageId != null && Object.hasOwnProperty.call(message, "messageId"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.messageId);
                return writer;
            };

            /**
             * Encodes the specified ReplyElement message, length delimited. Does not implicitly {@link kritor.common.ReplyElement.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.common.ReplyElement
             * @static
             * @param {kritor.common.IReplyElement} message ReplyElement message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ReplyElement.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a ReplyElement message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.common.ReplyElement
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.common.ReplyElement} ReplyElement
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ReplyElement.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.common.ReplyElement();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.messageId = reader.string();
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
             * Decodes a ReplyElement message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.common.ReplyElement
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.common.ReplyElement} ReplyElement
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ReplyElement.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a ReplyElement message.
             * @function verify
             * @memberof kritor.common.ReplyElement
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ReplyElement.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.messageId != null && message.hasOwnProperty("messageId"))
                    if (!$util.isString(message.messageId))
                        return "messageId: string expected";
                return null;
            };

            /**
             * Creates a ReplyElement message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.common.ReplyElement
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.common.ReplyElement} ReplyElement
             */
            ReplyElement.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.common.ReplyElement)
                    return object;
                let message = new $root.kritor.common.ReplyElement();
                if (object.messageId != null)
                    message.messageId = String(object.messageId);
                return message;
            };

            /**
             * Creates a plain object from a ReplyElement message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.common.ReplyElement
             * @static
             * @param {kritor.common.ReplyElement} message ReplyElement
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ReplyElement.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults)
                    object.messageId = "";
                if (message.messageId != null && message.hasOwnProperty("messageId"))
                    object.messageId = message.messageId;
                return object;
            };

            /**
             * Converts this ReplyElement to JSON.
             * @function toJSON
             * @memberof kritor.common.ReplyElement
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ReplyElement.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for ReplyElement
             * @function getTypeUrl
             * @memberof kritor.common.ReplyElement
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            ReplyElement.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.common.ReplyElement";
            };

            return ReplyElement;
        })();

        common.ImageElement = (function() {

            /**
             * Properties of an ImageElement.
             * @memberof kritor.common
             * @interface IImageElement
             * @property {Uint8Array|null} [file] ImageElement file
             * @property {string|null} [fileName] ImageElement fileName
             * @property {string|null} [filePath] ImageElement filePath
             * @property {string|null} [fileUrl] ImageElement fileUrl
             * @property {string|null} [fileMd5] ImageElement fileMd5
             * @property {number|null} [subType] ImageElement subType
             * @property {kritor.common.ImageElement.ImageType|null} [type] ImageElement type
             */

            /**
             * Constructs a new ImageElement.
             * @memberof kritor.common
             * @classdesc Represents an ImageElement.
             * @implements IImageElement
             * @constructor
             * @param {kritor.common.IImageElement=} [properties] Properties to set
             */
            function ImageElement(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * ImageElement file.
             * @member {Uint8Array|null|undefined} file
             * @memberof kritor.common.ImageElement
             * @instance
             */
            ImageElement.prototype.file = null;

            /**
             * ImageElement fileName.
             * @member {string|null|undefined} fileName
             * @memberof kritor.common.ImageElement
             * @instance
             */
            ImageElement.prototype.fileName = null;

            /**
             * ImageElement filePath.
             * @member {string|null|undefined} filePath
             * @memberof kritor.common.ImageElement
             * @instance
             */
            ImageElement.prototype.filePath = null;

            /**
             * ImageElement fileUrl.
             * @member {string|null|undefined} fileUrl
             * @memberof kritor.common.ImageElement
             * @instance
             */
            ImageElement.prototype.fileUrl = null;

            /**
             * ImageElement fileMd5.
             * @member {string|null|undefined} fileMd5
             * @memberof kritor.common.ImageElement
             * @instance
             */
            ImageElement.prototype.fileMd5 = null;

            /**
             * ImageElement subType.
             * @member {number|null|undefined} subType
             * @memberof kritor.common.ImageElement
             * @instance
             */
            ImageElement.prototype.subType = null;

            /**
             * ImageElement type.
             * @member {kritor.common.ImageElement.ImageType|null|undefined} type
             * @memberof kritor.common.ImageElement
             * @instance
             */
            ImageElement.prototype.type = null;

            // OneOf field names bound to virtual getters and setters
            let $oneOfFields;

            /**
             * ImageElement data.
             * @member {"file"|"fileName"|"filePath"|"fileUrl"|undefined} data
             * @memberof kritor.common.ImageElement
             * @instance
             */
            Object.defineProperty(ImageElement.prototype, "data", {
                get: $util.oneOfGetter($oneOfFields = ["file", "fileName", "filePath", "fileUrl"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * ImageElement _fileMd5.
             * @member {"fileMd5"|undefined} _fileMd5
             * @memberof kritor.common.ImageElement
             * @instance
             */
            Object.defineProperty(ImageElement.prototype, "_fileMd5", {
                get: $util.oneOfGetter($oneOfFields = ["fileMd5"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * ImageElement _subType.
             * @member {"subType"|undefined} _subType
             * @memberof kritor.common.ImageElement
             * @instance
             */
            Object.defineProperty(ImageElement.prototype, "_subType", {
                get: $util.oneOfGetter($oneOfFields = ["subType"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * ImageElement _type.
             * @member {"type"|undefined} _type
             * @memberof kritor.common.ImageElement
             * @instance
             */
            Object.defineProperty(ImageElement.prototype, "_type", {
                get: $util.oneOfGetter($oneOfFields = ["type"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new ImageElement instance using the specified properties.
             * @function create
             * @memberof kritor.common.ImageElement
             * @static
             * @param {kritor.common.IImageElement=} [properties] Properties to set
             * @returns {kritor.common.ImageElement} ImageElement instance
             */
            ImageElement.create = function create(properties) {
                return new ImageElement(properties);
            };

            /**
             * Encodes the specified ImageElement message. Does not implicitly {@link kritor.common.ImageElement.verify|verify} messages.
             * @function encode
             * @memberof kritor.common.ImageElement
             * @static
             * @param {kritor.common.IImageElement} message ImageElement message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ImageElement.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.file != null && Object.hasOwnProperty.call(message, "file"))
                    writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.file);
                if (message.fileName != null && Object.hasOwnProperty.call(message, "fileName"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.fileName);
                if (message.filePath != null && Object.hasOwnProperty.call(message, "filePath"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.filePath);
                if (message.fileUrl != null && Object.hasOwnProperty.call(message, "fileUrl"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.fileUrl);
                if (message.fileMd5 != null && Object.hasOwnProperty.call(message, "fileMd5"))
                    writer.uint32(/* id 5, wireType 2 =*/42).string(message.fileMd5);
                if (message.subType != null && Object.hasOwnProperty.call(message, "subType"))
                    writer.uint32(/* id 6, wireType 0 =*/48).uint32(message.subType);
                if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                    writer.uint32(/* id 10, wireType 0 =*/80).int32(message.type);
                return writer;
            };

            /**
             * Encodes the specified ImageElement message, length delimited. Does not implicitly {@link kritor.common.ImageElement.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.common.ImageElement
             * @static
             * @param {kritor.common.IImageElement} message ImageElement message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ImageElement.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an ImageElement message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.common.ImageElement
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.common.ImageElement} ImageElement
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ImageElement.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.common.ImageElement();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.file = reader.bytes();
                            break;
                        }
                    case 2: {
                            message.fileName = reader.string();
                            break;
                        }
                    case 3: {
                            message.filePath = reader.string();
                            break;
                        }
                    case 4: {
                            message.fileUrl = reader.string();
                            break;
                        }
                    case 5: {
                            message.fileMd5 = reader.string();
                            break;
                        }
                    case 6: {
                            message.subType = reader.uint32();
                            break;
                        }
                    case 10: {
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
             * Decodes an ImageElement message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.common.ImageElement
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.common.ImageElement} ImageElement
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ImageElement.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an ImageElement message.
             * @function verify
             * @memberof kritor.common.ImageElement
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ImageElement.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                let properties = {};
                if (message.file != null && message.hasOwnProperty("file")) {
                    properties.data = 1;
                    if (!(message.file && typeof message.file.length === "number" || $util.isString(message.file)))
                        return "file: buffer expected";
                }
                if (message.fileName != null && message.hasOwnProperty("fileName")) {
                    if (properties.data === 1)
                        return "data: multiple values";
                    properties.data = 1;
                    if (!$util.isString(message.fileName))
                        return "fileName: string expected";
                }
                if (message.filePath != null && message.hasOwnProperty("filePath")) {
                    if (properties.data === 1)
                        return "data: multiple values";
                    properties.data = 1;
                    if (!$util.isString(message.filePath))
                        return "filePath: string expected";
                }
                if (message.fileUrl != null && message.hasOwnProperty("fileUrl")) {
                    if (properties.data === 1)
                        return "data: multiple values";
                    properties.data = 1;
                    if (!$util.isString(message.fileUrl))
                        return "fileUrl: string expected";
                }
                if (message.fileMd5 != null && message.hasOwnProperty("fileMd5")) {
                    properties._fileMd5 = 1;
                    if (!$util.isString(message.fileMd5))
                        return "fileMd5: string expected";
                }
                if (message.subType != null && message.hasOwnProperty("subType")) {
                    properties._subType = 1;
                    if (!$util.isInteger(message.subType))
                        return "subType: integer expected";
                }
                if (message.type != null && message.hasOwnProperty("type")) {
                    properties._type = 1;
                    switch (message.type) {
                    default:
                        return "type: enum value expected";
                    case 0:
                    case 1:
                    case 2:
                        break;
                    }
                }
                return null;
            };

            /**
             * Creates an ImageElement message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.common.ImageElement
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.common.ImageElement} ImageElement
             */
            ImageElement.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.common.ImageElement)
                    return object;
                let message = new $root.kritor.common.ImageElement();
                if (object.file != null)
                    if (typeof object.file === "string")
                        $util.base64.decode(object.file, message.file = $util.newBuffer($util.base64.length(object.file)), 0);
                    else if (object.file.length >= 0)
                        message.file = object.file;
                if (object.fileName != null)
                    message.fileName = String(object.fileName);
                if (object.filePath != null)
                    message.filePath = String(object.filePath);
                if (object.fileUrl != null)
                    message.fileUrl = String(object.fileUrl);
                if (object.fileMd5 != null)
                    message.fileMd5 = String(object.fileMd5);
                if (object.subType != null)
                    message.subType = object.subType >>> 0;
                switch (object.type) {
                default:
                    if (typeof object.type === "number") {
                        message.type = object.type;
                        break;
                    }
                    break;
                case "COMMON":
                case 0:
                    message.type = 0;
                    break;
                case "ORIGIN":
                case 1:
                    message.type = 1;
                    break;
                case "FLASH":
                case 2:
                    message.type = 2;
                    break;
                }
                return message;
            };

            /**
             * Creates a plain object from an ImageElement message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.common.ImageElement
             * @static
             * @param {kritor.common.ImageElement} message ImageElement
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ImageElement.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (message.file != null && message.hasOwnProperty("file")) {
                    object.file = options.bytes === String ? $util.base64.encode(message.file, 0, message.file.length) : options.bytes === Array ? Array.prototype.slice.call(message.file) : message.file;
                    if (options.oneofs)
                        object.data = "file";
                }
                if (message.fileName != null && message.hasOwnProperty("fileName")) {
                    object.fileName = message.fileName;
                    if (options.oneofs)
                        object.data = "fileName";
                }
                if (message.filePath != null && message.hasOwnProperty("filePath")) {
                    object.filePath = message.filePath;
                    if (options.oneofs)
                        object.data = "filePath";
                }
                if (message.fileUrl != null && message.hasOwnProperty("fileUrl")) {
                    object.fileUrl = message.fileUrl;
                    if (options.oneofs)
                        object.data = "fileUrl";
                }
                if (message.fileMd5 != null && message.hasOwnProperty("fileMd5")) {
                    object.fileMd5 = message.fileMd5;
                    if (options.oneofs)
                        object._fileMd5 = "fileMd5";
                }
                if (message.subType != null && message.hasOwnProperty("subType")) {
                    object.subType = message.subType;
                    if (options.oneofs)
                        object._subType = "subType";
                }
                if (message.type != null && message.hasOwnProperty("type")) {
                    object.type = options.enums === String ? $root.kritor.common.ImageElement.ImageType[message.type] === undefined ? message.type : $root.kritor.common.ImageElement.ImageType[message.type] : message.type;
                    if (options.oneofs)
                        object._type = "type";
                }
                return object;
            };

            /**
             * Converts this ImageElement to JSON.
             * @function toJSON
             * @memberof kritor.common.ImageElement
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ImageElement.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for ImageElement
             * @function getTypeUrl
             * @memberof kritor.common.ImageElement
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            ImageElement.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.common.ImageElement";
            };

            /**
             * ImageType enum.
             * @name kritor.common.ImageElement.ImageType
             * @enum {number}
             * @property {number} COMMON=0 COMMON value
             * @property {number} ORIGIN=1 ORIGIN value
             * @property {number} FLASH=2 FLASH value
             */
            ImageElement.ImageType = (function() {
                const valuesById = {}, values = Object.create(valuesById);
                values[valuesById[0] = "COMMON"] = 0;
                values[valuesById[1] = "ORIGIN"] = 1;
                values[valuesById[2] = "FLASH"] = 2;
                return values;
            })();

            return ImageElement;
        })();

        common.VoiceElement = (function() {

            /**
             * Properties of a VoiceElement.
             * @memberof kritor.common
             * @interface IVoiceElement
             * @property {Uint8Array|null} [file] VoiceElement file
             * @property {string|null} [fileName] VoiceElement fileName
             * @property {string|null} [filePath] VoiceElement filePath
             * @property {string|null} [fileUrl] VoiceElement fileUrl
             * @property {string|null} [fileMd5] VoiceElement fileMd5
             * @property {boolean|null} [magic] VoiceElement magic
             */

            /**
             * Constructs a new VoiceElement.
             * @memberof kritor.common
             * @classdesc Represents a VoiceElement.
             * @implements IVoiceElement
             * @constructor
             * @param {kritor.common.IVoiceElement=} [properties] Properties to set
             */
            function VoiceElement(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * VoiceElement file.
             * @member {Uint8Array|null|undefined} file
             * @memberof kritor.common.VoiceElement
             * @instance
             */
            VoiceElement.prototype.file = null;

            /**
             * VoiceElement fileName.
             * @member {string|null|undefined} fileName
             * @memberof kritor.common.VoiceElement
             * @instance
             */
            VoiceElement.prototype.fileName = null;

            /**
             * VoiceElement filePath.
             * @member {string|null|undefined} filePath
             * @memberof kritor.common.VoiceElement
             * @instance
             */
            VoiceElement.prototype.filePath = null;

            /**
             * VoiceElement fileUrl.
             * @member {string|null|undefined} fileUrl
             * @memberof kritor.common.VoiceElement
             * @instance
             */
            VoiceElement.prototype.fileUrl = null;

            /**
             * VoiceElement fileMd5.
             * @member {string|null|undefined} fileMd5
             * @memberof kritor.common.VoiceElement
             * @instance
             */
            VoiceElement.prototype.fileMd5 = null;

            /**
             * VoiceElement magic.
             * @member {boolean|null|undefined} magic
             * @memberof kritor.common.VoiceElement
             * @instance
             */
            VoiceElement.prototype.magic = null;

            // OneOf field names bound to virtual getters and setters
            let $oneOfFields;

            /**
             * VoiceElement data.
             * @member {"file"|"fileName"|"filePath"|"fileUrl"|undefined} data
             * @memberof kritor.common.VoiceElement
             * @instance
             */
            Object.defineProperty(VoiceElement.prototype, "data", {
                get: $util.oneOfGetter($oneOfFields = ["file", "fileName", "filePath", "fileUrl"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * VoiceElement _fileMd5.
             * @member {"fileMd5"|undefined} _fileMd5
             * @memberof kritor.common.VoiceElement
             * @instance
             */
            Object.defineProperty(VoiceElement.prototype, "_fileMd5", {
                get: $util.oneOfGetter($oneOfFields = ["fileMd5"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * VoiceElement _magic.
             * @member {"magic"|undefined} _magic
             * @memberof kritor.common.VoiceElement
             * @instance
             */
            Object.defineProperty(VoiceElement.prototype, "_magic", {
                get: $util.oneOfGetter($oneOfFields = ["magic"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new VoiceElement instance using the specified properties.
             * @function create
             * @memberof kritor.common.VoiceElement
             * @static
             * @param {kritor.common.IVoiceElement=} [properties] Properties to set
             * @returns {kritor.common.VoiceElement} VoiceElement instance
             */
            VoiceElement.create = function create(properties) {
                return new VoiceElement(properties);
            };

            /**
             * Encodes the specified VoiceElement message. Does not implicitly {@link kritor.common.VoiceElement.verify|verify} messages.
             * @function encode
             * @memberof kritor.common.VoiceElement
             * @static
             * @param {kritor.common.IVoiceElement} message VoiceElement message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            VoiceElement.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.file != null && Object.hasOwnProperty.call(message, "file"))
                    writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.file);
                if (message.fileName != null && Object.hasOwnProperty.call(message, "fileName"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.fileName);
                if (message.filePath != null && Object.hasOwnProperty.call(message, "filePath"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.filePath);
                if (message.fileUrl != null && Object.hasOwnProperty.call(message, "fileUrl"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.fileUrl);
                if (message.fileMd5 != null && Object.hasOwnProperty.call(message, "fileMd5"))
                    writer.uint32(/* id 5, wireType 2 =*/42).string(message.fileMd5);
                if (message.magic != null && Object.hasOwnProperty.call(message, "magic"))
                    writer.uint32(/* id 6, wireType 0 =*/48).bool(message.magic);
                return writer;
            };

            /**
             * Encodes the specified VoiceElement message, length delimited. Does not implicitly {@link kritor.common.VoiceElement.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.common.VoiceElement
             * @static
             * @param {kritor.common.IVoiceElement} message VoiceElement message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            VoiceElement.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a VoiceElement message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.common.VoiceElement
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.common.VoiceElement} VoiceElement
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            VoiceElement.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.common.VoiceElement();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.file = reader.bytes();
                            break;
                        }
                    case 2: {
                            message.fileName = reader.string();
                            break;
                        }
                    case 3: {
                            message.filePath = reader.string();
                            break;
                        }
                    case 4: {
                            message.fileUrl = reader.string();
                            break;
                        }
                    case 5: {
                            message.fileMd5 = reader.string();
                            break;
                        }
                    case 6: {
                            message.magic = reader.bool();
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
             * Decodes a VoiceElement message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.common.VoiceElement
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.common.VoiceElement} VoiceElement
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            VoiceElement.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a VoiceElement message.
             * @function verify
             * @memberof kritor.common.VoiceElement
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            VoiceElement.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                let properties = {};
                if (message.file != null && message.hasOwnProperty("file")) {
                    properties.data = 1;
                    if (!(message.file && typeof message.file.length === "number" || $util.isString(message.file)))
                        return "file: buffer expected";
                }
                if (message.fileName != null && message.hasOwnProperty("fileName")) {
                    if (properties.data === 1)
                        return "data: multiple values";
                    properties.data = 1;
                    if (!$util.isString(message.fileName))
                        return "fileName: string expected";
                }
                if (message.filePath != null && message.hasOwnProperty("filePath")) {
                    if (properties.data === 1)
                        return "data: multiple values";
                    properties.data = 1;
                    if (!$util.isString(message.filePath))
                        return "filePath: string expected";
                }
                if (message.fileUrl != null && message.hasOwnProperty("fileUrl")) {
                    if (properties.data === 1)
                        return "data: multiple values";
                    properties.data = 1;
                    if (!$util.isString(message.fileUrl))
                        return "fileUrl: string expected";
                }
                if (message.fileMd5 != null && message.hasOwnProperty("fileMd5")) {
                    properties._fileMd5 = 1;
                    if (!$util.isString(message.fileMd5))
                        return "fileMd5: string expected";
                }
                if (message.magic != null && message.hasOwnProperty("magic")) {
                    properties._magic = 1;
                    if (typeof message.magic !== "boolean")
                        return "magic: boolean expected";
                }
                return null;
            };

            /**
             * Creates a VoiceElement message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.common.VoiceElement
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.common.VoiceElement} VoiceElement
             */
            VoiceElement.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.common.VoiceElement)
                    return object;
                let message = new $root.kritor.common.VoiceElement();
                if (object.file != null)
                    if (typeof object.file === "string")
                        $util.base64.decode(object.file, message.file = $util.newBuffer($util.base64.length(object.file)), 0);
                    else if (object.file.length >= 0)
                        message.file = object.file;
                if (object.fileName != null)
                    message.fileName = String(object.fileName);
                if (object.filePath != null)
                    message.filePath = String(object.filePath);
                if (object.fileUrl != null)
                    message.fileUrl = String(object.fileUrl);
                if (object.fileMd5 != null)
                    message.fileMd5 = String(object.fileMd5);
                if (object.magic != null)
                    message.magic = Boolean(object.magic);
                return message;
            };

            /**
             * Creates a plain object from a VoiceElement message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.common.VoiceElement
             * @static
             * @param {kritor.common.VoiceElement} message VoiceElement
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            VoiceElement.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (message.file != null && message.hasOwnProperty("file")) {
                    object.file = options.bytes === String ? $util.base64.encode(message.file, 0, message.file.length) : options.bytes === Array ? Array.prototype.slice.call(message.file) : message.file;
                    if (options.oneofs)
                        object.data = "file";
                }
                if (message.fileName != null && message.hasOwnProperty("fileName")) {
                    object.fileName = message.fileName;
                    if (options.oneofs)
                        object.data = "fileName";
                }
                if (message.filePath != null && message.hasOwnProperty("filePath")) {
                    object.filePath = message.filePath;
                    if (options.oneofs)
                        object.data = "filePath";
                }
                if (message.fileUrl != null && message.hasOwnProperty("fileUrl")) {
                    object.fileUrl = message.fileUrl;
                    if (options.oneofs)
                        object.data = "fileUrl";
                }
                if (message.fileMd5 != null && message.hasOwnProperty("fileMd5")) {
                    object.fileMd5 = message.fileMd5;
                    if (options.oneofs)
                        object._fileMd5 = "fileMd5";
                }
                if (message.magic != null && message.hasOwnProperty("magic")) {
                    object.magic = message.magic;
                    if (options.oneofs)
                        object._magic = "magic";
                }
                return object;
            };

            /**
             * Converts this VoiceElement to JSON.
             * @function toJSON
             * @memberof kritor.common.VoiceElement
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            VoiceElement.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for VoiceElement
             * @function getTypeUrl
             * @memberof kritor.common.VoiceElement
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            VoiceElement.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.common.VoiceElement";
            };

            return VoiceElement;
        })();

        common.VideoElement = (function() {

            /**
             * Properties of a VideoElement.
             * @memberof kritor.common
             * @interface IVideoElement
             * @property {Uint8Array|null} [file] VideoElement file
             * @property {string|null} [fileName] VideoElement fileName
             * @property {string|null} [filePath] VideoElement filePath
             * @property {string|null} [fileUrl] VideoElement fileUrl
             * @property {string|null} [fileMd5] VideoElement fileMd5
             */

            /**
             * Constructs a new VideoElement.
             * @memberof kritor.common
             * @classdesc Represents a VideoElement.
             * @implements IVideoElement
             * @constructor
             * @param {kritor.common.IVideoElement=} [properties] Properties to set
             */
            function VideoElement(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * VideoElement file.
             * @member {Uint8Array|null|undefined} file
             * @memberof kritor.common.VideoElement
             * @instance
             */
            VideoElement.prototype.file = null;

            /**
             * VideoElement fileName.
             * @member {string|null|undefined} fileName
             * @memberof kritor.common.VideoElement
             * @instance
             */
            VideoElement.prototype.fileName = null;

            /**
             * VideoElement filePath.
             * @member {string|null|undefined} filePath
             * @memberof kritor.common.VideoElement
             * @instance
             */
            VideoElement.prototype.filePath = null;

            /**
             * VideoElement fileUrl.
             * @member {string|null|undefined} fileUrl
             * @memberof kritor.common.VideoElement
             * @instance
             */
            VideoElement.prototype.fileUrl = null;

            /**
             * VideoElement fileMd5.
             * @member {string|null|undefined} fileMd5
             * @memberof kritor.common.VideoElement
             * @instance
             */
            VideoElement.prototype.fileMd5 = null;

            // OneOf field names bound to virtual getters and setters
            let $oneOfFields;

            /**
             * VideoElement data.
             * @member {"file"|"fileName"|"filePath"|"fileUrl"|undefined} data
             * @memberof kritor.common.VideoElement
             * @instance
             */
            Object.defineProperty(VideoElement.prototype, "data", {
                get: $util.oneOfGetter($oneOfFields = ["file", "fileName", "filePath", "fileUrl"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * VideoElement _fileMd5.
             * @member {"fileMd5"|undefined} _fileMd5
             * @memberof kritor.common.VideoElement
             * @instance
             */
            Object.defineProperty(VideoElement.prototype, "_fileMd5", {
                get: $util.oneOfGetter($oneOfFields = ["fileMd5"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new VideoElement instance using the specified properties.
             * @function create
             * @memberof kritor.common.VideoElement
             * @static
             * @param {kritor.common.IVideoElement=} [properties] Properties to set
             * @returns {kritor.common.VideoElement} VideoElement instance
             */
            VideoElement.create = function create(properties) {
                return new VideoElement(properties);
            };

            /**
             * Encodes the specified VideoElement message. Does not implicitly {@link kritor.common.VideoElement.verify|verify} messages.
             * @function encode
             * @memberof kritor.common.VideoElement
             * @static
             * @param {kritor.common.IVideoElement} message VideoElement message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            VideoElement.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.file != null && Object.hasOwnProperty.call(message, "file"))
                    writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.file);
                if (message.fileName != null && Object.hasOwnProperty.call(message, "fileName"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.fileName);
                if (message.filePath != null && Object.hasOwnProperty.call(message, "filePath"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.filePath);
                if (message.fileUrl != null && Object.hasOwnProperty.call(message, "fileUrl"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.fileUrl);
                if (message.fileMd5 != null && Object.hasOwnProperty.call(message, "fileMd5"))
                    writer.uint32(/* id 5, wireType 2 =*/42).string(message.fileMd5);
                return writer;
            };

            /**
             * Encodes the specified VideoElement message, length delimited. Does not implicitly {@link kritor.common.VideoElement.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.common.VideoElement
             * @static
             * @param {kritor.common.IVideoElement} message VideoElement message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            VideoElement.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a VideoElement message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.common.VideoElement
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.common.VideoElement} VideoElement
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            VideoElement.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.common.VideoElement();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.file = reader.bytes();
                            break;
                        }
                    case 2: {
                            message.fileName = reader.string();
                            break;
                        }
                    case 3: {
                            message.filePath = reader.string();
                            break;
                        }
                    case 4: {
                            message.fileUrl = reader.string();
                            break;
                        }
                    case 5: {
                            message.fileMd5 = reader.string();
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
             * Decodes a VideoElement message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.common.VideoElement
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.common.VideoElement} VideoElement
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            VideoElement.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a VideoElement message.
             * @function verify
             * @memberof kritor.common.VideoElement
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            VideoElement.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                let properties = {};
                if (message.file != null && message.hasOwnProperty("file")) {
                    properties.data = 1;
                    if (!(message.file && typeof message.file.length === "number" || $util.isString(message.file)))
                        return "file: buffer expected";
                }
                if (message.fileName != null && message.hasOwnProperty("fileName")) {
                    if (properties.data === 1)
                        return "data: multiple values";
                    properties.data = 1;
                    if (!$util.isString(message.fileName))
                        return "fileName: string expected";
                }
                if (message.filePath != null && message.hasOwnProperty("filePath")) {
                    if (properties.data === 1)
                        return "data: multiple values";
                    properties.data = 1;
                    if (!$util.isString(message.filePath))
                        return "filePath: string expected";
                }
                if (message.fileUrl != null && message.hasOwnProperty("fileUrl")) {
                    if (properties.data === 1)
                        return "data: multiple values";
                    properties.data = 1;
                    if (!$util.isString(message.fileUrl))
                        return "fileUrl: string expected";
                }
                if (message.fileMd5 != null && message.hasOwnProperty("fileMd5")) {
                    properties._fileMd5 = 1;
                    if (!$util.isString(message.fileMd5))
                        return "fileMd5: string expected";
                }
                return null;
            };

            /**
             * Creates a VideoElement message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.common.VideoElement
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.common.VideoElement} VideoElement
             */
            VideoElement.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.common.VideoElement)
                    return object;
                let message = new $root.kritor.common.VideoElement();
                if (object.file != null)
                    if (typeof object.file === "string")
                        $util.base64.decode(object.file, message.file = $util.newBuffer($util.base64.length(object.file)), 0);
                    else if (object.file.length >= 0)
                        message.file = object.file;
                if (object.fileName != null)
                    message.fileName = String(object.fileName);
                if (object.filePath != null)
                    message.filePath = String(object.filePath);
                if (object.fileUrl != null)
                    message.fileUrl = String(object.fileUrl);
                if (object.fileMd5 != null)
                    message.fileMd5 = String(object.fileMd5);
                return message;
            };

            /**
             * Creates a plain object from a VideoElement message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.common.VideoElement
             * @static
             * @param {kritor.common.VideoElement} message VideoElement
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            VideoElement.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (message.file != null && message.hasOwnProperty("file")) {
                    object.file = options.bytes === String ? $util.base64.encode(message.file, 0, message.file.length) : options.bytes === Array ? Array.prototype.slice.call(message.file) : message.file;
                    if (options.oneofs)
                        object.data = "file";
                }
                if (message.fileName != null && message.hasOwnProperty("fileName")) {
                    object.fileName = message.fileName;
                    if (options.oneofs)
                        object.data = "fileName";
                }
                if (message.filePath != null && message.hasOwnProperty("filePath")) {
                    object.filePath = message.filePath;
                    if (options.oneofs)
                        object.data = "filePath";
                }
                if (message.fileUrl != null && message.hasOwnProperty("fileUrl")) {
                    object.fileUrl = message.fileUrl;
                    if (options.oneofs)
                        object.data = "fileUrl";
                }
                if (message.fileMd5 != null && message.hasOwnProperty("fileMd5")) {
                    object.fileMd5 = message.fileMd5;
                    if (options.oneofs)
                        object._fileMd5 = "fileMd5";
                }
                return object;
            };

            /**
             * Converts this VideoElement to JSON.
             * @function toJSON
             * @memberof kritor.common.VideoElement
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            VideoElement.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for VideoElement
             * @function getTypeUrl
             * @memberof kritor.common.VideoElement
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            VideoElement.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.common.VideoElement";
            };

            return VideoElement;
        })();

        common.BasketballElement = (function() {

            /**
             * Properties of a BasketballElement.
             * @memberof kritor.common
             * @interface IBasketballElement
             * @property {number|null} [id] BasketballElement id
             */

            /**
             * Constructs a new BasketballElement.
             * @memberof kritor.common
             * @classdesc Represents a BasketballElement.
             * @implements IBasketballElement
             * @constructor
             * @param {kritor.common.IBasketballElement=} [properties] Properties to set
             */
            function BasketballElement(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * BasketballElement id.
             * @member {number} id
             * @memberof kritor.common.BasketballElement
             * @instance
             */
            BasketballElement.prototype.id = 0;

            /**
             * Creates a new BasketballElement instance using the specified properties.
             * @function create
             * @memberof kritor.common.BasketballElement
             * @static
             * @param {kritor.common.IBasketballElement=} [properties] Properties to set
             * @returns {kritor.common.BasketballElement} BasketballElement instance
             */
            BasketballElement.create = function create(properties) {
                return new BasketballElement(properties);
            };

            /**
             * Encodes the specified BasketballElement message. Does not implicitly {@link kritor.common.BasketballElement.verify|verify} messages.
             * @function encode
             * @memberof kritor.common.BasketballElement
             * @static
             * @param {kritor.common.IBasketballElement} message BasketballElement message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            BasketballElement.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.id);
                return writer;
            };

            /**
             * Encodes the specified BasketballElement message, length delimited. Does not implicitly {@link kritor.common.BasketballElement.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.common.BasketballElement
             * @static
             * @param {kritor.common.IBasketballElement} message BasketballElement message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            BasketballElement.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a BasketballElement message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.common.BasketballElement
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.common.BasketballElement} BasketballElement
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            BasketballElement.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.common.BasketballElement();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.id = reader.uint32();
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
             * Decodes a BasketballElement message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.common.BasketballElement
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.common.BasketballElement} BasketballElement
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            BasketballElement.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a BasketballElement message.
             * @function verify
             * @memberof kritor.common.BasketballElement
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            BasketballElement.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.id != null && message.hasOwnProperty("id"))
                    if (!$util.isInteger(message.id))
                        return "id: integer expected";
                return null;
            };

            /**
             * Creates a BasketballElement message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.common.BasketballElement
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.common.BasketballElement} BasketballElement
             */
            BasketballElement.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.common.BasketballElement)
                    return object;
                let message = new $root.kritor.common.BasketballElement();
                if (object.id != null)
                    message.id = object.id >>> 0;
                return message;
            };

            /**
             * Creates a plain object from a BasketballElement message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.common.BasketballElement
             * @static
             * @param {kritor.common.BasketballElement} message BasketballElement
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            BasketballElement.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults)
                    object.id = 0;
                if (message.id != null && message.hasOwnProperty("id"))
                    object.id = message.id;
                return object;
            };

            /**
             * Converts this BasketballElement to JSON.
             * @function toJSON
             * @memberof kritor.common.BasketballElement
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            BasketballElement.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for BasketballElement
             * @function getTypeUrl
             * @memberof kritor.common.BasketballElement
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            BasketballElement.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.common.BasketballElement";
            };

            return BasketballElement;
        })();

        common.DiceElement = (function() {

            /**
             * Properties of a DiceElement.
             * @memberof kritor.common
             * @interface IDiceElement
             * @property {number|null} [id] DiceElement id
             */

            /**
             * Constructs a new DiceElement.
             * @memberof kritor.common
             * @classdesc Represents a DiceElement.
             * @implements IDiceElement
             * @constructor
             * @param {kritor.common.IDiceElement=} [properties] Properties to set
             */
            function DiceElement(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * DiceElement id.
             * @member {number} id
             * @memberof kritor.common.DiceElement
             * @instance
             */
            DiceElement.prototype.id = 0;

            /**
             * Creates a new DiceElement instance using the specified properties.
             * @function create
             * @memberof kritor.common.DiceElement
             * @static
             * @param {kritor.common.IDiceElement=} [properties] Properties to set
             * @returns {kritor.common.DiceElement} DiceElement instance
             */
            DiceElement.create = function create(properties) {
                return new DiceElement(properties);
            };

            /**
             * Encodes the specified DiceElement message. Does not implicitly {@link kritor.common.DiceElement.verify|verify} messages.
             * @function encode
             * @memberof kritor.common.DiceElement
             * @static
             * @param {kritor.common.IDiceElement} message DiceElement message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DiceElement.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.id);
                return writer;
            };

            /**
             * Encodes the specified DiceElement message, length delimited. Does not implicitly {@link kritor.common.DiceElement.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.common.DiceElement
             * @static
             * @param {kritor.common.IDiceElement} message DiceElement message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DiceElement.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a DiceElement message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.common.DiceElement
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.common.DiceElement} DiceElement
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DiceElement.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.common.DiceElement();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.id = reader.uint32();
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
             * Decodes a DiceElement message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.common.DiceElement
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.common.DiceElement} DiceElement
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DiceElement.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a DiceElement message.
             * @function verify
             * @memberof kritor.common.DiceElement
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            DiceElement.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.id != null && message.hasOwnProperty("id"))
                    if (!$util.isInteger(message.id))
                        return "id: integer expected";
                return null;
            };

            /**
             * Creates a DiceElement message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.common.DiceElement
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.common.DiceElement} DiceElement
             */
            DiceElement.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.common.DiceElement)
                    return object;
                let message = new $root.kritor.common.DiceElement();
                if (object.id != null)
                    message.id = object.id >>> 0;
                return message;
            };

            /**
             * Creates a plain object from a DiceElement message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.common.DiceElement
             * @static
             * @param {kritor.common.DiceElement} message DiceElement
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            DiceElement.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults)
                    object.id = 0;
                if (message.id != null && message.hasOwnProperty("id"))
                    object.id = message.id;
                return object;
            };

            /**
             * Converts this DiceElement to JSON.
             * @function toJSON
             * @memberof kritor.common.DiceElement
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            DiceElement.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for DiceElement
             * @function getTypeUrl
             * @memberof kritor.common.DiceElement
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            DiceElement.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.common.DiceElement";
            };

            return DiceElement;
        })();

        common.RpsElement = (function() {

            /**
             * Properties of a RpsElement.
             * @memberof kritor.common
             * @interface IRpsElement
             * @property {number|null} [id] RpsElement id
             */

            /**
             * Constructs a new RpsElement.
             * @memberof kritor.common
             * @classdesc Represents a RpsElement.
             * @implements IRpsElement
             * @constructor
             * @param {kritor.common.IRpsElement=} [properties] Properties to set
             */
            function RpsElement(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * RpsElement id.
             * @member {number} id
             * @memberof kritor.common.RpsElement
             * @instance
             */
            RpsElement.prototype.id = 0;

            /**
             * Creates a new RpsElement instance using the specified properties.
             * @function create
             * @memberof kritor.common.RpsElement
             * @static
             * @param {kritor.common.IRpsElement=} [properties] Properties to set
             * @returns {kritor.common.RpsElement} RpsElement instance
             */
            RpsElement.create = function create(properties) {
                return new RpsElement(properties);
            };

            /**
             * Encodes the specified RpsElement message. Does not implicitly {@link kritor.common.RpsElement.verify|verify} messages.
             * @function encode
             * @memberof kritor.common.RpsElement
             * @static
             * @param {kritor.common.IRpsElement} message RpsElement message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            RpsElement.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.id);
                return writer;
            };

            /**
             * Encodes the specified RpsElement message, length delimited. Does not implicitly {@link kritor.common.RpsElement.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.common.RpsElement
             * @static
             * @param {kritor.common.IRpsElement} message RpsElement message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            RpsElement.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a RpsElement message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.common.RpsElement
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.common.RpsElement} RpsElement
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            RpsElement.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.common.RpsElement();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.id = reader.uint32();
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
             * Decodes a RpsElement message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.common.RpsElement
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.common.RpsElement} RpsElement
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            RpsElement.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a RpsElement message.
             * @function verify
             * @memberof kritor.common.RpsElement
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            RpsElement.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.id != null && message.hasOwnProperty("id"))
                    if (!$util.isInteger(message.id))
                        return "id: integer expected";
                return null;
            };

            /**
             * Creates a RpsElement message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.common.RpsElement
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.common.RpsElement} RpsElement
             */
            RpsElement.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.common.RpsElement)
                    return object;
                let message = new $root.kritor.common.RpsElement();
                if (object.id != null)
                    message.id = object.id >>> 0;
                return message;
            };

            /**
             * Creates a plain object from a RpsElement message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.common.RpsElement
             * @static
             * @param {kritor.common.RpsElement} message RpsElement
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            RpsElement.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults)
                    object.id = 0;
                if (message.id != null && message.hasOwnProperty("id"))
                    object.id = message.id;
                return object;
            };

            /**
             * Converts this RpsElement to JSON.
             * @function toJSON
             * @memberof kritor.common.RpsElement
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            RpsElement.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for RpsElement
             * @function getTypeUrl
             * @memberof kritor.common.RpsElement
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            RpsElement.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.common.RpsElement";
            };

            return RpsElement;
        })();

        common.PokeElement = (function() {

            /**
             * Properties of a PokeElement.
             * @memberof kritor.common
             * @interface IPokeElement
             * @property {number|null} [id] PokeElement id
             * @property {number|null} [type] PokeElement type
             * @property {number|null} [strength] PokeElement strength
             */

            /**
             * Constructs a new PokeElement.
             * @memberof kritor.common
             * @classdesc Represents a PokeElement.
             * @implements IPokeElement
             * @constructor
             * @param {kritor.common.IPokeElement=} [properties] Properties to set
             */
            function PokeElement(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * PokeElement id.
             * @member {number} id
             * @memberof kritor.common.PokeElement
             * @instance
             */
            PokeElement.prototype.id = 0;

            /**
             * PokeElement type.
             * @member {number} type
             * @memberof kritor.common.PokeElement
             * @instance
             */
            PokeElement.prototype.type = 0;

            /**
             * PokeElement strength.
             * @member {number} strength
             * @memberof kritor.common.PokeElement
             * @instance
             */
            PokeElement.prototype.strength = 0;

            /**
             * Creates a new PokeElement instance using the specified properties.
             * @function create
             * @memberof kritor.common.PokeElement
             * @static
             * @param {kritor.common.IPokeElement=} [properties] Properties to set
             * @returns {kritor.common.PokeElement} PokeElement instance
             */
            PokeElement.create = function create(properties) {
                return new PokeElement(properties);
            };

            /**
             * Encodes the specified PokeElement message. Does not implicitly {@link kritor.common.PokeElement.verify|verify} messages.
             * @function encode
             * @memberof kritor.common.PokeElement
             * @static
             * @param {kritor.common.IPokeElement} message PokeElement message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            PokeElement.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.id);
                if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                    writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.type);
                if (message.strength != null && Object.hasOwnProperty.call(message, "strength"))
                    writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.strength);
                return writer;
            };

            /**
             * Encodes the specified PokeElement message, length delimited. Does not implicitly {@link kritor.common.PokeElement.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.common.PokeElement
             * @static
             * @param {kritor.common.IPokeElement} message PokeElement message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            PokeElement.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a PokeElement message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.common.PokeElement
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.common.PokeElement} PokeElement
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            PokeElement.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.common.PokeElement();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.id = reader.uint32();
                            break;
                        }
                    case 2: {
                            message.type = reader.uint32();
                            break;
                        }
                    case 3: {
                            message.strength = reader.uint32();
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
             * Decodes a PokeElement message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.common.PokeElement
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.common.PokeElement} PokeElement
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            PokeElement.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a PokeElement message.
             * @function verify
             * @memberof kritor.common.PokeElement
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            PokeElement.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.id != null && message.hasOwnProperty("id"))
                    if (!$util.isInteger(message.id))
                        return "id: integer expected";
                if (message.type != null && message.hasOwnProperty("type"))
                    if (!$util.isInteger(message.type))
                        return "type: integer expected";
                if (message.strength != null && message.hasOwnProperty("strength"))
                    if (!$util.isInteger(message.strength))
                        return "strength: integer expected";
                return null;
            };

            /**
             * Creates a PokeElement message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.common.PokeElement
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.common.PokeElement} PokeElement
             */
            PokeElement.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.common.PokeElement)
                    return object;
                let message = new $root.kritor.common.PokeElement();
                if (object.id != null)
                    message.id = object.id >>> 0;
                if (object.type != null)
                    message.type = object.type >>> 0;
                if (object.strength != null)
                    message.strength = object.strength >>> 0;
                return message;
            };

            /**
             * Creates a plain object from a PokeElement message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.common.PokeElement
             * @static
             * @param {kritor.common.PokeElement} message PokeElement
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            PokeElement.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.id = 0;
                    object.type = 0;
                    object.strength = 0;
                }
                if (message.id != null && message.hasOwnProperty("id"))
                    object.id = message.id;
                if (message.type != null && message.hasOwnProperty("type"))
                    object.type = message.type;
                if (message.strength != null && message.hasOwnProperty("strength"))
                    object.strength = message.strength;
                return object;
            };

            /**
             * Converts this PokeElement to JSON.
             * @function toJSON
             * @memberof kritor.common.PokeElement
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            PokeElement.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for PokeElement
             * @function getTypeUrl
             * @memberof kritor.common.PokeElement
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            PokeElement.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.common.PokeElement";
            };

            return PokeElement;
        })();

        common.CustomMusicData = (function() {

            /**
             * Properties of a CustomMusicData.
             * @memberof kritor.common
             * @interface ICustomMusicData
             * @property {string|null} [url] CustomMusicData url
             * @property {string|null} [audio] CustomMusicData audio
             * @property {string|null} [title] CustomMusicData title
             * @property {string|null} [author] CustomMusicData author
             * @property {string|null} [pic] CustomMusicData pic
             */

            /**
             * Constructs a new CustomMusicData.
             * @memberof kritor.common
             * @classdesc Represents a CustomMusicData.
             * @implements ICustomMusicData
             * @constructor
             * @param {kritor.common.ICustomMusicData=} [properties] Properties to set
             */
            function CustomMusicData(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * CustomMusicData url.
             * @member {string} url
             * @memberof kritor.common.CustomMusicData
             * @instance
             */
            CustomMusicData.prototype.url = "";

            /**
             * CustomMusicData audio.
             * @member {string} audio
             * @memberof kritor.common.CustomMusicData
             * @instance
             */
            CustomMusicData.prototype.audio = "";

            /**
             * CustomMusicData title.
             * @member {string} title
             * @memberof kritor.common.CustomMusicData
             * @instance
             */
            CustomMusicData.prototype.title = "";

            /**
             * CustomMusicData author.
             * @member {string} author
             * @memberof kritor.common.CustomMusicData
             * @instance
             */
            CustomMusicData.prototype.author = "";

            /**
             * CustomMusicData pic.
             * @member {string} pic
             * @memberof kritor.common.CustomMusicData
             * @instance
             */
            CustomMusicData.prototype.pic = "";

            /**
             * Creates a new CustomMusicData instance using the specified properties.
             * @function create
             * @memberof kritor.common.CustomMusicData
             * @static
             * @param {kritor.common.ICustomMusicData=} [properties] Properties to set
             * @returns {kritor.common.CustomMusicData} CustomMusicData instance
             */
            CustomMusicData.create = function create(properties) {
                return new CustomMusicData(properties);
            };

            /**
             * Encodes the specified CustomMusicData message. Does not implicitly {@link kritor.common.CustomMusicData.verify|verify} messages.
             * @function encode
             * @memberof kritor.common.CustomMusicData
             * @static
             * @param {kritor.common.ICustomMusicData} message CustomMusicData message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CustomMusicData.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.url != null && Object.hasOwnProperty.call(message, "url"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.url);
                if (message.audio != null && Object.hasOwnProperty.call(message, "audio"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.audio);
                if (message.title != null && Object.hasOwnProperty.call(message, "title"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.title);
                if (message.author != null && Object.hasOwnProperty.call(message, "author"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.author);
                if (message.pic != null && Object.hasOwnProperty.call(message, "pic"))
                    writer.uint32(/* id 5, wireType 2 =*/42).string(message.pic);
                return writer;
            };

            /**
             * Encodes the specified CustomMusicData message, length delimited. Does not implicitly {@link kritor.common.CustomMusicData.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.common.CustomMusicData
             * @static
             * @param {kritor.common.ICustomMusicData} message CustomMusicData message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CustomMusicData.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a CustomMusicData message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.common.CustomMusicData
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.common.CustomMusicData} CustomMusicData
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CustomMusicData.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.common.CustomMusicData();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.url = reader.string();
                            break;
                        }
                    case 2: {
                            message.audio = reader.string();
                            break;
                        }
                    case 3: {
                            message.title = reader.string();
                            break;
                        }
                    case 4: {
                            message.author = reader.string();
                            break;
                        }
                    case 5: {
                            message.pic = reader.string();
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
             * Decodes a CustomMusicData message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.common.CustomMusicData
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.common.CustomMusicData} CustomMusicData
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CustomMusicData.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a CustomMusicData message.
             * @function verify
             * @memberof kritor.common.CustomMusicData
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            CustomMusicData.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.url != null && message.hasOwnProperty("url"))
                    if (!$util.isString(message.url))
                        return "url: string expected";
                if (message.audio != null && message.hasOwnProperty("audio"))
                    if (!$util.isString(message.audio))
                        return "audio: string expected";
                if (message.title != null && message.hasOwnProperty("title"))
                    if (!$util.isString(message.title))
                        return "title: string expected";
                if (message.author != null && message.hasOwnProperty("author"))
                    if (!$util.isString(message.author))
                        return "author: string expected";
                if (message.pic != null && message.hasOwnProperty("pic"))
                    if (!$util.isString(message.pic))
                        return "pic: string expected";
                return null;
            };

            /**
             * Creates a CustomMusicData message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.common.CustomMusicData
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.common.CustomMusicData} CustomMusicData
             */
            CustomMusicData.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.common.CustomMusicData)
                    return object;
                let message = new $root.kritor.common.CustomMusicData();
                if (object.url != null)
                    message.url = String(object.url);
                if (object.audio != null)
                    message.audio = String(object.audio);
                if (object.title != null)
                    message.title = String(object.title);
                if (object.author != null)
                    message.author = String(object.author);
                if (object.pic != null)
                    message.pic = String(object.pic);
                return message;
            };

            /**
             * Creates a plain object from a CustomMusicData message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.common.CustomMusicData
             * @static
             * @param {kritor.common.CustomMusicData} message CustomMusicData
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            CustomMusicData.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.url = "";
                    object.audio = "";
                    object.title = "";
                    object.author = "";
                    object.pic = "";
                }
                if (message.url != null && message.hasOwnProperty("url"))
                    object.url = message.url;
                if (message.audio != null && message.hasOwnProperty("audio"))
                    object.audio = message.audio;
                if (message.title != null && message.hasOwnProperty("title"))
                    object.title = message.title;
                if (message.author != null && message.hasOwnProperty("author"))
                    object.author = message.author;
                if (message.pic != null && message.hasOwnProperty("pic"))
                    object.pic = message.pic;
                return object;
            };

            /**
             * Converts this CustomMusicData to JSON.
             * @function toJSON
             * @memberof kritor.common.CustomMusicData
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            CustomMusicData.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for CustomMusicData
             * @function getTypeUrl
             * @memberof kritor.common.CustomMusicData
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            CustomMusicData.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.common.CustomMusicData";
            };

            return CustomMusicData;
        })();

        common.MusicElement = (function() {

            /**
             * Properties of a MusicElement.
             * @memberof kritor.common
             * @interface IMusicElement
             * @property {kritor.common.MusicElement.MusicPlatform|null} [platform] MusicElement platform
             * @property {string|null} [id] MusicElement id
             * @property {kritor.common.ICustomMusicData|null} [custom] MusicElement custom
             */

            /**
             * Constructs a new MusicElement.
             * @memberof kritor.common
             * @classdesc Represents a MusicElement.
             * @implements IMusicElement
             * @constructor
             * @param {kritor.common.IMusicElement=} [properties] Properties to set
             */
            function MusicElement(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * MusicElement platform.
             * @member {kritor.common.MusicElement.MusicPlatform} platform
             * @memberof kritor.common.MusicElement
             * @instance
             */
            MusicElement.prototype.platform = 0;

            /**
             * MusicElement id.
             * @member {string|null|undefined} id
             * @memberof kritor.common.MusicElement
             * @instance
             */
            MusicElement.prototype.id = null;

            /**
             * MusicElement custom.
             * @member {kritor.common.ICustomMusicData|null|undefined} custom
             * @memberof kritor.common.MusicElement
             * @instance
             */
            MusicElement.prototype.custom = null;

            // OneOf field names bound to virtual getters and setters
            let $oneOfFields;

            /**
             * MusicElement data.
             * @member {"id"|"custom"|undefined} data
             * @memberof kritor.common.MusicElement
             * @instance
             */
            Object.defineProperty(MusicElement.prototype, "data", {
                get: $util.oneOfGetter($oneOfFields = ["id", "custom"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new MusicElement instance using the specified properties.
             * @function create
             * @memberof kritor.common.MusicElement
             * @static
             * @param {kritor.common.IMusicElement=} [properties] Properties to set
             * @returns {kritor.common.MusicElement} MusicElement instance
             */
            MusicElement.create = function create(properties) {
                return new MusicElement(properties);
            };

            /**
             * Encodes the specified MusicElement message. Does not implicitly {@link kritor.common.MusicElement.verify|verify} messages.
             * @function encode
             * @memberof kritor.common.MusicElement
             * @static
             * @param {kritor.common.IMusicElement} message MusicElement message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            MusicElement.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.platform != null && Object.hasOwnProperty.call(message, "platform"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int32(message.platform);
                if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.id);
                if (message.custom != null && Object.hasOwnProperty.call(message, "custom"))
                    $root.kritor.common.CustomMusicData.encode(message.custom, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified MusicElement message, length delimited. Does not implicitly {@link kritor.common.MusicElement.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.common.MusicElement
             * @static
             * @param {kritor.common.IMusicElement} message MusicElement message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            MusicElement.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a MusicElement message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.common.MusicElement
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.common.MusicElement} MusicElement
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            MusicElement.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.common.MusicElement();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.platform = reader.int32();
                            break;
                        }
                    case 2: {
                            message.id = reader.string();
                            break;
                        }
                    case 3: {
                            message.custom = $root.kritor.common.CustomMusicData.decode(reader, reader.uint32());
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
             * Decodes a MusicElement message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.common.MusicElement
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.common.MusicElement} MusicElement
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            MusicElement.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a MusicElement message.
             * @function verify
             * @memberof kritor.common.MusicElement
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            MusicElement.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                let properties = {};
                if (message.platform != null && message.hasOwnProperty("platform"))
                    switch (message.platform) {
                    default:
                        return "platform: enum value expected";
                    case 0:
                    case 1:
                    case 10:
                        break;
                    }
                if (message.id != null && message.hasOwnProperty("id")) {
                    properties.data = 1;
                    if (!$util.isString(message.id))
                        return "id: string expected";
                }
                if (message.custom != null && message.hasOwnProperty("custom")) {
                    if (properties.data === 1)
                        return "data: multiple values";
                    properties.data = 1;
                    {
                        let error = $root.kritor.common.CustomMusicData.verify(message.custom);
                        if (error)
                            return "custom." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a MusicElement message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.common.MusicElement
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.common.MusicElement} MusicElement
             */
            MusicElement.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.common.MusicElement)
                    return object;
                let message = new $root.kritor.common.MusicElement();
                switch (object.platform) {
                default:
                    if (typeof object.platform === "number") {
                        message.platform = object.platform;
                        break;
                    }
                    break;
                case "QQ":
                case 0:
                    message.platform = 0;
                    break;
                case "NetEase":
                case 1:
                    message.platform = 1;
                    break;
                case "Custom":
                case 10:
                    message.platform = 10;
                    break;
                }
                if (object.id != null)
                    message.id = String(object.id);
                if (object.custom != null) {
                    if (typeof object.custom !== "object")
                        throw TypeError(".kritor.common.MusicElement.custom: object expected");
                    message.custom = $root.kritor.common.CustomMusicData.fromObject(object.custom);
                }
                return message;
            };

            /**
             * Creates a plain object from a MusicElement message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.common.MusicElement
             * @static
             * @param {kritor.common.MusicElement} message MusicElement
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            MusicElement.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults)
                    object.platform = options.enums === String ? "QQ" : 0;
                if (message.platform != null && message.hasOwnProperty("platform"))
                    object.platform = options.enums === String ? $root.kritor.common.MusicElement.MusicPlatform[message.platform] === undefined ? message.platform : $root.kritor.common.MusicElement.MusicPlatform[message.platform] : message.platform;
                if (message.id != null && message.hasOwnProperty("id")) {
                    object.id = message.id;
                    if (options.oneofs)
                        object.data = "id";
                }
                if (message.custom != null && message.hasOwnProperty("custom")) {
                    object.custom = $root.kritor.common.CustomMusicData.toObject(message.custom, options);
                    if (options.oneofs)
                        object.data = "custom";
                }
                return object;
            };

            /**
             * Converts this MusicElement to JSON.
             * @function toJSON
             * @memberof kritor.common.MusicElement
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            MusicElement.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for MusicElement
             * @function getTypeUrl
             * @memberof kritor.common.MusicElement
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            MusicElement.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.common.MusicElement";
            };

            /**
             * MusicPlatform enum.
             * @name kritor.common.MusicElement.MusicPlatform
             * @enum {number}
             * @property {number} QQ=0 QQ value
             * @property {number} NetEase=1 NetEase value
             * @property {number} Custom=10 Custom value
             */
            MusicElement.MusicPlatform = (function() {
                const valuesById = {}, values = Object.create(valuesById);
                values[valuesById[0] = "QQ"] = 0;
                values[valuesById[1] = "NetEase"] = 1;
                values[valuesById[10] = "Custom"] = 10;
                return values;
            })();

            return MusicElement;
        })();

        common.WeatherElement = (function() {

            /**
             * Properties of a WeatherElement.
             * @memberof kritor.common
             * @interface IWeatherElement
             * @property {string|null} [city] WeatherElement city
             * @property {string|null} [code] WeatherElement code
             */

            /**
             * Constructs a new WeatherElement.
             * @memberof kritor.common
             * @classdesc Represents a WeatherElement.
             * @implements IWeatherElement
             * @constructor
             * @param {kritor.common.IWeatherElement=} [properties] Properties to set
             */
            function WeatherElement(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * WeatherElement city.
             * @member {string} city
             * @memberof kritor.common.WeatherElement
             * @instance
             */
            WeatherElement.prototype.city = "";

            /**
             * WeatherElement code.
             * @member {string} code
             * @memberof kritor.common.WeatherElement
             * @instance
             */
            WeatherElement.prototype.code = "";

            /**
             * Creates a new WeatherElement instance using the specified properties.
             * @function create
             * @memberof kritor.common.WeatherElement
             * @static
             * @param {kritor.common.IWeatherElement=} [properties] Properties to set
             * @returns {kritor.common.WeatherElement} WeatherElement instance
             */
            WeatherElement.create = function create(properties) {
                return new WeatherElement(properties);
            };

            /**
             * Encodes the specified WeatherElement message. Does not implicitly {@link kritor.common.WeatherElement.verify|verify} messages.
             * @function encode
             * @memberof kritor.common.WeatherElement
             * @static
             * @param {kritor.common.IWeatherElement} message WeatherElement message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            WeatherElement.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.city != null && Object.hasOwnProperty.call(message, "city"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.city);
                if (message.code != null && Object.hasOwnProperty.call(message, "code"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.code);
                return writer;
            };

            /**
             * Encodes the specified WeatherElement message, length delimited. Does not implicitly {@link kritor.common.WeatherElement.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.common.WeatherElement
             * @static
             * @param {kritor.common.IWeatherElement} message WeatherElement message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            WeatherElement.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a WeatherElement message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.common.WeatherElement
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.common.WeatherElement} WeatherElement
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            WeatherElement.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.common.WeatherElement();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.city = reader.string();
                            break;
                        }
                    case 2: {
                            message.code = reader.string();
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
             * Decodes a WeatherElement message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.common.WeatherElement
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.common.WeatherElement} WeatherElement
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            WeatherElement.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a WeatherElement message.
             * @function verify
             * @memberof kritor.common.WeatherElement
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            WeatherElement.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.city != null && message.hasOwnProperty("city"))
                    if (!$util.isString(message.city))
                        return "city: string expected";
                if (message.code != null && message.hasOwnProperty("code"))
                    if (!$util.isString(message.code))
                        return "code: string expected";
                return null;
            };

            /**
             * Creates a WeatherElement message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.common.WeatherElement
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.common.WeatherElement} WeatherElement
             */
            WeatherElement.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.common.WeatherElement)
                    return object;
                let message = new $root.kritor.common.WeatherElement();
                if (object.city != null)
                    message.city = String(object.city);
                if (object.code != null)
                    message.code = String(object.code);
                return message;
            };

            /**
             * Creates a plain object from a WeatherElement message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.common.WeatherElement
             * @static
             * @param {kritor.common.WeatherElement} message WeatherElement
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            WeatherElement.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.city = "";
                    object.code = "";
                }
                if (message.city != null && message.hasOwnProperty("city"))
                    object.city = message.city;
                if (message.code != null && message.hasOwnProperty("code"))
                    object.code = message.code;
                return object;
            };

            /**
             * Converts this WeatherElement to JSON.
             * @function toJSON
             * @memberof kritor.common.WeatherElement
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            WeatherElement.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for WeatherElement
             * @function getTypeUrl
             * @memberof kritor.common.WeatherElement
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            WeatherElement.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.common.WeatherElement";
            };

            return WeatherElement;
        })();

        common.LocationElement = (function() {

            /**
             * Properties of a LocationElement.
             * @memberof kritor.common
             * @interface ILocationElement
             * @property {number|null} [lat] LocationElement lat
             * @property {number|null} [lon] LocationElement lon
             * @property {string|null} [title] LocationElement title
             * @property {string|null} [address] LocationElement address
             */

            /**
             * Constructs a new LocationElement.
             * @memberof kritor.common
             * @classdesc Represents a LocationElement.
             * @implements ILocationElement
             * @constructor
             * @param {kritor.common.ILocationElement=} [properties] Properties to set
             */
            function LocationElement(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * LocationElement lat.
             * @member {number} lat
             * @memberof kritor.common.LocationElement
             * @instance
             */
            LocationElement.prototype.lat = 0;

            /**
             * LocationElement lon.
             * @member {number} lon
             * @memberof kritor.common.LocationElement
             * @instance
             */
            LocationElement.prototype.lon = 0;

            /**
             * LocationElement title.
             * @member {string} title
             * @memberof kritor.common.LocationElement
             * @instance
             */
            LocationElement.prototype.title = "";

            /**
             * LocationElement address.
             * @member {string} address
             * @memberof kritor.common.LocationElement
             * @instance
             */
            LocationElement.prototype.address = "";

            /**
             * Creates a new LocationElement instance using the specified properties.
             * @function create
             * @memberof kritor.common.LocationElement
             * @static
             * @param {kritor.common.ILocationElement=} [properties] Properties to set
             * @returns {kritor.common.LocationElement} LocationElement instance
             */
            LocationElement.create = function create(properties) {
                return new LocationElement(properties);
            };

            /**
             * Encodes the specified LocationElement message. Does not implicitly {@link kritor.common.LocationElement.verify|verify} messages.
             * @function encode
             * @memberof kritor.common.LocationElement
             * @static
             * @param {kritor.common.ILocationElement} message LocationElement message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            LocationElement.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.lat != null && Object.hasOwnProperty.call(message, "lat"))
                    writer.uint32(/* id 1, wireType 5 =*/13).float(message.lat);
                if (message.lon != null && Object.hasOwnProperty.call(message, "lon"))
                    writer.uint32(/* id 2, wireType 5 =*/21).float(message.lon);
                if (message.title != null && Object.hasOwnProperty.call(message, "title"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.title);
                if (message.address != null && Object.hasOwnProperty.call(message, "address"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.address);
                return writer;
            };

            /**
             * Encodes the specified LocationElement message, length delimited. Does not implicitly {@link kritor.common.LocationElement.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.common.LocationElement
             * @static
             * @param {kritor.common.ILocationElement} message LocationElement message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            LocationElement.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a LocationElement message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.common.LocationElement
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.common.LocationElement} LocationElement
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            LocationElement.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.common.LocationElement();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.lat = reader.float();
                            break;
                        }
                    case 2: {
                            message.lon = reader.float();
                            break;
                        }
                    case 3: {
                            message.title = reader.string();
                            break;
                        }
                    case 4: {
                            message.address = reader.string();
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
             * Decodes a LocationElement message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.common.LocationElement
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.common.LocationElement} LocationElement
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            LocationElement.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a LocationElement message.
             * @function verify
             * @memberof kritor.common.LocationElement
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            LocationElement.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.lat != null && message.hasOwnProperty("lat"))
                    if (typeof message.lat !== "number")
                        return "lat: number expected";
                if (message.lon != null && message.hasOwnProperty("lon"))
                    if (typeof message.lon !== "number")
                        return "lon: number expected";
                if (message.title != null && message.hasOwnProperty("title"))
                    if (!$util.isString(message.title))
                        return "title: string expected";
                if (message.address != null && message.hasOwnProperty("address"))
                    if (!$util.isString(message.address))
                        return "address: string expected";
                return null;
            };

            /**
             * Creates a LocationElement message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.common.LocationElement
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.common.LocationElement} LocationElement
             */
            LocationElement.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.common.LocationElement)
                    return object;
                let message = new $root.kritor.common.LocationElement();
                if (object.lat != null)
                    message.lat = Number(object.lat);
                if (object.lon != null)
                    message.lon = Number(object.lon);
                if (object.title != null)
                    message.title = String(object.title);
                if (object.address != null)
                    message.address = String(object.address);
                return message;
            };

            /**
             * Creates a plain object from a LocationElement message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.common.LocationElement
             * @static
             * @param {kritor.common.LocationElement} message LocationElement
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            LocationElement.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.lat = 0;
                    object.lon = 0;
                    object.title = "";
                    object.address = "";
                }
                if (message.lat != null && message.hasOwnProperty("lat"))
                    object.lat = options.json && !isFinite(message.lat) ? String(message.lat) : message.lat;
                if (message.lon != null && message.hasOwnProperty("lon"))
                    object.lon = options.json && !isFinite(message.lon) ? String(message.lon) : message.lon;
                if (message.title != null && message.hasOwnProperty("title"))
                    object.title = message.title;
                if (message.address != null && message.hasOwnProperty("address"))
                    object.address = message.address;
                return object;
            };

            /**
             * Converts this LocationElement to JSON.
             * @function toJSON
             * @memberof kritor.common.LocationElement
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            LocationElement.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for LocationElement
             * @function getTypeUrl
             * @memberof kritor.common.LocationElement
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            LocationElement.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.common.LocationElement";
            };

            return LocationElement;
        })();

        common.ShareElement = (function() {

            /**
             * Properties of a ShareElement.
             * @memberof kritor.common
             * @interface IShareElement
             * @property {string|null} [url] ShareElement url
             * @property {string|null} [title] ShareElement title
             * @property {string|null} [content] ShareElement content
             * @property {string|null} [image] ShareElement image
             */

            /**
             * Constructs a new ShareElement.
             * @memberof kritor.common
             * @classdesc Represents a ShareElement.
             * @implements IShareElement
             * @constructor
             * @param {kritor.common.IShareElement=} [properties] Properties to set
             */
            function ShareElement(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * ShareElement url.
             * @member {string} url
             * @memberof kritor.common.ShareElement
             * @instance
             */
            ShareElement.prototype.url = "";

            /**
             * ShareElement title.
             * @member {string} title
             * @memberof kritor.common.ShareElement
             * @instance
             */
            ShareElement.prototype.title = "";

            /**
             * ShareElement content.
             * @member {string} content
             * @memberof kritor.common.ShareElement
             * @instance
             */
            ShareElement.prototype.content = "";

            /**
             * ShareElement image.
             * @member {string} image
             * @memberof kritor.common.ShareElement
             * @instance
             */
            ShareElement.prototype.image = "";

            /**
             * Creates a new ShareElement instance using the specified properties.
             * @function create
             * @memberof kritor.common.ShareElement
             * @static
             * @param {kritor.common.IShareElement=} [properties] Properties to set
             * @returns {kritor.common.ShareElement} ShareElement instance
             */
            ShareElement.create = function create(properties) {
                return new ShareElement(properties);
            };

            /**
             * Encodes the specified ShareElement message. Does not implicitly {@link kritor.common.ShareElement.verify|verify} messages.
             * @function encode
             * @memberof kritor.common.ShareElement
             * @static
             * @param {kritor.common.IShareElement} message ShareElement message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ShareElement.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.url != null && Object.hasOwnProperty.call(message, "url"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.url);
                if (message.title != null && Object.hasOwnProperty.call(message, "title"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.title);
                if (message.content != null && Object.hasOwnProperty.call(message, "content"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.content);
                if (message.image != null && Object.hasOwnProperty.call(message, "image"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.image);
                return writer;
            };

            /**
             * Encodes the specified ShareElement message, length delimited. Does not implicitly {@link kritor.common.ShareElement.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.common.ShareElement
             * @static
             * @param {kritor.common.IShareElement} message ShareElement message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ShareElement.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a ShareElement message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.common.ShareElement
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.common.ShareElement} ShareElement
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ShareElement.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.common.ShareElement();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.url = reader.string();
                            break;
                        }
                    case 2: {
                            message.title = reader.string();
                            break;
                        }
                    case 3: {
                            message.content = reader.string();
                            break;
                        }
                    case 4: {
                            message.image = reader.string();
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
             * Decodes a ShareElement message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.common.ShareElement
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.common.ShareElement} ShareElement
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ShareElement.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a ShareElement message.
             * @function verify
             * @memberof kritor.common.ShareElement
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ShareElement.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.url != null && message.hasOwnProperty("url"))
                    if (!$util.isString(message.url))
                        return "url: string expected";
                if (message.title != null && message.hasOwnProperty("title"))
                    if (!$util.isString(message.title))
                        return "title: string expected";
                if (message.content != null && message.hasOwnProperty("content"))
                    if (!$util.isString(message.content))
                        return "content: string expected";
                if (message.image != null && message.hasOwnProperty("image"))
                    if (!$util.isString(message.image))
                        return "image: string expected";
                return null;
            };

            /**
             * Creates a ShareElement message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.common.ShareElement
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.common.ShareElement} ShareElement
             */
            ShareElement.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.common.ShareElement)
                    return object;
                let message = new $root.kritor.common.ShareElement();
                if (object.url != null)
                    message.url = String(object.url);
                if (object.title != null)
                    message.title = String(object.title);
                if (object.content != null)
                    message.content = String(object.content);
                if (object.image != null)
                    message.image = String(object.image);
                return message;
            };

            /**
             * Creates a plain object from a ShareElement message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.common.ShareElement
             * @static
             * @param {kritor.common.ShareElement} message ShareElement
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ShareElement.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.url = "";
                    object.title = "";
                    object.content = "";
                    object.image = "";
                }
                if (message.url != null && message.hasOwnProperty("url"))
                    object.url = message.url;
                if (message.title != null && message.hasOwnProperty("title"))
                    object.title = message.title;
                if (message.content != null && message.hasOwnProperty("content"))
                    object.content = message.content;
                if (message.image != null && message.hasOwnProperty("image"))
                    object.image = message.image;
                return object;
            };

            /**
             * Converts this ShareElement to JSON.
             * @function toJSON
             * @memberof kritor.common.ShareElement
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ShareElement.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for ShareElement
             * @function getTypeUrl
             * @memberof kritor.common.ShareElement
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            ShareElement.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.common.ShareElement";
            };

            return ShareElement;
        })();

        common.GiftElement = (function() {

            /**
             * Properties of a GiftElement.
             * @memberof kritor.common
             * @interface IGiftElement
             * @property {number|Long|null} [qq] GiftElement qq
             * @property {number|null} [id] GiftElement id
             */

            /**
             * Constructs a new GiftElement.
             * @memberof kritor.common
             * @classdesc Represents a GiftElement.
             * @implements IGiftElement
             * @constructor
             * @param {kritor.common.IGiftElement=} [properties] Properties to set
             */
            function GiftElement(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GiftElement qq.
             * @member {number|Long} qq
             * @memberof kritor.common.GiftElement
             * @instance
             */
            GiftElement.prototype.qq = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * GiftElement id.
             * @member {number} id
             * @memberof kritor.common.GiftElement
             * @instance
             */
            GiftElement.prototype.id = 0;

            /**
             * Creates a new GiftElement instance using the specified properties.
             * @function create
             * @memberof kritor.common.GiftElement
             * @static
             * @param {kritor.common.IGiftElement=} [properties] Properties to set
             * @returns {kritor.common.GiftElement} GiftElement instance
             */
            GiftElement.create = function create(properties) {
                return new GiftElement(properties);
            };

            /**
             * Encodes the specified GiftElement message. Does not implicitly {@link kritor.common.GiftElement.verify|verify} messages.
             * @function encode
             * @memberof kritor.common.GiftElement
             * @static
             * @param {kritor.common.IGiftElement} message GiftElement message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GiftElement.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.qq != null && Object.hasOwnProperty.call(message, "qq"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.qq);
                if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                    writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.id);
                return writer;
            };

            /**
             * Encodes the specified GiftElement message, length delimited. Does not implicitly {@link kritor.common.GiftElement.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.common.GiftElement
             * @static
             * @param {kritor.common.IGiftElement} message GiftElement message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GiftElement.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GiftElement message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.common.GiftElement
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.common.GiftElement} GiftElement
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GiftElement.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.common.GiftElement();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.qq = reader.uint64();
                            break;
                        }
                    case 2: {
                            message.id = reader.uint32();
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
             * Decodes a GiftElement message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.common.GiftElement
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.common.GiftElement} GiftElement
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GiftElement.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GiftElement message.
             * @function verify
             * @memberof kritor.common.GiftElement
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GiftElement.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.qq != null && message.hasOwnProperty("qq"))
                    if (!$util.isInteger(message.qq) && !(message.qq && $util.isInteger(message.qq.low) && $util.isInteger(message.qq.high)))
                        return "qq: integer|Long expected";
                if (message.id != null && message.hasOwnProperty("id"))
                    if (!$util.isInteger(message.id))
                        return "id: integer expected";
                return null;
            };

            /**
             * Creates a GiftElement message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.common.GiftElement
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.common.GiftElement} GiftElement
             */
            GiftElement.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.common.GiftElement)
                    return object;
                let message = new $root.kritor.common.GiftElement();
                if (object.qq != null)
                    if ($util.Long)
                        (message.qq = $util.Long.fromValue(object.qq)).unsigned = true;
                    else if (typeof object.qq === "string")
                        message.qq = parseInt(object.qq, 10);
                    else if (typeof object.qq === "number")
                        message.qq = object.qq;
                    else if (typeof object.qq === "object")
                        message.qq = new $util.LongBits(object.qq.low >>> 0, object.qq.high >>> 0).toNumber(true);
                if (object.id != null)
                    message.id = object.id >>> 0;
                return message;
            };

            /**
             * Creates a plain object from a GiftElement message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.common.GiftElement
             * @static
             * @param {kritor.common.GiftElement} message GiftElement
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GiftElement.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.qq = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.qq = options.longs === String ? "0" : 0;
                    object.id = 0;
                }
                if (message.qq != null && message.hasOwnProperty("qq"))
                    if (typeof message.qq === "number")
                        object.qq = options.longs === String ? String(message.qq) : message.qq;
                    else
                        object.qq = options.longs === String ? $util.Long.prototype.toString.call(message.qq) : options.longs === Number ? new $util.LongBits(message.qq.low >>> 0, message.qq.high >>> 0).toNumber(true) : message.qq;
                if (message.id != null && message.hasOwnProperty("id"))
                    object.id = message.id;
                return object;
            };

            /**
             * Converts this GiftElement to JSON.
             * @function toJSON
             * @memberof kritor.common.GiftElement
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GiftElement.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GiftElement
             * @function getTypeUrl
             * @memberof kritor.common.GiftElement
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GiftElement.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.common.GiftElement";
            };

            return GiftElement;
        })();

        common.MarketFaceElement = (function() {

            /**
             * Properties of a MarketFaceElement.
             * @memberof kritor.common
             * @interface IMarketFaceElement
             * @property {string|null} [id] MarketFaceElement id
             */

            /**
             * Constructs a new MarketFaceElement.
             * @memberof kritor.common
             * @classdesc Represents a MarketFaceElement.
             * @implements IMarketFaceElement
             * @constructor
             * @param {kritor.common.IMarketFaceElement=} [properties] Properties to set
             */
            function MarketFaceElement(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * MarketFaceElement id.
             * @member {string} id
             * @memberof kritor.common.MarketFaceElement
             * @instance
             */
            MarketFaceElement.prototype.id = "";

            /**
             * Creates a new MarketFaceElement instance using the specified properties.
             * @function create
             * @memberof kritor.common.MarketFaceElement
             * @static
             * @param {kritor.common.IMarketFaceElement=} [properties] Properties to set
             * @returns {kritor.common.MarketFaceElement} MarketFaceElement instance
             */
            MarketFaceElement.create = function create(properties) {
                return new MarketFaceElement(properties);
            };

            /**
             * Encodes the specified MarketFaceElement message. Does not implicitly {@link kritor.common.MarketFaceElement.verify|verify} messages.
             * @function encode
             * @memberof kritor.common.MarketFaceElement
             * @static
             * @param {kritor.common.IMarketFaceElement} message MarketFaceElement message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            MarketFaceElement.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
                return writer;
            };

            /**
             * Encodes the specified MarketFaceElement message, length delimited. Does not implicitly {@link kritor.common.MarketFaceElement.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.common.MarketFaceElement
             * @static
             * @param {kritor.common.IMarketFaceElement} message MarketFaceElement message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            MarketFaceElement.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a MarketFaceElement message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.common.MarketFaceElement
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.common.MarketFaceElement} MarketFaceElement
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            MarketFaceElement.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.common.MarketFaceElement();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.id = reader.string();
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
             * Decodes a MarketFaceElement message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.common.MarketFaceElement
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.common.MarketFaceElement} MarketFaceElement
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            MarketFaceElement.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a MarketFaceElement message.
             * @function verify
             * @memberof kritor.common.MarketFaceElement
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            MarketFaceElement.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.id != null && message.hasOwnProperty("id"))
                    if (!$util.isString(message.id))
                        return "id: string expected";
                return null;
            };

            /**
             * Creates a MarketFaceElement message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.common.MarketFaceElement
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.common.MarketFaceElement} MarketFaceElement
             */
            MarketFaceElement.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.common.MarketFaceElement)
                    return object;
                let message = new $root.kritor.common.MarketFaceElement();
                if (object.id != null)
                    message.id = String(object.id);
                return message;
            };

            /**
             * Creates a plain object from a MarketFaceElement message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.common.MarketFaceElement
             * @static
             * @param {kritor.common.MarketFaceElement} message MarketFaceElement
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            MarketFaceElement.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults)
                    object.id = "";
                if (message.id != null && message.hasOwnProperty("id"))
                    object.id = message.id;
                return object;
            };

            /**
             * Converts this MarketFaceElement to JSON.
             * @function toJSON
             * @memberof kritor.common.MarketFaceElement
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            MarketFaceElement.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for MarketFaceElement
             * @function getTypeUrl
             * @memberof kritor.common.MarketFaceElement
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            MarketFaceElement.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.common.MarketFaceElement";
            };

            return MarketFaceElement;
        })();

        common.ForwardElement = (function() {

            /**
             * Properties of a ForwardElement.
             * @memberof kritor.common
             * @interface IForwardElement
             * @property {string|null} [resId] ForwardElement resId
             * @property {string|null} [uniseq] ForwardElement uniseq
             * @property {string|null} [summary] ForwardElement summary
             * @property {string|null} [description] ForwardElement description
             */

            /**
             * Constructs a new ForwardElement.
             * @memberof kritor.common
             * @classdesc Represents a ForwardElement.
             * @implements IForwardElement
             * @constructor
             * @param {kritor.common.IForwardElement=} [properties] Properties to set
             */
            function ForwardElement(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * ForwardElement resId.
             * @member {string} resId
             * @memberof kritor.common.ForwardElement
             * @instance
             */
            ForwardElement.prototype.resId = "";

            /**
             * ForwardElement uniseq.
             * @member {string} uniseq
             * @memberof kritor.common.ForwardElement
             * @instance
             */
            ForwardElement.prototype.uniseq = "";

            /**
             * ForwardElement summary.
             * @member {string} summary
             * @memberof kritor.common.ForwardElement
             * @instance
             */
            ForwardElement.prototype.summary = "";

            /**
             * ForwardElement description.
             * @member {string} description
             * @memberof kritor.common.ForwardElement
             * @instance
             */
            ForwardElement.prototype.description = "";

            /**
             * Creates a new ForwardElement instance using the specified properties.
             * @function create
             * @memberof kritor.common.ForwardElement
             * @static
             * @param {kritor.common.IForwardElement=} [properties] Properties to set
             * @returns {kritor.common.ForwardElement} ForwardElement instance
             */
            ForwardElement.create = function create(properties) {
                return new ForwardElement(properties);
            };

            /**
             * Encodes the specified ForwardElement message. Does not implicitly {@link kritor.common.ForwardElement.verify|verify} messages.
             * @function encode
             * @memberof kritor.common.ForwardElement
             * @static
             * @param {kritor.common.IForwardElement} message ForwardElement message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ForwardElement.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.resId != null && Object.hasOwnProperty.call(message, "resId"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.resId);
                if (message.uniseq != null && Object.hasOwnProperty.call(message, "uniseq"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.uniseq);
                if (message.summary != null && Object.hasOwnProperty.call(message, "summary"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.summary);
                if (message.description != null && Object.hasOwnProperty.call(message, "description"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.description);
                return writer;
            };

            /**
             * Encodes the specified ForwardElement message, length delimited. Does not implicitly {@link kritor.common.ForwardElement.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.common.ForwardElement
             * @static
             * @param {kritor.common.IForwardElement} message ForwardElement message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ForwardElement.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a ForwardElement message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.common.ForwardElement
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.common.ForwardElement} ForwardElement
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ForwardElement.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.common.ForwardElement();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.resId = reader.string();
                            break;
                        }
                    case 2: {
                            message.uniseq = reader.string();
                            break;
                        }
                    case 3: {
                            message.summary = reader.string();
                            break;
                        }
                    case 4: {
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
             * Decodes a ForwardElement message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.common.ForwardElement
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.common.ForwardElement} ForwardElement
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ForwardElement.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a ForwardElement message.
             * @function verify
             * @memberof kritor.common.ForwardElement
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ForwardElement.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.resId != null && message.hasOwnProperty("resId"))
                    if (!$util.isString(message.resId))
                        return "resId: string expected";
                if (message.uniseq != null && message.hasOwnProperty("uniseq"))
                    if (!$util.isString(message.uniseq))
                        return "uniseq: string expected";
                if (message.summary != null && message.hasOwnProperty("summary"))
                    if (!$util.isString(message.summary))
                        return "summary: string expected";
                if (message.description != null && message.hasOwnProperty("description"))
                    if (!$util.isString(message.description))
                        return "description: string expected";
                return null;
            };

            /**
             * Creates a ForwardElement message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.common.ForwardElement
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.common.ForwardElement} ForwardElement
             */
            ForwardElement.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.common.ForwardElement)
                    return object;
                let message = new $root.kritor.common.ForwardElement();
                if (object.resId != null)
                    message.resId = String(object.resId);
                if (object.uniseq != null)
                    message.uniseq = String(object.uniseq);
                if (object.summary != null)
                    message.summary = String(object.summary);
                if (object.description != null)
                    message.description = String(object.description);
                return message;
            };

            /**
             * Creates a plain object from a ForwardElement message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.common.ForwardElement
             * @static
             * @param {kritor.common.ForwardElement} message ForwardElement
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ForwardElement.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.resId = "";
                    object.uniseq = "";
                    object.summary = "";
                    object.description = "";
                }
                if (message.resId != null && message.hasOwnProperty("resId"))
                    object.resId = message.resId;
                if (message.uniseq != null && message.hasOwnProperty("uniseq"))
                    object.uniseq = message.uniseq;
                if (message.summary != null && message.hasOwnProperty("summary"))
                    object.summary = message.summary;
                if (message.description != null && message.hasOwnProperty("description"))
                    object.description = message.description;
                return object;
            };

            /**
             * Converts this ForwardElement to JSON.
             * @function toJSON
             * @memberof kritor.common.ForwardElement
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ForwardElement.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for ForwardElement
             * @function getTypeUrl
             * @memberof kritor.common.ForwardElement
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            ForwardElement.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.common.ForwardElement";
            };

            return ForwardElement;
        })();

        common.ContactElement = (function() {

            /**
             * Properties of a ContactElement.
             * @memberof kritor.common
             * @interface IContactElement
             * @property {kritor.common.Scene|null} [scene] ContactElement scene
             * @property {string|null} [peer] ContactElement peer
             */

            /**
             * Constructs a new ContactElement.
             * @memberof kritor.common
             * @classdesc Represents a ContactElement.
             * @implements IContactElement
             * @constructor
             * @param {kritor.common.IContactElement=} [properties] Properties to set
             */
            function ContactElement(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * ContactElement scene.
             * @member {kritor.common.Scene} scene
             * @memberof kritor.common.ContactElement
             * @instance
             */
            ContactElement.prototype.scene = 0;

            /**
             * ContactElement peer.
             * @member {string} peer
             * @memberof kritor.common.ContactElement
             * @instance
             */
            ContactElement.prototype.peer = "";

            /**
             * Creates a new ContactElement instance using the specified properties.
             * @function create
             * @memberof kritor.common.ContactElement
             * @static
             * @param {kritor.common.IContactElement=} [properties] Properties to set
             * @returns {kritor.common.ContactElement} ContactElement instance
             */
            ContactElement.create = function create(properties) {
                return new ContactElement(properties);
            };

            /**
             * Encodes the specified ContactElement message. Does not implicitly {@link kritor.common.ContactElement.verify|verify} messages.
             * @function encode
             * @memberof kritor.common.ContactElement
             * @static
             * @param {kritor.common.IContactElement} message ContactElement message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ContactElement.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.scene != null && Object.hasOwnProperty.call(message, "scene"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int32(message.scene);
                if (message.peer != null && Object.hasOwnProperty.call(message, "peer"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.peer);
                return writer;
            };

            /**
             * Encodes the specified ContactElement message, length delimited. Does not implicitly {@link kritor.common.ContactElement.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.common.ContactElement
             * @static
             * @param {kritor.common.IContactElement} message ContactElement message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ContactElement.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a ContactElement message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.common.ContactElement
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.common.ContactElement} ContactElement
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ContactElement.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.common.ContactElement();
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
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a ContactElement message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.common.ContactElement
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.common.ContactElement} ContactElement
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ContactElement.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a ContactElement message.
             * @function verify
             * @memberof kritor.common.ContactElement
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ContactElement.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
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
                return null;
            };

            /**
             * Creates a ContactElement message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.common.ContactElement
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.common.ContactElement} ContactElement
             */
            ContactElement.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.common.ContactElement)
                    return object;
                let message = new $root.kritor.common.ContactElement();
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
                return message;
            };

            /**
             * Creates a plain object from a ContactElement message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.common.ContactElement
             * @static
             * @param {kritor.common.ContactElement} message ContactElement
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ContactElement.toObject = function toObject(message, options) {
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
                return object;
            };

            /**
             * Converts this ContactElement to JSON.
             * @function toJSON
             * @memberof kritor.common.ContactElement
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ContactElement.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for ContactElement
             * @function getTypeUrl
             * @memberof kritor.common.ContactElement
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            ContactElement.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.common.ContactElement";
            };

            return ContactElement;
        })();

        common.JsonElement = (function() {

            /**
             * Properties of a JsonElement.
             * @memberof kritor.common
             * @interface IJsonElement
             * @property {string|null} [json] JsonElement json
             */

            /**
             * Constructs a new JsonElement.
             * @memberof kritor.common
             * @classdesc Represents a JsonElement.
             * @implements IJsonElement
             * @constructor
             * @param {kritor.common.IJsonElement=} [properties] Properties to set
             */
            function JsonElement(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * JsonElement json.
             * @member {string} json
             * @memberof kritor.common.JsonElement
             * @instance
             */
            JsonElement.prototype.json = "";

            /**
             * Creates a new JsonElement instance using the specified properties.
             * @function create
             * @memberof kritor.common.JsonElement
             * @static
             * @param {kritor.common.IJsonElement=} [properties] Properties to set
             * @returns {kritor.common.JsonElement} JsonElement instance
             */
            JsonElement.create = function create(properties) {
                return new JsonElement(properties);
            };

            /**
             * Encodes the specified JsonElement message. Does not implicitly {@link kritor.common.JsonElement.verify|verify} messages.
             * @function encode
             * @memberof kritor.common.JsonElement
             * @static
             * @param {kritor.common.IJsonElement} message JsonElement message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            JsonElement.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.json != null && Object.hasOwnProperty.call(message, "json"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.json);
                return writer;
            };

            /**
             * Encodes the specified JsonElement message, length delimited. Does not implicitly {@link kritor.common.JsonElement.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.common.JsonElement
             * @static
             * @param {kritor.common.IJsonElement} message JsonElement message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            JsonElement.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a JsonElement message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.common.JsonElement
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.common.JsonElement} JsonElement
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            JsonElement.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.common.JsonElement();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.json = reader.string();
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
             * Decodes a JsonElement message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.common.JsonElement
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.common.JsonElement} JsonElement
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            JsonElement.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a JsonElement message.
             * @function verify
             * @memberof kritor.common.JsonElement
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            JsonElement.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.json != null && message.hasOwnProperty("json"))
                    if (!$util.isString(message.json))
                        return "json: string expected";
                return null;
            };

            /**
             * Creates a JsonElement message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.common.JsonElement
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.common.JsonElement} JsonElement
             */
            JsonElement.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.common.JsonElement)
                    return object;
                let message = new $root.kritor.common.JsonElement();
                if (object.json != null)
                    message.json = String(object.json);
                return message;
            };

            /**
             * Creates a plain object from a JsonElement message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.common.JsonElement
             * @static
             * @param {kritor.common.JsonElement} message JsonElement
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            JsonElement.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults)
                    object.json = "";
                if (message.json != null && message.hasOwnProperty("json"))
                    object.json = message.json;
                return object;
            };

            /**
             * Converts this JsonElement to JSON.
             * @function toJSON
             * @memberof kritor.common.JsonElement
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            JsonElement.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for JsonElement
             * @function getTypeUrl
             * @memberof kritor.common.JsonElement
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            JsonElement.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.common.JsonElement";
            };

            return JsonElement;
        })();

        common.XmlElement = (function() {

            /**
             * Properties of a XmlElement.
             * @memberof kritor.common
             * @interface IXmlElement
             * @property {string|null} [xml] XmlElement xml
             */

            /**
             * Constructs a new XmlElement.
             * @memberof kritor.common
             * @classdesc Represents a XmlElement.
             * @implements IXmlElement
             * @constructor
             * @param {kritor.common.IXmlElement=} [properties] Properties to set
             */
            function XmlElement(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * XmlElement xml.
             * @member {string} xml
             * @memberof kritor.common.XmlElement
             * @instance
             */
            XmlElement.prototype.xml = "";

            /**
             * Creates a new XmlElement instance using the specified properties.
             * @function create
             * @memberof kritor.common.XmlElement
             * @static
             * @param {kritor.common.IXmlElement=} [properties] Properties to set
             * @returns {kritor.common.XmlElement} XmlElement instance
             */
            XmlElement.create = function create(properties) {
                return new XmlElement(properties);
            };

            /**
             * Encodes the specified XmlElement message. Does not implicitly {@link kritor.common.XmlElement.verify|verify} messages.
             * @function encode
             * @memberof kritor.common.XmlElement
             * @static
             * @param {kritor.common.IXmlElement} message XmlElement message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            XmlElement.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.xml != null && Object.hasOwnProperty.call(message, "xml"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.xml);
                return writer;
            };

            /**
             * Encodes the specified XmlElement message, length delimited. Does not implicitly {@link kritor.common.XmlElement.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.common.XmlElement
             * @static
             * @param {kritor.common.IXmlElement} message XmlElement message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            XmlElement.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a XmlElement message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.common.XmlElement
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.common.XmlElement} XmlElement
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            XmlElement.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.common.XmlElement();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.xml = reader.string();
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
             * Decodes a XmlElement message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.common.XmlElement
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.common.XmlElement} XmlElement
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            XmlElement.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a XmlElement message.
             * @function verify
             * @memberof kritor.common.XmlElement
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            XmlElement.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.xml != null && message.hasOwnProperty("xml"))
                    if (!$util.isString(message.xml))
                        return "xml: string expected";
                return null;
            };

            /**
             * Creates a XmlElement message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.common.XmlElement
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.common.XmlElement} XmlElement
             */
            XmlElement.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.common.XmlElement)
                    return object;
                let message = new $root.kritor.common.XmlElement();
                if (object.xml != null)
                    message.xml = String(object.xml);
                return message;
            };

            /**
             * Creates a plain object from a XmlElement message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.common.XmlElement
             * @static
             * @param {kritor.common.XmlElement} message XmlElement
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            XmlElement.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults)
                    object.xml = "";
                if (message.xml != null && message.hasOwnProperty("xml"))
                    object.xml = message.xml;
                return object;
            };

            /**
             * Converts this XmlElement to JSON.
             * @function toJSON
             * @memberof kritor.common.XmlElement
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            XmlElement.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for XmlElement
             * @function getTypeUrl
             * @memberof kritor.common.XmlElement
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            XmlElement.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.common.XmlElement";
            };

            return XmlElement;
        })();

        common.FileElement = (function() {

            /**
             * Properties of a FileElement.
             * @memberof kritor.common
             * @interface IFileElement
             * @property {string|null} [name] FileElement name
             * @property {number|Long|null} [size] FileElement size
             * @property {number|Long|null} [expireTime] FileElement expireTime
             * @property {string|null} [id] FileElement id
             * @property {string|null} [url] FileElement url
             * @property {number|null} [biz] FileElement biz
             * @property {string|null} [subId] FileElement subId
             */

            /**
             * Constructs a new FileElement.
             * @memberof kritor.common
             * @classdesc Represents a FileElement.
             * @implements IFileElement
             * @constructor
             * @param {kritor.common.IFileElement=} [properties] Properties to set
             */
            function FileElement(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * FileElement name.
             * @member {string|null|undefined} name
             * @memberof kritor.common.FileElement
             * @instance
             */
            FileElement.prototype.name = null;

            /**
             * FileElement size.
             * @member {number|Long|null|undefined} size
             * @memberof kritor.common.FileElement
             * @instance
             */
            FileElement.prototype.size = null;

            /**
             * FileElement expireTime.
             * @member {number|Long|null|undefined} expireTime
             * @memberof kritor.common.FileElement
             * @instance
             */
            FileElement.prototype.expireTime = null;

            /**
             * FileElement id.
             * @member {string|null|undefined} id
             * @memberof kritor.common.FileElement
             * @instance
             */
            FileElement.prototype.id = null;

            /**
             * FileElement url.
             * @member {string|null|undefined} url
             * @memberof kritor.common.FileElement
             * @instance
             */
            FileElement.prototype.url = null;

            /**
             * FileElement biz.
             * @member {number|null|undefined} biz
             * @memberof kritor.common.FileElement
             * @instance
             */
            FileElement.prototype.biz = null;

            /**
             * FileElement subId.
             * @member {string|null|undefined} subId
             * @memberof kritor.common.FileElement
             * @instance
             */
            FileElement.prototype.subId = null;

            // OneOf field names bound to virtual getters and setters
            let $oneOfFields;

            /**
             * FileElement _name.
             * @member {"name"|undefined} _name
             * @memberof kritor.common.FileElement
             * @instance
             */
            Object.defineProperty(FileElement.prototype, "_name", {
                get: $util.oneOfGetter($oneOfFields = ["name"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * FileElement _size.
             * @member {"size"|undefined} _size
             * @memberof kritor.common.FileElement
             * @instance
             */
            Object.defineProperty(FileElement.prototype, "_size", {
                get: $util.oneOfGetter($oneOfFields = ["size"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * FileElement _expireTime.
             * @member {"expireTime"|undefined} _expireTime
             * @memberof kritor.common.FileElement
             * @instance
             */
            Object.defineProperty(FileElement.prototype, "_expireTime", {
                get: $util.oneOfGetter($oneOfFields = ["expireTime"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * FileElement _id.
             * @member {"id"|undefined} _id
             * @memberof kritor.common.FileElement
             * @instance
             */
            Object.defineProperty(FileElement.prototype, "_id", {
                get: $util.oneOfGetter($oneOfFields = ["id"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * FileElement _url.
             * @member {"url"|undefined} _url
             * @memberof kritor.common.FileElement
             * @instance
             */
            Object.defineProperty(FileElement.prototype, "_url", {
                get: $util.oneOfGetter($oneOfFields = ["url"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * FileElement _biz.
             * @member {"biz"|undefined} _biz
             * @memberof kritor.common.FileElement
             * @instance
             */
            Object.defineProperty(FileElement.prototype, "_biz", {
                get: $util.oneOfGetter($oneOfFields = ["biz"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * FileElement _subId.
             * @member {"subId"|undefined} _subId
             * @memberof kritor.common.FileElement
             * @instance
             */
            Object.defineProperty(FileElement.prototype, "_subId", {
                get: $util.oneOfGetter($oneOfFields = ["subId"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new FileElement instance using the specified properties.
             * @function create
             * @memberof kritor.common.FileElement
             * @static
             * @param {kritor.common.IFileElement=} [properties] Properties to set
             * @returns {kritor.common.FileElement} FileElement instance
             */
            FileElement.create = function create(properties) {
                return new FileElement(properties);
            };

            /**
             * Encodes the specified FileElement message. Does not implicitly {@link kritor.common.FileElement.verify|verify} messages.
             * @function encode
             * @memberof kritor.common.FileElement
             * @static
             * @param {kritor.common.IFileElement} message FileElement message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            FileElement.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
                if (message.size != null && Object.hasOwnProperty.call(message, "size"))
                    writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.size);
                if (message.expireTime != null && Object.hasOwnProperty.call(message, "expireTime"))
                    writer.uint32(/* id 3, wireType 0 =*/24).uint64(message.expireTime);
                if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.id);
                if (message.url != null && Object.hasOwnProperty.call(message, "url"))
                    writer.uint32(/* id 5, wireType 2 =*/42).string(message.url);
                if (message.biz != null && Object.hasOwnProperty.call(message, "biz"))
                    writer.uint32(/* id 6, wireType 0 =*/48).int32(message.biz);
                if (message.subId != null && Object.hasOwnProperty.call(message, "subId"))
                    writer.uint32(/* id 7, wireType 2 =*/58).string(message.subId);
                return writer;
            };

            /**
             * Encodes the specified FileElement message, length delimited. Does not implicitly {@link kritor.common.FileElement.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.common.FileElement
             * @static
             * @param {kritor.common.IFileElement} message FileElement message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            FileElement.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a FileElement message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.common.FileElement
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.common.FileElement} FileElement
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            FileElement.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.common.FileElement();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.name = reader.string();
                            break;
                        }
                    case 2: {
                            message.size = reader.uint64();
                            break;
                        }
                    case 3: {
                            message.expireTime = reader.uint64();
                            break;
                        }
                    case 4: {
                            message.id = reader.string();
                            break;
                        }
                    case 5: {
                            message.url = reader.string();
                            break;
                        }
                    case 6: {
                            message.biz = reader.int32();
                            break;
                        }
                    case 7: {
                            message.subId = reader.string();
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
             * Decodes a FileElement message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.common.FileElement
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.common.FileElement} FileElement
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            FileElement.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a FileElement message.
             * @function verify
             * @memberof kritor.common.FileElement
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            FileElement.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                let properties = {};
                if (message.name != null && message.hasOwnProperty("name")) {
                    properties._name = 1;
                    if (!$util.isString(message.name))
                        return "name: string expected";
                }
                if (message.size != null && message.hasOwnProperty("size")) {
                    properties._size = 1;
                    if (!$util.isInteger(message.size) && !(message.size && $util.isInteger(message.size.low) && $util.isInteger(message.size.high)))
                        return "size: integer|Long expected";
                }
                if (message.expireTime != null && message.hasOwnProperty("expireTime")) {
                    properties._expireTime = 1;
                    if (!$util.isInteger(message.expireTime) && !(message.expireTime && $util.isInteger(message.expireTime.low) && $util.isInteger(message.expireTime.high)))
                        return "expireTime: integer|Long expected";
                }
                if (message.id != null && message.hasOwnProperty("id")) {
                    properties._id = 1;
                    if (!$util.isString(message.id))
                        return "id: string expected";
                }
                if (message.url != null && message.hasOwnProperty("url")) {
                    properties._url = 1;
                    if (!$util.isString(message.url))
                        return "url: string expected";
                }
                if (message.biz != null && message.hasOwnProperty("biz")) {
                    properties._biz = 1;
                    if (!$util.isInteger(message.biz))
                        return "biz: integer expected";
                }
                if (message.subId != null && message.hasOwnProperty("subId")) {
                    properties._subId = 1;
                    if (!$util.isString(message.subId))
                        return "subId: string expected";
                }
                return null;
            };

            /**
             * Creates a FileElement message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.common.FileElement
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.common.FileElement} FileElement
             */
            FileElement.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.common.FileElement)
                    return object;
                let message = new $root.kritor.common.FileElement();
                if (object.name != null)
                    message.name = String(object.name);
                if (object.size != null)
                    if ($util.Long)
                        (message.size = $util.Long.fromValue(object.size)).unsigned = true;
                    else if (typeof object.size === "string")
                        message.size = parseInt(object.size, 10);
                    else if (typeof object.size === "number")
                        message.size = object.size;
                    else if (typeof object.size === "object")
                        message.size = new $util.LongBits(object.size.low >>> 0, object.size.high >>> 0).toNumber(true);
                if (object.expireTime != null)
                    if ($util.Long)
                        (message.expireTime = $util.Long.fromValue(object.expireTime)).unsigned = true;
                    else if (typeof object.expireTime === "string")
                        message.expireTime = parseInt(object.expireTime, 10);
                    else if (typeof object.expireTime === "number")
                        message.expireTime = object.expireTime;
                    else if (typeof object.expireTime === "object")
                        message.expireTime = new $util.LongBits(object.expireTime.low >>> 0, object.expireTime.high >>> 0).toNumber(true);
                if (object.id != null)
                    message.id = String(object.id);
                if (object.url != null)
                    message.url = String(object.url);
                if (object.biz != null)
                    message.biz = object.biz | 0;
                if (object.subId != null)
                    message.subId = String(object.subId);
                return message;
            };

            /**
             * Creates a plain object from a FileElement message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.common.FileElement
             * @static
             * @param {kritor.common.FileElement} message FileElement
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            FileElement.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (message.name != null && message.hasOwnProperty("name")) {
                    object.name = message.name;
                    if (options.oneofs)
                        object._name = "name";
                }
                if (message.size != null && message.hasOwnProperty("size")) {
                    if (typeof message.size === "number")
                        object.size = options.longs === String ? String(message.size) : message.size;
                    else
                        object.size = options.longs === String ? $util.Long.prototype.toString.call(message.size) : options.longs === Number ? new $util.LongBits(message.size.low >>> 0, message.size.high >>> 0).toNumber(true) : message.size;
                    if (options.oneofs)
                        object._size = "size";
                }
                if (message.expireTime != null && message.hasOwnProperty("expireTime")) {
                    if (typeof message.expireTime === "number")
                        object.expireTime = options.longs === String ? String(message.expireTime) : message.expireTime;
                    else
                        object.expireTime = options.longs === String ? $util.Long.prototype.toString.call(message.expireTime) : options.longs === Number ? new $util.LongBits(message.expireTime.low >>> 0, message.expireTime.high >>> 0).toNumber(true) : message.expireTime;
                    if (options.oneofs)
                        object._expireTime = "expireTime";
                }
                if (message.id != null && message.hasOwnProperty("id")) {
                    object.id = message.id;
                    if (options.oneofs)
                        object._id = "id";
                }
                if (message.url != null && message.hasOwnProperty("url")) {
                    object.url = message.url;
                    if (options.oneofs)
                        object._url = "url";
                }
                if (message.biz != null && message.hasOwnProperty("biz")) {
                    object.biz = message.biz;
                    if (options.oneofs)
                        object._biz = "biz";
                }
                if (message.subId != null && message.hasOwnProperty("subId")) {
                    object.subId = message.subId;
                    if (options.oneofs)
                        object._subId = "subId";
                }
                return object;
            };

            /**
             * Converts this FileElement to JSON.
             * @function toJSON
             * @memberof kritor.common.FileElement
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            FileElement.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for FileElement
             * @function getTypeUrl
             * @memberof kritor.common.FileElement
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            FileElement.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.common.FileElement";
            };

            return FileElement;
        })();

        common.MarkdownElement = (function() {

            /**
             * Properties of a MarkdownElement.
             * @memberof kritor.common
             * @interface IMarkdownElement
             * @property {string|null} [markdown] MarkdownElement markdown
             */

            /**
             * Constructs a new MarkdownElement.
             * @memberof kritor.common
             * @classdesc Represents a MarkdownElement.
             * @implements IMarkdownElement
             * @constructor
             * @param {kritor.common.IMarkdownElement=} [properties] Properties to set
             */
            function MarkdownElement(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * MarkdownElement markdown.
             * @member {string} markdown
             * @memberof kritor.common.MarkdownElement
             * @instance
             */
            MarkdownElement.prototype.markdown = "";

            /**
             * Creates a new MarkdownElement instance using the specified properties.
             * @function create
             * @memberof kritor.common.MarkdownElement
             * @static
             * @param {kritor.common.IMarkdownElement=} [properties] Properties to set
             * @returns {kritor.common.MarkdownElement} MarkdownElement instance
             */
            MarkdownElement.create = function create(properties) {
                return new MarkdownElement(properties);
            };

            /**
             * Encodes the specified MarkdownElement message. Does not implicitly {@link kritor.common.MarkdownElement.verify|verify} messages.
             * @function encode
             * @memberof kritor.common.MarkdownElement
             * @static
             * @param {kritor.common.IMarkdownElement} message MarkdownElement message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            MarkdownElement.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.markdown != null && Object.hasOwnProperty.call(message, "markdown"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.markdown);
                return writer;
            };

            /**
             * Encodes the specified MarkdownElement message, length delimited. Does not implicitly {@link kritor.common.MarkdownElement.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.common.MarkdownElement
             * @static
             * @param {kritor.common.IMarkdownElement} message MarkdownElement message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            MarkdownElement.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a MarkdownElement message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.common.MarkdownElement
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.common.MarkdownElement} MarkdownElement
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            MarkdownElement.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.common.MarkdownElement();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.markdown = reader.string();
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
             * Decodes a MarkdownElement message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.common.MarkdownElement
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.common.MarkdownElement} MarkdownElement
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            MarkdownElement.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a MarkdownElement message.
             * @function verify
             * @memberof kritor.common.MarkdownElement
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            MarkdownElement.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.markdown != null && message.hasOwnProperty("markdown"))
                    if (!$util.isString(message.markdown))
                        return "markdown: string expected";
                return null;
            };

            /**
             * Creates a MarkdownElement message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.common.MarkdownElement
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.common.MarkdownElement} MarkdownElement
             */
            MarkdownElement.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.common.MarkdownElement)
                    return object;
                let message = new $root.kritor.common.MarkdownElement();
                if (object.markdown != null)
                    message.markdown = String(object.markdown);
                return message;
            };

            /**
             * Creates a plain object from a MarkdownElement message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.common.MarkdownElement
             * @static
             * @param {kritor.common.MarkdownElement} message MarkdownElement
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            MarkdownElement.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults)
                    object.markdown = "";
                if (message.markdown != null && message.hasOwnProperty("markdown"))
                    object.markdown = message.markdown;
                return object;
            };

            /**
             * Converts this MarkdownElement to JSON.
             * @function toJSON
             * @memberof kritor.common.MarkdownElement
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            MarkdownElement.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for MarkdownElement
             * @function getTypeUrl
             * @memberof kritor.common.MarkdownElement
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            MarkdownElement.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.common.MarkdownElement";
            };

            return MarkdownElement;
        })();

        common.ButtonActionPermission = (function() {

            /**
             * Properties of a ButtonActionPermission.
             * @memberof kritor.common
             * @interface IButtonActionPermission
             * @property {number|null} [type] ButtonActionPermission type
             * @property {Array.<string>|null} [roleIds] ButtonActionPermission roleIds
             * @property {Array.<string>|null} [userIds] ButtonActionPermission userIds
             */

            /**
             * Constructs a new ButtonActionPermission.
             * @memberof kritor.common
             * @classdesc Represents a ButtonActionPermission.
             * @implements IButtonActionPermission
             * @constructor
             * @param {kritor.common.IButtonActionPermission=} [properties] Properties to set
             */
            function ButtonActionPermission(properties) {
                this.roleIds = [];
                this.userIds = [];
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * ButtonActionPermission type.
             * @member {number} type
             * @memberof kritor.common.ButtonActionPermission
             * @instance
             */
            ButtonActionPermission.prototype.type = 0;

            /**
             * ButtonActionPermission roleIds.
             * @member {Array.<string>} roleIds
             * @memberof kritor.common.ButtonActionPermission
             * @instance
             */
            ButtonActionPermission.prototype.roleIds = $util.emptyArray;

            /**
             * ButtonActionPermission userIds.
             * @member {Array.<string>} userIds
             * @memberof kritor.common.ButtonActionPermission
             * @instance
             */
            ButtonActionPermission.prototype.userIds = $util.emptyArray;

            /**
             * Creates a new ButtonActionPermission instance using the specified properties.
             * @function create
             * @memberof kritor.common.ButtonActionPermission
             * @static
             * @param {kritor.common.IButtonActionPermission=} [properties] Properties to set
             * @returns {kritor.common.ButtonActionPermission} ButtonActionPermission instance
             */
            ButtonActionPermission.create = function create(properties) {
                return new ButtonActionPermission(properties);
            };

            /**
             * Encodes the specified ButtonActionPermission message. Does not implicitly {@link kritor.common.ButtonActionPermission.verify|verify} messages.
             * @function encode
             * @memberof kritor.common.ButtonActionPermission
             * @static
             * @param {kritor.common.IButtonActionPermission} message ButtonActionPermission message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ButtonActionPermission.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int32(message.type);
                if (message.roleIds != null && message.roleIds.length)
                    for (let i = 0; i < message.roleIds.length; ++i)
                        writer.uint32(/* id 2, wireType 2 =*/18).string(message.roleIds[i]);
                if (message.userIds != null && message.userIds.length)
                    for (let i = 0; i < message.userIds.length; ++i)
                        writer.uint32(/* id 3, wireType 2 =*/26).string(message.userIds[i]);
                return writer;
            };

            /**
             * Encodes the specified ButtonActionPermission message, length delimited. Does not implicitly {@link kritor.common.ButtonActionPermission.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.common.ButtonActionPermission
             * @static
             * @param {kritor.common.IButtonActionPermission} message ButtonActionPermission message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ButtonActionPermission.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a ButtonActionPermission message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.common.ButtonActionPermission
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.common.ButtonActionPermission} ButtonActionPermission
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ButtonActionPermission.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.common.ButtonActionPermission();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.type = reader.int32();
                            break;
                        }
                    case 2: {
                            if (!(message.roleIds && message.roleIds.length))
                                message.roleIds = [];
                            message.roleIds.push(reader.string());
                            break;
                        }
                    case 3: {
                            if (!(message.userIds && message.userIds.length))
                                message.userIds = [];
                            message.userIds.push(reader.string());
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
             * Decodes a ButtonActionPermission message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.common.ButtonActionPermission
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.common.ButtonActionPermission} ButtonActionPermission
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ButtonActionPermission.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a ButtonActionPermission message.
             * @function verify
             * @memberof kritor.common.ButtonActionPermission
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ButtonActionPermission.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.type != null && message.hasOwnProperty("type"))
                    if (!$util.isInteger(message.type))
                        return "type: integer expected";
                if (message.roleIds != null && message.hasOwnProperty("roleIds")) {
                    if (!Array.isArray(message.roleIds))
                        return "roleIds: array expected";
                    for (let i = 0; i < message.roleIds.length; ++i)
                        if (!$util.isString(message.roleIds[i]))
                            return "roleIds: string[] expected";
                }
                if (message.userIds != null && message.hasOwnProperty("userIds")) {
                    if (!Array.isArray(message.userIds))
                        return "userIds: array expected";
                    for (let i = 0; i < message.userIds.length; ++i)
                        if (!$util.isString(message.userIds[i]))
                            return "userIds: string[] expected";
                }
                return null;
            };

            /**
             * Creates a ButtonActionPermission message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.common.ButtonActionPermission
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.common.ButtonActionPermission} ButtonActionPermission
             */
            ButtonActionPermission.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.common.ButtonActionPermission)
                    return object;
                let message = new $root.kritor.common.ButtonActionPermission();
                if (object.type != null)
                    message.type = object.type | 0;
                if (object.roleIds) {
                    if (!Array.isArray(object.roleIds))
                        throw TypeError(".kritor.common.ButtonActionPermission.roleIds: array expected");
                    message.roleIds = [];
                    for (let i = 0; i < object.roleIds.length; ++i)
                        message.roleIds[i] = String(object.roleIds[i]);
                }
                if (object.userIds) {
                    if (!Array.isArray(object.userIds))
                        throw TypeError(".kritor.common.ButtonActionPermission.userIds: array expected");
                    message.userIds = [];
                    for (let i = 0; i < object.userIds.length; ++i)
                        message.userIds[i] = String(object.userIds[i]);
                }
                return message;
            };

            /**
             * Creates a plain object from a ButtonActionPermission message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.common.ButtonActionPermission
             * @static
             * @param {kritor.common.ButtonActionPermission} message ButtonActionPermission
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ButtonActionPermission.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.arrays || options.defaults) {
                    object.roleIds = [];
                    object.userIds = [];
                }
                if (options.defaults)
                    object.type = 0;
                if (message.type != null && message.hasOwnProperty("type"))
                    object.type = message.type;
                if (message.roleIds && message.roleIds.length) {
                    object.roleIds = [];
                    for (let j = 0; j < message.roleIds.length; ++j)
                        object.roleIds[j] = message.roleIds[j];
                }
                if (message.userIds && message.userIds.length) {
                    object.userIds = [];
                    for (let j = 0; j < message.userIds.length; ++j)
                        object.userIds[j] = message.userIds[j];
                }
                return object;
            };

            /**
             * Converts this ButtonActionPermission to JSON.
             * @function toJSON
             * @memberof kritor.common.ButtonActionPermission
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ButtonActionPermission.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for ButtonActionPermission
             * @function getTypeUrl
             * @memberof kritor.common.ButtonActionPermission
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            ButtonActionPermission.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.common.ButtonActionPermission";
            };

            return ButtonActionPermission;
        })();

        common.ButtonAction = (function() {

            /**
             * Properties of a ButtonAction.
             * @memberof kritor.common
             * @interface IButtonAction
             * @property {number|null} [type] ButtonAction type
             * @property {kritor.common.IButtonActionPermission|null} [permission] ButtonAction permission
             * @property {string|null} [unsupportedTips] ButtonAction unsupportedTips
             * @property {string|null} [data] ButtonAction data
             * @property {boolean|null} [reply] ButtonAction reply
             * @property {boolean|null} [enter] ButtonAction enter
             */

            /**
             * Constructs a new ButtonAction.
             * @memberof kritor.common
             * @classdesc Represents a ButtonAction.
             * @implements IButtonAction
             * @constructor
             * @param {kritor.common.IButtonAction=} [properties] Properties to set
             */
            function ButtonAction(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * ButtonAction type.
             * @member {number} type
             * @memberof kritor.common.ButtonAction
             * @instance
             */
            ButtonAction.prototype.type = 0;

            /**
             * ButtonAction permission.
             * @member {kritor.common.IButtonActionPermission|null|undefined} permission
             * @memberof kritor.common.ButtonAction
             * @instance
             */
            ButtonAction.prototype.permission = null;

            /**
             * ButtonAction unsupportedTips.
             * @member {string} unsupportedTips
             * @memberof kritor.common.ButtonAction
             * @instance
             */
            ButtonAction.prototype.unsupportedTips = "";

            /**
             * ButtonAction data.
             * @member {string} data
             * @memberof kritor.common.ButtonAction
             * @instance
             */
            ButtonAction.prototype.data = "";

            /**
             * ButtonAction reply.
             * @member {boolean} reply
             * @memberof kritor.common.ButtonAction
             * @instance
             */
            ButtonAction.prototype.reply = false;

            /**
             * ButtonAction enter.
             * @member {boolean} enter
             * @memberof kritor.common.ButtonAction
             * @instance
             */
            ButtonAction.prototype.enter = false;

            /**
             * Creates a new ButtonAction instance using the specified properties.
             * @function create
             * @memberof kritor.common.ButtonAction
             * @static
             * @param {kritor.common.IButtonAction=} [properties] Properties to set
             * @returns {kritor.common.ButtonAction} ButtonAction instance
             */
            ButtonAction.create = function create(properties) {
                return new ButtonAction(properties);
            };

            /**
             * Encodes the specified ButtonAction message. Does not implicitly {@link kritor.common.ButtonAction.verify|verify} messages.
             * @function encode
             * @memberof kritor.common.ButtonAction
             * @static
             * @param {kritor.common.IButtonAction} message ButtonAction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ButtonAction.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int32(message.type);
                if (message.permission != null && Object.hasOwnProperty.call(message, "permission"))
                    $root.kritor.common.ButtonActionPermission.encode(message.permission, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                if (message.unsupportedTips != null && Object.hasOwnProperty.call(message, "unsupportedTips"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.unsupportedTips);
                if (message.data != null && Object.hasOwnProperty.call(message, "data"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.data);
                if (message.reply != null && Object.hasOwnProperty.call(message, "reply"))
                    writer.uint32(/* id 5, wireType 0 =*/40).bool(message.reply);
                if (message.enter != null && Object.hasOwnProperty.call(message, "enter"))
                    writer.uint32(/* id 6, wireType 0 =*/48).bool(message.enter);
                return writer;
            };

            /**
             * Encodes the specified ButtonAction message, length delimited. Does not implicitly {@link kritor.common.ButtonAction.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.common.ButtonAction
             * @static
             * @param {kritor.common.IButtonAction} message ButtonAction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ButtonAction.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a ButtonAction message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.common.ButtonAction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.common.ButtonAction} ButtonAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ButtonAction.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.common.ButtonAction();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.type = reader.int32();
                            break;
                        }
                    case 2: {
                            message.permission = $root.kritor.common.ButtonActionPermission.decode(reader, reader.uint32());
                            break;
                        }
                    case 3: {
                            message.unsupportedTips = reader.string();
                            break;
                        }
                    case 4: {
                            message.data = reader.string();
                            break;
                        }
                    case 5: {
                            message.reply = reader.bool();
                            break;
                        }
                    case 6: {
                            message.enter = reader.bool();
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
             * Decodes a ButtonAction message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.common.ButtonAction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.common.ButtonAction} ButtonAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ButtonAction.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a ButtonAction message.
             * @function verify
             * @memberof kritor.common.ButtonAction
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ButtonAction.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.type != null && message.hasOwnProperty("type"))
                    if (!$util.isInteger(message.type))
                        return "type: integer expected";
                if (message.permission != null && message.hasOwnProperty("permission")) {
                    let error = $root.kritor.common.ButtonActionPermission.verify(message.permission);
                    if (error)
                        return "permission." + error;
                }
                if (message.unsupportedTips != null && message.hasOwnProperty("unsupportedTips"))
                    if (!$util.isString(message.unsupportedTips))
                        return "unsupportedTips: string expected";
                if (message.data != null && message.hasOwnProperty("data"))
                    if (!$util.isString(message.data))
                        return "data: string expected";
                if (message.reply != null && message.hasOwnProperty("reply"))
                    if (typeof message.reply !== "boolean")
                        return "reply: boolean expected";
                if (message.enter != null && message.hasOwnProperty("enter"))
                    if (typeof message.enter !== "boolean")
                        return "enter: boolean expected";
                return null;
            };

            /**
             * Creates a ButtonAction message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.common.ButtonAction
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.common.ButtonAction} ButtonAction
             */
            ButtonAction.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.common.ButtonAction)
                    return object;
                let message = new $root.kritor.common.ButtonAction();
                if (object.type != null)
                    message.type = object.type | 0;
                if (object.permission != null) {
                    if (typeof object.permission !== "object")
                        throw TypeError(".kritor.common.ButtonAction.permission: object expected");
                    message.permission = $root.kritor.common.ButtonActionPermission.fromObject(object.permission);
                }
                if (object.unsupportedTips != null)
                    message.unsupportedTips = String(object.unsupportedTips);
                if (object.data != null)
                    message.data = String(object.data);
                if (object.reply != null)
                    message.reply = Boolean(object.reply);
                if (object.enter != null)
                    message.enter = Boolean(object.enter);
                return message;
            };

            /**
             * Creates a plain object from a ButtonAction message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.common.ButtonAction
             * @static
             * @param {kritor.common.ButtonAction} message ButtonAction
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ButtonAction.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.type = 0;
                    object.permission = null;
                    object.unsupportedTips = "";
                    object.data = "";
                    object.reply = false;
                    object.enter = false;
                }
                if (message.type != null && message.hasOwnProperty("type"))
                    object.type = message.type;
                if (message.permission != null && message.hasOwnProperty("permission"))
                    object.permission = $root.kritor.common.ButtonActionPermission.toObject(message.permission, options);
                if (message.unsupportedTips != null && message.hasOwnProperty("unsupportedTips"))
                    object.unsupportedTips = message.unsupportedTips;
                if (message.data != null && message.hasOwnProperty("data"))
                    object.data = message.data;
                if (message.reply != null && message.hasOwnProperty("reply"))
                    object.reply = message.reply;
                if (message.enter != null && message.hasOwnProperty("enter"))
                    object.enter = message.enter;
                return object;
            };

            /**
             * Converts this ButtonAction to JSON.
             * @function toJSON
             * @memberof kritor.common.ButtonAction
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ButtonAction.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for ButtonAction
             * @function getTypeUrl
             * @memberof kritor.common.ButtonAction
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            ButtonAction.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.common.ButtonAction";
            };

            return ButtonAction;
        })();

        common.ButtonRender = (function() {

            /**
             * Properties of a ButtonRender.
             * @memberof kritor.common
             * @interface IButtonRender
             * @property {string|null} [label] ButtonRender label
             * @property {string|null} [visitedLabel] ButtonRender visitedLabel
             * @property {number|null} [style] ButtonRender style
             */

            /**
             * Constructs a new ButtonRender.
             * @memberof kritor.common
             * @classdesc Represents a ButtonRender.
             * @implements IButtonRender
             * @constructor
             * @param {kritor.common.IButtonRender=} [properties] Properties to set
             */
            function ButtonRender(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * ButtonRender label.
             * @member {string} label
             * @memberof kritor.common.ButtonRender
             * @instance
             */
            ButtonRender.prototype.label = "";

            /**
             * ButtonRender visitedLabel.
             * @member {string} visitedLabel
             * @memberof kritor.common.ButtonRender
             * @instance
             */
            ButtonRender.prototype.visitedLabel = "";

            /**
             * ButtonRender style.
             * @member {number} style
             * @memberof kritor.common.ButtonRender
             * @instance
             */
            ButtonRender.prototype.style = 0;

            /**
             * Creates a new ButtonRender instance using the specified properties.
             * @function create
             * @memberof kritor.common.ButtonRender
             * @static
             * @param {kritor.common.IButtonRender=} [properties] Properties to set
             * @returns {kritor.common.ButtonRender} ButtonRender instance
             */
            ButtonRender.create = function create(properties) {
                return new ButtonRender(properties);
            };

            /**
             * Encodes the specified ButtonRender message. Does not implicitly {@link kritor.common.ButtonRender.verify|verify} messages.
             * @function encode
             * @memberof kritor.common.ButtonRender
             * @static
             * @param {kritor.common.IButtonRender} message ButtonRender message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ButtonRender.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.label != null && Object.hasOwnProperty.call(message, "label"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.label);
                if (message.visitedLabel != null && Object.hasOwnProperty.call(message, "visitedLabel"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.visitedLabel);
                if (message.style != null && Object.hasOwnProperty.call(message, "style"))
                    writer.uint32(/* id 3, wireType 0 =*/24).int32(message.style);
                return writer;
            };

            /**
             * Encodes the specified ButtonRender message, length delimited. Does not implicitly {@link kritor.common.ButtonRender.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.common.ButtonRender
             * @static
             * @param {kritor.common.IButtonRender} message ButtonRender message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ButtonRender.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a ButtonRender message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.common.ButtonRender
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.common.ButtonRender} ButtonRender
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ButtonRender.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.common.ButtonRender();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.label = reader.string();
                            break;
                        }
                    case 2: {
                            message.visitedLabel = reader.string();
                            break;
                        }
                    case 3: {
                            message.style = reader.int32();
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
             * Decodes a ButtonRender message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.common.ButtonRender
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.common.ButtonRender} ButtonRender
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ButtonRender.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a ButtonRender message.
             * @function verify
             * @memberof kritor.common.ButtonRender
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ButtonRender.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.label != null && message.hasOwnProperty("label"))
                    if (!$util.isString(message.label))
                        return "label: string expected";
                if (message.visitedLabel != null && message.hasOwnProperty("visitedLabel"))
                    if (!$util.isString(message.visitedLabel))
                        return "visitedLabel: string expected";
                if (message.style != null && message.hasOwnProperty("style"))
                    if (!$util.isInteger(message.style))
                        return "style: integer expected";
                return null;
            };

            /**
             * Creates a ButtonRender message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.common.ButtonRender
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.common.ButtonRender} ButtonRender
             */
            ButtonRender.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.common.ButtonRender)
                    return object;
                let message = new $root.kritor.common.ButtonRender();
                if (object.label != null)
                    message.label = String(object.label);
                if (object.visitedLabel != null)
                    message.visitedLabel = String(object.visitedLabel);
                if (object.style != null)
                    message.style = object.style | 0;
                return message;
            };

            /**
             * Creates a plain object from a ButtonRender message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.common.ButtonRender
             * @static
             * @param {kritor.common.ButtonRender} message ButtonRender
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ButtonRender.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.label = "";
                    object.visitedLabel = "";
                    object.style = 0;
                }
                if (message.label != null && message.hasOwnProperty("label"))
                    object.label = message.label;
                if (message.visitedLabel != null && message.hasOwnProperty("visitedLabel"))
                    object.visitedLabel = message.visitedLabel;
                if (message.style != null && message.hasOwnProperty("style"))
                    object.style = message.style;
                return object;
            };

            /**
             * Converts this ButtonRender to JSON.
             * @function toJSON
             * @memberof kritor.common.ButtonRender
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ButtonRender.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for ButtonRender
             * @function getTypeUrl
             * @memberof kritor.common.ButtonRender
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            ButtonRender.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.common.ButtonRender";
            };

            return ButtonRender;
        })();

        common.Button = (function() {

            /**
             * Properties of a Button.
             * @memberof kritor.common
             * @interface IButton
             * @property {string|null} [id] Button id
             * @property {kritor.common.IButtonRender|null} [renderData] Button renderData
             * @property {kritor.common.IButtonAction|null} [action] Button action
             */

            /**
             * Constructs a new Button.
             * @memberof kritor.common
             * @classdesc Represents a Button.
             * @implements IButton
             * @constructor
             * @param {kritor.common.IButton=} [properties] Properties to set
             */
            function Button(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Button id.
             * @member {string} id
             * @memberof kritor.common.Button
             * @instance
             */
            Button.prototype.id = "";

            /**
             * Button renderData.
             * @member {kritor.common.IButtonRender|null|undefined} renderData
             * @memberof kritor.common.Button
             * @instance
             */
            Button.prototype.renderData = null;

            /**
             * Button action.
             * @member {kritor.common.IButtonAction|null|undefined} action
             * @memberof kritor.common.Button
             * @instance
             */
            Button.prototype.action = null;

            /**
             * Creates a new Button instance using the specified properties.
             * @function create
             * @memberof kritor.common.Button
             * @static
             * @param {kritor.common.IButton=} [properties] Properties to set
             * @returns {kritor.common.Button} Button instance
             */
            Button.create = function create(properties) {
                return new Button(properties);
            };

            /**
             * Encodes the specified Button message. Does not implicitly {@link kritor.common.Button.verify|verify} messages.
             * @function encode
             * @memberof kritor.common.Button
             * @static
             * @param {kritor.common.IButton} message Button message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Button.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
                if (message.renderData != null && Object.hasOwnProperty.call(message, "renderData"))
                    $root.kritor.common.ButtonRender.encode(message.renderData, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                if (message.action != null && Object.hasOwnProperty.call(message, "action"))
                    $root.kritor.common.ButtonAction.encode(message.action, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified Button message, length delimited. Does not implicitly {@link kritor.common.Button.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.common.Button
             * @static
             * @param {kritor.common.IButton} message Button message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Button.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a Button message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.common.Button
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.common.Button} Button
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Button.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.common.Button();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.id = reader.string();
                            break;
                        }
                    case 2: {
                            message.renderData = $root.kritor.common.ButtonRender.decode(reader, reader.uint32());
                            break;
                        }
                    case 3: {
                            message.action = $root.kritor.common.ButtonAction.decode(reader, reader.uint32());
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
             * Decodes a Button message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.common.Button
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.common.Button} Button
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Button.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a Button message.
             * @function verify
             * @memberof kritor.common.Button
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Button.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.id != null && message.hasOwnProperty("id"))
                    if (!$util.isString(message.id))
                        return "id: string expected";
                if (message.renderData != null && message.hasOwnProperty("renderData")) {
                    let error = $root.kritor.common.ButtonRender.verify(message.renderData);
                    if (error)
                        return "renderData." + error;
                }
                if (message.action != null && message.hasOwnProperty("action")) {
                    let error = $root.kritor.common.ButtonAction.verify(message.action);
                    if (error)
                        return "action." + error;
                }
                return null;
            };

            /**
             * Creates a Button message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.common.Button
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.common.Button} Button
             */
            Button.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.common.Button)
                    return object;
                let message = new $root.kritor.common.Button();
                if (object.id != null)
                    message.id = String(object.id);
                if (object.renderData != null) {
                    if (typeof object.renderData !== "object")
                        throw TypeError(".kritor.common.Button.renderData: object expected");
                    message.renderData = $root.kritor.common.ButtonRender.fromObject(object.renderData);
                }
                if (object.action != null) {
                    if (typeof object.action !== "object")
                        throw TypeError(".kritor.common.Button.action: object expected");
                    message.action = $root.kritor.common.ButtonAction.fromObject(object.action);
                }
                return message;
            };

            /**
             * Creates a plain object from a Button message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.common.Button
             * @static
             * @param {kritor.common.Button} message Button
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Button.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.id = "";
                    object.renderData = null;
                    object.action = null;
                }
                if (message.id != null && message.hasOwnProperty("id"))
                    object.id = message.id;
                if (message.renderData != null && message.hasOwnProperty("renderData"))
                    object.renderData = $root.kritor.common.ButtonRender.toObject(message.renderData, options);
                if (message.action != null && message.hasOwnProperty("action"))
                    object.action = $root.kritor.common.ButtonAction.toObject(message.action, options);
                return object;
            };

            /**
             * Converts this Button to JSON.
             * @function toJSON
             * @memberof kritor.common.Button
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Button.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for Button
             * @function getTypeUrl
             * @memberof kritor.common.Button
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            Button.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.common.Button";
            };

            return Button;
        })();

        common.KeyboardRow = (function() {

            /**
             * Properties of a KeyboardRow.
             * @memberof kritor.common
             * @interface IKeyboardRow
             * @property {Array.<kritor.common.IButton>|null} [buttons] KeyboardRow buttons
             */

            /**
             * Constructs a new KeyboardRow.
             * @memberof kritor.common
             * @classdesc Represents a KeyboardRow.
             * @implements IKeyboardRow
             * @constructor
             * @param {kritor.common.IKeyboardRow=} [properties] Properties to set
             */
            function KeyboardRow(properties) {
                this.buttons = [];
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * KeyboardRow buttons.
             * @member {Array.<kritor.common.IButton>} buttons
             * @memberof kritor.common.KeyboardRow
             * @instance
             */
            KeyboardRow.prototype.buttons = $util.emptyArray;

            /**
             * Creates a new KeyboardRow instance using the specified properties.
             * @function create
             * @memberof kritor.common.KeyboardRow
             * @static
             * @param {kritor.common.IKeyboardRow=} [properties] Properties to set
             * @returns {kritor.common.KeyboardRow} KeyboardRow instance
             */
            KeyboardRow.create = function create(properties) {
                return new KeyboardRow(properties);
            };

            /**
             * Encodes the specified KeyboardRow message. Does not implicitly {@link kritor.common.KeyboardRow.verify|verify} messages.
             * @function encode
             * @memberof kritor.common.KeyboardRow
             * @static
             * @param {kritor.common.IKeyboardRow} message KeyboardRow message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            KeyboardRow.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.buttons != null && message.buttons.length)
                    for (let i = 0; i < message.buttons.length; ++i)
                        $root.kritor.common.Button.encode(message.buttons[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified KeyboardRow message, length delimited. Does not implicitly {@link kritor.common.KeyboardRow.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.common.KeyboardRow
             * @static
             * @param {kritor.common.IKeyboardRow} message KeyboardRow message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            KeyboardRow.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a KeyboardRow message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.common.KeyboardRow
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.common.KeyboardRow} KeyboardRow
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            KeyboardRow.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.common.KeyboardRow();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            if (!(message.buttons && message.buttons.length))
                                message.buttons = [];
                            message.buttons.push($root.kritor.common.Button.decode(reader, reader.uint32()));
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
             * Decodes a KeyboardRow message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.common.KeyboardRow
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.common.KeyboardRow} KeyboardRow
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            KeyboardRow.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a KeyboardRow message.
             * @function verify
             * @memberof kritor.common.KeyboardRow
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            KeyboardRow.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.buttons != null && message.hasOwnProperty("buttons")) {
                    if (!Array.isArray(message.buttons))
                        return "buttons: array expected";
                    for (let i = 0; i < message.buttons.length; ++i) {
                        let error = $root.kritor.common.Button.verify(message.buttons[i]);
                        if (error)
                            return "buttons." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a KeyboardRow message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.common.KeyboardRow
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.common.KeyboardRow} KeyboardRow
             */
            KeyboardRow.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.common.KeyboardRow)
                    return object;
                let message = new $root.kritor.common.KeyboardRow();
                if (object.buttons) {
                    if (!Array.isArray(object.buttons))
                        throw TypeError(".kritor.common.KeyboardRow.buttons: array expected");
                    message.buttons = [];
                    for (let i = 0; i < object.buttons.length; ++i) {
                        if (typeof object.buttons[i] !== "object")
                            throw TypeError(".kritor.common.KeyboardRow.buttons: object expected");
                        message.buttons[i] = $root.kritor.common.Button.fromObject(object.buttons[i]);
                    }
                }
                return message;
            };

            /**
             * Creates a plain object from a KeyboardRow message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.common.KeyboardRow
             * @static
             * @param {kritor.common.KeyboardRow} message KeyboardRow
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            KeyboardRow.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.arrays || options.defaults)
                    object.buttons = [];
                if (message.buttons && message.buttons.length) {
                    object.buttons = [];
                    for (let j = 0; j < message.buttons.length; ++j)
                        object.buttons[j] = $root.kritor.common.Button.toObject(message.buttons[j], options);
                }
                return object;
            };

            /**
             * Converts this KeyboardRow to JSON.
             * @function toJSON
             * @memberof kritor.common.KeyboardRow
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            KeyboardRow.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for KeyboardRow
             * @function getTypeUrl
             * @memberof kritor.common.KeyboardRow
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            KeyboardRow.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.common.KeyboardRow";
            };

            return KeyboardRow;
        })();

        common.KeyboardElement = (function() {

            /**
             * Properties of a KeyboardElement.
             * @memberof kritor.common
             * @interface IKeyboardElement
             * @property {Array.<kritor.common.IKeyboardRow>|null} [rows] KeyboardElement rows
             * @property {number|Long|null} [botAppid] KeyboardElement botAppid
             */

            /**
             * Constructs a new KeyboardElement.
             * @memberof kritor.common
             * @classdesc Represents a KeyboardElement.
             * @implements IKeyboardElement
             * @constructor
             * @param {kritor.common.IKeyboardElement=} [properties] Properties to set
             */
            function KeyboardElement(properties) {
                this.rows = [];
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * KeyboardElement rows.
             * @member {Array.<kritor.common.IKeyboardRow>} rows
             * @memberof kritor.common.KeyboardElement
             * @instance
             */
            KeyboardElement.prototype.rows = $util.emptyArray;

            /**
             * KeyboardElement botAppid.
             * @member {number|Long} botAppid
             * @memberof kritor.common.KeyboardElement
             * @instance
             */
            KeyboardElement.prototype.botAppid = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * Creates a new KeyboardElement instance using the specified properties.
             * @function create
             * @memberof kritor.common.KeyboardElement
             * @static
             * @param {kritor.common.IKeyboardElement=} [properties] Properties to set
             * @returns {kritor.common.KeyboardElement} KeyboardElement instance
             */
            KeyboardElement.create = function create(properties) {
                return new KeyboardElement(properties);
            };

            /**
             * Encodes the specified KeyboardElement message. Does not implicitly {@link kritor.common.KeyboardElement.verify|verify} messages.
             * @function encode
             * @memberof kritor.common.KeyboardElement
             * @static
             * @param {kritor.common.IKeyboardElement} message KeyboardElement message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            KeyboardElement.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.rows != null && message.rows.length)
                    for (let i = 0; i < message.rows.length; ++i)
                        $root.kritor.common.KeyboardRow.encode(message.rows[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                if (message.botAppid != null && Object.hasOwnProperty.call(message, "botAppid"))
                    writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.botAppid);
                return writer;
            };

            /**
             * Encodes the specified KeyboardElement message, length delimited. Does not implicitly {@link kritor.common.KeyboardElement.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.common.KeyboardElement
             * @static
             * @param {kritor.common.IKeyboardElement} message KeyboardElement message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            KeyboardElement.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a KeyboardElement message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.common.KeyboardElement
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.common.KeyboardElement} KeyboardElement
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            KeyboardElement.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.common.KeyboardElement();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            if (!(message.rows && message.rows.length))
                                message.rows = [];
                            message.rows.push($root.kritor.common.KeyboardRow.decode(reader, reader.uint32()));
                            break;
                        }
                    case 2: {
                            message.botAppid = reader.uint64();
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
             * Decodes a KeyboardElement message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.common.KeyboardElement
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.common.KeyboardElement} KeyboardElement
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            KeyboardElement.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a KeyboardElement message.
             * @function verify
             * @memberof kritor.common.KeyboardElement
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            KeyboardElement.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.rows != null && message.hasOwnProperty("rows")) {
                    if (!Array.isArray(message.rows))
                        return "rows: array expected";
                    for (let i = 0; i < message.rows.length; ++i) {
                        let error = $root.kritor.common.KeyboardRow.verify(message.rows[i]);
                        if (error)
                            return "rows." + error;
                    }
                }
                if (message.botAppid != null && message.hasOwnProperty("botAppid"))
                    if (!$util.isInteger(message.botAppid) && !(message.botAppid && $util.isInteger(message.botAppid.low) && $util.isInteger(message.botAppid.high)))
                        return "botAppid: integer|Long expected";
                return null;
            };

            /**
             * Creates a KeyboardElement message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.common.KeyboardElement
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.common.KeyboardElement} KeyboardElement
             */
            KeyboardElement.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.common.KeyboardElement)
                    return object;
                let message = new $root.kritor.common.KeyboardElement();
                if (object.rows) {
                    if (!Array.isArray(object.rows))
                        throw TypeError(".kritor.common.KeyboardElement.rows: array expected");
                    message.rows = [];
                    for (let i = 0; i < object.rows.length; ++i) {
                        if (typeof object.rows[i] !== "object")
                            throw TypeError(".kritor.common.KeyboardElement.rows: object expected");
                        message.rows[i] = $root.kritor.common.KeyboardRow.fromObject(object.rows[i]);
                    }
                }
                if (object.botAppid != null)
                    if ($util.Long)
                        (message.botAppid = $util.Long.fromValue(object.botAppid)).unsigned = true;
                    else if (typeof object.botAppid === "string")
                        message.botAppid = parseInt(object.botAppid, 10);
                    else if (typeof object.botAppid === "number")
                        message.botAppid = object.botAppid;
                    else if (typeof object.botAppid === "object")
                        message.botAppid = new $util.LongBits(object.botAppid.low >>> 0, object.botAppid.high >>> 0).toNumber(true);
                return message;
            };

            /**
             * Creates a plain object from a KeyboardElement message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.common.KeyboardElement
             * @static
             * @param {kritor.common.KeyboardElement} message KeyboardElement
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            KeyboardElement.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.arrays || options.defaults)
                    object.rows = [];
                if (options.defaults)
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.botAppid = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.botAppid = options.longs === String ? "0" : 0;
                if (message.rows && message.rows.length) {
                    object.rows = [];
                    for (let j = 0; j < message.rows.length; ++j)
                        object.rows[j] = $root.kritor.common.KeyboardRow.toObject(message.rows[j], options);
                }
                if (message.botAppid != null && message.hasOwnProperty("botAppid"))
                    if (typeof message.botAppid === "number")
                        object.botAppid = options.longs === String ? String(message.botAppid) : message.botAppid;
                    else
                        object.botAppid = options.longs === String ? $util.Long.prototype.toString.call(message.botAppid) : options.longs === Number ? new $util.LongBits(message.botAppid.low >>> 0, message.botAppid.high >>> 0).toNumber(true) : message.botAppid;
                return object;
            };

            /**
             * Converts this KeyboardElement to JSON.
             * @function toJSON
             * @memberof kritor.common.KeyboardElement
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            KeyboardElement.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for KeyboardElement
             * @function getTypeUrl
             * @memberof kritor.common.KeyboardElement
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            KeyboardElement.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.common.KeyboardElement";
            };

            return KeyboardElement;
        })();

        return common;
    })();

    return kritor;
})();

export { $root as default };
