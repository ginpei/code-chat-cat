export default {
  get elCopy () {
    if (!this.__elCopy) {
      const el = document.createElement('input');
      const s = el.style;
      s.position = 'absolute';
      s.left = '-100vw';
      s.top = '-100vh';
      s.width = '1vw';
      s.height = '1vw';
      document.body.appendChild(el);
      this.__elCopy = el;
    }
    return this.__elCopy;
  },

  copy (text) {
    const el = this.elCopy;
    el.value = text;
    el.select();
    document.execCommand('copy');
  },

  /**
   *
   * @param {{ name: string, type: string, url: string }} file
   */
  copyFileLink (file) {
    const isImage = file.type.startsWith('image/');
    const text = `${isImage ? '!' : ''}[${file.name}](${file.url})`;
    this.copy(text);
  },
};
