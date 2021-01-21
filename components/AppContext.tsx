import { createContext } from 'react';
import DocumentGen from 'client/document';

type ContextProps = {
  docs: DocumentGen;
  classes: Record<string, string>;
};

const AppContext = createContext<ContextProps>({
  docs: new DocumentGen(),
  classes: {} as Record<string, string>,
});

export default AppContext;
