import Summary from './components/templates/summary';
import TestRunner from './components/templates/test-runner';
import CodeEditor from './components/templates/code-editor';
import Grid from './components/ui/grid';

import '@repo/shared/styles/default.css';
import '@repo/shared/styles/reset.css';

export default function App() {
  return (
    <Grid>
      <Summary />
      <CodeEditor />
      <TestRunner />
    </Grid>
  );
}
