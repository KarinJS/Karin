export enum OneBotFileApiAction {
  getGroupFileUrl = 'get_group_file_url',
  getPrivateFileUrl = 'get_private_file_url',
  lgl_getPrivateFileUrl = 'lgl_get_private_file_url',
  uploadGroupFile = 'upload_group_file',
  uploadPrivateFile = 'upload_private_file',
  getGroupFileSystemInfo = 'get_group_file_system_info',
  getGroupRootFiles = 'get_group_root_files',
  getGroupFilesByFolder = 'get_group_files_by_folder',
  createGroupFileFolder = 'create_group_file_folder',
  deleteGroupFolder = 'delete_group_folder',
  deleteGroupFile = 'delete_group_file',
  nc_deleteGroupFile = 'nc_delete_group_file',
  lgl_uploadImage = 'lgl_upload_image',
  moveGroupFile = 'move_group_file',
  lgl_renameGroupFileFolder = 'lgl_rename_group_file_folder',
  nc_transGroupFile = 'nc_trans_group_file',
  nc_renameGroupFile = 'nc_rename_group_file',
  nc_getFile = 'nc_get_file',
}

/**
 * 文件相关 API
 */
export interface OneBotFileApi {
  /** GoQC扩展: 获取群文件资源链接 */
  [OneBotFileApiAction.getGroupFileUrl]: {
    action: 'get_group_file_url',
    params: {
      group_id: number,
      file_id: string,
      /** 废弃属性 */
      busid?: number
    },
    response: {
      url: string
    }
  }

  /** GoQC扩展: 获取私聊文件资源链接 */
  [OneBotFileApiAction.getPrivateFileUrl]: {
    action: 'get_private_file_url',
    params: {
      user_id: number,
      file_id: string,
      busid?: number
    },
    response: {
      url: string
    }
  }

  /** Lagrange扩展: 获取私聊文件资源链接 */
  [OneBotFileApiAction.lgl_getPrivateFileUrl]: {
    action: 'get_private_file_url',
    params: {
      user_id: number,
      file_id: string,
      file_hash?: string
    },
    response: {
      url: string
    }
  }

  /** GoQC扩展: 上传群文件 */
  [OneBotFileApiAction.uploadGroupFile]: {
    action: 'upload_group_file',
    params: {
      group_id: number,
      file: string,
      name: string,
      folder?: string
    },
    response: null
  }

  /** GoQC扩展: 上传私聊文件 */
  [OneBotFileApiAction.uploadPrivateFile]: {
    action: 'upload_private_file',
    params: {
      user_id: number,
      file: string,
      name: string
    },
    response: null
  }

  /** GoQC扩展: 获取群文件系统信息 */
  [OneBotFileApiAction.getGroupFileSystemInfo]: {
    action: 'get_group_file_system_info',
    params: {
      group_id: number
    },
    response: {
      file_count: number,
      limit_count: number,
      used_space: number,
      total_space: number
    }
  }

  /** GoQC扩展: 获取群根目录文件列表 */
  [OneBotFileApiAction.getGroupRootFiles]: {
    action: 'get_group_root_files',
    params: {
      group_id: number
    },
    response: {
      files: Array<{
        group_id: number,
        file_id: string,
        file_name: string,
        busid: number,
        file_size: number,
        upload_time: number,
        dead_time: number,
        modify_time: number,
        download_times: number,
        uploader: number,
        uploader_name: string
      }>,
      folders: Array<{
        group_id: number,
        folder_id: string,
        folder_name: string,
        create_time: number,
        creator: number,
        creator_name: string,
        total_file_count: number
      }>
    }
  }

  /** GoQC扩展: 获取群子目录文件列表 */
  [OneBotFileApiAction.getGroupFilesByFolder]: {
    action: 'get_group_files_by_folder',
    params: {
      group_id: number,
      folder_id: string
    },
    response: {
      files: Array<{
        group_id: number,
        file_id: string,
        file_name: string,
        busid: number,
        file_size: number,
        upload_time: number,
        dead_time: number,
        modify_time: number,
        download_times: number,
        uploader: number,
        uploader_name: string
      }>,
      folders: Array<{
        group_id: number,
        folder_id: string,
        folder_name: string,
        create_time: number,
        creator: number,
        creator_name: string,
        total_file_count: number
      }>
    }
  }

  /** GoQC扩展: 创建群文件文件夹 */
  [OneBotFileApiAction.createGroupFileFolder]: {
    action: 'create_group_file_folder',
    params: {
      group_id: number,
      name: string
    },
    response: null
  }

  /** GoQC扩展: 删除群文件文件夹 */
  [OneBotFileApiAction.deleteGroupFolder]: {
    action: 'delete_group_folder',
    params: {
      group_id: number,
      folder_id: string
    },
    response: null
  }

  /** GoQC扩展: 删除群文件 */
  [OneBotFileApiAction.deleteGroupFile]: {
    action: 'delete_group_file',
    params: {
      group_id: number,
      file_id: string,
      busid: number
    },
    response: null
  }

  /** NapCat/Lagrange扩展: 删除群文件 */
  [OneBotFileApiAction.nc_deleteGroupFile]: {
    action: 'delete_group_file',
    params: {
      group_id: number,
      file_id: string
    },
    response: null
  }

  /** Lagrange扩展: 上传图片 */
  [OneBotFileApiAction.lgl_uploadImage]: {
    action: 'upload_image',
    params: {
      file: string
    },
    response: {
      file: string,
      url: string
    }
  }

  /** 社区扩展: 移动群文件 */
  [OneBotFileApiAction.moveGroupFile]: {
    action: 'move_group_file',
    params: {
      group_id: number,
      file_id: string,
      folder_id: string
    },
    response: {
      success: boolean
    }
  }

  /** Lagrange扩展: 重命名群文件文件夹 */
  [OneBotFileApiAction.lgl_renameGroupFileFolder]: {
    action: 'rename_group_file_folder',
    params: {
      group_id: number,
      folder_id: string,
      new_name: string
    },
    response: {
      success: boolean
    }
  }

  /** NapCat扩展: 转发群文件 */
  [OneBotFileApiAction.nc_transGroupFile]: {
    action: 'trans_group_file',
    params: {
      group_id: number,
      file_id: string
    },
    response: {
      ok: boolean
    }
  }

  /** NapCat扩展: 重命名群文件 */
  [OneBotFileApiAction.nc_renameGroupFile]: {
    action: 'rename_group_file',
    params: {
      group_id: number,
      file_id: string,
      current_parent_directory: string,
      new_name: string
    },
    response: {
      ok: boolean
    }
  }

  /** NapCat扩展: 获取文件 */
  [OneBotFileApiAction.nc_getFile]: {
    action: 'get_file',
    params: {
      file: string
    },
    response: {
      file: string,
      url: string,
      file_size: string,
      file_name: string,
      base64: string
    }
  }
}
