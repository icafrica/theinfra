// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';

function remarkGfmAlerts() {
  return (tree) => {
    function visit(node) {
      if (node.type === 'blockquote') {
        const firstChild = node.children?.[0];
        if (firstChild && firstChild.type === 'paragraph') {
          const firstTextNode = firstChild.children?.[0];
          if (firstTextNode && firstTextNode.type === 'text') {
            const match = firstTextNode.value.match(/^\[!(IMPORTANT|WARNING|NOTE|TIP|CAUTION)\]\s*(?:\r?\n)?/);
            if (match) {
              const type = match[1];
              // Remove the match prefix from the first text node
              firstTextNode.value = firstTextNode.value.replace(/^\[!(IMPORTANT|WARNING|NOTE|TIP|CAUTION)\]\s*(?:\r?\n)?/, '');

              // Set custom classes on the blockquote element
              node.data = node.data || {};
              node.data.hProperties = node.data.hProperties || {};
              node.data.hProperties.className = ['alert-callout', `alert-${type.toLowerCase()}`];

              // Prepend the title paragraph node
              node.children.unshift({
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    value: type
                  }
                ],
                data: {
                  hProperties: {
                    className: 'alert-title'
                  }
                }
              });
            }
          }
        }
      }
      if (node.children) {
        node.children.forEach(visit);
      }
    }
    visit(tree);
  };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://icafrica.github.io',
  base: '/theinfra',
  markdown: {
    processor: unified({
      remarkPlugins: [remarkGfmAlerts]
    })
  }
});
