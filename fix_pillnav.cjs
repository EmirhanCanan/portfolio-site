const fs = require('fs');
let content = fs.readFileSync('/tmp/react-bits/src/content/Components/PillNav/PillNav.jsx', 'utf8');
content = content.replace(/import \{ Link \} from 'react-router-dom';/g, '');
content = content.replace(/<Link/g, '<a');
content = content.replace(/<\/Link>/g, '</a>');
content = content.replace(/to=\{/g, 'href=\{');
fs.writeFileSync('src/components/react-bits/PillNav.tsx', "// @ts-nocheck\n" + content);
