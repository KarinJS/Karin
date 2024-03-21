class Segment {
  static text (text) {
    return {
      type: 'text',
      data: {
        text
      }
    }
  }

  static image (file) {
    return {
      type: 'image',
      data: {
        file
      }
    }
  }

  // face
  static face (id) {
    return {
      type: 'face',
      data: {
        id
      }
    }
  }

  // record
  static record (file) {
    return {
      type: 'record',
      data: {
        file
      }
    }
  }

  // video
  static video (file) {
    return {
      type: 'video',
      data: {
        file
      }
    }
  }

  // at
  static at (qq) {
    return {
      type: 'at',
      data: {
        qq
      }
    }
  }

  // reply
  static reply (id) {
    return {
      type: 'reply',
      data: {
        id
      }
    }
  }

  // forward
  static forward (id) {
    return {
      type: 'forward',
      data: {
        id
      }
    }
  }

  // node
  static node (data) {
    return {
      type: 'node',
      data
    }
  }
}

export default new Segment()
