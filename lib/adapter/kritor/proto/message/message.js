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

    kritor.message = (function() {

        /**
         * Namespace message.
         * @memberof kritor
         * @namespace
         */
        const message = {};

        message.MessageService = (function() {

            /**
             * Constructs a new MessageService service.
             * @memberof kritor.message
             * @classdesc Represents a MessageService
             * @extends $protobuf.rpc.Service
             * @constructor
             * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
             * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
             * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
             */
            function MessageService(rpcImpl, requestDelimited, responseDelimited) {
                $protobuf.rpc.Service.call(this, rpcImpl, requestDelimited, responseDelimited);
            }

            (MessageService.prototype = Object.create($protobuf.rpc.Service.prototype)).constructor = MessageService;

            /**
             * Creates new MessageService service using the specified rpc implementation.
             * @function create
             * @memberof kritor.message.MessageService
             * @static
             * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
             * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
             * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
             * @returns {MessageService} RPC service. Useful where requests and/or responses are streamed.
             */
            MessageService.create = function create(rpcImpl, requestDelimited, responseDelimited) {
                return new this(rpcImpl, requestDelimited, responseDelimited);
            };

            /**
             * Callback as used by {@link kritor.message.MessageService#sendMessage}.
             * @memberof kritor.message.MessageService
             * @typedef SendMessageCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.message.SendMessageResponse} [response] SendMessageResponse
             */

            /**
             * Calls SendMessage.
             * @function sendMessage
             * @memberof kritor.message.MessageService
             * @instance
             * @param {kritor.message.ISendMessageRequest} request SendMessageRequest message or plain object
             * @param {kritor.message.MessageService.SendMessageCallback} callback Node-style callback called with the error, if any, and SendMessageResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(MessageService.prototype.sendMessage = function sendMessage(request, callback) {
                return this.rpcCall(sendMessage, $root.kritor.message.SendMessageRequest, $root.kritor.message.SendMessageResponse, request, callback);
            }, "name", { value: "SendMessage" });

            /**
             * Calls SendMessage.
             * @function sendMessage
             * @memberof kritor.message.MessageService
             * @instance
             * @param {kritor.message.ISendMessageRequest} request SendMessageRequest message or plain object
             * @returns {Promise<kritor.message.SendMessageResponse>} Promise
             * @variation 2
             */

            /**
             * Callback as used by {@link kritor.message.MessageService#sendMessageByResId}.
             * @memberof kritor.message.MessageService
             * @typedef SendMessageByResIdCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.message.SendMessageByResIdResponse} [response] SendMessageByResIdResponse
             */

            /**
             * Calls SendMessageByResId.
             * @function sendMessageByResId
             * @memberof kritor.message.MessageService
             * @instance
             * @param {kritor.message.ISendMessageByResIdRequest} request SendMessageByResIdRequest message or plain object
             * @param {kritor.message.MessageService.SendMessageByResIdCallback} callback Node-style callback called with the error, if any, and SendMessageByResIdResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(MessageService.prototype.sendMessageByResId = function sendMessageByResId(request, callback) {
                return this.rpcCall(sendMessageByResId, $root.kritor.message.SendMessageByResIdRequest, $root.kritor.message.SendMessageByResIdResponse, request, callback);
            }, "name", { value: "SendMessageByResId" });

            /**
             * Calls SendMessageByResId.
             * @function sendMessageByResId
             * @memberof kritor.message.MessageService
             * @instance
             * @param {kritor.message.ISendMessageByResIdRequest} request SendMessageByResIdRequest message or plain object
             * @returns {Promise<kritor.message.SendMessageByResIdResponse>} Promise
             * @variation 2
             */

            /**
             * Callback as used by {@link kritor.message.MessageService#setMessageReaded}.
             * @memberof kritor.message.MessageService
             * @typedef SetMessageReadedCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.message.SetMessageReadResponse} [response] SetMessageReadResponse
             */

            /**
             * Calls SetMessageReaded.
             * @function setMessageReaded
             * @memberof kritor.message.MessageService
             * @instance
             * @param {kritor.message.ISetMessageReadRequest} request SetMessageReadRequest message or plain object
             * @param {kritor.message.MessageService.SetMessageReadedCallback} callback Node-style callback called with the error, if any, and SetMessageReadResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(MessageService.prototype.setMessageReaded = function setMessageReaded(request, callback) {
                return this.rpcCall(setMessageReaded, $root.kritor.message.SetMessageReadRequest, $root.kritor.message.SetMessageReadResponse, request, callback);
            }, "name", { value: "SetMessageReaded" });

            /**
             * Calls SetMessageReaded.
             * @function setMessageReaded
             * @memberof kritor.message.MessageService
             * @instance
             * @param {kritor.message.ISetMessageReadRequest} request SetMessageReadRequest message or plain object
             * @returns {Promise<kritor.message.SetMessageReadResponse>} Promise
             * @variation 2
             */

            /**
             * Callback as used by {@link kritor.message.MessageService#recallMessage}.
             * @memberof kritor.message.MessageService
             * @typedef RecallMessageCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.message.RecallMessageResponse} [response] RecallMessageResponse
             */

            /**
             * Calls RecallMessage.
             * @function recallMessage
             * @memberof kritor.message.MessageService
             * @instance
             * @param {kritor.message.IRecallMessageRequest} request RecallMessageRequest message or plain object
             * @param {kritor.message.MessageService.RecallMessageCallback} callback Node-style callback called with the error, if any, and RecallMessageResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(MessageService.prototype.recallMessage = function recallMessage(request, callback) {
                return this.rpcCall(recallMessage, $root.kritor.message.RecallMessageRequest, $root.kritor.message.RecallMessageResponse, request, callback);
            }, "name", { value: "RecallMessage" });

            /**
             * Calls RecallMessage.
             * @function recallMessage
             * @memberof kritor.message.MessageService
             * @instance
             * @param {kritor.message.IRecallMessageRequest} request RecallMessageRequest message or plain object
             * @returns {Promise<kritor.message.RecallMessageResponse>} Promise
             * @variation 2
             */

            /**
             * Callback as used by {@link kritor.message.MessageService#reactMessageWithEmoji}.
             * @memberof kritor.message.MessageService
             * @typedef ReactMessageWithEmojiCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.message.ReactMessageWithEmojiResponse} [response] ReactMessageWithEmojiResponse
             */

            /**
             * Calls ReactMessageWithEmoji.
             * @function reactMessageWithEmoji
             * @memberof kritor.message.MessageService
             * @instance
             * @param {kritor.message.IReactMessageWithEmojiRequest} request ReactMessageWithEmojiRequest message or plain object
             * @param {kritor.message.MessageService.ReactMessageWithEmojiCallback} callback Node-style callback called with the error, if any, and ReactMessageWithEmojiResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(MessageService.prototype.reactMessageWithEmoji = function reactMessageWithEmoji(request, callback) {
                return this.rpcCall(reactMessageWithEmoji, $root.kritor.message.ReactMessageWithEmojiRequest, $root.kritor.message.ReactMessageWithEmojiResponse, request, callback);
            }, "name", { value: "ReactMessageWithEmoji" });

            /**
             * Calls ReactMessageWithEmoji.
             * @function reactMessageWithEmoji
             * @memberof kritor.message.MessageService
             * @instance
             * @param {kritor.message.IReactMessageWithEmojiRequest} request ReactMessageWithEmojiRequest message or plain object
             * @returns {Promise<kritor.message.ReactMessageWithEmojiResponse>} Promise
             * @variation 2
             */

            /**
             * Callback as used by {@link kritor.message.MessageService#getMessage}.
             * @memberof kritor.message.MessageService
             * @typedef GetMessageCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.message.GetMessageResponse} [response] GetMessageResponse
             */

            /**
             * Calls GetMessage.
             * @function getMessage
             * @memberof kritor.message.MessageService
             * @instance
             * @param {kritor.message.IGetMessageRequest} request GetMessageRequest message or plain object
             * @param {kritor.message.MessageService.GetMessageCallback} callback Node-style callback called with the error, if any, and GetMessageResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(MessageService.prototype.getMessage = function getMessage(request, callback) {
                return this.rpcCall(getMessage, $root.kritor.message.GetMessageRequest, $root.kritor.message.GetMessageResponse, request, callback);
            }, "name", { value: "GetMessage" });

            /**
             * Calls GetMessage.
             * @function getMessage
             * @memberof kritor.message.MessageService
             * @instance
             * @param {kritor.message.IGetMessageRequest} request GetMessageRequest message or plain object
             * @returns {Promise<kritor.message.GetMessageResponse>} Promise
             * @variation 2
             */

            /**
             * Callback as used by {@link kritor.message.MessageService#getMessageBySeq}.
             * @memberof kritor.message.MessageService
             * @typedef GetMessageBySeqCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.message.GetMessageBySeqResponse} [response] GetMessageBySeqResponse
             */

            /**
             * Calls GetMessageBySeq.
             * @function getMessageBySeq
             * @memberof kritor.message.MessageService
             * @instance
             * @param {kritor.message.IGetMessageBySeqRequest} request GetMessageBySeqRequest message or plain object
             * @param {kritor.message.MessageService.GetMessageBySeqCallback} callback Node-style callback called with the error, if any, and GetMessageBySeqResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(MessageService.prototype.getMessageBySeq = function getMessageBySeq(request, callback) {
                return this.rpcCall(getMessageBySeq, $root.kritor.message.GetMessageBySeqRequest, $root.kritor.message.GetMessageBySeqResponse, request, callback);
            }, "name", { value: "GetMessageBySeq" });

            /**
             * Calls GetMessageBySeq.
             * @function getMessageBySeq
             * @memberof kritor.message.MessageService
             * @instance
             * @param {kritor.message.IGetMessageBySeqRequest} request GetMessageBySeqRequest message or plain object
             * @returns {Promise<kritor.message.GetMessageBySeqResponse>} Promise
             * @variation 2
             */

            /**
             * Callback as used by {@link kritor.message.MessageService#getHistoryMessage}.
             * @memberof kritor.message.MessageService
             * @typedef GetHistoryMessageCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.message.GetHistoryMessageResponse} [response] GetHistoryMessageResponse
             */

            /**
             * Calls GetHistoryMessage.
             * @function getHistoryMessage
             * @memberof kritor.message.MessageService
             * @instance
             * @param {kritor.message.IGetHistoryMessageRequest} request GetHistoryMessageRequest message or plain object
             * @param {kritor.message.MessageService.GetHistoryMessageCallback} callback Node-style callback called with the error, if any, and GetHistoryMessageResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(MessageService.prototype.getHistoryMessage = function getHistoryMessage(request, callback) {
                return this.rpcCall(getHistoryMessage, $root.kritor.message.GetHistoryMessageRequest, $root.kritor.message.GetHistoryMessageResponse, request, callback);
            }, "name", { value: "GetHistoryMessage" });

            /**
             * Calls GetHistoryMessage.
             * @function getHistoryMessage
             * @memberof kritor.message.MessageService
             * @instance
             * @param {kritor.message.IGetHistoryMessageRequest} request GetHistoryMessageRequest message or plain object
             * @returns {Promise<kritor.message.GetHistoryMessageResponse>} Promise
             * @variation 2
             */

            /**
             * Callback as used by {@link kritor.message.MessageService#getHistoryMessageBySeq}.
             * @memberof kritor.message.MessageService
             * @typedef GetHistoryMessageBySeqCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.message.GetHistoryMessageBySeqResponse} [response] GetHistoryMessageBySeqResponse
             */

            /**
             * Calls GetHistoryMessageBySeq.
             * @function getHistoryMessageBySeq
             * @memberof kritor.message.MessageService
             * @instance
             * @param {kritor.message.IGetHistoryMessageBySeqRequest} request GetHistoryMessageBySeqRequest message or plain object
             * @param {kritor.message.MessageService.GetHistoryMessageBySeqCallback} callback Node-style callback called with the error, if any, and GetHistoryMessageBySeqResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(MessageService.prototype.getHistoryMessageBySeq = function getHistoryMessageBySeq(request, callback) {
                return this.rpcCall(getHistoryMessageBySeq, $root.kritor.message.GetHistoryMessageBySeqRequest, $root.kritor.message.GetHistoryMessageBySeqResponse, request, callback);
            }, "name", { value: "GetHistoryMessageBySeq" });

            /**
             * Calls GetHistoryMessageBySeq.
             * @function getHistoryMessageBySeq
             * @memberof kritor.message.MessageService
             * @instance
             * @param {kritor.message.IGetHistoryMessageBySeqRequest} request GetHistoryMessageBySeqRequest message or plain object
             * @returns {Promise<kritor.message.GetHistoryMessageBySeqResponse>} Promise
             * @variation 2
             */

            /**
             * Callback as used by {@link kritor.message.MessageService#uploadForwardMessage}.
             * @memberof kritor.message.MessageService
             * @typedef UploadForwardMessageCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.message.UploadForwardMessageResponse} [response] UploadForwardMessageResponse
             */

            /**
             * Calls UploadForwardMessage.
             * @function uploadForwardMessage
             * @memberof kritor.message.MessageService
             * @instance
             * @param {kritor.message.IUploadForwardMessageRequest} request UploadForwardMessageRequest message or plain object
             * @param {kritor.message.MessageService.UploadForwardMessageCallback} callback Node-style callback called with the error, if any, and UploadForwardMessageResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(MessageService.prototype.uploadForwardMessage = function uploadForwardMessage(request, callback) {
                return this.rpcCall(uploadForwardMessage, $root.kritor.message.UploadForwardMessageRequest, $root.kritor.message.UploadForwardMessageResponse, request, callback);
            }, "name", { value: "UploadForwardMessage" });

            /**
             * Calls UploadForwardMessage.
             * @function uploadForwardMessage
             * @memberof kritor.message.MessageService
             * @instance
             * @param {kritor.message.IUploadForwardMessageRequest} request UploadForwardMessageRequest message or plain object
             * @returns {Promise<kritor.message.UploadForwardMessageResponse>} Promise
             * @variation 2
             */

            /**
             * Callback as used by {@link kritor.message.MessageService#downloadForwardMessage}.
             * @memberof kritor.message.MessageService
             * @typedef DownloadForwardMessageCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.message.DownloadForwardMessageResponse} [response] DownloadForwardMessageResponse
             */

            /**
             * Calls DownloadForwardMessage.
             * @function downloadForwardMessage
             * @memberof kritor.message.MessageService
             * @instance
             * @param {kritor.message.IDownloadForwardMessageRequest} request DownloadForwardMessageRequest message or plain object
             * @param {kritor.message.MessageService.DownloadForwardMessageCallback} callback Node-style callback called with the error, if any, and DownloadForwardMessageResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(MessageService.prototype.downloadForwardMessage = function downloadForwardMessage(request, callback) {
                return this.rpcCall(downloadForwardMessage, $root.kritor.message.DownloadForwardMessageRequest, $root.kritor.message.DownloadForwardMessageResponse, request, callback);
            }, "name", { value: "DownloadForwardMessage" });

            /**
             * Calls DownloadForwardMessage.
             * @function downloadForwardMessage
             * @memberof kritor.message.MessageService
             * @instance
             * @param {kritor.message.IDownloadForwardMessageRequest} request DownloadForwardMessageRequest message or plain object
             * @returns {Promise<kritor.message.DownloadForwardMessageResponse>} Promise
             * @variation 2
             */

            /**
             * Callback as used by {@link kritor.message.MessageService#getEssenceMessageList}.
             * @memberof kritor.message.MessageService
             * @typedef GetEssenceMessageListCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.message.GetEssenceMessageListResponse} [response] GetEssenceMessageListResponse
             */

            /**
             * Calls GetEssenceMessageList.
             * @function getEssenceMessageList
             * @memberof kritor.message.MessageService
             * @instance
             * @param {kritor.message.IGetEssenceMessageListRequest} request GetEssenceMessageListRequest message or plain object
             * @param {kritor.message.MessageService.GetEssenceMessageListCallback} callback Node-style callback called with the error, if any, and GetEssenceMessageListResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(MessageService.prototype.getEssenceMessageList = function getEssenceMessageList(request, callback) {
                return this.rpcCall(getEssenceMessageList, $root.kritor.message.GetEssenceMessageListRequest, $root.kritor.message.GetEssenceMessageListResponse, request, callback);
            }, "name", { value: "GetEssenceMessageList" });

            /**
             * Calls GetEssenceMessageList.
             * @function getEssenceMessageList
             * @memberof kritor.message.MessageService
             * @instance
             * @param {kritor.message.IGetEssenceMessageListRequest} request GetEssenceMessageListRequest message or plain object
             * @returns {Promise<kritor.message.GetEssenceMessageListResponse>} Promise
             * @variation 2
             */

            /**
             * Callback as used by {@link kritor.message.MessageService#setEssenceMessage}.
             * @memberof kritor.message.MessageService
             * @typedef SetEssenceMessageCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.message.SetEssenceMessageResponse} [response] SetEssenceMessageResponse
             */

            /**
             * Calls SetEssenceMessage.
             * @function setEssenceMessage
             * @memberof kritor.message.MessageService
             * @instance
             * @param {kritor.message.ISetEssenceMessageRequest} request SetEssenceMessageRequest message or plain object
             * @param {kritor.message.MessageService.SetEssenceMessageCallback} callback Node-style callback called with the error, if any, and SetEssenceMessageResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(MessageService.prototype.setEssenceMessage = function setEssenceMessage(request, callback) {
                return this.rpcCall(setEssenceMessage, $root.kritor.message.SetEssenceMessageRequest, $root.kritor.message.SetEssenceMessageResponse, request, callback);
            }, "name", { value: "SetEssenceMessage" });

            /**
             * Calls SetEssenceMessage.
             * @function setEssenceMessage
             * @memberof kritor.message.MessageService
             * @instance
             * @param {kritor.message.ISetEssenceMessageRequest} request SetEssenceMessageRequest message or plain object
             * @returns {Promise<kritor.message.SetEssenceMessageResponse>} Promise
             * @variation 2
             */

            /**
             * Callback as used by {@link kritor.message.MessageService#deleteEssenceMessage}.
             * @memberof kritor.message.MessageService
             * @typedef DeleteEssenceMessageCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.message.DeleteEssenceMessageResponse} [response] DeleteEssenceMessageResponse
             */

            /**
             * Calls DeleteEssenceMessage.
             * @function deleteEssenceMessage
             * @memberof kritor.message.MessageService
             * @instance
             * @param {kritor.message.IDeleteEssenceMessageRequest} request DeleteEssenceMessageRequest message or plain object
             * @param {kritor.message.MessageService.DeleteEssenceMessageCallback} callback Node-style callback called with the error, if any, and DeleteEssenceMessageResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(MessageService.prototype.deleteEssenceMessage = function deleteEssenceMessage(request, callback) {
                return this.rpcCall(deleteEssenceMessage, $root.kritor.message.DeleteEssenceMessageRequest, $root.kritor.message.DeleteEssenceMessageResponse, request, callback);
            }, "name", { value: "DeleteEssenceMessage" });

            /**
             * Calls DeleteEssenceMessage.
             * @function deleteEssenceMessage
             * @memberof kritor.message.MessageService
             * @instance
             * @param {kritor.message.IDeleteEssenceMessageRequest} request DeleteEssenceMessageRequest message or plain object
             * @returns {Promise<kritor.message.DeleteEssenceMessageResponse>} Promise
             * @variation 2
             */

            return MessageService;
        })();

        message.SendMessageRequest = (function() {

            /**
             * Properties of a SendMessageRequest.
             * @memberof kritor.message
             * @interface ISendMessageRequest
             * @property {kritor.common.IContact|null} [contact] SendMessageRequest contact
             * @property {Array.<kritor.common.IElement>|null} [elements] SendMessageRequest elements
             * @property {number|null} [retryCount] SendMessageRequest retryCount
             */

            /**
             * Constructs a new SendMessageRequest.
             * @memberof kritor.message
             * @classdesc Represents a SendMessageRequest.
             * @implements ISendMessageRequest
             * @constructor
             * @param {kritor.message.ISendMessageRequest=} [properties] Properties to set
             */
            function SendMessageRequest(properties) {
                this.elements = [];
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * SendMessageRequest contact.
             * @member {kritor.common.IContact|null|undefined} contact
             * @memberof kritor.message.SendMessageRequest
             * @instance
             */
            SendMessageRequest.prototype.contact = null;

            /**
             * SendMessageRequest elements.
             * @member {Array.<kritor.common.IElement>} elements
             * @memberof kritor.message.SendMessageRequest
             * @instance
             */
            SendMessageRequest.prototype.elements = $util.emptyArray;

            /**
             * SendMessageRequest retryCount.
             * @member {number|null|undefined} retryCount
             * @memberof kritor.message.SendMessageRequest
             * @instance
             */
            SendMessageRequest.prototype.retryCount = null;

            // OneOf field names bound to virtual getters and setters
            let $oneOfFields;

            /**
             * SendMessageRequest _retryCount.
             * @member {"retryCount"|undefined} _retryCount
             * @memberof kritor.message.SendMessageRequest
             * @instance
             */
            Object.defineProperty(SendMessageRequest.prototype, "_retryCount", {
                get: $util.oneOfGetter($oneOfFields = ["retryCount"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new SendMessageRequest instance using the specified properties.
             * @function create
             * @memberof kritor.message.SendMessageRequest
             * @static
             * @param {kritor.message.ISendMessageRequest=} [properties] Properties to set
             * @returns {kritor.message.SendMessageRequest} SendMessageRequest instance
             */
            SendMessageRequest.create = function create(properties) {
                return new SendMessageRequest(properties);
            };

            /**
             * Encodes the specified SendMessageRequest message. Does not implicitly {@link kritor.message.SendMessageRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.message.SendMessageRequest
             * @static
             * @param {kritor.message.ISendMessageRequest} message SendMessageRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SendMessageRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.contact != null && Object.hasOwnProperty.call(message, "contact"))
                    $root.kritor.common.Contact.encode(message.contact, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                if (message.elements != null && message.elements.length)
                    for (let i = 0; i < message.elements.length; ++i)
                        $root.kritor.common.Element.encode(message.elements[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                if (message.retryCount != null && Object.hasOwnProperty.call(message, "retryCount"))
                    writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.retryCount);
                return writer;
            };

            /**
             * Encodes the specified SendMessageRequest message, length delimited. Does not implicitly {@link kritor.message.SendMessageRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.message.SendMessageRequest
             * @static
             * @param {kritor.message.ISendMessageRequest} message SendMessageRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SendMessageRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a SendMessageRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.message.SendMessageRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.message.SendMessageRequest} SendMessageRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SendMessageRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.message.SendMessageRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.contact = $root.kritor.common.Contact.decode(reader, reader.uint32());
                            break;
                        }
                    case 2: {
                            if (!(message.elements && message.elements.length))
                                message.elements = [];
                            message.elements.push($root.kritor.common.Element.decode(reader, reader.uint32()));
                            break;
                        }
                    case 3: {
                            message.retryCount = reader.uint32();
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
             * Decodes a SendMessageRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.message.SendMessageRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.message.SendMessageRequest} SendMessageRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SendMessageRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a SendMessageRequest message.
             * @function verify
             * @memberof kritor.message.SendMessageRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            SendMessageRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                let properties = {};
                if (message.contact != null && message.hasOwnProperty("contact")) {
                    let error = $root.kritor.common.Contact.verify(message.contact);
                    if (error)
                        return "contact." + error;
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
                if (message.retryCount != null && message.hasOwnProperty("retryCount")) {
                    properties._retryCount = 1;
                    if (!$util.isInteger(message.retryCount))
                        return "retryCount: integer expected";
                }
                return null;
            };

            /**
             * Creates a SendMessageRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.message.SendMessageRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.message.SendMessageRequest} SendMessageRequest
             */
            SendMessageRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.message.SendMessageRequest)
                    return object;
                let message = new $root.kritor.message.SendMessageRequest();
                if (object.contact != null) {
                    if (typeof object.contact !== "object")
                        throw TypeError(".kritor.message.SendMessageRequest.contact: object expected");
                    message.contact = $root.kritor.common.Contact.fromObject(object.contact);
                }
                if (object.elements) {
                    if (!Array.isArray(object.elements))
                        throw TypeError(".kritor.message.SendMessageRequest.elements: array expected");
                    message.elements = [];
                    for (let i = 0; i < object.elements.length; ++i) {
                        if (typeof object.elements[i] !== "object")
                            throw TypeError(".kritor.message.SendMessageRequest.elements: object expected");
                        message.elements[i] = $root.kritor.common.Element.fromObject(object.elements[i]);
                    }
                }
                if (object.retryCount != null)
                    message.retryCount = object.retryCount >>> 0;
                return message;
            };

            /**
             * Creates a plain object from a SendMessageRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.message.SendMessageRequest
             * @static
             * @param {kritor.message.SendMessageRequest} message SendMessageRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            SendMessageRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.arrays || options.defaults)
                    object.elements = [];
                if (options.defaults)
                    object.contact = null;
                if (message.contact != null && message.hasOwnProperty("contact"))
                    object.contact = $root.kritor.common.Contact.toObject(message.contact, options);
                if (message.elements && message.elements.length) {
                    object.elements = [];
                    for (let j = 0; j < message.elements.length; ++j)
                        object.elements[j] = $root.kritor.common.Element.toObject(message.elements[j], options);
                }
                if (message.retryCount != null && message.hasOwnProperty("retryCount")) {
                    object.retryCount = message.retryCount;
                    if (options.oneofs)
                        object._retryCount = "retryCount";
                }
                return object;
            };

            /**
             * Converts this SendMessageRequest to JSON.
             * @function toJSON
             * @memberof kritor.message.SendMessageRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            SendMessageRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for SendMessageRequest
             * @function getTypeUrl
             * @memberof kritor.message.SendMessageRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            SendMessageRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.message.SendMessageRequest";
            };

            return SendMessageRequest;
        })();

        message.SendMessageResponse = (function() {

            /**
             * Properties of a SendMessageResponse.
             * @memberof kritor.message
             * @interface ISendMessageResponse
             * @property {string|null} [messageId] SendMessageResponse messageId
             * @property {number|null} [messageTime] SendMessageResponse messageTime
             */

            /**
             * Constructs a new SendMessageResponse.
             * @memberof kritor.message
             * @classdesc Represents a SendMessageResponse.
             * @implements ISendMessageResponse
             * @constructor
             * @param {kritor.message.ISendMessageResponse=} [properties] Properties to set
             */
            function SendMessageResponse(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * SendMessageResponse messageId.
             * @member {string} messageId
             * @memberof kritor.message.SendMessageResponse
             * @instance
             */
            SendMessageResponse.prototype.messageId = "";

            /**
             * SendMessageResponse messageTime.
             * @member {number} messageTime
             * @memberof kritor.message.SendMessageResponse
             * @instance
             */
            SendMessageResponse.prototype.messageTime = 0;

            /**
             * Creates a new SendMessageResponse instance using the specified properties.
             * @function create
             * @memberof kritor.message.SendMessageResponse
             * @static
             * @param {kritor.message.ISendMessageResponse=} [properties] Properties to set
             * @returns {kritor.message.SendMessageResponse} SendMessageResponse instance
             */
            SendMessageResponse.create = function create(properties) {
                return new SendMessageResponse(properties);
            };

            /**
             * Encodes the specified SendMessageResponse message. Does not implicitly {@link kritor.message.SendMessageResponse.verify|verify} messages.
             * @function encode
             * @memberof kritor.message.SendMessageResponse
             * @static
             * @param {kritor.message.ISendMessageResponse} message SendMessageResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SendMessageResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.messageId != null && Object.hasOwnProperty.call(message, "messageId"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.messageId);
                if (message.messageTime != null && Object.hasOwnProperty.call(message, "messageTime"))
                    writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.messageTime);
                return writer;
            };

            /**
             * Encodes the specified SendMessageResponse message, length delimited. Does not implicitly {@link kritor.message.SendMessageResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.message.SendMessageResponse
             * @static
             * @param {kritor.message.ISendMessageResponse} message SendMessageResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SendMessageResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a SendMessageResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.message.SendMessageResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.message.SendMessageResponse} SendMessageResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SendMessageResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.message.SendMessageResponse();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.messageId = reader.string();
                            break;
                        }
                    case 2: {
                            message.messageTime = reader.uint32();
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
             * Decodes a SendMessageResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.message.SendMessageResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.message.SendMessageResponse} SendMessageResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SendMessageResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a SendMessageResponse message.
             * @function verify
             * @memberof kritor.message.SendMessageResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            SendMessageResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.messageId != null && message.hasOwnProperty("messageId"))
                    if (!$util.isString(message.messageId))
                        return "messageId: string expected";
                if (message.messageTime != null && message.hasOwnProperty("messageTime"))
                    if (!$util.isInteger(message.messageTime))
                        return "messageTime: integer expected";
                return null;
            };

            /**
             * Creates a SendMessageResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.message.SendMessageResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.message.SendMessageResponse} SendMessageResponse
             */
            SendMessageResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.message.SendMessageResponse)
                    return object;
                let message = new $root.kritor.message.SendMessageResponse();
                if (object.messageId != null)
                    message.messageId = String(object.messageId);
                if (object.messageTime != null)
                    message.messageTime = object.messageTime >>> 0;
                return message;
            };

            /**
             * Creates a plain object from a SendMessageResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.message.SendMessageResponse
             * @static
             * @param {kritor.message.SendMessageResponse} message SendMessageResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            SendMessageResponse.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.messageId = "";
                    object.messageTime = 0;
                }
                if (message.messageId != null && message.hasOwnProperty("messageId"))
                    object.messageId = message.messageId;
                if (message.messageTime != null && message.hasOwnProperty("messageTime"))
                    object.messageTime = message.messageTime;
                return object;
            };

            /**
             * Converts this SendMessageResponse to JSON.
             * @function toJSON
             * @memberof kritor.message.SendMessageResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            SendMessageResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for SendMessageResponse
             * @function getTypeUrl
             * @memberof kritor.message.SendMessageResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            SendMessageResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.message.SendMessageResponse";
            };

            return SendMessageResponse;
        })();

        message.SendMessageByResIdRequest = (function() {

            /**
             * Properties of a SendMessageByResIdRequest.
             * @memberof kritor.message
             * @interface ISendMessageByResIdRequest
             * @property {kritor.common.IContact|null} [contact] SendMessageByResIdRequest contact
             * @property {string|null} [resId] SendMessageByResIdRequest resId
             * @property {number|null} [retryCount] SendMessageByResIdRequest retryCount
             */

            /**
             * Constructs a new SendMessageByResIdRequest.
             * @memberof kritor.message
             * @classdesc Represents a SendMessageByResIdRequest.
             * @implements ISendMessageByResIdRequest
             * @constructor
             * @param {kritor.message.ISendMessageByResIdRequest=} [properties] Properties to set
             */
            function SendMessageByResIdRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * SendMessageByResIdRequest contact.
             * @member {kritor.common.IContact|null|undefined} contact
             * @memberof kritor.message.SendMessageByResIdRequest
             * @instance
             */
            SendMessageByResIdRequest.prototype.contact = null;

            /**
             * SendMessageByResIdRequest resId.
             * @member {string} resId
             * @memberof kritor.message.SendMessageByResIdRequest
             * @instance
             */
            SendMessageByResIdRequest.prototype.resId = "";

            /**
             * SendMessageByResIdRequest retryCount.
             * @member {number|null|undefined} retryCount
             * @memberof kritor.message.SendMessageByResIdRequest
             * @instance
             */
            SendMessageByResIdRequest.prototype.retryCount = null;

            // OneOf field names bound to virtual getters and setters
            let $oneOfFields;

            /**
             * SendMessageByResIdRequest _retryCount.
             * @member {"retryCount"|undefined} _retryCount
             * @memberof kritor.message.SendMessageByResIdRequest
             * @instance
             */
            Object.defineProperty(SendMessageByResIdRequest.prototype, "_retryCount", {
                get: $util.oneOfGetter($oneOfFields = ["retryCount"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new SendMessageByResIdRequest instance using the specified properties.
             * @function create
             * @memberof kritor.message.SendMessageByResIdRequest
             * @static
             * @param {kritor.message.ISendMessageByResIdRequest=} [properties] Properties to set
             * @returns {kritor.message.SendMessageByResIdRequest} SendMessageByResIdRequest instance
             */
            SendMessageByResIdRequest.create = function create(properties) {
                return new SendMessageByResIdRequest(properties);
            };

            /**
             * Encodes the specified SendMessageByResIdRequest message. Does not implicitly {@link kritor.message.SendMessageByResIdRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.message.SendMessageByResIdRequest
             * @static
             * @param {kritor.message.ISendMessageByResIdRequest} message SendMessageByResIdRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SendMessageByResIdRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.contact != null && Object.hasOwnProperty.call(message, "contact"))
                    $root.kritor.common.Contact.encode(message.contact, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                if (message.resId != null && Object.hasOwnProperty.call(message, "resId"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.resId);
                if (message.retryCount != null && Object.hasOwnProperty.call(message, "retryCount"))
                    writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.retryCount);
                return writer;
            };

            /**
             * Encodes the specified SendMessageByResIdRequest message, length delimited. Does not implicitly {@link kritor.message.SendMessageByResIdRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.message.SendMessageByResIdRequest
             * @static
             * @param {kritor.message.ISendMessageByResIdRequest} message SendMessageByResIdRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SendMessageByResIdRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a SendMessageByResIdRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.message.SendMessageByResIdRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.message.SendMessageByResIdRequest} SendMessageByResIdRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SendMessageByResIdRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.message.SendMessageByResIdRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.contact = $root.kritor.common.Contact.decode(reader, reader.uint32());
                            break;
                        }
                    case 2: {
                            message.resId = reader.string();
                            break;
                        }
                    case 3: {
                            message.retryCount = reader.uint32();
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
             * Decodes a SendMessageByResIdRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.message.SendMessageByResIdRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.message.SendMessageByResIdRequest} SendMessageByResIdRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SendMessageByResIdRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a SendMessageByResIdRequest message.
             * @function verify
             * @memberof kritor.message.SendMessageByResIdRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            SendMessageByResIdRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                let properties = {};
                if (message.contact != null && message.hasOwnProperty("contact")) {
                    let error = $root.kritor.common.Contact.verify(message.contact);
                    if (error)
                        return "contact." + error;
                }
                if (message.resId != null && message.hasOwnProperty("resId"))
                    if (!$util.isString(message.resId))
                        return "resId: string expected";
                if (message.retryCount != null && message.hasOwnProperty("retryCount")) {
                    properties._retryCount = 1;
                    if (!$util.isInteger(message.retryCount))
                        return "retryCount: integer expected";
                }
                return null;
            };

            /**
             * Creates a SendMessageByResIdRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.message.SendMessageByResIdRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.message.SendMessageByResIdRequest} SendMessageByResIdRequest
             */
            SendMessageByResIdRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.message.SendMessageByResIdRequest)
                    return object;
                let message = new $root.kritor.message.SendMessageByResIdRequest();
                if (object.contact != null) {
                    if (typeof object.contact !== "object")
                        throw TypeError(".kritor.message.SendMessageByResIdRequest.contact: object expected");
                    message.contact = $root.kritor.common.Contact.fromObject(object.contact);
                }
                if (object.resId != null)
                    message.resId = String(object.resId);
                if (object.retryCount != null)
                    message.retryCount = object.retryCount >>> 0;
                return message;
            };

            /**
             * Creates a plain object from a SendMessageByResIdRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.message.SendMessageByResIdRequest
             * @static
             * @param {kritor.message.SendMessageByResIdRequest} message SendMessageByResIdRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            SendMessageByResIdRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.contact = null;
                    object.resId = "";
                }
                if (message.contact != null && message.hasOwnProperty("contact"))
                    object.contact = $root.kritor.common.Contact.toObject(message.contact, options);
                if (message.resId != null && message.hasOwnProperty("resId"))
                    object.resId = message.resId;
                if (message.retryCount != null && message.hasOwnProperty("retryCount")) {
                    object.retryCount = message.retryCount;
                    if (options.oneofs)
                        object._retryCount = "retryCount";
                }
                return object;
            };

            /**
             * Converts this SendMessageByResIdRequest to JSON.
             * @function toJSON
             * @memberof kritor.message.SendMessageByResIdRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            SendMessageByResIdRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for SendMessageByResIdRequest
             * @function getTypeUrl
             * @memberof kritor.message.SendMessageByResIdRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            SendMessageByResIdRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.message.SendMessageByResIdRequest";
            };

            return SendMessageByResIdRequest;
        })();

        message.SendMessageByResIdResponse = (function() {

            /**
             * Properties of a SendMessageByResIdResponse.
             * @memberof kritor.message
             * @interface ISendMessageByResIdResponse
             * @property {string|null} [messageId] SendMessageByResIdResponse messageId
             * @property {number|null} [messageTime] SendMessageByResIdResponse messageTime
             */

            /**
             * Constructs a new SendMessageByResIdResponse.
             * @memberof kritor.message
             * @classdesc Represents a SendMessageByResIdResponse.
             * @implements ISendMessageByResIdResponse
             * @constructor
             * @param {kritor.message.ISendMessageByResIdResponse=} [properties] Properties to set
             */
            function SendMessageByResIdResponse(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * SendMessageByResIdResponse messageId.
             * @member {string} messageId
             * @memberof kritor.message.SendMessageByResIdResponse
             * @instance
             */
            SendMessageByResIdResponse.prototype.messageId = "";

            /**
             * SendMessageByResIdResponse messageTime.
             * @member {number} messageTime
             * @memberof kritor.message.SendMessageByResIdResponse
             * @instance
             */
            SendMessageByResIdResponse.prototype.messageTime = 0;

            /**
             * Creates a new SendMessageByResIdResponse instance using the specified properties.
             * @function create
             * @memberof kritor.message.SendMessageByResIdResponse
             * @static
             * @param {kritor.message.ISendMessageByResIdResponse=} [properties] Properties to set
             * @returns {kritor.message.SendMessageByResIdResponse} SendMessageByResIdResponse instance
             */
            SendMessageByResIdResponse.create = function create(properties) {
                return new SendMessageByResIdResponse(properties);
            };

            /**
             * Encodes the specified SendMessageByResIdResponse message. Does not implicitly {@link kritor.message.SendMessageByResIdResponse.verify|verify} messages.
             * @function encode
             * @memberof kritor.message.SendMessageByResIdResponse
             * @static
             * @param {kritor.message.ISendMessageByResIdResponse} message SendMessageByResIdResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SendMessageByResIdResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.messageId != null && Object.hasOwnProperty.call(message, "messageId"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.messageId);
                if (message.messageTime != null && Object.hasOwnProperty.call(message, "messageTime"))
                    writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.messageTime);
                return writer;
            };

            /**
             * Encodes the specified SendMessageByResIdResponse message, length delimited. Does not implicitly {@link kritor.message.SendMessageByResIdResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.message.SendMessageByResIdResponse
             * @static
             * @param {kritor.message.ISendMessageByResIdResponse} message SendMessageByResIdResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SendMessageByResIdResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a SendMessageByResIdResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.message.SendMessageByResIdResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.message.SendMessageByResIdResponse} SendMessageByResIdResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SendMessageByResIdResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.message.SendMessageByResIdResponse();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.messageId = reader.string();
                            break;
                        }
                    case 2: {
                            message.messageTime = reader.uint32();
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
             * Decodes a SendMessageByResIdResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.message.SendMessageByResIdResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.message.SendMessageByResIdResponse} SendMessageByResIdResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SendMessageByResIdResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a SendMessageByResIdResponse message.
             * @function verify
             * @memberof kritor.message.SendMessageByResIdResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            SendMessageByResIdResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.messageId != null && message.hasOwnProperty("messageId"))
                    if (!$util.isString(message.messageId))
                        return "messageId: string expected";
                if (message.messageTime != null && message.hasOwnProperty("messageTime"))
                    if (!$util.isInteger(message.messageTime))
                        return "messageTime: integer expected";
                return null;
            };

            /**
             * Creates a SendMessageByResIdResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.message.SendMessageByResIdResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.message.SendMessageByResIdResponse} SendMessageByResIdResponse
             */
            SendMessageByResIdResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.message.SendMessageByResIdResponse)
                    return object;
                let message = new $root.kritor.message.SendMessageByResIdResponse();
                if (object.messageId != null)
                    message.messageId = String(object.messageId);
                if (object.messageTime != null)
                    message.messageTime = object.messageTime >>> 0;
                return message;
            };

            /**
             * Creates a plain object from a SendMessageByResIdResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.message.SendMessageByResIdResponse
             * @static
             * @param {kritor.message.SendMessageByResIdResponse} message SendMessageByResIdResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            SendMessageByResIdResponse.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.messageId = "";
                    object.messageTime = 0;
                }
                if (message.messageId != null && message.hasOwnProperty("messageId"))
                    object.messageId = message.messageId;
                if (message.messageTime != null && message.hasOwnProperty("messageTime"))
                    object.messageTime = message.messageTime;
                return object;
            };

            /**
             * Converts this SendMessageByResIdResponse to JSON.
             * @function toJSON
             * @memberof kritor.message.SendMessageByResIdResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            SendMessageByResIdResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for SendMessageByResIdResponse
             * @function getTypeUrl
             * @memberof kritor.message.SendMessageByResIdResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            SendMessageByResIdResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.message.SendMessageByResIdResponse";
            };

            return SendMessageByResIdResponse;
        })();

        message.SetMessageReadRequest = (function() {

            /**
             * Properties of a SetMessageReadRequest.
             * @memberof kritor.message
             * @interface ISetMessageReadRequest
             * @property {kritor.common.IContact|null} [contact] SetMessageReadRequest contact
             */

            /**
             * Constructs a new SetMessageReadRequest.
             * @memberof kritor.message
             * @classdesc Represents a SetMessageReadRequest.
             * @implements ISetMessageReadRequest
             * @constructor
             * @param {kritor.message.ISetMessageReadRequest=} [properties] Properties to set
             */
            function SetMessageReadRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * SetMessageReadRequest contact.
             * @member {kritor.common.IContact|null|undefined} contact
             * @memberof kritor.message.SetMessageReadRequest
             * @instance
             */
            SetMessageReadRequest.prototype.contact = null;

            /**
             * Creates a new SetMessageReadRequest instance using the specified properties.
             * @function create
             * @memberof kritor.message.SetMessageReadRequest
             * @static
             * @param {kritor.message.ISetMessageReadRequest=} [properties] Properties to set
             * @returns {kritor.message.SetMessageReadRequest} SetMessageReadRequest instance
             */
            SetMessageReadRequest.create = function create(properties) {
                return new SetMessageReadRequest(properties);
            };

            /**
             * Encodes the specified SetMessageReadRequest message. Does not implicitly {@link kritor.message.SetMessageReadRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.message.SetMessageReadRequest
             * @static
             * @param {kritor.message.ISetMessageReadRequest} message SetMessageReadRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SetMessageReadRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.contact != null && Object.hasOwnProperty.call(message, "contact"))
                    $root.kritor.common.Contact.encode(message.contact, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified SetMessageReadRequest message, length delimited. Does not implicitly {@link kritor.message.SetMessageReadRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.message.SetMessageReadRequest
             * @static
             * @param {kritor.message.ISetMessageReadRequest} message SetMessageReadRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SetMessageReadRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a SetMessageReadRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.message.SetMessageReadRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.message.SetMessageReadRequest} SetMessageReadRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SetMessageReadRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.message.SetMessageReadRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.contact = $root.kritor.common.Contact.decode(reader, reader.uint32());
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
             * Decodes a SetMessageReadRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.message.SetMessageReadRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.message.SetMessageReadRequest} SetMessageReadRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SetMessageReadRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a SetMessageReadRequest message.
             * @function verify
             * @memberof kritor.message.SetMessageReadRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            SetMessageReadRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.contact != null && message.hasOwnProperty("contact")) {
                    let error = $root.kritor.common.Contact.verify(message.contact);
                    if (error)
                        return "contact." + error;
                }
                return null;
            };

            /**
             * Creates a SetMessageReadRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.message.SetMessageReadRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.message.SetMessageReadRequest} SetMessageReadRequest
             */
            SetMessageReadRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.message.SetMessageReadRequest)
                    return object;
                let message = new $root.kritor.message.SetMessageReadRequest();
                if (object.contact != null) {
                    if (typeof object.contact !== "object")
                        throw TypeError(".kritor.message.SetMessageReadRequest.contact: object expected");
                    message.contact = $root.kritor.common.Contact.fromObject(object.contact);
                }
                return message;
            };

            /**
             * Creates a plain object from a SetMessageReadRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.message.SetMessageReadRequest
             * @static
             * @param {kritor.message.SetMessageReadRequest} message SetMessageReadRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            SetMessageReadRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults)
                    object.contact = null;
                if (message.contact != null && message.hasOwnProperty("contact"))
                    object.contact = $root.kritor.common.Contact.toObject(message.contact, options);
                return object;
            };

            /**
             * Converts this SetMessageReadRequest to JSON.
             * @function toJSON
             * @memberof kritor.message.SetMessageReadRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            SetMessageReadRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for SetMessageReadRequest
             * @function getTypeUrl
             * @memberof kritor.message.SetMessageReadRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            SetMessageReadRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.message.SetMessageReadRequest";
            };

            return SetMessageReadRequest;
        })();

        message.SetMessageReadResponse = (function() {

            /**
             * Properties of a SetMessageReadResponse.
             * @memberof kritor.message
             * @interface ISetMessageReadResponse
             */

            /**
             * Constructs a new SetMessageReadResponse.
             * @memberof kritor.message
             * @classdesc Represents a SetMessageReadResponse.
             * @implements ISetMessageReadResponse
             * @constructor
             * @param {kritor.message.ISetMessageReadResponse=} [properties] Properties to set
             */
            function SetMessageReadResponse(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Creates a new SetMessageReadResponse instance using the specified properties.
             * @function create
             * @memberof kritor.message.SetMessageReadResponse
             * @static
             * @param {kritor.message.ISetMessageReadResponse=} [properties] Properties to set
             * @returns {kritor.message.SetMessageReadResponse} SetMessageReadResponse instance
             */
            SetMessageReadResponse.create = function create(properties) {
                return new SetMessageReadResponse(properties);
            };

            /**
             * Encodes the specified SetMessageReadResponse message. Does not implicitly {@link kritor.message.SetMessageReadResponse.verify|verify} messages.
             * @function encode
             * @memberof kritor.message.SetMessageReadResponse
             * @static
             * @param {kritor.message.ISetMessageReadResponse} message SetMessageReadResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SetMessageReadResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                return writer;
            };

            /**
             * Encodes the specified SetMessageReadResponse message, length delimited. Does not implicitly {@link kritor.message.SetMessageReadResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.message.SetMessageReadResponse
             * @static
             * @param {kritor.message.ISetMessageReadResponse} message SetMessageReadResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SetMessageReadResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a SetMessageReadResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.message.SetMessageReadResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.message.SetMessageReadResponse} SetMessageReadResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SetMessageReadResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.message.SetMessageReadResponse();
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
             * Decodes a SetMessageReadResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.message.SetMessageReadResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.message.SetMessageReadResponse} SetMessageReadResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SetMessageReadResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a SetMessageReadResponse message.
             * @function verify
             * @memberof kritor.message.SetMessageReadResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            SetMessageReadResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                return null;
            };

            /**
             * Creates a SetMessageReadResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.message.SetMessageReadResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.message.SetMessageReadResponse} SetMessageReadResponse
             */
            SetMessageReadResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.message.SetMessageReadResponse)
                    return object;
                return new $root.kritor.message.SetMessageReadResponse();
            };

            /**
             * Creates a plain object from a SetMessageReadResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.message.SetMessageReadResponse
             * @static
             * @param {kritor.message.SetMessageReadResponse} message SetMessageReadResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            SetMessageReadResponse.toObject = function toObject() {
                return {};
            };

            /**
             * Converts this SetMessageReadResponse to JSON.
             * @function toJSON
             * @memberof kritor.message.SetMessageReadResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            SetMessageReadResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for SetMessageReadResponse
             * @function getTypeUrl
             * @memberof kritor.message.SetMessageReadResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            SetMessageReadResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.message.SetMessageReadResponse";
            };

            return SetMessageReadResponse;
        })();

        message.RecallMessageRequest = (function() {

            /**
             * Properties of a RecallMessageRequest.
             * @memberof kritor.message
             * @interface IRecallMessageRequest
             * @property {kritor.common.IContact|null} [contact] RecallMessageRequest contact
             * @property {string|null} [messageId] RecallMessageRequest messageId
             */

            /**
             * Constructs a new RecallMessageRequest.
             * @memberof kritor.message
             * @classdesc Represents a RecallMessageRequest.
             * @implements IRecallMessageRequest
             * @constructor
             * @param {kritor.message.IRecallMessageRequest=} [properties] Properties to set
             */
            function RecallMessageRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * RecallMessageRequest contact.
             * @member {kritor.common.IContact|null|undefined} contact
             * @memberof kritor.message.RecallMessageRequest
             * @instance
             */
            RecallMessageRequest.prototype.contact = null;

            /**
             * RecallMessageRequest messageId.
             * @member {string} messageId
             * @memberof kritor.message.RecallMessageRequest
             * @instance
             */
            RecallMessageRequest.prototype.messageId = "";

            /**
             * Creates a new RecallMessageRequest instance using the specified properties.
             * @function create
             * @memberof kritor.message.RecallMessageRequest
             * @static
             * @param {kritor.message.IRecallMessageRequest=} [properties] Properties to set
             * @returns {kritor.message.RecallMessageRequest} RecallMessageRequest instance
             */
            RecallMessageRequest.create = function create(properties) {
                return new RecallMessageRequest(properties);
            };

            /**
             * Encodes the specified RecallMessageRequest message. Does not implicitly {@link kritor.message.RecallMessageRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.message.RecallMessageRequest
             * @static
             * @param {kritor.message.IRecallMessageRequest} message RecallMessageRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            RecallMessageRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.contact != null && Object.hasOwnProperty.call(message, "contact"))
                    $root.kritor.common.Contact.encode(message.contact, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                if (message.messageId != null && Object.hasOwnProperty.call(message, "messageId"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.messageId);
                return writer;
            };

            /**
             * Encodes the specified RecallMessageRequest message, length delimited. Does not implicitly {@link kritor.message.RecallMessageRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.message.RecallMessageRequest
             * @static
             * @param {kritor.message.IRecallMessageRequest} message RecallMessageRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            RecallMessageRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a RecallMessageRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.message.RecallMessageRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.message.RecallMessageRequest} RecallMessageRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            RecallMessageRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.message.RecallMessageRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.contact = $root.kritor.common.Contact.decode(reader, reader.uint32());
                            break;
                        }
                    case 2: {
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
             * Decodes a RecallMessageRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.message.RecallMessageRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.message.RecallMessageRequest} RecallMessageRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            RecallMessageRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a RecallMessageRequest message.
             * @function verify
             * @memberof kritor.message.RecallMessageRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            RecallMessageRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.contact != null && message.hasOwnProperty("contact")) {
                    let error = $root.kritor.common.Contact.verify(message.contact);
                    if (error)
                        return "contact." + error;
                }
                if (message.messageId != null && message.hasOwnProperty("messageId"))
                    if (!$util.isString(message.messageId))
                        return "messageId: string expected";
                return null;
            };

            /**
             * Creates a RecallMessageRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.message.RecallMessageRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.message.RecallMessageRequest} RecallMessageRequest
             */
            RecallMessageRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.message.RecallMessageRequest)
                    return object;
                let message = new $root.kritor.message.RecallMessageRequest();
                if (object.contact != null) {
                    if (typeof object.contact !== "object")
                        throw TypeError(".kritor.message.RecallMessageRequest.contact: object expected");
                    message.contact = $root.kritor.common.Contact.fromObject(object.contact);
                }
                if (object.messageId != null)
                    message.messageId = String(object.messageId);
                return message;
            };

            /**
             * Creates a plain object from a RecallMessageRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.message.RecallMessageRequest
             * @static
             * @param {kritor.message.RecallMessageRequest} message RecallMessageRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            RecallMessageRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.contact = null;
                    object.messageId = "";
                }
                if (message.contact != null && message.hasOwnProperty("contact"))
                    object.contact = $root.kritor.common.Contact.toObject(message.contact, options);
                if (message.messageId != null && message.hasOwnProperty("messageId"))
                    object.messageId = message.messageId;
                return object;
            };

            /**
             * Converts this RecallMessageRequest to JSON.
             * @function toJSON
             * @memberof kritor.message.RecallMessageRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            RecallMessageRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for RecallMessageRequest
             * @function getTypeUrl
             * @memberof kritor.message.RecallMessageRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            RecallMessageRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.message.RecallMessageRequest";
            };

            return RecallMessageRequest;
        })();

        message.RecallMessageResponse = (function() {

            /**
             * Properties of a RecallMessageResponse.
             * @memberof kritor.message
             * @interface IRecallMessageResponse
             */

            /**
             * Constructs a new RecallMessageResponse.
             * @memberof kritor.message
             * @classdesc Represents a RecallMessageResponse.
             * @implements IRecallMessageResponse
             * @constructor
             * @param {kritor.message.IRecallMessageResponse=} [properties] Properties to set
             */
            function RecallMessageResponse(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Creates a new RecallMessageResponse instance using the specified properties.
             * @function create
             * @memberof kritor.message.RecallMessageResponse
             * @static
             * @param {kritor.message.IRecallMessageResponse=} [properties] Properties to set
             * @returns {kritor.message.RecallMessageResponse} RecallMessageResponse instance
             */
            RecallMessageResponse.create = function create(properties) {
                return new RecallMessageResponse(properties);
            };

            /**
             * Encodes the specified RecallMessageResponse message. Does not implicitly {@link kritor.message.RecallMessageResponse.verify|verify} messages.
             * @function encode
             * @memberof kritor.message.RecallMessageResponse
             * @static
             * @param {kritor.message.IRecallMessageResponse} message RecallMessageResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            RecallMessageResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                return writer;
            };

            /**
             * Encodes the specified RecallMessageResponse message, length delimited. Does not implicitly {@link kritor.message.RecallMessageResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.message.RecallMessageResponse
             * @static
             * @param {kritor.message.IRecallMessageResponse} message RecallMessageResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            RecallMessageResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a RecallMessageResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.message.RecallMessageResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.message.RecallMessageResponse} RecallMessageResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            RecallMessageResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.message.RecallMessageResponse();
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
             * Decodes a RecallMessageResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.message.RecallMessageResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.message.RecallMessageResponse} RecallMessageResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            RecallMessageResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a RecallMessageResponse message.
             * @function verify
             * @memberof kritor.message.RecallMessageResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            RecallMessageResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                return null;
            };

            /**
             * Creates a RecallMessageResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.message.RecallMessageResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.message.RecallMessageResponse} RecallMessageResponse
             */
            RecallMessageResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.message.RecallMessageResponse)
                    return object;
                return new $root.kritor.message.RecallMessageResponse();
            };

            /**
             * Creates a plain object from a RecallMessageResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.message.RecallMessageResponse
             * @static
             * @param {kritor.message.RecallMessageResponse} message RecallMessageResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            RecallMessageResponse.toObject = function toObject() {
                return {};
            };

            /**
             * Converts this RecallMessageResponse to JSON.
             * @function toJSON
             * @memberof kritor.message.RecallMessageResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            RecallMessageResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for RecallMessageResponse
             * @function getTypeUrl
             * @memberof kritor.message.RecallMessageResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            RecallMessageResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.message.RecallMessageResponse";
            };

            return RecallMessageResponse;
        })();

        message.ReactMessageWithEmojiRequest = (function() {

            /**
             * Properties of a ReactMessageWithEmojiRequest.
             * @memberof kritor.message
             * @interface IReactMessageWithEmojiRequest
             * @property {kritor.common.IContact|null} [contact] ReactMessageWithEmojiRequest contact
             * @property {string|null} [messageId] ReactMessageWithEmojiRequest messageId
             * @property {number|null} [faceId] ReactMessageWithEmojiRequest faceId
             * @property {boolean|null} [isSet] ReactMessageWithEmojiRequest isSet
             */

            /**
             * Constructs a new ReactMessageWithEmojiRequest.
             * @memberof kritor.message
             * @classdesc Represents a ReactMessageWithEmojiRequest.
             * @implements IReactMessageWithEmojiRequest
             * @constructor
             * @param {kritor.message.IReactMessageWithEmojiRequest=} [properties] Properties to set
             */
            function ReactMessageWithEmojiRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * ReactMessageWithEmojiRequest contact.
             * @member {kritor.common.IContact|null|undefined} contact
             * @memberof kritor.message.ReactMessageWithEmojiRequest
             * @instance
             */
            ReactMessageWithEmojiRequest.prototype.contact = null;

            /**
             * ReactMessageWithEmojiRequest messageId.
             * @member {string} messageId
             * @memberof kritor.message.ReactMessageWithEmojiRequest
             * @instance
             */
            ReactMessageWithEmojiRequest.prototype.messageId = "";

            /**
             * ReactMessageWithEmojiRequest faceId.
             * @member {number} faceId
             * @memberof kritor.message.ReactMessageWithEmojiRequest
             * @instance
             */
            ReactMessageWithEmojiRequest.prototype.faceId = 0;

            /**
             * ReactMessageWithEmojiRequest isSet.
             * @member {boolean} isSet
             * @memberof kritor.message.ReactMessageWithEmojiRequest
             * @instance
             */
            ReactMessageWithEmojiRequest.prototype.isSet = false;

            /**
             * Creates a new ReactMessageWithEmojiRequest instance using the specified properties.
             * @function create
             * @memberof kritor.message.ReactMessageWithEmojiRequest
             * @static
             * @param {kritor.message.IReactMessageWithEmojiRequest=} [properties] Properties to set
             * @returns {kritor.message.ReactMessageWithEmojiRequest} ReactMessageWithEmojiRequest instance
             */
            ReactMessageWithEmojiRequest.create = function create(properties) {
                return new ReactMessageWithEmojiRequest(properties);
            };

            /**
             * Encodes the specified ReactMessageWithEmojiRequest message. Does not implicitly {@link kritor.message.ReactMessageWithEmojiRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.message.ReactMessageWithEmojiRequest
             * @static
             * @param {kritor.message.IReactMessageWithEmojiRequest} message ReactMessageWithEmojiRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ReactMessageWithEmojiRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.contact != null && Object.hasOwnProperty.call(message, "contact"))
                    $root.kritor.common.Contact.encode(message.contact, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                if (message.messageId != null && Object.hasOwnProperty.call(message, "messageId"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.messageId);
                if (message.faceId != null && Object.hasOwnProperty.call(message, "faceId"))
                    writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.faceId);
                if (message.isSet != null && Object.hasOwnProperty.call(message, "isSet"))
                    writer.uint32(/* id 4, wireType 0 =*/32).bool(message.isSet);
                return writer;
            };

            /**
             * Encodes the specified ReactMessageWithEmojiRequest message, length delimited. Does not implicitly {@link kritor.message.ReactMessageWithEmojiRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.message.ReactMessageWithEmojiRequest
             * @static
             * @param {kritor.message.IReactMessageWithEmojiRequest} message ReactMessageWithEmojiRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ReactMessageWithEmojiRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a ReactMessageWithEmojiRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.message.ReactMessageWithEmojiRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.message.ReactMessageWithEmojiRequest} ReactMessageWithEmojiRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ReactMessageWithEmojiRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.message.ReactMessageWithEmojiRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.contact = $root.kritor.common.Contact.decode(reader, reader.uint32());
                            break;
                        }
                    case 2: {
                            message.messageId = reader.string();
                            break;
                        }
                    case 3: {
                            message.faceId = reader.uint32();
                            break;
                        }
                    case 4: {
                            message.isSet = reader.bool();
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
             * Decodes a ReactMessageWithEmojiRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.message.ReactMessageWithEmojiRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.message.ReactMessageWithEmojiRequest} ReactMessageWithEmojiRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ReactMessageWithEmojiRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a ReactMessageWithEmojiRequest message.
             * @function verify
             * @memberof kritor.message.ReactMessageWithEmojiRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ReactMessageWithEmojiRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.contact != null && message.hasOwnProperty("contact")) {
                    let error = $root.kritor.common.Contact.verify(message.contact);
                    if (error)
                        return "contact." + error;
                }
                if (message.messageId != null && message.hasOwnProperty("messageId"))
                    if (!$util.isString(message.messageId))
                        return "messageId: string expected";
                if (message.faceId != null && message.hasOwnProperty("faceId"))
                    if (!$util.isInteger(message.faceId))
                        return "faceId: integer expected";
                if (message.isSet != null && message.hasOwnProperty("isSet"))
                    if (typeof message.isSet !== "boolean")
                        return "isSet: boolean expected";
                return null;
            };

            /**
             * Creates a ReactMessageWithEmojiRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.message.ReactMessageWithEmojiRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.message.ReactMessageWithEmojiRequest} ReactMessageWithEmojiRequest
             */
            ReactMessageWithEmojiRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.message.ReactMessageWithEmojiRequest)
                    return object;
                let message = new $root.kritor.message.ReactMessageWithEmojiRequest();
                if (object.contact != null) {
                    if (typeof object.contact !== "object")
                        throw TypeError(".kritor.message.ReactMessageWithEmojiRequest.contact: object expected");
                    message.contact = $root.kritor.common.Contact.fromObject(object.contact);
                }
                if (object.messageId != null)
                    message.messageId = String(object.messageId);
                if (object.faceId != null)
                    message.faceId = object.faceId >>> 0;
                if (object.isSet != null)
                    message.isSet = Boolean(object.isSet);
                return message;
            };

            /**
             * Creates a plain object from a ReactMessageWithEmojiRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.message.ReactMessageWithEmojiRequest
             * @static
             * @param {kritor.message.ReactMessageWithEmojiRequest} message ReactMessageWithEmojiRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ReactMessageWithEmojiRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.contact = null;
                    object.messageId = "";
                    object.faceId = 0;
                    object.isSet = false;
                }
                if (message.contact != null && message.hasOwnProperty("contact"))
                    object.contact = $root.kritor.common.Contact.toObject(message.contact, options);
                if (message.messageId != null && message.hasOwnProperty("messageId"))
                    object.messageId = message.messageId;
                if (message.faceId != null && message.hasOwnProperty("faceId"))
                    object.faceId = message.faceId;
                if (message.isSet != null && message.hasOwnProperty("isSet"))
                    object.isSet = message.isSet;
                return object;
            };

            /**
             * Converts this ReactMessageWithEmojiRequest to JSON.
             * @function toJSON
             * @memberof kritor.message.ReactMessageWithEmojiRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ReactMessageWithEmojiRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for ReactMessageWithEmojiRequest
             * @function getTypeUrl
             * @memberof kritor.message.ReactMessageWithEmojiRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            ReactMessageWithEmojiRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.message.ReactMessageWithEmojiRequest";
            };

            return ReactMessageWithEmojiRequest;
        })();

        message.ReactMessageWithEmojiResponse = (function() {

            /**
             * Properties of a ReactMessageWithEmojiResponse.
             * @memberof kritor.message
             * @interface IReactMessageWithEmojiResponse
             */

            /**
             * Constructs a new ReactMessageWithEmojiResponse.
             * @memberof kritor.message
             * @classdesc Represents a ReactMessageWithEmojiResponse.
             * @implements IReactMessageWithEmojiResponse
             * @constructor
             * @param {kritor.message.IReactMessageWithEmojiResponse=} [properties] Properties to set
             */
            function ReactMessageWithEmojiResponse(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Creates a new ReactMessageWithEmojiResponse instance using the specified properties.
             * @function create
             * @memberof kritor.message.ReactMessageWithEmojiResponse
             * @static
             * @param {kritor.message.IReactMessageWithEmojiResponse=} [properties] Properties to set
             * @returns {kritor.message.ReactMessageWithEmojiResponse} ReactMessageWithEmojiResponse instance
             */
            ReactMessageWithEmojiResponse.create = function create(properties) {
                return new ReactMessageWithEmojiResponse(properties);
            };

            /**
             * Encodes the specified ReactMessageWithEmojiResponse message. Does not implicitly {@link kritor.message.ReactMessageWithEmojiResponse.verify|verify} messages.
             * @function encode
             * @memberof kritor.message.ReactMessageWithEmojiResponse
             * @static
             * @param {kritor.message.IReactMessageWithEmojiResponse} message ReactMessageWithEmojiResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ReactMessageWithEmojiResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                return writer;
            };

            /**
             * Encodes the specified ReactMessageWithEmojiResponse message, length delimited. Does not implicitly {@link kritor.message.ReactMessageWithEmojiResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.message.ReactMessageWithEmojiResponse
             * @static
             * @param {kritor.message.IReactMessageWithEmojiResponse} message ReactMessageWithEmojiResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ReactMessageWithEmojiResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a ReactMessageWithEmojiResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.message.ReactMessageWithEmojiResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.message.ReactMessageWithEmojiResponse} ReactMessageWithEmojiResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ReactMessageWithEmojiResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.message.ReactMessageWithEmojiResponse();
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
             * Decodes a ReactMessageWithEmojiResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.message.ReactMessageWithEmojiResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.message.ReactMessageWithEmojiResponse} ReactMessageWithEmojiResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ReactMessageWithEmojiResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a ReactMessageWithEmojiResponse message.
             * @function verify
             * @memberof kritor.message.ReactMessageWithEmojiResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ReactMessageWithEmojiResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                return null;
            };

            /**
             * Creates a ReactMessageWithEmojiResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.message.ReactMessageWithEmojiResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.message.ReactMessageWithEmojiResponse} ReactMessageWithEmojiResponse
             */
            ReactMessageWithEmojiResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.message.ReactMessageWithEmojiResponse)
                    return object;
                return new $root.kritor.message.ReactMessageWithEmojiResponse();
            };

            /**
             * Creates a plain object from a ReactMessageWithEmojiResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.message.ReactMessageWithEmojiResponse
             * @static
             * @param {kritor.message.ReactMessageWithEmojiResponse} message ReactMessageWithEmojiResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ReactMessageWithEmojiResponse.toObject = function toObject() {
                return {};
            };

            /**
             * Converts this ReactMessageWithEmojiResponse to JSON.
             * @function toJSON
             * @memberof kritor.message.ReactMessageWithEmojiResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ReactMessageWithEmojiResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for ReactMessageWithEmojiResponse
             * @function getTypeUrl
             * @memberof kritor.message.ReactMessageWithEmojiResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            ReactMessageWithEmojiResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.message.ReactMessageWithEmojiResponse";
            };

            return ReactMessageWithEmojiResponse;
        })();

        message.GetMessageRequest = (function() {

            /**
             * Properties of a GetMessageRequest.
             * @memberof kritor.message
             * @interface IGetMessageRequest
             * @property {kritor.common.IContact|null} [contact] GetMessageRequest contact
             * @property {string|null} [messageId] GetMessageRequest messageId
             */

            /**
             * Constructs a new GetMessageRequest.
             * @memberof kritor.message
             * @classdesc Represents a GetMessageRequest.
             * @implements IGetMessageRequest
             * @constructor
             * @param {kritor.message.IGetMessageRequest=} [properties] Properties to set
             */
            function GetMessageRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetMessageRequest contact.
             * @member {kritor.common.IContact|null|undefined} contact
             * @memberof kritor.message.GetMessageRequest
             * @instance
             */
            GetMessageRequest.prototype.contact = null;

            /**
             * GetMessageRequest messageId.
             * @member {string} messageId
             * @memberof kritor.message.GetMessageRequest
             * @instance
             */
            GetMessageRequest.prototype.messageId = "";

            /**
             * Creates a new GetMessageRequest instance using the specified properties.
             * @function create
             * @memberof kritor.message.GetMessageRequest
             * @static
             * @param {kritor.message.IGetMessageRequest=} [properties] Properties to set
             * @returns {kritor.message.GetMessageRequest} GetMessageRequest instance
             */
            GetMessageRequest.create = function create(properties) {
                return new GetMessageRequest(properties);
            };

            /**
             * Encodes the specified GetMessageRequest message. Does not implicitly {@link kritor.message.GetMessageRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.message.GetMessageRequest
             * @static
             * @param {kritor.message.IGetMessageRequest} message GetMessageRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetMessageRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.contact != null && Object.hasOwnProperty.call(message, "contact"))
                    $root.kritor.common.Contact.encode(message.contact, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                if (message.messageId != null && Object.hasOwnProperty.call(message, "messageId"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.messageId);
                return writer;
            };

            /**
             * Encodes the specified GetMessageRequest message, length delimited. Does not implicitly {@link kritor.message.GetMessageRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.message.GetMessageRequest
             * @static
             * @param {kritor.message.IGetMessageRequest} message GetMessageRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetMessageRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetMessageRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.message.GetMessageRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.message.GetMessageRequest} GetMessageRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetMessageRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.message.GetMessageRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.contact = $root.kritor.common.Contact.decode(reader, reader.uint32());
                            break;
                        }
                    case 2: {
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
             * Decodes a GetMessageRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.message.GetMessageRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.message.GetMessageRequest} GetMessageRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetMessageRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetMessageRequest message.
             * @function verify
             * @memberof kritor.message.GetMessageRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetMessageRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.contact != null && message.hasOwnProperty("contact")) {
                    let error = $root.kritor.common.Contact.verify(message.contact);
                    if (error)
                        return "contact." + error;
                }
                if (message.messageId != null && message.hasOwnProperty("messageId"))
                    if (!$util.isString(message.messageId))
                        return "messageId: string expected";
                return null;
            };

            /**
             * Creates a GetMessageRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.message.GetMessageRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.message.GetMessageRequest} GetMessageRequest
             */
            GetMessageRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.message.GetMessageRequest)
                    return object;
                let message = new $root.kritor.message.GetMessageRequest();
                if (object.contact != null) {
                    if (typeof object.contact !== "object")
                        throw TypeError(".kritor.message.GetMessageRequest.contact: object expected");
                    message.contact = $root.kritor.common.Contact.fromObject(object.contact);
                }
                if (object.messageId != null)
                    message.messageId = String(object.messageId);
                return message;
            };

            /**
             * Creates a plain object from a GetMessageRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.message.GetMessageRequest
             * @static
             * @param {kritor.message.GetMessageRequest} message GetMessageRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetMessageRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.contact = null;
                    object.messageId = "";
                }
                if (message.contact != null && message.hasOwnProperty("contact"))
                    object.contact = $root.kritor.common.Contact.toObject(message.contact, options);
                if (message.messageId != null && message.hasOwnProperty("messageId"))
                    object.messageId = message.messageId;
                return object;
            };

            /**
             * Converts this GetMessageRequest to JSON.
             * @function toJSON
             * @memberof kritor.message.GetMessageRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetMessageRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GetMessageRequest
             * @function getTypeUrl
             * @memberof kritor.message.GetMessageRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetMessageRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.message.GetMessageRequest";
            };

            return GetMessageRequest;
        })();

        message.GetMessageResponse = (function() {

            /**
             * Properties of a GetMessageResponse.
             * @memberof kritor.message
             * @interface IGetMessageResponse
             * @property {kritor.common.IPushMessageBody|null} [message] GetMessageResponse message
             */

            /**
             * Constructs a new GetMessageResponse.
             * @memberof kritor.message
             * @classdesc Represents a GetMessageResponse.
             * @implements IGetMessageResponse
             * @constructor
             * @param {kritor.message.IGetMessageResponse=} [properties] Properties to set
             */
            function GetMessageResponse(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetMessageResponse message.
             * @member {kritor.common.IPushMessageBody|null|undefined} message
             * @memberof kritor.message.GetMessageResponse
             * @instance
             */
            GetMessageResponse.prototype.message = null;

            /**
             * Creates a new GetMessageResponse instance using the specified properties.
             * @function create
             * @memberof kritor.message.GetMessageResponse
             * @static
             * @param {kritor.message.IGetMessageResponse=} [properties] Properties to set
             * @returns {kritor.message.GetMessageResponse} GetMessageResponse instance
             */
            GetMessageResponse.create = function create(properties) {
                return new GetMessageResponse(properties);
            };

            /**
             * Encodes the specified GetMessageResponse message. Does not implicitly {@link kritor.message.GetMessageResponse.verify|verify} messages.
             * @function encode
             * @memberof kritor.message.GetMessageResponse
             * @static
             * @param {kritor.message.IGetMessageResponse} message GetMessageResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetMessageResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.message != null && Object.hasOwnProperty.call(message, "message"))
                    $root.kritor.common.PushMessageBody.encode(message.message, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified GetMessageResponse message, length delimited. Does not implicitly {@link kritor.message.GetMessageResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.message.GetMessageResponse
             * @static
             * @param {kritor.message.IGetMessageResponse} message GetMessageResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetMessageResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetMessageResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.message.GetMessageResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.message.GetMessageResponse} GetMessageResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetMessageResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.message.GetMessageResponse();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
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
             * Decodes a GetMessageResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.message.GetMessageResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.message.GetMessageResponse} GetMessageResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetMessageResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetMessageResponse message.
             * @function verify
             * @memberof kritor.message.GetMessageResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetMessageResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.message != null && message.hasOwnProperty("message")) {
                    let error = $root.kritor.common.PushMessageBody.verify(message.message);
                    if (error)
                        return "message." + error;
                }
                return null;
            };

            /**
             * Creates a GetMessageResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.message.GetMessageResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.message.GetMessageResponse} GetMessageResponse
             */
            GetMessageResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.message.GetMessageResponse)
                    return object;
                let message = new $root.kritor.message.GetMessageResponse();
                if (object.message != null) {
                    if (typeof object.message !== "object")
                        throw TypeError(".kritor.message.GetMessageResponse.message: object expected");
                    message.message = $root.kritor.common.PushMessageBody.fromObject(object.message);
                }
                return message;
            };

            /**
             * Creates a plain object from a GetMessageResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.message.GetMessageResponse
             * @static
             * @param {kritor.message.GetMessageResponse} message GetMessageResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetMessageResponse.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults)
                    object.message = null;
                if (message.message != null && message.hasOwnProperty("message"))
                    object.message = $root.kritor.common.PushMessageBody.toObject(message.message, options);
                return object;
            };

            /**
             * Converts this GetMessageResponse to JSON.
             * @function toJSON
             * @memberof kritor.message.GetMessageResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetMessageResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GetMessageResponse
             * @function getTypeUrl
             * @memberof kritor.message.GetMessageResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetMessageResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.message.GetMessageResponse";
            };

            return GetMessageResponse;
        })();

        message.GetMessageBySeqRequest = (function() {

            /**
             * Properties of a GetMessageBySeqRequest.
             * @memberof kritor.message
             * @interface IGetMessageBySeqRequest
             * @property {kritor.common.IContact|null} [contact] GetMessageBySeqRequest contact
             * @property {number|Long|null} [messageSeq] GetMessageBySeqRequest messageSeq
             */

            /**
             * Constructs a new GetMessageBySeqRequest.
             * @memberof kritor.message
             * @classdesc Represents a GetMessageBySeqRequest.
             * @implements IGetMessageBySeqRequest
             * @constructor
             * @param {kritor.message.IGetMessageBySeqRequest=} [properties] Properties to set
             */
            function GetMessageBySeqRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetMessageBySeqRequest contact.
             * @member {kritor.common.IContact|null|undefined} contact
             * @memberof kritor.message.GetMessageBySeqRequest
             * @instance
             */
            GetMessageBySeqRequest.prototype.contact = null;

            /**
             * GetMessageBySeqRequest messageSeq.
             * @member {number|Long} messageSeq
             * @memberof kritor.message.GetMessageBySeqRequest
             * @instance
             */
            GetMessageBySeqRequest.prototype.messageSeq = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * Creates a new GetMessageBySeqRequest instance using the specified properties.
             * @function create
             * @memberof kritor.message.GetMessageBySeqRequest
             * @static
             * @param {kritor.message.IGetMessageBySeqRequest=} [properties] Properties to set
             * @returns {kritor.message.GetMessageBySeqRequest} GetMessageBySeqRequest instance
             */
            GetMessageBySeqRequest.create = function create(properties) {
                return new GetMessageBySeqRequest(properties);
            };

            /**
             * Encodes the specified GetMessageBySeqRequest message. Does not implicitly {@link kritor.message.GetMessageBySeqRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.message.GetMessageBySeqRequest
             * @static
             * @param {kritor.message.IGetMessageBySeqRequest} message GetMessageBySeqRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetMessageBySeqRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.contact != null && Object.hasOwnProperty.call(message, "contact"))
                    $root.kritor.common.Contact.encode(message.contact, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                if (message.messageSeq != null && Object.hasOwnProperty.call(message, "messageSeq"))
                    writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.messageSeq);
                return writer;
            };

            /**
             * Encodes the specified GetMessageBySeqRequest message, length delimited. Does not implicitly {@link kritor.message.GetMessageBySeqRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.message.GetMessageBySeqRequest
             * @static
             * @param {kritor.message.IGetMessageBySeqRequest} message GetMessageBySeqRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetMessageBySeqRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetMessageBySeqRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.message.GetMessageBySeqRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.message.GetMessageBySeqRequest} GetMessageBySeqRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetMessageBySeqRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.message.GetMessageBySeqRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.contact = $root.kritor.common.Contact.decode(reader, reader.uint32());
                            break;
                        }
                    case 2: {
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
             * Decodes a GetMessageBySeqRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.message.GetMessageBySeqRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.message.GetMessageBySeqRequest} GetMessageBySeqRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetMessageBySeqRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetMessageBySeqRequest message.
             * @function verify
             * @memberof kritor.message.GetMessageBySeqRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetMessageBySeqRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.contact != null && message.hasOwnProperty("contact")) {
                    let error = $root.kritor.common.Contact.verify(message.contact);
                    if (error)
                        return "contact." + error;
                }
                if (message.messageSeq != null && message.hasOwnProperty("messageSeq"))
                    if (!$util.isInteger(message.messageSeq) && !(message.messageSeq && $util.isInteger(message.messageSeq.low) && $util.isInteger(message.messageSeq.high)))
                        return "messageSeq: integer|Long expected";
                return null;
            };

            /**
             * Creates a GetMessageBySeqRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.message.GetMessageBySeqRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.message.GetMessageBySeqRequest} GetMessageBySeqRequest
             */
            GetMessageBySeqRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.message.GetMessageBySeqRequest)
                    return object;
                let message = new $root.kritor.message.GetMessageBySeqRequest();
                if (object.contact != null) {
                    if (typeof object.contact !== "object")
                        throw TypeError(".kritor.message.GetMessageBySeqRequest.contact: object expected");
                    message.contact = $root.kritor.common.Contact.fromObject(object.contact);
                }
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
             * Creates a plain object from a GetMessageBySeqRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.message.GetMessageBySeqRequest
             * @static
             * @param {kritor.message.GetMessageBySeqRequest} message GetMessageBySeqRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetMessageBySeqRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.contact = null;
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.messageSeq = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.messageSeq = options.longs === String ? "0" : 0;
                }
                if (message.contact != null && message.hasOwnProperty("contact"))
                    object.contact = $root.kritor.common.Contact.toObject(message.contact, options);
                if (message.messageSeq != null && message.hasOwnProperty("messageSeq"))
                    if (typeof message.messageSeq === "number")
                        object.messageSeq = options.longs === String ? String(message.messageSeq) : message.messageSeq;
                    else
                        object.messageSeq = options.longs === String ? $util.Long.prototype.toString.call(message.messageSeq) : options.longs === Number ? new $util.LongBits(message.messageSeq.low >>> 0, message.messageSeq.high >>> 0).toNumber(true) : message.messageSeq;
                return object;
            };

            /**
             * Converts this GetMessageBySeqRequest to JSON.
             * @function toJSON
             * @memberof kritor.message.GetMessageBySeqRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetMessageBySeqRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GetMessageBySeqRequest
             * @function getTypeUrl
             * @memberof kritor.message.GetMessageBySeqRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetMessageBySeqRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.message.GetMessageBySeqRequest";
            };

            return GetMessageBySeqRequest;
        })();

        message.GetMessageBySeqResponse = (function() {

            /**
             * Properties of a GetMessageBySeqResponse.
             * @memberof kritor.message
             * @interface IGetMessageBySeqResponse
             * @property {kritor.common.IPushMessageBody|null} [message] GetMessageBySeqResponse message
             */

            /**
             * Constructs a new GetMessageBySeqResponse.
             * @memberof kritor.message
             * @classdesc Represents a GetMessageBySeqResponse.
             * @implements IGetMessageBySeqResponse
             * @constructor
             * @param {kritor.message.IGetMessageBySeqResponse=} [properties] Properties to set
             */
            function GetMessageBySeqResponse(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetMessageBySeqResponse message.
             * @member {kritor.common.IPushMessageBody|null|undefined} message
             * @memberof kritor.message.GetMessageBySeqResponse
             * @instance
             */
            GetMessageBySeqResponse.prototype.message = null;

            /**
             * Creates a new GetMessageBySeqResponse instance using the specified properties.
             * @function create
             * @memberof kritor.message.GetMessageBySeqResponse
             * @static
             * @param {kritor.message.IGetMessageBySeqResponse=} [properties] Properties to set
             * @returns {kritor.message.GetMessageBySeqResponse} GetMessageBySeqResponse instance
             */
            GetMessageBySeqResponse.create = function create(properties) {
                return new GetMessageBySeqResponse(properties);
            };

            /**
             * Encodes the specified GetMessageBySeqResponse message. Does not implicitly {@link kritor.message.GetMessageBySeqResponse.verify|verify} messages.
             * @function encode
             * @memberof kritor.message.GetMessageBySeqResponse
             * @static
             * @param {kritor.message.IGetMessageBySeqResponse} message GetMessageBySeqResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetMessageBySeqResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.message != null && Object.hasOwnProperty.call(message, "message"))
                    $root.kritor.common.PushMessageBody.encode(message.message, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified GetMessageBySeqResponse message, length delimited. Does not implicitly {@link kritor.message.GetMessageBySeqResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.message.GetMessageBySeqResponse
             * @static
             * @param {kritor.message.IGetMessageBySeqResponse} message GetMessageBySeqResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetMessageBySeqResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetMessageBySeqResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.message.GetMessageBySeqResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.message.GetMessageBySeqResponse} GetMessageBySeqResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetMessageBySeqResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.message.GetMessageBySeqResponse();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
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
             * Decodes a GetMessageBySeqResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.message.GetMessageBySeqResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.message.GetMessageBySeqResponse} GetMessageBySeqResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetMessageBySeqResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetMessageBySeqResponse message.
             * @function verify
             * @memberof kritor.message.GetMessageBySeqResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetMessageBySeqResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.message != null && message.hasOwnProperty("message")) {
                    let error = $root.kritor.common.PushMessageBody.verify(message.message);
                    if (error)
                        return "message." + error;
                }
                return null;
            };

            /**
             * Creates a GetMessageBySeqResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.message.GetMessageBySeqResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.message.GetMessageBySeqResponse} GetMessageBySeqResponse
             */
            GetMessageBySeqResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.message.GetMessageBySeqResponse)
                    return object;
                let message = new $root.kritor.message.GetMessageBySeqResponse();
                if (object.message != null) {
                    if (typeof object.message !== "object")
                        throw TypeError(".kritor.message.GetMessageBySeqResponse.message: object expected");
                    message.message = $root.kritor.common.PushMessageBody.fromObject(object.message);
                }
                return message;
            };

            /**
             * Creates a plain object from a GetMessageBySeqResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.message.GetMessageBySeqResponse
             * @static
             * @param {kritor.message.GetMessageBySeqResponse} message GetMessageBySeqResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetMessageBySeqResponse.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults)
                    object.message = null;
                if (message.message != null && message.hasOwnProperty("message"))
                    object.message = $root.kritor.common.PushMessageBody.toObject(message.message, options);
                return object;
            };

            /**
             * Converts this GetMessageBySeqResponse to JSON.
             * @function toJSON
             * @memberof kritor.message.GetMessageBySeqResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetMessageBySeqResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GetMessageBySeqResponse
             * @function getTypeUrl
             * @memberof kritor.message.GetMessageBySeqResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetMessageBySeqResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.message.GetMessageBySeqResponse";
            };

            return GetMessageBySeqResponse;
        })();

        message.GetHistoryMessageRequest = (function() {

            /**
             * Properties of a GetHistoryMessageRequest.
             * @memberof kritor.message
             * @interface IGetHistoryMessageRequest
             * @property {kritor.common.IContact|null} [contact] GetHistoryMessageRequest contact
             * @property {string|null} [startMessageId] GetHistoryMessageRequest startMessageId
             * @property {number|null} [count] GetHistoryMessageRequest count
             */

            /**
             * Constructs a new GetHistoryMessageRequest.
             * @memberof kritor.message
             * @classdesc Represents a GetHistoryMessageRequest.
             * @implements IGetHistoryMessageRequest
             * @constructor
             * @param {kritor.message.IGetHistoryMessageRequest=} [properties] Properties to set
             */
            function GetHistoryMessageRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetHistoryMessageRequest contact.
             * @member {kritor.common.IContact|null|undefined} contact
             * @memberof kritor.message.GetHistoryMessageRequest
             * @instance
             */
            GetHistoryMessageRequest.prototype.contact = null;

            /**
             * GetHistoryMessageRequest startMessageId.
             * @member {string|null|undefined} startMessageId
             * @memberof kritor.message.GetHistoryMessageRequest
             * @instance
             */
            GetHistoryMessageRequest.prototype.startMessageId = null;

            /**
             * GetHistoryMessageRequest count.
             * @member {number|null|undefined} count
             * @memberof kritor.message.GetHistoryMessageRequest
             * @instance
             */
            GetHistoryMessageRequest.prototype.count = null;

            // OneOf field names bound to virtual getters and setters
            let $oneOfFields;

            /**
             * GetHistoryMessageRequest _startMessageId.
             * @member {"startMessageId"|undefined} _startMessageId
             * @memberof kritor.message.GetHistoryMessageRequest
             * @instance
             */
            Object.defineProperty(GetHistoryMessageRequest.prototype, "_startMessageId", {
                get: $util.oneOfGetter($oneOfFields = ["startMessageId"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * GetHistoryMessageRequest _count.
             * @member {"count"|undefined} _count
             * @memberof kritor.message.GetHistoryMessageRequest
             * @instance
             */
            Object.defineProperty(GetHistoryMessageRequest.prototype, "_count", {
                get: $util.oneOfGetter($oneOfFields = ["count"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new GetHistoryMessageRequest instance using the specified properties.
             * @function create
             * @memberof kritor.message.GetHistoryMessageRequest
             * @static
             * @param {kritor.message.IGetHistoryMessageRequest=} [properties] Properties to set
             * @returns {kritor.message.GetHistoryMessageRequest} GetHistoryMessageRequest instance
             */
            GetHistoryMessageRequest.create = function create(properties) {
                return new GetHistoryMessageRequest(properties);
            };

            /**
             * Encodes the specified GetHistoryMessageRequest message. Does not implicitly {@link kritor.message.GetHistoryMessageRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.message.GetHistoryMessageRequest
             * @static
             * @param {kritor.message.IGetHistoryMessageRequest} message GetHistoryMessageRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetHistoryMessageRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.contact != null && Object.hasOwnProperty.call(message, "contact"))
                    $root.kritor.common.Contact.encode(message.contact, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                if (message.startMessageId != null && Object.hasOwnProperty.call(message, "startMessageId"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.startMessageId);
                if (message.count != null && Object.hasOwnProperty.call(message, "count"))
                    writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.count);
                return writer;
            };

            /**
             * Encodes the specified GetHistoryMessageRequest message, length delimited. Does not implicitly {@link kritor.message.GetHistoryMessageRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.message.GetHistoryMessageRequest
             * @static
             * @param {kritor.message.IGetHistoryMessageRequest} message GetHistoryMessageRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetHistoryMessageRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetHistoryMessageRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.message.GetHistoryMessageRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.message.GetHistoryMessageRequest} GetHistoryMessageRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetHistoryMessageRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.message.GetHistoryMessageRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.contact = $root.kritor.common.Contact.decode(reader, reader.uint32());
                            break;
                        }
                    case 2: {
                            message.startMessageId = reader.string();
                            break;
                        }
                    case 3: {
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
             * Decodes a GetHistoryMessageRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.message.GetHistoryMessageRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.message.GetHistoryMessageRequest} GetHistoryMessageRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetHistoryMessageRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetHistoryMessageRequest message.
             * @function verify
             * @memberof kritor.message.GetHistoryMessageRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetHistoryMessageRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                let properties = {};
                if (message.contact != null && message.hasOwnProperty("contact")) {
                    let error = $root.kritor.common.Contact.verify(message.contact);
                    if (error)
                        return "contact." + error;
                }
                if (message.startMessageId != null && message.hasOwnProperty("startMessageId")) {
                    properties._startMessageId = 1;
                    if (!$util.isString(message.startMessageId))
                        return "startMessageId: string expected";
                }
                if (message.count != null && message.hasOwnProperty("count")) {
                    properties._count = 1;
                    if (!$util.isInteger(message.count))
                        return "count: integer expected";
                }
                return null;
            };

            /**
             * Creates a GetHistoryMessageRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.message.GetHistoryMessageRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.message.GetHistoryMessageRequest} GetHistoryMessageRequest
             */
            GetHistoryMessageRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.message.GetHistoryMessageRequest)
                    return object;
                let message = new $root.kritor.message.GetHistoryMessageRequest();
                if (object.contact != null) {
                    if (typeof object.contact !== "object")
                        throw TypeError(".kritor.message.GetHistoryMessageRequest.contact: object expected");
                    message.contact = $root.kritor.common.Contact.fromObject(object.contact);
                }
                if (object.startMessageId != null)
                    message.startMessageId = String(object.startMessageId);
                if (object.count != null)
                    message.count = object.count >>> 0;
                return message;
            };

            /**
             * Creates a plain object from a GetHistoryMessageRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.message.GetHistoryMessageRequest
             * @static
             * @param {kritor.message.GetHistoryMessageRequest} message GetHistoryMessageRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetHistoryMessageRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults)
                    object.contact = null;
                if (message.contact != null && message.hasOwnProperty("contact"))
                    object.contact = $root.kritor.common.Contact.toObject(message.contact, options);
                if (message.startMessageId != null && message.hasOwnProperty("startMessageId")) {
                    object.startMessageId = message.startMessageId;
                    if (options.oneofs)
                        object._startMessageId = "startMessageId";
                }
                if (message.count != null && message.hasOwnProperty("count")) {
                    object.count = message.count;
                    if (options.oneofs)
                        object._count = "count";
                }
                return object;
            };

            /**
             * Converts this GetHistoryMessageRequest to JSON.
             * @function toJSON
             * @memberof kritor.message.GetHistoryMessageRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetHistoryMessageRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GetHistoryMessageRequest
             * @function getTypeUrl
             * @memberof kritor.message.GetHistoryMessageRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetHistoryMessageRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.message.GetHistoryMessageRequest";
            };

            return GetHistoryMessageRequest;
        })();

        message.GetHistoryMessageResponse = (function() {

            /**
             * Properties of a GetHistoryMessageResponse.
             * @memberof kritor.message
             * @interface IGetHistoryMessageResponse
             * @property {Array.<kritor.common.IPushMessageBody>|null} [messages] GetHistoryMessageResponse messages
             */

            /**
             * Constructs a new GetHistoryMessageResponse.
             * @memberof kritor.message
             * @classdesc Represents a GetHistoryMessageResponse.
             * @implements IGetHistoryMessageResponse
             * @constructor
             * @param {kritor.message.IGetHistoryMessageResponse=} [properties] Properties to set
             */
            function GetHistoryMessageResponse(properties) {
                this.messages = [];
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetHistoryMessageResponse messages.
             * @member {Array.<kritor.common.IPushMessageBody>} messages
             * @memberof kritor.message.GetHistoryMessageResponse
             * @instance
             */
            GetHistoryMessageResponse.prototype.messages = $util.emptyArray;

            /**
             * Creates a new GetHistoryMessageResponse instance using the specified properties.
             * @function create
             * @memberof kritor.message.GetHistoryMessageResponse
             * @static
             * @param {kritor.message.IGetHistoryMessageResponse=} [properties] Properties to set
             * @returns {kritor.message.GetHistoryMessageResponse} GetHistoryMessageResponse instance
             */
            GetHistoryMessageResponse.create = function create(properties) {
                return new GetHistoryMessageResponse(properties);
            };

            /**
             * Encodes the specified GetHistoryMessageResponse message. Does not implicitly {@link kritor.message.GetHistoryMessageResponse.verify|verify} messages.
             * @function encode
             * @memberof kritor.message.GetHistoryMessageResponse
             * @static
             * @param {kritor.message.IGetHistoryMessageResponse} message GetHistoryMessageResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetHistoryMessageResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.messages != null && message.messages.length)
                    for (let i = 0; i < message.messages.length; ++i)
                        $root.kritor.common.PushMessageBody.encode(message.messages[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified GetHistoryMessageResponse message, length delimited. Does not implicitly {@link kritor.message.GetHistoryMessageResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.message.GetHistoryMessageResponse
             * @static
             * @param {kritor.message.IGetHistoryMessageResponse} message GetHistoryMessageResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetHistoryMessageResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetHistoryMessageResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.message.GetHistoryMessageResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.message.GetHistoryMessageResponse} GetHistoryMessageResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetHistoryMessageResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.message.GetHistoryMessageResponse();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            if (!(message.messages && message.messages.length))
                                message.messages = [];
                            message.messages.push($root.kritor.common.PushMessageBody.decode(reader, reader.uint32()));
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
             * Decodes a GetHistoryMessageResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.message.GetHistoryMessageResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.message.GetHistoryMessageResponse} GetHistoryMessageResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetHistoryMessageResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetHistoryMessageResponse message.
             * @function verify
             * @memberof kritor.message.GetHistoryMessageResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetHistoryMessageResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.messages != null && message.hasOwnProperty("messages")) {
                    if (!Array.isArray(message.messages))
                        return "messages: array expected";
                    for (let i = 0; i < message.messages.length; ++i) {
                        let error = $root.kritor.common.PushMessageBody.verify(message.messages[i]);
                        if (error)
                            return "messages." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a GetHistoryMessageResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.message.GetHistoryMessageResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.message.GetHistoryMessageResponse} GetHistoryMessageResponse
             */
            GetHistoryMessageResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.message.GetHistoryMessageResponse)
                    return object;
                let message = new $root.kritor.message.GetHistoryMessageResponse();
                if (object.messages) {
                    if (!Array.isArray(object.messages))
                        throw TypeError(".kritor.message.GetHistoryMessageResponse.messages: array expected");
                    message.messages = [];
                    for (let i = 0; i < object.messages.length; ++i) {
                        if (typeof object.messages[i] !== "object")
                            throw TypeError(".kritor.message.GetHistoryMessageResponse.messages: object expected");
                        message.messages[i] = $root.kritor.common.PushMessageBody.fromObject(object.messages[i]);
                    }
                }
                return message;
            };

            /**
             * Creates a plain object from a GetHistoryMessageResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.message.GetHistoryMessageResponse
             * @static
             * @param {kritor.message.GetHistoryMessageResponse} message GetHistoryMessageResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetHistoryMessageResponse.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.arrays || options.defaults)
                    object.messages = [];
                if (message.messages && message.messages.length) {
                    object.messages = [];
                    for (let j = 0; j < message.messages.length; ++j)
                        object.messages[j] = $root.kritor.common.PushMessageBody.toObject(message.messages[j], options);
                }
                return object;
            };

            /**
             * Converts this GetHistoryMessageResponse to JSON.
             * @function toJSON
             * @memberof kritor.message.GetHistoryMessageResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetHistoryMessageResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GetHistoryMessageResponse
             * @function getTypeUrl
             * @memberof kritor.message.GetHistoryMessageResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetHistoryMessageResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.message.GetHistoryMessageResponse";
            };

            return GetHistoryMessageResponse;
        })();

        message.GetHistoryMessageBySeqRequest = (function() {

            /**
             * Properties of a GetHistoryMessageBySeqRequest.
             * @memberof kritor.message
             * @interface IGetHistoryMessageBySeqRequest
             * @property {kritor.common.IContact|null} [contact] GetHistoryMessageBySeqRequest contact
             * @property {number|Long|null} [startMessageSeq] GetHistoryMessageBySeqRequest startMessageSeq
             * @property {number|null} [count] GetHistoryMessageBySeqRequest count
             */

            /**
             * Constructs a new GetHistoryMessageBySeqRequest.
             * @memberof kritor.message
             * @classdesc Represents a GetHistoryMessageBySeqRequest.
             * @implements IGetHistoryMessageBySeqRequest
             * @constructor
             * @param {kritor.message.IGetHistoryMessageBySeqRequest=} [properties] Properties to set
             */
            function GetHistoryMessageBySeqRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetHistoryMessageBySeqRequest contact.
             * @member {kritor.common.IContact|null|undefined} contact
             * @memberof kritor.message.GetHistoryMessageBySeqRequest
             * @instance
             */
            GetHistoryMessageBySeqRequest.prototype.contact = null;

            /**
             * GetHistoryMessageBySeqRequest startMessageSeq.
             * @member {number|Long|null|undefined} startMessageSeq
             * @memberof kritor.message.GetHistoryMessageBySeqRequest
             * @instance
             */
            GetHistoryMessageBySeqRequest.prototype.startMessageSeq = null;

            /**
             * GetHistoryMessageBySeqRequest count.
             * @member {number|null|undefined} count
             * @memberof kritor.message.GetHistoryMessageBySeqRequest
             * @instance
             */
            GetHistoryMessageBySeqRequest.prototype.count = null;

            // OneOf field names bound to virtual getters and setters
            let $oneOfFields;

            /**
             * GetHistoryMessageBySeqRequest _startMessageSeq.
             * @member {"startMessageSeq"|undefined} _startMessageSeq
             * @memberof kritor.message.GetHistoryMessageBySeqRequest
             * @instance
             */
            Object.defineProperty(GetHistoryMessageBySeqRequest.prototype, "_startMessageSeq", {
                get: $util.oneOfGetter($oneOfFields = ["startMessageSeq"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * GetHistoryMessageBySeqRequest _count.
             * @member {"count"|undefined} _count
             * @memberof kritor.message.GetHistoryMessageBySeqRequest
             * @instance
             */
            Object.defineProperty(GetHistoryMessageBySeqRequest.prototype, "_count", {
                get: $util.oneOfGetter($oneOfFields = ["count"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new GetHistoryMessageBySeqRequest instance using the specified properties.
             * @function create
             * @memberof kritor.message.GetHistoryMessageBySeqRequest
             * @static
             * @param {kritor.message.IGetHistoryMessageBySeqRequest=} [properties] Properties to set
             * @returns {kritor.message.GetHistoryMessageBySeqRequest} GetHistoryMessageBySeqRequest instance
             */
            GetHistoryMessageBySeqRequest.create = function create(properties) {
                return new GetHistoryMessageBySeqRequest(properties);
            };

            /**
             * Encodes the specified GetHistoryMessageBySeqRequest message. Does not implicitly {@link kritor.message.GetHistoryMessageBySeqRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.message.GetHistoryMessageBySeqRequest
             * @static
             * @param {kritor.message.IGetHistoryMessageBySeqRequest} message GetHistoryMessageBySeqRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetHistoryMessageBySeqRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.contact != null && Object.hasOwnProperty.call(message, "contact"))
                    $root.kritor.common.Contact.encode(message.contact, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                if (message.startMessageSeq != null && Object.hasOwnProperty.call(message, "startMessageSeq"))
                    writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.startMessageSeq);
                if (message.count != null && Object.hasOwnProperty.call(message, "count"))
                    writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.count);
                return writer;
            };

            /**
             * Encodes the specified GetHistoryMessageBySeqRequest message, length delimited. Does not implicitly {@link kritor.message.GetHistoryMessageBySeqRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.message.GetHistoryMessageBySeqRequest
             * @static
             * @param {kritor.message.IGetHistoryMessageBySeqRequest} message GetHistoryMessageBySeqRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetHistoryMessageBySeqRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetHistoryMessageBySeqRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.message.GetHistoryMessageBySeqRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.message.GetHistoryMessageBySeqRequest} GetHistoryMessageBySeqRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetHistoryMessageBySeqRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.message.GetHistoryMessageBySeqRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.contact = $root.kritor.common.Contact.decode(reader, reader.uint32());
                            break;
                        }
                    case 2: {
                            message.startMessageSeq = reader.uint64();
                            break;
                        }
                    case 3: {
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
             * Decodes a GetHistoryMessageBySeqRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.message.GetHistoryMessageBySeqRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.message.GetHistoryMessageBySeqRequest} GetHistoryMessageBySeqRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetHistoryMessageBySeqRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetHistoryMessageBySeqRequest message.
             * @function verify
             * @memberof kritor.message.GetHistoryMessageBySeqRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetHistoryMessageBySeqRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                let properties = {};
                if (message.contact != null && message.hasOwnProperty("contact")) {
                    let error = $root.kritor.common.Contact.verify(message.contact);
                    if (error)
                        return "contact." + error;
                }
                if (message.startMessageSeq != null && message.hasOwnProperty("startMessageSeq")) {
                    properties._startMessageSeq = 1;
                    if (!$util.isInteger(message.startMessageSeq) && !(message.startMessageSeq && $util.isInteger(message.startMessageSeq.low) && $util.isInteger(message.startMessageSeq.high)))
                        return "startMessageSeq: integer|Long expected";
                }
                if (message.count != null && message.hasOwnProperty("count")) {
                    properties._count = 1;
                    if (!$util.isInteger(message.count))
                        return "count: integer expected";
                }
                return null;
            };

            /**
             * Creates a GetHistoryMessageBySeqRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.message.GetHistoryMessageBySeqRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.message.GetHistoryMessageBySeqRequest} GetHistoryMessageBySeqRequest
             */
            GetHistoryMessageBySeqRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.message.GetHistoryMessageBySeqRequest)
                    return object;
                let message = new $root.kritor.message.GetHistoryMessageBySeqRequest();
                if (object.contact != null) {
                    if (typeof object.contact !== "object")
                        throw TypeError(".kritor.message.GetHistoryMessageBySeqRequest.contact: object expected");
                    message.contact = $root.kritor.common.Contact.fromObject(object.contact);
                }
                if (object.startMessageSeq != null)
                    if ($util.Long)
                        (message.startMessageSeq = $util.Long.fromValue(object.startMessageSeq)).unsigned = true;
                    else if (typeof object.startMessageSeq === "string")
                        message.startMessageSeq = parseInt(object.startMessageSeq, 10);
                    else if (typeof object.startMessageSeq === "number")
                        message.startMessageSeq = object.startMessageSeq;
                    else if (typeof object.startMessageSeq === "object")
                        message.startMessageSeq = new $util.LongBits(object.startMessageSeq.low >>> 0, object.startMessageSeq.high >>> 0).toNumber(true);
                if (object.count != null)
                    message.count = object.count >>> 0;
                return message;
            };

            /**
             * Creates a plain object from a GetHistoryMessageBySeqRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.message.GetHistoryMessageBySeqRequest
             * @static
             * @param {kritor.message.GetHistoryMessageBySeqRequest} message GetHistoryMessageBySeqRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetHistoryMessageBySeqRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults)
                    object.contact = null;
                if (message.contact != null && message.hasOwnProperty("contact"))
                    object.contact = $root.kritor.common.Contact.toObject(message.contact, options);
                if (message.startMessageSeq != null && message.hasOwnProperty("startMessageSeq")) {
                    if (typeof message.startMessageSeq === "number")
                        object.startMessageSeq = options.longs === String ? String(message.startMessageSeq) : message.startMessageSeq;
                    else
                        object.startMessageSeq = options.longs === String ? $util.Long.prototype.toString.call(message.startMessageSeq) : options.longs === Number ? new $util.LongBits(message.startMessageSeq.low >>> 0, message.startMessageSeq.high >>> 0).toNumber(true) : message.startMessageSeq;
                    if (options.oneofs)
                        object._startMessageSeq = "startMessageSeq";
                }
                if (message.count != null && message.hasOwnProperty("count")) {
                    object.count = message.count;
                    if (options.oneofs)
                        object._count = "count";
                }
                return object;
            };

            /**
             * Converts this GetHistoryMessageBySeqRequest to JSON.
             * @function toJSON
             * @memberof kritor.message.GetHistoryMessageBySeqRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetHistoryMessageBySeqRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GetHistoryMessageBySeqRequest
             * @function getTypeUrl
             * @memberof kritor.message.GetHistoryMessageBySeqRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetHistoryMessageBySeqRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.message.GetHistoryMessageBySeqRequest";
            };

            return GetHistoryMessageBySeqRequest;
        })();

        message.GetHistoryMessageBySeqResponse = (function() {

            /**
             * Properties of a GetHistoryMessageBySeqResponse.
             * @memberof kritor.message
             * @interface IGetHistoryMessageBySeqResponse
             * @property {Array.<kritor.common.IPushMessageBody>|null} [messages] GetHistoryMessageBySeqResponse messages
             */

            /**
             * Constructs a new GetHistoryMessageBySeqResponse.
             * @memberof kritor.message
             * @classdesc Represents a GetHistoryMessageBySeqResponse.
             * @implements IGetHistoryMessageBySeqResponse
             * @constructor
             * @param {kritor.message.IGetHistoryMessageBySeqResponse=} [properties] Properties to set
             */
            function GetHistoryMessageBySeqResponse(properties) {
                this.messages = [];
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetHistoryMessageBySeqResponse messages.
             * @member {Array.<kritor.common.IPushMessageBody>} messages
             * @memberof kritor.message.GetHistoryMessageBySeqResponse
             * @instance
             */
            GetHistoryMessageBySeqResponse.prototype.messages = $util.emptyArray;

            /**
             * Creates a new GetHistoryMessageBySeqResponse instance using the specified properties.
             * @function create
             * @memberof kritor.message.GetHistoryMessageBySeqResponse
             * @static
             * @param {kritor.message.IGetHistoryMessageBySeqResponse=} [properties] Properties to set
             * @returns {kritor.message.GetHistoryMessageBySeqResponse} GetHistoryMessageBySeqResponse instance
             */
            GetHistoryMessageBySeqResponse.create = function create(properties) {
                return new GetHistoryMessageBySeqResponse(properties);
            };

            /**
             * Encodes the specified GetHistoryMessageBySeqResponse message. Does not implicitly {@link kritor.message.GetHistoryMessageBySeqResponse.verify|verify} messages.
             * @function encode
             * @memberof kritor.message.GetHistoryMessageBySeqResponse
             * @static
             * @param {kritor.message.IGetHistoryMessageBySeqResponse} message GetHistoryMessageBySeqResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetHistoryMessageBySeqResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.messages != null && message.messages.length)
                    for (let i = 0; i < message.messages.length; ++i)
                        $root.kritor.common.PushMessageBody.encode(message.messages[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified GetHistoryMessageBySeqResponse message, length delimited. Does not implicitly {@link kritor.message.GetHistoryMessageBySeqResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.message.GetHistoryMessageBySeqResponse
             * @static
             * @param {kritor.message.IGetHistoryMessageBySeqResponse} message GetHistoryMessageBySeqResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetHistoryMessageBySeqResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetHistoryMessageBySeqResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.message.GetHistoryMessageBySeqResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.message.GetHistoryMessageBySeqResponse} GetHistoryMessageBySeqResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetHistoryMessageBySeqResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.message.GetHistoryMessageBySeqResponse();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            if (!(message.messages && message.messages.length))
                                message.messages = [];
                            message.messages.push($root.kritor.common.PushMessageBody.decode(reader, reader.uint32()));
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
             * Decodes a GetHistoryMessageBySeqResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.message.GetHistoryMessageBySeqResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.message.GetHistoryMessageBySeqResponse} GetHistoryMessageBySeqResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetHistoryMessageBySeqResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetHistoryMessageBySeqResponse message.
             * @function verify
             * @memberof kritor.message.GetHistoryMessageBySeqResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetHistoryMessageBySeqResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.messages != null && message.hasOwnProperty("messages")) {
                    if (!Array.isArray(message.messages))
                        return "messages: array expected";
                    for (let i = 0; i < message.messages.length; ++i) {
                        let error = $root.kritor.common.PushMessageBody.verify(message.messages[i]);
                        if (error)
                            return "messages." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a GetHistoryMessageBySeqResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.message.GetHistoryMessageBySeqResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.message.GetHistoryMessageBySeqResponse} GetHistoryMessageBySeqResponse
             */
            GetHistoryMessageBySeqResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.message.GetHistoryMessageBySeqResponse)
                    return object;
                let message = new $root.kritor.message.GetHistoryMessageBySeqResponse();
                if (object.messages) {
                    if (!Array.isArray(object.messages))
                        throw TypeError(".kritor.message.GetHistoryMessageBySeqResponse.messages: array expected");
                    message.messages = [];
                    for (let i = 0; i < object.messages.length; ++i) {
                        if (typeof object.messages[i] !== "object")
                            throw TypeError(".kritor.message.GetHistoryMessageBySeqResponse.messages: object expected");
                        message.messages[i] = $root.kritor.common.PushMessageBody.fromObject(object.messages[i]);
                    }
                }
                return message;
            };

            /**
             * Creates a plain object from a GetHistoryMessageBySeqResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.message.GetHistoryMessageBySeqResponse
             * @static
             * @param {kritor.message.GetHistoryMessageBySeqResponse} message GetHistoryMessageBySeqResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetHistoryMessageBySeqResponse.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.arrays || options.defaults)
                    object.messages = [];
                if (message.messages && message.messages.length) {
                    object.messages = [];
                    for (let j = 0; j < message.messages.length; ++j)
                        object.messages[j] = $root.kritor.common.PushMessageBody.toObject(message.messages[j], options);
                }
                return object;
            };

            /**
             * Converts this GetHistoryMessageBySeqResponse to JSON.
             * @function toJSON
             * @memberof kritor.message.GetHistoryMessageBySeqResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetHistoryMessageBySeqResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GetHistoryMessageBySeqResponse
             * @function getTypeUrl
             * @memberof kritor.message.GetHistoryMessageBySeqResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetHistoryMessageBySeqResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.message.GetHistoryMessageBySeqResponse";
            };

            return GetHistoryMessageBySeqResponse;
        })();

        message.UploadForwardMessageRequest = (function() {

            /**
             * Properties of an UploadForwardMessageRequest.
             * @memberof kritor.message
             * @interface IUploadForwardMessageRequest
             * @property {kritor.common.IContact|null} [contact] UploadForwardMessageRequest contact
             * @property {Array.<kritor.common.IForwardMessageBody>|null} [messages] UploadForwardMessageRequest messages
             * @property {number|null} [retryCount] UploadForwardMessageRequest retryCount
             */

            /**
             * Constructs a new UploadForwardMessageRequest.
             * @memberof kritor.message
             * @classdesc Represents an UploadForwardMessageRequest.
             * @implements IUploadForwardMessageRequest
             * @constructor
             * @param {kritor.message.IUploadForwardMessageRequest=} [properties] Properties to set
             */
            function UploadForwardMessageRequest(properties) {
                this.messages = [];
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * UploadForwardMessageRequest contact.
             * @member {kritor.common.IContact|null|undefined} contact
             * @memberof kritor.message.UploadForwardMessageRequest
             * @instance
             */
            UploadForwardMessageRequest.prototype.contact = null;

            /**
             * UploadForwardMessageRequest messages.
             * @member {Array.<kritor.common.IForwardMessageBody>} messages
             * @memberof kritor.message.UploadForwardMessageRequest
             * @instance
             */
            UploadForwardMessageRequest.prototype.messages = $util.emptyArray;

            /**
             * UploadForwardMessageRequest retryCount.
             * @member {number|null|undefined} retryCount
             * @memberof kritor.message.UploadForwardMessageRequest
             * @instance
             */
            UploadForwardMessageRequest.prototype.retryCount = null;

            // OneOf field names bound to virtual getters and setters
            let $oneOfFields;

            /**
             * UploadForwardMessageRequest _retryCount.
             * @member {"retryCount"|undefined} _retryCount
             * @memberof kritor.message.UploadForwardMessageRequest
             * @instance
             */
            Object.defineProperty(UploadForwardMessageRequest.prototype, "_retryCount", {
                get: $util.oneOfGetter($oneOfFields = ["retryCount"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new UploadForwardMessageRequest instance using the specified properties.
             * @function create
             * @memberof kritor.message.UploadForwardMessageRequest
             * @static
             * @param {kritor.message.IUploadForwardMessageRequest=} [properties] Properties to set
             * @returns {kritor.message.UploadForwardMessageRequest} UploadForwardMessageRequest instance
             */
            UploadForwardMessageRequest.create = function create(properties) {
                return new UploadForwardMessageRequest(properties);
            };

            /**
             * Encodes the specified UploadForwardMessageRequest message. Does not implicitly {@link kritor.message.UploadForwardMessageRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.message.UploadForwardMessageRequest
             * @static
             * @param {kritor.message.IUploadForwardMessageRequest} message UploadForwardMessageRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            UploadForwardMessageRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.contact != null && Object.hasOwnProperty.call(message, "contact"))
                    $root.kritor.common.Contact.encode(message.contact, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                if (message.messages != null && message.messages.length)
                    for (let i = 0; i < message.messages.length; ++i)
                        $root.kritor.common.ForwardMessageBody.encode(message.messages[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                if (message.retryCount != null && Object.hasOwnProperty.call(message, "retryCount"))
                    writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.retryCount);
                return writer;
            };

            /**
             * Encodes the specified UploadForwardMessageRequest message, length delimited. Does not implicitly {@link kritor.message.UploadForwardMessageRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.message.UploadForwardMessageRequest
             * @static
             * @param {kritor.message.IUploadForwardMessageRequest} message UploadForwardMessageRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            UploadForwardMessageRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an UploadForwardMessageRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.message.UploadForwardMessageRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.message.UploadForwardMessageRequest} UploadForwardMessageRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            UploadForwardMessageRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.message.UploadForwardMessageRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.contact = $root.kritor.common.Contact.decode(reader, reader.uint32());
                            break;
                        }
                    case 2: {
                            if (!(message.messages && message.messages.length))
                                message.messages = [];
                            message.messages.push($root.kritor.common.ForwardMessageBody.decode(reader, reader.uint32()));
                            break;
                        }
                    case 3: {
                            message.retryCount = reader.uint32();
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
             * Decodes an UploadForwardMessageRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.message.UploadForwardMessageRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.message.UploadForwardMessageRequest} UploadForwardMessageRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            UploadForwardMessageRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an UploadForwardMessageRequest message.
             * @function verify
             * @memberof kritor.message.UploadForwardMessageRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            UploadForwardMessageRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                let properties = {};
                if (message.contact != null && message.hasOwnProperty("contact")) {
                    let error = $root.kritor.common.Contact.verify(message.contact);
                    if (error)
                        return "contact." + error;
                }
                if (message.messages != null && message.hasOwnProperty("messages")) {
                    if (!Array.isArray(message.messages))
                        return "messages: array expected";
                    for (let i = 0; i < message.messages.length; ++i) {
                        let error = $root.kritor.common.ForwardMessageBody.verify(message.messages[i]);
                        if (error)
                            return "messages." + error;
                    }
                }
                if (message.retryCount != null && message.hasOwnProperty("retryCount")) {
                    properties._retryCount = 1;
                    if (!$util.isInteger(message.retryCount))
                        return "retryCount: integer expected";
                }
                return null;
            };

            /**
             * Creates an UploadForwardMessageRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.message.UploadForwardMessageRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.message.UploadForwardMessageRequest} UploadForwardMessageRequest
             */
            UploadForwardMessageRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.message.UploadForwardMessageRequest)
                    return object;
                let message = new $root.kritor.message.UploadForwardMessageRequest();
                if (object.contact != null) {
                    if (typeof object.contact !== "object")
                        throw TypeError(".kritor.message.UploadForwardMessageRequest.contact: object expected");
                    message.contact = $root.kritor.common.Contact.fromObject(object.contact);
                }
                if (object.messages) {
                    if (!Array.isArray(object.messages))
                        throw TypeError(".kritor.message.UploadForwardMessageRequest.messages: array expected");
                    message.messages = [];
                    for (let i = 0; i < object.messages.length; ++i) {
                        if (typeof object.messages[i] !== "object")
                            throw TypeError(".kritor.message.UploadForwardMessageRequest.messages: object expected");
                        message.messages[i] = $root.kritor.common.ForwardMessageBody.fromObject(object.messages[i]);
                    }
                }
                if (object.retryCount != null)
                    message.retryCount = object.retryCount >>> 0;
                return message;
            };

            /**
             * Creates a plain object from an UploadForwardMessageRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.message.UploadForwardMessageRequest
             * @static
             * @param {kritor.message.UploadForwardMessageRequest} message UploadForwardMessageRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            UploadForwardMessageRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.arrays || options.defaults)
                    object.messages = [];
                if (options.defaults)
                    object.contact = null;
                if (message.contact != null && message.hasOwnProperty("contact"))
                    object.contact = $root.kritor.common.Contact.toObject(message.contact, options);
                if (message.messages && message.messages.length) {
                    object.messages = [];
                    for (let j = 0; j < message.messages.length; ++j)
                        object.messages[j] = $root.kritor.common.ForwardMessageBody.toObject(message.messages[j], options);
                }
                if (message.retryCount != null && message.hasOwnProperty("retryCount")) {
                    object.retryCount = message.retryCount;
                    if (options.oneofs)
                        object._retryCount = "retryCount";
                }
                return object;
            };

            /**
             * Converts this UploadForwardMessageRequest to JSON.
             * @function toJSON
             * @memberof kritor.message.UploadForwardMessageRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            UploadForwardMessageRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for UploadForwardMessageRequest
             * @function getTypeUrl
             * @memberof kritor.message.UploadForwardMessageRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            UploadForwardMessageRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.message.UploadForwardMessageRequest";
            };

            return UploadForwardMessageRequest;
        })();

        message.UploadForwardMessageResponse = (function() {

            /**
             * Properties of an UploadForwardMessageResponse.
             * @memberof kritor.message
             * @interface IUploadForwardMessageResponse
             * @property {string|null} [resId] UploadForwardMessageResponse resId
             */

            /**
             * Constructs a new UploadForwardMessageResponse.
             * @memberof kritor.message
             * @classdesc Represents an UploadForwardMessageResponse.
             * @implements IUploadForwardMessageResponse
             * @constructor
             * @param {kritor.message.IUploadForwardMessageResponse=} [properties] Properties to set
             */
            function UploadForwardMessageResponse(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * UploadForwardMessageResponse resId.
             * @member {string} resId
             * @memberof kritor.message.UploadForwardMessageResponse
             * @instance
             */
            UploadForwardMessageResponse.prototype.resId = "";

            /**
             * Creates a new UploadForwardMessageResponse instance using the specified properties.
             * @function create
             * @memberof kritor.message.UploadForwardMessageResponse
             * @static
             * @param {kritor.message.IUploadForwardMessageResponse=} [properties] Properties to set
             * @returns {kritor.message.UploadForwardMessageResponse} UploadForwardMessageResponse instance
             */
            UploadForwardMessageResponse.create = function create(properties) {
                return new UploadForwardMessageResponse(properties);
            };

            /**
             * Encodes the specified UploadForwardMessageResponse message. Does not implicitly {@link kritor.message.UploadForwardMessageResponse.verify|verify} messages.
             * @function encode
             * @memberof kritor.message.UploadForwardMessageResponse
             * @static
             * @param {kritor.message.IUploadForwardMessageResponse} message UploadForwardMessageResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            UploadForwardMessageResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.resId != null && Object.hasOwnProperty.call(message, "resId"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.resId);
                return writer;
            };

            /**
             * Encodes the specified UploadForwardMessageResponse message, length delimited. Does not implicitly {@link kritor.message.UploadForwardMessageResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.message.UploadForwardMessageResponse
             * @static
             * @param {kritor.message.IUploadForwardMessageResponse} message UploadForwardMessageResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            UploadForwardMessageResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an UploadForwardMessageResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.message.UploadForwardMessageResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.message.UploadForwardMessageResponse} UploadForwardMessageResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            UploadForwardMessageResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.message.UploadForwardMessageResponse();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.resId = reader.string();
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
             * Decodes an UploadForwardMessageResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.message.UploadForwardMessageResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.message.UploadForwardMessageResponse} UploadForwardMessageResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            UploadForwardMessageResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an UploadForwardMessageResponse message.
             * @function verify
             * @memberof kritor.message.UploadForwardMessageResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            UploadForwardMessageResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.resId != null && message.hasOwnProperty("resId"))
                    if (!$util.isString(message.resId))
                        return "resId: string expected";
                return null;
            };

            /**
             * Creates an UploadForwardMessageResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.message.UploadForwardMessageResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.message.UploadForwardMessageResponse} UploadForwardMessageResponse
             */
            UploadForwardMessageResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.message.UploadForwardMessageResponse)
                    return object;
                let message = new $root.kritor.message.UploadForwardMessageResponse();
                if (object.resId != null)
                    message.resId = String(object.resId);
                return message;
            };

            /**
             * Creates a plain object from an UploadForwardMessageResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.message.UploadForwardMessageResponse
             * @static
             * @param {kritor.message.UploadForwardMessageResponse} message UploadForwardMessageResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            UploadForwardMessageResponse.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults)
                    object.resId = "";
                if (message.resId != null && message.hasOwnProperty("resId"))
                    object.resId = message.resId;
                return object;
            };

            /**
             * Converts this UploadForwardMessageResponse to JSON.
             * @function toJSON
             * @memberof kritor.message.UploadForwardMessageResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            UploadForwardMessageResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for UploadForwardMessageResponse
             * @function getTypeUrl
             * @memberof kritor.message.UploadForwardMessageResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            UploadForwardMessageResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.message.UploadForwardMessageResponse";
            };

            return UploadForwardMessageResponse;
        })();

        message.DownloadForwardMessageRequest = (function() {

            /**
             * Properties of a DownloadForwardMessageRequest.
             * @memberof kritor.message
             * @interface IDownloadForwardMessageRequest
             * @property {string|null} [resId] DownloadForwardMessageRequest resId
             */

            /**
             * Constructs a new DownloadForwardMessageRequest.
             * @memberof kritor.message
             * @classdesc Represents a DownloadForwardMessageRequest.
             * @implements IDownloadForwardMessageRequest
             * @constructor
             * @param {kritor.message.IDownloadForwardMessageRequest=} [properties] Properties to set
             */
            function DownloadForwardMessageRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * DownloadForwardMessageRequest resId.
             * @member {string} resId
             * @memberof kritor.message.DownloadForwardMessageRequest
             * @instance
             */
            DownloadForwardMessageRequest.prototype.resId = "";

            /**
             * Creates a new DownloadForwardMessageRequest instance using the specified properties.
             * @function create
             * @memberof kritor.message.DownloadForwardMessageRequest
             * @static
             * @param {kritor.message.IDownloadForwardMessageRequest=} [properties] Properties to set
             * @returns {kritor.message.DownloadForwardMessageRequest} DownloadForwardMessageRequest instance
             */
            DownloadForwardMessageRequest.create = function create(properties) {
                return new DownloadForwardMessageRequest(properties);
            };

            /**
             * Encodes the specified DownloadForwardMessageRequest message. Does not implicitly {@link kritor.message.DownloadForwardMessageRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.message.DownloadForwardMessageRequest
             * @static
             * @param {kritor.message.IDownloadForwardMessageRequest} message DownloadForwardMessageRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DownloadForwardMessageRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.resId != null && Object.hasOwnProperty.call(message, "resId"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.resId);
                return writer;
            };

            /**
             * Encodes the specified DownloadForwardMessageRequest message, length delimited. Does not implicitly {@link kritor.message.DownloadForwardMessageRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.message.DownloadForwardMessageRequest
             * @static
             * @param {kritor.message.IDownloadForwardMessageRequest} message DownloadForwardMessageRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DownloadForwardMessageRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a DownloadForwardMessageRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.message.DownloadForwardMessageRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.message.DownloadForwardMessageRequest} DownloadForwardMessageRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DownloadForwardMessageRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.message.DownloadForwardMessageRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.resId = reader.string();
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
             * Decodes a DownloadForwardMessageRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.message.DownloadForwardMessageRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.message.DownloadForwardMessageRequest} DownloadForwardMessageRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DownloadForwardMessageRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a DownloadForwardMessageRequest message.
             * @function verify
             * @memberof kritor.message.DownloadForwardMessageRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            DownloadForwardMessageRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.resId != null && message.hasOwnProperty("resId"))
                    if (!$util.isString(message.resId))
                        return "resId: string expected";
                return null;
            };

            /**
             * Creates a DownloadForwardMessageRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.message.DownloadForwardMessageRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.message.DownloadForwardMessageRequest} DownloadForwardMessageRequest
             */
            DownloadForwardMessageRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.message.DownloadForwardMessageRequest)
                    return object;
                let message = new $root.kritor.message.DownloadForwardMessageRequest();
                if (object.resId != null)
                    message.resId = String(object.resId);
                return message;
            };

            /**
             * Creates a plain object from a DownloadForwardMessageRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.message.DownloadForwardMessageRequest
             * @static
             * @param {kritor.message.DownloadForwardMessageRequest} message DownloadForwardMessageRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            DownloadForwardMessageRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults)
                    object.resId = "";
                if (message.resId != null && message.hasOwnProperty("resId"))
                    object.resId = message.resId;
                return object;
            };

            /**
             * Converts this DownloadForwardMessageRequest to JSON.
             * @function toJSON
             * @memberof kritor.message.DownloadForwardMessageRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            DownloadForwardMessageRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for DownloadForwardMessageRequest
             * @function getTypeUrl
             * @memberof kritor.message.DownloadForwardMessageRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            DownloadForwardMessageRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.message.DownloadForwardMessageRequest";
            };

            return DownloadForwardMessageRequest;
        })();

        message.DownloadForwardMessageResponse = (function() {

            /**
             * Properties of a DownloadForwardMessageResponse.
             * @memberof kritor.message
             * @interface IDownloadForwardMessageResponse
             * @property {Array.<kritor.common.IPushMessageBody>|null} [messages] DownloadForwardMessageResponse messages
             */

            /**
             * Constructs a new DownloadForwardMessageResponse.
             * @memberof kritor.message
             * @classdesc Represents a DownloadForwardMessageResponse.
             * @implements IDownloadForwardMessageResponse
             * @constructor
             * @param {kritor.message.IDownloadForwardMessageResponse=} [properties] Properties to set
             */
            function DownloadForwardMessageResponse(properties) {
                this.messages = [];
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * DownloadForwardMessageResponse messages.
             * @member {Array.<kritor.common.IPushMessageBody>} messages
             * @memberof kritor.message.DownloadForwardMessageResponse
             * @instance
             */
            DownloadForwardMessageResponse.prototype.messages = $util.emptyArray;

            /**
             * Creates a new DownloadForwardMessageResponse instance using the specified properties.
             * @function create
             * @memberof kritor.message.DownloadForwardMessageResponse
             * @static
             * @param {kritor.message.IDownloadForwardMessageResponse=} [properties] Properties to set
             * @returns {kritor.message.DownloadForwardMessageResponse} DownloadForwardMessageResponse instance
             */
            DownloadForwardMessageResponse.create = function create(properties) {
                return new DownloadForwardMessageResponse(properties);
            };

            /**
             * Encodes the specified DownloadForwardMessageResponse message. Does not implicitly {@link kritor.message.DownloadForwardMessageResponse.verify|verify} messages.
             * @function encode
             * @memberof kritor.message.DownloadForwardMessageResponse
             * @static
             * @param {kritor.message.IDownloadForwardMessageResponse} message DownloadForwardMessageResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DownloadForwardMessageResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.messages != null && message.messages.length)
                    for (let i = 0; i < message.messages.length; ++i)
                        $root.kritor.common.PushMessageBody.encode(message.messages[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified DownloadForwardMessageResponse message, length delimited. Does not implicitly {@link kritor.message.DownloadForwardMessageResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.message.DownloadForwardMessageResponse
             * @static
             * @param {kritor.message.IDownloadForwardMessageResponse} message DownloadForwardMessageResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DownloadForwardMessageResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a DownloadForwardMessageResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.message.DownloadForwardMessageResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.message.DownloadForwardMessageResponse} DownloadForwardMessageResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DownloadForwardMessageResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.message.DownloadForwardMessageResponse();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            if (!(message.messages && message.messages.length))
                                message.messages = [];
                            message.messages.push($root.kritor.common.PushMessageBody.decode(reader, reader.uint32()));
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
             * Decodes a DownloadForwardMessageResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.message.DownloadForwardMessageResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.message.DownloadForwardMessageResponse} DownloadForwardMessageResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DownloadForwardMessageResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a DownloadForwardMessageResponse message.
             * @function verify
             * @memberof kritor.message.DownloadForwardMessageResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            DownloadForwardMessageResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.messages != null && message.hasOwnProperty("messages")) {
                    if (!Array.isArray(message.messages))
                        return "messages: array expected";
                    for (let i = 0; i < message.messages.length; ++i) {
                        let error = $root.kritor.common.PushMessageBody.verify(message.messages[i]);
                        if (error)
                            return "messages." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a DownloadForwardMessageResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.message.DownloadForwardMessageResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.message.DownloadForwardMessageResponse} DownloadForwardMessageResponse
             */
            DownloadForwardMessageResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.message.DownloadForwardMessageResponse)
                    return object;
                let message = new $root.kritor.message.DownloadForwardMessageResponse();
                if (object.messages) {
                    if (!Array.isArray(object.messages))
                        throw TypeError(".kritor.message.DownloadForwardMessageResponse.messages: array expected");
                    message.messages = [];
                    for (let i = 0; i < object.messages.length; ++i) {
                        if (typeof object.messages[i] !== "object")
                            throw TypeError(".kritor.message.DownloadForwardMessageResponse.messages: object expected");
                        message.messages[i] = $root.kritor.common.PushMessageBody.fromObject(object.messages[i]);
                    }
                }
                return message;
            };

            /**
             * Creates a plain object from a DownloadForwardMessageResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.message.DownloadForwardMessageResponse
             * @static
             * @param {kritor.message.DownloadForwardMessageResponse} message DownloadForwardMessageResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            DownloadForwardMessageResponse.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.arrays || options.defaults)
                    object.messages = [];
                if (message.messages && message.messages.length) {
                    object.messages = [];
                    for (let j = 0; j < message.messages.length; ++j)
                        object.messages[j] = $root.kritor.common.PushMessageBody.toObject(message.messages[j], options);
                }
                return object;
            };

            /**
             * Converts this DownloadForwardMessageResponse to JSON.
             * @function toJSON
             * @memberof kritor.message.DownloadForwardMessageResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            DownloadForwardMessageResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for DownloadForwardMessageResponse
             * @function getTypeUrl
             * @memberof kritor.message.DownloadForwardMessageResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            DownloadForwardMessageResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.message.DownloadForwardMessageResponse";
            };

            return DownloadForwardMessageResponse;
        })();

        message.GetEssenceMessageListRequest = (function() {

            /**
             * Properties of a GetEssenceMessageListRequest.
             * @memberof kritor.message
             * @interface IGetEssenceMessageListRequest
             * @property {number|Long|null} [groupId] GetEssenceMessageListRequest groupId
             * @property {number|null} [page] GetEssenceMessageListRequest page
             * @property {number|null} [pageSize] GetEssenceMessageListRequest pageSize
             */

            /**
             * Constructs a new GetEssenceMessageListRequest.
             * @memberof kritor.message
             * @classdesc Represents a GetEssenceMessageListRequest.
             * @implements IGetEssenceMessageListRequest
             * @constructor
             * @param {kritor.message.IGetEssenceMessageListRequest=} [properties] Properties to set
             */
            function GetEssenceMessageListRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetEssenceMessageListRequest groupId.
             * @member {number|Long} groupId
             * @memberof kritor.message.GetEssenceMessageListRequest
             * @instance
             */
            GetEssenceMessageListRequest.prototype.groupId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * GetEssenceMessageListRequest page.
             * @member {number} page
             * @memberof kritor.message.GetEssenceMessageListRequest
             * @instance
             */
            GetEssenceMessageListRequest.prototype.page = 0;

            /**
             * GetEssenceMessageListRequest pageSize.
             * @member {number} pageSize
             * @memberof kritor.message.GetEssenceMessageListRequest
             * @instance
             */
            GetEssenceMessageListRequest.prototype.pageSize = 0;

            /**
             * Creates a new GetEssenceMessageListRequest instance using the specified properties.
             * @function create
             * @memberof kritor.message.GetEssenceMessageListRequest
             * @static
             * @param {kritor.message.IGetEssenceMessageListRequest=} [properties] Properties to set
             * @returns {kritor.message.GetEssenceMessageListRequest} GetEssenceMessageListRequest instance
             */
            GetEssenceMessageListRequest.create = function create(properties) {
                return new GetEssenceMessageListRequest(properties);
            };

            /**
             * Encodes the specified GetEssenceMessageListRequest message. Does not implicitly {@link kritor.message.GetEssenceMessageListRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.message.GetEssenceMessageListRequest
             * @static
             * @param {kritor.message.IGetEssenceMessageListRequest} message GetEssenceMessageListRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetEssenceMessageListRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.groupId != null && Object.hasOwnProperty.call(message, "groupId"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.groupId);
                if (message.page != null && Object.hasOwnProperty.call(message, "page"))
                    writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.page);
                if (message.pageSize != null && Object.hasOwnProperty.call(message, "pageSize"))
                    writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.pageSize);
                return writer;
            };

            /**
             * Encodes the specified GetEssenceMessageListRequest message, length delimited. Does not implicitly {@link kritor.message.GetEssenceMessageListRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.message.GetEssenceMessageListRequest
             * @static
             * @param {kritor.message.IGetEssenceMessageListRequest} message GetEssenceMessageListRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetEssenceMessageListRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetEssenceMessageListRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.message.GetEssenceMessageListRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.message.GetEssenceMessageListRequest} GetEssenceMessageListRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetEssenceMessageListRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.message.GetEssenceMessageListRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.groupId = reader.uint64();
                            break;
                        }
                    case 2: {
                            message.page = reader.uint32();
                            break;
                        }
                    case 3: {
                            message.pageSize = reader.uint32();
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
             * Decodes a GetEssenceMessageListRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.message.GetEssenceMessageListRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.message.GetEssenceMessageListRequest} GetEssenceMessageListRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetEssenceMessageListRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetEssenceMessageListRequest message.
             * @function verify
             * @memberof kritor.message.GetEssenceMessageListRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetEssenceMessageListRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.groupId != null && message.hasOwnProperty("groupId"))
                    if (!$util.isInteger(message.groupId) && !(message.groupId && $util.isInteger(message.groupId.low) && $util.isInteger(message.groupId.high)))
                        return "groupId: integer|Long expected";
                if (message.page != null && message.hasOwnProperty("page"))
                    if (!$util.isInteger(message.page))
                        return "page: integer expected";
                if (message.pageSize != null && message.hasOwnProperty("pageSize"))
                    if (!$util.isInteger(message.pageSize))
                        return "pageSize: integer expected";
                return null;
            };

            /**
             * Creates a GetEssenceMessageListRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.message.GetEssenceMessageListRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.message.GetEssenceMessageListRequest} GetEssenceMessageListRequest
             */
            GetEssenceMessageListRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.message.GetEssenceMessageListRequest)
                    return object;
                let message = new $root.kritor.message.GetEssenceMessageListRequest();
                if (object.groupId != null)
                    if ($util.Long)
                        (message.groupId = $util.Long.fromValue(object.groupId)).unsigned = true;
                    else if (typeof object.groupId === "string")
                        message.groupId = parseInt(object.groupId, 10);
                    else if (typeof object.groupId === "number")
                        message.groupId = object.groupId;
                    else if (typeof object.groupId === "object")
                        message.groupId = new $util.LongBits(object.groupId.low >>> 0, object.groupId.high >>> 0).toNumber(true);
                if (object.page != null)
                    message.page = object.page >>> 0;
                if (object.pageSize != null)
                    message.pageSize = object.pageSize >>> 0;
                return message;
            };

            /**
             * Creates a plain object from a GetEssenceMessageListRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.message.GetEssenceMessageListRequest
             * @static
             * @param {kritor.message.GetEssenceMessageListRequest} message GetEssenceMessageListRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetEssenceMessageListRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.groupId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.groupId = options.longs === String ? "0" : 0;
                    object.page = 0;
                    object.pageSize = 0;
                }
                if (message.groupId != null && message.hasOwnProperty("groupId"))
                    if (typeof message.groupId === "number")
                        object.groupId = options.longs === String ? String(message.groupId) : message.groupId;
                    else
                        object.groupId = options.longs === String ? $util.Long.prototype.toString.call(message.groupId) : options.longs === Number ? new $util.LongBits(message.groupId.low >>> 0, message.groupId.high >>> 0).toNumber(true) : message.groupId;
                if (message.page != null && message.hasOwnProperty("page"))
                    object.page = message.page;
                if (message.pageSize != null && message.hasOwnProperty("pageSize"))
                    object.pageSize = message.pageSize;
                return object;
            };

            /**
             * Converts this GetEssenceMessageListRequest to JSON.
             * @function toJSON
             * @memberof kritor.message.GetEssenceMessageListRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetEssenceMessageListRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GetEssenceMessageListRequest
             * @function getTypeUrl
             * @memberof kritor.message.GetEssenceMessageListRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetEssenceMessageListRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.message.GetEssenceMessageListRequest";
            };

            return GetEssenceMessageListRequest;
        })();

        message.GetEssenceMessageListResponse = (function() {

            /**
             * Properties of a GetEssenceMessageListResponse.
             * @memberof kritor.message
             * @interface IGetEssenceMessageListResponse
             * @property {Array.<kritor.common.IEssenceMessageBody>|null} [messages] GetEssenceMessageListResponse messages
             */

            /**
             * Constructs a new GetEssenceMessageListResponse.
             * @memberof kritor.message
             * @classdesc Represents a GetEssenceMessageListResponse.
             * @implements IGetEssenceMessageListResponse
             * @constructor
             * @param {kritor.message.IGetEssenceMessageListResponse=} [properties] Properties to set
             */
            function GetEssenceMessageListResponse(properties) {
                this.messages = [];
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetEssenceMessageListResponse messages.
             * @member {Array.<kritor.common.IEssenceMessageBody>} messages
             * @memberof kritor.message.GetEssenceMessageListResponse
             * @instance
             */
            GetEssenceMessageListResponse.prototype.messages = $util.emptyArray;

            /**
             * Creates a new GetEssenceMessageListResponse instance using the specified properties.
             * @function create
             * @memberof kritor.message.GetEssenceMessageListResponse
             * @static
             * @param {kritor.message.IGetEssenceMessageListResponse=} [properties] Properties to set
             * @returns {kritor.message.GetEssenceMessageListResponse} GetEssenceMessageListResponse instance
             */
            GetEssenceMessageListResponse.create = function create(properties) {
                return new GetEssenceMessageListResponse(properties);
            };

            /**
             * Encodes the specified GetEssenceMessageListResponse message. Does not implicitly {@link kritor.message.GetEssenceMessageListResponse.verify|verify} messages.
             * @function encode
             * @memberof kritor.message.GetEssenceMessageListResponse
             * @static
             * @param {kritor.message.IGetEssenceMessageListResponse} message GetEssenceMessageListResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetEssenceMessageListResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.messages != null && message.messages.length)
                    for (let i = 0; i < message.messages.length; ++i)
                        $root.kritor.common.EssenceMessageBody.encode(message.messages[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified GetEssenceMessageListResponse message, length delimited. Does not implicitly {@link kritor.message.GetEssenceMessageListResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.message.GetEssenceMessageListResponse
             * @static
             * @param {kritor.message.IGetEssenceMessageListResponse} message GetEssenceMessageListResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetEssenceMessageListResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetEssenceMessageListResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.message.GetEssenceMessageListResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.message.GetEssenceMessageListResponse} GetEssenceMessageListResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetEssenceMessageListResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.message.GetEssenceMessageListResponse();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            if (!(message.messages && message.messages.length))
                                message.messages = [];
                            message.messages.push($root.kritor.common.EssenceMessageBody.decode(reader, reader.uint32()));
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
             * Decodes a GetEssenceMessageListResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.message.GetEssenceMessageListResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.message.GetEssenceMessageListResponse} GetEssenceMessageListResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetEssenceMessageListResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetEssenceMessageListResponse message.
             * @function verify
             * @memberof kritor.message.GetEssenceMessageListResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetEssenceMessageListResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.messages != null && message.hasOwnProperty("messages")) {
                    if (!Array.isArray(message.messages))
                        return "messages: array expected";
                    for (let i = 0; i < message.messages.length; ++i) {
                        let error = $root.kritor.common.EssenceMessageBody.verify(message.messages[i]);
                        if (error)
                            return "messages." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a GetEssenceMessageListResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.message.GetEssenceMessageListResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.message.GetEssenceMessageListResponse} GetEssenceMessageListResponse
             */
            GetEssenceMessageListResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.message.GetEssenceMessageListResponse)
                    return object;
                let message = new $root.kritor.message.GetEssenceMessageListResponse();
                if (object.messages) {
                    if (!Array.isArray(object.messages))
                        throw TypeError(".kritor.message.GetEssenceMessageListResponse.messages: array expected");
                    message.messages = [];
                    for (let i = 0; i < object.messages.length; ++i) {
                        if (typeof object.messages[i] !== "object")
                            throw TypeError(".kritor.message.GetEssenceMessageListResponse.messages: object expected");
                        message.messages[i] = $root.kritor.common.EssenceMessageBody.fromObject(object.messages[i]);
                    }
                }
                return message;
            };

            /**
             * Creates a plain object from a GetEssenceMessageListResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.message.GetEssenceMessageListResponse
             * @static
             * @param {kritor.message.GetEssenceMessageListResponse} message GetEssenceMessageListResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetEssenceMessageListResponse.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.arrays || options.defaults)
                    object.messages = [];
                if (message.messages && message.messages.length) {
                    object.messages = [];
                    for (let j = 0; j < message.messages.length; ++j)
                        object.messages[j] = $root.kritor.common.EssenceMessageBody.toObject(message.messages[j], options);
                }
                return object;
            };

            /**
             * Converts this GetEssenceMessageListResponse to JSON.
             * @function toJSON
             * @memberof kritor.message.GetEssenceMessageListResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetEssenceMessageListResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GetEssenceMessageListResponse
             * @function getTypeUrl
             * @memberof kritor.message.GetEssenceMessageListResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetEssenceMessageListResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.message.GetEssenceMessageListResponse";
            };

            return GetEssenceMessageListResponse;
        })();

        message.SetEssenceMessageRequest = (function() {

            /**
             * Properties of a SetEssenceMessageRequest.
             * @memberof kritor.message
             * @interface ISetEssenceMessageRequest
             * @property {number|Long|null} [groupId] SetEssenceMessageRequest groupId
             * @property {string|null} [messageId] SetEssenceMessageRequest messageId
             */

            /**
             * Constructs a new SetEssenceMessageRequest.
             * @memberof kritor.message
             * @classdesc Represents a SetEssenceMessageRequest.
             * @implements ISetEssenceMessageRequest
             * @constructor
             * @param {kritor.message.ISetEssenceMessageRequest=} [properties] Properties to set
             */
            function SetEssenceMessageRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * SetEssenceMessageRequest groupId.
             * @member {number|Long} groupId
             * @memberof kritor.message.SetEssenceMessageRequest
             * @instance
             */
            SetEssenceMessageRequest.prototype.groupId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * SetEssenceMessageRequest messageId.
             * @member {string} messageId
             * @memberof kritor.message.SetEssenceMessageRequest
             * @instance
             */
            SetEssenceMessageRequest.prototype.messageId = "";

            /**
             * Creates a new SetEssenceMessageRequest instance using the specified properties.
             * @function create
             * @memberof kritor.message.SetEssenceMessageRequest
             * @static
             * @param {kritor.message.ISetEssenceMessageRequest=} [properties] Properties to set
             * @returns {kritor.message.SetEssenceMessageRequest} SetEssenceMessageRequest instance
             */
            SetEssenceMessageRequest.create = function create(properties) {
                return new SetEssenceMessageRequest(properties);
            };

            /**
             * Encodes the specified SetEssenceMessageRequest message. Does not implicitly {@link kritor.message.SetEssenceMessageRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.message.SetEssenceMessageRequest
             * @static
             * @param {kritor.message.ISetEssenceMessageRequest} message SetEssenceMessageRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SetEssenceMessageRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.groupId != null && Object.hasOwnProperty.call(message, "groupId"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.groupId);
                if (message.messageId != null && Object.hasOwnProperty.call(message, "messageId"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.messageId);
                return writer;
            };

            /**
             * Encodes the specified SetEssenceMessageRequest message, length delimited. Does not implicitly {@link kritor.message.SetEssenceMessageRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.message.SetEssenceMessageRequest
             * @static
             * @param {kritor.message.ISetEssenceMessageRequest} message SetEssenceMessageRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SetEssenceMessageRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a SetEssenceMessageRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.message.SetEssenceMessageRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.message.SetEssenceMessageRequest} SetEssenceMessageRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SetEssenceMessageRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.message.SetEssenceMessageRequest();
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
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a SetEssenceMessageRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.message.SetEssenceMessageRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.message.SetEssenceMessageRequest} SetEssenceMessageRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SetEssenceMessageRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a SetEssenceMessageRequest message.
             * @function verify
             * @memberof kritor.message.SetEssenceMessageRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            SetEssenceMessageRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.groupId != null && message.hasOwnProperty("groupId"))
                    if (!$util.isInteger(message.groupId) && !(message.groupId && $util.isInteger(message.groupId.low) && $util.isInteger(message.groupId.high)))
                        return "groupId: integer|Long expected";
                if (message.messageId != null && message.hasOwnProperty("messageId"))
                    if (!$util.isString(message.messageId))
                        return "messageId: string expected";
                return null;
            };

            /**
             * Creates a SetEssenceMessageRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.message.SetEssenceMessageRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.message.SetEssenceMessageRequest} SetEssenceMessageRequest
             */
            SetEssenceMessageRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.message.SetEssenceMessageRequest)
                    return object;
                let message = new $root.kritor.message.SetEssenceMessageRequest();
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
                return message;
            };

            /**
             * Creates a plain object from a SetEssenceMessageRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.message.SetEssenceMessageRequest
             * @static
             * @param {kritor.message.SetEssenceMessageRequest} message SetEssenceMessageRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            SetEssenceMessageRequest.toObject = function toObject(message, options) {
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
                }
                if (message.groupId != null && message.hasOwnProperty("groupId"))
                    if (typeof message.groupId === "number")
                        object.groupId = options.longs === String ? String(message.groupId) : message.groupId;
                    else
                        object.groupId = options.longs === String ? $util.Long.prototype.toString.call(message.groupId) : options.longs === Number ? new $util.LongBits(message.groupId.low >>> 0, message.groupId.high >>> 0).toNumber(true) : message.groupId;
                if (message.messageId != null && message.hasOwnProperty("messageId"))
                    object.messageId = message.messageId;
                return object;
            };

            /**
             * Converts this SetEssenceMessageRequest to JSON.
             * @function toJSON
             * @memberof kritor.message.SetEssenceMessageRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            SetEssenceMessageRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for SetEssenceMessageRequest
             * @function getTypeUrl
             * @memberof kritor.message.SetEssenceMessageRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            SetEssenceMessageRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.message.SetEssenceMessageRequest";
            };

            return SetEssenceMessageRequest;
        })();

        message.SetEssenceMessageResponse = (function() {

            /**
             * Properties of a SetEssenceMessageResponse.
             * @memberof kritor.message
             * @interface ISetEssenceMessageResponse
             */

            /**
             * Constructs a new SetEssenceMessageResponse.
             * @memberof kritor.message
             * @classdesc Represents a SetEssenceMessageResponse.
             * @implements ISetEssenceMessageResponse
             * @constructor
             * @param {kritor.message.ISetEssenceMessageResponse=} [properties] Properties to set
             */
            function SetEssenceMessageResponse(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Creates a new SetEssenceMessageResponse instance using the specified properties.
             * @function create
             * @memberof kritor.message.SetEssenceMessageResponse
             * @static
             * @param {kritor.message.ISetEssenceMessageResponse=} [properties] Properties to set
             * @returns {kritor.message.SetEssenceMessageResponse} SetEssenceMessageResponse instance
             */
            SetEssenceMessageResponse.create = function create(properties) {
                return new SetEssenceMessageResponse(properties);
            };

            /**
             * Encodes the specified SetEssenceMessageResponse message. Does not implicitly {@link kritor.message.SetEssenceMessageResponse.verify|verify} messages.
             * @function encode
             * @memberof kritor.message.SetEssenceMessageResponse
             * @static
             * @param {kritor.message.ISetEssenceMessageResponse} message SetEssenceMessageResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SetEssenceMessageResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                return writer;
            };

            /**
             * Encodes the specified SetEssenceMessageResponse message, length delimited. Does not implicitly {@link kritor.message.SetEssenceMessageResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.message.SetEssenceMessageResponse
             * @static
             * @param {kritor.message.ISetEssenceMessageResponse} message SetEssenceMessageResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SetEssenceMessageResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a SetEssenceMessageResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.message.SetEssenceMessageResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.message.SetEssenceMessageResponse} SetEssenceMessageResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SetEssenceMessageResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.message.SetEssenceMessageResponse();
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
             * Decodes a SetEssenceMessageResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.message.SetEssenceMessageResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.message.SetEssenceMessageResponse} SetEssenceMessageResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SetEssenceMessageResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a SetEssenceMessageResponse message.
             * @function verify
             * @memberof kritor.message.SetEssenceMessageResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            SetEssenceMessageResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                return null;
            };

            /**
             * Creates a SetEssenceMessageResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.message.SetEssenceMessageResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.message.SetEssenceMessageResponse} SetEssenceMessageResponse
             */
            SetEssenceMessageResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.message.SetEssenceMessageResponse)
                    return object;
                return new $root.kritor.message.SetEssenceMessageResponse();
            };

            /**
             * Creates a plain object from a SetEssenceMessageResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.message.SetEssenceMessageResponse
             * @static
             * @param {kritor.message.SetEssenceMessageResponse} message SetEssenceMessageResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            SetEssenceMessageResponse.toObject = function toObject() {
                return {};
            };

            /**
             * Converts this SetEssenceMessageResponse to JSON.
             * @function toJSON
             * @memberof kritor.message.SetEssenceMessageResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            SetEssenceMessageResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for SetEssenceMessageResponse
             * @function getTypeUrl
             * @memberof kritor.message.SetEssenceMessageResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            SetEssenceMessageResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.message.SetEssenceMessageResponse";
            };

            return SetEssenceMessageResponse;
        })();

        message.DeleteEssenceMessageRequest = (function() {

            /**
             * Properties of a DeleteEssenceMessageRequest.
             * @memberof kritor.message
             * @interface IDeleteEssenceMessageRequest
             * @property {number|Long|null} [groupId] DeleteEssenceMessageRequest groupId
             * @property {string|null} [messageId] DeleteEssenceMessageRequest messageId
             */

            /**
             * Constructs a new DeleteEssenceMessageRequest.
             * @memberof kritor.message
             * @classdesc Represents a DeleteEssenceMessageRequest.
             * @implements IDeleteEssenceMessageRequest
             * @constructor
             * @param {kritor.message.IDeleteEssenceMessageRequest=} [properties] Properties to set
             */
            function DeleteEssenceMessageRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * DeleteEssenceMessageRequest groupId.
             * @member {number|Long} groupId
             * @memberof kritor.message.DeleteEssenceMessageRequest
             * @instance
             */
            DeleteEssenceMessageRequest.prototype.groupId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * DeleteEssenceMessageRequest messageId.
             * @member {string} messageId
             * @memberof kritor.message.DeleteEssenceMessageRequest
             * @instance
             */
            DeleteEssenceMessageRequest.prototype.messageId = "";

            /**
             * Creates a new DeleteEssenceMessageRequest instance using the specified properties.
             * @function create
             * @memberof kritor.message.DeleteEssenceMessageRequest
             * @static
             * @param {kritor.message.IDeleteEssenceMessageRequest=} [properties] Properties to set
             * @returns {kritor.message.DeleteEssenceMessageRequest} DeleteEssenceMessageRequest instance
             */
            DeleteEssenceMessageRequest.create = function create(properties) {
                return new DeleteEssenceMessageRequest(properties);
            };

            /**
             * Encodes the specified DeleteEssenceMessageRequest message. Does not implicitly {@link kritor.message.DeleteEssenceMessageRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.message.DeleteEssenceMessageRequest
             * @static
             * @param {kritor.message.IDeleteEssenceMessageRequest} message DeleteEssenceMessageRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DeleteEssenceMessageRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.groupId != null && Object.hasOwnProperty.call(message, "groupId"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.groupId);
                if (message.messageId != null && Object.hasOwnProperty.call(message, "messageId"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.messageId);
                return writer;
            };

            /**
             * Encodes the specified DeleteEssenceMessageRequest message, length delimited. Does not implicitly {@link kritor.message.DeleteEssenceMessageRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.message.DeleteEssenceMessageRequest
             * @static
             * @param {kritor.message.IDeleteEssenceMessageRequest} message DeleteEssenceMessageRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DeleteEssenceMessageRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a DeleteEssenceMessageRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.message.DeleteEssenceMessageRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.message.DeleteEssenceMessageRequest} DeleteEssenceMessageRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DeleteEssenceMessageRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.message.DeleteEssenceMessageRequest();
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
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a DeleteEssenceMessageRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.message.DeleteEssenceMessageRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.message.DeleteEssenceMessageRequest} DeleteEssenceMessageRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DeleteEssenceMessageRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a DeleteEssenceMessageRequest message.
             * @function verify
             * @memberof kritor.message.DeleteEssenceMessageRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            DeleteEssenceMessageRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.groupId != null && message.hasOwnProperty("groupId"))
                    if (!$util.isInteger(message.groupId) && !(message.groupId && $util.isInteger(message.groupId.low) && $util.isInteger(message.groupId.high)))
                        return "groupId: integer|Long expected";
                if (message.messageId != null && message.hasOwnProperty("messageId"))
                    if (!$util.isString(message.messageId))
                        return "messageId: string expected";
                return null;
            };

            /**
             * Creates a DeleteEssenceMessageRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.message.DeleteEssenceMessageRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.message.DeleteEssenceMessageRequest} DeleteEssenceMessageRequest
             */
            DeleteEssenceMessageRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.message.DeleteEssenceMessageRequest)
                    return object;
                let message = new $root.kritor.message.DeleteEssenceMessageRequest();
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
                return message;
            };

            /**
             * Creates a plain object from a DeleteEssenceMessageRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.message.DeleteEssenceMessageRequest
             * @static
             * @param {kritor.message.DeleteEssenceMessageRequest} message DeleteEssenceMessageRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            DeleteEssenceMessageRequest.toObject = function toObject(message, options) {
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
                }
                if (message.groupId != null && message.hasOwnProperty("groupId"))
                    if (typeof message.groupId === "number")
                        object.groupId = options.longs === String ? String(message.groupId) : message.groupId;
                    else
                        object.groupId = options.longs === String ? $util.Long.prototype.toString.call(message.groupId) : options.longs === Number ? new $util.LongBits(message.groupId.low >>> 0, message.groupId.high >>> 0).toNumber(true) : message.groupId;
                if (message.messageId != null && message.hasOwnProperty("messageId"))
                    object.messageId = message.messageId;
                return object;
            };

            /**
             * Converts this DeleteEssenceMessageRequest to JSON.
             * @function toJSON
             * @memberof kritor.message.DeleteEssenceMessageRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            DeleteEssenceMessageRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for DeleteEssenceMessageRequest
             * @function getTypeUrl
             * @memberof kritor.message.DeleteEssenceMessageRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            DeleteEssenceMessageRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.message.DeleteEssenceMessageRequest";
            };

            return DeleteEssenceMessageRequest;
        })();

        message.DeleteEssenceMessageResponse = (function() {

            /**
             * Properties of a DeleteEssenceMessageResponse.
             * @memberof kritor.message
             * @interface IDeleteEssenceMessageResponse
             */

            /**
             * Constructs a new DeleteEssenceMessageResponse.
             * @memberof kritor.message
             * @classdesc Represents a DeleteEssenceMessageResponse.
             * @implements IDeleteEssenceMessageResponse
             * @constructor
             * @param {kritor.message.IDeleteEssenceMessageResponse=} [properties] Properties to set
             */
            function DeleteEssenceMessageResponse(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Creates a new DeleteEssenceMessageResponse instance using the specified properties.
             * @function create
             * @memberof kritor.message.DeleteEssenceMessageResponse
             * @static
             * @param {kritor.message.IDeleteEssenceMessageResponse=} [properties] Properties to set
             * @returns {kritor.message.DeleteEssenceMessageResponse} DeleteEssenceMessageResponse instance
             */
            DeleteEssenceMessageResponse.create = function create(properties) {
                return new DeleteEssenceMessageResponse(properties);
            };

            /**
             * Encodes the specified DeleteEssenceMessageResponse message. Does not implicitly {@link kritor.message.DeleteEssenceMessageResponse.verify|verify} messages.
             * @function encode
             * @memberof kritor.message.DeleteEssenceMessageResponse
             * @static
             * @param {kritor.message.IDeleteEssenceMessageResponse} message DeleteEssenceMessageResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DeleteEssenceMessageResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                return writer;
            };

            /**
             * Encodes the specified DeleteEssenceMessageResponse message, length delimited. Does not implicitly {@link kritor.message.DeleteEssenceMessageResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.message.DeleteEssenceMessageResponse
             * @static
             * @param {kritor.message.IDeleteEssenceMessageResponse} message DeleteEssenceMessageResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DeleteEssenceMessageResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a DeleteEssenceMessageResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.message.DeleteEssenceMessageResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.message.DeleteEssenceMessageResponse} DeleteEssenceMessageResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DeleteEssenceMessageResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.message.DeleteEssenceMessageResponse();
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
             * Decodes a DeleteEssenceMessageResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.message.DeleteEssenceMessageResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.message.DeleteEssenceMessageResponse} DeleteEssenceMessageResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DeleteEssenceMessageResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a DeleteEssenceMessageResponse message.
             * @function verify
             * @memberof kritor.message.DeleteEssenceMessageResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            DeleteEssenceMessageResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                return null;
            };

            /**
             * Creates a DeleteEssenceMessageResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.message.DeleteEssenceMessageResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.message.DeleteEssenceMessageResponse} DeleteEssenceMessageResponse
             */
            DeleteEssenceMessageResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.message.DeleteEssenceMessageResponse)
                    return object;
                return new $root.kritor.message.DeleteEssenceMessageResponse();
            };

            /**
             * Creates a plain object from a DeleteEssenceMessageResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.message.DeleteEssenceMessageResponse
             * @static
             * @param {kritor.message.DeleteEssenceMessageResponse} message DeleteEssenceMessageResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            DeleteEssenceMessageResponse.toObject = function toObject() {
                return {};
            };

            /**
             * Converts this DeleteEssenceMessageResponse to JSON.
             * @function toJSON
             * @memberof kritor.message.DeleteEssenceMessageResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            DeleteEssenceMessageResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for DeleteEssenceMessageResponse
             * @function getTypeUrl
             * @memberof kritor.message.DeleteEssenceMessageResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            DeleteEssenceMessageResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.message.DeleteEssenceMessageResponse";
            };

            return DeleteEssenceMessageResponse;
        })();

        return message;
    })();

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
