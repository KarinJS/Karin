/**
 * Simple HTML sanitizer using DOMParser
 * Removes potentially dangerous tags like script, iframe, object, embed, form
 */
export const sanitizeHtml = (html: string): string => {
  if (!html) return ''
  
  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    
    // Remove dangerous tags
    const dangerousTags = ['script', 'iframe', 'object', 'embed', 'form', 'style', 'link', 'meta']
    dangerousTags.forEach(tag => {
      const elements = doc.querySelectorAll(tag)
      elements.forEach(el => el.remove())
    })
    
    // Remove event handlers (on*)
    const allElements = doc.querySelectorAll('*')
    allElements.forEach(el => {
      Array.from(el.attributes).forEach(attr => {
        if (attr.name.startsWith('on') || attr.name.startsWith('javascript:')) {
          el.removeAttribute(attr.name)
        }
      })
      if (el.getAttribute('href')?.startsWith('javascript:')) {
        el.removeAttribute('href')
      }
    })

    return doc.body.innerHTML
  } catch (e) {
    console.error('Failed to sanitize HTML', e)
    return '' // Fallback to empty string on error
  }
}
