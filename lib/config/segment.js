class Segment {
  text (text) {
    return {
      type: 'text',
      data: {
        text
      }
    }
  }

  image (file) {
    return {
      type: 'image',
      data: {
        file
      }
    }
  }

  // face
  face (id) {
    return {
      type: 'face',
      data: {
        id
      }
    }
  }

  // record
  record (file) {
    return {
      type: 'record',
      data: {
        file
      }
    }
  }

  // video
  video (file) {
    return {
      type: 'video',
      data: {
        file
      }
    }
  }

  // at
  at (qq) {
    return {
      type: 'at',
      data: {
        qq
      }
    }
  }

  // reply
  reply (id) {
    return {
      type: 'reply',
      data: {
        id
      }
    }
  }

  // forward
  forward (id) {
    return {
      type: 'forward',
      data: {
        id
      }
    }
  }

  // node
  node (data) {
    return {
      type: 'node',
      data
    }
  }
}

export default new Segment()
