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

    kritor.file = (function() {

        /**
         * Namespace file.
         * @memberof kritor
         * @namespace
         */
        const file = {};

        file.GroupFileService = (function() {

            /**
             * Constructs a new GroupFileService service.
             * @memberof kritor.file
             * @classdesc Represents a GroupFileService
             * @extends $protobuf.rpc.Service
             * @constructor
             * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
             * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
             * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
             */
            function GroupFileService(rpcImpl, requestDelimited, responseDelimited) {
                $protobuf.rpc.Service.call(this, rpcImpl, requestDelimited, responseDelimited);
            }

            (GroupFileService.prototype = Object.create($protobuf.rpc.Service.prototype)).constructor = GroupFileService;

            /**
             * Creates new GroupFileService service using the specified rpc implementation.
             * @function create
             * @memberof kritor.file.GroupFileService
             * @static
             * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
             * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
             * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
             * @returns {GroupFileService} RPC service. Useful where requests and/or responses are streamed.
             */
            GroupFileService.create = function create(rpcImpl, requestDelimited, responseDelimited) {
                return new this(rpcImpl, requestDelimited, responseDelimited);
            };

            /**
             * Callback as used by {@link kritor.file.GroupFileService#createFolder}.
             * @memberof kritor.file.GroupFileService
             * @typedef CreateFolderCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.file.CreateFolderResponse} [response] CreateFolderResponse
             */

            /**
             * Calls CreateFolder.
             * @function createFolder
             * @memberof kritor.file.GroupFileService
             * @instance
             * @param {kritor.file.ICreateFolderRequest} request CreateFolderRequest message or plain object
             * @param {kritor.file.GroupFileService.CreateFolderCallback} callback Node-style callback called with the error, if any, and CreateFolderResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(GroupFileService.prototype.createFolder = function createFolder(request, callback) {
                return this.rpcCall(createFolder, $root.kritor.file.CreateFolderRequest, $root.kritor.file.CreateFolderResponse, request, callback);
            }, "name", { value: "CreateFolder" });

            /**
             * Calls CreateFolder.
             * @function createFolder
             * @memberof kritor.file.GroupFileService
             * @instance
             * @param {kritor.file.ICreateFolderRequest} request CreateFolderRequest message or plain object
             * @returns {Promise<kritor.file.CreateFolderResponse>} Promise
             * @variation 2
             */

            /**
             * Callback as used by {@link kritor.file.GroupFileService#renameFolder}.
             * @memberof kritor.file.GroupFileService
             * @typedef RenameFolderCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.file.RenameFolderResponse} [response] RenameFolderResponse
             */

            /**
             * Calls RenameFolder.
             * @function renameFolder
             * @memberof kritor.file.GroupFileService
             * @instance
             * @param {kritor.file.IRenameFolderRequest} request RenameFolderRequest message or plain object
             * @param {kritor.file.GroupFileService.RenameFolderCallback} callback Node-style callback called with the error, if any, and RenameFolderResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(GroupFileService.prototype.renameFolder = function renameFolder(request, callback) {
                return this.rpcCall(renameFolder, $root.kritor.file.RenameFolderRequest, $root.kritor.file.RenameFolderResponse, request, callback);
            }, "name", { value: "RenameFolder" });

            /**
             * Calls RenameFolder.
             * @function renameFolder
             * @memberof kritor.file.GroupFileService
             * @instance
             * @param {kritor.file.IRenameFolderRequest} request RenameFolderRequest message or plain object
             * @returns {Promise<kritor.file.RenameFolderResponse>} Promise
             * @variation 2
             */

            /**
             * Callback as used by {@link kritor.file.GroupFileService#deleteFolder}.
             * @memberof kritor.file.GroupFileService
             * @typedef DeleteFolderCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.file.DeleteFolderResponse} [response] DeleteFolderResponse
             */

            /**
             * Calls DeleteFolder.
             * @function deleteFolder
             * @memberof kritor.file.GroupFileService
             * @instance
             * @param {kritor.file.IDeleteFolderRequest} request DeleteFolderRequest message or plain object
             * @param {kritor.file.GroupFileService.DeleteFolderCallback} callback Node-style callback called with the error, if any, and DeleteFolderResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(GroupFileService.prototype.deleteFolder = function deleteFolder(request, callback) {
                return this.rpcCall(deleteFolder, $root.kritor.file.DeleteFolderRequest, $root.kritor.file.DeleteFolderResponse, request, callback);
            }, "name", { value: "DeleteFolder" });

            /**
             * Calls DeleteFolder.
             * @function deleteFolder
             * @memberof kritor.file.GroupFileService
             * @instance
             * @param {kritor.file.IDeleteFolderRequest} request DeleteFolderRequest message or plain object
             * @returns {Promise<kritor.file.DeleteFolderResponse>} Promise
             * @variation 2
             */

            /**
             * Callback as used by {@link kritor.file.GroupFileService#uploadFile}.
             * @memberof kritor.file.GroupFileService
             * @typedef UploadFileCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.file.UploadFileResponse} [response] UploadFileResponse
             */

            /**
             * Calls UploadFile.
             * @function uploadFile
             * @memberof kritor.file.GroupFileService
             * @instance
             * @param {kritor.file.IUploadFileRequest} request UploadFileRequest message or plain object
             * @param {kritor.file.GroupFileService.UploadFileCallback} callback Node-style callback called with the error, if any, and UploadFileResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(GroupFileService.prototype.uploadFile = function uploadFile(request, callback) {
                return this.rpcCall(uploadFile, $root.kritor.file.UploadFileRequest, $root.kritor.file.UploadFileResponse, request, callback);
            }, "name", { value: "UploadFile" });

            /**
             * Calls UploadFile.
             * @function uploadFile
             * @memberof kritor.file.GroupFileService
             * @instance
             * @param {kritor.file.IUploadFileRequest} request UploadFileRequest message or plain object
             * @returns {Promise<kritor.file.UploadFileResponse>} Promise
             * @variation 2
             */

            /**
             * Callback as used by {@link kritor.file.GroupFileService#deleteFile}.
             * @memberof kritor.file.GroupFileService
             * @typedef DeleteFileCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.file.DeleteFileResponse} [response] DeleteFileResponse
             */

            /**
             * Calls DeleteFile.
             * @function deleteFile
             * @memberof kritor.file.GroupFileService
             * @instance
             * @param {kritor.file.IDeleteFileRequest} request DeleteFileRequest message or plain object
             * @param {kritor.file.GroupFileService.DeleteFileCallback} callback Node-style callback called with the error, if any, and DeleteFileResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(GroupFileService.prototype.deleteFile = function deleteFile(request, callback) {
                return this.rpcCall(deleteFile, $root.kritor.file.DeleteFileRequest, $root.kritor.file.DeleteFileResponse, request, callback);
            }, "name", { value: "DeleteFile" });

            /**
             * Calls DeleteFile.
             * @function deleteFile
             * @memberof kritor.file.GroupFileService
             * @instance
             * @param {kritor.file.IDeleteFileRequest} request DeleteFileRequest message or plain object
             * @returns {Promise<kritor.file.DeleteFileResponse>} Promise
             * @variation 2
             */

            /**
             * Callback as used by {@link kritor.file.GroupFileService#getFileSystemInfo}.
             * @memberof kritor.file.GroupFileService
             * @typedef GetFileSystemInfoCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.file.GetFileSystemInfoResponse} [response] GetFileSystemInfoResponse
             */

            /**
             * Calls GetFileSystemInfo.
             * @function getFileSystemInfo
             * @memberof kritor.file.GroupFileService
             * @instance
             * @param {kritor.file.IGetFileSystemInfoRequest} request GetFileSystemInfoRequest message or plain object
             * @param {kritor.file.GroupFileService.GetFileSystemInfoCallback} callback Node-style callback called with the error, if any, and GetFileSystemInfoResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(GroupFileService.prototype.getFileSystemInfo = function getFileSystemInfo(request, callback) {
                return this.rpcCall(getFileSystemInfo, $root.kritor.file.GetFileSystemInfoRequest, $root.kritor.file.GetFileSystemInfoResponse, request, callback);
            }, "name", { value: "GetFileSystemInfo" });

            /**
             * Calls GetFileSystemInfo.
             * @function getFileSystemInfo
             * @memberof kritor.file.GroupFileService
             * @instance
             * @param {kritor.file.IGetFileSystemInfoRequest} request GetFileSystemInfoRequest message or plain object
             * @returns {Promise<kritor.file.GetFileSystemInfoResponse>} Promise
             * @variation 2
             */

            /**
             * Callback as used by {@link kritor.file.GroupFileService#getFileList}.
             * @memberof kritor.file.GroupFileService
             * @typedef GetFileListCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.file.GetFileListResponse} [response] GetFileListResponse
             */

            /**
             * Calls GetFileList.
             * @function getFileList
             * @memberof kritor.file.GroupFileService
             * @instance
             * @param {kritor.file.IGetFileListRequest} request GetFileListRequest message or plain object
             * @param {kritor.file.GroupFileService.GetFileListCallback} callback Node-style callback called with the error, if any, and GetFileListResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(GroupFileService.prototype.getFileList = function getFileList(request, callback) {
                return this.rpcCall(getFileList, $root.kritor.file.GetFileListRequest, $root.kritor.file.GetFileListResponse, request, callback);
            }, "name", { value: "GetFileList" });

            /**
             * Calls GetFileList.
             * @function getFileList
             * @memberof kritor.file.GroupFileService
             * @instance
             * @param {kritor.file.IGetFileListRequest} request GetFileListRequest message or plain object
             * @returns {Promise<kritor.file.GetFileListResponse>} Promise
             * @variation 2
             */

            return GroupFileService;
        })();

        file.CreateFolderRequest = (function() {

            /**
             * Properties of a CreateFolderRequest.
             * @memberof kritor.file
             * @interface ICreateFolderRequest
             * @property {number|Long|null} [groupId] CreateFolderRequest groupId
             * @property {string|null} [name] CreateFolderRequest name
             */

            /**
             * Constructs a new CreateFolderRequest.
             * @memberof kritor.file
             * @classdesc Represents a CreateFolderRequest.
             * @implements ICreateFolderRequest
             * @constructor
             * @param {kritor.file.ICreateFolderRequest=} [properties] Properties to set
             */
            function CreateFolderRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * CreateFolderRequest groupId.
             * @member {number|Long} groupId
             * @memberof kritor.file.CreateFolderRequest
             * @instance
             */
            CreateFolderRequest.prototype.groupId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * CreateFolderRequest name.
             * @member {string} name
             * @memberof kritor.file.CreateFolderRequest
             * @instance
             */
            CreateFolderRequest.prototype.name = "";

            /**
             * Creates a new CreateFolderRequest instance using the specified properties.
             * @function create
             * @memberof kritor.file.CreateFolderRequest
             * @static
             * @param {kritor.file.ICreateFolderRequest=} [properties] Properties to set
             * @returns {kritor.file.CreateFolderRequest} CreateFolderRequest instance
             */
            CreateFolderRequest.create = function create(properties) {
                return new CreateFolderRequest(properties);
            };

            /**
             * Encodes the specified CreateFolderRequest message. Does not implicitly {@link kritor.file.CreateFolderRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.file.CreateFolderRequest
             * @static
             * @param {kritor.file.ICreateFolderRequest} message CreateFolderRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CreateFolderRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.groupId != null && Object.hasOwnProperty.call(message, "groupId"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.groupId);
                if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
                return writer;
            };

            /**
             * Encodes the specified CreateFolderRequest message, length delimited. Does not implicitly {@link kritor.file.CreateFolderRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.file.CreateFolderRequest
             * @static
             * @param {kritor.file.ICreateFolderRequest} message CreateFolderRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CreateFolderRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a CreateFolderRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.file.CreateFolderRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.file.CreateFolderRequest} CreateFolderRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CreateFolderRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.file.CreateFolderRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.groupId = reader.uint64();
                            break;
                        }
                    case 2: {
                            message.name = reader.string();
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
             * Decodes a CreateFolderRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.file.CreateFolderRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.file.CreateFolderRequest} CreateFolderRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CreateFolderRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a CreateFolderRequest message.
             * @function verify
             * @memberof kritor.file.CreateFolderRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            CreateFolderRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.groupId != null && message.hasOwnProperty("groupId"))
                    if (!$util.isInteger(message.groupId) && !(message.groupId && $util.isInteger(message.groupId.low) && $util.isInteger(message.groupId.high)))
                        return "groupId: integer|Long expected";
                if (message.name != null && message.hasOwnProperty("name"))
                    if (!$util.isString(message.name))
                        return "name: string expected";
                return null;
            };

            /**
             * Creates a CreateFolderRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.file.CreateFolderRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.file.CreateFolderRequest} CreateFolderRequest
             */
            CreateFolderRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.file.CreateFolderRequest)
                    return object;
                let message = new $root.kritor.file.CreateFolderRequest();
                if (object.groupId != null)
                    if ($util.Long)
                        (message.groupId = $util.Long.fromValue(object.groupId)).unsigned = true;
                    else if (typeof object.groupId === "string")
                        message.groupId = parseInt(object.groupId, 10);
                    else if (typeof object.groupId === "number")
                        message.groupId = object.groupId;
                    else if (typeof object.groupId === "object")
                        message.groupId = new $util.LongBits(object.groupId.low >>> 0, object.groupId.high >>> 0).toNumber(true);
                if (object.name != null)
                    message.name = String(object.name);
                return message;
            };

            /**
             * Creates a plain object from a CreateFolderRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.file.CreateFolderRequest
             * @static
             * @param {kritor.file.CreateFolderRequest} message CreateFolderRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            CreateFolderRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.groupId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.groupId = options.longs === String ? "0" : 0;
                    object.name = "";
                }
                if (message.groupId != null && message.hasOwnProperty("groupId"))
                    if (typeof message.groupId === "number")
                        object.groupId = options.longs === String ? String(message.groupId) : message.groupId;
                    else
                        object.groupId = options.longs === String ? $util.Long.prototype.toString.call(message.groupId) : options.longs === Number ? new $util.LongBits(message.groupId.low >>> 0, message.groupId.high >>> 0).toNumber(true) : message.groupId;
                if (message.name != null && message.hasOwnProperty("name"))
                    object.name = message.name;
                return object;
            };

            /**
             * Converts this CreateFolderRequest to JSON.
             * @function toJSON
             * @memberof kritor.file.CreateFolderRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            CreateFolderRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for CreateFolderRequest
             * @function getTypeUrl
             * @memberof kritor.file.CreateFolderRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            CreateFolderRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.file.CreateFolderRequest";
            };

            return CreateFolderRequest;
        })();

        file.CreateFolderResponse = (function() {

            /**
             * Properties of a CreateFolderResponse.
             * @memberof kritor.file
             * @interface ICreateFolderResponse
             * @property {string|null} [id] CreateFolderResponse id
             * @property {number|Long|null} [usedSpace] CreateFolderResponse usedSpace
             */

            /**
             * Constructs a new CreateFolderResponse.
             * @memberof kritor.file
             * @classdesc Represents a CreateFolderResponse.
             * @implements ICreateFolderResponse
             * @constructor
             * @param {kritor.file.ICreateFolderResponse=} [properties] Properties to set
             */
            function CreateFolderResponse(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * CreateFolderResponse id.
             * @member {string} id
             * @memberof kritor.file.CreateFolderResponse
             * @instance
             */
            CreateFolderResponse.prototype.id = "";

            /**
             * CreateFolderResponse usedSpace.
             * @member {number|Long} usedSpace
             * @memberof kritor.file.CreateFolderResponse
             * @instance
             */
            CreateFolderResponse.prototype.usedSpace = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * Creates a new CreateFolderResponse instance using the specified properties.
             * @function create
             * @memberof kritor.file.CreateFolderResponse
             * @static
             * @param {kritor.file.ICreateFolderResponse=} [properties] Properties to set
             * @returns {kritor.file.CreateFolderResponse} CreateFolderResponse instance
             */
            CreateFolderResponse.create = function create(properties) {
                return new CreateFolderResponse(properties);
            };

            /**
             * Encodes the specified CreateFolderResponse message. Does not implicitly {@link kritor.file.CreateFolderResponse.verify|verify} messages.
             * @function encode
             * @memberof kritor.file.CreateFolderResponse
             * @static
             * @param {kritor.file.ICreateFolderResponse} message CreateFolderResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CreateFolderResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
                if (message.usedSpace != null && Object.hasOwnProperty.call(message, "usedSpace"))
                    writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.usedSpace);
                return writer;
            };

            /**
             * Encodes the specified CreateFolderResponse message, length delimited. Does not implicitly {@link kritor.file.CreateFolderResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.file.CreateFolderResponse
             * @static
             * @param {kritor.file.ICreateFolderResponse} message CreateFolderResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CreateFolderResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a CreateFolderResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.file.CreateFolderResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.file.CreateFolderResponse} CreateFolderResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CreateFolderResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.file.CreateFolderResponse();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.id = reader.string();
                            break;
                        }
                    case 2: {
                            message.usedSpace = reader.uint64();
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
             * Decodes a CreateFolderResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.file.CreateFolderResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.file.CreateFolderResponse} CreateFolderResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CreateFolderResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a CreateFolderResponse message.
             * @function verify
             * @memberof kritor.file.CreateFolderResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            CreateFolderResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.id != null && message.hasOwnProperty("id"))
                    if (!$util.isString(message.id))
                        return "id: string expected";
                if (message.usedSpace != null && message.hasOwnProperty("usedSpace"))
                    if (!$util.isInteger(message.usedSpace) && !(message.usedSpace && $util.isInteger(message.usedSpace.low) && $util.isInteger(message.usedSpace.high)))
                        return "usedSpace: integer|Long expected";
                return null;
            };

            /**
             * Creates a CreateFolderResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.file.CreateFolderResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.file.CreateFolderResponse} CreateFolderResponse
             */
            CreateFolderResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.file.CreateFolderResponse)
                    return object;
                let message = new $root.kritor.file.CreateFolderResponse();
                if (object.id != null)
                    message.id = String(object.id);
                if (object.usedSpace != null)
                    if ($util.Long)
                        (message.usedSpace = $util.Long.fromValue(object.usedSpace)).unsigned = true;
                    else if (typeof object.usedSpace === "string")
                        message.usedSpace = parseInt(object.usedSpace, 10);
                    else if (typeof object.usedSpace === "number")
                        message.usedSpace = object.usedSpace;
                    else if (typeof object.usedSpace === "object")
                        message.usedSpace = new $util.LongBits(object.usedSpace.low >>> 0, object.usedSpace.high >>> 0).toNumber(true);
                return message;
            };

            /**
             * Creates a plain object from a CreateFolderResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.file.CreateFolderResponse
             * @static
             * @param {kritor.file.CreateFolderResponse} message CreateFolderResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            CreateFolderResponse.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.id = "";
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.usedSpace = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.usedSpace = options.longs === String ? "0" : 0;
                }
                if (message.id != null && message.hasOwnProperty("id"))
                    object.id = message.id;
                if (message.usedSpace != null && message.hasOwnProperty("usedSpace"))
                    if (typeof message.usedSpace === "number")
                        object.usedSpace = options.longs === String ? String(message.usedSpace) : message.usedSpace;
                    else
                        object.usedSpace = options.longs === String ? $util.Long.prototype.toString.call(message.usedSpace) : options.longs === Number ? new $util.LongBits(message.usedSpace.low >>> 0, message.usedSpace.high >>> 0).toNumber(true) : message.usedSpace;
                return object;
            };

            /**
             * Converts this CreateFolderResponse to JSON.
             * @function toJSON
             * @memberof kritor.file.CreateFolderResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            CreateFolderResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for CreateFolderResponse
             * @function getTypeUrl
             * @memberof kritor.file.CreateFolderResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            CreateFolderResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.file.CreateFolderResponse";
            };

            return CreateFolderResponse;
        })();

        file.RenameFolderRequest = (function() {

            /**
             * Properties of a RenameFolderRequest.
             * @memberof kritor.file
             * @interface IRenameFolderRequest
             * @property {number|Long|null} [groupId] RenameFolderRequest groupId
             * @property {string|null} [folderId] RenameFolderRequest folderId
             * @property {string|null} [name] RenameFolderRequest name
             */

            /**
             * Constructs a new RenameFolderRequest.
             * @memberof kritor.file
             * @classdesc Represents a RenameFolderRequest.
             * @implements IRenameFolderRequest
             * @constructor
             * @param {kritor.file.IRenameFolderRequest=} [properties] Properties to set
             */
            function RenameFolderRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * RenameFolderRequest groupId.
             * @member {number|Long} groupId
             * @memberof kritor.file.RenameFolderRequest
             * @instance
             */
            RenameFolderRequest.prototype.groupId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * RenameFolderRequest folderId.
             * @member {string} folderId
             * @memberof kritor.file.RenameFolderRequest
             * @instance
             */
            RenameFolderRequest.prototype.folderId = "";

            /**
             * RenameFolderRequest name.
             * @member {string} name
             * @memberof kritor.file.RenameFolderRequest
             * @instance
             */
            RenameFolderRequest.prototype.name = "";

            /**
             * Creates a new RenameFolderRequest instance using the specified properties.
             * @function create
             * @memberof kritor.file.RenameFolderRequest
             * @static
             * @param {kritor.file.IRenameFolderRequest=} [properties] Properties to set
             * @returns {kritor.file.RenameFolderRequest} RenameFolderRequest instance
             */
            RenameFolderRequest.create = function create(properties) {
                return new RenameFolderRequest(properties);
            };

            /**
             * Encodes the specified RenameFolderRequest message. Does not implicitly {@link kritor.file.RenameFolderRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.file.RenameFolderRequest
             * @static
             * @param {kritor.file.IRenameFolderRequest} message RenameFolderRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            RenameFolderRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.groupId != null && Object.hasOwnProperty.call(message, "groupId"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.groupId);
                if (message.folderId != null && Object.hasOwnProperty.call(message, "folderId"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.folderId);
                if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.name);
                return writer;
            };

            /**
             * Encodes the specified RenameFolderRequest message, length delimited. Does not implicitly {@link kritor.file.RenameFolderRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.file.RenameFolderRequest
             * @static
             * @param {kritor.file.IRenameFolderRequest} message RenameFolderRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            RenameFolderRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a RenameFolderRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.file.RenameFolderRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.file.RenameFolderRequest} RenameFolderRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            RenameFolderRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.file.RenameFolderRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.groupId = reader.uint64();
                            break;
                        }
                    case 2: {
                            message.folderId = reader.string();
                            break;
                        }
                    case 3: {
                            message.name = reader.string();
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
             * Decodes a RenameFolderRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.file.RenameFolderRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.file.RenameFolderRequest} RenameFolderRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            RenameFolderRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a RenameFolderRequest message.
             * @function verify
             * @memberof kritor.file.RenameFolderRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            RenameFolderRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.groupId != null && message.hasOwnProperty("groupId"))
                    if (!$util.isInteger(message.groupId) && !(message.groupId && $util.isInteger(message.groupId.low) && $util.isInteger(message.groupId.high)))
                        return "groupId: integer|Long expected";
                if (message.folderId != null && message.hasOwnProperty("folderId"))
                    if (!$util.isString(message.folderId))
                        return "folderId: string expected";
                if (message.name != null && message.hasOwnProperty("name"))
                    if (!$util.isString(message.name))
                        return "name: string expected";
                return null;
            };

            /**
             * Creates a RenameFolderRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.file.RenameFolderRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.file.RenameFolderRequest} RenameFolderRequest
             */
            RenameFolderRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.file.RenameFolderRequest)
                    return object;
                let message = new $root.kritor.file.RenameFolderRequest();
                if (object.groupId != null)
                    if ($util.Long)
                        (message.groupId = $util.Long.fromValue(object.groupId)).unsigned = true;
                    else if (typeof object.groupId === "string")
                        message.groupId = parseInt(object.groupId, 10);
                    else if (typeof object.groupId === "number")
                        message.groupId = object.groupId;
                    else if (typeof object.groupId === "object")
                        message.groupId = new $util.LongBits(object.groupId.low >>> 0, object.groupId.high >>> 0).toNumber(true);
                if (object.folderId != null)
                    message.folderId = String(object.folderId);
                if (object.name != null)
                    message.name = String(object.name);
                return message;
            };

            /**
             * Creates a plain object from a RenameFolderRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.file.RenameFolderRequest
             * @static
             * @param {kritor.file.RenameFolderRequest} message RenameFolderRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            RenameFolderRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.groupId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.groupId = options.longs === String ? "0" : 0;
                    object.folderId = "";
                    object.name = "";
                }
                if (message.groupId != null && message.hasOwnProperty("groupId"))
                    if (typeof message.groupId === "number")
                        object.groupId = options.longs === String ? String(message.groupId) : message.groupId;
                    else
                        object.groupId = options.longs === String ? $util.Long.prototype.toString.call(message.groupId) : options.longs === Number ? new $util.LongBits(message.groupId.low >>> 0, message.groupId.high >>> 0).toNumber(true) : message.groupId;
                if (message.folderId != null && message.hasOwnProperty("folderId"))
                    object.folderId = message.folderId;
                if (message.name != null && message.hasOwnProperty("name"))
                    object.name = message.name;
                return object;
            };

            /**
             * Converts this RenameFolderRequest to JSON.
             * @function toJSON
             * @memberof kritor.file.RenameFolderRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            RenameFolderRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for RenameFolderRequest
             * @function getTypeUrl
             * @memberof kritor.file.RenameFolderRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            RenameFolderRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.file.RenameFolderRequest";
            };

            return RenameFolderRequest;
        })();

        file.RenameFolderResponse = (function() {

            /**
             * Properties of a RenameFolderResponse.
             * @memberof kritor.file
             * @interface IRenameFolderResponse
             */

            /**
             * Constructs a new RenameFolderResponse.
             * @memberof kritor.file
             * @classdesc Represents a RenameFolderResponse.
             * @implements IRenameFolderResponse
             * @constructor
             * @param {kritor.file.IRenameFolderResponse=} [properties] Properties to set
             */
            function RenameFolderResponse(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Creates a new RenameFolderResponse instance using the specified properties.
             * @function create
             * @memberof kritor.file.RenameFolderResponse
             * @static
             * @param {kritor.file.IRenameFolderResponse=} [properties] Properties to set
             * @returns {kritor.file.RenameFolderResponse} RenameFolderResponse instance
             */
            RenameFolderResponse.create = function create(properties) {
                return new RenameFolderResponse(properties);
            };

            /**
             * Encodes the specified RenameFolderResponse message. Does not implicitly {@link kritor.file.RenameFolderResponse.verify|verify} messages.
             * @function encode
             * @memberof kritor.file.RenameFolderResponse
             * @static
             * @param {kritor.file.IRenameFolderResponse} message RenameFolderResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            RenameFolderResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                return writer;
            };

            /**
             * Encodes the specified RenameFolderResponse message, length delimited. Does not implicitly {@link kritor.file.RenameFolderResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.file.RenameFolderResponse
             * @static
             * @param {kritor.file.IRenameFolderResponse} message RenameFolderResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            RenameFolderResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a RenameFolderResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.file.RenameFolderResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.file.RenameFolderResponse} RenameFolderResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            RenameFolderResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.file.RenameFolderResponse();
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
             * Decodes a RenameFolderResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.file.RenameFolderResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.file.RenameFolderResponse} RenameFolderResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            RenameFolderResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a RenameFolderResponse message.
             * @function verify
             * @memberof kritor.file.RenameFolderResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            RenameFolderResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                return null;
            };

            /**
             * Creates a RenameFolderResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.file.RenameFolderResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.file.RenameFolderResponse} RenameFolderResponse
             */
            RenameFolderResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.file.RenameFolderResponse)
                    return object;
                return new $root.kritor.file.RenameFolderResponse();
            };

            /**
             * Creates a plain object from a RenameFolderResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.file.RenameFolderResponse
             * @static
             * @param {kritor.file.RenameFolderResponse} message RenameFolderResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            RenameFolderResponse.toObject = function toObject() {
                return {};
            };

            /**
             * Converts this RenameFolderResponse to JSON.
             * @function toJSON
             * @memberof kritor.file.RenameFolderResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            RenameFolderResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for RenameFolderResponse
             * @function getTypeUrl
             * @memberof kritor.file.RenameFolderResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            RenameFolderResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.file.RenameFolderResponse";
            };

            return RenameFolderResponse;
        })();

        file.DeleteFolderRequest = (function() {

            /**
             * Properties of a DeleteFolderRequest.
             * @memberof kritor.file
             * @interface IDeleteFolderRequest
             * @property {number|Long|null} [groupId] DeleteFolderRequest groupId
             * @property {string|null} [folderId] DeleteFolderRequest folderId
             */

            /**
             * Constructs a new DeleteFolderRequest.
             * @memberof kritor.file
             * @classdesc Represents a DeleteFolderRequest.
             * @implements IDeleteFolderRequest
             * @constructor
             * @param {kritor.file.IDeleteFolderRequest=} [properties] Properties to set
             */
            function DeleteFolderRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * DeleteFolderRequest groupId.
             * @member {number|Long} groupId
             * @memberof kritor.file.DeleteFolderRequest
             * @instance
             */
            DeleteFolderRequest.prototype.groupId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * DeleteFolderRequest folderId.
             * @member {string} folderId
             * @memberof kritor.file.DeleteFolderRequest
             * @instance
             */
            DeleteFolderRequest.prototype.folderId = "";

            /**
             * Creates a new DeleteFolderRequest instance using the specified properties.
             * @function create
             * @memberof kritor.file.DeleteFolderRequest
             * @static
             * @param {kritor.file.IDeleteFolderRequest=} [properties] Properties to set
             * @returns {kritor.file.DeleteFolderRequest} DeleteFolderRequest instance
             */
            DeleteFolderRequest.create = function create(properties) {
                return new DeleteFolderRequest(properties);
            };

            /**
             * Encodes the specified DeleteFolderRequest message. Does not implicitly {@link kritor.file.DeleteFolderRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.file.DeleteFolderRequest
             * @static
             * @param {kritor.file.IDeleteFolderRequest} message DeleteFolderRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DeleteFolderRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.groupId != null && Object.hasOwnProperty.call(message, "groupId"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.groupId);
                if (message.folderId != null && Object.hasOwnProperty.call(message, "folderId"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.folderId);
                return writer;
            };

            /**
             * Encodes the specified DeleteFolderRequest message, length delimited. Does not implicitly {@link kritor.file.DeleteFolderRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.file.DeleteFolderRequest
             * @static
             * @param {kritor.file.IDeleteFolderRequest} message DeleteFolderRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DeleteFolderRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a DeleteFolderRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.file.DeleteFolderRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.file.DeleteFolderRequest} DeleteFolderRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DeleteFolderRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.file.DeleteFolderRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.groupId = reader.uint64();
                            break;
                        }
                    case 2: {
                            message.folderId = reader.string();
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
             * Decodes a DeleteFolderRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.file.DeleteFolderRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.file.DeleteFolderRequest} DeleteFolderRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DeleteFolderRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a DeleteFolderRequest message.
             * @function verify
             * @memberof kritor.file.DeleteFolderRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            DeleteFolderRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.groupId != null && message.hasOwnProperty("groupId"))
                    if (!$util.isInteger(message.groupId) && !(message.groupId && $util.isInteger(message.groupId.low) && $util.isInteger(message.groupId.high)))
                        return "groupId: integer|Long expected";
                if (message.folderId != null && message.hasOwnProperty("folderId"))
                    if (!$util.isString(message.folderId))
                        return "folderId: string expected";
                return null;
            };

            /**
             * Creates a DeleteFolderRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.file.DeleteFolderRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.file.DeleteFolderRequest} DeleteFolderRequest
             */
            DeleteFolderRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.file.DeleteFolderRequest)
                    return object;
                let message = new $root.kritor.file.DeleteFolderRequest();
                if (object.groupId != null)
                    if ($util.Long)
                        (message.groupId = $util.Long.fromValue(object.groupId)).unsigned = true;
                    else if (typeof object.groupId === "string")
                        message.groupId = parseInt(object.groupId, 10);
                    else if (typeof object.groupId === "number")
                        message.groupId = object.groupId;
                    else if (typeof object.groupId === "object")
                        message.groupId = new $util.LongBits(object.groupId.low >>> 0, object.groupId.high >>> 0).toNumber(true);
                if (object.folderId != null)
                    message.folderId = String(object.folderId);
                return message;
            };

            /**
             * Creates a plain object from a DeleteFolderRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.file.DeleteFolderRequest
             * @static
             * @param {kritor.file.DeleteFolderRequest} message DeleteFolderRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            DeleteFolderRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.groupId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.groupId = options.longs === String ? "0" : 0;
                    object.folderId = "";
                }
                if (message.groupId != null && message.hasOwnProperty("groupId"))
                    if (typeof message.groupId === "number")
                        object.groupId = options.longs === String ? String(message.groupId) : message.groupId;
                    else
                        object.groupId = options.longs === String ? $util.Long.prototype.toString.call(message.groupId) : options.longs === Number ? new $util.LongBits(message.groupId.low >>> 0, message.groupId.high >>> 0).toNumber(true) : message.groupId;
                if (message.folderId != null && message.hasOwnProperty("folderId"))
                    object.folderId = message.folderId;
                return object;
            };

            /**
             * Converts this DeleteFolderRequest to JSON.
             * @function toJSON
             * @memberof kritor.file.DeleteFolderRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            DeleteFolderRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for DeleteFolderRequest
             * @function getTypeUrl
             * @memberof kritor.file.DeleteFolderRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            DeleteFolderRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.file.DeleteFolderRequest";
            };

            return DeleteFolderRequest;
        })();

        file.DeleteFolderResponse = (function() {

            /**
             * Properties of a DeleteFolderResponse.
             * @memberof kritor.file
             * @interface IDeleteFolderResponse
             */

            /**
             * Constructs a new DeleteFolderResponse.
             * @memberof kritor.file
             * @classdesc Represents a DeleteFolderResponse.
             * @implements IDeleteFolderResponse
             * @constructor
             * @param {kritor.file.IDeleteFolderResponse=} [properties] Properties to set
             */
            function DeleteFolderResponse(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Creates a new DeleteFolderResponse instance using the specified properties.
             * @function create
             * @memberof kritor.file.DeleteFolderResponse
             * @static
             * @param {kritor.file.IDeleteFolderResponse=} [properties] Properties to set
             * @returns {kritor.file.DeleteFolderResponse} DeleteFolderResponse instance
             */
            DeleteFolderResponse.create = function create(properties) {
                return new DeleteFolderResponse(properties);
            };

            /**
             * Encodes the specified DeleteFolderResponse message. Does not implicitly {@link kritor.file.DeleteFolderResponse.verify|verify} messages.
             * @function encode
             * @memberof kritor.file.DeleteFolderResponse
             * @static
             * @param {kritor.file.IDeleteFolderResponse} message DeleteFolderResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DeleteFolderResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                return writer;
            };

            /**
             * Encodes the specified DeleteFolderResponse message, length delimited. Does not implicitly {@link kritor.file.DeleteFolderResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.file.DeleteFolderResponse
             * @static
             * @param {kritor.file.IDeleteFolderResponse} message DeleteFolderResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DeleteFolderResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a DeleteFolderResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.file.DeleteFolderResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.file.DeleteFolderResponse} DeleteFolderResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DeleteFolderResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.file.DeleteFolderResponse();
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
             * Decodes a DeleteFolderResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.file.DeleteFolderResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.file.DeleteFolderResponse} DeleteFolderResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DeleteFolderResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a DeleteFolderResponse message.
             * @function verify
             * @memberof kritor.file.DeleteFolderResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            DeleteFolderResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                return null;
            };

            /**
             * Creates a DeleteFolderResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.file.DeleteFolderResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.file.DeleteFolderResponse} DeleteFolderResponse
             */
            DeleteFolderResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.file.DeleteFolderResponse)
                    return object;
                return new $root.kritor.file.DeleteFolderResponse();
            };

            /**
             * Creates a plain object from a DeleteFolderResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.file.DeleteFolderResponse
             * @static
             * @param {kritor.file.DeleteFolderResponse} message DeleteFolderResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            DeleteFolderResponse.toObject = function toObject() {
                return {};
            };

            /**
             * Converts this DeleteFolderResponse to JSON.
             * @function toJSON
             * @memberof kritor.file.DeleteFolderResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            DeleteFolderResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for DeleteFolderResponse
             * @function getTypeUrl
             * @memberof kritor.file.DeleteFolderResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            DeleteFolderResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.file.DeleteFolderResponse";
            };

            return DeleteFolderResponse;
        })();

        file.UploadFileRequest = (function() {

            /**
             * Properties of an UploadFileRequest.
             * @memberof kritor.file
             * @interface IUploadFileRequest
             * @property {number|Long|null} [groupId] UploadFileRequest groupId
             * @property {Uint8Array|null} [file] UploadFileRequest file
             * @property {string|null} [fileName] UploadFileRequest fileName
             * @property {string|null} [filePath] UploadFileRequest filePath
             * @property {string|null} [fileUrl] UploadFileRequest fileUrl
             */

            /**
             * Constructs a new UploadFileRequest.
             * @memberof kritor.file
             * @classdesc Represents an UploadFileRequest.
             * @implements IUploadFileRequest
             * @constructor
             * @param {kritor.file.IUploadFileRequest=} [properties] Properties to set
             */
            function UploadFileRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * UploadFileRequest groupId.
             * @member {number|Long} groupId
             * @memberof kritor.file.UploadFileRequest
             * @instance
             */
            UploadFileRequest.prototype.groupId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * UploadFileRequest file.
             * @member {Uint8Array|null|undefined} file
             * @memberof kritor.file.UploadFileRequest
             * @instance
             */
            UploadFileRequest.prototype.file = null;

            /**
             * UploadFileRequest fileName.
             * @member {string|null|undefined} fileName
             * @memberof kritor.file.UploadFileRequest
             * @instance
             */
            UploadFileRequest.prototype.fileName = null;

            /**
             * UploadFileRequest filePath.
             * @member {string|null|undefined} filePath
             * @memberof kritor.file.UploadFileRequest
             * @instance
             */
            UploadFileRequest.prototype.filePath = null;

            /**
             * UploadFileRequest fileUrl.
             * @member {string|null|undefined} fileUrl
             * @memberof kritor.file.UploadFileRequest
             * @instance
             */
            UploadFileRequest.prototype.fileUrl = null;

            // OneOf field names bound to virtual getters and setters
            let $oneOfFields;

            /**
             * UploadFileRequest data.
             * @member {"file"|"fileName"|"filePath"|"fileUrl"|undefined} data
             * @memberof kritor.file.UploadFileRequest
             * @instance
             */
            Object.defineProperty(UploadFileRequest.prototype, "data", {
                get: $util.oneOfGetter($oneOfFields = ["file", "fileName", "filePath", "fileUrl"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new UploadFileRequest instance using the specified properties.
             * @function create
             * @memberof kritor.file.UploadFileRequest
             * @static
             * @param {kritor.file.IUploadFileRequest=} [properties] Properties to set
             * @returns {kritor.file.UploadFileRequest} UploadFileRequest instance
             */
            UploadFileRequest.create = function create(properties) {
                return new UploadFileRequest(properties);
            };

            /**
             * Encodes the specified UploadFileRequest message. Does not implicitly {@link kritor.file.UploadFileRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.file.UploadFileRequest
             * @static
             * @param {kritor.file.IUploadFileRequest} message UploadFileRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            UploadFileRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.groupId != null && Object.hasOwnProperty.call(message, "groupId"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.groupId);
                if (message.file != null && Object.hasOwnProperty.call(message, "file"))
                    writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.file);
                if (message.fileName != null && Object.hasOwnProperty.call(message, "fileName"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.fileName);
                if (message.filePath != null && Object.hasOwnProperty.call(message, "filePath"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.filePath);
                if (message.fileUrl != null && Object.hasOwnProperty.call(message, "fileUrl"))
                    writer.uint32(/* id 5, wireType 2 =*/42).string(message.fileUrl);
                return writer;
            };

            /**
             * Encodes the specified UploadFileRequest message, length delimited. Does not implicitly {@link kritor.file.UploadFileRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.file.UploadFileRequest
             * @static
             * @param {kritor.file.IUploadFileRequest} message UploadFileRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            UploadFileRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an UploadFileRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.file.UploadFileRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.file.UploadFileRequest} UploadFileRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            UploadFileRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.file.UploadFileRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.groupId = reader.uint64();
                            break;
                        }
                    case 2: {
                            message.file = reader.bytes();
                            break;
                        }
                    case 3: {
                            message.fileName = reader.string();
                            break;
                        }
                    case 4: {
                            message.filePath = reader.string();
                            break;
                        }
                    case 5: {
                            message.fileUrl = reader.string();
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
             * Decodes an UploadFileRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.file.UploadFileRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.file.UploadFileRequest} UploadFileRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            UploadFileRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an UploadFileRequest message.
             * @function verify
             * @memberof kritor.file.UploadFileRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            UploadFileRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                let properties = {};
                if (message.groupId != null && message.hasOwnProperty("groupId"))
                    if (!$util.isInteger(message.groupId) && !(message.groupId && $util.isInteger(message.groupId.low) && $util.isInteger(message.groupId.high)))
                        return "groupId: integer|Long expected";
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
                return null;
            };

            /**
             * Creates an UploadFileRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.file.UploadFileRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.file.UploadFileRequest} UploadFileRequest
             */
            UploadFileRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.file.UploadFileRequest)
                    return object;
                let message = new $root.kritor.file.UploadFileRequest();
                if (object.groupId != null)
                    if ($util.Long)
                        (message.groupId = $util.Long.fromValue(object.groupId)).unsigned = true;
                    else if (typeof object.groupId === "string")
                        message.groupId = parseInt(object.groupId, 10);
                    else if (typeof object.groupId === "number")
                        message.groupId = object.groupId;
                    else if (typeof object.groupId === "object")
                        message.groupId = new $util.LongBits(object.groupId.low >>> 0, object.groupId.high >>> 0).toNumber(true);
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
                return message;
            };

            /**
             * Creates a plain object from an UploadFileRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.file.UploadFileRequest
             * @static
             * @param {kritor.file.UploadFileRequest} message UploadFileRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            UploadFileRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults)
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.groupId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.groupId = options.longs === String ? "0" : 0;
                if (message.groupId != null && message.hasOwnProperty("groupId"))
                    if (typeof message.groupId === "number")
                        object.groupId = options.longs === String ? String(message.groupId) : message.groupId;
                    else
                        object.groupId = options.longs === String ? $util.Long.prototype.toString.call(message.groupId) : options.longs === Number ? new $util.LongBits(message.groupId.low >>> 0, message.groupId.high >>> 0).toNumber(true) : message.groupId;
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
                return object;
            };

            /**
             * Converts this UploadFileRequest to JSON.
             * @function toJSON
             * @memberof kritor.file.UploadFileRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            UploadFileRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for UploadFileRequest
             * @function getTypeUrl
             * @memberof kritor.file.UploadFileRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            UploadFileRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.file.UploadFileRequest";
            };

            return UploadFileRequest;
        })();

        file.UploadFileResponse = (function() {

            /**
             * Properties of an UploadFileResponse.
             * @memberof kritor.file
             * @interface IUploadFileResponse
             */

            /**
             * Constructs a new UploadFileResponse.
             * @memberof kritor.file
             * @classdesc Represents an UploadFileResponse.
             * @implements IUploadFileResponse
             * @constructor
             * @param {kritor.file.IUploadFileResponse=} [properties] Properties to set
             */
            function UploadFileResponse(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Creates a new UploadFileResponse instance using the specified properties.
             * @function create
             * @memberof kritor.file.UploadFileResponse
             * @static
             * @param {kritor.file.IUploadFileResponse=} [properties] Properties to set
             * @returns {kritor.file.UploadFileResponse} UploadFileResponse instance
             */
            UploadFileResponse.create = function create(properties) {
                return new UploadFileResponse(properties);
            };

            /**
             * Encodes the specified UploadFileResponse message. Does not implicitly {@link kritor.file.UploadFileResponse.verify|verify} messages.
             * @function encode
             * @memberof kritor.file.UploadFileResponse
             * @static
             * @param {kritor.file.IUploadFileResponse} message UploadFileResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            UploadFileResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                return writer;
            };

            /**
             * Encodes the specified UploadFileResponse message, length delimited. Does not implicitly {@link kritor.file.UploadFileResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.file.UploadFileResponse
             * @static
             * @param {kritor.file.IUploadFileResponse} message UploadFileResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            UploadFileResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an UploadFileResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.file.UploadFileResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.file.UploadFileResponse} UploadFileResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            UploadFileResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.file.UploadFileResponse();
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
             * Decodes an UploadFileResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.file.UploadFileResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.file.UploadFileResponse} UploadFileResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            UploadFileResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an UploadFileResponse message.
             * @function verify
             * @memberof kritor.file.UploadFileResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            UploadFileResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                return null;
            };

            /**
             * Creates an UploadFileResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.file.UploadFileResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.file.UploadFileResponse} UploadFileResponse
             */
            UploadFileResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.file.UploadFileResponse)
                    return object;
                return new $root.kritor.file.UploadFileResponse();
            };

            /**
             * Creates a plain object from an UploadFileResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.file.UploadFileResponse
             * @static
             * @param {kritor.file.UploadFileResponse} message UploadFileResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            UploadFileResponse.toObject = function toObject() {
                return {};
            };

            /**
             * Converts this UploadFileResponse to JSON.
             * @function toJSON
             * @memberof kritor.file.UploadFileResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            UploadFileResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for UploadFileResponse
             * @function getTypeUrl
             * @memberof kritor.file.UploadFileResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            UploadFileResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.file.UploadFileResponse";
            };

            return UploadFileResponse;
        })();

        file.DeleteFileRequest = (function() {

            /**
             * Properties of a DeleteFileRequest.
             * @memberof kritor.file
             * @interface IDeleteFileRequest
             * @property {number|Long|null} [groupId] DeleteFileRequest groupId
             * @property {string|null} [fileId] DeleteFileRequest fileId
             * @property {number|null} [busId] DeleteFileRequest busId
             */

            /**
             * Constructs a new DeleteFileRequest.
             * @memberof kritor.file
             * @classdesc Represents a DeleteFileRequest.
             * @implements IDeleteFileRequest
             * @constructor
             * @param {kritor.file.IDeleteFileRequest=} [properties] Properties to set
             */
            function DeleteFileRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * DeleteFileRequest groupId.
             * @member {number|Long} groupId
             * @memberof kritor.file.DeleteFileRequest
             * @instance
             */
            DeleteFileRequest.prototype.groupId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * DeleteFileRequest fileId.
             * @member {string} fileId
             * @memberof kritor.file.DeleteFileRequest
             * @instance
             */
            DeleteFileRequest.prototype.fileId = "";

            /**
             * DeleteFileRequest busId.
             * @member {number} busId
             * @memberof kritor.file.DeleteFileRequest
             * @instance
             */
            DeleteFileRequest.prototype.busId = 0;

            /**
             * Creates a new DeleteFileRequest instance using the specified properties.
             * @function create
             * @memberof kritor.file.DeleteFileRequest
             * @static
             * @param {kritor.file.IDeleteFileRequest=} [properties] Properties to set
             * @returns {kritor.file.DeleteFileRequest} DeleteFileRequest instance
             */
            DeleteFileRequest.create = function create(properties) {
                return new DeleteFileRequest(properties);
            };

            /**
             * Encodes the specified DeleteFileRequest message. Does not implicitly {@link kritor.file.DeleteFileRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.file.DeleteFileRequest
             * @static
             * @param {kritor.file.IDeleteFileRequest} message DeleteFileRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DeleteFileRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.groupId != null && Object.hasOwnProperty.call(message, "groupId"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.groupId);
                if (message.fileId != null && Object.hasOwnProperty.call(message, "fileId"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.fileId);
                if (message.busId != null && Object.hasOwnProperty.call(message, "busId"))
                    writer.uint32(/* id 3, wireType 0 =*/24).int32(message.busId);
                return writer;
            };

            /**
             * Encodes the specified DeleteFileRequest message, length delimited. Does not implicitly {@link kritor.file.DeleteFileRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.file.DeleteFileRequest
             * @static
             * @param {kritor.file.IDeleteFileRequest} message DeleteFileRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DeleteFileRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a DeleteFileRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.file.DeleteFileRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.file.DeleteFileRequest} DeleteFileRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DeleteFileRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.file.DeleteFileRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.groupId = reader.uint64();
                            break;
                        }
                    case 2: {
                            message.fileId = reader.string();
                            break;
                        }
                    case 3: {
                            message.busId = reader.int32();
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
             * Decodes a DeleteFileRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.file.DeleteFileRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.file.DeleteFileRequest} DeleteFileRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DeleteFileRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a DeleteFileRequest message.
             * @function verify
             * @memberof kritor.file.DeleteFileRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            DeleteFileRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.groupId != null && message.hasOwnProperty("groupId"))
                    if (!$util.isInteger(message.groupId) && !(message.groupId && $util.isInteger(message.groupId.low) && $util.isInteger(message.groupId.high)))
                        return "groupId: integer|Long expected";
                if (message.fileId != null && message.hasOwnProperty("fileId"))
                    if (!$util.isString(message.fileId))
                        return "fileId: string expected";
                if (message.busId != null && message.hasOwnProperty("busId"))
                    if (!$util.isInteger(message.busId))
                        return "busId: integer expected";
                return null;
            };

            /**
             * Creates a DeleteFileRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.file.DeleteFileRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.file.DeleteFileRequest} DeleteFileRequest
             */
            DeleteFileRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.file.DeleteFileRequest)
                    return object;
                let message = new $root.kritor.file.DeleteFileRequest();
                if (object.groupId != null)
                    if ($util.Long)
                        (message.groupId = $util.Long.fromValue(object.groupId)).unsigned = true;
                    else if (typeof object.groupId === "string")
                        message.groupId = parseInt(object.groupId, 10);
                    else if (typeof object.groupId === "number")
                        message.groupId = object.groupId;
                    else if (typeof object.groupId === "object")
                        message.groupId = new $util.LongBits(object.groupId.low >>> 0, object.groupId.high >>> 0).toNumber(true);
                if (object.fileId != null)
                    message.fileId = String(object.fileId);
                if (object.busId != null)
                    message.busId = object.busId | 0;
                return message;
            };

            /**
             * Creates a plain object from a DeleteFileRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.file.DeleteFileRequest
             * @static
             * @param {kritor.file.DeleteFileRequest} message DeleteFileRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            DeleteFileRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.groupId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.groupId = options.longs === String ? "0" : 0;
                    object.fileId = "";
                    object.busId = 0;
                }
                if (message.groupId != null && message.hasOwnProperty("groupId"))
                    if (typeof message.groupId === "number")
                        object.groupId = options.longs === String ? String(message.groupId) : message.groupId;
                    else
                        object.groupId = options.longs === String ? $util.Long.prototype.toString.call(message.groupId) : options.longs === Number ? new $util.LongBits(message.groupId.low >>> 0, message.groupId.high >>> 0).toNumber(true) : message.groupId;
                if (message.fileId != null && message.hasOwnProperty("fileId"))
                    object.fileId = message.fileId;
                if (message.busId != null && message.hasOwnProperty("busId"))
                    object.busId = message.busId;
                return object;
            };

            /**
             * Converts this DeleteFileRequest to JSON.
             * @function toJSON
             * @memberof kritor.file.DeleteFileRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            DeleteFileRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for DeleteFileRequest
             * @function getTypeUrl
             * @memberof kritor.file.DeleteFileRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            DeleteFileRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.file.DeleteFileRequest";
            };

            return DeleteFileRequest;
        })();

        file.DeleteFileResponse = (function() {

            /**
             * Properties of a DeleteFileResponse.
             * @memberof kritor.file
             * @interface IDeleteFileResponse
             */

            /**
             * Constructs a new DeleteFileResponse.
             * @memberof kritor.file
             * @classdesc Represents a DeleteFileResponse.
             * @implements IDeleteFileResponse
             * @constructor
             * @param {kritor.file.IDeleteFileResponse=} [properties] Properties to set
             */
            function DeleteFileResponse(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Creates a new DeleteFileResponse instance using the specified properties.
             * @function create
             * @memberof kritor.file.DeleteFileResponse
             * @static
             * @param {kritor.file.IDeleteFileResponse=} [properties] Properties to set
             * @returns {kritor.file.DeleteFileResponse} DeleteFileResponse instance
             */
            DeleteFileResponse.create = function create(properties) {
                return new DeleteFileResponse(properties);
            };

            /**
             * Encodes the specified DeleteFileResponse message. Does not implicitly {@link kritor.file.DeleteFileResponse.verify|verify} messages.
             * @function encode
             * @memberof kritor.file.DeleteFileResponse
             * @static
             * @param {kritor.file.IDeleteFileResponse} message DeleteFileResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DeleteFileResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                return writer;
            };

            /**
             * Encodes the specified DeleteFileResponse message, length delimited. Does not implicitly {@link kritor.file.DeleteFileResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.file.DeleteFileResponse
             * @static
             * @param {kritor.file.IDeleteFileResponse} message DeleteFileResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DeleteFileResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a DeleteFileResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.file.DeleteFileResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.file.DeleteFileResponse} DeleteFileResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DeleteFileResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.file.DeleteFileResponse();
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
             * Decodes a DeleteFileResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.file.DeleteFileResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.file.DeleteFileResponse} DeleteFileResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DeleteFileResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a DeleteFileResponse message.
             * @function verify
             * @memberof kritor.file.DeleteFileResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            DeleteFileResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                return null;
            };

            /**
             * Creates a DeleteFileResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.file.DeleteFileResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.file.DeleteFileResponse} DeleteFileResponse
             */
            DeleteFileResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.file.DeleteFileResponse)
                    return object;
                return new $root.kritor.file.DeleteFileResponse();
            };

            /**
             * Creates a plain object from a DeleteFileResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.file.DeleteFileResponse
             * @static
             * @param {kritor.file.DeleteFileResponse} message DeleteFileResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            DeleteFileResponse.toObject = function toObject() {
                return {};
            };

            /**
             * Converts this DeleteFileResponse to JSON.
             * @function toJSON
             * @memberof kritor.file.DeleteFileResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            DeleteFileResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for DeleteFileResponse
             * @function getTypeUrl
             * @memberof kritor.file.DeleteFileResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            DeleteFileResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.file.DeleteFileResponse";
            };

            return DeleteFileResponse;
        })();

        file.GetFileSystemInfoRequest = (function() {

            /**
             * Properties of a GetFileSystemInfoRequest.
             * @memberof kritor.file
             * @interface IGetFileSystemInfoRequest
             * @property {number|Long|null} [groupId] GetFileSystemInfoRequest groupId
             */

            /**
             * Constructs a new GetFileSystemInfoRequest.
             * @memberof kritor.file
             * @classdesc Represents a GetFileSystemInfoRequest.
             * @implements IGetFileSystemInfoRequest
             * @constructor
             * @param {kritor.file.IGetFileSystemInfoRequest=} [properties] Properties to set
             */
            function GetFileSystemInfoRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetFileSystemInfoRequest groupId.
             * @member {number|Long} groupId
             * @memberof kritor.file.GetFileSystemInfoRequest
             * @instance
             */
            GetFileSystemInfoRequest.prototype.groupId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * Creates a new GetFileSystemInfoRequest instance using the specified properties.
             * @function create
             * @memberof kritor.file.GetFileSystemInfoRequest
             * @static
             * @param {kritor.file.IGetFileSystemInfoRequest=} [properties] Properties to set
             * @returns {kritor.file.GetFileSystemInfoRequest} GetFileSystemInfoRequest instance
             */
            GetFileSystemInfoRequest.create = function create(properties) {
                return new GetFileSystemInfoRequest(properties);
            };

            /**
             * Encodes the specified GetFileSystemInfoRequest message. Does not implicitly {@link kritor.file.GetFileSystemInfoRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.file.GetFileSystemInfoRequest
             * @static
             * @param {kritor.file.IGetFileSystemInfoRequest} message GetFileSystemInfoRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetFileSystemInfoRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.groupId != null && Object.hasOwnProperty.call(message, "groupId"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.groupId);
                return writer;
            };

            /**
             * Encodes the specified GetFileSystemInfoRequest message, length delimited. Does not implicitly {@link kritor.file.GetFileSystemInfoRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.file.GetFileSystemInfoRequest
             * @static
             * @param {kritor.file.IGetFileSystemInfoRequest} message GetFileSystemInfoRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetFileSystemInfoRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetFileSystemInfoRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.file.GetFileSystemInfoRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.file.GetFileSystemInfoRequest} GetFileSystemInfoRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetFileSystemInfoRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.file.GetFileSystemInfoRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
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
             * Decodes a GetFileSystemInfoRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.file.GetFileSystemInfoRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.file.GetFileSystemInfoRequest} GetFileSystemInfoRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetFileSystemInfoRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetFileSystemInfoRequest message.
             * @function verify
             * @memberof kritor.file.GetFileSystemInfoRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetFileSystemInfoRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.groupId != null && message.hasOwnProperty("groupId"))
                    if (!$util.isInteger(message.groupId) && !(message.groupId && $util.isInteger(message.groupId.low) && $util.isInteger(message.groupId.high)))
                        return "groupId: integer|Long expected";
                return null;
            };

            /**
             * Creates a GetFileSystemInfoRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.file.GetFileSystemInfoRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.file.GetFileSystemInfoRequest} GetFileSystemInfoRequest
             */
            GetFileSystemInfoRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.file.GetFileSystemInfoRequest)
                    return object;
                let message = new $root.kritor.file.GetFileSystemInfoRequest();
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
             * Creates a plain object from a GetFileSystemInfoRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.file.GetFileSystemInfoRequest
             * @static
             * @param {kritor.file.GetFileSystemInfoRequest} message GetFileSystemInfoRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetFileSystemInfoRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults)
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.groupId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.groupId = options.longs === String ? "0" : 0;
                if (message.groupId != null && message.hasOwnProperty("groupId"))
                    if (typeof message.groupId === "number")
                        object.groupId = options.longs === String ? String(message.groupId) : message.groupId;
                    else
                        object.groupId = options.longs === String ? $util.Long.prototype.toString.call(message.groupId) : options.longs === Number ? new $util.LongBits(message.groupId.low >>> 0, message.groupId.high >>> 0).toNumber(true) : message.groupId;
                return object;
            };

            /**
             * Converts this GetFileSystemInfoRequest to JSON.
             * @function toJSON
             * @memberof kritor.file.GetFileSystemInfoRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetFileSystemInfoRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GetFileSystemInfoRequest
             * @function getTypeUrl
             * @memberof kritor.file.GetFileSystemInfoRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetFileSystemInfoRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.file.GetFileSystemInfoRequest";
            };

            return GetFileSystemInfoRequest;
        })();

        file.GetFileSystemInfoResponse = (function() {

            /**
             * Properties of a GetFileSystemInfoResponse.
             * @memberof kritor.file
             * @interface IGetFileSystemInfoResponse
             * @property {number|null} [fileCount] GetFileSystemInfoResponse fileCount
             * @property {number|null} [totalCount] GetFileSystemInfoResponse totalCount
             * @property {number|null} [usedSpace] GetFileSystemInfoResponse usedSpace
             * @property {number|null} [totalSpace] GetFileSystemInfoResponse totalSpace
             */

            /**
             * Constructs a new GetFileSystemInfoResponse.
             * @memberof kritor.file
             * @classdesc Represents a GetFileSystemInfoResponse.
             * @implements IGetFileSystemInfoResponse
             * @constructor
             * @param {kritor.file.IGetFileSystemInfoResponse=} [properties] Properties to set
             */
            function GetFileSystemInfoResponse(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetFileSystemInfoResponse fileCount.
             * @member {number} fileCount
             * @memberof kritor.file.GetFileSystemInfoResponse
             * @instance
             */
            GetFileSystemInfoResponse.prototype.fileCount = 0;

            /**
             * GetFileSystemInfoResponse totalCount.
             * @member {number} totalCount
             * @memberof kritor.file.GetFileSystemInfoResponse
             * @instance
             */
            GetFileSystemInfoResponse.prototype.totalCount = 0;

            /**
             * GetFileSystemInfoResponse usedSpace.
             * @member {number} usedSpace
             * @memberof kritor.file.GetFileSystemInfoResponse
             * @instance
             */
            GetFileSystemInfoResponse.prototype.usedSpace = 0;

            /**
             * GetFileSystemInfoResponse totalSpace.
             * @member {number} totalSpace
             * @memberof kritor.file.GetFileSystemInfoResponse
             * @instance
             */
            GetFileSystemInfoResponse.prototype.totalSpace = 0;

            /**
             * Creates a new GetFileSystemInfoResponse instance using the specified properties.
             * @function create
             * @memberof kritor.file.GetFileSystemInfoResponse
             * @static
             * @param {kritor.file.IGetFileSystemInfoResponse=} [properties] Properties to set
             * @returns {kritor.file.GetFileSystemInfoResponse} GetFileSystemInfoResponse instance
             */
            GetFileSystemInfoResponse.create = function create(properties) {
                return new GetFileSystemInfoResponse(properties);
            };

            /**
             * Encodes the specified GetFileSystemInfoResponse message. Does not implicitly {@link kritor.file.GetFileSystemInfoResponse.verify|verify} messages.
             * @function encode
             * @memberof kritor.file.GetFileSystemInfoResponse
             * @static
             * @param {kritor.file.IGetFileSystemInfoResponse} message GetFileSystemInfoResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetFileSystemInfoResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.fileCount != null && Object.hasOwnProperty.call(message, "fileCount"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.fileCount);
                if (message.totalCount != null && Object.hasOwnProperty.call(message, "totalCount"))
                    writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.totalCount);
                if (message.usedSpace != null && Object.hasOwnProperty.call(message, "usedSpace"))
                    writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.usedSpace);
                if (message.totalSpace != null && Object.hasOwnProperty.call(message, "totalSpace"))
                    writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.totalSpace);
                return writer;
            };

            /**
             * Encodes the specified GetFileSystemInfoResponse message, length delimited. Does not implicitly {@link kritor.file.GetFileSystemInfoResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.file.GetFileSystemInfoResponse
             * @static
             * @param {kritor.file.IGetFileSystemInfoResponse} message GetFileSystemInfoResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetFileSystemInfoResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetFileSystemInfoResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.file.GetFileSystemInfoResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.file.GetFileSystemInfoResponse} GetFileSystemInfoResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetFileSystemInfoResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.file.GetFileSystemInfoResponse();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.fileCount = reader.uint32();
                            break;
                        }
                    case 2: {
                            message.totalCount = reader.uint32();
                            break;
                        }
                    case 3: {
                            message.usedSpace = reader.uint32();
                            break;
                        }
                    case 4: {
                            message.totalSpace = reader.uint32();
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
             * Decodes a GetFileSystemInfoResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.file.GetFileSystemInfoResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.file.GetFileSystemInfoResponse} GetFileSystemInfoResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetFileSystemInfoResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetFileSystemInfoResponse message.
             * @function verify
             * @memberof kritor.file.GetFileSystemInfoResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetFileSystemInfoResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.fileCount != null && message.hasOwnProperty("fileCount"))
                    if (!$util.isInteger(message.fileCount))
                        return "fileCount: integer expected";
                if (message.totalCount != null && message.hasOwnProperty("totalCount"))
                    if (!$util.isInteger(message.totalCount))
                        return "totalCount: integer expected";
                if (message.usedSpace != null && message.hasOwnProperty("usedSpace"))
                    if (!$util.isInteger(message.usedSpace))
                        return "usedSpace: integer expected";
                if (message.totalSpace != null && message.hasOwnProperty("totalSpace"))
                    if (!$util.isInteger(message.totalSpace))
                        return "totalSpace: integer expected";
                return null;
            };

            /**
             * Creates a GetFileSystemInfoResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.file.GetFileSystemInfoResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.file.GetFileSystemInfoResponse} GetFileSystemInfoResponse
             */
            GetFileSystemInfoResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.file.GetFileSystemInfoResponse)
                    return object;
                let message = new $root.kritor.file.GetFileSystemInfoResponse();
                if (object.fileCount != null)
                    message.fileCount = object.fileCount >>> 0;
                if (object.totalCount != null)
                    message.totalCount = object.totalCount >>> 0;
                if (object.usedSpace != null)
                    message.usedSpace = object.usedSpace >>> 0;
                if (object.totalSpace != null)
                    message.totalSpace = object.totalSpace >>> 0;
                return message;
            };

            /**
             * Creates a plain object from a GetFileSystemInfoResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.file.GetFileSystemInfoResponse
             * @static
             * @param {kritor.file.GetFileSystemInfoResponse} message GetFileSystemInfoResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetFileSystemInfoResponse.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.fileCount = 0;
                    object.totalCount = 0;
                    object.usedSpace = 0;
                    object.totalSpace = 0;
                }
                if (message.fileCount != null && message.hasOwnProperty("fileCount"))
                    object.fileCount = message.fileCount;
                if (message.totalCount != null && message.hasOwnProperty("totalCount"))
                    object.totalCount = message.totalCount;
                if (message.usedSpace != null && message.hasOwnProperty("usedSpace"))
                    object.usedSpace = message.usedSpace;
                if (message.totalSpace != null && message.hasOwnProperty("totalSpace"))
                    object.totalSpace = message.totalSpace;
                return object;
            };

            /**
             * Converts this GetFileSystemInfoResponse to JSON.
             * @function toJSON
             * @memberof kritor.file.GetFileSystemInfoResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetFileSystemInfoResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GetFileSystemInfoResponse
             * @function getTypeUrl
             * @memberof kritor.file.GetFileSystemInfoResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetFileSystemInfoResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.file.GetFileSystemInfoResponse";
            };

            return GetFileSystemInfoResponse;
        })();

        file.GetFileListRequest = (function() {

            /**
             * Properties of a GetFileListRequest.
             * @memberof kritor.file
             * @interface IGetFileListRequest
             * @property {number|Long|null} [groupId] GetFileListRequest groupId
             * @property {string|null} [folderId] GetFileListRequest folderId
             */

            /**
             * Constructs a new GetFileListRequest.
             * @memberof kritor.file
             * @classdesc Represents a GetFileListRequest.
             * @implements IGetFileListRequest
             * @constructor
             * @param {kritor.file.IGetFileListRequest=} [properties] Properties to set
             */
            function GetFileListRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetFileListRequest groupId.
             * @member {number|Long} groupId
             * @memberof kritor.file.GetFileListRequest
             * @instance
             */
            GetFileListRequest.prototype.groupId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * GetFileListRequest folderId.
             * @member {string|null|undefined} folderId
             * @memberof kritor.file.GetFileListRequest
             * @instance
             */
            GetFileListRequest.prototype.folderId = null;

            // OneOf field names bound to virtual getters and setters
            let $oneOfFields;

            /**
             * GetFileListRequest _folderId.
             * @member {"folderId"|undefined} _folderId
             * @memberof kritor.file.GetFileListRequest
             * @instance
             */
            Object.defineProperty(GetFileListRequest.prototype, "_folderId", {
                get: $util.oneOfGetter($oneOfFields = ["folderId"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new GetFileListRequest instance using the specified properties.
             * @function create
             * @memberof kritor.file.GetFileListRequest
             * @static
             * @param {kritor.file.IGetFileListRequest=} [properties] Properties to set
             * @returns {kritor.file.GetFileListRequest} GetFileListRequest instance
             */
            GetFileListRequest.create = function create(properties) {
                return new GetFileListRequest(properties);
            };

            /**
             * Encodes the specified GetFileListRequest message. Does not implicitly {@link kritor.file.GetFileListRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.file.GetFileListRequest
             * @static
             * @param {kritor.file.IGetFileListRequest} message GetFileListRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetFileListRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.groupId != null && Object.hasOwnProperty.call(message, "groupId"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.groupId);
                if (message.folderId != null && Object.hasOwnProperty.call(message, "folderId"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.folderId);
                return writer;
            };

            /**
             * Encodes the specified GetFileListRequest message, length delimited. Does not implicitly {@link kritor.file.GetFileListRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.file.GetFileListRequest
             * @static
             * @param {kritor.file.IGetFileListRequest} message GetFileListRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetFileListRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetFileListRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.file.GetFileListRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.file.GetFileListRequest} GetFileListRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetFileListRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.file.GetFileListRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.groupId = reader.uint64();
                            break;
                        }
                    case 2: {
                            message.folderId = reader.string();
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
             * Decodes a GetFileListRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.file.GetFileListRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.file.GetFileListRequest} GetFileListRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetFileListRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetFileListRequest message.
             * @function verify
             * @memberof kritor.file.GetFileListRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetFileListRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                let properties = {};
                if (message.groupId != null && message.hasOwnProperty("groupId"))
                    if (!$util.isInteger(message.groupId) && !(message.groupId && $util.isInteger(message.groupId.low) && $util.isInteger(message.groupId.high)))
                        return "groupId: integer|Long expected";
                if (message.folderId != null && message.hasOwnProperty("folderId")) {
                    properties._folderId = 1;
                    if (!$util.isString(message.folderId))
                        return "folderId: string expected";
                }
                return null;
            };

            /**
             * Creates a GetFileListRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.file.GetFileListRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.file.GetFileListRequest} GetFileListRequest
             */
            GetFileListRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.file.GetFileListRequest)
                    return object;
                let message = new $root.kritor.file.GetFileListRequest();
                if (object.groupId != null)
                    if ($util.Long)
                        (message.groupId = $util.Long.fromValue(object.groupId)).unsigned = true;
                    else if (typeof object.groupId === "string")
                        message.groupId = parseInt(object.groupId, 10);
                    else if (typeof object.groupId === "number")
                        message.groupId = object.groupId;
                    else if (typeof object.groupId === "object")
                        message.groupId = new $util.LongBits(object.groupId.low >>> 0, object.groupId.high >>> 0).toNumber(true);
                if (object.folderId != null)
                    message.folderId = String(object.folderId);
                return message;
            };

            /**
             * Creates a plain object from a GetFileListRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.file.GetFileListRequest
             * @static
             * @param {kritor.file.GetFileListRequest} message GetFileListRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetFileListRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults)
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.groupId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.groupId = options.longs === String ? "0" : 0;
                if (message.groupId != null && message.hasOwnProperty("groupId"))
                    if (typeof message.groupId === "number")
                        object.groupId = options.longs === String ? String(message.groupId) : message.groupId;
                    else
                        object.groupId = options.longs === String ? $util.Long.prototype.toString.call(message.groupId) : options.longs === Number ? new $util.LongBits(message.groupId.low >>> 0, message.groupId.high >>> 0).toNumber(true) : message.groupId;
                if (message.folderId != null && message.hasOwnProperty("folderId")) {
                    object.folderId = message.folderId;
                    if (options.oneofs)
                        object._folderId = "folderId";
                }
                return object;
            };

            /**
             * Converts this GetFileListRequest to JSON.
             * @function toJSON
             * @memberof kritor.file.GetFileListRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetFileListRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GetFileListRequest
             * @function getTypeUrl
             * @memberof kritor.file.GetFileListRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetFileListRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.file.GetFileListRequest";
            };

            return GetFileListRequest;
        })();

        file.GetFileListResponse = (function() {

            /**
             * Properties of a GetFileListResponse.
             * @memberof kritor.file
             * @interface IGetFileListResponse
             * @property {Array.<kritor.file.IFile>|null} [files] GetFileListResponse files
             * @property {Array.<kritor.file.IFolder>|null} [folders] GetFileListResponse folders
             */

            /**
             * Constructs a new GetFileListResponse.
             * @memberof kritor.file
             * @classdesc Represents a GetFileListResponse.
             * @implements IGetFileListResponse
             * @constructor
             * @param {kritor.file.IGetFileListResponse=} [properties] Properties to set
             */
            function GetFileListResponse(properties) {
                this.files = [];
                this.folders = [];
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetFileListResponse files.
             * @member {Array.<kritor.file.IFile>} files
             * @memberof kritor.file.GetFileListResponse
             * @instance
             */
            GetFileListResponse.prototype.files = $util.emptyArray;

            /**
             * GetFileListResponse folders.
             * @member {Array.<kritor.file.IFolder>} folders
             * @memberof kritor.file.GetFileListResponse
             * @instance
             */
            GetFileListResponse.prototype.folders = $util.emptyArray;

            /**
             * Creates a new GetFileListResponse instance using the specified properties.
             * @function create
             * @memberof kritor.file.GetFileListResponse
             * @static
             * @param {kritor.file.IGetFileListResponse=} [properties] Properties to set
             * @returns {kritor.file.GetFileListResponse} GetFileListResponse instance
             */
            GetFileListResponse.create = function create(properties) {
                return new GetFileListResponse(properties);
            };

            /**
             * Encodes the specified GetFileListResponse message. Does not implicitly {@link kritor.file.GetFileListResponse.verify|verify} messages.
             * @function encode
             * @memberof kritor.file.GetFileListResponse
             * @static
             * @param {kritor.file.IGetFileListResponse} message GetFileListResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetFileListResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.files != null && message.files.length)
                    for (let i = 0; i < message.files.length; ++i)
                        $root.kritor.file.File.encode(message.files[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                if (message.folders != null && message.folders.length)
                    for (let i = 0; i < message.folders.length; ++i)
                        $root.kritor.file.Folder.encode(message.folders[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified GetFileListResponse message, length delimited. Does not implicitly {@link kritor.file.GetFileListResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.file.GetFileListResponse
             * @static
             * @param {kritor.file.IGetFileListResponse} message GetFileListResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetFileListResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetFileListResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.file.GetFileListResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.file.GetFileListResponse} GetFileListResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetFileListResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.file.GetFileListResponse();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            if (!(message.files && message.files.length))
                                message.files = [];
                            message.files.push($root.kritor.file.File.decode(reader, reader.uint32()));
                            break;
                        }
                    case 2: {
                            if (!(message.folders && message.folders.length))
                                message.folders = [];
                            message.folders.push($root.kritor.file.Folder.decode(reader, reader.uint32()));
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
             * Decodes a GetFileListResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.file.GetFileListResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.file.GetFileListResponse} GetFileListResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetFileListResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetFileListResponse message.
             * @function verify
             * @memberof kritor.file.GetFileListResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetFileListResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.files != null && message.hasOwnProperty("files")) {
                    if (!Array.isArray(message.files))
                        return "files: array expected";
                    for (let i = 0; i < message.files.length; ++i) {
                        let error = $root.kritor.file.File.verify(message.files[i]);
                        if (error)
                            return "files." + error;
                    }
                }
                if (message.folders != null && message.hasOwnProperty("folders")) {
                    if (!Array.isArray(message.folders))
                        return "folders: array expected";
                    for (let i = 0; i < message.folders.length; ++i) {
                        let error = $root.kritor.file.Folder.verify(message.folders[i]);
                        if (error)
                            return "folders." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a GetFileListResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.file.GetFileListResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.file.GetFileListResponse} GetFileListResponse
             */
            GetFileListResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.file.GetFileListResponse)
                    return object;
                let message = new $root.kritor.file.GetFileListResponse();
                if (object.files) {
                    if (!Array.isArray(object.files))
                        throw TypeError(".kritor.file.GetFileListResponse.files: array expected");
                    message.files = [];
                    for (let i = 0; i < object.files.length; ++i) {
                        if (typeof object.files[i] !== "object")
                            throw TypeError(".kritor.file.GetFileListResponse.files: object expected");
                        message.files[i] = $root.kritor.file.File.fromObject(object.files[i]);
                    }
                }
                if (object.folders) {
                    if (!Array.isArray(object.folders))
                        throw TypeError(".kritor.file.GetFileListResponse.folders: array expected");
                    message.folders = [];
                    for (let i = 0; i < object.folders.length; ++i) {
                        if (typeof object.folders[i] !== "object")
                            throw TypeError(".kritor.file.GetFileListResponse.folders: object expected");
                        message.folders[i] = $root.kritor.file.Folder.fromObject(object.folders[i]);
                    }
                }
                return message;
            };

            /**
             * Creates a plain object from a GetFileListResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.file.GetFileListResponse
             * @static
             * @param {kritor.file.GetFileListResponse} message GetFileListResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetFileListResponse.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.arrays || options.defaults) {
                    object.files = [];
                    object.folders = [];
                }
                if (message.files && message.files.length) {
                    object.files = [];
                    for (let j = 0; j < message.files.length; ++j)
                        object.files[j] = $root.kritor.file.File.toObject(message.files[j], options);
                }
                if (message.folders && message.folders.length) {
                    object.folders = [];
                    for (let j = 0; j < message.folders.length; ++j)
                        object.folders[j] = $root.kritor.file.Folder.toObject(message.folders[j], options);
                }
                return object;
            };

            /**
             * Converts this GetFileListResponse to JSON.
             * @function toJSON
             * @memberof kritor.file.GetFileListResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetFileListResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GetFileListResponse
             * @function getTypeUrl
             * @memberof kritor.file.GetFileListResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetFileListResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.file.GetFileListResponse";
            };

            return GetFileListResponse;
        })();

        file.File = (function() {

            /**
             * Properties of a File.
             * @memberof kritor.file
             * @interface IFile
             * @property {string|null} [fileId] File fileId
             * @property {string|null} [fileName] File fileName
             * @property {number|Long|null} [fileSize] File fileSize
             * @property {number|null} [busId] File busId
             * @property {number|null} [uploadTime] File uploadTime
             * @property {number|null} [deadTime] File deadTime
             * @property {number|null} [modifyTime] File modifyTime
             * @property {number|null} [downloadTimes] File downloadTimes
             * @property {number|Long|null} [uploader] File uploader
             * @property {string|null} [uploaderName] File uploaderName
             * @property {string|null} [sha] File sha
             * @property {string|null} [sha3] File sha3
             * @property {string|null} [md5] File md5
             */

            /**
             * Constructs a new File.
             * @memberof kritor.file
             * @classdesc Represents a File.
             * @implements IFile
             * @constructor
             * @param {kritor.file.IFile=} [properties] Properties to set
             */
            function File(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * File fileId.
             * @member {string} fileId
             * @memberof kritor.file.File
             * @instance
             */
            File.prototype.fileId = "";

            /**
             * File fileName.
             * @member {string} fileName
             * @memberof kritor.file.File
             * @instance
             */
            File.prototype.fileName = "";

            /**
             * File fileSize.
             * @member {number|Long} fileSize
             * @memberof kritor.file.File
             * @instance
             */
            File.prototype.fileSize = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * File busId.
             * @member {number} busId
             * @memberof kritor.file.File
             * @instance
             */
            File.prototype.busId = 0;

            /**
             * File uploadTime.
             * @member {number} uploadTime
             * @memberof kritor.file.File
             * @instance
             */
            File.prototype.uploadTime = 0;

            /**
             * File deadTime.
             * @member {number} deadTime
             * @memberof kritor.file.File
             * @instance
             */
            File.prototype.deadTime = 0;

            /**
             * File modifyTime.
             * @member {number} modifyTime
             * @memberof kritor.file.File
             * @instance
             */
            File.prototype.modifyTime = 0;

            /**
             * File downloadTimes.
             * @member {number} downloadTimes
             * @memberof kritor.file.File
             * @instance
             */
            File.prototype.downloadTimes = 0;

            /**
             * File uploader.
             * @member {number|Long} uploader
             * @memberof kritor.file.File
             * @instance
             */
            File.prototype.uploader = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * File uploaderName.
             * @member {string} uploaderName
             * @memberof kritor.file.File
             * @instance
             */
            File.prototype.uploaderName = "";

            /**
             * File sha.
             * @member {string} sha
             * @memberof kritor.file.File
             * @instance
             */
            File.prototype.sha = "";

            /**
             * File sha3.
             * @member {string} sha3
             * @memberof kritor.file.File
             * @instance
             */
            File.prototype.sha3 = "";

            /**
             * File md5.
             * @member {string} md5
             * @memberof kritor.file.File
             * @instance
             */
            File.prototype.md5 = "";

            /**
             * Creates a new File instance using the specified properties.
             * @function create
             * @memberof kritor.file.File
             * @static
             * @param {kritor.file.IFile=} [properties] Properties to set
             * @returns {kritor.file.File} File instance
             */
            File.create = function create(properties) {
                return new File(properties);
            };

            /**
             * Encodes the specified File message. Does not implicitly {@link kritor.file.File.verify|verify} messages.
             * @function encode
             * @memberof kritor.file.File
             * @static
             * @param {kritor.file.IFile} message File message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            File.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.fileId != null && Object.hasOwnProperty.call(message, "fileId"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.fileId);
                if (message.fileName != null && Object.hasOwnProperty.call(message, "fileName"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.fileName);
                if (message.fileSize != null && Object.hasOwnProperty.call(message, "fileSize"))
                    writer.uint32(/* id 3, wireType 0 =*/24).uint64(message.fileSize);
                if (message.busId != null && Object.hasOwnProperty.call(message, "busId"))
                    writer.uint32(/* id 4, wireType 0 =*/32).int32(message.busId);
                if (message.uploadTime != null && Object.hasOwnProperty.call(message, "uploadTime"))
                    writer.uint32(/* id 5, wireType 0 =*/40).uint32(message.uploadTime);
                if (message.deadTime != null && Object.hasOwnProperty.call(message, "deadTime"))
                    writer.uint32(/* id 6, wireType 0 =*/48).uint32(message.deadTime);
                if (message.modifyTime != null && Object.hasOwnProperty.call(message, "modifyTime"))
                    writer.uint32(/* id 7, wireType 0 =*/56).uint32(message.modifyTime);
                if (message.downloadTimes != null && Object.hasOwnProperty.call(message, "downloadTimes"))
                    writer.uint32(/* id 8, wireType 0 =*/64).uint32(message.downloadTimes);
                if (message.uploader != null && Object.hasOwnProperty.call(message, "uploader"))
                    writer.uint32(/* id 9, wireType 0 =*/72).uint64(message.uploader);
                if (message.uploaderName != null && Object.hasOwnProperty.call(message, "uploaderName"))
                    writer.uint32(/* id 10, wireType 2 =*/82).string(message.uploaderName);
                if (message.sha != null && Object.hasOwnProperty.call(message, "sha"))
                    writer.uint32(/* id 11, wireType 2 =*/90).string(message.sha);
                if (message.sha3 != null && Object.hasOwnProperty.call(message, "sha3"))
                    writer.uint32(/* id 12, wireType 2 =*/98).string(message.sha3);
                if (message.md5 != null && Object.hasOwnProperty.call(message, "md5"))
                    writer.uint32(/* id 13, wireType 2 =*/106).string(message.md5);
                return writer;
            };

            /**
             * Encodes the specified File message, length delimited. Does not implicitly {@link kritor.file.File.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.file.File
             * @static
             * @param {kritor.file.IFile} message File message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            File.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a File message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.file.File
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.file.File} File
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            File.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.file.File();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.fileId = reader.string();
                            break;
                        }
                    case 2: {
                            message.fileName = reader.string();
                            break;
                        }
                    case 3: {
                            message.fileSize = reader.uint64();
                            break;
                        }
                    case 4: {
                            message.busId = reader.int32();
                            break;
                        }
                    case 5: {
                            message.uploadTime = reader.uint32();
                            break;
                        }
                    case 6: {
                            message.deadTime = reader.uint32();
                            break;
                        }
                    case 7: {
                            message.modifyTime = reader.uint32();
                            break;
                        }
                    case 8: {
                            message.downloadTimes = reader.uint32();
                            break;
                        }
                    case 9: {
                            message.uploader = reader.uint64();
                            break;
                        }
                    case 10: {
                            message.uploaderName = reader.string();
                            break;
                        }
                    case 11: {
                            message.sha = reader.string();
                            break;
                        }
                    case 12: {
                            message.sha3 = reader.string();
                            break;
                        }
                    case 13: {
                            message.md5 = reader.string();
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
             * Decodes a File message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.file.File
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.file.File} File
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            File.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a File message.
             * @function verify
             * @memberof kritor.file.File
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            File.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.fileId != null && message.hasOwnProperty("fileId"))
                    if (!$util.isString(message.fileId))
                        return "fileId: string expected";
                if (message.fileName != null && message.hasOwnProperty("fileName"))
                    if (!$util.isString(message.fileName))
                        return "fileName: string expected";
                if (message.fileSize != null && message.hasOwnProperty("fileSize"))
                    if (!$util.isInteger(message.fileSize) && !(message.fileSize && $util.isInteger(message.fileSize.low) && $util.isInteger(message.fileSize.high)))
                        return "fileSize: integer|Long expected";
                if (message.busId != null && message.hasOwnProperty("busId"))
                    if (!$util.isInteger(message.busId))
                        return "busId: integer expected";
                if (message.uploadTime != null && message.hasOwnProperty("uploadTime"))
                    if (!$util.isInteger(message.uploadTime))
                        return "uploadTime: integer expected";
                if (message.deadTime != null && message.hasOwnProperty("deadTime"))
                    if (!$util.isInteger(message.deadTime))
                        return "deadTime: integer expected";
                if (message.modifyTime != null && message.hasOwnProperty("modifyTime"))
                    if (!$util.isInteger(message.modifyTime))
                        return "modifyTime: integer expected";
                if (message.downloadTimes != null && message.hasOwnProperty("downloadTimes"))
                    if (!$util.isInteger(message.downloadTimes))
                        return "downloadTimes: integer expected";
                if (message.uploader != null && message.hasOwnProperty("uploader"))
                    if (!$util.isInteger(message.uploader) && !(message.uploader && $util.isInteger(message.uploader.low) && $util.isInteger(message.uploader.high)))
                        return "uploader: integer|Long expected";
                if (message.uploaderName != null && message.hasOwnProperty("uploaderName"))
                    if (!$util.isString(message.uploaderName))
                        return "uploaderName: string expected";
                if (message.sha != null && message.hasOwnProperty("sha"))
                    if (!$util.isString(message.sha))
                        return "sha: string expected";
                if (message.sha3 != null && message.hasOwnProperty("sha3"))
                    if (!$util.isString(message.sha3))
                        return "sha3: string expected";
                if (message.md5 != null && message.hasOwnProperty("md5"))
                    if (!$util.isString(message.md5))
                        return "md5: string expected";
                return null;
            };

            /**
             * Creates a File message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.file.File
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.file.File} File
             */
            File.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.file.File)
                    return object;
                let message = new $root.kritor.file.File();
                if (object.fileId != null)
                    message.fileId = String(object.fileId);
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
                if (object.busId != null)
                    message.busId = object.busId | 0;
                if (object.uploadTime != null)
                    message.uploadTime = object.uploadTime >>> 0;
                if (object.deadTime != null)
                    message.deadTime = object.deadTime >>> 0;
                if (object.modifyTime != null)
                    message.modifyTime = object.modifyTime >>> 0;
                if (object.downloadTimes != null)
                    message.downloadTimes = object.downloadTimes >>> 0;
                if (object.uploader != null)
                    if ($util.Long)
                        (message.uploader = $util.Long.fromValue(object.uploader)).unsigned = true;
                    else if (typeof object.uploader === "string")
                        message.uploader = parseInt(object.uploader, 10);
                    else if (typeof object.uploader === "number")
                        message.uploader = object.uploader;
                    else if (typeof object.uploader === "object")
                        message.uploader = new $util.LongBits(object.uploader.low >>> 0, object.uploader.high >>> 0).toNumber(true);
                if (object.uploaderName != null)
                    message.uploaderName = String(object.uploaderName);
                if (object.sha != null)
                    message.sha = String(object.sha);
                if (object.sha3 != null)
                    message.sha3 = String(object.sha3);
                if (object.md5 != null)
                    message.md5 = String(object.md5);
                return message;
            };

            /**
             * Creates a plain object from a File message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.file.File
             * @static
             * @param {kritor.file.File} message File
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            File.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.fileId = "";
                    object.fileName = "";
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.fileSize = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.fileSize = options.longs === String ? "0" : 0;
                    object.busId = 0;
                    object.uploadTime = 0;
                    object.deadTime = 0;
                    object.modifyTime = 0;
                    object.downloadTimes = 0;
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.uploader = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.uploader = options.longs === String ? "0" : 0;
                    object.uploaderName = "";
                    object.sha = "";
                    object.sha3 = "";
                    object.md5 = "";
                }
                if (message.fileId != null && message.hasOwnProperty("fileId"))
                    object.fileId = message.fileId;
                if (message.fileName != null && message.hasOwnProperty("fileName"))
                    object.fileName = message.fileName;
                if (message.fileSize != null && message.hasOwnProperty("fileSize"))
                    if (typeof message.fileSize === "number")
                        object.fileSize = options.longs === String ? String(message.fileSize) : message.fileSize;
                    else
                        object.fileSize = options.longs === String ? $util.Long.prototype.toString.call(message.fileSize) : options.longs === Number ? new $util.LongBits(message.fileSize.low >>> 0, message.fileSize.high >>> 0).toNumber(true) : message.fileSize;
                if (message.busId != null && message.hasOwnProperty("busId"))
                    object.busId = message.busId;
                if (message.uploadTime != null && message.hasOwnProperty("uploadTime"))
                    object.uploadTime = message.uploadTime;
                if (message.deadTime != null && message.hasOwnProperty("deadTime"))
                    object.deadTime = message.deadTime;
                if (message.modifyTime != null && message.hasOwnProperty("modifyTime"))
                    object.modifyTime = message.modifyTime;
                if (message.downloadTimes != null && message.hasOwnProperty("downloadTimes"))
                    object.downloadTimes = message.downloadTimes;
                if (message.uploader != null && message.hasOwnProperty("uploader"))
                    if (typeof message.uploader === "number")
                        object.uploader = options.longs === String ? String(message.uploader) : message.uploader;
                    else
                        object.uploader = options.longs === String ? $util.Long.prototype.toString.call(message.uploader) : options.longs === Number ? new $util.LongBits(message.uploader.low >>> 0, message.uploader.high >>> 0).toNumber(true) : message.uploader;
                if (message.uploaderName != null && message.hasOwnProperty("uploaderName"))
                    object.uploaderName = message.uploaderName;
                if (message.sha != null && message.hasOwnProperty("sha"))
                    object.sha = message.sha;
                if (message.sha3 != null && message.hasOwnProperty("sha3"))
                    object.sha3 = message.sha3;
                if (message.md5 != null && message.hasOwnProperty("md5"))
                    object.md5 = message.md5;
                return object;
            };

            /**
             * Converts this File to JSON.
             * @function toJSON
             * @memberof kritor.file.File
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            File.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for File
             * @function getTypeUrl
             * @memberof kritor.file.File
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            File.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.file.File";
            };

            return File;
        })();

        file.Folder = (function() {

            /**
             * Properties of a Folder.
             * @memberof kritor.file
             * @interface IFolder
             * @property {string|null} [folderId] Folder folderId
             * @property {string|null} [folderName] Folder folderName
             * @property {number|null} [totalFileCount] Folder totalFileCount
             * @property {number|null} [createTime] Folder createTime
             * @property {number|Long|null} [creator] Folder creator
             * @property {string|null} [creatorName] Folder creatorName
             */

            /**
             * Constructs a new Folder.
             * @memberof kritor.file
             * @classdesc Represents a Folder.
             * @implements IFolder
             * @constructor
             * @param {kritor.file.IFolder=} [properties] Properties to set
             */
            function Folder(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Folder folderId.
             * @member {string} folderId
             * @memberof kritor.file.Folder
             * @instance
             */
            Folder.prototype.folderId = "";

            /**
             * Folder folderName.
             * @member {string} folderName
             * @memberof kritor.file.Folder
             * @instance
             */
            Folder.prototype.folderName = "";

            /**
             * Folder totalFileCount.
             * @member {number} totalFileCount
             * @memberof kritor.file.Folder
             * @instance
             */
            Folder.prototype.totalFileCount = 0;

            /**
             * Folder createTime.
             * @member {number} createTime
             * @memberof kritor.file.Folder
             * @instance
             */
            Folder.prototype.createTime = 0;

            /**
             * Folder creator.
             * @member {number|Long} creator
             * @memberof kritor.file.Folder
             * @instance
             */
            Folder.prototype.creator = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * Folder creatorName.
             * @member {string} creatorName
             * @memberof kritor.file.Folder
             * @instance
             */
            Folder.prototype.creatorName = "";

            /**
             * Creates a new Folder instance using the specified properties.
             * @function create
             * @memberof kritor.file.Folder
             * @static
             * @param {kritor.file.IFolder=} [properties] Properties to set
             * @returns {kritor.file.Folder} Folder instance
             */
            Folder.create = function create(properties) {
                return new Folder(properties);
            };

            /**
             * Encodes the specified Folder message. Does not implicitly {@link kritor.file.Folder.verify|verify} messages.
             * @function encode
             * @memberof kritor.file.Folder
             * @static
             * @param {kritor.file.IFolder} message Folder message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Folder.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.folderId != null && Object.hasOwnProperty.call(message, "folderId"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.folderId);
                if (message.folderName != null && Object.hasOwnProperty.call(message, "folderName"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.folderName);
                if (message.totalFileCount != null && Object.hasOwnProperty.call(message, "totalFileCount"))
                    writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.totalFileCount);
                if (message.createTime != null && Object.hasOwnProperty.call(message, "createTime"))
                    writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.createTime);
                if (message.creator != null && Object.hasOwnProperty.call(message, "creator"))
                    writer.uint32(/* id 5, wireType 0 =*/40).uint64(message.creator);
                if (message.creatorName != null && Object.hasOwnProperty.call(message, "creatorName"))
                    writer.uint32(/* id 6, wireType 2 =*/50).string(message.creatorName);
                return writer;
            };

            /**
             * Encodes the specified Folder message, length delimited. Does not implicitly {@link kritor.file.Folder.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.file.Folder
             * @static
             * @param {kritor.file.IFolder} message Folder message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Folder.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a Folder message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.file.Folder
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.file.Folder} Folder
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Folder.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.file.Folder();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.folderId = reader.string();
                            break;
                        }
                    case 2: {
                            message.folderName = reader.string();
                            break;
                        }
                    case 3: {
                            message.totalFileCount = reader.uint32();
                            break;
                        }
                    case 4: {
                            message.createTime = reader.uint32();
                            break;
                        }
                    case 5: {
                            message.creator = reader.uint64();
                            break;
                        }
                    case 6: {
                            message.creatorName = reader.string();
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
             * Decodes a Folder message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.file.Folder
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.file.Folder} Folder
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Folder.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a Folder message.
             * @function verify
             * @memberof kritor.file.Folder
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Folder.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.folderId != null && message.hasOwnProperty("folderId"))
                    if (!$util.isString(message.folderId))
                        return "folderId: string expected";
                if (message.folderName != null && message.hasOwnProperty("folderName"))
                    if (!$util.isString(message.folderName))
                        return "folderName: string expected";
                if (message.totalFileCount != null && message.hasOwnProperty("totalFileCount"))
                    if (!$util.isInteger(message.totalFileCount))
                        return "totalFileCount: integer expected";
                if (message.createTime != null && message.hasOwnProperty("createTime"))
                    if (!$util.isInteger(message.createTime))
                        return "createTime: integer expected";
                if (message.creator != null && message.hasOwnProperty("creator"))
                    if (!$util.isInteger(message.creator) && !(message.creator && $util.isInteger(message.creator.low) && $util.isInteger(message.creator.high)))
                        return "creator: integer|Long expected";
                if (message.creatorName != null && message.hasOwnProperty("creatorName"))
                    if (!$util.isString(message.creatorName))
                        return "creatorName: string expected";
                return null;
            };

            /**
             * Creates a Folder message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.file.Folder
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.file.Folder} Folder
             */
            Folder.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.file.Folder)
                    return object;
                let message = new $root.kritor.file.Folder();
                if (object.folderId != null)
                    message.folderId = String(object.folderId);
                if (object.folderName != null)
                    message.folderName = String(object.folderName);
                if (object.totalFileCount != null)
                    message.totalFileCount = object.totalFileCount >>> 0;
                if (object.createTime != null)
                    message.createTime = object.createTime >>> 0;
                if (object.creator != null)
                    if ($util.Long)
                        (message.creator = $util.Long.fromValue(object.creator)).unsigned = true;
                    else if (typeof object.creator === "string")
                        message.creator = parseInt(object.creator, 10);
                    else if (typeof object.creator === "number")
                        message.creator = object.creator;
                    else if (typeof object.creator === "object")
                        message.creator = new $util.LongBits(object.creator.low >>> 0, object.creator.high >>> 0).toNumber(true);
                if (object.creatorName != null)
                    message.creatorName = String(object.creatorName);
                return message;
            };

            /**
             * Creates a plain object from a Folder message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.file.Folder
             * @static
             * @param {kritor.file.Folder} message Folder
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Folder.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.folderId = "";
                    object.folderName = "";
                    object.totalFileCount = 0;
                    object.createTime = 0;
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.creator = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.creator = options.longs === String ? "0" : 0;
                    object.creatorName = "";
                }
                if (message.folderId != null && message.hasOwnProperty("folderId"))
                    object.folderId = message.folderId;
                if (message.folderName != null && message.hasOwnProperty("folderName"))
                    object.folderName = message.folderName;
                if (message.totalFileCount != null && message.hasOwnProperty("totalFileCount"))
                    object.totalFileCount = message.totalFileCount;
                if (message.createTime != null && message.hasOwnProperty("createTime"))
                    object.createTime = message.createTime;
                if (message.creator != null && message.hasOwnProperty("creator"))
                    if (typeof message.creator === "number")
                        object.creator = options.longs === String ? String(message.creator) : message.creator;
                    else
                        object.creator = options.longs === String ? $util.Long.prototype.toString.call(message.creator) : options.longs === Number ? new $util.LongBits(message.creator.low >>> 0, message.creator.high >>> 0).toNumber(true) : message.creator;
                if (message.creatorName != null && message.hasOwnProperty("creatorName"))
                    object.creatorName = message.creatorName;
                return object;
            };

            /**
             * Converts this Folder to JSON.
             * @function toJSON
             * @memberof kritor.file.Folder
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Folder.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for Folder
             * @function getTypeUrl
             * @memberof kritor.file.Folder
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            Folder.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.file.Folder";
            };

            return Folder;
        })();

        return file;
    })();

    return kritor;
})();

export { $root as default };
