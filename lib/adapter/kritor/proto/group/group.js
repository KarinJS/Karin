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

    kritor.group = (function() {

        /**
         * Namespace group.
         * @memberof kritor
         * @namespace
         */
        const group = {};

        group.GroupService = (function() {

            /**
             * Constructs a new GroupService service.
             * @memberof kritor.group
             * @classdesc Represents a GroupService
             * @extends $protobuf.rpc.Service
             * @constructor
             * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
             * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
             * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
             */
            function GroupService(rpcImpl, requestDelimited, responseDelimited) {
                $protobuf.rpc.Service.call(this, rpcImpl, requestDelimited, responseDelimited);
            }

            (GroupService.prototype = Object.create($protobuf.rpc.Service.prototype)).constructor = GroupService;

            /**
             * Creates new GroupService service using the specified rpc implementation.
             * @function create
             * @memberof kritor.group.GroupService
             * @static
             * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
             * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
             * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
             * @returns {GroupService} RPC service. Useful where requests and/or responses are streamed.
             */
            GroupService.create = function create(rpcImpl, requestDelimited, responseDelimited) {
                return new this(rpcImpl, requestDelimited, responseDelimited);
            };

            /**
             * Callback as used by {@link kritor.group.GroupService#banMember}.
             * @memberof kritor.group.GroupService
             * @typedef BanMemberCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.group.BanMemberResponse} [response] BanMemberResponse
             */

            /**
             * Calls BanMember.
             * @function banMember
             * @memberof kritor.group.GroupService
             * @instance
             * @param {kritor.group.IBanMemberRequest} request BanMemberRequest message or plain object
             * @param {kritor.group.GroupService.BanMemberCallback} callback Node-style callback called with the error, if any, and BanMemberResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(GroupService.prototype.banMember = function banMember(request, callback) {
                return this.rpcCall(banMember, $root.kritor.group.BanMemberRequest, $root.kritor.group.BanMemberResponse, request, callback);
            }, "name", { value: "BanMember" });

            /**
             * Calls BanMember.
             * @function banMember
             * @memberof kritor.group.GroupService
             * @instance
             * @param {kritor.group.IBanMemberRequest} request BanMemberRequest message or plain object
             * @returns {Promise<kritor.group.BanMemberResponse>} Promise
             * @variation 2
             */

            /**
             * Callback as used by {@link kritor.group.GroupService#pokeMember}.
             * @memberof kritor.group.GroupService
             * @typedef PokeMemberCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.group.PokeMemberResponse} [response] PokeMemberResponse
             */

            /**
             * Calls PokeMember.
             * @function pokeMember
             * @memberof kritor.group.GroupService
             * @instance
             * @param {kritor.group.IPokeMemberRequest} request PokeMemberRequest message or plain object
             * @param {kritor.group.GroupService.PokeMemberCallback} callback Node-style callback called with the error, if any, and PokeMemberResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(GroupService.prototype.pokeMember = function pokeMember(request, callback) {
                return this.rpcCall(pokeMember, $root.kritor.group.PokeMemberRequest, $root.kritor.group.PokeMemberResponse, request, callback);
            }, "name", { value: "PokeMember" });

            /**
             * Calls PokeMember.
             * @function pokeMember
             * @memberof kritor.group.GroupService
             * @instance
             * @param {kritor.group.IPokeMemberRequest} request PokeMemberRequest message or plain object
             * @returns {Promise<kritor.group.PokeMemberResponse>} Promise
             * @variation 2
             */

            /**
             * Callback as used by {@link kritor.group.GroupService#kickMember}.
             * @memberof kritor.group.GroupService
             * @typedef KickMemberCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.group.KickMemberResponse} [response] KickMemberResponse
             */

            /**
             * Calls KickMember.
             * @function kickMember
             * @memberof kritor.group.GroupService
             * @instance
             * @param {kritor.group.IKickMemberRequest} request KickMemberRequest message or plain object
             * @param {kritor.group.GroupService.KickMemberCallback} callback Node-style callback called with the error, if any, and KickMemberResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(GroupService.prototype.kickMember = function kickMember(request, callback) {
                return this.rpcCall(kickMember, $root.kritor.group.KickMemberRequest, $root.kritor.group.KickMemberResponse, request, callback);
            }, "name", { value: "KickMember" });

            /**
             * Calls KickMember.
             * @function kickMember
             * @memberof kritor.group.GroupService
             * @instance
             * @param {kritor.group.IKickMemberRequest} request KickMemberRequest message or plain object
             * @returns {Promise<kritor.group.KickMemberResponse>} Promise
             * @variation 2
             */

            /**
             * Callback as used by {@link kritor.group.GroupService#leaveGroup}.
             * @memberof kritor.group.GroupService
             * @typedef LeaveGroupCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.group.LeaveGroupResponse} [response] LeaveGroupResponse
             */

            /**
             * Calls LeaveGroup.
             * @function leaveGroup
             * @memberof kritor.group.GroupService
             * @instance
             * @param {kritor.group.ILeaveGroupRequest} request LeaveGroupRequest message or plain object
             * @param {kritor.group.GroupService.LeaveGroupCallback} callback Node-style callback called with the error, if any, and LeaveGroupResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(GroupService.prototype.leaveGroup = function leaveGroup(request, callback) {
                return this.rpcCall(leaveGroup, $root.kritor.group.LeaveGroupRequest, $root.kritor.group.LeaveGroupResponse, request, callback);
            }, "name", { value: "LeaveGroup" });

            /**
             * Calls LeaveGroup.
             * @function leaveGroup
             * @memberof kritor.group.GroupService
             * @instance
             * @param {kritor.group.ILeaveGroupRequest} request LeaveGroupRequest message or plain object
             * @returns {Promise<kritor.group.LeaveGroupResponse>} Promise
             * @variation 2
             */

            /**
             * Callback as used by {@link kritor.group.GroupService#modifyMemberCard}.
             * @memberof kritor.group.GroupService
             * @typedef ModifyMemberCardCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.group.ModifyMemberCardResponse} [response] ModifyMemberCardResponse
             */

            /**
             * Calls ModifyMemberCard.
             * @function modifyMemberCard
             * @memberof kritor.group.GroupService
             * @instance
             * @param {kritor.group.IModifyMemberCardRequest} request ModifyMemberCardRequest message or plain object
             * @param {kritor.group.GroupService.ModifyMemberCardCallback} callback Node-style callback called with the error, if any, and ModifyMemberCardResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(GroupService.prototype.modifyMemberCard = function modifyMemberCard(request, callback) {
                return this.rpcCall(modifyMemberCard, $root.kritor.group.ModifyMemberCardRequest, $root.kritor.group.ModifyMemberCardResponse, request, callback);
            }, "name", { value: "ModifyMemberCard" });

            /**
             * Calls ModifyMemberCard.
             * @function modifyMemberCard
             * @memberof kritor.group.GroupService
             * @instance
             * @param {kritor.group.IModifyMemberCardRequest} request ModifyMemberCardRequest message or plain object
             * @returns {Promise<kritor.group.ModifyMemberCardResponse>} Promise
             * @variation 2
             */

            /**
             * Callback as used by {@link kritor.group.GroupService#modifyGroupName}.
             * @memberof kritor.group.GroupService
             * @typedef ModifyGroupNameCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.group.ModifyGroupNameResponse} [response] ModifyGroupNameResponse
             */

            /**
             * Calls ModifyGroupName.
             * @function modifyGroupName
             * @memberof kritor.group.GroupService
             * @instance
             * @param {kritor.group.IModifyGroupNameRequest} request ModifyGroupNameRequest message or plain object
             * @param {kritor.group.GroupService.ModifyGroupNameCallback} callback Node-style callback called with the error, if any, and ModifyGroupNameResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(GroupService.prototype.modifyGroupName = function modifyGroupName(request, callback) {
                return this.rpcCall(modifyGroupName, $root.kritor.group.ModifyGroupNameRequest, $root.kritor.group.ModifyGroupNameResponse, request, callback);
            }, "name", { value: "ModifyGroupName" });

            /**
             * Calls ModifyGroupName.
             * @function modifyGroupName
             * @memberof kritor.group.GroupService
             * @instance
             * @param {kritor.group.IModifyGroupNameRequest} request ModifyGroupNameRequest message or plain object
             * @returns {Promise<kritor.group.ModifyGroupNameResponse>} Promise
             * @variation 2
             */

            /**
             * Callback as used by {@link kritor.group.GroupService#modifyGroupRemark}.
             * @memberof kritor.group.GroupService
             * @typedef ModifyGroupRemarkCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.group.ModifyGroupRemarkResponse} [response] ModifyGroupRemarkResponse
             */

            /**
             * Calls ModifyGroupRemark.
             * @function modifyGroupRemark
             * @memberof kritor.group.GroupService
             * @instance
             * @param {kritor.group.IModifyGroupRemarkRequest} request ModifyGroupRemarkRequest message or plain object
             * @param {kritor.group.GroupService.ModifyGroupRemarkCallback} callback Node-style callback called with the error, if any, and ModifyGroupRemarkResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(GroupService.prototype.modifyGroupRemark = function modifyGroupRemark(request, callback) {
                return this.rpcCall(modifyGroupRemark, $root.kritor.group.ModifyGroupRemarkRequest, $root.kritor.group.ModifyGroupRemarkResponse, request, callback);
            }, "name", { value: "ModifyGroupRemark" });

            /**
             * Calls ModifyGroupRemark.
             * @function modifyGroupRemark
             * @memberof kritor.group.GroupService
             * @instance
             * @param {kritor.group.IModifyGroupRemarkRequest} request ModifyGroupRemarkRequest message or plain object
             * @returns {Promise<kritor.group.ModifyGroupRemarkResponse>} Promise
             * @variation 2
             */

            /**
             * Callback as used by {@link kritor.group.GroupService#setGroupAdmin}.
             * @memberof kritor.group.GroupService
             * @typedef SetGroupAdminCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.group.SetGroupAdminResponse} [response] SetGroupAdminResponse
             */

            /**
             * Calls SetGroupAdmin.
             * @function setGroupAdmin
             * @memberof kritor.group.GroupService
             * @instance
             * @param {kritor.group.ISetGroupAdminRequest} request SetGroupAdminRequest message or plain object
             * @param {kritor.group.GroupService.SetGroupAdminCallback} callback Node-style callback called with the error, if any, and SetGroupAdminResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(GroupService.prototype.setGroupAdmin = function setGroupAdmin(request, callback) {
                return this.rpcCall(setGroupAdmin, $root.kritor.group.SetGroupAdminRequest, $root.kritor.group.SetGroupAdminResponse, request, callback);
            }, "name", { value: "SetGroupAdmin" });

            /**
             * Calls SetGroupAdmin.
             * @function setGroupAdmin
             * @memberof kritor.group.GroupService
             * @instance
             * @param {kritor.group.ISetGroupAdminRequest} request SetGroupAdminRequest message or plain object
             * @returns {Promise<kritor.group.SetGroupAdminResponse>} Promise
             * @variation 2
             */

            /**
             * Callback as used by {@link kritor.group.GroupService#setGroupUniqueTitle}.
             * @memberof kritor.group.GroupService
             * @typedef SetGroupUniqueTitleCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.group.SetGroupUniqueTitleResponse} [response] SetGroupUniqueTitleResponse
             */

            /**
             * Calls SetGroupUniqueTitle.
             * @function setGroupUniqueTitle
             * @memberof kritor.group.GroupService
             * @instance
             * @param {kritor.group.ISetGroupUniqueTitleRequest} request SetGroupUniqueTitleRequest message or plain object
             * @param {kritor.group.GroupService.SetGroupUniqueTitleCallback} callback Node-style callback called with the error, if any, and SetGroupUniqueTitleResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(GroupService.prototype.setGroupUniqueTitle = function setGroupUniqueTitle(request, callback) {
                return this.rpcCall(setGroupUniqueTitle, $root.kritor.group.SetGroupUniqueTitleRequest, $root.kritor.group.SetGroupUniqueTitleResponse, request, callback);
            }, "name", { value: "SetGroupUniqueTitle" });

            /**
             * Calls SetGroupUniqueTitle.
             * @function setGroupUniqueTitle
             * @memberof kritor.group.GroupService
             * @instance
             * @param {kritor.group.ISetGroupUniqueTitleRequest} request SetGroupUniqueTitleRequest message or plain object
             * @returns {Promise<kritor.group.SetGroupUniqueTitleResponse>} Promise
             * @variation 2
             */

            /**
             * Callback as used by {@link kritor.group.GroupService#setGroupWholeBan}.
             * @memberof kritor.group.GroupService
             * @typedef SetGroupWholeBanCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.group.SetGroupWholeBanResponse} [response] SetGroupWholeBanResponse
             */

            /**
             * Calls SetGroupWholeBan.
             * @function setGroupWholeBan
             * @memberof kritor.group.GroupService
             * @instance
             * @param {kritor.group.ISetGroupWholeBanRequest} request SetGroupWholeBanRequest message or plain object
             * @param {kritor.group.GroupService.SetGroupWholeBanCallback} callback Node-style callback called with the error, if any, and SetGroupWholeBanResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(GroupService.prototype.setGroupWholeBan = function setGroupWholeBan(request, callback) {
                return this.rpcCall(setGroupWholeBan, $root.kritor.group.SetGroupWholeBanRequest, $root.kritor.group.SetGroupWholeBanResponse, request, callback);
            }, "name", { value: "SetGroupWholeBan" });

            /**
             * Calls SetGroupWholeBan.
             * @function setGroupWholeBan
             * @memberof kritor.group.GroupService
             * @instance
             * @param {kritor.group.ISetGroupWholeBanRequest} request SetGroupWholeBanRequest message or plain object
             * @returns {Promise<kritor.group.SetGroupWholeBanResponse>} Promise
             * @variation 2
             */

            /**
             * Callback as used by {@link kritor.group.GroupService#getGroupInfo}.
             * @memberof kritor.group.GroupService
             * @typedef GetGroupInfoCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.group.GetGroupInfoResponse} [response] GetGroupInfoResponse
             */

            /**
             * Calls GetGroupInfo.
             * @function getGroupInfo
             * @memberof kritor.group.GroupService
             * @instance
             * @param {kritor.group.IGetGroupInfoRequest} request GetGroupInfoRequest message or plain object
             * @param {kritor.group.GroupService.GetGroupInfoCallback} callback Node-style callback called with the error, if any, and GetGroupInfoResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(GroupService.prototype.getGroupInfo = function getGroupInfo(request, callback) {
                return this.rpcCall(getGroupInfo, $root.kritor.group.GetGroupInfoRequest, $root.kritor.group.GetGroupInfoResponse, request, callback);
            }, "name", { value: "GetGroupInfo" });

            /**
             * Calls GetGroupInfo.
             * @function getGroupInfo
             * @memberof kritor.group.GroupService
             * @instance
             * @param {kritor.group.IGetGroupInfoRequest} request GetGroupInfoRequest message or plain object
             * @returns {Promise<kritor.group.GetGroupInfoResponse>} Promise
             * @variation 2
             */

            /**
             * Callback as used by {@link kritor.group.GroupService#getGroupList}.
             * @memberof kritor.group.GroupService
             * @typedef GetGroupListCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.group.GetGroupListResponse} [response] GetGroupListResponse
             */

            /**
             * Calls GetGroupList.
             * @function getGroupList
             * @memberof kritor.group.GroupService
             * @instance
             * @param {kritor.group.IGetGroupListRequest} request GetGroupListRequest message or plain object
             * @param {kritor.group.GroupService.GetGroupListCallback} callback Node-style callback called with the error, if any, and GetGroupListResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(GroupService.prototype.getGroupList = function getGroupList(request, callback) {
                return this.rpcCall(getGroupList, $root.kritor.group.GetGroupListRequest, $root.kritor.group.GetGroupListResponse, request, callback);
            }, "name", { value: "GetGroupList" });

            /**
             * Calls GetGroupList.
             * @function getGroupList
             * @memberof kritor.group.GroupService
             * @instance
             * @param {kritor.group.IGetGroupListRequest} request GetGroupListRequest message or plain object
             * @returns {Promise<kritor.group.GetGroupListResponse>} Promise
             * @variation 2
             */

            /**
             * Callback as used by {@link kritor.group.GroupService#getGroupMemberInfo}.
             * @memberof kritor.group.GroupService
             * @typedef GetGroupMemberInfoCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.group.GetGroupMemberInfoResponse} [response] GetGroupMemberInfoResponse
             */

            /**
             * Calls GetGroupMemberInfo.
             * @function getGroupMemberInfo
             * @memberof kritor.group.GroupService
             * @instance
             * @param {kritor.group.IGetGroupMemberInfoRequest} request GetGroupMemberInfoRequest message or plain object
             * @param {kritor.group.GroupService.GetGroupMemberInfoCallback} callback Node-style callback called with the error, if any, and GetGroupMemberInfoResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(GroupService.prototype.getGroupMemberInfo = function getGroupMemberInfo(request, callback) {
                return this.rpcCall(getGroupMemberInfo, $root.kritor.group.GetGroupMemberInfoRequest, $root.kritor.group.GetGroupMemberInfoResponse, request, callback);
            }, "name", { value: "GetGroupMemberInfo" });

            /**
             * Calls GetGroupMemberInfo.
             * @function getGroupMemberInfo
             * @memberof kritor.group.GroupService
             * @instance
             * @param {kritor.group.IGetGroupMemberInfoRequest} request GetGroupMemberInfoRequest message or plain object
             * @returns {Promise<kritor.group.GetGroupMemberInfoResponse>} Promise
             * @variation 2
             */

            /**
             * Callback as used by {@link kritor.group.GroupService#getGroupMemberList}.
             * @memberof kritor.group.GroupService
             * @typedef GetGroupMemberListCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.group.GetGroupMemberListResponse} [response] GetGroupMemberListResponse
             */

            /**
             * Calls GetGroupMemberList.
             * @function getGroupMemberList
             * @memberof kritor.group.GroupService
             * @instance
             * @param {kritor.group.IGetGroupMemberListRequest} request GetGroupMemberListRequest message or plain object
             * @param {kritor.group.GroupService.GetGroupMemberListCallback} callback Node-style callback called with the error, if any, and GetGroupMemberListResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(GroupService.prototype.getGroupMemberList = function getGroupMemberList(request, callback) {
                return this.rpcCall(getGroupMemberList, $root.kritor.group.GetGroupMemberListRequest, $root.kritor.group.GetGroupMemberListResponse, request, callback);
            }, "name", { value: "GetGroupMemberList" });

            /**
             * Calls GetGroupMemberList.
             * @function getGroupMemberList
             * @memberof kritor.group.GroupService
             * @instance
             * @param {kritor.group.IGetGroupMemberListRequest} request GetGroupMemberListRequest message or plain object
             * @returns {Promise<kritor.group.GetGroupMemberListResponse>} Promise
             * @variation 2
             */

            /**
             * Callback as used by {@link kritor.group.GroupService#getProhibitedUserList}.
             * @memberof kritor.group.GroupService
             * @typedef GetProhibitedUserListCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.group.GetProhibitedUserListResponse} [response] GetProhibitedUserListResponse
             */

            /**
             * Calls GetProhibitedUserList.
             * @function getProhibitedUserList
             * @memberof kritor.group.GroupService
             * @instance
             * @param {kritor.group.IGetProhibitedUserListRequest} request GetProhibitedUserListRequest message or plain object
             * @param {kritor.group.GroupService.GetProhibitedUserListCallback} callback Node-style callback called with the error, if any, and GetProhibitedUserListResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(GroupService.prototype.getProhibitedUserList = function getProhibitedUserList(request, callback) {
                return this.rpcCall(getProhibitedUserList, $root.kritor.group.GetProhibitedUserListRequest, $root.kritor.group.GetProhibitedUserListResponse, request, callback);
            }, "name", { value: "GetProhibitedUserList" });

            /**
             * Calls GetProhibitedUserList.
             * @function getProhibitedUserList
             * @memberof kritor.group.GroupService
             * @instance
             * @param {kritor.group.IGetProhibitedUserListRequest} request GetProhibitedUserListRequest message or plain object
             * @returns {Promise<kritor.group.GetProhibitedUserListResponse>} Promise
             * @variation 2
             */

            /**
             * Callback as used by {@link kritor.group.GroupService#getRemainCountAtAll}.
             * @memberof kritor.group.GroupService
             * @typedef GetRemainCountAtAllCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.group.GetRemainCountAtAllResponse} [response] GetRemainCountAtAllResponse
             */

            /**
             * Calls GetRemainCountAtAll.
             * @function getRemainCountAtAll
             * @memberof kritor.group.GroupService
             * @instance
             * @param {kritor.group.IGetRemainCountAtAllRequest} request GetRemainCountAtAllRequest message or plain object
             * @param {kritor.group.GroupService.GetRemainCountAtAllCallback} callback Node-style callback called with the error, if any, and GetRemainCountAtAllResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(GroupService.prototype.getRemainCountAtAll = function getRemainCountAtAll(request, callback) {
                return this.rpcCall(getRemainCountAtAll, $root.kritor.group.GetRemainCountAtAllRequest, $root.kritor.group.GetRemainCountAtAllResponse, request, callback);
            }, "name", { value: "GetRemainCountAtAll" });

            /**
             * Calls GetRemainCountAtAll.
             * @function getRemainCountAtAll
             * @memberof kritor.group.GroupService
             * @instance
             * @param {kritor.group.IGetRemainCountAtAllRequest} request GetRemainCountAtAllRequest message or plain object
             * @returns {Promise<kritor.group.GetRemainCountAtAllResponse>} Promise
             * @variation 2
             */

            /**
             * Callback as used by {@link kritor.group.GroupService#getNotJoinedGroupInfo}.
             * @memberof kritor.group.GroupService
             * @typedef GetNotJoinedGroupInfoCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.group.GetNotJoinedGroupInfoResponse} [response] GetNotJoinedGroupInfoResponse
             */

            /**
             * Calls GetNotJoinedGroupInfo.
             * @function getNotJoinedGroupInfo
             * @memberof kritor.group.GroupService
             * @instance
             * @param {kritor.group.IGetNotJoinedGroupInfoRequest} request GetNotJoinedGroupInfoRequest message or plain object
             * @param {kritor.group.GroupService.GetNotJoinedGroupInfoCallback} callback Node-style callback called with the error, if any, and GetNotJoinedGroupInfoResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(GroupService.prototype.getNotJoinedGroupInfo = function getNotJoinedGroupInfo(request, callback) {
                return this.rpcCall(getNotJoinedGroupInfo, $root.kritor.group.GetNotJoinedGroupInfoRequest, $root.kritor.group.GetNotJoinedGroupInfoResponse, request, callback);
            }, "name", { value: "GetNotJoinedGroupInfo" });

            /**
             * Calls GetNotJoinedGroupInfo.
             * @function getNotJoinedGroupInfo
             * @memberof kritor.group.GroupService
             * @instance
             * @param {kritor.group.IGetNotJoinedGroupInfoRequest} request GetNotJoinedGroupInfoRequest message or plain object
             * @returns {Promise<kritor.group.GetNotJoinedGroupInfoResponse>} Promise
             * @variation 2
             */

            /**
             * Callback as used by {@link kritor.group.GroupService#getGroupHonor}.
             * @memberof kritor.group.GroupService
             * @typedef GetGroupHonorCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {kritor.group.GetGroupHonorResponse} [response] GetGroupHonorResponse
             */

            /**
             * Calls GetGroupHonor.
             * @function getGroupHonor
             * @memberof kritor.group.GroupService
             * @instance
             * @param {kritor.group.IGetGroupHonorRequest} request GetGroupHonorRequest message or plain object
             * @param {kritor.group.GroupService.GetGroupHonorCallback} callback Node-style callback called with the error, if any, and GetGroupHonorResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(GroupService.prototype.getGroupHonor = function getGroupHonor(request, callback) {
                return this.rpcCall(getGroupHonor, $root.kritor.group.GetGroupHonorRequest, $root.kritor.group.GetGroupHonorResponse, request, callback);
            }, "name", { value: "GetGroupHonor" });

            /**
             * Calls GetGroupHonor.
             * @function getGroupHonor
             * @memberof kritor.group.GroupService
             * @instance
             * @param {kritor.group.IGetGroupHonorRequest} request GetGroupHonorRequest message or plain object
             * @returns {Promise<kritor.group.GetGroupHonorResponse>} Promise
             * @variation 2
             */

            return GroupService;
        })();

        group.BanMemberRequest = (function() {

            /**
             * Properties of a BanMemberRequest.
             * @memberof kritor.group
             * @interface IBanMemberRequest
             * @property {number|Long|null} [groupId] BanMemberRequest groupId
             * @property {string|null} [targetUid] BanMemberRequest targetUid
             * @property {number|Long|null} [targetUin] BanMemberRequest targetUin
             * @property {number|null} [duration] BanMemberRequest duration
             */

            /**
             * Constructs a new BanMemberRequest.
             * @memberof kritor.group
             * @classdesc Represents a BanMemberRequest.
             * @implements IBanMemberRequest
             * @constructor
             * @param {kritor.group.IBanMemberRequest=} [properties] Properties to set
             */
            function BanMemberRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * BanMemberRequest groupId.
             * @member {number|Long} groupId
             * @memberof kritor.group.BanMemberRequest
             * @instance
             */
            BanMemberRequest.prototype.groupId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * BanMemberRequest targetUid.
             * @member {string|null|undefined} targetUid
             * @memberof kritor.group.BanMemberRequest
             * @instance
             */
            BanMemberRequest.prototype.targetUid = null;

            /**
             * BanMemberRequest targetUin.
             * @member {number|Long|null|undefined} targetUin
             * @memberof kritor.group.BanMemberRequest
             * @instance
             */
            BanMemberRequest.prototype.targetUin = null;

            /**
             * BanMemberRequest duration.
             * @member {number} duration
             * @memberof kritor.group.BanMemberRequest
             * @instance
             */
            BanMemberRequest.prototype.duration = 0;

            // OneOf field names bound to virtual getters and setters
            let $oneOfFields;

            /**
             * BanMemberRequest target.
             * @member {"targetUid"|"targetUin"|undefined} target
             * @memberof kritor.group.BanMemberRequest
             * @instance
             */
            Object.defineProperty(BanMemberRequest.prototype, "target", {
                get: $util.oneOfGetter($oneOfFields = ["targetUid", "targetUin"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new BanMemberRequest instance using the specified properties.
             * @function create
             * @memberof kritor.group.BanMemberRequest
             * @static
             * @param {kritor.group.IBanMemberRequest=} [properties] Properties to set
             * @returns {kritor.group.BanMemberRequest} BanMemberRequest instance
             */
            BanMemberRequest.create = function create(properties) {
                return new BanMemberRequest(properties);
            };

            /**
             * Encodes the specified BanMemberRequest message. Does not implicitly {@link kritor.group.BanMemberRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.group.BanMemberRequest
             * @static
             * @param {kritor.group.IBanMemberRequest} message BanMemberRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            BanMemberRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.groupId != null && Object.hasOwnProperty.call(message, "groupId"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.groupId);
                if (message.targetUid != null && Object.hasOwnProperty.call(message, "targetUid"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.targetUid);
                if (message.targetUin != null && Object.hasOwnProperty.call(message, "targetUin"))
                    writer.uint32(/* id 3, wireType 0 =*/24).uint64(message.targetUin);
                if (message.duration != null && Object.hasOwnProperty.call(message, "duration"))
                    writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.duration);
                return writer;
            };

            /**
             * Encodes the specified BanMemberRequest message, length delimited. Does not implicitly {@link kritor.group.BanMemberRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.group.BanMemberRequest
             * @static
             * @param {kritor.group.IBanMemberRequest} message BanMemberRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            BanMemberRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a BanMemberRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.group.BanMemberRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.group.BanMemberRequest} BanMemberRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            BanMemberRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.group.BanMemberRequest();
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
                            message.duration = reader.uint32();
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
             * Decodes a BanMemberRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.group.BanMemberRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.group.BanMemberRequest} BanMemberRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            BanMemberRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a BanMemberRequest message.
             * @function verify
             * @memberof kritor.group.BanMemberRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            BanMemberRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                let properties = {};
                if (message.groupId != null && message.hasOwnProperty("groupId"))
                    if (!$util.isInteger(message.groupId) && !(message.groupId && $util.isInteger(message.groupId.low) && $util.isInteger(message.groupId.high)))
                        return "groupId: integer|Long expected";
                if (message.targetUid != null && message.hasOwnProperty("targetUid")) {
                    properties.target = 1;
                    if (!$util.isString(message.targetUid))
                        return "targetUid: string expected";
                }
                if (message.targetUin != null && message.hasOwnProperty("targetUin")) {
                    if (properties.target === 1)
                        return "target: multiple values";
                    properties.target = 1;
                    if (!$util.isInteger(message.targetUin) && !(message.targetUin && $util.isInteger(message.targetUin.low) && $util.isInteger(message.targetUin.high)))
                        return "targetUin: integer|Long expected";
                }
                if (message.duration != null && message.hasOwnProperty("duration"))
                    if (!$util.isInteger(message.duration))
                        return "duration: integer expected";
                return null;
            };

            /**
             * Creates a BanMemberRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.group.BanMemberRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.group.BanMemberRequest} BanMemberRequest
             */
            BanMemberRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.group.BanMemberRequest)
                    return object;
                let message = new $root.kritor.group.BanMemberRequest();
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
                if (object.duration != null)
                    message.duration = object.duration >>> 0;
                return message;
            };

            /**
             * Creates a plain object from a BanMemberRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.group.BanMemberRequest
             * @static
             * @param {kritor.group.BanMemberRequest} message BanMemberRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            BanMemberRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.groupId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.groupId = options.longs === String ? "0" : 0;
                    object.duration = 0;
                }
                if (message.groupId != null && message.hasOwnProperty("groupId"))
                    if (typeof message.groupId === "number")
                        object.groupId = options.longs === String ? String(message.groupId) : message.groupId;
                    else
                        object.groupId = options.longs === String ? $util.Long.prototype.toString.call(message.groupId) : options.longs === Number ? new $util.LongBits(message.groupId.low >>> 0, message.groupId.high >>> 0).toNumber(true) : message.groupId;
                if (message.targetUid != null && message.hasOwnProperty("targetUid")) {
                    object.targetUid = message.targetUid;
                    if (options.oneofs)
                        object.target = "targetUid";
                }
                if (message.targetUin != null && message.hasOwnProperty("targetUin")) {
                    if (typeof message.targetUin === "number")
                        object.targetUin = options.longs === String ? String(message.targetUin) : message.targetUin;
                    else
                        object.targetUin = options.longs === String ? $util.Long.prototype.toString.call(message.targetUin) : options.longs === Number ? new $util.LongBits(message.targetUin.low >>> 0, message.targetUin.high >>> 0).toNumber(true) : message.targetUin;
                    if (options.oneofs)
                        object.target = "targetUin";
                }
                if (message.duration != null && message.hasOwnProperty("duration"))
                    object.duration = message.duration;
                return object;
            };

            /**
             * Converts this BanMemberRequest to JSON.
             * @function toJSON
             * @memberof kritor.group.BanMemberRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            BanMemberRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for BanMemberRequest
             * @function getTypeUrl
             * @memberof kritor.group.BanMemberRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            BanMemberRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.group.BanMemberRequest";
            };

            return BanMemberRequest;
        })();

        group.BanMemberResponse = (function() {

            /**
             * Properties of a BanMemberResponse.
             * @memberof kritor.group
             * @interface IBanMemberResponse
             * @property {number|Long|null} [groupId] BanMemberResponse groupId
             */

            /**
             * Constructs a new BanMemberResponse.
             * @memberof kritor.group
             * @classdesc Represents a BanMemberResponse.
             * @implements IBanMemberResponse
             * @constructor
             * @param {kritor.group.IBanMemberResponse=} [properties] Properties to set
             */
            function BanMemberResponse(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * BanMemberResponse groupId.
             * @member {number|Long} groupId
             * @memberof kritor.group.BanMemberResponse
             * @instance
             */
            BanMemberResponse.prototype.groupId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * Creates a new BanMemberResponse instance using the specified properties.
             * @function create
             * @memberof kritor.group.BanMemberResponse
             * @static
             * @param {kritor.group.IBanMemberResponse=} [properties] Properties to set
             * @returns {kritor.group.BanMemberResponse} BanMemberResponse instance
             */
            BanMemberResponse.create = function create(properties) {
                return new BanMemberResponse(properties);
            };

            /**
             * Encodes the specified BanMemberResponse message. Does not implicitly {@link kritor.group.BanMemberResponse.verify|verify} messages.
             * @function encode
             * @memberof kritor.group.BanMemberResponse
             * @static
             * @param {kritor.group.IBanMemberResponse} message BanMemberResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            BanMemberResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.groupId != null && Object.hasOwnProperty.call(message, "groupId"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.groupId);
                return writer;
            };

            /**
             * Encodes the specified BanMemberResponse message, length delimited. Does not implicitly {@link kritor.group.BanMemberResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.group.BanMemberResponse
             * @static
             * @param {kritor.group.IBanMemberResponse} message BanMemberResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            BanMemberResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a BanMemberResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.group.BanMemberResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.group.BanMemberResponse} BanMemberResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            BanMemberResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.group.BanMemberResponse();
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
             * Decodes a BanMemberResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.group.BanMemberResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.group.BanMemberResponse} BanMemberResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            BanMemberResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a BanMemberResponse message.
             * @function verify
             * @memberof kritor.group.BanMemberResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            BanMemberResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.groupId != null && message.hasOwnProperty("groupId"))
                    if (!$util.isInteger(message.groupId) && !(message.groupId && $util.isInteger(message.groupId.low) && $util.isInteger(message.groupId.high)))
                        return "groupId: integer|Long expected";
                return null;
            };

            /**
             * Creates a BanMemberResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.group.BanMemberResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.group.BanMemberResponse} BanMemberResponse
             */
            BanMemberResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.group.BanMemberResponse)
                    return object;
                let message = new $root.kritor.group.BanMemberResponse();
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
             * Creates a plain object from a BanMemberResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.group.BanMemberResponse
             * @static
             * @param {kritor.group.BanMemberResponse} message BanMemberResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            BanMemberResponse.toObject = function toObject(message, options) {
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
             * Converts this BanMemberResponse to JSON.
             * @function toJSON
             * @memberof kritor.group.BanMemberResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            BanMemberResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for BanMemberResponse
             * @function getTypeUrl
             * @memberof kritor.group.BanMemberResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            BanMemberResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.group.BanMemberResponse";
            };

            return BanMemberResponse;
        })();

        group.PokeMemberRequest = (function() {

            /**
             * Properties of a PokeMemberRequest.
             * @memberof kritor.group
             * @interface IPokeMemberRequest
             * @property {number|Long|null} [groupId] PokeMemberRequest groupId
             * @property {string|null} [targetUid] PokeMemberRequest targetUid
             * @property {number|Long|null} [targetUin] PokeMemberRequest targetUin
             */

            /**
             * Constructs a new PokeMemberRequest.
             * @memberof kritor.group
             * @classdesc Represents a PokeMemberRequest.
             * @implements IPokeMemberRequest
             * @constructor
             * @param {kritor.group.IPokeMemberRequest=} [properties] Properties to set
             */
            function PokeMemberRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * PokeMemberRequest groupId.
             * @member {number|Long} groupId
             * @memberof kritor.group.PokeMemberRequest
             * @instance
             */
            PokeMemberRequest.prototype.groupId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * PokeMemberRequest targetUid.
             * @member {string|null|undefined} targetUid
             * @memberof kritor.group.PokeMemberRequest
             * @instance
             */
            PokeMemberRequest.prototype.targetUid = null;

            /**
             * PokeMemberRequest targetUin.
             * @member {number|Long|null|undefined} targetUin
             * @memberof kritor.group.PokeMemberRequest
             * @instance
             */
            PokeMemberRequest.prototype.targetUin = null;

            // OneOf field names bound to virtual getters and setters
            let $oneOfFields;

            /**
             * PokeMemberRequest target.
             * @member {"targetUid"|"targetUin"|undefined} target
             * @memberof kritor.group.PokeMemberRequest
             * @instance
             */
            Object.defineProperty(PokeMemberRequest.prototype, "target", {
                get: $util.oneOfGetter($oneOfFields = ["targetUid", "targetUin"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new PokeMemberRequest instance using the specified properties.
             * @function create
             * @memberof kritor.group.PokeMemberRequest
             * @static
             * @param {kritor.group.IPokeMemberRequest=} [properties] Properties to set
             * @returns {kritor.group.PokeMemberRequest} PokeMemberRequest instance
             */
            PokeMemberRequest.create = function create(properties) {
                return new PokeMemberRequest(properties);
            };

            /**
             * Encodes the specified PokeMemberRequest message. Does not implicitly {@link kritor.group.PokeMemberRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.group.PokeMemberRequest
             * @static
             * @param {kritor.group.IPokeMemberRequest} message PokeMemberRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            PokeMemberRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.groupId != null && Object.hasOwnProperty.call(message, "groupId"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.groupId);
                if (message.targetUid != null && Object.hasOwnProperty.call(message, "targetUid"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.targetUid);
                if (message.targetUin != null && Object.hasOwnProperty.call(message, "targetUin"))
                    writer.uint32(/* id 3, wireType 0 =*/24).uint64(message.targetUin);
                return writer;
            };

            /**
             * Encodes the specified PokeMemberRequest message, length delimited. Does not implicitly {@link kritor.group.PokeMemberRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.group.PokeMemberRequest
             * @static
             * @param {kritor.group.IPokeMemberRequest} message PokeMemberRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            PokeMemberRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a PokeMemberRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.group.PokeMemberRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.group.PokeMemberRequest} PokeMemberRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            PokeMemberRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.group.PokeMemberRequest();
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
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a PokeMemberRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.group.PokeMemberRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.group.PokeMemberRequest} PokeMemberRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            PokeMemberRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a PokeMemberRequest message.
             * @function verify
             * @memberof kritor.group.PokeMemberRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            PokeMemberRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                let properties = {};
                if (message.groupId != null && message.hasOwnProperty("groupId"))
                    if (!$util.isInteger(message.groupId) && !(message.groupId && $util.isInteger(message.groupId.low) && $util.isInteger(message.groupId.high)))
                        return "groupId: integer|Long expected";
                if (message.targetUid != null && message.hasOwnProperty("targetUid")) {
                    properties.target = 1;
                    if (!$util.isString(message.targetUid))
                        return "targetUid: string expected";
                }
                if (message.targetUin != null && message.hasOwnProperty("targetUin")) {
                    if (properties.target === 1)
                        return "target: multiple values";
                    properties.target = 1;
                    if (!$util.isInteger(message.targetUin) && !(message.targetUin && $util.isInteger(message.targetUin.low) && $util.isInteger(message.targetUin.high)))
                        return "targetUin: integer|Long expected";
                }
                return null;
            };

            /**
             * Creates a PokeMemberRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.group.PokeMemberRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.group.PokeMemberRequest} PokeMemberRequest
             */
            PokeMemberRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.group.PokeMemberRequest)
                    return object;
                let message = new $root.kritor.group.PokeMemberRequest();
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
                return message;
            };

            /**
             * Creates a plain object from a PokeMemberRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.group.PokeMemberRequest
             * @static
             * @param {kritor.group.PokeMemberRequest} message PokeMemberRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            PokeMemberRequest.toObject = function toObject(message, options) {
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
                if (message.targetUid != null && message.hasOwnProperty("targetUid")) {
                    object.targetUid = message.targetUid;
                    if (options.oneofs)
                        object.target = "targetUid";
                }
                if (message.targetUin != null && message.hasOwnProperty("targetUin")) {
                    if (typeof message.targetUin === "number")
                        object.targetUin = options.longs === String ? String(message.targetUin) : message.targetUin;
                    else
                        object.targetUin = options.longs === String ? $util.Long.prototype.toString.call(message.targetUin) : options.longs === Number ? new $util.LongBits(message.targetUin.low >>> 0, message.targetUin.high >>> 0).toNumber(true) : message.targetUin;
                    if (options.oneofs)
                        object.target = "targetUin";
                }
                return object;
            };

            /**
             * Converts this PokeMemberRequest to JSON.
             * @function toJSON
             * @memberof kritor.group.PokeMemberRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            PokeMemberRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for PokeMemberRequest
             * @function getTypeUrl
             * @memberof kritor.group.PokeMemberRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            PokeMemberRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.group.PokeMemberRequest";
            };

            return PokeMemberRequest;
        })();

        group.PokeMemberResponse = (function() {

            /**
             * Properties of a PokeMemberResponse.
             * @memberof kritor.group
             * @interface IPokeMemberResponse
             */

            /**
             * Constructs a new PokeMemberResponse.
             * @memberof kritor.group
             * @classdesc Represents a PokeMemberResponse.
             * @implements IPokeMemberResponse
             * @constructor
             * @param {kritor.group.IPokeMemberResponse=} [properties] Properties to set
             */
            function PokeMemberResponse(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Creates a new PokeMemberResponse instance using the specified properties.
             * @function create
             * @memberof kritor.group.PokeMemberResponse
             * @static
             * @param {kritor.group.IPokeMemberResponse=} [properties] Properties to set
             * @returns {kritor.group.PokeMemberResponse} PokeMemberResponse instance
             */
            PokeMemberResponse.create = function create(properties) {
                return new PokeMemberResponse(properties);
            };

            /**
             * Encodes the specified PokeMemberResponse message. Does not implicitly {@link kritor.group.PokeMemberResponse.verify|verify} messages.
             * @function encode
             * @memberof kritor.group.PokeMemberResponse
             * @static
             * @param {kritor.group.IPokeMemberResponse} message PokeMemberResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            PokeMemberResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                return writer;
            };

            /**
             * Encodes the specified PokeMemberResponse message, length delimited. Does not implicitly {@link kritor.group.PokeMemberResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.group.PokeMemberResponse
             * @static
             * @param {kritor.group.IPokeMemberResponse} message PokeMemberResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            PokeMemberResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a PokeMemberResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.group.PokeMemberResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.group.PokeMemberResponse} PokeMemberResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            PokeMemberResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.group.PokeMemberResponse();
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
             * Decodes a PokeMemberResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.group.PokeMemberResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.group.PokeMemberResponse} PokeMemberResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            PokeMemberResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a PokeMemberResponse message.
             * @function verify
             * @memberof kritor.group.PokeMemberResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            PokeMemberResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                return null;
            };

            /**
             * Creates a PokeMemberResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.group.PokeMemberResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.group.PokeMemberResponse} PokeMemberResponse
             */
            PokeMemberResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.group.PokeMemberResponse)
                    return object;
                return new $root.kritor.group.PokeMemberResponse();
            };

            /**
             * Creates a plain object from a PokeMemberResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.group.PokeMemberResponse
             * @static
             * @param {kritor.group.PokeMemberResponse} message PokeMemberResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            PokeMemberResponse.toObject = function toObject() {
                return {};
            };

            /**
             * Converts this PokeMemberResponse to JSON.
             * @function toJSON
             * @memberof kritor.group.PokeMemberResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            PokeMemberResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for PokeMemberResponse
             * @function getTypeUrl
             * @memberof kritor.group.PokeMemberResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            PokeMemberResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.group.PokeMemberResponse";
            };

            return PokeMemberResponse;
        })();

        group.KickMemberRequest = (function() {

            /**
             * Properties of a KickMemberRequest.
             * @memberof kritor.group
             * @interface IKickMemberRequest
             * @property {number|Long|null} [groupId] KickMemberRequest groupId
             * @property {string|null} [targetUid] KickMemberRequest targetUid
             * @property {number|Long|null} [targetUin] KickMemberRequest targetUin
             * @property {boolean|null} [rejectAddRequest] KickMemberRequest rejectAddRequest
             * @property {string|null} [kickReason] KickMemberRequest kickReason
             */

            /**
             * Constructs a new KickMemberRequest.
             * @memberof kritor.group
             * @classdesc Represents a KickMemberRequest.
             * @implements IKickMemberRequest
             * @constructor
             * @param {kritor.group.IKickMemberRequest=} [properties] Properties to set
             */
            function KickMemberRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * KickMemberRequest groupId.
             * @member {number|Long} groupId
             * @memberof kritor.group.KickMemberRequest
             * @instance
             */
            KickMemberRequest.prototype.groupId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * KickMemberRequest targetUid.
             * @member {string|null|undefined} targetUid
             * @memberof kritor.group.KickMemberRequest
             * @instance
             */
            KickMemberRequest.prototype.targetUid = null;

            /**
             * KickMemberRequest targetUin.
             * @member {number|Long|null|undefined} targetUin
             * @memberof kritor.group.KickMemberRequest
             * @instance
             */
            KickMemberRequest.prototype.targetUin = null;

            /**
             * KickMemberRequest rejectAddRequest.
             * @member {boolean|null|undefined} rejectAddRequest
             * @memberof kritor.group.KickMemberRequest
             * @instance
             */
            KickMemberRequest.prototype.rejectAddRequest = null;

            /**
             * KickMemberRequest kickReason.
             * @member {string|null|undefined} kickReason
             * @memberof kritor.group.KickMemberRequest
             * @instance
             */
            KickMemberRequest.prototype.kickReason = null;

            // OneOf field names bound to virtual getters and setters
            let $oneOfFields;

            /**
             * KickMemberRequest target.
             * @member {"targetUid"|"targetUin"|undefined} target
             * @memberof kritor.group.KickMemberRequest
             * @instance
             */
            Object.defineProperty(KickMemberRequest.prototype, "target", {
                get: $util.oneOfGetter($oneOfFields = ["targetUid", "targetUin"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * KickMemberRequest _rejectAddRequest.
             * @member {"rejectAddRequest"|undefined} _rejectAddRequest
             * @memberof kritor.group.KickMemberRequest
             * @instance
             */
            Object.defineProperty(KickMemberRequest.prototype, "_rejectAddRequest", {
                get: $util.oneOfGetter($oneOfFields = ["rejectAddRequest"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * KickMemberRequest _kickReason.
             * @member {"kickReason"|undefined} _kickReason
             * @memberof kritor.group.KickMemberRequest
             * @instance
             */
            Object.defineProperty(KickMemberRequest.prototype, "_kickReason", {
                get: $util.oneOfGetter($oneOfFields = ["kickReason"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new KickMemberRequest instance using the specified properties.
             * @function create
             * @memberof kritor.group.KickMemberRequest
             * @static
             * @param {kritor.group.IKickMemberRequest=} [properties] Properties to set
             * @returns {kritor.group.KickMemberRequest} KickMemberRequest instance
             */
            KickMemberRequest.create = function create(properties) {
                return new KickMemberRequest(properties);
            };

            /**
             * Encodes the specified KickMemberRequest message. Does not implicitly {@link kritor.group.KickMemberRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.group.KickMemberRequest
             * @static
             * @param {kritor.group.IKickMemberRequest} message KickMemberRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            KickMemberRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.groupId != null && Object.hasOwnProperty.call(message, "groupId"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.groupId);
                if (message.targetUid != null && Object.hasOwnProperty.call(message, "targetUid"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.targetUid);
                if (message.targetUin != null && Object.hasOwnProperty.call(message, "targetUin"))
                    writer.uint32(/* id 3, wireType 0 =*/24).uint64(message.targetUin);
                if (message.kickReason != null && Object.hasOwnProperty.call(message, "kickReason"))
                    writer.uint32(/* id 5, wireType 2 =*/42).string(message.kickReason);
                if (message.rejectAddRequest != null && Object.hasOwnProperty.call(message, "rejectAddRequest"))
                    writer.uint32(/* id 6, wireType 0 =*/48).bool(message.rejectAddRequest);
                return writer;
            };

            /**
             * Encodes the specified KickMemberRequest message, length delimited. Does not implicitly {@link kritor.group.KickMemberRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.group.KickMemberRequest
             * @static
             * @param {kritor.group.IKickMemberRequest} message KickMemberRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            KickMemberRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a KickMemberRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.group.KickMemberRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.group.KickMemberRequest} KickMemberRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            KickMemberRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.group.KickMemberRequest();
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
                    case 6: {
                            message.rejectAddRequest = reader.bool();
                            break;
                        }
                    case 5: {
                            message.kickReason = reader.string();
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
             * Decodes a KickMemberRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.group.KickMemberRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.group.KickMemberRequest} KickMemberRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            KickMemberRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a KickMemberRequest message.
             * @function verify
             * @memberof kritor.group.KickMemberRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            KickMemberRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                let properties = {};
                if (message.groupId != null && message.hasOwnProperty("groupId"))
                    if (!$util.isInteger(message.groupId) && !(message.groupId && $util.isInteger(message.groupId.low) && $util.isInteger(message.groupId.high)))
                        return "groupId: integer|Long expected";
                if (message.targetUid != null && message.hasOwnProperty("targetUid")) {
                    properties.target = 1;
                    if (!$util.isString(message.targetUid))
                        return "targetUid: string expected";
                }
                if (message.targetUin != null && message.hasOwnProperty("targetUin")) {
                    if (properties.target === 1)
                        return "target: multiple values";
                    properties.target = 1;
                    if (!$util.isInteger(message.targetUin) && !(message.targetUin && $util.isInteger(message.targetUin.low) && $util.isInteger(message.targetUin.high)))
                        return "targetUin: integer|Long expected";
                }
                if (message.rejectAddRequest != null && message.hasOwnProperty("rejectAddRequest")) {
                    properties._rejectAddRequest = 1;
                    if (typeof message.rejectAddRequest !== "boolean")
                        return "rejectAddRequest: boolean expected";
                }
                if (message.kickReason != null && message.hasOwnProperty("kickReason")) {
                    properties._kickReason = 1;
                    if (!$util.isString(message.kickReason))
                        return "kickReason: string expected";
                }
                return null;
            };

            /**
             * Creates a KickMemberRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.group.KickMemberRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.group.KickMemberRequest} KickMemberRequest
             */
            KickMemberRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.group.KickMemberRequest)
                    return object;
                let message = new $root.kritor.group.KickMemberRequest();
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
                if (object.rejectAddRequest != null)
                    message.rejectAddRequest = Boolean(object.rejectAddRequest);
                if (object.kickReason != null)
                    message.kickReason = String(object.kickReason);
                return message;
            };

            /**
             * Creates a plain object from a KickMemberRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.group.KickMemberRequest
             * @static
             * @param {kritor.group.KickMemberRequest} message KickMemberRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            KickMemberRequest.toObject = function toObject(message, options) {
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
                if (message.targetUid != null && message.hasOwnProperty("targetUid")) {
                    object.targetUid = message.targetUid;
                    if (options.oneofs)
                        object.target = "targetUid";
                }
                if (message.targetUin != null && message.hasOwnProperty("targetUin")) {
                    if (typeof message.targetUin === "number")
                        object.targetUin = options.longs === String ? String(message.targetUin) : message.targetUin;
                    else
                        object.targetUin = options.longs === String ? $util.Long.prototype.toString.call(message.targetUin) : options.longs === Number ? new $util.LongBits(message.targetUin.low >>> 0, message.targetUin.high >>> 0).toNumber(true) : message.targetUin;
                    if (options.oneofs)
                        object.target = "targetUin";
                }
                if (message.kickReason != null && message.hasOwnProperty("kickReason")) {
                    object.kickReason = message.kickReason;
                    if (options.oneofs)
                        object._kickReason = "kickReason";
                }
                if (message.rejectAddRequest != null && message.hasOwnProperty("rejectAddRequest")) {
                    object.rejectAddRequest = message.rejectAddRequest;
                    if (options.oneofs)
                        object._rejectAddRequest = "rejectAddRequest";
                }
                return object;
            };

            /**
             * Converts this KickMemberRequest to JSON.
             * @function toJSON
             * @memberof kritor.group.KickMemberRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            KickMemberRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for KickMemberRequest
             * @function getTypeUrl
             * @memberof kritor.group.KickMemberRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            KickMemberRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.group.KickMemberRequest";
            };

            return KickMemberRequest;
        })();

        group.KickMemberResponse = (function() {

            /**
             * Properties of a KickMemberResponse.
             * @memberof kritor.group
             * @interface IKickMemberResponse
             */

            /**
             * Constructs a new KickMemberResponse.
             * @memberof kritor.group
             * @classdesc Represents a KickMemberResponse.
             * @implements IKickMemberResponse
             * @constructor
             * @param {kritor.group.IKickMemberResponse=} [properties] Properties to set
             */
            function KickMemberResponse(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Creates a new KickMemberResponse instance using the specified properties.
             * @function create
             * @memberof kritor.group.KickMemberResponse
             * @static
             * @param {kritor.group.IKickMemberResponse=} [properties] Properties to set
             * @returns {kritor.group.KickMemberResponse} KickMemberResponse instance
             */
            KickMemberResponse.create = function create(properties) {
                return new KickMemberResponse(properties);
            };

            /**
             * Encodes the specified KickMemberResponse message. Does not implicitly {@link kritor.group.KickMemberResponse.verify|verify} messages.
             * @function encode
             * @memberof kritor.group.KickMemberResponse
             * @static
             * @param {kritor.group.IKickMemberResponse} message KickMemberResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            KickMemberResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                return writer;
            };

            /**
             * Encodes the specified KickMemberResponse message, length delimited. Does not implicitly {@link kritor.group.KickMemberResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.group.KickMemberResponse
             * @static
             * @param {kritor.group.IKickMemberResponse} message KickMemberResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            KickMemberResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a KickMemberResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.group.KickMemberResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.group.KickMemberResponse} KickMemberResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            KickMemberResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.group.KickMemberResponse();
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
             * Decodes a KickMemberResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.group.KickMemberResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.group.KickMemberResponse} KickMemberResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            KickMemberResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a KickMemberResponse message.
             * @function verify
             * @memberof kritor.group.KickMemberResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            KickMemberResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                return null;
            };

            /**
             * Creates a KickMemberResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.group.KickMemberResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.group.KickMemberResponse} KickMemberResponse
             */
            KickMemberResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.group.KickMemberResponse)
                    return object;
                return new $root.kritor.group.KickMemberResponse();
            };

            /**
             * Creates a plain object from a KickMemberResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.group.KickMemberResponse
             * @static
             * @param {kritor.group.KickMemberResponse} message KickMemberResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            KickMemberResponse.toObject = function toObject() {
                return {};
            };

            /**
             * Converts this KickMemberResponse to JSON.
             * @function toJSON
             * @memberof kritor.group.KickMemberResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            KickMemberResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for KickMemberResponse
             * @function getTypeUrl
             * @memberof kritor.group.KickMemberResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            KickMemberResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.group.KickMemberResponse";
            };

            return KickMemberResponse;
        })();

        group.LeaveGroupRequest = (function() {

            /**
             * Properties of a LeaveGroupRequest.
             * @memberof kritor.group
             * @interface ILeaveGroupRequest
             * @property {number|Long|null} [groupId] LeaveGroupRequest groupId
             */

            /**
             * Constructs a new LeaveGroupRequest.
             * @memberof kritor.group
             * @classdesc Represents a LeaveGroupRequest.
             * @implements ILeaveGroupRequest
             * @constructor
             * @param {kritor.group.ILeaveGroupRequest=} [properties] Properties to set
             */
            function LeaveGroupRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * LeaveGroupRequest groupId.
             * @member {number|Long} groupId
             * @memberof kritor.group.LeaveGroupRequest
             * @instance
             */
            LeaveGroupRequest.prototype.groupId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * Creates a new LeaveGroupRequest instance using the specified properties.
             * @function create
             * @memberof kritor.group.LeaveGroupRequest
             * @static
             * @param {kritor.group.ILeaveGroupRequest=} [properties] Properties to set
             * @returns {kritor.group.LeaveGroupRequest} LeaveGroupRequest instance
             */
            LeaveGroupRequest.create = function create(properties) {
                return new LeaveGroupRequest(properties);
            };

            /**
             * Encodes the specified LeaveGroupRequest message. Does not implicitly {@link kritor.group.LeaveGroupRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.group.LeaveGroupRequest
             * @static
             * @param {kritor.group.ILeaveGroupRequest} message LeaveGroupRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            LeaveGroupRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.groupId != null && Object.hasOwnProperty.call(message, "groupId"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.groupId);
                return writer;
            };

            /**
             * Encodes the specified LeaveGroupRequest message, length delimited. Does not implicitly {@link kritor.group.LeaveGroupRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.group.LeaveGroupRequest
             * @static
             * @param {kritor.group.ILeaveGroupRequest} message LeaveGroupRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            LeaveGroupRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a LeaveGroupRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.group.LeaveGroupRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.group.LeaveGroupRequest} LeaveGroupRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            LeaveGroupRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.group.LeaveGroupRequest();
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
             * Decodes a LeaveGroupRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.group.LeaveGroupRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.group.LeaveGroupRequest} LeaveGroupRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            LeaveGroupRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a LeaveGroupRequest message.
             * @function verify
             * @memberof kritor.group.LeaveGroupRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            LeaveGroupRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.groupId != null && message.hasOwnProperty("groupId"))
                    if (!$util.isInteger(message.groupId) && !(message.groupId && $util.isInteger(message.groupId.low) && $util.isInteger(message.groupId.high)))
                        return "groupId: integer|Long expected";
                return null;
            };

            /**
             * Creates a LeaveGroupRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.group.LeaveGroupRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.group.LeaveGroupRequest} LeaveGroupRequest
             */
            LeaveGroupRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.group.LeaveGroupRequest)
                    return object;
                let message = new $root.kritor.group.LeaveGroupRequest();
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
             * Creates a plain object from a LeaveGroupRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.group.LeaveGroupRequest
             * @static
             * @param {kritor.group.LeaveGroupRequest} message LeaveGroupRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            LeaveGroupRequest.toObject = function toObject(message, options) {
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
             * Converts this LeaveGroupRequest to JSON.
             * @function toJSON
             * @memberof kritor.group.LeaveGroupRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            LeaveGroupRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for LeaveGroupRequest
             * @function getTypeUrl
             * @memberof kritor.group.LeaveGroupRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            LeaveGroupRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.group.LeaveGroupRequest";
            };

            return LeaveGroupRequest;
        })();

        group.LeaveGroupResponse = (function() {

            /**
             * Properties of a LeaveGroupResponse.
             * @memberof kritor.group
             * @interface ILeaveGroupResponse
             */

            /**
             * Constructs a new LeaveGroupResponse.
             * @memberof kritor.group
             * @classdesc Represents a LeaveGroupResponse.
             * @implements ILeaveGroupResponse
             * @constructor
             * @param {kritor.group.ILeaveGroupResponse=} [properties] Properties to set
             */
            function LeaveGroupResponse(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Creates a new LeaveGroupResponse instance using the specified properties.
             * @function create
             * @memberof kritor.group.LeaveGroupResponse
             * @static
             * @param {kritor.group.ILeaveGroupResponse=} [properties] Properties to set
             * @returns {kritor.group.LeaveGroupResponse} LeaveGroupResponse instance
             */
            LeaveGroupResponse.create = function create(properties) {
                return new LeaveGroupResponse(properties);
            };

            /**
             * Encodes the specified LeaveGroupResponse message. Does not implicitly {@link kritor.group.LeaveGroupResponse.verify|verify} messages.
             * @function encode
             * @memberof kritor.group.LeaveGroupResponse
             * @static
             * @param {kritor.group.ILeaveGroupResponse} message LeaveGroupResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            LeaveGroupResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                return writer;
            };

            /**
             * Encodes the specified LeaveGroupResponse message, length delimited. Does not implicitly {@link kritor.group.LeaveGroupResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.group.LeaveGroupResponse
             * @static
             * @param {kritor.group.ILeaveGroupResponse} message LeaveGroupResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            LeaveGroupResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a LeaveGroupResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.group.LeaveGroupResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.group.LeaveGroupResponse} LeaveGroupResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            LeaveGroupResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.group.LeaveGroupResponse();
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
             * Decodes a LeaveGroupResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.group.LeaveGroupResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.group.LeaveGroupResponse} LeaveGroupResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            LeaveGroupResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a LeaveGroupResponse message.
             * @function verify
             * @memberof kritor.group.LeaveGroupResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            LeaveGroupResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                return null;
            };

            /**
             * Creates a LeaveGroupResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.group.LeaveGroupResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.group.LeaveGroupResponse} LeaveGroupResponse
             */
            LeaveGroupResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.group.LeaveGroupResponse)
                    return object;
                return new $root.kritor.group.LeaveGroupResponse();
            };

            /**
             * Creates a plain object from a LeaveGroupResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.group.LeaveGroupResponse
             * @static
             * @param {kritor.group.LeaveGroupResponse} message LeaveGroupResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            LeaveGroupResponse.toObject = function toObject() {
                return {};
            };

            /**
             * Converts this LeaveGroupResponse to JSON.
             * @function toJSON
             * @memberof kritor.group.LeaveGroupResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            LeaveGroupResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for LeaveGroupResponse
             * @function getTypeUrl
             * @memberof kritor.group.LeaveGroupResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            LeaveGroupResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.group.LeaveGroupResponse";
            };

            return LeaveGroupResponse;
        })();

        group.ModifyMemberCardRequest = (function() {

            /**
             * Properties of a ModifyMemberCardRequest.
             * @memberof kritor.group
             * @interface IModifyMemberCardRequest
             * @property {number|Long|null} [groupId] ModifyMemberCardRequest groupId
             * @property {string|null} [targetUid] ModifyMemberCardRequest targetUid
             * @property {number|Long|null} [targetUin] ModifyMemberCardRequest targetUin
             * @property {string|null} [card] ModifyMemberCardRequest card
             */

            /**
             * Constructs a new ModifyMemberCardRequest.
             * @memberof kritor.group
             * @classdesc Represents a ModifyMemberCardRequest.
             * @implements IModifyMemberCardRequest
             * @constructor
             * @param {kritor.group.IModifyMemberCardRequest=} [properties] Properties to set
             */
            function ModifyMemberCardRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * ModifyMemberCardRequest groupId.
             * @member {number|Long} groupId
             * @memberof kritor.group.ModifyMemberCardRequest
             * @instance
             */
            ModifyMemberCardRequest.prototype.groupId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * ModifyMemberCardRequest targetUid.
             * @member {string|null|undefined} targetUid
             * @memberof kritor.group.ModifyMemberCardRequest
             * @instance
             */
            ModifyMemberCardRequest.prototype.targetUid = null;

            /**
             * ModifyMemberCardRequest targetUin.
             * @member {number|Long|null|undefined} targetUin
             * @memberof kritor.group.ModifyMemberCardRequest
             * @instance
             */
            ModifyMemberCardRequest.prototype.targetUin = null;

            /**
             * ModifyMemberCardRequest card.
             * @member {string} card
             * @memberof kritor.group.ModifyMemberCardRequest
             * @instance
             */
            ModifyMemberCardRequest.prototype.card = "";

            // OneOf field names bound to virtual getters and setters
            let $oneOfFields;

            /**
             * ModifyMemberCardRequest target.
             * @member {"targetUid"|"targetUin"|undefined} target
             * @memberof kritor.group.ModifyMemberCardRequest
             * @instance
             */
            Object.defineProperty(ModifyMemberCardRequest.prototype, "target", {
                get: $util.oneOfGetter($oneOfFields = ["targetUid", "targetUin"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new ModifyMemberCardRequest instance using the specified properties.
             * @function create
             * @memberof kritor.group.ModifyMemberCardRequest
             * @static
             * @param {kritor.group.IModifyMemberCardRequest=} [properties] Properties to set
             * @returns {kritor.group.ModifyMemberCardRequest} ModifyMemberCardRequest instance
             */
            ModifyMemberCardRequest.create = function create(properties) {
                return new ModifyMemberCardRequest(properties);
            };

            /**
             * Encodes the specified ModifyMemberCardRequest message. Does not implicitly {@link kritor.group.ModifyMemberCardRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.group.ModifyMemberCardRequest
             * @static
             * @param {kritor.group.IModifyMemberCardRequest} message ModifyMemberCardRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ModifyMemberCardRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.groupId != null && Object.hasOwnProperty.call(message, "groupId"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.groupId);
                if (message.targetUid != null && Object.hasOwnProperty.call(message, "targetUid"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.targetUid);
                if (message.targetUin != null && Object.hasOwnProperty.call(message, "targetUin"))
                    writer.uint32(/* id 3, wireType 0 =*/24).uint64(message.targetUin);
                if (message.card != null && Object.hasOwnProperty.call(message, "card"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.card);
                return writer;
            };

            /**
             * Encodes the specified ModifyMemberCardRequest message, length delimited. Does not implicitly {@link kritor.group.ModifyMemberCardRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.group.ModifyMemberCardRequest
             * @static
             * @param {kritor.group.IModifyMemberCardRequest} message ModifyMemberCardRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ModifyMemberCardRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a ModifyMemberCardRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.group.ModifyMemberCardRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.group.ModifyMemberCardRequest} ModifyMemberCardRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ModifyMemberCardRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.group.ModifyMemberCardRequest();
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
                            message.card = reader.string();
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
             * Decodes a ModifyMemberCardRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.group.ModifyMemberCardRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.group.ModifyMemberCardRequest} ModifyMemberCardRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ModifyMemberCardRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a ModifyMemberCardRequest message.
             * @function verify
             * @memberof kritor.group.ModifyMemberCardRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ModifyMemberCardRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                let properties = {};
                if (message.groupId != null && message.hasOwnProperty("groupId"))
                    if (!$util.isInteger(message.groupId) && !(message.groupId && $util.isInteger(message.groupId.low) && $util.isInteger(message.groupId.high)))
                        return "groupId: integer|Long expected";
                if (message.targetUid != null && message.hasOwnProperty("targetUid")) {
                    properties.target = 1;
                    if (!$util.isString(message.targetUid))
                        return "targetUid: string expected";
                }
                if (message.targetUin != null && message.hasOwnProperty("targetUin")) {
                    if (properties.target === 1)
                        return "target: multiple values";
                    properties.target = 1;
                    if (!$util.isInteger(message.targetUin) && !(message.targetUin && $util.isInteger(message.targetUin.low) && $util.isInteger(message.targetUin.high)))
                        return "targetUin: integer|Long expected";
                }
                if (message.card != null && message.hasOwnProperty("card"))
                    if (!$util.isString(message.card))
                        return "card: string expected";
                return null;
            };

            /**
             * Creates a ModifyMemberCardRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.group.ModifyMemberCardRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.group.ModifyMemberCardRequest} ModifyMemberCardRequest
             */
            ModifyMemberCardRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.group.ModifyMemberCardRequest)
                    return object;
                let message = new $root.kritor.group.ModifyMemberCardRequest();
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
                if (object.card != null)
                    message.card = String(object.card);
                return message;
            };

            /**
             * Creates a plain object from a ModifyMemberCardRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.group.ModifyMemberCardRequest
             * @static
             * @param {kritor.group.ModifyMemberCardRequest} message ModifyMemberCardRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ModifyMemberCardRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.groupId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.groupId = options.longs === String ? "0" : 0;
                    object.card = "";
                }
                if (message.groupId != null && message.hasOwnProperty("groupId"))
                    if (typeof message.groupId === "number")
                        object.groupId = options.longs === String ? String(message.groupId) : message.groupId;
                    else
                        object.groupId = options.longs === String ? $util.Long.prototype.toString.call(message.groupId) : options.longs === Number ? new $util.LongBits(message.groupId.low >>> 0, message.groupId.high >>> 0).toNumber(true) : message.groupId;
                if (message.targetUid != null && message.hasOwnProperty("targetUid")) {
                    object.targetUid = message.targetUid;
                    if (options.oneofs)
                        object.target = "targetUid";
                }
                if (message.targetUin != null && message.hasOwnProperty("targetUin")) {
                    if (typeof message.targetUin === "number")
                        object.targetUin = options.longs === String ? String(message.targetUin) : message.targetUin;
                    else
                        object.targetUin = options.longs === String ? $util.Long.prototype.toString.call(message.targetUin) : options.longs === Number ? new $util.LongBits(message.targetUin.low >>> 0, message.targetUin.high >>> 0).toNumber(true) : message.targetUin;
                    if (options.oneofs)
                        object.target = "targetUin";
                }
                if (message.card != null && message.hasOwnProperty("card"))
                    object.card = message.card;
                return object;
            };

            /**
             * Converts this ModifyMemberCardRequest to JSON.
             * @function toJSON
             * @memberof kritor.group.ModifyMemberCardRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ModifyMemberCardRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for ModifyMemberCardRequest
             * @function getTypeUrl
             * @memberof kritor.group.ModifyMemberCardRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            ModifyMemberCardRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.group.ModifyMemberCardRequest";
            };

            return ModifyMemberCardRequest;
        })();

        group.ModifyMemberCardResponse = (function() {

            /**
             * Properties of a ModifyMemberCardResponse.
             * @memberof kritor.group
             * @interface IModifyMemberCardResponse
             */

            /**
             * Constructs a new ModifyMemberCardResponse.
             * @memberof kritor.group
             * @classdesc Represents a ModifyMemberCardResponse.
             * @implements IModifyMemberCardResponse
             * @constructor
             * @param {kritor.group.IModifyMemberCardResponse=} [properties] Properties to set
             */
            function ModifyMemberCardResponse(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Creates a new ModifyMemberCardResponse instance using the specified properties.
             * @function create
             * @memberof kritor.group.ModifyMemberCardResponse
             * @static
             * @param {kritor.group.IModifyMemberCardResponse=} [properties] Properties to set
             * @returns {kritor.group.ModifyMemberCardResponse} ModifyMemberCardResponse instance
             */
            ModifyMemberCardResponse.create = function create(properties) {
                return new ModifyMemberCardResponse(properties);
            };

            /**
             * Encodes the specified ModifyMemberCardResponse message. Does not implicitly {@link kritor.group.ModifyMemberCardResponse.verify|verify} messages.
             * @function encode
             * @memberof kritor.group.ModifyMemberCardResponse
             * @static
             * @param {kritor.group.IModifyMemberCardResponse} message ModifyMemberCardResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ModifyMemberCardResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                return writer;
            };

            /**
             * Encodes the specified ModifyMemberCardResponse message, length delimited. Does not implicitly {@link kritor.group.ModifyMemberCardResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.group.ModifyMemberCardResponse
             * @static
             * @param {kritor.group.IModifyMemberCardResponse} message ModifyMemberCardResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ModifyMemberCardResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a ModifyMemberCardResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.group.ModifyMemberCardResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.group.ModifyMemberCardResponse} ModifyMemberCardResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ModifyMemberCardResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.group.ModifyMemberCardResponse();
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
             * Decodes a ModifyMemberCardResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.group.ModifyMemberCardResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.group.ModifyMemberCardResponse} ModifyMemberCardResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ModifyMemberCardResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a ModifyMemberCardResponse message.
             * @function verify
             * @memberof kritor.group.ModifyMemberCardResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ModifyMemberCardResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                return null;
            };

            /**
             * Creates a ModifyMemberCardResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.group.ModifyMemberCardResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.group.ModifyMemberCardResponse} ModifyMemberCardResponse
             */
            ModifyMemberCardResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.group.ModifyMemberCardResponse)
                    return object;
                return new $root.kritor.group.ModifyMemberCardResponse();
            };

            /**
             * Creates a plain object from a ModifyMemberCardResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.group.ModifyMemberCardResponse
             * @static
             * @param {kritor.group.ModifyMemberCardResponse} message ModifyMemberCardResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ModifyMemberCardResponse.toObject = function toObject() {
                return {};
            };

            /**
             * Converts this ModifyMemberCardResponse to JSON.
             * @function toJSON
             * @memberof kritor.group.ModifyMemberCardResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ModifyMemberCardResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for ModifyMemberCardResponse
             * @function getTypeUrl
             * @memberof kritor.group.ModifyMemberCardResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            ModifyMemberCardResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.group.ModifyMemberCardResponse";
            };

            return ModifyMemberCardResponse;
        })();

        group.ModifyGroupNameRequest = (function() {

            /**
             * Properties of a ModifyGroupNameRequest.
             * @memberof kritor.group
             * @interface IModifyGroupNameRequest
             * @property {number|Long|null} [groupId] ModifyGroupNameRequest groupId
             * @property {string|null} [groupName] ModifyGroupNameRequest groupName
             */

            /**
             * Constructs a new ModifyGroupNameRequest.
             * @memberof kritor.group
             * @classdesc Represents a ModifyGroupNameRequest.
             * @implements IModifyGroupNameRequest
             * @constructor
             * @param {kritor.group.IModifyGroupNameRequest=} [properties] Properties to set
             */
            function ModifyGroupNameRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * ModifyGroupNameRequest groupId.
             * @member {number|Long} groupId
             * @memberof kritor.group.ModifyGroupNameRequest
             * @instance
             */
            ModifyGroupNameRequest.prototype.groupId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * ModifyGroupNameRequest groupName.
             * @member {string} groupName
             * @memberof kritor.group.ModifyGroupNameRequest
             * @instance
             */
            ModifyGroupNameRequest.prototype.groupName = "";

            /**
             * Creates a new ModifyGroupNameRequest instance using the specified properties.
             * @function create
             * @memberof kritor.group.ModifyGroupNameRequest
             * @static
             * @param {kritor.group.IModifyGroupNameRequest=} [properties] Properties to set
             * @returns {kritor.group.ModifyGroupNameRequest} ModifyGroupNameRequest instance
             */
            ModifyGroupNameRequest.create = function create(properties) {
                return new ModifyGroupNameRequest(properties);
            };

            /**
             * Encodes the specified ModifyGroupNameRequest message. Does not implicitly {@link kritor.group.ModifyGroupNameRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.group.ModifyGroupNameRequest
             * @static
             * @param {kritor.group.IModifyGroupNameRequest} message ModifyGroupNameRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ModifyGroupNameRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.groupId != null && Object.hasOwnProperty.call(message, "groupId"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.groupId);
                if (message.groupName != null && Object.hasOwnProperty.call(message, "groupName"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.groupName);
                return writer;
            };

            /**
             * Encodes the specified ModifyGroupNameRequest message, length delimited. Does not implicitly {@link kritor.group.ModifyGroupNameRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.group.ModifyGroupNameRequest
             * @static
             * @param {kritor.group.IModifyGroupNameRequest} message ModifyGroupNameRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ModifyGroupNameRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a ModifyGroupNameRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.group.ModifyGroupNameRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.group.ModifyGroupNameRequest} ModifyGroupNameRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ModifyGroupNameRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.group.ModifyGroupNameRequest();
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
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a ModifyGroupNameRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.group.ModifyGroupNameRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.group.ModifyGroupNameRequest} ModifyGroupNameRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ModifyGroupNameRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a ModifyGroupNameRequest message.
             * @function verify
             * @memberof kritor.group.ModifyGroupNameRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ModifyGroupNameRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.groupId != null && message.hasOwnProperty("groupId"))
                    if (!$util.isInteger(message.groupId) && !(message.groupId && $util.isInteger(message.groupId.low) && $util.isInteger(message.groupId.high)))
                        return "groupId: integer|Long expected";
                if (message.groupName != null && message.hasOwnProperty("groupName"))
                    if (!$util.isString(message.groupName))
                        return "groupName: string expected";
                return null;
            };

            /**
             * Creates a ModifyGroupNameRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.group.ModifyGroupNameRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.group.ModifyGroupNameRequest} ModifyGroupNameRequest
             */
            ModifyGroupNameRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.group.ModifyGroupNameRequest)
                    return object;
                let message = new $root.kritor.group.ModifyGroupNameRequest();
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
                return message;
            };

            /**
             * Creates a plain object from a ModifyGroupNameRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.group.ModifyGroupNameRequest
             * @static
             * @param {kritor.group.ModifyGroupNameRequest} message ModifyGroupNameRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ModifyGroupNameRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.groupId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.groupId = options.longs === String ? "0" : 0;
                    object.groupName = "";
                }
                if (message.groupId != null && message.hasOwnProperty("groupId"))
                    if (typeof message.groupId === "number")
                        object.groupId = options.longs === String ? String(message.groupId) : message.groupId;
                    else
                        object.groupId = options.longs === String ? $util.Long.prototype.toString.call(message.groupId) : options.longs === Number ? new $util.LongBits(message.groupId.low >>> 0, message.groupId.high >>> 0).toNumber(true) : message.groupId;
                if (message.groupName != null && message.hasOwnProperty("groupName"))
                    object.groupName = message.groupName;
                return object;
            };

            /**
             * Converts this ModifyGroupNameRequest to JSON.
             * @function toJSON
             * @memberof kritor.group.ModifyGroupNameRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ModifyGroupNameRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for ModifyGroupNameRequest
             * @function getTypeUrl
             * @memberof kritor.group.ModifyGroupNameRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            ModifyGroupNameRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.group.ModifyGroupNameRequest";
            };

            return ModifyGroupNameRequest;
        })();

        group.ModifyGroupNameResponse = (function() {

            /**
             * Properties of a ModifyGroupNameResponse.
             * @memberof kritor.group
             * @interface IModifyGroupNameResponse
             */

            /**
             * Constructs a new ModifyGroupNameResponse.
             * @memberof kritor.group
             * @classdesc Represents a ModifyGroupNameResponse.
             * @implements IModifyGroupNameResponse
             * @constructor
             * @param {kritor.group.IModifyGroupNameResponse=} [properties] Properties to set
             */
            function ModifyGroupNameResponse(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Creates a new ModifyGroupNameResponse instance using the specified properties.
             * @function create
             * @memberof kritor.group.ModifyGroupNameResponse
             * @static
             * @param {kritor.group.IModifyGroupNameResponse=} [properties] Properties to set
             * @returns {kritor.group.ModifyGroupNameResponse} ModifyGroupNameResponse instance
             */
            ModifyGroupNameResponse.create = function create(properties) {
                return new ModifyGroupNameResponse(properties);
            };

            /**
             * Encodes the specified ModifyGroupNameResponse message. Does not implicitly {@link kritor.group.ModifyGroupNameResponse.verify|verify} messages.
             * @function encode
             * @memberof kritor.group.ModifyGroupNameResponse
             * @static
             * @param {kritor.group.IModifyGroupNameResponse} message ModifyGroupNameResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ModifyGroupNameResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                return writer;
            };

            /**
             * Encodes the specified ModifyGroupNameResponse message, length delimited. Does not implicitly {@link kritor.group.ModifyGroupNameResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.group.ModifyGroupNameResponse
             * @static
             * @param {kritor.group.IModifyGroupNameResponse} message ModifyGroupNameResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ModifyGroupNameResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a ModifyGroupNameResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.group.ModifyGroupNameResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.group.ModifyGroupNameResponse} ModifyGroupNameResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ModifyGroupNameResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.group.ModifyGroupNameResponse();
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
             * Decodes a ModifyGroupNameResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.group.ModifyGroupNameResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.group.ModifyGroupNameResponse} ModifyGroupNameResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ModifyGroupNameResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a ModifyGroupNameResponse message.
             * @function verify
             * @memberof kritor.group.ModifyGroupNameResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ModifyGroupNameResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                return null;
            };

            /**
             * Creates a ModifyGroupNameResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.group.ModifyGroupNameResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.group.ModifyGroupNameResponse} ModifyGroupNameResponse
             */
            ModifyGroupNameResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.group.ModifyGroupNameResponse)
                    return object;
                return new $root.kritor.group.ModifyGroupNameResponse();
            };

            /**
             * Creates a plain object from a ModifyGroupNameResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.group.ModifyGroupNameResponse
             * @static
             * @param {kritor.group.ModifyGroupNameResponse} message ModifyGroupNameResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ModifyGroupNameResponse.toObject = function toObject() {
                return {};
            };

            /**
             * Converts this ModifyGroupNameResponse to JSON.
             * @function toJSON
             * @memberof kritor.group.ModifyGroupNameResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ModifyGroupNameResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for ModifyGroupNameResponse
             * @function getTypeUrl
             * @memberof kritor.group.ModifyGroupNameResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            ModifyGroupNameResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.group.ModifyGroupNameResponse";
            };

            return ModifyGroupNameResponse;
        })();

        group.ModifyGroupRemarkRequest = (function() {

            /**
             * Properties of a ModifyGroupRemarkRequest.
             * @memberof kritor.group
             * @interface IModifyGroupRemarkRequest
             * @property {number|Long|null} [groupId] ModifyGroupRemarkRequest groupId
             * @property {string|null} [remark] ModifyGroupRemarkRequest remark
             */

            /**
             * Constructs a new ModifyGroupRemarkRequest.
             * @memberof kritor.group
             * @classdesc Represents a ModifyGroupRemarkRequest.
             * @implements IModifyGroupRemarkRequest
             * @constructor
             * @param {kritor.group.IModifyGroupRemarkRequest=} [properties] Properties to set
             */
            function ModifyGroupRemarkRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * ModifyGroupRemarkRequest groupId.
             * @member {number|Long} groupId
             * @memberof kritor.group.ModifyGroupRemarkRequest
             * @instance
             */
            ModifyGroupRemarkRequest.prototype.groupId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * ModifyGroupRemarkRequest remark.
             * @member {string} remark
             * @memberof kritor.group.ModifyGroupRemarkRequest
             * @instance
             */
            ModifyGroupRemarkRequest.prototype.remark = "";

            /**
             * Creates a new ModifyGroupRemarkRequest instance using the specified properties.
             * @function create
             * @memberof kritor.group.ModifyGroupRemarkRequest
             * @static
             * @param {kritor.group.IModifyGroupRemarkRequest=} [properties] Properties to set
             * @returns {kritor.group.ModifyGroupRemarkRequest} ModifyGroupRemarkRequest instance
             */
            ModifyGroupRemarkRequest.create = function create(properties) {
                return new ModifyGroupRemarkRequest(properties);
            };

            /**
             * Encodes the specified ModifyGroupRemarkRequest message. Does not implicitly {@link kritor.group.ModifyGroupRemarkRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.group.ModifyGroupRemarkRequest
             * @static
             * @param {kritor.group.IModifyGroupRemarkRequest} message ModifyGroupRemarkRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ModifyGroupRemarkRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.groupId != null && Object.hasOwnProperty.call(message, "groupId"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.groupId);
                if (message.remark != null && Object.hasOwnProperty.call(message, "remark"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.remark);
                return writer;
            };

            /**
             * Encodes the specified ModifyGroupRemarkRequest message, length delimited. Does not implicitly {@link kritor.group.ModifyGroupRemarkRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.group.ModifyGroupRemarkRequest
             * @static
             * @param {kritor.group.IModifyGroupRemarkRequest} message ModifyGroupRemarkRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ModifyGroupRemarkRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a ModifyGroupRemarkRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.group.ModifyGroupRemarkRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.group.ModifyGroupRemarkRequest} ModifyGroupRemarkRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ModifyGroupRemarkRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.group.ModifyGroupRemarkRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.groupId = reader.uint64();
                            break;
                        }
                    case 2: {
                            message.remark = reader.string();
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
             * Decodes a ModifyGroupRemarkRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.group.ModifyGroupRemarkRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.group.ModifyGroupRemarkRequest} ModifyGroupRemarkRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ModifyGroupRemarkRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a ModifyGroupRemarkRequest message.
             * @function verify
             * @memberof kritor.group.ModifyGroupRemarkRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ModifyGroupRemarkRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.groupId != null && message.hasOwnProperty("groupId"))
                    if (!$util.isInteger(message.groupId) && !(message.groupId && $util.isInteger(message.groupId.low) && $util.isInteger(message.groupId.high)))
                        return "groupId: integer|Long expected";
                if (message.remark != null && message.hasOwnProperty("remark"))
                    if (!$util.isString(message.remark))
                        return "remark: string expected";
                return null;
            };

            /**
             * Creates a ModifyGroupRemarkRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.group.ModifyGroupRemarkRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.group.ModifyGroupRemarkRequest} ModifyGroupRemarkRequest
             */
            ModifyGroupRemarkRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.group.ModifyGroupRemarkRequest)
                    return object;
                let message = new $root.kritor.group.ModifyGroupRemarkRequest();
                if (object.groupId != null)
                    if ($util.Long)
                        (message.groupId = $util.Long.fromValue(object.groupId)).unsigned = true;
                    else if (typeof object.groupId === "string")
                        message.groupId = parseInt(object.groupId, 10);
                    else if (typeof object.groupId === "number")
                        message.groupId = object.groupId;
                    else if (typeof object.groupId === "object")
                        message.groupId = new $util.LongBits(object.groupId.low >>> 0, object.groupId.high >>> 0).toNumber(true);
                if (object.remark != null)
                    message.remark = String(object.remark);
                return message;
            };

            /**
             * Creates a plain object from a ModifyGroupRemarkRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.group.ModifyGroupRemarkRequest
             * @static
             * @param {kritor.group.ModifyGroupRemarkRequest} message ModifyGroupRemarkRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ModifyGroupRemarkRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.groupId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.groupId = options.longs === String ? "0" : 0;
                    object.remark = "";
                }
                if (message.groupId != null && message.hasOwnProperty("groupId"))
                    if (typeof message.groupId === "number")
                        object.groupId = options.longs === String ? String(message.groupId) : message.groupId;
                    else
                        object.groupId = options.longs === String ? $util.Long.prototype.toString.call(message.groupId) : options.longs === Number ? new $util.LongBits(message.groupId.low >>> 0, message.groupId.high >>> 0).toNumber(true) : message.groupId;
                if (message.remark != null && message.hasOwnProperty("remark"))
                    object.remark = message.remark;
                return object;
            };

            /**
             * Converts this ModifyGroupRemarkRequest to JSON.
             * @function toJSON
             * @memberof kritor.group.ModifyGroupRemarkRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ModifyGroupRemarkRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for ModifyGroupRemarkRequest
             * @function getTypeUrl
             * @memberof kritor.group.ModifyGroupRemarkRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            ModifyGroupRemarkRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.group.ModifyGroupRemarkRequest";
            };

            return ModifyGroupRemarkRequest;
        })();

        group.ModifyGroupRemarkResponse = (function() {

            /**
             * Properties of a ModifyGroupRemarkResponse.
             * @memberof kritor.group
             * @interface IModifyGroupRemarkResponse
             */

            /**
             * Constructs a new ModifyGroupRemarkResponse.
             * @memberof kritor.group
             * @classdesc Represents a ModifyGroupRemarkResponse.
             * @implements IModifyGroupRemarkResponse
             * @constructor
             * @param {kritor.group.IModifyGroupRemarkResponse=} [properties] Properties to set
             */
            function ModifyGroupRemarkResponse(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Creates a new ModifyGroupRemarkResponse instance using the specified properties.
             * @function create
             * @memberof kritor.group.ModifyGroupRemarkResponse
             * @static
             * @param {kritor.group.IModifyGroupRemarkResponse=} [properties] Properties to set
             * @returns {kritor.group.ModifyGroupRemarkResponse} ModifyGroupRemarkResponse instance
             */
            ModifyGroupRemarkResponse.create = function create(properties) {
                return new ModifyGroupRemarkResponse(properties);
            };

            /**
             * Encodes the specified ModifyGroupRemarkResponse message. Does not implicitly {@link kritor.group.ModifyGroupRemarkResponse.verify|verify} messages.
             * @function encode
             * @memberof kritor.group.ModifyGroupRemarkResponse
             * @static
             * @param {kritor.group.IModifyGroupRemarkResponse} message ModifyGroupRemarkResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ModifyGroupRemarkResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                return writer;
            };

            /**
             * Encodes the specified ModifyGroupRemarkResponse message, length delimited. Does not implicitly {@link kritor.group.ModifyGroupRemarkResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.group.ModifyGroupRemarkResponse
             * @static
             * @param {kritor.group.IModifyGroupRemarkResponse} message ModifyGroupRemarkResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ModifyGroupRemarkResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a ModifyGroupRemarkResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.group.ModifyGroupRemarkResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.group.ModifyGroupRemarkResponse} ModifyGroupRemarkResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ModifyGroupRemarkResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.group.ModifyGroupRemarkResponse();
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
             * Decodes a ModifyGroupRemarkResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.group.ModifyGroupRemarkResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.group.ModifyGroupRemarkResponse} ModifyGroupRemarkResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ModifyGroupRemarkResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a ModifyGroupRemarkResponse message.
             * @function verify
             * @memberof kritor.group.ModifyGroupRemarkResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ModifyGroupRemarkResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                return null;
            };

            /**
             * Creates a ModifyGroupRemarkResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.group.ModifyGroupRemarkResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.group.ModifyGroupRemarkResponse} ModifyGroupRemarkResponse
             */
            ModifyGroupRemarkResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.group.ModifyGroupRemarkResponse)
                    return object;
                return new $root.kritor.group.ModifyGroupRemarkResponse();
            };

            /**
             * Creates a plain object from a ModifyGroupRemarkResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.group.ModifyGroupRemarkResponse
             * @static
             * @param {kritor.group.ModifyGroupRemarkResponse} message ModifyGroupRemarkResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ModifyGroupRemarkResponse.toObject = function toObject() {
                return {};
            };

            /**
             * Converts this ModifyGroupRemarkResponse to JSON.
             * @function toJSON
             * @memberof kritor.group.ModifyGroupRemarkResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ModifyGroupRemarkResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for ModifyGroupRemarkResponse
             * @function getTypeUrl
             * @memberof kritor.group.ModifyGroupRemarkResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            ModifyGroupRemarkResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.group.ModifyGroupRemarkResponse";
            };

            return ModifyGroupRemarkResponse;
        })();

        group.SetGroupAdminRequest = (function() {

            /**
             * Properties of a SetGroupAdminRequest.
             * @memberof kritor.group
             * @interface ISetGroupAdminRequest
             * @property {number|Long|null} [groupId] SetGroupAdminRequest groupId
             * @property {string|null} [targetUid] SetGroupAdminRequest targetUid
             * @property {number|Long|null} [targetUin] SetGroupAdminRequest targetUin
             * @property {boolean|null} [isAdmin] SetGroupAdminRequest isAdmin
             */

            /**
             * Constructs a new SetGroupAdminRequest.
             * @memberof kritor.group
             * @classdesc Represents a SetGroupAdminRequest.
             * @implements ISetGroupAdminRequest
             * @constructor
             * @param {kritor.group.ISetGroupAdminRequest=} [properties] Properties to set
             */
            function SetGroupAdminRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * SetGroupAdminRequest groupId.
             * @member {number|Long} groupId
             * @memberof kritor.group.SetGroupAdminRequest
             * @instance
             */
            SetGroupAdminRequest.prototype.groupId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * SetGroupAdminRequest targetUid.
             * @member {string|null|undefined} targetUid
             * @memberof kritor.group.SetGroupAdminRequest
             * @instance
             */
            SetGroupAdminRequest.prototype.targetUid = null;

            /**
             * SetGroupAdminRequest targetUin.
             * @member {number|Long|null|undefined} targetUin
             * @memberof kritor.group.SetGroupAdminRequest
             * @instance
             */
            SetGroupAdminRequest.prototype.targetUin = null;

            /**
             * SetGroupAdminRequest isAdmin.
             * @member {boolean} isAdmin
             * @memberof kritor.group.SetGroupAdminRequest
             * @instance
             */
            SetGroupAdminRequest.prototype.isAdmin = false;

            // OneOf field names bound to virtual getters and setters
            let $oneOfFields;

            /**
             * SetGroupAdminRequest target.
             * @member {"targetUid"|"targetUin"|undefined} target
             * @memberof kritor.group.SetGroupAdminRequest
             * @instance
             */
            Object.defineProperty(SetGroupAdminRequest.prototype, "target", {
                get: $util.oneOfGetter($oneOfFields = ["targetUid", "targetUin"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new SetGroupAdminRequest instance using the specified properties.
             * @function create
             * @memberof kritor.group.SetGroupAdminRequest
             * @static
             * @param {kritor.group.ISetGroupAdminRequest=} [properties] Properties to set
             * @returns {kritor.group.SetGroupAdminRequest} SetGroupAdminRequest instance
             */
            SetGroupAdminRequest.create = function create(properties) {
                return new SetGroupAdminRequest(properties);
            };

            /**
             * Encodes the specified SetGroupAdminRequest message. Does not implicitly {@link kritor.group.SetGroupAdminRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.group.SetGroupAdminRequest
             * @static
             * @param {kritor.group.ISetGroupAdminRequest} message SetGroupAdminRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SetGroupAdminRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.groupId != null && Object.hasOwnProperty.call(message, "groupId"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.groupId);
                if (message.targetUid != null && Object.hasOwnProperty.call(message, "targetUid"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.targetUid);
                if (message.targetUin != null && Object.hasOwnProperty.call(message, "targetUin"))
                    writer.uint32(/* id 3, wireType 0 =*/24).uint64(message.targetUin);
                if (message.isAdmin != null && Object.hasOwnProperty.call(message, "isAdmin"))
                    writer.uint32(/* id 4, wireType 0 =*/32).bool(message.isAdmin);
                return writer;
            };

            /**
             * Encodes the specified SetGroupAdminRequest message, length delimited. Does not implicitly {@link kritor.group.SetGroupAdminRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.group.SetGroupAdminRequest
             * @static
             * @param {kritor.group.ISetGroupAdminRequest} message SetGroupAdminRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SetGroupAdminRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a SetGroupAdminRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.group.SetGroupAdminRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.group.SetGroupAdminRequest} SetGroupAdminRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SetGroupAdminRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.group.SetGroupAdminRequest();
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
             * Decodes a SetGroupAdminRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.group.SetGroupAdminRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.group.SetGroupAdminRequest} SetGroupAdminRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SetGroupAdminRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a SetGroupAdminRequest message.
             * @function verify
             * @memberof kritor.group.SetGroupAdminRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            SetGroupAdminRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                let properties = {};
                if (message.groupId != null && message.hasOwnProperty("groupId"))
                    if (!$util.isInteger(message.groupId) && !(message.groupId && $util.isInteger(message.groupId.low) && $util.isInteger(message.groupId.high)))
                        return "groupId: integer|Long expected";
                if (message.targetUid != null && message.hasOwnProperty("targetUid")) {
                    properties.target = 1;
                    if (!$util.isString(message.targetUid))
                        return "targetUid: string expected";
                }
                if (message.targetUin != null && message.hasOwnProperty("targetUin")) {
                    if (properties.target === 1)
                        return "target: multiple values";
                    properties.target = 1;
                    if (!$util.isInteger(message.targetUin) && !(message.targetUin && $util.isInteger(message.targetUin.low) && $util.isInteger(message.targetUin.high)))
                        return "targetUin: integer|Long expected";
                }
                if (message.isAdmin != null && message.hasOwnProperty("isAdmin"))
                    if (typeof message.isAdmin !== "boolean")
                        return "isAdmin: boolean expected";
                return null;
            };

            /**
             * Creates a SetGroupAdminRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.group.SetGroupAdminRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.group.SetGroupAdminRequest} SetGroupAdminRequest
             */
            SetGroupAdminRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.group.SetGroupAdminRequest)
                    return object;
                let message = new $root.kritor.group.SetGroupAdminRequest();
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
             * Creates a plain object from a SetGroupAdminRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.group.SetGroupAdminRequest
             * @static
             * @param {kritor.group.SetGroupAdminRequest} message SetGroupAdminRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            SetGroupAdminRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.groupId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.groupId = options.longs === String ? "0" : 0;
                    object.isAdmin = false;
                }
                if (message.groupId != null && message.hasOwnProperty("groupId"))
                    if (typeof message.groupId === "number")
                        object.groupId = options.longs === String ? String(message.groupId) : message.groupId;
                    else
                        object.groupId = options.longs === String ? $util.Long.prototype.toString.call(message.groupId) : options.longs === Number ? new $util.LongBits(message.groupId.low >>> 0, message.groupId.high >>> 0).toNumber(true) : message.groupId;
                if (message.targetUid != null && message.hasOwnProperty("targetUid")) {
                    object.targetUid = message.targetUid;
                    if (options.oneofs)
                        object.target = "targetUid";
                }
                if (message.targetUin != null && message.hasOwnProperty("targetUin")) {
                    if (typeof message.targetUin === "number")
                        object.targetUin = options.longs === String ? String(message.targetUin) : message.targetUin;
                    else
                        object.targetUin = options.longs === String ? $util.Long.prototype.toString.call(message.targetUin) : options.longs === Number ? new $util.LongBits(message.targetUin.low >>> 0, message.targetUin.high >>> 0).toNumber(true) : message.targetUin;
                    if (options.oneofs)
                        object.target = "targetUin";
                }
                if (message.isAdmin != null && message.hasOwnProperty("isAdmin"))
                    object.isAdmin = message.isAdmin;
                return object;
            };

            /**
             * Converts this SetGroupAdminRequest to JSON.
             * @function toJSON
             * @memberof kritor.group.SetGroupAdminRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            SetGroupAdminRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for SetGroupAdminRequest
             * @function getTypeUrl
             * @memberof kritor.group.SetGroupAdminRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            SetGroupAdminRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.group.SetGroupAdminRequest";
            };

            return SetGroupAdminRequest;
        })();

        group.SetGroupAdminResponse = (function() {

            /**
             * Properties of a SetGroupAdminResponse.
             * @memberof kritor.group
             * @interface ISetGroupAdminResponse
             */

            /**
             * Constructs a new SetGroupAdminResponse.
             * @memberof kritor.group
             * @classdesc Represents a SetGroupAdminResponse.
             * @implements ISetGroupAdminResponse
             * @constructor
             * @param {kritor.group.ISetGroupAdminResponse=} [properties] Properties to set
             */
            function SetGroupAdminResponse(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Creates a new SetGroupAdminResponse instance using the specified properties.
             * @function create
             * @memberof kritor.group.SetGroupAdminResponse
             * @static
             * @param {kritor.group.ISetGroupAdminResponse=} [properties] Properties to set
             * @returns {kritor.group.SetGroupAdminResponse} SetGroupAdminResponse instance
             */
            SetGroupAdminResponse.create = function create(properties) {
                return new SetGroupAdminResponse(properties);
            };

            /**
             * Encodes the specified SetGroupAdminResponse message. Does not implicitly {@link kritor.group.SetGroupAdminResponse.verify|verify} messages.
             * @function encode
             * @memberof kritor.group.SetGroupAdminResponse
             * @static
             * @param {kritor.group.ISetGroupAdminResponse} message SetGroupAdminResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SetGroupAdminResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                return writer;
            };

            /**
             * Encodes the specified SetGroupAdminResponse message, length delimited. Does not implicitly {@link kritor.group.SetGroupAdminResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.group.SetGroupAdminResponse
             * @static
             * @param {kritor.group.ISetGroupAdminResponse} message SetGroupAdminResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SetGroupAdminResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a SetGroupAdminResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.group.SetGroupAdminResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.group.SetGroupAdminResponse} SetGroupAdminResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SetGroupAdminResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.group.SetGroupAdminResponse();
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
             * Decodes a SetGroupAdminResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.group.SetGroupAdminResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.group.SetGroupAdminResponse} SetGroupAdminResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SetGroupAdminResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a SetGroupAdminResponse message.
             * @function verify
             * @memberof kritor.group.SetGroupAdminResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            SetGroupAdminResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                return null;
            };

            /**
             * Creates a SetGroupAdminResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.group.SetGroupAdminResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.group.SetGroupAdminResponse} SetGroupAdminResponse
             */
            SetGroupAdminResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.group.SetGroupAdminResponse)
                    return object;
                return new $root.kritor.group.SetGroupAdminResponse();
            };

            /**
             * Creates a plain object from a SetGroupAdminResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.group.SetGroupAdminResponse
             * @static
             * @param {kritor.group.SetGroupAdminResponse} message SetGroupAdminResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            SetGroupAdminResponse.toObject = function toObject() {
                return {};
            };

            /**
             * Converts this SetGroupAdminResponse to JSON.
             * @function toJSON
             * @memberof kritor.group.SetGroupAdminResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            SetGroupAdminResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for SetGroupAdminResponse
             * @function getTypeUrl
             * @memberof kritor.group.SetGroupAdminResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            SetGroupAdminResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.group.SetGroupAdminResponse";
            };

            return SetGroupAdminResponse;
        })();

        group.SetGroupUniqueTitleRequest = (function() {

            /**
             * Properties of a SetGroupUniqueTitleRequest.
             * @memberof kritor.group
             * @interface ISetGroupUniqueTitleRequest
             * @property {number|Long|null} [groupId] SetGroupUniqueTitleRequest groupId
             * @property {string|null} [targetUid] SetGroupUniqueTitleRequest targetUid
             * @property {number|Long|null} [targetUin] SetGroupUniqueTitleRequest targetUin
             * @property {string|null} [uniqueTitle] SetGroupUniqueTitleRequest uniqueTitle
             */

            /**
             * Constructs a new SetGroupUniqueTitleRequest.
             * @memberof kritor.group
             * @classdesc Represents a SetGroupUniqueTitleRequest.
             * @implements ISetGroupUniqueTitleRequest
             * @constructor
             * @param {kritor.group.ISetGroupUniqueTitleRequest=} [properties] Properties to set
             */
            function SetGroupUniqueTitleRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * SetGroupUniqueTitleRequest groupId.
             * @member {number|Long} groupId
             * @memberof kritor.group.SetGroupUniqueTitleRequest
             * @instance
             */
            SetGroupUniqueTitleRequest.prototype.groupId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * SetGroupUniqueTitleRequest targetUid.
             * @member {string|null|undefined} targetUid
             * @memberof kritor.group.SetGroupUniqueTitleRequest
             * @instance
             */
            SetGroupUniqueTitleRequest.prototype.targetUid = null;

            /**
             * SetGroupUniqueTitleRequest targetUin.
             * @member {number|Long|null|undefined} targetUin
             * @memberof kritor.group.SetGroupUniqueTitleRequest
             * @instance
             */
            SetGroupUniqueTitleRequest.prototype.targetUin = null;

            /**
             * SetGroupUniqueTitleRequest uniqueTitle.
             * @member {string} uniqueTitle
             * @memberof kritor.group.SetGroupUniqueTitleRequest
             * @instance
             */
            SetGroupUniqueTitleRequest.prototype.uniqueTitle = "";

            // OneOf field names bound to virtual getters and setters
            let $oneOfFields;

            /**
             * SetGroupUniqueTitleRequest target.
             * @member {"targetUid"|"targetUin"|undefined} target
             * @memberof kritor.group.SetGroupUniqueTitleRequest
             * @instance
             */
            Object.defineProperty(SetGroupUniqueTitleRequest.prototype, "target", {
                get: $util.oneOfGetter($oneOfFields = ["targetUid", "targetUin"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new SetGroupUniqueTitleRequest instance using the specified properties.
             * @function create
             * @memberof kritor.group.SetGroupUniqueTitleRequest
             * @static
             * @param {kritor.group.ISetGroupUniqueTitleRequest=} [properties] Properties to set
             * @returns {kritor.group.SetGroupUniqueTitleRequest} SetGroupUniqueTitleRequest instance
             */
            SetGroupUniqueTitleRequest.create = function create(properties) {
                return new SetGroupUniqueTitleRequest(properties);
            };

            /**
             * Encodes the specified SetGroupUniqueTitleRequest message. Does not implicitly {@link kritor.group.SetGroupUniqueTitleRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.group.SetGroupUniqueTitleRequest
             * @static
             * @param {kritor.group.ISetGroupUniqueTitleRequest} message SetGroupUniqueTitleRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SetGroupUniqueTitleRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.groupId != null && Object.hasOwnProperty.call(message, "groupId"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.groupId);
                if (message.targetUid != null && Object.hasOwnProperty.call(message, "targetUid"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.targetUid);
                if (message.targetUin != null && Object.hasOwnProperty.call(message, "targetUin"))
                    writer.uint32(/* id 3, wireType 0 =*/24).uint64(message.targetUin);
                if (message.uniqueTitle != null && Object.hasOwnProperty.call(message, "uniqueTitle"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.uniqueTitle);
                return writer;
            };

            /**
             * Encodes the specified SetGroupUniqueTitleRequest message, length delimited. Does not implicitly {@link kritor.group.SetGroupUniqueTitleRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.group.SetGroupUniqueTitleRequest
             * @static
             * @param {kritor.group.ISetGroupUniqueTitleRequest} message SetGroupUniqueTitleRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SetGroupUniqueTitleRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a SetGroupUniqueTitleRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.group.SetGroupUniqueTitleRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.group.SetGroupUniqueTitleRequest} SetGroupUniqueTitleRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SetGroupUniqueTitleRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.group.SetGroupUniqueTitleRequest();
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
                            message.uniqueTitle = reader.string();
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
             * Decodes a SetGroupUniqueTitleRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.group.SetGroupUniqueTitleRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.group.SetGroupUniqueTitleRequest} SetGroupUniqueTitleRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SetGroupUniqueTitleRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a SetGroupUniqueTitleRequest message.
             * @function verify
             * @memberof kritor.group.SetGroupUniqueTitleRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            SetGroupUniqueTitleRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                let properties = {};
                if (message.groupId != null && message.hasOwnProperty("groupId"))
                    if (!$util.isInteger(message.groupId) && !(message.groupId && $util.isInteger(message.groupId.low) && $util.isInteger(message.groupId.high)))
                        return "groupId: integer|Long expected";
                if (message.targetUid != null && message.hasOwnProperty("targetUid")) {
                    properties.target = 1;
                    if (!$util.isString(message.targetUid))
                        return "targetUid: string expected";
                }
                if (message.targetUin != null && message.hasOwnProperty("targetUin")) {
                    if (properties.target === 1)
                        return "target: multiple values";
                    properties.target = 1;
                    if (!$util.isInteger(message.targetUin) && !(message.targetUin && $util.isInteger(message.targetUin.low) && $util.isInteger(message.targetUin.high)))
                        return "targetUin: integer|Long expected";
                }
                if (message.uniqueTitle != null && message.hasOwnProperty("uniqueTitle"))
                    if (!$util.isString(message.uniqueTitle))
                        return "uniqueTitle: string expected";
                return null;
            };

            /**
             * Creates a SetGroupUniqueTitleRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.group.SetGroupUniqueTitleRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.group.SetGroupUniqueTitleRequest} SetGroupUniqueTitleRequest
             */
            SetGroupUniqueTitleRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.group.SetGroupUniqueTitleRequest)
                    return object;
                let message = new $root.kritor.group.SetGroupUniqueTitleRequest();
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
                if (object.uniqueTitle != null)
                    message.uniqueTitle = String(object.uniqueTitle);
                return message;
            };

            /**
             * Creates a plain object from a SetGroupUniqueTitleRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.group.SetGroupUniqueTitleRequest
             * @static
             * @param {kritor.group.SetGroupUniqueTitleRequest} message SetGroupUniqueTitleRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            SetGroupUniqueTitleRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.groupId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.groupId = options.longs === String ? "0" : 0;
                    object.uniqueTitle = "";
                }
                if (message.groupId != null && message.hasOwnProperty("groupId"))
                    if (typeof message.groupId === "number")
                        object.groupId = options.longs === String ? String(message.groupId) : message.groupId;
                    else
                        object.groupId = options.longs === String ? $util.Long.prototype.toString.call(message.groupId) : options.longs === Number ? new $util.LongBits(message.groupId.low >>> 0, message.groupId.high >>> 0).toNumber(true) : message.groupId;
                if (message.targetUid != null && message.hasOwnProperty("targetUid")) {
                    object.targetUid = message.targetUid;
                    if (options.oneofs)
                        object.target = "targetUid";
                }
                if (message.targetUin != null && message.hasOwnProperty("targetUin")) {
                    if (typeof message.targetUin === "number")
                        object.targetUin = options.longs === String ? String(message.targetUin) : message.targetUin;
                    else
                        object.targetUin = options.longs === String ? $util.Long.prototype.toString.call(message.targetUin) : options.longs === Number ? new $util.LongBits(message.targetUin.low >>> 0, message.targetUin.high >>> 0).toNumber(true) : message.targetUin;
                    if (options.oneofs)
                        object.target = "targetUin";
                }
                if (message.uniqueTitle != null && message.hasOwnProperty("uniqueTitle"))
                    object.uniqueTitle = message.uniqueTitle;
                return object;
            };

            /**
             * Converts this SetGroupUniqueTitleRequest to JSON.
             * @function toJSON
             * @memberof kritor.group.SetGroupUniqueTitleRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            SetGroupUniqueTitleRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for SetGroupUniqueTitleRequest
             * @function getTypeUrl
             * @memberof kritor.group.SetGroupUniqueTitleRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            SetGroupUniqueTitleRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.group.SetGroupUniqueTitleRequest";
            };

            return SetGroupUniqueTitleRequest;
        })();

        group.SetGroupUniqueTitleResponse = (function() {

            /**
             * Properties of a SetGroupUniqueTitleResponse.
             * @memberof kritor.group
             * @interface ISetGroupUniqueTitleResponse
             */

            /**
             * Constructs a new SetGroupUniqueTitleResponse.
             * @memberof kritor.group
             * @classdesc Represents a SetGroupUniqueTitleResponse.
             * @implements ISetGroupUniqueTitleResponse
             * @constructor
             * @param {kritor.group.ISetGroupUniqueTitleResponse=} [properties] Properties to set
             */
            function SetGroupUniqueTitleResponse(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Creates a new SetGroupUniqueTitleResponse instance using the specified properties.
             * @function create
             * @memberof kritor.group.SetGroupUniqueTitleResponse
             * @static
             * @param {kritor.group.ISetGroupUniqueTitleResponse=} [properties] Properties to set
             * @returns {kritor.group.SetGroupUniqueTitleResponse} SetGroupUniqueTitleResponse instance
             */
            SetGroupUniqueTitleResponse.create = function create(properties) {
                return new SetGroupUniqueTitleResponse(properties);
            };

            /**
             * Encodes the specified SetGroupUniqueTitleResponse message. Does not implicitly {@link kritor.group.SetGroupUniqueTitleResponse.verify|verify} messages.
             * @function encode
             * @memberof kritor.group.SetGroupUniqueTitleResponse
             * @static
             * @param {kritor.group.ISetGroupUniqueTitleResponse} message SetGroupUniqueTitleResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SetGroupUniqueTitleResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                return writer;
            };

            /**
             * Encodes the specified SetGroupUniqueTitleResponse message, length delimited. Does not implicitly {@link kritor.group.SetGroupUniqueTitleResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.group.SetGroupUniqueTitleResponse
             * @static
             * @param {kritor.group.ISetGroupUniqueTitleResponse} message SetGroupUniqueTitleResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SetGroupUniqueTitleResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a SetGroupUniqueTitleResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.group.SetGroupUniqueTitleResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.group.SetGroupUniqueTitleResponse} SetGroupUniqueTitleResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SetGroupUniqueTitleResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.group.SetGroupUniqueTitleResponse();
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
             * Decodes a SetGroupUniqueTitleResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.group.SetGroupUniqueTitleResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.group.SetGroupUniqueTitleResponse} SetGroupUniqueTitleResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SetGroupUniqueTitleResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a SetGroupUniqueTitleResponse message.
             * @function verify
             * @memberof kritor.group.SetGroupUniqueTitleResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            SetGroupUniqueTitleResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                return null;
            };

            /**
             * Creates a SetGroupUniqueTitleResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.group.SetGroupUniqueTitleResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.group.SetGroupUniqueTitleResponse} SetGroupUniqueTitleResponse
             */
            SetGroupUniqueTitleResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.group.SetGroupUniqueTitleResponse)
                    return object;
                return new $root.kritor.group.SetGroupUniqueTitleResponse();
            };

            /**
             * Creates a plain object from a SetGroupUniqueTitleResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.group.SetGroupUniqueTitleResponse
             * @static
             * @param {kritor.group.SetGroupUniqueTitleResponse} message SetGroupUniqueTitleResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            SetGroupUniqueTitleResponse.toObject = function toObject() {
                return {};
            };

            /**
             * Converts this SetGroupUniqueTitleResponse to JSON.
             * @function toJSON
             * @memberof kritor.group.SetGroupUniqueTitleResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            SetGroupUniqueTitleResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for SetGroupUniqueTitleResponse
             * @function getTypeUrl
             * @memberof kritor.group.SetGroupUniqueTitleResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            SetGroupUniqueTitleResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.group.SetGroupUniqueTitleResponse";
            };

            return SetGroupUniqueTitleResponse;
        })();

        group.SetGroupWholeBanRequest = (function() {

            /**
             * Properties of a SetGroupWholeBanRequest.
             * @memberof kritor.group
             * @interface ISetGroupWholeBanRequest
             * @property {number|Long|null} [groupId] SetGroupWholeBanRequest groupId
             * @property {boolean|null} [isBan] SetGroupWholeBanRequest isBan
             */

            /**
             * Constructs a new SetGroupWholeBanRequest.
             * @memberof kritor.group
             * @classdesc Represents a SetGroupWholeBanRequest.
             * @implements ISetGroupWholeBanRequest
             * @constructor
             * @param {kritor.group.ISetGroupWholeBanRequest=} [properties] Properties to set
             */
            function SetGroupWholeBanRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * SetGroupWholeBanRequest groupId.
             * @member {number|Long} groupId
             * @memberof kritor.group.SetGroupWholeBanRequest
             * @instance
             */
            SetGroupWholeBanRequest.prototype.groupId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * SetGroupWholeBanRequest isBan.
             * @member {boolean} isBan
             * @memberof kritor.group.SetGroupWholeBanRequest
             * @instance
             */
            SetGroupWholeBanRequest.prototype.isBan = false;

            /**
             * Creates a new SetGroupWholeBanRequest instance using the specified properties.
             * @function create
             * @memberof kritor.group.SetGroupWholeBanRequest
             * @static
             * @param {kritor.group.ISetGroupWholeBanRequest=} [properties] Properties to set
             * @returns {kritor.group.SetGroupWholeBanRequest} SetGroupWholeBanRequest instance
             */
            SetGroupWholeBanRequest.create = function create(properties) {
                return new SetGroupWholeBanRequest(properties);
            };

            /**
             * Encodes the specified SetGroupWholeBanRequest message. Does not implicitly {@link kritor.group.SetGroupWholeBanRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.group.SetGroupWholeBanRequest
             * @static
             * @param {kritor.group.ISetGroupWholeBanRequest} message SetGroupWholeBanRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SetGroupWholeBanRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.groupId != null && Object.hasOwnProperty.call(message, "groupId"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.groupId);
                if (message.isBan != null && Object.hasOwnProperty.call(message, "isBan"))
                    writer.uint32(/* id 2, wireType 0 =*/16).bool(message.isBan);
                return writer;
            };

            /**
             * Encodes the specified SetGroupWholeBanRequest message, length delimited. Does not implicitly {@link kritor.group.SetGroupWholeBanRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.group.SetGroupWholeBanRequest
             * @static
             * @param {kritor.group.ISetGroupWholeBanRequest} message SetGroupWholeBanRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SetGroupWholeBanRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a SetGroupWholeBanRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.group.SetGroupWholeBanRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.group.SetGroupWholeBanRequest} SetGroupWholeBanRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SetGroupWholeBanRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.group.SetGroupWholeBanRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.groupId = reader.uint64();
                            break;
                        }
                    case 2: {
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
             * Decodes a SetGroupWholeBanRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.group.SetGroupWholeBanRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.group.SetGroupWholeBanRequest} SetGroupWholeBanRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SetGroupWholeBanRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a SetGroupWholeBanRequest message.
             * @function verify
             * @memberof kritor.group.SetGroupWholeBanRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            SetGroupWholeBanRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.groupId != null && message.hasOwnProperty("groupId"))
                    if (!$util.isInteger(message.groupId) && !(message.groupId && $util.isInteger(message.groupId.low) && $util.isInteger(message.groupId.high)))
                        return "groupId: integer|Long expected";
                if (message.isBan != null && message.hasOwnProperty("isBan"))
                    if (typeof message.isBan !== "boolean")
                        return "isBan: boolean expected";
                return null;
            };

            /**
             * Creates a SetGroupWholeBanRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.group.SetGroupWholeBanRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.group.SetGroupWholeBanRequest} SetGroupWholeBanRequest
             */
            SetGroupWholeBanRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.group.SetGroupWholeBanRequest)
                    return object;
                let message = new $root.kritor.group.SetGroupWholeBanRequest();
                if (object.groupId != null)
                    if ($util.Long)
                        (message.groupId = $util.Long.fromValue(object.groupId)).unsigned = true;
                    else if (typeof object.groupId === "string")
                        message.groupId = parseInt(object.groupId, 10);
                    else if (typeof object.groupId === "number")
                        message.groupId = object.groupId;
                    else if (typeof object.groupId === "object")
                        message.groupId = new $util.LongBits(object.groupId.low >>> 0, object.groupId.high >>> 0).toNumber(true);
                if (object.isBan != null)
                    message.isBan = Boolean(object.isBan);
                return message;
            };

            /**
             * Creates a plain object from a SetGroupWholeBanRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.group.SetGroupWholeBanRequest
             * @static
             * @param {kritor.group.SetGroupWholeBanRequest} message SetGroupWholeBanRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            SetGroupWholeBanRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.groupId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.groupId = options.longs === String ? "0" : 0;
                    object.isBan = false;
                }
                if (message.groupId != null && message.hasOwnProperty("groupId"))
                    if (typeof message.groupId === "number")
                        object.groupId = options.longs === String ? String(message.groupId) : message.groupId;
                    else
                        object.groupId = options.longs === String ? $util.Long.prototype.toString.call(message.groupId) : options.longs === Number ? new $util.LongBits(message.groupId.low >>> 0, message.groupId.high >>> 0).toNumber(true) : message.groupId;
                if (message.isBan != null && message.hasOwnProperty("isBan"))
                    object.isBan = message.isBan;
                return object;
            };

            /**
             * Converts this SetGroupWholeBanRequest to JSON.
             * @function toJSON
             * @memberof kritor.group.SetGroupWholeBanRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            SetGroupWholeBanRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for SetGroupWholeBanRequest
             * @function getTypeUrl
             * @memberof kritor.group.SetGroupWholeBanRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            SetGroupWholeBanRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.group.SetGroupWholeBanRequest";
            };

            return SetGroupWholeBanRequest;
        })();

        group.SetGroupWholeBanResponse = (function() {

            /**
             * Properties of a SetGroupWholeBanResponse.
             * @memberof kritor.group
             * @interface ISetGroupWholeBanResponse
             */

            /**
             * Constructs a new SetGroupWholeBanResponse.
             * @memberof kritor.group
             * @classdesc Represents a SetGroupWholeBanResponse.
             * @implements ISetGroupWholeBanResponse
             * @constructor
             * @param {kritor.group.ISetGroupWholeBanResponse=} [properties] Properties to set
             */
            function SetGroupWholeBanResponse(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Creates a new SetGroupWholeBanResponse instance using the specified properties.
             * @function create
             * @memberof kritor.group.SetGroupWholeBanResponse
             * @static
             * @param {kritor.group.ISetGroupWholeBanResponse=} [properties] Properties to set
             * @returns {kritor.group.SetGroupWholeBanResponse} SetGroupWholeBanResponse instance
             */
            SetGroupWholeBanResponse.create = function create(properties) {
                return new SetGroupWholeBanResponse(properties);
            };

            /**
             * Encodes the specified SetGroupWholeBanResponse message. Does not implicitly {@link kritor.group.SetGroupWholeBanResponse.verify|verify} messages.
             * @function encode
             * @memberof kritor.group.SetGroupWholeBanResponse
             * @static
             * @param {kritor.group.ISetGroupWholeBanResponse} message SetGroupWholeBanResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SetGroupWholeBanResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                return writer;
            };

            /**
             * Encodes the specified SetGroupWholeBanResponse message, length delimited. Does not implicitly {@link kritor.group.SetGroupWholeBanResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.group.SetGroupWholeBanResponse
             * @static
             * @param {kritor.group.ISetGroupWholeBanResponse} message SetGroupWholeBanResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SetGroupWholeBanResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a SetGroupWholeBanResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.group.SetGroupWholeBanResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.group.SetGroupWholeBanResponse} SetGroupWholeBanResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SetGroupWholeBanResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.group.SetGroupWholeBanResponse();
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
             * Decodes a SetGroupWholeBanResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.group.SetGroupWholeBanResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.group.SetGroupWholeBanResponse} SetGroupWholeBanResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SetGroupWholeBanResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a SetGroupWholeBanResponse message.
             * @function verify
             * @memberof kritor.group.SetGroupWholeBanResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            SetGroupWholeBanResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                return null;
            };

            /**
             * Creates a SetGroupWholeBanResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.group.SetGroupWholeBanResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.group.SetGroupWholeBanResponse} SetGroupWholeBanResponse
             */
            SetGroupWholeBanResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.group.SetGroupWholeBanResponse)
                    return object;
                return new $root.kritor.group.SetGroupWholeBanResponse();
            };

            /**
             * Creates a plain object from a SetGroupWholeBanResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.group.SetGroupWholeBanResponse
             * @static
             * @param {kritor.group.SetGroupWholeBanResponse} message SetGroupWholeBanResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            SetGroupWholeBanResponse.toObject = function toObject() {
                return {};
            };

            /**
             * Converts this SetGroupWholeBanResponse to JSON.
             * @function toJSON
             * @memberof kritor.group.SetGroupWholeBanResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            SetGroupWholeBanResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for SetGroupWholeBanResponse
             * @function getTypeUrl
             * @memberof kritor.group.SetGroupWholeBanResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            SetGroupWholeBanResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.group.SetGroupWholeBanResponse";
            };

            return SetGroupWholeBanResponse;
        })();

        group.GetGroupInfoRequest = (function() {

            /**
             * Properties of a GetGroupInfoRequest.
             * @memberof kritor.group
             * @interface IGetGroupInfoRequest
             * @property {number|Long|null} [groupId] GetGroupInfoRequest groupId
             */

            /**
             * Constructs a new GetGroupInfoRequest.
             * @memberof kritor.group
             * @classdesc Represents a GetGroupInfoRequest.
             * @implements IGetGroupInfoRequest
             * @constructor
             * @param {kritor.group.IGetGroupInfoRequest=} [properties] Properties to set
             */
            function GetGroupInfoRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetGroupInfoRequest groupId.
             * @member {number|Long} groupId
             * @memberof kritor.group.GetGroupInfoRequest
             * @instance
             */
            GetGroupInfoRequest.prototype.groupId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * Creates a new GetGroupInfoRequest instance using the specified properties.
             * @function create
             * @memberof kritor.group.GetGroupInfoRequest
             * @static
             * @param {kritor.group.IGetGroupInfoRequest=} [properties] Properties to set
             * @returns {kritor.group.GetGroupInfoRequest} GetGroupInfoRequest instance
             */
            GetGroupInfoRequest.create = function create(properties) {
                return new GetGroupInfoRequest(properties);
            };

            /**
             * Encodes the specified GetGroupInfoRequest message. Does not implicitly {@link kritor.group.GetGroupInfoRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.group.GetGroupInfoRequest
             * @static
             * @param {kritor.group.IGetGroupInfoRequest} message GetGroupInfoRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetGroupInfoRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.groupId != null && Object.hasOwnProperty.call(message, "groupId"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.groupId);
                return writer;
            };

            /**
             * Encodes the specified GetGroupInfoRequest message, length delimited. Does not implicitly {@link kritor.group.GetGroupInfoRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.group.GetGroupInfoRequest
             * @static
             * @param {kritor.group.IGetGroupInfoRequest} message GetGroupInfoRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetGroupInfoRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetGroupInfoRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.group.GetGroupInfoRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.group.GetGroupInfoRequest} GetGroupInfoRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetGroupInfoRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.group.GetGroupInfoRequest();
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
             * Decodes a GetGroupInfoRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.group.GetGroupInfoRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.group.GetGroupInfoRequest} GetGroupInfoRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetGroupInfoRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetGroupInfoRequest message.
             * @function verify
             * @memberof kritor.group.GetGroupInfoRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetGroupInfoRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.groupId != null && message.hasOwnProperty("groupId"))
                    if (!$util.isInteger(message.groupId) && !(message.groupId && $util.isInteger(message.groupId.low) && $util.isInteger(message.groupId.high)))
                        return "groupId: integer|Long expected";
                return null;
            };

            /**
             * Creates a GetGroupInfoRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.group.GetGroupInfoRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.group.GetGroupInfoRequest} GetGroupInfoRequest
             */
            GetGroupInfoRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.group.GetGroupInfoRequest)
                    return object;
                let message = new $root.kritor.group.GetGroupInfoRequest();
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
             * Creates a plain object from a GetGroupInfoRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.group.GetGroupInfoRequest
             * @static
             * @param {kritor.group.GetGroupInfoRequest} message GetGroupInfoRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetGroupInfoRequest.toObject = function toObject(message, options) {
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
             * Converts this GetGroupInfoRequest to JSON.
             * @function toJSON
             * @memberof kritor.group.GetGroupInfoRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetGroupInfoRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GetGroupInfoRequest
             * @function getTypeUrl
             * @memberof kritor.group.GetGroupInfoRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetGroupInfoRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.group.GetGroupInfoRequest";
            };

            return GetGroupInfoRequest;
        })();

        group.GetGroupInfoResponse = (function() {

            /**
             * Properties of a GetGroupInfoResponse.
             * @memberof kritor.group
             * @interface IGetGroupInfoResponse
             * @property {kritor.group.IGroupInfo|null} [groupInfo] GetGroupInfoResponse groupInfo
             */

            /**
             * Constructs a new GetGroupInfoResponse.
             * @memberof kritor.group
             * @classdesc Represents a GetGroupInfoResponse.
             * @implements IGetGroupInfoResponse
             * @constructor
             * @param {kritor.group.IGetGroupInfoResponse=} [properties] Properties to set
             */
            function GetGroupInfoResponse(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetGroupInfoResponse groupInfo.
             * @member {kritor.group.IGroupInfo|null|undefined} groupInfo
             * @memberof kritor.group.GetGroupInfoResponse
             * @instance
             */
            GetGroupInfoResponse.prototype.groupInfo = null;

            /**
             * Creates a new GetGroupInfoResponse instance using the specified properties.
             * @function create
             * @memberof kritor.group.GetGroupInfoResponse
             * @static
             * @param {kritor.group.IGetGroupInfoResponse=} [properties] Properties to set
             * @returns {kritor.group.GetGroupInfoResponse} GetGroupInfoResponse instance
             */
            GetGroupInfoResponse.create = function create(properties) {
                return new GetGroupInfoResponse(properties);
            };

            /**
             * Encodes the specified GetGroupInfoResponse message. Does not implicitly {@link kritor.group.GetGroupInfoResponse.verify|verify} messages.
             * @function encode
             * @memberof kritor.group.GetGroupInfoResponse
             * @static
             * @param {kritor.group.IGetGroupInfoResponse} message GetGroupInfoResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetGroupInfoResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.groupInfo != null && Object.hasOwnProperty.call(message, "groupInfo"))
                    $root.kritor.group.GroupInfo.encode(message.groupInfo, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified GetGroupInfoResponse message, length delimited. Does not implicitly {@link kritor.group.GetGroupInfoResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.group.GetGroupInfoResponse
             * @static
             * @param {kritor.group.IGetGroupInfoResponse} message GetGroupInfoResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetGroupInfoResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetGroupInfoResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.group.GetGroupInfoResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.group.GetGroupInfoResponse} GetGroupInfoResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetGroupInfoResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.group.GetGroupInfoResponse();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.groupInfo = $root.kritor.group.GroupInfo.decode(reader, reader.uint32());
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
             * Decodes a GetGroupInfoResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.group.GetGroupInfoResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.group.GetGroupInfoResponse} GetGroupInfoResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetGroupInfoResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetGroupInfoResponse message.
             * @function verify
             * @memberof kritor.group.GetGroupInfoResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetGroupInfoResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.groupInfo != null && message.hasOwnProperty("groupInfo")) {
                    let error = $root.kritor.group.GroupInfo.verify(message.groupInfo);
                    if (error)
                        return "groupInfo." + error;
                }
                return null;
            };

            /**
             * Creates a GetGroupInfoResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.group.GetGroupInfoResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.group.GetGroupInfoResponse} GetGroupInfoResponse
             */
            GetGroupInfoResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.group.GetGroupInfoResponse)
                    return object;
                let message = new $root.kritor.group.GetGroupInfoResponse();
                if (object.groupInfo != null) {
                    if (typeof object.groupInfo !== "object")
                        throw TypeError(".kritor.group.GetGroupInfoResponse.groupInfo: object expected");
                    message.groupInfo = $root.kritor.group.GroupInfo.fromObject(object.groupInfo);
                }
                return message;
            };

            /**
             * Creates a plain object from a GetGroupInfoResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.group.GetGroupInfoResponse
             * @static
             * @param {kritor.group.GetGroupInfoResponse} message GetGroupInfoResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetGroupInfoResponse.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults)
                    object.groupInfo = null;
                if (message.groupInfo != null && message.hasOwnProperty("groupInfo"))
                    object.groupInfo = $root.kritor.group.GroupInfo.toObject(message.groupInfo, options);
                return object;
            };

            /**
             * Converts this GetGroupInfoResponse to JSON.
             * @function toJSON
             * @memberof kritor.group.GetGroupInfoResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetGroupInfoResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GetGroupInfoResponse
             * @function getTypeUrl
             * @memberof kritor.group.GetGroupInfoResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetGroupInfoResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.group.GetGroupInfoResponse";
            };

            return GetGroupInfoResponse;
        })();

        group.GetGroupListRequest = (function() {

            /**
             * Properties of a GetGroupListRequest.
             * @memberof kritor.group
             * @interface IGetGroupListRequest
             * @property {boolean|null} [refresh] GetGroupListRequest refresh
             */

            /**
             * Constructs a new GetGroupListRequest.
             * @memberof kritor.group
             * @classdesc Represents a GetGroupListRequest.
             * @implements IGetGroupListRequest
             * @constructor
             * @param {kritor.group.IGetGroupListRequest=} [properties] Properties to set
             */
            function GetGroupListRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetGroupListRequest refresh.
             * @member {boolean|null|undefined} refresh
             * @memberof kritor.group.GetGroupListRequest
             * @instance
             */
            GetGroupListRequest.prototype.refresh = null;

            // OneOf field names bound to virtual getters and setters
            let $oneOfFields;

            /**
             * GetGroupListRequest _refresh.
             * @member {"refresh"|undefined} _refresh
             * @memberof kritor.group.GetGroupListRequest
             * @instance
             */
            Object.defineProperty(GetGroupListRequest.prototype, "_refresh", {
                get: $util.oneOfGetter($oneOfFields = ["refresh"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new GetGroupListRequest instance using the specified properties.
             * @function create
             * @memberof kritor.group.GetGroupListRequest
             * @static
             * @param {kritor.group.IGetGroupListRequest=} [properties] Properties to set
             * @returns {kritor.group.GetGroupListRequest} GetGroupListRequest instance
             */
            GetGroupListRequest.create = function create(properties) {
                return new GetGroupListRequest(properties);
            };

            /**
             * Encodes the specified GetGroupListRequest message. Does not implicitly {@link kritor.group.GetGroupListRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.group.GetGroupListRequest
             * @static
             * @param {kritor.group.IGetGroupListRequest} message GetGroupListRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetGroupListRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.refresh != null && Object.hasOwnProperty.call(message, "refresh"))
                    writer.uint32(/* id 1, wireType 0 =*/8).bool(message.refresh);
                return writer;
            };

            /**
             * Encodes the specified GetGroupListRequest message, length delimited. Does not implicitly {@link kritor.group.GetGroupListRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.group.GetGroupListRequest
             * @static
             * @param {kritor.group.IGetGroupListRequest} message GetGroupListRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetGroupListRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetGroupListRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.group.GetGroupListRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.group.GetGroupListRequest} GetGroupListRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetGroupListRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.group.GetGroupListRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.refresh = reader.bool();
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
             * Decodes a GetGroupListRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.group.GetGroupListRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.group.GetGroupListRequest} GetGroupListRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetGroupListRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetGroupListRequest message.
             * @function verify
             * @memberof kritor.group.GetGroupListRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetGroupListRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                let properties = {};
                if (message.refresh != null && message.hasOwnProperty("refresh")) {
                    properties._refresh = 1;
                    if (typeof message.refresh !== "boolean")
                        return "refresh: boolean expected";
                }
                return null;
            };

            /**
             * Creates a GetGroupListRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.group.GetGroupListRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.group.GetGroupListRequest} GetGroupListRequest
             */
            GetGroupListRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.group.GetGroupListRequest)
                    return object;
                let message = new $root.kritor.group.GetGroupListRequest();
                if (object.refresh != null)
                    message.refresh = Boolean(object.refresh);
                return message;
            };

            /**
             * Creates a plain object from a GetGroupListRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.group.GetGroupListRequest
             * @static
             * @param {kritor.group.GetGroupListRequest} message GetGroupListRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetGroupListRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (message.refresh != null && message.hasOwnProperty("refresh")) {
                    object.refresh = message.refresh;
                    if (options.oneofs)
                        object._refresh = "refresh";
                }
                return object;
            };

            /**
             * Converts this GetGroupListRequest to JSON.
             * @function toJSON
             * @memberof kritor.group.GetGroupListRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetGroupListRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GetGroupListRequest
             * @function getTypeUrl
             * @memberof kritor.group.GetGroupListRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetGroupListRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.group.GetGroupListRequest";
            };

            return GetGroupListRequest;
        })();

        group.GetGroupListResponse = (function() {

            /**
             * Properties of a GetGroupListResponse.
             * @memberof kritor.group
             * @interface IGetGroupListResponse
             * @property {Array.<kritor.group.IGroupInfo>|null} [groupsInfo] GetGroupListResponse groupsInfo
             */

            /**
             * Constructs a new GetGroupListResponse.
             * @memberof kritor.group
             * @classdesc Represents a GetGroupListResponse.
             * @implements IGetGroupListResponse
             * @constructor
             * @param {kritor.group.IGetGroupListResponse=} [properties] Properties to set
             */
            function GetGroupListResponse(properties) {
                this.groupsInfo = [];
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetGroupListResponse groupsInfo.
             * @member {Array.<kritor.group.IGroupInfo>} groupsInfo
             * @memberof kritor.group.GetGroupListResponse
             * @instance
             */
            GetGroupListResponse.prototype.groupsInfo = $util.emptyArray;

            /**
             * Creates a new GetGroupListResponse instance using the specified properties.
             * @function create
             * @memberof kritor.group.GetGroupListResponse
             * @static
             * @param {kritor.group.IGetGroupListResponse=} [properties] Properties to set
             * @returns {kritor.group.GetGroupListResponse} GetGroupListResponse instance
             */
            GetGroupListResponse.create = function create(properties) {
                return new GetGroupListResponse(properties);
            };

            /**
             * Encodes the specified GetGroupListResponse message. Does not implicitly {@link kritor.group.GetGroupListResponse.verify|verify} messages.
             * @function encode
             * @memberof kritor.group.GetGroupListResponse
             * @static
             * @param {kritor.group.IGetGroupListResponse} message GetGroupListResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetGroupListResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.groupsInfo != null && message.groupsInfo.length)
                    for (let i = 0; i < message.groupsInfo.length; ++i)
                        $root.kritor.group.GroupInfo.encode(message.groupsInfo[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified GetGroupListResponse message, length delimited. Does not implicitly {@link kritor.group.GetGroupListResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.group.GetGroupListResponse
             * @static
             * @param {kritor.group.IGetGroupListResponse} message GetGroupListResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetGroupListResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetGroupListResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.group.GetGroupListResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.group.GetGroupListResponse} GetGroupListResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetGroupListResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.group.GetGroupListResponse();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            if (!(message.groupsInfo && message.groupsInfo.length))
                                message.groupsInfo = [];
                            message.groupsInfo.push($root.kritor.group.GroupInfo.decode(reader, reader.uint32()));
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
             * Decodes a GetGroupListResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.group.GetGroupListResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.group.GetGroupListResponse} GetGroupListResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetGroupListResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetGroupListResponse message.
             * @function verify
             * @memberof kritor.group.GetGroupListResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetGroupListResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.groupsInfo != null && message.hasOwnProperty("groupsInfo")) {
                    if (!Array.isArray(message.groupsInfo))
                        return "groupsInfo: array expected";
                    for (let i = 0; i < message.groupsInfo.length; ++i) {
                        let error = $root.kritor.group.GroupInfo.verify(message.groupsInfo[i]);
                        if (error)
                            return "groupsInfo." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a GetGroupListResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.group.GetGroupListResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.group.GetGroupListResponse} GetGroupListResponse
             */
            GetGroupListResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.group.GetGroupListResponse)
                    return object;
                let message = new $root.kritor.group.GetGroupListResponse();
                if (object.groupsInfo) {
                    if (!Array.isArray(object.groupsInfo))
                        throw TypeError(".kritor.group.GetGroupListResponse.groupsInfo: array expected");
                    message.groupsInfo = [];
                    for (let i = 0; i < object.groupsInfo.length; ++i) {
                        if (typeof object.groupsInfo[i] !== "object")
                            throw TypeError(".kritor.group.GetGroupListResponse.groupsInfo: object expected");
                        message.groupsInfo[i] = $root.kritor.group.GroupInfo.fromObject(object.groupsInfo[i]);
                    }
                }
                return message;
            };

            /**
             * Creates a plain object from a GetGroupListResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.group.GetGroupListResponse
             * @static
             * @param {kritor.group.GetGroupListResponse} message GetGroupListResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetGroupListResponse.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.arrays || options.defaults)
                    object.groupsInfo = [];
                if (message.groupsInfo && message.groupsInfo.length) {
                    object.groupsInfo = [];
                    for (let j = 0; j < message.groupsInfo.length; ++j)
                        object.groupsInfo[j] = $root.kritor.group.GroupInfo.toObject(message.groupsInfo[j], options);
                }
                return object;
            };

            /**
             * Converts this GetGroupListResponse to JSON.
             * @function toJSON
             * @memberof kritor.group.GetGroupListResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetGroupListResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GetGroupListResponse
             * @function getTypeUrl
             * @memberof kritor.group.GetGroupListResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetGroupListResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.group.GetGroupListResponse";
            };

            return GetGroupListResponse;
        })();

        group.GetGroupMemberInfoRequest = (function() {

            /**
             * Properties of a GetGroupMemberInfoRequest.
             * @memberof kritor.group
             * @interface IGetGroupMemberInfoRequest
             * @property {number|Long|null} [groupId] GetGroupMemberInfoRequest groupId
             * @property {string|null} [targetUid] GetGroupMemberInfoRequest targetUid
             * @property {number|Long|null} [targetUin] GetGroupMemberInfoRequest targetUin
             * @property {boolean|null} [refresh] GetGroupMemberInfoRequest refresh
             */

            /**
             * Constructs a new GetGroupMemberInfoRequest.
             * @memberof kritor.group
             * @classdesc Represents a GetGroupMemberInfoRequest.
             * @implements IGetGroupMemberInfoRequest
             * @constructor
             * @param {kritor.group.IGetGroupMemberInfoRequest=} [properties] Properties to set
             */
            function GetGroupMemberInfoRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetGroupMemberInfoRequest groupId.
             * @member {number|Long} groupId
             * @memberof kritor.group.GetGroupMemberInfoRequest
             * @instance
             */
            GetGroupMemberInfoRequest.prototype.groupId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * GetGroupMemberInfoRequest targetUid.
             * @member {string|null|undefined} targetUid
             * @memberof kritor.group.GetGroupMemberInfoRequest
             * @instance
             */
            GetGroupMemberInfoRequest.prototype.targetUid = null;

            /**
             * GetGroupMemberInfoRequest targetUin.
             * @member {number|Long|null|undefined} targetUin
             * @memberof kritor.group.GetGroupMemberInfoRequest
             * @instance
             */
            GetGroupMemberInfoRequest.prototype.targetUin = null;

            /**
             * GetGroupMemberInfoRequest refresh.
             * @member {boolean|null|undefined} refresh
             * @memberof kritor.group.GetGroupMemberInfoRequest
             * @instance
             */
            GetGroupMemberInfoRequest.prototype.refresh = null;

            // OneOf field names bound to virtual getters and setters
            let $oneOfFields;

            /**
             * GetGroupMemberInfoRequest target.
             * @member {"targetUid"|"targetUin"|undefined} target
             * @memberof kritor.group.GetGroupMemberInfoRequest
             * @instance
             */
            Object.defineProperty(GetGroupMemberInfoRequest.prototype, "target", {
                get: $util.oneOfGetter($oneOfFields = ["targetUid", "targetUin"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * GetGroupMemberInfoRequest _refresh.
             * @member {"refresh"|undefined} _refresh
             * @memberof kritor.group.GetGroupMemberInfoRequest
             * @instance
             */
            Object.defineProperty(GetGroupMemberInfoRequest.prototype, "_refresh", {
                get: $util.oneOfGetter($oneOfFields = ["refresh"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new GetGroupMemberInfoRequest instance using the specified properties.
             * @function create
             * @memberof kritor.group.GetGroupMemberInfoRequest
             * @static
             * @param {kritor.group.IGetGroupMemberInfoRequest=} [properties] Properties to set
             * @returns {kritor.group.GetGroupMemberInfoRequest} GetGroupMemberInfoRequest instance
             */
            GetGroupMemberInfoRequest.create = function create(properties) {
                return new GetGroupMemberInfoRequest(properties);
            };

            /**
             * Encodes the specified GetGroupMemberInfoRequest message. Does not implicitly {@link kritor.group.GetGroupMemberInfoRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.group.GetGroupMemberInfoRequest
             * @static
             * @param {kritor.group.IGetGroupMemberInfoRequest} message GetGroupMemberInfoRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetGroupMemberInfoRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.groupId != null && Object.hasOwnProperty.call(message, "groupId"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.groupId);
                if (message.targetUid != null && Object.hasOwnProperty.call(message, "targetUid"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.targetUid);
                if (message.targetUin != null && Object.hasOwnProperty.call(message, "targetUin"))
                    writer.uint32(/* id 3, wireType 0 =*/24).uint64(message.targetUin);
                if (message.refresh != null && Object.hasOwnProperty.call(message, "refresh"))
                    writer.uint32(/* id 4, wireType 0 =*/32).bool(message.refresh);
                return writer;
            };

            /**
             * Encodes the specified GetGroupMemberInfoRequest message, length delimited. Does not implicitly {@link kritor.group.GetGroupMemberInfoRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.group.GetGroupMemberInfoRequest
             * @static
             * @param {kritor.group.IGetGroupMemberInfoRequest} message GetGroupMemberInfoRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetGroupMemberInfoRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetGroupMemberInfoRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.group.GetGroupMemberInfoRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.group.GetGroupMemberInfoRequest} GetGroupMemberInfoRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetGroupMemberInfoRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.group.GetGroupMemberInfoRequest();
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
                            message.refresh = reader.bool();
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
             * Decodes a GetGroupMemberInfoRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.group.GetGroupMemberInfoRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.group.GetGroupMemberInfoRequest} GetGroupMemberInfoRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetGroupMemberInfoRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetGroupMemberInfoRequest message.
             * @function verify
             * @memberof kritor.group.GetGroupMemberInfoRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetGroupMemberInfoRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                let properties = {};
                if (message.groupId != null && message.hasOwnProperty("groupId"))
                    if (!$util.isInteger(message.groupId) && !(message.groupId && $util.isInteger(message.groupId.low) && $util.isInteger(message.groupId.high)))
                        return "groupId: integer|Long expected";
                if (message.targetUid != null && message.hasOwnProperty("targetUid")) {
                    properties.target = 1;
                    if (!$util.isString(message.targetUid))
                        return "targetUid: string expected";
                }
                if (message.targetUin != null && message.hasOwnProperty("targetUin")) {
                    if (properties.target === 1)
                        return "target: multiple values";
                    properties.target = 1;
                    if (!$util.isInteger(message.targetUin) && !(message.targetUin && $util.isInteger(message.targetUin.low) && $util.isInteger(message.targetUin.high)))
                        return "targetUin: integer|Long expected";
                }
                if (message.refresh != null && message.hasOwnProperty("refresh")) {
                    properties._refresh = 1;
                    if (typeof message.refresh !== "boolean")
                        return "refresh: boolean expected";
                }
                return null;
            };

            /**
             * Creates a GetGroupMemberInfoRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.group.GetGroupMemberInfoRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.group.GetGroupMemberInfoRequest} GetGroupMemberInfoRequest
             */
            GetGroupMemberInfoRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.group.GetGroupMemberInfoRequest)
                    return object;
                let message = new $root.kritor.group.GetGroupMemberInfoRequest();
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
                if (object.refresh != null)
                    message.refresh = Boolean(object.refresh);
                return message;
            };

            /**
             * Creates a plain object from a GetGroupMemberInfoRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.group.GetGroupMemberInfoRequest
             * @static
             * @param {kritor.group.GetGroupMemberInfoRequest} message GetGroupMemberInfoRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetGroupMemberInfoRequest.toObject = function toObject(message, options) {
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
                if (message.targetUid != null && message.hasOwnProperty("targetUid")) {
                    object.targetUid = message.targetUid;
                    if (options.oneofs)
                        object.target = "targetUid";
                }
                if (message.targetUin != null && message.hasOwnProperty("targetUin")) {
                    if (typeof message.targetUin === "number")
                        object.targetUin = options.longs === String ? String(message.targetUin) : message.targetUin;
                    else
                        object.targetUin = options.longs === String ? $util.Long.prototype.toString.call(message.targetUin) : options.longs === Number ? new $util.LongBits(message.targetUin.low >>> 0, message.targetUin.high >>> 0).toNumber(true) : message.targetUin;
                    if (options.oneofs)
                        object.target = "targetUin";
                }
                if (message.refresh != null && message.hasOwnProperty("refresh")) {
                    object.refresh = message.refresh;
                    if (options.oneofs)
                        object._refresh = "refresh";
                }
                return object;
            };

            /**
             * Converts this GetGroupMemberInfoRequest to JSON.
             * @function toJSON
             * @memberof kritor.group.GetGroupMemberInfoRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetGroupMemberInfoRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GetGroupMemberInfoRequest
             * @function getTypeUrl
             * @memberof kritor.group.GetGroupMemberInfoRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetGroupMemberInfoRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.group.GetGroupMemberInfoRequest";
            };

            return GetGroupMemberInfoRequest;
        })();

        group.GetGroupMemberInfoResponse = (function() {

            /**
             * Properties of a GetGroupMemberInfoResponse.
             * @memberof kritor.group
             * @interface IGetGroupMemberInfoResponse
             * @property {kritor.group.IGroupMemberInfo|null} [groupMemberInfo] GetGroupMemberInfoResponse groupMemberInfo
             */

            /**
             * Constructs a new GetGroupMemberInfoResponse.
             * @memberof kritor.group
             * @classdesc Represents a GetGroupMemberInfoResponse.
             * @implements IGetGroupMemberInfoResponse
             * @constructor
             * @param {kritor.group.IGetGroupMemberInfoResponse=} [properties] Properties to set
             */
            function GetGroupMemberInfoResponse(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetGroupMemberInfoResponse groupMemberInfo.
             * @member {kritor.group.IGroupMemberInfo|null|undefined} groupMemberInfo
             * @memberof kritor.group.GetGroupMemberInfoResponse
             * @instance
             */
            GetGroupMemberInfoResponse.prototype.groupMemberInfo = null;

            /**
             * Creates a new GetGroupMemberInfoResponse instance using the specified properties.
             * @function create
             * @memberof kritor.group.GetGroupMemberInfoResponse
             * @static
             * @param {kritor.group.IGetGroupMemberInfoResponse=} [properties] Properties to set
             * @returns {kritor.group.GetGroupMemberInfoResponse} GetGroupMemberInfoResponse instance
             */
            GetGroupMemberInfoResponse.create = function create(properties) {
                return new GetGroupMemberInfoResponse(properties);
            };

            /**
             * Encodes the specified GetGroupMemberInfoResponse message. Does not implicitly {@link kritor.group.GetGroupMemberInfoResponse.verify|verify} messages.
             * @function encode
             * @memberof kritor.group.GetGroupMemberInfoResponse
             * @static
             * @param {kritor.group.IGetGroupMemberInfoResponse} message GetGroupMemberInfoResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetGroupMemberInfoResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.groupMemberInfo != null && Object.hasOwnProperty.call(message, "groupMemberInfo"))
                    $root.kritor.group.GroupMemberInfo.encode(message.groupMemberInfo, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified GetGroupMemberInfoResponse message, length delimited. Does not implicitly {@link kritor.group.GetGroupMemberInfoResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.group.GetGroupMemberInfoResponse
             * @static
             * @param {kritor.group.IGetGroupMemberInfoResponse} message GetGroupMemberInfoResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetGroupMemberInfoResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetGroupMemberInfoResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.group.GetGroupMemberInfoResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.group.GetGroupMemberInfoResponse} GetGroupMemberInfoResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetGroupMemberInfoResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.group.GetGroupMemberInfoResponse();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.groupMemberInfo = $root.kritor.group.GroupMemberInfo.decode(reader, reader.uint32());
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
             * Decodes a GetGroupMemberInfoResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.group.GetGroupMemberInfoResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.group.GetGroupMemberInfoResponse} GetGroupMemberInfoResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetGroupMemberInfoResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetGroupMemberInfoResponse message.
             * @function verify
             * @memberof kritor.group.GetGroupMemberInfoResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetGroupMemberInfoResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.groupMemberInfo != null && message.hasOwnProperty("groupMemberInfo")) {
                    let error = $root.kritor.group.GroupMemberInfo.verify(message.groupMemberInfo);
                    if (error)
                        return "groupMemberInfo." + error;
                }
                return null;
            };

            /**
             * Creates a GetGroupMemberInfoResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.group.GetGroupMemberInfoResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.group.GetGroupMemberInfoResponse} GetGroupMemberInfoResponse
             */
            GetGroupMemberInfoResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.group.GetGroupMemberInfoResponse)
                    return object;
                let message = new $root.kritor.group.GetGroupMemberInfoResponse();
                if (object.groupMemberInfo != null) {
                    if (typeof object.groupMemberInfo !== "object")
                        throw TypeError(".kritor.group.GetGroupMemberInfoResponse.groupMemberInfo: object expected");
                    message.groupMemberInfo = $root.kritor.group.GroupMemberInfo.fromObject(object.groupMemberInfo);
                }
                return message;
            };

            /**
             * Creates a plain object from a GetGroupMemberInfoResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.group.GetGroupMemberInfoResponse
             * @static
             * @param {kritor.group.GetGroupMemberInfoResponse} message GetGroupMemberInfoResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetGroupMemberInfoResponse.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults)
                    object.groupMemberInfo = null;
                if (message.groupMemberInfo != null && message.hasOwnProperty("groupMemberInfo"))
                    object.groupMemberInfo = $root.kritor.group.GroupMemberInfo.toObject(message.groupMemberInfo, options);
                return object;
            };

            /**
             * Converts this GetGroupMemberInfoResponse to JSON.
             * @function toJSON
             * @memberof kritor.group.GetGroupMemberInfoResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetGroupMemberInfoResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GetGroupMemberInfoResponse
             * @function getTypeUrl
             * @memberof kritor.group.GetGroupMemberInfoResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetGroupMemberInfoResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.group.GetGroupMemberInfoResponse";
            };

            return GetGroupMemberInfoResponse;
        })();

        group.GetGroupMemberListRequest = (function() {

            /**
             * Properties of a GetGroupMemberListRequest.
             * @memberof kritor.group
             * @interface IGetGroupMemberListRequest
             * @property {number|Long|null} [groupId] GetGroupMemberListRequest groupId
             * @property {boolean|null} [refresh] GetGroupMemberListRequest refresh
             */

            /**
             * Constructs a new GetGroupMemberListRequest.
             * @memberof kritor.group
             * @classdesc Represents a GetGroupMemberListRequest.
             * @implements IGetGroupMemberListRequest
             * @constructor
             * @param {kritor.group.IGetGroupMemberListRequest=} [properties] Properties to set
             */
            function GetGroupMemberListRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetGroupMemberListRequest groupId.
             * @member {number|Long} groupId
             * @memberof kritor.group.GetGroupMemberListRequest
             * @instance
             */
            GetGroupMemberListRequest.prototype.groupId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * GetGroupMemberListRequest refresh.
             * @member {boolean|null|undefined} refresh
             * @memberof kritor.group.GetGroupMemberListRequest
             * @instance
             */
            GetGroupMemberListRequest.prototype.refresh = null;

            // OneOf field names bound to virtual getters and setters
            let $oneOfFields;

            /**
             * GetGroupMemberListRequest _refresh.
             * @member {"refresh"|undefined} _refresh
             * @memberof kritor.group.GetGroupMemberListRequest
             * @instance
             */
            Object.defineProperty(GetGroupMemberListRequest.prototype, "_refresh", {
                get: $util.oneOfGetter($oneOfFields = ["refresh"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new GetGroupMemberListRequest instance using the specified properties.
             * @function create
             * @memberof kritor.group.GetGroupMemberListRequest
             * @static
             * @param {kritor.group.IGetGroupMemberListRequest=} [properties] Properties to set
             * @returns {kritor.group.GetGroupMemberListRequest} GetGroupMemberListRequest instance
             */
            GetGroupMemberListRequest.create = function create(properties) {
                return new GetGroupMemberListRequest(properties);
            };

            /**
             * Encodes the specified GetGroupMemberListRequest message. Does not implicitly {@link kritor.group.GetGroupMemberListRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.group.GetGroupMemberListRequest
             * @static
             * @param {kritor.group.IGetGroupMemberListRequest} message GetGroupMemberListRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetGroupMemberListRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.groupId != null && Object.hasOwnProperty.call(message, "groupId"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.groupId);
                if (message.refresh != null && Object.hasOwnProperty.call(message, "refresh"))
                    writer.uint32(/* id 2, wireType 0 =*/16).bool(message.refresh);
                return writer;
            };

            /**
             * Encodes the specified GetGroupMemberListRequest message, length delimited. Does not implicitly {@link kritor.group.GetGroupMemberListRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.group.GetGroupMemberListRequest
             * @static
             * @param {kritor.group.IGetGroupMemberListRequest} message GetGroupMemberListRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetGroupMemberListRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetGroupMemberListRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.group.GetGroupMemberListRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.group.GetGroupMemberListRequest} GetGroupMemberListRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetGroupMemberListRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.group.GetGroupMemberListRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.groupId = reader.uint64();
                            break;
                        }
                    case 2: {
                            message.refresh = reader.bool();
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
             * Decodes a GetGroupMemberListRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.group.GetGroupMemberListRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.group.GetGroupMemberListRequest} GetGroupMemberListRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetGroupMemberListRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetGroupMemberListRequest message.
             * @function verify
             * @memberof kritor.group.GetGroupMemberListRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetGroupMemberListRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                let properties = {};
                if (message.groupId != null && message.hasOwnProperty("groupId"))
                    if (!$util.isInteger(message.groupId) && !(message.groupId && $util.isInteger(message.groupId.low) && $util.isInteger(message.groupId.high)))
                        return "groupId: integer|Long expected";
                if (message.refresh != null && message.hasOwnProperty("refresh")) {
                    properties._refresh = 1;
                    if (typeof message.refresh !== "boolean")
                        return "refresh: boolean expected";
                }
                return null;
            };

            /**
             * Creates a GetGroupMemberListRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.group.GetGroupMemberListRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.group.GetGroupMemberListRequest} GetGroupMemberListRequest
             */
            GetGroupMemberListRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.group.GetGroupMemberListRequest)
                    return object;
                let message = new $root.kritor.group.GetGroupMemberListRequest();
                if (object.groupId != null)
                    if ($util.Long)
                        (message.groupId = $util.Long.fromValue(object.groupId)).unsigned = true;
                    else if (typeof object.groupId === "string")
                        message.groupId = parseInt(object.groupId, 10);
                    else if (typeof object.groupId === "number")
                        message.groupId = object.groupId;
                    else if (typeof object.groupId === "object")
                        message.groupId = new $util.LongBits(object.groupId.low >>> 0, object.groupId.high >>> 0).toNumber(true);
                if (object.refresh != null)
                    message.refresh = Boolean(object.refresh);
                return message;
            };

            /**
             * Creates a plain object from a GetGroupMemberListRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.group.GetGroupMemberListRequest
             * @static
             * @param {kritor.group.GetGroupMemberListRequest} message GetGroupMemberListRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetGroupMemberListRequest.toObject = function toObject(message, options) {
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
                if (message.refresh != null && message.hasOwnProperty("refresh")) {
                    object.refresh = message.refresh;
                    if (options.oneofs)
                        object._refresh = "refresh";
                }
                return object;
            };

            /**
             * Converts this GetGroupMemberListRequest to JSON.
             * @function toJSON
             * @memberof kritor.group.GetGroupMemberListRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetGroupMemberListRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GetGroupMemberListRequest
             * @function getTypeUrl
             * @memberof kritor.group.GetGroupMemberListRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetGroupMemberListRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.group.GetGroupMemberListRequest";
            };

            return GetGroupMemberListRequest;
        })();

        group.GetGroupMemberListResponse = (function() {

            /**
             * Properties of a GetGroupMemberListResponse.
             * @memberof kritor.group
             * @interface IGetGroupMemberListResponse
             * @property {Array.<kritor.group.IGroupMemberInfo>|null} [groupMembersInfo] GetGroupMemberListResponse groupMembersInfo
             */

            /**
             * Constructs a new GetGroupMemberListResponse.
             * @memberof kritor.group
             * @classdesc Represents a GetGroupMemberListResponse.
             * @implements IGetGroupMemberListResponse
             * @constructor
             * @param {kritor.group.IGetGroupMemberListResponse=} [properties] Properties to set
             */
            function GetGroupMemberListResponse(properties) {
                this.groupMembersInfo = [];
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetGroupMemberListResponse groupMembersInfo.
             * @member {Array.<kritor.group.IGroupMemberInfo>} groupMembersInfo
             * @memberof kritor.group.GetGroupMemberListResponse
             * @instance
             */
            GetGroupMemberListResponse.prototype.groupMembersInfo = $util.emptyArray;

            /**
             * Creates a new GetGroupMemberListResponse instance using the specified properties.
             * @function create
             * @memberof kritor.group.GetGroupMemberListResponse
             * @static
             * @param {kritor.group.IGetGroupMemberListResponse=} [properties] Properties to set
             * @returns {kritor.group.GetGroupMemberListResponse} GetGroupMemberListResponse instance
             */
            GetGroupMemberListResponse.create = function create(properties) {
                return new GetGroupMemberListResponse(properties);
            };

            /**
             * Encodes the specified GetGroupMemberListResponse message. Does not implicitly {@link kritor.group.GetGroupMemberListResponse.verify|verify} messages.
             * @function encode
             * @memberof kritor.group.GetGroupMemberListResponse
             * @static
             * @param {kritor.group.IGetGroupMemberListResponse} message GetGroupMemberListResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetGroupMemberListResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.groupMembersInfo != null && message.groupMembersInfo.length)
                    for (let i = 0; i < message.groupMembersInfo.length; ++i)
                        $root.kritor.group.GroupMemberInfo.encode(message.groupMembersInfo[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified GetGroupMemberListResponse message, length delimited. Does not implicitly {@link kritor.group.GetGroupMemberListResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.group.GetGroupMemberListResponse
             * @static
             * @param {kritor.group.IGetGroupMemberListResponse} message GetGroupMemberListResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetGroupMemberListResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetGroupMemberListResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.group.GetGroupMemberListResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.group.GetGroupMemberListResponse} GetGroupMemberListResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetGroupMemberListResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.group.GetGroupMemberListResponse();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            if (!(message.groupMembersInfo && message.groupMembersInfo.length))
                                message.groupMembersInfo = [];
                            message.groupMembersInfo.push($root.kritor.group.GroupMemberInfo.decode(reader, reader.uint32()));
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
             * Decodes a GetGroupMemberListResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.group.GetGroupMemberListResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.group.GetGroupMemberListResponse} GetGroupMemberListResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetGroupMemberListResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetGroupMemberListResponse message.
             * @function verify
             * @memberof kritor.group.GetGroupMemberListResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetGroupMemberListResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.groupMembersInfo != null && message.hasOwnProperty("groupMembersInfo")) {
                    if (!Array.isArray(message.groupMembersInfo))
                        return "groupMembersInfo: array expected";
                    for (let i = 0; i < message.groupMembersInfo.length; ++i) {
                        let error = $root.kritor.group.GroupMemberInfo.verify(message.groupMembersInfo[i]);
                        if (error)
                            return "groupMembersInfo." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a GetGroupMemberListResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.group.GetGroupMemberListResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.group.GetGroupMemberListResponse} GetGroupMemberListResponse
             */
            GetGroupMemberListResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.group.GetGroupMemberListResponse)
                    return object;
                let message = new $root.kritor.group.GetGroupMemberListResponse();
                if (object.groupMembersInfo) {
                    if (!Array.isArray(object.groupMembersInfo))
                        throw TypeError(".kritor.group.GetGroupMemberListResponse.groupMembersInfo: array expected");
                    message.groupMembersInfo = [];
                    for (let i = 0; i < object.groupMembersInfo.length; ++i) {
                        if (typeof object.groupMembersInfo[i] !== "object")
                            throw TypeError(".kritor.group.GetGroupMemberListResponse.groupMembersInfo: object expected");
                        message.groupMembersInfo[i] = $root.kritor.group.GroupMemberInfo.fromObject(object.groupMembersInfo[i]);
                    }
                }
                return message;
            };

            /**
             * Creates a plain object from a GetGroupMemberListResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.group.GetGroupMemberListResponse
             * @static
             * @param {kritor.group.GetGroupMemberListResponse} message GetGroupMemberListResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetGroupMemberListResponse.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.arrays || options.defaults)
                    object.groupMembersInfo = [];
                if (message.groupMembersInfo && message.groupMembersInfo.length) {
                    object.groupMembersInfo = [];
                    for (let j = 0; j < message.groupMembersInfo.length; ++j)
                        object.groupMembersInfo[j] = $root.kritor.group.GroupMemberInfo.toObject(message.groupMembersInfo[j], options);
                }
                return object;
            };

            /**
             * Converts this GetGroupMemberListResponse to JSON.
             * @function toJSON
             * @memberof kritor.group.GetGroupMemberListResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetGroupMemberListResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GetGroupMemberListResponse
             * @function getTypeUrl
             * @memberof kritor.group.GetGroupMemberListResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetGroupMemberListResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.group.GetGroupMemberListResponse";
            };

            return GetGroupMemberListResponse;
        })();

        group.GetProhibitedUserListRequest = (function() {

            /**
             * Properties of a GetProhibitedUserListRequest.
             * @memberof kritor.group
             * @interface IGetProhibitedUserListRequest
             * @property {number|Long|null} [groupId] GetProhibitedUserListRequest groupId
             */

            /**
             * Constructs a new GetProhibitedUserListRequest.
             * @memberof kritor.group
             * @classdesc Represents a GetProhibitedUserListRequest.
             * @implements IGetProhibitedUserListRequest
             * @constructor
             * @param {kritor.group.IGetProhibitedUserListRequest=} [properties] Properties to set
             */
            function GetProhibitedUserListRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetProhibitedUserListRequest groupId.
             * @member {number|Long} groupId
             * @memberof kritor.group.GetProhibitedUserListRequest
             * @instance
             */
            GetProhibitedUserListRequest.prototype.groupId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * Creates a new GetProhibitedUserListRequest instance using the specified properties.
             * @function create
             * @memberof kritor.group.GetProhibitedUserListRequest
             * @static
             * @param {kritor.group.IGetProhibitedUserListRequest=} [properties] Properties to set
             * @returns {kritor.group.GetProhibitedUserListRequest} GetProhibitedUserListRequest instance
             */
            GetProhibitedUserListRequest.create = function create(properties) {
                return new GetProhibitedUserListRequest(properties);
            };

            /**
             * Encodes the specified GetProhibitedUserListRequest message. Does not implicitly {@link kritor.group.GetProhibitedUserListRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.group.GetProhibitedUserListRequest
             * @static
             * @param {kritor.group.IGetProhibitedUserListRequest} message GetProhibitedUserListRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetProhibitedUserListRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.groupId != null && Object.hasOwnProperty.call(message, "groupId"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.groupId);
                return writer;
            };

            /**
             * Encodes the specified GetProhibitedUserListRequest message, length delimited. Does not implicitly {@link kritor.group.GetProhibitedUserListRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.group.GetProhibitedUserListRequest
             * @static
             * @param {kritor.group.IGetProhibitedUserListRequest} message GetProhibitedUserListRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetProhibitedUserListRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetProhibitedUserListRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.group.GetProhibitedUserListRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.group.GetProhibitedUserListRequest} GetProhibitedUserListRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetProhibitedUserListRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.group.GetProhibitedUserListRequest();
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
             * Decodes a GetProhibitedUserListRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.group.GetProhibitedUserListRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.group.GetProhibitedUserListRequest} GetProhibitedUserListRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetProhibitedUserListRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetProhibitedUserListRequest message.
             * @function verify
             * @memberof kritor.group.GetProhibitedUserListRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetProhibitedUserListRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.groupId != null && message.hasOwnProperty("groupId"))
                    if (!$util.isInteger(message.groupId) && !(message.groupId && $util.isInteger(message.groupId.low) && $util.isInteger(message.groupId.high)))
                        return "groupId: integer|Long expected";
                return null;
            };

            /**
             * Creates a GetProhibitedUserListRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.group.GetProhibitedUserListRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.group.GetProhibitedUserListRequest} GetProhibitedUserListRequest
             */
            GetProhibitedUserListRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.group.GetProhibitedUserListRequest)
                    return object;
                let message = new $root.kritor.group.GetProhibitedUserListRequest();
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
             * Creates a plain object from a GetProhibitedUserListRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.group.GetProhibitedUserListRequest
             * @static
             * @param {kritor.group.GetProhibitedUserListRequest} message GetProhibitedUserListRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetProhibitedUserListRequest.toObject = function toObject(message, options) {
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
             * Converts this GetProhibitedUserListRequest to JSON.
             * @function toJSON
             * @memberof kritor.group.GetProhibitedUserListRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetProhibitedUserListRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GetProhibitedUserListRequest
             * @function getTypeUrl
             * @memberof kritor.group.GetProhibitedUserListRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetProhibitedUserListRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.group.GetProhibitedUserListRequest";
            };

            return GetProhibitedUserListRequest;
        })();

        group.GetProhibitedUserListResponse = (function() {

            /**
             * Properties of a GetProhibitedUserListResponse.
             * @memberof kritor.group
             * @interface IGetProhibitedUserListResponse
             * @property {Array.<kritor.group.IProhibitedUserInfo>|null} [prohibitedUsersInfo] GetProhibitedUserListResponse prohibitedUsersInfo
             */

            /**
             * Constructs a new GetProhibitedUserListResponse.
             * @memberof kritor.group
             * @classdesc Represents a GetProhibitedUserListResponse.
             * @implements IGetProhibitedUserListResponse
             * @constructor
             * @param {kritor.group.IGetProhibitedUserListResponse=} [properties] Properties to set
             */
            function GetProhibitedUserListResponse(properties) {
                this.prohibitedUsersInfo = [];
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetProhibitedUserListResponse prohibitedUsersInfo.
             * @member {Array.<kritor.group.IProhibitedUserInfo>} prohibitedUsersInfo
             * @memberof kritor.group.GetProhibitedUserListResponse
             * @instance
             */
            GetProhibitedUserListResponse.prototype.prohibitedUsersInfo = $util.emptyArray;

            /**
             * Creates a new GetProhibitedUserListResponse instance using the specified properties.
             * @function create
             * @memberof kritor.group.GetProhibitedUserListResponse
             * @static
             * @param {kritor.group.IGetProhibitedUserListResponse=} [properties] Properties to set
             * @returns {kritor.group.GetProhibitedUserListResponse} GetProhibitedUserListResponse instance
             */
            GetProhibitedUserListResponse.create = function create(properties) {
                return new GetProhibitedUserListResponse(properties);
            };

            /**
             * Encodes the specified GetProhibitedUserListResponse message. Does not implicitly {@link kritor.group.GetProhibitedUserListResponse.verify|verify} messages.
             * @function encode
             * @memberof kritor.group.GetProhibitedUserListResponse
             * @static
             * @param {kritor.group.IGetProhibitedUserListResponse} message GetProhibitedUserListResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetProhibitedUserListResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.prohibitedUsersInfo != null && message.prohibitedUsersInfo.length)
                    for (let i = 0; i < message.prohibitedUsersInfo.length; ++i)
                        $root.kritor.group.ProhibitedUserInfo.encode(message.prohibitedUsersInfo[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified GetProhibitedUserListResponse message, length delimited. Does not implicitly {@link kritor.group.GetProhibitedUserListResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.group.GetProhibitedUserListResponse
             * @static
             * @param {kritor.group.IGetProhibitedUserListResponse} message GetProhibitedUserListResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetProhibitedUserListResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetProhibitedUserListResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.group.GetProhibitedUserListResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.group.GetProhibitedUserListResponse} GetProhibitedUserListResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetProhibitedUserListResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.group.GetProhibitedUserListResponse();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            if (!(message.prohibitedUsersInfo && message.prohibitedUsersInfo.length))
                                message.prohibitedUsersInfo = [];
                            message.prohibitedUsersInfo.push($root.kritor.group.ProhibitedUserInfo.decode(reader, reader.uint32()));
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
             * Decodes a GetProhibitedUserListResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.group.GetProhibitedUserListResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.group.GetProhibitedUserListResponse} GetProhibitedUserListResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetProhibitedUserListResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetProhibitedUserListResponse message.
             * @function verify
             * @memberof kritor.group.GetProhibitedUserListResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetProhibitedUserListResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.prohibitedUsersInfo != null && message.hasOwnProperty("prohibitedUsersInfo")) {
                    if (!Array.isArray(message.prohibitedUsersInfo))
                        return "prohibitedUsersInfo: array expected";
                    for (let i = 0; i < message.prohibitedUsersInfo.length; ++i) {
                        let error = $root.kritor.group.ProhibitedUserInfo.verify(message.prohibitedUsersInfo[i]);
                        if (error)
                            return "prohibitedUsersInfo." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a GetProhibitedUserListResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.group.GetProhibitedUserListResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.group.GetProhibitedUserListResponse} GetProhibitedUserListResponse
             */
            GetProhibitedUserListResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.group.GetProhibitedUserListResponse)
                    return object;
                let message = new $root.kritor.group.GetProhibitedUserListResponse();
                if (object.prohibitedUsersInfo) {
                    if (!Array.isArray(object.prohibitedUsersInfo))
                        throw TypeError(".kritor.group.GetProhibitedUserListResponse.prohibitedUsersInfo: array expected");
                    message.prohibitedUsersInfo = [];
                    for (let i = 0; i < object.prohibitedUsersInfo.length; ++i) {
                        if (typeof object.prohibitedUsersInfo[i] !== "object")
                            throw TypeError(".kritor.group.GetProhibitedUserListResponse.prohibitedUsersInfo: object expected");
                        message.prohibitedUsersInfo[i] = $root.kritor.group.ProhibitedUserInfo.fromObject(object.prohibitedUsersInfo[i]);
                    }
                }
                return message;
            };

            /**
             * Creates a plain object from a GetProhibitedUserListResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.group.GetProhibitedUserListResponse
             * @static
             * @param {kritor.group.GetProhibitedUserListResponse} message GetProhibitedUserListResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetProhibitedUserListResponse.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.arrays || options.defaults)
                    object.prohibitedUsersInfo = [];
                if (message.prohibitedUsersInfo && message.prohibitedUsersInfo.length) {
                    object.prohibitedUsersInfo = [];
                    for (let j = 0; j < message.prohibitedUsersInfo.length; ++j)
                        object.prohibitedUsersInfo[j] = $root.kritor.group.ProhibitedUserInfo.toObject(message.prohibitedUsersInfo[j], options);
                }
                return object;
            };

            /**
             * Converts this GetProhibitedUserListResponse to JSON.
             * @function toJSON
             * @memberof kritor.group.GetProhibitedUserListResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetProhibitedUserListResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GetProhibitedUserListResponse
             * @function getTypeUrl
             * @memberof kritor.group.GetProhibitedUserListResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetProhibitedUserListResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.group.GetProhibitedUserListResponse";
            };

            return GetProhibitedUserListResponse;
        })();

        group.GetRemainCountAtAllRequest = (function() {

            /**
             * Properties of a GetRemainCountAtAllRequest.
             * @memberof kritor.group
             * @interface IGetRemainCountAtAllRequest
             * @property {number|Long|null} [groupId] GetRemainCountAtAllRequest groupId
             */

            /**
             * Constructs a new GetRemainCountAtAllRequest.
             * @memberof kritor.group
             * @classdesc Represents a GetRemainCountAtAllRequest.
             * @implements IGetRemainCountAtAllRequest
             * @constructor
             * @param {kritor.group.IGetRemainCountAtAllRequest=} [properties] Properties to set
             */
            function GetRemainCountAtAllRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetRemainCountAtAllRequest groupId.
             * @member {number|Long} groupId
             * @memberof kritor.group.GetRemainCountAtAllRequest
             * @instance
             */
            GetRemainCountAtAllRequest.prototype.groupId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * Creates a new GetRemainCountAtAllRequest instance using the specified properties.
             * @function create
             * @memberof kritor.group.GetRemainCountAtAllRequest
             * @static
             * @param {kritor.group.IGetRemainCountAtAllRequest=} [properties] Properties to set
             * @returns {kritor.group.GetRemainCountAtAllRequest} GetRemainCountAtAllRequest instance
             */
            GetRemainCountAtAllRequest.create = function create(properties) {
                return new GetRemainCountAtAllRequest(properties);
            };

            /**
             * Encodes the specified GetRemainCountAtAllRequest message. Does not implicitly {@link kritor.group.GetRemainCountAtAllRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.group.GetRemainCountAtAllRequest
             * @static
             * @param {kritor.group.IGetRemainCountAtAllRequest} message GetRemainCountAtAllRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetRemainCountAtAllRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.groupId != null && Object.hasOwnProperty.call(message, "groupId"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.groupId);
                return writer;
            };

            /**
             * Encodes the specified GetRemainCountAtAllRequest message, length delimited. Does not implicitly {@link kritor.group.GetRemainCountAtAllRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.group.GetRemainCountAtAllRequest
             * @static
             * @param {kritor.group.IGetRemainCountAtAllRequest} message GetRemainCountAtAllRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetRemainCountAtAllRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetRemainCountAtAllRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.group.GetRemainCountAtAllRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.group.GetRemainCountAtAllRequest} GetRemainCountAtAllRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetRemainCountAtAllRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.group.GetRemainCountAtAllRequest();
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
             * Decodes a GetRemainCountAtAllRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.group.GetRemainCountAtAllRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.group.GetRemainCountAtAllRequest} GetRemainCountAtAllRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetRemainCountAtAllRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetRemainCountAtAllRequest message.
             * @function verify
             * @memberof kritor.group.GetRemainCountAtAllRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetRemainCountAtAllRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.groupId != null && message.hasOwnProperty("groupId"))
                    if (!$util.isInteger(message.groupId) && !(message.groupId && $util.isInteger(message.groupId.low) && $util.isInteger(message.groupId.high)))
                        return "groupId: integer|Long expected";
                return null;
            };

            /**
             * Creates a GetRemainCountAtAllRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.group.GetRemainCountAtAllRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.group.GetRemainCountAtAllRequest} GetRemainCountAtAllRequest
             */
            GetRemainCountAtAllRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.group.GetRemainCountAtAllRequest)
                    return object;
                let message = new $root.kritor.group.GetRemainCountAtAllRequest();
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
             * Creates a plain object from a GetRemainCountAtAllRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.group.GetRemainCountAtAllRequest
             * @static
             * @param {kritor.group.GetRemainCountAtAllRequest} message GetRemainCountAtAllRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetRemainCountAtAllRequest.toObject = function toObject(message, options) {
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
             * Converts this GetRemainCountAtAllRequest to JSON.
             * @function toJSON
             * @memberof kritor.group.GetRemainCountAtAllRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetRemainCountAtAllRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GetRemainCountAtAllRequest
             * @function getTypeUrl
             * @memberof kritor.group.GetRemainCountAtAllRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetRemainCountAtAllRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.group.GetRemainCountAtAllRequest";
            };

            return GetRemainCountAtAllRequest;
        })();

        group.GetRemainCountAtAllResponse = (function() {

            /**
             * Properties of a GetRemainCountAtAllResponse.
             * @memberof kritor.group
             * @interface IGetRemainCountAtAllResponse
             * @property {boolean|null} [accessAtAll] GetRemainCountAtAllResponse accessAtAll
             * @property {number|null} [remainCountForGroup] GetRemainCountAtAllResponse remainCountForGroup
             * @property {number|null} [remainCountForSelf] GetRemainCountAtAllResponse remainCountForSelf
             */

            /**
             * Constructs a new GetRemainCountAtAllResponse.
             * @memberof kritor.group
             * @classdesc Represents a GetRemainCountAtAllResponse.
             * @implements IGetRemainCountAtAllResponse
             * @constructor
             * @param {kritor.group.IGetRemainCountAtAllResponse=} [properties] Properties to set
             */
            function GetRemainCountAtAllResponse(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetRemainCountAtAllResponse accessAtAll.
             * @member {boolean} accessAtAll
             * @memberof kritor.group.GetRemainCountAtAllResponse
             * @instance
             */
            GetRemainCountAtAllResponse.prototype.accessAtAll = false;

            /**
             * GetRemainCountAtAllResponse remainCountForGroup.
             * @member {number} remainCountForGroup
             * @memberof kritor.group.GetRemainCountAtAllResponse
             * @instance
             */
            GetRemainCountAtAllResponse.prototype.remainCountForGroup = 0;

            /**
             * GetRemainCountAtAllResponse remainCountForSelf.
             * @member {number} remainCountForSelf
             * @memberof kritor.group.GetRemainCountAtAllResponse
             * @instance
             */
            GetRemainCountAtAllResponse.prototype.remainCountForSelf = 0;

            /**
             * Creates a new GetRemainCountAtAllResponse instance using the specified properties.
             * @function create
             * @memberof kritor.group.GetRemainCountAtAllResponse
             * @static
             * @param {kritor.group.IGetRemainCountAtAllResponse=} [properties] Properties to set
             * @returns {kritor.group.GetRemainCountAtAllResponse} GetRemainCountAtAllResponse instance
             */
            GetRemainCountAtAllResponse.create = function create(properties) {
                return new GetRemainCountAtAllResponse(properties);
            };

            /**
             * Encodes the specified GetRemainCountAtAllResponse message. Does not implicitly {@link kritor.group.GetRemainCountAtAllResponse.verify|verify} messages.
             * @function encode
             * @memberof kritor.group.GetRemainCountAtAllResponse
             * @static
             * @param {kritor.group.IGetRemainCountAtAllResponse} message GetRemainCountAtAllResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetRemainCountAtAllResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.accessAtAll != null && Object.hasOwnProperty.call(message, "accessAtAll"))
                    writer.uint32(/* id 1, wireType 0 =*/8).bool(message.accessAtAll);
                if (message.remainCountForGroup != null && Object.hasOwnProperty.call(message, "remainCountForGroup"))
                    writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.remainCountForGroup);
                if (message.remainCountForSelf != null && Object.hasOwnProperty.call(message, "remainCountForSelf"))
                    writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.remainCountForSelf);
                return writer;
            };

            /**
             * Encodes the specified GetRemainCountAtAllResponse message, length delimited. Does not implicitly {@link kritor.group.GetRemainCountAtAllResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.group.GetRemainCountAtAllResponse
             * @static
             * @param {kritor.group.IGetRemainCountAtAllResponse} message GetRemainCountAtAllResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetRemainCountAtAllResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetRemainCountAtAllResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.group.GetRemainCountAtAllResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.group.GetRemainCountAtAllResponse} GetRemainCountAtAllResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetRemainCountAtAllResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.group.GetRemainCountAtAllResponse();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.accessAtAll = reader.bool();
                            break;
                        }
                    case 2: {
                            message.remainCountForGroup = reader.uint32();
                            break;
                        }
                    case 3: {
                            message.remainCountForSelf = reader.uint32();
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
             * Decodes a GetRemainCountAtAllResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.group.GetRemainCountAtAllResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.group.GetRemainCountAtAllResponse} GetRemainCountAtAllResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetRemainCountAtAllResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetRemainCountAtAllResponse message.
             * @function verify
             * @memberof kritor.group.GetRemainCountAtAllResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetRemainCountAtAllResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.accessAtAll != null && message.hasOwnProperty("accessAtAll"))
                    if (typeof message.accessAtAll !== "boolean")
                        return "accessAtAll: boolean expected";
                if (message.remainCountForGroup != null && message.hasOwnProperty("remainCountForGroup"))
                    if (!$util.isInteger(message.remainCountForGroup))
                        return "remainCountForGroup: integer expected";
                if (message.remainCountForSelf != null && message.hasOwnProperty("remainCountForSelf"))
                    if (!$util.isInteger(message.remainCountForSelf))
                        return "remainCountForSelf: integer expected";
                return null;
            };

            /**
             * Creates a GetRemainCountAtAllResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.group.GetRemainCountAtAllResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.group.GetRemainCountAtAllResponse} GetRemainCountAtAllResponse
             */
            GetRemainCountAtAllResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.group.GetRemainCountAtAllResponse)
                    return object;
                let message = new $root.kritor.group.GetRemainCountAtAllResponse();
                if (object.accessAtAll != null)
                    message.accessAtAll = Boolean(object.accessAtAll);
                if (object.remainCountForGroup != null)
                    message.remainCountForGroup = object.remainCountForGroup >>> 0;
                if (object.remainCountForSelf != null)
                    message.remainCountForSelf = object.remainCountForSelf >>> 0;
                return message;
            };

            /**
             * Creates a plain object from a GetRemainCountAtAllResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.group.GetRemainCountAtAllResponse
             * @static
             * @param {kritor.group.GetRemainCountAtAllResponse} message GetRemainCountAtAllResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetRemainCountAtAllResponse.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.accessAtAll = false;
                    object.remainCountForGroup = 0;
                    object.remainCountForSelf = 0;
                }
                if (message.accessAtAll != null && message.hasOwnProperty("accessAtAll"))
                    object.accessAtAll = message.accessAtAll;
                if (message.remainCountForGroup != null && message.hasOwnProperty("remainCountForGroup"))
                    object.remainCountForGroup = message.remainCountForGroup;
                if (message.remainCountForSelf != null && message.hasOwnProperty("remainCountForSelf"))
                    object.remainCountForSelf = message.remainCountForSelf;
                return object;
            };

            /**
             * Converts this GetRemainCountAtAllResponse to JSON.
             * @function toJSON
             * @memberof kritor.group.GetRemainCountAtAllResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetRemainCountAtAllResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GetRemainCountAtAllResponse
             * @function getTypeUrl
             * @memberof kritor.group.GetRemainCountAtAllResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetRemainCountAtAllResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.group.GetRemainCountAtAllResponse";
            };

            return GetRemainCountAtAllResponse;
        })();

        group.GetNotJoinedGroupInfoRequest = (function() {

            /**
             * Properties of a GetNotJoinedGroupInfoRequest.
             * @memberof kritor.group
             * @interface IGetNotJoinedGroupInfoRequest
             * @property {number|Long|null} [groupId] GetNotJoinedGroupInfoRequest groupId
             */

            /**
             * Constructs a new GetNotJoinedGroupInfoRequest.
             * @memberof kritor.group
             * @classdesc Represents a GetNotJoinedGroupInfoRequest.
             * @implements IGetNotJoinedGroupInfoRequest
             * @constructor
             * @param {kritor.group.IGetNotJoinedGroupInfoRequest=} [properties] Properties to set
             */
            function GetNotJoinedGroupInfoRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetNotJoinedGroupInfoRequest groupId.
             * @member {number|Long} groupId
             * @memberof kritor.group.GetNotJoinedGroupInfoRequest
             * @instance
             */
            GetNotJoinedGroupInfoRequest.prototype.groupId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * Creates a new GetNotJoinedGroupInfoRequest instance using the specified properties.
             * @function create
             * @memberof kritor.group.GetNotJoinedGroupInfoRequest
             * @static
             * @param {kritor.group.IGetNotJoinedGroupInfoRequest=} [properties] Properties to set
             * @returns {kritor.group.GetNotJoinedGroupInfoRequest} GetNotJoinedGroupInfoRequest instance
             */
            GetNotJoinedGroupInfoRequest.create = function create(properties) {
                return new GetNotJoinedGroupInfoRequest(properties);
            };

            /**
             * Encodes the specified GetNotJoinedGroupInfoRequest message. Does not implicitly {@link kritor.group.GetNotJoinedGroupInfoRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.group.GetNotJoinedGroupInfoRequest
             * @static
             * @param {kritor.group.IGetNotJoinedGroupInfoRequest} message GetNotJoinedGroupInfoRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetNotJoinedGroupInfoRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.groupId != null && Object.hasOwnProperty.call(message, "groupId"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.groupId);
                return writer;
            };

            /**
             * Encodes the specified GetNotJoinedGroupInfoRequest message, length delimited. Does not implicitly {@link kritor.group.GetNotJoinedGroupInfoRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.group.GetNotJoinedGroupInfoRequest
             * @static
             * @param {kritor.group.IGetNotJoinedGroupInfoRequest} message GetNotJoinedGroupInfoRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetNotJoinedGroupInfoRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetNotJoinedGroupInfoRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.group.GetNotJoinedGroupInfoRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.group.GetNotJoinedGroupInfoRequest} GetNotJoinedGroupInfoRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetNotJoinedGroupInfoRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.group.GetNotJoinedGroupInfoRequest();
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
             * Decodes a GetNotJoinedGroupInfoRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.group.GetNotJoinedGroupInfoRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.group.GetNotJoinedGroupInfoRequest} GetNotJoinedGroupInfoRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetNotJoinedGroupInfoRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetNotJoinedGroupInfoRequest message.
             * @function verify
             * @memberof kritor.group.GetNotJoinedGroupInfoRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetNotJoinedGroupInfoRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.groupId != null && message.hasOwnProperty("groupId"))
                    if (!$util.isInteger(message.groupId) && !(message.groupId && $util.isInteger(message.groupId.low) && $util.isInteger(message.groupId.high)))
                        return "groupId: integer|Long expected";
                return null;
            };

            /**
             * Creates a GetNotJoinedGroupInfoRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.group.GetNotJoinedGroupInfoRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.group.GetNotJoinedGroupInfoRequest} GetNotJoinedGroupInfoRequest
             */
            GetNotJoinedGroupInfoRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.group.GetNotJoinedGroupInfoRequest)
                    return object;
                let message = new $root.kritor.group.GetNotJoinedGroupInfoRequest();
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
             * Creates a plain object from a GetNotJoinedGroupInfoRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.group.GetNotJoinedGroupInfoRequest
             * @static
             * @param {kritor.group.GetNotJoinedGroupInfoRequest} message GetNotJoinedGroupInfoRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetNotJoinedGroupInfoRequest.toObject = function toObject(message, options) {
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
             * Converts this GetNotJoinedGroupInfoRequest to JSON.
             * @function toJSON
             * @memberof kritor.group.GetNotJoinedGroupInfoRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetNotJoinedGroupInfoRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GetNotJoinedGroupInfoRequest
             * @function getTypeUrl
             * @memberof kritor.group.GetNotJoinedGroupInfoRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetNotJoinedGroupInfoRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.group.GetNotJoinedGroupInfoRequest";
            };

            return GetNotJoinedGroupInfoRequest;
        })();

        group.GetNotJoinedGroupInfoResponse = (function() {

            /**
             * Properties of a GetNotJoinedGroupInfoResponse.
             * @memberof kritor.group
             * @interface IGetNotJoinedGroupInfoResponse
             * @property {kritor.group.INotJoinedGroupInfo|null} [groupInfo] GetNotJoinedGroupInfoResponse groupInfo
             */

            /**
             * Constructs a new GetNotJoinedGroupInfoResponse.
             * @memberof kritor.group
             * @classdesc Represents a GetNotJoinedGroupInfoResponse.
             * @implements IGetNotJoinedGroupInfoResponse
             * @constructor
             * @param {kritor.group.IGetNotJoinedGroupInfoResponse=} [properties] Properties to set
             */
            function GetNotJoinedGroupInfoResponse(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetNotJoinedGroupInfoResponse groupInfo.
             * @member {kritor.group.INotJoinedGroupInfo|null|undefined} groupInfo
             * @memberof kritor.group.GetNotJoinedGroupInfoResponse
             * @instance
             */
            GetNotJoinedGroupInfoResponse.prototype.groupInfo = null;

            /**
             * Creates a new GetNotJoinedGroupInfoResponse instance using the specified properties.
             * @function create
             * @memberof kritor.group.GetNotJoinedGroupInfoResponse
             * @static
             * @param {kritor.group.IGetNotJoinedGroupInfoResponse=} [properties] Properties to set
             * @returns {kritor.group.GetNotJoinedGroupInfoResponse} GetNotJoinedGroupInfoResponse instance
             */
            GetNotJoinedGroupInfoResponse.create = function create(properties) {
                return new GetNotJoinedGroupInfoResponse(properties);
            };

            /**
             * Encodes the specified GetNotJoinedGroupInfoResponse message. Does not implicitly {@link kritor.group.GetNotJoinedGroupInfoResponse.verify|verify} messages.
             * @function encode
             * @memberof kritor.group.GetNotJoinedGroupInfoResponse
             * @static
             * @param {kritor.group.IGetNotJoinedGroupInfoResponse} message GetNotJoinedGroupInfoResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetNotJoinedGroupInfoResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.groupInfo != null && Object.hasOwnProperty.call(message, "groupInfo"))
                    $root.kritor.group.NotJoinedGroupInfo.encode(message.groupInfo, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified GetNotJoinedGroupInfoResponse message, length delimited. Does not implicitly {@link kritor.group.GetNotJoinedGroupInfoResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.group.GetNotJoinedGroupInfoResponse
             * @static
             * @param {kritor.group.IGetNotJoinedGroupInfoResponse} message GetNotJoinedGroupInfoResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetNotJoinedGroupInfoResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetNotJoinedGroupInfoResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.group.GetNotJoinedGroupInfoResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.group.GetNotJoinedGroupInfoResponse} GetNotJoinedGroupInfoResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetNotJoinedGroupInfoResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.group.GetNotJoinedGroupInfoResponse();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.groupInfo = $root.kritor.group.NotJoinedGroupInfo.decode(reader, reader.uint32());
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
             * Decodes a GetNotJoinedGroupInfoResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.group.GetNotJoinedGroupInfoResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.group.GetNotJoinedGroupInfoResponse} GetNotJoinedGroupInfoResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetNotJoinedGroupInfoResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetNotJoinedGroupInfoResponse message.
             * @function verify
             * @memberof kritor.group.GetNotJoinedGroupInfoResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetNotJoinedGroupInfoResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.groupInfo != null && message.hasOwnProperty("groupInfo")) {
                    let error = $root.kritor.group.NotJoinedGroupInfo.verify(message.groupInfo);
                    if (error)
                        return "groupInfo." + error;
                }
                return null;
            };

            /**
             * Creates a GetNotJoinedGroupInfoResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.group.GetNotJoinedGroupInfoResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.group.GetNotJoinedGroupInfoResponse} GetNotJoinedGroupInfoResponse
             */
            GetNotJoinedGroupInfoResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.group.GetNotJoinedGroupInfoResponse)
                    return object;
                let message = new $root.kritor.group.GetNotJoinedGroupInfoResponse();
                if (object.groupInfo != null) {
                    if (typeof object.groupInfo !== "object")
                        throw TypeError(".kritor.group.GetNotJoinedGroupInfoResponse.groupInfo: object expected");
                    message.groupInfo = $root.kritor.group.NotJoinedGroupInfo.fromObject(object.groupInfo);
                }
                return message;
            };

            /**
             * Creates a plain object from a GetNotJoinedGroupInfoResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.group.GetNotJoinedGroupInfoResponse
             * @static
             * @param {kritor.group.GetNotJoinedGroupInfoResponse} message GetNotJoinedGroupInfoResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetNotJoinedGroupInfoResponse.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults)
                    object.groupInfo = null;
                if (message.groupInfo != null && message.hasOwnProperty("groupInfo"))
                    object.groupInfo = $root.kritor.group.NotJoinedGroupInfo.toObject(message.groupInfo, options);
                return object;
            };

            /**
             * Converts this GetNotJoinedGroupInfoResponse to JSON.
             * @function toJSON
             * @memberof kritor.group.GetNotJoinedGroupInfoResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetNotJoinedGroupInfoResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GetNotJoinedGroupInfoResponse
             * @function getTypeUrl
             * @memberof kritor.group.GetNotJoinedGroupInfoResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetNotJoinedGroupInfoResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.group.GetNotJoinedGroupInfoResponse";
            };

            return GetNotJoinedGroupInfoResponse;
        })();

        group.GetGroupHonorRequest = (function() {

            /**
             * Properties of a GetGroupHonorRequest.
             * @memberof kritor.group
             * @interface IGetGroupHonorRequest
             * @property {number|Long|null} [groupId] GetGroupHonorRequest groupId
             * @property {boolean|null} [refresh] GetGroupHonorRequest refresh
             */

            /**
             * Constructs a new GetGroupHonorRequest.
             * @memberof kritor.group
             * @classdesc Represents a GetGroupHonorRequest.
             * @implements IGetGroupHonorRequest
             * @constructor
             * @param {kritor.group.IGetGroupHonorRequest=} [properties] Properties to set
             */
            function GetGroupHonorRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetGroupHonorRequest groupId.
             * @member {number|Long} groupId
             * @memberof kritor.group.GetGroupHonorRequest
             * @instance
             */
            GetGroupHonorRequest.prototype.groupId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * GetGroupHonorRequest refresh.
             * @member {boolean|null|undefined} refresh
             * @memberof kritor.group.GetGroupHonorRequest
             * @instance
             */
            GetGroupHonorRequest.prototype.refresh = null;

            // OneOf field names bound to virtual getters and setters
            let $oneOfFields;

            /**
             * GetGroupHonorRequest _refresh.
             * @member {"refresh"|undefined} _refresh
             * @memberof kritor.group.GetGroupHonorRequest
             * @instance
             */
            Object.defineProperty(GetGroupHonorRequest.prototype, "_refresh", {
                get: $util.oneOfGetter($oneOfFields = ["refresh"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new GetGroupHonorRequest instance using the specified properties.
             * @function create
             * @memberof kritor.group.GetGroupHonorRequest
             * @static
             * @param {kritor.group.IGetGroupHonorRequest=} [properties] Properties to set
             * @returns {kritor.group.GetGroupHonorRequest} GetGroupHonorRequest instance
             */
            GetGroupHonorRequest.create = function create(properties) {
                return new GetGroupHonorRequest(properties);
            };

            /**
             * Encodes the specified GetGroupHonorRequest message. Does not implicitly {@link kritor.group.GetGroupHonorRequest.verify|verify} messages.
             * @function encode
             * @memberof kritor.group.GetGroupHonorRequest
             * @static
             * @param {kritor.group.IGetGroupHonorRequest} message GetGroupHonorRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetGroupHonorRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.groupId != null && Object.hasOwnProperty.call(message, "groupId"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.groupId);
                if (message.refresh != null && Object.hasOwnProperty.call(message, "refresh"))
                    writer.uint32(/* id 2, wireType 0 =*/16).bool(message.refresh);
                return writer;
            };

            /**
             * Encodes the specified GetGroupHonorRequest message, length delimited. Does not implicitly {@link kritor.group.GetGroupHonorRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.group.GetGroupHonorRequest
             * @static
             * @param {kritor.group.IGetGroupHonorRequest} message GetGroupHonorRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetGroupHonorRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetGroupHonorRequest message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.group.GetGroupHonorRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.group.GetGroupHonorRequest} GetGroupHonorRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetGroupHonorRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.group.GetGroupHonorRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.groupId = reader.uint64();
                            break;
                        }
                    case 2: {
                            message.refresh = reader.bool();
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
             * Decodes a GetGroupHonorRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.group.GetGroupHonorRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.group.GetGroupHonorRequest} GetGroupHonorRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetGroupHonorRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetGroupHonorRequest message.
             * @function verify
             * @memberof kritor.group.GetGroupHonorRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetGroupHonorRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                let properties = {};
                if (message.groupId != null && message.hasOwnProperty("groupId"))
                    if (!$util.isInteger(message.groupId) && !(message.groupId && $util.isInteger(message.groupId.low) && $util.isInteger(message.groupId.high)))
                        return "groupId: integer|Long expected";
                if (message.refresh != null && message.hasOwnProperty("refresh")) {
                    properties._refresh = 1;
                    if (typeof message.refresh !== "boolean")
                        return "refresh: boolean expected";
                }
                return null;
            };

            /**
             * Creates a GetGroupHonorRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.group.GetGroupHonorRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.group.GetGroupHonorRequest} GetGroupHonorRequest
             */
            GetGroupHonorRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.group.GetGroupHonorRequest)
                    return object;
                let message = new $root.kritor.group.GetGroupHonorRequest();
                if (object.groupId != null)
                    if ($util.Long)
                        (message.groupId = $util.Long.fromValue(object.groupId)).unsigned = true;
                    else if (typeof object.groupId === "string")
                        message.groupId = parseInt(object.groupId, 10);
                    else if (typeof object.groupId === "number")
                        message.groupId = object.groupId;
                    else if (typeof object.groupId === "object")
                        message.groupId = new $util.LongBits(object.groupId.low >>> 0, object.groupId.high >>> 0).toNumber(true);
                if (object.refresh != null)
                    message.refresh = Boolean(object.refresh);
                return message;
            };

            /**
             * Creates a plain object from a GetGroupHonorRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.group.GetGroupHonorRequest
             * @static
             * @param {kritor.group.GetGroupHonorRequest} message GetGroupHonorRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetGroupHonorRequest.toObject = function toObject(message, options) {
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
                if (message.refresh != null && message.hasOwnProperty("refresh")) {
                    object.refresh = message.refresh;
                    if (options.oneofs)
                        object._refresh = "refresh";
                }
                return object;
            };

            /**
             * Converts this GetGroupHonorRequest to JSON.
             * @function toJSON
             * @memberof kritor.group.GetGroupHonorRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetGroupHonorRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GetGroupHonorRequest
             * @function getTypeUrl
             * @memberof kritor.group.GetGroupHonorRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetGroupHonorRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.group.GetGroupHonorRequest";
            };

            return GetGroupHonorRequest;
        })();

        group.GetGroupHonorResponse = (function() {

            /**
             * Properties of a GetGroupHonorResponse.
             * @memberof kritor.group
             * @interface IGetGroupHonorResponse
             * @property {Array.<kritor.group.IGroupHonorInfo>|null} [groupHonorsInfo] GetGroupHonorResponse groupHonorsInfo
             */

            /**
             * Constructs a new GetGroupHonorResponse.
             * @memberof kritor.group
             * @classdesc Represents a GetGroupHonorResponse.
             * @implements IGetGroupHonorResponse
             * @constructor
             * @param {kritor.group.IGetGroupHonorResponse=} [properties] Properties to set
             */
            function GetGroupHonorResponse(properties) {
                this.groupHonorsInfo = [];
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetGroupHonorResponse groupHonorsInfo.
             * @member {Array.<kritor.group.IGroupHonorInfo>} groupHonorsInfo
             * @memberof kritor.group.GetGroupHonorResponse
             * @instance
             */
            GetGroupHonorResponse.prototype.groupHonorsInfo = $util.emptyArray;

            /**
             * Creates a new GetGroupHonorResponse instance using the specified properties.
             * @function create
             * @memberof kritor.group.GetGroupHonorResponse
             * @static
             * @param {kritor.group.IGetGroupHonorResponse=} [properties] Properties to set
             * @returns {kritor.group.GetGroupHonorResponse} GetGroupHonorResponse instance
             */
            GetGroupHonorResponse.create = function create(properties) {
                return new GetGroupHonorResponse(properties);
            };

            /**
             * Encodes the specified GetGroupHonorResponse message. Does not implicitly {@link kritor.group.GetGroupHonorResponse.verify|verify} messages.
             * @function encode
             * @memberof kritor.group.GetGroupHonorResponse
             * @static
             * @param {kritor.group.IGetGroupHonorResponse} message GetGroupHonorResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetGroupHonorResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.groupHonorsInfo != null && message.groupHonorsInfo.length)
                    for (let i = 0; i < message.groupHonorsInfo.length; ++i)
                        $root.kritor.group.GroupHonorInfo.encode(message.groupHonorsInfo[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified GetGroupHonorResponse message, length delimited. Does not implicitly {@link kritor.group.GetGroupHonorResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof kritor.group.GetGroupHonorResponse
             * @static
             * @param {kritor.group.IGetGroupHonorResponse} message GetGroupHonorResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetGroupHonorResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetGroupHonorResponse message from the specified reader or buffer.
             * @function decode
             * @memberof kritor.group.GetGroupHonorResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {kritor.group.GetGroupHonorResponse} GetGroupHonorResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetGroupHonorResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.kritor.group.GetGroupHonorResponse();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            if (!(message.groupHonorsInfo && message.groupHonorsInfo.length))
                                message.groupHonorsInfo = [];
                            message.groupHonorsInfo.push($root.kritor.group.GroupHonorInfo.decode(reader, reader.uint32()));
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
             * Decodes a GetGroupHonorResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof kritor.group.GetGroupHonorResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {kritor.group.GetGroupHonorResponse} GetGroupHonorResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetGroupHonorResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetGroupHonorResponse message.
             * @function verify
             * @memberof kritor.group.GetGroupHonorResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetGroupHonorResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.groupHonorsInfo != null && message.hasOwnProperty("groupHonorsInfo")) {
                    if (!Array.isArray(message.groupHonorsInfo))
                        return "groupHonorsInfo: array expected";
                    for (let i = 0; i < message.groupHonorsInfo.length; ++i) {
                        let error = $root.kritor.group.GroupHonorInfo.verify(message.groupHonorsInfo[i]);
                        if (error)
                            return "groupHonorsInfo." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a GetGroupHonorResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof kritor.group.GetGroupHonorResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {kritor.group.GetGroupHonorResponse} GetGroupHonorResponse
             */
            GetGroupHonorResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.kritor.group.GetGroupHonorResponse)
                    return object;
                let message = new $root.kritor.group.GetGroupHonorResponse();
                if (object.groupHonorsInfo) {
                    if (!Array.isArray(object.groupHonorsInfo))
                        throw TypeError(".kritor.group.GetGroupHonorResponse.groupHonorsInfo: array expected");
                    message.groupHonorsInfo = [];
                    for (let i = 0; i < object.groupHonorsInfo.length; ++i) {
                        if (typeof object.groupHonorsInfo[i] !== "object")
                            throw TypeError(".kritor.group.GetGroupHonorResponse.groupHonorsInfo: object expected");
                        message.groupHonorsInfo[i] = $root.kritor.group.GroupHonorInfo.fromObject(object.groupHonorsInfo[i]);
                    }
                }
                return message;
            };

            /**
             * Creates a plain object from a GetGroupHonorResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof kritor.group.GetGroupHonorResponse
             * @static
             * @param {kritor.group.GetGroupHonorResponse} message GetGroupHonorResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetGroupHonorResponse.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.arrays || options.defaults)
                    object.groupHonorsInfo = [];
                if (message.groupHonorsInfo && message.groupHonorsInfo.length) {
                    object.groupHonorsInfo = [];
                    for (let j = 0; j < message.groupHonorsInfo.length; ++j)
                        object.groupHonorsInfo[j] = $root.kritor.group.GroupHonorInfo.toObject(message.groupHonorsInfo[j], options);
                }
                return object;
            };

            /**
             * Converts this GetGroupHonorResponse to JSON.
             * @function toJSON
             * @memberof kritor.group.GetGroupHonorResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetGroupHonorResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GetGroupHonorResponse
             * @function getTypeUrl
             * @memberof kritor.group.GetGroupHonorResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetGroupHonorResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/kritor.group.GetGroupHonorResponse";
            };

            return GetGroupHonorResponse;
        })();

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
