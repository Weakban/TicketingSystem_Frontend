import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from "@/components/ui/provider";
import './index.css'
import { RouterProvider } from 'react-router-dom'


import {router} from './router.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
   <Provider> 
      <RouterProvider router={router} />
   </Provider>
  </StrictMode>,
)
