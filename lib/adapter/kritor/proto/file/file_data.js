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

    kritor.file = (function() {

        /**
         * Namespace file.
         * @memberof kritor
         * @namespace
         */
        const file = {};

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
