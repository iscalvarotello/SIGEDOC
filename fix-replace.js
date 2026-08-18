const fs = require('fs');
const filePath = 'C:/08-SISTEMAS/SIGEDOC/FULL-STACK/03-FRONTEND/src/app/workspace/operatividad/documentos/components/document-editor-panel/document-editor-panel.component.ts';
let content = fs.readFileSync(filePath, 'utf8');

const replacement = `
  replaceTagsInBody() {
    let content = this.internalCuerpo();
    if (!content) return;
    const dict = this.localDictionary();
    
    // Parse the HTML content to safely manipulate DOM nodes
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    
    let hasChanges = false;
    
    for (const [key, value] of Object.entries(dict)) {
      if (value !== '') {
        const fullTag = '{{' + key + '}}';
        const cleanTag = key.replace(/[{}]/g, '');
        
        // 1. Update existing span markers first
        const existingSpans = doc.querySelectorAll(\`[data-var="\${fullTag}"]\`);
        if (existingSpans.length > 0) {
          existingSpans.forEach(span => {
            if (span.innerHTML !== value) {
              span.innerHTML = value;
              hasChanges = true;
            }
          });
        }
        
        // 2. Replace raw tags in text nodes that haven't been wrapped yet
        // We only want to replace inside text nodes, not inside HTML attributes
        const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT, null);
        let node;
        const nodesToReplace = [];
        
        while (node = walker.nextNode()) {
          if (node.nodeValue && node.nodeValue.includes(fullTag)) {
            nodesToReplace.push(node);
          }
        }
        
        nodesToReplace.forEach(textNode => {
          const parts = textNode.nodeValue.split(fullTag);
          if (parts.length > 1) {
            const fragment = doc.createDocumentFragment();
            parts.forEach((part, index) => {
              fragment.appendChild(doc.createTextNode(part));
              if (index < parts.length - 1) {
                const span = doc.createElement('span');
                span.id = \`sigedoc-var-\${cleanTag}\`;
                span.setAttribute('data-var', fullTag);
                span.className = 'sigedoc-var sigedoc-dynamic-binding';
                span.innerHTML = value;
                // Add a visual styling for the editor
                span.style.backgroundColor = '#fff3cd'; // Light yellow highlight
                span.style.borderBottom = '1px dashed #ffc107';
                fragment.appendChild(span);
              }
            });
            if (textNode.parentNode) {
              textNode.parentNode.replaceChild(fragment, textNode);
              hasChanges = true;
            }
          }
        });
      }
    }
    
    if (hasChanges) {
      this.internalCuerpo.set(doc.body.innerHTML);
    }
  }
`;

// Extract everything from replaceTagsInBody() to the end of the class.
const regex = /replaceTagsInBody\(\) \{[\s\S]*\}\s*\n\}\s*$/;
if (regex.test(content)) {
  content = content.replace(regex, replacement.trim() + '\n}\n');
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Fixed replaceTagsInBody via node script.');
} else {
  console.log('Could not find replaceTagsInBody to replace.');
}
