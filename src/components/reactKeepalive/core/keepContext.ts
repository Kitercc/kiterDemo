import { createContext } from 'react';

const keepaliveContext = createContext<{ [key: string]: any }>({});

export default keepaliveContext;
